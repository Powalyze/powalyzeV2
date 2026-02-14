'use server';

import { createClient } from '@/utils/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';

// Nettoyer le BOM des variables d'environnement
function cleanEnv(value?: string) {
  return value?.replace(/^\uFEFF/, '').trim();
}

// Client avec service role pour bypasser RLS
function getSupabaseService() {
  return createServiceClient(
    cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL)!,
    cleanEnv(process.env.SUPABASE_SERVICE_ROLE_KEY)!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}

async function getUserSession() {
  const supabase = await createClient();
  const { data: { session }, error } = await supabase.auth.getSession();
  
  console.log('[getUserSession] Session check:', {
    hasSession: !!session,
    userId: session?.user?.id,
    error: error?.message
  });
  
  return session;
}

async function getUserId() {
  const session = await getUserSession();
  const userId = session?.user?.id || null;
  
  console.log('[getUserId] Result:', userId);
  
  return userId;
}

async function getOrganizationId() {
  const session = await getUserSession();
  if (!session?.user?.id) return null;
  
  const supabase = await createClient();
  
  // Essayer de trouver l'utilisateur par UUID
  let { data: userData } = await supabase
    .from('users')
    .select('tenant_id')
    .eq('id', session.user.id)
    .maybeSingle();
  
  // Si pas trouvé par UUID, essayer par email
  if (!userData && session.user.email) {
    const { data: userByEmail } = await supabase
      .from('users')
      .select('tenant_id')
      .eq('email', session.user.email)
      .maybeSingle();
    
    userData = userByEmail;
  }
  
  // Si toujours pas trouvé, créer l'entrée user avec une organisation
  if (!userData) {
    const supabaseService = getSupabaseService();
    
    // Récupérer ou créer une organisation par défaut
    let { data: defaultOrg } = await supabaseService
      .from('organizations')
      .select('id')
      .limit(1)
      .maybeSingle();
    
    if (!defaultOrg) {
      // Insérer une organisation par défaut (ou utiliser celle qui existe)
      const { data: newOrg, error: orgError } = await supabaseService
        .from('organizations')
        .insert({ name: 'Mon Organisation' })
        .select()
        .maybeSingle();
      
      // Si erreur, récupérer la première org existante
      if (orgError || !newOrg) {
        console.log('Organization insert error (normal if exists):', orgError);
        const { data: existingOrg } = await supabaseService
          .from('organizations')
          .select('id')
          .limit(1)
          .maybeSingle();
        defaultOrg = existingOrg;
      } else {
        defaultOrg = newOrg;
      }
    }
    
    // Créer l'entrée user (insert simple, ignore les erreurs de doublon)
    if (defaultOrg) {
      const { error: insertError } = await supabaseService
        .from('users')
        .insert({
          id: session.user.id,
          email: session.user.email,
          tenant_id: defaultOrg.id,
          role: 'client'
        });
      
      // Ignorer l'erreur si l'utilisateur existe déjà (duplicate key code: 23505)
      if (insertError && insertError.code !== '23505') {
        console.error('Error creating user:', insertError);
      }
      
      return defaultOrg.id;
    }
  }
  
  return userData?.tenant_id || null;
}

export async function getProjects() {
  try {
    console.log('[getProjects] Début de la récupération...');
    
    const userId = await getUserId();
    const organizationId = await getOrganizationId();
    
    console.log('[getProjects] userId:', userId);
    console.log('[getProjects] organizationId:', organizationId);
    
    if (!userId) {
      console.warn('[getProjects] Aucun userId trouvé');
      return { projects: [], error: null };
    }

    // Utiliser le service client pour bypasser RLS
    const supabase = getSupabaseService();
    
    // FILTRE STRICT : projets de l'organisation uniquement
    if (!organizationId) {
      console.warn('[getProjects] Pas d\'organizationId - retour vide');
      return { projects: [], error: null };
    }

    console.log('[getProjects] Filtrage par organizationId:', organizationId);
    
    // Requête avec filtres cohérents Dashboard/Liste
    let query = supabase
      .from('projects')
      .select('*')
      .eq('organization_id', organizationId)
      .or('archived.is.null,archived.eq.false')  // Exclure archivés
      .or('deleted.is.null,deleted.eq.false')    // Exclure supprimés
      .order('created_at', { ascending: false });
    
    const { data, error } = await query;

    if (error) {
      console.error('[getProjects] Erreur Supabase:', error);
      return { projects: [], error: error.message };
    }

    console.log('[getProjects] Projets récupérés:', data?.length || 0);
    console.log('[getProjects] Données:', data);
    
    return { projects: data || [], error: null };
  } catch (err: any) {
    console.error('[getProjects] Erreur inattendue:', err);
    return { projects: [], error: err.message };
  }
}

export async function createProject(formData: FormData) {
  try {
    console.log('[createProject] Début de la création...');
    
    const userId = await getUserId();
    const organizationId = await getOrganizationId();
    
    console.log('[createProject] Auth check:', {
      userId,
      organizationId
    });
    
    if (!userId) {
      console.error('[createProject] Pas de userId - utilisateur non authentifié');
      return { success: false, error: 'Non authentifié. Veuillez vous reconnecter.' };
    }

    if (!organizationId) {
      console.warn('[createProject] Pas d\'organizationId - création avec userId uniquement');
      // Continuer sans organizationId - on l'utilisera comme fallback
    }

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const owner = formData.get('owner') as string;
    const deadline = formData.get('deadline') as string;
    const status = formData.get('status') as string;
    const bu = formData.get('bu') as string;
    const country = formData.get('country') as string;
    const budget_planned = formData.get('budget_planned') as string;

    if (!name || !owner) {
      return { success: false, error: 'Nom et responsable requis' };
    }

    // VALIDATION: status doit être 'active', 'on_hold', ou 'closed'
    const validStatuses = ['active', 'on_hold', 'closed'];
    const finalStatus = status && validStatuses.includes(status) ? status : 'active';

    const supabase = getSupabaseService();
    
    // Préparer les données du projet
    const projectData: any = {
      user_id: userId,
      name,
      description: description || null,
      owner,
      deadline: deadline || null,
      status: finalStatus, // TOUJOURS une valeur valide
      health: 'green',
      progress: 0,
      starred: false,
      bu: bu || 'IT',
      country: country || 'France',
      budget_planned: budget_planned ? parseFloat(budget_planned) : 100000,
      budget_spent: 0,
      capacity_needed: 10,
      capacity_allocated: 0,
      strategic_alignment_score: 50
    };
    
    // Ajouter organization_id seulement s'il existe
    if (organizationId) {
      projectData.organization_id = organizationId;
    }
    
    console.log('[createProject] Insertion projet:', projectData);
    
    const { data, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error creating project:', error);
      return { success: false, error: error.message };
    }

    return { success: true, project: data };
  } catch (err: any) {
    console.error('Unexpected error:', err);
    return { success: false, error: err.message };
  }
}

export async function deleteProject(projectId: string) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return { success: false, error: 'Non authentifié' };
    }

    const supabase = getSupabaseService();
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting project:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Unexpected error:', err);
    return { success: false, error: err.message };
  }
}

export async function toggleStarProject(projectId: string, starred: boolean) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return { success: false, error: 'Non authentifié' };
    }

    const supabase = getSupabaseService();
    const { error } = await supabase
      .from('projects')
      .update({ starred })
      .eq('id', projectId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error toggling star:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Unexpected error:', err);
    return { success: false, error: err.message };
  }
}
