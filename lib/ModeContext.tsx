'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Mode = 'demo' | 'pro';

interface ModeContextType {
  mode: Mode;
  setMode: (mode: Mode) => void;
  isDemoMode: boolean;
  isProMode: boolean;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<Mode>('demo');

  useEffect(() => {
    // Auto-detect mode based on Supabase configuration
    const hasSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                        process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0;
    
    setModeState(hasSupabase ? 'pro' : 'demo');
  }, []);

  const setMode = (newMode: Mode) => {
    setModeState(newMode);
    // Persist mode preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('powalyze_mode', newMode);
    }
  };

  const value: ModeContextType = {
    mode,
    setMode,
    isDemoMode: mode === 'demo',
    isProMode: mode === 'pro',
  };

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
}

export function useMode(): ModeContextType {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
}
