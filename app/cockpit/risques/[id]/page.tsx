"use client";

import Link from "next/link";
import { ArrowLeft, Shield, TrendingUp, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

interface Risk {
  id: string;
  title: string;
  description: string;
  impact: number;
  probability: number;
  status: string;
  mitigation?: string;
  owner?: string;
  created_at: string;
}

export default function RiskDetailPage({ params }: { params: { id: string } }) {
  const [risk, setRisk] = useState<Risk | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Fetch risk details
    // For now, using mock data
    setRisk({
      id: params.id,
      title: "Dépassement Budget Infrastructure",
      description: "Risque de dépassement du budget alloué pour le projet d'infrastructure cloud en raison de l'augmentation des coûts des services Azure et des besoins imprévus en ressources.",
      impact: 4,
      probability: 3,
      status: "active",
      mitigation: "Mise en place d'alertes de coûts Azure, révision hebdomadaire du budget, optimisation des ressources non utilisées.",
      owner: "CFO - Finance Department",
      created_at: new Date().toISOString(),
    });
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Chargement...</div>
      </div>
    );
  }

  if (!risk) {
    return (
      <div className="min-h-screen bg-slate-950 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 text-center">
            <AlertTriangle className="mx-auto mb-4 text-red-500" size={48} />
            <h2 className="text-xl font-semibold text-white mb-2">Risque introuvable</h2>
            <p className="text-slate-400 mb-6">Ce risque n'existe pas ou a été supprimé.</p>
            <Link
              href="/cockpit/risques"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
            >
              <ArrowLeft size={16} />
              Retour aux risques
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const criticalityScore = risk.impact * risk.probability;
  const criticalityLevel = criticalityScore >= 15 ? "Critique" : criticalityScore >= 10 ? "Élevé" : criticalityScore >= 6 ? "Moyen" : "Faible";
  const criticalityColor = criticalityScore >= 15 ? "text-red-500 bg-red-500/10" : criticalityScore >= 10 ? "text-orange-500 bg-orange-500/10" : criticalityScore >= 6 ? "text-yellow-500 bg-yellow-500/10" : "text-blue-500 bg-blue-500/10";

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/cockpit/risques"
              className="text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">{risk.title}</h1>
              <p className="text-slate-400 mt-1">Détail du risque</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
            >
              {isEditing ? "Annuler" : "Modifier"}
            </button>
            <button
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors"
            >
              Supprimer
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Description</h3>
              <p className="text-slate-300 leading-relaxed">{risk.description}</p>
            </div>

            {/* Mitigation Plan */}
            {risk.mitigation && (
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="text-emerald-500" size={20} />
                  <h3 className="text-lg font-semibold text-white">Plan de Mitigation</h3>
                </div>
                <p className="text-slate-300 leading-relaxed">{risk.mitigation}</p>
              </div>
            )}
          </div>

          {/* Right Column - Metrics */}
          <div className="space-y-6">
            {/* Criticality Score */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h3 className="text-sm font-medium text-slate-400 mb-4">Niveau de Criticité</h3>
              <div className={`text-center py-4 rounded-lg ${criticalityColor}`}>
                <div className="text-4xl font-bold mb-2">{criticalityScore}</div>
                <div className="text-sm font-medium">{criticalityLevel}</div>
              </div>
            </div>

            {/* Impact & Probability */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">Impact</span>
                  <span className="text-white font-semibold">{risk.impact}/5</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 transition-all"
                    style={{ width: `${(risk.impact / 5) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">Probabilité</span>
                  <span className="text-white font-semibold">{risk.probability}/5</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 transition-all"
                    style={{ width: `${(risk.probability / 5) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Status & Owner */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-4">
              <div>
                <div className="text-sm text-slate-400 mb-2">Statut</div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-sm font-medium">
                  {risk.status === "active" && "Actif"}
                  {risk.status === "mitigated" && "Mitigé"}
                  {risk.status === "resolved" && "Résolu"}
                </div>
              </div>

              {risk.owner && (
                <div>
                  <div className="text-sm text-slate-400 mb-2">Responsable</div>
                  <div className="text-white font-medium">{risk.owner}</div>
                </div>
              )}

              <div>
                <div className="text-sm text-slate-400 mb-2">Créé le</div>
                <div className="text-white">
                  {new Date(risk.created_at).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
