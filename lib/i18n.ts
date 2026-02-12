/**
 * Système i18n pour Powalyze
 * Gestion FR/EN unifiée Vitrine ↔ Cockpit
 * UN SEUL FICHIER: locales/i18n.json
 */

"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import translationsFR from '@/locales/fr.json';
import translationsEN from '@/locales/en.json';
import translationsDE from '@/locales/de.json';
import translationsNO from '@/locales/no.json';
import translationsIT from '@/locales/it.json';
import translationsES from '@/locales/es.json';

const translations = {
  fr: translationsFR,
  en: translationsEN,
  de: translationsDE,
  no: translationsNO,
  it: translationsIT,
  es: translationsES,
};

type Language = 'fr' | 'en' | 'de' | 'no' | 'it' | 'es';

interface TranslationStore {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<TranslationStore>()(
  persist(
    (set) => ({
      language: 'fr',
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: 'powalyze-language',
    }
  )
);

export function useTranslation() {
  const { language, setLanguage } = useLanguageStore();

  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key} for language ${language}`);
        return key;
      }
    }

    if (typeof value !== 'string') {
      console.warn(`Translation value is not a string: ${key}`);
      return key;
    }

    // Remplacer les paramètres {{param}}
    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (_, param) => {
        return params[param]?.toString() || `{{${param}}}`;
      });
    }

    return value;
  };

  return {
    t,
    language,
    setLanguage,
  };
}
