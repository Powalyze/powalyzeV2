export interface Project {
  id: string;
  tenant_id: string;
  name: string;
  description?: string;
  sponsor: string;
  business_unit: string;
  budget: number;
  actual_cost: number;
  status: 'DRAFT' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
  rag_status: 'GREEN' | 'YELLOW' | 'RED';
  start_date: Date;
  end_date: Date;
  completion_percentage: number;
  delay_probability: number;
  created_at: Date;
  updated_at: Date;
}

export interface Risk {
  id: string;
  tenant_id: string;
  project_id: string;
  title: string;
  description: string;
  category: 'TECHNICAL' | 'FINANCIAL' | 'ORGANIZATIONAL' | 'EXTERNAL';
  probability: number;
  impact: number;
  score: number;
  status: 'IDENTIFIED' | 'ASSESSED' | 'MITIGATED' | 'CLOSED';
  mitigation_plan?: string;
  owner: string;
  created_at: Date;
  updated_at: Date;
}

export interface Resource {
  id: string;
  tenant_id: string;
  name: string;
  role: string;
  department: string;
  capacity_hours: number;
  allocated_hours: number;
  availability_percentage: number;
  cost_per_hour: number;
  skills: string[];
  created_at: Date;
  updated_at: Date;
}

export interface Finance {
  id: string;
  tenant_id: string;
  project_id: string;
  budget_total: number;
  cost_actual: number;
  cost_forecast: number;
  variance: number;
  variance_percentage: number;
  roi_expected: number;
  roi_actual: number;
  period: string;
  created_at: Date;
  updated_at: Date;
}

