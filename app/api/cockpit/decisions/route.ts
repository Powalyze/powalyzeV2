import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const tenantId = req.headers.get('x-tenant-id');

  if (!tenantId) {
    return NextResponse.json({ error: 'Missing tenant ID' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { title, description, project_id, priority, due_date, owner, impact_area } = body;

    const { data, error } = await supabase
      .from('cockpit_decisions')
      .insert({
        title,
        description,
        project_id,
        priority: priority || 'medium',
        due_date,
        owner,
        impact_area: impact_area || 'project',
        status: 'pending',
        tenant_id: tenantId,
      })
      .select()
      .single();

    if (error) {
      console.error('[Create Decision] Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('[Create Decision] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const tenantId = req.headers.get('x-tenant-id');
  const status = url.searchParams.get('status');

  if (!tenantId) {
    return NextResponse.json({ error: 'Missing tenant ID' }, { status: 400 });
  }

  let query = supabase
    .from('cockpit_decisions')
    .select('*')
    .eq('tenant_id', tenantId);

  if (status) {
    query = query.eq('status', status);
  }

  query = query.order('priority', { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error('[Cockpit Decisions] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
