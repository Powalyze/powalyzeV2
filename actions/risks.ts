// ================================================================
// PACK 10 - SERVER ACTIONS RISQUES EXÉCUTIFS
// ================================================================
// Actions serveur pour le module Risques:
// - CRUD complet
// - Filtrage et recherche
// - Stats et heatmap
// - Analyse IA (Agent AAR)
// - Historique

'use server';

import { 
  RiskExecutive, 
  RiskFilters, 
  RiskFormData, 
  RiskStats, 
  RiskHistory,
  HeatmapCell,
  RiskAnalysis
} from '@/types';
import { analyzeRiskWithAAR, RiskAnalysisInput } from '@/lib/ai-risk-agent';
import { getSupabaseAdmin } from '@/lib/supabase-singleton';

// Client Supabase (service role pour bypass RLS dans server actions)
const supabase = getSupabaseAdmin();

// ================================================================
// CREATE: Créer un risque
// ================================================================

export async function createRisk(
  data: RiskFormData,
  organizationId: string,
  userId: string
): Promise<RiskExecutive> {
  const { data: risk, error } = await supabase
    .from('risks')
    .insert({
      organization_id: organizationId,
      project_id: data.project_id,
      title: data.title,
      description: data.description || null,
      severity: data.severity,
      probability: data.probability,
      // score est auto-calculé par PostgreSQL
      status: 'open',
      mitigation_actions: data.mitigation_actions || null,
      created_by: userId
    })
    .select('*')
    .single();

  if (error) {
    console.error('❌ Erreur création risque:', error);
    throw new Error(`Erreur lors de la création du risque: ${error.message}`);
  }

  return risk as RiskExecutive;
}

// ================================================================
// READ: Obtenir un risque par ID (avec relations)
// ================================================================

export async function getRiskById(
  riskId: string,
  organizationId: string
): Promise<RiskExecutive | null> {
  const { data: risk, error } = await supabase
    .from('risks')
    .select(`
      *,
      project:projects(id, name, sponsor, rag_status, completion_percentage),
      history:risk_history(*)
    `)
    .eq('id', riskId)
    .eq('organization_id', organizationId)
    .single();

  if (error) {
    console.error('❌ Erreur lecture risque:', error);
    return null;
  }

  return risk as RiskExecutive;
}

// ================================================================
// READ: Liste des risques avec filtres
// ================================================================

export async function getRisks(
  filters: RiskFilters,
  organizationId: string
): Promise<RiskExecutive[]> {
  let query = supabase
    .from('risks')
    .select(`
      *,
      project:projects(id, name, sponsor, rag_status)
    `)
    .eq('organization_id', organizationId)
    .order('score', { ascending: false }) // Tri par criticité par défaut
    .order('created_at', { ascending: false });

  // Filtres
  if (filters.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }

  if (filters.severity && filters.severity !== 'all') {
    query = query.eq('severity', filters.severity);
  }

  if (filters.probability && filters.probability !== 'all') {
    query = query.eq('probability', filters.probability);
  }

  if (filters.score_min) {
    query = query.gte('score', filters.score_min);
  }

  if (filters.score_max) {
    query = query.lte('score', filters.score_max);
  }

  if (filters.trend && filters.trend !== 'all') {
    query = query.eq('trend', filters.trend);
  }

  if (filters.project_id) {
    query = query.eq('project_id', filters.project_id);
  }

  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }

  const { data: risks, error } = await query;

  if (error) {
    console.error('❌ Erreur lecture risques:', error);
    return [];
  }

  return (risks as RiskExecutive[]) || [];
}

// ================================================================
// UPDATE: Modifier un risque
// ================================================================

export async function updateRisk(
  riskId: string,
  updates: Partial<RiskFormData>,
  organizationId: string
): Promise<RiskExecutive | null> {
  const { data: risk, error } = await supabase
    .from('risks')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', riskId)
    .eq('organization_id', organizationId)
    .select('*')
    .single();

  if (error) {
    console.error('❌ Erreur mise à jour risque:', error);
    return null;
  }

  return risk as RiskExecutive;
}

// ================================================================
// UPDATE: Changer le statut d'un risque
// ================================================================

export async function updateRiskStatus(
  riskId: string,
  status: 'open' | 'in_progress' | 'mitigated' | 'closed',
  organizationId: string
): Promise<RiskExecutive | null> {
  const updates: any = {
    status,
    updated_at: new Date().toISOString()
  };

  // Si mitigé, enregistrer la date
  if (status === 'mitigated') {
    updates.mitigation_date = new Date().toISOString();
  }

  const { data: risk, error } = await supabase
    .from('risks')
    .update(updates)
    .eq('id', riskId)
    .eq('organization_id', organizationId)
    .select('*')
    .single();

  if (error) {
    console.error('❌ Erreur changement statut risque:', error);
    return null;
  }

  return risk as RiskExecutive;
}

// ================================================================
// DELETE: Supprimer un risque
// ================================================================

export async function deleteRisk(
  riskId: string,
  organizationId: string
): Promise<boolean> {
  const { error } = await supabase
    .from('risks')
    .delete()
    .eq('id', riskId)
    .eq('organization_id', organizationId);

  if (error) {
    console.error('❌ Erreur suppression risque:', error);
    return false;
  }

  return true;
}

// ================================================================
// STATS: Statistiques des risques
// ================================================================

