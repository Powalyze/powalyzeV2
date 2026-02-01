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
    '/pro': '/cockpit/pro',
    '/cockpit-demo': '/cockpit/demo',
    '/cockpit-real': '/cockpit',
    '/cockpit-client': '/cockpit/client',
    '/inscription': '/signup',
    '/register': '/signup',
    '/portefeuille': '/cockpit/pro',
    '/anomalies': '/cockpit/pro',
    '/dashboard': '/cockpit/pro'
  };

  if (legacyRedirects[path]) {
    return NextResponse.redirect(new URL(legacyRedirects[path], req.url), { status: 301 });
  }

  // ========================================
  // AUTH ACTIVÉ : Accès SaaS réservé aux inscrits
  // ========================================
  const isDemoPath = path.startsWith('/cockpit/demo');
  const isAuthPath = path.startsWith('/auth') || path.startsWith('/signup') || path.startsWith('/login');

  // Éviter les boucles de redirection : ne pas rediriger si déjà sur une page d'auth
  if (!session && !isDemoPath && !isAuthPath && path.startsWith('/cockpit')) {
    const redirectUrl = new URL('/signup', req.url);
    redirectUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(redirectUrl);
  }

  // ========================================
  // SYSTÈME 3-MODES : Redirection automatique par rôle
  // ========================================
  if (session && path === '/cockpit') {
    try {
      // Récupérer le rôle de l'utilisateur
      const { data: userData, error } = await supabase
        .from('users')
        .select('role, tenant_id')
        .eq('id', session.user.id)
        .single();

      if (!error && userData) {
        const role = userData.role as 'admin' | 'client' | 'demo';
        const tenantId = userData.tenant_id;

        // Redirection automatique selon le rôle
        if (role === 'admin') {
          return NextResponse.redirect(new URL('/cockpit/admin', req.url));
        }

        if (role === 'demo') {
          return NextResponse.redirect(new URL('/cockpit/demo', req.url));
        }

        if (role === 'client') {
          const clientUrl = new URL('/cockpit/client', req.url);
          clientUrl.searchParams.set('userId', session.user.id);
          if (tenantId) {
            clientUrl.searchParams.set('organizationId', tenantId);
          }
          return NextResponse.redirect(clientUrl);
        }
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      // Fallback to client cockpit on error
      return NextResponse.redirect(new URL('/cockpit/client', req.url));
    }
  }

  // ========================================
  // PROTECTION DES ROUTES PAR RÔLE
  // ========================================
  if (session) {
    // Routes admin : vérifier que l'utilisateur est admin
    if (path.startsWith('/cockpit/admin')) {
      try {
        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (userData?.role !== 'admin') {
          // Redirect based on actual role
          if (userData?.role === 'demo') {
            return NextResponse.redirect(new URL('/cockpit/demo', req.url));
          } else {
            return NextResponse.redirect(new URL('/cockpit/client', req.url));
          }
        }
      } catch (error) {
        // Redirect to client cockpit by default on error
        return NextResponse.redirect(new URL('/cockpit/client', req.url));
      }
    }

    // Routes client : pas de vérification ici pour éviter les boucles
    // La page /cockpit/client gère elle-même les redirections
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
