// app/admin/users/page.tsx
import { guardAdmin } from '@/lib/guards';
import { createClient } from '@/utils/supabase/server';
import UsersManagement from './UsersManagement';

export default async function AdminUsersPage() {
  // Guard: Seuls les admins peuvent accéder
  await guardAdmin();

  const supabase = await createClient();

  // Récupérer tous les utilisateurs avec leurs profils
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching profiles:', error);
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Erreur</h1>
          <p className="text-slate-400">Impossible de charger les utilisateurs</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Gestion des utilisateurs
          </h1>
          <p className="text-slate-400">
            Gérez les rôles et accès de tous les utilisateurs Powalyze
          </p>
        </div>

        <UsersManagement initialProfiles={profiles || []} />
      </div>
    </div>
  );
}
