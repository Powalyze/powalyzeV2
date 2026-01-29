"use client";

import { CockpitShell } from "@/components/cockpit/CockpitShell";
import { useToast } from "@/components/ui/ToastProvider";
import { useState, useEffect } from "react";
import { Plus, Star, StarOff, Trash2, MoreHorizontal } from "lucide-react";
import { getProjects, createProject, deleteProject, toggleStarProject } from "./actions";

type ProjectHealth = "green" | "yellow" | "red";
type ProjectStatus = "active" | "pending" | "completed" | "paused" | "blocked";

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
}

export default function ProjetsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProjectModal, setShowProjectModal] = useState(false);
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

  function getStatusLabel(status: ProjectStatus): string {
    switch (status) {
      case 'active': return 'En cours';
      case 'pending': return 'En attente';
      case 'completed': return 'Terminé';
      case 'paused': return 'En pause';
      case 'blocked': return 'Bloqué';
    }
  }

  return (
    <CockpitShell>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Projets</h1>
            <p className="text-slate-400 mt-1">
              {projects.length} projet{projects.length > 1 ? 's' : ''} au total
            </p>
          </div>
          <button 
            onClick={() => setShowProjectModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold rounded-lg transition-all"
          >
            <Plus size={18} />
            Nouveau projet
          </button>
        </div>

        {/* Liste des projets */}
        {loading ? (
          <div className="text-center py-12 text-slate-400">
            Chargement des projets...
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-700 rounded-xl">
            <p className="text-slate-400 mb-4">Aucun projet pour le moment</p>
            <button 
              onClick={() => setShowProjectModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all"
            >
              <Plus size={16} />
              Créer votre premier projet
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div 
                key={project.id}
                className="p-6 bg-slate-900/60 border border-slate-800 rounded-xl hover:border-slate-700 transition-all group"
              >
                {/* Header carte */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getHealthColor(project.health)}`} />
                    <h3 className="font-semibold text-white">{project.name}</h3>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleToggleStar(project.id, project.starred)}
                      className="p-1 hover:bg-slate-800 rounded transition-colors"
                      title={project.starred ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                    >
                      {project.starred ? (
                        <Star size={16} className="text-amber-400 fill-amber-400" />
                      ) : (
                        <StarOff size={16} className="text-slate-500" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="p-1 hover:bg-slate-800 rounded transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={16} className="text-red-400" />
                    </button>
                  </div>
                </div>

                {/* Description */}
                {project.description && (
                  <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                    {project.description}
                  </p>
                )}

                {/* Statut */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium">
                    {getStatusLabel(project.status)}
                  </span>
                  {project.starred && (
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                  )}
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Progression</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getHealthColor(project.health)} transition-all`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{project.owner}</span>
                  {project.deadline && <span>📅 {project.deadline}</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal création projet */}
        {showProjectModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowProjectModal(false)}>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-2xl font-bold mb-6 text-white">Créer un Projet</h2>
              <form className="space-y-4" onSubmit={handleCreateProject}>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Nom du projet</label>
                  <input 
                    name="name" 
                    placeholder="Ex: Migration Cloud AWS"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-amber-500 focus:outline-none" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                  <textarea 
                    name="description" 
                    rows={3} 
                    placeholder="Décrivez les objectifs et le scope du projet..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-amber-500 focus:outline-none" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Responsable</label>
                    <input 
                      name="owner" 
                      placeholder="Ex: Marie L."
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-amber-500 focus:outline-none" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Échéance</label>
                    <input 
                      name="deadline" 
                      type="date"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-amber-500 focus:outline-none" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Statut initial</label>
                  <select 
                    name="status"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="pending">En attente</option>
                    <option value="active">En cours</option>
                    <option value="paused">En pause</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowProjectModal(false)} 
                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg font-semibold transition-all"
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
