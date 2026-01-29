// ============================================================================
// Fonctions pour récupérer les données des cockpits (Pro et Demo)
// ============================================================================

import { supabase } from './supabase';
import type { CockpitData } from './types-saas';

/**
 * Récupère les données du cockpit pour un utilisateur Pro
 */
export async function getProCockpitData(userId: string): Promise<CockpitData> {
  // 1. Récupérer le profil utilisateur et son organisation
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('organisation_id')
    .eq('id', userId)
    .single();

  if (profileError || !profile?.organisation_id) {
    throw new Error('Organisation non trouvée pour cet utilisateur');
  }

  // 2. Récupérer l'organisation
  const { data: organisation, error: orgError } = await supabase
    .from('organisations')
    .select('*')
    .eq('id', profile.organisation_id)
    .single();

  if (orgError || !organisation) {
    throw new Error('Organisation non trouvée');
  }

  // 3. Récupérer les domaines de l'organisation
  const { data: domains, error: domainsError } = await supabase
    .from('domains')
    .select('*')
    .eq('organisation_id', organisation.id);

  if (domainsError || !domains || domains.length === 0) {
    throw new Error('Aucun domaine trouvé');
  }

  // 4. Récupérer le premier cockpit du premier domaine
  const { data: cockpit, error: cockpitError } = await supabase
    .from('cockpits')
    .select('*')
    .eq('domain_id', domains[0].id)
    .limit(1)
    .single();

  if (cockpitError || !cockpit) {
    throw new Error('Aucun cockpit trouvé');
  }

  // 5. Récupérer tous les items du cockpit
  const { data: items, error: itemsError } = await supabase
    .from('items')
    .select('*')
    .eq('cockpit_id', cockpit.id)
    .order('created_at', { ascending: false });

  return {
    organisation,
    domains,
    cockpit,
    items: items || [],
  };
}

/**
 * Récupère les données du cockpit Demo (données mockées)
 */
export async function getDemoCockpitData(demoOrg: CockpitData): Promise<CockpitData> {
  // En mode demo, on retourne directement les données mockées
  return demoOrg;
}

/**
 * Crée un nouvel item dans un cockpit
 */
export async function createItem(
  cockpitId: string,
  item: {
    type: 'risk' | 'decision' | 'kpi';
    title: string;
    description?: string;
    status?: 'ok' | 'warning' | 'critical';
    owner?: string;
    due_date?: string;
    score?: number;
  }
) {
  const { data, error } = await supabase
    .from('items')
    .insert({
      cockpit_id: cockpitId,
      ...item,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Met à jour un item existant
 */
export async function updateItem(
  itemId: string,
  updates: Partial<{
    title: string;
    description: string;
    status: 'ok' | 'warning' | 'critical';
    owner: string;
    due_date: string;
    score: number;
    ai_comment: string;
  }>
) {
  const { data, error } = await supabase
    .from('items')
    .update(updates)
    .eq('id', itemId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Supprime un item
 */
export async function deleteItem(itemId: string) {
  const { error } = await supabase.from('items').delete().eq('id', itemId);

  if (error) throw error;
}

/**
 * Récupère les statistiques du cockpit
 */
export async function getCockpitStats(cockpitId: string) {
  const { data: items, error } = await supabase
    .from('items')
    .select('type, status')
    .eq('cockpit_id', cockpitId);

  if (error) throw error;

  const stats = {
    total: items.length,
    byType: {
      risk: items.filter((i) => i.type === 'risk').length,
      decision: items.filter((i) => i.type === 'decision').length,
      kpi: items.filter((i) => i.type === 'kpi').length,
    },
    byStatus: {
      ok: items.filter((i) => i.status === 'ok').length,
      warning: items.filter((i) => i.status === 'warning').length,
      critical: items.filter((i) => i.status === 'critical').length,
    },
  };

  return stats;
}
