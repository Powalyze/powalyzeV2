'use client';

import { useEffect } from 'react';

/**
 * Page PowerBI Expertise
 * Redirige vers /expertise
 */
export default function PowerBIPage() {
  useEffect(() => {
    window.location.href = '/expertise';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-white">Redirection...</p>
    </div>
  );
}
