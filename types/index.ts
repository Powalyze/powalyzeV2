export interface Project {
  id: string;
  organization_id: string; // Renamed from tenant_id
  name: string;
  description?: string;
  owner_id?: string; // FK to profiles
  status: 'active' | 'on-hold' | 'completed' | 'cancelled';
  health: 'green' | 'yellow' | 'red'; // Renamed from rag_status
  progress: number; // Renamed from completion_percentage (0-100)
  budget?: number;
  deadline?: Date; // Renamed from end_date
  starred?: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Risk {
  id: string;
  organization_id: string; // Renamed from tenant_id
  project_id?: string; // Optional FK to projects
  title: string;
  description?: string;
  level: 'low' | 'medium' | 'high' | 'critical';
  probability?: number; // 0-100
  impact?: number; // 0-100
  status: 'open' | 'monitoring' | 'mitigated' | 'closed';
  owner_id?: string; // FK to profiles
  mitigation_plan?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Resource {
  id: string;
  organization_id: string; // Renamed from tenant_id
  name: string;
  type: 'human' | 'material' | 'financial';
  capacity?: number;
  unit?: string;
  cost_per_unit?: number;
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
  organization_id: string; // Renamed from tenant_id
  project_id?: string; // Optional FK to projects
  title: string;
  description?: string;
  committee?: string; // e.g., 'CODIR', 'COMEX'
  decision_date?: Date;
  status: 'pending' | 'approved' | 'rejected' | 'deferred';
  owner_id?: string; // FK to profiles
  impacts?: any[]; // JSONB field
  created_at: Date;
  updated_at: Date;
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

// ============================================
// NOUVELLES TABLES COCKPIT V3
// ============================================

export interface Scenario {
  id: string;
  organization_id: string;
  project_id: string;
  type: 'optimistic' | 'central' | 'pessimistic';
  name: string;
  description?: string;
  probability: number; // 0-100
  delivery_date?: Date;
  final_budget?: number;
  business_impacts: string[];
  actions: string[];
  created_at: Date;
  updated_at: Date;
}

export interface ProjectObjective {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  measurable?: string; // KPI
  deadline?: Date;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  created_at: Date;
  updated_at: Date;
}

export interface AIGeneration {
  id: string;
  organization_id: string;
  user_id?: string;
  entity_type: 'project' | 'risk' | 'decision' | 'report' | 'scenario' | 'objective' | 'portfolio';
  entity_id?: string;
  generation_type: string;
  prompt_used?: string;
  model?: string;
  input_data: any;
  output_data: any;
  tokens_used?: number;
  latency_ms?: number;
  success: boolean;
  error_message?: string;
  created_at: Date;
}
