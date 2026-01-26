"use client";

import React from "react";
import { Bug, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function AnomaliesPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Anomalies & Incidents</h1>
          <p className="text-slate-400 mt-1">Suivi des anomalies détectées et incidents</p>
        </div>
        <button className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-medium transition-colors">
          + Signaler Anomalie
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm">Ouvertes</span>
            <Bug className="text-red-400" size={20} />
          </div>
          <div className="text-3xl font-bold text-white">3</div>
          <div className="text-sm text-red-400 mt-1">Action requise</div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm">En cours</span>
            <AlertTriangle className="text-amber-400" size={20} />
          </div>
          <div className="text-3xl font-bold text-white">5</div>
          <div className="text-sm text-slate-400 mt-1">Investigation</div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm">Résolues</span>
            <CheckCircle2 className="text-emerald-400" size={20} />
          </div>
          <div className="text-3xl font-bold text-white">47</div>
          <div className="text-sm text-slate-400 mt-1">Ce mois</div>
        </div>
      </div>

      <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Anomalies Actives</h2>
        <div className="space-y-3">
          {[
            {
              title: "Performance dégradée API Gateway",
              severity: "critical",
              project: "API Gateway v2",
              reported: "2026-01-25",
              status: "open"
            },
            {
              title: "Erreur 500 intermittente module Auth",
              severity: "high",
              project: "Refonte UX/UI",
              reported: "2026-01-24",
              status: "in_progress"
            },
            {
              title: "Fuite mémoire service Analytics",
              severity: "high",
              project: "Data Lake Setup",
              reported: "2026-01-23",
              status: "open"
            },
          ].map((anomaly, i) => (
            <div key={i} className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-orange-500/50 transition-all">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Bug className={`${
                      anomaly.severity === "critical" ? "text-red-400" : "text-orange-400"
                    }`} size={16} />
                    <span className="text-white font-medium">{anomaly.title}</span>
                  </div>
                  <p className="text-sm text-slate-400">{anomaly.project}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded font-semibold ${
                  anomaly.status === "open" ? "bg-red-500/20 text-red-400" :
                  "bg-amber-500/20 text-amber-400"
                }`}>
                  {anomaly.status === "open" ? "OUVERTE" : "EN COURS"}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-3 text-sm">
                <span className={`px-2 py-1 rounded ${
                  anomaly.severity === "critical" ? "bg-red-500/20 text-red-400" : "bg-orange-500/20 text-orange-400"
                }`}>
                  {anomaly.severity === "critical" ? "CRITIQUE" : "ÉLEVÉE"}
                </span>
                <span className="text-slate-500">Signalée le {anomaly.reported}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

