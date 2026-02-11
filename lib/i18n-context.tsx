// ============================================================
// i18n CONTEXT - Internationalization Provider
// /lib/i18n-context.tsx
// ============================================================

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Locale = 'fr' | 'en';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('fr');
  const [translations, setTranslations] = useState<Record<string, any>>({});

  useEffect(() => {
    // Charger la langue depuis localStorage
    const savedLocale = localStorage.getItem('powalyze-locale') as Locale;
    if (savedLocale) {
      setLocaleState(savedLocale);
    }
  }, []);

  useEffect(() => {
    // Charger les traductions
    import(`@/locales/${locale}.json`)
      .then((module) => setTranslations(module.default))
      .catch((err) => console.error('Failed to load translations:', err));
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('powalyze-locale', newLocale);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key; // Retourne la clé si pas trouvée
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}
