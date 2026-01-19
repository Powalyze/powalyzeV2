// ============================================================
// API ROUTE — COCKPIT DATA
// /app/api/cockpit/route.ts
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { fetchCockpitData, fetchTeam } from '@/lib/supabase-cockpit';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get('organizationId');
    
    console.log('[Cockpit API] organizationId:', organizationId);
    console.log('[Cockpit API] Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('[Cockpit API] SERVICE_ROLE defined?', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
    console.log('[Cockpit API] ANON defined?', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    
    if (!organizationId) {
      return NextResponse.json(
        { error: 'MISSING_ORG_ID', message: 'organizationId requis' },
        { status: 400 },
      );
    }

    const data = await fetchCockpitData(organizationId);
    const team = await fetchTeam(organizationId);

    console.log('[Cockpit API] Data fetched successfully:', {
      kpis: data.kpis.length,
      projects: data.projects.length,
      risks: data.risks.length,
    });

    return NextResponse.json({ ...data, team }, { status: 200 });
  } catch (error: any) {
    console.error('[Cockpit API] ERROR:', error);
    console.error('[Cockpit API] ERROR stack:', error.stack);
    return NextResponse.json(
      { error: 'COCKPIT_FETCH_FAILED', message: error.message ?? 'Unknown error' },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get('organizationId');

    if (!organizationId) {
      return NextResponse.json(
        { error: 'MISSING_ORG_ID', message: 'organizationId requis' },
        { status: 400 },
      );
    }

    console.log('[Cockpit DELETE] Suppression pour organizationId:', organizationId);

    // Supprimer TOUTES les données pour cette organisation
    const tables = [
      'governance_signals',
      'scenarios', 
      'executive_stories',
      'ai_narratives',
      'cockpit_kpis',
      'risks',
      'decisions',
      'integrations',
      'projects',
      'organization_memberships',
      'activity_log',
      'committee_sessions',
      'executive_decisions',
      'kpis',
    ];

    let deleted = 0;
    for (const table of tables) {
      const { error, data } = await supabase
        .from(table)
        .delete()
        .eq('organization_id', organizationId)
        .select();

      if (!error && data) {
        deleted += data.length;
        console.log(`[Cockpit DELETE] ${table}: ${data.length} lignes supprimées`);
      }
    }

    console.log(`[Cockpit DELETE] Total: ${deleted} lignes supprimées`);

    return NextResponse.json({
      success: true,
      message: 'Toutes les données ont été supprimées',
      deleted,
    }, { status: 200 });
  } catch (error: any) {
    console.error('[Cockpit DELETE] ERROR:', error);
    return NextResponse.json(
      { error: 'DELETE_FAILED', message: error.message ?? 'Unknown error' },
      { status: 500 },
    );
  }
}
