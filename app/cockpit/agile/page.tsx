'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ListTodo, 
  Play, 
  TrendingDown, 
  Zap, 
  Map, 
  MessageSquare,
  Activity 
} from 'lucide-react';

/**
 * Page principale Cockpit Agile
 * Navigation tabs : Backlog, Sprint, Burndown, Vélocité, Story Mapping, Retrospectives
 */
export default function CockpitAgilePage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <CockpitAgileContent />
    </Suspense>
  );
}

function CockpitAgileContent() {
  const pathname = usePathname();

  const tabs = [
    {
      name: 'Backlog',
      href: '/cockpit/agile/backlog',
      icon: ListTodo,
      description: 'Gérer vos user stories',
    },
    {
      name: 'Sprint en cours',
      href: '/cockpit/agile/sprint',
      icon: Play,
      description: 'Board Kanban et suivi quotidien',
    },
    {
      name: 'Burndown',
      href: '/cockpit/agile/burndown',
      icon: TrendingDown,
      description: 'Graphique de progression du sprint',
    },
    {
      name: 'Vélocité',
      href: '/cockpit/agile/velocity',
      icon: Zap,
      description: 'Historique et prédictions IA',
    },
    {
      name: 'Story Mapping',
      href: '/cockpit/agile/story-mapping',
      icon: Map,
      description: 'Visualiser vos epics et stories',
    },
    {
      name: 'Retrospectives',
      href: '/cockpit/agile/retrospectives',
      icon: MessageSquare,
      description: 'Amélioration continue de l\'équipe',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0F1C]">
      {/* Header */}
      <div className="border-b border-slate-700 bg-[#1C1F26]">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Activity className="w-8 h-8 text-[#D4AF37]" />
                Cockpit Agile
              </h1>
              <p className="text-slate-400 mt-1">
                Pilotez vos sprints, backlog, et vélocité en temps réel
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/cockpit/agile/backlog"
                className="px-4 py-2 bg-[#D4AF37] hover:bg-[#C4A037] text-[#0A0F1C] rounded-lg font-semibold transition"
              >
                Voir le Backlog
              </Link>
              <Link
                href="/cockpit/agile/sprint"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
              >
                Sprint en cours
              </Link>
            </div>
          </div>

          {/* Tabs Navigation */}
          <nav className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg whitespace-nowrap transition ${
                    isActive
                      ? 'bg-[#D4AF37] text-[#0A0F1C] font-semibold'
                      : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content: Vue d'ensemble */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="group bg-[#1C1F26] rounded-2xl p-6 hover:bg-[#252931] transition border border-slate-700 hover:border-[#D4AF37]"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-lg flex items-center justify-center group-hover:bg-[#D4AF37]/30 transition">
                    <Icon className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-[#D4AF37] transition">
                      {tab.name}
                    </h3>
                    <p className="text-sm text-slate-400">{tab.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA Demo */}
        <div className="mt-12 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            Mode Demo — Découvrez le Cockpit Agile
          </h2>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Vous explorez actuellement un sprint fictif avec des stories de démonstration.
            Passez en Pro pour activer vos sprints réels, intégrations Jira/DevOps, et IA narrative avancée.
          </p>
          <Link
            href="/cockpit/tarifs"
            className="inline-block px-6 py-3 bg-[#D4AF37] hover:bg-[#C4A037] text-[#0A0F1C] rounded-lg font-semibold transition"
          >
            Passer en Mode Pro
          </Link>
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center">
      <div className="text-white animate-pulse">Chargement du Cockpit Agile...</div>
    </div>
  );
}
