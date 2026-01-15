"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navigationItems, bottomNavigationItems } from '@/lib/navigation';
import { cn } from '@/lib/utils';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-950 border-r border-slate-800 flex flex-col z-50">
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-slate-800">
        <Link href="/cockpit" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
            <span className="text-slate-950 font-bold text-sm">P</span>
          </div>
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
      </div>
    </aside>
  );
};
