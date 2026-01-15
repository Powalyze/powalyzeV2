"use client";

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AlertTriangle, Zap, TrendingDown } from 'lucide-react';

const anomalies = [
  {
    id: 1,
    type: 'budget',
    severity: 'high',
    title: 'Dérive budget Cloud Infrastructure',
    description: 'Consommation +37% vs prévisionnel sur les 3 dernières semaines',
    project: 'Cloud Migration AWS',
    detected: 'il y a 2h',
  },
  {
    id: 2,
    type: 'performance',
    severity: 'medium',
    title: 'Vélocité équipe en baisse',
    description: 'Sprint velocity -22% sur les 2 derniers sprints',
    project: 'Sales Excellence CRM',
    detected: 'il y a 5h',
  },
  {
    id: 3,
    type: 'risk',
    severity: 'high',
    title: 'Dépendance critique non documentée',
    description: 'Module legacy identifié sans plan de migration',
    project: 'Digital Transformation',
    detected: 'il y a 1j',
  },
];

export const AnomalyList: React.FC = () => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-100">Anomalies détectées</h3>
        <Badge variant="danger">3 nouvelles</Badge>
      </div>
      
      <div className="space-y-3">
        {anomalies.map((anomaly) => (
          <div
            key={anomaly.id}
            className="p-4 bg-red-500/5 border border-red-500/20 hover:border-red-500/30 rounded-lg transition-all cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                  {anomaly.type === 'budget' && <AlertTriangle className="w-4 h-4 text-red-400" />}
                  {anomaly.type === 'performance' && <TrendingDown className="w-4 h-4 text-red-400" />}
                  {anomaly.type === 'risk' && <Zap className="w-4 h-4 text-red-400" />}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="font-medium text-sm text-slate-200">{anomaly.title}</div>
                  {anomaly.severity === 'high' && <Badge variant="danger">Critique</Badge>}
                  {anomaly.severity === 'medium' && <Badge variant="warning">Moyen</Badge>}
                </div>
                
                <div className="text-xs text-slate-300 mb-2">{anomaly.description}</div>
                
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>{anomaly.project}</span>
                  <span>•</span>
                  <span>Détecté {anomaly.detected}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 py-2 text-sm text-slate-400 hover:text-slate-300 hover:bg-slate-800/30 rounded-lg transition-colors">
        Voir l'historique complet →
      </button>
    </Card>
  );
};
