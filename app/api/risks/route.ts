import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Risk } from '@/types';

export async function GET(request: NextRequest) {
  const tenantId = request.headers.get('x-tenant-id');
  
  if (!tenantId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('project_id');
  const limit = searchParams.get('limit');

  try {
    let sql = `SELECT * FROM risks WHERE tenant_id = $1`;
    const params: any[] = [tenantId];
    
    if (projectId) {
      sql += ` AND project_id = $${params.length + 1}`;
      params.push(projectId);
    }

    sql += ` ORDER BY score DESC, created_at DESC`;

    if (limit) {
      sql += ` LIMIT $${params.length + 1}`;
      params.push(parseInt(limit));
    }

    const risks = await query<Risk>(sql, params);
    return NextResponse.json(risks);
  } catch (error) {
    console.error('Risks GET error:', error);
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
    const { project_id, title, description, category, probability, impact, owner, mitigation_plan } = body;
    
    const score = (probability / 25) * (impact / 25);

    const [risk] = await query<Risk>(
      `INSERT INTO risks (
        tenant_id, project_id, title, description, category,
        probability, impact, score, status, owner, mitigation_plan,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'IDENTIFIED', $9, $10, NOW(), NOW())
      RETURNING *`,
      [tenantId, project_id, title, description, category, probability, impact, score, owner, mitigation_plan]
    );

    return NextResponse.json(risk, { status: 201 });
  } catch (error) {
    console.error('Risks POST error:', error);
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
    const { id, probability, impact, ...updates } = body;

    let score = undefined;
    if (probability !== undefined && impact !== undefined) {
      score = (probability / 25) * (impact / 25);
    }

    const updateData = { ...updates };
    if (probability !== undefined) updateData.probability = probability;
    if (impact !== undefined) updateData.impact = impact;
    if (score !== undefined) updateData.score = score;

    const fields = Object.keys(updateData).map((key, i) => `${key} = $${i + 2}`).join(', ');
    const values = Object.values(updateData);

    const [risk] = await query<Risk>(
      `UPDATE risks SET ${fields}, updated_at = NOW() WHERE id = $1 AND tenant_id = $${values.length + 2} RETURNING *`,
      [id, ...values, tenantId]
    );

    if (!risk) {
      return NextResponse.json({ error: 'Risk not found' }, { status: 404 });
    }

    return NextResponse.json(risk);
  } catch (error) {
    console.error('Risks PUT error:', error);
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
      `DELETE FROM risks WHERE id = $1 AND tenant_id = $2`,
      [id, tenantId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Risks DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
