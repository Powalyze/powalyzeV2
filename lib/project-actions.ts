'use server';

// ============================================================
// POWALYZE V2 — PROJECT ACTIONS
// ============================================================

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createProject, updateProject, deleteProject } from '@/lib/data-v2';
import type { Project } from '@/lib/data-v2';

export async function createProjectAction(formData: FormData) {
  try {
    // Get organization_id first
    const { createClient } = await import('@/utils/supabase/server');
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: 'Non authentifié' };
    }
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single();
    
    if (!profile?.organization_id) {
      return { error: 'Organisation non trouvée' };
    }
    
    const project = await createProject({
      organization_id: profile.organization_id,
      owner_id: user.id,
      name: formData.get('name') as string,
      description: formData.get('description') as string || undefined,
      status: formData.get('status') as any,
      health: formData.get('health') as any,
      progress: Number(formData.get('progress')),
      budget: formData.get('budget') ? Number(formData.get('budget')) : undefined,
      deadline: formData.get('deadline') as string || undefined,
      starred: false,
    });
    
    revalidatePath('/cockpit/pro/projets');
    
    // Check if wizard should be started
    const continueWizard = formData.get('continue_wizard') === 'on';
    if (continueWizard && project?.id) {
      redirect(`/cockpit/pro/projets/${project.id}/wizard`);
    }
    
    redirect('/cockpit/pro/projets');
  } catch (err: any) {
    // Don't catch redirect errors
    if (err?.message?.includes('NEXT_REDIRECT')) {
      throw err;
    }
    return { error: err.message || 'Erreur lors de la création du projet' };
  }
}

export async function updateProjectAction(id: string, formData: FormData) {
  try {
    await updateProject(id, {
      name: formData.get('name') as string,
      description: formData.get('description') as string || undefined,
      status: formData.get('status') as any,
      health: formData.get('health') as any,
      progress: Number(formData.get('progress')),
      budget: formData.get('budget') ? Number(formData.get('budget')) : undefined,
      deadline: formData.get('deadline') as string || undefined,
    });
    
    revalidatePath('/cockpit/pro/projets');
    revalidatePath(`/cockpit/pro/projets/${id}`);
  } catch (err: any) {
    return { error: err.message || 'Erreur lors de la mise à jour du projet' };
  }
  
  redirect(`/cockpit/pro/projets/${id}`);
}

export async function deleteProjectAction(id: string) {
  try {
    await deleteProject(id);
    revalidatePath('/cockpit/pro/projets');
  } catch (err: any) {
    return { error: err.message || 'Erreur lors de la suppression du projet' };
  }
  
  redirect('/cockpit/pro/projets');
}
