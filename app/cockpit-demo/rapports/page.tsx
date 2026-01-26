import Link from "next/link";
import { getDemoReports } from "@/actions/demo/reports";

export default async function RapportsDemoPage() {
  const reports = await getDemoReports();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Rapports - Mode DEMO</h1>
          <p className="text-slate-400 mt-1">Génération et consultation des rapports avec données de démonstration</p>
        </div>
        <Link
          href="/cockpit-demo/rapports/nouveau"
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/20 transition"
        >
          + Nouveau Rapport
        </Link>
      </div>

      <div className="grid grid-cols-5 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <div className="text-sm text-slate-400 mb-1">Total</div>
          <div className="text-3xl font-bold">{reports.length}</div>
        </div>
        <div className="bg-slate-900/60 border border-purple-800/50 rounded-2xl p-6">
          <div className="text-sm text-slate-400 mb-1">Exécutif</div>
          <div className="text-2xl font-bold text-purple-400">{reports.filter(r => r.type === "executive").length}</div>
        </div>
        <div className="bg-slate-900/60 border border-blue-800/50 rounded-2xl p-6">
          <div className="text-sm text-slate-400 mb-1">Technique</div>
          <div className="text-2xl font-bold text-blue-400">{reports.filter(r => r.type === "technical").length}</div>
        </div>
        <div className="bg-slate-900/60 border border-emerald-800/50 rounded-2xl p-6">
          <div className="text-sm text-slate-400 mb-1">Financier</div>
          <div className="text-2xl font-bold text-emerald-400">{reports.filter(r => r.type === "financial").length}</div>
        </div>
        <div className="bg-slate-900/60 border border-amber-800/50 rounded-2xl p-6">
          <div className="text-sm text-slate-400 mb-1">Risques</div>
          <div className="text-2xl font-bold text-amber-400">{reports.filter(r => r.type === "risk").length}</div>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="space-y-4">
          {reports.map((report) => (
            <Link
              key={report.id}
              href={`/cockpit-demo/rapports/${report.id}`}
              className="block p-6 bg-slate-950 border border-slate-800 rounded-xl hover:border-purple-500/50 transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-100">{report.title}</h3>
                  <p className="text-sm text-slate-400 mt-2 line-clamp-2">{report.content}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      report.type === 'executive' ? 'bg-purple-500/20 text-purple-400' :
                      report.type === 'technical' ? 'bg-blue-500/20 text-blue-400' :
                      report.type === 'financial' ? 'bg-emerald-500/20 text-emerald-400' :
                      report.type === 'risk' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-slate-500/20 text-slate-400'
                    }`}>
                      {report.type}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(report.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-purple-500/10 rounded-xl">
                  <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
          {reports.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-lg mb-2">Aucun rapport généré</p>
              <Link href="/cockpit-demo/rapports/nouveau" className="text-blue-400 hover:text-blue-300">
                Créer le premier rapport →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
