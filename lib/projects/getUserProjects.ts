import { supabase } from '@/lib/supabase'

export interface Project {
  id: string
  organization_id: string
  user_id: string
  name: string
  created_at: string
  updated_at: string
}

export async function getUserProjects(userId: string, organizationId: string): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching projects:', error)
    return []
  }

  return data || []
}
