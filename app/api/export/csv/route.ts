// ============================================================
// API ROUTE — EXPORT CSV
// /app/api/export/csv/route.ts
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

    console.log('[Export CSV] Export pour organizationId:', organizationId, 'type:', type);

    const supabase = getSupabaseClient(true);
    
    // Récupérer les données selon le type
    let data = {};
    
    if (type === 'projects') {
      const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .eq('organization_id', organizationId);
      data = { projects: projects || [] };
    } else if (type === 'risks') {
      const { data: risks } = await supabase
        .from('risks')
        .select('*')
        .eq('organization_id', organizationId);
      data = { risks: risks || [] };
    } else {
      const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .eq('organization_id', organizationId);
      data = { projects: projects || [] };
    }

    // Simuler la génération du CSV
    const csvContent = {
      success: true,
      message: 'Export CSV généré avec succès',
      filename: `export-${type || 'projects'}-${Date.now()}.csv`,
      data,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(csvContent, { status: 200 });
  } catch (error: any) {
    console.error('[Export CSV] ERROR:', error);
    return NextResponse.json(
      { error: 'EXPORT_CSV_FAILED', message: error.message },
      { status: 500 }
    );
  }
}
