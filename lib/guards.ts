// ====================================================================
// GUARDS: PROTECTION DES ROUTES DEMO/PRO
// ====================================================================
// Middleware pour empêcher la fuite de données entre MODE DEMO et MODE PRO
// Vérifie le mode utilisateur et redirige si nécessaire
// ====================================================================

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export type UserMode = 'demo' | 'pro';

/**
 * Vérifie le mode de l'utilisateur (demo ou pro) depuis la table profiles
 */
export async function getUserMode(): Promise<UserMode | null> {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return null;
  }

  // Récupérer le mode depuis la table profiles
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('mode')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    console.warn('[Guard] Profil non trouvé, mode par défaut: demo');
    return 'demo';
  }

  return (profile.mode as UserMode) || 'demo';
}

/**
 * Guard pour les routes /cockpit (MODE PRO uniquement)
 * Redirige vers /cockpit-demo si l'utilisateur est en mode demo
 */
export async function guardProRoute(): Promise<void> {
  const mode = await getUserMode();
  
  if (!mode) {
    redirect('/login');
  }

  if (mode === 'demo') {
    console.log('[Guard] Redirection DEMO → PRO bloquée, utilisateur en mode demo');
    redirect('/cockpit-demo');
  }
}

/**
 * Guard pour les routes /cockpit-demo (MODE DEMO uniquement)
 * Redirige vers /cockpit si l'utilisateur est en mode pro
 */
export async function guardDemoRoute(): Promise<void> {
  const mode = await getUserMode();
  
  if (!mode) {
    redirect('/login');
  }

  if (mode === 'pro') {
    console.log('[Guard] Redirection PRO → DEMO bloquée, utilisateur en mode pro');
    redirect('/cockpit');
  }
}

/**
 * Guard flexible: retourne le mode et laisse la page décider
 */
export async function checkUserMode(): Promise<{ mode: UserMode | null; isAuthenticated: boolean }> {
  const mode = await getUserMode();
  return {
    mode,
    isAuthenticated: mode !== null
  };
}

/**
 * Vérifie que l'utilisateur a accès à la ressource
 * Empêche les fuites de données entre DEMO et PRO
 */
export async function guardResourceAccess(tableName: string): Promise<void> {
  const mode = await getUserMode();
  
  if (!mode) {
    throw new Error("Non authentifié");
  }

  // Vérifier que la table correspond au mode
  const isDemoTable = tableName.startsWith('demo_');
  const isProTable = !isDemoTable;

  if (mode === 'demo' && isProTable) {
    throw new Error("Accès refusé: utilisateur en mode DEMO ne peut pas accéder aux tables PRO");
  }

  if (mode === 'pro' && isDemoTable) {
    throw new Error("Accès refusé: utilisateur en mode PRO ne peut pas accéder aux tables DEMO");
  }
}
