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

  if (!session && !isDemoPath) {
    const redirectUrl = new URL('/signup', req.url);
    redirectUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: ["/cockpit/:path*", "/tarifs", "/welcome"]
};
