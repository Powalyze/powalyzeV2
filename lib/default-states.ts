/**
 * Default states for cockpit modules
 * BLOC UNIQUE - ÉTAPE 3: Règles de parité PRO = DEMO
 */

/**
 * RÈGLE 3 - Timeline par défaut (comme la démo)
 */
export function getDefaultTimelineMessage(): string {
  return "Votre timeline est vide. Ajoutez un risque, une décision ou un événement.";
}

/**
 * RÈGLE 4 - Reporting par défaut (comme la démo)
 */
export function getDefaultReportsMessage(): string {
  return "Aucun rapport généré pour le moment.";
}

/**
 * RÈGLE 1 - Vérifier si on doit afficher un loader ou un empty state
 */
export function shouldShowLoader(data: any[] | undefined): boolean {
  // Si undefined, on charge encore (afficher loader)
  // Si tableau vide, on affiche l'empty state
  return data === undefined;
}

/**
 * RÈGLE 1 - Vérifier si on doit afficher un empty state
 */
export function shouldShowEmptyState(data: any[] | undefined): boolean {
  // Si tableau défini et vide, afficher empty state
  return Array.isArray(data) && data.length === 0;
}
