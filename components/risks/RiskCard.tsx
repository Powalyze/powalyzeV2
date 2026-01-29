// ================================================================
// PACK 10 - RiskCard (Mobile)
// ================================================================
// Carte risque pour affichage mobile (liste verticale)

'use client';

import { RiskExecutive } from '@/types';
import { 
  getScoreLevelColor, 
  getSeverityLabel, 
  getProbabilityLabel,
  getTrendIcon,
  getTrendColor 
} from '@/lib/ai-risk-agent';
import { AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface RiskCardProps {
  risk: RiskExecutive;
  onClick: () => void;
}

export function RiskCard({ risk, onClick }: RiskCardProps) {
  const scoreColor = getScoreLevelColor(risk.score);
  const trendColor = getTrendColor(risk.trend);
  const trendIcon = getTrendIcon(risk.trend);

  // Couleur du badge statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'blue';
      case 'in_progress': return 'orange';
      case 'mitigated': return 'green';
      case 'closed': return 'gray';
      default: return 'gray';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open': return 'Ouvert';
      case 'in_progress': return 'En cours';
      case 'mitigated': return 'Mitigé';
      case 'closed': return 'Clôturé';
      default: return status;
    }
  };

  const statusColor = getStatusColor(risk.status);

  return (
    <div
      onClick={onClick}
      className="bg-[#111111] border border-[#1E1E1E] rounded-lg p-4 cursor-pointer hover:border-[#2A2A2A] transition-all duration-120"
    >
      {/* En-tête: Titre + Score */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-white text-sm line-clamp-2">
            {risk.title}
          </h3>
        </div>
        
        {/* Score badge */}
        <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-${scoreColor}-500/20 text-${scoreColor}-500`}>
          <AlertTriangle className="w-3 h-3" />
          {risk.score}
        </div>
      </div>

      {/* Détails */}
      <div className="flex items-center gap-4 text-xs text-gray-400">
        {/* Sévérité */}
        <div className="flex items-center gap-1">
          <span className="text-gray-500">Sévérité:</span>
          <span className="text-white">{getSeverityLabel(risk.severity)}</span>
        </div>

        {/* Probabilité */}
        <div className="flex items-center gap-1">
          <span className="text-gray-500">Prob:</span>
          <span className="text-white">{getProbabilityLabel(risk.probability)}</span>
        </div>
      </div>

      {/* Statut + Tendance */}
      <div className="flex items-center gap-2 mt-3">
        {/* Badge statut */}
        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-${statusColor}-500/20 text-${statusColor}-500`}>
          {getStatusLabel(risk.status)}
        </span>

        {/* Badge tendance */}
        {risk.trend && (
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-${trendColor}-500/20 text-${trendColor}-500`}>
            {risk.trend === 'rising' && <TrendingUp className="w-3 h-3" />}
            {risk.trend === 'falling' && <TrendingDown className="w-3 h-3" />}
            {risk.trend === 'stable' && <Minus className="w-3 h-3" />}
            {trendIcon}
          </span>
        )}

        {/* Indicateur analyse IA */}
        {risk.ai_analysis && (
          <div className="w-2 h-2 rounded-full bg-purple-500 ml-auto" title="Analysé par IA" />
        )}
      </div>

      {/* Projet associé */}
      {risk.project && (
        <div className="mt-3 pt-3 border-t border-[#1E1E1E]">
          <div className="text-xs text-gray-500">
            Projet: <span className="text-gray-300">{risk.project.name}</span>
          </div>
        </div>
      )}
    </div>
  );
}
