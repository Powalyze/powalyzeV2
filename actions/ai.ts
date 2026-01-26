"use server";

import { createClient } from "@/utils/supabase/server";
import { getTableName } from "@/lib/modeDetection";

// Structures de données pour l'IA prédictive
export interface AIProjectAnalysis {
  projectId: string;
  projectName: string;
  globalRiskScore: number; // 0-100
  predictedStatus: "on_track" | "at_risk" | "critical";
  priorityRisks: Array<{
    title: string;
    impact: number;
    probability: number;
    score: number;
  }>;
  criticalDecisions: Array<{
    title: string;
    urgency: "high" | "medium" | "low";
    impact: string;
  }>;
  predictedAnomalies: Array<{
    area: string;
    likelihood: number;
    description: string;
  }>;
  recommendations: Array<{
    priority: "critical" | "high" | "medium";
    category: string;
    action: string;
    impact: string;
  }>;
  trajectory: {
    budget: { status: "green" | "yellow" | "red"; drift: number };
    timeline: { status: "green" | "yellow" | "red"; delay: number };
    quality: { status: "green" | "yellow" | "red"; issues: number };
  };
}

// IA Prédictive par projet
export async function analyzeProject(projectId: string): Promise<AIProjectAnalysis> {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Non authentifié");
  }

  // Récupérer les données du projet
  const risksTable = await getTableName("risks");
  const decisionsTable = await getTableName("decisions");
  const anomaliesTable = await getTableName("anomalies");

  const [risksRes, decisionsRes, anomaliesRes] = await Promise.all([
    supabase.from(risksTable).select("*").eq("project_id", projectId).eq("user_id", user.id),
    supabase.from(decisionsTable).select("*").eq("project_id", projectId).eq("user_id", user.id),
    supabase.from(anomaliesTable).select("*").eq("project_id", projectId).eq("user_id", user.id)
  ]);

  const risks = risksRes.data || [];
  const decisions = decisionsRes.data || [];
  const anomalies = anomaliesRes.data || [];

  // Calculs IA (mock pour démonstration)
  const globalRiskScore = calculateGlobalRiskScore(risks, anomalies);
  const predictedStatus = getPredictedStatus(globalRiskScore, anomalies);
  const priorityRisks = risks
    .map(r => ({
      title: r.title,
      impact: r.impact,
      probability: r.probability,
      score: r.impact * r.probability
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const criticalDecisions = decisions
    .filter(d => d.status === "pending")
    .map(d => ({
      title: d.title,
      urgency: d.deadline ? getUrgency(d.deadline) : ("medium" as const),
      impact: d.impact || "MEDIUM"
    }))
    .slice(0, 3);

  const predictedAnomalies = [
    {
      area: "Budget",
      likelihood: 0.65,
      description: "Dérive budgétaire probable dans les 30 prochains jours"
    },
    {
      area: "Délais",
      likelihood: 0.45,
      description: "Risque de retard sur les livrables du sprint actuel"
    }
  ];

  const recommendations = generateRecommendations(risks, decisions, anomalies);

  return {
    projectId,
    projectName: "Projet Analyse IA",
    globalRiskScore,
    predictedStatus,
    priorityRisks,
    criticalDecisions,
    predictedAnomalies,
    recommendations,
    trajectory: {
      budget: { status: globalRiskScore > 60 ? "red" : globalRiskScore > 40 ? "yellow" : "green", drift: 12 },
      timeline: { status: anomalies.length > 5 ? "red" : anomalies.length > 2 ? "yellow" : "green", delay: 5 },
      quality: { status: anomalies.filter(a => a.severity === "critical").length > 0 ? "red" : "green", issues: anomalies.length }
    }
  };
}

// IA Générative - Synthèse des risques
export async function generateRiskSummary(projectId?: string): Promise<string> {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Non authentifié");
  }

  const risksTable = await getTableName("risks");
  
  let query = supabase.from(risksTable).select("*").eq("user_id", user.id);
  if (projectId) {
    query = query.eq("project_id", projectId);
  }

  const { data: risks } = await query;

  if (!risks || risks.length === 0) {
    return "Aucun risque identifié pour le moment.";
  }

  // Mock de génération IA
  const criticalCount = risks.filter(r => r.impact >= 4 && r.probability >= 4).length;
  const highCount = risks.filter(r => r.impact >= 3 && r.probability >= 3).length;

  return `# Synthèse des Risques

**Analyse générée le ${new Date().toLocaleDateString("fr-FR")}**

## Vue d'ensemble

Le portefeuille présente actuellement **${risks.length} risques identifiés**, dont ${criticalCount} critiques et ${highCount} de niveau élevé.

## Risques Prioritaires

${risks.slice(0, 3).map(r => `
### ${r.title}
- **Impact**: ${r.impact}/5
- **Probabilité**: ${r.probability}/5
- **Statut**: ${r.status}
- **Mitigation**: ${r.mitigation || "À définir"}
`).join("\n")}

## Recommandations IA

1. **Prioriser** la résolution des ${criticalCount} risques critiques
2. **Mettre en place** des plans de mitigation pour les risques élevés
3. **Surveiller** l'évolution hebdomadaire des indicateurs

---
*Rapport généré automatiquement par Powalyze AI*`;
}

// IA Générative - Mémo de décision
export async function generateDecisionMemo(decisionId: string): Promise<string> {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Non authentifié");
  }

  const decisionsTable = await getTableName("decisions");
  
  const { data: decision } = await supabase
    .from(decisionsTable)
    .select("*")
    .eq("id", decisionId)
    .eq("user_id", user.id)
    .single();

  if (!decision) {
    throw new Error("Décision introuvable");
  }

  return `# Mémo de Décision

**Sujet**: ${decision.title}  
**Date**: ${new Date().toLocaleDateString("fr-FR")}  
**Décideur**: ${decision.decision_maker}

## Contexte

${decision.description}

## Recommandation

Basé sur l'analyse des données disponibles, cette décision présente un impact **${decision.impact || "MOYEN"}** sur le projet.

## Prochaines Étapes

1. Validation par le comité ${decision.committee || "à définir"}
2. Communication aux parties prenantes
3. Mise en place du plan d'action

## Échéance

${decision.deadline ? `Deadline: ${new Date(decision.deadline).toLocaleDateString("fr-FR")}` : "À définir"}

---
*Mémo généré par Powalyze AI*`;
}

