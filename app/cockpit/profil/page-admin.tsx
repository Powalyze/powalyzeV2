'use client';

import { CockpitShell } from '@/components/cockpit/CockpitShell';
import { useState, useEffect } from 'react';
import { User, Mail, Shield, Plus, Edit, Trash, Key, Power, Check, X, Search } from 'lucide-react';
import { getAllUsers, createUser, updateUser, disableUser, enableUser, resetPassword, assignUserToProject, removeUserFromProject } from '@/actions/users';
import { useToast } from '@/components/ui/ToastProvider';

type RoleGlobal = 'super_admin' | 'admin' | 'chef_projet' | 'contributeur' | 'lecteur';
type RoleProject = 'owner' | 'editor' | 'viewer';

interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  user_roles: Array<{
    role_global: RoleGlobal;
    organization_id: string;
  }>;
  project_members: Array<{
    project_id: string;
    role_project: RoleProject;
    projects: {
      name: string;
    };
  }>;
}

const ROLE_LABELS: Record<RoleGlobal, string> = {
  super_admin: 'Super Admin',
  admin: 'Administrateur',
  chef_projet: 'Chef de projet',
  contributeur: 'Contributeur',
  lecteur: 'Lecteur'
};

const ROLE_PROJECT_LABELS: Record<RoleProject, string> = {
  owner: 'Propriétaire',
  editor: 'Éditeur',
  viewer: 'Lecteur'
};

export default function ProfilPage() {
  const { showToast } = useToast();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    roleGlobal: 'contributeur' as RoleGlobal,
    organizationId: 'default-org' // À récupérer du contexte
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const result = await getAllUsers();
    if (result.success && result.data) {
      setUsers(result.data as UserData[]);
    } else {
      showToast('error', 'Erreur', result.error || 'Impossible de charger les utilisateurs');
    }
    setLoading(false);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await createUser(formData);
    
    if (result.success) {
      showToast('success', '✅ Utilisateur créé', 'Un email de bienvenue a été envoyé');
      setShowCreateModal(false);
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        roleGlobal: 'contributeur',
        organizationId: 'default-org'
      });
      fetchUsers();
    } else {
      showToast('error', 'Erreur', result.error || 'Impossible de créer l\'utilisateur');
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser) return;

    const result = await updateUser({
      userId: selectedUser.id,
      firstName: formData.firstName,
      lastName: formData.lastName,
      roleGlobal: formData.roleGlobal
    });
    
    if (result.success) {
      showToast('success', '✅ Utilisateur mis à jour', '');
      setShowEditModal(false);
      setSelectedUser(null);
      fetchUsers();
    } else {
      showToast('error', 'Erreur', result.error || 'Impossible de mettre à jour l\'utilisateur');
    }
  };

  const handleToggleStatus = async (user: UserData) => {
    const result = user.is_active 
      ? await disableUser(user.id)
      : await enableUser(user.id);
    
    if (result.success) {
      showToast('success', user.is_active ? '⏸️ Utilisateur désactivé' : '▶️ Utilisateur réactivé', '');
      fetchUsers();
    } else {
      showToast('error', 'Erreur', result.error || 'Impossible de modifier le statut');
    }
  };

  const handleResetPassword = async (user: UserData) => {
    const userEmail = user.id; // Récupérer l'email depuis Supabase Auth
    const result = await resetPassword(userEmail);
    
    if (result.success) {
      showToast('success', '📧 Email envoyé', 'Un lien de réinitialisation a été envoyé');
    } else {
      showToast('error', 'Erreur', result.error || 'Impossible d\'envoyer l\'email');
    }
  };

  const openEditModal = (user: UserData) => {
    setSelectedUser(user);
    setFormData({
      email: user.id, // Email depuis auth
      firstName: user.first_name || '',
      lastName: user.last_name || '',
      roleGlobal: user.user_roles[0]?.role_global || 'contributeur',
      organizationId: 'default-org'
    });
    setShowEditModal(true);
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.first_name?.toLowerCase().includes(searchLower) ||
      user.last_name?.toLowerCase().includes(searchLower) ||
      user.id?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <CockpitShell>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Gestion des utilisateurs</h1>
              <p className="text-slate-400">Administration des comptes, rôles et permissions</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20"
            >
              <Plus size={20} />
              Créer un utilisateur
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par nom ou email..."
              className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Users table */}
        {loading ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-400">Chargement des utilisateurs...</p>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950">
                  <th className="text-left p-4 font-semibold">Utilisateur</th>
                  <th className="text-left p-4 font-semibold">Rôle global</th>
                  <th className="text-left p-4 font-semibold">Projets</th>
                  <th className="text-left p-4 font-semibold">Statut</th>
                  <th className="text-right p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold">
                          {user.first_name?.[0]}{user.last_name?.[0]}
                        </div>
                        <div>
                          <div className="font-semibold">{user.first_name} {user.last_name}</div>
                          <div className="text-sm text-slate-400">{user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-400">
                        {ROLE_LABELS[user.user_roles[0]?.role_global] || 'N/A'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        {user.project_members.slice(0, 2).map((pm, idx) => (
                          <span key={idx} className="text-sm text-slate-400">
                            {pm.projects.name} ({ROLE_PROJECT_LABELS[pm.role_project]})
                          </span>
                        ))}
                        {user.project_members.length > 2 && (
                          <span className="text-xs text-slate-500">
                            +{user.project_members.length - 2} autres
                          </span>
                        )}
                        {user.project_members.length === 0 && (
                          <span className="text-sm text-slate-500">Aucun projet</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      {user.is_active ? (
                        <span className="flex items-center gap-2 text-green-400">
                          <Check size={16} />
                          Actif
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 text-red-400">
                          <X size={16} />
                          Désactivé
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleResetPassword(user)}
                          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                          title="Réinitialiser mot de passe"
                        >
                          <Key size={16} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className={`p-2 hover:bg-slate-700 rounded-lg transition-colors ${
                            user.is_active ? 'text-yellow-400' : 'text-green-400'
                          }`}
                          title={user.is_active ? 'Désactiver' : 'Réactiver'}
                        >
                          <Power size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal: Create User */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowCreateModal(false)}>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-2xl font-bold mb-4">Créer un utilisateur</h2>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Prénom</label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Nom</label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Rôle global</label>
                  <select
                    value={formData.roleGlobal}
                    onChange={(e) => setFormData({ ...formData, roleGlobal: e.target.value as RoleGlobal })}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(ROLE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg font-semibold transition-all"
                  >
                    Créer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Edit User */}
        {showEditModal && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowEditModal(false)}>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-2xl font-bold mb-4">Modifier l'utilisateur</h2>
              <form onSubmit={handleUpdateUser} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Prénom</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Nom</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Rôle global</label>
                  <select
                    value={formData.roleGlobal}
                    onChange={(e) => setFormData({ ...formData, roleGlobal: e.target.value as RoleGlobal })}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(ROLE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg font-semibold transition-all"
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </CockpitShell>
  );
}
