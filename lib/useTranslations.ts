'use client';

import { useState, useEffect } from 'react';
import frTranslations from '@/locales/fr.json';
import enTranslations from '@/locales/en.json';

type Locale = 'fr' | 'en';
type Translations = typeof frTranslations;

const translations: Record<Locale, any> = {
  fr: frTranslations,
  en: enTranslations,
};

export function useTranslations() {
  const [locale, setLocale] = useState<Locale>('fr');
  const [t, setT] = useState<Translations>(translations['fr']);

  useEffect(() => {
    // Lire la langue depuis localStorage
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && translations[savedLocale]) {
      setLocale(savedLocale);
      setT(translations[savedLocale]);
    }
  }, []);

  const switchLanguage = (newLocale: Locale) => {
    setLocale(newLocale);
    setT(translations[newLocale]);
    // Defer localStorage write to avoid blocking main thread
    requestAnimationFrame(() => {
      localStorage.setItem('locale', newLocale);
    });
  };

  return { t, locale, switchLanguage };
}
