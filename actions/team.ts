'use server';

import { createSupabaseServerClient } from '@/lib/supabaseClient';
import { RoleGlobal, RoleProject } from './users';

// ============================================
// TYPES
// ============================================

interface InviteMemberInput {
  email: string;
  roleGlobal: RoleGlobal;
  projectId?: string;
  roleProject?: RoleProject;
  message?: string;
  organizationId: string;
}

// ============================================
// ACTIONS - ÉQUIPE
// ============================================

/**
 * Inviter un membre
 */
export async function inviteMember(input: InviteMemberInput) {
  try {
    const supabase = await createSupabaseServerClient();

    // Récupérer l'utilisateur actuel
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error('Unauthorized');

    // Vérifier si l'email existe déjà
    const { data: existingUser } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (existingUser) {
      return { success: false, error: 'User already exists with this email' };
    }

    // Générer un token unique
    const token = crypto.randomUUID();

    // Créer l'invitation
    const { error: inviteError } = await supabase
      .from('invitations')
      .insert({
        email: input.email,
        organization_id: input.organizationId,
        role_global: input.roleGlobal,
        project_id: input.projectId,
        role_project: input.roleProject,
        message: input.message,
        invited_by: user.id,
        token
      });

    if (inviteError) throw inviteError;

    // Envoyer l'email d'invitation (via SendGrid ou autre)
    const inviteLink = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/accept-invite?token=${token}`;
    
    // TODO: Intégrer SendGrid
    console.log('Invitation link:', inviteLink);

    return { success: true, inviteLink };
  } catch (error: any) {
    console.error('Error inviting member:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Récupérer toutes les invitations
 */
export async function getAllInvitations() {
  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from('invitations')
      .select(`
        *,
        invited_by_user:invited_by (
          id,
          email
        ),
        projects (
          id,
          name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.error('Error fetching invitations:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Accepter une invitation
 */
export async function acceptInvitation(token: string, password: string) {
  try {
    const supabase = await createSupabaseServerClient();

    // Récupérer l'invitation
    const { data: invitation, error: inviteError } = await supabase
      .from('invitations')
      .select('*')
      .eq('token', token)
      .eq('status', 'pending')
      .single();

    if (inviteError || !invitation) {
      return { success: false, error: 'Invalid or expired invitation' };
    }

    // Vérifier l'expiration
    if (new Date(invitation.expires_at) < new Date()) {
      return { success: false, error: 'Invitation expired' };
    }

    // Créer l'utilisateur
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: invitation.email,
      password,
      options: {
        data: {
          organization_id: invitation.organization_id
        }
      }
    });

    if (signUpError) throw signUpError;
    if (!authData.user) throw new Error('User creation failed');

    // Créer le profil
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: authData.user.id,
        is_active: true
      });

    if (profileError) throw profileError;

    // Assigner le rôle global
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: authData.user.id,
        organization_id: invitation.organization_id,
        role_global: invitation.role_global
      });

    if (roleError) throw roleError;

    // Assigner au projet si spécifié
    if (invitation.project_id && invitation.role_project) {
      const { error: memberError } = await supabase
        .from('project_members')
        .insert({
          user_id: authData.user.id,
          project_id: invitation.project_id,
          role_project: invitation.role_project
        });

      if (memberError) throw memberError;
    }

    // Marquer l'invitation comme acceptée
    const { error: updateError } = await supabase
      .from('invitations')
      .update({ status: 'accepted' })
      .eq('token', token);

    if (updateError) throw updateError;

    return { success: true };
  } catch (error: any) {
    console.error('Error accepting invitation:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Annuler une invitation
 */
export async function cancelInvitation(invitationId: string) {
  try {
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase
      .from('invitations')
      .update({ status: 'cancelled' })
      .eq('id', invitationId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error cancelling invitation:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Renvoyer une invitation
 */
export async function resendInvitation(invitationId: string) {
  try {
    const supabase = await createSupabaseServerClient();

    // Récupérer l'invitation
    const { data: invitation, error: fetchError } = await supabase
      .from('invitations')
      .select('*')
      .eq('id', invitationId)
      .single();

    if (fetchError || !invitation) throw new Error('Invitation not found');

    // Générer un nouveau token
    const newToken = crypto.randomUUID();

    // Mettre à jour l'invitation
    const { error: updateError } = await supabase
      .from('invitations')
      .update({
        token: newToken,
        status: 'pending',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      })
      .eq('id', invitationId);

    if (updateError) throw updateError;

    // Renvoyer l'email
    const inviteLink = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/accept-invite?token=${newToken}`;
    
    // TODO: Intégrer SendGrid
    console.log('New invitation link:', inviteLink);

    return { success: true, inviteLink };
  } catch (error: any) {
    console.error('Error resending invitation:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Récupérer les membres d'une équipe
 */
export async function getTeamMembers(organizationId: string) {
  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from('user_profiles')
      .select(`
        *,
        user_roles!inner (
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
      .eq('user_roles.organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.error('Error fetching team members:', error);
    return { success: false, error: error.message };
  }
}
