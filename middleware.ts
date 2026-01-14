import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, JWTPayload } from './lib/auth';

export interface RequestWithTenant extends NextRequest {
  tenant?: JWTPayload;
}

export async function middleware(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (request.nextUrl.pathname.startsWith('/api/')) {
    if (request.nextUrl.pathname === '/api/auth/login' || request.nextUrl.pathname === '/api/auth/register') {
      return NextResponse.next();
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    
    try {
      const payload = verifyToken(token);
      
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-tenant-id', payload.tenantId);
      requestHeaders.set('x-user-id', payload.userId);
      requestHeaders.set('x-user-role', payload.role);
      requestHeaders.set('x-user-email', payload.email);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
