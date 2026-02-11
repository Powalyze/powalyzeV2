import { createBrowserClient } from '@supabase/ssr'

// ✅ INSTANCE UNIQUE pour éviter "Multiple GoTrueClient instances detected"
let clientInstance: ReturnType<typeof createBrowserClient> | null = null;

// Nettoie les variables d'environnement des caractères invisibles (BOM, retours à la ligne)
function cleanEnv(value?: string): string {
  if (!value) return '';
  return value.replace(/^\uFEFF/, '').replace(/\r?\n/g, '').trim();
}

export function createClient() {
  if (clientInstance) {
    return clientInstance;
  }

  const url = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const key = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (!url || !key) {
    console.error('❌ Variables Supabase manquantes:', {
      url: url ? 'OK' : 'MANQUANT',
      key: key ? 'OK' : 'MANQUANT'
    });
    throw new Error('Configuration Supabase invalide');
  }
  
  clientInstance = createBrowserClient(url, key);
  
  return clientInstance;
}
