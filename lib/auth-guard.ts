/**
 * Auth Guard - Prévient les accès non autorisés
 */

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    // Vérifier si un cookie de session Supabase existe
    const cookies = document.cookie.split(';');
    const hasSupabaseSession = cookies.some(cookie => 
      cookie.trim().startsWith('sb-') && cookie.includes('-auth-token')
    );
    
    return hasSupabaseSession;
  } catch {
    return false;
  }
}

export function redirectToSignup() {
  if (typeof window !== 'undefined') {
    window.location.href = '/signup';
  }
}
