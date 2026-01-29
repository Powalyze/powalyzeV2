import { createClient } from '@supabase/supabase-js';

/**
 * Client Supabase PRODUCTION
 * Utilisé pour les vrais clients en mode LIVE (/cockpit)
 * Pointe vers le projet Supabase de production (vide au départ)
 */
export const supabaseProd = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_PROD_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_PROD_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

/**
 * Service role client pour opérations admin en PROD
 * NE JAMAIS exposer côté client
 */
export const supabaseProdAdmin = process.env.SUPABASE_PROD_SERVICE_ROLE_KEY
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_PROD_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_PROD_SERVICE_ROLE_KEY
    )
  : null;
