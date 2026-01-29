import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Singleton instances
let supabaseProdInstance: SupabaseClient | null = null;
let supabaseProdAdminInstance: SupabaseClient | null = null;

/**
 * Get PRODUCTION Supabase client (singleton)
 * Used for real clients in LIVE mode (/cockpit)
 * Points to production Supabase project
 */
export function getSupabaseProd(): SupabaseClient {
  if (supabaseProdInstance) {
    return supabaseProdInstance;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_PROD_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_PROD_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!url || !key) {
    throw new Error('Missing Supabase PROD environment variables');
  }

  supabaseProdInstance = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
    }
  });

  return supabaseProdInstance;
}

/**
 * Legacy export for backward compatibility
 */
export const supabaseProd = new Proxy({} as SupabaseClient, {
  get(target, prop) {
    return getSupabaseProd()[prop as keyof SupabaseClient];
  }
});

/**
 * Get service role client for admin operations in PROD (singleton)
 * NEVER expose on client side
 */
export function getSupabaseProdAdmin(): SupabaseClient | null {
  if (supabaseProdAdminInstance) {
    return supabaseProdAdminInstance;
  }

  const serviceRoleKey = process.env.SUPABASE_PROD_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    return null;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_PROD_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  if (!url) {
    return null;
  }

  supabaseProdAdminInstance = createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  });

  return supabaseProdAdminInstance;
}

/**
 * Legacy export for backward compatibility
 */
export const supabaseProdAdmin = new Proxy({} as SupabaseClient, {
  get(target, prop) {
    const admin = getSupabaseProdAdmin();
    if (!admin) return undefined;
    return admin[prop as keyof SupabaseClient];
  }
});

/**
 * Get organization_id of connected user
 */
export async function getOrganizationId(): Promise<string | null> {
  const supabase = getSupabaseProd();
  const { data: { session }, error } = await supabase.auth.getSession();
  
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
