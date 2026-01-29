/**
 * 🔥 INSTANCE SUPABASE UNIQUE (Centralisée)
 * 
 * Tous les imports Supabase doivent utiliser ce fichier.
 * Prévient "Multiple GoTrueClient instances detected"
 * 
 * Import : import { supabase, supabaseAdmin } from '@/lib/supabase/client'
 */

import { createClient } from '@supabase/supabase-js';

// ========================================
// HELPERS ENCODING (Headers ISO-8859-1)
// ========================================

function cleanEnv(value?: string) {
  return value?.replace(/^\uFEFF/, '').trim();
}

export function encodeHeaderValue(value: string): string {
  const isAscii = /^[\x00-\x7F]*$/.test(value);
  if (isAscii) return value;
  
  if (typeof btoa !== 'undefined') {
    return btoa(unescape(encodeURIComponent(value)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }
  
  return value.replace(/[^\x00-\x7F]/g, '');
}

export function decodeHeaderValue(value: string): string {
  const isEncoded = /^[A-Za-z0-9_-]+$/.test(value) && value.length % 4 !== 1;
  if (!isEncoded) return value;
  
  try {
    if (typeof atob !== 'undefined') {
      const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
      const padding = '='.repeat((4 - base64.length % 4) % 4);
      return decodeURIComponent(escape(atob(base64 + padding)));
    }
  } catch {}
  
  return value;
}

// ========================================
// INSTANCE UNIQUE SUPABASE CLIENT
// ========================================

const supabaseUrl = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
const supabaseAnonKey = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const supabaseServiceKey = cleanEnv(process.env.SUPABASE_SERVICE_ROLE_KEY);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables Supabase manquantes');
}

/**
 * ✅ Client Supabase UNIQUE (Browser)
 * Utilise anon key, authentifié via RLS
 */
export const supabase = createClient(
  supabaseUrl!,
  supabaseAnonKey!,
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
 * ✅ Admin Supabase (Server-side ONLY)
 * Utilise service role key, bypass RLS
 * ⚠️ NE JAMAIS exposer côté client
 */
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl!, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

// ========================================
// VALIDATION SESSION
// ========================================

/**
 * Vérifie si l'utilisateur a une organization_id valide
 * @returns organization_id ou null
 */
export async function getOrganizationId(): Promise<string | null> {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      console.warn('⚠️ Aucune session active');
      return null;
    }
    
    // Récupérer organization_id depuis user_metadata
    const organizationId = session.user.user_metadata?.organization_id;
    
    if (!organizationId) {
      console.error('❌ Utilisateur sans organization_id:', session.user.id);
      return null;
    }
    
    console.log('✅ Organization ID:', organizationId);
    return organizationId;
  } catch (err) {
    console.error('❌ Erreur getOrganizationId:', err);
    return null;
  }
}

/**
 * Récupère les données utilisateur complètes
 */
export async function getUserProfile() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;
  
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();
  
  if (error) {
    console.error('❌ Erreur getUserProfile:', error);
    return null;
  }
  
  return data;
}
