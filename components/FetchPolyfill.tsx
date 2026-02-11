"use client";

import { useEffect } from 'react';
import { sanitizeHeaders } from '@/lib/headerUtils';

/**
 * Composant qui applique un polyfill global pour fetch
 * afin d'éviter les erreurs ISO-8859-1 sur tous les appels fetch
 */
export function FetchPolyfill() {
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.__fetchPolyfillApplied) {
      const originalFetch = window.fetch;

      window.fetch = function(
        input: RequestInfo | URL,
        init?: RequestInit
      ): Promise<Response> {
        // Si pas d'init, appeler fetch normalement
        if (!init) {
          return originalFetch(input, init);
        }

        const safeInit = { ...init };

        // Nettoyer les headers si présents
        if (init.headers) {
          if (init.headers instanceof Headers) {
            // Convertir Headers en objet puis nettoyer
            const headersObj: Record<string, string> = {};
            init.headers.forEach((value, key) => {
              headersObj[key] = value;
            });
            safeInit.headers = sanitizeHeaders(headersObj);
          } else if (Array.isArray(init.headers)) {
            // Convertir array en objet puis nettoyer
            const headersObj: Record<string, string> = {};
            init.headers.forEach(([key, value]) => {
              headersObj[key] = value;
            });
            safeInit.headers = sanitizeHeaders(headersObj);
          } else {
            // Déjà un objet, nettoyer directement
            safeInit.headers = sanitizeHeaders(init.headers as Record<string, string>);
          }
        }

        return originalFetch(input, safeInit);
      };

      // Marquer comme appliqué pour éviter les doublons
      window.__fetchPolyfillApplied = true;
    }
  }, []);

  return null;
}

// Extension du type Window pour TypeScript
declare global {
  interface Window {
    __fetchPolyfillApplied?: boolean;
  }
}
