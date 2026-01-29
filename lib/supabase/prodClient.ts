import { createClient } from '@supabase/supabase-js';

/**
 * Client Supabase PRODUCTION
 * Utilisé pour les vrais clients en mode LIVE (/cockpit)
 * Pointe vers le projet Supabase de production (vide au départ)
 */
export const supabaseProd = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_PROD_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_PROD_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
    }
  }
);

/**
 * Service role client pour opérations admin en PROD
 * NE JAMAIS exposer côté client
 */
export const supabaseProdAdmin = process.env.SUPABASE_PROD_SERVICE_ROLE_KEY
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_PROD_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_PROD_SERVICE_ROLE_KEY,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        }
      }
    )
  : null;

/**
 * Récupérer l'organization_id de l'utilisateur connecté
 */
export async function getOrganizationId(): Promise<string | null> {
  const { data: { session }, error } = await supabaseProd.auth.getSession();
  
  if (error || !session) {
    console.warn('⚠️ [LIVE] Aucune session active');
    return null;
  }
  
  const organizationId = session.user.user_metadata?.organization_id;
  
  if (!organizationId) {
    console.error('❌ [LIVE] Utilisateur sans organization_id:', session.user.id, session.user.email);
    return null;
  }
  
  console.log('✅ [LIVE] Organization ID:', organizationId);
  return organizationId;
}

/**
 * Récupérer le profil complet de l'utilisateur
 */
export async function getUserProfile() {
  const { data: { session }, error } = await supabaseProd.auth.getSession();
  
  if (error || !session) {
    return null;
  }
  
  return {
    id: session.user.id,
    email: session.user.email,
    organizationId: session.user.user_metadata?.organization_id,
    role: session.user.user_metadata?.role_global || 'lecteur',
    metadata: session.user.user_metadata,
  };
}
