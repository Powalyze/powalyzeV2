'use client';

import { Cockpit } from '@/components/cockpit/Cockpit';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { CockpitProvider } from '@/components/providers/CockpitProvider';

/**
 * Page Cockpit LIVE
 * Version destinée aux clients, vide par défaut
 * Affiche un onboarding si aucun projet
 */
export default function CockpitLivePage() {
  return (
    <CockpitProvider>
      <ToastProvider>
        <Cockpit mode="live" />
      </ToastProvider>
    </CockpitProvider>
  );
}
