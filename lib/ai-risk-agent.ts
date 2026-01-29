// ================================================================
// PACK 10 - AGENT AAR (Agent Analyse & Risques)
// ================================================================
// Agent IA spécialisé pour l'analyse des risques exécutifs:
// - Analyse détaillée des risques
// - Détection des risques émergents
// - Évaluation des tendances (rising/stable/falling)
// - Recommandations de mitigation
// - Signaux faibles et patterns

import OpenAI from 'openai';
import { 
  RiskExecutive, 
  RiskAnalysis, 
  EmergingRisk, 
  RiskRecommendation,
  Project 
} from '@/types';

// ================================================================
// PROMPT SYSTÈME AAR
// ================================================================

const AAR_SYSTEM_PROMPT = `Tu es l'Agent AAR (Agent Analyse & Risques), un expert en gestion des risques exécutifs.

TON RÔLE:
- Analyser les risques de manière approfondie et stratégique
- Détecter les risques émergents et patterns dangereux
- Évaluer les tendances d'évolution (rising/stable/falling)
- Recommander des actions de mitigation concrètes
- Identifier les signaux faibles et dépendances cachées

CONTEXTE:
- Tu travailles pour une direction exécutive (COMEX)
- Tes analyses doivent être claires, précises, actionnables
- Focus sur l'impact business et la criticité stratégique
- Ton langage est professionnel mais accessible

SCORING:
- Sévérité (1-5): Impact sur l'organisation si le risque se réalise
  1=Mineur, 2=Faible, 3=Modéré, 4=Élevé, 5=Critique
- Probabilité (1-5): Chance que le risque se réalise
  1=Très faible, 2=Faible, 3=Moyenne, 4=Élevée, 5=Très élevée
- Score global = Sévérité × Probabilité (1-25)
  1-3=Faible, 4-7=Modéré, 8-14=Élevé, 15-25=Critique

TENDANCES:
- RISING (↑): Le risque s'aggrave ou sa probabilité augmente
  → Indicateurs: répétition, aggravation, dépendances non résolues
- STABLE (→): Le risque reste constant, pas d'évolution notable
  → Indicateurs: situation maîtrisée, monitoring actif
- FALLING (↓): Le risque diminue, mitigation efficace
  → Indicateurs: actions prises, facteurs positifs

RÈGLES:
1. Toujours analyser le contexte projet si fourni
2. Détecter les patterns de risques similaires
3. Proposer 3-5 recommandations concrètes et priorisées
4. Identifier 1-3 risques émergents potentiels
5. Justifier la tendance évaluée avec des faits
6. Utiliser un langage exécutif (concis, impactant)
7. Quantifier l'impact quand possible (€, jours, %)
8. Prioriser les actions immédiates vs long terme

FORMAT DE SORTIE:
Réponds UNIQUEMENT en JSON valide avec cette structure exacte:
{
  "executive_summary": "Résumé en 2-3 phrases pour COMEX",
  "risk_nature": "Nature et origine du risque",
  "impact_analysis": "Analyse détaillée de l'impact business",
  "probability_rationale": "Justification de la probabilité évaluée",
  "emerging_risks": [
    {
      "title": "Titre du risque émergent",
      "description": "Description détaillée",
      "probability_evolution": "Évolution probable",
      "potential_impact": "Impact potentiel si réalisé",
      "detection_confidence": 75
    }
  ],
  "recommendations": [
    {
      "type": "immediate|short_term|long_term",
      "priority": "critical|high|medium|low",
      "title": "Titre de la recommandation",
      "description": "Action détaillée à prendre",
      "expected_impact": "Impact attendu de cette action",
      "estimated_effort": "Faible|Moyen|Élevé"
    }
  ],
  "trend_evaluation": {
    "trend": "rising|stable|falling",
    "rationale": "Justification de la tendance",
    "confidence": 85
  },
  "analyzed_at": "2026-01-29T10:00:00Z",
  "confidence_score": 85
}`;

// ================================================================
// INTERFACE D'ENTRÉE POUR AAR
// ================================================================

export interface RiskAnalysisInput {
  risk: RiskExecutive;
  projectContext?: Project;
  relatedRisks?: RiskExecutive[]; // Risques similaires du même projet
  history?: any[]; // Historique des modifications
}

