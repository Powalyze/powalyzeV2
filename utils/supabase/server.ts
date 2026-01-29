import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

function cleanEnv(value?: string) {
  return value?.replace(/^\uFEFF/, '').trim();
}

/**
 * 🔥 HOTFIX: Encode une valeur pour header HTTP (ISO-8859-1 seulement)
 * Prévient l'erreur "String contains non ISO-8859-1 code point"
 */
function encodeHeaderValue(value: string): string {
  const isAscii = /^[\x00-\x7F]*$/.test(value);
  if (isAscii) return value;
  
  // Node.js: Buffer.from disponible
  return Buffer.from(value, 'utf-8').toString('base64url');
}

/**
 * 🔥 HOTFIX: Décoder une valeur de header HTTP
 */
function decodeHeaderValue(value: string): string {
  const isEncoded = /^[A-Za-z0-9_-]+$/.test(value) && value.length % 4 !== 1;
  if (!isEncoded) return value;
  
  try {
    return Buffer.from(value, 'base64url').toString('utf-8');
  } catch {
    return value;
  }
}

export { encodeHeaderValue, decodeHeaderValue };

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL)!,
    cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
