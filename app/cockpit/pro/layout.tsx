// ============================================================
// POWALYZE V2 — PRO LAYOUT
// ============================================================

import { ReactNode } from 'react';
import Link from 'next/link';
import { Home, FolderKanban, AlertTriangle, FileText, Users, Settings, BarChart } from 'lucide-react';
import { logout } from '@/lib/auth-actions-v2';
import { getCurrentProfile } from '@/lib/auth-v2';

export default async function ProLayout({ children }: { children: ReactNode }) {
  const profile = await getCurrentProfile();
  
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Pro Badge Banner */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 text-center text-sm font-medium">
        ⚡ Mode Pro Actif — Édition complète
      </div>
      
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-amber-500">Powalyze Pro</h1>
              <nav className="flex space-x-4">
                <Link href="/cockpit/pro" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Accueil
                </Link>
                <Link href="/cockpit/pro/projets" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm flex items-center gap-2">
                  <FolderKanban className="w-4 h-4" />
                  Projets
                </Link>
                <Link href="/cockpit/pro/risques" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Risques
                </Link>
                <Link href="/cockpit/pro/decisions" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Décisions
                </Link>
                <Link href="/cockpit/pro/ressources" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Ressources
                </Link>
                <Link href="/cockpit/pro/rapports" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm flex items-center gap-2">
                  <BarChart className="w-4 h-4" />
                  Rapports IA
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/cockpit/pro/parametres" className="text-slate-300 hover:text-white">
                <Settings className="w-5 h-5" />
              </Link>
              <span className="text-slate-400 text-sm">{profile?.email}</span>
              <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded">
                PRO
              </span>
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
    </div>
  );
}
