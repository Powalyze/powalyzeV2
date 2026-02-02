// ============================================================
// POWALYZE V2 — MIDDLEWARE DEMO/PRO (BACKUP)
// Instructions : Renommer ce fichier en middleware.ts pour activer
// ============================================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/server';

const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/login-v2',
  '/signup',
  '/signup-v2',
  '/pricing',
  '/about',
  '/contact',
  '/vitrine',
  '/features',
  '/demo',
  '/api/webhooks',
  '/api/auth'
];

const DEMO_ROUTES = ['/cockpit/demo'];
const PRO_ROUTES = ['/cockpit/pro'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // ✅ 1. Autoriser les routes publiques et assets statiques
  if (
    PUBLIC_ROUTES.some(route => pathname.startsWith(route)) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }
  
  // ✅ 2. Vérifier l'authentification
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    const loginUrl = new URL('/login-v2', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // ✅ 3. Récupérer le plan utilisateur
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single();
  
  const plan = profile?.plan || 'demo';
  
  // ✅ 4. Redirection automatique sur /cockpit
  if (pathname === '/cockpit') {
    if (plan === 'demo') {
      return NextResponse.redirect(new URL('/cockpit/demo', request.url));
    } else {
      return NextResponse.redirect(new URL('/cockpit/pro', request.url));
    }
  }
  
  // ✅ 5. Protéger les routes Pro des utilisateurs Demo
  if (pathname.startsWith('/cockpit/pro')) {
    if (plan === 'demo') {
      return NextResponse.redirect(new URL('/cockpit/demo', request.url));
    }
    return NextResponse.next();
  }
  
  // ✅ 6. Autoriser les routes Demo
  if (pathname.startsWith('/cockpit/demo')) {
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