export async function getRisksStats(
  organizationId: string,
  projectId?: string
): Promise<RiskStats> {
  let query = supabase
    .from('risks')
    .select('id, status, score, severity, probability, trend')
    .eq('organization_id', organizationId);

  if (projectId) {
    query = query.eq('project_id', projectId);
  }

  const { data: risks, error } = await query;

  if (error || !risks) {
    console.error('❌ Erreur stats risques:', error);
    return {
      total: 0,
      open: 0,
      in_progress: 0,
      mitigated: 0,
      closed: 0,
      critical: 0,
      high: 0,
      moderate: 0,
      low: 0,
      rising: 0,
      stable: 0,
      falling: 0,
      heatmap: []
    };
  }

  // Calcul stats par statut
  const stats: RiskStats = {
    total: risks.length,
    open: risks.filter(r => r.status === 'open').length,
    in_progress: risks.filter(r => r.status === 'in_progress').length,
    mitigated: risks.filter(r => r.status === 'mitigated').length,
    closed: risks.filter(r => r.status === 'closed').length,
    
    // Stats par criticité (score)
    critical: risks.filter(r => r.score >= 15).length,
    high: risks.filter(r => r.score >= 8 && r.score < 15).length,
    moderate: risks.filter(r => r.score >= 4 && r.score < 8).length,
    low: risks.filter(r => r.score < 4).length,
    
    // Stats par tendance
    rising: risks.filter(r => r.trend === 'rising').length,
    stable: risks.filter(r => r.trend === 'stable').length,
    falling: risks.filter(r => r.trend === 'falling').length,
    
    // Heatmap (distribution sévérité × probabilité)
    heatmap: generateHeatmap(risks)
  };

  return stats;
}

// ================================================================
// HEATMAP: Génération de la matrice 5×5
// ================================================================

function generateHeatmap(risks: any[]): HeatmapCell[] {
  const heatmap: HeatmapCell[] = [];

  // Créer toutes les cellules (5 severity × 5 probability = 25 cellules)
  for (let sev = 1; sev <= 5; sev++) {
    for (let prob = 1; prob <= 5; prob++) {
      const cellRisks = risks.filter(
        r => r.severity === sev && r.probability === prob
      );

      heatmap.push({
        severity: sev,
        probability: prob,
        count: cellRisks.length,
        risk_ids: cellRisks.map(r => r.id)
      });
    }
  }

  return heatmap;
}

// ================================================================
// IA: Sauvegarder l'analyse AAR
// ================================================================

export async function saveRiskAnalysis(
  riskId: string,
  analysis: RiskAnalysis,
  organizationId: string
): Promise<RiskExecutive | null> {
  const { data: risk, error } = await supabase
    .from('risks')
    .update({
      ai_analysis: analysis as any,
      ai_analyzed_at: new Date().toISOString(),
      trend: analysis.trend_evaluation.trend, // Mettre à jour la tendance
      updated_at: new Date().toISOString()
    })
    .eq('id', riskId)
    .eq('organization_id', organizationId)
    .select('*')
    .single();

  if (error) {
    console.error('❌ Erreur sauvegarde analyse:', error);
    return null;
  }

  return risk as RiskExecutive;
}

// ================================================================
// IA: Analyser un risque avec AAR
// ================================================================

export async function analyzeRisk(
  riskId: string,
  organizationId: string
): Promise<RiskAnalysis> {
  // 1. Récupérer le risque complet avec contexte
  const risk = await getRiskById(riskId, organizationId);
  if (!risk) {
    throw new Error('Risque introuvable');
  }

  // 2. Récupérer les risques similaires du même projet
  let relatedRisks: RiskExecutive[] = [];
  if (risk.project_id) {
    relatedRisks = await getRisks(
      { project_id: risk.project_id },
      organizationId
    );
    // Exclure le risque actuel
    relatedRisks = relatedRisks.filter(r => r.id !== riskId);
  }

  // 3. Appeler l'Agent AAR
  const input: RiskAnalysisInput = {
    risk,
    projectContext: risk.project || undefined,
    relatedRisks,
    history: risk.history || []
  };

  const analysis = await analyzeRiskWithAAR(input);

  // 4. Sauvegarder l'analyse
  await saveRiskAnalysis(riskId, analysis, organizationId);

  return analysis;
}

// ================================================================
// HISTORIQUE: Récupérer l'historique d'un risque
// ================================================================

export async function getRiskHistory(
  riskId: string,
  organizationId: string
): Promise<RiskHistory[]> {
  const { data: history, error } = await supabase
    .from('risk_history')
    .select('*')
    .eq('risk_id', riskId)
    .eq('organization_id', organizationId)
    .order('performed_at', { ascending: false });

  if (error) {
    console.error('❌ Erreur lecture historique:', error);
    return [];
  }

  return (history as RiskHistory[]) || [];
}

// ================================================================
// MITIGATION: Ajouter une action de mitigation
// ================================================================

export async function addMitigationActions(
  riskId: string,
  actions: string,
  organizationId: string,
  userId: string
): Promise<RiskExecutive | null> {
  const { data: risk, error } = await supabase
    .from('risks')
    .update({
      mitigation_actions: actions,
      status: 'in_progress', // Passer en cours de mitigation
      mitigated_by: userId,
      updated_at: new Date().toISOString()
    })
    .eq('id', riskId)
    .eq('organization_id', organizationId)
    .select('*')
    .single();

  if (error) {
    console.error('❌ Erreur ajout mitigation:', error);
    return null;
  }

  return risk as RiskExecutive;
}

// ================================================================
// EXPORTS
// ================================================================

export {
  type RiskExecutive,
  type RiskFilters,
  type RiskFormData,
  type RiskStats,
  type RiskHistory,
  type HeatmapCell
};
