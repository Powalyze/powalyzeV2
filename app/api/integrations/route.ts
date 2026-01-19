// ============================================================
// API ROUTE — INTEGRATIONS
// /app/api/integrations/route.ts
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient, mapIntegrationRow } from '@/lib/supabase-cockpit';
import type { IntegrationType } from '@/lib/cockpit-types';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      organizationId: string;
      type: IntegrationType;
      name: string;
      config?: any;
    };

    const supabase = getSupabaseClient(true);
    const { data, error } = await supabase
      .from('integrations')
      .insert({
        organization_id: body.organizationId,
        type: body.type,
        name: body.name,
        config: body.config ?? {},
        status: 'pending',
      })
      .select('*')
      .single();

    if (error) throw error;

    return NextResponse.json(mapIntegrationRow(data), { status: 201 });
  } catch (error: any) {
    console.error('Integration create error', error);
    return NextResponse.json(
      { error: 'INTEGRATION_CREATE_FAILED', message: error.message ?? 'Unknown error' },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      integrationId: string;
      name?: string;
      status?: 'connected' | 'pending' | 'error';
      config?: any;
    };

    const supabase = getSupabaseClient(true);
    const { data, error } = await supabase
      .from('integrations')
      .update({
        name: body.name,
        status: body.status,
        config: body.config,
      })
      .eq('id', body.integrationId)
      .select('*')
      .single();

    if (error) throw error;

    return NextResponse.json(mapIntegrationRow(data), { status: 200 });
  } catch (error: any) {
    console.error('Integration update error', error);
    return NextResponse.json(
      { error: 'INTEGRATION_UPDATE_FAILED', message: error.message ?? 'Unknown error' },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const integrationId = searchParams.get('integrationId');
    if (!integrationId) {
      return NextResponse.json(
        { error: 'MISSING_INTEGRATION_ID', message: 'integrationId requis' },
        { status: 400 },
      );
    }

    const supabase = getSupabaseClient(true);
    const { error } = await supabase.from('integrations').delete().eq('id', integrationId);
    if (error) throw error;

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error: any) {
    console.error('Integration delete error', error);
    return NextResponse.json(
      { error: 'INTEGRATION_DELETE_FAILED', message: error.message ?? 'Unknown error' },
      { status: 500 },
    );
  }
}
