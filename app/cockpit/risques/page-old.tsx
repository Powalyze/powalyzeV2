"use client";

import { CockpitShell } from "@/components/cockpit/CockpitShell";
import { ModalsHub } from "@/components/cockpit/ModalsHub";
import { useState } from "react";
import { Brain, Plus, Search, Filter, AlertTriangle, TrendingUp, Shield } from "lucide-react";

type RiskLevel = "low" | "medium" | "high" | "critical";

export default function RisquesPage() {
  const [selectedView, setSelectedView] = useState<"matrix" | "list">("matrix");
  
  // Projets demo
  const demoProjects = [
    { id: "1", name: "Cloud Migration" },
    { id: "2", name: "ERP Refonte" },
    { id: "3", name: "Mobile App v2" }
  ];

  return (
    <CockpitShell>
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Risques</h1>
            <p className="text-slate-400">Matrice dynamique et détection automatique IA</p>
          </div>
          <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 font-semibold transition-all flex items-center gap-2">
            <Plus size={20} />
            <span>Nouveau risque</span>
          </button>
        </div>

        {/* AI Insights */}
        <div className="mb-6 p-6 rounded-xl bg-gradient-to-br from-red-500/10 via-amber-500/5 to-orange-500/10 border border-red-500/30">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
              <Brain className="text-red-400" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-2">IA Copilote • Détection automatique</h3>
              <p className="text-slate-300 text-sm mb-3">
                <strong className="text-red-400">Nouveau risque critique détecté</strong> sur le projet ERP : 
                dépassement budgétaire de 8% (120K€) avec tendance haussière. Impact estimé à 
                <strong className="text-white"> 15 jours de retard supplémentaires</strong>. 
                J'ai aussi détecté une <strong className="text-amber-400">vulnérabilité technique</strong> sur Mobile App v2 
                (dépendance npm obsolète avec CVE critique).
              </p>
              <div className="flex flex-wrap gap-2">
                <button className="px-3 py-1.5 text-sm rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-300 hover:text-red-200 transition-colors">
                  Voir risques détectés
                </button>
                <button className="px-3 py-1.5 text-sm rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors">
                  Plans d'actions recommandés
                </button>
                <button className="px-3 py-1.5 text-sm rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors">
                  Simuler mitigation
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <StatCard title="Risques actifs" value="12" color="slate" icon={<AlertTriangle size={24} />} />
          <StatCard title="Critiques" value="3" color="red" icon={<AlertTriangle size={24} />} />
          <StatCard title="Mitigés ce mois" value="7" color="green" icon={<Shield size={24} />} />
          <StatCard title="Tendance" value="-15%" color="green" icon={<TrendingUp size={24} />} />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* View Toggle */}
          <div className="flex gap-2 p-1 bg-slate-900 rounded-lg border border-slate-800">
            <button
              onClick={() => setSelectedView("matrix")}
              className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                selectedView === "matrix"
                  ? "bg-amber-500 text-slate-950 font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Matrice
            </button>
            <button
              onClick={() => setSelectedView("list")}
              className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                selectedView === "list"
                  ? "bg-amber-500 text-slate-950 font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Liste
            </button>
          </div>

          {/* Search & Filters */}
          <div className="flex gap-2 flex-1">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher un risque..."
                className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
            <button className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white hover:border-slate-700 transition-colors flex items-center gap-2">
              <Filter size={18} />
              <span className="hidden sm:inline">Filtres</span>
            </button>
          </div>
        </div>

        {/* Views */}
        {selectedView === "matrix" ? <RiskMatrix /> : <RiskList />}
      </div>
    </CockpitShell>
  );
}

