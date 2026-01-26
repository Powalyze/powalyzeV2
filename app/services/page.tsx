"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ServicesPage() {
  const router = useRouter();

  useEffect(() => {
    // Rediriger immédiatement vers login
    router.push('/login?redirect=/services&message=Veuillez vous connecter pour accéder aux Services');
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
        <p className="text-slate-400 mt-4">Redirection...</p>
      </div>
    </div>
  );
}

