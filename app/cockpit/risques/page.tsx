"use client";

import { CockpitShell } from "@/components/cockpit/CockpitShell";
import { useState, useEffect } from "react";
import { Brain, Plus, Search, Filter, AlertTriangle, TrendingUp, Shield, X, Edit2, Trash2, Eye, Zap } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";
import { useCockpit } from "@/components/providers/CockpitProvider";
import { ActionMenu } from "@/components/ui/ActionMenu";

type RiskLevel = "low" | "medium" | "high" | "critical";

interface Risk {
  id: string;
  title: string;
  description: string;
  impact: number;
  probability: number;
  level: RiskLevel;
  project: string;
  owner: string;
  mitigationPlan: string;
  status: string;
}

export default function RisquesPage() {
  const { showToast } = useToast();
  const { getItems, addItem, updateItem, deleteItem, refreshCount } = useCockpit();
  
  const [selectedView, setSelectedView] = useState<"matrix" | "list">("matrix");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [showNewRiskModal, setShowNewRiskModal] = useState(false);
  const [showAIDetectedRisks, setShowAIDetectedRisks] = useState(false);
  const [showMitigationPlans, setShowMitigationPlans] = useState(false);
  const [showSimulation, setShowSimulation] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialiser avec données demo une seule fois
  useEffect(() => {
    if (!isInitialized) {
      const stored = getItems('risks');
      if (stored.length === 0) {
        const demoRisks: Risk[] = [
          { id: "1", title: "Budget ERP dépassé", description: "Le projet ERP a consommé 120K€ de plus que prévu", impact: 4, probability: 4, level: "critical", project: "ERP", owner: "Thomas B.", mitigationPlan: "Réallocation budget + arbitrage COMEX", status: "active" },
          { id: "2", title: "Vulnérabilité npm", description: "Dépendance obsolète avec CVE-2024-1234", impact: 3, probability: 3, level: "high", project: "Mobile", owner: "Sophie M.", mitigationPlan: "Mise à jour urgente package", status: "active" },
          { id: "3", title: "Retard livraison", description: "Délai datacenter de 2 semaines", impact: 4, probability: 2, level: "medium", project: "Cloud", owner: "Marie L.", mitigationPlan: "Architecture hybride temporaire", status: "mitigated" }
        ];
        demoRisks.forEach(r => addItem('risks', r));
      }
      setIsInitialized(true);
    }
  }, [isInitialized, getItems, addItem]);

  // Utiliser directement getItems au lieu d'un state local
  const risks = refreshCount >= 0 ? getItems('risks') : [];

  const handleNewRisk = () => setShowNewRiskModal(true);
  
  const handleViewDetectedRisks = () => {
    setShowAIDetectedRisks(true);
    showToast('info', 'Détection IA', 'Analyse des risques potentiels en cours...');
  };
  
  const handleViewMitigationPlans = () => {
    setShowMitigationPlans(true);
    showToast('info', 'Plans d\'actions', 'Génération des recommandations IA...');
  };
  
  const handleSimulateMitigation = () => {
    setShowSimulation(true);
    showToast('info', 'Simulation', 'Calcul des scénarios de mitigation...');
  };

  const handleCreateRisk = (data: any) => {
    if (!data.title.trim()) {
      showToast('error', 'Erreur', 'Le titre du risque est obligatoire');
      return;
    }

    const riskScore = data.impact * data.probability;
    const level: RiskLevel = riskScore >= 12 ? 'critical' : riskScore >= 8 ? 'high' : riskScore >= 4 ? 'medium' : 'low';

    const newRisk: Risk = {
      id: Date.now().toString(),
      title: data.title,
      description: data.description,
      impact: data.impact,
      probability: data.probability,
      level,
      project: data.project || 'Non assigné',
      owner: data.owner || 'Non assigné',
      mitigationPlan: data.mitigationPlan,
      status: 'active'
    };

    addItem('risks', newRisk);
    setShowNewRiskModal(false);
    showToast('success', '✅ Risque créé', `"${newRisk.title}" a été ajouté avec succès`);
  };

  const handleMitigate = (id: string, title: string) => {
    updateItem('risks', id, { status: 'mitigated' });
    showToast('success', 'Risque mitigé', `"${title}" a été traité`);
  };

  const handleDeleteRisk = (id: string, title: string) => {
    if (confirm(`Supprimer le risque "${title}" ?`)) {
      deleteItem('risks', id);
      showToast('success', 'Risque supprimé', `"${title}" a été supprimé`);
    }
  };

  const filteredRisks = risks.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <CockpitShell>
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Risques</h1>
            <p className="text-slate-400">Matrice dynamique et détection automatique IA</p>
          </div>
          <button onClick={handleNewRisk} className="px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 font-semibold transition-all flex items-center gap-2">
            <Plus size={20} />
            <span>Nouveau risque</span>
          </button>
        </div>

        <div className="mb-6 p-6 rounded-xl bg-gradient-to-br from-red-500/10 via-amber-500/5 to-orange-500/10 border border-red-500/30">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
              <Brain className="text-red-400" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-2">IA Copilote • Détection automatique</h3>
              <p className="text-slate-300 text-sm mb-3">
                <strong className="text-red-400">Nouveau risque critique détecté</strong> sur le projet ERP : 
                dépassement budgétaire de 8% (120K€) avec tendance haussière. J'ai aussi détecté une 
                <strong className="text-amber-400"> vulnérabilité technique</strong> sur Mobile App v2.
              </p>
              <div className="flex flex-wrap gap-2">
                <button onClick={handleViewDetectedRisks} className="px-3 py-1.5 text-sm rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-300 hover:text-red-200 transition-colors">
                  Voir risques détectés
                </button>
                <button onClick={handleViewMitigationPlans} className="px-3 py-1.5 text-sm rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors">
                  Plans d'actions recommandés
                </button>
                <button onClick={handleSimulateMitigation} className="px-3 py-1.5 text-sm rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors">
                  Simuler mitigation
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <StatCard title="Risques actifs" value="12" color="slate" icon={<AlertTriangle size={24} />} />
          <StatCard title="Critiques" value="3" color="red" icon={<AlertTriangle size={24} />} />
          <StatCard title="Mitigés ce mois" value="7" color="green" icon={<Shield size={24} />} />
          <StatCard title="Tendance" value="-15%" color="green" icon={<TrendingUp size={24} />} />
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex gap-2 p-1 bg-slate-900 rounded-lg border border-slate-800">
            <button onClick={() => setSelectedView("matrix")} className={`px-4 py-2 rounded-lg transition-colors text-sm ${selectedView === "matrix" ? "bg-amber-500 text-slate-950 font-semibold" : "text-slate-400 hover:text-white"}`}>
              Matrice
            </button>
            <button onClick={() => setSelectedView("list")} className={`px-4 py-2 rounded-lg transition-colors text-sm ${selectedView === "list" ? "bg-amber-500 text-slate-950 font-semibold" : "text-slate-400 hover:text-white"}`}>
              Liste
            </button>
          </div>

          <div className="flex gap-2 flex-1">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Rechercher un risque..." className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500" />
            </div>
            <button onClick={() => setShowFiltersPanel(!showFiltersPanel)} className={`px-4 py-2 bg-slate-900 border rounded-lg transition-colors flex items-center gap-2 ${showFiltersPanel ? 'border-amber-500 text-amber-400' : 'border-slate-800 text-slate-400 hover:text-white'}`}>
              <Filter size={18} />
              <span className="hidden sm:inline">Filtres</span>
            </button>
          </div>
        </div>

        {showFiltersPanel && (
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 mb-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-semibold text-slate-400 mb-2 block">Niveau</label>
                <select className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200">
                  <option>Tous</option>
                  <option>Critique</option>
                  <option>Fort</option>
                  <option>Moyen</option>
                  <option>Faible</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-400 mb-2 block">Projet</label>
                <select className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200">
                  <option>Tous</option>
                  <option>ERP</option>
                  <option>Mobile</option>
                  <option>Cloud</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-400 mb-2 block">Statut</label>
                <select className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200">
                  <option>Tous</option>
                  <option>Actif</option>
                  <option>Mitigé</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {selectedView === "matrix" ? <RiskMatrix risks={filteredRisks} onMitigate={handleMitigate} /> : <RiskList risks={filteredRisks} onMitigate={handleMitigate} onDelete={handleDeleteRisk} />}
      </div>

      {showNewRiskModal && <NewRiskModal onClose={() => setShowNewRiskModal(false)} onCreate={handleCreateRisk} />}
      {showAIDetectedRisks && <AIDetectedRisksModal onClose={() => setShowAIDetectedRisks(false)} />}
      {showMitigationPlans && <MitigationPlansModal onClose={() => setShowMitigationPlans(false)} />}
      {showSimulation && <SimulationModal onClose={() => setShowSimulation(false)} />}
    </CockpitShell>
  );
}

function StatCard({ title, value, color, icon }: any) {
  const colors = {
    slate: "from-slate-500/20 to-slate-600/10 border-slate-500/30 text-slate-400",
    red: "from-red-500/20 to-red-600/10 border-red-500/30 text-red-400",
    green: "from-green-500/20 to-green-600/10 border-green-500/30 text-green-400"
  };
  return (
    <div className={`p-6 rounded-xl bg-gradient-to-br border ${colors[color as keyof typeof colors]}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-slate-400">{title}</div>
        {icon}
      </div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  );
}

function RiskMatrix({ risks, onMitigate }: { risks: Risk[]; onMitigate: (id: string, title: string) => void }) {
  return (
    <div className="p-8 rounded-xl bg-slate-900 border border-slate-800">
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-2">Matrice Impact / Probabilité</h3>
        <p className="text-sm text-slate-400">Visualisation des risques selon leur criticité</p>
      </div>
      <div className="grid grid-cols-4 grid-rows-4 gap-2 mb-4 aspect-square max-w-2xl">
        {Array.from({ length: 16 }).map((_, idx) => {
          const row = Math.floor(idx / 4);
          const col = idx % 4;
          const impact = 4 - row;
          const probability = col + 1;
          const score = impact * probability;
          const bgColor = score >= 12 ? "bg-red-500/30 border-red-500/50" : score >= 8 ? "bg-orange-500/30 border-orange-500/50" : score >= 4 ? "bg-yellow-500/30 border-yellow-500/50" : "bg-green-500/30 border-green-500/50";
          const cellRisks = risks.filter(r => r.impact === impact && r.probability === probability);
          return (
            <div key={idx} className={`${bgColor} border rounded-lg p-3 flex flex-col items-center justify-center relative hover:border-amber-500/50 transition-colors cursor-pointer group`}>
              <div className="text-xs text-slate-500 absolute top-1 left-1">{impact}x{probability}</div>
              {cellRisks.map(risk => (
                <div key={risk.id} className="relative">
                  <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center text-xs font-bold" title={risk.title}>
                    {risk.project.slice(0, 2)}
                  </div>
                  <div className="absolute hidden group-hover:block left-full ml-2 top-0 bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl z-10 whitespace-nowrap">
                    <div className="text-sm font-bold mb-1">{risk.title}</div>
                    <div className="text-xs text-slate-400 mb-2">{risk.project}</div>
                    <button onClick={() => onMitigate(risk.id, risk.title)} className="px-3 py-1 rounded bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-semibold">
                      Mitiger
                    </button>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RiskList({ risks, onMitigate, onDelete }: { risks: Risk[]; onMitigate: (id: string, title: string) => void; onDelete: (id: string, title: string) => void }) {
  const levelConfig: Record<RiskLevel, any> = {
    low: { label: "Faible", color: "bg-green-500/10 text-green-400 border-green-500/30" },
    medium: { label: "Moyen", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30" },
    high: { label: "Fort", color: "bg-orange-500/10 text-orange-400 border-orange-500/30" },
    critical: { label: "Critique", color: "bg-red-500/10 text-red-400 border-red-500/30" }
  };

  return (
    <div className="space-y-4">
      {risks.map(risk => (
        <div key={risk.id} className="p-6 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold flex-1">{risk.title}</h3>
                <div className="flex gap-2 items-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${levelConfig[risk.level].color}`}>
                    {levelConfig[risk.level].label}
                  </span>
                  <ActionMenu items={[
                    { label: 'Éditer', icon: Edit2, onClick: () => {} },
                    { label: 'Voir détails', icon: Eye, onClick: () => {} },
                    { label: 'Supprimer', icon: Trash2, onClick: () => onDelete(risk.id, risk.title), variant: 'danger' as const }
                  ]} />
                </div>
              </div>
              <p className="text-slate-400 mb-4">{risk.description}</p>
              <div className="flex flex-wrap gap-4 text-sm mb-4">
                <div><span className="text-slate-500">Projet:</span> <span className="text-slate-300 font-semibold">{risk.project}</span></div>
                <div><span className="text-slate-500">Responsable:</span> <span className="text-slate-300 font-semibold">{risk.owner}</span></div>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-amber-500/10 to-sky-500/5 border border-amber-500/20">
                <div className="flex items-start gap-3">
                  <Shield size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-amber-400 mb-1">Plan de mitigation</div>
                    <p className="text-sm text-slate-300">{risk.mitigationPlan}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex lg:flex-col gap-2 lg:w-48">
              <button onClick={() => onMitigate(risk.id, risk.title)} className="px-4 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-400 hover:text-amber-300 font-semibold transition-colors flex-1 lg:flex-none">
                Mitiger
              </button>
              <button className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white font-semibold transition-colors">
                Détails
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function NewRiskModal({ onClose, onCreate }: any) {
  const [formData, setFormData] = useState({ title: '', description: '', impact: 2, probability: 2, project: '', owner: '', mitigationPlan: '' });
  
  const handleSubmit = () => {
    onCreate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-900 rounded-2xl border border-slate-800 max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Nouveau risque</h2>
          <button onClick={onClose} title="Fermer"><X size={24} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-400 mb-2 block">Titre</label>
            <input 
              type="text" 
              value={formData.title} 
              onChange={(e) => setFormData({...formData, title: e.target.value})} 
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200"
              placeholder="Ex: Budget projet dépassé"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-400 mb-2 block">Description</label>
            <textarea 
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})} 
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 resize-none" 
              rows={3}
              placeholder="Décrivez le risque..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-400 mb-2 block">Impact (1-4)</label>
              <input 
                type="number" 
                min="1" 
                max="4" 
                value={formData.impact} 
                onChange={(e) => setFormData({...formData, impact: parseInt(e.target.value)})} 
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200"
                title="Impact du risque"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-400 mb-2 block">Probabilité (1-4)</label>
              <input 
                type="number" 
                min="1" 
                max="4" 
                value={formData.probability} 
                onChange={(e) => setFormData({...formData, probability: parseInt(e.target.value)})} 
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200"
                title="Probabilité d'occurrence"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-400 mb-2 block">Projet</label>
              <input 
                type="text" 
                value={formData.project} 
                onChange={(e) => setFormData({...formData, project: e.target.value})} 
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200"
                placeholder="Nom du projet"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-400 mb-2 block">Responsable</label>
              <input 
                type="text" 
                value={formData.owner} 
                onChange={(e) => setFormData({...formData, owner: e.target.value})} 
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200"
                placeholder="Nom du responsable"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-400 mb-2 block">Plan de mitigation</label>
            <textarea 
              value={formData.mitigationPlan} 
              onChange={(e) => setFormData({...formData, mitigationPlan: e.target.value})} 
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 resize-none" 
              rows={2}
              placeholder="Actions pour mitiger le risque..."
            />
          </div>
        </div>
        <div className="p-6 border-t border-slate-800 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">Annuler</button>
          <button onClick={handleSubmit} className="px-8 py-3 bg-amber-500 hover:bg-amber-600 rounded-lg font-bold transition-colors">Créer le risque</button>
        </div>
      </div>
    </div>
  );
}

