import { Decision } from '@/types/cockpit';

interface Props {
  decision: Decision;
  compact?: boolean;
}

export default function DecisionCard({ decision, compact }: Props) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'text-emerald-400';
      case 'REJECTED': return 'text-red-400';
      case 'PENDING': return 'text-amber-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className={`text-[11px] ${compact ? '' : 'bg-slate-900 rounded-xl border border-slate-800 px-3 py-2'}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-slate-200">{decision.title}</span>
        <span className={`text-[10px] font-medium ${getStatusColor(decision.status)}`}>
          {decision.status}
        </span>
      </div>
      <div className="text-[10px] text-slate-500">
        {decision.type} · {decision.owner}
      </div>
      {!compact && decision.decision_date && (
        <div className="text-[10px] text-slate-400 mt-1">
          Séance : {decision.decision_date}
        </div>
      )}
    </div>
  );
}
