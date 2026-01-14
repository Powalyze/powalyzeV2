import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, first_name, last_name, tenant_name, tenant_domain } = body;

    const existingTenant = await query(
      `SELECT id FROM tenants WHERE domain = $1`,
      [tenant_domain]
    );

    if (existingTenant.length > 0) {
      return NextResponse.json({ error: 'Tenant already exists' }, { status: 400 });
    }

    const [tenant] = await query<{ id: string }>(
      `INSERT INTO tenants (name, domain, is_active, created_at, updated_at)
       VALUES ($1, $2, true, NOW(), NOW())
       RETURNING id`,
      [tenant_name, tenant_domain]
    );

    const passwordHash = await hashPassword(password);

    const [user] = await query<{ id: string }>(
      `INSERT INTO users (tenant_id, email, password_hash, first_name, last_name, role, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, 'COMEX', true, NOW(), NOW())
       RETURNING id`,
      [tenant.id, email, passwordHash, first_name, last_name]
    );

    const token = generateToken({
      userId: user.id,
      tenantId: tenant.id,
      email: email,
      role: 'COMEX',
    });

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email,
        first_name,
        last_name,
        role: 'COMEX',
      },
      tenant: {
        id: tenant.id,
        name: tenant_name,
        domain: tenant_domain,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