function AIDetectedRisksModal({ onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-900 rounded-2xl border border-slate-800 max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Risques détectés par l'IA</h2>
          <button onClick={onClose}><X size={24} /></button>
        </div>
        <div className="p-6 space-y-4">
          {[
            { title: "Dépassement budgétaire ERP", confidence: "94%", severity: "Critique" },
            { title: "Vulnérabilité sécurité Mobile App", confidence: "89%", severity: "Fort" },
            { title: "Risque de retard Cloud Migration", confidence: "76%", severity: "Moyen" }
          ].map((r, i) => (
            <div key={i} className="p-5 rounded-xl bg-slate-800 border border-slate-700">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-lg">{r.title}</h3>
                <span className="px-3 py-1 rounded-full text-xs bg-red-500/20 text-red-400 border border-red-500/30">{r.severity}</span>
              </div>
              <p className="text-sm text-slate-400 mb-3">Confiance IA: {r.confidence}</p>
              <button className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-sm">Créer risque</button>
            </div>
          ))}
        </div>
        <div className="p-6 border-t border-slate-800 flex justify-end">
          <button onClick={onClose} className="px-8 py-3 bg-slate-800 rounded-lg">Fermer</button>
        </div>
      </div>
    </div>
  );
}

function MitigationPlansModal({ onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-900 rounded-2xl border border-slate-800 max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Plans d'actions recommandés</h2>
          <button onClick={onClose}><X size={24} /></button>
        </div>
        <div className="p-6 space-y-4">
          {[
            { risk: "Budget ERP", action: "Réallocation budget + arbitrage COMEX", impact: "Économie 120K€" },
            { risk: "Vulnérabilité npm", action: "Mise à jour urgente packages + audit sécurité", impact: "Résolution CVE critique" },
            { risk: "Retard datacenter", action: "Architecture hybride AWS+On-premise temporaire", impact: "Gain 2 semaines" }
          ].map((p, i) => (
            <div key={i} className="p-5 rounded-xl bg-slate-800 border border-slate-700">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="text-amber-400" size={20} />
                <h3 className="font-bold">{p.risk}</h3>
              </div>
              <p className="text-sm text-slate-300 mb-2">{p.action}</p>
              <p className="text-xs text-green-400">Impact: {p.impact}</p>
            </div>
          ))}
        </div>
        <div className="p-6 border-t border-slate-800 flex justify-end">
          <button onClick={onClose} className="px-8 py-3 bg-slate-800 rounded-lg">Fermer</button>
        </div>
      </div>
    </div>
  );
}

