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

  try {
    let query = supabase
      .from('projects')
      .select(`
        id,
        name,
        description,
        status,
        owner,
        user_id,
        bu,
        country,
        tags,
        strategic_alignment_score,
        budget_planned,
        budget_spent,
        capacity_needed,
        capacity_allocated,
        external_id,
        external_source,
        start_date,
        end_date,
        created_at,
        updated_at
      `)
      .eq('organization_id', tenantId);

    if (status) {
      query = query.eq('status', status);
    }

    if (bu) {
      query = query.eq('bu', bu);
    }

    if (country) {
      query = query.eq('country', country);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('[Cockpit Projects] Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ projects: data });
  } catch (error: any) {
    console.error('[Cockpit Projects] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const tenantId = req.headers.get('x-tenant-id');
  const userId = req.headers.get('x-user-id'); // Optionnel

  if (!tenantId) {
    return NextResponse.json({ error: 'Missing tenant ID' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const {
      name,
      description,
      status,
      owner,
      bu,
      country,
      tags,
      strategic_alignment_score,
      budget_planned,
      capacity_needed,
      start_date,
      end_date
    } = body;

    const { data, error } = await supabase
      .from('projects')
      .insert({
        name,
        description,
        status: status || 'active',
        owner: owner || 'Admin',
        user_id: userId, // Peut être null
        bu: bu || 'IT',
        country: country || 'France',
        tags: tags || [],
        strategic_alignment_score: strategic_alignment_score || 50,
        budget_planned: budget_planned || 0,
        budget_spent: 0,
        capacity_needed: capacity_needed || 0,
        capacity_allocated: 0,
        start_date,
        end_date,
        organization_id: tenantId,
      })
      .select()
      .single();

    if (error) {
      console.error('[Create Project] Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('[Create Project] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
