"use client";

import { CockpitShell } from "@/components/cockpit/CockpitShell";
import { useEffect, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";
import { User, Mail, Building, Globe, Bell, Shield, Palette, Save, LogOut, Users, UserPlus, Key, ToggleLeft } from "lucide-react";
import { getAllUsers, createUser, updateUser, disableUser, enableUser, resetPassword } from '@/actions/users';
import { ToastProvider, useToast } from '@/components/ui/ToastProvider';

type Language = "fr" | "en" | "de" | "it";
type Theme = "dark" | "light" | "auto";
type RoleGlobal = 'super_admin' | 'admin' | 'chef_projet' | 'contributeur' | 'lecteur';

const ROLE_LABELS: Record<RoleGlobal, string> = {
  super_admin: 'Super Admin',
  admin: 'Administrateur',
  chef_projet: 'Chef de projet',
  contributeur: 'Contributeur',
  lecteur: 'Lecteur'
};

function ProfilPageContent() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<"profile" | "preferences" | "security" | "notifications" | "admin">("profile");
  const [language, setLanguage] = useState<Language>("fr");
  const [theme, setTheme] = useState<Theme>("dark");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    role: "member"
  });

  const initials = useMemo(() => {
    const first = profile.firstName?.trim()?.[0] || "";
    const last = profile.lastName?.trim()?.[0] || "";
    return (first + last).toUpperCase() || "P";
  }, [profile.firstName, profile.lastName]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData.user) {
          setError("Impossible de charger le profil");
          setLoading(false);
          return;
        }

        const user = userData.user;
        const { data: dbProfile } = await supabase
          .from("profiles")
          .select("first_name,last_name,company,role,email")
          .eq("id", user.id)
          .single();

        setProfile({
          firstName: dbProfile?.first_name || user.user_metadata?.first_name || "",
          lastName: dbProfile?.last_name || user.user_metadata?.last_name || "",
          company: dbProfile?.company || user.user_metadata?.company || "",
          email: dbProfile?.email || user.email || "",
          role: dbProfile?.role || "member"
        });

        // Check if user is admin
        const { data: userRole } = await supabase
          .from("user_roles")
          .select("role_global")
          .eq("user_id", user.id)
          .single();
        
        setIsAdmin(userRole?.role_global === 'admin' || userRole?.role_global === 'super_admin');
      } catch {
        setError("Impossible de charger le profil");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        setError("Session invalide");
        return;
      }

      const user = userData.user;
      const { error: updateError } = await supabase
        .from("profiles")
        .upsert(
          {
            id: user.id,
            email: profile.email || user.email,
            first_name: profile.firstName,
            last_name: profile.lastName,
            company: profile.company || null,
            role: profile.role
          },
          { onConflict: "id" }
        );

      if (updateError) {
        setError(updateError.message);
        return;
      }

      await supabase.auth.updateUser({
        data: {
          first_name: profile.firstName,
          last_name: profile.lastName,
          company: profile.company || null
        }
      });
    } catch {
      setError("Impossible d'enregistrer le profil");
    } finally {
      setSaving(false);
    }
  };

  return (
    <CockpitShell>
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profil & Paramètres</h1>
          <p className="text-slate-400">Gérez vos informations personnelles et préférences</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 p-1 bg-slate-900 rounded-lg border border-slate-800 overflow-x-auto">
          <TabButton
            label="Profil"
            icon={<User size={18} />}
            active={activeTab === "profile"}
            onClick={() => setActiveTab("profile")}
          />
          <TabButton
            label="Préférences"
            icon={<Palette size={18} />}
            active={activeTab === "preferences"}
            onClick={() => setActiveTab("preferences")}
          />
          <TabButton
            label="Sécurité"
            icon={<Shield size={18} />}
            active={activeTab === "security"}
            onClick={() => setActiveTab("security")}
          />
          <TabButton
            label="Notifications"
            icon={<Bell size={18} />}
            active={activeTab === "notifications"}
            onClick={() => setActiveTab("notifications")}
          />
          {isAdmin && (
            <TabButton
              label="Administration"
              icon={<Users size={18} />}
              active={activeTab === "admin"}
              onClick={() => setActiveTab("admin")}
            />
          )}
        </div>

        {/* Content */}
        {activeTab === "profile" && (
          <ProfileTab
            loading={loading}
            saving={saving}
            error={error}
            initials={initials}
            profile={profile}
            setProfile={setProfile}
            onSave={handleSave}
          />
        )}
        {activeTab === "preferences" && <PreferencesTab language={language} setLanguage={setLanguage} theme={theme} setTheme={setTheme} />}
        {activeTab === "security" && <SecurityTab />}
        {activeTab === "notifications" && <NotificationsTab />}
        {activeTab === "admin" && isAdmin && <AdminTab showToast={showToast} />}
      </div>
    </CockpitShell>
  );
}

