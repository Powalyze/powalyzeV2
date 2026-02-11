import { createClient } from "@supabase/supabase-js";
import { createServerClient, createBrowserClient } from "@supabase/ssr";

// Nettoie les variables d'environnement des caractères invisibles (BOM, retours à la ligne)
function cleanEnv(value?: string): string {
  if (!value) return '';
  return value.replace(/^\uFEFF/, '').replace(/\r?\n/g, '').trim();
}

const supabaseUrl = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
const supabaseKey = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables Supabase manquantes:', {
    url: supabaseUrl ? 'OK' : 'MANQUANT',
    key: supabaseKey ? 'OK' : 'MANQUANT'
  });
  throw new Error('Configuration Supabase invalide - variables d\'environnement manquantes');
}

// Client basique (legacy, à éviter pour SSR)
export const supabase = createClient(supabaseUrl, supabaseKey);

// Fonction helper pour client browser avec SSR (RECOMMANDÉ)
export function createSupabaseBrowserClient() {
  // Utilise createBrowserClient pour une gestion optimale des cookies en SSR
  return createBrowserClient(supabaseUrl, supabaseKey);
}

// Fonction helper pour compatibilité avec l'ancien code (server-side avec cookies)
export async function createSupabaseServerClient() {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();

  // Utiliser les mêmes variables nettoyées
  const cleanUrl = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const cleanKey = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (!cleanUrl || !cleanKey) {
    throw new Error('Configuration Supabase invalide - variables d\'environnement manquantes (server)');
  }

  return createServerClient(cleanUrl, cleanKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        try {
          cookieStore.set(name, value, options);
        } catch {
          // Ignore dans les Server Components
        }
      },
      remove(name: string, options: any) {
        try {
          cookieStore.delete(name);
        } catch {
          // Ignore dans les Server Components
        }
      },
    },
  });
}
