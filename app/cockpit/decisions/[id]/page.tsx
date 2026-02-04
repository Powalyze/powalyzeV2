"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { BackButton } from "@/components/BackButton";
import { Loader2, Clock, User, FileText, AlertTriangle } from "lucide-react";

export default function DecisionDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [decision, setDecision] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`/api/cockpit/decisions/${id}`)
        .then(r => r.json())
        .then(data => {
          setDecision(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-amber-400" size={48} />
      </div>
    );
  }

  if (!decision) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="text-red-400 mx-auto mb-4" size={48} />
          <h2 className="text-2xl font-bold mb-2">Décision introuvable</h2>
          <BackButton fallback="/cockpit/decisions" label="Retour aux décisions" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="border-b border-slate-800/50 bg-slate-900/30 backdrop-blur">
        <div className="max-w-[1200px] mx-auto px-6 py-6">
          <BackButton fallback="/cockpit/decisions" />
          <h1 className="text-3xl font-bold mt-2">{decision.title}</h1>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-8 space-y-6">
        <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
          <h2 className="text-xl font-bold mb-4">Informations générales</h2>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-slate-400 mb-1">Statut</div>
              <div className="text-white font-medium capitalize">{decision.status}</div>
            </div>

            <div>
              <div className="text-sm text-slate-400 mb-1">Priorité</div>
              <div className={`inline-block px-3 py-1 rounded-full text-sm capitalize ${
                decision.priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                decision.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                decision.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-slate-500/20 text-slate-400'
              }`}>
                {decision.priority}
              </div>
            </div>

            {decision.owner && (
              <div>
                <div className="text-sm text-slate-400 mb-1 flex items-center gap-2">
                  <User size={14} />
                  Responsable
                </div>
                <div className="text-white">{decision.owner}</div>
              </div>
            )}

            {decision.due_date && (
              <div>
                <div className="text-sm text-slate-400 mb-1 flex items-center gap-2">
                  <Clock size={14} />
                  Échéance
                </div>
                <div className="text-white">{new Date(decision.due_date).toLocaleDateString()}</div>
              </div>
            )}

            {decision.project && (
              <div className="col-span-2">
                <div className="text-sm text-slate-400 mb-1 flex items-center gap-2">
                  <FileText size={14} />
                  Projet lié
                </div>
                <div className="text-white">{decision.project.name}</div>
              </div>
            )}
          </div>
        </div>

        {decision.description && (
          <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
            <h2 className="text-xl font-bold mb-4">Description</h2>
            <p className="text-slate-300 leading-relaxed">{decision.description}</p>
          </div>
        )}

        <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
          <h2 className="text-xl font-bold mb-4">Historique</h2>
          <div className="text-sm text-slate-400">
            <div className="mb-2">Créé le : {new Date(decision.created_at).toLocaleString()}</div>
            {decision.updated_at && decision.updated_at !== decision.created_at && (
              <div>Mis à jour le : {new Date(decision.updated_at).toLocaleString()}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
