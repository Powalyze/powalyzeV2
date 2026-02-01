import { supabase } from '@/lib/supabase'

export interface CreateProjectInput {
  name: string
  organization_id: string
  user_id: string
}

export async function createProject(input: CreateProjectInput) {
  const { data, error } = await supabase
    .from('projects')
    .insert({
      organization_id: input.organization_id,
      user_id: input.user_id,
      name: input.name
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create project: ${error.message}`)
  }

  return data
}
