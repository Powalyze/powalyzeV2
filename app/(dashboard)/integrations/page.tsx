"use client";

import React, { useState } from "react";
import { Link2, CheckCircle, AlertCircle, Settings, ExternalLink, Search, Plus, Package, Zap, Globe } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  logo: string;
  status: "connected" | "disconnected" | "error";
  lastSync?: string;
  features: string[];
  popular?: boolean;
}

const integrations: Integration[] = [
  // Project Management
  { id: "1", name: "Jira", category: "Gestion de projet", description: "Synchronisation des tickets et sprints", logo: "🎯", status: "connected", lastSync: "2026-02-14T11:00:00", features: ["Issues", "Sprints", "Backlog"], popular: true },
  { id: "2", name: "Monday.com", category: "Gestion de projet", description: "Import des boards et workflows", logo: "📋", status: "disconnected", features: ["Boards", "Workflows", "Automation"], popular: true },
  { id: "3", name: "Asana", category: "Gestion de projet", description: "Synchronisation des tâches et projets", logo: "✅", status: "disconnected", features: ["Tasks", "Projects", "Portfolios"], popular: true },
  { id: "4", name: "ClickUp", category: "Gestion de projet", description: "Intégration des tasks et docs", logo: "🖱️", status: "disconnected", features: ["Tasks", "Docs", "Goals"], popular: false },
  { id: "5", name: "Trello", category: "Gestion de projet", description: "Import des boards Kanban", logo: "📇", status: "disconnected", features: ["Boards", "Cards", "Power-ups"], popular: true },
  { id: "6", name: "Wrike", category: "Gestion de projet", description: "Synchronisation des projets", logo: "⚡", status: "disconnected", features: ["Projects", "Tasks", "Reports"], popular: false },
  { id: "7", name: "Smartsheet", category: "Gestion de projet", description: "Import feuilles et projets", logo: "📊", status: "disconnected", features: ["Sheets", "Projects", "Dashboards"], popular: false },
  { id: "8", name: "Notion", category: "Gestion de projet", description: "Sync databases et pages", logo: "📝", status: "disconnected", features: ["Databases", "Pages", "Wiki"], popular: true },
  
  // Development
  { id: "9", name: "GitHub", category: "Développement", description: "Repos, issues, PRs, commits", logo: "🐙", status: "connected", lastSync: "2026-02-14T10:30:00", features: ["Repos", "Pull Requests", "Actions"], popular: true },
  { id: "10", name: "GitLab", category: "Développement", description: "Projets, pipelines, issues", logo: "🦊", status: "disconnected", features: ["Repos", "CI/CD", "Issues"], popular: true },
  { id: "11", name: "Bitbucket", category: "Développement", description: "Repos et pull requests", logo: "🪣", status: "disconnected", features: ["Repos", "PRs", "Pipelines"], popular: false },
  { id: "12", name: "Azure DevOps", category: "Développement", description: "Boards, repos, pipelines", logo: "🔷", status: "connected", lastSync: "2026-02-14T11:20:00", features: ["Repos", "Pipelines", "Boards"], popular: true },
  { id: "13", name: "Jenkins", category: "Développement", description: "CI/CD pipelines", logo: "🏗️", status: "disconnected", features: ["Builds", "Pipelines", "Plugins"], popular: false },
  
  // Communication
  { id: "14", name: "Slack", category: "Communication", description: "Notifications et channels", logo: "💬", status: "disconnected", features: ["Channels", "Messages", "Apps"], popular: true },
  { id: "15", name: "Microsoft Teams", category: "Communication", description: "Messages et notifications", logo: "👥", status: "connected", lastSync: "2026-02-14T10:30:00", features: ["Notifications", "Conversations", "Réunions"], popular: true },
  { id: "16", name: "Discord", category: "Communication", description: "Serveurs et webhooks", logo: "🎮", status: "disconnected", features: ["Servers", "Webhooks", "Bots"], popular: false },
  { id: "17", name: "Zoom", category: "Communication", description: "Réunions et webinaires", logo: "📹", status: "disconnected", features: ["Meetings", "Webinars", "Recordings"], popular: true },
  { id: "18", name: "Google Meet", category: "Communication", description: "Visioconférences", logo: "📞", status: "disconnected", features: ["Meetings", "Chat", "Recording"], popular: false },
  
  // CRM & Sales
  { id: "19", name: "Salesforce", category: "CRM & Ventes", description: "Accounts, deals, opportunities", logo: "☁️", status: "disconnected", features: ["Contacts", "Opportunités", "Rapports"], popular: true },
  { id: "20", name: "HubSpot", category: "CRM & Ventes", description: "Contacts et pipeline", logo: "🧲", status: "disconnected", features: ["Contacts", "Deals", "Pipeline"], popular: true },
  { id: "21", name: "Pipedrive", category: "CRM & Ventes", description: "Deals et contacts", logo: "📈", status: "disconnected", features: ["Deals", "Contacts", "Pipeline"], popular: false },
  { id: "22", name: "Zoho CRM", category: "CRM & Ventes", description: "Leads et opportunités", logo: "🎯", status: "disconnected", features: ["Leads", "Deals", "Reports"], popular: false },
  { id: "23", name: "Microsoft Dynamics", category: "CRM & Ventes", description: "ERP et CRM intégré", logo: "💼", status: "disconnected", features: ["CRM", "Sales", "Service"], popular: true },
  
  // ERP & Finance
  { id: "24", name: "SAP S/4HANA", category: "ERP & Finance", description: "Modules ERP complets", logo: "🏢", status: "connected", lastSync: "2026-02-14T08:45:00", features: ["Budgets", "Achats", "Comptabilité"], popular: true },
  { id: "25", name: "Oracle ERP", category: "ERP & Finance", description: "Financials et supply chain", logo: "🔴", status: "disconnected", features: ["Financials", "SCM", "HCM"], popular: true },
  { id: "26", name: "NetSuite", category: "ERP & Finance", description: "Cloud ERP financials", logo: "💰", status: "disconnected", features: ["Financials", "CRM", "E-commerce"], popular: false },
  { id: "27", name: "QuickBooks", category: "ERP & Finance", description: "Comptabilité PME", logo: "📚", status: "disconnected", features: ["Accounting", "Invoicing", "Expenses"], popular: true },
  { id: "28", name: "Xero", category: "ERP & Finance", description: "Compta cloud", logo: "💵", status: "disconnected", features: ["Accounting", "Payroll", "Invoicing"], popular: false },
  { id: "29", name: "Sage", category: "ERP & Finance", description: "Gestion financière", logo: "🌿", status: "disconnected", features: ["Accounting", "Finance", "HR"], popular: false },
  
  // Data & BI
  { id: "30", name: "Power BI Service", category: "Data & BI", description: "Dashboards et rapports", logo: "📊", status: "connected", lastSync: "2026-02-14T10:00:00", features: ["Dashboards", "Reports", "Datasets"], popular: true },
  { id: "31", name: "Tableau", category: "Data & BI", description: "Visualisations données", logo: "📈", status: "disconnected", features: ["Viz", "Dashboards", "Analytics"], popular: true },
  { id: "32", name: "Looker", category: "Data & BI", description: "Analytics et dashboards", logo: "🔍", status: "disconnected", features: ["Analytics", "Dashboards", "Queries"], popular: false },
  { id: "33", name: "Qlik", category: "Data & BI", description: "BI et analytics", logo: "📉", status: "disconnected", features: ["BI", "Analytics", "Data"], popular: false },
  { id: "34", name: "Metabase", category: "Data & BI", description: "Open source BI", logo: "📊", status: "disconnected", features: ["Dashboards", "Queries", "Reports"], popular: false },
  
  // Cloud & Infrastructure
  { id: "35", name: "AWS", category: "Cloud & Infra", description: "Services cloud Amazon", logo: "☁️", status: "disconnected", features: ["EC2", "S3", "Lambda"], popular: true },
  { id: "36", name: "Azure", category: "Cloud & Infra", description: "Cloud Microsoft", logo: "🔷", status: "disconnected", features: ["VMs", "Storage", "Functions"], popular: true },
  { id: "37", name: "Google Cloud", category: "Cloud & Infra", description: "GCP services", logo: "☁️", status: "disconnected", features: ["Compute", "Storage", "BigQuery"], popular: true },
  { id: "38", name: "Kubernetes", category: "Cloud & Infra", description: "Orchestration containers", logo: "⚓", status: "disconnected", features: ["Pods", "Services", "Deployments"], popular: true },
  { id: "39", name: "Docker", category: "Cloud & Infra", description: "Containers management", logo: "🐋", status: "disconnected", features: ["Containers", "Images", "Registry"], popular: true },
  
  // Database
  { id: "40", name: "PostgreSQL", category: "Bases de données", description: "Base SQL open source", logo: "🐘", status: "disconnected", features: ["SQL", "Replication", "Backups"], popular: true },
  { id: "41", name: "MySQL", category: "Bases de données", description: "Base SQL populaire", logo: "🐬", status: "disconnected", features: ["SQL", "Replication", "Clustering"], popular: true },
  { id: "42", name: "MongoDB", category: "Bases de données", description: "NoSQL document DB", logo: "🍃", status: "disconnected", features: ["Documents", "Indexes", "Aggregation"], popular: true },
  { id: "43", name: "Supabase", category: "Bases de données", description: "PostgreSQL cloud", logo: "⚡", status: "disconnected", features: ["Database", "Auth", "Storage"], popular: true },
  { id: "44", name: "Firebase", category: "Bases de données", description: "Real-time database", logo: "🔥", status: "disconnected", features: ["Realtime", "Auth", "Storage"], popular: true },
  { id: "45", name: "Redis", category: "Bases de données", description: "Cache et data store", logo: "🔴", status: "disconnected", features: ["Cache", "Pub/Sub", "Streams"], popular: false },
  
  // HR & Recruitment
  { id: "46", name: "Workday", category: "RH & Recrutement", description: "SIRH complet", logo: "👔", status: "disconnected", features: ["HCM", "Payroll", "Talent"], popular: true },
  { id: "47", name: "BambooHR", category: "RH & Recrutement", description: "Gestion RH PME", logo: "🎋", status: "disconnected", features: ["HR", "Time Off", "Reports"], popular: false },
  { id: "48", name: "Greenhouse", category: "RH & Recrutement", description: "ATS recrutement", logo: "🏠", status: "disconnected", features: ["ATS", "Interviews", "Hiring"], popular: false },
  { id: "49", name: "Lever", category: "RH & Recrutement", description: "Recruitment platform", logo: "⚖️", status: "disconnected", features: ["ATS", "CRM", "Analytics"], popular: false },
  
  // Marketing
  { id: "50", name: "Mailchimp", category: "Marketing", description: "Email marketing", logo: "📧", status: "disconnected", features: ["Campaigns", "Lists", "Automation"], popular: true },
  { id: "51", name: "Google Analytics", category: "Marketing", description: "Web analytics", logo: "📊", status: "disconnected", features: ["Traffic", "Events", "Reports"], popular: true },
  { id: "52", name: "Segment", category: "Marketing", description: "Customer data platform", logo: "🎯", status: "disconnected", features: ["Events", "Sources", "Destinations"], popular: false },
  
  // Documents
  { id: "53", name: "Google Drive", category: "Documents", description: "Stockage et docs", logo: "📁", status: "disconnected", features: ["Storage", "Docs", "Sheets"], popular: true },
  { id: "54", name: "Dropbox", category: "Documents", description: "File storage", logo: "📦", status: "disconnected", features: ["Storage", "Sync", "Sharing"], popular: true },
  { id: "55", name: "SharePoint Online", category: "Documents", description: "Microsoft cloud storage", logo: "☁️", status: "connected", lastSync: "2026-02-14T09:15:00", features: ["Stockage", "Partage", "Workflows"], popular: true },
  { id: "56", name: "Box", category: "Documents", description: "Enterprise content", logo: "📦", status: "disconnected", features: ["Storage", "Collaboration", "Security"], popular: false },
  { id: "57", name: "Confluence", category: "Documents", description: "Wiki et documentation", logo: "📖", status: "disconnected", features: ["Wiki", "Pages", "Spaces"], popular: true },
  
  // Automation
  { id: "58", name: "Zapier", category: "Automatisation", description: "Automation workflows", logo: "⚡", status: "disconnected", features: ["Zaps", "Triggers", "Actions"], popular: true },
  { id: "59", name: "Make (Integromat)", category: "Automatisation", description: "Visual automation", logo: "🔄", status: "disconnected", features: ["Scenarios", "Modules", "Webhooks"], popular: false },
  { id: "60", name: "n8n", category: "Automatisation", description: "Open source automation", logo: "🔗", status: "disconnected", features: ["Workflows", "Nodes", "Self-hosted"], popular: false }
];

