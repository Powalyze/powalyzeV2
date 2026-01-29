/**
 * 🔥 HOTFIX: Global Fetch Interceptor (PREVENTIVE)
 * 
 * Intercepte TOUS les appels fetch() (y compris Supabase)
 * et encode automatiquement TOUS les headers non-ASCII
 * AVANT qu'ils n'atteignent l'API Headers.set().
 * 
 * Prévient l'erreur :
 * "TypeError: Failed to execute 'set' on 'Headers': String contains non ISO-8859-1 code point"
 */

/**
 * Encode une valeur de header en base64url si elle contient du non-ASCII
 */
function sanitizeHeaderValue(value: string | string[]): string {
  const strValue = Array.isArray(value) ? value.join(', ') : value;
  
  // Vérifier si ASCII pur
  const isAscii = /^[\x00-\x7F]*$/.test(strValue);
  
  if (isAscii) {
    return strValue;
  }
  
  // Encoder en base64url
  try {
    if (typeof btoa !== 'undefined') {
      return btoa(unescape(encodeURIComponent(strValue)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
    }
  } catch {}
  
  // Fallback: supprimer caractères non-ASCII
  return strValue.replace(/[^\x00-\x7F]/g, '');
}

/**
 * Sanitize tous les headers d'une requête
 */
function sanitizeHeaders(headers: HeadersInit | undefined): Headers {
  const sanitized = new Headers();
  
  if (!headers) {
    return sanitized;
  }
  
  try {
    if (headers instanceof Headers) {
      headers.forEach((value, key) => {
        const sanitizedValue = sanitizeHeaderValue(value);
        sanitized.set(key, sanitizedValue);
      });
    } else if (Array.isArray(headers)) {
      headers.forEach(([key, value]) => {
        const sanitizedValue = sanitizeHeaderValue(value);
        sanitized.set(key, sanitizedValue);
      });
    } else {
      Object.entries(headers).forEach(([key, value]) => {
        if (typeof value === 'string' || Array.isArray(value)) {
          const sanitizedValue = sanitizeHeaderValue(value);
          sanitized.set(key, sanitizedValue);
        }
      });
    }
  } catch (error) {
    console.error('[Fetch Interceptor] Error sanitizing headers:', error);
    // Retourner headers sanitized vides plutôt que de crasher
  }
  
  return sanitized;
}

/**
 * Install global fetch interceptor (CLIENT-SIDE ONLY)
 */
export function installFetchInterceptor() {
  if (typeof window === 'undefined') {
    return () => {};
  }
  
  const originalFetch = window.fetch;
  
  // Intercepter fetch globalement
  window.fetch = async (...args: Parameters<typeof fetch>) => {
    const [url, options] = args;
    
    // Sanitize headers PREVENTIVELY
    const sanitizedOptions = options ? { ...options } : {};
    
    if (sanitizedOptions.headers) {
      sanitizedOptions.headers = sanitizeHeaders(sanitizedOptions.headers);
    }
    
    try {
      return await originalFetch(url, sanitizedOptions);
    } catch (error: any) {
      // Log pour debugging
      if (error?.message?.includes('Headers')) {
        console.error('[Fetch Interceptor] Headers error despite prevention:', {
          url,
          error: error.message,
          headers: options?.headers
        });
      }
      
      throw error;
    }
  };
  
  console.log('✅ [Fetch Interceptor] Global fetch interceptor installed');
  
  // Fonction de nettoyage
  return () => {
    window.fetch = originalFetch;
    console.log('🔥 [Fetch Interceptor] Global fetch interceptor removed');
  };
}
