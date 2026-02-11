import { Settings, ExternalLink, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";

export default function IntegrationsPage() {
  const integrations = [
    {
      name: "Jira",
      description: "Synchronisation bidirectionnelle des issues et projets",
      logo: "/logos/jira.png",
      connected: true,
      lastSync: "Il y a 5 min",
      features: ["Import/Export automatique", "Webhooks temps réel", "Mapping des statuts"],
    },
    {
      name: "Slack",
      description: "Notifications instantanées sur vos channels",
      logo: "/logos/slack.png",
      connected: true,
      lastSync: "Temps réel",
      features: ["Alertes personnalisées", "Commandes slash", "Thread discussions"],
    },
    {
      name: "GitHub",
      description: "Suivi des commits, PRs et releases",
      logo: "/logos/github.png",
      connected: false,
      lastSync: null,
      features: ["Sync automatique", "Webhooks", "Déploiement tracking"],
    },
    {
      name: "Azure DevOps",
      description: "Intégration complète CI/CD et boards",
      logo: "/logos/azure.png",
      connected: true,
      lastSync: "Il y a 1h",
      features: ["Pipelines monitoring", "Work Items sync", "Test results"],
    },
    {
      name: "Microsoft Teams",
      description: "Collaboration et notifications d'équipe",
      logo: "/logos/teams.png",
      connected: false,
      lastSync: null,
      features: ["Bot intégré", "Adaptive Cards", "Meeting notes"],
    },
    {
      name: "Power BI",
      description: "Analytics avancés et rapports personnalisés",
      logo: "/logos/powerbi.png",
      connected: true,
      lastSync: "Il y a 15 min",
      features: ["Dashboards live", "Exports automatiques", "Scheduled refresh"],
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Settings size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Intégrations</h1>
              <p className="text-slate-400">
                Connectez vos outils préférés pour un workflow unifié
              </p>
            </div>
          </div>
          <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium flex items-center gap-2 transition-colors">
            <RefreshCw size={18} />
            Synchroniser tout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400 text-sm mb-1">Intégrations actives</div>
          <div className="text-2xl font-bold text-white">
            {integrations.filter((i) => i.connected).length} / {integrations.length}
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400 text-sm mb-1">Dernière synchronisation</div>
          <div className="text-2xl font-bold text-white">Temps réel</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400 text-sm mb-1">Webhooks actifs</div>
          <div className="text-2xl font-bold text-white">12</div>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {integrations.map((integration) => (
          <div
            key={integration.name}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">{integration.name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{integration.name}</h3>
                  <p className="text-sm text-slate-400">{integration.description}</p>
                </div>
              </div>
              {integration.connected ? (
                <span className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                  <CheckCircle size={12} />
                  Connecté
                </span>
              ) : (
                <span className="flex items-center gap-1 px-2 py-1 bg-slate-700 text-slate-400 rounded-full text-xs font-medium">
                  <AlertCircle size={12} />
                  Non connecté
                </span>
              )}
            </div>

            {/* Features */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-white mb-2">Fonctionnalités</h4>
              <ul className="space-y-1">
                {integration.features.map((feature, i) => (
                  <li key={i} className="text-sm text-slate-400 flex items-center gap-2">
                    <span className="text-blue-400">•</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Last Sync */}
            {integration.lastSync && (
              <div className="mb-4 text-sm text-slate-500">
                Dernière synchro : {integration.lastSync}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              {integration.connected ? (
                <>
                  <button className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2">
                    <Settings size={16} />
                    Configurer
                  </button>
                  <button className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors">
                    Déconnecter
                  </button>
                </>
              ) : (
                <button className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2">
                  <ExternalLink size={16} />
                  Connecter
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* API Section */}
      <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          🔌 API REST & Webhooks
        </h3>
        <p className="text-slate-300 mb-4">
          Connectez n'importe quel outil via notre API REST complète ou configurez des webhooks pour recevoir des événements en temps réel.
        </p>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors">
            Documentation API
          </button>
          <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors">
            Créer un webhook
          </button>
        </div>
      </div>
    </div>
  );
}
