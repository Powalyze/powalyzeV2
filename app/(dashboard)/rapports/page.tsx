"use client";

import React, { useState } from "react";
import { FileText, Download, Calendar, BarChart3, Eye, MoreVertical, Plus, Filter } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface Report {
  id: string;
  title: string;
  type: "powerbi" | "excel" | "pdf";
  category: string;
  lastUpdated: string;
  views: number;
  status: "ready" | "generating" | "scheduled";
  schedule?: string;
}

const reports: Report[] = [
  {
    id: "1",
    title: "Dashboard Exécutif - Portfolio Global",
    type: "powerbi",
    category: "Portfolio",
    lastUpdated: "2026-02-14",
    views: 342,
    status: "ready",
  },
  {
    id: "2",
    title: "Analyse Budgétaire Q1 2026",
    type: "powerbi",
    category: "Finance",
    lastUpdated: "2026-02-13",
    views: 189,
    status: "ready",
    schedule: "Hebdomadaire",
  },
  {
    id: "3",
    title: "Performance Équipes - Vélocité",
    type: "powerbi",
    category: "Ressources",
    lastUpdated: "2026-02-14",
    views: 267,
    status: "ready",
  },
  {
    id: "4",
    title: "Cartographie des Risques",
    type: "excel",
    category: "Risques",
    lastUpdated: "2026-02-12",
    views: 124,
    status: "ready",
    schedule: "Quotidien",
  },
  {
    id: "5",
    title: "Rapport Mensuel Comité Direction",
    type: "pdf",
    category: "Direction",
    lastUpdated: "2026-02-01",
    views: 87,
    status: "generating",
    schedule: "Mensuel",
  },
  {
    id: "6",
    title: "Tableau de Bord Projets Stratégiques",
    type: "powerbi",
    category: "Portfolio",
    lastUpdated: "2026-02-14",
    views: 421,
    status: "ready",
  },
];

export default function ReportsPage() {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filteredReports = reports.filter(
    report => categoryFilter === "all" || report.category === categoryFilter
  );

  const categories = ["Portfolio", "Finance", "Ressources", "Risques", "Direction"];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Rapports</h1>
          <p className="text-slate-400">Tableaux de bord Power BI et rapports analytiques</p>
        </div>
        <Button variant="primary" size="lg">
          <Plus size={20} />
          Nouveau rapport
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">{reports.length}</div>
                <div className="text-sm text-slate-400">Rapports actifs</div>
              </div>
              <div className="p-3 bg-sky-500/10 rounded-lg">
                <FileText className="text-sky-400" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-emerald-400">4</div>
                <div className="text-sm text-slate-400">Power BI</div>
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-lg">
                <BarChart3 className="text-emerald-400" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-amber-400">1.4K</div>
                <div className="text-sm text-slate-400">Vues totales</div>
              </div>
              <div className="p-3 bg-amber-500/10 rounded-lg">
                <Eye className="text-amber-400" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-violet-400">3</div>
                <div className="text-sm text-slate-400">Planifiés</div>
              </div>
              <div className="p-3 bg-violet-500/10 rounded-lg">
                <Calendar className="text-violet-400" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm text-slate-400">Catégorie:</span>
            <button
              onClick={() => setCategoryFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                categoryFilter === "all"
                  ? "bg-amber-500 text-slate-950"
                  : "bg-slate-800/50 text-slate-400 hover:bg-slate-800"
              }`}
            >
              Tous
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  categoryFilter === cat
                    ? "bg-amber-500 text-slate-950"
                    : "bg-slate-800/50 text-slate-400 hover:bg-slate-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredReports.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>
    </div>
  );
}

function ReportCard({ report }: { report: Report }) {
  const typeIcons = {
    powerbi: <BarChart3 size={32} className="text-amber-400" />,
    excel: <FileText size={32} className="text-emerald-400" />,
    pdf: <FileText size={32} className="text-red-400" />,
  };

  const typeColors = {
    powerbi: "bg-amber-500/10 border-amber-500/30",
    excel: "bg-emerald-500/10 border-emerald-500/30",
    pdf: "bg-red-500/10 border-red-500/30",
  };

  return (
    <Card>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl border ${typeColors[report.type]}`}>
            {typeIcons[report.type]}
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={report.status} />
            <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
              <MoreVertical size={18} className="text-slate-400" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white mb-2 leading-tight">
          {report.title}
        </h3>

        {/* Category */}
        <div className="mb-4">
          <span className="px-2 py-1 bg-slate-800/50 rounded text-xs text-slate-300">
            {report.category}
          </span>
        </div>

        {/* Meta */}
        <div className="space-y-2 text-sm text-slate-400 mb-4">
          <div className="flex items-center gap-2">
            <Calendar size={14} />
            Mis à jour: {new Date(report.lastUpdated).toLocaleDateString('fr-FR')}
          </div>
          <div className="flex items-center gap-2">
            <Eye size={14} />
            {report.views} vues
          </div>
          {report.schedule && (
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              Planning: {report.schedule}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-slate-800">
          <Button variant="outline" size="sm" className="flex-1">
            <Eye size={16} />
            Voir
          </Button>
          <Button variant="ghost" size="sm">
            <Download size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: Report["status"] }) {
  const config = {
    ready: { label: "Prêt", variant: "success" as const },
    generating: { label: "En génération", variant: "warning" as const },
    scheduled: { label: "Planifié", variant: "info" as const },
  };

  const { label, variant } = config[status];
  return <Badge variant={variant}>{label}</Badge>;
}
