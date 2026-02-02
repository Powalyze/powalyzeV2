// ============================================================
// POWALYZE V2 — AUTH HELPERS
// ============================================================
// Fonctions helper pour l'authentification
// ============================================================

import { createClient } from '@/utils/supabase/server';
import type { Profile } from '@/lib/data-v2';

/**
 * Get current authenticated user
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Get current user profile
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  
  return profile;
}

/**
 * Get current user plan (demo or pro)
 */
export async function getCurrentPlan(): Promise<'demo' | 'pro' | 'enterprise'> {
  const profile = await getCurrentProfile();
  return profile?.plan || 'demo';
}

/**
 * Check if user has pro access
 */
export async function hasProAccess(): Promise<boolean> {
  const plan = await getCurrentPlan();
  return plan === 'pro' || plan === 'enterprise';
}

/**
 * Require authentication (server-side)
 * Throws if user not authenticated
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}

/**
 * Require pro access (server-side)
 * Throws if user doesn't have pro
 */
export async function requirePro() {
  await requireAuth();
  const hasPro = await hasProAccess();
  if (!hasPro) {
    throw new Error('Pro plan required');
  }
}
