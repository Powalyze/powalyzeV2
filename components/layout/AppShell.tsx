"use client";

import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

interface AppShellProps {
  children: React.ReactNode;
  rightPanel?: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children, rightPanel }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <Topbar />
      
      <main className="pl-64 pt-14 min-h-screen">
        <div className="flex h-[calc(100vh-3.5rem)]">
          {/* Main Content */}
          <div className={cn("flex-1 overflow-y-auto", rightPanel ? "pr-80" : "")}>
            {children}
          </div>
          
          {/* Right Panel (IA Assistant) */}
          {rightPanel && (
            <aside className="fixed right-0 top-14 h-[calc(100vh-3.5rem)] w-80 bg-slate-900/50 border-l border-slate-800 overflow-y-auto">
              {rightPanel}
            </aside>
          )}
        </div>
      </main>
    </div>
  );
};

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
