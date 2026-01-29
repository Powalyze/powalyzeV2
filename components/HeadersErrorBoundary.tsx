'use client';

import { useEffect } from 'react';

/**
 * 🔥 HOTFIX: Error Boundary pour intercepter les erreurs Headers non-ASCII
 * Prévient l'erreur "Failed to execute 'set' on 'Headers': String contains non ISO-8859-1 code point"
 */
export function HeadersErrorBoundary({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Sauvegarder le fetch original
    const originalFetch = window.fetch;
    
    // Intercepter fetch globalement
    window.fetch = async (...args: Parameters<typeof fetch>) => {
      try {
        return await originalFetch(...args);
      } catch (error) {
        // Détecter erreur Headers spécifique
        if (error instanceof TypeError && error.message.includes('Headers')) {
          console.error('[HeadersErrorBoundary] Erreur Headers détectée:', error);
          console.warn('[HeadersErrorBoundary] Tentative de retry avec headers sanitized...');
          
          // Retry avec headers sanitized
          const [url, options] = args;
          
          if (options?.headers) {
            const sanitizedHeaders = new Headers();
            
            // Sanitizer tous les headers
            const headersToSanitize = options.headers instanceof Headers
              ? Array.from(options.headers.entries())
              : Object.entries(options.headers);
            
            for (const [key, value] of headersToSanitize) {
              if (typeof value === 'string') {
                // Vérifier si non-ASCII
                const isAscii = /^[\x00-\x7F]*$/.test(value);
                
                if (!isAscii) {
                  console.warn(`[HeadersErrorBoundary] Header non-ASCII: ${key} = ${value.substring(0, 20)}...`);
                  
                  // Encoder en base64url
                  try {
                    const encoded = btoa(unescape(encodeURIComponent(value)))
                      .replace(/\+/g, '-')
                      .replace(/\//g, '_')
                      .replace(/=/g, '');
                    
                    sanitizedHeaders.append(key, encoded);
                  } catch {
                    // Si encodage échoue, supprimer les caractères non-ASCII
                    sanitizedHeaders.append(key, value.replace(/[^\x00-\x7F]/g, ''));
                  }
                } else {
                  sanitizedHeaders.append(key, value);
                }
              } else if (Array.isArray(value)) {
                // Tableau de valeurs
                value.forEach(v => {
                  const isAscii = /^[\x00-\x7F]*$/.test(v);
                  sanitizedHeaders.append(key, isAscii ? v : v.replace(/[^\x00-\x7F]/g, ''));
                });
              }
            }
            
            // Retry avec headers sanitized
            return originalFetch(url, { ...options, headers: sanitizedHeaders });
          }
        }
        
        // Re-throw si erreur non liée aux headers
        throw error;
      }
    };
    
    // Cleanup: restaurer fetch original
    return () => {
      window.fetch = originalFetch;
    };
  }, []);
  
  return <>{children}</>;
}
