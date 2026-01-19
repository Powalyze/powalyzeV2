// ============================================================
// API ROUTE — EXPORT PDF
// /app/api/export/pdf/route.ts
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase-cockpit';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { organizationId, type } = body;

    if (!organizationId) {
      return NextResponse.json(
        { error: 'MISSING_ORG_ID', message: 'organizationId requis' },
        { status: 400 }
      );
    }

    console.log('[Export PDF] Export pour organizationId:', organizationId, 'type:', type);

    const supabase = getSupabaseClient(true);
    
    // Récupérer les données selon le type
    let data = {};
    
    if (type === 'cockpit' || !type) {
      const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .eq('organization_id', organizationId);
      
      const { data: risks } = await supabase
        .from('risks')
        .select('*')
        .eq('organization_id', organizationId);
      
      const { data: decisions } = await supabase
        .from('decisions')
        .select('*')
        .eq('organization_id', organizationId);
      
      data = { projects: projects || [], risks: risks || [], decisions: decisions || [] };
    }

    // Simuler la génération du PDF
    const pdfContent = {
      success: true,
      message: 'Export PDF généré avec succès',
      filename: `export-${type || 'cockpit'}-${Date.now()}.pdf`,
      data,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(pdfContent, { status: 200 });
  } catch (error: any) {
    console.error('[Export PDF] ERROR:', error);
    return NextResponse.json(
      { error: 'EXPORT_PDF_FAILED', message: error.message },
      { status: 500 }
    );
  }
}
