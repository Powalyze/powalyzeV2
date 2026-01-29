"use client";

import { CockpitShell } from "@/components/cockpit/CockpitShell";
import { ModalsHub } from "@/components/cockpit/ModalsHub";
import { ActionMenu, projectActions } from "@/components/ui/ActionMenu";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useToast } from "@/components/ui/ToastProvider";
import { useState } from "react";
import { Brain, LayoutGrid, List, Calendar, Plus, Filter, Search, Users, Tag, Download, Upload, MoreHorizontal, Star, StarOff, Clock } from "lucide-react";

type ViewType = "kanban" | "list" | "timeline";
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
  tags: string[];
  starred: boolean;
}

export default function ProjetsPage() {
  const [currentView, setCurrentView] = useState<ViewType>("kanban");
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [showAIActions, setShowAIActions] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedHealth, setSelectedHealth] = useState<string>("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [bulkSelectedIds, setBulkSelectedIds] = useState<string[]>([]);
  const { showToast } = useToast();
  
  // Projets demo avec données complètes
  const [demoProjects] = useState<Project[]>([
    { 
      id: "1", 
      name: "Cloud Migration", 
      description: "Migration vers AWS",
      status: "active",
      health: "green",
      progress: 75,
      owner: "Marie L.",
      deadline: "15j",
      tags: ["Infrastructure", "AWS"],
      starred: true
    },
    { 
      id: "2", 
      name: "ERP Refonte", 
      description: "Modernisation ERP",
      status: "blocked",
      health: "red",
      progress: 45,
      owner: "Thomas B.",
      deadline: "8j",
      tags: ["Finance", "Critique"],
      starred: false
    },
    { 
      id: "3", 
      name: "Mobile App v2", 
      description: "Application mobile",
      status: "active",
      health: "yellow",
      progress: 60,
      owner: "Sophie M.",
      deadline: "22j",
      tags: ["Mobile", "UX"],
      starred: true
    },
    { 
      id: "4", 
      name: "Legacy System", 
      description: "Maintenance legacy",
      status: "paused",
      health: "yellow",
      progress: 30,
      owner: "Pierre D.",
      deadline: "45j",
      tags: ["Maintenance"],
      starred: false
    }
  ]);

  const handleEditProject = (projectId: string) => {
    showToast('info', 'Édition projet', `Ouverture de l'éditeur pour ${projectId}`);
  };

  const handleDeleteProject = (projectId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      showToast('success', 'Projet supprimé', 'Le projet a été supprimé avec succès');
    }
  };

  const handleDuplicateProject = (projectId: string) => {
    showToast('success', 'Projet dupliqué', 'Une copie du projet a été créée');
  };

  const handleArchiveProject = (projectId: string) => {
    showToast('success', 'Projet archivé', 'Le projet a été archivé');
  };

  const handleStarProject = (projectId: string) => {
    showToast('success', 'Favoris', 'Projet ajouté aux favoris');
  };

  // Handlers pour actions IA
  const handleViewAIActions = () => {
    setShowAIActions(true);
    showToast('info', 'Actions IA', 'Chargement des recommandations intelligentes...');
  };

  const handleAutoPrioritize = () => {
    showToast('success', 'Priorisation IA', 'Projets réorganisés selon les priorités détectées');
  };

  // Handlers pour export/import
  const handleExportProjects = () => {
    showToast('success', 'Export', 'Export Excel généré avec succès');
  };

  const handleImportProjects = () => {
    showToast('info', 'Import', 'Sélectionnez un fichier Excel ou CSV');
  };

  // Handler pour filtres
  const handleToggleFilters = () => {
    setShowFiltersPanel(!showFiltersPanel);
  };

  // Handler pour bulk actions
  const handleBulkDelete = () => {
    if (bulkSelectedIds.length === 0) {
      showToast('warning', 'Sélection vide', 'Veuillez sélectionner au moins un projet');
      return;
    }
    if (confirm(`Supprimer ${bulkSelectedIds.length} projet(s) ?`)) {
      setBulkSelectedIds([]);
      showToast('success', 'Suppression', `${bulkSelectedIds.length} projet(s) supprimé(s)`);
    }
  };

  const handleBulkArchive = () => {
    if (bulkSelectedIds.length === 0) {
      showToast('warning', 'Sélection vide', 'Veuillez sélectionner au moins un projet');
      return;
    }
    setBulkSelectedIds([]);
    showToast('success', 'Archivage', `${bulkSelectedIds.length} projet(s) archivé(s)`);
  };

  const handleSelectAll = () => {
    if (bulkSelectedIds.length === filteredProjects.length) {
      setBulkSelectedIds([]);
    } else {
      setBulkSelectedIds(filteredProjects.map(p => p.id));
    }
  };

  const handleToggleSelect = (projectId: string) => {
    if (bulkSelectedIds.includes(projectId)) {
      setBulkSelectedIds(bulkSelectedIds.filter(id => id !== projectId));
    } else {
      setBulkSelectedIds([...bulkSelectedIds, projectId]);
    }
  };

  // Filters computation
  const filteredProjects = demoProjects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || p.status === selectedStatus;
    const matchesHealth = selectedHealth === "all" || p.health === selectedHealth;
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => p.tags.includes(tag));
    return matchesSearch && matchesStatus && matchesHealth && matchesTags;
  });

  return (
    <CockpitShell>
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Projets</h1>
            <p className="text-slate-400">Gérez vos projets selon votre méthodologie</p>
          </div>
          <button 
            onClick={() => setShowProjectModal(true)}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 font-semibold transition-all flex items-center gap-2"
          >
            <Plus size={20} />
            <span>Nouveau projet</span>
          </button>
        </div>

        {/* AI Insights */}
        <div className="mb-6 p-6 rounded-xl bg-gradient-to-br from-amber-500/10 via-sky-500/5 to-purple-500/10 border border-amber-500/30">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <Brain className="text-amber-400" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-2">IA Copilote • Analyse Projets</h3>
              <p className="text-slate-300 text-sm mb-3">
                4 projets nécessitent une attention : <strong className="text-white">ERP Refonte</strong> a un budget dépassé de 8%, 
                <strong className="text-white"> Mobile App</strong> manque de ressources front-end, 
                <strong className="text-white"> Cloud Migration</strong> avance 15% plus vite que prévu (opportunité de livraison anticipée), 
                et <strong className="text-white">Legacy System</strong> est ralenti par des dépendances externes.
              </p>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={handleViewAIActions}
                  className="px-3 py-1.5 text-sm rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
                >
                  Voir actions recommandées
                </button>
                <button 
                  onClick={handleAutoPrioritize}
                  className="px-3 py-1.5 text-sm rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
                >
                  Prioriser automatiquement
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* View Switcher */}
          <div className="flex gap-2 p-1 bg-slate-900 rounded-lg border border-slate-800">
            <button
              onClick={() => setCurrentView("kanban")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                currentView === "kanban"
                  ? "bg-amber-500 text-slate-950 font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <LayoutGrid size={18} />
              <span className="hidden sm:inline">Kanban</span>
            </button>
            <button
              onClick={() => setCurrentView("list")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                currentView === "list"
                  ? "bg-amber-500 text-slate-950 font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <List size={18} />
              <span className="hidden sm:inline">Liste</span>
            </button>
            <button
              onClick={() => setCurrentView("timeline")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                currentView === "timeline"
                  ? "bg-amber-500 text-slate-950 font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Calendar size={18} />
              <span className="hidden sm:inline">Timeline</span>
            </button>
          </div>

          {/* Search & Filters */}
          <div className="flex gap-2 flex-1">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un projet..."
                className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
            <button 
              onClick={handleToggleFilters}
              className={`px-4 py-2 bg-slate-900 border rounded-lg transition-colors flex items-center gap-2 ${
                showFiltersPanel 
                  ? 'border-amber-500 text-amber-400' 
                  : 'border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <Filter size={18} />
              <span className="hidden sm:inline">Filtres</span>
              {(selectedStatus !== "all" || selectedHealth !== "all" || selectedTags.length > 0) && (
                <span className="px-1.5 py-0.5 text-xs rounded-full bg-amber-500 text-slate-950 font-semibold">
                  {[selectedStatus !== "all", selectedHealth !== "all", selectedTags.length > 0].filter(Boolean).length}
                </span>
              )}
            </button>
            <button 
              onClick={handleExportProjects}
              className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white hover:border-slate-700 transition-colors flex items-center gap-2"
              title="Exporter en Excel"
            >
              <Download size={18} />
            </button>
            <button 
              onClick={handleImportProjects}
              className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white hover:border-slate-700 transition-colors flex items-center gap-2"
              title="Importer des projets"
            >
              <Upload size={18} />
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFiltersPanel && (
          <div className="mb-6 p-4 rounded-xl bg-slate-900 border border-slate-800 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="grid md:grid-cols-3 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Statut</label>
                <select 
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="active">En cours</option>
                  <option value="paused">En pause</option>
                  <option value="completed">Terminés</option>
                  <option value="blocked">Bloqués</option>
                </select>
              </div>

              {/* Health Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Santé</label>
                <select 
                  value={selectedHealth}
                  onChange={(e) => setSelectedHealth(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="all">Toutes les santés</option>
                  <option value="green">✓ Vert (OK)</option>
                  <option value="yellow">⚠ Jaune (Attention)</option>
                  <option value="red">✕ Rouge (Critique)</option>
                </select>
              </div>

              {/* Tags Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {["Infrastructure", "Finance", "Mobile", "AWS", "Critique", "UX", "Maintenance"].map(tag => (
                    <button
                      key={tag}
                      onClick={() => {
                        if (selectedTags.includes(tag)) {
                          setSelectedTags(selectedTags.filter(t => t !== tag));
                        } else {
                          setSelectedTags([...selectedTags, tag]);
                        }
                      }}
                      className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                        selectedTags.includes(tag)
                          ? 'bg-amber-500 text-slate-950 font-semibold'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Reset Filters */}
            {(selectedStatus !== "all" || selectedHealth !== "all" || selectedTags.length > 0) && (
              <div className="mt-4 pt-4 border-t border-slate-800">
                <button
                  onClick={() => {
                    setSelectedStatus("all");
                    setSelectedHealth("all");
                    setSelectedTags([]);
                    showToast('info', 'Filtres réinitialisés', 'Tous les filtres ont été supprimés');
                  }}
                  className="px-4 py-2 text-sm rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        )}

        {/* Bulk Actions Bar */}
        {bulkSelectedIds.length > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <span className="text-amber-400 font-bold">{bulkSelectedIds.length}</span>
              </div>
              <div>
                <div className="font-semibold text-white">{bulkSelectedIds.length} projet(s) sélectionné(s)</div>
                <div className="text-sm text-slate-400">Actions en masse disponibles</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleBulkArchive}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-2"
              >
                <Download size={16} />
                Archiver
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/30 transition-colors flex items-center gap-2"
              >
                <Users size={16} />
                Supprimer
              </button>
              <button
                onClick={() => setBulkSelectedIds([])}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        {/* Views */}
        {currentView === "kanban" && <KanbanView 
          projects={filteredProjects} 
          onEdit={handleEditProject}
          onDelete={handleDeleteProject}
          onDuplicate={handleDuplicateProject}
          onArchive={handleArchiveProject}
          onStar={handleStarProject}
        />}
        {currentView === "list" && <ListView 
          projects={filteredProjects}
          onEdit={handleEditProject}
          onDelete={handleDeleteProject}
          onDuplicate={handleDuplicateProject}
          onArchive={handleArchiveProject}
          onStar={handleStarProject}
          selectedIds={bulkSelectedIds}
          onSelectAll={handleSelectAll}
          onToggleSelect={handleToggleSelect}
        />}
        {currentView === "timeline" && <TimelineView />}
      </div>
      
      {/* Modals */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowProjectModal(false)}>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-6">Créer un Projet</h2>
            <form 
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setShowProjectModal(false);
                showToast('success', 'Projet créé', 'Le projet a été créé avec succès');
              }}
            >
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
                    required 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Statut initial</label>
                <select 
                  name="status"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-amber-500 focus:outline-none"
                  aria-label="Statut du projet"
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

      {/* AI Actions Modal */}
      {showAIActions && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAIActions(false)}>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <Brain className="text-amber-400" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Actions Recommandées par l'IA</h2>
                  <p className="text-slate-400 text-sm">Optimisation basée sur l'analyse de votre portefeuille</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAIActions(false)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                aria-label="Fermer"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {[
                {
                  priority: "high",
                  title: "Débloquer ERP Refonte",
                  description: "Budget dépassé de 8% - Réallouer 50K€ depuis le contingent réserve",
                  impact: "+12% chances succès",
                  confidence: "93%"
                },
                {
                  priority: "high",
                  title: "Renforcer Mobile App v2",
                  description: "Manque 2 développeurs front-end React - Affecter ressources disponibles ou contractor externe",
                  impact: "+3 semaines gain",
                  confidence: "87%"
                },
                {
                  priority: "medium",
                  title: "Livraison anticipée Cloud Migration",
                  description: "Avance de 15% - Opportunité de livrer 2 semaines plus tôt et économiser 30K€",
                  impact: "+30K€ économies",
                  confidence: "81%"
                },
                {
                  priority: "medium",
                  title: "Clarifier dépendances Legacy System",
                  description: "Ralenti par dépendances externes - Organiser point d'alignement avec fournisseurs",
                  impact: "+20% vélocité",
                  confidence: "76%"
                },
                {
                  priority: "low",
                  title: "Audit qualité transverse",
                  description: "3 projets sans revue code depuis 3 semaines - Programmer sessions QA",
                  impact: "-15% risques bugs",
                  confidence: "68%"
                },
                {
                  priority: "low",
                  title: "Optimiser réunions",
                  description: "Temps réunion +35% vs benchmark - Réduire durée et fréquence pour +8h/semaine/personne",
                  impact: "+12% productivité",
                  confidence: "72%"
                }
              ].map((action, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-amber-500/50 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`mt-1 px-2 py-1 rounded-lg text-xs font-semibold ${
                        action.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                        action.priority === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-slate-700/50 text-slate-400'
                      }`}>
                        {action.priority === 'high' ? '🔴 Urgent' : action.priority === 'medium' ? '🟡 Important' : '⚪ Normal'}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1">{action.title}</h3>
                        <p className="text-sm text-slate-400 mb-2">{action.description}</p>
                        <div className="flex items-center gap-4 text-xs">
                          <span className="text-green-400 font-semibold">Impact: {action.impact}</span>
                          <span className="text-slate-500">Confiance: {action.confidence}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => showToast('success', 'Action appliquée', action.title)}
                      className="px-4 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500 hover:text-slate-950 text-amber-400 border border-amber-500/30 hover:border-amber-500 transition-all font-semibold text-sm opacity-0 group-hover:opacity-100"
                    >
                      Appliquer
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-800 flex justify-between">
              <button
                onClick={() => showToast('info', 'Rapport IA', 'Génération du rapport détaillé...')}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                Télécharger rapport complet
              </button>
              <button
                onClick={() => setShowAIActions(false)}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold transition-all"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
      
      <ModalsHub projects={demoProjects} />
    </CockpitShell>
  );
}

function KanbanView({ 
  projects,
  onEdit,
  onDelete,
  onDuplicate,
  onArchive,
  onStar
}: {
  projects: Project[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onArchive: (id: string) => void;
  onStar: (id: string) => void;
}) {
  // Group projects by status
  const groupedProjects = {
    pending: projects.filter(p => p.status === 'pending'),
    active: projects.filter(p => p.status === 'active'),
    paused: projects.filter(p => p.status === 'paused'),
    completed: projects.filter(p => p.status === 'completed')
  };

  const columns = [
    { id: "pending", title: "En attente", count: groupedProjects.pending.length, color: "border-slate-700" },
    { id: "active", title: "En cours", count: groupedProjects.active.length, color: "border-blue-500" },
    { id: "paused", title: "En pause", count: groupedProjects.paused.length, color: "border-amber-500" },
    { id: "completed", title: "Terminés", count: groupedProjects.completed.length, color: "border-green-500" }
  ];

  return (
    <div className="grid md:grid-cols-4 gap-4">
      {columns.map(column => (
        <div key={column.id} className="flex flex-col min-h-[600px]">
          <div className={`border-t-4 ${column.color} rounded-t-xl p-4 bg-slate-900/50 mb-3`}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm uppercase text-slate-300">{column.title}</h3>
              <span className="px-2.5 py-1 rounded-full bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-700">
                {column.count}
              </span>
            </div>
          </div>
          <div className="space-y-3 flex-1 px-1">
            {groupedProjects[column.id as keyof typeof groupedProjects].map(project => (
              <ProjectCardKanban 
                key={project.id}
                project={project}
                onEdit={() => onEdit(project.id)}
                onDelete={() => onDelete(project.id)}
                onDuplicate={() => onDuplicate(project.id)}
                onArchive={() => onArchive(project.id)}
                onStar={() => onStar(project.id)}
              />
            ))}
            {groupedProjects[column.id as keyof typeof groupedProjects].length === 0 && (
              <div className="p-6 text-center text-slate-600 text-sm border-2 border-dashed border-slate-800 rounded-xl">
                Aucun projet
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function ProjectCardKanban({ 
  project,
  onEdit,
  onDelete,
  onDuplicate,
  onArchive,
  onStar
}: { 
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onArchive: () => void;
  onStar: () => void;
}) {
  return (
    <div 
      className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10 transition-all cursor-pointer group"
      onClick={onEdit}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-1">
          <button 
            onClick={(e) => { e.stopPropagation(); onStar(); }}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {project.starred ? (
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            ) : (
              <StarOff className="w-4 h-4 text-slate-500" />
            )}
          </button>
          <StatusBadge status={project.health} size="sm" />
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <ActionMenu 
            items={projectActions(onEdit, onDelete, onDuplicate, onArchive)}
            align="right"
          />
        </div>
      </div>

      {/* Title */}
      <h4 className="font-semibold text-white group-hover:text-amber-400 transition-colors mb-2 line-clamp-2">
        {project.name}
      </h4>

      {/* Description */}
      {project.description && (
        <p className="text-xs text-slate-500 mb-3 line-clamp-2">
          {project.description}
        </p>
      )}

      {/* Progress */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
          <span>Progression</span>
          <span className="font-semibold text-slate-300">{project.progress}%</span>
        </div>
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* Tags */}
      {project.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {project.tags.slice(0, 2).map(tag => (
            <span 
              key={tag} 
              className="px-2 py-0.5 text-xs rounded-md bg-slate-800/70 text-slate-400 border border-slate-700/50"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 2 && (
            <span className="px-2 py-0.5 text-xs rounded-md bg-slate-800/70 text-slate-500 border border-slate-700/50">
              +{project.tags.length - 2}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-semibold text-xs">
            {project.owner.charAt(0)}
          </div>
          <span className="text-xs text-slate-400">{project.owner.split(' ')[0]}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <Clock className="w-3.5 h-3.5" />
          <span>{project.deadline}</span>
        </div>
      </div>
    </div>
  );
}

function ListView({ 
  projects, 
  onEdit, 
  onDelete, 
  onDuplicate, 
  onArchive,
  onStar,
  selectedIds,
  onSelectAll,
  onToggleSelect
}: { 
  projects: Project[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onArchive: (id: string) => void;
  onStar: (id: string) => void;
  selectedIds: string[];
  onSelectAll: () => void;
  onToggleSelect: (id: string) => void;
}) {
  const allSelected = projects.length > 0 && selectedIds.length === projects.length;
  
  return (
    <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950/50">
      <table className="w-full">
        <thead className="bg-slate-900/50 border-b border-slate-800">
          <tr>
            <th className="px-4 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <input 
                type="checkbox" 
                checked={allSelected}
                onChange={onSelectAll}
                className="rounded border-slate-700 bg-slate-900 cursor-pointer"
                aria-label="Sélectionner tous les projets"
              />
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Projet</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Statut</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Santé</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Progression</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Responsable</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Échéance</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Tags</th>
            <th className="px-4 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, idx) => {
            const isSelected = selectedIds.includes(project.id);
            return (
              <tr 
                key={project.id} 
                className={`border-b border-slate-800/50 hover:bg-slate-900/30 transition-all group ${
                  isSelected ? 'bg-amber-500/5' : ''
                }`}
              >
                <td className="px-4 py-4">
                  <input 
                    type="checkbox" 
                    checked={isSelected}
                    onChange={() => onToggleSelect(project.id)}
                    className="rounded border-slate-700 bg-slate-900 cursor-pointer"
                    aria-label={`Sélectionner ${project.name}`}
                  />
                </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => onStar(project.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Ajouter aux favoris"
                  >
                    {project.starred ? (
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    ) : (
                      <StarOff className="w-4 h-4 text-slate-500" />
                    )}
                  </button>
                  <div>
                    <div className="font-semibold text-white hover:text-amber-400 cursor-pointer transition-colors">
                      {project.name}
                    </div>
                    {project.description && (
                      <div className="text-xs text-slate-500 mt-0.5">{project.description}</div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={project.status} size="sm" />
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={project.health} size="sm" />
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden max-w-24">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-slate-300 min-w-[3ch] text-right">
                    {project.progress}%
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-semibold text-sm">
                    {project.owner.charAt(0)}
                  </div>
                  <span className="text-sm text-slate-300">{project.owner}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-slate-400">{project.deadline}</span>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="px-2 py-1 text-xs rounded-md bg-slate-800/50 text-slate-400 border border-slate-700/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center justify-end gap-1">
                  <ActionMenu 
                    items={projectActions(
                      () => onEdit(project.id),
                      () => onDelete(project.id),
                      () => onDuplicate(project.id),
                      () => onArchive(project.id)
                    )}
                    align="right"
                  />
                </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      {projects.length === 0 && (
        <div className="p-12 text-center">
          <div className="text-slate-500 mb-2">Aucun projet trouvé</div>
          <div className="text-sm text-slate-600">Essayez de modifier vos filtres de recherche</div>
        </div>
      )}
    </div>
  );
}

function TimelineView() {
  const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin"];
  const projects = [
    { name: "Cloud Migration", start: 1, duration: 3, health: "green" },
    { name: "ERP Refonte", start: 0, duration: 4, health: "red" },
    { name: "Mobile App v2", start: 2, duration: 2, health: "yellow" },
    { name: "Legacy System", start: 3, duration: 3, health: "yellow" }
  ];

  return (
    <div className="rounded-xl border border-slate-800 overflow-hidden">
      {/* Timeline Header */}
      <div className="grid grid-cols-7 bg-slate-900/50 border-b border-slate-800">
        <div className="px-6 py-4 col-span-1 text-sm font-semibold text-slate-400">Projet</div>
        {months.map((month, idx) => (
          <div key={idx} className="px-4 py-4 text-center text-sm font-semibold text-slate-400 border-l border-slate-800">
            {month}
          </div>
        ))}
      </div>

      {/* Timeline Rows */}
      <div>
        {projects.map((project, idx) => (
          <div key={idx} className="grid grid-cols-7 border-b border-slate-800/50 hover:bg-slate-900/30 transition-colors">
            <div className="px-6 py-4 col-span-1 flex items-center gap-3">
              <div className={`w-2.5 h-2.5 rounded-full ${
                project.health === "green" ? "bg-green-500" :
                project.health === "yellow" ? "bg-yellow-500" :
                "bg-red-500"
              }`} />
              <span className="font-semibold text-sm">{project.name}</span>
            </div>
            <div className="col-span-6 grid grid-cols-6 relative px-2 py-4">
              <div
                className={`absolute top-1/2 -translate-y-1/2 h-8 rounded bg-gradient-to-r ${
                  project.health === "green" ? "from-green-500/30 to-green-500/10 border border-green-500/50" :
                  project.health === "yellow" ? "from-yellow-500/30 to-yellow-500/10 border border-yellow-500/50" :
                  "from-red-500/30 to-red-500/10 border border-red-500/50"
                } ${
                  project.start === 0 && project.duration === 4 ? "left-0 right-1/3" :
                  project.start === 1 && project.duration === 3 ? "left-1/6 right-1/3" :
                  project.start === 2 && project.duration === 2 ? "left-1/3 right-1/3" :
                  "left-1/2 right-0"
                }`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
