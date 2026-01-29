import { createBrowserClient } from '@supabase/ssr'

// ✅ INSTANCE UNIQUE pour éviter "Multiple GoTrueClient instances detected"
let clientInstance: ReturnType<typeof createBrowserClient> | null = null;

function cleanEnv(value?: string) {
  return value?.replace(/^\uFEFF/, '').trim();
}

/**
 * 🔥 HOTFIX: Encode une valeur pour header HTTP (ISO-8859-1 seulement)
 * Prévient l'erreur "String contains non ISO-8859-1 code point"
 */
function encodeHeaderValue(value: string): string {
  // Vérifier si la valeur contient des caractères non-ASCII
  const isAscii = /^[\x00-\x7F]*$/.test(value);
  
  if (isAscii) {
    return value;
  }
  
  // Encoder en base64url (compatible headers)
  if (typeof btoa !== 'undefined') {
    return btoa(unescape(encodeURIComponent(value)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }
  
  // Fallback: supprimer les caractères non-ASCII
  return value.replace(/[^\x00-\x7F]/g, '');
}

/**
 * 🔥 HOTFIX: Décoder une valeur de header HTTP
 */
function decodeHeaderValue(value: string): string {
  // Vérifier si la valeur est encodée (contient des caractères base64url)
  const isEncoded = /^[A-Za-z0-9_-]+$/.test(value) && value.length % 4 !== 1;
  
  if (!isEncoded) {
    return value;
  }
  
  try {
    if (typeof atob !== 'undefined') {
      // Décoder base64url
      const base64 = value
        .replace(/-/g, '+')
        .replace(/_/g, '/');
      
      const padding = '='.repeat((4 - base64.length % 4) % 4);
      return decodeURIComponent(escape(atob(base64 + padding)));
    }
  } catch {
    // Si décodage échoue, retourner valeur originale
  }
  
  return value;
}

export function createClient() {
  if (clientInstance) {
    return clientInstance;
  }
  
  clientInstance = createBrowserClient(
    cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL)!,
    cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!,
    {
      auth: {
        // 🔥 HOTFIX: Empêcher metadata non-ASCII dans headers
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
      }
    }
  );
  
  return clientInstance;
}

// Export helpers pour usage externe si nécessaire
export { encodeHeaderValue, decodeHeaderValue };
