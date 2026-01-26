"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Clock, AlertTriangle, User } from "lucide-react";

interface Decision {
  id: string;
  title: string;
  description: string;
  status: string;
  decision_maker: string;
  decided_at?: string;
  deadline?: string;
  impact?: string;
  committee?: string;
  project_id?: string;
  created_at: string;
}

export default function DecisionDetailPage({ params }: { params: { id: string } }) {
  const [decision, setDecision] = useState<Decision | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Intégrer avec getDecision(params.id)
    // Mock data pour démonstration
    setDecision({
      id: params.id,
      title: "Adoption Architecture Microservices",
      description: "Décision stratégique concernant la migration de l'architecture monolithique actuelle vers une architecture microservices. Cette décision impacte l'ensemble de l'équipe technique et nécessite une validation du comité exécutif.",
      status: "approved",
      decision_maker: "CTO - Direction Technique",
      decided_at: new Date().toISOString(),
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      impact: "HIGH",
      committee: "COMEX Technique",
      created_at: new Date().toISOString()
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

  if (!decision) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Décision introuvable</h2>
          <p className="text-slate-400 mb-6">Cette décision n&apos;existe pas ou a été supprimée</p>
          <Link
            href="/cockpit/decisions"
            className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux décisions
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-emerald-500/10 text-emerald-500";
      case "rejected":
        return "bg-red-500/10 text-red-500";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500";
      case "in_progress":
        return "bg-blue-500/10 text-blue-500";
      default:
        return "bg-slate-500/10 text-slate-500";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "HIGH":
        return "text-red-500 bg-red-500/10";
      case "MEDIUM":
        return "text-orange-500 bg-orange-500/10";
      case "LOW":
        return "text-blue-500 bg-blue-500/10";
      default:
        return "text-slate-500 bg-slate-500/10";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/cockpit/decisions"
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-400" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">{decision.title}</h1>
              <p className="text-slate-400 mt-1">ID: {decision.id}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/cockpit/decisions/${decision.id}/edit`}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Modifier
            </Link>
            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
              Supprimer
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Description</h2>
              <p className="text-slate-300 leading-relaxed">{decision.description}</p>
            </div>

            {/* Committee */}
            {decision.committee && (
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-5 h-5 text-purple-500" />
                  <h2 className="text-xl font-semibold text-white">Comité</h2>
                </div>
                <p className="text-slate-300">{decision.committee}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Statut</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-slate-400 mb-2">Statut actuel</div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(decision.status)}`}>
                    {decision.status}
                  </span>
                </div>
                <div>
                  <div className="text-sm text-slate-400 mb-2">Impact</div>
                  {decision.impact && (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getImpactColor(decision.impact)}`}>
                      {decision.impact}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Decision Maker */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Décideur</h3>
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-blue-500" />
                <span className="text-slate-300">{decision.decision_maker}</span>
              </div>
            </div>

            {/* Dates */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Dates</h3>
              <div className="space-y-3">
                {decision.decided_at && (
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />
                    <div>
                      <div className="text-sm text-slate-400">Date de décision</div>
                      <div className="text-slate-300">
                        {new Date(decision.decided_at).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric"
                        })}
                      </div>
                    </div>
                  </div>
                )}
                {decision.deadline && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-orange-500 mt-0.5" />
                    <div>
                      <div className="text-sm text-slate-400">Échéance</div>
                      <div className="text-slate-300">
                        {new Date(decision.deadline).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric"
                        })}
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-slate-500 mt-0.5" />
                  <div>
                    <div className="text-sm text-slate-400">Créé le</div>
                    <div className="text-slate-300">
                      {new Date(decision.created_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
