"use client";

import { CockpitShell } from "@/components/cockpit/CockpitShell";
import { useState } from "react";
import { getDemoData } from "@/lib/cockpitData";
import {
  Maximize2,
  RefreshCw,
  Download,
  Share2,
  Settings,
  BarChart3,
  PieChart,
  TrendingUp,
  Calendar,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface PowerBIReport {
  id: string;
  name: string;
  embedUrl: string;
  type: "report" | "dashboard" | "tile";
  icon: any;
}

export default function PowerBIPage() {
  const [selectedReport, setSelectedReport] = useState<PowerBIReport | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const demoData = getDemoData();

  // Prepare data for visualizations
  const budgetData = demoData.projects.map(p => ({
    name: p.name.substring(0, 20) + '...',
    budget: parseFloat(p.budget.replace(/[^\d.]/g, '')),
    progress: p.progress,
  }));

  const statusData = [
    { name: 'Nominal', value: demoData.projects.filter(p => p.status === 'green').length, color: '#10b981' },
    { name: 'Vigilance', value: demoData.projects.filter(p => p.status === 'orange').length, color: '#f59e0b' },
    { name: 'Critique', value: demoData.projects.filter(p => p.status === 'red').length, color: '#ef4444' },
  ];

  const timelineData = [
    { month: 'Jan', completed: 8, planned: 10 },
    { month: 'Fév', completed: 12, planned: 12 },
    { month: 'Mar', completed: 15, planned: 14 },
    { month: 'Avr', completed: 18, planned: 16 },
    { month: 'Mai', completed: 22, planned: 20 },
    { month: 'Jun', completed: 25, planned: 24 },
  ];

  const renderVisualization = () => {
    if (!selectedReport) return null;

    switch (selectedReport.id) {
      case 'portfolio-overview':
        return (
          <div className="space-y-6 h-full overflow-y-auto p-6">
            {/* KPIs */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-slate-800 rounded-lg p-4">
                <div className="text-slate-400 text-sm">Projets Actifs</div>
                <div className="text-3xl font-bold text-white mt-2">{demoData.projects.length}</div>
                <div className="text-green-400 text-xs mt-1">+2 ce mois</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-4">
                <div className="text-slate-400 text-sm">Budget Total</div>
                <div className="text-3xl font-bold text-white mt-2">
                  {budgetData.reduce((sum, p) => sum + p.budget, 0).toFixed(1)}M€
                </div>
                <div className="text-amber-400 text-xs mt-1">85% consommé</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-4">
                <div className="text-slate-400 text-sm">Risques Critiques</div>
                <div className="text-3xl font-bold text-white mt-2">{demoData.metrics.criticalRisks}</div>
                <div className="text-red-400 text-xs mt-1">Nécessite action</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-4">
                <div className="text-slate-400 text-sm">Décisions en attente</div>
                <div className="text-3xl font-bold text-white mt-2">{demoData.metrics.pendingDecisions}</div>
                <div className="text-orange-400 text-xs mt-1">COMEX requis</div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-slate-800 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-4">Distribution des Statuts</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RePieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RePieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-slate-800 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-4">Progression des Projets</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                    <Legend />
                    <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} name="Complétés" />
                    <Line type="monotone" dataKey="planned" stroke="#3b82f6" strokeWidth={2} name="Planifiés" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );

      case 'budget-analysis':
        return (
          <div className="h-full p-6">
            <h3 className="text-white font-semibold mb-4 text-xl">Analyse Budgétaire par Projet</h3>
            <ResponsiveContainer width="100%" height="80%">
              <BarChart data={budgetData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" angle={-45} textAnchor="end" height={120} />
                <YAxis stroke="#94a3b8" label={{ value: 'Budget (M€)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                <Legend />
                <Bar dataKey="budget" fill="#D4AF37" name="Budget (M€)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      case 'resource-allocation':
        return (
          <div className="h-full p-6">
            <h3 className="text-white font-semibold mb-4 text-xl">Allocation des Ressources</h3>
            <div className="grid grid-cols-2 gap-6 h-5/6">
              <div className="bg-slate-800 rounded-lg p-6">
                <h4 className="text-white font-medium mb-4">Par Équipe</h4>
                <div className="space-y-4">
                  {['Team Alpha', 'Team Beta', 'Team Gamma', 'Team Delta', 'Team Epsilon'].map((team, i) => {
                    const projects = demoData.projects.filter(p => p.team === team).length;
                    return (
                      <div key={team}>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-slate-300">{team}</span>
                          <span className="text-white font-semibold">{projects} projets</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full"
                            style={{ width: `${(projects / demoData.projects.length) * 100}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-slate-800 rounded-lg p-6">
                <h4 className="text-white font-medium mb-4">Taux d'Occupation</h4>
                <ResponsiveContainer width="100%" height="90%">
                  <RePieChart>
                    <Pie
                      data={[
                        { name: 'Alloués', value: 85, color: '#10b981' },
                        { name: 'Disponibles', value: 15, color: '#64748b' },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill="#10b981" />
                      <Cell fill="#64748b" />
                    </Pie>
                    <Tooltip />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );

      case 'timeline-gantt':
        return (
          <div className="h-full p-6">
            <h3 className="text-white font-semibold mb-4 text-xl">Timeline des Projets</h3>
            <div className="bg-slate-800 rounded-lg p-6 h-5/6 overflow-y-auto">
              <div className="space-y-4">
                {demoData.projects.map((project, i) => (
                  <div key={project.id} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-medium">{project.name}</h4>
                      <span className="text-slate-400 text-sm">{project.deadline}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 bg-slate-700 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${
                            project.progress >= 70 ? 'bg-green-500' :
                            project.progress >= 40 ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-white font-semibold w-12 text-right">{project.progress}%</span>
                      <div className={`w-3 h-3 rounded-full ${
                        project.status === 'green' ? 'bg-green-400' :
                        project.status === 'orange' ? 'bg-orange-400' : 'bg-red-400'
                      }`} />
                    </div>
                    <div className="text-slate-400 text-sm mt-2">
                      {project.team} • {project.sponsor} • Budget: {project.budget}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const reports: PowerBIReport[] = [
    {
      id: "portfolio-overview",
      name: "Vue d'ensemble du Portefeuille",
      embedUrl: "",
      type: "dashboard",
      icon: BarChart3,
    },
    {
      id: "budget-analysis",
      name: "Analyse Budgétaire",
      embedUrl: "",
      type: "report",
      icon: TrendingUp,
    },
    {
      id: "resource-allocation",
      name: "Allocation des Ressources",
      embedUrl: "",
      type: "report",
      icon: PieChart,
    },
    {
      id: "timeline-gantt",
      name: "Timeline & Gantt",
      embedUrl: "",
      type: "report",
      icon: Calendar,
    },
  ];

  return (
    <CockpitShell>
      <div className={`${isFullscreen ? "fixed inset-0 z-50" : ""} bg-slate-950 flex flex-col h-screen`}>
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Power BI Analytics</h1>
              <p className="text-slate-400 mt-1">
                Analyses avancées et tableaux de bord interactifs
              </p>
            </div>
            {selectedReport && (
              <div className="flex items-center gap-2">
                <button
                  title="Actualiser"
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-300"
                >
                  <RefreshCw size={20} />
                </button>
                <button
                  title="Télécharger"
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-300"
                >
                  <Download size={20} />
                </button>
                <button
                  title="Partager"
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-300"
                >
                  <Share2 size={20} />
                </button>
                <button
                  title={isFullscreen ? "Quitter plein écran" : "Plein écran"}
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-300"
                >
                  <Maximize2 size={20} />
                </button>
                <button
                  title="Paramètres"
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-300"
                >
                  <Settings size={20} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - Reports List */}
          {!isFullscreen && (
            <div className="w-64 border-r border-slate-800 bg-slate-900 p-4 overflow-y-auto">
              <h3 className="text-slate-400 text-sm font-semibold mb-4 uppercase">
                Rapports Disponibles
              </h3>
              <div className="space-y-2">
                {reports.map((report) => {
                  const Icon = report.icon;
                  return (
                    <button
                      key={report.id}
                      onClick={() => setSelectedReport(report)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                        selectedReport?.id === report.id
                          ? "bg-amber-500/10 border border-amber-500/50 text-amber-400"
                          : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                      }`}
                    >
                      <Icon size={18} />
                      <span className="text-sm font-medium text-left">{report.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Configuration Section */}
              <div className="mt-8 p-4 bg-slate-800 rounded-lg">
                <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <Settings size={16} />
                  Configuration
                </h4>
                <p className="text-slate-400 text-xs mb-3">
                  Configurez vos connexions Power BI pour afficher les rapports en temps réel.
                </p>
                <button className="w-full px-3 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-sm font-medium transition-colors">
                  Configurer Power BI
                </button>
              </div>
            </div>
          )}

          {/* Main Content - Report Viewer */}
          <div className="flex-1 p-6 overflow-y-auto">
            {selectedReport ? (
              <div className="bg-slate-900 border border-slate-800 rounded-xl h-full flex flex-col">
                {/* Report Header */}
                <div className="p-4 border-b border-slate-800">
                  <h2 className="text-xl font-bold text-white">{selectedReport.name}</h2>
                  <p className="text-slate-400 text-sm mt-1">
                    Type: {selectedReport.type === "dashboard" ? "Tableau de bord" : "Rapport"}
                  </p>
                </div>

                {/* Embedded Report */}
                <div className="flex-1 bg-slate-900">
                  {renderVisualization()}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-6">
                  <BarChart3 className="text-slate-600" size={40} />
                </div>
                <h3 className="text-white text-xl font-semibold mb-2">
                  Sélectionnez un rapport
                </h3>
                <p className="text-slate-400 max-w-md">
                  Choisissez un rapport dans la liste de gauche pour commencer l'analyse
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </CockpitShell>
  );
}
