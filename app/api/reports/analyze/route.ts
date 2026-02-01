import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { analyzeReport } from '@/lib/ai-report-analyzer';

export async function POST(request: NextRequest) {
  try {
    const supabase = supabaseAdmin;
    
    // Vérifier auth via headers
    const tenantId = request.headers.get('x-tenant-id');
    const userId = request.headers.get('x-user-id');
    
    if (!tenantId || !userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const { reportId, projectId } = body;

    if (!reportId || !projectId) {
      return NextResponse.json(
        { error: 'reportId et projectId requis' },
        { status: 400 }
      );
    }

    // Récupérer le rapport
    const { data: report, error: reportError } = await supabase
      .from('reports')
      .select('*')
      .eq('id', reportId)
      .eq('project_id', projectId)
      .single();

    if (reportError || !report) {
      return NextResponse.json(
        { error: 'Rapport introuvable' },
        { status: 404 }
      );
    }

    // Analyser avec IA
    const analysis = await analyzeReport(
      report.file_url,
      report.file_type
    );

    // Mettre à jour le rapport
    await supabase
      .from('reports')
      .update({
        summary: analysis.summary,
        insights: analysis.insights,
        updated_at: new Date().toISOString(),
      })
      .eq('id', reportId);

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error: any) {
    console.error('Erreur /api/reports/analyze:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur analyse' },
      { status: 500 }
    );
  }
}
