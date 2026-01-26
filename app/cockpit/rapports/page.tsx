"use client";

import React from "react";
import { FileText, Download, Calendar } from "lucide-react";

export default function RapportsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Rapports & Exports</h1>
          <p className="text-slate-400 mt-1">Génération et consultation des rapports</p>
        </div>
        <button className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors">
          + Nouveau Rapport
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm">Ce mois</span>
            <FileText className="text-blue-400" size={20} />
          </div>
          <div className="text-3xl font-bold text-white">12</div>
          <div className="text-sm text-slate-400 mt-1">Rapports générés</div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm">Téléchargements</span>
            <Download className="text-emerald-400" size={20} />
          </div>
          <div className="text-3xl font-bold text-white">48</div>
          <div className="text-sm text-slate-400 mt-1">Cette semaine</div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm">Programmés</span>
            <Calendar className="text-purple-400" size={20} />
          </div>
          <div className="text-3xl font-bold text-white">5</div>
          <div className="text-sm text-slate-400 mt-1">Automatisés</div>
        </div>
      </div>

      <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Rapports Disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: "Rapport Exécutif Mensuel", type: "PDF", size: "2.4 MB", date: "2026-01-25" },
            { name: "Dashboard KPI Hebdomadaire", type: "Excel", size: "1.8 MB", date: "2026-01-24" },
            { name: "Analyse Risques Q1 2026", type: "PDF", size: "3.1 MB", date: "2026-01-22" },
            { name: "Budget vs Actuel Janvier", type: "Excel", size: "2.2 MB", date: "2026-01-20" },
            { name: "Performance Portfolio", type: "PowerPoint", size: "5.6 MB", date: "2026-01-18" },
            { name: "Rapport Conformité", type: "PDF", size: "1.9 MB", date: "2026-01-15" },
          ].map((report, i) => (
            <div key={i} className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-purple-500/50 transition-all group cursor-pointer">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="text-purple-400" size={16} />
                    <span className="text-white font-medium group-hover:text-purple-400 transition-colors">{report.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <span>{report.type}</span>
                    <span>•</span>
                    <span>{report.size}</span>
                  </div>
                </div>
                <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                  <Download size={18} className="text-slate-400" />
                </button>
              </div>
              <div className="text-xs text-slate-500 mt-2">Généré le {report.date}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Exports Rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-blue-500/50 hover:bg-slate-800 transition-all text-left">
            <FileText className="text-blue-400 mb-2" size={24} />
            <div className="text-white font-medium">Export PDF</div>
            <div className="text-sm text-slate-400 mt-1">Vue synthétique</div>
          </button>
          <button className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-emerald-500/50 hover:bg-slate-800 transition-all text-left">
            <FileText className="text-emerald-400 mb-2" size={24} />
            <div className="text-white font-medium">Export Excel</div>
            <div className="text-sm text-slate-400 mt-1">Données détaillées</div>
          </button>
          <button className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-purple-500/50 hover:bg-slate-800 transition-all text-left">
            <FileText className="text-purple-400 mb-2" size={24} />
            <div className="text-white font-medium">Export PowerPoint</div>
            <div className="text-sm text-slate-400 mt-1">Présentation COMEX</div>
          </button>
        </div>
      </div>
    </div>
  );
}

