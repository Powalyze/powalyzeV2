"use client";

import { CockpitShell } from "@/components/cockpit/CockpitShell";
import { useState } from "react";
import { Brain, CheckCircle2, Zap, GitBranch, Layers, Workflow, Settings } from "lucide-react";

type Methodology = "agile" | "hermes" | "cycle-v" | "hybride" | "custom";

export default function MethodologiePage() {
  const [selectedMethod, setSelectedMethod] = useState<Methodology | null>(null);
  const [customizing, setCustomizing] = useState(false);

  return (
    <CockpitShell>
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Méthodologie</h1>
          <p className="text-slate-400">Choisissez ou personnalisez votre méthodologie de gestion</p>
        </div>

        {/* AI Insights */}
        <div className="mb-8 p-6 rounded-xl bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-sky-500/10 border border-blue-500/30">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <Brain className="text-blue-400" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-2">IA Copilote • Configuration intelligente</h3>
              <p className="text-slate-300 text-sm mb-3">
                Selon votre portefeuille, je recommande une <strong className="text-blue-400">méthodologie Hybride</strong> : 
                Agile pour les projets tech (Mobile, Cloud), Hermès pour les projets réglementés (ERP, Compliance), 
                et Cycle en V pour l'infrastructure critique. L'IA s'adaptera automatiquement aux 
                <strong className="text-white"> workflows, statuts, rituels et rapports</strong> de chaque méthodologie.
              </p>
              <div className="flex flex-wrap gap-2">
                <button className="px-3 py-1.5 text-sm rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-300 hover:text-blue-200 transition-colors">
                  Analyser mon portefeuille
                </button>
                <button className="px-3 py-1.5 text-sm rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors">
                  Recommandations IA
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Methodology Cards */}
        {!customizing ? (
          <>
            <h2 className="text-2xl font-bold mb-6">Méthodologies prédéfinies</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <MethodologyCard
                id="agile"
                title="Agile / Scrum"
                description="Sprints, backlogs, stand-ups quotidiens, rétrospectives"
                icon={<Zap size={32} className="text-amber-400" />}
                features={[
                  "Sprints de 2 semaines",
                  "User stories & backlog",
                  "Daily stand-up",
                  "Sprint planning & retro",
                  "Kanban board",
                  "Vélocité tracking"
                ]}
                bestFor="Projets tech, startups, innovation"
                selected={selectedMethod === "agile"}
                onSelect={() => setSelectedMethod("agile")}
              />
              <MethodologyCard
                id="hermes"
                title="Hermès"
                description="Méthodologie suisse en 4 phases : Initialisation, Conception, Réalisation, Déploiement"
                icon={<Layers size={32} className="text-blue-400" />}
                features={[
                  "4 phases structurées",
                  "Gestion des risques",
                  "Comités de pilotage",
                  "Jalons validés",
                  "Documentation complète",
                  "Conformité réglementaire"
                ]}
                bestFor="Administrations, secteur public, réglementé"
                selected={selectedMethod === "hermes"}
                onSelect={() => setSelectedMethod("hermes")}
              />
              <MethodologyCard
                id="cycle-v"
                title="Cycle en V"
                description="Séquencement rigoureux : Spécifications → Développement → Tests → Validation"
                icon={<GitBranch size={32} className="text-green-400" />}
                features={[
                  "Phases séquentielles",
                  "Spécifications détaillées",
                  "Tests systématiques",
                  "Validation par niveau",
                  "Traçabilité complète",
                  "Gestion des changements"
                ]}
                bestFor="Infrastructure, systèmes critiques, embarqué"
                selected={selectedMethod === "cycle-v"}
                onSelect={() => setSelectedMethod("cycle-v")}
              />
              <MethodologyCard
                id="hybride"
                title="Hybride"
                description="Combinez plusieurs méthodologies selon le type de projet"
                icon={<Workflow size={32} className="text-purple-400" />}
                features={[
                  "Mix Agile + Hermès + Cycle V",
                  "Adaptation par projet",
                  "Règles de priorisation IA",
                  "Workflows flexibles",
                  "Rituels sur mesure",
                  "Rapports multi-méthodes"
                ]}
                bestFor="Portefeuilles diversifiés, grandes organisations"
                selected={selectedMethod === "hybride"}
                onSelect={() => setSelectedMethod("hybride")}
              />
            </div>

            {/* Custom Methodology */}
            <div className="p-8 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <Settings size={32} className="text-amber-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">Méthodologie personnalisée</h3>
                  <p className="text-slate-400 mb-4">
                    Créez votre propre méthodologie en définissant vos statuts, workflows, rituels et rapports. 
                    L'IA vous aidera à structurer votre approche.
                  </p>
                  <button
                    onClick={() => setCustomizing(true)}
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 font-semibold transition-all"
                  >
                    Créer ma méthodologie
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {selectedMethod && (
              <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-1">Méthodologie sélectionnée : {getMethodologyName(selectedMethod)}</h3>
                    <p className="text-sm text-slate-400">
                      L'IA va configurer automatiquement vos workflows, statuts, rituels et rapports
                    </p>
                  </div>
                  <button className="px-8 py-4 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 font-bold text-lg transition-all flex items-center gap-3">
                    <CheckCircle2 size={24} />
                    <span>Activer cette méthodologie</span>
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <CustomMethodologyBuilder onBack={() => setCustomizing(false)} />
        )}
      </div>
    </CockpitShell>
  );
}

function MethodologyCard({
  id,
  title,
  description,
  icon,
  features,
  bestFor,
  selected,
  onSelect
}: {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  bestFor: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`p-6 rounded-xl bg-slate-900 border-2 transition-all cursor-pointer ${
        selected
          ? "border-amber-500 shadow-lg shadow-amber-500/20"
          : "border-slate-800 hover:border-slate-700"
      }`}
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-sm text-slate-400 mb-4">{description}</p>

      <div className="mb-4">
        <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Caractéristiques</h4>
        <ul className="space-y-1.5">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
              <CheckCircle2 size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-4 border-t border-slate-800">
        <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Idéal pour</div>
        <div className="text-sm text-slate-300">{bestFor}</div>
      </div>
    </div>
  );
}