export interface User {
  id: string;
  tenant_id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  role: 'COMEX' | 'PMO' | 'ANALYSTE';
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Tenant {
  id: string;
  name: string;
  domain: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface AIPrediction {
  type: 'DELAY' | 'RISK' | 'BUDGET';
  probability: number;
  confidence: number;
  explanation: string;
  recommendations: string[];
  factors: Array<{
    name: string;
    impact: number;
    description: string;
  }>;
}

// ================================================
// DÉCISIONS EXÉCUTIVES (PACK 9)
// ================================================

export interface Decision {
  id: string;
  organization_id: string;
  project_id: string | null;
  
  // Informations de base
  title: string;
  description: string | null;
  owner: string;
  status: 'open' | 'in_progress' | 'closed';
  
  // Scoring & Priorisation
  impact_score: number; // 1-5
  urgency_score: number; // 1-5
  complexity_score: number; // 1-5
  priority_score: number; // Calculé automatiquement
  
  // Timeline
  deadline: Date | null;
  created_at: Date;
  updated_at: Date;
  closed_at: Date | null;
  
  // Analyse IA
  ai_analysis: DecisionAnalysis | null;
  ai_analyzed_at: Date | null;
  selected_option: 'A' | 'B' | 'C' | null;
  
  // Audit
  created_by: string | null;
  updated_by: string | null;
  
  // Relations (jointures)
  project?: Project;
  history?: DecisionHistory[];
}

export interface DecisionAnalysis {
  summary: string; // Résumé exécutif (3 lignes)
  options: {
    A: DecisionOption; // Conservatrice
    B: DecisionOption; // Équilibrée
    C: DecisionOption; // Agressive
  };
  impacts: {
    short_term: string;
    medium_term: string;
    long_term: string;
  };
  recommendation: 'A' | 'B' | 'C';
  actions: string[]; // 2-3 actions immédiates
  confidence: number; // 0-1
  generated_at: Date;
}

export interface DecisionOption {
  title: string;
  description: string;
  pros: string[];
  cons: string[];
  risk_level: 'low' | 'medium' | 'high';
  estimated_cost: number | null;
  estimated_duration: string | null; // "2 semaines", "1 mois"
}

export interface DecisionHistory {
  id: string;
  decision_id: string;
  
  // Changement
  action: 'created' | 'updated' | 'analyzed' | 'option_selected' | 'closed';
  field: string | null;
  old_value: string | null;
  new_value: string | null;
  
  // Context
  comment: string | null;
  ai_metadata: Record<string, any> | null;
  
  // Audit
  timestamp: Date;
  user_id: string | null;
  user_email: string | null;
}

export interface DecisionFormData {
  title: string;
  description: string;
  owner: string;
  project_id: string | null;
  impact_score: number;
  urgency_score: number;
  complexity_score: number;
  deadline: Date | null;
}

export interface DecisionFilters {
  status?: 'open' | 'in_progress' | 'closed' | 'all';
  owner?: string;
  project_id?: string;
  priority?: 'high' | 'medium' | 'low';
  search?: string;
}

// ================================================================
// PACK 10 - MODULE RISQUES EXÉCUTIFS
// ================================================================

export interface RiskExecutive {
  id: string;
  organization_id: string;
  project_id: string | null;
  
  // Informations de base
  title: string;
  description: string | null;
  
  // Scoring (1-5)
  severity: number; // 1=Faible, 5=Critique
  probability: number; // 1=Très faible, 5=Très élevée
  score: number; // Auto-calculé: severity * probability (1-25)
  
  // Statut
  status: 'open' | 'in_progress' | 'mitigated' | 'closed';
  
  // Tendance (calculée par IA AAR)
  trend: 'rising' | 'stable' | 'falling' | null;
  
  // Analyse IA (Agent AAR)
  ai_analysis: RiskAnalysis | null;
  ai_analyzed_at: Date | null;
  
  // Mitigation
  mitigation_actions: string | null;
  mitigation_date: Date | null;
  mitigated_by: string | null;
  
  // Métadonnées
  created_by: string | null;
  created_at: Date;
  updated_at: Date;
  closed_at: Date | null;
  
  // Relations (joined)
  project?: Project | null;
  history?: RiskHistory[];
}

export interface RiskAnalysis {
  // Résumé exécutif
  executive_summary: string;
  
  // Analyse détaillée
  risk_nature: string;
  impact_analysis: string;
  probability_rationale: string;
  
  // Risques émergents détectés
  emerging_risks: EmergingRisk[];
  
  // Recommandations
  recommendations: RiskRecommendation[];
  
  // Tendance évaluée
  trend_evaluation: {
    trend: 'rising' | 'stable' | 'falling';
    rationale: string;
    confidence: number; // 0-100%
  };
  
  // Métadonnées
  analyzed_at: Date;
  confidence_score: number; // 0-100%
}

export interface EmergingRisk {
  title: string;
  description: string;
  probability_evolution: string; // "Augmentation probable", "Stable", etc.
  potential_impact: string;
  detection_confidence: number; // 0-100%
}

export interface RiskRecommendation {
  type: 'immediate' | 'short_term' | 'long_term';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  expected_impact: string;
  estimated_effort: string; // "Faible", "Moyen", "Élevé"
}

export interface RiskHistory {
  id: string;
  risk_id: string;
  organization_id: string;
  
  // Action effectuée
  action: 'created' | 'updated' | 'severity_changed' | 'probability_changed' | 
          'status_changed' | 'trend_changed' | 'ai_analyzed' | 'mitigation_added' | 
          'mitigated' | 'closed';
  
  // Données de l'action
  old_value: string | null;
  new_value: string | null;
  details: Record<string, any> | null;
  
  // Audit
  performed_by: string | null;
  performed_at: Date;
}

export interface RiskFormData {
  title: string;
  description: string;
  project_id: string | null;
  severity: number; // 1-5
  probability: number; // 1-5
  mitigation_actions?: string;
}

export interface RiskFilters {
  status?: 'open' | 'in_progress' | 'mitigated' | 'closed' | 'all';
  severity?: 1 | 2 | 3 | 4 | 5 | 'all';
  probability?: 1 | 2 | 3 | 4 | 5 | 'all';
  score_min?: number; // 1-25
  score_max?: number; // 1-25
  trend?: 'rising' | 'stable' | 'falling' | 'all';
  project_id?: string;
  search?: string;
}

export interface RiskStats {
  total: number;
  open: number;
  in_progress: number;
  mitigated: number;
  closed: number;
  
  // Stats par criticité (score)
  critical: number; // score 15-25
  high: number; // score 8-14
  moderate: number; // score 4-7
  low: number; // score 1-3
  
  // Stats par tendance
  rising: number;
  stable: number;
  falling: number;
  
  // Distribution heatmap
  heatmap: HeatmapCell[];
}

export interface HeatmapCell {
  severity: number; // 1-5
  probability: number; // 1-5
  count: number; // Nombre de risques dans cette cellule
  risk_ids: string[]; // IDs des risques
}

