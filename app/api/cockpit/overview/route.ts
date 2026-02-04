import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  const tenantId = req.headers.get('x-tenant-id');
  
  if (!tenantId) {
    return NextResponse.json({ error: 'Missing tenant ID' }, { status: 400 });
  }

  const { data, error } = await supabase
      .from('cockpit_executive_overview')
      .select('*')

  if (error) {
    console.error('[Cockpit Overview] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
