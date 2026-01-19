'use client';

import React from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';

export interface AINarrativeBlockProps {
  summary: string;
  analysis: string;
  recommendations: string;
  scenarios?: string;
  alerts?: string;
  loading?: boolean;
}

export default function AINarrativeBlock({
  summary,
  analysis,
  recommendations,
  scenarios,
  alerts,
  loading = false
}: AINarrativeBlockProps) {
  if (loading) {
    return (
      <div className="ds-card bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-gold mt-8 animate-pulse">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-gold" />
          <div className="h-6 bg-neutral-200 rounded w-32"></div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-neutral-200 rounded w-full"></div>
          <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
          <div className="h-4 bg-neutral-200 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="ds-card bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-gold mt-8">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-gold" />
        <h3 className="ds-subtitle-navy text-base font-semibold">Synthèse IA</h3>
      </div>
      <div className="space-y-3 text-sm leading-relaxed text-neutral-800">
        <p>
          <strong className="text-navy">Résumé exécutif:</strong> {summary}
        </p>
        <p>
          <strong className="text-navy">Analyse:</strong> {analysis}
        </p>
        <p>
          <strong className="text-navy">Recommandations:</strong> {recommendations}
        </p>
        {scenarios && (
          <p>
            <strong className="text-navy">Scénarios:</strong> {scenarios}
          </p>
        )}
        {alerts && (
          <div className="flex items-start gap-2 mt-4 p-3 bg-yellow-50 border-l-2 border-yellow-500 rounded">
            <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <p className="text-yellow-900">
              <strong>Alertes:</strong> {alerts}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
