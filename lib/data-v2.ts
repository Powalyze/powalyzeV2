// ============================================================
// POWALYZE V2 — DATA LAYER PROPRE (CRUD SIMPLE)
// ============================================================
// Principes:
// - ZÉRO upsert
// - ZÉRO onConflict
// - Insert et Update séparés
// - Gestion d'erreurs explicite
// - Types stricts
// ============================================================

import { createClient } from '@/utils/supabase/server';
import type { SupabaseClient } from '@supabase/supabase-js';

// ============================================================
// TYPES
// ============================================================

export interface Organization {
  id: string;
  name: string;
  slug?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Profile {
  id: string;
  organization_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  plan: 'demo' | 'pro' | 'enterprise';
  role: 'owner' | 'admin' | 'member' | 'viewer';
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id: string;
  organization_id: string;
  name: string;
  description?: string;
  owner_id?: string;
  status: 'active' | 'on-hold' | 'completed' | 'cancelled';
  health: 'green' | 'yellow' | 'red';
  progress: number;
  budget?: number;
  deadline?: string;
  starred: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Risk {
  id: string;
  organization_id: string;
  project_id?: string;
  title: string;
  description?: string;
  level: 'low' | 'medium' | 'high' | 'critical';
  probability?: number;
  impact?: number;
  status: 'open' | 'monitoring' | 'mitigated' | 'closed';
  owner_id?: string;
  mitigation_plan?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Decision {
  id: string;
  organization_id: string;
  project_id?: string;
  title: string;
  description?: string;
  committee?: string;
  decision_date?: string;
  status: 'pending' | 'approved' | 'rejected' | 'deferred';
  owner_id?: string;
  impacts?: any[];
  created_at?: string;
  updated_at?: string;
}

export interface Resource {
  id: string;
  organization_id: string;
  name: string;
  type: 'human' | 'material' | 'financial';
  capacity?: number;
  unit?: string;
  cost_per_unit?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Dependency {
  id: string;
  organization_id: string;
  source_project_id: string;
  target_project_id: string;
  type: 'blocks' | 'requires' | 'relates-to';
  description?: string;
  created_at?: string;
}

export interface Report {
  id: string;
  organization_id: string;
  type: 'executive' | 'project' | 'risk' | 'resource';
  title: string;
  content?: string;
  data?: any;
  generated_at?: string;
  created_by?: string;
}

export interface ApiKey {
  id: string;
  organization_id: string;
  name: string;
  key_hash: string;
  key_prefix: string;
  permissions?: string[];
  last_used_at?: string;
  expires_at?: string;
  created_at?: string;
}

export interface Webhook {
  id: string;
  organization_id: string;
  name: string;
  url: string;
  events: string[];
  secret?: string;
  active: boolean;
  created_at?: string;
}

// ============================================================
// HELPERS
// ============================================================

async function getSupabase(): Promise<SupabaseClient> {
  return await createClient();
}

async function getOrganizationId(): Promise<string | null> {
  const supabase = await getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('organization_id')
    .eq('id', user.id)
    .single();
  
  return profile?.organization_id || null;
}

// ============================================================
// PROJECTS CRUD
// ============================================================

export async function getAllProjects(): Promise<Project[]> {
  const supabase = await getSupabase();
  const organizationId = await getOrganizationId();
  
  if (!organizationId) return [];
  
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('[getAllProjects] Error:', error);
    return [];
  }
  
  return data || [];
}

export async function getProjectById(id: string): Promise<Project | null> {
  const supabase = await getSupabase();
  
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('[getProjectById] Error:', error);
    return null;
  }
  
  return data;
}

export async function createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project | null> {
  const supabase = await getSupabase();
  
  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single();
  
  if (error) {
    console.error('[createProject] Error:', error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
  const supabase = await getSupabase();
  
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('[updateProject] Error:', error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function deleteProject(id: string): Promise<boolean> {
  const supabase = await getSupabase();
  
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('[deleteProject] Error:', error);
    return false;
  }
  
  return true;
}

// ============================================================
// RISKS CRUD
// ============================================================

export async function getAllRisks(): Promise<Risk[]> {
  const supabase = await getSupabase();
  const organizationId = await getOrganizationId();
  
  if (!organizationId) return [];
  
  const { data, error } = await supabase
    .from('risks')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('[getAllRisks] Error:', error);
    return [];
  }
  
  return data || [];
}

export async function getRisksByProject(projectId: string): Promise<Risk[]> {
  const supabase = await getSupabase();
  
  const { data, error } = await supabase
    .from('risks')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('[getRisksByProject] Error:', error);
    return [];
  }
  
  return data || [];
}

export async function createRisk(risk: Omit<Risk, 'id' | 'created_at' | 'updated_at'>): Promise<Risk | null> {
  const supabase = await getSupabase();
  
  const { data, error } = await supabase
    .from('risks')
    .insert(risk)
    .select()
    .single();
  
  if (error) {
    console.error('[createRisk] Error:', error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function updateRisk(id: string, updates: Partial<Risk>): Promise<Risk | null> {
  const supabase = await getSupabase();
  
  const { data, error } = await supabase
    .from('risks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('[updateRisk] Error:', error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function deleteRisk(id: string): Promise<boolean> {
  const supabase = await getSupabase();
  
  const { error } = await supabase
    .from('risks')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('[deleteRisk] Error:', error);
    return false;
  }
  
  return true;
}

// ============================================================
// DECISIONS CRUD
// ============================================================

export async function getAllDecisions(): Promise<Decision[]> {
  const supabase = await getSupabase();
  const organizationId = await getOrganizationId();
  
  if (!organizationId) return [];
  
  const { data, error } = await supabase
    .from('decisions')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('[getAllDecisions] Error:', error);
    return [];
  }
  
  return data || [];
}

export async function createDecision(decision: Omit<Decision, 'id' | 'created_at' | 'updated_at'>): Promise<Decision | null> {
  const supabase = await getSupabase();
  
  const { data, error } = await supabase
    .from('decisions')
    .insert(decision)
    .select()
    .single();
  
  if (error) {
    console.error('[createDecision] Error:', error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function updateDecision(id: string, updates: Partial<Decision>): Promise<Decision | null> {
  const supabase = await getSupabase();
  
  const { data, error } = await supabase
    .from('decisions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('[updateDecision] Error:', error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function deleteDecision(id: string): Promise<boolean> {
  const supabase = await getSupabase();
  
  const { error } = await supabase
    .from('decisions')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('[deleteDecision] Error:', error);
    return false;
  }
  
  return true;
}

// ============================================================
// RESOURCES CRUD
// ============================================================

export async function getAllResources(): Promise<Resource[]> {
  const supabase = await getSupabase();
  const organizationId = await getOrganizationId();
  
  if (!organizationId) return [];
  
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('organization_id', organizationId)
    .order('name');
  
  if (error) {
    console.error('[getAllResources] Error:', error);
    return [];
  }
  
  return data || [];
}

export async function createResource(resource: Omit<Resource, 'id' | 'created_at' | 'updated_at'>): Promise<Resource | null> {
  const supabase = await getSupabase();
  
  const { data, error } = await supabase
    .from('resources')
    .insert(resource)
    .select()
    .single();
  
  if (error) {
    console.error('[createResource] Error:', error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function updateResource(id: string, updates: Partial<Resource>): Promise<Resource | null> {
  const supabase = await getSupabase();
  
  const { data, error } = await supabase
    .from('resources')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('[updateResource] Error:', error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function deleteResource(id: string): Promise<boolean> {
  const supabase = await getSupabase();
  
  const { error } = await supabase
    .from('resources')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('[deleteResource] Error:', error);
    return false;
  }
  
  return true;
}

// ============================================================
// DEPENDENCIES CRUD
// ============================================================

export async function getProjectDependencies(projectId: string): Promise<Dependency[]> {
  const supabase = await getSupabase();
  
  const { data, error } = await supabase
    .from('dependencies')
    .select('*')
    .or(`source_project_id.eq.${projectId},target_project_id.eq.${projectId}`);
  
  if (error) {
    console.error('[getProjectDependencies] Error:', error);
    return [];
  }
  
  return data || [];
}

export async function createDependency(dependency: Omit<Dependency, 'id' | 'created_at'>): Promise<Dependency | null> {
  const supabase = await getSupabase();
  
  const { data, error } = await supabase
    .from('dependencies')
    .insert(dependency)
    .select()
    .single();
  
  if (error) {
    console.error('[createDependency] Error:', error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function deleteDependency(id: string): Promise<boolean> {
  const supabase = await getSupabase();
  
  const { error } = await supabase
    .from('dependencies')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('[deleteDependency] Error:', error);
    return false;
  }
  
  return true;
}

// ============================================================
// REPORTS CRUD
// ============================================================

export async function getAllReports(): Promise<Report[]> {
  const supabase = await getSupabase();
  const organizationId = await getOrganizationId();
  
  if (!organizationId) return [];
  
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('organization_id', organizationId)
    .order('generated_at', { ascending: false });
  
  if (error) {
    console.error('[getAllReports] Error:', error);
    return [];
  }
  
  return data || [];
}

export async function createReport(report: Omit<Report, 'id' | 'generated_at'>): Promise<Report | null> {
  const supabase = await getSupabase();
  
  const { data, error } = await supabase
    .from('reports')
    .insert(report)
    .select()
    .single();
  
  if (error) {
    console.error('[createReport] Error:', error);
    throw new Error(error.message);
  }
  
  return data;
}
