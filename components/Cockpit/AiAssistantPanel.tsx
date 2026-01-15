"use client";

import React from 'react';
import { Sparkles, TrendingUp, AlertTriangle, Target, Lightbulb } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const insights = [
  {
    id: 1,
    type: 'opportunity',
    icon: Lightbulb,
    title: 'Optimisation détectée',
    message: 'En réallouant 2 ressources du projet "Cloud Migration" vers "CRM", vous pourriez réduire le retard de 3 semaines.',
    confidence: 92,
  },
  {
    id: 2,
    type: 'risk',
    icon: AlertTriangle,
    title: 'Risque anticipé',
    message: 'Le projet "Digital Transformation" présente un risque de dérive budgétaire de 18% si le périmètre n\'est pas ajusté avant fin février.',
    confidence: 87,
  },
  {
    id: 3,
    type: 'trend',
    icon: TrendingUp,
    title: 'Tendance positive',
    message: 'Votre taux de livraison a augmenté de 12% ce trimestre. Les pratiques agiles portent leurs fruits.',
    confidence: 94,
  },
];

export const AiAssistantPanel: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <h3 className="text-sm font-semibold text-slate-100">Assistant IA</h3>
        </div>
        <p className="text-xs text-slate-400">Insights et recommandations en temps réel</p>
      </div>
      
      {/* Insights */}
      <div className="space-y-3">
        {insights.map((insight) => {
          const Icon = insight.icon;
          return (
            <Card key={insight.id} className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-shrink-0">
                  <div className={cn(
                    "w-6 h-6 rounded-lg flex items-center justify-center",
                    insight.type === 'opportunity' && "bg-emerald-500/20",
                    insight.type === 'risk' && "bg-red-500/20",
                    insight.type === 'trend' && "bg-sky-500/20"
                  )}>
                    <Icon className={cn(
                      "w-3.5 h-3.5",
                      insight.type === 'opportunity' && "text-emerald-400",
                      insight.type === 'risk' && "text-red-400",
                      insight.type === 'trend' && "text-sky-400"
                    )} />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-xs font-medium text-slate-200 mb-1">{insight.title}</div>
                  <div className="text-xs text-slate-400 leading-relaxed">{insight.message}</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Confiance: {insight.confidence}%</span>
                <button className="text-xs text-amber-400 hover:text-amber-300">Détails →</button>
              </div>
            </Card>
          );
        })}
      </div>
      
      {/* Quick Actions */}
      <Card className="p-4">
        <div className="text-xs font-medium text-slate-200 mb-3">Actions rapides</div>
        <div className="space-y-2">
          <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
            <Target className="w-3 h-3 mr-2" />
            Simuler un scénario
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
            <Sparkles className="w-3 h-3 mr-2" />
            Générer un rapport exécutif
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
            <TrendingUp className="w-3 h-3 mr-2" />
            Analyser la performance
          </Button>
        </div>
      </Card>
      
      {/* Chat Input */}
      <div>
        <div className="text-xs font-medium text-slate-200 mb-2">Poser une question</div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Demandez n'importe quoi..."
            className="flex-1 px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50"
          />
          <Button variant="primary" size="sm">
            <Sparkles className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

function cn(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(' ');
}
