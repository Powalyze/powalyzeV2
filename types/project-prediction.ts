/**
 * Project Prediction Types
 * Contracts between Powalyze and Claude AI for project analysis
 */

/**
 * Input contract: Powalyze → AI
 * Minimal project schema sent to Claude for analysis
 */
export interface ProjectInput {
  project_id: string;
  name: string;
  owner_role: string;
  budget: number | null;
  deadline: string | null;
  status: string;
  complexity: "low" | "medium" | "high";
  team_size: number | null;
  dependencies: string[];
  context: string;
  objectives: string[];
  // Enhanced context fields
  stakeholders?: string[]; // Key stakeholders involved
  risks_identified?: string[]; // Pre-identified risks by project owner
  milestones?: Array<{ name: string; date: string; completed: boolean }>; // Project milestones
  dependencies_details?: Array<{ name: string; type: string; criticality: string }>; // Detailed dependencies
  budget_breakdown?: { personnel?: number; infrastructure?: number; licenses?: number; other?: number }; // Budget details
  constraints?: string[]; // Known constraints (time, resources, regulatory)
  previous_issues?: string[]; // Historical issues from similar projects
}

/**
 * Output contract: AI → Powalyze
 * Structured prediction response from Claude
 */
export interface ProjectPrediction {
  project_id: string;
  risks: ProjectRisk[];
  opportunities: ProjectOpportunity[];
  recommended_actions: RecommendedAction[];
  summary: string;
  confidence: number; // 0 to 1
}

export interface ProjectRisk {
  label: string;
  probability: number; // 0 to 1
  impact: "faible" | "moyen" | "fort";
  mitigation: string;
}

export interface ProjectOpportunity {
  label: string;
  impact: "faible" | "moyen" | "fort";
  benefit: string;
}

export interface RecommendedAction {
  label: string;
  type: "gouvernance" | "technique" | "organisation" | "financier";
  priority: "basse" | "moyenne" | "haute";
  horizon: string; // e.g., "2 semaines", "1 mois"
  expected_effect: string;
}
