import { Risk } from '@/types/cockpit';

interface Props {
  risk: Risk;
  compact?: boolean;
}

export default function RiskCard({ risk, compact }: Props) {
  const getScoreColor = (score?: number) => {
    if (!score) return 'text-slate-400';
    if (score >= 70) return 'text-red-400';
    if (score >= 40) return 'text-amber-400';
    return 'text-emerald-400';
  };

  return (
    <div className={`text-[11px] ${compact ? '' : 'bg-slate-900 rounded-xl border border-slate-800 px-3 py-2'}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-slate-200">{risk.title}</span>
        <span className={`text-[10px] font-medium ${getScoreColor(risk.score)}`}>
          {risk.score?.toFixed(0) || 0}
        </span>
      </div>
      <div className="text-[10px] text-slate-500">
        P: {risk.probability}% · I: {risk.impact}% · {risk.status}
      </div>
      {!compact && (
        <div className="text-[10px] text-slate-400 mt-1">{risk.description}</div>
      )}
    </div>
  );
}
