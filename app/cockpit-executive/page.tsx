"use client";

import { useState } from "react";
import { useCockpitData } from "@/lib/hooks/useCockpitData";
import { PortfolioCard } from "@/components/cockpit/PortfolioCard";
import { DecisionsCard } from "@/components/cockpit/DecisionsCard";
import { AnomaliesCard } from "@/components/cockpit/AnomaliesCard";
import { TimelineCard } from "@/components/cockpit/TimelineCard";
import { ExecutiveSummaryCard } from "@/components/cockpit/ExecutiveSummaryCard";
import { Loader2, Filter } from "lucide-react";

export default function CockpitExecutivePage() {
  const [filters, setFilters] = useState<{ status?: string; bu?: string; country?: string }>({});
  const { overview, projects, decisions, anomalies, timeline, loading, error } = useCockpitData(filters);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-amber-400 mx-auto mb-4" size={48} />
          <p className="text-slate-400">Chargement du cockpit exécutif...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">Erreur de chargement</h2>
          <p className="text-slate-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold transition-all"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-slate-800/50 bg-slate-900/30 backdrop-blur">
        <div className="max-w-[1600px] mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-amber-100 to-white">
                Cockpit Exécutif
              </h1>
              <p className="text-slate-400 mt-1">
                Pilotage en temps réel • Dernière mise à jour:{' '}
                {overview ? new Date(overview.generated_at).toLocaleString() : '—'}
              </p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-all">
              <Filter size={16} />
              Filtres
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        {/* Top Row - KPIs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <PortfolioCard overview={overview} onFilterChange={setFilters} />
          <DecisionsCard decisions={decisions} />
          <AnomaliesCard anomalies={anomalies} />
        </div>

        {/* Middle Row - IA + Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ExecutiveSummaryCard />
          <TimelineCard timeline={timeline} />
        </div>

        {/* Projects Table */}
        <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-zinc-50">Portefeuille de projets</h2>
            <span className="text-sm text-slate-400">{projects.length} projet(s)</span>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              Aucun projet trouvé
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800 text-left text-sm text-slate-400">
                    <th className="pb-3 font-medium">Projet</th>
                    <th className="pb-3 font-medium">Responsable</th>
                    <th className="pb-3 font-medium">Statut</th>
                    <th className="pb-3 font-medium">Alignement</th>
                    <th className="pb-3 font-medium">Budget</th>
                    <th className="pb-3 font-medium">Dates</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map(project => (
                    <tr key={project.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                      <td className="py-4">
                        <div className="font-medium text-zinc-50">{project.name}</div>
                        <div className="text-xs text-slate-500">{project.bu}</div>
                      </td>
                      <td className="py-4 text-sm text-slate-300">{project.owner || '—'}</td>
                      <td className="py-4">
                        <span className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-300">
                          {project.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className="text-sm text-amber-400 font-medium">
                          {project.strategic_alignment_score?.toFixed(0) || 0}%
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="text-sm text-slate-300">
                          {project.budget_spent?.toLocaleString() || 0} /{' '}
                          {project.budget_planned?.toLocaleString() || 0} CHF
                        </div>
                      </td>
                      <td className="py-4 text-sm text-slate-400">
                        {project.start_date && new Date(project.start_date).toLocaleDateString()} →{' '}
                        {project.end_date && new Date(project.end_date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
