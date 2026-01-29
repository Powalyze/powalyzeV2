"use client";

import { CockpitShell } from "@/components/cockpit/CockpitShell";
import { ModalsHub } from "@/components/cockpit/ModalsHub";
import { useState } from "react";
import { Brain, Plus, Search, Filter, FileText, Download, Eye, Calendar } from "lucide-react";

type ReportType = "executive" | "comex" | "technique" | "financier";
type ReportStatus = "draft" | "generated" | "sent";

export default function RapportsPage() {
  const [selectedType, setSelectedType] = useState<string>("all");
  
  // Projets demo
  const demoProjects = [
    { id: "1", name: "Cloud Migration" },
    { id: "2", name: "ERP Refonte" },
    { id: "3", name: "Mobile App v2" }
  ];
  
  const handleDownloadReport = async (title: string, type: string) => {
    try {
      const response = await fetch('/api/export/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          organizationId: 'demo',
          type: 'reports'
        })
      });
      
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      alert('Rapport téléchargé avec succès!');
    } catch (error) {
      console.error('Download error:', error);
      alert('Erreur lors du téléchargement');
    }
  };

  return (
    <CockpitShell>
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Rapports</h1>
            <p className="text-slate-400">Rapports narratifs automatiques avec IA</p>
          </div>
          <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 font-semibold transition-all flex items-center gap-2">
            <Plus size={20} />
            <span>Nouveau rapport</span>
          </button>
        </div>

        {/* AI Insights */}
        <div className="mb-6 p-6 rounded-xl bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-sky-500/10 border border-purple-500/30">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
              <Brain className="text-purple-400" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-2">IA Copilote • Storytelling automatique</h3>
              <p className="text-slate-300 text-sm mb-3">
                J'ai généré <strong className="text-white">le rapport exécutif Q1 2025</strong> avec analyse narrative complète. 
                Insights clés : <strong className="text-purple-400">+15% de vélocité</strong>, 
                <strong className="text-green-400"> 7 risques mitigés</strong>, et 
                <strong className="text-amber-400"> 3 décisions critiques</strong> à valider cette semaine. 
                Le rapport COMEX de mardi est prêt à être envoyé.
              </p>
              <div className="flex flex-wrap gap-2">
                <button className="px-3 py-1.5 text-sm rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 text-purple-300 hover:text-purple-200 transition-colors">
                  Générer rapport exécutif
                </button>
                <button className="px-3 py-1.5 text-sm rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors">
                  Rapport COMEX auto
                </button>
                <button className="px-3 py-1.5 text-sm rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors">
                  Exporter PowerBI
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <StatCard title="Rapports générés" value="156" color="purple" />
          <StatCard title="Ce mois" value="24" color="blue" />
          <StatCard title="En attente" value="3" color="amber" />
          <StatCard title="Taux lecture" value="87%" color="green" />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Type Filter */}
          <div className="flex gap-2 p-1 bg-slate-900 rounded-lg border border-slate-800 overflow-x-auto">
            <button
              onClick={() => setSelectedType("all")}
              className={`px-4 py-2 rounded-lg transition-colors text-sm whitespace-nowrap ${
                selectedType === "all"
                  ? "bg-amber-500 text-slate-950 font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setSelectedType("executive")}
              className={`px-4 py-2 rounded-lg transition-colors text-sm whitespace-nowrap ${
                selectedType === "executive"
                  ? "bg-amber-500 text-slate-950 font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Exécutif
            </button>
            <button
              onClick={() => setSelectedType("comex")}
              className={`px-4 py-2 rounded-lg transition-colors text-sm whitespace-nowrap ${
                selectedType === "comex"
                  ? "bg-amber-500 text-slate-950 font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              COMEX
            </button>
            <button
              onClick={() => setSelectedType("technique")}
              className={`px-4 py-2 rounded-lg transition-colors text-sm whitespace-nowrap ${
                selectedType === "technique"
                  ? "bg-amber-500 text-slate-950 font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Technique
            </button>
            <button
              onClick={() => setSelectedType("financier")}
              className={`px-4 py-2 rounded-lg transition-colors text-sm whitespace-nowrap ${
                selectedType === "financier"
                  ? "bg-amber-500 text-slate-950 font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Financier
            </button>
          </div>

          {/* Search & Filters */}
          <div className="flex gap-2 flex-1">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher un rapport..."
                className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
            <button className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white hover:border-slate-700 transition-colors flex items-center gap-2">
              <Filter size={18} />
              <span className="hidden sm:inline">Filtres</span>
            </button>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="space-y-4">
          <ReportCard
            title="Rapport Exécutif Q1 2025"
            type="executive"
            date="Généré aujourd'hui"
            status="generated"
            pages={24}
            highlights="15% vélocité, 7 risques mitigés, 3 décisions critiques"
            onDownload={() => handleDownloadReport("Rapport_Executif_Q1_2025", "executive")}
          />
          <ReportCard
            title="COMEX - État des projets Janvier"
            type="comex"
            date="Généré hier"
            status="sent"
            pages={12}
            highlights="42 projets, 4 alertes, budget 98% consommé"
            onDownload={() => handleDownloadReport("COMEX_Etat_projets_Janvier", "comex")}
          />
          <ReportCard
            title="Analyse Technique Cloud Migration"
            type="technique"
            date="Il y a 3 jours"
            status="generated"
            pages={36}
            highlights="Architecture AWS, sécurité, roadmap migration"
            onDownload={() => handleDownloadReport("Analyse_Technique_Cloud_Migration", "technique")}
          />
          <ReportCard
            title="Rapport Financier Mensuel"
            type="financier"
            date="Il y a 5 jours"
            status="sent"
            pages={18}
            highlights="7.8M€ dépensés, -450K économisés, prévisions Q2"
            onDownload={() => handleDownloadReport("Rapport_Financier_Mensuel", "financier")}
          />
        </div>
      </div>
      
      <ModalsHub projects={demoProjects} />
    </CockpitShell>
  );
}

function StatCard({ title, value, color }: { title: string; value: string; color: string }) {
  const colors = {
    purple: "from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400",
    blue: "from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400",
    amber: "from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400",
    green: "from-green-500/20 to-green-600/10 border-green-500/30 text-green-400"
  };

  return (
    <div className={`p-6 rounded-xl bg-gradient-to-br border ${colors[color as keyof typeof colors]}`}>
      <div className="text-sm text-slate-400 mb-2">{title}</div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  );
}

function ReportCard({
  title,
  type,
  date,
  status,
  pages,
  highlights,
  onDownload
}: {
  title: string;
  type: ReportType;
  date: string;
  status: ReportStatus;
  pages: number;
  highlights: string;
  onDownload: () => void;
}) {
  const typeConfig = {
    executive: { label: "Exécutif", color: "bg-purple-500/10 text-purple-400 border-purple-500/30" },
    comex: { label: "COMEX", color: "bg-blue-500/10 text-blue-400 border-blue-500/30" },
    technique: { label: "Technique", color: "bg-slate-500/10 text-slate-400 border-slate-500/30" },
    financier: { label: "Financier", color: "bg-green-500/10 text-green-400 border-green-500/30" }
  };

  const statusConfig = {
    draft: { label: "Brouillon", color: "bg-slate-500/10 text-slate-400 border-slate-500/30" },
    generated: { label: "Généré", color: "bg-green-500/10 text-green-400 border-green-500/30" },
    sent: { label: "Envoyé", color: "bg-blue-500/10 text-blue-400 border-blue-500/30" }
  };

  return (
    <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-bold flex-1">{title}</h3>
            <div className="flex gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${typeConfig[type].color}`}>
                {typeConfig[type].label}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig[status].color}`}>
                {statusConfig[status].label}
              </span>
            </div>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-4 text-sm mb-4">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-slate-500" />
              <span className="text-slate-400">{date}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText size={14} className="text-slate-500" />
              <span className="text-slate-400">{pages} pages</span>
            </div>
          </div>

          {/* AI Highlights */}
          <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-blue-500/5 border border-purple-500/20">
            <div className="flex items-start gap-3">
              <Brain size={18} className="text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-purple-400 mb-1">Points clés (IA)</div>
                <p className="text-sm text-slate-300">{highlights}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex lg:flex-col gap-2 lg:w-48">
          <button className="px-4 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-400 hover:text-amber-300 font-semibold transition-colors flex items-center justify-center gap-2 flex-1 lg:flex-none">
            <Eye size={18} />
            <span>Visualiser</span>
          </button>
          <button 
            onClick={onDownload}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white font-semibold transition-colors flex items-center justify-center gap-2 flex-1 lg:flex-none"
          >
            <Download size={18} />
            <span>Télécharger</span>
          </button>
        </div>
      </div>
    </div>
  );
}
