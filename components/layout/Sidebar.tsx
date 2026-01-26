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
        
        {/* Mode Switcher - DEMO/PRO */}
        <div className="mt-3 space-y-2">
          <div className="px-3 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Environnement
          </div>
          <Link
            href="/cockpit"
            className={cn(
              "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              !isDemoMode
                ? "bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/10"
                : "text-slate-400 hover:text-slate-100 hover:bg-slate-900 border border-transparent"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-2 h-2 rounded-full",
                !isDemoMode ? "bg-emerald-400 animate-pulse" : "bg-slate-600"
              )} />
              <span className="font-semibold">MODE PRO</span>
            </div>
            {!isDemoMode && (
              <span className="text-xs px-2 py-0.5 bg-emerald-400/20 rounded-full">Actif</span>
            )}
          </Link>
          <Link
            href="/cockpit-demo"
            className={cn(
              "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              isDemoMode
                ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/10"
                : "text-slate-400 hover:text-slate-100 hover:bg-slate-900 border border-transparent"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-2 h-2 rounded-full",
                isDemoMode ? "bg-blue-400 animate-pulse" : "bg-slate-600"
              )} />
              <span className="font-semibold">MODE DÉMO</span>
            </div>
            {isDemoMode && (
              <span className="text-xs px-2 py-0.5 bg-blue-400/20 rounded-full">Actif</span>
            )}
          </Link>
        </div>
      </div>
    </aside>
  );
};
