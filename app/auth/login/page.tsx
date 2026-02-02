'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Page /auth/login - Redirection vers /login
 * Cette route existe pour compatibilité avec d'anciennes URLs
 */
export default function AuthLoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Rediriger immédiatement vers /login
    router.replace('/login');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0F1C] text-white">
      <div className="animate-pulse">Redirection vers la page de connexion...</div>
    </div>
  );
}
