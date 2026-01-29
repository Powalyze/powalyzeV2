// ============================================================================
// Types pour le système SaaS Powalyze
// ============================================================================

export interface Organisation {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Domain {
  id: string;
  organisation_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Cockpit {
  id: string;
  domain_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export type ItemType = 'risk' | 'decision' | 'kpi';
export type ItemStatus = 'ok' | 'warning' | 'critical';

export interface Item {
  id: string;
  cockpit_id: string;
  type: ItemType;
  title: string;
  description?: string;
  status: ItemStatus;
  owner?: string;
  due_date?: string;
  score?: number;
  ai_comment?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  organisation_id?: string;
  role: 'owner' | 'admin' | 'member';
  created_at: string;
  updated_at: string;
}

export interface CockpitData {
  organisation: Organisation;
  domains: Domain[];
  cockpit: Cockpit;
  items: Item[];
}
