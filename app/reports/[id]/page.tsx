"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FileText, Calendar, TrendingUp, AlertTriangle, Target, DollarSign, Loader2 } from "lucide-react";

export default function ReportPage() {
  const params = useParams();
  const reportId = params.id;

  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadReport() {
      try {
        const res = await fetch(`/api/reports/${reportId}`);
        if (!res.ok) throw new Error('Rapport non trouvé');
        const data = await res.json();
        setReport(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (reportId) {
      loadReport();
    }
  }, [reportId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-amber-400" size={48} />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Rapport non trouvé</h2>
          <p className="text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  const { content } = report;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-slate-800/50 bg-slate-900/30 backdrop-blur">
        <div className="max-w-[1200px] mx-auto px-6 py-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <FileText className="text-amber-400" size={32} />
                <h1 className="text-3xl font-bold">{report.title}</h1>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  {content.period}
                </div>
                <div>Généré le {new Date(content.generated_at).toLocaleString()}</div>
              </div>
            </div>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold transition-all"
            >
              Imprimer PDF
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-6 py-8 space-y-8">
        {/* Highlights Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCard
            icon={Target}
            label="Projets actifs"
            value={content.highlights.active_projects}
            color="amber"
          />
          <MetricCard
            icon={TrendingUp}
            label="Alignement stratégique"
            value={`${content.highlights.strategic_alignment}%`}
            color="green"
          />
          <MetricCard
            icon={DollarSign}
            label="Variance budgétaire"
            value={`${content.highlights.budget_variance}%`}
            color={parseFloat(content.highlights.budget_variance) > 10 ? 'red' : 'green'}
          />
          <MetricCard
            icon={AlertTriangle}
            label="Risques critiques"
            value={content.highlights.critical_risks}
            color="red"
          />
          <MetricCard
            icon={FileText}
            label="Décisions en attente"
            value={content.highlights.pending_decisions}
            color="orange"
          />
          <MetricCard
            icon={AlertTriangle}
            label="Anomalies non résolues"
            value={content.highlights.unresolved_anomalies}
            color={content.highlights.unresolved_anomalies > 0 ? 'red' : 'green'}
          />
        </div>

        {/* AI Summary */}
        {content.ai_summary && (
          <div className="p-6 rounded-xl bg-gradient-to-br from-amber-500/10 to-sky-500/10 border border-amber-500/30">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span>🤖</span> Synthèse IA
            </h2>
            <div className="space-y-4">
              <SummarySection title="Vue d'ensemble" content={content.ai_summary.executive_summary} />
              <SummarySection title="Risques & alertes" content={content.ai_summary.risks_summary} />
              <SummarySection title="Décisions" content={content.ai_summary.decisions_summary} />
              <SummarySection title="Priorités" content={content.ai_summary.priorities_summary} />
            </div>
          </div>
        )}

        {/* Top Projects */}
        {content.top_projects && content.top_projects.length > 0 && (
          <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
            <h2 className="text-2xl font-bold mb-6">Top 5 Projets stratégiques</h2>
            <div className="space-y-3">
              {content.top_projects.map((project: any, idx: number) => (
                <div key={idx} className="p-4 rounded-lg bg-slate-800/50 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-zinc-50">{project.name}</div>
                    <div className="text-sm text-slate-400">Alignement: {project.alignment}%</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-400">Variance budget</div>
                    <div className={`text-lg font-bold ${parseFloat(project.budget_variance) > 10 ? 'text-red-400' : 'text-green-400'}`}>
                      {project.budget_variance}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Risks */}
        {content.top_risks && content.top_risks.length > 0 && (
          <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
            <h2 className="text-2xl font-bold mb-6">Top 5 Risques</h2>
            <div className="space-y-3">
              {content.top_risks.map((risk: any, idx: number) => (
                <div key={idx} className="p-4 rounded-lg bg-slate-800/50">
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-medium text-zinc-50">{risk.title}</div>
                    <div className={`text-xs px-2 py-1 rounded ${
                      risk.severity > 70 ? 'bg-red-500/20 text-red-400' :
                      risk.severity > 50 ? 'bg-orange-500/20 text-orange-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      Sévérité: {risk.severity}
                    </div>
                  </div>
                  {risk.mitigation && (
                    <div className="text-sm text-slate-400">Mitigation: {risk.mitigation}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, color }: { 
  icon: any; 
  label: string; 
  value: string | number; 
  color: string; 
}) {
  const colorClasses = {
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    green: 'text-green-400 bg-green-500/10 border-green-500/30',
    red: 'text-red-400 bg-red-500/10 border-red-500/30',
    orange: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  }[color] || 'text-slate-400 bg-slate-500/10 border-slate-500/30';

  return (
    <div className={`p-6 rounded-xl border ${colorClasses}`}>
      <Icon className="mb-3" size={24} />
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm opacity-70">{label}</div>
    </div>
  );
}

function SummarySection({ title, content }: { title: string; content: string }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-amber-400 mb-2">{title}</h3>
      <p className="text-sm text-slate-300 leading-relaxed">{content}</p>
    </div>
  );
}
