"use client";

import { useEffect, useState } from "react";
import { FileText, Calendar, Download, Plus, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    try {
      const res = await fetch('/api/reports/list');
      if (res.ok) {
        const data = await res.json();
        setReports(data.reports || []);
      }
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  }

  async function generateReport() {
    setGenerating(true);
    try {
      const res = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportType: 'monthly' })
      });

      if (res.ok) {
        const data = await res.json();
        window.location.href = data.report_url;
      }
    } catch (err) {
      console.error('Failed to generate report:', err);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="border-b border-slate-800/50 bg-slate-900/30 backdrop-blur">
        <div className="max-w-[1200px] mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Rapports automatiques</h1>
              <p className="text-slate-400 mt-1">Historique des rapports exécutifs générés</p>
            </div>
            <button
              onClick={generateReport}
              disabled={generating}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-semibold shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all disabled:opacity-50"
            >
              {generating ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Génération...
                </>
              ) : (
                <>
                  <Plus size={20} />
                  Générer un rapport
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="animate-spin text-amber-400 mx-auto mb-4" size={48} />
            <p className="text-slate-400">Chargement des rapports...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="text-slate-600 mx-auto mb-4" size={64} />
            <h2 className="text-xl font-bold text-slate-300 mb-2">Aucun rapport généré</h2>
            <p className="text-slate-400 mb-6">Créez votre premier rapport automatique</p>
            <button
              onClick={generateReport}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold transition-all"
            >
              Générer maintenant
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map(report => (
              <Link
                key={report.id}
                href={`/reports/${report.id}`}
                className="block p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/50 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-amber-500/10">
                      <FileText className="text-amber-400" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-zinc-50 mb-1">{report.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          {new Date(report.created_at).toLocaleDateString()}
                        </div>
                        <div className="px-2 py-1 rounded bg-slate-800 text-xs">
                          {report.type}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Download className="text-slate-400 hover:text-amber-400 transition-colors" size={20} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
