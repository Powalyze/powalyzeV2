import Link from "next/link";
import { getDemoRisks } from "@/actions/demo/risks";
import { getDemoDecisions } from "@/actions/demo/decisions";
import { getDemoAnomalies } from "@/actions/demo/anomalies";

export default async function CockpitDemoPage() {
  const risks = await getDemoRisks();
  const decisions = await getDemoDecisions();
  const anomalies = await getDemoAnomalies();

  const criticalRisks = risks.filter((r) => r.impact >= 4 || r.probability >= 4);
  const pendingDecisions = decisions.filter((d) => d.status === "pending");
  const criticalAnomalies = anomalies.filter((a) => a.severity === "critical" || a.severity === "high");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cockpit Exécutif - Mode DEMO</h1>
          <p className="text-slate-400 mt-1">Plateforme de démonstration avec données mock</p>
        </div>
        <Link
          href="/cockpit"
          className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-emerald-500/20 transition"
        >
          Accéder au MODE PRO
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <Link href="/cockpit-demo/risques" className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-red-500/50 transition">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-500/10 rounded-xl">
              <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <span className="text-3xl font-bold text-red-400">{criticalRisks.length}</span>
          </div>
          <div className="text-sm font-medium text-slate-300">Risques Critiques</div>
          <div className="text-xs text-slate-500 mt-1">{risks.length} total</div>
        </Link>

        <Link href="/cockpit-demo/decisions" className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-amber-500/50 transition">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-500/10 rounded-xl">
              <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-3xl font-bold text-amber-400">{pendingDecisions.length}</span>
          </div>
          <div className="text-sm font-medium text-slate-300">Décisions en Attente</div>
          <div className="text-xs text-slate-500 mt-1">{decisions.length} total</div>
        </Link>

        <Link href="/cockpit-demo/anomalies" className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-orange-500/50 transition">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-500/10 rounded-xl">
              <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-3xl font-bold text-orange-400">{criticalAnomalies.length}</span>
          </div>
          <div className="text-sm font-medium text-slate-300">Anomalies Critiques</div>
          <div className="text-xs text-slate-500 mt-1">{anomalies.length} total</div>
        </Link>

        <Link href="/cockpit-demo/rapports" className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-purple-500/50 transition">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-3xl font-bold text-purple-400">12</span>
          </div>
          <div className="text-sm font-medium text-slate-300">Rapports Générés</div>
          <div className="text-xs text-slate-500 mt-1">Ce mois</div>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">Risques Récents</h2>
          <div className="space-y-3">
            {risks.slice(0, 5).map((risk) => (
              <Link
                key={risk.id}
                href={`/cockpit-demo/risques/${risk.id}`}
                className="block p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-red-500/50 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-slate-200">{risk.title}</div>
                    <div className="text-xs text-slate-400 mt-1 line-clamp-1">{risk.description}</div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ml-3 ${
                    risk.impact >= 4 ? 'bg-red-500/20 text-red-400' :
                    risk.impact >= 3 ? 'bg-orange-500/20 text-orange-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    Impact: {risk.impact}/5
                  </span>
                </div>
              </Link>
            ))}
            {risks.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                <p>Aucun risque enregistré</p>
                <Link href="/cockpit-demo/risques/nouveau" className="text-blue-400 text-sm mt-2 inline-block">
                  Créer le premier risque
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">Décisions Récentes</h2>
          <div className="space-y-3">
            {decisions.slice(0, 5).map((decision) => (
              <Link
                key={decision.id}
                href={`/cockpit-demo/decisions/${decision.id}`}
                className="block p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-amber-500/50 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-slate-200">{decision.title}</div>
                    <div className="text-xs text-slate-400 mt-1">{decision.decision_maker}</div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ml-3 ${
                    decision.status === 'validated' ? 'bg-emerald-500/20 text-emerald-400' :
                    decision.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {decision.status}
                  </span>
                </div>
              </Link>
            ))}
            {decisions.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                <p>Aucune décision enregistrée</p>
                <Link href="/cockpit-demo/decisions/nouveau" className="text-blue-400 text-sm mt-2 inline-block">
                  Créer la première décision
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