function AdminTab({ showToast }: { showToast: (type: 'success' | 'error' | 'info', title: string, message: string) => void }) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const [createForm, setCreateForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    roleGlobal: 'contributeur' as RoleGlobal
  });

  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    roleGlobal: 'contributeur' as RoleGlobal
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const result = await getAllUsers();
    if (result.success) {
      setUsers(result.data || []);
    }
    setLoading(false);
  };

  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase();
    return (
      user.id?.toLowerCase().includes(query) ||
      user.first_name?.toLowerCase().includes(query) ||
      user.last_name?.toLowerCase().includes(query)
    );
  });

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createUser({ ...createForm, organizationId: 'default-org' });
    if (result.success) {
      showToast('success', '✅ Utilisateur créé', `${createForm.email} a été créé avec succès`);
      setShowCreateModal(false);
      setCreateForm({ email: '', password: '', firstName: '', lastName: '', roleGlobal: 'contributeur' });
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
      firstName: editForm.firstName,
      lastName: editForm.lastName,
      roleGlobal: editForm.roleGlobal
    });

    if (result.success) {
      showToast('success', '✅ Utilisateur modifié', '');
      setShowEditModal(false);
      setSelectedUser(null);
      fetchUsers();
    } else {
      showToast('error', 'Erreur', result.error || 'Impossible de modifier l\'utilisateur');
    }
  };

  const handleToggleStatus = async (userId: string, isActive: boolean) => {
    const result = isActive ? await disableUser(userId) : await enableUser(userId);
    if (result.success) {
      showToast('success', isActive ? '🔒 Compte désactivé' : '✅ Compte activé', '');
      fetchUsers();
    } else {
      showToast('error', 'Erreur', result.error || 'Impossible de modifier le statut');
    }
  };

  const handleResetPassword = async (email: string) => {
    const result = await resetPassword(email);
    if (result.success) {
      showToast('success', '📧 Email envoyé', `Email de réinitialisation envoyé à ${email}`);
    } else {
      showToast('error', 'Erreur', result.error || 'Impossible d\'envoyer l\'email');
    }
  };

  const openEditModal = (user: any) => {
    setSelectedUser(user);
    setEditForm({
      firstName: user.first_name || '',
      lastName: user.last_name || '',
      roleGlobal: user.user_roles[0]?.role_global || 'contributeur'
    });
    setShowEditModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users size={24} className="text-amber-400" />
            Gestion des utilisateurs
          </h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-lg font-semibold flex items-center gap-2 transition-all"
          >
            <UserPlus size={18} />
            Créer un utilisateur
          </button>
        </div>

        <input
          type="text"
          placeholder="Rechercher un utilisateur..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full mb-4 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
        />

        {loading ? (
          <div className="text-center py-8 text-slate-400">Chargement...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950">
                  <th className="text-left p-4 font-semibold">Utilisateur</th>
                  <th className="text-left p-4 font-semibold">Rôle global</th>
                  <th className="text-left p-4 font-semibold">Projets</th>
                  <th className="text-left p-4 font-semibold">Statut</th>
                  <th className="text-left p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-semibold">
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
                        {ROLE_LABELS[user.user_roles[0]?.role_global as RoleGlobal] || 'N/A'}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">
                      {user.project_members?.length || 0} projet(s)
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.is_active
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {user.is_active ? 'Actif' : 'Désactivé'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-2 hover:bg-slate-700 rounded transition-colors"
                          title="Modifier"
                        >
                          <User size={16} />
                        </button>
                        <button
                          onClick={() => handleResetPassword(user.id)}
                          className="p-2 hover:bg-slate-700 rounded transition-colors text-yellow-400"
                          title="Réinitialiser mot de passe"
                        >
                          <Key size={16} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(user.id, user.is_active)}
                          className={`p-2 hover:bg-slate-700 rounded transition-colors ${
                            user.is_active ? 'text-red-400' : 'text-green-400'
                          }`}
                          title={user.is_active ? 'Désactiver' : 'Activer'}
                        >
                          <ToggleLeft size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Create User */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowCreateModal(false)}>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4">Créer un utilisateur</h2>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  placeholder="utilisateur@exemple.com"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Mot de passe</label>
                <input
                  type="password"
                  required
                  value={createForm.password}
                  onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                  placeholder="Min. 8 caractères"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Prénom</label>
                <input
                  type="text"
                  required
                  value={createForm.firstName}
                  onChange={(e) => setCreateForm({ ...createForm, firstName: e.target.value })}
                  placeholder="Jean"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Nom</label>
                <input
                  type="text"
                  required
                  value={createForm.lastName}
                  onChange={(e) => setCreateForm({ ...createForm, lastName: e.target.value })}
                  placeholder="Dupont"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Rôle global</label>
                <select
                  value={createForm.roleGlobal}
                  onChange={(e) => setCreateForm({ ...createForm, roleGlobal: e.target.value as RoleGlobal })}
                  aria-label="Sélectionner le rôle global"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-lg font-semibold transition-all"
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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowEditModal(false)}>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4">Modifier l'utilisateur</h2>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Prénom</label>
                <input
                  type="text"
                  required
                  value={editForm.firstName}
                  onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                  placeholder="Jean"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Nom</label>
                <input
                  type="text"
                  required
                  value={editForm.lastName}
                  onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                  placeholder="Dupont"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Rôle global</label>
                <select
                  value={editForm.roleGlobal}
                  onChange={(e) => setEditForm({ ...editForm, roleGlobal: e.target.value as RoleGlobal })}
                  aria-label="Sélectionner le rôle global"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-lg font-semibold transition-all"
                >
                  Modifier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProfilPage() {
  return (
    <ToastProvider>
      <ProfilPageContent />
    </ToastProvider>
  );
}

function TabButton({ label, icon, active, onClick }: { label: string; icon: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
        active
          ? "bg-amber-500 text-slate-950"
          : "text-slate-400 hover:text-white"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function ProfileTab({
  loading,
  saving,
  error,
  initials,
  profile,
  setProfile,
  onSave
}: {
  loading: boolean;
  saving: boolean;
  error: string | null;
  initials: string;
  profile: { firstName: string; lastName: string; company: string; email: string; role: string };
  setProfile: React.Dispatch<React.SetStateAction<{ firstName: string; lastName: string; company: string; email: string; role: string }>>;
  onSave: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="p-8 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
            <span className="text-4xl font-bold text-slate-950">{initials}</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-1">
              {profile.firstName || profile.lastName ? `${profile.firstName} ${profile.lastName}`.trim() : "Utilisateur"}
            </h2>
            <p className="text-slate-400">{profile.role === "admin" ? "Administrateur" : "Membre"}</p>
          </div>
        </div>

        {loading && (
          <div className="mb-6 text-slate-400">Chargement du profil...</div>
        )}
        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <FormField
            label="Prénom"
            icon={<User size={20} />}
            value={profile.firstName}
            onChange={(value) => setProfile((prev) => ({ ...prev, firstName: value }))}
          />
          <FormField
            label="Nom"
            icon={<User size={20} />}
            value={profile.lastName}
            onChange={(value) => setProfile((prev) => ({ ...prev, lastName: value }))}
          />
          <FormField
            label="Email"
            icon={<Mail size={20} />}
            value={profile.email}
            readonly
          />
          <FormField
            label="Société"
            icon={<Building size={20} />}
            value={profile.company}
            onChange={(value) => setProfile((prev) => ({ ...prev, company: value }))}
            placeholder="Votre société"
          />
          <FormField
            label="Rôle"
            icon={<Shield size={20} />}
            value={profile.role === "admin" ? "Administrateur" : "Membre"}
            readonly
          />
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={onSave}
            disabled={saving}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 font-semibold transition-all flex items-center gap-2 disabled:opacity-60"
          >
            <Save size={20} />
            <span>{saving ? "Enregistrement..." : "Enregistrer"}</span>
          </button>
          <button className="px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white font-semibold transition-colors">
            Annuler
          </button>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/30">
        <h3 className="text-lg font-bold text-red-400 mb-2">Zone dangereuse</h3>
        <p className="text-slate-400 mb-4">
          Supprimer votre compte et toutes vos données de manière permanente
        </p>
        <button className="px-6 py-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 hover:text-red-300 font-semibold transition-colors">
          Supprimer mon compte
        </button>
      </div>
    </div>
  );
}

function PreferencesTab({ language, setLanguage, theme, setTheme }: { language: Language; setLanguage: (l: Language) => void; theme: Theme; setTheme: (t: Theme) => void }) {
  return (
    <div className="space-y-6">
      {/* Language */}
      <div className="p-8 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3 mb-6">
          <Globe size={24} className="text-amber-400" />
          <h3 className="text-xl font-bold">Langue de l'interface</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <LanguageOption
            code="fr"
            label="Français"
            flag="🇫🇷"
            selected={language === "fr"}
            onClick={() => setLanguage("fr")}
          />
          <LanguageOption
            code="en"
            label="English"
            flag="🇬🇧"
            selected={language === "en"}
            onClick={() => setLanguage("en")}
          />
          <LanguageOption
            code="de"
            label="Deutsch"
            flag="🇩🇪"
            selected={language === "de"}
            onClick={() => setLanguage("de")}
          />
          <LanguageOption
            code="it"
            label="Italiano"
            flag="🇮🇹"
            selected={language === "it"}
            onClick={() => setLanguage("it")}
          />
        </div>
      </div>

      {/* Theme */}
      <div className="p-8 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3 mb-6">
          <Palette size={24} className="text-purple-400" />
          <h3 className="text-xl font-bold">Thème visuel</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <ThemeOption
            value="dark"
            label="Sombre"
            selected={theme === "dark"}
            onClick={() => setTheme("dark")}
          />
          <ThemeOption
            value="light"
            label="Clair"
            selected={theme === "light"}
            onClick={() => setTheme("light")}
          />
          <ThemeOption
            value="auto"
            label="Automatique"
            selected={theme === "auto"}
            onClick={() => setTheme("auto")}
          />
        </div>
      </div>

      {/* Other Preferences */}
      <div className="p-8 rounded-xl bg-slate-900 border border-slate-800">
        <h3 className="text-xl font-bold mb-6">Autres préférences</h3>
        <div className="space-y-4">
          <ToggleOption
            label="Activer les animations"
            description="Transitions et effets visuels"
            enabled={true}
          />
          <ToggleOption
            label="Format date européen"
            description="DD/MM/YYYY au lieu de MM/DD/YYYY"
            enabled={true}
          />
          <ToggleOption
            label="Afficher les tooltips"
            description="Bulles d'aide sur les éléments interactifs"
            enabled={true}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 font-bold transition-all flex items-center gap-2">
          <Save size={20} />
          <span>Enregistrer les préférences</span>
        </button>
      </div>
    </div>
  );
}

function SecurityTab() {
  return (
    <div className="space-y-6">
      <div className="p-8 rounded-xl bg-slate-900 border border-slate-800">
        <h3 className="text-xl font-bold mb-6">Changer le mot de passe</h3>
        <div className="space-y-4">
          <label htmlFor="current-password" className="sr-only">Mot de passe actuel</label>
          <input
            id="current-password"
            type="password"
            placeholder="Mot de passe actuel"
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
          />
          <label htmlFor="new-password" className="sr-only">Nouveau mot de passe</label>
          <input
            id="new-password"
            type="password"
            placeholder="Nouveau mot de passe"
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
          />
          <label htmlFor="confirm-password" className="sr-only">Confirmer le nouveau mot de passe</label>
          <input
            id="confirm-password"
            type="password"
            placeholder="Confirmer le nouveau mot de passe"
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
        <button className="mt-6 px-6 py-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-400 hover:text-amber-300 font-semibold transition-colors">
          Mettre à jour le mot de passe
        </button>
      </div>

      <div className="p-8 rounded-xl bg-slate-900 border border-slate-800">
        <h3 className="text-xl font-bold mb-4">Authentification à deux facteurs (2FA)</h3>
        <p className="text-slate-400 mb-6">
          Ajoutez une couche de sécurité supplémentaire avec la double authentification
        </p>
        <button className="px-6 py-3 rounded-lg bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-400 hover:text-green-300 font-semibold transition-colors">
          Activer la 2FA
        </button>
      </div>

      <div className="p-8 rounded-xl bg-slate-900 border border-slate-800">
        <h3 className="text-xl font-bold mb-4">Sessions actives</h3>
        <div className="space-y-3">
          <SessionCard
            device="Chrome sur Windows"
            location="Genève, Suisse"
            current={true}
          />
          <SessionCard
            device="Safari sur iPhone"
            location="Zurich, Suisse"
            current={false}
          />
        </div>
      </div>
    </div>
  );
}

function NotificationsTab() {
  return (
    <div className="space-y-6">
      <div className="p-8 rounded-xl bg-slate-900 border border-slate-800">
        <h3 className="text-xl font-bold mb-6">Notifications par email</h3>
        <div className="space-y-4">
          <ToggleOption
            label="Nouveaux risques critiques"
            description="Recevoir un email quand un risque critique est détecté"
            enabled={true}
          />
          <ToggleOption
            label="Décisions en attente"
            description="Rappel quotidien des décisions à valider"
            enabled={true}
          />
          <ToggleOption
            label="Rapports générés"
            description="Notification quand un rapport est prêt"
            enabled={false}
          />
          <ToggleOption
            label="Résumé hebdomadaire"
            description="Résumé du portefeuille tous les lundis"
            enabled={true}
          />
        </div>
      </div>

      <div className="p-8 rounded-xl bg-slate-900 border border-slate-800">
        <h3 className="text-xl font-bold mb-6">Notifications in-app</h3>
        <div className="space-y-4">
          <ToggleOption
            label="Mentions et commentaires"
            description="Quand quelqu'un vous mentionne ou commente"
            enabled={true}
          />
          <ToggleOption
            label="Changements de statut"
            description="Quand un projet change de statut"
            enabled={true}
          />
          <ToggleOption
            label="Alertes budget"
            description="Quand un budget dépasse le seuil défini"
            enabled={true}
          />
        </div>
      </div>
    </div>
  );
}

function FormField({ label, icon, value, readonly, onChange, placeholder }: { label: string; icon: React.ReactNode; value: string; readonly?: boolean; onChange?: (value: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-400 mb-2">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
          {icon}
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          readOnly={readonly}
          className={`w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500 ${
            readonly ? "cursor-not-allowed opacity-50" : ""
          }`}
        />
      </div>
    </div>
  );
}

function LanguageOption({ code, label, flag, selected, onClick }: { code: string; label: string; flag: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-lg border-2 transition-all ${
        selected
          ? "border-amber-500 bg-amber-500/10"
          : "border-slate-800 bg-slate-800 hover:border-slate-700"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-3xl">{flag}</span>
        <span className="font-semibold">{label}</span>
      </div>
    </button>
  );
}

function ThemeOption({ value, label, selected, onClick }: { value: string; label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-lg border-2 transition-all ${
        selected
          ? "border-amber-500 bg-amber-500/10"
          : "border-slate-800 bg-slate-800 hover:border-slate-700"
      }`}
    >
      <span className="font-semibold">{label}</span>
    </button>
  );
}

function ToggleOption({ label, description, enabled }: { label: string; description: string; enabled: boolean }) {
  return (
    <div className="flex items-start justify-between p-4 rounded-lg bg-slate-800">
      <div className="flex-1">
        <h4 className="font-semibold mb-1">{label}</h4>
        <p className="text-sm text-slate-400">{description}</p>
      </div>
      <button
        className={`w-12 h-6 rounded-full transition-colors ${
          enabled ? "bg-green-500" : "bg-slate-700"
        }`}
        aria-label={`Basculer ${label}`}
        title={`Basculer ${label}`}
      >
        <div
          className={`w-5 h-5 rounded-full bg-white transition-transform ${
            enabled ? "translate-x-6" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

function SessionCard({ device, location, current }: { device: string; location: string; current: boolean }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800 border border-slate-700">
      <div>
        <h4 className="font-semibold mb-1">{device}</h4>
        <p className="text-sm text-slate-400">{location}</p>
        {current && (
          <span className="inline-block mt-2 px-2 py-0.5 rounded text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
            Session actuelle
          </span>
        )}
      </div>
      {!current && (
        <button className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 hover:text-red-300 text-sm font-semibold transition-colors flex items-center gap-2">
          <LogOut size={14} />
          <span>Déconnecter</span>
        </button>
      )}
    </div>
  );
}
