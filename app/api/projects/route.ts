// ============================================================
// API ROUTE — PROJECTS
// /app/api/projects/route.ts
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient, mapProjectRow } from '@/lib/supabase-cockpit';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      organizationId: string;
      name: string;
      description?: string;
    };

    const supabase = getSupabaseClient(true);
    const { data, error } = await supabase
      .from('projects')
      .insert({
        organization_id: body.organizationId,
        name: body.name,
        description: body.description ?? null,
      })
      .select('*')
      .single();

    if (error) throw error;

    return NextResponse.json(mapProjectRow(data), { status: 201 });
  } catch (error: any) {
    console.error('Project create error', error);
    return NextResponse.json(
      { error: 'PROJECT_CREATE_FAILED', message: error.message ?? 'Unknown error' },
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
        { status: 400 }
      );
    }

    console.log('[Projects DELETE] Suppression pour organizationId:', organizationId);

    const supabase = getSupabaseClient(true);
    const { error, data } = await supabase
      .from('projects')
      .delete()
      .eq('organization_id', organizationId)
      .select();

    if (error) {
      console.error('[Projects DELETE] Supabase error:', error);
      throw error;
    }

    console.log(`[Projects DELETE] ${data.length} projets supprimés`);

    return NextResponse.json({
      success: true,
      message: `${data.length} projet(s) supprimé(s)`,
      deleted: data.length,
    }, { status: 200 });
  } catch (error: any) {
    console.error('[Projects DELETE] ERROR:', error);
    return NextResponse.json(
      { error: 'DELETE_FAILED', message: error.message },
      { status: 500 }
    );
  }
}
