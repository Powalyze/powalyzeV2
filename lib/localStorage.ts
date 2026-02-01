/**
 * LOCALSTORAGE UTILITIES - Sans logs, sans effets de bord
 * Fonctions pures pour lire/écrire dans localStorage
 */

/**
 * Charge une valeur depuis localStorage
 * @param key - Clé localStorage
 * @returns Valeur parsée ou null
 */
export function loadFromLocalStorage<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/**
 * Sauvegarde une valeur dans localStorage
 * @param key - Clé localStorage
 * @param value - Valeur à sauvegarder
 */
export function saveToLocalStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Silent fail
  }
}

/**
 * Supprime une clé de localStorage
 * @param key - Clé à supprimer
 */
export function removeFromLocalStorage(key: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(key);
  } catch {
    // Silent fail
  }
}

/**
 * Vérifie si une clé existe dans localStorage
 * @param key - Clé à vérifier
 */
export function hasLocalStorageKey(key: string): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    return localStorage.getItem(key) !== null;
  } catch {
    return false;
  }
}
