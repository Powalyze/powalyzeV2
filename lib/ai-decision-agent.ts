/**
 * AGENT DÉCISIONNEL (AD) - PACK 9
 * 
 * Service IA pour l'arbitrage et l'analyse des décisions exécutives.
 * Génère options, impacts, recommandations et actions immédiates.
 */

import OpenAI from 'openai';
import type { Decision, DecisionAnalysis } from '@/types';

// ================================================
// PROMPT SYSTÈME AGENT DÉCISIONNEL
// ================================================

const AD_SYSTEM_PROMPT = `Tu es l'Agent Décisionnel (AD) de Powalyze, un système IA spécialisé dans l'arbitrage des décisions exécutives pour les COMEX et directions.

**TES CAPACITÉS** :
- Analyser les décisions stratégiques et opérationnelles
- Générer 3 options d'arbitrage (conservatrice, équilibrée, agressive)
- Évaluer les impacts court/moyen/long terme
- Recommander l'option la plus pertinente
- Proposer des actions immédiates concrètes

**TES RÈGLES** :
1. Ton analyse doit être **claire, directe, actionnaire**
2. Pas de jargon, pas de blabla, pas de langue de bois
3. Chaque option doit avoir 2-3 pros et 2-3 cons concrets
4. Les impacts doivent être quantifiés quand possible
5. La recommandation doit être justifiée en 1 phrase
6. Les actions immédiates doivent être **actionnables aujourd'hui**
7. Ton niveau de confiance doit refléter la qualité des données d'entrée

**FORMAT DE SORTIE (JSON)** :
{
  "summary": "Résumé exécutif en 2-3 lignes max",
  "options": {
    "A": {
      "title": "Option conservatrice",
      "description": "Description courte",
      "pros": ["Pro 1", "Pro 2"],
      "cons": ["Con 1", "Con 2"],
      "risk_level": "low",
      "estimated_cost": 50000,
      "estimated_duration": "2 semaines"
    },
    "B": { /* Option équilibrée */ },
    "C": { /* Option agressive */ }
  },
  "impacts": {
    "short_term": "Impact court terme (0-3 mois)",
    "medium_term": "Impact moyen terme (3-12 mois)",
    "long_term": "Impact long terme (>12 mois)"
  },
  "recommendation": "B",
  "actions": [
    "Action immédiate 1",
    "Action immédiate 2"
  ],
  "confidence": 0.85
}

**EXEMPLES D'ANALYSE** :

Décision : "Migrer notre infrastructure vers Azure"
→ Option A : Migration progressive sur 12 mois (low risk, 500K€)
→ Option B : Migration en 6 mois avec support externe (medium risk, 750K€)
→ Option C : Big Bang en 3 mois (high risk, 1M€)
→ Recommandation : B (équilibre risque/vélocité)

Décision : "Recruter une équipe offshore"
→ Option A : 2 développeurs juniors (low risk, 80K€/an)
→ Option B : 5 développeurs mid-level (medium risk, 200K€/an)
→ Option C : 10 développeurs + lead (high risk, 500K€/an)
→ Recommandation : B (montée en puissance rapide sans explosion des coûts)

**TON STYLE** :
- Direct et factuel
- Orienté action
- Quantifié quand possible
- Pas de conditionnel ("pourrait", "devrait")
- Affirmatif ("impacte", "coûte", "prend")
`;

// ================================================
// INTERFACE OPENAI
// ================================================

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// ================================================
// FONCTION PRINCIPALE : ANALYSER DÉCISION
// ================================================

interface AnalyzeDecisionInput {
  decision: Decision;
  projectContext?: {
    name: string;
    budget: number;
    team_size: number;
    status: string;
  };
}

export async function analyzeDecisionWithAI(
  input: AnalyzeDecisionInput
): Promise<DecisionAnalysis> {
  const { decision, projectContext } = input;

  // Construire le prompt utilisateur
  const userPrompt = buildUserPrompt(decision, projectContext);

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: AD_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Aucune réponse de l\'IA');
    }

    const analysis = JSON.parse(content) as DecisionAnalysis;
    
    // Ajouter timestamp
    analysis.generated_at = new Date();
    
    // Validation
    validateAnalysis(analysis);
    
    return analysis;
  } catch (error) {
    console.error('[AD] Erreur lors de l\'analyse :', error);
    throw new Error('Impossible d\'analyser la décision. Vérifiez la configuration OpenAI.');
  }
}

