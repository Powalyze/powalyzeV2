// ============================================
// Supabase Client Configuration
// ============================================

// ⚠️ DEPRECATED: Utiliser @/utils/supabase/client ou @/utils/supabase/server
// Ce fichier est conservé pour compatibilité mais NE DOIT PLUS ÊTRE UTILISÉ
// pour éviter les duplications de GoTrueClient

import { createClient } from '@supabase/supabase-js';

function cleanEnv(value?: string) {
  return value?.replace(/^\uFEFF/, '').trim();
}

const supabaseUrl = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL) || 'https://placeholder.supabase.co';
const supabaseAnonKey = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) || 'placeholder-key';

// ⚠️ N'utilisez PAS cette instance dans les composants côté client
// Utilisez plutôt: import { createClient } from '@/utils/supabase/client'
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

// Server-side client with service role key (pour API routes)
export const supabaseAdmin = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  cleanEnv(process.env.SUPABASE_SERVICE_ROLE_KEY) || 'placeholder-service-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  }
);
