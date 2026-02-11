/**
 * Encode une valeur pour qu'elle soit compatible avec les headers HTTP (ISO-8859-1)
 * Les caractères non-ASCII sont encodés en base64
 */
export function encodeHeaderValue(value: string | null | undefined): string {
  if (!value) return "";
  
  // Vérifier si la valeur contient des caractères non-ASCII
  const hasNonASCII = /[^\x00-\x7F]/.test(value);
  
  if (hasNonASCII) {
    // Encoder en base64 pour éviter les erreurs de charset
    return `b64:${btoa(unescape(encodeURIComponent(value)))}`;
  }
  
  return value;
}

/**
 * Décoder une valeur de header qui a été encodée
 */
export function decodeHeaderValue(value: string | null | undefined): string {
  if (!value) return "";
  
  if (value.startsWith("b64:")) {
    try {
      return decodeURIComponent(escape(atob(value.substring(4))));
    } catch {
      return value;
    }
  }
  
  return value;
}

/**
 * Nettoyer un objet headers pour s'assurer que toutes les valeurs sont ASCII-safe
 */
export function sanitizeHeaders(headers: Record<string, string>): Record<string, string> {
  const sanitized: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(headers)) {
    sanitized[key] = encodeHeaderValue(value);
  }
  
  return sanitized;
}
