import { redirect } from 'next/navigation'
import { getUserRole } from '@/lib/auth/getUserRole'
import AdminDashboard from '@/components/admin/AdminDashboard'

export default async function AdminPage({
  searchParams
}: {
  searchParams: { userId?: string }
}) {
  const userId = searchParams.userId

  if (!userId) {
    redirect('/auth/login')
  }

  const role = await getUserRole(userId)

  if (role !== 'admin') {
    redirect('/cockpit/demo')
  }

  return <AdminDashboard />
}
