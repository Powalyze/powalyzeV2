"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, AlertCircle, CheckCircle2, Clock, AlertTriangle, User } from "lucide-react";

interface Anomaly {
  id: string;
  title: string;
  description: string;
  severity: string;
  status: string;
  resolved_at?: string;
  assignee?: string;
  project_id?: string;
  created_at: string;
}

export default function AnomalyDetailPage({ params }: { params: { id: string } }) {
  const [anomaly, setAnomaly] = useState<Anomaly | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Intégrer avec getAnomaly(params.id)
    // Mock data pour démonstration
    setAnomaly({
      id: params.id,
      title: "Temps de Réponse API Dégradé",
      description: "L'API REST principale présente des temps de réponse anormalement élevés depuis ce matin (>2s). Impact sur l'expérience utilisateur et risque de timeout sur les clients mobiles.",
      severity: "high",
      status: "open",
      assignee: "DevOps Lead - Infrastructure Team",
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

  if (!anomaly) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Anomalie introuvable</h2>
          <p className="text-slate-400 mb-6">Cette anomalie n&apos;existe pas ou a été supprimée</p>
          <Link
            href="/cockpit/anomalies"
            className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux anomalies
          </Link>
        </div>
      </div>
    );
  }

  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case "critical":
        return {
          color: "text-red-500 bg-red-500/10",
          icon: AlertCircle,
          label: "Critique"
        };
      case "high":
        return {
          color: "text-orange-500 bg-orange-500/10",
          icon: AlertTriangle,
          label: "Élevée"
        };
      case "medium":
        return {
          color: "text-yellow-500 bg-yellow-500/10",
          icon: AlertCircle,
          label: "Moyenne"
        };
      case "low":
        return {
          color: "text-blue-500 bg-blue-500/10",
          icon: AlertCircle,
          label: "Faible"
        };
      default:
        return {
          color: "text-slate-500 bg-slate-500/10",
          icon: AlertCircle,
          label: severity
        };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-emerald-500/10 text-emerald-500";
      case "in_progress":
        return "bg-blue-500/10 text-blue-500";
      case "open":
        return "bg-orange-500/10 text-orange-500";
      default:
        return "bg-slate-500/10 text-slate-500";
    }
  };

  const severityConfig = getSeverityConfig(anomaly.severity);
  const SeverityIcon = severityConfig.icon;

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/cockpit/anomalies"
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-400" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">{anomaly.title}</h1>
              <p className="text-slate-400 mt-1">ID: {anomaly.id}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/cockpit/anomalies/${anomaly.id}/edit`}
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
              <p className="text-slate-300 leading-relaxed">{anomaly.description}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Severity Card */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Sévérité</h3>
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-full ${severityConfig.color}`}>
                  <SeverityIcon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{severityConfig.label}</div>
                  <div className="text-sm text-slate-400">Niveau de criticité</div>
                </div>
              </div>
            </div>

            {/* Status Card */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Statut</h3>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(anomaly.status)}`}>
                {anomaly.status}
              </span>
            </div>

            {/* Assignee */}
            {anomaly.assignee && (
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Assigné à</h3>
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-blue-500" />
                  <span className="text-slate-300">{anomaly.assignee}</span>
                </div>
              </div>
            )}

            {/* Dates */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Dates</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-slate-500 mt-0.5" />
                  <div>
                    <div className="text-sm text-slate-400">Créé le</div>
                    <div className="text-slate-300">
                      {new Date(anomaly.created_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                      })}
                    </div>
                  </div>
                </div>
                {anomaly.resolved_at && (
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5" />
                    <div>
                      <div className="text-sm text-slate-400">Résolu le</div>
                      <div className="text-slate-300">
                        {new Date(anomaly.resolved_at).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric"
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
