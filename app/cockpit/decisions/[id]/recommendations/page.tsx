"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { BackButton } from "@/components/BackButton";
import { Loader2, Sparkles, CheckCircle, AlertCircle, TrendingUp } from "lucide-react";

export default function DecisionRecommendationsPage() {
  const params = useParams();
  const id = params?.id as string;
  const [decision, setDecision] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadRecommendations();
    }
  }, [id]);

  async function loadRecommendations() {
    setLoading(true);
    try {
      // Charger la décision
      const decisionRes = await fetch(`/api/cockpit/decisions/${id}`);
      const decisionData = await decisionRes.json();
      setDecision(decisionData);

      // Charger les recommandations IA
      const recRes = await fetch('/api/ai/decision-support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decisionId: id }),
      });
      const recData = await recRes.json();
      setRecommendations(recData);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-amber-400 mx-auto mb-4" size={48} />
          <p className="text-slate-400">Analyse IA en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="border-b border-slate-800/50 bg-slate-900/30 backdrop-blur">
        <div className="max-w-[1200px] mx-auto px-6 py-6">
          <BackButton fallback={`/cockpit/decisions/${id}`} />
          <div className="flex items-center gap-3 mt-2">
            <Sparkles className="text-amber-400" size={32} />
            <h1 className="text-3xl font-bold">Recommandations IA</h1>
          </div>
          {decision && (
            <p className="text-slate-400 mt-2">{decision.title}</p>
          )}
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-8 space-y-6">
        {recommendations ? (
          <>
            {/* Recommandation principale */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-amber-500/10 to-sky-500/10 border border-amber-500/30">
              <div className="flex items-start gap-4 mb-4">
                <div className={`p-3 rounded-full ${
                  recommendations.recommendation === 'approve' ? 'bg-green-500/20' :
                  recommendations.recommendation === 'reject' ? 'bg-red-500/20' :
                  'bg-yellow-500/20'
                }`}>
                  {recommendations.recommendation === 'approve' ? (
                    <CheckCircle className="text-green-400" size={24} />
                  ) : recommendations.recommendation === 'reject' ? (
                    <AlertCircle className="text-red-400" size={24} />
                  ) : (
                    <AlertCircle className="text-yellow-400" size={24} />
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-2">
                    {recommendations.recommendation === 'approve' ? 'Approuver' :
                     recommendations.recommendation === 'reject' ? 'Rejeter' :
                     'Approuver sous conditions'}
                  </h2>
                  <p className="text-slate-300 leading-relaxed">{recommendations.rationale}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-4 rounded-lg bg-slate-900/50">
                  <div className="text-sm text-slate-400 mb-1">Score de faisabilité</div>
                  <div className="text-2xl font-bold text-amber-400">{recommendations.feasibility_score}%</div>
                </div>
                <div className="p-4 rounded-lg bg-slate-900/50">
                  <div className="text-sm text-slate-400 mb-1">Impact stratégique</div>
                  <div className="text-2xl font-bold text-sky-400">{recommendations.impact_score}%</div>
                </div>
              </div>
            </div>

            {/* Risques identifiés */}
            {recommendations.risks_identified && recommendations.risks_identified.length > 0 && (
              <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
                <h2 className="text-xl font-bold mb-4">Risques identifiés</h2>
                <div className="space-y-2">
                  {recommendations.risks_identified.map((risk: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-red-500/10">
                      <AlertCircle className="text-red-400 flex-shrink-0 mt-1" size={16} />
                      <span className="text-slate-300">{risk}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Alternatives */}
            {recommendations.alternatives && recommendations.alternatives.length > 0 && (
              <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
                <h2 className="text-xl font-bold mb-4">Alternatives proposées</h2>
                <div className="space-y-4">
                  {recommendations.alternatives.map((alt: any, i: number) => (
                    <div key={i} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-zinc-50">{alt.option}</h3>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20">
                          <TrendingUp size={14} className="text-amber-400" />
                          <span className="text-sm font-medium text-amber-400">{alt.score}%</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-slate-400 mb-1">✅ Avantages</div>
                          <div className="text-slate-300">{alt.pros}</div>
                        </div>
                        <div>
                          <div className="text-slate-400 mb-1">⚠️ Inconvénients</div>
                          <div className="text-slate-300">{alt.cons}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Confiance */}
            <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800 text-center">
              <div className="text-sm text-slate-400 mb-1">Niveau de confiance de l'analyse</div>
              <div className="text-2xl font-bold text-amber-400">{(recommendations.confidence * 100).toFixed(0)}%</div>
            </div>
          </>
        ) : (
          <div className="p-12 rounded-xl bg-slate-900/50 border border-slate-800 text-center">
            <Sparkles className="text-slate-600 mx-auto mb-4" size={48} />
            <p className="text-slate-400">Aucune recommandation disponible</p>
          </div>
        )}
      </div>
    </div>
  );
}
