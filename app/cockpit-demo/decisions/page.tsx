import Link from "next/link";
import { getDemoDecisions } from "@/actions/demo/decisions";

export default async function DecisionsDemoPage() {
  const decisions = await getDemoDecisions();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Décisions - Mode DEMO</h1>
          <p className="text-slate-400 mt-1">Suivi des décisions avec données de démonstration</p>
        </div>
        <Link
          href="/cockpit-demo/decisions/nouveau"
          className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-emerald-500/20 transition"
        >
          + Nouvelle Décision
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <div className="text-sm text-slate-400 mb-1">Total</div>
          <div className="text-3xl font-bold">{decisions.length}</div>
        </div>
        <div className="bg-slate-900/60 border border-amber-800/50 rounded-2xl p-6">
          <div className="text-sm text-slate-400 mb-1">En Attente</div>
          <div className="text-3xl font-bold text-amber-400">{decisions.filter(d => d.status === "pending").length}</div>
        </div>
        <div className="bg-slate-900/60 border border-emerald-800/50 rounded-2xl p-6">
          <div className="text-sm text-slate-400 mb-1">Validées</div>
          <div className="text-3xl font-bold text-emerald-400">{decisions.filter(d => d.status === "validated").length}</div>
        </div>
        <div className="bg-slate-900/60 border border-red-800/50 rounded-2xl p-6">
          <div className="text-sm text-slate-400 mb-1">En Retard</div>
          <div className="text-3xl font-bold text-red-400">{decisions.filter(d => d.status === "late").length}</div>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="space-y-4">
          {decisions.map((decision) => (
            <Link
              key={decision.id}
              href={`/cockpit-demo/decisions/${decision.id}`}
              className="block p-6 bg-slate-950 border border-slate-800 rounded-xl hover:border-emerald-500/50 transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-100">{decision.title}</h3>
                  <p className="text-sm text-slate-400 mt-2 line-clamp-2">{decision.description}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <span className="text-xs text-slate-500">Par: {decision.decision_maker}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      decision.status === 'validated' ? 'bg-emerald-500/20 text-emerald-400' :
                      decision.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {decision.status}
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-emerald-500/10 rounded-xl">
                  <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
          {decisions.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg mb-2">Aucune décision enregistrée</p>
              <Link href="/cockpit-demo/decisions/nouveau" className="text-blue-400 hover:text-blue-300">
                Créer la première décision →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
