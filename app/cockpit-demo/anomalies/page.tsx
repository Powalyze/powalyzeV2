import Link from "next/link";
import { getDemoAnomalies } from "@/actions/demo/anomalies";

export default async function AnomaliesDemoPage() {
  const anomalies = await getDemoAnomalies();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Anomalies - Mode DEMO</h1>
          <p className="text-slate-400 mt-1">Détection et suivi des anomalies avec données de démonstration</p>
        </div>
        <Link
          href="/cockpit-demo/anomalies/nouveau"
          className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-orange-500/20 transition"
        >
          + Nouvelle Anomalie
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <div className="text-sm text-slate-400 mb-1">Total</div>
          <div className="text-3xl font-bold">{anomalies.length}</div>
        </div>
        <div className="bg-slate-900/60 border border-red-800/50 rounded-2xl p-6">
          <div className="text-sm text-slate-400 mb-1">Critiques</div>
          <div className="text-3xl font-bold text-red-400">{anomalies.filter(a => a.severity === "critical").length}</div>
        </div>
        <div className="bg-slate-900/60 border border-orange-800/50 rounded-2xl p-6">
          <div className="text-sm text-slate-400 mb-1">Hautes</div>
          <div className="text-3xl font-bold text-orange-400">{anomalies.filter(a => a.severity === "high").length}</div>
        </div>
        <div className="bg-slate-900/60 border border-emerald-800/50 rounded-2xl p-6">
          <div className="text-sm text-slate-400 mb-1">Résolues</div>
          <div className="text-3xl font-bold text-emerald-400">{anomalies.filter(a => a.status === "resolved").length}</div>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="space-y-4">
          {anomalies.map((anomaly) => (
            <Link
              key={anomaly.id}
              href={`/cockpit-demo/anomalies/${anomaly.id}`}
              className="block p-6 bg-slate-950 border border-slate-800 rounded-xl hover:border-orange-500/50 transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-100">{anomaly.title}</h3>
                  <p className="text-sm text-slate-400 mt-2 line-clamp-2">{anomaly.description}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      anomaly.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                      anomaly.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                      anomaly.severity === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {anomaly.severity}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      anomaly.status === 'open' ? 'bg-red-500/20 text-red-400' :
                      anomaly.status === 'in_progress' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {anomaly.status}
                    </span>
                  </div>
                </div>
                <div className={`p-4 rounded-xl ${
                  anomaly.severity === 'critical' ? 'bg-red-500/10' :
                  anomaly.severity === 'high' ? 'bg-orange-500/10' :
                  'bg-amber-500/10'
                }`}>
                  <svg className={`w-6 h-6 ${
                    anomaly.severity === 'critical' ? 'text-red-500' :
                    anomaly.severity === 'high' ? 'text-orange-500' :
                    'text-amber-500'
                  }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
          {anomalies.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg mb-2">Aucune anomalie détectée</p>
              <Link href="/cockpit-demo/anomalies/nouveau" className="text-blue-400 hover:text-blue-300">
                Signaler une anomalie →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
