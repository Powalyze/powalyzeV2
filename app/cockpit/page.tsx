// app/cockpit/page.tsx (Next.js 13+)
// Cockpit Powalyze – OS de gouvernance augmenté, full-screen, cinématique.

"use client";

import React, { useState, useEffect } from "react";

type Scenario = "defensif" | "croissance" | "ia" | "regulation";

interface DecisionOption {
  id: string;
  label: string;
  impactSummary: string;
  riskLevel: "low" | "medium" | "high";
  score: number;
}

interface AiNarration {
  headline: string;
  subline: string;
  mode: "comex" | "pmo" | "crise";
}

interface CapacityDomain {
  id: string;
  name: string;
  usage: number; // 0–100
  status: "under" | "optimal" | "over" | "tension";
}

interface Anomaly {
  id: string;
  title: string;
  description: string;
  severity: "info" | "warning" | "critical";
}

interface GalaxyNode {
  id: string;
  label: string;
  type: "projet" | "programme" | "theme";
  x: number;
  y: number;
  size: number;
  status: "ok" | "tension" | "critique";
}

const MOCK_NARRATION: AiNarration = {
  headline: "🎯 Démo Client : Portefeuille optimisé à 94%, 3 opportunités stratégiques détectées",
  subline:
    "L'IA a identifié une économie potentielle de 2.4M€ via consolidation de deux programmes. Capacité IT critique dans 6 semaines. Action recommandée : réallocation +18% vers cyber.",
  mode: "comex",
};

const MOCK_SCENARIO_LABELS: Record<Scenario, string> = {
  defensif: "Scénario Défensif",
  croissance: "Scénario Croissance",
  ia: "Scénario IA & Data",
  regulation: "Scénario Régulation stricte",
};

const MOCK_DECISION_OPTIONS: DecisionOption[] = [
  {
    id: "opt-a",
    label: "Option A – Prioriser régulation & cyber",
    impactSummary: "+18 % de marge de manœuvre, risque projet innovation retardé.",
    riskLevel: "low",
    score: 92,
  },
  {
    id: "opt-b",
    label: "Option B – Maintenir le plan actuel",
    impactSummary: "Risque de saturation IT, probabilité d'incident critique à 35 %. ",
    riskLevel: "high",
    score: 41,
  },
  {
    id: "opt-c",
    label: "Option C – Accélérer IA & Data",
    impactSummary: "+12 % de valeur potentielle, mais tension forte sur capacité IT.",
    riskLevel: "medium",
    score: 78,
  },
];

const MOCK_CAPACITIES: CapacityDomain[] = [
  { id: "it", name: "Capacité IT", usage: 92, status: "over" },
  { id: "ops", name: "Opérations", usage: 68, status: "optimal" },
  { id: "finance", name: "Finance", usage: 54, status: "optimal" },
  { id: "data", name: "Data & IA", usage: 81, status: "tension" },
];

const MOCK_ANOMALIES: Anomaly[] = [
  {
    id: "an-1",
    title: "🎯 Opportunité : Économie 2.4M€",
    description:
      "Deux programmes régulation partagent 42% de ressources. Consolidation proposée avec ROI +185% et délai -3 mois.",
    severity: "info",
  },
  {
    id: "an-2",
    title: "⚠️ Alerte capacité : IT 92%",
    description:
      "Saturation IT prévue dans 6 semaines. Impact : 3 projets critiques à risque. Auto-healing suggère réallocation immédiate.",
    severity: "critical",
  },
  {
    id: "an-3",
    title: "📊 Dérive budget Programme Cloud",
    description:
      "+340K€ de dépassement détecté (vs prévision). Analyse quantique identifie 3 quick-wins pour correction.",
    severity: "warning",
  },
  {
    id: "an-4",
    title: "🚀 Accélération possible IA Décisionnelle",
    description:
      "Digital Twin détecte vélocité +40% vs plan. Opportunité d'avancer la phase 2 de 8 semaines avec risque faible.",
    severity: "info",
  },
];

