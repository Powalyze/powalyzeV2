"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getDemoData, CockpitData } from "@/lib/cockpitData";
import {
  Briefcase,
  TrendingUp,
  AlertTriangle,
  Clock,
  DollarSign,
  Users,
  Activity,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";

export default function PortfolioPage() {
  const router = useRouter();
  const [data, setData] = useState<CockpitData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load demo data
    setTimeout(() => {
      setData(getDemoData());
      setLoading(false);
    }, 500);
  }, []);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white/60">Chargement du portfolio...</p>
          </div>
        </div>
      </div>
    );
  }

  const totalBudget = data.projects.reduce((sum, p) => {
    const budgetValue = parseFloat(p.budget.replace(/[^\d.]/g, ""));
    return sum + (isNaN(budgetValue) ? 0 : budgetValue);
  }, 0);

  const avgProgress =
    data.projects.reduce((sum, p) => sum + p.progress, 0) / data.projects.length;

  const greenProjects = data.projects.filter((p) => p.status === "green").length;
  const orangeProjects = data.projects.filter((p) => p.status === "orange").length;
  const redProjects = data.projects.filter((p) => p.status === "red").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Vue Portfolio
            </h1>
            <p className="text-slate-400">
              Vue d'ensemble de tous vos projets et indicateurs clés
            </p>
          </div>
          <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <span className="text-blue-400 font-semibold">Mode Démo</span>
          </div>
        </div>

        {/* KPIs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Projects */}
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Briefcase className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-white">{data.projects.length}</p>
                <p className="text-sm text-slate-400">Projets actifs</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400">+2 ce mois</span>
            </div>
          </div>

          {/* Total Budget */}
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6 hover:border-emerald-500/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-500/10 rounded-lg">
                <DollarSign className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-white">{totalBudget.toFixed(1)}M€</p>
                <p className="text-sm text-slate-400">Budget total</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-400">85% consommé</span>
            </div>
          </div>

          {/* Average Progress */}
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6 hover:border-amber-500/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-500/10 rounded-lg">
                <Activity className="w-6 h-6 text-amber-400" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-white">{avgProgress.toFixed(0)}%</p>
                <p className="text-sm text-slate-400">Avancement moyen</p>
              </div>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 mt-2">
              <div
                className="bg-gradient-to-r from-amber-500 to-amber-400 h-2 rounded-full transition-all"
                style={{ width: `${avgProgress}%` }}
              />
            </div>
          </div>

          {/* Critical Risks */}
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6 hover:border-red-500/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-500/10 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-white">{data.metrics.criticalRisks}</p>
                <p className="text-sm text-slate-400">Risques critiques</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span className="text-sm text-red-400">Action requise</span>
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Distribution des Statuts</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <CheckCircle2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-400">{greenProjects}</p>
              <p className="text-sm text-slate-400">En bonne voie</p>
            </div>
            <div className="text-center p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
              <AlertCircle className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-orange-400">{orangeProjects}</p>
              <p className="text-sm text-slate-400">Attention requise</p>
            </div>
            <div className="text-center p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <XCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-400">{redProjects}</p>
              <p className="text-sm text-slate-400">En difficulté</p>
            </div>
          </div>
        </div>

        {/* Projects Table */}
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-xl font-bold text-white">Tous les Projets</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Projet</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Statut</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Avancement</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Budget</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Équipe</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Sponsor</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Échéance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {data.projects.map((project) => (
                  <tr 
                    key={project.id} 
                    className="hover:bg-slate-800/30 transition-colors cursor-pointer"
                    onClick={() => router.push(`/cockpit/projects/${project.id}`)}
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">{project.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            project.status === "green"
                              ? "bg-green-400"
                              : project.status === "orange"
                              ? "bg-orange-400"
                              : "bg-red-400"
                          }`}
                        />
                        <span className="text-sm text-slate-300 capitalize">
                          {project.status === "green"
                            ? "Nominal"
                            : project.status === "orange"
                            ? "Vigilance"
                            : "Critique"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-slate-800 rounded-full h-2 min-w-[80px]">
                          <div
                            className={`h-2 rounded-full ${
                              project.progress >= 70
                                ? "bg-green-500"
                                : project.progress >= 40
                                ? "bg-orange-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-slate-300 w-10 text-right">
                          {project.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{project.budget}</td>
                    <td className="px-6 py-4 text-slate-300">{project.team}</td>
                    <td className="px-6 py-4 text-slate-300">{project.sponsor}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{project.deadline}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-6">
            <Users className="w-8 h-8 text-blue-400 mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">Gestion des Ressources</h3>
            <p className="text-sm text-slate-400 mb-4">
              Optimisez l'allocation de vos équipes sur les projets prioritaires
            </p>
            <button 
              onClick={() => router.push('/cockpit/ressources')}
              className="text-blue-400 hover:text-blue-300 text-sm font-semibold"
            >
              Voir les ressources →
            </button>
          </div>

          <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20 rounded-xl p-6">
            <TrendingUp className="w-8 h-8 text-emerald-400 mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">Analyse Budgétaire</h3>
            <p className="text-sm text-slate-400 mb-4">
              Suivez les dépenses et identifiez les opportunités d'économies
            </p>
            <button 
              onClick={() => router.push('/cockpit/budget')}
              className="text-emerald-400 hover:text-emerald-300 text-sm font-semibold"
            >
              Voir le budget →
            </button>
          </div>

          <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/10 border border-amber-500/20 rounded-xl p-6">
            <AlertTriangle className="w-8 h-8 text-amber-400 mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">Gestion des Risques</h3>
            <p className="text-sm text-slate-400 mb-4">
              Anticipez et mitigez les risques critiques de votre portfolio
            </p>
            <button 
              onClick={() => router.push('/cockpit/risques')}
              className="text-amber-400 hover:text-amber-300 text-sm font-semibold"
            >
              Voir les risques →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
