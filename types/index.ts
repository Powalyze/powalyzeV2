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
  project_id: string; // OBLIGATOIRE
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
  role: 'COMEX' | 'PMO' | 'ANALYSTE' | 'admin' | 'client' | 'demo'; // Système à 3 modes
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

// Décision rattachée à un projet
export interface Decision {
  id: string;
  tenant_id: string;
  project_id: string; // OBLIGATOIRE
  title: string;
  description: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'IMPLEMENTED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  decision_maker: string;
  decision_date?: Date;
  rationale?: string;
  impact?: string;
  created_at: Date;
  updated_at: Date;
  created_by?: string;
}

// Action/tâche rattachée à un projet
export interface Action {
  id: string;
  organization_id: string;
  project_id: string; // OBLIGATOIRE
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assigned_to?: string;
  due_date?: Date;
  related_risk_id?: string;
  related_decision_id?: string;
  metadata?: Record<string, any>;
  created_at: Date;
  updated_at: Date;
  created_by?: string;
}

// Log d'audit rattaché à un projet
export interface AuditLog {
  id: string;
  organization_id: string;
  project_id?: string;
  action_type: string;
  entity_type: string;
  entity_id?: string;
  description?: string;
  metadata?: Record<string, any>;
  user_id?: string;
  user_email?: string;
  created_at: Date;
}

// Rapport importé et analysé par IA
export interface Report {
  id: string;
  organization_id: string;
  project_id: string; // OBLIGATOIRE
  file_name: string;
  file_url: string;
  file_type: string;
  file_size?: number;
  processed_content?: Record<string, any>;
  summary?: string;
  insights?: Array<{
    title: string;
    description: string;
    priority?: 'low' | 'medium' | 'high' | 'critical';
  }>;
  risks_detected?: Array<{
    title: string;
    description: string;
    probability?: number;
    impact?: number;
  }>;
  decisions_suggested?: Array<{
    title: string;
    description: string;
    type?: string;
  }>;
  charts?: Array<{
    type: 'line' | 'bar' | 'pie' | 'area' | 'scatter';
    title: string;
    description?: string;
    data: any;
    config: any;
  }>;
  narrative?: string;
  version: number;
  created_at: Date;
  updated_at?: Date;
  created_by?: string;
}
