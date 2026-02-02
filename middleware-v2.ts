// ============================================================
// POWALYZE V2 — MIDDLEWARE DEMO/PRO
// ============================================================
// Rôle: Rediriger automatiquement selon le plan utilisateur
// - demo → /cockpit/demo
// - pro → /cockpit/pro
// - non-auth → /login
// ============================================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// Routes publiques (pas besoin d'auth)
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/pricing',
  '/about',
  '/contact',
  '/api/webhooks',
];

// Routes demo (lecture seule)
const DEMO_ROUTES = ['/cockpit/demo'];

// Routes pro (édition complète)
const PRO_ROUTES = ['/cockpit/pro'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Laisser passer les routes publiques
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }
  
  // Laisser passer les assets statiques
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }
  
  // Vérifier l'authentification
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Pas d'utilisateur → login
  if (!user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Récupérer le plan de l'utilisateur
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single();
  
  const plan = profile?.plan || 'demo';
  
  // Redirection automatique basée sur le plan
  if (pathname === '/cockpit') {
    // Rediriger vers le bon cockpit selon le plan
    if (plan === 'demo') {
      return NextResponse.redirect(new URL('/cockpit/demo', request.url));
    } else {
      return NextResponse.redirect(new URL('/cockpit/pro', request.url));
    }
  }
  
  // Protéger les routes demo
  if (pathname.startsWith('/cockpit/demo')) {
    // Accessible par tous (demo et pro)
    return NextResponse.next();
  }
  
  // Protéger les routes pro
  if (pathname.startsWith('/cockpit/pro')) {
    if (plan === 'demo') {
      // User demo essaie d'accéder au pro → rediriger vers demo
      return NextResponse.redirect(new URL('/cockpit/demo', request.url));
    }
    return NextResponse.next();
  }
  
  // Par défaut, laisser passer
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
