// ============================================================
// POWALYZE V2 — DEMO LAYOUT
// ============================================================

import { ReactNode } from 'react';
import Link from 'next/link';
import { Home, FolderKanban, AlertTriangle, FileText, Users, Zap } from 'lucide-react';
import { logout } from '@/lib/auth-actions-v2';
import { getCurrentProfile } from '@/lib/auth-v2';

export default async function DemoLayout({ children }: { children: ReactNode }) {
  const profile = await getCurrentProfile();
  
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Banner Mode Démo */}
      <div className="bg-blue-600 text-white px-4 py-2 text-center text-sm font-medium">
        🎭 Mode Démo — Données fictives • 
        <Link href="/upgrade" className="ml-2 underline hover:text-blue-100">
          Passer en Mode Pro
        </Link>
      </div>
      
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-amber-500">Powalyze Demo</h1>
              <nav className="flex space-x-4">
                <Link href="/cockpit/demo" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Accueil
                </Link>
                <Link href="/cockpit/demo/projets" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm flex items-center gap-2">
                  <FolderKanban className="w-4 h-4" />
                  Projets
                </Link>
                <Link href="/cockpit/demo/risques" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Risques
                </Link>
                <Link href="/cockpit/demo/decisions" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Décisions
                </Link>
                <Link href="/cockpit/demo/ressources" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Ressources
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-slate-400 text-sm">{profile?.email}</span>
              <form action={logout}>
                <button type="submit" className="text-slate-300 hover:text-white text-sm">
                  Déconnexion
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      
      {/* Upgrade CTA */}
      <div className="fixed bottom-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 rounded-lg shadow-lg max-w-sm">
        <div className="flex items-start gap-3">
          <Zap className="w-6 h-6 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-sm">Passez en Mode Pro</h3>
            <p className="text-xs mt-1 opacity-90">
              Créez vos propres projets, gérez vos risques et décisions
            </p>
            <Link
              href="/upgrade"
              className="mt-2 inline-block bg-white text-amber-600 px-4 py-1 rounded text-xs font-medium hover:bg-slate-100"
            >
              Découvrir Pro
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
