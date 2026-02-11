import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

function cleanEnv(value?: string) {
  if (!value) return '';
  return value.replace(/^\uFEFF/, '').replace(/\r?\n/g, '').trim();
}

export async function createClient() {
  const cookieStore = await cookies()

  const url = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const key = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (!url || !key) {
    throw new Error('Configuration Supabase invalide - variables manquantes (server)');
  }

  return createServerClient(url, key, {
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
