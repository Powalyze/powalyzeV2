"use client";

import React from 'react';
import { Sparkles, Target, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export const ExecutiveHero: React.FC = () => {
  return (
    <Card className="p-6 border-amber-500/20 bg-gradient-to-br from-slate-900/80 to-slate-900/50">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 mb-1">Votre situation aujourd'hui</h2>
          <p className="text-sm text-slate-400">Vendredi 15 janvier 2026 · 14:32</p>
        </div>
        <Badge variant="success" className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          Situation globale saine
        </Badge>
      </div>
      
      {/* IA Summary */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-6">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div>
            <p className="text-sm text-slate-200 leading-relaxed">
              <span className="font-semibold text-amber-400">Synthèse IA :</span> Votre portefeuille affiche une santé solide avec <strong>94% de projets en bonne voie</strong>. 3 risques nécessitent une attention immédiate. Budget global respecté à <strong>98%</strong>. 7 décisions recommandées pour optimiser la performance des 6 prochains mois.
            </p>
          </div>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="flex items-center gap-3 px-3 py-2 bg-slate-800/50 rounded-lg">
          <Target className="w-5 h-5 text-emerald-400" />
          <div>
            <div className="text-xs text-slate-400">Projets actifs</div>
            <div className="text-lg font-bold text-slate-100">42</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 px-3 py-2 bg-slate-800/50 rounded-lg">
          <DollarSign className="w-5 h-5 text-sky-400" />
          <div>
            <div className="text-xs text-slate-400">Budget engagé</div>
            <div className="text-lg font-bold text-slate-100">7.8M€</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 px-3 py-2 bg-slate-800/50 rounded-lg">
          <TrendingUp className="w-5 h-5 text-amber-400" />
          <div>
            <div className="text-xs text-slate-400">Taux succès</div>
            <div className="text-lg font-bold text-slate-100">94%</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 px-3 py-2 bg-slate-800/50 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <div>
            <div className="text-xs text-slate-400">Alertes</div>
            <div className="text-lg font-bold text-slate-100">3</div>
          </div>
        </div>
      </div>
    </Card>
  );
};
