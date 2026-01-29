// ================================================================
// PACK 10 - AIRiskAnalysisPanel (Panel droit IA)
// ================================================================
// Panneau d'analyse IA pour les risques (Agent AAR)

'use client';

import { RiskAnalysis } from '@/types';
import { Brain, TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

interface AIRiskAnalysisPanelProps {
  analysis: RiskAnalysis;
  loading?: boolean;
}

export function AIRiskAnalysisPanel({ analysis, loading }: AIRiskAnalysisPanelProps) {
  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3 text-purple-500">
          <Brain className="w-5 h-5 animate-pulse" />
          <span className="text-sm font-medium">Analyse en cours...</span>
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-4 bg-gray-800 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return <TrendingUp className="w-4 h-4" />;
      case 'falling': return <TrendingDown className="w-4 h-4" />;
      default: return <Minus className="w-4 h-4" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'rising': return 'text-red-500 bg-red-500/10';
      case 'falling': return 'text-green-500 bg-green-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-500 bg-red-500/10';
      case 'high': return 'text-orange-500 bg-orange-500/10';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'immediate': return <AlertTriangle className="w-4 h-4" />;
      case 'short_term': return <Clock className="w-4 h-4" />;
      case 'long_term': return <CheckCircle2 className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-[#1E1E1E]">
        <Brain className="w-6 h-6 text-purple-500" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">Analyse AAR</h3>
          <p className="text-xs text-gray-400">Agent Analyse & Risques</p>
        </div>
        <div className="text-xs text-gray-500">
          Confiance: {analysis.confidence_score}%
        </div>
      </div>

      {/* Résumé exécutif */}
      <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-purple-400 mb-2">Résumé Exécutif</h4>
        <p className="text-sm text-gray-300 leading-relaxed">{analysis.executive_summary}</p>
      </div>

      {/* Analyse détaillée */}
      <div className="space-y-4">
        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Nature du Risque</h4>
          <p className="text-sm text-gray-300 leading-relaxed">{analysis.risk_nature}</p>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Analyse d'Impact</h4>
          <p className="text-sm text-gray-300 leading-relaxed">{analysis.impact_analysis}</p>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Justification Probabilité</h4>
          <p className="text-sm text-gray-300 leading-relaxed">{analysis.probability_rationale}</p>
        </div>
      </div>

      {/* Tendance évaluée */}
      <div className="bg-[#111111] border border-[#1E1E1E] rounded-lg p-4">
        <div className="flex items-center gap-3 mb-3">
          <h4 className="text-sm font-semibold text-white">Évaluation de Tendance</h4>
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getTrendColor(analysis.trend_evaluation.trend)}`}>
            {getTrendIcon(analysis.trend_evaluation.trend)}
            {analysis.trend_evaluation.trend === 'rising' && 'En aggravation'}
            {analysis.trend_evaluation.trend === 'stable' && 'Stable'}
            {analysis.trend_evaluation.trend === 'falling' && 'En diminution'}
          </span>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed">{analysis.trend_evaluation.rationale}</p>
        <div className="mt-2 text-xs text-gray-500">
          Confiance: {analysis.trend_evaluation.confidence}%
        </div>
      </div>

      {/* Risques émergents */}
      {analysis.emerging_risks && analysis.emerging_risks.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            Risques Émergents Détectés
          </h4>
          <div className="space-y-3">
            {analysis.emerging_risks.map((emergingRisk, idx) => (
              <div key={idx} className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h5 className="text-sm font-semibold text-orange-400">{emergingRisk.title}</h5>
                  <span className="text-xs text-orange-500 bg-orange-500/20 px-2 py-1 rounded">
                    {emergingRisk.detection_confidence}%
                  </span>
                </div>
                <p className="text-sm text-gray-300 mb-2">{emergingRisk.description}</p>
                <div className="text-xs text-gray-400 space-y-1">
                  <div><strong>Évolution:</strong> {emergingRisk.probability_evolution}</div>
                  <div><strong>Impact potentiel:</strong> {emergingRisk.potential_impact}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommandations */}
      {analysis.recommendations && analysis.recommendations.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-white mb-3">Recommandations</h4>
          <div className="space-y-3">
            {analysis.recommendations.map((rec, idx) => (
              <div key={idx} className="bg-[#111111] border border-[#1E1E1E] rounded-lg p-4">
                {/* Header */}
                <div className="flex items-start gap-3 mb-2">
                  <div className={`p-1.5 rounded ${getPriorityColor(rec.priority)}`}>
                    {getTypeIcon(rec.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="text-sm font-semibold text-white">{rec.title}</h5>
                      <span className={`text-xs px-2 py-0.5 rounded ${getPriorityColor(rec.priority)}`}>
                        {rec.priority}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {rec.type === 'immediate' && 'Action immédiate'}
                      {rec.type === 'short_term' && 'Court terme'}
                      {rec.type === 'long_term' && 'Long terme'}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-300 mb-3">{rec.description}</p>

                {/* Impact & Effort */}
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <div>
                    <strong className="text-gray-500">Impact:</strong> {rec.expected_impact}
                  </div>
                  <div>
                    <strong className="text-gray-500">Effort:</strong> {rec.estimated_effort}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="pt-4 border-t border-[#1E1E1E] text-xs text-gray-500 text-center">
        Analyse générée par Agent AAR (Analyse & Risques)
      </div>
    </div>
  );
}
