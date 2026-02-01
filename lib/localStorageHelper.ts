/**
 * 🔥 HELPERS LOCALSTORAGE - Gestion centralisée
 * 
 * Import : import { loadFromLocalStorage, saveToLocalStorage } from '@/lib/localStorageHelper'
 */

/**
 * Charger des données depuis localStorage
 * @param key - Clé de stockage (préfixe automatique 'powalyze_')
 */
export function loadFromLocalStorage<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(`powalyze_${key}`);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    // Pas de console.log ici
    return null;
  }
}

/**
 * Sauvegarder des données dans localStorage
 * @param key - Clé de stockage (préfixe automatique 'powalyze_')
 * @param value - Données à sauvegarder
 */
export function saveToLocalStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(`powalyze_${key}`, JSON.stringify(value));
  } catch (error) {
    // Pas de console.log ici
  }
}

/**
 * Supprimer une entrée de localStorage
 * @param key - Clé de stockage (préfixe automatique 'powalyze_')
 */
export function removeFromLocalStorage(key: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(`powalyze_${key}`);
  } catch (error) {
    // Pas de console.log ici
  }
}
