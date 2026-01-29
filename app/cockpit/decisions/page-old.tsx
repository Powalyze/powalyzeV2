"use client";

import { CockpitShell } from "@/components/cockpit/CockpitShell";
import { ModalsHub } from "@/components/cockpit/ModalsHub";
import { useState } from "react";
import { Brain, Plus, Search, Filter, AlertCircle, CheckCircle2, Clock, MessageSquare, ThumbsUp, ThumbsDown, Eye } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { StatusBadge } from "@/components/ui/StatusBadge";

type DecisionStatus = "draft" | "pending" | "validated" | "rejected";
type DecisionImpact = "low" | "medium" | "high" | "critical";

export default function DecisionsPage() {
  const [selectedImpact, setSelectedImpact] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [showNewDecisionModal, setShowNewDecisionModal] = useState(false);
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);
  const { showToast } = useToast();
  
  // Projets demo
  const demoProjects = [
    { id: "1", name: "Cloud Migration" },
    { id: "2", name: "ERP Refonte" },
    { id: "3", name: "Mobile App v2" }
  ];

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

  const handleValidateDecision = (title: string) => {
    showToast('success', 'Décision validée', `"${title}" a été approuvée`);
  };

  const handleRejectDecision = (title: string) => {
    if (confirm(`Rejeter la décision "${title}" ?`)) {
      showToast('warning', 'Décision rejetée', `"${title}" a été refusée`);
    }
  };

  const handleComment = (title: string) => {
    showToast('info', 'Commentaire', `Ajout de commentaire pour "${title}"`);
  };

  const handleViewDetails = (title: string) => {
    showToast('info', 'Détails', `Ouverture de "${title}"`);
  };

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
                La décision de recrutement pourrait attendre la fin du mois selon les prévisions de charge.
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
          <div className="flex gap-2 p-1 bg-slate-900 rounded-lg border border-slate-800">
            <button
              onClick={() => setSelectedImpact("all")}
              className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                selectedImpact === "all"
                  ? "bg-amber-500 text-slate-950 font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Toutes
            </button>
            <button
              onClick={() => setSelectedImpact("critical")}
              className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                selectedImpact === "critical"
                  ? "bg-amber-500 text-slate-950 font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Critiques
            </button>
            <button
              onClick={() => setSelectedImpact("high")}
              className={`px-4 py-2 rounded-lg transition-colors text-sm ${
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
                placeholder="Rechercher une décision..."
                className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
            <button className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white hover:border-slate-700 transition-colors flex items-center gap-2">
              <Filter size={18} />
              <span className="hidden sm:inline">Filtres</span>
            </button>
          </div>
        </div>

        {/* Decisions Grid */}
        <div className="space-y-4">
          <DecisionCard
            title="Réallocation budget ERP → Mobile App"
            description="Transférer 120K€ du budget ERP vers Mobile App pour tenir les délais Q1"
            status="pending"
            impact="high"
            urgency="high"
            owner="Marie Leroux"
            date="Il y a 2 heures"
            aiInsight="Impact financier positif. Économie de 120K€ sur les risques ERP. Mobile App critique pour le business."
          />
          <DecisionCard
            title="Report Sprint 12 de 3 jours"
            description="Reporter le sprint pour finaliser les tests de sécurité"
            status="pending"
            impact="medium"
            urgency="high"
            owner="Thomas Bernard"
            date="Hier"
            aiInsight="Recommandé. La qualité doit primer sur la vélocité. Les tests de sécurité sont critiques."
          />
          <DecisionCard
            title="Recrutement 2 devs seniors front-end"
            description="Renforcer l'équipe Mobile App avec 2 seniors React Native"
            status="validated"
            impact="high"
            urgency="medium"
            owner="Sophie Martin"
            date="Il y a 3 jours"
            aiInsight="Validée. Compétences critiques identifiées. Budget confirmé."
          />
          <DecisionCard
            title="Migration Cloud Q2 → Q3"
            description="Reporter la migration cloud au T3 pour sécuriser la préparation"
            status="draft"
            impact="critical"
            urgency="low"
            owner="Pierre Durand"
            date="Il y a 5 jours"
            aiInsight="À analyser. Impact sur la roadmap produit. Dépendances avec 4 autres projets."
          />
        </div>
      </div>
      
      <ModalsHub projects={demoProjects} />
    </CockpitShell>
  );
}

function DecisionCard({
  title,
  description,
  status,
  impact,
  urgency,
  owner,
  date,
  aiInsight
}: {
  title: string;
  description: string;
  status: DecisionStatus;
  impact: DecisionImpact;
  urgency: string;
  owner: string;
  date: string;
  aiInsight: string;
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
            <h3 className="text-xl font-bold flex-1">{title}</h3>
            <div className="flex gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig[status].color}`}>
                {statusConfig[status].label}
              </span>
            </div>
          </div>
          <p className="text-slate-400 mb-4">{description}</p>

          {/* Metadata */}
          <div className="flex flex-wrap gap-4 text-sm mb-4">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Impact:</span>
              <span className={`px-2 py-1 rounded ${impactConfig[impact].color} text-white text-xs font-semibold`}>
                {impactConfig[impact].label}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Urgence:</span>
              <span className="text-slate-300 font-semibold">{urgency === "high" ? "Haute" : urgency === "medium" ? "Moyenne" : "Faible"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Responsable:</span>
              <span className="text-slate-300 font-semibold">{owner}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <Clock size={14} />
              <span>{date}</span>
            </div>
          </div>

          {/* AI Insight */}
          <div className="p-4 rounded-lg bg-gradient-to-br from-amber-500/10 to-sky-500/5 border border-amber-500/20">
            <div className="flex items-start gap-3">
              <Brain size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-amber-400 mb-1">IA Copilote</div>
                <p className="text-sm text-slate-300">{aiInsight}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex lg:flex-col gap-2 lg:w-48">
          {status === "pending" && (
            <>
              <button className="px-4 py-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-400 hover:text-green-300 font-semibold transition-colors flex items-center justify-center gap-2 flex-1 lg:flex-none">
                <CheckCircle2 size={18} />
                <span>Valider</span>
              </button>
              <button className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 hover:text-red-300 font-semibold transition-colors flex items-center justify-center gap-2 flex-1 lg:flex-none">
                <AlertCircle size={18} />
                <span>Refuser</span>
              </button>
            </>
          )}
          <button className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white font-semibold transition-colors">
            Détails
          </button>
        </div>
      </div>
    </div>
  );
}