const MOCK_GALAXY: GalaxyNode[] = [
  {
    id: "g-1",
    label: "Programme Régulation",
    type: "programme",
    x: 20,
    y: 40,
    size: 42,
    status: "tension",
  },
  {
    id: "g-2",
    label: "Projet IA Décisionnelle",
    type: "projet",
    x: 60,
    y: 30,
    size: 28,
    status: "ok",
  },
  {
    id: "g-3",
    label: "Thème Cyber & Résilience",
    type: "theme",
    x: 75,
    y: 65,
    size: 50,
    status: "critique",
  },
  {
    id: "g-4",
    label: "Programme Transformation Ops",
    type: "programme",
    x: 35,
    y: 70,
    size: 36,
    status: "ok",
  },
  {
    id: "g-5",
    label: "Projet Cloud Migration",
    type: "projet",
    x: 50,
    y: 55,
    size: 24,
    status: "ok",
  },
];

export default function CockpitPowalyze() {
  const [scenario, setScenario] = useState<Scenario>("ia");
  const [narration, setNarration] = useState<AiNarration>(MOCK_NARRATION);
  const [selectedDecision, setSelectedDecision] = useState<string | null>(null);
  const [mode, setMode] = useState<"comex" | "pmo" | "crise">("comex");

  // Ici tu pluggeras ton backend / orchestrateur IA
  useEffect(() => {
    // Exemple : adapter la narration selon le scénario & le mode
    // → à remplacer par un appel API / route IA
    const base = MOCK_NARRATION;
    let headline = base.headline;
    let subline = base.subline;

    if (scenario === "defensif") {
      headline =
        "Scénario défensif : protection de la marge et réduction des risques à court terme.";
      subline =
        "Plusieurs projets innovation sont mis en pause. La capacité IT se détend, mais la compétitivité long terme est impactée.";
    } else if (scenario === "croissance") {
      headline =
        "Scénario croissance : accélération des programmes à forte valeur, tension accrue sur les capacités.";
      subline =
        "Les axes innovation & marché sont suralimentés. L'IA recommande de renforcer la capacité IT et Data.";
    } else if (scenario === "ia") {
      headline =
        "Scénario IA & Data : vous investissez massivement dans l'augmentation de vos capacités décisionnelles.";
      subline =
        "Les projets IA consomment 24 % de la capacité Data. L'IA recommande de re-prioriser deux projets legacy.";
    } else if (scenario === "regulation") {
      headline =
        "Scénario régulation stricte : priorité absolue à la conformité et à la réduction des risques réglementaires.";
      subline =
        "Les programmes régulation absorbent une part importante du budget. L'IA propose de fusionner deux initiatives redondantes.";
    }

    setNarration({
      headline,
      subline,
      mode,
    });
  }, [scenario, mode]);

  const handleDecide = (optionId: string) => {
    setSelectedDecision(optionId);
    // Ici : appel API pour loguer la décision, générer un compte-rendu, etc.
    console.log("Décision prise :", optionId);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 flex flex-col">
      {/* Ligne de vie stratégique */}
      <header className="border-b border-slate-800/70 bg-slate-950/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Powalyze • OS de gouvernance augmenté
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.9)]" />
              <p className="text-sm text-slate-300">
                <span className="text-sky-300 font-medium">🎬 Mode Démo Client</span>
                {" "}•{" "}
                <span className="text-emerald-300 font-medium">
                  Portefeuille 42 projets • Alignement stratégique 94%
                </span>{" "}
                •{" "}
                <span className="text-amber-300 font-medium">
                  3 décisions IA-assistées en attente
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ModeToggle mode={mode} setMode={setMode} />
            <ScenarioSelector scenario={scenario} setScenario={setScenario} />
          </div>
        </div>
      </header>

      {/* Layout 3 colonnes */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-6 flex gap-6">
        {/* Radar exécutif / anomalies */}
        <section className="w-[26%] flex flex-col gap-4">
          <ExecutiveNarrator narration={narration} />
          <AnomalyFeed anomalies={MOCK_ANOMALIES} />
        </section>

        {/* Scène centrale immersive */}
        <section className="flex-1 flex flex-col gap-4">
          <StrategicGalaxyView nodes={MOCK_GALAXY} scenario={scenario} />
          <DecisionPortal
            options={MOCK_DECISION_OPTIONS}
            selected={selectedDecision}
            onDecide={handleDecide}
          />
        </section>

        {/* Capacités & contraintes */}
        <section className="w-[26%] flex flex-col gap-4">
          <CapacityHeatmap capacities={MOCK_CAPACITIES} />
          <TimelineCinematic />
        </section>
      </main>
    </div>
  );
}

/* ---------------------- Sous-composants premium ---------------------- */

