"use client";

import React from "react";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

export default function DecisionsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Registre des Décisions</h1>
          <p className="text-slate-400 mt-1">Suivi des décisions stratégiques et tactiques</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors">
          + Nouvelle Décision
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm">Approuvées</span>
            <CheckCircle2 className="text-emerald-400" size={20} />
          </div>
          <div className="text-3xl font-bold text-white">24</div>
          <div className="text-sm text-slate-400 mt-1">Ce trimestre</div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm">En attente</span>
            <Clock className="text-amber-400" size={20} />
          </div>
          <div className="text-3xl font-bold text-white">7</div>
          <div className="text-sm text-slate-400 mt-1">Validation COMEX</div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm">Rejetées</span>
            <XCircle className="text-red-400" size={20} />
          </div>
          <div className="text-3xl font-bold text-white">3</div>
          <div className="text-sm text-slate-400 mt-1">Ce trimestre</div>
        </div>
      </div>

      <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Décisions Récentes</h2>
        <div className="space-y-3">
          {[
            {
              title: "Migration vers architecture microservices",
              date: "2026-01-24",
              status: "approved",
              impact: "Architecture technique",
              decider: "CTO"
            },
            {
              title: "Extension équipe Data Science +3 FTE",
              date: "2026-01-22",
              status: "pending",
              impact: "Budget RH +€240K",
              decider: "DG"
            },
            {
              title: "Adoption Kubernetes pour orchestration",
              date: "2026-01-20",
              status: "approved",
              impact: "Infrastructure cloud",
              decider: "CTO"
            },
            {
              title: "Report feature X au Q3",
              date: "2026-01-18",
              status: "approved",
              impact: "Roadmap produit",
              decider: "CPO"
            },
            {
              title: "Arrêt projet legacy modernisation",
              date: "2026-01-15",
              status: "rejected",
              impact: "Dette technique",
              decider: "COMEX"
            },
          ].map((decision, i) => (
            <div key={i} className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-blue-500/50 transition-all">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <span className="text-white font-medium block mb-1">{decision.title}</span>
                  <p className="text-sm text-slate-400">{decision.impact}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded font-semibold whitespace-nowrap ${
                  decision.status === "approved" ? "bg-emerald-500/20 text-emerald-400" :
                  decision.status === "pending" ? "bg-amber-500/20 text-amber-400" :
                  "bg-red-500/20 text-red-400"
                }`}>
                  {decision.status === "approved" ? "APPROUVÉE" : decision.status === "pending" ? "EN ATTENTE" : "REJETÉE"}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                <span>{decision.date}</span>
                <span>•</span>
                <span>Décideur: {decision.decider}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

