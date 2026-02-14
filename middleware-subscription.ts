import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const path = req.nextUrl.pathname;

  // ========================================
  // PUBLIC PATHS - Always accessible
  // ========================================
  const publicPaths = [
    '/',
    '/pricing',
    '/tarifs',
    '/demo',
    '/login',
    '/login-simple',
    '/signup',
    '/auth',
    '/contact',
    '/services',
    '/mentions-legales',
    '/cgu',
    '/a-propos',
    '/fonctionnalites',
    '/expertise',
    '/methodologies',
    '/ressources'
  ];

  const isPublicPath = publicPaths.some(p => path === p || path.startsWith(`${p}/`));

  // Allow public access to API routes
  if (path.startsWith('/api/')) {
    return res;
  }

  // ========================================
  // MODE SIMPLE AUTH - Check simple_auth cookie
  // ========================================
  const simpleAuthCookie = req.cookies.get('simple_auth_token');
  const hasSimpleAuth = !!simpleAuthCookie;

  // Simple auth allows cockpit access (demo mode)
  if (hasSimpleAuth && path.startsWith('/cockpit')) {
    console.log('✅ [MIDDLEWARE] Simple auth detected, access granted:', path);
    return res;
  }

  // ========================================
  // SUPABASE AUTH MODE
  // ========================================
  let user = null;
  let authError = null;
  let supabase = null;

  try {
    supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return req.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            req.cookies.set({ name, value, ...options });
            res.cookies.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            req.cookies.set({ name, value: "", ...options });
            res.cookies.set({ name, value: "", ...options });
          }
        }
      }
    );

    const result = await supabase.auth.getUser();
    user = result.data.user;
    authError = result.error;
  } catch (error) {
    console.log('⚠️ [MIDDLEWARE] Supabase not available, simple auth only');
  }

  // ========================================
  // REDIRECT TO LOGIN IF NOT AUTHENTICATED
  // ========================================
  if (!hasSimpleAuth && !user && !isPublicPath) {
    console.log('⚠️ [MIDDLEWARE] No auth, redirecting to /login', { path });
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(redirectUrl);
  }

  // ========================================
  // LEGACY ROUTE REDIRECTS (301 permanent)
  // ========================================
  const legacyRedirects: Record<string, string> = {
    '/pro': '/cockpit/projets',
    '/cockpit-demo': '/cockpit/projets',
    '/cockpit-real': '/cockpit/projets',
    '/cockpit-client': '/cockpit/projets',
    '/inscription': '/signup',
    '/register': '/signup',
    '/portefeuille': '/cockpit/projets',
    '/anomalies': '/cockpit/projets',
    '/dashboard': '/cockpit/projets'
  };

  if (legacyRedirects[path]) {
    return NextResponse.redirect(new URL(legacyRedirects[path], req.url), { status: 301 });
  }

  // ========================================
  // SUBSCRIPTION CHECK FOR AUTHENTICATED USERS
  // ========================================
  if (user && supabase && path.startsWith('/cockpit')) {
    try {
      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, pro_active')
        .eq('id', user.id)
        .single();

      // Get active subscription
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('plan, status, trial_end, is_enterprise')
        .eq('user_id', user.id)
        .in('status', ['active', 'trialing'])
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // Check if trial expired
      let isTrialExpired = false;
      if (subscription?.status === 'trialing' && subscription?.trial_end) {
        isTrialExpired = new Date(subscription.trial_end) < new Date();
      }

      // Determine access level
      const hasActiveSubscription = subscription && !isTrialExpired;
      const isPro = profile?.pro_active === true || hasActiveSubscription;
      const isEnterprise = subscription?.is_enterprise === true;

      // Protection for Pro-only pages
      const proOnlyPages = [
        '/cockpit/projets',
        '/cockpit/risques',
        '/cockpit/decisions',
        '/cockpit/rapports',
        '/cockpit/ressources',
        '/cockpit/gantt',
        '/cockpit/kanban',
        '/cockpit/ia',
        '/cockpit/portfolio',
        '/cockpit/kpi',
        '/cockpit/budget',
        '/cockpit/equipe'
      ];

      const isProOnlyPage = proOnlyPages.some(p => path.startsWith(p));

      if (isProOnlyPage && !isPro) {
        console.log('⚠️ [MIDDLEWARE] Pro subscription required, redirecting to /pricing');
        const redirectUrl = new URL('/pricing', req.url);
        redirectUrl.searchParams.set('upgrade', 'required');
        redirectUrl.searchParams.set('from', path);
        return NextResponse.redirect(redirectUrl);
      }

      // Add user info to headers for API consumption
      res.headers.set('x-user-id', user.id);
      res.headers.set('x-user-email', user.email || '');
      res.headers.set('x-user-plan', subscription?.plan || 'none');
      res.headers.set('x-user-is-pro', isPro ? 'true' : 'false');
      res.headers.set('x-user-is-enterprise', isEnterprise ? 'true' : 'false');

      // Admin protection
      if (path.startsWith('/cockpit/admin')) {
        if (profile?.role !== 'admin') {
          return NextResponse.redirect(new URL(isPro ? '/cockpit/projets' : '/cockpit', req.url));
        }
      }

      // Auto-redirect /cockpit to appropriate page
      if (path === '/cockpit') {
        if (isPro) {
          return NextResponse.redirect(new URL('/cockpit/projets', req.url));
        } else {
          // Show empty cockpit with upgrade CTA (let it through)
        }
      }

    } catch (error) {
      console.error('❌ [MIDDLEWARE] Error checking subscription:', error);
      // On error, redirect to login for security
      if (path.startsWith('/cockpit') && !isPublicPath) {
        console.log('⚠️ [MIDDLEWARE] Critical error, redirecting to /login');
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }
  }

  return res;
}

export const config = {
  matcher: [
    "/cockpit/:path*",
    "/pricing",
    "/tarifs",
    "/welcome",
    // Legacy routes for 301 redirects
    "/pro",
    "/cockpit-demo",
    "/cockpit-real",
    "/cockpit-client",
    "/inscription",
    "/register",
    "/portefeuille",
    "/anomalies",
    "/dashboard"
  ]
};
