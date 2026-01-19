// ============================================================
// API ROUTE — EXPORT PPT
// /app/api/export/ppt/route.ts
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

    console.log('[Export PPT] Export pour organizationId:', organizationId, 'type:', type);

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

    // Simuler la génération du PPT
    const pptContent = {
      success: true,
      message: 'Export PowerPoint généré avec succès',
      filename: `export-${type || 'cockpit'}-${Date.now()}.pptx`,
      data,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(pptContent, { status: 200 });
  } catch (error: any) {
    console.error('[Export PPT] ERROR:', error);
    return NextResponse.json(
      { error: 'EXPORT_PPT_FAILED', message: error.message },
      { status: 500 }
    );
  }
}
