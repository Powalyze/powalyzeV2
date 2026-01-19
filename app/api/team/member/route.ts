// ============================================================
// API ROUTE — TEAM MEMBER UPDATE/DELETE
// /app/api/team/member/route.ts
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient, mapMemberRow } from '@/lib/supabase-cockpit';
import type { TeamRole } from '@/lib/cockpit-types';

export async function PATCH(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      membershipId: string;
      role?: TeamRole;
      status?: 'active' | 'invited';
    };

    const supabase = getSupabaseClient(true);
    const { data, error } = await supabase
      .from('organization_memberships')
      .update({
        role: body.role,
        status: body.status,
      })
      .eq('id', body.membershipId)
      .select(
        `
        id,
        role,
        status,
        invited_at,
        users:users (
          id,
          email,
          full_name
        )
      `,
      )
      .single();

    if (error) throw error;

    return NextResponse.json(mapMemberRow(data), { status: 200 });
  } catch (error: any) {
    console.error('Team update error', error);
    return NextResponse.json(
      { error: 'TEAM_UPDATE_FAILED', message: error.message ?? 'Unknown error' },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const membershipId = searchParams.get('membershipId');
    if (!membershipId) {
      return NextResponse.json(
        { error: 'MISSING_MEMBERSHIP_ID', message: 'membershipId requis' },
        { status: 400 },
      );
    }

    const supabase = getSupabaseClient(true);
    const { error } = await supabase.from('organization_memberships').delete().eq('id', membershipId);
    if (error) throw error;

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error: any) {
    console.error('Team delete error', error);
    return NextResponse.json(
      { error: 'TEAM_DELETE_FAILED', message: error.message ?? 'Unknown error' },
      { status: 500 },
    );
  }
}
