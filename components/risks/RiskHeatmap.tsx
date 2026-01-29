// ================================================================
// PACK 10 - RiskHeatmap (Desktop)
// ================================================================
// Matrice 5×5 de distribution des risques (sévérité × probabilité)

'use client';

import { HeatmapCell } from '@/types';
import { getSeverityLabel, getProbabilityLabel } from '@/lib/ai-risk-agent';

interface RiskHeatmapProps {
  heatmap: HeatmapCell[];
  onCellClick?: (severity: number, probability: number) => void;
}

export function RiskHeatmap({ heatmap, onCellClick }: RiskHeatmapProps) {
  // Obtenir le nombre de risques dans une cellule
  const getCellCount = (severity: number, probability: number): number => {
    const cell = heatmap.find(c => c.severity === severity && c.probability === probability);
    return cell?.count || 0;
  };

  // Obtenir la couleur de la cellule selon le score (severity × probability)
  const getCellColor = (severity: number, probability: number): string => {
    const score = severity * probability;
    
    if (score >= 15) return 'bg-red-500/30 hover:bg-red-500/40 border-red-500/50'; // Critique
    if (score >= 8) return 'bg-orange-500/30 hover:bg-orange-500/40 border-orange-500/50'; // Élevé
    if (score >= 4) return 'bg-yellow-500/30 hover:bg-yellow-500/40 border-yellow-500/50'; // Modéré
    return 'bg-gray-500/20 hover:bg-gray-500/30 border-gray-500/30'; // Faible
  };

  const severityLevels = [5, 4, 3, 2, 1]; // De haut en bas (5=Critique → 1=Mineur)
  const probabilityLevels = [1, 2, 3, 4, 5]; // De gauche à droite (1=Très faible → 5=Très élevée)

  return (
    <div className="bg-[#0A0A0A] border border-[#1E1E1E] rounded-lg p-6">
      {/* Titre */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">Cartographie des Risques</h3>
        <p className="text-sm text-gray-400">Distribution des risques par sévérité et probabilité</p>
      </div>

      {/* Matrice 5×5 */}
      <div className="space-y-4">
        {/* Label Y-axis (Sévérité) */}
        <div className="flex items-center gap-4">
          <div className="w-24 text-right">
            <span className="text-xs font-semibold text-gray-400 uppercase">Sévérité</span>
          </div>
          <div className="flex-1" />
        </div>

        {/* Lignes de la heatmap */}
        {severityLevels.map((severity) => (
          <div key={`severity-${severity}`} className="flex items-center gap-4">
            {/* Label de sévérité */}
            <div className="w-24 text-right">
              <span className="text-xs text-gray-400">{getSeverityLabel(severity)}</span>
            </div>

            {/* Cellules pour chaque probabilité */}
            <div className="flex-1 grid grid-cols-5 gap-2">
              {probabilityLevels.map((probability) => {
                const count = getCellCount(severity, probability);
                const cellColor = getCellColor(severity, probability);
                const score = severity * probability;

                return (
                  <div
                    key={`cell-${severity}-${probability}`}
                    onClick={() => onCellClick && onCellClick(severity, probability)}
                    className={`
                      relative aspect-square rounded border-2 transition-all duration-200
                      flex flex-col items-center justify-center cursor-pointer
                      ${cellColor}
                    `}
                    title={`Score: ${score} | Risques: ${count}`}
                  >
                    {/* Nombre de risques */}
                    <span className="text-lg font-bold text-white">{count}</span>
                    
                    {/* Score */}
                    <span className="text-[10px] text-gray-300 mt-1">
                      Score: {score}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Label X-axis (Probabilité) */}
        <div className="flex items-center gap-4 mt-4">
          <div className="w-24" />
          <div className="flex-1 grid grid-cols-5 gap-2">
            {probabilityLevels.map((prob) => (
              <div key={`prob-label-${prob}`} className="text-center">
                <span className="text-xs text-gray-400">{getProbabilityLabel(prob)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Label X-axis title */}
        <div className="flex items-center gap-4">
          <div className="w-24" />
          <div className="flex-1 text-center">
            <span className="text-xs font-semibold text-gray-400 uppercase">Probabilité</span>
          </div>
        </div>
      </div>

      {/* Légende */}
      <div className="mt-6 pt-6 border-t border-[#1E1E1E]">
        <div className="flex items-center justify-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500/30 border border-red-500/50" />
            <span className="text-gray-400">Critique (15-25)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-orange-500/30 border border-orange-500/50" />
            <span className="text-gray-400">Élevé (8-14)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-500/30 border border-yellow-500/50" />
            <span className="text-gray-400">Modéré (4-7)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-500/20 border border-gray-500/30" />
            <span className="text-gray-400">Faible (1-3)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
