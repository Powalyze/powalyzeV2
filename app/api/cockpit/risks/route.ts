import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const organization_id = searchParams.get('organization_id');
    const project_id = searchParams.get('project_id');

    if (!organization_id) {
      return NextResponse.json(
        { success: false, error: 'organization_id is required' },
        { status: 400 }
      );
    }

    let query = supabaseAdmin
      .from('risks')
      .select('*')
      .eq('organization_id', organization_id);

    if (project_id) {
      query = query.eq('project_id', project_id);
    }

    const { data: risks, error } = await query.order('score', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data: risks });
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
    
    const { data: risk, error } = await supabaseAdmin
      .from('risks')
      .insert([body])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data: risk }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
