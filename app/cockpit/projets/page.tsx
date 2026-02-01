"use client";

import { CockpitShell } from "@/components/cockpit/CockpitShell";
import { useToast } from "@/components/ui/ToastProvider";
import { useState, useEffect } from "react";
import { 
  Plus, Star, StarOff, Trash2, Search, Filter, 
  SlidersHorizontal, ArrowUpDown, Archive, X,
  Clock, TrendingUp, AlertTriangle, CheckCircle2,
  MoreHorizontal, Copy, ArchiveRestore
} from "lucide-react";
import { getProjects, createProject, deleteProject, toggleStarProject } from "./actions";

type ProjectHealth = "green" | "yellow" | "red";
type ProjectStatus = "active" | "pending" | "completed" | "paused" | "blocked" | "archived";
type ProjectPriority = "high" | "medium" | "low";

interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  health: ProjectHealth;
  progress: number;
  owner: string;
  deadline: string;
  starred: boolean;
  priority?: ProjectPriority;
  created_at?: string;
  updated_at?: string;
}

export default function ProjetsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<ProjectPriority | "all">("all");
  const [showArchived, setShowArchived] = useState(false);
  const [sortBy, setSortBy] = useState<"activity" | "priority" | "name" | "risk">("activity");
  const { showToast } = useToast();

  // Charger les projets au montage
  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    setLoading(true);
    const { projects: data, error } = await getProjects();
    if (error) {
      showToast('error', 'Erreur', `Impossible de charger les projets: ${error}`);
    } else {
      setProjects(data as Project[]);
    }
    setLoading(false);
  }

  async function handleCreateProject(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const result = await createProject(formData);
    
    if (result.success) {
      showToast('success', 'Projet créé', 'Le projet a été créé avec succès');
      setShowProjectModal(false);
      loadProjects(); // Recharger la liste
    } else {
      showToast('error', 'Erreur', result.error || 'Impossible de créer le projet');
    }
  }

  async function handleDeleteProject(projectId: string) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) return;
    
    const result = await deleteProject(projectId);
    if (result.success) {
      showToast('success', 'Projet supprimé', 'Le projet a été supprimé');
      loadProjects();
    } else {
      showToast('error', 'Erreur', result.error || 'Impossible de supprimer le projet');
    }
  }

  async function handleToggleStar(projectId: string, currentStarred: boolean) {
    const result = await toggleStarProject(projectId, !currentStarred);
    if (result.success) {
      loadProjects();
    }
  }

  function getHealthColor(health: ProjectHealth): string {
    switch (health) {
      case 'green': return 'bg-emerald-500';
      case 'yellow': return 'bg-amber-500';
      case 'red': return 'bg-red-500';
    }
  }

  function getHealthLabel(health: ProjectHealth): string {
    switch (health) {
      case 'green': return 'Conforme';
      case 'yellow': return 'Attention';
      case 'red': return 'Critique';
    }
  }

  function getStatusLabel(status: ProjectStatus): string {
    switch (status) {
      case 'active': return 'En cours';
      case 'pending': return 'En attente';
      case 'completed': return 'Terminé';
      case 'paused': return 'En pause';
      case 'blocked': return 'Bloqué';
      case 'archived': return 'Archivé';
    }
  }

  function getPriorityLabel(priority?: ProjectPriority): string {
    if (!priority) return 'Moyenne';
    switch (priority) {
      case 'high': return 'Haute';
      case 'medium': return 'Moyenne';
      case 'low': return 'Basse';
    }
  }

  function getPriorityColor(priority?: ProjectPriority): string {
    if (!priority) return 'text-slate-400';
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-amber-400';
      case 'low': return 'text-emerald-400';
    }
  }

  function formatDate(dateString?: string): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `il y a ${diffMins}min`;
    if (diffHours < 24) return `il y a ${diffHours}h`;
    if (diffDays < 7) return `il y a ${diffDays}j`;
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  }

  // Filtrer et trier les projets
  const filteredProjects = projects
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.owner.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || p.priority === priorityFilter;
      const matchesArchive = showArchived ? p.status === 'archived' : p.status !== 'archived';
      return matchesSearch && matchesStatus && matchesPriority && matchesArchive;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'activity':
          return new Date(b.updated_at || b.created_at || '').getTime() - 
                 new Date(a.updated_at || a.created_at || '').getTime();
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return (priorityOrder[b.priority || 'medium'] || 2) - (priorityOrder[a.priority || 'medium'] || 2);
        case 'risk':
          const riskOrder = { red: 3, yellow: 2, green: 1 };
          return riskOrder[b.health] - riskOrder[a.health];
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  return (
    <CockpitShell>
      <div className="p-6 space-y-6">
        {/* Header minimal & premium */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Projets</h1>
            <p className="text-slate-400 mt-2">
              Vue complète de vos initiatives, statuts et priorités.
            </p>
          </div>
          <button 
            onClick={() => setShowProjectModal(true)}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-lg transition-all shadow-lg shadow-amber-500/20"
          >
            <Plus size={18} />
            Créer un projet
          </button>
        </div>

        {/* Barre d'actions intelligentes */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-4">
          {/* Ligne 1: Recherche + Toggle Archives */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="text"
                placeholder="Rechercher par nom, responsable..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowArchived(!showArchived)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                showArchived 
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                  : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600'
              }`}
            >
              <Archive size={16} />
              {showArchived ? 'Masquer archivés' : 'Afficher archivés'}
            </button>
          </div>

          {/* Ligne 2: Filtres + Tri */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Filter size={16} />
              <span>Filtres:</span>
            </div>

            {/* Filtre Statut */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | "all")}
              className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:border-amber-500 focus:outline-none"
              aria-label="Filtrer par statut"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">En cours</option>
              <option value="pending">En attente</option>
              <option value="paused">En pause</option>
              <option value="blocked">Bloqué</option>
              <option value="completed">Terminé</option>
            </select>

            {/* Filtre Priorité */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as ProjectPriority | "all")}
              className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:border-amber-500 focus:outline-none"
              aria-label="Filtrer par priorité"
            >
              <option value="all">Toutes priorités</option>
              <option value="high">Haute</option>
              <option value="medium">Moyenne</option>
              <option value="low">Basse</option>
            </select>

            <div className="h-6 w-px bg-slate-700 mx-2" />

            {/* Tri */}
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <SlidersHorizontal size={16} />
              <span>Trier:</span>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:border-amber-500 focus:outline-none"
              aria-label="Trier par"
            >
              <option value="activity">Dernière activité</option>
              <option value="priority">Priorité</option>
              <option value="risk">Niveau de risque</option>
              <option value="name">Nom (A-Z)</option>
            </select>

            {/* Compteur filtré */}
            <div className="ml-auto text-sm text-slate-500">
              {filteredProjects.length} projet{filteredProjects.length > 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Tableau premium / État vide */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <div className="text-center space-y-3">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500 mx-auto" />
              <p>Chargement des projets...</p>
            </div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/30">
            {projects.length === 0 ? (
              <>
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
                  <Plus size={32} className="text-slate-600" />
                </div>
                <p className="text-slate-300 font-medium mb-2">Aucun projet pour le moment</p>
                <p className="text-slate-500 text-sm mb-6">Créez votre premier projet pour commencer</p>
                <button 
                  onClick={() => setShowProjectModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-all"
                >
                  <Plus size={18} />
                  Créer le premier projet
                </button>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
                  <Search size={32} className="text-slate-600" />
                </div>
                <p className="text-slate-300 font-medium mb-2">Aucun résultat</p>
                <p className="text-slate-500 text-sm">Essayez d'ajuster vos filtres ou votre recherche</p>
              </>
            )}
          </div>
        ) : (
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
            {/* Header tableau */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-900 border-b border-slate-800 text-sm font-semibold text-slate-400">
              <div className="col-span-4">Projet</div>
              <div className="col-span-2">Statut</div>
              <div className="col-span-1">Risque</div>
              <div className="col-span-2">Avancement</div>
              <div className="col-span-2">Responsable</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            {/* Lignes */}
            <div className="divide-y divide-slate-800">
              {filteredProjects.map((project) => (
                <div 
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-slate-800/50 transition-colors cursor-pointer group"
                >
                  {/* Colonne Projet */}
                  <div className="col-span-4 flex items-center gap-3">
                    {project.starred && (
                      <Star size={14} className="text-amber-400 fill-amber-400 flex-shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-white flex items-center gap-2">
                        {project.name}
                        {project.priority && (
                          <span className={`text-xs ${getPriorityColor(project.priority)}`}>
                            {project.priority === 'high' && '🔴'}
                            {project.priority === 'medium' && '🟡'}
                            {project.priority === 'low' && '🟢'}
                          </span>
                        )}
                      </div>
                      {project.description && (
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {project.description}
                        </p>
                      )}
                      <p className="text-xs text-slate-600 mt-1">
                        <Clock size={10} className="inline mr-1" />
                        {formatDate(project.updated_at || project.created_at)}
                      </p>
                    </div>
                  </div>

                  {/* Colonne Statut */}
                  <div className="col-span-2 flex items-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      project.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      project.status === 'blocked' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      project.status === 'completed' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                      'bg-slate-700 text-slate-300 border border-slate-600'
                    }`}>
                      {getStatusLabel(project.status)}
                    </span>
                  </div>

                  {/* Colonne Risque */}
                  <div className="col-span-1 flex items-center">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getHealthColor(project.health)}`} />
                      <span className="text-sm text-slate-400">{getHealthLabel(project.health)}</span>
                    </div>
                  </div>

                  {/* Colonne Avancement */}
                  <div className="col-span-2 flex items-center">
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getHealthColor(project.health)} transition-all`}
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Colonne Responsable */}
                  <div className="col-span-2 flex items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white text-xs font-bold">
                        {project.owner.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="text-sm text-slate-300">{project.owner}</span>
                    </div>
                  </div>

                  {/* Colonne Actions */}
                  <div className="col-span-1 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStar(project.id, project.starred);
                      }}
                      className="p-1.5 hover:bg-slate-700 rounded transition-colors"
                      title={project.starred ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                    >
                      {project.starred ? (
                        <Star size={16} className="text-amber-400 fill-amber-400" />
                      ) : (
                        <StarOff size={16} className="text-slate-500" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProject(project.id);
                      }}
                      className="p-1.5 hover:bg-slate-700 rounded transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={16} className="text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Panneau latéral détail projet */}
        {selectedProject && (
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-end p-4" 
            onClick={() => setSelectedProject(null)}
          >
            <div 
              className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl h-full overflow-y-auto p-6 space-y-6" 
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-4 h-4 rounded-full ${getHealthColor(selectedProject.health)}`} />
                    <h2 className="text-2xl font-bold text-white">{selectedProject.name}</h2>
                  </div>
                  <p className="text-slate-400">{selectedProject.description || 'Aucune description'}</p>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                  title="Fermer"
                >
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              {/* Métriques clés */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <div className="text-slate-400 text-sm mb-1">Statut</div>
                  <div className="text-white font-semibold">{getStatusLabel(selectedProject.status)}</div>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <div className="text-slate-400 text-sm mb-1">Risque</div>
                  <div className="text-white font-semibold">{getHealthLabel(selectedProject.health)}</div>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <div className="text-slate-400 text-sm mb-1">Avancement</div>
                  <div className="text-white font-semibold">{selectedProject.progress}%</div>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <div className="text-slate-400 text-sm mb-1">Priorité</div>
                  <div className={`font-semibold ${getPriorityColor(selectedProject.priority)}`}>
                    {getPriorityLabel(selectedProject.priority)}
                  </div>
                </div>
              </div>

              {/* Sections */}
              <div className="space-y-4">
                <Section title="Responsable">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold">
                      {selectedProject.owner.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-white">{selectedProject.owner}</div>
                      <div className="text-sm text-slate-400">Chef de projet</div>
                    </div>
                  </div>
                </Section>

                <Section title="Échéance">
                  <div className="text-white">
                    {selectedProject.deadline ? new Date(selectedProject.deadline).toLocaleDateString('fr-FR', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    }) : 'Non définie'}
                  </div>
                </Section>

                <Section title="Historique">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2" />
                      <div className="flex-1">
                        <div className="text-white text-sm">Dernière mise à jour</div>
                        <div className="text-slate-400 text-xs">
                          {formatDate(selectedProject.updated_at || selectedProject.created_at)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-slate-600 mt-2" />
                      <div className="flex-1">
                        <div className="text-white text-sm">Création du projet</div>
                        <div className="text-slate-400 text-xs">
                          {selectedProject.created_at ? new Date(selectedProject.created_at).toLocaleDateString('fr-FR') : '-'}
                        </div>
                      </div>
                    </div>
                  </div>
                </Section>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-800">
                <button
                  onClick={() => {
                    handleToggleStar(selectedProject.id, selectedProject.starred);
                    setSelectedProject({ ...selectedProject, starred: !selectedProject.starred });
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
                >
                  {selectedProject.starred ? <Star size={16} className="fill-amber-400 text-amber-400" /> : <StarOff size={16} />}
                  {selectedProject.starred ? 'Retirer favori' : 'Ajouter favori'}
                </button>
                <button
                  onClick={() => {
                    handleDeleteProject(selectedProject.id);
                    setSelectedProject(null);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg font-medium transition-colors"
                >
                  <Trash2 size={16} />
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Modal création projet */}
        {showProjectModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowProjectModal(false)}>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-8" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-3xl font-bold mb-2 text-white">Créer un Projet</h2>
              <p className="text-slate-400 mb-8">Définissez les informations essentielles de votre nouveau projet.</p>
              
              <form className="space-y-6" onSubmit={handleCreateProject}>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Nom du projet *</label>
                  <input 
                    name="name" 
                    placeholder="Ex: Migration Cloud AWS"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Description</label>
                  <textarea 
                    name="description" 
                    rows={4} 
                    placeholder="Décrivez les objectifs, le périmètre et les enjeux du projet..."
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 resize-none" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Responsable *</label>
                    <input 
                      name="owner" 
                      placeholder="Ex: Marie Dupont"
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Échéance</label>
                    <input 
                      name="deadline" 
                      type="date"
                      aria-label="Date d'échéance du projet"
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Statut initial</label>
                  <select 
                    name="status"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    aria-label="Sélectionner le statut initial"
                  >
                    <option value="pending">En attente</option>
                    <option value="active">En cours</option>
                    <option value="paused">En pause</option>
                  </select>
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setShowProjectModal(false)} 
                    className="flex-1 py-3.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition-colors border border-slate-700"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg font-semibold transition-all shadow-lg shadow-amber-500/20"
                  >
                    Créer le projet
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </CockpitShell>
  );
}

// Composant helper pour sections détail
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700">
      <h3 className="text-sm font-semibold text-slate-400 mb-3">{title}</h3>
      {children}
    </div>
  );
}
