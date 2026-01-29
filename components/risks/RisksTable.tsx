// ================================================================
// PACK 10 - RisksTable (Desktop)
// ================================================================
// Table desktop des risques avec 7 colonnes + sélection

'use client';

import { RiskExecutive } from '@/types';
import { 
  getScoreLevelColor,
  getScoreLevelLabel,
  getSeverityLabel,
  getProbabilityLabel,
  getTrendIcon,
  getTrendColor,
  getTrendLabel
} from '@/lib/ai-risk-agent';
import { AlertTriangle } from 'lucide-react';

interface RisksTableProps {
  risks: RiskExecutive[];
  onSelectRisk: (risk: RiskExecutive) => void;
  selectedRiskId?: string;
}

export function RisksTable({ risks, onSelectRisk, selectedRiskId }: RisksTableProps) {
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open': return 'Ouvert';
      case 'in_progress': return 'En cours';
      case 'mitigated': return 'Mitigé';
      case 'closed': return 'Clôturé';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'blue';
      case 'in_progress': return 'orange';
      case 'mitigated': return 'green';
      case 'closed': return 'gray';
      default: return 'gray';
    }
  };

  if (risks.length === 0) {
    return (
      <div className="bg-[#0A0A0A] border border-[#1E1E1E] rounded-lg p-8 text-center">
        <AlertTriangle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
        <p className="text-gray-400">Aucun risque identifié</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0A0A0A] border border-[#1E1E1E] rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#1E1E1E]">
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Titre
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Sévérité
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Probabilité
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Score
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Tendance
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Statut
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Projet
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1E1E1E]">
          {risks.map((risk) => {
            const isSelected = selectedRiskId === risk.id;
            const scoreColor = getScoreLevelColor(risk.score);
            const scoreLabel = getScoreLevelLabel(risk.score);
            const statusColor = getStatusColor(risk.status);
            const trendColor = getTrendColor(risk.trend);
            const trendIcon = getTrendIcon(risk.trend);

            return (
              <tr
                key={risk.id}
                onClick={() => onSelectRisk(risk)}
                className={`
                  cursor-pointer transition-colors duration-120
                  ${isSelected ? 'bg-blue-500/5' : 'hover:bg-[#111111]'}
                `}
              >
                {/* Titre */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white text-sm line-clamp-1">
                      {risk.title}
                    </span>
                    {risk.ai_analysis && (
                      <div className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0" title="Analysé par IA" />
                    )}
                  </div>
                </td>

                {/* Sévérité */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-300">{getSeverityLabel(risk.severity)}</span>
                    <span className="text-xs text-gray-500">({risk.severity}/5)</span>
                  </div>
                </td>

                {/* Probabilité */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-300">{getProbabilityLabel(risk.probability)}</span>
                    <span className="text-xs text-gray-500">({risk.probability}/5)</span>
                  </div>
                </td>

                {/* Score */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-${scoreColor}-500/20 text-${scoreColor}-500`}>
                      <AlertTriangle className="w-3 h-3" />
                      {risk.score}
                    </span>
                    <span className="text-xs text-gray-500">{scoreLabel}</span>
                  </div>
                </td>

                {/* Tendance */}
                <td className="px-4 py-3">
                  {risk.trend ? (
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-${trendColor}-500/20 text-${trendColor}-500`}>
                      {trendIcon} {getTrendLabel(risk.trend)}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-500">Non évalué</span>
                  )}
                </td>

                {/* Statut */}
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-${statusColor}-500/20 text-${statusColor}-500`}>
                    {getStatusLabel(risk.status)}
                  </span>
                </td>

                {/* Projet */}
                <td className="px-4 py-3">
                  {risk.project ? (
                    <span className="text-sm text-gray-300 line-clamp-1">
                      {risk.project.name}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-500">-</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
