'use client';

import { useEffect } from 'react';
import { installFetchInterceptor } from '@/utils/fetch-interceptor';

/**
 * 🔥 HOTFIX: Provider pour installer l'intercepteur fetch global
 * 
 * Installe un intercepteur fetch qui encode automatiquement
 * TOUS les headers non-ASCII AVANT l'appel fetch().
 * 
 * Prévient l'erreur :
 * "TypeError: Failed to execute 'set' on 'Headers': String contains non ISO-8859-1 code point"
 */
export function FetchInterceptorProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Installer l'intercepteur au montage
    const cleanup = installFetchInterceptor();
    
    // Nettoyer au démontage
    return cleanup;
  }, []);
  
  return <>{children}</>;
}
