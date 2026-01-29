// ================================================================
// SUPABASE SINGLETON - FIX GoTrueClient Multiple Instances
// ================================================================
// Instance unique de Supabase pour éviter les warnings console

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;
let supabaseAdminInstance: SupabaseClient | null = null;

function cleanEnv(value?: string) {
  return value?.replace(/^\uFEFF/, '').trim();
}

const supabaseUrl = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL) || '';
const supabaseAnonKey = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) || '';
const supabaseServiceKey = cleanEnv(process.env.SUPABASE_SERVICE_ROLE_KEY) || '';

// ================================================================
// SINGLETON CLIENT (Mode DEMO si pas de credentials)
// ================================================================

export function getSupabaseClient(): SupabaseClient {
  if (!supabaseInstance) {
    supabaseInstance = createClient(
      supabaseUrl || 'https://placeholder.supabase.co',
      supabaseAnonKey || 'placeholder-key',
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false
        }
      }
    );
  }
  return supabaseInstance;
}

// ================================================================
// SINGLETON ADMIN (Service Role)
// ================================================================

export function getSupabaseAdmin(): SupabaseClient {
  if (!supabaseAdminInstance) {
    supabaseAdminInstance = createClient(
      supabaseUrl || 'https://placeholder.supabase.co',
      supabaseServiceKey || 'placeholder-service-key',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false
        }
      }
    );
  }
  return supabaseAdminInstance;
}

// Exports pour compatibilité
export const supabase = getSupabaseClient();
export const supabaseAdmin = getSupabaseAdmin();
