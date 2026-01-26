"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plug, CheckCircle, XCircle, Clock, AlertTriangle, Activity } from "lucide-react";

interface Connector {
  id: string;
  name: string;
  connector_type: string;
  api_url?: string;
  status: string;
  last_sync?: string;
  metadata?: any;
  created_at: string;
}

export default function ConnectorDetailPage({ params }: { params: { id: string } }) {
  const [connector, setConnector] = useState<Connector | null>(null);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    // TODO: Intégrer avec getConnector(params.id)
    // Mock data pour démonstration
    setConnector({
      id: params.id,
      name: "Jira Production",
      connector_type: "jira",
      api_url: "https://company.atlassian.net",
      status: "active",
      last_sync: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      metadata: {
        project_keys: ["POW", "INFRA", "DEV"],
        sync_frequency: "15min",
        last_issues_synced: 47
      },
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    });
    setLoading(false);
  }, [params.id]);

  const handleTestConnection = async () => {
    setTesting(true);
    // TODO: Appeler testConnector(params.id)
    setTimeout(() => {
      setTesting(false);
      alert("Connexion réussie ✓");
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Chargement...</div>
      </div>
    );
  }

  if (!connector) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Connecteur introuvable</h2>
          <p className="text-slate-400 mb-6">Ce connecteur n&apos;existe pas ou a été supprimé</p>
          <Link
            href="/cockpit/connecteurs"
            className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux connecteurs
          </Link>
        </div>
      </div>
    );
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active":
        return {
          color: "bg-emerald-500/10 text-emerald-500",
          icon: CheckCircle,
          label: "Actif"
        };
      case "error":
        return {
          color: "bg-red-500/10 text-red-500",
          icon: XCircle,
          label: "Erreur"
        };
      case "inactive":
        return {
          color: "bg-slate-500/10 text-slate-500",
          icon: XCircle,
          label: "Inactif"
        };
      case "testing":
        return {
          color: "bg-blue-500/10 text-blue-500",
          icon: Activity,
          label: "Test"
        };
      default:
        return {
          color: "bg-slate-500/10 text-slate-500",
          icon: Plug,
          label: status
        };
    }
  };

  const getConnectorTypeConfig = (type: string) => {
    const configs: Record<string, { label: string; color: string }> = {
      jira: { label: "Jira", color: "bg-blue-500/10 text-blue-500" },
      slack: { label: "Slack", color: "bg-purple-500/10 text-purple-500" },
      github: { label: "GitHub", color: "bg-slate-500/10 text-slate-300" },
      gitlab: { label: "GitLab", color: "bg-orange-500/10 text-orange-500" },
      azure_devops: { label: "Azure DevOps", color: "bg-blue-600/10 text-blue-400" },
      teams: { label: "Microsoft Teams", color: "bg-indigo-500/10 text-indigo-500" },
      powerbi: { label: "Power BI", color: "bg-yellow-500/10 text-yellow-500" },
      salesforce: { label: "Salesforce", color: "bg-cyan-500/10 text-cyan-500" },
      confluence: { label: "Confluence", color: "bg-blue-500/10 text-blue-500" },
      trello: { label: "Trello", color: "bg-sky-500/10 text-sky-500" }
    };

    return configs[type] || { label: type, color: "bg-slate-500/10 text-slate-500" };
  };

  const statusConfig = getStatusConfig(connector.status);
  const typeConfig = getConnectorTypeConfig(connector.connector_type);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/cockpit/connecteurs"
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-400" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">{connector.name}</h1>
              <p className="text-slate-400 mt-1">ID: {connector.id}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleTestConnection}
              disabled={testing}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-600 text-white rounded-lg transition-colors"
            >
              {testing ? "Test en cours..." : "Tester la connexion"}
            </button>
            <Link
              href={`/cockpit/connecteurs/${connector.id}/edit`}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Modifier
            </Link>
            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
              Supprimer
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Connection Details */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Détails de Connexion</h2>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-slate-400 mb-1">URL API</div>
                  <div className="text-slate-300 font-mono bg-slate-800/50 px-3 py-2 rounded">
                    {connector.api_url || "Non configurée"}
                  </div>
                </div>
                {connector.metadata && (
                  <div>
                    <div className="text-sm text-slate-400 mb-2">Métadonnées</div>
                    <div className="bg-slate-800/50 px-3 py-2 rounded">
                      <pre className="text-sm text-slate-300 overflow-x-auto">
                        {JSON.stringify(connector.metadata, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Statut</h3>
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-full ${statusConfig.color}`}>
                  <StatusIcon className="w-5 h-5" />
                </div>
                <span className="text-lg font-medium text-white">{statusConfig.label}</span>
              </div>
            </div>

            {/* Type Card */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Type</h3>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${typeConfig.color}`}>
                {typeConfig.label}
              </span>
            </div>

            {/* Sync Info */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Synchronisation</h3>
              <div className="space-y-3">
                {connector.last_sync && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <div className="text-sm text-slate-400">Dernière sync</div>
                      <div className="text-slate-300">
                        {new Date(connector.last_sync).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-slate-500 mt-0.5" />
                  <div>
                    <div className="text-sm text-slate-400">Créé le</div>
                    <div className="text-slate-300">
                      {new Date(connector.created_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
