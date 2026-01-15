"use client";

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';

const decisions = [
  {
    id: 1,
    title: 'Arbitrage budget Cloud Infrastructure Q2',
    urgency: 'high',
    type: 'budget',
    deadline: '3 jours',
    impact: 'Déblocage 250K€ pour migration AWS',
    recommendation: 'Approuver avec ajustement périmètre',
  },
  {
    id: 2,
    title: 'Validation roadmap produit H2 2026',
    urgency: 'medium',
    type: 'strategic',
    deadline: '8 jours',
    impact: 'Engagement équipes sur 6 mois',
    recommendation: 'Reporter feature X au Q4',
  },
  {
    id: 3,
    title: 'Recrutement Head of Data',
    urgency: 'low',
    type: 'hr',
    deadline: '15 jours',
    impact: 'Accélération projets analytics',
    recommendation: 'Valider profil senior proposé',
  },
];

export const DecisionPanel: React.FC = () => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-100">Décisions requises</h3>
        <Badge variant="warning">7 en attente</Badge>
      </div>
      
      <div className="space-y-3">
        {decisions.map((decision) => (
          <div
            key={decision.id}
            className="p-4 bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700 hover:border-slate-600 rounded-lg transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1">
                <div className="font-medium text-sm text-slate-200 mb-1">{decision.title}</div>
                <div className="text-xs text-slate-400 mb-2">{decision.impact}</div>
              </div>
              {decision.urgency === 'high' && (
                <Badge variant="danger" className="flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Urgent
                </Badge>
              )}
              {decision.urgency === 'medium' && (
                <Badge variant="warning" className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Moyen
                </Badge>
              )}
              {decision.urgency === 'low' && (
                <Badge variant="info">Normal</Badge>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-xs">
              <span className="text-slate-500">Échéance : {decision.deadline}</span>
              <span className="text-slate-500">•</span>
              <span className="text-amber-400 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                IA: {decision.recommendation}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 py-2 text-sm text-slate-400 hover:text-slate-300 hover:bg-slate-800/30 rounded-lg transition-colors">
        Voir toutes les décisions →
      </button>
    </Card>
  );
};
