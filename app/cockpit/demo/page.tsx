"use client";

import { CockpitShell } from "@/components/cockpit/CockpitShell";
import { FolderKanban, AlertTriangle, CheckCircle, FileText, TrendingUp, Clock, Zap, ArrowRight } from "lucide-react";
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
  { id: '1', title: 'Dépassement budget Azure', severity: 'high', status: 'active' },
  { id: '2', title: 'Retard livraison ERP', severity: 'medium', status: 'monitored' }
];

const demoDecisions = [
  { id: '1', title: 'Choix provider Cloud', date: '15 jan 2026', status: 'approved' },
  { id: '2', title: 'Extension équipe mobile', date: '20 jan 2026', status: 'pending' }
];

export default function CockpitDemoPage() {
  return (
    <CockpitShell>
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        {/* Banner Demo Mode */}
        <div className="mb-8 bg-gradient-to-r from-blue-500/10 to-blue-600/5 border border-blue-500/30 rounded-xl p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="px-2.5 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded-full border border-blue-500/30">
                  MODE DÉMO
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Bienvenue dans Powalyze Demo
              </h2>
              <p className="text-slate-400 mb-4">
                Explorez le cockpit exécutif avec des données fictives. Toutes les fonctionnalités sont en lecture seule.
              </p>
              <Link
                href="/cockpit/tarifs"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-lg transition-all shadow-lg shadow-amber-500/20"
              >
                <Zap size={18} />
                Passer en Pro
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">Dashboard Démo</h1>
          <p className="text-slate-400">Vue d'ensemble de votre portefeuille (données fictives)</p>
        </div>

        {/* KPI Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-400">Projets</span>
              <FolderKanban size={20} className="text-emerald-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">3</div>
            <div className="text-xs text-emerald-400">+2 ce mois</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-400">Risques</span>
              <AlertTriangle size={20} className="text-amber-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">2</div>
            <div className="text-xs text-slate-400">Actifs</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-400">Décisions</span>
              <CheckCircle size={20} className="text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">2</div>
            <div className="text-xs text-blue-400">1 en attente</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-400">Progression</span>
              <TrendingUp size={20} className="text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">45%</div>
            <div className="text-xs text-purple-400">Moyenne</div>
          </div>
        </div>

        {/* Projets Demo */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Projets actifs</h2>
            <div className="px-3 py-1 bg-slate-800 text-slate-400 text-xs font-medium rounded-full">
              Lecture seule
            </div>
          </div>

          <div className="space-y-3">
            {demoProjects.map(project => (
              <div
                key={project.id}
                className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
              >
                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                  project.risk === 'green' ? 'bg-emerald-500' :
                  project.risk === 'yellow' ? 'bg-amber-500' :
                  'bg-red-500'
                }`} />
                
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white mb-1">{project.name}</div>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>{project.owner}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {project.lastActivity}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-white mb-1">{project.progress}%</div>
                    <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          project.risk === 'green' ? 'bg-emerald-500' :
                          project.risk === 'yellow' ? 'bg-amber-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                  
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
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

        {/* Grille Risques & Décisions */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Risques */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Risques actifs</h2>
              <AlertTriangle size={20} className="text-amber-400" />
            </div>

            <div className="space-y-3">
              {demoRisks.map(risk => (
                <div key={risk.id} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="font-medium text-white mb-1">{risk.title}</div>
                      <div className="text-xs text-slate-400">{risk.status === 'active' ? 'Actif' : 'Surveillé'}</div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      risk.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                      'bg-amber-500/20 text-amber-400'
                    }`}>
                      {risk.severity === 'high' ? 'Élevé' : 'Moyen'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Décisions */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Décisions récentes</h2>
              <CheckCircle size={20} className="text-blue-400" />
            </div>

            <div className="space-y-3">
              {demoDecisions.map(decision => (
                <div key={decision.id} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="font-medium text-white mb-1">{decision.title}</div>
                      <div className="text-xs text-slate-400">{decision.date}</div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      decision.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {decision.status === 'approved' ? 'Approuvé' : 'En attente'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Final */}
        <div className="mt-8 bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/30 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">
            Prêt à gérer vos propres projets ?
          </h3>
          <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
            Passez en Pro pour débloquer la création, l'édition et toutes les fonctionnalités avancées avec vos données réelles.
          </p>
          <Link
            href="/cockpit/tarifs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-lg transition-all shadow-lg shadow-amber-500/30"
          >
            <Zap size={20} />
            Découvrir les tarifs Pro
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </CockpitShell>
  );
}
