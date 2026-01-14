import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Finance } from '@/types';

export async function GET(request: NextRequest) {
  const tenantId = request.headers.get('x-tenant-id');
  
  if (!tenantId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('project_id');

  try {
    let sql = `SELECT * FROM finances WHERE tenant_id = $1`;
    const params: any[] = [tenantId];
    
    if (projectId) {
      sql += ` AND project_id = $${params.length + 1}`;
      params.push(projectId);
    }

    sql += ` ORDER BY period DESC`;

    const finances = await query<Finance>(sql, params);
    return NextResponse.json(finances);
  } catch (error) {
    console.error('Finances GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const tenantId = request.headers.get('x-tenant-id');
  
  if (!tenantId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { project_id, budget_total, cost_actual, cost_forecast, period } = body;
    
    const variance = cost_actual - budget_total;
    const variance_percentage = budget_total > 0 ? (variance / budget_total) * 100 : 0;

    const [finance] = await query<Finance>(
      `INSERT INTO finances (
        tenant_id, project_id, budget_total, cost_actual, cost_forecast,
        variance, variance_percentage, roi_expected, roi_actual, period,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 0, 0, $8, NOW(), NOW())
      RETURNING *`,
      [tenantId, project_id, budget_total, cost_actual, cost_forecast, variance, variance_percentage, period]
    );

    return NextResponse.json(finance, { status: 201 });
  } catch (error) {
    console.error('Finances POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
