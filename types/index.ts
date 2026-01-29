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

