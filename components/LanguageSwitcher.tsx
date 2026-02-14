"use client";

import { useTranslation } from "@/lib/i18n";
import { Globe, Check } from "lucide-react";
import { useState, useEffect } from "react";

const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'no', name: 'Norsk', flag: '🇳🇴' },
] as const;

type LanguageCode = typeof languages[number]['code'];

export function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Détection géolocalisation au premier montage
    if (!localStorage.getItem('powalyze-language')) {
      detectLanguageFromGeo();
    }
  }, []);

  async function detectLanguageFromGeo() {
    try {
      // Utiliser l'API ipapi.co pour géolocalisation
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      const countryCode = data.country_code?.toLowerCase();
      console.log('🌍 Pays détecté:', countryCode);
      
      // Mapper pays vers langue
      const countryToLanguage: Record<string, LanguageCode> = {
        'fr': 'fr',
        'gb': 'en',
        'us': 'en',
        'de': 'de',
        'it': 'it',
        'es': 'es',
        'no': 'no',
        'dk': 'en',
        'se': 'en',
      };
      
      const detectedLang = countryToLanguage[countryCode] || 'en';
      console.log('🗣️ Langue détectée:', detectedLang);
      setLanguage(detectedLang);
    } catch (error) {
      console.error('Erreur détection géo:', error);
      setLanguage('fr');
    }
  }

  if (!mounted) return null;

  const currentLang = languages.find(l => l.code === language) || languages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-lg transition-colors"
        aria-label="Changer de langue"
      >
        <Globe size={18} className="text-slate-400" />
        <span className="text-xl">{currentLang.flag}</span>
        <span className="text-sm font-medium text-white hidden sm:block">
          {currentLang.name}
        </span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 transition-colors ${
                  language === lang.code ? 'bg-amber-500/10' : ''
                }`}
              >
                <span className="text-2xl">{lang.flag}</span>
                <span className="flex-1 text-left text-white font-medium">
                  {lang.name}
                </span>
                {language === lang.code && (
                  <Check size={18} className="text-amber-400" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
