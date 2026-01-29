/**
 * ⚠️ DEPRECATED - Utiliser lib/supabase/prodClient.ts à la place
 * Ce fichier est gardé pour compatibilité avec le code existant
 * 
 * MIGRATION:
 * - import { createClient } from '@/utils/supabase/client'  ❌
 * + import { supabaseProd } from '@/lib/supabase/prodClient'  ✅
 */

import { supabaseProd } from '@/lib/supabase/prodClient';

export function createClient() {
  console.warn('⚠️ createClient() est deprecated, utilisez supabaseProd directement');
  return supabaseProd;
}

// Re-export helpers
export { encodeHeaderValue, decodeHeaderValue } from '@/lib/supabase/client';
