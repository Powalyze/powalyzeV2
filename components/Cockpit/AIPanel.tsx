'use client';

import { useState } from 'react';
import { Project } from '@/types/cockpit';

interface Props {
  organization_id: string;
  selectedProject: Project | null;
}

export default function AIPanel({ organization_id, selectedProject }: Props) {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<any>(null);

  async function handleGenerate() {
    setLoading(true);
    setSummary(null);
    try {
      const res = await fetch('/api/ai/executive-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organization_id,
          scope: selectedProject ? 'project' : 'all',
          filters: selectedProject ? {
            project_ids: [selectedProject.id],
          } : undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSummary(data.data);
      } else {
        setSummary({ error: data.error });
      }
    } catch (e: any) {
      setSummary({ error: e.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-3 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
          IA Narrative · Synthèse Exécutive
        </h3>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="text-[10px] px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-semibold disabled:opacity-50 hover:bg-amber-500 transition"
        >
          {loading ? 'Génération...' : 'Générer'}
        </button>
      </div>

      {summary ? (
        summary.error ? (
          <div className="text-[11px] text-red-400">{summary.error}</div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="text-[11px] text-slate-200 leading-relaxed">
              {summary.summary}
            </div>

            {summary.critical_points && summary.critical_points.length > 0 && (
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">
                  Points Critiques
                </div>
                <ul className="text-[11px] text-slate-300 space-y-1">
                  {summary.critical_points.map((point: string, i: number) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-amber-400">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {summary.recommendations && summary.recommendations.length > 0 && (
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">
                  Recommandations
                </div>
                <ul className="text-[11px] text-slate-300 space-y-1">
                  {summary.recommendations.map((rec: string, i: number) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-emerald-400">→</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )
      ) : (
        <div className="text-[11px] text-slate-400">
          Générez une synthèse exécutive basée sur les données du cockpit.
        </div>
      )}
    </div>
  );
}
