// ============================================================
// API ROUTE — TEAM REMOVE
// /app/api/team/remove/route.ts
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase-cockpit';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      organizationId: string;
      memberId: string;
    };

    if (!body.organizationId || !body.memberId) {
      return NextResponse.json(
        { error: 'MISSING_FIELDS', message: 'organizationId et memberId requis' },
        { status: 400 }
      );
    }

    console.log('[Team Remove] Suppression membre:', body);

    const supabase = getSupabaseClient(true);
    
    // Supprimer le membre
    const { error } = await supabase
      .from('organization_memberships')
      .delete()
      .eq('id', body.memberId)
      .eq('organization_id', body.organizationId);

    if (error) {
      console.error('[Team Remove] Supabase error:', error);
      throw error;
    }

    console.log('[Team Remove] Membre supprimé');

    return NextResponse.json({
      success: true,
      message: 'Membre supprimé avec succès',
    }, { status: 200 });
  } catch (error: any) {
    console.error('[Team Remove] ERROR:', error);
    return NextResponse.json(
      { error: 'TEAM_REMOVE_FAILED', message: error.message },
      { status: 500 }
    );
  }
}
