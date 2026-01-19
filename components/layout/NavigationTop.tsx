"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/lib/i18n';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import '@/styles/design-system.css';

interface NavigationTopProps {
  mode?: 'vitrine' | 'cockpit';
}

export default function NavigationTop({ mode = 'vitrine' }: NavigationTopProps) {
  const pathname = usePathname();
  const { t } = useTranslation();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="ds-nav-top">
      {/* Logo */}
      <Link href="/" className="ds-nav-logo">
        <svg className="ds-icon-lg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
          <circle cx="12" cy="14" r="3"/>
        </svg>
        Powalyze
      </Link>

      {/* Menu Navigation */}
      <div className="ds-nav-menu">
        {mode === 'vitrine' ? (
          <>
            <Link 
              href="/" 
              className={`ds-nav-link ${isActive('/') ? 'ds-nav-link-active' : ''}`}
            >
              {t('nav.vitrine')}
            </Link>
            <Link 
              href="/fonctionnalites" 
              className={`ds-nav-link ${isActive('/fonctionnalites') ? 'ds-nav-link-active' : ''}`}
            >
              {t('nav.features')}
            </Link>
            <Link 
              href="/tarifs" 
              className={`ds-nav-link ${isActive('/tarifs') ? 'ds-nav-link-active' : ''}`}
            >
              {t('nav.pricing')}
            </Link>
            <Link 
              href="/contact" 
              className={`ds-nav-link ${isActive('/contact') ? 'ds-nav-link-active' : ''}`}
            >
              {t('nav.contact')}
            </Link>
          </>
        ) : (
          <>
            <Link 
              href="/cockpit" 
              className={`ds-nav-link ${isActive('/cockpit') ? 'ds-nav-link-active' : ''}`}
            >
              {t('cockpit.dashboard')}
            </Link>
            <Link 
              href="/cockpit/projets" 
              className={`ds-nav-link ${pathname?.startsWith('/cockpit/projets') ? 'ds-nav-link-active' : ''}`}
            >
              {t('cockpit.projects')}
            </Link>
            <Link 
              href="/risques" 
              className={`ds-nav-link ${isActive('/risques') ? 'ds-nav-link-active' : ''}`}
            >
              {t('cockpit.risks')}
            </Link>
            <Link 
              href="/decisions" 
              className={`ds-nav-link ${isActive('/decisions') ? 'ds-nav-link-active' : ''}`}
            >
              {t('cockpit.decisions')}
            </Link>
          </>
        )}

        {/* Langues */}
        <LanguageSwitcher />

        {/* CTA */}
        {mode === 'vitrine' ? (
          <Link href="/cockpit" className="ds-btn ds-btn-primary ds-btn-sm">
            {t('nav.enterCockpit')}
          </Link>
        ) : (
          <Link href="/parametres" className="ds-nav-link">
            {t('cockpit.settings')}
          </Link>
        )}
      </div>
    </nav>
  );
}
