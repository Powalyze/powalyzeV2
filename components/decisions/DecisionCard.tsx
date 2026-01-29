/**
 * DECISION CARD - Mobile (PACK 9)
 * Carte décision pour affichage mobile
 */

'use client';

import { Decision } from '@/types';
import { getPriorityLevel, getPriorityBadgeColor } from '@/lib/ai-decision-agent';
import { Calendar, User, AlertCircle } from 'lucide-react';

interface DecisionCardProps {
  decision: Decision;
  onClick: () => void;
}

export function DecisionCard({ decision, onClick }: DecisionCardProps) {
  const priorityLevel = getPriorityLevel(decision.priority_score);
  const priorityColor = getPriorityBadgeColor(priorityLevel);
  
  const statusLabels = {
    open: 'Ouverte',
    in_progress: 'En cours',
    closed: 'Clôturée',
  };
  
  const statusColors = {
    open: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    in_progress: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    closed: 'bg-green-500/10 text-green-500 border-green-500/20',
  };

  return (
    <div
      onClick={onClick}
      className="bg-[#111111] border border-[#1E1E1E] rounded-lg p-4 cursor-pointer hover:border-[#2A2A2A] transition-all duration-120"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-white font-medium text-sm line-clamp-2 flex-1">
          {decision.title}
        </h3>
        <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium border ${priorityColor}`}>
          {priorityLevel === 'high' ? 'Haute' : priorityLevel === 'medium' ? 'Moyenne' : 'Basse'}
        </span>
      </div>

      {/* Owner + Status */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <User className="w-3.5 h-3.5" />
          <span>{decision.owner}</span>
        </div>
        <span className={`px-2 py-0.5 rounded text-xs font-medium border ${statusColors[decision.status]}`}>
          {statusLabels[decision.status]}
        </span>
      </div>

      {/* Deadline */}
      {decision.deadline && (
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Calendar className="w-3.5 h-3.5" />
          <span>
            {new Date(decision.deadline).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </span>
        </div>
      )}

      {/* AI Analysis Badge */}
      {decision.ai_analysis && (
        <div className="mt-3 pt-3 border-t border-[#1E1E1E]">
          <div className="flex items-center gap-1.5 text-xs text-purple-400">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Analyse IA disponible</span>
          </div>
        </div>
      )}
    </div>
  );
}
