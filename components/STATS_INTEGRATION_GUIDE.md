/**
 * GUIDE D'INTÉGRATION - Composants Stats Powalyze
 * =================================================
 */

// =====================
// OPTION 1 : StatCard individuelle (grille de 4)
// =====================

import { StatCard } from "@/components/StatCard";

export default function DashboardWithCards() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-6">Dashboard Exécutif</h1>
      
      {/* Grille responsive de cartes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          value="87%"
          sub="+5% ce mois"
          label="Santé portfolio"
          href="/cockpit/portfolio"
        />

        <StatCard
          value="12"
          sub="3 en cours"
          label="Projets actifs"
          href="/cockpit/projects/active"
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
    </div>
  );
}

// =====================
// OPTION 2 : ExecutiveStatsBlock (1 bloc unique cliquable)
// =====================

import { ExecutiveStatsBlock } from "@/components/ExecutiveStatsBlock";

export default function DashboardWithBlock() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-6">Dashboard Exécutif</h1>
      
      {/* Bloc unique avec toutes les stats */}
      <ExecutiveStatsBlock />
    </div>
  );
}

// =====================
// OPTION 3 : Mixte (bloc + cartes individuelles)
// =====================

import { ExecutiveStatsBlock } from "@/components/ExecutiveStatsBlock";
import { StatCard } from "@/components/StatCard";

export default function DashboardMixed() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Vue d'ensemble</h2>
        <ExecutiveStatsBlock />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Indicateurs détaillés</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <StatCard
            value="€2.4M"
            sub="Budget total"
            label="Investissement"
            href="/cockpit/finance"
          />

          <StatCard
            value="23"
            sub="5 en retard"
            label="Actions ouvertes"
            href="/cockpit/actions"
          />

          <StatCard
            value="94%"
            sub="Taux de complétion"
            label="Livraisons"
            href="/cockpit/deliveries"
          />
        </div>
      </div>
    </div>
  );
}

// =====================
// OPTION 4 : Version dynamique avec données Supabase
// =====================

"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/StatCard";
import { ExecutiveStatsBlock } from "@/components/ExecutiveStatsBlock";

export default function DashboardDynamic() {
  const [stats, setStats] = useState({
    healthScore: 0,
    activeProjects: 0,
    activeRisks: 0,
    velocity: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      const [projectsRes, risksRes] = await Promise.all([
        fetch("/api/projects"),
        fetch("/api/risks"),
      ]);

      const projects = await projectsRes.json();
      const risks = await risksRes.json();

      // Calculer la santé du portfolio
      const greenProjects = projects.filter((p: any) => p.rag_status === "GREEN").length;
      const healthScore = Math.round((greenProjects / projects.length) * 100);

      // Compter les projets actifs
      const activeProjects = projects.filter((p: any) => p.status === "active").length;

      // Compter les risques actifs
      const activeRisks = risks.filter((r: any) => r.status !== "CLOSED").length;

      setStats({
        healthScore,
        activeProjects,
        activeRisks,
        velocity: 45, // À calculer via API sprint
      });
    }

    fetchStats();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-6">Dashboard Exécutif</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          value={`${stats.healthScore}%`}
          label="Santé portfolio"
          href="/cockpit/portfolio"
        />

        <StatCard
          value={stats.activeProjects.toString()}
          label="Projets actifs"
          href="/cockpit/projects/active"
        />

        <StatCard
          value={stats.activeRisks.toString()}
          label="Risques actifs"
          href="/cockpit/risques"
        />

        <StatCard
          value={`${stats.velocity} pts/sprint`}
          label="Vélocité moyenne"
          href="/cockpit/agile/velocity"
        />
      </div>
    </div>
  );
}

// =====================
// CSS GLOBAL (à ajouter si besoin)
// =====================

/**
 * Si vous n'utilisez pas Tailwind, ajoutez ceci dans votre CSS global :
 * 
 * .stats-grid {
 *   display: grid;
 *   grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
 *   gap: 20px;
 *   margin-top: 30px;
 * }
 */
