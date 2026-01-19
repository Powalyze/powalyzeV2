"use client";

import { useState, useEffect } from 'react';

export type Language = 'fr' | 'en' | 'de' | 'no' | 'it' | 'es';

export const languages = {
  fr: { name: 'Français', flag: '🇫🇷' },
  en: { name: 'English', flag: '🇬🇧' },
  de: { name: 'Deutsch', flag: '🇩🇪' },
  no: { name: 'Norsk', flag: '🇳🇴' },
  it: { name: 'Italiano', flag: '🇮🇹' },
  es: { name: 'Español', flag: '🇪🇸' },
};

export function useLanguage() {
  const [language, setLanguageState] = useState<Language>('fr');

  useEffect(() => {
    const stored = localStorage.getItem('powalyze_language') as Language;
    if (stored && languages[stored]) {
      setLanguageState(stored);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('powalyze_language', lang);
  };

  return { language, setLanguage, languages };
}