// ================================================================
// HELPERS: SCORING & LABELS
// ================================================================

export function getSeverityLabel(severity: number): string {
  switch (severity) {
    case 1: return 'Mineur';
    case 2: return 'Faible';
    case 3: return 'Modéré';
    case 4: return 'Élevé';
    case 5: return 'Critique';
    default: return 'Inconnu';
  }
}

export function getProbabilityLabel(probability: number): string {
  switch (probability) {
    case 1: return 'Très faible';
    case 2: return 'Faible';
    case 3: return 'Moyenne';
    case 4: return 'Élevée';
    case 5: return 'Très élevée';
    default: return 'Inconnue';
  }
}

export function getScoreLevel(score: number): 'low' | 'moderate' | 'high' | 'critical' {
  if (score >= 15) return 'critical'; // 15-25
  if (score >= 8) return 'high'; // 8-14
  if (score >= 4) return 'moderate'; // 4-7
  return 'low'; // 1-3
}

export function getScoreLevelLabel(score: number): string {
  const level = getScoreLevel(score);
  switch (level) {
    case 'critical': return 'Critique';
    case 'high': return 'Élevé';
    case 'moderate': return 'Modéré';
    case 'low': return 'Faible';
  }
}

export function getScoreLevelColor(score: number): string {
  const level = getScoreLevel(score);
  switch (level) {
    case 'critical': return 'red';
    case 'high': return 'orange';
    case 'moderate': return 'yellow';
    case 'low': return 'gray';
  }
}

export function getTrendIcon(trend: 'rising' | 'stable' | 'falling' | null): string {
  switch (trend) {
    case 'rising': return '↑';
    case 'stable': return '→';
    case 'falling': return '↓';
    default: return '';
  }
}

export function getTrendColor(trend: 'rising' | 'stable' | 'falling' | null): string {
  switch (trend) {
    case 'rising': return 'red';
    case 'stable': return 'gray';
    case 'falling': return 'green';
    default: return 'gray';
  }
}

export function getTrendLabel(trend: 'rising' | 'stable' | 'falling' | null): string {
  switch (trend) {
    case 'rising': return 'En aggravation';
    case 'stable': return 'Stable';
    case 'falling': return 'En diminution';
    default: return 'Non évalué';
  }
}

// ================================================================
// FONCTION PRINCIPALE: Analyser un risque avec AAR
// ================================================================

export async function analyzeRiskWithAAR(
  input: RiskAnalysisInput
): Promise<RiskAnalysis> {
  const { risk, projectContext, relatedRisks = [], history = [] } = input;

  // Vérifier les credentials OpenAI/Azure
  const openaiKey = process.env.OPENAI_API_KEY;
  const azureKey = process.env.AZURE_OPENAI_API_KEY;
  const azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT;

  if (!openaiKey && !azureKey) {
    throw new Error('OPENAI_API_KEY ou AZURE_OPENAI_API_KEY requis pour l\'analyse IA');
  }

  // Construire le prompt utilisateur avec contexte complet
  const userPrompt = buildUserPrompt(risk, projectContext, relatedRisks, history);

  // Configuration OpenAI/Azure
  const openai = new OpenAI({
    apiKey: openaiKey || azureKey,
    baseURL: azureEndpoint 
      ? `${azureEndpoint}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}`
      : undefined,
    defaultQuery: azureEndpoint ? { 'api-version': '2024-08-01-preview' } : undefined,
    defaultHeaders: azureEndpoint ? { 'api-key': azureKey } : undefined,
  });

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4',
      messages: [
        { role: 'system', content: AAR_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2500,
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Pas de réponse de l\'IA');
    }

    const analysis: RiskAnalysis = JSON.parse(content);

    // Validation et enrichissement
    return {
      ...analysis,
      analyzed_at: new Date(),
      confidence_score: analysis.confidence_score || 80,
    };

  } catch (error: any) {
    console.error('❌ Erreur AAR:', error);
    
    // Fallback: Analyse basique sans IA
    return generateFallbackAnalysis(risk);
  }
}

// ================================================================
// BUILDER: Prompt utilisateur enrichi
// ================================================================

