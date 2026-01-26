import Link from "next/link";
import { getDemoRisks } from "@/actions/demo/risks";

export default async function RisquesDemoPage() {
  const risks = await getDemoRisks();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Risques - Mode DEMO</h1>
          <p className="text-slate-400 mt-1">Gestion des risques avec données de démonstration</p>
        </div>
        <Link
          href="/cockpit-demo/risques/nouveau"
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/20 transition"
        >
          + Nouveau Risque
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <div className="text-sm text-slate-400 mb-1">Total</div>
          <div className="text-3xl font-bold">{risks.length}</div>
        </div>
        <div className="bg-slate-900/60 border border-red-800/50 rounded-2xl p-6">
          <div className="text-sm text-slate-400 mb-1">Critiques</div>
          <div className="text-3xl font-bold text-red-400">{risks.filter(r => r.impact >= 4).length}</div>
        </div>
        <div className="bg-slate-900/60 border border-emerald-800/50 rounded-2xl p-6">
          <div className="text-sm text-slate-400 mb-1">Résolus</div>
          <div className="text-3xl font-bold text-emerald-400">{risks.filter(r => r.status === "resolved").length}</div>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="space-y-4">
          {risks.map((risk) => (
            <Link
              key={risk.id}
              href={`/cockpit-demo/risques/${risk.id}`}
              className="block p-6 bg-slate-950 border border-slate-800 rounded-xl hover:border-red-500/50 transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-100">{risk.title}</h3>
                  <p className="text-sm text-slate-400 mt-2 line-clamp-2">{risk.description}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <span className="text-xs text-slate-500">Impact: {risk.impact}/5</span>
                    <span className="text-xs text-slate-500">Probabilité: {risk.probability}/5</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      risk.status === 'active' ? 'bg-red-500/20 text-red-400' :
                      risk.status === 'mitigated' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {risk.status}
                    </span>
                  </div>
                </div>
                <div className={`p-4 rounded-xl ${
                  risk.impact >= 4 ? 'bg-red-500/10' :
                  risk.impact >= 3 ? 'bg-orange-500/10' :
                  'bg-yellow-500/10'
                }`}>
                  <svg className={`w-6 h-6 ${
                    risk.impact >= 4 ? 'text-red-500' :
                    risk.impact >= 3 ? 'text-orange-500' :
                    'text-yellow-500'
                  }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
          {risks.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-lg mb-2">Aucun risque enregistré</p>
              <Link href="/cockpit-demo/risques/nouveau" className="text-blue-400 hover:text-blue-300">
                Créer le premier risque →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
