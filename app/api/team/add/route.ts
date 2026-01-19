// ============================================================
// API ROUTE — TEAM ADD
// /app/api/team/add/route.ts
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase-cockpit';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      organizationId: string;
      email: string;
      role: string;
      name?: string;
    };

    if (!body.organizationId || !body.email) {
      return NextResponse.json(
        { error: 'MISSING_FIELDS', message: 'organizationId et email requis' },
        { status: 400 }
      );
    }

    console.log('[Team Add] Ajout membre:', body);

    const supabase = getSupabaseClient(true);
    
    // Créer le membre
    const { data, error } = await supabase
      .from('organization_memberships')
      .insert({
        organization_id: body.organizationId,
        email: body.email,
        role: body.role || 'member',
        name: body.name || null,
        status: 'invited',
      })
      .select('*')
      .single();

    if (error) {
      console.error('[Team Add] Supabase error:', error);
      throw error;
    }

    console.log('[Team Add] Membre ajouté:', data);

    return NextResponse.json({
      success: true,
      member: data,
      message: `${body.email} a été invité`,
    }, { status: 201 });
  } catch (error: any) {
    console.error('[Team Add] ERROR:', error);
    return NextResponse.json(
      { error: 'TEAM_ADD_FAILED', message: error.message },
      { status: 500 }
    );
  }
}
