import { createBrowserClient } from '@supabase/ssr'

// ✅ INSTANCE UNIQUE pour éviter "Multiple GoTrueClient instances detected"
let clientInstance: ReturnType<typeof createBrowserClient> | null = null;

function cleanEnv(value?: string) {
  return value?.replace(/^\uFEFF/, '').trim();
}

export function createClient() {
  if (clientInstance) {
    return clientInstance;
  }
  
  clientInstance = createBrowserClient(
    cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL)!,
    cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!
  );
  
  return clientInstance;
}
