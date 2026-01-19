'use client';

import { useEffect, useState } from 'react';
import { Committee, CommitteeBriefResponse } from '@/types/cockpit';
import { getCommittees } from '@/lib/dataProvider';
import { Calendar, FileText, TrendingUp, TrendingDown, Minus, Download } from 'lucide-react';


const ORG_ID = process.env.NEXT_PUBLIC_ORGANIZATION_ID || 'demo-org';

export default function CommitteePrepPage() {
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [selectedCommittee, setSelectedCommittee] = useState<Committee | null>(null);
  const [meetingDate, setMeetingDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [brief, setBrief] = useState<CommitteeBriefResponse | null>(null);

  useEffect(() => {
    loadCommittees();
    setMeetingDate(getNextMonday());
  }, []);

  async function loadCommittees() {
    try {
      const data = await getCommittees(ORG_ID);
      setCommittees(data);
      if (data.length > 0) {
        setSelectedCommittee(data[0]);
      }
    } catch (error) {
      console.error('Error loading committees:', error);
    }
  }

  async function generateBrief() {
    if (!selectedCommittee || !meetingDate) return;

    setLoading(true);
    setBrief(null);

    try {
      const res = await fetch('/api/ai/committee-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          committee_id: selectedCommittee.id,
          meeting_date: meetingDate,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setBrief(data.data);
      } else {
        alert('Erreur: ' + data.error);
      }
    } catch (error: any) {
      alert('Erreur: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  function getNextMonday() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + daysUntilMonday);
    return nextMonday.toISOString().split('T')[0];
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      {/* DemoBadge removed */}
      <header className="border-b border-slate-800 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-amber-400" />
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Powalyze</div>
            <div className="text-sm text-slate-300">Préparation de Comité · IA Narrative</div>
            {/* Demo mode badge removed */}
          </div>
        </div>
        <a href="/cockpit-real" className="text-xs text-slate-400 hover:text-slate-300">
          ← Retour au cockpit
        </a>
      </header>

      <main className="flex-1 px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-amber-400" />
            Configuration du Brief
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="committee-select" className="block text-xs text-slate-400 mb-2">Comité</label>
              <select
                id="committee-select"
                value={selectedCommittee?.id || ''}
                onChange={(e) => {
                  const committee = committees.find(c => c.id === e.target.value);
                  setSelectedCommittee(committee || null);
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:border-amber-400 focus:outline-none"
              >
                {committees.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.type})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="meeting-date" className="block text-xs text-slate-400 mb-2">Date de séance</label>
              <input
                id="meeting-date"
                type="date"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={generateBrief}
                disabled={loading || !selectedCommittee || !meetingDate}
                className="w-full bg-amber-400 text-slate-950 font-semibold rounded-lg px-4 py-2 text-sm hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full" />
                    Génération...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4" />
                    Générer le brief
                  </>
                )}
              </button>
            </div>
          </div>

          {selectedCommittee && (
            <div className="mt-4 grid grid-cols-3 gap-4 text-xs">
              <div>
                <div className="text-slate-500">Type</div>
                <div className="text-slate-200">{selectedCommittee.type}</div>
              </div>
              <div>
                <div className="text-slate-500">Fréquence</div>
                <div className="text-slate-200">{selectedCommittee.frequency || 'Non définie'}</div>
              </div>
              <div>
                <div className="text-slate-500">Membres</div>
                <div className="text-slate-200">{selectedCommittee.members?.length || 0} participants</div>
              </div>
            </div>
          )}
        </div>

        {brief && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-100">Synthèse Exécutive</h2>
                <button className="text-xs text-slate-400 hover:text-slate-300 flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  Exporter PDF
                </button>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{brief.executive_summary}</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-slate-100 mb-4">KPIs Clés</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {brief.kpi_dashboard.map((kpi, i) => (
                  <div key={i} className="bg-slate-900 rounded-xl border border-slate-800 p-4">
                    <div className="text-xs text-slate-500 mb-2">{kpi.metric}</div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <div className="text-2xl font-bold text-slate-100">{kpi.value}</div>
                      {kpi.trend === 'up' && <TrendingUp className="h-4 w-4 text-emerald-400" />}
                      {kpi.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-400" />}
                      {kpi.trend === 'stable' && <Minus className="h-4 w-4 text-slate-400" />}
                    </div>
                    <div className={`inline-flex px-2 py-0.5 rounded text-[10px] font-medium ${
                      kpi.status === 'GREEN' ? 'bg-emerald-500/20 text-emerald-300' :
                      kpi.status === 'YELLOW' ? 'bg-amber-400/20 text-amber-300' :
                      kpi.status === 'RED' ? 'bg-red-500/20 text-red-300' :
                      'bg-slate-500/20 text-slate-300'
                    }`}>
                      {kpi.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-slate-100 mb-4">Ordre du Jour</h2>
              <div className="space-y-3">
                {brief.agenda_items.map((item, i) => (
                  <div key={i} className="bg-slate-900 rounded-xl border border-slate-800 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-xs font-mono">#{i + 1}</span>
                        <h3 className="text-sm font-semibold text-slate-100">{item.title}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                          item.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                          item.priority === 'medium' ? 'bg-amber-400/20 text-amber-300' :
                          'bg-slate-500/20 text-slate-300'
                        }`}>
                          {item.priority}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400">
                          {item.type}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {brief.decision_points.length > 0 && (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-slate-100 mb-4">Points de Décision</h2>
                <div className="space-y-4">
                  {brief.decision_points.map((dp, i) => (
                    <div key={i} className="bg-slate-900 rounded-xl border border-slate-800 p-4">
                      <h3 className="text-sm font-semibold text-slate-100 mb-2">{dp.decision.title}</h3>
                      <p className="text-xs text-slate-400 mb-3">{dp.context}</p>
                      
                      <div className="mb-3">
                        <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">Options</div>
                        <div className="space-y-2">
                          {dp.options.map((opt, j) => (
                            <div key={j} className="text-xs text-slate-300 flex gap-2">
                              <span className="text-amber-400">•</span>
                              <span>{opt}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-amber-400/10 border border-amber-400/30 rounded-lg p-3">
                        <div className="text-[10px] uppercase tracking-wider text-amber-400 mb-1">Recommandation</div>
                        <p className="text-xs text-slate-200">{dp.recommendation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!brief && !loading && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center">
            <FileText className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <p className="text-sm text-slate-400">
              Sélectionnez un comité et une date, puis générez le brief exécutif
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
