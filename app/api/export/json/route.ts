// ============================================================
// API ROUTE — EXPORT JSON
// /app/api/export/json/route.ts
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

    console.log('[Export JSON] Export pour organizationId:', organizationId, 'type:', type);

    const supabase = getSupabaseClient(true);
    
    // Récupérer TOUTES les données
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
    
    const { data: kpis } = await supabase
      .from('cockpit_kpis')
      .select('*')
      .eq('organization_id', organizationId);

    const exportData = {
      success: true,
      message: 'Export JSON généré avec succès',
      filename: `export-complet-${Date.now()}.json`,
      data: {
        projects: projects || [],
        risks: risks || [],
        decisions: decisions || [],
        kpis: kpis || [],
      },
      timestamp: new Date().toISOString(),
      organizationId,
    };

    return NextResponse.json(exportData, { status: 200 });
  } catch (error: any) {
    console.error('[Export JSON] ERROR:', error);
    return NextResponse.json(
      { error: 'EXPORT_JSON_FAILED', message: error.message },
      { status: 500 }
    );
  }
}