// ================================================
// CONSTRUCTION DU PROMPT UTILISATEUR
// ================================================

function buildUserPrompt(
  decision: Decision,
  projectContext?: { name: string; budget: number; team_size: number; status: string }
): string {
  let prompt = `**DÉCISION À ANALYSER**

Titre : ${decision.title}
Description : ${decision.description || 'Non renseignée'}
Owner : ${decision.owner}
Statut actuel : ${decision.status}

**SCORING ACTUEL** :
- Impact : ${decision.impact_score}/5 (${getScoreLabel(decision.impact_score, 'impact')})
- Urgence : ${decision.urgency_score}/5 (${getScoreLabel(decision.urgency_score, 'urgence')})
- Complexité : ${decision.complexity_score}/5 (${getScoreLabel(decision.complexity_score, 'complexité')})
- Score de priorité : ${decision.priority_score.toFixed(2)}/5

Deadline : ${decision.deadline ? new Date(decision.deadline).toLocaleDateString('fr-FR') : 'Non définie'}
`;

  // Ajouter contexte projet si disponible
  if (projectContext) {
    prompt += `\n**CONTEXTE PROJET** :
Projet : ${projectContext.name}
Budget : ${formatCurrency(projectContext.budget)}
Taille équipe : ${projectContext.team_size} personnes
Statut : ${projectContext.status}
`;
  }

  prompt += `\n**INSTRUCTION** :
Analyse cette décision et génère :
1. Un résumé exécutif (2-3 lignes max)
2. 3 options d'arbitrage (A: conservatrice, B: équilibrée, C: agressive)
3. Les impacts court/moyen/long terme
4. Ta recommandation avec justification
5. 2-3 actions immédiates actionnables

Retourne le JSON tel que défini dans le système prompt.`;

  return prompt;
}

// ================================================
// HELPERS
// ================================================

function getScoreLabel(score: number, type: 'impact' | 'urgence' | 'complexité'): string {
  const labels = {
    impact: ['Mineur', 'Faible', 'Modéré', 'Fort', 'Critique'],
    urgence: ['Long terme', 'Différable', 'Modéré', 'Urgent', 'Immédiat'],
    complexité: ['Simple', 'Facile', 'Modéré', 'Complexe', 'Très complexe'],
  };
  return labels[type][score - 1] || 'Inconnu';
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function validateAnalysis(analysis: DecisionAnalysis): void {
  // Vérifier structure
  if (!analysis.summary || !analysis.options || !analysis.impacts || !analysis.recommendation) {
    throw new Error('Analyse IA incomplète');
  }

  // Vérifier options A, B, C
  if (!analysis.options.A || !analysis.options.B || !analysis.options.C) {
    throw new Error('Les 3 options doivent être présentes');
  }

  // Vérifier recommandation valide
  if (!['A', 'B', 'C'].includes(analysis.recommendation)) {
    throw new Error('Recommandation invalide');
  }

  // Vérifier confidence
  if (analysis.confidence < 0 || analysis.confidence > 1) {
    analysis.confidence = 0.7; // Default
  }

  // Vérifier actions
  if (!Array.isArray(analysis.actions) || analysis.actions.length === 0) {
    throw new Error('Au moins 1 action immédiate requise');
  }
}

// ================================================
// CALCUL PRIORITÉ (pour référence front-end)
// ================================================

export function calculatePriorityScore(
  impact: number,
  urgency: number,
  complexity: number
): number {
  return impact * 0.5 + urgency * 0.3 + complexity * 0.2;
}

export function getPriorityLevel(score: number): 'high' | 'medium' | 'low' {
  if (score >= 4) return 'high';
  if (score >= 3) return 'medium';
  return 'low';
}

export function getPriorityColor(level: 'high' | 'medium' | 'low'): string {
  const colors = {
    high: 'text-red-500',
    medium: 'text-orange-500',
    low: 'text-gray-500',
  };
  return colors[level];
}

export function getPriorityBadgeColor(level: 'high' | 'medium' | 'low'): string {
  const colors = {
    high: 'bg-red-500/10 text-red-500 border-red-500/20',
    medium: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    low: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  };
  return colors[level];
}

// ================================================
// EXPORT
// ================================================

export type { AnalyzeDecisionInput };