function SimulationModal({ onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-900 rounded-2xl border border-slate-800 max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Simulation de mitigation</h2>
          <button onClick={onClose}><X size={24} /></button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
              <div className="text-sm text-slate-400 mb-1">Scénario actuel</div>
              <div className="text-2xl font-bold text-red-400">12 risques</div>
              <div className="text-xs text-slate-500">Budget impact: 320K€</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-800 border border-green-500/30">
              <div className="text-sm text-slate-400 mb-1">Avec mitigation</div>
              <div className="text-2xl font-bold text-green-400">5 risques</div>
              <div className="text-xs text-slate-500">Budget impact: 80K€</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
              <div className="text-sm text-slate-400 mb-1">Économie potentielle</div>
              <div className="text-2xl font-bold text-amber-400">240K€</div>
              <div className="text-xs text-green-400">-75% risques</div>
            </div>
          </div>
          <div className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/30">
            <Zap className="text-green-400 mb-3" size={32} />
            <h3 className="font-bold mb-2">Recommandation IA</h3>
            <p className="text-sm text-slate-300">
              En appliquant les 3 plans de mitigation prioritaires, vous pouvez réduire l'exposition aux risques de 75% 
              et économiser 240K€ sur le budget global. Temps estimé de mise en œuvre: 3 semaines.
            </p>
          </div>
        </div>
        <div className="p-6 border-t border-slate-800 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-3 bg-slate-800 rounded-lg">Fermer</button>
          <button className="px-8 py-3 bg-green-500 hover:bg-green-600 rounded-lg font-bold">Appliquer les mitigations</button>
        </div>
      </div>
    </div>
  );
}
