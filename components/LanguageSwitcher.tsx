'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  
  // Extract current locale from pathname
  const currentLocale = pathname.startsWith('/en') ? 'en' : 'fr';
  
  const switchLanguage = (locale: string) => {
    // Remove current locale prefix if exists
    const pathWithoutLocale = pathname.replace(/^\/(en|fr)/, '') || '/';
    
    // Add new locale prefix (except for 'fr' which is default)
    const newPath = locale === 'fr' ? pathWithoutLocale : `/${locale}${pathWithoutLocale}`;
    
    router.push(newPath);
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Button
        variant={currentLocale === 'fr' ? 'primary' : 'outline'}
        size="sm"
        onClick={() => switchLanguage('fr')}
      >
        FR
      </Button>
      <Button
        variant={currentLocale === 'en' ? 'primary' : 'outline'}
        size="sm"
        onClick={() => switchLanguage('en')}
      >
        EN
      </Button>
    </div>
  );
}
