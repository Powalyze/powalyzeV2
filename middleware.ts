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
  // MODE SIMPLE AUTH - Vérifier cookie simple_auth
  // ========================================
  const simpleAuthCookie = req.cookies.get('simple_auth_token');
  const hasSimpleAuth = !!simpleAuthCookie;

  // Si auth simple présente, on laisse passer pour le cockpit
  if (hasSimpleAuth && path.startsWith('/cockpit')) {
    console.log('✅ [MIDDLEWARE] Auth simple détectée, accès autorisé:', path);
    return res;
  }

  // ========================================
  // MODE SUPABASE AUTH (optionnel)
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
    console.log('⚠️ [MIDDLEWARE] Supabase non disponible, mode simple auth uniquement');
  }

  // Debug logging pour diagnostiquer les problèmes de session
  if (path.startsWith('/cockpit') && !path.startsWith('/cockpit/demo')) {
    console.log('🔍 [MIDDLEWARE]', {
      path,
      hasUser: !!user,
      userId: user?.id,
      authError: authError?.message
    });
  }

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
  
  // ÉTAT 0 : Non connecté → Vitrine + Demo publique
  const isPublicPath = path === '/' || 
                      path === '/demo' ||              // Demo publique SANS connexion
                      path.startsWith('/services') || 
                      path.startsWith('/contact') ||
                      path.startsWith('/auth') || 
                      path.startsWith('/signup') || 
                      path.startsWith('/login') ||
                      path.startsWith('/login-simple'); // ✅ NOUVEAU: Login simple

  // Si pas d'auth (ni simple ni Supabase) et tentative d'accès page protégée
  if (!hasSimpleAuth && !user && !isPublicPath) {
    // Non connecté essayant d'accéder à une page interne → LOGIN SIMPLE
    console.log('⚠️ [MIDDLEWARE] Pas d\'auth, redirection vers /login-simple', { path });
    const redirectUrl = new URL('/login-simple', req.url);
    redirectUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(redirectUrl);
  }

  // Si connecté via Supabase, récupérer les infos utilisateur
  if (user && supabase) {
    try {
      const { data: userData, error } = await supabase
        .from('users')
        .select('role, tenant_id, pro_active')
        .eq('id', user.id)
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
            // État 1 : Connecté sans Pro → cockpit vide avec CTA tarifs
            // (pas de redirect, on affiche le cockpit vide)
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
          // Utilisateur sans Pro essayant d'accéder à une page Pro → Cockpit vide
          return NextResponse.redirect(new URL('/cockpit', req.url));
        }

        // ========================================
        // REDIRECTION DEMO SI NON PRO
        // ========================================
        // REDIRECTION DEMO SI NON PRO
        // ========================================
        if (path === '/cockpit/demo') {
          // /cockpit/demo est maintenant juste un lien depuis cockpit page
          // Rediriger vers demo publique
          return NextResponse.redirect(new URL('/demo', req.url));
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
              return NextResponse.redirect(new URL('/cockpit', req.url));
            }
          }
        }
      }
    } catch (error) {
      console.error('❌ [MIDDLEWARE] Erreur:', error);
      // En cas d'erreur, rediriger vers LOGIN par sécurité (PAS signup)
      if (path.startsWith('/cockpit') && !path.startsWith('/cockpit/demo')) {
        console.log('⚠️ [MIDDLEWARE] Erreur critique, redirection vers /login');
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }
  }

  // Retourner la response avec les cookies mis à jour
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
