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
