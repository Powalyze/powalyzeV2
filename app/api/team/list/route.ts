// ============================================================
// API ROUTE — TEAM LIST
// /app/api/team/list/route.ts
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase-cockpit';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get('organizationId');

    if (!organizationId) {
      return NextResponse.json(
        { error: 'MISSING_ORG_ID', message: 'organizationId requis' },
        { status: 400 }
      );
    }

    console.log('[Team List] Liste pour organizationId:', organizationId);

    const supabase = getSupabaseClient(true);
    
    // Récupérer tous les membres
    const { data, error } = await supabase
      .from('organization_memberships')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Team List] Supabase error:', error);
      throw error;
    }

    console.log(`[Team List] ${data.length} membres trouvés`);

    return NextResponse.json({
      success: true,
      members: data || [],
      count: data.length,
    }, { status: 200 });
  } catch (error: any) {
    console.error('[Team List] ERROR:', error);
    return NextResponse.json(
      { error: 'TEAM_LIST_FAILED', message: error.message },
      { status: 500 }
    );
  }
}
