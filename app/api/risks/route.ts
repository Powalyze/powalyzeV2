// ============================================================
// API ROUTE — RISKS
// /app/api/risks/route.ts
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient, mapRiskRow } from '@/lib/supabase-cockpit';
import type { RiskLevel } from '@/lib/cockpit-types';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      organizationId: string;
      projectId: string; // OBLIGATOIRE
      title: string;
      description: string;
      level?: RiskLevel;
      category?: string;
      probability: number;
      impact: number;
      owner?: string;
    };

    // Validation: project_id obligatoire
    if (!body.projectId) {
      return NextResponse.json(
        { error: 'PROJECT_ID_REQUIRED', message: 'project_id is mandatory' },
        { status: 400 }
      );
    }

    // Mapper level → category si fourni
    const category = body.category || 
      (body.level === 'high' ? 'STRATEGIC' : 
       body.level === 'medium' ? 'TECHNICAL' : 'ORGANIZATIONAL');

    const supabase = getSupabaseClient(true);
    const { error, data } = await supabase
      .from('risks')
      .insert({
        organization_id: body.organizationId,
        project_id: body.projectId, // OBLIGATOIRE
        title: body.title,
        description: body.description,
        category: category,
        probability: body.probability,
        impact: body.impact,
        status: 'IDENTIFIED',
        owner: body.owner || 'AI',
      })
      .select('*')
      .single();

    if (error) throw error;

    return NextResponse.json(mapRiskRow(data), { status: 201 });
  } catch (error: any) {
    console.error('Risk create error', error);
    return NextResponse.json(
      { error: 'RISK_CREATE_FAILED', message: error.message ?? 'Unknown error' },
      { status: 500 },
    );
  }
}
