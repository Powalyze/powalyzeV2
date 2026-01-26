"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Search, Sparkles, ChevronDown, LogOut } from 'lucide-react';

export const Topbar: React.FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('powalyze_auth');
    router.push('/login');
  };

  return (
    <header className="fixed top-0 left-64 right-0 h-14 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 flex items-center justify-between px-6 z-40">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <button className="w-full flex items-center gap-2 px-3 py-1.5 bg-slate-900/50 border border-slate-800 rounded-lg text-sm text-slate-400 hover:border-slate-700 transition-colors">
          <Search className="w-4 h-4" />
          <span>Rechercher...</span>
          <kbd className="ml-auto px-1.5 py-0.5 text-xs bg-slate-800 rounded">⌘K</kbd>
        </button>
      </div>
      
      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* IA Assistant */}
        <button className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-sm text-amber-400 hover:bg-amber-500/20 transition-colors">
          <Sparkles className="w-4 h-4" />
          <span>IA</span>
        </button>
        
        {/* Mode Switcher */}
        <div className="flex items-center gap-2 px-2 py-1.5 bg-slate-900/50 border border-slate-800 rounded-lg">
          <button 
            onClick={() => router.push('/cockpit')}
            className="px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
            title="MODE PRO - Tables réelles vierges"
          >
            MODE PRO
          </button>
          <button 
            onClick={() => router.push('/cockpit-demo')}
            className="px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 text-slate-400 hover:text-slate-100 hover:bg-slate-800"
            title="MODE DÉMO - Données mock pré-remplies"
          >
            MODE DÉMO
          </button>
        </div>
        
        {/* Client Selector */}
        <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/50 border border-slate-800 rounded-lg text-sm text-slate-300 hover:border-slate-700 transition-colors">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Acme Corp</span>
          <ChevronDown className="w-4 h-4" />
        </button>
        
        {/* Avatar */}
        <button className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-semibold text-sm">
          JD
        </button>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400 hover:bg-red-500/20 transition-colors"
          title="Déconnexion"
        >
          <LogOut className="w-4 h-4" />
          <span>Déconnexion</span>
        </button>
      </div>
    </header>
  );
};
