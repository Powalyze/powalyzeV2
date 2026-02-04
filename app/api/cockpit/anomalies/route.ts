import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  const url = new URL(req.url);
  const tenantId = req.headers.get('x-tenant-id');
  const resolved = url.searchParams.get('resolved');

  if (!tenantId) {
    return NextResponse.json({ error: 'Missing tenant ID' }, { status: 400 });
  }

  let query = supabase
    .from('anomalies')
    .select('*')
    .eq('tenant_id', tenantId);

  if (resolved !== null) {
    query = query.eq('resolved', resolved === 'true');
  }

  query = query.order('detected_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error('[Cockpit Anomalies] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