function ModeToggle({
  mode,
  setMode,
}: {
  mode: "comex" | "pmo" | "crise";
  setMode: (m: "comex" | "pmo" | "crise") => void;
}) {
  const modes: { id: "comex" | "pmo" | "crise"; label: string }[] = [
    { id: "comex", label: "Mode COMEX" },
    { id: "pmo", label: "Mode PMO" },
    { id: "crise", label: "Mode Crise" },
  ];

  return (
    <div className="inline-flex items-center rounded-full bg-slate-900/80 border border-slate-700/70 p-1 text-xs">
      {modes.map((m) => (
        <button
          key={m.id}
          onClick={() => setMode(m.id)}
          className={`px-3 py-1 rounded-full transition-all ${
            mode === m.id
              ? "bg-amber-400 text-slate-950 shadow-[0_0_18px_rgba(251,191,36,0.7)] font-semibold"
              : "text-slate-300 hover:text-slate-50"
          }`}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}

function ScenarioSelector({
  scenario,
  setScenario,
}: {
  scenario: Scenario;
  setScenario: (s: Scenario) => void;
}) {
  const scenarios: Scenario[] = ["defensif", "croissance", "ia", "regulation"];

  return (
    <div className="inline-flex items-center rounded-full bg-slate-900/80 border border-slate-700/70 p-1 text-xs">
      {scenarios.map((s) => (
        <button
          key={s}
          onClick={() => setScenario(s)}
          className={`px-3 py-1 rounded-full transition-all ${
            scenario === s
              ? "bg-sky-500 text-slate-950 shadow-[0_0_18px_rgba(56,189,248,0.7)] font-semibold"
              : "text-slate-300 hover:text-slate-50"
          }`}
        >
          {MOCK_SCENARIO_LABELS[s]}
        </button>
      ))}
    </div>
  );
}

function ExecutiveNarrator({ narration }: { narration: AiNarration }) {
  const modeLabel =
    narration.mode === "comex"
      ? "Narration exécutive"
      : narration.mode === "pmo"
      ? "Narration PMO"
      : "Narration de crise";

  return (
    <div className="rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-950/90 border border-slate-700/70 p-4 shadow-[0_0_40px_rgba(15,23,42,0.9)] flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <div className="text-[10px] uppercase tracking-[0.25em] text-slate-400">
          {modeLabel} • IA Narrateur
        </div>
        <div className="flex items-center gap-1 text-[10px] text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
          <span>Analyse temps réel</span>
        </div>
      </div>
      <h1 className="text-sm font-semibold text-slate-50 leading-snug">
        {narration.headline}
      </h1>
      <p className="text-xs text-slate-300 leading-relaxed">
        {narration.subline}
      </p>
      <button className="mt-1 inline-flex items-center justify-center rounded-full bg-amber-400/90 text-slate-950 text-[11px] font-semibold px-3 py-1.5 hover:bg-amber-300 transition-all shadow-[0_0_18px_rgba(251,191,36,0.7)]">
        Générer un résumé pour le prochain comité
      </button>
    </div>
  );
}

function AnomalyFeed({ anomalies }: { anomalies: Anomaly[] }) {
  const severityConfig = {
    info: { bg: "bg-sky-900/50", border: "border-sky-700/70", dot: "bg-sky-400" },
    warning: { bg: "bg-amber-900/50", border: "border-amber-700/70", dot: "bg-amber-400" },
    critical: { bg: "bg-red-900/50", border: "border-red-700/70", dot: "bg-red-400" },
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-950/90 border border-slate-700/70 p-4 shadow-[0_0_40px_rgba(15,23,42,0.9)] flex flex-col gap-3">
      <div className="text-[10px] uppercase tracking-[0.25em] text-slate-400">
        Radar des anomalies • IA Détection
      </div>
      <div className="flex flex-col gap-2">
        {anomalies.map((anomaly) => {
          const config = severityConfig[anomaly.severity];
          return (
            <div
              key={anomaly.id}
              className={`rounded-xl ${config.bg} border ${config.border} p-3 flex flex-col gap-1.5`}
            >
              <div className="flex items-center gap-2">
                <div className={`h-1.5 w-1.5 rounded-full ${config.dot} animate-pulse`} />
                <h3 className="text-xs font-semibold text-slate-50">{anomaly.title}</h3>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {anomaly.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StrategicGalaxyView({
  nodes,
  scenario,
}: {
  nodes: GalaxyNode[];
  scenario: Scenario;
}) {
  const statusConfig = {
    ok: { color: "bg-emerald-400", glow: "shadow-[0_0_20px_rgba(16,185,129,0.8)]" },
    tension: { color: "bg-amber-400", glow: "shadow-[0_0_20px_rgba(251,191,36,0.8)]" },
    critique: { color: "bg-red-400", glow: "shadow-[0_0_20px_rgba(239,68,68,0.8)]" },
  };

  const typeLabel = {
    projet: "Projet",
    programme: "Programme",
    theme: "Thème",
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-950/90 border border-slate-700/70 p-6 shadow-[0_0_40px_rgba(15,23,42,0.9)] flex flex-col gap-4 h-[450px]">
      <div className="flex items-center justify-between">
        <div className="text-[10px] uppercase tracking-[0.25em] text-slate-400">
          Vue galactique stratégique • {MOCK_SCENARIO_LABELS[scenario]}
        </div>
        <button className="text-[10px] text-sky-400 hover:text-sky-300 transition-colors">
          Vue 3D →
        </button>
      </div>

      {/* Galaxy Canvas */}
      <div className="flex-1 relative bg-slate-950/70 rounded-2xl border border-slate-800/50 overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgb(148 163 184)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Galaxy Nodes */}
        {nodes.map((node) => {
          const config = statusConfig[node.status];
          return (
            <div
              key={node.id}
              className="absolute group cursor-pointer transition-transform hover:scale-110"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div
                className={`${config.color} ${config.glow} rounded-full`}
                style={{
                  width: `${node.size}px`,
                  height: `${node.size}px`,
                }}
              />
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-slate-900/95 border border-slate-700/70 rounded-lg px-3 py-2 shadow-xl whitespace-nowrap">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400">
                    {typeLabel[node.type]}
                  </div>
                  <div className="text-xs font-semibold text-slate-50">{node.label}</div>
                  <div className="text-[10px] text-slate-300 capitalize">
                    Statut: {node.status}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Connections lines */}
        <svg className="absolute inset-0 pointer-events-none" width="100%" height="100%">
          <line
            x1="20%"
            y1="40%"
            x2="35%"
            y2="70%"
            stroke="rgb(148 163 184)"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.3"
          />
          <line
            x1="60%"
            y1="30%"
            x2="75%"
            y2="65%"
            stroke="rgb(148 163 184)"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.3"
          />
          <line
            x1="35%"
            y1="70%"
            x2="50%"
            y2="55%"
            stroke="rgb(148 163 184)"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.3"
          />
        </svg>
      </div>

      <div className="text-[10px] text-slate-400 text-center">
        {nodes.length} initiatives actives • Cliquez sur un nœud pour explorer
      </div>
    </div>
  );
}

function DecisionPortal({
  options,
  selected,
  onDecide,
}: {
  options: DecisionOption[];
  selected: string | null;
  onDecide: (id: string) => void;
}) {
  const riskConfig = {
    low: { color: "border-emerald-500/70", bg: "bg-emerald-900/20", text: "text-emerald-400" },
    medium: { color: "border-amber-500/70", bg: "bg-amber-900/20", text: "text-amber-400" },
    high: { color: "border-red-500/70", bg: "bg-red-900/20", text: "text-red-400" },
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-950/90 border border-slate-700/70 p-5 shadow-[0_0_40px_rgba(15,23,42,0.9)] flex flex-col gap-4">
      <div className="text-[10px] uppercase tracking-[0.25em] text-slate-400">
        Portail de décision • Options évaluées par IA
      </div>

      <div className="flex flex-col gap-3">
        {options.map((option) => {
          const config = riskConfig[option.riskLevel];
          const isSelected = selected === option.id;

          return (
            <div
              key={option.id}
              className={`rounded-2xl border-2 ${config.color} ${config.bg} p-4 cursor-pointer transition-all ${
                isSelected
                  ? "shadow-[0_0_30px_rgba(251,191,36,0.6)] scale-[1.02]"
                  : "hover:scale-[1.01]"
              }`}
              onClick={() => onDecide(option.id)}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="text-sm font-semibold text-slate-50 flex-1">
                  {option.label}
                </h3>
                <div className="flex flex-col items-end gap-1">
                  <div className="text-2xl font-bold text-amber-400">
                    {option.score}
                  </div>
                  <div className="text-[10px] text-slate-400">Score IA</div>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                {option.impactSummary}
              </p>
              <div className="flex items-center justify-between">
                <div className={`text-[10px] uppercase tracking-wider ${config.text} font-semibold`}>
                  Risque {option.riskLevel === "low" ? "faible" : option.riskLevel === "medium" ? "moyen" : "élevé"}
                </div>
                {isSelected && (
                  <div className="text-[10px] text-amber-400 font-semibold">
                    ✓ Décision sélectionnée
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CapacityHeatmap({ capacities }: { capacities: CapacityDomain[] }) {
  const statusConfig = {
    under: { color: "bg-sky-500", label: "Sous-utilisé" },
    optimal: { color: "bg-emerald-500", label: "Optimal" },
    tension: { color: "bg-amber-500", label: "Tension" },
    over: { color: "bg-red-500", label: "Surchauffe" },
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-950/90 border border-slate-700/70 p-4 shadow-[0_0_40px_rgba(15,23,42,0.9)] flex flex-col gap-4">
      <div className="text-[10px] uppercase tracking-[0.25em] text-slate-400">
        Heatmap des capacités • Temps réel
      </div>

      <div className="flex flex-col gap-3">
        {capacities.map((capacity) => {
          const config = statusConfig[capacity.status];
          return (
            <div key={capacity.id} className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">{capacity.name}</span>
                <span className="text-slate-50 font-semibold">{capacity.usage}%</span>
              </div>
              <div className="relative h-3 bg-slate-800/70 rounded-full overflow-hidden">
                <div
                  className={`absolute inset-y-0 left-0 ${config.color} transition-all duration-500 rounded-full shadow-[0_0_12px_currentColor]`}
                  style={{ width: `${capacity.usage}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-400">
                {config.label}
              </div>
            </div>
          );
        })}
      </div>

      <button className="mt-2 inline-flex items-center justify-center rounded-full bg-sky-500/20 border border-sky-500/50 text-sky-400 text-[11px] font-semibold px-3 py-2 hover:bg-sky-500/30 transition-all">
        Simuler un rééquilibrage IA
      </button>
    </div>
  );
}

function TimelineCinematic() {
  const milestones = [
    { id: "m-1", label: "Comité Q1", date: "15 mars", status: "completed" },
    { id: "m-2", label: "Go-live Programme Régulation", date: "22 avril", status: "upcoming" },
    { id: "m-3", label: "Phase 2 IA Décisionnelle", date: "10 mai", status: "upcoming" },
    { id: "m-4", label: "Audit Cyber", date: "28 juin", status: "at-risk" },
  ];

  const statusConfig = {
    completed: { color: "bg-emerald-400", ring: "ring-emerald-400/50" },
    upcoming: { color: "bg-sky-400", ring: "ring-sky-400/50" },
    "at-risk": { color: "bg-red-400", ring: "ring-red-400/50" },
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-950/90 border border-slate-700/70 p-4 shadow-[0_0_40px_rgba(15,23,42,0.9)] flex flex-col gap-4">
      <div className="text-[10px] uppercase tracking-[0.25em] text-slate-400">
        Timeline cinématique • Jalons stratégiques
      </div>

      <div className="relative flex flex-col gap-4 pl-4">
        {/* Vertical line */}
        <div className="absolute left-0 top-2 bottom-2 w-px bg-slate-700" />

        {milestones.map((milestone, index) => {
          const config = statusConfig[milestone.status as keyof typeof statusConfig];
          return (
            <div key={milestone.id} className="relative flex items-start gap-3">
              <div
                className={`absolute left-0 h-4 w-4 -translate-x-1/2 rounded-full ${config.color} ${config.ring} ring-4 shadow-[0_0_12px_currentColor]`}
              />
              <div className="flex-1 pl-4">
                <div className="text-xs font-semibold text-slate-50">
                  {milestone.label}
                </div>
                <div className="text-[10px] text-slate-400">{milestone.date}</div>
              </div>
            </div>
          );
        })}
      </div>

      <button className="mt-2 inline-flex items-center justify-center rounded-full bg-slate-800/70 border border-slate-700/70 text-slate-300 text-[11px] font-semibold px-3 py-2 hover:bg-slate-800 transition-all">
        Voir la roadmap complète
      </button>
    </div>
  );
}
