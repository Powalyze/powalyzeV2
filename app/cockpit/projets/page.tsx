"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Filter, Download, Folder, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import BaseHeader from '@/components/cockpit/BaseHeader';
import KPICard from '@/components/cockpit/KPICard';
import TopNav from '@/components/cockpit/TopNav';
import AINarrative from '@/components/cockpit/AINarrative';
import { EmptyState } from '@/components/cockpit/EmptyState';
import { useTranslation } from '@/lib/i18n';
import { getCockpitData, isDemoMode, type Project } from '@/lib/cockpitData';
import { useMode } from '@/lib/ModeContext';
import Link from 'next/link';

export default function ProjetsPage() {
  const { t } = useTranslation();
  const { mode, isDemoMode: isDemo } = useMode();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const cockpitData = getCockpitData();
    // Filtrer selon le mode: demo affiche tout, pro filtre source='demo'
    const filteredProjects = mode === 'demo' 
      ? cockpitData.projects 
      : cockpitData.projects.filter(p => p.source !== 'demo');
    setProjects(filteredProjects);
  }, [mode]);

  const activeProjects = projects.filter(p => p.progress < 100).length;
  const lateProjects = projects.filter(p => p.status === 'red').length;
  const criticalProjects = projects.filter(p => p.risk === 'Élevé').length;
  const totalBudget = projects.reduce((sum, p) => sum + parseFloat(p.budget.replace(/[^0-9.]/g, '')), 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'green': return 'bg-green-100 text-green-700 border-green-200';
      case 'orange': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'red': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-white">
      <TopNav />
      
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        <BaseHeader
          titleKey="cockpit.modules.projects.title"
          subtitleKey="cockpit.modules.projects.subtitle"
          actions={
            <>
              <button className="btn-secondary">
                <Filter className="w-4 h-4" />
                {t('common.actions.filter')}
              </button>
              <button className="btn-secondary">
                <Download className="w-4 h-4" />
                {t('common.actions.export')}
              </button>
              <Link href="/cockpit/projets/nouveau" className="btn-primary">
                <Plus className="w-4 h-4" />
                {t('cockpit.modules.projects.newProject')}
              </Link>
            </>
          }
        />

        {/* Badge MODE DEMO */}
        {isDemo && (
          <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-blue-700">{t('cockpit.mode.demo')}</span>
          </div>
        )}

        {/* Message MODE PRO vide */}
        {!isDemo && projects.length === 0 && (
          <EmptyState
            icon={Folder}
            title={t('projects.empty')}
            description="Commencez par créer votre premier projet pour piloter votre portefeuille"
            ctaText={t('projects.createNew')}
            ctaAction={() => window.location.href = '/cockpit/projets/nouveau'}
          />
        )}

        {/* KPI Synthèse (4 max) */}
        {projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <KPICard
            label="Projets actifs"
            value={activeProjects}
            icon={<Folder className="w-5 h-5" />}
            trend="up"
            trendValue="+2"
          />
          <KPICard
            label="En retard"
            value={lateProjects}
            variant="danger"
            icon={<Clock className="w-5 h-5" />}
          />
          <KPICard
            label="Risque élevé"
            value={criticalProjects}
            variant="warning"
            icon={<AlertTriangle className="w-5 h-5" />}
          />
          <KPICard
            label="Budget total"
            value={`${totalBudget.toFixed(1)}M€`}
            icon={<TrendingUp className="w-5 h-5" />}
          />
        </div>
        )}

        {/* Vue Kanban */}
        {projects.length > 0 && (
        <section className="mb-12">
          <h3 className="header-subtitle text-xl mb-6">Vue Kanban</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* À lancer */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-sm opacity-60">À lancer</h4>
                <span className="text-xs bg-neutral-light px-2 py-1 rounded">
                  {projects.filter(p => p.progress === 0).length}
                </span>
              </div>
            </div>

            {/* En cours */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-sm opacity-60">En cours</h4>
                <span className="text-xs bg-neutral-light px-2 py-1 rounded">
                  {projects.filter(p => p.progress > 0 && p.progress < 100).length}
                </span>
              </div>
              
              {projects.filter(p => p.progress > 0 && p.progress < 100).map(project => (
                <div 
                  key={project.id}
                  className="card-premium cursor-pointer"
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="font-medium text-sm">{project.name}</h5>
                    <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(project.status)}`}>
                      {project.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="opacity-60">Avancement</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-neutral-light rounded-full h-1.5">
                      <div 
                        className="bg-gold h-1.5 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs pt-2">
                      <span className="opacity-60">{project.team}</span>
                      <span className="opacity-60">{project.deadline}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Terminés */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-sm opacity-60">Terminés</h4>
                <span className="text-xs bg-neutral-light px-2 py-1 rounded">
                  {projects.filter(p => p.progress === 100).length}
                </span>
              </div>
            </div>
          </div>
        </section>
        )}

        {/* IA Narrative - afficher seulement si projets existent */}
        {projects.length > 0 && (
        <AINarrative
          summary="Votre portefeuille affiche une vélocité stable avec 6 projets actifs. 2 projets nécessitent une attention immédiate."
          analysis="Le projet Mobile Dashboard présente un retard critique (23% vs 60% attendu). Les ressources Team Delta sont surchargées."
          recommendations={[
            "Réaffecter 2 dev seniors de Team Alpha vers Team Delta",
            "Reprogrammer comité de pilotage Mobile Dashboard dans 48h",
            "Activer plan de contingence pour livraison progressive"
          ]}
          scenarios={[
            { title: "Scénario optimal", impact: "Livraison complète 15 mai avec réaffectation" },
            { title: "Scénario dégradé", impact: "Livraison MVP 1er mai, features avancées fin juin" }
          ]}
          alerts={[
            "Risque de dépassement budget Mobile Dashboard: +120K€",
            "Dépendance critique: API externe non testée"
          ]}
        />
        )}
      </main>
    </div>
  );
}
