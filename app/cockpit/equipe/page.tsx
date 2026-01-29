'use client';

import { CockpitShell } from '@/components/cockpit/CockpitShell';
import { useState, useEffect } from 'react';
import { UserPlus, Mail, Shield, Users, Send, CheckCircle, Clock, XCircle, RefreshCw } from 'lucide-react';
import { getTeamMembers, getAllInvitations, inviteMember, cancelInvitation, resendInvitation } from '@/actions/team';
import { ToastProvider, useToast } from '@/components/ui/ToastProvider';

type RoleGlobal = 'super_admin' | 'admin' | 'chef_projet' | 'contributeur' | 'lecteur';

const ROLE_LABELS: Record<RoleGlobal, string> = {
  super_admin: 'Super Admin',
  admin: 'Administrateur',
  chef_projet: 'Chef de projet',
  contributeur: 'Contributeur',
  lecteur: 'Lecteur'
};

function EquipePageContent() {
  const { showToast } = useToast();
  const [members, setMembers] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'members' | 'invitations'>('members');
  const [showInviteModal, setShowInviteModal] = useState(false);

  const [inviteForm, setInviteForm] = useState({
    email: '',
    roleGlobal: 'contributeur' as RoleGlobal,
    message: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    const [membersResult, invitationsResult] = await Promise.all([
      getTeamMembers('default-org'),
      getAllInvitations()
    ]);

    if (membersResult.success) {
      setMembers(membersResult.data || []);
    }

    if (invitationsResult.success) {
      setInvitations(invitationsResult.data || []);
    }

    setLoading(false);
  };

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await inviteMember({
      ...inviteForm,
      organizationId: 'default-org'
    });

    if (result.success) {
      showToast('success', '📧 Invitation envoyée', `Un email a été envoyé à ${inviteForm.email}`);
      setShowInviteModal(false);
      setInviteForm({
        email: '',
        roleGlobal: 'contributeur',
        message: ''
      });
      fetchData();
    } else {
      showToast('error', 'Erreur', result.error || 'Impossible d\'envoyer l\'invitation');
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    const result = await cancelInvitation(invitationId);

    if (result.success) {
      showToast('success', '❌ Invitation annulée', '');
      fetchData();
    } else {
      showToast('error', 'Erreur', result.error || 'Impossible d\'annuler l\'invitation');
    }
  };

  const handleResendInvitation = async (invitationId: string) => {
    const result = await resendInvitation(invitationId);

    if (result.success) {
      showToast('success', '📧 Invitation renvoyée', '');
      fetchData();
    } else {
      showToast('error', 'Erreur', result.error || 'Impossible de renvoyer l\'invitation');
    }
  };

  return (
    <CockpitShell>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Gestion de l'équipe</h1>
              <p className="text-slate-400">Invitez et gérez les membres de votre organisation</p>
            </div>
            <button
              onClick={() => setShowInviteModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg shadow-green-500/20"
            >
              <UserPlus size={20} />
              Inviter un membre
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-slate-800">
          <button
            onClick={() => setActiveTab('members')}
            className={`px-4 py-3 font-semibold transition-colors border-b-2 ${
              activeTab === 'members'
                ? 'border-blue-500 text-white'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Users size={18} />
              Membres ({members.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab('invitations')}
            className={`px-4 py-3 font-semibold transition-colors border-b-2 ${
              activeTab === 'invitations'
                ? 'border-blue-500 text-white'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Mail size={18} />
              Invitations ({invitations.filter(inv => inv.status === 'pending').length})
            </div>
          </button>
        </div>

        {loading ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-400">Chargement...</p>
          </div>
        ) : activeTab === 'members' ? (
          /* Members List */
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950">
                  <th className="text-left p-4 font-semibold">Membre</th>
                  <th className="text-left p-4 font-semibold">Rôle</th>
                  <th className="text-left p-4 font-semibold">Projets</th>
                  <th className="text-left p-4 font-semibold">Ajouté le</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold">
                          {member.first_name?.[0]}{member.last_name?.[0]}
                        </div>
                        <div>
                          <div className="font-semibold">{member.first_name} {member.last_name}</div>
                          <div className="text-sm text-slate-400">{member.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-400">
                        {ROLE_LABELS[member.user_roles[0]?.role_global as RoleGlobal] || 'N/A'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-slate-400">
                        {member.project_members?.length || 0} projet(s)
                      </div>
                    </td>
                    <td className="p-4 text-slate-400">
                      {new Date(member.created_at).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Invitations List */
          <div className="space-y-4">
            {invitations.map((invitation) => (
              <div
                key={invitation.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      invitation.status === 'pending' ? 'bg-blue-500/20' :
                      invitation.status === 'accepted' ? 'bg-green-500/20' :
                      'bg-red-500/20'
                    }`}>
                      {invitation.status === 'pending' && <Clock size={24} className="text-blue-400" />}
                      {invitation.status === 'accepted' && <CheckCircle size={24} className="text-green-400" />}
                      {invitation.status === 'cancelled' && <XCircle size={24} className="text-red-400" />}
                      {invitation.status === 'expired' && <XCircle size={24} className="text-orange-400" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold text-lg">{invitation.email}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          invitation.status === 'pending' ? 'bg-blue-500/20 text-blue-400' :
                          invitation.status === 'accepted' ? 'bg-green-500/20 text-green-400' :
                          invitation.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                          'bg-orange-500/20 text-orange-400'
                        }`}>
                          {invitation.status === 'pending' && 'En attente'}
                          {invitation.status === 'accepted' && 'Acceptée'}
                          {invitation.status === 'cancelled' && 'Annulée'}
                          {invitation.status === 'expired' && 'Expirée'}
                        </span>
                      </div>
                      <div className="text-sm text-slate-400 space-y-1">
                        <div>Rôle: {ROLE_LABELS[invitation.role_global as RoleGlobal]}</div>
                        {invitation.projects && (
                          <div>Projet: {invitation.projects.name}</div>
                        )}
                        <div>Invité le: {new Date(invitation.created_at).toLocaleDateString('fr-FR')}</div>
                        {invitation.message && (
                          <div className="mt-2 text-slate-300">Message: "{invitation.message}"</div>
                        )}
                      </div>
                    </div>
                  </div>
                  {invitation.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleResendInvitation(invitation.id)}
                        className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-blue-400"
                        title="Renvoyer l'invitation"
                      >
                        <RefreshCw size={18} />
                      </button>
                      <button
                        onClick={() => handleCancelInvitation(invitation.id)}
                        className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-red-400"
                        title="Annuler l'invitation"
                      >
                        <XCircle size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {invitations.length === 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
                <Mail size={48} className="mx-auto mb-4 text-slate-600" />
                <p className="text-slate-400">Aucune invitation envoyée</p>
              </div>
            )}
          </div>
        )}

        {/* Modal: Invite Member */}
        {showInviteModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowInviteModal(false)}>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-2xl font-bold mb-4">Inviter un membre</h2>
              <form onSubmit={handleInviteMember} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                    placeholder="membre@example.com"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Rôle global</label>
                  <select
                    value={inviteForm.roleGlobal}
                    onChange={(e) => setInviteForm({ ...inviteForm, roleGlobal: e.target.value as RoleGlobal })}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {Object.entries(ROLE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message personnalisé (optionnel)</label>
                  <textarea
                    value={inviteForm.message}
                    onChange={(e) => setInviteForm({ ...inviteForm, message: e.target.value })}
                    rows={3}
                    placeholder="Bienvenue dans notre équipe !"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
                  >
                    <Send size={18} />
                    Envoyer l'invitation
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

export default function EquipePage() {
  return (
    <ToastProvider>
      <EquipePageContent />
    </ToastProvider>
  );
}
