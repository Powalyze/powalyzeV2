/**
 * ProjectPredictor - Claude AI Engine for Project Analysis
 * Analyzes project data and generates predictions for risks, opportunities, and recommended actions
 */

import type { ProjectInput, ProjectPrediction } from "@/types/project-prediction";

/**
 * Master system prompt for ProjectPredictor
 * Enforces strict JSON output and consistent analysis behavior
 */
export const PROJECT_PREDICTOR_SYSTEM_PROMPT = `Tu es le moteur prédictif de Powalyze, appelé "ProjectPredictor".

RÔLE
Tu reçois la description structurée d'un projet sous forme de JSON.
Tu dois analyser ce projet et renvoyer une prédiction structurée sur :
- les risques probables
- les opportunités
- les actions recommandées
- un résumé exécutif
- un niveau de confiance

CONTRAINTES
- Tu ne dois JAMAIS inventer de données d'entrée.
- Tu ne dois JAMAIS utiliser de contexte précédent.
- Tu ne dois te baser QUE sur le JSON fourni.
- Si une information manque, tu assumes "inconnu" et tu restes prudent.
- Tu ne renvoies AUCUN texte libre en dehors du JSON demandé.
- Tu ne fais AUCUN marketing, uniquement de l'analyse.

FORMAT D'ENTRÉE
Tu reçois un JSON avec au minimum :
{
  "project_id": string,
  "name": string,
  "owner_role": string,
  "budget": number | null,
  "deadline": string | null,
  "status": string,
  "complexity": string,
  "team_size": number | null,
  "dependencies": string[],
  "context": string,
  "objectives": string[]
}

FORMAT DE SORTIE
Tu dois TOUJOURS renvoyer un JSON strictement au format suivant :

{
  "project_id": string,
  "risks": [
    {
      "label": string,
      "probability": number,        // entre 0 et 1
      "impact": "faible" | "moyen" | "fort",
      "mitigation": string
    }
  ],
  "opportunities": [
    {
      "label": string,
      "impact": "faible" | "moyen" | "fort",
      "benefit": string
    }
  ],
  "recommended_actions": [
    {
      "label": string,
      "type": "gouvernance" | "technique" | "organisation" | "financier",
      "priority": "basse" | "moyenne" | "haute",
      "horizon": string,            // ex : "2 semaines", "1 mois"
      "expected_effect": string
    }
  ],
  "summary": string,
  "confidence": number              // entre 0 et 1
}

RÈGLES DE COMPORTEMENT
- Si le projet est très peu décrit, tu renvoies peu de risques et d'actions, avec une confiance faible.
- Si le projet est bien décrit, tu peux détailler davantage.
- Tu ne dois jamais dépasser 5 risques, 5 opportunités et 7 actions recommandées.
- Tu dois rester concret, opérationnel, orienté décision.

SORTIE
Tu renvoies UNIQUEMENT le JSON, sans commentaire, sans texte autour.`;

/**
 * Analyzes a project using Claude AI and returns structured predictions
 * @param projectInput - Structured project data following ProjectInput contract
 * @returns ProjectPrediction with risks, opportunities, and actions
 */
export async function analyzeProjectWithAI(
  projectInput: ProjectInput
): Promise<ProjectPrediction> {
  try {
    // Dynamically import OpenAI SDK (graceful degradation if not available)
    let OpenAI: any;
    try {
      const openaiModule = await import("openai");
      OpenAI = openaiModule.default;
    } catch {
      console.warn("OpenAI SDK not available, returning mock prediction");
      return getMockPrediction(projectInput);
    }

    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
      console.warn("OPENAI_API_KEY not configured, returning mock prediction");
      return getMockPrediction(projectInput);
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Call Claude API (via OpenAI-compatible endpoint)
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: PROJECT_PREDICTOR_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: JSON.stringify(projectInput, null, 2),
        },
      ],
      temperature: 0.3, // Low temperature for consistent, factual analysis
      response_format: { type: "json_object" },
    });

    // Extract and parse AI response
    const aiResponse = completion.choices[0]?.message?.content;
    if (!aiResponse) {
      throw new Error("Empty response from AI");
    }

    const prediction: ProjectPrediction = JSON.parse(aiResponse);

    // Validate response structure
    if (!prediction.project_id || !prediction.risks || !prediction.recommended_actions) {
      throw new Error("Invalid prediction structure from AI");
    }

    return prediction;
  } catch (error) {
    console.error("Error analyzing project with AI:", error);
    // Fallback to mock prediction on error
    return getMockPrediction(projectInput);
  }
}

/**
 * Returns a mock prediction for testing or when AI is unavailable
 * @param projectInput - Project input data
 * @returns Mock ProjectPrediction
 */
function getMockPrediction(projectInput: ProjectInput): ProjectPrediction {
  return {
    project_id: projectInput.project_id,
    risks: [
      {
        label: "Analyse IA non disponible",
        probability: 0,
        impact: "faible",
        mitigation: "Configurer OPENAI_API_KEY pour activer l'analyse prédictive.",
      },
    ],
    opportunities: [],
    recommended_actions: [
      {
        label: "Configurer l'API OpenAI",
        type: "technique",
        priority: "moyenne",
        horizon: "1 semaine",
        expected_effect: "Activation de l'analyse prédictive automatique.",
      },
    ],
    summary: "Analyse prédictive non disponible. Veuillez configurer l'API OpenAI.",
    confidence: 0,
  };
}

/**
 * Formats a CockpitProject for AI analysis
 * Converts internal project format to ProjectInput contract
 */
export function formatProjectForAI(project: any): ProjectInput {
  return {
    project_id: project.id || crypto.randomUUID(),
    name: project.name || "Projet sans nom",
    owner_role: project.team || "Non spécifié",
    budget: project.budget ? parseBudget(project.budget) : null,
    deadline: project.deadline || null,
    status: project.status || "planned",
    complexity: mapComplexity(project.risk),
    team_size: project.team ? estimateTeamSize(project.team) : null,
    dependencies: [],
    context: `Budget: ${project.budget}, Progression: ${project.progress}%, Risque: ${project.risk}`,
    objectives: [],
  };
}

/**
 * Parse budget string to number (e.g., "1.2M€" → 1200000)
 */
function parseBudget(budget: string): number | null {
  const match = budget.match(/(\d+(?:\.\d+)?)\s*([MK])?/i);
  if (!match) return null;
  
  const value = parseFloat(match[1]);
  const multiplier = match[2]?.toUpperCase();
  
  if (multiplier === "M") return value * 1000000;
  if (multiplier === "K") return value * 1000;
  return value;
}

/**
 * Map risk level to complexity
 */
function mapComplexity(risk: string): "low" | "medium" | "high" {
  if (risk === "red") return "high";
  if (risk === "orange") return "medium";
  return "low";
}

/**
 * Estimate team size from team string
 */
function estimateTeamSize(team: string): number {
  const match = team.match(/(\d+)/);
  return match ? parseInt(match[1]) : 5;
}
