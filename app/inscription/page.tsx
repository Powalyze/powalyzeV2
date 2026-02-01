'use client';

import { useEffect } from 'react';

/**
 * Page Inscription
 * Redirige vers /signup
 */
export default function InscriptionPage() {
  useEffect(() => {
    window.location.href = '/signup';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-white">Redirection vers inscription...</p>
    </div>
  );
}
