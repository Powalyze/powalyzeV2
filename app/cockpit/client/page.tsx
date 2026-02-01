import { redirect } from 'next/navigation'
import { getUserRole } from '@/lib/auth/getUserRole'
import { getUserProjects } from '@/lib/projects/getUserProjects'
import Onboarding from '@/components/onboarding/Onboarding'
import ClientCockpit from '@/components/client/ClientCockpit'

export default async function ClientPage({
  searchParams
}: {
  searchParams: { userId?: string; organizationId?: string }
}) {
  const userId = searchParams.userId
  const organizationId = searchParams.organizationId

  if (!userId) {
    redirect('/auth/login')
  }

  const role = await getUserRole(userId)

  if (role !== 'client') {
    redirect('/cockpit/demo')
  }

  // Si organizationId manque, le récupérer depuis la base
  let finalOrgId: string = organizationId || ''
  if (!finalOrgId) {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data: userData } = await supabase
      .from('users')
      .select('tenant_id')
      .eq('id', userId)
      .single()
    
    if (userData?.tenant_id) {
      finalOrgId = userData.tenant_id
    } else {
      redirect('/auth/login')
    }
  }

  const projects = await getUserProjects(userId, finalOrgId)

  if (!projects || projects.length === 0) {
    return <Onboarding userId={userId} organizationId={finalOrgId} />
  }

  return <ClientCockpit projects={projects} userId={userId} organizationId={finalOrgId} />
}
