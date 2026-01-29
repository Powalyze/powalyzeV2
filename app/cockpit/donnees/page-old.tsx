"use client";

import { CockpitShell } from "@/components/cockpit/CockpitShell";
import { useState } from "react";
import { Database, BarChart3, Upload, Download, Link as LinkIcon, CheckCircle2, AlertCircle, Brain, Play } from "lucide-react";

type IntegrationType = "powerbi" | "excel" | "jira" | "azure" | "github" | "slack";
type ConnectionStatus = "connected" | "disconnected" | "error";

export default function DonneesPage() {
  const [activeTab, setActiveTab] = useState<"connectors" | "import" | "export" | "api">("connectors");

  return (
    <CockpitShell>
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Données & Intégrations</h1>
          <p className="text-slate-400">Connectez vos outils et synchronisez vos données</p>
        </div>

        {/* AI Insights */}
        <div className="mb-8 p-6 rounded-xl bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-sky-500/10 border border-cyan-500/30">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
              <Brain className="text-cyan-400" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-2">IA Copilote • Modèle de données intelligent</h3>
              <p className="text-slate-300 text-sm mb-3">
                J'ai détecté <strong className="text-cyan-400">3 nouvelles sources de données</strong> disponibles : 
                votre Jira (24 tickets), Azure DevOps (12 repos), et Slack (channel #projets). 
                Je peux les synchroniser automatiquement et <strong className="text-white">enrichir vos rapports PowerBI</strong> 
                avec ces données en temps réel.
              </p>
              <div className="flex flex-wrap gap-2">
                <button className="px-3 py-1.5 text-sm rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-300 hover:text-cyan-200 transition-colors">
                  Synchroniser automatiquement
                </button>
                <button className="px-3 py-1.5 text-sm rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors">
                  Créer dashboards PowerBI
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 p-1 bg-slate-900 rounded-lg border border-slate-800 overflow-x-auto">
          <TabButton
            label="Connecteurs"
            active={activeTab === "connectors"}
            onClick={() => setActiveTab("connectors")}
          />
          <TabButton
            label="Import"
            active={activeTab === "import"}
            onClick={() => setActiveTab("import")}
          />
          <TabButton
            label="Export"
            active={activeTab === "export"}
            onClick={() => setActiveTab("export")}
          />
          <TabButton
            label="API"
            active={activeTab === "api"}
            onClick={() => setActiveTab("api")}
          />
        </div>

        {/* Content */}
        {activeTab === "connectors" && <ConnectorsTab />}
        {activeTab === "import" && <ImportTab />}
        {activeTab === "export" && <ExportTab />}
        {activeTab === "api" && <APITab />}
      </div>
    </CockpitShell>
  );
}

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap ${
        active
          ? "bg-amber-500 text-slate-950"
          : "text-slate-400 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}

function ConnectorsTab() {
  const connectors: Array<{
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    status: ConnectionStatus;
    lastSync: string;
  }> = [
    {
      id: "powerbi",
      name: "Power BI",
      description: "Dashboards interactifs et rapports visuels",
      icon: <BarChart3 size={32} className="text-amber-400" />,
      status: "connected",
      lastSync: "Il y a 5 minutes"
    },
    {
      id: "excel",
      name: "Microsoft Excel",
      description: "Import/Export de fichiers Excel",
      icon: <Database size={32} className="text-green-400" />,
      status: "connected",
      lastSync: "Il y a 2 heures"
    },
    {
      id: "jira",
      name: "Jira",
      description: "Synchronisation des tickets et sprints",
      icon: <LinkIcon size={32} className="text-blue-400" />,
      status: "disconnected",
      lastSync: "Jamais"
    },
    {
      id: "azure",
      name: "Azure DevOps",
      description: "Repos, pipelines, work items",
      icon: <Database size={32} className="text-sky-400" />,
      status: "disconnected",
      lastSync: "Jamais"
    },
    {
      id: "github",
      name: "GitHub",
      description: "Repos, issues, pull requests",
      icon: <Database size={32} className="text-slate-400" />,
      status: "disconnected",
      lastSync: "Jamais"
    },
    {
      id: "slack",
      name: "Slack",
      description: "Notifications et alertes temps réel",
      icon: <LinkIcon size={32} className="text-purple-400" />,
      status: "disconnected",
      lastSync: "Jamais"
    }
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {connectors.map((connector) => (
        <ConnectorCard key={connector.id} connector={connector} />
      ))}
    </div>
  );
}

function ConnectorCard({ connector }: { 
  connector: {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    status: ConnectionStatus;
    lastSync: string;
  }
}) {
  const statusConfig: Record<ConnectionStatus, { label: string; color: string; icon: any }> = {
    connected: { label: "Connecté", color: "bg-green-500/10 text-green-400 border-green-500/30", icon: CheckCircle2 },
    disconnected: { label: "Non connecté", color: "bg-slate-500/10 text-slate-400 border-slate-500/30", icon: AlertCircle },
    error: { label: "Erreur", color: "bg-red-500/10 text-red-400 border-red-500/30", icon: AlertCircle }
  };

  const status = statusConfig[connector.status];
  const StatusIcon = status.icon;

  return (
    <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-slate-800 flex items-center justify-center">
            {connector.icon}
          </div>
          <div>
            <h3 className="text-xl font-bold mb-1">{connector.name}</h3>
            <p className="text-sm text-slate-400">{connector.description}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${status.color}`}>
          <StatusIcon size={14} />
          <span className="text-xs font-semibold">{status.label}</span>
        </div>
        <span className="text-xs text-slate-500">Dernière sync : {connector.lastSync}</span>
      </div>

      {connector.status === "connected" ? (
        <div className="flex gap-2">
          <button className="flex-1 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white font-semibold transition-colors">
            Configurer
          </button>
          <button className="flex-1 px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 hover:text-red-300 font-semibold transition-colors">
            Déconnecter
          </button>
        </div>
      ) : (
        <button className="w-full px-4 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-400 hover:text-amber-300 font-semibold transition-colors">
          Connecter
        </button>
      )}
    </div>
  );
}

function ImportTab() {
  return (
    <div className="space-y-6">
      <div className="p-8 rounded-xl bg-slate-900 border-2 border-dashed border-slate-700 hover:border-amber-500/50 transition-colors text-center cursor-pointer">
        <Upload size={48} className="mx-auto mb-4 text-slate-400" />
        <h3 className="text-xl font-bold mb-2">Importer des données</h3>
        <p className="text-slate-400 mb-4">
          Glissez-déposez vos fichiers ou cliquez pour sélectionner
        </p>
        <div className="flex flex-wrap justify-center gap-2 text-sm text-slate-500">
          <span>Excel (.xlsx, .xls)</span>
          <span>•</span>
          <span>CSV (.csv)</span>
          <span>•</span>
          <span>JSON (.json)</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <ImportOption
          title="Import Excel"
          description="Importer projets, risques, décisions depuis Excel"
          icon={<Database size={24} className="text-green-400" />}
        />
        <ImportOption
          title="Import CSV"
          description="Format universel pour import en masse"
          icon={<Database size={24} className="text-blue-400" />}
        />
        <ImportOption
          title="Import JSON"
          description="Format structuré pour données complexes"
          icon={<Database size={24} className="text-purple-400" />}
        />
        <ImportOption
          title="Import depuis API"
          description="Connecter une source externe via REST API"
          icon={<LinkIcon size={24} className="text-cyan-400" />}
        />
      </div>

      <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/30">
        <div className="flex items-start gap-4">
          <Brain size={24} className="text-blue-400 flex-shrink-0" />
          <div>
            <h4 className="font-bold mb-2">L'IA peut mapper automatiquement vos données</h4>
            <p className="text-sm text-slate-300">
              Uploadez votre fichier, et je détecterai automatiquement les colonnes (titre, statut, budget, etc.) 
              pour créer vos projets sans configuration manuelle.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ImportOption({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) {
  return (
    <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer">
      <div className="flex items-center gap-4 mb-3">
        <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-lg font-bold">{title}</h3>
      </div>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  );
}

function ExportTab() {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <ExportOption
          title="Export Excel"
          description="Télécharger tout le portefeuille en .xlsx"
          icon={<Download size={24} className="text-green-400" />}
          format="xlsx"
        />
        <ExportOption
          title="Export CSV"
          description="Format universel pour analyse externe"
          icon={<Download size={24} className="text-blue-400" />}
          format="csv"
        />
        <ExportOption
          title="Export PDF"
          description="Rapports PDF prêts à imprimer"
          icon={<Download size={24} className="text-red-400" />}
          format="pdf"
        />
        <ExportOption
          title="Export PowerBI"
          description="Connecter directement à PowerBI Desktop"
          icon={<BarChart3 size={24} className="text-amber-400" />}
          format="powerbi"
        />
      </div>

      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
        <h3 className="text-xl font-bold mb-4">Exports programmés</h3>
        <p className="text-slate-400 mb-4">Planifiez des exports automatiques par email ou vers un stockage cloud</p>
        <button className="px-6 py-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-400 hover:text-amber-300 font-semibold transition-colors">
          Créer un export programmé
        </button>
      </div>
    </div>
  );
}

function ExportOption({ title, description, icon, format }: { title: string; description: string; icon: React.ReactNode; format: string }) {
  return (
    <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all">
      <div className="flex items-center gap-4 mb-3">
        <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-lg font-bold">{title}</h3>
      </div>
      <p className="text-sm text-slate-400 mb-4">{description}</p>
      <button className="w-full px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white font-semibold transition-colors flex items-center justify-center gap-2">
        <Download size={18} />
        <span>Exporter maintenant</span>
      </button>
    </div>
  );
}

function APITab() {
  return (
    <div className="space-y-6">
      <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/30">
        <h3 className="text-xl font-bold mb-2">API REST Powalyze</h3>
        <p className="text-slate-400 mb-4">
          Accédez à vos données via notre API REST complète. Authentification JWT, rate limiting, webhooks.
        </p>
        <div className="flex gap-4">
          <button className="px-6 py-3 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 text-purple-400 hover:text-purple-300 font-semibold transition-colors">
            Documentation API
          </button>
          <button className="px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white font-semibold transition-colors">
            Générer clé API
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <APIEndpoint
          method="GET"
          path="/api/projects"
          description="Liste tous les projets"
        />
        <APIEndpoint
          method="POST"
          path="/api/projects"
          description="Créer un nouveau projet"
        />
        <APIEndpoint
          method="GET"
          path="/api/risks"
          description="Liste tous les risques"
        />
        <APIEndpoint
          method="GET"
          path="/api/decisions"
          description="Liste toutes les décisions"
        />
      </div>

      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
        <h3 className="text-xl font-bold mb-4">Webhooks</h3>
        <p className="text-slate-400 mb-4">
          Recevez des notifications temps réel quand des événements se produisent (nouveau risque, décision validée, etc.)
        </p>
        <button className="px-6 py-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-400 hover:text-amber-300 font-semibold transition-colors">
          Configurer un webhook
        </button>
      </div>
    </div>
  );
}

function APIEndpoint({ method, path, description }: { method: string; path: string; description: string }) {
  const methodColors = {
    GET: "bg-blue-500/20 text-blue-400 border-blue-500/50",
    POST: "bg-green-500/20 text-green-400 border-green-500/50",
    PUT: "bg-amber-500/20 text-amber-400 border-amber-500/50",
    DELETE: "bg-red-500/20 text-red-400 border-red-500/50"
  };

  return (
    <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all">
      <div className="flex items-center gap-3 mb-3">
        <span className={`px-3 py-1 rounded font-mono text-xs font-bold border ${methodColors[method as keyof typeof methodColors]}`}>
          {method}
        </span>
        <code className="text-sm text-slate-300">{path}</code>
      </div>
      <p className="text-sm text-slate-400 mb-3">{description}</p>
      <button className="flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 font-semibold transition-colors">
        <Play size={14} />
        <span>Tester dans Playground</span>
      </button>
    </div>
  );
}
