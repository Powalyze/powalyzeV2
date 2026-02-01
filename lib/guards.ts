// ====================================================================
// GUARDS: PROTECTION DES ROUTES DEMO/PRO
// ====================================================================
// Protection stricte des routes selon les rôles (demo/pro/admin)
// Empêche toute fuite de données entre environnements
// ====================================================================

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { supabase as clientSupabase } from './supabase';

export type UserRole = 'demo' | 'pro' | 'pro-owner' | 'pro-member' | 'admin';

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
    .eq('id', user.id)
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
      redirect('/cockpit/pro');
    } else {
      redirect('/');
    }
  }
}

/**
 * Guard PRO: Protège les routes /cockpit (PRO uniquement)
 * Autorise les utilisateurs avec role = 'pro-owner' ou 'pro-member' ou 'admin'
 */
export async function guardPro(): Promise<void> {
  const role = await getUserRole();
  
  if (!role) {
    console.warn('[GUARD PRO] Non authentifié - redirection vers login');
    redirect('/login?redirect=/cockpit');
  }

  if (role !== 'pro-owner' && role !== 'pro-member' && role !== 'admin') {
    console.warn(`[GUARD PRO] Accès refusé - rôle: ${role}, attendu: pro-owner, pro-member ou admin`);
    logUnauthorizedAccess('/cockpit', 'pro-owner|pro-member', role);
    
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
      redirect('/cockpit/pro');
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

/**
 * Vérifie que l'utilisateur a accès à la ressource
 * Empêche les fuites de données entre DEMO et PRO
 */
export async function guardResourceAccess(tableName: string): Promise<void> {
  const role = await getUserRole();
  
  if (!role) {
    throw new Error("Non authentifié");
  }

  // Vérifier que la table correspond au rôle
  const isDemoTable = tableName.startsWith('demo_');
  const isProTable = !isDemoTable;

  if (role === 'demo' && isProTable) {
    throw new Error("Accès refusé: utilisateur DEMO ne peut pas accéder aux tables PRO");
  }

  if ((role === 'pro' || role === 'admin') && isDemoTable) {
    throw new Error("Accès refusé: utilisateur PRO/ADMIN ne peut pas accéder aux tables DEMO");
  }
}
