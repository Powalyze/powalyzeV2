"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Clock, AlertTriangle, Calendar } from "lucide-react";

interface Report {
  id: string;
  title: string;
  content: string;
  report_type: string;
  generated_at?: string;
  project_id?: string;
  created_at: string;
}

export default function ReportDetailPage({ params }: { params: { id: string } }) {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Intégrer avec getReport(params.id)
    // Mock data pour démonstration
    setReport({
      id: params.id,
      title: "Rapport Exécutif Q4 2025",
      content: "# Synthèse Exécutive\n\nLe quatrième trimestre 2025 marque une période de transformation majeure pour notre portefeuille de projets...\n\n## Projets en Cours\n\n- **Powalyze v2.0**: 85% complété, livraison prévue fin janvier\n- **Migration Azure**: Phase 2 initiée, succès critique\n- **CRM Integration**: Beta testing en cours\n\n## Risques Identifiés\n\n3 risques critiques nécessitent attention immédiate...",
      report_type: "executive",
      generated_at: new Date().toISOString(),
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

  if (!report) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Rapport introuvable</h2>
          <p className="text-slate-400 mb-6">Ce rapport n&apos;existe pas ou a été supprimé</p>
          <Link
            href="/cockpit/rapports"
            className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux rapports
          </Link>
        </div>
      </div>
    );
  }

  const getReportTypeConfig = (type: string) => {
    switch (type) {
      case "executive":
        return {
          color: "bg-purple-500/10 text-purple-500",
          label: "Exécutif"
        };
      case "technical":
        return {
          color: "bg-blue-500/10 text-blue-500",
          label: "Technique"
        };
      case "financial":
        return {
          color: "bg-emerald-500/10 text-emerald-500",
          label: "Financier"
        };
      case "project":
        return {
          color: "bg-cyan-500/10 text-cyan-500",
          label: "Projet"
        };
      case "risk":
        return {
          color: "bg-orange-500/10 text-orange-500",
          label: "Risques"
        };
      default:
        return {
          color: "bg-slate-500/10 text-slate-500",
          label: "Général"
        };
    }
  };

  const reportTypeConfig = getReportTypeConfig(report.report_type);

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/cockpit/rapports"
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-400" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">{report.title}</h1>
              <p className="text-slate-400 mt-1">ID: {report.id}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
              Exporter PDF
            </button>
            <Link
              href={`/cockpit/rapports/${report.id}/edit`}
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
            {/* Report Content */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-6 h-6 text-blue-500" />
                <h2 className="text-xl font-semibold text-white">Contenu du Rapport</h2>
              </div>
              <div className="prose prose-invert max-w-none">
                <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {report.content}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Report Type */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Type de Rapport</h3>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${reportTypeConfig.color}`}>
                {reportTypeConfig.label}
              </span>
            </div>

            {/* Dates */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Informations</h3>
              <div className="space-y-3">
                {report.generated_at && (
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-emerald-500 mt-0.5" />
                    <div>
                      <div className="text-sm text-slate-400">Généré le</div>
                      <div className="text-slate-300">
                        {new Date(report.generated_at).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
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
                      {new Date(report.created_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Actions Rapides</h3>
              <div className="space-y-2">
                <button className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors text-sm">
                  Copier le contenu
                </button>
                <button className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors text-sm">
                  Envoyer par email
                </button>
                <button className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors text-sm">
                  Partager le lien
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
