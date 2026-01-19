import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const organization_id = searchParams.get('organization_id');
    const project_id = searchParams.get('project_id');
    const status = searchParams.get('status');

    if (!organization_id) {
      return NextResponse.json(
        { success: false, error: 'organization_id is required' },
        { status: 400 }
      );
    }

    let query = supabaseAdmin
      .from('actions')
      .select('*')
      .eq('organization_id', organization_id);

    if (project_id) {
      query = query.eq('project_id', project_id);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data: actions, error } = await query.order('due_date', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, data: actions });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { data: action, error } = await supabaseAdmin
      .from('actions')
      .insert([body])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data: action }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
