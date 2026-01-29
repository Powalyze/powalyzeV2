'use server';

import { createSupabaseServerClient } from '@/lib/supabaseClient';

// ============================================
// TYPES
// ============================================

export type RoleGlobal = 'super_admin' | 'admin' | 'chef_projet' | 'contributeur' | 'lecteur';
export type RoleProject = 'owner' | 'editor' | 'viewer';

interface CreateUserInput {
  email: string;
  firstName: string;
  lastName: string;
  roleGlobal: RoleGlobal;
  projectId?: string;
  roleProject?: RoleProject;
  organizationId: string;
}

interface UpdateUserInput {
  userId: string;
  firstName?: string;
  lastName?: string;
  roleGlobal?: RoleGlobal;
  isActive?: boolean;
}

interface AssignUserToProjectInput {
  userId: string;
  projectId: string;
  roleProject: RoleProject;
}

// ============================================
// ACTIONS - PROFIL
// ============================================

/**
 * Créer un nouvel utilisateur
 */
export async function createUser(input: CreateUserInput) {
  try {
    const supabase = await createSupabaseServerClient();

    // 1. Créer l'utilisateur dans Supabase Auth (admin API)
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: input.email,
      email_confirm: true,
      user_metadata: {
        first_name: input.firstName,
        last_name: input.lastName
      }
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('User creation failed');

    const userId = authData.user.id;

    // 2. Créer le profil utilisateur
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: userId,
        first_name: input.firstName,
        last_name: input.lastName,
        is_active: true
      });

    if (profileError) throw profileError;

    // 3. Assigner le rôle global
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        organization_id: input.organizationId,
        role_global: input.roleGlobal
      });

    if (roleError) throw roleError;

    // 4. Assigner au projet si spécifié
    if (input.projectId && input.roleProject) {
      const { error: memberError } = await supabase
        .from('project_members')
        .insert({
          user_id: userId,
          project_id: input.projectId,
          role_project: input.roleProject
        });

      if (memberError) throw memberError;
    }

    return { success: true, userId };
  } catch (error: any) {
    console.error('Error creating user:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Mettre à jour un utilisateur
 */
export async function updateUser(input: UpdateUserInput) {
  try {
    const supabase = await createSupabaseServerClient();

    // Mettre à jour le profil
    if (input.firstName || input.lastName || input.isActive !== undefined) {
      const updates: any = {};
      if (input.firstName) updates.first_name = input.firstName;
      if (input.lastName) updates.last_name = input.lastName;
      if (input.isActive !== undefined) updates.is_active = input.isActive;

      const { error: profileError } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', input.userId);

      if (profileError) throw profileError;
    }

    // Mettre à jour le rôle global si spécifié
    if (input.roleGlobal) {
      const { error: roleError } = await supabase
        .from('user_roles')
        .update({ role_global: input.roleGlobal })
        .eq('user_id', input.userId);

      if (roleError) throw roleError;
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error updating user:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Désactiver un utilisateur
 */
export async function disableUser(userId: string) {
  try {
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase
      .from('user_profiles')
      .update({ is_active: false })
      .eq('id', userId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error disabling user:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Réactiver un utilisateur
 */
export async function enableUser(userId: string) {
  try {
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase
      .from('user_profiles')
      .update({ is_active: true })
      .eq('id', userId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error enabling user:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Réinitialiser le mot de passe (envoie un email)
 */
export async function resetPassword(email: string) {
  try {
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`
    });

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error resetting password:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Assigner un utilisateur à un projet
 */
export async function assignUserToProject(input: AssignUserToProjectInput) {
  try {
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase
      .from('project_members')
      .upsert({
        user_id: input.userId,
        project_id: input.projectId,
        role_project: input.roleProject
      }, { onConflict: 'project_id,user_id' });

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error assigning user to project:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Retirer un utilisateur d'un projet
 */
export async function removeUserFromProject(userId: string, projectId: string) {
  try {
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase
      .from('project_members')
      .delete()
      .eq('user_id', userId)
      .eq('project_id', projectId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error removing user from project:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Récupérer tous les utilisateurs (admin)
 */
export async function getAllUsers() {
  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from('user_profiles')
      .select(`
        *,
        user_roles (
          role_global,
          organization_id
        ),
        project_members (
          project_id,
          role_project,
          projects (
            name
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Récupérer un utilisateur par ID
 */
export async function getUserById(userId: string) {
  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from('user_profiles')
      .select(`
        *,
        user_roles (
          role_global,
          organization_id
        ),
        project_members (
          project_id,
          role_project,
          projects (
            id,
            name
          )
        )
      `)
      .eq('id', userId)
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.error('Error fetching user:', error);
    return { success: false, error: error.message };
  }
}
