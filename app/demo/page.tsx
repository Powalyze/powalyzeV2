'use client';

import { FolderKanban, AlertTriangle, CheckCircle, TrendingUp, Clock, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

const demoProjects = [
  {
    id: '1',
    name: 'Migration Cloud Azure',
    status: 'En cours',
    risk: 'green',
    progress: 65,
    owner: 'Marie L.',
    lastActivity: 'il y a 2h'
  },
  {
    id: '2',
    name: 'Refonte ERP',
    status: 'Attention',
    risk: 'yellow',
    progress: 42,
    owner: 'Thomas D.',
    lastActivity: 'il y a 5h'
  },
  {
    id: '3',
    name: 'Mobile App v2',
    status: 'En cours',
    risk: 'green',
    progress: 28,
    owner: 'Sophie M.',
    lastActivity: 'il y a 1j'
  }
];

const demoRisks = [
  { id: '1', title: 'Dépassement budget Azure', severity: 'high' },
  { id: '2', title: 'Retard livraison ERP', severity: 'medium' }
];

export default function DemoPublicPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <div>
              <div className="text-white font-bold">Powalyze</div>
              <div className="text-xs text-amber-400">Demo publique</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/signup"
              className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
            >
              Connexion
            </Link>
            <Link
              href="/signup"
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-lg transition-all shadow-lg shadow-amber-500/20"
            >
              Essayer gratuitement
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Banner */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Démo interactive • Données fictives
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Cockpit Exécutif
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
              en action
            </span>
          </h1>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
            Découvrez comment Powalyze transforme la gestion de portefeuille de projets en expérience premium.
          </p>

          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl transition-all shadow-2xl shadow-amber-500/30 text-lg"
          >
            <Zap size={24} />
            Créer mon compte gratuitement
            <ArrowRight size={20} />
          </Link>
        </div>

        {/* KPI Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-12">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-slate-400">Projets actifs</span>
              <FolderKanban size={20} className="text-emerald-400" />
            </div>
            <div className="text-4xl font-bold text-white mb-1">3</div>
            <div className="text-xs text-emerald-400">+2 ce mois</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-slate-400">Risques</span>
              <AlertTriangle size={20} className="text-amber-400" />
            </div>
            <div className="text-4xl font-bold text-white mb-1">2</div>
            <div className="text-xs text-slate-400">Sous surveillance</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-slate-400">Décisions</span>
              <CheckCircle size={20} className="text-blue-400" />
            </div>
            <div className="text-4xl font-bold text-white mb-1">8</div>
            <div className="text-xs text-blue-400">3 en attente</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-slate-400">Progression</span>
              <TrendingUp size={20} className="text-purple-400" />
            </div>
            <div className="text-4xl font-bold text-white mb-1">45%</div>
            <div className="text-xs text-purple-400">+12% ce mois</div>
          </div>
        </div>

        {/* Projets Demo */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Portefeuille de projets</h2>

          <div className="space-y-4">
            {demoProjects.map(project => (
              <div
                key={project.id}
                className="flex items-center gap-4 p-5 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-all"
              >
                <div className={`w-4 h-4 rounded-full flex-shrink-0 ${
                  project.risk === 'green' ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50' :
                  project.risk === 'yellow' ? 'bg-amber-500 shadow-lg shadow-amber-500/50' :
                  'bg-red-500 shadow-lg shadow-red-500/50'
                }`} />
                
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white text-lg mb-1">{project.name}</div>
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <span>{project.owner}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {project.lastActivity}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-lg font-bold text-white mb-2">{project.progress}%</div>
                    <div className="w-32 h-3 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          project.risk === 'green' ? 'bg-emerald-500' :
                          project.risk === 'yellow' ? 'bg-amber-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${project.progress}%` } as React.CSSProperties}
                      />
                    </div>
                  </div>
                  
                  <span className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                    project.status === 'En cours' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                    'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}>
                    {project.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risques Demo */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 backdrop-blur-sm mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Risques identifiés</h2>

          <div className="grid md:grid-cols-2 gap-4">
            {demoRisks.map(risk => (
              <div key={risk.id} className="p-5 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="font-medium text-white text-lg mb-2">{risk.title}</div>
                    <div className="text-sm text-slate-400">En cours de mitigation</div>
                  </div>
                  <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                    risk.severity === 'high' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {risk.severity === 'high' ? 'ÉLEVÉ' : 'MOYEN'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Final */}
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-600/5 to-amber-500/10 border-2 border-amber-500/30 rounded-2xl p-12 text-center backdrop-blur-sm">
          <h2 className="text-4xl font-bold text-white mb-4">
            Prêt à gérer vos propres projets ?
          </h2>
          <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
            Créez votre compte gratuitement et commencez à piloter votre portefeuille de projets comme un pro.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl transition-all shadow-2xl shadow-amber-500/40 text-lg"
          >
            <Zap size={24} />
            Créer mon compte maintenant
            <ArrowRight size={20} />
          </Link>
          <p className="text-sm text-slate-500 mt-4">
            Sans carte bancaire • Gratuit pendant 14 jours
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/50 backdrop-blur-xl mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-slate-500 text-sm">
          <p>© 2026 Powalyze. Cockpit exécutif pour la gouvernance de portefeuille.</p>
        </div>
      </footer>
    </div>
  );
}
