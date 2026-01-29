/**
 * Singleton client for browser-side Supabase operations
 * This ensures only ONE GoTrueClient instance is created
 */

import { supabaseProd } from '@/lib/supabase/prodClient';

export function createClient() {
  // supabaseProd is already a singleton, no warning needed
  return supabaseProd;
}

// Re-export helpers
export { encodeHeaderValue, decodeHeaderValue } from '@/lib/supabase/client';
