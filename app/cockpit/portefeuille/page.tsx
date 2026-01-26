"use client";

import React from "react";
import { FolderKanban, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function PortefeuillePage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Portefeuille de Projets</h1>
          <p className="text-slate-400 mt-1">Vue d'ensemble de tous les projets actifs</p>
        </div>
        <Link
          href="/cockpit/portefeuille/nouveau"
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors"
        >
          + Nouveau Projet
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm">Total Projets</span>
            <FolderKanban className="text-blue-400" size={20} />
          </div>
          <div className="text-3xl font-bold text-white">42</div>
          <div className="text-sm text-emerald-400 mt-1">+3 ce mois</div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm">En cours</span>
            <TrendingUp className="text-emerald-400" size={20} />
          </div>
          <div className="text-3xl font-bold text-white">28</div>
          <div className="text-sm text-slate-400 mt-1">67% du total</div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm">Terminés</span>
            <CheckCircle2 className="text-blue-400" size={20} />
          </div>
          <div className="text-3xl font-bold text-white">11</div>
          <div className="text-sm text-slate-400 mt-1">26% du total</div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm">À risque</span>
            <AlertCircle className="text-red-400" size={20} />
          </div>
          <div className="text-3xl font-bold text-white">3</div>
          <div className="text-sm text-red-400 mt-1">Attention requise</div>
        </div>
      </div>

      <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Projets Actifs</h2>
        <div className="space-y-3">
          {[
            { name: "Migration Cloud Azure", status: "En cours", progress: 68, priority: "high" },
            { name: "Refonte UX/UI Platform", status: "En cours", progress: 45, priority: "medium" },
            { name: "API Gateway v2", status: "En cours", progress: 82, priority: "high" },
            { name: "Data Lake Setup", status: "Planifié", progress: 15, priority: "low" },
          ].map((project, i) => (
            <div key={i} className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-emerald-500/50 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">{project.name}</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  project.priority === "high" ? "bg-red-500/20 text-red-400" :
                  project.priority === "medium" ? "bg-amber-500/20 text-amber-400" :
                  "bg-blue-500/20 text-blue-400"
                }`}>
                  {project.status}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${project.progress}%` }} />
                </div>
                <span className="text-sm text-slate-400">{project.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

