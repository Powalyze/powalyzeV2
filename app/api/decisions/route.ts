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
      projectId: string; // OBLIGATOIRE
      title: string;
      description: string;
      committee: string;
      date: string;
      impacts?: string;
    };

    // Validation: project_id obligatoire
    if (!body.projectId) {
      return NextResponse.json(
        { error: 'PROJECT_ID_REQUIRED', message: 'project_id is mandatory' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient(true);
    const { data, error } = await supabase
      .from('decisions')
      .insert({
        organization_id: body.organizationId,
        project_id: body.projectId, // OBLIGATOIRE
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
