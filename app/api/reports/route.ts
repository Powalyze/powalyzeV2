/**
 * MODULE RAPPORTS - API Upload de fichiers
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import { parseFile, detectFileType } from '@/lib/file-parsers';
import { analyzeReport } from '@/lib/ai-report-analyzer';

export async function POST(request: NextRequest) {
  try {
    const tenantId = request.headers.get('x-tenant-id');
    const userId = request.headers.get('x-user-id');

    if (!tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const projectId = formData.get('project_id') as string | null;
    const metadataStr = formData.get('metadata') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Valider la taille du fichier (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 });
    }

    const supabase = createSupabaseBrowserClient();

    // 1. Upload vers Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
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

    // 2. Obtenir l'URL publique
    const { data: urlData } = supabase.storage.from('reports').getPublicUrl(filePath);

    // 3. Parser le fichier
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

    // 4. Analyser avec IA (si parsing réussi)
    let analysisResult;
    if (status === 'ready' && parsedContent) {
      try {
        analysisResult = await analyzeReport(parsedContent, file.name);
      } catch (error) {
        console.error('AI analysis error:', error);
        // Ne pas échouer si l'analyse IA échoue
      }
    }

    // 5. Créer l'enregistrement dans la DB
    const reportData = {
      organization_id: tenantId,
      project_id: projectId || null,
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
      metadata: metadataStr ? JSON.parse(metadataStr) : null,
      version: 1,
      status,
      error_message: errorMessage,
      created_by: userId,
    };

    const { data: report, error: dbError } = await supabase
      .from('reports')
      .insert(reportData)
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      // Supprimer le fichier du storage en cas d'erreur DB
      await supabase.storage.from('reports').remove([filePath]);
      return NextResponse.json({ error: 'Failed to save report' }, { status: 500 });
    }

    return NextResponse.json({ report }, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const tenantId = request.headers.get('x-tenant-id');

    if (!tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('project_id');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const supabase = createSupabaseBrowserClient();

    let query = supabase
      .from('reports')
      .select('*', { count: 'exact' })
      .eq('organization_id', tenantId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data: reports, error, count } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
    }

    return NextResponse.json({ reports, count }, { status: 200 });
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
