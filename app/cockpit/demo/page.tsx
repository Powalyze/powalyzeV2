'use client';

import { Cockpit } from '@/components/cockpit/Cockpit';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { CockpitProvider } from '@/components/providers/CockpitProvider';

/**
 * Page Cockpit DEMO
 * Version de démonstration avec projets pré-remplis
 * Affiche les fonctionnalités complètes de Powalyze
 */
export default function CockpitDemoPage() {
  return (
    <CockpitProvider>
      <ToastProvider>
        <Cockpit mode="demo" />
      </ToastProvider>
    </CockpitProvider>
  );
}
