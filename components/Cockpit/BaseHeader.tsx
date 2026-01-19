/**
 * COMPOSANT: BaseHeader
 * Header premium pour tous les modules cockpit
 * Structure: Titre (or) + Sous-titre (bleu nuit) + Actions
 */

"use client";

import { useTranslation } from '@/lib/i18n';
import { ReactNode } from 'react';

interface BaseHeaderProps {
  titleKey: string;
  subtitleKey: string;
  actions?: ReactNode;
}

export default function BaseHeader({ titleKey, subtitleKey, actions }: BaseHeaderProps) {
  const { t } = useTranslation();

  return (
    <header className="animate-fadeInUp mb-12">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="header-title text-4xl mb-3">
            {t(titleKey)}
          </h1>
          <p className="header-subtitle text-lg max-w-[700px]">
            {t(subtitleKey)}
          </p>
        </div>
        
        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}
