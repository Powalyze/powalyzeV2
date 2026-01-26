import Link from "next/link";
import { getDemoConnectors } from "@/actions/demo/connectors";

export default async function ConnecteursDemoPage() {
  const connectors = await getDemoConnectors();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Connecteurs - Mode DEMO</h1>
          <p className="text-slate-400 mt-1">Intégrations et connecteurs avec données de démonstration</p>
        </div>
        <Link
          href="/cockpit-demo/connecteurs/nouveau"
          className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-cyan-500/20 transition"
        >
          + Nouveau Connecteur
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <div className="text-sm text-slate-400 mb-1">Total</div>
          <div className="text-3xl font-bold">{connectors.length}</div>
        </div>
        <div className="bg-slate-900/60 border border-emerald-800/50 rounded-2xl p-6">
          <div className="text-sm text-slate-400 mb-1">Actifs</div>
          <div className="text-3xl font-bold text-emerald-400">{connectors.filter(c => c.status === "active").length}</div>
        </div>
        <div className="bg-slate-900/60 border border-amber-800/50 rounded-2xl p-6">
          <div className="text-sm text-slate-400 mb-1">Inactifs</div>
          <div className="text-3xl font-bold text-amber-400">{connectors.filter(c => c.status === "inactive").length}</div>
        </div>
        <div className="bg-slate-900/60 border border-red-800/50 rounded-2xl p-6">
          <div className="text-sm text-slate-400 mb-1">Erreurs</div>
          <div className="text-3xl font-bold text-red-400">{connectors.filter(c => c.status === "error").length}</div>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="space-y-4">
          {connectors.map((connector) => (
            <Link
              key={connector.id}
              href={`/cockpit-demo/connecteurs/${connector.id}`}
              className="block p-6 bg-slate-950 border border-slate-800 rounded-xl hover:border-cyan-500/50 transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-100">{connector.name}</h3>
                  <p className="text-sm text-slate-400 mt-2">{connector.api_url}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      connector.type === 'jira' ? 'bg-blue-500/20 text-blue-400' :
                      connector.type === 'slack' ? 'bg-purple-500/20 text-purple-400' :
                      connector.type === 'github' ? 'bg-slate-500/20 text-slate-400' :
                      connector.type === 'gitlab' ? 'bg-orange-500/20 text-orange-400' :
                      connector.type === 'azure_devops' ? 'bg-cyan-500/20 text-cyan-400' :
                      'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {connector.type}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      connector.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                      connector.status === 'inactive' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {connector.status}
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-cyan-500/10 rounded-xl">
                  <svg className="w-6 h-6 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
          {connectors.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <p className="text-lg mb-2">Aucun connecteur configuré</p>
              <Link href="/cockpit-demo/connecteurs/nouveau" className="text-blue-400 hover:text-blue-300">
                Configurer le premier connecteur →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
