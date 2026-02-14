'use client';

import { CockpitShell } from "@/components/cockpit/CockpitShell";
import { StatCard } from "@/components/StatCard";
import { 
  ArrowRight,
  Sparkles,
  Zap,
  Calendar,
  Clock,
  Target,
  TrendingUp,
  Plus
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getProjects } from "./projets/actions";

export default function CockpitIndexPage() {
  const [projectCount, setProjectCount] = useState<number>(0);
  const [activeCount, setActiveCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const { projects } = await getProjects();
      // Filtrer les projets non archivés
      const activeProjects = projects.filter((p: any) => p.status !== 'archived');
      setProjectCount(activeProjects.length);
      setActiveCount(activeProjects.filter((p: any) => p.status === 'active').length);
      setLoading(false);
    }
    loadStats();
  }, []);

  return (
    <CockpitShell>
      <div className="p-6 space-y-6">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-500/20 rounded-xl p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <Sparkles className="text-amber-400" size={32} />
                Tableau de bord exécutif
              </h1>
              <p className="text-slate-300 text-lg">
                Bonjour ! Voici la vue d'ensemble de votre portfolio
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-400 mb-1">Dernière mise à jour</div>
              <div className="text-white font-semibold">{new Date().toLocaleString('fr-FR')}</div>
            </div>
          </div>
        </div>

        {/* Quick Stats - Version Premium avec StatCard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            value="87%"
            sub="+5% ce mois"
            label="Santé portfolio"
            href="/cockpit/portfolio"
          />

          <StatCard
            value={loading ? "..." : projectCount.toString()}
            sub={loading ? "" : `${activeCount} en cours`}
            label="Projets actifs"
            href="/cockpit/projets"
          />

          <StatCard
            value="8"
            sub="2 critiques"
            label="Risques actifs"
            href="/cockpit/risques"
          />

          <StatCard
            value="45 pts/sprint"
            label="Vélocité moyenne"
            href="/cockpit/agile/velocity"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="text-amber-400" size={24} />
            Actions rapides
          </h2>
          <div className="grid md:grid-cols-3 gap-3">
            <Link
              href="/cockpit/projets"
              className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 hover:border-emerald-500/50 rounded-lg transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/30 rounded-lg flex items-center justify-center">
                  <Plus className="text-emerald-400" size={20} />
                </div>
                <span className="font-medium text-white">Créer un projet</span>
              </div>
              <ArrowRight className="text-emerald-500 group-hover:text-emerald-400 transition-colors" size={20} />
            </Link>

            <Link
              href="/cockpit/kanban"
              className="flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-700 rounded-lg transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Calendar className="text-blue-400" size={20} />
                </div>
                <span className="font-medium text-white">Voir le Kanban</span>
              </div>
              <ArrowRight className="text-slate-500 group-hover:text-blue-400 transition-colors" size={20} />
            </Link>

            <Link
              href="/cockpit/gantt"
              className="flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-700 rounded-lg transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Clock className="text-purple-400" size={20} />
                </div>
                <span className="font-medium text-white">Diagramme Gantt</span>
              </div>
              <ArrowRight className="text-slate-500 group-hover:text-purple-400 transition-colors" size={20} />
            </Link>

            <Link
              href="/cockpit/automations"
              className="flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-700 rounded-lg transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                  <Zap className="text-amber-400" size={20} />
                </div>
                <span className="font-medium text-white">Automatisations</span>
              </div>
              <ArrowRight className="text-slate-500 group-hover:text-amber-400 transition-colors" size={20} />
            </Link>

            <Link
              href="/cockpit/documents"
              className="flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-700 rounded-lg transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Target className="text-green-400" size={20} />
                </div>
                <span className="font-medium text-white">Documents</span>
              </div>
              <ArrowRight className="text-slate-500 group-hover:text-green-400 transition-colors" size={20} />
            </Link>

            <Link
              href="/cockpit/kpi"
              className="flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-700 rounded-lg transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-red-400" size={20} />
                </div>
                <span className="font-medium text-white">KPI Dashboard</span>
              </div>
              <ArrowRight className="text-slate-500 group-hover:text-red-400 transition-colors" size={20} />
            </Link>

            <Link
              href="/cockpit/ia"
              className="flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-700 rounded-lg transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                  <Sparkles className="text-cyan-400" size={20} />
                </div>
                <span className="font-medium text-white">IA Copilote</span>
              </div>
              <ArrowRight className="text-slate-500 group-hover:text-cyan-400 transition-colors" size={20} />
            </Link>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="text-blue-400" size={24} />
            Activité récente
          </h2>
          <div className="space-y-3">
            {[
              { text: "Nouveau projet créé : Migration Cloud Azure", time: "Il y a 2h", color: "green" },
              { text: "Risque critique ajouté sur Refonte Mobile", time: "Il y a 4h", color: "red" },
              { text: "KPI actualisés pour Q1 2026", time: "Il y a 6h", color: "blue" },
              { text: "3 tâches complétées sur Programme IA", time: "Hier", color: "amber" },
            ].map((activity, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                <div className={`w-2 h-2 rounded-full bg-${activity.color}-400 mt-2`} />
                <div className="flex-1">
                  <div className="text-white">{activity.text}</div>
                  <div className="text-sm text-slate-500">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pro Tip */}
        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="text-purple-400" size={24} />
            <h3 className="text-xl font-bold text-white">💡 Astuce Pro</h3>
          </div>
          <p className="text-slate-300">
            Appuyez sur <kbd className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-amber-400">Ctrl+K</kbd> pour ouvrir la palette de commandes et accéder rapidement à n'importe quelle fonctionnalité !
          </p>
        </div>
      </div>
    </CockpitShell>
  );
}
