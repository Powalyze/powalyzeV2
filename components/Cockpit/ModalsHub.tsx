"use client";

import { useState } from "react";
import { X, AlertTriangle, FileText, Bug, Link as LinkIcon, CheckCircle } from "lucide-react";
import { createRisk } from "@/actions/risks";
import { createDecision } from "@/actions/decisions";
import { createAnomaly } from "@/actions/anomalies";
import { createReport } from "@/actions/reports";
import { createConnector } from "@/actions/connectors";

interface ModalsHubProps {
  projects: Array<{ id: string; name: string }>;
}

export function ModalsHub({ projects }: ModalsHubProps) {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, action: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      await action(formData);
      setActiveModal(null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const Modal = ({ title, icon: Icon, children, onClose }: any) => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Icon className="w-6 h-6 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-white">{title}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );

  return (
    <>
      {/* Risk Modal */}
      {activeModal === "risk" && (
        <Modal title="Déclarer un Risque" icon={AlertTriangle} onClose={() => setActiveModal(null)}>
          <form onSubmit={(e) => handleSubmit(e, createRisk)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Projet</label>
              <select name="project_id" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white" required>
                <option value="">Sélectionner</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Titre</label>
              <input name="title" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
              <textarea name="description" rows={3} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Impact (1-5)</label>
                <input name="impact" type="number" min="1" max="5" defaultValue="3" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Probabilité (1-5)</label>
                <input name="probability" type="number" min="1" max="5" defaultValue="3" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Plan de Mitigation</label>
              <textarea name="mitigation" rows={2} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white" />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg font-semibold disabled:opacity-50">
              {loading ? "Création..." : "Créer le Risque"}
            </button>
          </form>
        </Modal>
      )}

      {/* Decision Modal */}
      {activeModal === "decision" && (
        <Modal title="Nouvelle Décision" icon={CheckCircle} onClose={() => setActiveModal(null)}>
          <form onSubmit={(e) => handleSubmit(e, createDecision)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Projet</label>
              <select name="project_id" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white" required>
                <option value="">Sélectionner</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Titre</label>
              <input name="title" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
              <textarea name="description" rows={3} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Décideur</label>
              <input name="decision_maker" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white" required />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg font-semibold disabled:opacity-50">
              {loading ? "Création..." : "Créer la Décision"}
            </button>
          </form>
        </Modal>
      )}

      {/* Anomaly Modal */}
      {activeModal === "anomaly" && (
        <Modal title="Signaler une Anomalie" icon={Bug} onClose={() => setActiveModal(null)}>
          <form onSubmit={(e) => handleSubmit(e, createAnomaly)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Projet</label>
              <select name="project_id" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white" required>
                <option value="">Sélectionner</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Titre</label>
              <input name="title" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
              <textarea name="description" rows={3} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Sévérité</label>
              <select name="severity" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white" required>
                <option value="low">Faible</option>
                <option value="medium">Moyenne</option>
                <option value="high">Élevée</option>
                <option value="critical">Critique</option>
              </select>
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-lg font-semibold disabled:opacity-50">
              {loading ? "Création..." : "Signaler l'Anomalie"}
            </button>
          </form>
        </Modal>
      )}

      {/* Report Modal */}
      {activeModal === "report" && (
        <Modal title="Nouveau Rapport" icon={FileText} onClose={() => setActiveModal(null)}>
          <form onSubmit={(e) => handleSubmit(e, createReport)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Projet</label>
              <select name="project_id" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white">
                <option value="">Tous les projets</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Titre</label>
              <input name="title" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
              <select name="report_type" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white" required>
                <option value="executive">Exécutif</option>
                <option value="technical">Technique</option>
                <option value="financial">Financier</option>
                <option value="project">Projet</option>
                <option value="risk">Risques</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Contenu</label>
              <textarea name="content" rows={5} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white" required />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold disabled:opacity-50">
              {loading ? "Création..." : "Créer le Rapport"}
            </button>
          </form>
        </Modal>
      )}

      {/* Connector Modal */}
      {activeModal === "connector" && (
        <Modal title="Ajouter Connecteur" icon={LinkIcon} onClose={() => setActiveModal(null)}>
          <form onSubmit={(e) => handleSubmit(e, createConnector)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Nom</label>
              <input name="name" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
              <select name="connector_type" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white" required>
                <option value="jira">Jira</option>
                <option value="slack">Slack</option>
                <option value="github">GitHub</option>
                <option value="gitlab">GitLab</option>
                <option value="azure_devops">Azure DevOps</option>
                <option value="teams">Microsoft Teams</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">URL API</label>
              <input name="api_url" type="url" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">API Key</label>
              <input name="api_key" type="password" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white" required />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg font-semibold disabled:opacity-50">
              {loading ? "Connexion..." : "Ajouter le Connecteur"}
            </button>
          </form>
        </Modal>
      )}

      {/* Trigger Buttons */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-3">
        <button onClick={() => setActiveModal("risk")} className="p-4 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg">
          <AlertTriangle className="w-6 h-6 text-white" />
        </button>
        <button onClick={() => setActiveModal("decision")} className="p-4 bg-emerald-600 hover:bg-emerald-700 rounded-full shadow-lg">
          <CheckCircle className="w-6 h-6 text-white" />
        </button>
        <button onClick={() => setActiveModal("anomaly")} className="p-4 bg-orange-600 hover:bg-orange-700 rounded-full shadow-lg">
          <Bug className="w-6 h-6 text-white" />
        </button>
        <button onClick={() => setActiveModal("report")} className="p-4 bg-purple-600 hover:bg-purple-700 rounded-full shadow-lg">
          <FileText className="w-6 h-6 text-white" />
        </button>
        <button onClick={() => setActiveModal("connector")} className="p-4 bg-cyan-600 hover:bg-cyan-700 rounded-full shadow-lg">
          <LinkIcon className="w-6 h-6 text-white" />
        </button>
      </div>
    </>
  );
}
