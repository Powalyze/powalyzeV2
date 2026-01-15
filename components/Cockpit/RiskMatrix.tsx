"use client";

import React from 'react';
import { Card } from '@/components/ui/Card';

const risks = [
  { id: 1, title: 'Budget dépassement Q2', impact: 'high', probability: 'high', value: 8 },
  { id: 2, title: 'Retard release CRM', impact: 'high', probability: 'medium', value: 6 },
  { id: 3, title: 'Turnover équipe dev', impact: 'medium', probability: 'high', value: 6 },
  { id: 4, title: 'Dépendance fournisseur', impact: 'medium', probability: 'medium', value: 4 },
  { id: 5, title: 'Conformité RGPD', impact: 'low', probability: 'high', value: 3 },
  { id: 6, title: 'Tech debt legacy', impact: 'high', probability: 'low', value: 3 },
];

export const RiskMatrix: React.FC = () => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-100">Matrice des risques</h3>
        <button className="text-xs text-slate-400 hover:text-slate-300">Voir détails</button>
      </div>
      
      {/* Matrix */}
      <div className="relative">
        {/* Axes */}
        <div className="absolute -left-12 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-slate-500">
          Impact →
        </div>
        <div className="text-xs text-slate-500 text-center mb-2">Probabilité →</div>
        
        {/* Grid */}
        <div className="grid grid-cols-3 grid-rows-3 gap-2 aspect-square">
          {/* High Impact / High Probability */}
          <div className="col-start-3 row-start-1 bg-red-500/10 border border-red-500/20 rounded-lg p-2 relative">
            <div className="absolute top-1 right-1 text-xs text-red-400 font-medium">Critique</div>
            {risks
              .filter((r) => r.impact === 'high' && r.probability === 'high')
              .map((r) => (
                <div key={r.id} className="text-xs text-red-300 mb-1">• {r.title}</div>
              ))}
          </div>
          
          {/* High Impact / Medium Probability */}
          <div className="col-start-2 row-start-1 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2">
            {risks
              .filter((r) => r.impact === 'high' && r.probability === 'medium')
              .map((r) => (
                <div key={r.id} className="text-xs text-amber-300 mb-1">• {r.title}</div>
              ))}
          </div>
          
          {/* High Impact / Low Probability */}
          <div className="col-start-1 row-start-1 bg-slate-800/30 border border-slate-700 rounded-lg p-2">
            {risks
              .filter((r) => r.impact === 'high' && r.probability === 'low')
              .map((r) => (
                <div key={r.id} className="text-xs text-slate-400 mb-1">• {r.title}</div>
              ))}
          </div>
          
          {/* Medium Impact / High Probability */}
          <div className="col-start-3 row-start-2 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2">
            {risks
              .filter((r) => r.impact === 'medium' && r.probability === 'high')
              .map((r) => (
                <div key={r.id} className="text-xs text-amber-300 mb-1">• {r.title}</div>
              ))}
          </div>
          
          {/* Medium Impact / Medium Probability */}
          <div className="col-start-2 row-start-2 bg-amber-500/5 border border-amber-500/10 rounded-lg p-2">
            {risks
              .filter((r) => r.impact === 'medium' && r.probability === 'medium')
              .map((r) => (
                <div key={r.id} className="text-xs text-slate-300 mb-1">• {r.title}</div>
              ))}
          </div>
          
          {/* Low Impact / High Probability */}
          <div className="col-start-3 row-start-3 bg-slate-800/30 border border-slate-700 rounded-lg p-2">
            {risks
              .filter((r) => r.impact === 'low' && r.probability === 'high')
              .map((r) => (
                <div key={r.id} className="text-xs text-slate-400 mb-1">• {r.title}</div>
              ))}
          </div>
          
          {/* Remaining cells */}
          <div className="col-start-1 row-start-2 bg-slate-800/20 border border-slate-800 rounded-lg"></div>
          <div className="col-start-2 row-start-3 bg-slate-800/20 border border-slate-800 rounded-lg"></div>
          <div className="col-start-1 row-start-3 bg-slate-800/10 border border-slate-800 rounded-lg"></div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-red-500/20 border border-red-500/30 rounded"></div>
          <span>Critique</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-amber-500/20 border border-amber-500/30 rounded"></div>
          <span>Attention</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-slate-800 border border-slate-700 rounded"></div>
          <span>Surveillance</span>
        </div>
      </div>
    </Card>
  );
};
