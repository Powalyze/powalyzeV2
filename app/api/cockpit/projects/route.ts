import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  const url = new URL(req.url);
  const tenantId = req.headers.get('x-tenant-id');
  const status = url.searchParams.get('status');
  const bu = url.searchParams.get('bu');
  const country = url.searchParams.get('country');

  if (!tenantId) {
    return NextResponse.json({ error: 'Missing tenant ID' }, { status: 400 });
  }

  let query = supabase
    .from('projects')
    .select('*')
    .eq('tenant_id', tenantId);

  if (status) query = query.eq('status', status);
  if (bu) query = query.eq('bu', bu);
  if (country) query = query.eq('country', country);

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error('[Cockpit Projects] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