export default function IntegrationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = [
    'all',
    'Gestion de projet',
    'Développement',
    'Communication',
    'CRM & Ventes',
    'ERP & Finance',
    'Data & BI',
    'Cloud & Infra',
    'Bases de données',
    'RH & Recrutement',
    'Marketing',
    'Documents',
    'Automatisation'
  ];

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || integration.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const stats = {
    total: integrations.length,
    connected: integrations.filter(i => i.status === "connected").length,
    disconnected: integrations.filter(i => i.status === "disconnected").length,
    errors: integrations.filter(i => i.status === "error").length,
  };

  const popularConnectors = integrations.filter(c => c.popular && c.status !== "connected").slice(0, 6);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Intégrations</h1>
        <p className="text-slate-400">Connectez Powalyze à votre écosystème d'outils — {integrations.length} connecteurs disponibles</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">{stats.total}</div>
                <div className="text-sm text-slate-400">Connecteurs</div>
              </div>
              <div className="p-3 bg-sky-500/10 rounded-lg">
                <Package className="text-sky-400" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-emerald-400">{stats.connected}</div>
                <div className="text-sm text-slate-400">Connectés</div>
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-lg">
                <CheckCircle className="text-emerald-400" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-slate-400">{stats.disconnected}</div>
                <div className="text-sm text-slate-400">Disponibles</div>
              </div>
              <div className="p-3 bg-slate-800/50 rounded-lg">
                <Link2 className="text-slate-400" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-amber-400">{categories.length - 1}</div>
                <div className="text-sm text-slate-400">Catégories</div>
              </div>
              <div className="p-3 bg-amber-500/10 rounded-lg">
                <Zap className="text-amber-400" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Popular Connectors */}
      {popularConnectors.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-white">🔥 Les plus populaires</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
              {popularConnectors.map((connector) => (
                <button
                  key={connector.id}
                  className="bg-slate-800/50 border border-slate-700 hover:border-blue-500/50 p-4 rounded-lg transition-all group text-center"
                >
                  <div className="text-3xl mb-2">{connector.logo}</div>
                  <h3 className="text-white font-semibold text-sm">{connector.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{connector.category}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher un connecteur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              aria-label="Filtrer par catégorie"
              className="px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none min-w-[250px]"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'Toutes les catégories' : cat}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredIntegrations.map((integration) => (
          <IntegrationCard key={integration.id} integration={integration} />
        ))}
      </div>

      {filteredIntegrations.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-slate-400 text-lg mb-4">Aucun connecteur trouvé</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setFilterCategory('all');
              }}
            >
              Réinitialiser les filtres
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function IntegrationCard({ integration }: { integration: Integration }) {
  return (
    <Card>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{integration.logo}</div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">{integration.name}</h3>
              <span className="px-2 py-1 bg-slate-800/50 rounded text-xs text-slate-300">
                {integration.category}
              </span>
            </div>
          </div>
          <StatusBadge status={integration.status} />
        </div>

        {/* Description */}
        <p className="text-sm text-slate-400 mb-4 leading-relaxed">
          {integration.description}
        </p>

        {/* Features */}
        <div className="mb-4">
          <div className="text-xs text-slate-500 mb-2">Fonctionnalités</div>
          <div className="flex flex-wrap gap-1">
            {integration.features.map((feature, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-slate-800/30 rounded text-xs text-slate-400"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Last Sync */}
        {integration.lastSync && (
          <div className="text-xs text-slate-500 mb-4">
            Dernière synchro: {new Date(integration.lastSync).toLocaleString('fr-FR')}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-slate-800">
          {integration.status === "connected" ? (
            <>
              <Button variant="outline" size="sm" className="flex-1">
                <Settings size={16} />
                Configurer
              </Button>
              <Button variant="ghost" size="sm">
                <ExternalLink size={16} />
              </Button>
            </>
          ) : (
            <Button variant="primary" size="sm" className="flex-1">
              Connecter
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: Integration["status"] }) {
  const config = {
    connected: { label: "Connecté", variant: "success" as const },
    disconnected: { label: "Déconnecté", variant: "neutral" as const },
    error: { label: "Erreur", variant: "danger" as const },
  };

  const { label, variant } = config[status];
  return <Badge variant={variant}>{label}</Badge>;
}

