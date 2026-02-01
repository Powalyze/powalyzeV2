import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          res.cookies.set({ name, value: "", ...options });
        }
      }
    }
  );

  const {
    data: { session }
  } = await supabase.auth.getSession();

  const path = req.nextUrl.pathname;

  // ========================================
  // REDIRECTIONS LEGACY ROUTES (301 permanent)
  // ========================================
  const legacyRedirects: Record<string, string> = {
    '/demo': '/signup?demo=true',
    '/pro': '/cockpit/projets',             // Pro → projets (pas /cockpit/client)
    '/cockpit-demo': '/cockpit/demo',
    '/cockpit-real': '/cockpit',
    '/cockpit-client': '/cockpit/projets',  // Client → projets
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
  // SYSTÈME 3 ÉTATS — ARCHITECTURE FINALE
  // ========================================
  
  // ÉTAT 0 : Non connecté → Vitrine uniquement
  const isPublicPath = path === '/' || 
                      path.startsWith('/services') || 
                      path.startsWith('/contact') ||
                      path.startsWith('/auth') || 
                      path.startsWith('/signup') || 
                      path.startsWith('/login');

  if (!session && !isPublicPath) {
    // Non connecté essayant d'accéder à une page interne → signup
    const redirectUrl = new URL('/signup', req.url);
    redirectUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(redirectUrl);
  }

  // Si connecté, récupérer les infos utilisateur
  if (session) {
    try {
      const { data: userData, error } = await supabase
        .from('users')
        .select('role, tenant_id, pro_active')
        .eq('id', session.user.id)
        .single();

      if (!error && userData) {
        const isPro = userData.pro_active === true;

        // ========================================
        // ROUTAGE AUTOMATIQUE /cockpit
        // ========================================
        if (path === '/cockpit') {
          if (isPro) {
            return NextResponse.redirect(new URL('/cockpit/projets', req.url));
          } else {
            return NextResponse.redirect(new URL('/cockpit/demo', req.url));
          }
        }

        // ========================================
        // PROTECTION PAGE TARIFS
        // ========================================
        if (path === '/cockpit/tarifs') {
          if (isPro) {
            // Pro actif → pas besoin de voir les tarifs
            return NextResponse.redirect(new URL('/cockpit/projets', req.url));
          }
          // Sinon, laisse passer (utilisateur connecté sans Pro)
        }

        // ========================================
        // PROTECTION PAGES PRO (projets, risques, décisions, etc.)
        // ========================================
        const proPages = ['/cockpit/projets', '/cockpit/risques', '/cockpit/decisions', '/cockpit/rapports'];
        const isProPage = proPages.some(pp => path.startsWith(pp));

        if (isProPage && !isPro) {
          // Utilisateur sans Pro essayant d'accéder à une page Pro → Demo
          return NextResponse.redirect(new URL('/cockpit/demo', req.url));
        }

        // ========================================
        // PROTECTION PAGE DEMO
        // ========================================
        if (path.startsWith('/cockpit/demo') && isPro) {
          // Utilisateur Pro essayant d'accéder au Demo → Projets
          return NextResponse.redirect(new URL('/cockpit/projets', req.url));
        }

        // ========================================
        // PROTECTION ROUTES ADMIN
        // ========================================
        if (path.startsWith('/cockpit/admin')) {
          if (userData.role !== 'admin') {
            // Non-admin essayant d'accéder à l'admin
            if (isPro) {
              return NextResponse.redirect(new URL('/cockpit/projets', req.url));
            } else {
              return NextResponse.redirect(new URL('/cockpit/demo', req.url));
            }
          }
        }
      }
    } catch (error) {
      console.error('Error in middleware:', error);
      // En cas d'erreur, rediriger vers demo par sécurité
      if (path.startsWith('/cockpit') && path !== '/cockpit/demo') {
        return NextResponse.redirect(new URL('/cockpit/demo', req.url));
      }
    }
  }

  return res;
}

export const config = {
  matcher: [
    "/cockpit/:path*", 
    "/tarifs", 
    "/welcome",
    // Legacy routes pour redirections 301
    "/pro",
    "/demo",
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