// IA Générative - Rapport d'incident
export async function generateIncidentReport(anomalyId: string): Promise<string> {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Non authentifié");
  }

  const anomaliesTable = await getTableName("anomalies");
  
  const { data: anomaly } = await supabase
    .from(anomaliesTable)
    .select("*")
    .eq("id", anomalyId)
    .eq("user_id", user.id)
    .single();

  if (!anomaly) {
    throw new Error("Anomalie introuvable");
  }

  return `# Rapport d'Incident

**Incident**: ${anomaly.title}  
**Date de détection**: ${new Date(anomaly.created_at).toLocaleDateString("fr-FR")}  
**Sévérité**: ${anomaly.severity.toUpperCase()}

## Description

${anomaly.description}

## Impact

Cette anomalie de sévérité **${anomaly.severity}** nécessite une attention ${anomaly.severity === "critical" ? "immédiate" : anomaly.severity === "high" ? "prioritaire" : "standard"}.

## Actions Entreprises

${anomaly.assignee ? `Assigné à: ${anomaly.assignee}` : "En attente d'assignation"}

## Statut

${anomaly.status === "resolved" ? `✓ Résolu le ${anomaly.resolved_at ? new Date(anomaly.resolved_at).toLocaleDateString("fr-FR") : ""}` : `⏳ En cours de résolution`}

---
*Rapport généré par Powalyze AI*`;
}

