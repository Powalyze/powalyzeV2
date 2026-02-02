/**
 * Moteur IA pour la génération d'actions Chief of Staff réelles
 * 
 * Ce module génère des actions stratégiques personnalisées
 * en fonction du contexte réel du portefeuille client.
 */

import { Project, Risk } from "@/types";

export interface AIGeneratedAction {
  title: string;
  impact: string;
  priority: "critical" | "high" | "medium" | "low";
  category: "optimization" | "risk" | "cost" | "velocity" | "strategic";
  confidence: number; // 0-100
}

/**
 * PROMPT SYSTÈME pour la génération d'actions Chief of Staff
 */
export const AI_CHIEF_ACTIONS_PROMPT = `
Tu es le Chief of Staff IA de Powalyze, spécialisé dans la génération d'actions stratégiques pour dirigeants.

RÈGLES STRICTES :
1. Tu génères UNIQUEMENT des actions basées sur les données fournies
2. Tu ne dois JAMAIS inventer de données, projets, ou métriques
3. Chaque action doit être actionnable, mesurable, et stratégique
4. Tu dois prioriser les actions par impact business
5. Tu dois toujours indiquer l'impact quantifié (€, %, jours)

TYPES D'ACTIONS À GÉNÉRER :
1. OPTIMISATION : Améliorer la vélocité, la qualité, les processus
2. RISQUE : Identifier et prévenir les risques critiques
3. COÛT : Réduire les dépenses, optimiser le budget
4. VÉLOCITÉ : Accélérer la livraison, réduire les délais
5. STRATÉGIQUE : Préparer comités, simulations, décisions clés

FORMAT DE SORTIE (JSON) :
{
  "title": "Action concise et claire (max 50 caractères)",
  "impact": "Impact quantifié (ex: +12% vélocité, -450K€, 3 sem. avant)",
  "priority": "critical|high|medium|low",
  "category": "optimization|risk|cost|velocity|strategic",
  "confidence": 85
}

CONTRAINTES :
- Maximum 6 actions par analyse
- Prioriser les actions à fort impact business
- Toujours quantifier l'impact (€, %, temps)
- Aucune action générique ou vague
- Chaque action doit être unique et non redondante

CONTEXTE FOURNI :
- Projets actifs avec budgets, délais, statuts
- Risques identifiés avec scores
- Métriques de performance (vélocité, qualité, charge)
- Historique des décisions et comités

INTERDICTIONS :
- JAMAIS utiliser de données d'exemple ou mockées
- JAMAIS générer d'actions sans contexte réel
- JAMAIS inventer des chiffres ou des impacts
- JAMAIS proposer d'actions impossibles à mesurer
`;

/**
 * Génère des actions Chief of Staff basées sur le contexte réel du portefeuille
 */
export async function generateChiefActions(input: {
  projects: Project[];
  risks: Risk[];
  organizationContext?: string;
}): Promise<AIGeneratedAction[]> {
  const { projects, risks, organizationContext } = input;

  // Si pas de données, retourner un tableau vide
  if (!projects || projects.length === 0) {
    return [];
  }

  // Préparer le contexte pour l'IA
  const context = `
ORGANISATION : ${organizationContext || "Non spécifié"}

PROJETS (${projects.length}) :
${JSON.stringify(projects, null, 2)}

RISQUES (${risks.length}) :
${JSON.stringify(risks, null, 2)}

Génère entre 3 et 6 actions stratégiques Chief of Staff basées sur ce contexte réel.
Priorise les actions à fort impact business et quantifie chaque impact.
`;

  try {
    // Appel à l'API OpenAI (ou autre modèle)
    const response = await fetch("/api/ai/chief-actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: AI_CHIEF_ACTIONS_PROMPT,
        context,
      }),
    });

    if (!response.ok) {
      console.error("Failed to generate Chief actions:", response.statusText);
      return [];
    }

    const data = await response.json();
    return data.actions || [];
  } catch (error) {
    console.error("Error generating Chief actions:", error);
    return [];
  }
}

/**
 * Analyse le portefeuille et calcule les métriques pour le Chief of Staff
 */
export function analyzePortfolio(projects: Project[], risks: Risk[]) {
  const projectsAnalyzed = projects.length;
  const risksDetected = risks.filter((r) => r.status === "open" || r.status === "monitoring").length;
  
  // Calcul des opportunités : projets actifs avec marge d'optimisation
  const opportunitiesIdentified = projects.filter(
    (p) => p.status === "active"
  ).length;

  return {
    projectsAnalyzed,
    risksDetected,
    opportunitiesIdentified,
  };
}

/**
 * Convertit les actions IA en format simple pour l'affichage
 */
export function formatActionsForDisplay(actions: AIGeneratedAction[]): string[] {
  return actions.map((action) => `${action.title} • ${action.impact}`);
}
