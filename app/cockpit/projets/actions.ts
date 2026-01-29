'use server';

import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function getSupabaseAdmin() {
  return createClient(supabaseUrl, supabaseServiceKey);
}

async function getUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get('sb-access-token')?.value;
  
  if (!token) {
    // Try to get user from Supabase session
    const supabase = getSupabaseAdmin();
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || null;
  }
  
  const supabase = getSupabaseAdmin();
  const { data: { user } } = await supabase.auth.getUser(token);
  return user?.id || null;
}

export async function getProjects() {
  try {
    const userId = await getUserId();
    if (!userId) {
      return { projects: [], error: null };
    }

    const supabase = getSupabaseAdmin();
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
    if (!userId) {
      return { success: false, error: 'Non authentifié' };
    }

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const owner = formData.get('owner') as string;
    const deadline = formData.get('deadline') as string;
    const status = formData.get('status') as string || 'pending';

    if (!name || !owner) {
      return { success: false, error: 'Nom et responsable requis' };
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('projects')
      .insert([{
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

    const supabase = getSupabaseAdmin();
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

    const supabase = getSupabaseAdmin();
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
