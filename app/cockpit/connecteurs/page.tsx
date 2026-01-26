"use client";

import React from "react";
import { Plug, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function ConnecteursPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Connecteurs & Intégrations</h1>
          <p className="text-slate-400 mt-1">Gestion des connexions aux systèmes externes</p>
        </div>
        <Link
          href="/cockpit/connecteurs/nouveau"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
        >
          + Ajouter Connecteur
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm">Actifs</span>
            <CheckCircle2 className="text-emerald-400" size={20} />
          </div>
          <div className="text-3xl font-bold text-white">8</div>
          <div className="text-sm text-emerald-400 mt-1">Opérationnels</div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm">Avertissements</span>
            <AlertCircle className="text-amber-400" size={20} />
          </div>
          <div className="text-3xl font-bold text-white">2</div>
          <div className="text-sm text-slate-400 mt-1">À surveiller</div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm">Inactifs</span>
            <XCircle className="text-red-400" size={20} />
          </div>
          <div className="text-3xl font-bold text-white">1</div>
          <div className="text-sm text-red-400 mt-1">Action requise</div>
        </div>
      </div>

      <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Connecteurs Configurés</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: "Jira Software", status: "active", sync: "2 min ago", type: "Project Management" },
            { name: "Azure DevOps", status: "active", sync: "5 min ago", type: "CI/CD" },
            { name: "GitHub", status: "active", sync: "1 min ago", type: "Version Control" },
            { name: "Slack", status: "active", sync: "30 sec ago", type: "Communication" },
            { name: "Power BI", status: "active", sync: "10 min ago", type: "Analytics" },
            { name: "Confluence", status: "warning", sync: "2h ago", type: "Documentation" },
            { name: "ServiceNow", status: "active", sync: "15 min ago", type: "ITSM" },
            { name: "Teams", status: "warning", sync: "1h ago", type: "Communication" },
            { name: "SAP", status: "inactive", sync: "Never", type: "ERP" },
          ].map((connector, i) => (
            <div key={i} className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-blue-500/50 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                    <Plug className="text-blue-400" size={20} />
                  </div>
                  <div>
                    <div className="text-white font-medium">{connector.name}</div>
                    <div className="text-xs text-slate-400">{connector.type}</div>
                  </div>
                </div>
                <span className={`w-3 h-3 rounded-full ${
                  connector.status === "active" ? "bg-emerald-500" :
                  connector.status === "warning" ? "bg-amber-500" :
                  "bg-red-500"
                }`} title={connector.status} />
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                <span className="text-xs text-slate-500">Dernière synchro</span>
                <span className="text-xs text-slate-400">{connector.sync}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Connecteurs Disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { name: "Asana", category: "Project Management" },
            { name: "Monday.com", category: "Workflow" },
            { name: "Notion", category: "Documentation" },
            { name: "Salesforce", category: "CRM" },
            { name: "HubSpot", category: "Marketing" },
            { name: "Zendesk", category: "Support" },
          ].map((available, i) => (
            <button key={i} className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-blue-500/50 hover:bg-slate-800 transition-all text-left group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                  <Plug className="text-slate-400 group-hover:text-white" size={20} />
                </div>
                <div>
                  <div className="text-white font-medium">{available.name}</div>
                  <div className="text-xs text-slate-400">{available.category}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

