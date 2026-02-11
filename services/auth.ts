// services/auth.ts
'use client';

import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import { safeFetch } from '@/lib/safeFetch';

export function getSupabase() {
  return createSupabaseBrowserClient();
}

export async function signup(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  company?: string
) {
  const res = await safeFetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, firstName, lastName, company })
  });

  const data = await res.json();
  if (!res.ok) {
    return { error: { message: data?.error || 'Erreur inconnue' }, needsEmailConfirmation: false };
  }

  return { error: null, needsEmailConfirmation: data?.needsEmailConfirmation ?? true };
}

export async function login(email: string, password: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  
  console.log('🔐 [AUTH SERVICE] Login:', { 
    hasSession: !!data?.session, 
    hasUser: !!data?.user,
    error: error?.message 
  });
  
  return { data, error };
}

export async function logout() {
  const supabase = getSupabase();
  await supabase.auth.signOut();
}
