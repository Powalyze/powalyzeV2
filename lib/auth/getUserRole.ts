import { supabase } from '@/lib/supabase'

export async function getUserRole(userId: string): Promise<'admin' | 'client' | 'demo' | null> {
  if (!userId) return null

  const { data: user, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single()

  if (error || !user) return null

  return user.role as 'admin' | 'client' | 'demo'
}
