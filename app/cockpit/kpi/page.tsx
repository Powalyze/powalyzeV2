"use client";

import { CockpitShell } from "@/components/cockpit/CockpitShell";
import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
  AlertTriangle,
  CheckCircle2,
  Clock,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react";

interface KPIMetric {
  id: string;
  title: string;
  value: string | number;
  change: number;
  trend: "up" | "down" | "stable";
  icon: any;
  color: string;
}

export default function KPIDashboard() {
  const [metrics, setMetrics] = useState<KPIMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadKPIData();
  }, []);

  async function loadKPIData() {
    // Données demo
    setMetrics([
      {
        id: "portfolio_health",
        title: "Santé du Portefeuille",
        value: "87%",
        change: 5.2,
        trend: "up",
        icon: Activity,
        color: "emerald",
      },
      {
        id: "budget_utilization",
        title: "Utilisation Budget",
        value: "€4.2M / €5.5M",
        change: 76,
        trend: "up",
        icon: DollarSign,
        color: "blue",
      },
      {
        id: "resource_allocation",
        title: "Allocation Ressources",
        value: "92%",
        change: -3.1,
        trend: "down",
        icon: Users,
        color: "purple",
      },
      {
        id: "project_velocity",
        title: "Vélocité Moyenne",
        value: "45 pts/sprint",
        change: 8.5,
        trend: "up",
        icon: TrendingUp,
        color: "amber",
      },
      {
        id: "risk_exposure",
        title: "Exposition aux Risques",
        value: "12 risques actifs",
        change: -15.3,
        trend: "down",
        icon: AlertTriangle,
        color: "red",
      },
      {
        id: "on_time_delivery",
        title: "Livraison à Temps",
        value: "94%",
        change: 2.8,
        trend: "up",
        icon: CheckCircle2,
        color: "emerald",
      },
      {
        id: "avg_project_duration",
        title: "Durée Moyenne Projet",
        value: "4.2 mois",
        change: -8.2,
        trend: "down",
        icon: Clock,
        color: "blue",
      },
      {
        id: "roi",
        title: "ROI Moyen",
        value: "285%",
        change: 12.5,
        trend: "up",
        icon: Target,
        color: "emerald",
      },
    ]);
    setLoading(false);
  }

  function getColorClass(color: string, type: "bg" | "text" | "border"): string {
    const colors: Record<string, Record<string, string>> = {
      emerald: { bg: "bg-emerald-500/10", text: "text-emerald-500", border: "border-emerald-500" },
      blue: { bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500" },
      purple: { bg: "bg-purple-500/10", text: "text-purple-500", border: "border-purple-500" },
      amber: { bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500" },
      red: { bg: "bg-red-500/10", text: "text-red-500", border: "border-red-500" },
    };
    return colors[color]?.[type] || "";
  }

  if (loading) {
    return (
      <CockpitShell>
        <div className="p-8 flex items-center justify-center">
          <div className="text-slate-400">Chargement des KPI...</div>
        </div>
      </CockpitShell>
    );
  }

  return (
    <CockpitShell>
      <div className="min-h-screen bg-slate-950 p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Indicateurs Clés de Performance
          </h1>
          <p className="text-slate-400">
            Vue d'ensemble des métriques stratégiques de votre portefeuille
          </p>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-amber-500/50 transition-all"
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-lg ${getColorClass(metric.color, "bg")} flex items-center justify-center mb-4`}>
                  <Icon className={`${getColorClass(metric.color, "text")}`} size={24} />
                </div>

                {/* Title */}
                <h3 className="text-slate-400 text-sm font-medium mb-2">{metric.title}</h3>

                {/* Value */}
                <div className="flex items-end justify-between">
                  <div className="text-2xl font-bold text-white">{metric.value}</div>
                  
                  {/* Trend */}
                  <div
                    className={`flex items-center gap-1 text-sm font-medium ${
                      metric.trend === "up"
                        ? "text-emerald-500"
                        : metric.trend === "down"
                        ? "text-red-500"
                        : "text-slate-500"
                    }`}
                  >
                    {metric.trend === "up" ? (
                      <TrendingUp size={16} />
                    ) : metric.trend === "down" ? (
                      <TrendingDown size={16} />
                    ) : null}
                    {Math.abs(metric.change)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Portfolio Health Breakdown */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Répartition Santé Projets</h3>
              <PieChart className="text-slate-400" size={20} />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-slate-300">Verts (Sains)</span>
                </div>
                <div className="text-white font-semibold">8 projets (67%)</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-slate-300">Jaunes (Attention)</span>
                </div>
                <div className="text-white font-semibold">3 projets (25%)</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-slate-300">Rouges (Critique)</span>
                </div>
                <div className="text-white font-semibold">1 projet (8%)</div>
              </div>
            </div>
          </div>

          {/* Chart 2: Budget Evolution */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Évolution Budget</h3>
              <BarChart3 className="text-slate-400" size={20} />
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300">Budget Planifié</span>
                  <span className="text-white font-semibold">€5.5M</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-3">
                  <div className="bg-blue-500 h-3 rounded-full" style={{ width: "100%" }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300">Budget Consommé</span>
                  <span className="text-white font-semibold">€4.2M</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-3">
                  <div className="bg-emerald-500 h-3 rounded-full" style={{ width: "76%" }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300">Budget Restant</span>
                  <span className="text-white font-semibold">€1.3M</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-3">
                  <div className="bg-amber-500 h-3 rounded-full" style={{ width: "24%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CockpitShell>
  );
}
