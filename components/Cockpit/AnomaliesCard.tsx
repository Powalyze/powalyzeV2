"use client";

import { AlertCircle } from "lucide-react";

type Anomaly = {
  id: string;
  source: string;
  entity_type: string;
  entity_id: string;
  description: string;
  severity: string;
  detected_at: string;
  resolved: boolean;
  resolution: string;
};

type Props = {
  anomalies: Anomaly[];
};

export function AnomaliesCard({ anomalies }: Props) {
  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  };

  const unresolved = anomalies.filter(a => !a.resolved);

  return (
    <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/50 transition-all">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-zinc-50 mb-1">Radar des anomalies</h2>
          <p className="text-sm text-slate-400">{unresolved.length} anomalie(s) non résolue(s)</p>
        </div>
        <AlertCircle className="text-amber-400" size={24} />
      </div>

      <div className="space-y-3">
        {unresolved.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            Aucune anomalie détectée
          </div>
        ) : (
          unresolved.slice(0, 5).map(anomaly => (
            <div
              key={anomaly.id}
              className="p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full border ${getSeverityColor(anomaly.severity)}`}>
                      {anomaly.severity}
                    </span>
                    <span className="text-xs text-slate-400">{anomaly.source}</span>
                  </div>
                  <p className="text-sm text-slate-300">{anomaly.description}</p>
                </div>
              </div>
              <div className="text-xs text-slate-500 mt-2">
                Détecté le {new Date(anomaly.detected_at).toLocaleDateString()} à{' '}
                {new Date(anomaly.detected_at).toLocaleTimeString()}
              </div>
            </div>
          ))
        )}
      </div>

      {unresolved.length > 5 && (
        <button className="w-full mt-4 text-sm text-amber-400 hover:text-amber-300 transition-colors">
          Voir toutes les anomalies ({unresolved.length}) →
        </button>
      )}
    </div>
  );
}
