/**
 * COMPOSANT: TopNav
 * Navigation topbar fixe, pas de sidebar
 * Sélecteur de langue + icônes minimalistes + actions
 */

"use client";

import { useTranslation } from '@/lib/i18n';
import { Globe } from 'lucide-react';

interface TopNavProps {
  actions?: React.ReactNode;
}

export default function TopNav({ actions }: TopNavProps) {
  const { language, setLanguage } = useTranslation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-neutral-light">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo + Titre */}
          <div className="flex items-center gap-3">
            <h2 className="header-title text-2xl">Powalyze</h2>
            <span className="text-sm opacity-60">Cockpit Exécutif</span>
          </div>

          {/* Actions + Langue */}
          <div className="flex items-center gap-4">
            {actions}
            
            {/* Sélecteur de langue */}
            <button
              onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
              className="btn-secondary flex items-center gap-2 px-4 py-2"
              title="Changer de langue"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium uppercase">{language}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
