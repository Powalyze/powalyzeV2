// ====================================================================
// GUARDS: PROTECTION DES ROUTES DEMO/PRO
// ====================================================================
// Protection stricte des routes selon les rôles (demo/pro/admin)
// Empêche toute fuite de données entre environnements
// ====================================================================

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { supabase as clientSupabase } from './supabase';

export type UserRole = 'demo' | 'pro' | 'admin';

/**
 * Récupère le rôle de l'utilisateur depuis Supabase
 * Version serveur (Server Components)
 */
export async function getUserRole(): Promise<UserRole | null> {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return null;
  }

  // Récupérer le rôle depuis la table profiles
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (profileError || !profile) {
    console.warn('[Guard] Profil non trouvé, rôle par défaut: demo');
    return 'demo';
  }

  return (profile.role as UserRole) || 'demo';
}

/**
 * Récupère le rôle de l'utilisateur (version client)
 */
export async function getUserRoleClient(): Promise<UserRole | null> {
  const { data: { session } } = await clientSupabase.auth.getSession();
  
  if (!session) {
    return null;
  }

  const { data, error } = await clientSupabase
    .from('profiles')
    .select('role')
    .eq('user_id', session.user.id)
    .single();

  if (error || !data) {
    console.error('[Guard Client] Error fetching user role:', error);
    return null;
  }

  return data.role as UserRole;
}

/**
 * Guard DEMO: Protège les routes /cockpit-demo
 * Autorise uniquement les utilisateurs avec role = 'demo'
 */
export async function guardDemo(): Promise<void> {
  const role = await getUserRole();
  
  if (!role) {
    console.warn('[GUARD DEMO] Non authentifié - redirection vers login');
    redirect('/login?redirect=/cockpit-demo');
  }

  if (role !== 'demo') {
    console.warn(`[GUARD DEMO] Accès refusé - rôle: ${role}, attendu: demo`);
    logUnauthorizedAccess('/cockpit-demo', 'demo', role);
    
    // Rediriger selon le rôle
    if (role === 'pro' || role === 'admin') {
      redirect('/cockpit');
    } else {
      redirect('/');
    }
  }
}

/**
 * Guard PRO: Protège les routes /cockpit (PRO uniquement)
 * Autorise les utilisateurs avec role = 'pro' ou 'admin'
 */
export async function guardPro(): Promise<void> {
  const role = await getUserRole();
  
  if (!role) {
    console.warn('[GUARD PRO] Non authentifié - redirection vers login');
    redirect('/login?redirect=/cockpit');
  }

  if (role !== 'pro' && role !== 'admin') {
    console.warn(`[GUARD PRO] Accès refusé - rôle: ${role}, attendu: pro ou admin`);
    logUnauthorizedAccess('/cockpit', 'pro', role);
    
    // Rediriger selon le rôle
    if (role === 'demo') {
      redirect('/cockpit-demo');
    } else {
      redirect('/');
    }
  }
}

/**
 * Guard ADMIN: Protège les routes /admin
 * Autorise uniquement les utilisateurs avec role = 'admin'
 */
export async function guardAdmin(): Promise<void> {
  const role = await getUserRole();
  
  if (!role) {
    console.warn('[GUARD ADMIN] Non authentifié - redirection vers login');
    redirect('/login');
  }

  if (role !== 'admin') {
    console.warn(`[GUARD ADMIN] Accès refusé - rôle: ${role}, attendu: admin`);
    logUnauthorizedAccess('/admin', 'admin', role);
    
    // Rediriger selon le rôle
    if (role === 'demo') {
      redirect('/cockpit-demo');
    } else if (role === 'pro') {
      redirect('/cockpit');
    } else {
      redirect('/');
    }
  }
}

/**
 * Helper: Log des tentatives d'accès non autorisées
 * Pour monitoring et alerting de sécurité
 */
function logUnauthorizedAccess(
  path: string,
  expectedRole: string,
  actualRole: UserRole | null
) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    path,
    expected_role: expectedRole,
    actual_role: actualRole,
    severity: 'warning',
    event: 'unauthorized_access_attempt'
  };

  console.warn('[SECURITY] Tentative d\'accès non autorisée:', logEntry);

  // TODO: Envoyer à un service de monitoring
  // - Sentry pour tracking des erreurs
  // - Datadog pour métriques de sécurité
  // - Webhook pour alertes temps réel
  // await sendToMonitoring(logEntry);
}
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
