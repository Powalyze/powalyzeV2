// ============================================================================
// Hook useProfile - Récupère le profil de l'utilisateur connecté
// ============================================================================

'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export interface Profile {
  id: string;
  email: string;
  mode: 'pro' | 'demo';
  created_at: string;
}

export function useProfile() {
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setProfile(data as Profile);
    } catch (error) {
      console.error('[useProfile] Error:', error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }

  return { profile, loading };
}
