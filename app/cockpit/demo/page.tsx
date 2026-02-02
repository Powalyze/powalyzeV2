// ============================================================
// POWALYZE V2 — DEMO HOME PAGE
// ============================================================

import { FolderKanban, AlertTriangle, FileText, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function DemoHomePage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-lg p-8 border border-slate-700">
        <h1 className="text-3xl font-bold text-white mb-2">
          Bienvenue sur Powalyze Demo
        </h1>
        <p className="text-slate-300 text-lg">
          Explorez votre cockpit exécutif avec des données fictives
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Projets actifs</p>
              <p className="text-3xl font-bold text-white mt-1">12</p>
            </div>
            <FolderKanban className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Risques critiques</p>
              <p className="text-3xl font-bold text-white mt-1">3</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Décisions en attente</p>
              <p className="text-3xl font-bold text-white mt-1">5</p>
            </div>
            <FileText className="w-8 h-8 text-amber-500" />
          </div>
        </div>
        
        <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Progression moyenne</p>
              <p className="text-3xl font-bold text-white mt-1">67%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/cockpit/demo/projets" className="bg-slate-900 rounded-lg p-6 border border-slate-800 hover:border-amber-500 transition-colors">
          <FolderKanban className="w-10 h-10 text-amber-500 mb-3" />
          <h3 className="text-xl font-bold text-white mb-2">Voir les projets</h3>
          <p className="text-slate-400">
            Explorez le portfolio de projets fictifs avec leurs indicateurs
          </p>
        </Link>
        
        <Link href="/cockpit/demo/risques" className="bg-slate-900 rounded-lg p-6 border border-slate-800 hover:border-amber-500 transition-colors">
          <AlertTriangle className="w-10 h-10 text-red-500 mb-3" />
          <h3 className="text-xl font-bold text-white mb-2">Analyser les risques</h3>
          <p className="text-slate-400">
            Découvrez la matrice des risques et les plans de mitigation
          </p>
        </Link>
      </div>
      
      {/* Info Box */}
      <div className="bg-blue-500/10 border border-blue-500 rounded-lg p-6">
        <h3 className="text-lg font-bold text-blue-400 mb-2">
          📌 Mode Démo - Données fictives
        </h3>
        <p className="text-blue-300 text-sm">
          Vous explorez actuellement des données de démonstration. 
          Pour créer vos propres projets et gérer votre portfolio réel, 
          <Link href="/upgrade" className="underline font-medium ml-1">
            passez en Mode Pro
          </Link>.
        </p>
      </div>
    </div>
  );
}
