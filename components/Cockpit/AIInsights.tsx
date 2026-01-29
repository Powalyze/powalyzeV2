'use client';

import { useEffect, useState } from 'react';
import { Brain, TrendingUp, AlertCircle } from 'lucide-react';

interface AIInsight {
  type: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  confidence: number;
}

export default function AIInsights() {
  const [insights, setInsights] = useState<AIInsight[]>([]);

  useEffect(() => {
    // Temporairement désactivé pour éviter l'erreur de fetch
    // Les données seront chargées après l'authentification complète
    setInsights([]);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-status-red bg-status-red/10';
      case 'warning': return 'border-status-yellow bg-status-yellow/10';
      default: return 'border-brand-accent bg-brand-accent/10';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertCircle className="text-status-red" size={20} />;
      case 'warning': return <TrendingUp className="text-status-yellow" size={20} />;
      default: return <Brain className="text-brand-accent" size={20} />;
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-lg p-6 border border-white/10 space-y-4">
      <div className="flex items-center gap-2">
        <Brain className="text-brand-gold" size={24} />
        <h2 className="text-xl font-bold text-white">Insights IA</h2>
      </div>

      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${getSeverityColor(insight.severity)}`}
          >
            <div className="flex items-start gap-3">
              {getSeverityIcon(insight.severity)}
              <div className="flex-1">
                <p className="text-white text-sm leading-relaxed">{insight.message}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-gold"
                      style={{ width: `${insight.confidence}%` }}
                    />
                  </div>
                  <span className="text-xs text-white/60">{insight.confidence}%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
