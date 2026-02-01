/**
 * MODULE RAPPORTS - API Création de nouvelle version d'un rapport
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import { parseFile, detectFileType } from '@/lib/file-parsers';
import { analyzeReport } from '@/lib/ai-report-analyzer';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const tenantId = request.headers.get('x-tenant-id');
    const userId = request.headers.get('x-user-id');

    if (!tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await context.params;
    const supabase = createSupabaseBrowserClient();

    // 1. Récupérer le rapport parent
    const { data: parentReport, error: fetchError } = await supabase
      .from('reports')
      .select('*')
      .eq('id', params.id)
      .eq('organization_id', tenantId)
      .single();

    if (fetchError || !parentReport) {
      return NextResponse.json({ error: 'Parent report not found' }, { status: 404 });
    }

    // 2. Récupérer le fichier depuis le form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // 3. Upload nouveau fichier
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-v${parentReport.version + 1}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${tenantId}/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('reports')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from('reports').getPublicUrl(filePath);

    // 4. Parser et analyser
    let parsedContent;
    let status: 'processing' | 'ready' | 'error' = 'processing';
    let errorMessage: string | undefined;

    try {
      parsedContent = await parseFile(file);
      status = 'ready';
    } catch (error) {
      console.error('File parsing error:', error);
      errorMessage = error instanceof Error ? error.message : 'Failed to parse file';
      status = 'error';
    }

    let analysisResult;
    if (status === 'ready' && parsedContent) {
      try {
        analysisResult = await analyzeReport(parsedContent, file.name);
      } catch (error) {
        console.error('AI analysis error:', error);
      }
    }

    // 5. Créer la nouvelle version
    const newReportData = {
      organization_id: tenantId,
      project_id: parentReport.project_id,
      file_name: file.name,
      file_type: detectFileType(file),
      file_size: file.size,
      file_url: urlData.publicUrl,
      processed_content: parsedContent || null,
      summary: analysisResult?.summary || null,
      insights: analysisResult?.insights || null,
      charts: analysisResult?.charts || null,
      sections: analysisResult?.sections || null,
      recommendations: analysisResult?.recommendations || null,
      risks: analysisResult?.risks || null,
      decisions: analysisResult?.decisions || null,
      metadata: parentReport.metadata,
      version: parentReport.version + 1,
      parent_report_id: params.id,
      status,
      error_message: errorMessage,
      created_by: userId,
    };

    const { data: newReport, error: dbError } = await supabase
      .from('reports')
      .insert(newReportData)
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      await supabase.storage.from('reports').remove([filePath]);
      return NextResponse.json({ error: 'Failed to create new version' }, { status: 500 });
    }

    return NextResponse.json({ report: newReport }, { status: 201 });
  } catch (error) {
    console.error('Version creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const tenantId = request.headers.get('x-tenant-id');

    if (!tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await context.params;
    const supabase = createSupabaseBrowserClient();

    // Récupérer toutes les versions (le rapport parent + ses enfants)
    const { data: versions, error } = await supabase
      .from('reports')
      .select('*')
      .eq('organization_id', tenantId)
      .or(`id.eq.${params.id},parent_report_id.eq.${params.id}`)
      .order('version', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to fetch versions' }, { status: 500 });
    }

    return NextResponse.json({ versions }, { status: 200 });
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
