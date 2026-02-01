/**
 * PACK 16 - PORTFEUILLE EXÉCUTIF
 * Agent IA Portfolio - Analyse multi-projets
 */

import OpenAI from 'openai';

// Initialize OpenAI (Azure or standard)
const openai =
  process.env.OPENAI_API_KEY || process.env.AZURE_OPENAI_API_KEY
    ? new OpenAI({
        apiKey: process.env.AZURE_OPENAI_API_KEY || process.env.OPENAI_API_KEY,
        baseURL: process.env.AZURE_OPENAI_ENDPOINT
          ? `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}`
          : undefined,
        defaultQuery: process.env.AZURE_OPENAI_ENDPOINT
          ? { 'api-version': '2024-02-15-preview' }
          : undefined,
        defaultHeaders: process.env.AZURE_OPENAI_ENDPOINT
          ? { 'api-key': process.env.AZURE_OPENAI_API_KEY }
          : undefined,
      })
    : null;

/**
 * Interface pour les projets du portfolio
 */
export interface PortfolioProject {
  id: string;
  name: string;
  status: 'active' | 'at_risk' | 'blocked' | 'completed';
  progress: number;
  budget: number;
  risks_count: number;
  critical_risks_count: number;
  decisions_pending_count: number;
  timeline_activity: number; // Nombre d'événements récents
  owner?: string;
  rag_status?: 'GREEN' | 'YELLOW' | 'RED';
}

/**
 * Interface pour le risque du portfolio
 */
export interface PortfolioRisk {
  id: string;
  project_id: string;
  project_name: string;
  title: string;
  severity: number;
  mitigation_status: 'open' | 'in_progress' | 'mitigated';
}

/**
 * Interface pour la décision du portfolio
 */
export interface PortfolioDecision {
  id: string;
  project_id: string;
  project_name: string;
  title: string;
  priority: number;
  status: 'pending' | 'approved' | 'rejected' | 'implemented';
}

/**
 * Interface pour l'analyse IA du portfolio
 */
export interface PortfolioAnalysis {
  summary: string; // 3-4 lignes
  critical_projects: Array<{
    project_name: string;
    reason: string;
    recommended_action: string;
  }>;
  under_control_projects: string[];
  watch_projects: Array<{
    project_name: string;
    reason: string;
  }>;
  resource_allocation: {
    invest_more: string[];
    reduce_scope: string[];
    accelerate: string[];
  };
  strategic_recommendations: string[];
  overall_health_score: number; // 0-100
  confidence_score: number; // 0-100
}

/**
 * Système prompt pour l'agent APF (Analyse Portfolio Exécutif)
 */
const PORTFOLIO_SYSTEM_PROMPT = `Tu es l'Agent Stratégique de Portfolio (APF) de Powalyze.

**Ta mission :**
Analyser le portefeuille de projets et fournir une vision stratégique claire pour les décideurs.

**Ton rôle :**
1. Identifier les projets critiques nécessitant une attention immédiate
2. Valider les projets sous contrôle
3. Signaler les projets à surveiller
4. Recommander l'allocation optimale des ressources
5. Proposer des actions stratégiques concrètes

**Tes principes :**
- Clarté executive : synthèse en 3-4 lignes maximum
- Priorisation : top 3 projets critiques
- Pragmatisme : recommandations actionnables
- Transparence : justifier chaque recommandation
- Quantification : utiliser des métriques précises

**Format de sortie (JSON strict) :**
{
  "summary": "Synthèse executive 3-4 lignes",
  "critical_projects": [
    {
      "project_name": "Nom projet",
      "reason": "Pourquoi critique (1 ligne)",
      "recommended_action": "Action précise (1 ligne)"
    }
  ],
  "under_control_projects": ["Projet A", "Projet B"],
  "watch_projects": [
    {
      "project_name": "Nom projet",
      "reason": "Pourquoi surveiller (1 ligne)"
    }
  ],
  "resource_allocation": {
    "invest_more": ["Projet nécessitant renfort"],
    "reduce_scope": ["Projet à réduire"],
    "accelerate": ["Projet à accélérer"]
  },
  "strategic_recommendations": [
    "Recommandation 1",
    "Recommandation 2",
    "Recommandation 3"
  ],
  "overall_health_score": 75,
  "confidence_score": 90
}

**Scoring :**
- overall_health_score : santé globale du portfolio (0-100)
  - 90-100 : Excellent
  - 70-89 : Bon
  - 50-69 : Modéré
  - 30-49 : Critique
  - 0-29 : Alerte

- confidence_score : confiance dans l'analyse (0-100)
  - Basé sur la qualité et quantité des données
`;

/**
 * Analyser le portfolio avec l'IA
 */
