import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const tenantId = req.headers.get('x-tenant-id');

  if (!tenantId) {
    return NextResponse.json({ error: 'Missing tenant ID' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('cockpit_decisions')
      .select('*, project:projects(id, name)')
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .single();

    if (error) {
      console.error('[Decision Details] Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Decision not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[Decision Details] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const tenantId = req.headers.get('x-tenant-id');

  if (!tenantId) {
    return NextResponse.json({ error: 'Missing tenant ID' }, { status: 400 });
  }

  try {
    const body = await req.json();
    
    const { data, error } = await supabase
      .from('cockpit_decisions')
      .update(body)
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .select()
      .single();

    if (error) {
      console.error('[Update Decision] Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[Update Decision] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
