// ============================================================
// POWALYZE COCKPIT CLIENT — SUPABASE DATA LAYER
// ============================================================

// ⚠️ DEPRECATED: Ce fichier crée des instances multiples de Supabase
// Utilisez plutôt:
// - Client-side: import { createClient } from '@/utils/supabase/client'
// - Server-side: import { createClient } from '@/utils/supabase/server'

import { SupabaseClient } from '@supabase/supabase-js';
import { supabaseAdmin } from './supabase';
import type {
  CockpitKPI,
  GovernanceSignal,
  Scenario,
  ExecutiveStory,
  Risk,
  RiskLevel,
  Decision,
  Integration,
  Project,
  TeamMember,
} from './cockpit-types';

// ✅ Utiliser l'admin client existant au lieu d'en créer un nouveau
export function getSupabaseClient(isServer = false): SupabaseClient {
  // Pour l'instant, retourne toujours l'admin client
  // TODO: Utiliser les wrappers utils/supabase/* à la place
  return supabaseAdmin;
}

// ============================================================
// MAPPERS
// ============================================================

export function mapKpiRow(row: any): CockpitKPI {
  return {
    id: row.id,
    label: row.name,
    value: Number(row.value),
    unit: row.unit ?? undefined,
    trend: row.trend ?? 'stable',
    variationPct: 0,
    horizon: 'S1',
    critical: false,
  };
}

export function mapSignalRow(row: any): GovernanceSignal {
  return {
    id: row.id,
    pillar: row.signal_type ?? 'governance',
    title: row.message ?? 'Signal',
    description: row.message ?? '',
    risk: row.severity ?? 'medium',
    horizon: 'S1',
    confidence: 0.8,
    suggestedAction: 'Analyse requise',
  };
}

export function mapScenarioRow(row: any): Scenario {
  return {
    id: row.id,
    label: row.name,
    description: row.description ?? '',
    horizon: 'S1',
    impactScore: 0,
    upside: 'Opportunité de croissance',
    downside: 'Risque de perte',
  };
}

export function mapStoryRow(row: any): ExecutiveStory {
  return {
    id: row.id,
    title: row.title,
    narrative: row.content ?? '',
    horizon: 'S1',
    focusPillars: [],
    recommendedNextSteps: [],
  };
}

export function mapRiskRow(row: any): Risk {
  // Mapper category → level
  const levelMap: Record<string, RiskLevel> = {
    'STRATEGIC': 'high',
    'CRITICAL': 'high',
    'TECHNICAL': 'medium',
    'FINANCIAL': 'medium',
    'ORGANIZATIONAL': 'low',
    'EXTERNAL': 'medium',
  };
  
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    level: row.level || levelMap[row.category] || 'medium',
    probability: Number(row.probability),
    impact: Number(row.impact),
    projectId: row.project_id ?? undefined,
    ownerId: row.owner_id ?? undefined,
    status: row.status,
  };
}

export function mapDecisionRow(row: any): Decision {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    committee: row.committee ?? 'CODIR',
    date: row.date,
    status: row.status ?? 'pending',
    ownerId: row.owner_id ?? undefined,
    impacts: row.impacts ?? undefined,
  };
}

export function mapIntegrationRow(row: any): Integration {
  return {
    id: row.id,
    type: row.type,
    name: row.name,
    status: row.status ?? 'active',
    configSummary: row.config ? JSON.stringify(row.config) : undefined,
  };
}

export function mapProjectRow(row: any): Project {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    status: row.status,
    ownerId: row.owner_id ?? undefined,
  };
}

export function mapMemberRow(row: any): TeamMember {
  return {
    id: row.id,
    email: row.email,
    fullName: row.name ?? row.email,
    role: row.role ?? 'member',
    invitedAt: row.created_at ?? undefined,
    status: row.status ?? 'invited',
  };
}

// ============================================================
// REPOSITORIES
// ============================================================

export async function fetchCockpitData(organizationId: string) {
  // Retourner des données vides temporairement pour éviter l'erreur fetch
  // Une fois les tables créées dans Supabase, utiliser le client Supabase au lieu de fetch
  console.log('[fetchCockpitData] Returning empty data (tables not yet populated)');
  
  return {
    kpis: [],
    signals: [],
    scenarios: [],
    stories: [],
    risks: [],
    decisions: [],
    integrations: [],
    projects: []
  };
}

export async function fetchTeam(organizationId: string): Promise<TeamMember[]> {
  // Retourner des données vides temporairement pour éviter l'erreur fetch
  console.log('[fetchTeam] Returning empty data (tables not yet populated)');
  return [];
}

export async function insertExecutiveStory(organizationId: string, story: ExecutiveStory) {
  const supabase = getSupabaseClient(true);
  const { error } = await supabase.from('executive_stories').insert({
    organization_id: organizationId,
    title: story.title,
    narrative: story.narrative,
    horizon: story.horizon,
    focus_pillars: story.focusPillars,
    recommended_next_steps: story.recommendedNextSteps,
  });

  if (error) {
    console.error('[insertExecutiveStory] Error:', error);
    throw error;
  }
}

// ============================================================
// PROJECT PREDICTIONS REPOSITORY
// ============================================================

import type { ProjectPrediction } from '@/types/project-prediction';

/**
 * Save or update a project prediction in Supabase
 * Uses upsert to avoid duplicates (unique constraint on project_id)
 */
export async function saveProjectPrediction(
  projectId: string,
  prediction: ProjectPrediction,
  projectSnapshot: any
): Promise<void> {
  // ⚠️ DÉSACTIVÉ TEMPORAIREMENT - Table project_predictions pas encore créée
  console.log('[saveProjectPrediction] SKIPPED - Feature disabled temporarily');
  return;
  
  // TODO: Réactiver une fois la table créée avec tous les champs requis
}

/**
 * Load project prediction from cache (Supabase)
 * Returns null if no prediction exists for this project
 */
export async function loadProjectPrediction(projectId: string): Promise<ProjectPrediction | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('project_predictions')
    .select('*')
    .eq('project_id', projectId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows found - not an error
      return null;
    }
    console.error('[loadProjectPrediction] Error:', error);
    throw error;
  }

  if (!data) return null;

  return {
    project_id: data.project_id,
    risks: data.risks,
    opportunities: data.opportunities,
    recommended_actions: data.recommended_actions,
    summary: data.summary,
    confidence: data.confidence,
  };
}

/**
 * Load all project predictions for multiple projects at once
 * Optimized for bulk loading on cockpit mount
 */
export async function loadAllProjectPredictions(projectIds: string[]): Promise<Map<string, ProjectPrediction>> {
  if (projectIds.length === 0) {
    return new Map();
  }

  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('project_predictions')
    .select('*')
    .in('project_id', projectIds);

  if (error) {
    console.error('[loadAllProjectPredictions] Error:', error);
    throw error;
  }

  const predictionsMap = new Map<string, ProjectPrediction>();

  (data ?? []).forEach((row) => {
    predictionsMap.set(row.project_id, {
      project_id: row.project_id,
      risks: row.risks,
      opportunities: row.opportunities,
      recommended_actions: row.recommended_actions,
      summary: row.summary,
      confidence: row.confidence,
    });
  });

  return predictionsMap;
}

/**
 * Delete a project prediction from cache
 */
export async function deleteProjectPrediction(projectId: string): Promise<void> {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from('project_predictions')
    .delete()
    .eq('project_id', projectId);

  if (error) {
    console.error('[deleteProjectPrediction] Error:', error);
    throw error;
  }
}