export async function analyzePortfolio(
  projects: PortfolioProject[],
  risks: PortfolioRisk[],
  decisions: PortfolioDecision[]
): Promise<PortfolioAnalysis | null> {
  if (!openai) {
    console.warn('[AI Portfolio] OpenAI not configured');
    return {
      summary: 'Analyse IA non disponible (OpenAI non configuré)',
      critical_projects: [],
      under_control_projects: [],
      watch_projects: [],
      resource_allocation: { invest_more: [], reduce_scope: [], accelerate: [] },
      strategic_recommendations: ['Configurer OpenAI pour activer l\'analyse IA'],
      overall_health_score: 50,
      confidence_score: 0,
    };
  }

  // Préparer le contexte
  const context = `
**PORTFOLIO OVERVIEW**
Total projects: ${projects.length}
Total risks: ${risks.length}
Total pending decisions: ${decisions.filter((d) => d.status === 'pending').length}

**PROJECTS DETAILS**
${projects
  .map(
    (p) => `
- ${p.name}
  Status: ${p.status}
  Progress: ${p.progress}%
  Budget: ${p.budget}€
  RAG: ${p.rag_status || 'N/A'}
  Critical risks: ${p.critical_risks_count}
  Pending decisions: ${p.decisions_pending_count}
  Timeline activity: ${p.timeline_activity} events
  Owner: ${p.owner || 'N/A'}
`
  )
  .join('\n')}

**CRITICAL RISKS (severity >= 4)**
${risks
  .filter((r) => r.severity >= 4)
  .map(
    (r) => `
- ${r.project_name}: ${r.title}
  Severity: ${r.severity}/5
  Status: ${r.mitigation_status}
`
  )
  .join('\n')}

**PENDING DECISIONS (priority >= 4)**
${decisions
  .filter((d) => d.status === 'pending' && d.priority >= 4)
  .map(
    (d) => `
- ${d.project_name}: ${d.title}
  Priority: ${d.priority}/5
`
  )
  .join('\n')}
`;

  try {
    const completion = await openai!.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4',
      messages: [
        { role: 'system', content: PORTFOLIO_SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Analyse ce portfolio et fournis une analyse stratégique complète :\n\n${context}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      console.error('Empty response from OpenAI');
      return null;
    }

    const analysis = JSON.parse(content) as PortfolioAnalysis;
    return analysis;
  } catch (error) {
    console.error('Error analyzing portfolio with AI:', error);
    return null;
  }
}

/**
 * Calculer le score d'un projet (utilisé pour le heatmap)
 */
export function calculateProjectScore(project: PortfolioProject): number {
  // Formule : moyenne pondérée
  const riskScore =
    project.critical_risks_count > 0
      ? 5
      : project.risks_count > 3
      ? 4
      : project.risks_count > 1
      ? 3
      : project.risks_count > 0
      ? 2
      : 1;

  const decisionScore =
    project.decisions_pending_count > 5
      ? 5
      : project.decisions_pending_count > 3
      ? 4
      : project.decisions_pending_count > 1
      ? 3
      : project.decisions_pending_count > 0
      ? 2
      : 1;

  const activityScore =
    project.timeline_activity > 10
      ? 1
      : project.timeline_activity > 5
      ? 2
      : project.timeline_activity > 2
      ? 3
      : project.timeline_activity > 0
      ? 4
      : 5;

  const progressScore = project.progress < 30 ? 4 : project.progress < 60 ? 3 : project.progress < 90 ? 2 : 1;

  // Score global (1-5, 5 = critique)
  const score =
    riskScore * 0.4 +
    decisionScore * 0.3 +
    activityScore * 0.2 +
    progressScore * 0.1;

  return Math.round(score * 10) / 10; // Arrondir à 1 décimale
}

/**
 * Calculer la tendance d'un projet (pour heatmap Y-axis)
 */
export function calculateProjectTrend(
  project: PortfolioProject,
  historicalData?: { progress: number; date: string }[]
): 'improving' | 'stable' | 'declining' {
  // Si données historiques disponibles
  if (historicalData && historicalData.length >= 2) {
    const recent = historicalData[historicalData.length - 1].progress;
    const previous = historicalData[historicalData.length - 2].progress;

    if (recent > previous + 5) return 'improving';
    if (recent < previous - 5) return 'declining';
    return 'stable';
  }

  // Sinon, basé sur le RAG status
  if (project.rag_status === 'GREEN') return 'improving';
  if (project.rag_status === 'RED') return 'declining';
  return 'stable';
}

/**
 * Générer des recommandations quick-wins
 */
export function generateQuickWins(
  projects: PortfolioProject[],
  risks: PortfolioRisk[],
  decisions: PortfolioDecision[]
): string[] {
  const quickWins: string[] = [];

  // Décisions rapides à prendre
  const urgentDecisions = decisions.filter(
    (d) => d.status === 'pending' && d.priority >= 4
  );
  if (urgentDecisions.length > 0) {
    quickWins.push(
      `Arbitrer ${urgentDecisions.length} décision(s) urgente(s) en attente`
    );
  }

  // Risques critiques à mitiger
  const criticalRisks = risks.filter(
    (r) => r.severity >= 4 && r.mitigation_status === 'open'
  );
  if (criticalRisks.length > 0) {
    quickWins.push(`Lancer mitigation de ${criticalRisks.length} risque(s) critique(s)`);
  }

  // Projets bloqués
  const blockedProjects = projects.filter((p) => p.status === 'blocked');
  if (blockedProjects.length > 0) {
    quickWins.push(`Débloquer ${blockedProjects.length} projet(s) en attente`);
  }

  // Projets sous-actifs
  const inactiveProjects = projects.filter(
    (p) => p.timeline_activity === 0 && p.status === 'active'
  );
  if (inactiveProjects.length > 0) {
    quickWins.push(`Réactiver ${inactiveProjects.length} projet(s) inactif(s)`);
  }

  return quickWins.slice(0, 5); // Max 5 quick-wins
}
