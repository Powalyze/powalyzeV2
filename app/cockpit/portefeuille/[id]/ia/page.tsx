"use client";

import { useEffect, useState } from "react";
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Target, Zap } from "lucide-react";
import type { AIProjectAnalysis } from "@/actions/ai";

export default function ProjectAIPage({ params }: { params: { id: string } }) {
  const [analysis, setAnalysis] = useState<AIProjectAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - TODO: appeler analyzeProject(params.id)
    setAnalysis({
      projectId: params.id,
      projectName: "Projet Analyse IA",
      globalRiskScore: 58,
      predictedStatus: "at_risk",
      priorityRisks: [
        { title: "Dépassement Budget", impact: 4, probability: 3, score: 12 },
        { title: "Retard Sprint", impact: 3, probability: 4, score: 12 }
      ],
      criticalDecisions: [
        { title: "Architecture Cloud", urgency: "high", impact: "HIGH" }
      ],
      predictedAnomalies: [
        { area: "Budget", likelihood: 0.65, description: "Dérive probable dans 30j" }
      ],
      recommendations: [
        {
          priority: "critical",
          category: "Risques",
          action: "Traiter risques à impact élevé",
          impact: "Réduction 60% du score"
        }
      ],
      trajectory: {
        budget: { status: "yellow", drift: 12 },
        timeline: { status: "yellow", delay: 5 },
        quality: { status: "green", issues: 2 }
      }
    });
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Chargement de l&apos;analyse IA...</div>
      </div>
    );
  }

  if (!analysis) {
    return <div className="min-h-screen bg-slate-950 p-6"><div className="text-red-500">Erreur de chargement</div></div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on_track": return "text-emerald-500 bg-emerald-500/10";
      case "at_risk": return "text-orange-500 bg-orange-500/10";
      case "critical": return "text-red-500 bg-red-500/10";
      default: return "text-slate-500 bg-slate-500/10";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-purple-500/10 rounded-xl">
            <Brain className="w-8 h-8 text-purple-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">IA Prédictive</h1>
            <p className="text-slate-400">Analyse intelligente du projet</p>
          </div>
        </div>

        {/* Score Global */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <div className="text-center">
              <div className={`text-5xl font-bold mb-2 ${analysis.globalRiskScore > 70 ? "text-red-500" : analysis.globalRiskScore > 40 ? "text-orange-500" : "text-emerald-500"}`}>
                {analysis.globalRiskScore}
              </div>
              <div className="text-slate-400">Score de Risque</div>
            </div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <div className={`text-center px-4 py-2 rounded-full ${getStatusColor(analysis.predictedStatus)}`}>
              <div className="text-lg font-semibold">{analysis.predictedStatus}</div>
            </div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div><div className={`w-3 h-3 rounded-full mx-auto ${analysis.trajectory.budget.status === "green" ? "bg-emerald-500" : analysis.trajectory.budget.status === "yellow" ? "bg-yellow-500" : "bg-red-500"}`}></div><div className="text-xs text-slate-400 mt-1">Budget</div></div>
              <div><div className={`w-3 h-3 rounded-full mx-auto ${analysis.trajectory.timeline.status === "green" ? "bg-emerald-500" : analysis.trajectory.timeline.status === "yellow" ? "bg-yellow-500" : "bg-red-500"}`}></div><div className="text-xs text-slate-400 mt-1">Délais</div></div>
              <div><div className={`w-3 h-3 rounded-full mx-auto ${analysis.trajectory.quality.status === "green" ? "bg-emerald-500" : analysis.trajectory.quality.status === "yellow" ? "bg-yellow-500" : "bg-red-500"}`}></div><div className="text-xs text-slate-400 mt-1">Qualité</div></div>
            </div>
          </div>
        </div>

        {/* Recommandations */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-5 h-5 text-purple-500" />
              <h2 className="text-xl font-semibold text-white">Recommandations IA</h2>
            </div>
            <div className="space-y-3">
              {analysis.recommendations.map((rec, idx) => (
                <div key={idx} className="bg-slate-800/50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Zap className={`w-5 h-5 mt-0.5 ${rec.priority === "critical" ? "text-red-500" : rec.priority === "high" ? "text-orange-500" : "text-blue-500"}`} />
                    <div>
                      <div className="font-medium text-white">{rec.action}</div>
                      <div className="text-sm text-slate-400 mt-1">{rec.impact}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <h2 className="text-xl font-semibold text-white">Risques Prioritaires</h2>
            </div>
            <div className="space-y-2">
              {analysis.priorityRisks.slice(0, 3).map((risk, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <span className="text-slate-300">{risk.title}</span>
                  <span className="text-sm font-mono text-orange-500">{risk.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
