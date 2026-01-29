"use client";

import { CockpitShell } from "@/components/cockpit/CockpitShell";
import { ModalsHub } from "@/components/cockpit/ModalsHub";
import { useState } from "react";
import { Brain, Plus, Search, Filter, AlertCircle, CheckCircle2, Clock, MessageSquare, ThumbsUp, ThumbsDown, Eye, X, Edit2, Trash2, Copy } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { StatusBadge } from "@/components/ui/StatusBadge";

type DecisionStatus = "draft" | "pending" | "validated" | "rejected";
type DecisionImpact = "low" | "medium" | "high" | "critical";
type DecisionUrgency = "low" | "medium" | "high" | "critical";

interface Decision {
  id: string;
  title: string;
  description: string;
  status: DecisionStatus;
  impact: DecisionImpact;
  urgency: DecisionUrgency;
  owner: string;
  date: string;
  aiInsight: string;
  project?: string;
}

export default function DecisionsPage() {
  const [selectedImpact, setSelectedImpact] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [showNewDecisionModal, setShowNewDecisionModal] = useState(false);
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedUrgency, setSelectedUrgency] = useState<string>("all");
  const { showToast } = useToast();
  
  // Projets demo
  const demoProjects = [
    { id: "1", name: "Cloud Migration" },
    { id: "2", name: "ERP Refonte" },
    { id: "3", name: "Mobile App v2" }
  ];

  // Demo decisions
  const [decisions, setDecisions] = useState<Decision[]>([
    {
      id: "1",
      title: "Réallocation budget ERP → Mobile App",
      description: "Transférer 120K€ du budget ERP vers Mobile App pour tenir les délais Q1",
      status: "pending",
      impact: "high",
      urgency: "high",
      owner: "Marie Leroux",
      date: "Il y a 2 heures",
      aiInsight: "Impact financier positif. Économie de 120K€ sur les risques ERP. Mobile App critique pour le business.",
      project: "Mobile App v2"
    },
    {
      id: "2",
      title: "Report Sprint 12 de 3 jours",
      description: "Reporter le sprint pour finaliser les tests de sécurité",
      status: "pending",
      impact: "medium",
      urgency: "high",
      owner: "Thomas Bernard",
      date: "Hier",
      aiInsight: "Recommandé. La qualité doit primer sur la vélocité. Les tests de sécurité sont critiques.",
      project: "Cloud Migration"
    },
    {
      id: "3",
      title: "Recrutement 2 devs seniors front-end",
      description: "Renforcer l'équipe Mobile App avec 2 seniors React Native",
      status: "validated",
      impact: "high",
      urgency: "medium",
      owner: "Sophie Martin",
      date: "Il y a 3 jours",
      aiInsight: "Validée. Compétences critiques identifiées. Budget confirmé.",
      project: "Mobile App v2"
    },
    {
      id: "4",
      title: "Migration Cloud Q2 → Q3",
      description: "Reporter la migration cloud au T3 pour sécuriser la préparation",
      status: "draft",
      impact: "critical",
      urgency: "low",
      owner: "Pierre Durand",
      date: "Il y a 5 jours",
      aiInsight: "À analyser. Impact sur la roadmap produit. Dépendances avec 4 autres projets.",
      project: "Cloud Migration"
    }
  ]);

  // Handlers
  const handleNewDecision = () => {
    setShowNewDecisionModal(true);
  };

  const handleViewAIRecommendations = () => {
    setShowAIRecommendations(true);
    showToast('info', 'Recommandations IA', 'Analyse en cours des décisions à prendre...');
  };

  const handleReformulate = () => {
    showToast('info', 'Reformulation IA', 'L\'IA va reformuler votre décision pour plus de clarté');
  };

  const handleAutoPrioritize = () => {
    showToast('success', 'Priorisation', 'Décisions réorganisées selon l\'urgence et l\'impact');
  };

  const handleValidateDecision = (id: string, title: string) => {
    setDecisions(prev => prev.map(d => d.id === id ? { ...d, status: 'validated' as DecisionStatus } : d));
    showToast('success', 'Décision validée', `"${title}" a été approuvée`);
  };

  const handleRejectDecision = (id: string, title: string) => {
    if (confirm(`Rejeter la décision "${title}" ?`)) {
      setDecisions(prev => prev.map(d => d.id === id ? { ...d, status: 'rejected' as DecisionStatus } : d));
      showToast('warning', 'Décision rejetée', `"${title}" a été refusée`);
    }
  };

  const handleComment = (title: string) => {
    showToast('info', 'Commentaire', `Ajout de commentaire pour "${title}"`);
  };

  const handleViewDetails = (title: string) => {
    showToast('info', 'Détails', `Ouverture de "${title}"`);
  };

  const handleCreateDecision = (data: any) => {
    const newDecision: Decision = {
      id: Date.now().toString(),
      title: data.title,
      description: data.description,
      status: 'draft',
      impact: data.impact,
      urgency: data.urgency,
      owner: data.owner,
      date: "À l'instant",
      aiInsight: "Nouvelle décision en attente d'analyse IA",
      project: data.project
    };
    setDecisions(prev => [newDecision, ...prev]);
    setShowNewDecisionModal(false);
    showToast('success', 'Décision créée', `"${data.title}" a été créée avec succès`);
  };

  const handleEditDecision = (id: string) => {
    showToast('info', 'Édition', 'Ouverture du formulaire d\'édition');
  };

  const handleDuplicateDecision = (id: string, title: string) => {
    const original = decisions.find(d => d.id === id);
    if (original) {
      const duplicate: Decision = {
        ...original,
        id: Date.now().toString(),
        title: `${original.title} (Copie)`,
        date: "À l'instant"
      };
      setDecisions(prev => [duplicate, ...prev]);
      showToast('success', 'Décision dupliquée', `"${title}" a été dupliquée`);
    }
  };

  const handleDeleteDecision = (id: string, title: string) => {
    if (confirm(`Supprimer "${title}" ?`)) {
      setDecisions(prev => prev.filter(d => d.id !== id));
      showToast('success', 'Décision supprimée', `"${title}" a été supprimée`);
    }
  };

  // Filtering
  const filteredDecisions = decisions.filter(decision => {
    const matchesSearch = decision.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         decision.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesImpact = selectedImpact === "all" || decision.impact === selectedImpact;
    const matchesStatus = selectedStatus === "all" || decision.status === selectedStatus;
    const matchesUrgency = selectedUrgency === "all" || decision.urgency === selectedUrgency;
    return matchesSearch && matchesImpact && matchesStatus && matchesUrgency;
  });

  return (
    <CockpitShell>
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Décisions</h1>
            <p className="text-slate-400">Registre de décisions avec IA narrative</p>
          </div>
          <button 
            onClick={handleNewDecision}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 font-semibold transition-all flex items-center gap-2"
          >
            <Plus size={20} />
            <span>Nouvelle décision</span>
          </button>
        </div>

        {/* AI Insights */}
        <div className="mb-6 p-6 rounded-xl bg-gradient-to-br from-amber-500/10 via-sky-500/5 to-purple-500/10 border border-amber-500/30">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <Brain className="text-amber-400" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-2">IA Copilote • Décisions à prendre</h3>
              <p className="text-slate-300 text-sm mb-3">
                <strong className="text-amber-400">3 décisions urgentes</strong> requièrent votre attention. Je recommande de valider 
                <strong className="text-white"> la réallocation budget ERP → Mobile</strong> (impact financier positif, 
                économie de 120K€) et de <strong className="text-white">reporter le Sprint 12 de 3 jours</strong> pour sécuriser la qualité des livrables.
              </p>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={handleViewAIRecommendations}
                  className="px-3 py-1.5 text-sm rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 hover:text-amber-200 transition-colors"
                >
                  Voir décisions recommandées
                </button>
                <button 
                  onClick={handleReformulate}
                  className="px-3 py-1.5 text-sm rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
                >
                  Reformuler une décision
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
          {/* Impact Filter */}
          <div className="flex gap-2 p-1 bg-slate-900 rounded-lg border border-slate-800 overflow-x-auto">
            <button
              onClick={() => setSelectedImpact("all")}
              className={`px-4 py-2 rounded-lg transition-colors text-sm whitespace-nowrap ${
                selectedImpact === "all"
                  ? "bg-amber-500 text-slate-950 font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Toutes
            </button>
            <button
              onClick={() => setSelectedImpact("critical")}
              className={`px-4 py-2 rounded-lg transition-colors text-sm whitespace-nowrap ${
                selectedImpact === "critical"
                  ? "bg-amber-500 text-slate-950 font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Critiques
            </button>
            <button
              onClick={() => setSelectedImpact("high")}
              className={`px-4 py-2 rounded-lg transition-colors text-sm whitespace-nowrap ${
                selectedImpact === "high"
                  ? "bg-amber-500 text-slate-950 font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Importantes
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
                placeholder="Rechercher une décision..."
                className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
            <button 
              onClick={() => setShowFiltersPanel(!showFiltersPanel)}
              className={`px-4 py-2 bg-slate-900 border rounded-lg transition-colors flex items-center gap-2 ${
                showFiltersPanel ? 'border-amber-500 text-amber-400' : 'border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <Filter size={18} />
              <span className="hidden sm:inline">Filtres</span>
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFiltersPanel && (
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 mb-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-semibold text-slate-400 mb-2 block">Statut</label>
                <select 
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="all">Tous</option>
                  <option value="draft">Brouillon</option>
                  <option value="pending">En attente</option>
                  <option value="validated">Validée</option>
                  <option value="rejected">Refusée</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-400 mb-2 block">Urgence</label>
                <select 
                  value={selectedUrgency}
                  onChange={(e) => setSelectedUrgency(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="all">Toutes</option>
                  <option value="critical">Critique</option>
                  <option value="high">Haute</option>
                  <option value="medium">Moyenne</option>
                  <option value="low">Faible</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSelectedStatus("all");
                    setSelectedUrgency("all");
                    setSelectedImpact("all");
                    showToast('info', 'Filtres réinitialisés', 'Tous les filtres ont été effacés');
                  }}
                  className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors"
                >
                  Réinitialiser
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Decisions Grid */}
        <div className="space-y-4">
          {filteredDecisions.length > 0 ? (
            filteredDecisions.map(decision => (
              <DecisionCard
                key={decision.id}
                decision={decision}
                onValidate={handleValidateDecision}
                onReject={handleRejectDecision}
                onComment={handleComment}
                onViewDetails={handleViewDetails}
                onEdit={handleEditDecision}
                onDuplicate={handleDuplicateDecision}
                onDelete={handleDeleteDecision}
              />
            ))
          ) : (
            <div className="text-center py-12 text-slate-400">
              <AlertCircle size={48} className="mx-auto mb-4 opacity-50" />
              <p>Aucune décision ne correspond aux critères de recherche</p>
            </div>
          )}
        </div>
      </div>

      {/* New Decision Modal */}
      {showNewDecisionModal && (
        <NewDecisionModal
          onClose={() => setShowNewDecisionModal(false)}
          onCreate={handleCreateDecision}
          projects={demoProjects}
        />
      )}

      {/* AI Recommendations Modal */}
      {showAIRecommendations && (
        <AIRecommendationsModal
          onClose={() => setShowAIRecommendations(false)}
        />
      )}
      
      <ModalsHub projects={demoProjects} />
    </CockpitShell>
  );
}

function DecisionCard({
  decision,
  onValidate,
  onReject,
  onComment,
  onViewDetails,
  onEdit,
  onDuplicate,
  onDelete
}: {
  decision: Decision;
  onValidate: (id: string, title: string) => void;
  onReject: (id: string, title: string) => void;
  onComment: (title: string) => void;
  onViewDetails: (title: string) => void;
  onEdit: (id: string) => void;
  onDuplicate: (id: string, title: string) => void;
  onDelete: (id: string, title: string) => void;
}) {
  const statusConfig = {
    draft: { label: "Brouillon", color: "bg-slate-500/10 text-slate-400 border-slate-500/30" },
    pending: { label: "En attente", color: "bg-amber-500/10 text-amber-400 border-amber-500/30" },
    validated: { label: "Validée", color: "bg-green-500/10 text-green-400 border-green-500/30" },
    rejected: { label: "Refusée", color: "bg-red-500/10 text-red-400 border-red-500/30" }
  };

  const impactConfig = {
    low: { label: "Faible", color: "bg-slate-600" },
    medium: { label: "Moyen", color: "bg-blue-500" },
    high: { label: "Fort", color: "bg-amber-500" },
    critical: { label: "Critique", color: "bg-red-500" }
  };

  return (
    <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-bold flex-1">{decision.title}</h3>
            <div className="flex gap-2 items-center">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig[decision.status].color}`}>
                {statusConfig[decision.status].label}
              </span>
              <ActionMenu
                items={[
                  { label: 'Éditer', icon: Edit2, onClick: () => onEdit(decision.id) },
                  { label: 'Dupliquer', icon: Copy, onClick: () => onDuplicate(decision.id, decision.title) },
                  { label: 'Supprimer', icon: Trash2, onClick: () => onDelete(decision.id, decision.title), variant: 'danger' as const }
                ]}
              />
            </div>
          </div>
          <p className="text-slate-400 mb-4">{decision.description}</p>

          {/* Metadata */}
          <div className="flex flex-wrap gap-4 text-sm mb-4">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Impact:</span>
              <span className={`px-2 py-1 rounded ${impactConfig[decision.impact].color} text-white text-xs font-semibold`}>
                {impactConfig[decision.impact].label}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Responsable:</span>
              <span className="text-slate-300 font-semibold">{decision.owner}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-slate-500" />
              <span className="text-slate-400">{decision.date}</span>
            </div>
            {decision.project && (
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Projet:</span>
                <span className="text-slate-300 font-semibold">{decision.project}</span>
              </div>
            )}
          </div>

          {/* AI Insight */}
          <div className="p-4 rounded-lg bg-gradient-to-br from-amber-500/10 to-sky-500/5 border border-amber-500/20">
            <div className="flex items-start gap-3">
              <Brain size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-amber-400 mb-1">Analyse IA</div>
                <p className="text-sm text-slate-300">{decision.aiInsight}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex lg:flex-col gap-2 lg:w-48">
          <button 
            onClick={() => onValidate(decision.id, decision.title)}
            className="px-4 py-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-400 hover:text-green-300 font-semibold transition-colors flex items-center justify-center gap-2 flex-1 lg:flex-none"
          >
            <ThumbsUp size={18} />
            <span>Valider</span>
          </button>
          <button 
            onClick={() => onReject(decision.id, decision.title)}
            className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 hover:text-red-300 font-semibold transition-colors flex items-center justify-center gap-2 flex-1 lg:flex-none"
          >
            <ThumbsDown size={18} />
            <span>Rejeter</span>
          </button>
          <button 
            onClick={() => onComment(decision.title)}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <MessageSquare size={18} />
            <span>Commenter</span>
          </button>
          <button 
            onClick={() => onViewDetails(decision.title)}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Eye size={18} />
            <span>Détails</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function NewDecisionModal({ onClose, onCreate, projects }: { onClose: () => void; onCreate: (data: any) => void; projects: any[] }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    impact: 'medium' as DecisionImpact,
    urgency: 'medium' as DecisionUrgency,
    owner: '',
    project: ''
  });

  const handleSubmit = () => {
    if (!formData.title || !formData.owner) {
      alert('Veuillez remplir les champs obligatoires');
      return;
    }
    onCreate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-900 rounded-2xl border border-slate-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Nouvelle décision</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-400 mb-2 block">Titre *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500"
              placeholder="Ex: Réallocation budget ERP"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-400 mb-2 block">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500 resize-none"
              rows={4}
              placeholder="Décrivez la décision..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-400 mb-2 block">Impact</label>
              <select
                value={formData.impact}
                onChange={(e) => setFormData({ ...formData, impact: e.target.value as DecisionImpact })}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="low">Faible</option>
                <option value="medium">Moyen</option>
                <option value="high">Fort</option>
                <option value="critical">Critique</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-400 mb-2 block">Urgence</label>
              <select
                value={formData.urgency}
                onChange={(e) => setFormData({ ...formData, urgency: e.target.value as DecisionUrgency })}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="low">Faible</option>
                <option value="medium">Moyenne</option>
                <option value="high">Haute</option>
                <option value="critical">Critique</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-400 mb-2 block">Responsable *</label>
              <input
                type="text"
                value={formData.owner}
                onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500"
                placeholder="Nom du responsable"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-400 mb-2 block">Projet</label>
              <select
                value={formData.project}
                onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="">Sélectionner un projet</option>
                {projects.map(p => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-800 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg font-semibold transition-colors">
            Annuler
          </button>
          <button onClick={handleSubmit} className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-lg font-bold transition-all">
            Créer la décision
          </button>
        </div>
      </div>
    </div>
  );
}

function AIRecommendationsModal({ onClose }: { onClose: () => void }) {
  const recommendations = [
    { title: "Valider réallocation budget ERP → Mobile", impact: "Économie 120K€, réduction risques", priority: "Haute", confidence: "94%" },
    { title: "Reporter Sprint 12 de 3 jours", impact: "Sécuriser qualité livrables", priority: "Haute", confidence: "89%" },
    { title: "Approuver recrutement 2 devs seniors", impact: "Renforcer compétences critiques", priority: "Moyenne", confidence: "87%" },
    { title: "Rejeter extension scope projet Analytics", impact: "Éviter dérive budgétaire -80K€", priority: "Moyenne", confidence: "82%" },
    { title: "Valider migration Cloud Q2", impact: "Tenir roadmap produit", priority: "Faible", confidence: "76%" },
    { title: "Reporter décision infrastructure AWS", impact: "Attendre analyse complète", priority: "Faible", confidence: "71%" }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-900 rounded-2xl border border-slate-800 max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">Recommandations IA</h2>
            <p className="text-sm text-slate-400">6 décisions suggérées par l'intelligence artificielle</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {recommendations.map((rec, idx) => (
            <div key={idx} className="p-5 rounded-xl bg-slate-800 border border-slate-700 hover:border-amber-500/50 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">{rec.title}</h3>
                  <p className="text-sm text-slate-400">{rec.impact}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  {rec.confidence} confiance
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Priorité: <span className="text-slate-300 font-semibold">{rec.priority}</span></span>
                <div className="flex gap-2">
                  <button className="px-4 py-1.5 rounded-lg bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-400 text-sm font-semibold transition-colors">
                    Approuver
                  </button>
                  <button className="px-4 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 border border-slate-600 text-slate-300 text-sm font-semibold transition-colors">
                    Ignorer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-slate-800 flex justify-end">
          <button onClick={onClose} className="px-8 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg font-semibold transition-colors">
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