function CustomMethodologyBuilder({ onBack }: { onBack: () => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Créer une méthodologie personnalisée</h2>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors"
        >
          ← Retour
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Workflows */}
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
          <h3 className="text-lg font-bold mb-4">1. Définir les workflows</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Ex: Backlog → En cours → En revue → Terminé"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
            />
            <p className="text-sm text-slate-400">Définissez les étapes de progression de vos projets</p>
          </div>
        </div>

        {/* Statuts */}
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
          <h3 className="text-lg font-bold mb-4">2. Définir les statuts</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Ex: Vert, Orange, Rouge, Gris"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
            />
            <p className="text-sm text-slate-400">Codes couleur pour la santé des projets</p>
          </div>
        </div>

        {/* Rituels */}
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
          <h3 className="text-lg font-bold mb-4">3. Définir les rituels</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Ex: Daily 15min, Sprint planning 2h, Retro 1h"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
            />
            <p className="text-sm text-slate-400">Réunions récurrentes et cérémonies</p>
          </div>
        </div>

        {/* Rapports */}
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
          <h3 className="text-lg font-bold mb-4">4. Définir les rapports</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Ex: Hebdo équipe, Mensuel COMEX, Trimestriel Board"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
            />
            <p className="text-sm text-slate-400">Fréquence et types de rapports</p>
          </div>
        </div>
      </div>

      {/* AI Suggestion */}
      <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/5 border border-blue-500/30">
        <div className="flex items-start gap-4">
          <Brain size={24} className="text-blue-400 flex-shrink-0" />
          <div>
            <h4 className="font-bold mb-2">L'IA peut vous aider</h4>
            <p className="text-sm text-slate-300 mb-3">
              Décrivez en quelques mots votre contexte, et je générerai une méthodologie complète adaptée.
            </p>
            <textarea
              placeholder="Ex: Nous sommes une équipe de 15 personnes travaillant sur des projets SaaS B2B avec cycles de 6 mois..."
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500 resize-none"
              rows={3}
            />
            <button className="mt-3 px-6 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-300 hover:text-blue-200 font-semibold transition-colors">
              Générer ma méthodologie avec l'IA
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button className="px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white font-semibold transition-colors">
          Enregistrer comme brouillon
        </button>
        <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 font-bold transition-all">
          Activer ma méthodologie
        </button>
      </div>
    </div>
  );
}

function getMethodologyName(method: Methodology): string {
  const names = {
    agile: "Agile / Scrum",
    hermes: "Hermès",
    "cycle-v": "Cycle en V",
    hybride: "Hybride",
    custom: "Personnalisée"
  };
  return names[method];
}
