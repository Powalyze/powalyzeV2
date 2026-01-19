// ============================================================================
// POWALYZE — SWITCH AUTOMATIQUE DEMO / PROD + SEED DEMO PREMIUM
// ============================================================================
// Ce module contient :
// 1) Le switch automatique DEMO / PROD
// 2) Le DataProvider unifié
// 3) Le seed DEMO premium complet (projets, risques, décisions, actions, comités)
// ============================================================================

import { supabase } from './supabase';
import type { Project, Risk, Decision, Action, Committee } from '@/types/cockpit';

// ============================================================================
// 1) MODE AUTOMATIQUE (DEMO / PROD)
// ============================================================================



// ============================================================================
// 3) DATAPROVIDER UNIFIÉ — SWITCH AUTOMATIQUE DEMO / PROD
// ============================================================================

export async function getProjects(orgId?: string): Promise<Project[]> {
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('organization_id', orgId || '');
  return data ?? [];
}

export async function getRisks(orgId?: string): Promise<Risk[]> {
  const { data } = await supabase
    .from('risks')
    .select('*')
    .eq('organization_id', orgId || '');
  return data ?? [];
}

export async function getDecisions(orgId?: string): Promise<Decision[]> {
  const { data } = await supabase
    .from('decisions')
    .select('*')
    .eq('organization_id', orgId || '');
  return data ?? [];
}

export async function getActions(orgId?: string): Promise<Action[]> {
  const { data } = await supabase
    .from('actions')
    .select('*')
    .eq('organization_id', orgId || '');
  return data ?? [];
}

export async function getCommittees(orgId?: string): Promise<Committee[]> {
  const { data } = await supabase
    .from('committees')
    .select('*')
    .eq('organization_id', orgId || '');
  return data ?? [];
}

export async function getPriorityActions(orgId?: string): Promise<Action[]> {
  const { data } = await supabase
    .from('actions')
    .select('*')
    .eq('organization_id', orgId || '')
    .in('status', ['TODO', 'IN_PROGRESS', 'BLOCKED'])
    .order('due_date', { ascending: true });
  return data ?? [];
}

export async function getCriticalRisks(orgId?: string): Promise<Risk[]> {
  const { data } = await supabase
    .from('risks')
    .select('*')
    .eq('organization_id', orgId || '')
    .gte('score', 40)
    .order('score', { ascending: false });
  return data ?? [];
}

export async function getPendingDecisions(orgId?: string): Promise<Decision[]> {
  const { data } = await supabase
    .from('decisions')
    .select('*')
    .eq('organization_id', orgId || '')
    .eq('status', 'PENDING')
    .order('meeting_date', { ascending: true });
  return data ?? [];
}

// ============================================================================
// 4) HELPERS POUR LES COMPOSANTS
// ============================================================================

export function getProjectById(projectId: string): Project | undefined {
  return undefined;
}

export function getRisksByProjectId(projectId: string): Risk[] {
  return [];
}

export function getDecisionsByProjectId(projectId: string): Decision[] {
  return [];
}

export function getActionsByProjectId(projectId: string): Action[] {
  return [];
}
