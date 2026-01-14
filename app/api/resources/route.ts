import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Resource } from '@/types';

export async function GET(request: NextRequest) {
  const tenantId = request.headers.get('x-tenant-id');
  
  if (!tenantId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const resources = await query<Resource>(
      `SELECT * FROM resources WHERE tenant_id = $1 ORDER BY name ASC`,
      [tenantId]
    );

    return NextResponse.json(resources);
  } catch (error) {
    console.error('Resources GET error:', error);
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
    const { name, role, department, capacity_hours, cost_per_hour, skills } = body;

    const [resource] = await query<Resource>(
      `INSERT INTO resources (
        tenant_id, name, role, department, capacity_hours,
        allocated_hours, availability_percentage, cost_per_hour,
        skills, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, 0, 100, $6, $7, NOW(), NOW())
      RETURNING *`,
      [tenantId, name, role, department, capacity_hours, cost_per_hour, JSON.stringify(skills)]
    );

    return NextResponse.json(resource, { status: 201 });
  } catch (error) {
    console.error('Resources POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
