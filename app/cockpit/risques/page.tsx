"use client";

import React from "react";
import { AlertTriangle, Shield, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function RisquesPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestion des Risques</h1>
          <p className="text-slate-400 mt-1">Identification et suivi des risques projets</p>
        </div>
        <Link
          href="/cockpit/risques/nouveau"
          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors"
        >
          + Déclarer un Risque
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm">Risques Critiques</span>
            <AlertTriangle className="text-red-400" size={20} />
          </div>
          <div className="text-3xl font-bold text-white">3</div>
          <div className="text-sm text-red-400 mt-1">Action immédiate</div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm">Risques Moyens</span>
            <AlertCircle className="text-amber-400" size={20} />
          </div>
          <div className="text-3xl font-bold text-white">6</div>
          <div className="text-sm text-slate-400 mt-1">Surveillance active</div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm">Risques Faibles</span>
            <Shield className="text-emerald-400" size={20} />
          </div>
          <div className="text-3xl font-bold text-white">3</div>
          <div className="text-sm text-slate-400 mt-1">Sous contrôle</div>
        </div>
      </div>

      <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Risques Actifs</h2>
        <div className="space-y-3">
          {[
            {
              title: "Retard livraison composant critique",
              project: "Migration Cloud Azure",
              severity: "critical",
              impact: "Blocage déploiement Q2",
              probability: "80%"
            },
            {
              title: "Dépassement budget infrastructure",
              project: "Data Lake Setup",
              severity: "high",
              impact: "€45K supplémentaires",
              probability: "65%"
            },
            {
              title: "Perte compétence clé (turnover)",
              project: "API Gateway v2",
              severity: "high",
              impact: "Ralentissement développement",
              probability: "50%"
            },
            {
              title: "Dépendance externe non testée",
              project: "Refonte UX/UI",
              severity: "medium",
              impact: "Risque régression UX",
              probability: "40%"
            },
          ].map((risk, i) => (
            <div key={i} className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-red-500/50 transition-all">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${
                      risk.severity === "critical" ? "bg-red-500" :
                      risk.severity === "high" ? "bg-orange-500" :
                      "bg-amber-500"
                    }`} />
                    <span className="text-white font-medium">{risk.title}</span>
                  </div>
                  <p className="text-sm text-slate-400">{risk.project}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded font-semibold ${
                  risk.severity === "critical" ? "bg-red-500/20 text-red-400" :
                  risk.severity === "high" ? "bg-orange-500/20 text-orange-400" :
                  "bg-amber-500/20 text-amber-400"
                }`}>
                  {risk.severity === "critical" ? "CRITIQUE" : risk.severity === "high" ? "ÉLEVÉ" : "MOYEN"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
                <div>
                  <span className="text-slate-500">Impact:</span>
                  <span className="text-slate-300 ml-2">{risk.impact}</span>
                </div>
                <div>
                  <span className="text-slate-500">Probabilité:</span>
                  <span className="text-slate-300 ml-2">{risk.probability}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

