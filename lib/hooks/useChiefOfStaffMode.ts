/**
 * Hook de sélection automatique du mode Chief of Staff IA
 * 
 * Détermine automatiquement si on affiche :
 * - ChiefOfStaffDemo (mode Pro, actions fixes)
 * - ChiefOfStaffClient (mode Client, actions réelles)
 */

import { usePathname } from "next/navigation";

export type ChiefOfStaffMode = "demo" | "client";

/**
 * Détecte automatiquement le mode en fonction de l'URL et du contexte
 * 
 * @returns "demo" pour la vitrine Pro, "client" pour le cockpit client
 */
export function useChiefOfStaffMode(): ChiefOfStaffMode {
  const pathname = usePathname();

  // Mode DEMO : pages de vitrine, démo, pro
  const isDemoRoute =
    pathname?.startsWith("/vitrine") ||
    pathname?.startsWith("/pro") ||
    pathname?.startsWith("/demo") ||
    pathname === "/";

  // Mode CLIENT : cockpit client réel
  const isClientRoute =
    pathname?.startsWith("/cockpit") ||
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/cockpit-client");

  // Par défaut, si on est dans une route de cockpit, on est en mode client
  if (isClientRoute) {
    return "client";
  }

  // Sinon, mode démo
  return "demo";
}

/**
 * Détermine le mode en fonction d'une organisation ID
 * 
 * @param organizationId - ID de l'organisation (si "demo" ou undefined → mode demo)
 * @returns "demo" ou "client"
 */
export function getChiefOfStaffModeByOrg(
  organizationId?: string | null
): ChiefOfStaffMode {
  // Si pas d'organisation ou organisation "demo", on est en mode démo
  if (!organizationId || organizationId === "demo" || organizationId === "00000000-0000-0000-0000-000000000000") {
    return "demo";
  }

  // Sinon, mode client
  return "client";
}

/**
 * Hook combiné qui utilise à la fois l'URL et l'organisation
 * 
 * @param organizationId - ID de l'organisation (optionnel)
 * @returns "demo" ou "client"
 */
export function useChiefOfStaffModeAdvanced(
  organizationId?: string | null
): ChiefOfStaffMode {
  const routeMode = useChiefOfStaffMode();
  const orgMode = getChiefOfStaffModeByOrg(organizationId);

  // Si l'organisation indique mode démo, on force le mode démo
  if (orgMode === "demo") {
    return "demo";
  }

  // Sinon, on respecte le mode déterminé par la route
  return routeMode;
}