function StatCard({ title, value, color, icon }: { title: string; value: string; color: string; icon: React.ReactNode }) {
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

function RiskMatrix() {
  const risks = [
    { id: 1, name: "Budget ERP dépassé", impact: 4, probability: 4, project: "ERP" },
    { id: 2, name: "Vulnérabilité npm", impact: 3, probability: 3, project: "Mobile" },
    { id: 3, name: "Retard livraison", impact: 4, probability: 2, project: "Cloud" },
    { id: 4, name: "Perte compétence", impact: 3, probability: 2, project: "Legacy" },
    { id: 5, name: "Périmètre flou", impact: 2, probability: 3, project: "Analytics" }
  ];

  return (
    <div className="p-8 rounded-xl bg-slate-900 border border-slate-800">
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-2">Matrice Impact / Probabilité</h3>
        <p className="text-sm text-slate-400">Visualisation des risques selon leur criticité</p>
      </div>

      {/* Matrix Grid */}
      <div className="relative">
        {/* Y-axis label */}
        <div className="absolute -left-16 top-1/2 -translate-y-1/2 -rotate-90 text-sm font-semibold text-slate-400">
          Impact →
        </div>

        {/* Matrix */}
        <div className="grid grid-cols-4 grid-rows-4 gap-2 mb-4 aspect-square max-w-2xl">
          {Array.from({ length: 16 }).map((_, idx) => {
            const row = Math.floor(idx / 4);
            const col = idx % 4;
            const impact = 4 - row;
            const probability = col + 1;
            
            // Calculate risk level
            const score = impact * probability;
            const bgColor = 
              score >= 12 ? "bg-red-500/30 border-red-500/50" :
              score >= 8 ? "bg-orange-500/30 border-orange-500/50" :
              score >= 4 ? "bg-yellow-500/30 border-yellow-500/50" :
              "bg-green-500/30 border-green-500/50";

            // Find risks in this cell
            const cellRisks = risks.filter(r => r.impact === impact && r.probability === probability);

            return (
              <div
                key={idx}
                className={`${bgColor} border rounded-lg p-3 flex flex-col items-center justify-center relative hover:border-amber-500/50 transition-colors`}
              >
                <div className="text-xs text-slate-500 absolute top-1 left-1">{impact}x{probability}</div>
                {cellRisks.map(risk => (
                  <div
                    key={risk.id}
                    className="w-8 h-8 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center text-xs font-bold cursor-pointer hover:scale-110 transition-transform"
                    title={risk.name}
                  >
                    {risk.project.slice(0, 2)}
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* X-axis label */}
        <div className="text-center text-sm font-semibold text-slate-400">← Probabilité</div>
      </div>

      {/* Legend */}
      <div className="mt-8 flex flex-wrap gap-4">
        {risks.map(risk => (
          <div key={risk.id} className="flex items-center gap-2 text-sm">
            <div className="w-6 h-6 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center text-xs font-bold">
              {risk.project.slice(0, 2)}
            </div>
            <span className="text-slate-300">{risk.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RiskList() {
  const risks = [
    {
      id: 1,
      title: "Budget ERP dépassé de 8%",
      description: "Le projet ERP a consommé 120K€ de plus que prévu avec tendance haussière",
      level: "critical" as RiskLevel,
      project: "ERP Refonte",
      owner: "Thomas B.",
      mitigationPlan: "Réallocation budget + arbitrage COMEX",
      status: "active"
    },
    {
      id: 2,
      title: "Vulnérabilité npm critique détectée",
      description: "Dépendance obsolète avec CVE-2024-1234 sur Mobile App v2",
      level: "high" as RiskLevel,
      project: "Mobile App v2",
      owner: "Sophie M.",
      mitigationPlan: "Mise à jour urgente package + tests sécurité",
      status: "active"
    },
    {
      id: 3,
      title: "Retard livraison infrastructure AWS",
      description: "Délai d'approvisionnement datacenter de 2 semaines supplémentaires",
      level: "medium" as RiskLevel,
      project: "Cloud Migration",
      owner: "Marie L.",
      mitigationPlan: "Architecture hybride temporaire",
      status: "mitigated"
    }
  ];

  return (
    <div className="space-y-4">
      {risks.map(risk => (
        <RiskCard key={risk.id} risk={risk} />
      ))}
    </div>
  );
}

function RiskCard({ risk }: { 
  risk: {
    id: number;
    title: string;
    description: string;
    level: RiskLevel;
    project: string;
    owner: string;
    mitigationPlan: string;
    status: string;
  }
}) {
  const levelConfig: Record<RiskLevel, { label: string; color: string }> = {
    low: { label: "Faible", color: "bg-green-500/10 text-green-400 border-green-500/30" },
    medium: { label: "Moyen", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30" },
    high: { label: "Fort", color: "bg-orange-500/10 text-orange-400 border-orange-500/30" },
    critical: { label: "Critique", color: "bg-red-500/10 text-red-400 border-red-500/30" }
  };

  return (
    <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-bold flex-1">{risk.title}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${levelConfig[risk.level].color}`}>
              {levelConfig[risk.level].label}
            </span>
          </div>
          <p className="text-slate-400 mb-4">{risk.description}</p>

          <div className="flex flex-wrap gap-4 text-sm mb-4">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Projet:</span>
              <span className="text-slate-300 font-semibold">{risk.project}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Responsable:</span>
              <span className="text-slate-300 font-semibold">{risk.owner}</span>
            </div>
          </div>

          {/* Mitigation Plan */}
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
          <button className="px-4 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-400 hover:text-amber-300 font-semibold transition-colors flex-1 lg:flex-none">
            Mitiger
          </button>
          <button className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white font-semibold transition-colors">
            Détails
          </button>
        </div>
      </div>
    </div>
  );
}
