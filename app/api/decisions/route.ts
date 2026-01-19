// ============================================================
// API ROUTE — DECISIONS
// /app/api/decisions/route.ts
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient, mapDecisionRow } from '@/lib/supabase-cockpit';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      organizationId: string;
      title: string;
      description: string;
      committee: string;
      date: string;
      impacts?: string;
    };

    const supabase = getSupabaseClient(true);
    const { data, error } = await supabase
      .from('decisions')
      .insert({
        organization_id: body.organizationId,
        title: body.title,
        description: body.description,
        committee: body.committee,
        date: body.date,
        impacts: body.impacts ?? null,
      })
      .select('*')
      .single();

    if (error) throw error;

    return NextResponse.json(mapDecisionRow(data), { status: 201 });
  } catch (error: any) {
    console.error('Decision create error', error);
    return NextResponse.json(
      { error: 'DECISION_CREATE_FAILED', message: error.message ?? 'Unknown error' },
      { status: 500 },
    );
  }
}
