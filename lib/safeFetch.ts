import { sanitizeHeaders } from "./headerUtils";

/**
 * Wrapper autour de fetch qui nettoie automatiquement les headers
 * pour éviter les erreurs "non ISO-8859-1 code point"
 */
export async function safeFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  if (!init) {
    return fetch(input);
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

  return fetch(input, safeInit);
}

// Export comme alias pour faciliter la transition
export { safeFetch as fetch };
