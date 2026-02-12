"use client";

import { CockpitShell } from "@/components/cockpit/CockpitShell";
import { StatCard } from "@/components/StatCard";
import { ExecutiveStatsBlock } from "@/components/ExecutiveStatsBlock";
import { ExecutiveBlock } from "@/components/ExecutiveBlock";
import { Sparkles } from "lucide-react";

export default function StatsShowcasePage() {
  return (
    <CockpitShell>
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-500/20 rounded-xl p-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Sparkles className="text-amber-400" size={32} />
            Showcase Composants Stats
          </h1>
          <p className="text-slate-300 text-lg">
            Démonstration des composants premium avec palette Powalyze
          </p>
        </div>

        {/* Version 1: StatCard individuelle */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Version 1 : Cartes individuelles (StatCard)
          </h2>
          <p className="text-slate-400 mb-6">
            Grille responsive de cartes indépendantes avec glassmorphism
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              value="87%"
              sub="+5% ce mois"
              label="Santé portfolio"
              href="/cockpit/portfolio"
            />

            <StatCard
              value="12"
              sub="3 en cours"
              label="Projets actifs"
              href="/cockpit/projects/active"
            />

            <StatCard
              value="8"
              sub="2 critiques"
              label="Risques actifs"
              href="/cockpit/risques"
            />

            <StatCard
              value="45 pts/sprint"
              label="Vélocité moyenne"
              href="/cockpit/agile/velocity"
            />
          </div>
        </div>

        {/* Version 2: ExecutiveStatsBlock */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Version 2 : Bloc unique (ExecutiveStatsBlock)
          </h2>
          <p className="text-slate-400 mb-6">
            Un seul bloc cliquable regroupant 4 statistiques en layout 2×2
          </p>
          <ExecutiveStatsBlock />
        </div>

        {/* Version 3: ExecutiveBlock avec header */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Version 3 : Bloc avec header (ExecutiveBlock)
          </h2>
          <p className="text-slate-400 mb-6">
            Bloc complet avec titre, sous-titre et 4 statistiques en grille responsive
          </p>
          <ExecutiveBlock />
        </div>

        {/* Variante avec plus de cartes */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Variante : 6 cartes pour KPI détaillés
          </h2>
          <p className="text-slate-400 mb-6">
            Exemple avec plus de métriques
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <StatCard
              value="€2.4M"
              sub="Budget total"
              label="Investissement"
              href="/cockpit/budget"
            />

            <StatCard
              value="23"
              sub="5 en retard"
              label="Actions ouvertes"
              href="/cockpit/decisions"
            />

            <StatCard
              value="94%"
              sub="Taux de succès"
              label="Livraisons"
              href="/cockpit/projects/active"
            />

            <StatCard
              value="156"
              sub="+12 ce mois"
              label="Stories complétées"
              href="/cockpit/agile/backlog"
            />

            <StatCard
              value="4.2/5"
              sub="Satisfaction COMEX"
              label="NPS Portfolio"
              href="/cockpit/portfolio"
            />

            <StatCard
              value="18j"
              sub="Lead time moyen"
              label="Time to Market"
              href="/cockpit/kpi"
            />
          </div>
        </div>

        {/* Documentation */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            📚 Documentation d'utilisation
          </h2>
          <div className="space-y-4 text-slate-300">
            <div>
              <h3 className="font-semibold text-white mb-2">StatCard</h3>
              <pre className="bg-slate-800 p-4 rounded-lg text-sm overflow-x-auto">
{`<StatCard
  value="87%"
  sub="+5% ce mois"  // Optionnel
  label="Santé portfolio"
  href="/cockpit/portfolio"
/>`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-2">ExecutiveStatsBlock</h3>
              <pre className="bg-slate-800 p-4 rounded-lg text-sm overflow-x-auto">
{`<ExecutiveStatsBlock />`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-2">ExecutiveBlock (avec header)</h3>
              <pre className="bg-slate-800 p-4 rounded-lg text-sm overflow-x-auto">
{`<ExecutiveBlock />`}
              </pre>
            </div>

            <div className="border-t border-slate-700 pt-4">
              <h3 className="font-semibold text-white mb-2">🎨 Palette de couleurs</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-[#d4af37]"></div>
                  <span className="text-sm">#d4af37 (Or)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-[#7aa2ff]"></div>
                  <span className="text-sm">#7aa2ff (Bleu)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-white/5"></div>
                  <span className="text-sm">#ffffff0d (Fond verre)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded border border-white/10"></div>
                  <span className="text-sm">#ffffff1a (Bordure)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pro Tip */}
        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="text-purple-400" size={24} />
            <h3 className="text-xl font-bold text-white">💡 Astuce</h3>
          </div>
          <p className="text-slate-300">
            Ces composants sont <strong>mobile-first</strong>, <strong>accessibles</strong> et optimisés pour Safari iOS 
            grâce au préfixe <code className="px-2 py-1 bg-slate-800 rounded">-webkit-backdrop-filter</code>
          </p>
        </div>
      </div>
    </CockpitShell>
  );
}
