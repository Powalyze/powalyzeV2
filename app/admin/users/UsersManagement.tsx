'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { User, Shield, TestTube, Save, AlertTriangle } from 'lucide-react';

interface Profile {
  id: string;
  user_id: string;
  email: string;
  role: 'demo' | 'pro' | 'admin';
  organization_id: string | null;
  created_at: string;
  updated_at: string;
}

interface UsersManagementProps {
  initialProfiles: Profile[];
}

export default function UsersManagement({ initialProfiles }: UsersManagementProps) {
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles);
  const [saving, setSaving] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'demo' | 'pro' | 'admin'>('all');

  const handleRoleChange = async (userId: string, newRole: 'demo' | 'pro' | 'admin') => {
    setSaving(userId);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating role:', error);
        toast.error('Erreur lors de la mise à jour du rôle');
        setSaving(null);
        return;
      }

      // Mettre à jour l'état local
      setProfiles(profiles.map(p => 
        p.user_id === userId ? { ...p, role: newRole } : p
      ));

      toast.success(`Rôle mis à jour: ${newRole.toUpperCase()}`);
      setSaving(null);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Erreur inattendue');
      setSaving(null);
    }
  };

  const filteredProfiles = profiles.filter(p => {
    if (filter === 'all') return true;
    return p.role === filter;
  });

  const getRoleBadge = (role: string) => {
    const styles = {
      admin: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      pro: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      demo: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    };

    const icons = {
      admin: <Shield className="h-3.5 w-3.5" />,
      pro: <Shield className="h-3.5 w-3.5" />,
      demo: <TestTube className="h-3.5 w-3.5" />
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[role as keyof typeof styles]}`}>
        {icons[role as keyof typeof icons]}
        {role.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400 mr-2">Filtrer:</span>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-slate-700 text-white' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Tous ({profiles.length})
          </button>
          <button
            onClick={() => setFilter('demo')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === 'demo' 
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Demo ({profiles.filter(p => p.role === 'demo').length})
          </button>
          <button
            onClick={() => setFilter('pro')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === 'pro' 
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Pro ({profiles.filter(p => p.role === 'pro').length})
          </button>
          <button
            onClick={() => setFilter('admin')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === 'admin' 
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Admin ({profiles.filter(p => p.role === 'admin').length})
          </button>
        </div>
      </div>

      {/* Tableau utilisateurs */}
      <div className="bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  Utilisateur
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  Rôle actuel
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  Changer le rôle
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  Créé le
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredProfiles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    Aucun utilisateur trouvé
                  </td>
                </tr>
              ) : (
                filteredProfiles.map((profile) => (
                  <tr key={profile.user_id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                          <User className="h-5 w-5 text-slate-400" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">
                            {profile.email}
                          </div>
                          <div className="text-xs text-slate-500">
                            ID: {profile.user_id.slice(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getRoleBadge(profile.role)}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={profile.role}
                        onChange={(e) => handleRoleChange(profile.user_id, e.target.value as 'demo' | 'pro' | 'admin')}
                        disabled={saving === profile.user_id}
                        className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
                      >
                        <option value="demo">Demo</option>
                        <option value="pro">Pro</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-400">
                        {new Date(profile.created_at).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {saving === profile.user_id ? (
                        <div className="flex items-center gap-2 text-amber-400 text-sm">
                          <Save className="h-4 w-4 animate-pulse" />
                          Enregistrement...
                        </div>
                      ) : (
                        <div className="text-slate-500 text-sm">
                          Prêt
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Warning */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-amber-400 mb-1">
              Attention
            </h3>
            <p className="text-sm text-amber-300/80">
              Les modifications de rôle sont immédiates. Un utilisateur passé en{' '}
              <strong>PRO</strong> perdra l'accès au mode <strong>DEMO</strong> et vice-versa.
              Seuls les <strong>ADMIN</strong> peuvent gérer les utilisateurs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
