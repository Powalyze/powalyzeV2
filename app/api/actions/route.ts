// ============================================================
// API ROUTE — ACTIONS
// /app/api/actions/route.ts
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';

export async function POST(req: NextRequest) {
  try {
    const tenantId = req.headers.get('x-tenant-id');
    const userId = req.headers.get('x-user-id');

    if (!tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await req.json()) as {
      projectId: string; // OBLIGATOIRE
      title: string;
      description?: string;
      status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
      priority?: 'low' | 'medium' | 'high' | 'critical';
      assigned_to?: string;
      due_date?: string;
      related_risk_id?: string;
      related_decision_id?: string;
      metadata?: Record<string, any>;
    };

    // Validation: project_id obligatoire
    if (!body.projectId) {
      return NextResponse.json(
        { error: 'PROJECT_ID_REQUIRED', message: 'project_id is mandatory' },
        { status: 400 }
      );
    }

    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase
      .from('actions')
      .insert({
        organization_id: tenantId,
        project_id: body.projectId,
        title: body.title,
        description: body.description || null,
        status: body.status || 'pending',
        priority: body.priority || 'medium',
        assigned_to: body.assigned_to || null,
        due_date: body.due_date || null,
        related_risk_id: body.related_risk_id || null,
        related_decision_id: body.related_decision_id || null,
        metadata: body.metadata || {},
        created_by: userId,
      })
      .select('*')
      .single();

    if (error) throw error;

    return NextResponse.json({ action: data }, { status: 201 });
  } catch (error: any) {
    console.error('Action create error', error);
    return NextResponse.json(
      { error: 'ACTION_CREATE_FAILED', message: error.message ?? 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const tenantId = req.headers.get('x-tenant-id');

    if (!tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('project_id');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');

    const supabase = createSupabaseBrowserClient();

    let query = supabase
      .from('actions')
      .select('*')
      .eq('organization_id', tenantId)
      .order('created_at', { ascending: false });

    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (priority) {
      query = query.eq('priority', priority);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ actions: data || [] }, { status: 200 });
  } catch (error: any) {
    console.error('Actions fetch error', error);
    return NextResponse.json(
      { error: 'ACTIONS_FETCH_FAILED', message: error.message ?? 'Unknown error' },
      { status: 500 }
    );
  }
}
