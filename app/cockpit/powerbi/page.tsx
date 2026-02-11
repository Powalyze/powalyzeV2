"use client";

import { CockpitShell } from "@/components/cockpit/CockpitShell";
import { useState } from "react";
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
                <div className="flex-1 p-4">
                  {selectedReport.embedUrl ? (
                    <iframe
                      title={selectedReport.name}
                      src={selectedReport.embedUrl}
                      className="w-full h-full rounded-lg"
                      frameBorder="0"
                      allowFullScreen
                    />
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                        <BarChart3 className="text-slate-600" size={32} />
                      </div>
                      <h3 className="text-white text-lg font-semibold mb-2">
                        Rapport non configuré
                      </h3>
                      <p className="text-slate-400 max-w-md mb-6">
                        Ce rapport Power BI n'est pas encore configuré. Ajoutez l'URL d'intégration
                        dans les paramètres pour afficher le contenu.
                      </p>
                      <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg font-medium transition-colors">
                        Configurer maintenant
                      </button>

                      {/* Demo Preview */}
                      <div className="mt-8 w-full max-w-3xl">
                        <div className="bg-slate-800 rounded-lg p-6">
                          <h4 className="text-white font-semibold mb-4">Aperçu des données simulées</h4>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-300">Projets actifs</span>
                              <span className="text-white font-bold">12</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-300">Budget total</span>
                              <span className="text-white font-bold">€5.5M</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-300">Ressources allouées</span>
                              <span className="text-white font-bold">85 personnes</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-300">Taux de réussite</span>
                              <span className="text-emerald-400 font-bold">94%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
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
