"use server";

/**
 * ACTIONS SUPABASE - MODULE DÉCISIONS (PACK 9)
 */

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import type { Decision, DecisionFormData, DecisionFilters, DecisionHistory } from "@/types";

// ================================================
// CREATE DECISION
// ================================================

export async function createDecision(formData: DecisionFormData) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Non authentifié");
  }

  const organizationId = user.user_metadata?.organization_id;
  if (!organizationId) {
    throw new Error("Organization ID manquant");
  }

  const { data, error } = await supabase
    .from('decisions')
    .insert({
      organization_id: organizationId,
      project_id: formData.project_id,
      title: formData.title,
      description: formData.description,
      owner: formData.owner,
      impact_score: formData.impact_score,
      urgency_score: formData.urgency_score,
      complexity_score: formData.complexity_score,
      deadline: formData.deadline,
      status: 'open',
      created_by: user.id,
      updated_by: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error('[DECISIONS] Create error:', error);
    throw new Error(`Erreur création: ${error.message}`);
  }

  revalidatePath('/cockpit/decisions');
  return data;
}

// ================================================
// GET DECISIONS (avec filtres)
// ================================================

export async function getDecisions(filters?: DecisionFilters) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Non authentifié");
  }

  const organizationId = user.user_metadata?.organization_id;
  if (!organizationId) {
    throw new Error("Organization ID manquant");
  }

  let query = supabase
    .from('decisions')
    .select(`
      *,
      project:projects(id, name, status)
    `)
    .eq('organization_id', organizationId)
    .order('priority_score', { ascending: false })
    .order('created_at', { ascending: false });

  // Filtres
  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }

  if (filters?.owner) {
    query = query.eq('owner', filters.owner);
  }

  if (filters?.project_id) {
    query = query.eq('project_id', filters.project_id);
  }

  if (filters?.priority) {
    if (filters.priority === 'high') {
      query = query.gte('priority_score', 4);
    } else if (filters.priority === 'medium') {
      query = query.gte('priority_score', 3).lt('priority_score', 4);
    } else if (filters.priority === 'low') {
      query = query.lt('priority_score', 3);
    }
  }

  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[DECISIONS] Get error:', error);
    throw new Error(`Erreur récupération: ${error.message}`);
  }

  return data as Decision[];
}

// ================================================
// GET DECISION BY ID (avec history)
// ================================================

export async function getDecisionById(id: string) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Non authentifié");
  }

  const { data: decision, error: decisionError } = await supabase
    .from('decisions')
    .select(`
      *,
      project:projects(id, name, status, budget),
      history:decision_history(*)
    `)
    .eq('id', id)
    .single();

  if (decisionError) {
    console.error('[DECISIONS] Get by ID error:', decisionError);
    throw new Error(`Erreur récupération décision: ${decisionError.message}`);
  }

  // Trier history par timestamp desc
  if (decision.history) {
    decision.history.sort((a: DecisionHistory, b: DecisionHistory) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  return decision as Decision;
}

// ================================================
// UPDATE DECISION
// ================================================

export async function updateDecision(id: string, updates: Partial<DecisionFormData>) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Non authentifié");
  }

  const { data, error } = await supabase
    .from('decisions')
    .update({
      ...updates,
      updated_by: user.id,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[DECISIONS] Update error:', error);
    throw new Error(`Erreur mise à jour: ${error.message}`);
  }

  revalidatePath('/cockpit/decisions');
  return data;
}

// ================================================
// UPDATE DECISION STATUS
// ================================================

export async function updateDecisionStatus(
  id: string,
  status: 'open' | 'in_progress' | 'closed'
) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Non authentifié");
  }

  const updateData: any = {
    status,
    updated_by: user.id,
  };

  // Si fermée, ajouter closed_at
  if (status === 'closed') {
    updateData.closed_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('decisions')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[DECISIONS] Update status error:', error);
    throw new Error(`Erreur changement statut: ${error.message}`);
  }

  revalidatePath('/cockpit/decisions');
  return data;
}

// ================================================
// SAVE AI ANALYSIS
// ================================================

export async function saveAIAnalysis(
  id: string,
  analysis: any
) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Non authentifié");
  }

  const { data, error } = await supabase
    .from('decisions')
    .update({
      ai_analysis: analysis,
      ai_analyzed_at: new Date().toISOString(),
      updated_by: user.id,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[DECISIONS] Save AI analysis error:', error);
    throw new Error(`Erreur sauvegarde analyse: ${error.message}`);
  }

  revalidatePath('/cockpit/decisions');
  return data;
}

// ================================================
// SELECT OPTION
// ================================================

export async function selectOption(
  id: string,
  option: 'A' | 'B' | 'C'
) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Non authentifié");
  }

  const { data, error } = await supabase
    .from('decisions')
    .update({
      selected_option: option,
      status: 'in_progress', // Passer automatiquement en cours
      updated_by: user.id,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[DECISIONS] Select option error:', error);
    throw new Error(`Erreur sélection option: ${error.message}`);
  }

  revalidatePath('/cockpit/decisions');
  return data;
}

// ================================================
// DELETE DECISION
// ================================================

export async function deleteDecision(id: string) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Non authentifié");
  }

  const { error } = await supabase
    .from('decisions')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('[DECISIONS] Delete error:', error);
    throw new Error(`Erreur suppression: ${error.message}`);
  }

  revalidatePath('/cockpit/decisions');
}

// ================================================
// GET STATS
// ================================================

export async function getDecisionsStats() {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return {
      total: 0,
      open: 0,
      in_progress: 0,
      closed: 0,
      high_priority: 0,
    };
  }

  const organizationId = user.user_metadata?.organization_id;
  if (!organizationId) {
    return {
      total: 0,
      open: 0,
      in_progress: 0,
      closed: 0,
      high_priority: 0,
    };
  }

  const { data, error } = await supabase
    .from('decisions')
    .select('status, priority_score')
    .eq('organization_id', organizationId);

  if (error) {
    console.error('[DECISIONS] Get stats error:', error);
    return {
      total: 0,
      open: 0,
      in_progress: 0,
      closed: 0,
      high_priority: 0,
    };
  }

  return {
    total: data.length,
    open: data.filter(d => d.status === 'open').length,
    in_progress: data.filter(d => d.status === 'in_progress').length,
    closed: data.filter(d => d.status === 'closed').length,
    high_priority: data.filter(d => d.priority_score >= 4).length,
  };
}
