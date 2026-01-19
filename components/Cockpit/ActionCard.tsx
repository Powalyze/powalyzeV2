import { Action } from '@/types/cockpit';

interface Props {
  action: Action;
  compact?: boolean;
}

export default function ActionCard({ action, compact }: Props) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DONE': return 'border-emerald-500 text-emerald-300';
      case 'IN_PROGRESS': return 'border-amber-400 text-amber-300';
      case 'BLOCKED': return 'border-red-500 text-red-300';
      default: return 'border-slate-500 text-slate-400';
    }
  };

  const isOverdue = new Date(action.due_date) < new Date() && action.status !== 'DONE';
  const isPriority = action.priority === 'CRITICAL' || action.priority === 'HIGH';

  return (
    <div className={`text-[11px] ${compact ? '' : 'bg-slate-900 rounded-xl border border-slate-800 px-3 py-2'}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-slate-200 flex items-center gap-1">
          {isOverdue && <span className="text-red-400">⚠</span>}
          {isPriority && <span className="text-amber-400">🔥</span>}
          {action.title}
        </span>
        <span className={`text-[9px] px-2 py-0.5 rounded-full border ${getStatusColor(action.status)}`}>
          {action.status}
        </span>
      </div>
      <div className="text-[10px] text-slate-500">
        {action.owner} · Due: {action.due_date}
        {action.priority && ` · ${action.priority}`}
      </div>
    </div>
  );
}
