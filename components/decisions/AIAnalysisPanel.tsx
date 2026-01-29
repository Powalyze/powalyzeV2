/**
 * AI ANALYSIS PANEL (PACK 9)
 * Panel IA avec options, impacts, recommandations
 */

'use client';

import { DecisionAnalysis } from '@/types';
import { Sparkles, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';

interface AIAnalysisPanelProps {
  analysis: DecisionAnalysis;
  onSelectOption: (option: 'A' | 'B' | 'C') => void;
  selectedOption?: 'A' | 'B' | 'C' | null;
  loading?: boolean;
}

export function AIAnalysisPanel({ analysis, onSelectOption, selectedOption, loading }: AIAnalysisPanelProps) {
  const getRiskColor = (level: 'low' | 'medium' | 'high') => {
    return {
      low: 'text-green-500',
      medium: 'text-orange-500',
      high: 'text-red-500',
    }[level];
  };

  const getRiskIcon = (level: 'low' | 'medium' | 'high') => {
    return {
      low: CheckCircle,
      medium: AlertTriangle,
      high: TrendingDown,
    }[level];
  };

  return (
    <div className="space-y-6">
      {/* Résumé Exécutif */}
      <div className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-lg">
        <div className="flex items-start gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
          <h3 className="text-sm font-medium text-purple-400">Résumé Exécutif</h3>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed">{analysis.summary}</p>
        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
          <span>Confiance: {Math.round(analysis.confidence * 100)}%</span>
          <span>•</span>
          <span>Généré le {new Date(analysis.generated_at).toLocaleDateString('fr-FR')}</span>
        </div>
      </div>

      {/* Options d'Arbitrage */}
      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-3">Options d'Arbitrage</h3>
        <div className="space-y-3">
          {(['A', 'B', 'C'] as const).map((key) => {
            const option = analysis.options[key];
            const RiskIcon = getRiskIcon(option.risk_level);
            const isSelected = selectedOption === key;
            const isRecommended = analysis.recommendation === key;

            return (
              <div
                key={key}
                className={`p-4 rounded-lg border transition-all duration-120 cursor-pointer ${
                  isSelected
                    ? 'bg-blue-500/10 border-blue-500/50'
                    : 'bg-[#111111] border-[#1E1E1E] hover:border-[#2A2A2A]'
                }`}
                onClick={() => onSelectOption(key)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">Option {key}</span>
                    {isRecommended && (
                      <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded border border-purple-500/30">
                        Recommandée
                      </span>
                    )}
                  </div>
                  <RiskIcon className={`w-4 h-4 ${getRiskColor(option.risk_level)}`} />
                </div>
                
                <h4 className="text-sm font-medium text-gray-200 mb-1">{option.title}</h4>
                <p className="text-xs text-gray-400 mb-3">{option.description}</p>

                {/* Pros/Cons */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <div className="text-xs text-green-400 mb-1 font-medium">Avantages</div>
                    <ul className="space-y-1">
                      {option.pros.map((pro, i) => (
                        <li key={i} className="text-xs text-gray-500 flex items-start gap-1">
                          <span className="text-green-500 mt-0.5">+</span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-xs text-red-400 mb-1 font-medium">Inconvénients</div>
                    <ul className="space-y-1">
                      {option.cons.map((con, i) => (
                        <li key={i} className="text-xs text-gray-500 flex items-start gap-1">
                          <span className="text-red-500 mt-0.5">-</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Estimations */}
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  {option.estimated_cost && (
                    <span>Coût: {option.estimated_cost.toLocaleString('fr-FR')}€</span>
                  )}
                  {option.estimated_duration && (
                    <span>Durée: {option.estimated_duration}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Impacts */}
      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-3">Impacts</h3>
        <div className="space-y-3">
          <div className="p-3 bg-[#111111] border border-[#1E1E1E] rounded-lg">
            <div className="text-xs font-medium text-blue-400 mb-1">Court terme (0-3 mois)</div>
            <p className="text-sm text-gray-400">{analysis.impacts.short_term}</p>
          </div>
          <div className="p-3 bg-[#111111] border border-[#1E1E1E] rounded-lg">
            <div className="text-xs font-medium text-orange-400 mb-1">Moyen terme (3-12 mois)</div>
            <p className="text-sm text-gray-400">{analysis.impacts.medium_term}</p>
          </div>
          <div className="p-3 bg-[#111111] border border-[#1E1E1E] rounded-lg">
            <div className="text-xs font-medium text-purple-400 mb-1">Long terme (&gt;12 mois)</div>
            <p className="text-sm text-gray-400">{analysis.impacts.long_term}</p>
          </div>
        </div>
      </div>

      {/* Actions Immédiates */}
      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-3">Actions Immédiates</h3>
        <div className="space-y-2">
          {analysis.actions.map((action, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 bg-[#111111] border border-[#1E1E1E] rounded-lg"
            >
              <span className="shrink-0 w-5 h-5 bg-blue-500/20 text-blue-400 rounded text-xs font-medium flex items-center justify-center">
                {i + 1}
              </span>
              <p className="text-sm text-gray-300">{action}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Button */}
      {selectedOption && (
        <button
          onClick={() => onSelectOption(selectedOption)}
          disabled={loading}
          className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
        >
          {loading ? 'Validation...' : `Valider l'option ${selectedOption}`}
        </button>
      )}
    </div>
  );
}
