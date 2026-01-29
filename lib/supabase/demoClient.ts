import { createClient } from '@supabase/supabase-js';

/**
 * Client Supabase DEMO
 * Utilisé uniquement en mode démonstration (/cockpit/demo)
 * Pointe vers le projet Supabase avec données de démo pré-remplies
 */
export const supabaseDemo = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_DEMO_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_DEMO_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

/**
 * Service role client pour opérations admin en DEMO
 * NE JAMAIS exposer côté client
 */
export const supabaseDemoAdmin = process.env.SUPABASE_DEMO_SERVICE_ROLE_KEY
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_DEMO_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_DEMO_SERVICE_ROLE_KEY
    )
  : null;
