"use client";

import { AlertTriangle, Clock } from "lucide-react";
import { useState } from "react";

type Decision = {
  id: string;
  title: string;
  description: string;
  owner: string;
  status: string;
  due_date: string;
  impact_area: string;
  priority: string;
  created_at: string;
};

type Props = {
  decisions: Decision[];
};

export function DecisionsCard({ decisions }: Props) {
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(null);

  const pending = decisions.filter(d => d.status === 'pending');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-400';
      case 'high': return 'text-orange-400';
      case 'medium': return 'text-yellow-400';
      default: return 'text-slate-400';
    }
  };

  async function handleDecisionClick(decision: Decision) {
    setSelectedDecision(decision);
    // Future: appel API IA pour aide à la décision
    // const res = await fetch('/api/ai/decision-support', {
    //   method: 'POST',
    //   body: JSON.stringify({ decision }),
    // });
  }

  return (
    <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/50 transition-all">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-zinc-50 mb-1">Décisions en attente</h2>
          <p className="text-sm text-slate-400">{pending.length} décision(s) à traiter</p>
        </div>
        <AlertTriangle className="text-amber-400" size={24} />
      </div>

      <div className="space-y-3">
        {pending.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            Aucune décision en attente
          </div>
        ) : (
          pending.slice(0, 5).map(decision => (
            <div
              key={decision.id}
              onClick={() => handleDecisionClick(decision)}
              className="p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 cursor-pointer transition-all group"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-semibold text-zinc-50 group-hover:text-amber-400 transition-colors">
                  {decision.title}
                </h3>
                <span className={`text-xs font-medium ${getPriorityColor(decision.priority)}`}>
                  {decision.priority}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span>👤 {decision.owner}</span>
                {decision.due_date && (
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {new Date(decision.due_date).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {pending.length > 5 && (
        <button className="w-full mt-4 text-sm text-amber-400 hover:text-amber-300 transition-colors">
          Voir toutes les décisions →
        </button>
      )}
    </div>
  );
}
