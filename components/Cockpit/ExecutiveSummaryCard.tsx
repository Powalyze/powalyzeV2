"use client";

import { useState } from "react";
import { Brain, Loader2 } from "lucide-react";
import { safeFetch } from "@/lib/safeFetch";

type Props = {
  tenantId?: string;
};

type AISummary = {
  executive_summary: string;
  risks_summary: string;
  decisions_summary: string;
  priorities_summary: string;
};

export function ExecutiveSummaryCard({ tenantId }: Props) {
  const [summary, setSummary] = useState<AISummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      if (tenantId) {
        headers['x-tenant-id'] = tenantId;
      }
      
      const res = await safeFetch('/api/ai/summary', { 
        method: 'POST',
        headers
      });
      
      if (!res.ok) {
        throw new Error('Failed to generate summary');
      }

      const data = await res.json();
      setSummary(data);
    } catch (err: any) {
      setError(err.message);
      console.error('[ExecutiveSummary] Error:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 rounded-xl bg-gradient-to-br from-amber-500/10 to-sky-500/10 border border-amber-500/30">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-zinc-50 mb-1">Résumé exécutif IA</h2>
          <p className="text-sm text-slate-400">Synthèse narrative générée automatiquement</p>
        </div>
        <Brain className="text-amber-400" size={24} />
      </div>

      <button
        onClick={generate}
        disabled={loading}
        className="w-full mb-6 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-semibold text-sm shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={16} />
            Génération en cours...
          </>
        ) : (
          'Générer le résumé exécutif'
        )}
      </button>

      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      {summary && (
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-amber-400 mb-2">📊 Vue d'ensemble</h3>
            <p className="text-sm text-slate-300 leading-relaxed">{summary.executive_summary}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-amber-400 mb-2">⚠️ Risques & alertes</h3>
            <p className="text-sm text-slate-300 leading-relaxed">{summary.risks_summary}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-amber-400 mb-2">✅ Décisions</h3>
            <p className="text-sm text-slate-300 leading-relaxed">{summary.decisions_summary}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-amber-400 mb-2">🎯 Priorités</h3>
            <p className="text-sm text-slate-300 leading-relaxed">{summary.priorities_summary}</p>
          </div>
        </div>
      )}
    </div>
  );
}
