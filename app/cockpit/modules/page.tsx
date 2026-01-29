"use client";

import { CockpitShell } from "@/components/cockpit/CockpitShell";
import { useState } from "react";
import { Brain, CheckCircle2, Settings, FileText, AlertTriangle, Target, BarChart3, Globe, Users, Zap } from "lucide-react";

type ModuleStatus = "active" | "inactive";

type Module = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: ModuleStatus;
  price: string;
  features: string[];
};

export default function ModulesPage() {
  const [modules, setModules] = useState<Module[]>([
    {
      id: "projets",
      name: "Projets",
      description: "Gestion de projets avec Kanban, Liste, Timeline",
      icon: <Target size={32} className="text-blue-400" />,
      status: "active",
      price: "Inclus",
      features: ["Kanban board", "Vue liste", "Timeline", "Rituels Agile"]
    },
    {
      id: "decisions",
      name: "Décisions",
      description: "Registre de décisions avec Impact/Urgence",
      icon: <CheckCircle2 size={32} className="text-green-400" />,
      status: "active",
      price: "Inclus",
      features: ["Registre complet", "Impact analysis", "Historique", "IA propose"]
    },
    {
      id: "risques",
      name: "Risques",
      description: "Matrice dynamique et détection automatique IA",
      icon: <AlertTriangle size={32} className="text-red-400" />,
      status: "active",
      price: "Inclus",
      features: ["Matrice 4x4", "Détection IA", "Plans mitigation", "Alertes"]
    },
    {
      id: "rapports",
      name: "Rapports",
      description: "Rapports narratifs automatiques avec IA",
      icon: <FileText size={32} className="text-purple-400" />,
      status: "active",
      price: "Inclus",
      features: ["Storytelling IA", "Export PDF", "Rapports COMEX", "PowerBI"]
    },
    {
      id: "ia",
      name: "IA Copilote",
      description: "Assistant intelligent avec chat et coaching",
      icon: <Brain size={32} className="text-amber-400" />,
      status: "active",
      price: "CHF 500/mois",
      features: ["Analyse globale", "Suggestions", "Prédictions", "Multilingue"]
    },
    {
      id: "powerbi",
      name: "Power BI",
      description: "Connecteurs et dashboards interactifs",
      icon: <BarChart3 size={32} className="text-cyan-400" />,
      status: "inactive",
      price: "CHF 400/mois",
      features: ["Dashboards live", "Connecteurs", "Export", "Embed"]
    },
    {
      id: "multilingue",
      name: "Multilingue",
      description: "Interface en FR, EN, DE, IT",
      icon: <Globe size={32} className="text-indigo-400" />,
      status: "inactive",
      price: "CHF 200/mois",
      features: ["4 langues", "Traduction IA", "UI adaptée", "Rapports"]
    },
    {
      id: "collaboration",
      name: "Collaboration",
      description: "Partage, commentaires, notifications",
      icon: <Users size={32} className="text-pink-400" />,
      status: "inactive",
      price: "CHF 300/mois",
      features: ["Commentaires", "Mentions", "Notifications", "Chat équipe"]
    }
  ]);

  const toggleModule = (moduleId: string) => {
    setModules(prev =>
      prev.map(m =>
        m.id === moduleId
          ? { ...m, status: m.status === "active" ? "inactive" : "active" }
          : m
      )
    );
  };

  const activeModules = modules.filter(m => m.status === "active");
  const totalCost = modules
    .filter(m => m.status === "active" && m.price.includes("CHF"))
    .reduce((sum, m) => sum + parseInt(m.price.match(/\d+/)?.[0] || "0"), 990);

  return (
    <CockpitShell>
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Modules</h1>
          <p className="text-slate-400">Activez et désactivez les modules selon vos besoins</p>
        </div>

        {/* AI Insights */}
        <div className="mb-8 p-6 rounded-xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-yellow-500/10 border border-amber-500/30">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <Brain className="text-amber-400" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-2">IA Copilote • Recommandations modules</h3>
              <p className="text-slate-300 text-sm mb-3">
                Selon votre usage, je recommande d'activer <strong className="text-amber-400">Power BI</strong> 
                (vous avez 156 rapports générés) et <strong className="text-amber-400">Collaboration</strong> 
                (15 utilisateurs dans votre organisation). Ces modules augmenteraient votre ROI de 
                <strong className="text-white"> +35%</strong> selon mes prévisions.
              </p>
              <div className="flex flex-wrap gap-2">
                <button className="px-3 py-1.5 text-sm rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 hover:text-amber-200 transition-colors">
                  Activer recommandations
                </button>
                <button className="px-3 py-1.5 text-sm rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors">
                  Calculer ROI détaillé
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <SummaryCard title="Modules actifs" value={activeModules.length.toString()} color="green" />
          <SummaryCard title="Modules disponibles" value={modules.length.toString()} color="blue" />
          <SummaryCard title="Coût mensuel" value={`CHF ${totalCost}`} color="amber" />
          <SummaryCard title="Économies" value="CHF 450" color="purple" />
        </div>

        {/* Modules Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Vos modules</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {modules.map((module) => (
              <ModuleCard
                key={module.id}
                module={module}
                onToggle={() => toggleModule(module.id)}
              />
            ))}
          </div>
        </div>

        {/* Custom Module */}
        <div className="p-8 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
              <Zap size={32} className="text-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">Module personnalisé</h3>
              <p className="text-slate-400 mb-4">
                Besoin d'un module sur mesure ? Nous pouvons développer des fonctionnalités spécifiques 
                pour votre organisation (workflows métier, intégrations custom, rapports spécialisés).
              </p>
              <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 font-semibold transition-all">
                Demander un devis
              </button>
            </div>
          </div>
        </div>
      </div>
    </CockpitShell>
  );
}

function SummaryCard({ title, value, color }: { title: string; value: string; color: string }) {
  const colors = {
    green: "from-green-500/20 to-green-600/10 border-green-500/30 text-green-400",
    blue: "from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400",
    amber: "from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400",
    purple: "from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400"
  };

  return (
    <div className={`p-6 rounded-xl bg-gradient-to-br border ${colors[color as keyof typeof colors]}`}>
      <div className="text-sm text-slate-400 mb-2">{title}</div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  );
}

function ModuleCard({ module, onToggle }: { module: Module; onToggle: () => void }) {
  const isActive = module.status === "active";

  return (
    <div
      className={`p-6 rounded-xl bg-slate-900 border-2 transition-all ${
        isActive
          ? "border-green-500/50 shadow-lg shadow-green-500/10"
          : "border-slate-800"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-slate-800 flex items-center justify-center">
            {module.icon}
          </div>
          <div>
            <h3 className="text-xl font-bold mb-1">{module.name}</h3>
            <p className="text-sm text-slate-400">{module.description}</p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-slate-500">Prix</span>
          <span className="text-lg font-bold text-slate-300">{module.price}</span>
        </div>
        <div className="space-y-2">
          {module.features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm text-slate-400">
              <CheckCircle2 size={14} className="text-green-400" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onToggle}
        className={`w-full px-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
          isActive
            ? "bg-green-500/20 hover:bg-green-500/30 border-2 border-green-500/50 text-green-400 hover:text-green-300"
            : "bg-slate-800 hover:bg-slate-700 border-2 border-slate-700 text-slate-300 hover:text-white"
        }`}
      >
        {isActive ? (
          <>
            <CheckCircle2 size={20} />
            <span>Module actif</span>
          </>
        ) : (
          <>
            <Settings size={20} />
            <span>Activer le module</span>
          </>
        )}
      </button>
    </div>
  );
}
