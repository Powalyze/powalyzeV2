// ============================================================
// POWALYZE COCKPIT CLIENT — SUPABASE DATA LAYER
// ============================================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';
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

// Fonction pour nettoyer les caractères invisibles (BOM, etc.)
function cleanString(str: string): string {
  if (!str) return str;
  // Pour JWT/URLs : garde UNIQUEMENT les caractères base64 + séparateurs valides
  // Base64 : A-Z, a-z, 0-9, +, /, =
  // JWT sépare avec des points : .
  // URLs utilisent : - _ / : 
  return str.replace(/[^A-Za-z0-9+/=.\-_:]/g, '');
}

const SUPABASE_URL = cleanString(process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pqsgdwfsdnmozzoynefw.supabase.co');
const SUPABASE_ANON_KEY = cleanString(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxc2dkd2ZzZG5tb3p6b3luZWZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MDAxMTAsImV4cCI6MjA4NDA3NjExMH0.E7nOfgjuE_Kt_fAfV32HYu_Ieit2uQNFwXmpS2vD4HA');
const SUPABASE_SERVICE_ROLE_KEY = cleanString(process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxc2dkd2ZzZG5tb3p6b3luZWZ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODUwMDExMCwiZXhwIjoyMDg0MDc2MTEwfQ.-_bC0cdoAksIuQ5BO7YyOzMeotE7Efw8uvgltynWynU');

// Debug logging
if (typeof window === 'undefined') {
  // Server-side
  console.log('[Supabase] Server init - URL:', SUPABASE_URL ? '✅' : '❌');
  console.log('[Supabase] Server init - ANON:', SUPABASE_ANON_KEY ? '✅' : '❌');
  console.log('[Supabase] Server init - SERVICE:', SUPABASE_SERVICE_ROLE_KEY ? '✅' : '❌');
} else {
  // Client-side
  console.log('[Supabase] Client init - URL:', SUPABASE_URL ? '✅' : '❌');
  console.log('[Supabase] Client init - ANON:', SUPABASE_ANON_KEY ? '✅' : '❌');
}

export function getSupabaseClient(isServer = false): SupabaseClient {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase environment variables are not set! Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
  
  if (isServer && SUPABASE_SERVICE_ROLE_KEY) {
    console.log('[Supabase] Using SERVICE_ROLE key');
    return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { 
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      },
      global: {
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
        }
      }
    });
  }
  
  console.log('[Supabase] Using ANON key');
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    },
    global: {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`
      }
    }
  });
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
  const SUPABASE_URL = cleanString(process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pqsgdwfsdnmozzoynefw.supabase.co');
  const SUPABASE_SERVICE_ROLE_KEY = cleanString(process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxc2dkd2ZzZG5tb3p6b3luZWZ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODUwMDExMCwiZXhwIjoyMDg0MDc2MTEwfQ.-_bC0cdoAksIuQ5BO7YyOzMeotE7Efw8uvgltynWynU');
  
  console.log('[fetchCockpitData] Using direct REST API');
  console.log('[fetchCockpitData] URL:', SUPABASE_URL);
  console.log('[fetchCockpitData] Has SERVICE_ROLE?', !!SUPABASE_SERVICE_ROLE_KEY);
  console.log('[fetchCockpitData] KEY length:', SUPABASE_SERVICE_ROLE_KEY.length);
  console.log('[fetchCockpitData] KEY first char code:', SUPABASE_SERVICE_ROLE_KEY.charCodeAt(0));

  const headers = {
    'apikey': SUPABASE_SERVICE_ROLE_KEY,
    'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json',
  };

  const fetchTable = async (table: string) => {
    const url = `${SUPABASE_URL}/rest/v1/${table}?organization_id=eq.${organizationId}&select=*`;
    console.log('[fetchCockpitData] Fetching:', table);
    const res = await fetch(url, { headers });
    if (!res.ok) {
      const text = await res.text();
      console.error(`[fetchCockpitData] ${table} error:`, res.status, text);
      throw new Error(`Failed to fetch ${table}: ${res.status} ${text}`);
    }
    return res.json();
  };

  const [kpis, signals, scenarios, stories, risks, decisions, integrations, projects] = await Promise.all([
    fetchTable('cockpit_kpis'),
    fetchTable('governance_signals'),
    fetchTable('scenarios'),
    fetchTable('executive_stories'),
    fetchTable('risks'),
    fetchTable('decisions'),
    fetchTable('integrations'),
    fetchTable('projects'),
  ]);

  return {
    kpis: kpis.map(mapKpiRow),
    signals: signals.map(mapSignalRow),
    scenarios: scenarios.map(mapScenarioRow),
    stories: stories.map(mapStoryRow),
    risks: risks.map(mapRiskRow),
    decisions: decisions.map(mapDecisionRow),
    integrations: integrations.map(mapIntegrationRow),
    projects: projects.map(mapProjectRow),
  };
}

export async function fetchTeam(organizationId: string): Promise<TeamMember[]> {
  const SUPABASE_URL = cleanString(process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pqsgdwfsdnmozzoynefw.supabase.co');
  const SUPABASE_SERVICE_ROLE_KEY = cleanString(process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxc2dkd2ZzZG5tb3p6b3luZWZ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODUwMDExMCwiZXhwIjoyMDg0MDc2MTEwfQ.-_bC0cdoAksIuQ5BO7YyOzMeotE7Efw8uvgltynWynU');

  const headers = {
    'apikey': SUPABASE_SERVICE_ROLE_KEY,
    'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json',
  };

  const url = `${SUPABASE_URL}/rest/v1/organization_memberships?organization_id=eq.${organizationId}`;
  const res = await fetch(url, { headers });
  
  if (!res.ok) {
    const text = await res.text();
    console.error('[fetchTeam] Error:', res.status, text);
    return []; // Return empty array instead of throwing
  }

  const data = await res.json();
  return (data ?? []).map(mapMemberRow);
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
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from('project_predictions')
    .upsert(
      {
        project_id: projectId,
        analyzed_at: new Date().toISOString(),
        confidence: prediction.confidence,
        summary: prediction.summary,
        risks: prediction.risks,
        opportunities: prediction.opportunities,
        recommended_actions: prediction.recommended_actions,
        project_snapshot: projectSnapshot,
      },
      {
        onConflict: 'project_id',
      }
    );

  if (error) {
    console.error('[saveProjectPrediction] Error:', error);
    throw error;
  }
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
