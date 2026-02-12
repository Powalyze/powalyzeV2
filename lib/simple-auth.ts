/**
 * AUTH SIMPLE - Système de vérification localStorage
 * Remplace le système Supabase complexe par quelque chose de basique qui fonctionne
 */

export function checkSimpleAuth(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const authData = localStorage.getItem('powalyze_auth');
    if (!authData) return false;
    
    const token = JSON.parse(authData);
    
    // Vérifier que le token a moins de 24h
    const age = Date.now() - (token.timestamp || 0);
    const maxAge = 24 * 60 * 60 * 1000; // 24 heures
    
    if (age > maxAge) {
      localStorage.removeItem('powalyze_auth');
      return false;
    }
    
    return !!(token.email && token.hasPro);
  } catch {
    return false;
  }
}

export function getSimpleAuthUser() {
  if (typeof window === 'undefined') return null;
  
  try {
    const authData = localStorage.getItem('powalyze_auth');
    if (!authData) return null;
    
    return JSON.parse(authData);
  } catch {
    return null;
  }
}

export function simpleLogout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('powalyze_auth');
  }
}
