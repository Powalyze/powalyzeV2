"use client";

import React from 'react';
import { useTranslation } from '@/lib/i18n';

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
  const { language, setLanguage } = useTranslation();

  return (
    <div className={`ds-lang-switcher ${className}`}>
      <button
        className={`ds-lang-btn ${language === 'fr' ? 'ds-lang-btn-active' : ''}`}
        onClick={() => setLanguage('fr')}
        aria-label="Français"
      >
        FR
      </button>
      <button
        className={`ds-lang-btn ${language === 'en' ? 'ds-lang-btn-active' : ''}`}
        onClick={() => setLanguage('en')}
        aria-label="English"
      >
        EN
      </button>
    </div>
  );
}
