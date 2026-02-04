'use client';

import { useTranslations } from '@/lib/useTranslations';
import { Button } from '@/components/ui/Button';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { locale, switchLanguage } = useTranslations();

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Button
        variant={locale === 'fr' ? 'primary' : 'outline'}
        size="sm"
        onClick={() => switchLanguage('fr')}
      >
        FR
      </Button>
      <Button
        variant={locale === 'en' ? 'primary' : 'outline'}
        size="sm"
        onClick={() => switchLanguage('en')}
      >
        EN
      </Button>
    </div>
  );
}