// IA Générative - Rapport exécutif complet
export async function generateExecutiveReport(projectId?: string): Promise<string> {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Non authentifié");
  }

  const risksTable = await getTableName("risks");
  const decisionsTable = await getTableName("decisions");
  const anomaliesTable = await getTableName("anomalies");

  const [risksRes, decisionsRes, anomaliesRes] = await Promise.all([
    supabase.from(risksTable).select("*").eq("user_id", user.id),
    supabase.from(decisionsTable).select("*").eq("user_id", user.id),
    supabase.from(anomaliesTable).select("*").eq("user_id", user.id)
  ]);

  const risks = risksRes.data || [];
  const decisions = decisionsRes.data || [];
  const anomalies = anomaliesRes.data || [];

  return `# Rapport Exécutif

**Période**: ${new Date().toLocaleDateString("fr-FR")}  
**Généré par**: Powalyze AI

## Synthèse Exécutive

Le portefeuille présente ${risks.length} risques, ${decisions.length} décisions en cours, et ${anomalies.length} anomalies identifiées.

### Indicateurs Clés

- **Risques Critiques**: ${risks.filter(r => r.impact >= 4 && r.probability >= 4).length}
- **Décisions Pendantes**: ${decisions.filter(d => d.status === "pending").length}
- **Anomalies Ouvertes**: ${anomalies.filter(a => a.status === "open").length}

## Risques Majeurs

${risks.slice(0, 5).map(r => `- **${r.title}**: Impact ${r.impact}/5, Probabilité ${r.probability}/5`).join("\n")}

## Décisions Clés

${decisions.slice(0, 3).map(d => `- **${d.title}**: ${d.status} - ${d.decision_maker}`).join("\n")}

## Anomalies Critiques

${anomalies.filter(a => a.severity === "critical" || a.severity === "high").slice(0, 3).map(a => `- **${a.title}**: ${a.severity}`).join("\n")}

## Recommandations IA

1. Prioriser la résolution des risques critiques
2. Accélérer les décisions pendantes avec échéance proche
3. Mettre en place un plan d'action pour les anomalies ouvertes

---
*Rapport généré automatiquement par Powalyze AI*`;
}

// Fonctions utilitaires
function calculateGlobalRiskScore(risks: any[], anomalies: any[]): number {
  if (risks.length === 0 && anomalies.length === 0) return 0;
  
  const riskScore = risks.reduce((sum, r) => sum + (r.impact * r.probability), 0) / (risks.length || 1);
  const anomalyScore = anomalies.length * 5;
  
  return Math.min(100, Math.round((riskScore * 4 + anomalyScore) / 2));
}

function getPredictedStatus(score: number, anomalies: any[]): "on_track" | "at_risk" | "critical" {
  if (score > 70 || anomalies.filter(a => a.severity === "critical").length > 0) return "critical";
  if (score > 40 || anomalies.length > 3) return "at_risk";
  return "on_track";
}

function getUrgency(deadline: string): "high" | "medium" | "low" {
  const daysUntil = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (daysUntil < 7) return "high";
  if (daysUntil < 30) return "medium";
  return "low";
}

function generateRecommendations(risks: any[], decisions: any[], anomalies: any[]) {
  const recommendations = [];

  if (risks.filter(r => r.impact >= 4).length > 0) {
    recommendations.push({
      priority: "critical" as const,
      category: "Risques",
      action: "Traiter immédiatement les risques à impact élevé",
      impact: "Réduction de 60% du score de risque global"
    });
  }

  if (decisions.filter(d => d.status === "pending").length > 3) {
    recommendations.push({
      priority: "high" as const,
      category: "Décisions",
      action: "Accélérer le processus de décision pour les éléments pendants",
      impact: "Déblocage de 3 workstreams critiques"
    });
  }

  if (anomalies.filter(a => a.status === "open").length > 5) {
    recommendations.push({
      priority: "medium" as const,
      category: "Anomalies",
      action: "Mettre en place un plan de résolution d'anomalies",
      impact: "Amélioration de 40% de la qualité"
    });
  }

  return recommendations;
}