function buildUserPrompt(
  risk: RiskExecutive,
  projectContext?: Project,
  relatedRisks: RiskExecutive[] = [],
  history: any[] = []
): string {
  const severityLabel = getSeverityLabel(risk.severity);
  const probabilityLabel = getProbabilityLabel(risk.probability);
  const scoreLabel = getScoreLevelLabel(risk.score);

  let prompt = `ANALYSE CE RISQUE EXÉCUTIF:

INFORMATIONS DE BASE:
- Titre: ${risk.title}
- Description: ${risk.description || 'Non renseignée'}
- Sévérité: ${risk.severity}/5 (${severityLabel})
- Probabilité: ${risk.probability}/5 (${probabilityLabel})
- Score global: ${risk.score}/25 (${scoreLabel})
- Statut actuel: ${risk.status}
`;

  // Ajouter contexte projet si disponible
  if (projectContext) {
    prompt += `\nCONTEXTE PROJET:
- Projet: ${projectContext.name}
- Description: ${projectContext.description || 'N/A'}
- Sponsor: ${projectContext.sponsor}
- Budget: ${projectContext.budget}€
- Coût actuel: ${projectContext.actual_cost}€
- Statut RAG: ${projectContext.rag_status}
- Avancement: ${projectContext.completion_percentage}%
- Probabilité retard: ${projectContext.delay_probability}%
`;
  }

  // Ajouter risques similaires pour détection patterns
  if (relatedRisks.length > 0) {
    prompt += `\nRISQUES SIMILAIRES IDENTIFIÉS (${relatedRisks.length}):
`;
    relatedRisks.slice(0, 5).forEach((r, idx) => {
      prompt += `${idx + 1}. ${r.title} (Score: ${r.score}, Statut: ${r.status}, Tendance: ${r.trend || 'N/A'})\n`;
    });
  }

  // Ajouter historique si disponible
  if (history.length > 0) {
    prompt += `\nHISTORIQUE DES MODIFICATIONS (${history.length} actions):
`;
    history.slice(0, 3).forEach((h, idx) => {
      prompt += `${idx + 1}. ${h.action}: ${h.old_value || ''} → ${h.new_value || ''}\n`;
    });
  }

  prompt += `\nMISSION:
1. Analyse approfondie du risque et de son impact
2. Détection de 1-3 risques émergents similaires
3. Évaluation de la tendance (rising/stable/falling) avec justification
4. Recommandations concrètes (immediate, short_term, long_term)
5. Priorisation des actions critiques

Fournis ton analyse au format JSON demandé.`;

  return prompt;
}

// ================================================================
// FALLBACK: Analyse basique sans IA
// ================================================================

function generateFallbackAnalysis(risk: RiskExecutive): RiskAnalysis {
  const scoreLabel = getScoreLevelLabel(risk.score);
  const severityLabel = getSeverityLabel(risk.severity);
  const probabilityLabel = getProbabilityLabel(risk.probability);

  return {
    executive_summary: `Risque ${scoreLabel.toLowerCase()} identifié avec une sévérité ${severityLabel.toLowerCase()} et une probabilité ${probabilityLabel.toLowerCase()}. Une analyse approfondie est recommandée.`,
    risk_nature: `Risque de nature ${scoreLabel.toLowerCase()} nécessitant une attention selon son score de ${risk.score}/25.`,
    impact_analysis: risk.description || 'Impact à évaluer en détail par l\'équipe projet.',
    probability_rationale: `Probabilité évaluée à ${risk.probability}/5 (${probabilityLabel}).`,
    
    emerging_risks: [],
    
    recommendations: [
      {
        type: 'immediate',
        priority: risk.score >= 15 ? 'critical' : risk.score >= 8 ? 'high' : 'medium',
        title: 'Évaluation détaillée',
        description: 'Analyser ce risque en profondeur avec l\'équipe projet.',
        expected_impact: 'Meilleure compréhension du risque',
        estimated_effort: 'Faible'
      }
    ],
    
    trend_evaluation: {
      trend: 'stable',
      rationale: 'Pas assez de données pour évaluer la tendance.',
      confidence: 50
    },
    
    analyzed_at: new Date(),
    confidence_score: 50
  };
}

// ================================================================
// EXPORT DEFAULT
// ================================================================

export default analyzeRiskWithAAR;
