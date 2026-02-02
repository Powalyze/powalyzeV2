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
    await createProject({
      organization_id: '', // Will be filled by data-v2.ts
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
    redirect('/cockpit/pro/projets');
  } catch (err: any) {
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
    redirect(`/cockpit/pro/projets/${id}`);
  } catch (err: any) {
    return { error: err.message || 'Erreur lors de la mise à jour du projet' };
  }
}

export async function deleteProjectAction(id: string) {
  try {
    await deleteProject(id);
    revalidatePath('/cockpit/pro/projets');
    redirect('/cockpit/pro/projets');
  } catch (err: any) {
    return { error: err.message || 'Erreur lors de la suppression du projet' };
  }
}
