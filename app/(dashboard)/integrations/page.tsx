"use client";

import React from "react";
import { Link2, CheckCircle, AlertCircle, Settings, ExternalLink } from "lucide-react";
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
}

const integrations: Integration[] = [
  {
    id: "1",
    name: "Microsoft Teams",
    description: "Collaboration et communication d'équipe en temps réel",
    category: "Communication",
    logo: "🎯",
    status: "connected",
    lastSync: "2026-02-14T10:30:00",
    features: ["Notifications", "Conversations", "Réunions"],
  },
  {
    id: "2",
    name: "SharePoint Online",
    description: "Gestion documentaire et collaboration",
    category: "Documents",
    logo: "📁",
    status: "connected",
    lastSync: "2026-02-14T09:15:00",
    features: ["Stockage", "Partage", "Workflows"],
  },
  {
    id: "3",
    name: "Jira Software",
    description: "Suivi des tâches et gestion de projet agile",
    category: "Gestion de Projet",
    logo: "🔷",
    status: "connected",
    lastSync: "2026-02-14T11:00:00",
    features: ["Issues", "Sprints", "Backlog"],
  },
  {
    id: "4",
    name: "SAP S/4HANA",
    description: "ERP et gestion financière",
    category: "Finance",
    logo: "💼",
    status: "connected",
    lastSync: "2026-02-14T08:45:00",
    features: ["Budgets", "Achats", "Comptabilité"],
  },
  {
    id: "5",
    name: "Azure DevOps",
    description: "CI/CD et gestion du code source",
    category: "DevOps",
    logo: "⚙️",
    status: "connected",
    lastSync: "2026-02-14T11:20:00",
    features: ["Repos", "Pipelines", "Boards"],
  },
  {
    id: "6",
    name: "Power BI Service",
    description: "Business intelligence et rapports analytiques",
    category: "Analytics",
    logo: "📊",
    status: "connected",
    lastSync: "2026-02-14T10:00:00",
    features: ["Dashboards", "Reports", "Datasets"],
  },
  {
    id: "7",
    name: "Slack",
    description: "Messagerie d'équipe et intégrations",
    category: "Communication",
    logo: "💬",
    status: "disconnected",
    features: ["Channels", "Messages", "Apps"],
  },
  {
    id: "8",
    name: "GitHub",
    description: "Gestion de code et collaboration développeurs",
    category: "DevOps",
    logo: "🐙",
    status: "error",
    lastSync: "2026-02-13T15:30:00",
    features: ["Repos", "Pull Requests", "Actions"],
  },
  {
    id: "9",
    name: "Salesforce",
    description: "CRM et gestion de la relation client",
    category: "CRM",
    logo: "☁️",
    status: "disconnected",
    features: ["Contacts", "Opportunités", "Rapports"],
  },
];

export default function IntegrationsPage() {
  const stats = {
    total: integrations.length,
    connected: integrations.filter(i => i.status === "connected").length,
    disconnected: integrations.filter(i => i.status === "disconnected").length,
    errors: integrations.filter(i => i.status === "error").length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Intégrations</h1>
        <p className="text-slate-400">Connectez vos outils et services favoris</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">{stats.total}</div>
                <div className="text-sm text-slate-400">Intégrations</div>
              </div>
              <div className="p-3 bg-sky-500/10 rounded-lg">
                <Link2 className="text-sky-400" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-emerald-400">{stats.connected}</div>
                <div className="text-sm text-slate-400">Connectées</div>
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
                <div className="text-sm text-slate-400">Déconnectées</div>
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
                <div className="text-2xl font-bold text-red-400">{stats.errors}</div>
                <div className="text-sm text-slate-400">Erreurs</div>
              </div>
              <div className="p-3 bg-red-500/10 rounded-lg">
                <AlertCircle className="text-red-400" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {integrations.map((integration) => (
          <IntegrationCard key={integration.id} integration={integration} />
        ))}
      </div>
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
