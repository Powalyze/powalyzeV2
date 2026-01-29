/**
 * DECISIONS TABLE - Desktop (PACK 9)
 * Table premium des décisions avec tri et filtres
 */

'use client';

import { Decision } from '@/types';
import { getPriorityLevel, getPriorityBadgeColor } from '@/lib/ai-decision-agent';
import { Calendar, User, TrendingUp } from 'lucide-react';

interface DecisionsTableProps {
  decisions: Decision[];
  onSelectDecision: (decision: Decision) => void;
  selectedDecisionId?: string;
}

export function DecisionsTable({ decisions, onSelectDecision, selectedDecisionId }: DecisionsTableProps) {
  const statusLabels = {
    open: 'Ouverte',
    in_progress: 'En cours',
    closed: 'Clôturée',
  };
  
  const statusColors = {
    open: 'bg-blue-500/10 text-blue-500',
    in_progress: 'bg-orange-500/10 text-orange-500',
    closed: 'bg-green-500/10 text-green-500',
  };

  return (
    <div className="bg-[#0A0A0A] border border-[#1E1E1E] rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#1E1E1E]">
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Titre
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Owner
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Statut
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Priorité
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Deadline
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Projet
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1E1E1E]">
          {decisions.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                Aucune décision
              </td>
            </tr>
          ) : (
            decisions.map((decision) => {
              const priorityLevel = getPriorityLevel(decision.priority_score);
              const priorityColor = getPriorityBadgeColor(priorityLevel);
              const isSelected = decision.id === selectedDecisionId;

              return (
                <tr
                  key={decision.id}
                  onClick={() => onSelectDecision(decision)}
                  className={`cursor-pointer transition-colors duration-120 ${
                    isSelected
                      ? 'bg-blue-500/5 hover:bg-blue-500/10'
                      : 'hover:bg-[#111111]'
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-start gap-2">
                      <span className="text-sm text-white font-medium line-clamp-2">
                        {decision.title}
                      </span>
                      {decision.ai_analysis && (
                        <span className="shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-1.5" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-gray-500" />
                      <span className="text-sm text-gray-300">{decision.owner}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[decision.status]}`}>
                      {statusLabels[decision.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${priorityColor}`}>
                        {priorityLevel === 'high' ? 'Haute' : priorityLevel === 'medium' ? 'Moyenne' : 'Basse'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {decision.priority_score.toFixed(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {decision.deadline ? (
                      <div className="flex items-center gap-1.5 text-sm text-gray-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {new Date(decision.deadline).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short'
                          })}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-600">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {decision.project ? (
                      <span className="text-sm text-gray-400">{decision.project.name}</span>
                    ) : (
                      <span className="text-sm text-gray-600">—</span>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
