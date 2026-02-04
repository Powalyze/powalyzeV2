"use client";

import { TrendingUp, Target } from "lucide-react";

type Props = {
  overview: any;
  onFilterChange?: (filter: any) => void;
};

export function PortfolioCard({ overview, onFilterChange }: Props) {
  if (!overview) {
    return (
      <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-slate-800 rounded w-1/3"></div>
          <div className="h-4 bg-slate-800 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/50 transition-all">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-zinc-50 mb-1">Portefeuille & Alignement</h2>
          <p className="text-sm text-slate-400">Vue stratégique du portefeuille</p>
        </div>
        <Target className="text-amber-400" size={24} />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Projets actifs</span>
          <span className="text-2xl font-bold text-white">{overview.projects_active || 0}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Alignement stratégique</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-amber-400">
              {overview.strategic_alignment?.toFixed(1) || 0}%
            </span>
            <TrendingUp size={20} className="text-green-400" />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800">
          <div className="text-sm text-slate-400 mb-2">Budget</div>
          <div className="flex justify-between">
            <span className="text-slate-300">Prévu: {overview.budget_planned_total?.toLocaleString() || 0} CHF</span>
            <span className="text-slate-300">Consommé: {overview.budget_spent_total?.toLocaleString() || 0} CHF</span>
          </div>
          {overview.budget_variance_total !== undefined && (
            <div className="mt-1 text-right">
              <span className={overview.budget_variance_total > 0 ? 'text-red-400' : 'text-green-400'}>
                Variance: {overview.budget_variance_total > 0 ? '+' : ''}{overview.budget_variance_total.toLocaleString()} CHF
              </span>
            </div>
          )}
        </div>

        {onFilterChange && (
          <div className="pt-4 border-t border-slate-800">
            <div className="text-sm text-slate-400 mb-2">Filtres rapides</div>
            <div className="flex gap-2">
              <button
                onClick={() => onFilterChange({ bu: 'Europe' })}
                className="px-3 py-1 text-xs rounded-full bg-slate-800 hover:bg-amber-500/20 hover:text-amber-400 transition-all"
              >
                Europe
              </button>
              <button
                onClick={() => onFilterChange({ bu: 'Global' })}
                className="px-3 py-1 text-xs rounded-full bg-slate-800 hover:bg-amber-500/20 hover:text-amber-400 transition-all"
              >
                Global
              </button>
              <button
                onClick={() => onFilterChange({ status: 'in_progress' })}
                className="px-3 py-1 text-xs rounded-full bg-slate-800 hover:bg-amber-500/20 hover:text-amber-400 transition-all"
              >
                En cours
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
