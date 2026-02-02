'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CockpitShell } from "@/components/cockpit/CockpitShell";
import { Loader2 } from "lucide-react";

export default function CockpitIndexPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirection automatique vers le cockpit Pro
    router.push('/cockpit/projets');
  }, [router]);

  return (
    <CockpitShell>
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center space-y-4">
          <Loader2 size={48} className="text-amber-400 animate-spin mx-auto" />
          <p className="text-lg text-slate-400">
            Chargement de votre cockpit...
          </p>
        </div>
      </div>
    </CockpitShell>
  );
}
