// ============================================================
// API ROUTE — TEAM INVITE
// /app/api/team/invite/route.ts
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient, mapMemberRow } from '@/lib/supabase-cockpit';
import type { InvitePayload } from '@/lib/cockpit-types';

async function sendInvitationEmail(email: string, fullName: string | undefined, orgName: string) {
  // TODO: Brancher votre provider d'email (Resend, SendGrid, etc.)
  // à adapter à votre infrastructure
  console.log(`📧 Invitation email to ${email} for org ${orgName} (${fullName ?? 'N/A'})`);
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      organizationId: string;
      invite: InvitePayload;
    };

    const supabase = getSupabaseClient(true);

    // 1. Créer ou récupérer l'utilisateur
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', body.invite.email)
      .maybeSingle();

    let userId = existingUser?.id;
    if (!userId) {
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert({
          email: body.invite.email,
          full_name: body.invite.fullName ?? null,
        })
        .select('*')
        .single();
      if (userError) throw userError;
      userId = newUser.id;
    }

    // 2. Créer la membership
    const { data: membership, error: membershipError } = await supabase
      .from('organization_memberships')
      .insert({
        organization_id: body.organizationId,
        user_id: userId,
        role: body.invite.role,
        status: 'invited',
      })
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

    if (membershipError) throw membershipError;

    // 3. Envoyer l'email d'invitation
    const userData = Array.isArray(membership.users) ? membership.users[0] : membership.users;
    await sendInvitationEmail(userData.email, userData.full_name, 'Powalyze Cockpit');

    return NextResponse.json(mapMemberRow(membership), { status: 201 });
  } catch (error: any) {
    console.error('Team invite error', error);
    return NextResponse.json(
      { error: 'TEAM_INVITE_FAILED', message: error.message ?? 'Unknown error' },
      { status: 500 },
    );
  }
}
