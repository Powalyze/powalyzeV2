import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  const tenantId = request.headers.get('x-tenant-id');
  const userId = request.headers.get('x-user-id');

  // Mode démo : retourner des données mockées si pas de tenant
  if (!tenantId || !userId) {
    return NextResponse.json({
      activeProjects: 42,
      delayPercentage: 12,
      budgetConsumed: 7800000,
      criticalRisks: 3,
      totalBudget: 12000000,
    });
  }

  try {
    const activeProjects = await query<{ count: number }>(
      `SELECT COUNT(*) as count FROM projects WHERE tenant_id = $1 AND status = 'ACTIVE'`,
      [tenantId]
    );

    const delayedProjects = await query<{ count: number }>(
      `SELECT COUNT(*) as count FROM projects WHERE tenant_id = $1 AND delay_probability > 50`,
      [tenantId]
    );

    const totalProjects = await query<{ count: number }>(
      `SELECT COUNT(*) as count FROM projects WHERE tenant_id = $1`,
      [tenantId]
    );

    const budgetData = await query<{ total: number; consumed: number }>(
      `SELECT 
        SUM(budget) as total,
        SUM(actual_cost) as consumed
      FROM projects
      WHERE tenant_id = $1`,
      [tenantId]
    );

    const criticalRisks = await query<{ count: number }>(
      `SELECT COUNT(*) as count FROM risks WHERE tenant_id = $1 AND score >= 15`,
      [tenantId]
    );

    const delayPercentage = totalProjects[0]?.count && totalProjects[0].count > 0
      ? Math.round((delayedProjects[0]?.count || 0) / totalProjects[0].count * 100)
      : 0;

    return NextResponse.json({
      activeProjects: activeProjects[0]?.count || 0,
      delayPercentage,
      budgetConsumed: budgetData[0]?.consumed || 0,
      criticalRisks: criticalRisks[0]?.count || 0,
      totalBudget: budgetData[0]?.total || 0,
    });
  } catch (error) {
    console.error('Cockpit API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
