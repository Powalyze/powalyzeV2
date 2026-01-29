'use client';

import { useState, useEffect } from 'react';
import { CockpitShell } from '@/components/cockpit/CockpitShell';
import OnboardingGuide from '@/components/cockpit/OnboardingGuide';
import { useCockpit } from '@/components/providers/CockpitProvider';
import { useToast } from '@/components/ui/ToastProvider';
import { ChevronDown, FolderKanban, Calendar, Users, TrendingUp, AlertTriangle, CheckCircle, Clock, Plus, ExternalLink, BarChart3, X } from 'lucide-react';
import Link from 'next/link';

interface Project {
  id: string;
  name: string;
  description?: string;
  status?: 'active' | 'pending' | 'completed' | 'blocked';
  budget?: number;
  progress?: number;
  startDate?: string;
  endDate?: string;
  team?: string[];
  risks?: number;
  tasks?: number;
  created_at?: string;
}

export default function CockpitDashboardPage() {
  const { getItems, addItem, refreshCount } = useCockpit();
  const { showToast } = useToast();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [showProjectSelector, setShowProjectSelector] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    status: 'pending' as 'active' | 'pending' | 'completed' | 'blocked',
    budget: 0,
    startDate: '',
    endDate: ''
  });

  // Charger les projets une seule fois au montage
  useEffect(() => {
    if (!isInitialized) {
      const storedProjects = getItems('projects');
      
      // Si aucun projet, créer des projets démo (une seule fois)
      if (storedProjects.length === 0) {
        const demoProjects: Project[] = [
          {
            id: '1',
            name: 'Migration Cloud Azure',
            description: 'Migration de l\'infrastructure vers Azure Cloud',
            status: 'active',
            budget: 250000,
            progress: 65,
            startDate: '2026-01-15',
            endDate: '2026-06-30',
            team: ['Marie', 'Thomas', 'Sophie'],
            risks: 3,
            tasks: 47
          },
          {
            id: '2',
            name: 'Refonte ERP',
            description: 'Mise à niveau système ERP entreprise',
            status: 'active',
            budget: 180000,
            progress: 42,
            startDate: '2025-12-01',
            endDate: '2026-08-15',
            team: ['Pierre', 'Julie'],
            risks: 5,
            tasks: 62
          },
          {
            id: '3',
            name: 'Mobile App v2',
            description: 'Développement nouvelle version application mobile',
            status: 'pending',
            budget: 95000,
            progress: 28,
            startDate: '2026-02-01',
            endDate: '2026-05-30',
            team: ['Alex', 'Emma'],
            risks: 2,
            tasks: 34
          }
        ];
        
        demoProjects.forEach(p => addItem('projects', p));
        setSelectedProjectId(demoProjects[0].id);
      } else {
        setSelectedProjectId(storedProjects[0]?.id || null);
      }
      setIsInitialized(true);
    }
  }, [isInitialized, getItems, addItem]);

  // Utiliser directement getItems au lieu d'un state local
  // refreshCount force le re-calcul quand les données changent
  const projects = refreshCount >= 0 ? getItems('projects') : [];
  const selectedProject = projects.find(p => p.id === selectedProjectId);

  const handleCreateProject = () => {
    if (!projectForm.name.trim()) {
      showToast('error', 'Erreur', 'Le nom du projet est obligatoire');
      return;
    }

    const newProject: Project = {
      ...projectForm,
      id: Date.now().toString(),
      progress: 0,
      risks: 0,
      tasks: 0,
      team: [],
      created_at: new Date().toISOString()
    };

    addItem('projects', newProject);
    setProjectForm({ name: '', description: '', status: 'pending', budget: 0, startDate: '', endDate: '' });
    setShowNewProjectModal(false);
    setSelectedProjectId(newProject.id);
    showToast('success', '✅ Projet créé', `"${newProject.name}" a été créé avec succès`);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'completed': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'blocked': return 'bg-red-500/10 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'active': return <TrendingUp size={16} />;
      case 'pending': return <Clock size={16} />;
      case 'completed': return <CheckCircle size={16} />;
      case 'blocked': return <AlertTriangle size={16} />;
      default: return <FolderKanban size={16} />;
    }
  };

  return (
    <CockpitShell>
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <OnboardingGuide />
        {/* Header avec sélecteur de projet */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Cockpit Exécutif</h1>
              <p className="text-slate-400">Vue d'ensemble de votre portefeuille</p>
            </div>
            <button
              id="new-project"
              onClick={() => setShowNewProjectModal(true)}
              className="px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-lg flex items-center gap-2 font-semibold transition-all"
            >
              <Plus size={20} />
              Nouveau projet
            </button>
          </div>

          {/* Sélecteur de projet */}
          <div className="relative">
            <button
              onClick={() => setShowProjectSelector(!showProjectSelector)}
              className="w-full md:w-auto min-w-[300px] px-4 py-3 bg-[#111113] border border-slate-800 rounded-lg flex items-center justify-between hover:border-purple-500/50 transition-all"
            >
              <div className="flex items-center gap-3">
                <FolderKanban size={20} className="text-purple-400" />
                <div className="text-left">
                  <div className="font-semibold text-sm">
                    {selectedProject ? selectedProject.name : 'Sélectionner un projet'}
                  </div>
                  {selectedProject && (
                    <div className="text-xs text-slate-500">
                      {projects.length} projet{projects.length > 1 ? 's' : ''} au total
                    </div>
                  )}
                </div>
              </div>
              <ChevronDown size={20} className={`text-slate-400 transition-transform ${showProjectSelector ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown liste projets */}
            {showProjectSelector && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#111113] border border-slate-800 rounded-lg shadow-xl z-50 max-h-[400px] overflow-y-auto">
                {projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => {
                      setSelectedProjectId(project.id);
                      setShowProjectSelector(false);
                    }}
                    className={`w-full px-4 py-3 flex items-start gap-3 hover:bg-slate-800/50 transition-colors border-b border-slate-800 last:border-0 ${
                      selectedProjectId === project.id ? 'bg-purple-500/10' : ''
                    }`}
                  >
                    <FolderKanban size={18} className={selectedProjectId === project.id ? 'text-purple-400' : 'text-slate-400'} />
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-sm mb-1">{project.name}</div>
                      {project.description && (
                        <div className="text-xs text-slate-400 line-clamp-1">{project.description}</div>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs border flex items-center gap-1 ${getStatusColor(project.status)}`}>
                          {getStatusIcon(project.status)}
                          {project.status || 'draft'}
                        </span>
                        {project.progress !== undefined && (
                          <span className="text-xs text-slate-500">{project.progress}% complété</span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}

                {projects.length === 0 && (
                  <div className="px-4 py-8 text-center text-slate-400">
                    <FolderKanban size={32} className="mx-auto mb-2 opacity-20" />
                    <p className="text-sm">Aucun projet créé</p>
                    <Link
                      href="/cockpit/projets"
                      className="inline-block mt-3 px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-sm"
                    >
                      Créer un projet
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Détails du projet sélectionné */}
        {selectedProject ? (
          <div className="space-y-6">
            {/* KPIs du projet */}
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-[#111113] border border-slate-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm">Progression</span>
                  <TrendingUp size={20} className="text-green-400" />
                </div>
                <div className="text-3xl font-bold mb-2">{selectedProject.progress || 0}%</div>
                <progress
                  value={selectedProject.progress || 0}
                  max={100}
                  className="w-full h-2 rounded-full overflow-hidden appearance-none [&::-webkit-progress-bar]:bg-slate-800 [&::-webkit-progress-value]:bg-green-500 [&::-moz-progress-bar]:bg-green-500"
                />
              </div>

              <div className="bg-[#111113] border border-slate-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm">Budget</span>
                  <BarChart3 size={20} className="text-blue-400" />
                </div>
                <div className="text-3xl font-bold">
                  {selectedProject.budget ? `${(selectedProject.budget / 1000).toFixed(0)}K€` : 'N/A'}
                </div>
                <div className="text-xs text-slate-500 mt-1">Budget total alloué</div>
              </div>

              <div className="bg-[#111113] border border-slate-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm">Risques</span>
                  <AlertTriangle size={20} className="text-amber-400" />
                </div>
                <div className="text-3xl font-bold">{selectedProject.risks || 0}</div>
                <div className="text-xs text-slate-500 mt-1">Risques actifs</div>
              </div>

              <div className="bg-[#111113] border border-slate-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm">Équipe</span>
                  <Users size={20} className="text-purple-400" />
                </div>
                <div className="text-3xl font-bold">{selectedProject.team?.length || 0}</div>
                <div className="text-xs text-slate-500 mt-1">Membres actifs</div>
              </div>
            </div>

            {/* Informations détaillées */}
            <div className="bg-[#111113] border border-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FolderKanban className="text-purple-400" />
                {selectedProject.name}
              </h2>

              {selectedProject.description && (
                <p className="text-slate-400 mb-6">{selectedProject.description}</p>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-400 mb-3">Informations</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Calendar size={16} className="text-slate-500" />
                      <div>
                        <div className="text-xs text-slate-500">Dates</div>
                        <div className="text-sm">
                          {selectedProject.startDate || 'N/A'} → {selectedProject.endDate || 'N/A'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle size={16} className="text-slate-500" />
                      <div>
                        <div className="text-xs text-slate-500">Tâches</div>
                        <div className="text-sm">{selectedProject.tasks || 0} tâches au total</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-400 mb-3">Équipe</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.team && selectedProject.team.length > 0 ? (
                      selectedProject.team.map((member: string, i: number) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-slate-800 rounded-full text-sm flex items-center gap-2"
                        >
                          <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-xs">
                            {member.charAt(0)}
                          </div>
                          {member}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500 text-sm">Aucun membre assigné</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-800 flex gap-3">
                <Link
                  href={`/cockpit/projets`}
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg flex items-center gap-2 text-sm"
                >
                  <ExternalLink size={16} />
                  Voir tous les projets
                </Link>
                <Link
                  href={`/cockpit/risques`}
                  className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg flex items-center gap-2 text-sm"
                >
                  <AlertTriangle size={16} />
                  Voir les risques
                </Link>
              </div>
            </div>

            {/* Liens rapides */}
            <div className="grid md:grid-cols-3 gap-6">
              <Link
                href="/cockpit/decisions"
                className="bg-[#111113] border border-slate-800 hover:border-purple-500/50 rounded-xl p-6 transition-all group"
              >
                <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-400 transition-colors">Décisions</h3>
                <p className="text-slate-400 text-sm">Suivez vos décisions stratégiques</p>
              </Link>

              <Link
                href="/cockpit/risques"
                className="bg-[#111113] border border-slate-800 hover:border-purple-500/50 rounded-xl p-6 transition-all group"
              >
                <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-400 transition-colors">Risques</h3>
                <p className="text-slate-400 text-sm">Identifiez et mitigez les risques</p>
              </Link>

              <Link
                href="/cockpit/rapports"
                className="bg-[#111113] border border-slate-800 hover:border-purple-500/50 rounded-xl p-6 transition-all group"
              >
                <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-400 transition-colors">Rapports</h3>
                <p className="text-slate-400 text-sm">Générez des rapports automatiques</p>
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <FolderKanban size={64} className="mx-auto mb-4 text-slate-700" />
            <h3 className="text-xl font-semibold mb-2">Aucun projet sélectionné</h3>
            <p className="text-slate-400 mb-6">Créez votre premier projet pour commencer</p>
            <Link
              href="/cockpit/projets"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-lg font-semibold"
            >
              <Plus size={20} />
              Créer un projet
            </Link>
          </div>
        )}
      </div>

      {/* Modal Nouveau Projet */}
      {showNewProjectModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowNewProjectModal(false)}>
          <div className="bg-[#111113] border border-slate-800 rounded-xl p-6 max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Nouveau Projet</h2>
              <button onClick={() => setShowNewProjectModal(false)} className="text-slate-400 hover:text-white" title="Fermer">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Nom du projet *</label>
                <input
                  type="text"
                  value={projectForm.name}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 bg-[#0A0A0B] border border-slate-800 rounded-lg focus:border-purple-500/50 focus:outline-none"
                  placeholder="Ex: Migration Cloud Azure"
                />
              </div>

              <div>
                <label htmlFor="project-description" className="block text-sm font-semibold mb-2">Description</label>
                <textarea
                  id="project-description"
                  value={projectForm.description}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 bg-[#0A0A0B] border border-slate-800 rounded-lg focus:border-purple-500/50 focus:outline-none"
                  placeholder="Description du projet..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="project-status" className="block text-sm font-semibold mb-2">Statut</label>
                  <select
                    id="project-status"
                    value={projectForm.status}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, status: e.target.value as 'active' | 'pending' | 'completed' | 'blocked' }))}
                    className="w-full px-4 py-2 bg-[#0A0A0B] border border-slate-800 rounded-lg"
                    title="Statut du projet"
                  >
                    <option value="pending">En attente</option>
                    <option value="active">Actif</option>
                    <option value="completed">Terminé</option>
                    <option value="blocked">Bloqué</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="project-budget" className="block text-sm font-semibold mb-2">Budget (€)</label>
                  <input
                    id="project-budget"
                    type="number"
                    value={projectForm.budget}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, budget: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-2 bg-[#0A0A0B] border border-slate-800 rounded-lg"
                    placeholder="150000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="project-start-date" className="block text-sm font-semibold mb-2">Date de début</label>
                  <input
                    id="project-start-date"
                    type="date"
                    value={projectForm.startDate}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-4 py-2 bg-[#0A0A0B] border border-slate-800 rounded-lg"
                    title="Date de début"
                  />
                </div>

                <div>
                  <label htmlFor="project-end-date" className="block text-sm font-semibold mb-2">Date de fin</label>
                  <input
                    id="project-end-date"
                    type="date"
                    value={projectForm.endDate}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-4 py-2 bg-[#0A0A0B] border border-slate-800 rounded-lg"
                    title="Date de fin"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNewProjectModal(false)}
                className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateProject}
                className="flex-1 px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-lg font-semibold"
              >
                Créer le projet
              </button>
            </div>
          </div>
        </div>
      )}
    </CockpitShell>
  );
}
