import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const organization_id = searchParams.get('organization_id');

    if (!organization_id) {
      return NextResponse.json(
        { success: false, error: 'organization_id is required' },
        { status: 400 }
      );
    }

    const [projectsRes, risksRes, decisionsRes, actionsRes] = await Promise.all([
      supabaseAdmin
        .from('projects')
        .select('*')
        .eq('organization_id', organization_id)
        .in('status', ['ACTIVE', 'ON_HOLD'])
        .order('criticality', { ascending: false }),
      
      supabaseAdmin
        .from('risks')
        .select('*')
        .eq('organization_id', organization_id)
        .in('status', ['IDENTIFIED', 'ASSESSED', 'MITIGATING'])
        .gte('score', 30)
        .order('score', { ascending: false })
        .limit(10),
      
      supabaseAdmin
        .from('decisions')
        .select('*')
        .eq('organization_id', organization_id)
        .eq('status', 'PENDING')
        .order('created_at', { ascending: false })
        .limit(10),
      
      supabaseAdmin
        .from('actions')
        .select('*')
        .eq('organization_id', organization_id)
        .in('status', ['TODO', 'IN_PROGRESS', 'BLOCKED'])
        .order('due_date', { ascending: true })
        .limit(15),
    ]);

    const today = new Date().toISOString().split('T')[0];
    const overdueActions = actionsRes.data?.filter(a => a.due_date < today) || [];
    const criticalActions = actionsRes.data?.filter(a => a.priority === 'CRITICAL') || [];

    const dashboard = {
      projects: {
        total: projectsRes.data?.length || 0,
        active: projectsRes.data?.filter(p => p.status === 'ACTIVE').length || 0,
        critical: projectsRes.data?.filter(p => p.criticality === 'CRITICAL' || p.criticality === 'HIGH').length || 0,
        by_status: {
          DRAFT: projectsRes.data?.filter(p => p.status === 'DRAFT').length || 0,
          ACTIVE: projectsRes.data?.filter(p => p.status === 'ACTIVE').length || 0,
          ON_HOLD: projectsRes.data?.filter(p => p.status === 'ON_HOLD').length || 0,
          COMPLETED: 0,
          CANCELLED: 0,
        },
        by_rag: {
          GREEN: projectsRes.data?.filter(p => p.rag_status === 'GREEN').length || 0,
          YELLOW: projectsRes.data?.filter(p => p.rag_status === 'YELLOW').length || 0,
          RED: projectsRes.data?.filter(p => p.rag_status === 'RED').length || 0,
          GRAY: projectsRes.data?.filter(p => p.rag_status === 'GRAY').length || 0,
        },
      },
      risks: {
        total: risksRes.data?.length || 0,
        critical: risksRes.data?.filter(r => r.score >= 70).length || 0,
        high_probability: risksRes.data?.filter(r => r.probability >= 70).length || 0,
      },
      decisions: {
        total: decisionsRes.data?.length || 0,
        pending: decisionsRes.data?.filter(d => d.status === 'PENDING').length || 0,
      },
      actions: {
        total: actionsRes.data?.length || 0,
        overdue: overdueActions.length,
        critical: criticalActions.length,
      },
    };

    return NextResponse.json({
      success: true,
      data: {
        dashboard,
        projects: projectsRes.data || [],
        risks: risksRes.data || [],
        decisions: decisionsRes.data || [],
        actions: actionsRes.data || [],
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
