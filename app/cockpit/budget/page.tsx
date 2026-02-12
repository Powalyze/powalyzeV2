"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getDemoData } from "@/lib/cockpitData";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  ArrowLeft,
  Download,
  Filter,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function BudgetPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const demoData = getDemoData();
      
      // Calculate budget data
      const projects = demoData.projects.map((p) => ({
        ...p,
        budgetValue: parseFloat(p.budget.replace(/[^\d.]/g, ''))
      }));

      const totalBudget = projects.reduce((sum, p) => sum + p.budgetValue, 0);
      const consumedBudget = totalBudget * 0.68; // 68% consommé
      const remainingBudget = totalBudget - consumedBudget;

      // Budget by project
      const budgetByProject = projects.map(p => ({
        name: p.name.substring(0, 25) + '...',
        budget: p.budgetValue,
        consumed: p.budgetValue * (p.progress / 100),
        remaining: p.budgetValue * (1 - p.progress / 100),
      }));

      // Budget by team
      const teams = Array.from(new Set(projects.map(p => p.team)));
      const budgetByTeam = teams.map(team => {
        const teamProjects = projects.filter(p => p.team === team);
        const teamBudget = teamProjects.reduce((sum, p) => sum + p.budgetValue, 0);
        return {
          name: team,
          budget: teamBudget,
          projects: teamProjects.length,
        };
      });

      // Monthly spending trend
      const monthlyTrend = [
        { month: 'Sep', spent: 0.4, forecast: 0.4 },
        { month: 'Oct', spent: 0.8, forecast: 0.8 },
        { month: 'Nov', spent: 1.3, forecast: 1.2 },
        { month: 'Déc', spent: 1.9, forecast: 1.8 },
        { month: 'Jan', spent: 2.6, forecast: 2.5 },
        { month: 'Fév', spent: 3.4, forecast: 3.2 },
        { month: 'Mar', spent: null, forecast: 4.0 },
        { month: 'Avr', spent: null, forecast: 4.8 },
      ];

      setData({
        totalBudget,
        consumedBudget,
        remainingBudget,
        consumedPercentage: (consumedBudget / totalBudget) * 100,
        projects: budgetByProject,
        teams: budgetByTeam,
        monthlyTrend,
      });

      setLoading(false);
    }, 500);
  }, []);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white/60">Chargement du budget...</p>
          </div>
        </div>
      </div>
    );
  }

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">Analyse Budgétaire</h1>
            <p className="text-slate-400">
              Vue d'ensemble de la consommation budgétaire du portfolio
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors flex items-center gap-2">
              <Filter size={18} />
              Filtres
            </button>
            <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors flex items-center gap-2">
              <Download size={18} />
              Exporter
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{data.totalBudget.toFixed(1)}M€</p>
            <p className="text-sm text-slate-400 mt-1">Budget Total</p>
          </div>

          <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-500/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
            <p className="text-3xl font-bold text-emerald-400">{data.consumedBudget.toFixed(1)}M€</p>
            <p className="text-sm text-slate-400 mt-1">Consommé ({data.consumedPercentage.toFixed(0)}%)</p>
          </div>

          <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-500/10 rounded-lg">
                <BarChart3 className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <p className="text-3xl font-bold text-amber-400">{data.remainingBudget.toFixed(1)}M€</p>
            <p className="text-sm text-slate-400 mt-1">Restant ({(100 - data.consumedPercentage).toFixed(0)}%)</p>
          </div>

          <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-500/10 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">2</p>
            <p className="text-sm text-slate-400 mt-1">Projets en dépassement</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Budget by Team */}
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <PieChartIcon className="w-5 h-5" />
              Budget par Équipe
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.teams}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, budget }) => `${name}: ${budget.toFixed(1)}M€`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="budget"
                >
                  {data.teams.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => `${value.toFixed(2)}M€`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Trend */}
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Évolution Mensuelle
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" label={{ value: 'M€', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                <Legend />
                <Line type="monotone" dataKey="spent" stroke="#10b981" strokeWidth={2} name="Dépensé" connectNulls={false} />
                <Line type="monotone" dataKey="forecast" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" name="Prévision" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Budget by Project */}
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Budget par Projet</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data.projects}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" angle={-45} textAnchor="end" height={150} />
              <YAxis stroke="#94a3b8" label={{ value: 'Budget (M€)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
              <Legend />
              <Bar dataKey="consumed" stackId="a" fill="#10b981" name="Consommé" />
              <Bar dataKey="remaining" stackId="a" fill="#64748b" name="Restant" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Teams Table */}
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-xl font-bold text-white">Détail par Équipe</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Équipe</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Nombre de Projets</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Budget Total</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Budget Moyen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {data.teams.map((team: any, i: number) => (
                  <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">{team.name}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{team.projects}</td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-emerald-400">{team.budget.toFixed(2)}M€</p>
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      {(team.budget / team.projects).toFixed(2)}M€
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
