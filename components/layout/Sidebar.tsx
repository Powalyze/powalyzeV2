"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navigationItems, bottomNavigationItems } from '@/lib/navigation';
import { cn } from '@/lib/utils';
import PowalyzeLogo from '@/components/Logo';
import { useMode } from '@/lib/ModeContext';
import { useTranslation } from '@/lib/i18n';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { mode, isDemoMode } = useMode();
  const { t } = useTranslation();
  
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-950 border-r border-slate-800 flex flex-col z-50">
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-slate-800">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <PowalyzeLogo size={32} />
          <span className="font-semibold text-slate-100">Powalyze</span>
        </Link>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  'flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150',
                  isActive
                    ? 'bg-slate-800 text-slate-100'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-xs font-medium bg-amber-500/20 text-amber-400 rounded">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
      
      {/* Bottom Navigation */}
      <div className="p-2 border-t border-slate-800">
        <div className="space-y-1">
          {bottomNavigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150',
                  isActive
                    ? 'bg-slate-800 text-slate-100'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
        
        {/* Mode Badge */}
        <div className="mt-3 px-3 py-2">
          <div className={cn(
            "inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium",
            isDemoMode 
              ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" 
              : "bg-green-500/10 text-green-400 border border-green-500/20"
          )}>
            <div className={cn(
              "w-1.5 h-1.5 rounded-full",
              isDemoMode ? "bg-blue-400 animate-pulse" : "bg-green-400"
            )} />
            <span>{isDemoMode ? t('cockpit.mode.demo') : t('cockpit.mode.pro')}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
