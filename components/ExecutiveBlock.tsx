"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useCurrentWorkspace } from "@/lib/useCurrentWorkspace";
import styles from "./ExecutiveBlock.module.css";

type Stats = {
  health: number;
  monthlyVariation: string;
  activeProjects: number;
  activeRisks: number;
  avgVelocity: number;
};

function generateExecutiveAnalysis({
  health,
  activeProjects,
  activeRisks,
  avgVelocity,
}: Stats): string {
  if (health < 60 && activeRisks > 5) {
    return "Le portfolio est sous forte tension : risques élevés et santé globale dégradée.";
  }

  if (activeRisks > 5) {
    return "Les risques augmentent : traiter les éléments critiques en priorité.";
  }

  if (avgVelocity < 30 && activeProjects > 0) {
    return "La vélocité est faible au regard de la charge. Analyse de capacité recommandée.";
  }

  if (health >= 80 && activeRisks === 0) {
    return "Le portfolio est sain, les risques sont maîtrisés et la vélocité est stable.";
  }

  return "Le portfolio est globalement stable, avec quelques points de vigilance.";
}

export default function ExecutiveBlock() {
  const { workspaceId, loading: wsLoading } = useCurrentWorkspace();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    health: 0,
    monthlyVariation: "+0%",
    activeProjects: 0,
    activeRisks: 0,
    avgVelocity: 0,
  });
  const [analysis, setAnalysis] = useState<string>("");

  useEffect(() => {
    if (!workspaceId || wsLoading) return;

    async function load() {
      setLoading(true);

      // --- PROJETS ACTIFS ---
      const { count: activeProjectsCount } = await supabase
        .from("projects")
        .select("*", { count: "exact", head: true })
        .eq("status", "active")
        .eq("organization_id", workspaceId);

      const activeProjects = activeProjectsCount ?? 0;

      // --- RISQUES ACTIFS ---
      const { count: activeRisksCount } = await supabase
        .from("risks")
        .select("*", { count: "exact", head: true })
        .eq("status", "active")
        .eq("organization_id", workspaceId);

      const activeRisks = activeRisksCount ?? 0;

      // --- VELOCITE MOYENNE ---
      const { data: sprints = [] } = await supabase
        .from("sprints")
        .select("velocity")
        .eq("organization_id", workspaceId);

      const avgVelocity =
        sprints && sprints.length > 0
          ? Math.round(
              sprints.reduce((a, b) => a + (b.velocity || 0), 0) /
                sprints.length
            )
          : 0;

      // --- SANTÉ PORTFOLIO ---
      const { data: allProjects = [] } = await supabase
        .from("projects")
        .select("risk_level")
        .eq("organization_id", workspaceId);

      const health =
        allProjects && allProjects.length > 0
          ? Math.round(
              (allProjects.filter((p) => p.risk_level !== "critical").length /
                allProjects.length) *
                100
            )
          : 0;

      // --- VARIATION MENSUELLE ---
      const monthlyVariation =
        health >= 80 ? "+5%" : health >= 60 ? "+2%" : "-3%";

      const newStats: Stats = {
        health,
        monthlyVariation,
        activeProjects,
        activeRisks,
        avgVelocity,
      };

      setStats(newStats);
      setAnalysis(generateExecutiveAnalysis(newStats));
      setLoading(false);
    }

    load();
  }, [workspaceId, wsLoading]);

  if (loading || wsLoading) {
    return (
      <div className={styles.block}>
        <div className={styles.loading}>Chargement des données...</div>
      </div>
    );
  }

  return (
    <Link href="/cockpit/analytics" className={styles.block}>
      <div className={styles.header}>
        <div className={styles.title}>Vue exécutive</div>
        <div className={styles.subtitle}>Synthèse portfolio & delivery</div>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <div className={styles.value}>{stats.health}%</div>
          <div className={styles.sub}>{stats.monthlyVariation} ce mois</div>
          <div className={styles.label}>Santé portfolio</div>
        </div>

        <div className={styles.stat}>
          <div className={styles.value}>{stats.activeProjects}</div>
          <div className={styles.sub}>{stats.activeProjects} en cours</div>
          <div className={styles.label}>Projets actifs</div>
        </div>

        <div className={styles.stat}>
          <div className={styles.value}>{stats.activeRisks}</div>
          <div className={styles.sub}>{stats.activeRisks} critiques</div>
          <div className={styles.label}>Risques actifs</div>
        </div>

        <div className={styles.stat}>
          <div className={styles.value}>{stats.avgVelocity} pts/sprint</div>
          <div className={styles.label}>Vélocité moyenne</div>
        </div>
      </div>

      <div className={styles.ai}>{analysis}</div>
    </Link>
  );
}

// Export nommé pour compatibilité
export { ExecutiveBlock };
