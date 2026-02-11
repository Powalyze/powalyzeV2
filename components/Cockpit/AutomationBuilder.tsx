"use client";

import { useState } from "react";
import { Zap, Plus, Play, Pause, Trash2, Edit2, AlertCircle, CheckCircle } from "lucide-react";

interface Automation {
  id: string;
  name: string;
  trigger: string;
  conditions: string[];
  actions: string[];
  enabled: boolean;
  lastRun?: string;
  runCount: number;
}

export function AutomationBuilder() {
  const [automations, setAutomations] = useState<Automation[]>([
    {
      id: "1",
      name: "Alerte budget critique",
      trigger: "Quand le budget dépasse 90%",
      conditions: ["budget_used > 90%"],
      actions: ["Envoyer notification au PMO", "Créer un risque critique"],
      enabled: true,
      lastRun: new Date(Date.now() - 3600000).toISOString(),
      runCount: 12,
    },
    {
      id: "2",
      name: "Auto-assignation des tâches",
      trigger: "Quand une tâche est créée",
      conditions: ["task.assignee is null", "task.priority === HIGH"],
      actions: ["Assigner au chef de projet", "Envoyer notification"],
      enabled: true,
      lastRun: new Date(Date.now() - 7200000).toISOString(),
      runCount: 45,
    },
    {
      id: "3",
      name: "Rappel échéances",
      trigger: "Tous les jours à 9h",
      conditions: ["deadline < 3 days"],
      actions: ["Envoyer email de rappel", "Créer notification"],
      enabled: false,
      runCount: 0,
    },
  ]);

  const [showBuilder, setShowBuilder] = useState(false);

  function toggleAutomation(id: string) {
    setAutomations((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  }

  function deleteAutomation(id: string) {
    setAutomations((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center">
              <Zap size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Automatisations</h2>
              <p className="text-slate-400">
                {automations.filter((a) => a.enabled).length} active(s) sur {automations.length}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowBuilder(true)}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Plus size={18} />
            Nouvelle automatisation
          </button>
        </div>
      </div>

      {/* Automations List */}
      <div className="grid gap-4">
        {automations.map((automation) => (
          <div
            key={automation.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-purple-500/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-white">{automation.name}</h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      automation.enabled
                        ? "bg-green-500/20 text-green-400"
                        : "bg-slate-700 text-slate-400"
                    }`}
                  >
                    {automation.enabled ? "Activée" : "Désactivée"}
                  </span>
                </div>
                <p className="text-slate-400 text-sm mb-3">{automation.trigger}</p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <CheckCircle size={14} />
                    {automation.runCount} exécutions
                  </span>
                  {automation.lastRun && (
                    <span>
                      Dernière exécution :{" "}
                      {new Date(automation.lastRun).toLocaleString("fr-FR")}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleAutomation(automation.id)}
                  title={automation.enabled ? "Désactiver" : "Activer"}
                  className={`p-2 rounded-lg transition-colors ${
                    automation.enabled
                      ? "text-green-400 hover:bg-green-500/10"
                      : "text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  {automation.enabled ? <Pause size={18} /> : <Play size={18} />}
                </button>
                <button
                  title="Modifier"
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => deleteAutomation(automation.id)}
                  title="Supprimer"
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Workflow Visualization */}
            <div className="flex items-center gap-3 text-sm">
              <div className="px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg flex items-center gap-2">
                <AlertCircle size={14} />
                Déclencheur
              </div>
              <div className="text-slate-600">→</div>
              <div className="px-3 py-2 bg-amber-500/20 text-amber-400 rounded-lg">
                {automation.conditions.length} condition(s)
              </div>
              <div className="text-slate-600">→</div>
              <div className="px-3 py-2 bg-green-500/20 text-green-400 rounded-lg">
                {automation.actions.length} action(s)
              </div>
            </div>

            {/* Details */}
            <div className="mt-4 pt-4 border-t border-slate-800">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold text-white mb-2">Conditions</h4>
                  <ul className="space-y-1">
                    {automation.conditions.map((cond, i) => (
                      <li key={i} className="text-slate-400 flex items-start gap-2">
                        <span className="text-amber-400 mt-1">•</span>
                        <code className="bg-slate-800 px-2 py-1 rounded text-xs">{cond}</code>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Actions</h4>
                  <ul className="space-y-1">
                    {automation.actions.map((action, i) => (
                      <li key={i} className="text-slate-400 flex items-start gap-2">
                        <span className="text-green-400 mt-1">•</span>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Builder Modal (placeholder) */}
      {showBuilder && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-3xl w-full p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Créer une automatisation</h2>
            <p className="text-slate-400 mb-6">
              Interface de création visuelle (à implémenter)
            </p>
            <button
              onClick={() => setShowBuilder(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
