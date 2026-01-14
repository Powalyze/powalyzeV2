import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { comparePassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const [user] = await query<{
      id: string;
      tenant_id: string;
      email: string;
      password_hash: string;
      first_name: string;
      last_name: string;
      role: 'COMEX' | 'PMO' | 'ANALYSTE';
      is_active: boolean;
    }>(
      `SELECT * FROM users WHERE email = $1 AND is_active = true`,
      [email]
    );

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isValid = await comparePassword(password, user.password_hash);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = generateToken({
      userId: user.id,
      tenantId: user.tenant_id,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        tenant_id: user.tenant_id,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
