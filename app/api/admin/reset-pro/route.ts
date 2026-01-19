// ============================================================
// API ROUTE — ADMIN RESET PRO
// /app/api/admin/reset-pro/route.ts
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase-cockpit';

const TABLES = [
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      organizationId: string;
      confirm: boolean;
    };

    if (!body.organizationId) {
      return NextResponse.json(
        { error: 'MISSING_ORG_ID', message: 'organizationId requis' },
        { status: 400 }
      );
    }

    if (!body.confirm) {
      return NextResponse.json(
        { error: 'MISSING_CONFIRMATION', message: 'Confirmation requise' },
        { status: 400 }
      );
    }

    console.log('[Reset Pro] RÉINITIALISATION pour organizationId:', body.organizationId);

    const supabase = getSupabaseClient(true);
    let totalDeleted = 0;
    const details: Record<string, number> = {};

    // Supprimer TOUTES les données pour cette organisation
    for (const table of TABLES) {
      try {
        const { error, data } = await supabase
          .from(table)
          .delete()
          .eq('organization_id', body.organizationId)
          .select();

        if (!error && data) {
          const count = data.length;
          totalDeleted += count;
          details[table] = count;
          console.log(`[Reset Pro] ${table}: ${count} lignes supprimées`);
        }
      } catch (err) {
        console.error(`[Reset Pro] Erreur sur ${table}:`, err);
        // Continue même si une table échoue
      }
    }

    console.log(`[Reset Pro] TOTAL: ${totalDeleted} lignes supprimées`);

    return NextResponse.json({
      success: true,
      message: 'Mode Pro réinitialisé avec succès',
      totalDeleted,
      details,
      timestamp: new Date().toISOString(),
    }, { status: 200 });
  } catch (error: any) {
    console.error('[Reset Pro] ERROR:', error);
    return NextResponse.json(
      { error: 'RESET_FAILED', message: error.message },
      { status: 500 }
    );
  }
}
