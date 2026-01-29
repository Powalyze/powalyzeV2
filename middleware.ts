import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * 🔥 HOTFIX: Sanitize header value (ISO-8859-1 only)
 */
function sanitizeHeaderValue(value: string): string {
  // Vérifier si la valeur contient des caractères non-ASCII
  const isAscii = /^[\x00-\x7F]*$/.test(value);
  if (isAscii) return value;
  
  // Encoder en base64url si non-ASCII
  try {
    return Buffer.from(value, 'utf-8').toString('base64url');
  } catch {
    // Fallback: supprimer les caractères non-ASCII
    return value.replace(/[^\x00-\x7F]/g, '');
  }
}

export async function middleware(req: NextRequest) {
  let res = NextResponse.next();

  // ✅ Créer client SSR uniquement pour auth (nécessaire pour cookies)
  // Cette instance est éphémère et ne persiste pas côté client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          // 🔥 HOTFIX: Sanitize cookie value avant set
          const sanitizedValue = sanitizeHeaderValue(value);
          res.cookies.set({ name, value: sanitizedValue, ...options });
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
