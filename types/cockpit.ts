// ============================================
// COCKPIT EXECUTIVE - Types TypeScript
// Architecture produit pour Powalyze SaaS
// ============================================

// ============================================
// CORE ENTITIES
// ============================================

export interface Organization {
  id: string;
  name: string;
  domain: string;
  context?: string;
  settings?: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  organization_id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'COMEX' | 'PMO' | 'PM' | 'ANALYSTE' | 'ADMIN';
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================
// COCKPIT: Projects
// ============================================

export type ProjectStatus = 'DRAFT' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
export type RAGStatus = 'GREEN' | 'YELLOW' | 'RED' | 'GRAY';
export type Criticality = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Project {
  id: string;
  organization_id: string;
  name: string;
  description?: string;
  sponsor: string;
  pm?: string;
  business_unit?: string;
  budget: number;
  actual_cost: number;
  status: ProjectStatus;
  rag_status: RAGStatus;
  criticality?: Criticality;
  start_date: string;
  end_date: string;
  completion_percentage: number;
  delay_probability: number;
  created_at: string;
  updated_at: string;
}

// ============================================
// COCKPIT: Risks
// ============================================

export type RiskCategory = 'TECHNICAL' | 'FINANCIAL' | 'ORGANIZATIONAL' | 'EXTERNAL' | 'STRATEGIC';
export type RiskStatus = 'IDENTIFIED' | 'ASSESSED' | 'MITIGATING' | 'MITIGATED' | 'CLOSED';

export interface Risk {
  id: string;
  organization_id: string;
  project_id?: string;
  title: string;
  description: string;
  category: RiskCategory;
  probability: number; // 0-100
  impact: number; // 0-100
  score?: number; // Auto-calculated: (probability * impact) / 100
  status: RiskStatus;
  mitigation_plan?: string;
  owner: string;
  created_at: string;
  updated_at: string;
}

// ============================================
// COCKPIT: Decisions
// ============================================

export type DecisionType = 'GO_NOGO' | 'BUDGET' | 'SCOPE' | 'RESOURCE' | 'STRATEGIC' | 'OPERATIONAL' | 'OTHER';
export type DecisionStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'DEFERRED';

export interface Decision {
  id: string;
  organization_id: string;
  project_id?: string;
  title: string;
  description: string;
  type: DecisionType;
  status: DecisionStatus;
  committee_id?: string;
  decision_date?: string;
  owner: string;
  justification?: string;
  impact_assessment?: string;
  created_at: string;
  updated_at: string;
}

// ============================================
// COCKPIT: Committees
// ============================================

export type CommitteeType = 'COMEX' | 'CODIR' | 'COPIL' | 'STEERING' | 'OTHER';
export type MeetingFrequency = 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'AD_HOC';

export interface CommitteeMember {
  name: string;
  role: string;
  email?: string;
}

export interface Committee {
  id: string;
  organization_id: string;
  name: string;
  type: CommitteeType;
  description?: string;
  frequency?: MeetingFrequency;
  members: CommitteeMember[];
  next_meeting_date?: string;
  last_meeting_date?: string;
  created_at: string;
  updated_at: string;
}

// ============================================
// COCKPIT: Actions
// ============================================

export type ActionStatus = 'TODO' | 'IN_PROGRESS' | 'BLOCKED' | 'DONE' | 'CANCELLED';
export type ActionPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Action {
  id: string;
  organization_id: string;
  project_id?: string;
  decision_id?: string;
  risk_id?: string;
  title: string;
  description?: string;
  owner: string;
  status: ActionStatus;
  priority?: ActionPriority;
  due_date: string;
  completed_date?: string;
  created_at: string;
  updated_at: string;
}

// ============================================
// COCKPIT: Events / Logs
// ============================================

export type EntityType = 'PROJECT' | 'RISK' | 'DECISION' | 'ACTION' | 'COMMITTEE';

export interface Event {
  id: string;
  organization_id: string;
  entity_type: EntityType;
  entity_id: string;
  event_type: string;
  description: string;
  metadata?: Record<string, any>;
  user_id?: string;
  created_at: string;
}

// ============================================
// SUPPORT: Resources (Phase 2)
// ============================================

export interface Resource {
  id: string;
  organization_id: string;
  name: string;
  role: string;
  department?: string;
  capacity_hours: number;
  allocated_hours: number;
  availability_percentage: number;
  cost_per_hour?: number;
  skills: string[];
  created_at: string;
  updated_at: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// ============================================
// COCKPIT DASHBOARD TYPES
// ============================================

export interface CockpitDashboard {
  projects: {
    total: number;
    active: number;
    critical: number;
    by_status: Record<ProjectStatus, number>;
    by_rag: Record<RAGStatus, number>;
  };
  risks: {
    total: number;
    critical: number;
    high_probability: number;
    by_status: Record<RiskStatus, number>;
  };
  decisions: {
    total: number;
    pending: number;
    by_type: Record<DecisionType, number>;
  };
  actions: {
    total: number;
    overdue: number;
    critical: number;
    by_status: Record<ActionStatus, number>;
  };
}

export interface CockpitView360 {
  projects: Project[];
  risks: Risk[];
  decisions: Decision[];
  actions: Action[];
  committees: Committee[];
  recent_events: Event[];
}

// ============================================
// IA NARRATIVE TYPES
// ============================================

export interface ExecutiveSummaryRequest {
  organization_id: string;
  scope?: 'all' | 'next_committee' | 'critical_only';
  filters?: {
    project_ids?: string[];
    criticality?: Criticality[];
    time_horizon?: 'week' | 'month' | 'quarter';
  };
  committee_id?: string;
}

export interface ExecutiveSummaryResponse {
  summary: string;
  critical_points: string[];
  risks_highlight: {
    risk: Risk;
    narrative: string;
  }[];
  decisions_required: {
    decision: Decision;
    context: string;
    recommendation: string;
  }[];
  actions_priority: {
    action: Action;
    urgency: string;
  }[];
  scenarios?: {
    title: string;
    description: string;
    probability: number;
    impact: string;
  }[];
  recommendations: string[];
  generated_at: string;
}

export interface CommitteeBriefRequest {
  committee_id: string;
  meeting_date: string;
  include_projects?: string[];
  focus_areas?: string[];
}

export interface CommitteeBriefResponse {
  committee: Committee;
  executive_summary: string;
  agenda_items: {
    title: string;
    type: 'decision' | 'update' | 'risk' | 'action';
    priority: 'high' | 'medium' | 'low';
    description: string;
    supporting_data?: any;
  }[];
  decision_points: {
    decision: Decision;
    context: string;
    options: string[];
    recommendation: string;
  }[];
  kpi_dashboard: {
    metric: string;
    value: number | string;
    trend: 'up' | 'down' | 'stable';
    status: RAGStatus;
  }[];
  generated_at: string;
}
