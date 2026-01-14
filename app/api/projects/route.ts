import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Project } from '@/types';

export async function GET(request: NextRequest) {
  const tenantId = request.headers.get('x-tenant-id');
  
  if (!tenantId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const view = searchParams.get('view');
  const status = searchParams.get('status');
  const limit = searchParams.get('limit');

  try {
    let sql = `SELECT * FROM projects WHERE tenant_id = $1`;
    const params: any[] = [tenantId];
    
    if (status) {
      sql += ` AND status = $${params.length + 1}`;
      params.push(status);
    }

    if (view === 'timeline') {
      sql += ` ORDER BY start_date ASC`;
    } else {
      sql += ` ORDER BY created_at DESC`;
    }

    if (limit) {
      sql += ` LIMIT $${params.length + 1}`;
      params.push(parseInt(limit));
    }

    const projects = await query<Project>(sql, params);
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Projects GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const tenantId = request.headers.get('x-tenant-id');
  const userId = request.headers.get('x-user-id');
  
  if (!tenantId || !userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, description, sponsor, business_unit, budget, start_date, end_date } = body;

    const [project] = await query<Project>(
      `INSERT INTO projects (
        tenant_id, name, description, sponsor, business_unit,
        budget, actual_cost, status, rag_status, start_date, end_date,
        completion_percentage, delay_probability, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, 0, 'DRAFT', 'GRAY', $7, $8, 0, 0, NOW(), NOW())
      RETURNING *`,
      [tenantId, name, description, sponsor, business_unit, budget, start_date, end_date]
    );

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Projects POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const tenantId = request.headers.get('x-tenant-id');
  
  if (!tenantId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    const fields = Object.keys(updates).map((key, i) => `${key} = $${i + 2}`).join(', ');
    const values = Object.values(updates);

    const [project] = await query<Project>(
      `UPDATE projects SET ${fields}, updated_at = NOW() WHERE id = $1 AND tenant_id = $${values.length + 2} RETURNING *`,
      [id, ...values, tenantId]
    );

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Projects PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const tenantId = request.headers.get('x-tenant-id');
  
  if (!tenantId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    await query(
      `DELETE FROM projects WHERE id = $1 AND tenant_id = $2`,
      [id, tenantId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Projects DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
