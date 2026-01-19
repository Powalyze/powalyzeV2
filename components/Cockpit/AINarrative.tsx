/**
 * COMPOSANT: AINarrative
 * Bloc "Synthèse IA" transversal
 * Règles: Concis, exécutif, orienté arbitrage, sans jargon
 */

"use client";

import { useTranslation } from '@/lib/i18n';
import { Sparkles } from 'lucide-react';

interface AINarrativeProps {
  summary?: string;
  analysis?: string;
  recommendations?: string[];
  scenarios?: Array<{ title: string; impact: string }>;
  alerts?: string[];
}

export default function AINarrative({ 
  summary, 
  analysis, 
  recommendations, 
  scenarios, 
  alerts 
}: AINarrativeProps) {
  const { t } = useTranslation();

  return (
    <div className="card-premium border-l-4 border-gold">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-6 h-6 text-gold" />
        <h3 className="header-title text-xl">
          {t('cockpit.modules.projects.aiSummary')}
        </h3>
      </div>

      <div className="space-y-6">
        {/* Résumé Exécutif */}
        {summary && (
          <div>
            <h4 className="header-subtitle text-sm font-semibold mb-2">
              {t('cockpit.detailSheet.aiNarrative.summary')}
            </h4>
            <p className="text-sm leading-relaxed opacity-90">{summary}</p>
          </div>
        )}

        {/* Analyse */}
        {analysis && (
          <div>
            <h4 className="header-subtitle text-sm font-semibold mb-2">
              {t('cockpit.detailSheet.aiNarrative.analysis')}
            </h4>
            <p className="text-sm leading-relaxed opacity-90">{analysis}</p>
          </div>
        )}

        {/* Recommandations */}
        {recommendations && recommendations.length > 0 && (
          <div>
            <h4 className="header-subtitle text-sm font-semibold mb-2">
              {t('cockpit.detailSheet.aiNarrative.recommendations')}
            </h4>
            <ul className="space-y-2">
              {recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="text-gold mt-1">•</span>
                  <span className="opacity-90">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Scénarios */}
        {scenarios && scenarios.length > 0 && (
          <div>
            <h4 className="header-subtitle text-sm font-semibold mb-2">
              {t('cockpit.detailSheet.aiNarrative.scenarios')}
            </h4>
            <div className="space-y-3">
              {scenarios.map((scenario, idx) => (
                <div key={idx} className="bg-neutral-white rounded-lg p-3">
                  <p className="text-sm font-medium mb-1">{scenario.title}</p>
                  <p className="text-xs opacity-70">{scenario.impact}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alertes */}
        {alerts && alerts.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-red-800 mb-2">
              {t('cockpit.detailSheet.aiNarrative.alerts')}
            </h4>
            <ul className="space-y-1">
              {alerts.map((alert, idx) => (
                <li key={idx} className="text-xs text-red-700">
                  {alert}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
