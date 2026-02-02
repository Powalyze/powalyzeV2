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
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

async function getUserId() {
  const session = await getUserSession();
  return session?.user?.id || null;
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
    .single();
  
  // Si pas trouvé par UUID, essayer par email
  if (!userData && session.user.email) {
    const { data: userByEmail } = await supabase
      .from('users')
      .select('tenant_id')
      .eq('email', session.user.email)
      .single();
    
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
      .single();
    
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
    const userId = await getUserId();
    if (!userId) {
      return { projects: [], error: null };
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
      return { projects: [], error: error.message };
    }

    return { projects: data || [], error: null };
  } catch (err: any) {
    console.error('Unexpected error:', err);
    return { projects: [], error: err.message };
  }
}

export async function createProject(formData: FormData) {
  try {
    const userId = await getUserId();
    const organizationId = await getOrganizationId();
    
    if (!userId) {
      return { success: false, error: 'Non authentifié' };
    }

    if (!organizationId) {
      return { success: false, error: 'Organisation non trouvée' };
    }

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const owner = formData.get('owner') as string;
    const deadline = formData.get('deadline') as string;
    const status = formData.get('status') as string || 'pending';

    if (!name || !owner) {
      return { success: false, error: 'Nom et responsable requis' };
    }

    const supabase = getSupabaseService();
    const { data, error } = await supabase
      .from('projects')
      .insert([{
        organization_id: organizationId,
        user_id: userId,
        name,
        description: description || null,
        owner,
        deadline: deadline || null,
        status,
        health: 'green',
        progress: 0,
        starred: false
      }])
      .select()
      .single();

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
