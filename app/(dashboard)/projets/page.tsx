'use client';

import React, { useState } from 'react';
import { Folder, Calendar, Users, TrendingUp, Plus, Filter as FilterIcon, Download, LayoutGrid, List } from 'lucide-react';
import ModuleCard from '@/components/cockpit/ModuleCard';
import KPICard from '@/components/cockpit/KPICard';
import AINarrativeBlock from '@/components/cockpit/AINarrativeBlock';
import DetailSheet, { DetailSection, DetailField } from '@/components/cockpit/DetailSheet';
import { useTranslation } from '@/lib/i18n';

interface Project {
  id: string;
  title: string;
  status: 'toLaunch' | 'inProgress' | 'inReview' | 'completed';
  progress: number;
  budget: number;
  deadline: string;
  team: string;
  risk: 'high' | 'medium' | 'low';
  description?: string;
}

export default function ProjetsPage() {
  const { t } = useTranslation();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  // PRODUCTION CLIENT PRO: État vierge par défaut
  const projects: Project[] = [];

  const activeProjects = projects.filter(p => p.status === 'inProgress').length;
  const lateProjects = projects.filter(p => new Date(p.deadline) < new Date() && p.status !== 'completed').length;
  const criticalProjects = projects.filter(p => p.risk === 'high').length;
  const totalLoad = projects.reduce((acc, p) => acc + p.budget, 0);

  const getStatusColumn = (status: string) => {
    switch (status) {
      case 'toLaunch': return t('projects.toLaunch');
      case 'inProgress': return t('projects.inProgress');
      case 'inReview': return t('projects.inReview');
      case 'completed': return t('projects.completed');
      default: return status;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-neutral-600 bg-neutral-50';
    }
  };

  const columns = ['toLaunch', 'inProgress', 'inReview', 'completed'];

  return (
    <div className="min-h-screen bg-neutral-100">
      <ModuleCard
        title={t('modules.projects.title')}
        subtitle={t('modules.projects.subtitle')}
        narration={t('modules.projects.narration')}
        icon={<Folder className="w-6 h-6" />}
        actions={
          <>
            <button className="ds-btn ds-btn-primary">
              <Plus className="w-4 h-4" />
              {t('projects.createNew')}
            </button>
            <div className="flex gap-2 border-l border-neutral-300 pl-4">
              <button
                onClick={() => setViewMode('kanban')}
                className={`ds-btn ${viewMode === 'kanban' ? 'ds-btn-primary' : 'ds-btn-ghost'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`ds-btn ${viewMode === 'list' ? 'ds-btn-primary' : 'ds-btn-ghost'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            <button className="ds-btn ds-btn-ghost">
              <FilterIcon className="w-4 h-4" />
              {t('common.filter')}
            </button>
            <button className="ds-btn ds-btn-ghost">
              <Download className="w-4 h-4" />
              {t('common.export')}
            </button>
          </>
        }
      >
        {/* Synthèse haute - 4 KPI */}
        <div className="ds-grid ds-grid-4 mb-8">
          <KPICard
            label={t('projects.active')}
            value={activeProjects}
            icon={<Folder className="w-5 h-5" />}
          />
          <KPICard
            label={t('projects.late')}
            value={lateProjects}
            variant="danger"
            icon={<Calendar className="w-5 h-5" />}
          />
          <KPICard
            label={t('projects.critical')}
            value={criticalProjects}
            variant="warning"
            icon={<TrendingUp className="w-5 h-5" />}
          />
          <KPICard
            label={t('projects.totalLoad')}
            value={`${(totalLoad / 1000000).toFixed(1)}M€`}
            icon={<Users className="w-5 h-5" />}
          />
        </div>

        {/* Vue Kanban ou Liste */}
        {viewMode === 'kanban' ? (
          <div className="grid grid-cols-4 gap-6">
            {columns.map((column) => (
              <div key={column} className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="ds-subtitle-navy text-sm font-semibold">
                    {getStatusColumn(column)}
                  </h3>
                  <span className="text-xs text-neutral-500 bg-neutral-200 px-2 py-1 rounded-full">
                    {projects.filter(p => p.status === column).length}
                  </span>
                </div>
                <div className="space-y-3">
                  {projects.filter(p => p.status === column).map((project) => (
                    <div
                      key={project.id}
                      onClick={() => setSelectedProject(project)}
                      className="ds-card p-4 cursor-pointer hover:shadow-lg transition-all group"
                    >
                      <h4 className="font-semibold text-navy mb-2 group-hover:text-gold transition-colors">
                        {project.title}
                      </h4>
                      <div className="space-y-2 text-xs text-neutral-600">
                        <div className="flex items-center justify-between">
                          <span>{t('projects.progress')}</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-1.5">
                          <div
                            className="bg-gold h-1.5 rounded-full transition-all ds-progress-bar"
                            data-width={project.progress}
                          />
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRiskColor(project.risk)}`}>
                            {project.risk}
                          </span>
                          <span className="text-xs text-neutral-500">
                            {new Date(project.deadline).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="ds-card overflow-hidden">
            <table className="ds-table">
              <thead>
                <tr>
                  <th>{t('projects.name')}</th>
                  <th>{t('projects.status')}</th>
                  <th>{t('projects.progress')}</th>
                  <th>{t('projects.budget')}</th>
                  <th>{t('projects.deadline')}</th>
                  <th>{t('projects.team')}</th>
                  <th>{t('projects.risk')}</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className="cursor-pointer hover:bg-neutral-50 transition-colors"
                  >
                    <td className="font-medium text-navy">{project.title}</td>
                    <td>{getStatusColumn(project.status)}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-neutral-200 rounded-full h-2">
                          <div
                            className="bg-gold h-2 rounded-full transition-all ds-progress-bar"
                            data-width={project.progress}
                          />
                        </div>
                        <span className="text-sm font-medium">{project.progress}%</span>
                      </div>
                    </td>
                    <td className="text-neutral-700">{(project.budget / 1000).toFixed(0)}K€</td>
                    <td className="text-neutral-600 text-sm">
                      {new Date(project.deadline).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="text-neutral-700">{project.team}</td>
                    <td>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(project.risk)}`}>
                        {project.risk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* IA Narrative */}
        <AINarrativeBlock
          summary="4 projets actifs pour 1.5M€. 2 projets à risque élevé nécessitant attention immédiate."
          analysis="Migration Cloud à 65% mais bloquée par risque fournisseur ERP. ERP Upgrade en revue finale avec 10% restants."
          recommendations="Débloquer Migration Cloud via arbitrage fournisseur. Valider ERP Upgrade avant fin février pour respecter planning."
          scenarios="Si déblocage rapide: Migration Cloud livrée mars. Si retard: décalage Q2 + surcoût 80K€."
          alerts="ERP Upgrade: deadline validation 28 février. Migration Cloud: bloquée par décision fournisseur (deadline 20 janvier)."
        />
      </ModuleCard>

      {/* Detail Sheet */}
      {selectedProject && (
        <DetailSheet
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          title={selectedProject.title}
        >
          <DetailSection title={t('detail.information')} icon={<Folder />}>
            <DetailField label={t('projects.status')} value={getStatusColumn(selectedProject.status)} />
            <DetailField label={t('projects.progress')} value={`${selectedProject.progress}%`} />
            <DetailField label={t('projects.budget')} value={`${(selectedProject.budget / 1000).toFixed(0)}K€`} />
            <DetailField label={t('projects.deadline')} value={new Date(selectedProject.deadline).toLocaleDateString('fr-FR')} />
            <DetailField label={t('projects.team')} value={selectedProject.team} />
            <DetailField label={t('projects.risk')} value={selectedProject.risk} />
          </DetailSection>

          {selectedProject.description && (
            <DetailSection title={t('detail.context')}>
              <p className="text-sm text-neutral-700 leading-relaxed">{selectedProject.description}</p>
            </DetailSection>
          )}

          <DetailSection title={t('detail.links')}>
            <div className="text-sm text-neutral-600">
              <p>{t('detail.linkedRisks')}: Retard fournisseur ERP, Dépassement budget</p>
              <p>{t('detail.linkedDecisions')}: Validation budget migration (Comité Tech, 2026-01-10)</p>
            </div>
          </DetailSection>

          <DetailSection title={t('ai.narrative')} icon={<Folder />}>
            <AINarrativeBlock
              summary="Projet stratégique avec enjeu fort sur transformation digitale."
              analysis="Progression conforme au planning mais dépendance fournisseur critique."
              recommendations="Sécuriser jalons clés et anticiper les points de blocage potentiels."
            />
          </DetailSection>
        </DetailSheet>
      )}
    </div>
  );
}
