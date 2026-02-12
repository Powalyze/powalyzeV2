'use client';

import { useState, useEffect } from 'react';
import frTranslations from '@/locales/fr.json';
import enTranslations from '@/locales/en.json';
import deTranslations from '@/locales/de.json';
import noTranslations from '@/locales/no.json';
import itTranslations from '@/locales/it.json';
import esTranslations from '@/locales/es.json';

type Locale = 'fr' | 'en' | 'de' | 'no' | 'it' | 'es';
type Translations = typeof frTranslations;

const translations: Record<Locale, Translations> = {
  fr: frTranslations,
  en: enTranslations,
  de: deTranslations,
  no: noTranslations,
  it: itTranslations,
  es: esTranslations,
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
    localStorage.setItem('locale', newLocale);
  };

  return { t, locale, switchLanguage };
}
