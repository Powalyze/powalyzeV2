'use client';

import { useState, useEffect } from 'react';
import { CockpitShell } from '@/components/cockpit/CockpitShell';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Users, Shield, Mail, Edit2, Save, X, Plus, Trash2, UserCog } from 'lucide-react';
import { BackButton } from '@/components/BackButton';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTranslations } from '@/lib/useTranslations';

interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'director' | 'manager' | 'analyst' | 'viewer';
  department: string;
  joinDate: string;
  status: 'active' | 'inactive';
}

const ROLES = [
  { value: 'director', label: 'Directeur', description: 'Accès complet et gestion des rôles', color: 'text-purple-500' },
  { value: 'manager', label: 'Manager', description: 'Gestion de projets et équipes', color: 'text-blue-500' },
  { value: 'analyst', label: 'Analyste', description: 'Analyse et rapports', color: 'text-green-500' },
  { value: 'viewer', label: 'Observateur', description: 'Lecture seule', color: 'text-gray-500' },
];

export default function TeamManagementPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string>('viewer');
  const { t } = useTranslations();

  const [newMember, setNewMember] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'viewer' as TeamMember['role'],
    department: '',
  });

  useEffect(() => {
    // Charger les données démo
    const demoMembers: TeamMember[] = [
      {
        id: '1',
        firstName: 'Marie',
        lastName: 'Dupont',
        email: 'marie.dupont@company.com',
        role: 'director',
        department: 'Direction',
        joinDate: '2024-01-15',
        status: 'active',
      },
      {
        id: '2',
        firstName: 'Jean',
        lastName: 'Martin',
        email: 'jean.martin@company.com',
        role: 'manager',
        department: 'IT',
        joinDate: '2024-02-20',
        status: 'active',
      },
      {
        id: '3',
        firstName: 'Sophie',
        lastName: 'Laurent',
        email: 'sophie.laurent@company.com',
        role: 'analyst',
        department: 'Finance',
        joinDate: '2024-03-10',
        status: 'active',
      },
      {
        id: '4',
        firstName: 'Pierre',
        lastName: 'Dubois',
        email: 'pierre.dubois@company.com',
        role: 'viewer',
        department: 'RH',
        joinDate: '2024-04-05',
        status: 'active',
      },
    ];

    // Vérifier le rôle de l'utilisateur connecté
    const userRole = localStorage.getItem('user_role') || 'director'; // Demo: toujours directeur
    setCurrentUserRole(userRole);
    setMembers(demoMembers);
    setLoading(false);
  }, []);

  const handleUpdateRole = (memberId: string, newRole: TeamMember['role']) => {
    if (currentUserRole !== 'director') {
      alert('⛔ Seul le directeur peut modifier les rôles');
      return;
    }

    setMembers(prev =>
      prev.map(member =>
        member.id === memberId ? { ...member, role: newRole } : member
      )
    );
    setEditingMember(null);
    alert('✅ Rôle mis à jour avec succès');
  };

  const handleAddMember = () => {
    if (!newMember.firstName || !newMember.lastName || !newMember.email) {
      alert('⚠️ Veuillez remplir tous les champs obligatoires');
      return;
    }

    const member: TeamMember = {
      id: String(members.length + 1),
      ...newMember,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active',
    };

    setMembers([...members, member]);
    setShowAddModal(false);
    setNewMember({
      firstName: '',
      lastName: '',
      email: '',
      role: 'viewer',
      department: '',
    });
    alert('✅ Membre ajouté avec succès');
  };

  const handleRemoveMember = (memberId: string) => {
    if (currentUserRole !== 'director') {
      alert('⛔ Seul le directeur peut supprimer des membres');
      return;
    }

    if (confirm('Êtes-vous sûr de vouloir retirer ce membre ?')) {
      setMembers(prev => prev.filter(m => m.id !== memberId));
      alert('✅ Membre retiré avec succès');
    }
  };

  const getRoleInfo = (role: string) => {
    return ROLES.find(r => r.value === role) || ROLES[3];
  };

  const stats = {
    total: members.length,
    directors: members.filter(m => m.role === 'director').length,
    managers: members.filter(m => m.role === 'manager').length,
    analysts: members.filter(m => m.role === 'analyst').length,
    viewers: members.filter(m => m.role === 'viewer').length,
  };

  if (currentUserRole !== 'director') {
    return (
      <CockpitShell>
        <div className="p-8 text-center">
          <Shield className="h-16 w-16 mx-auto mb-4 text-red-500" />
          <h2 className="text-2xl font-bold mb-2">Accès Restreint</h2>
          <p className="text-muted-foreground">
            Cette page est réservée aux directeurs uniquement.
          </p>
        </div>
      </CockpitShell>
    );
  }

  return (
    <CockpitShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <BackButton />
            <div className="flex items-center gap-4 mt-2">
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <UserCog className="h-8 w-8 text-purple-500" />
                Gestion des Rôles d'Équipe
              </h1>
              <LanguageSwitcher />
            </div>
            <p className="text-muted-foreground mt-2">
              Gérez les membres de votre équipe et attribuez les rôles appropriés
            </p>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un membre
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total membres</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-500">{stats.directors}</div>
              <div className="text-sm text-muted-foreground">Directeurs</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-500">{stats.managers}</div>
              <div className="text-sm text-muted-foreground">Managers</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-500">{stats.analysts}</div>
              <div className="text-sm text-muted-foreground">Analystes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-500">{stats.viewers}</div>
              <div className="text-sm text-muted-foreground">Observateurs</div>
            </CardContent>
          </Card>
        </div>

        {/* Info Card */}
        <Card className="border-l-4 border-l-amber-500 bg-amber-500/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Gestion des rôles - Réservé au Directeur</h3>
                <p className="text-sm text-muted-foreground">
                  Vous êtes le seul à pouvoir attribuer, modifier ou retirer les rôles des membres de l'équipe.
                  Les rôles déterminent les permissions d'accès et les fonctionnalités disponibles sur la plateforme.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Roles Legend */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4">Rôles disponibles</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {ROLES.map((role) => (
                <div key={role.value} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <Shield className={`h-5 w-5 ${role.color} mt-0.5`} />
                  <div>
                    <div className="font-semibold">{role.label}</div>
                    <div className="text-sm text-muted-foreground">{role.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Team Members List */}
        <div className="space-y-3">
          {loading ? (
            <Card>
              <CardContent className="p-8 text-center">
                {t.common?.loading || 'Chargement...'}
              </CardContent>
            </Card>
          ) : (
            members.map((member) => {
              const roleInfo = getRoleInfo(member.role);
              const isEditing = editingMember?.id === member.id;

              return (
                <Card key={member.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        {/* Avatar */}
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                          {member.firstName[0]}{member.lastName[0]}
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                          <div className="font-semibold text-lg">
                            {member.firstName} {member.lastName}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {member.email}
                            </div>
                            <div>•</div>
                            <div>{member.department}</div>
                            <div>•</div>
                            <div>Depuis {member.joinDate}</div>
                          </div>
                        </div>

                        {/* Role */}
                        <div className="flex items-center gap-3">
                          {isEditing ? (
                            <select
                              value={editingMember.role}
                              onChange={(e) =>
                                setEditingMember({
                                  ...editingMember,
                                  role: e.target.value as TeamMember['role'],
                                })
                              }
                              className="px-3 py-2 border rounded-lg"
                              aria-label="Sélectionner un rôle"
                            >
                              {ROLES.map((role) => (
                                <option key={role.value} value={role.value}>
                                  {role.label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <div className={`px-4 py-2 rounded-full ${roleInfo.color} bg-current bg-opacity-10 font-medium`}>
                              {roleInfo.label}
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          {isEditing ? (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleUpdateRole(member.id, editingMember.role)}
                                aria-label="Enregistrer"
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingMember(null)}
                                aria-label="Annuler"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingMember(member)}
                                aria-label="Modifier le rôle"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              {member.role !== 'director' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRemoveMember(member.id)}
                                  className="text-red-500 hover:text-red-600"
                                  aria-label="Retirer le membre"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Add Member Modal */}
        {showAddModal && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowAddModal(false)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <Card className="w-full max-w-2xl">
                <div className="border-b p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Ajouter un membre</h2>
                    <Button variant="ghost" size="sm" onClick={() => setShowAddModal(false)} aria-label="Fermer">
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium mb-2">Prénom *</label>
                      <input
                        id="firstName"
                        type="text"
                        value={newMember.firstName}
                        onChange={(e) => setNewMember({ ...newMember, firstName: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="Ex: Jean"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium mb-2">Nom *</label>
                      <input
                        id="lastName"
                        type="text"
                        value={newMember.lastName}
                        onChange={(e) => setNewMember({ ...newMember, lastName: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="Ex: Dupont"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">Email *</label>
                    <input
                      id="email"
                      type="email"
                      value={newMember.email}
                      onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="jean.dupont@company.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="department" className="block text-sm font-medium mb-2">Département</label>
                    <input
                      id="department"
                      type="text"
                      value={newMember.department}
                      onChange={(e) => setNewMember({ ...newMember, department: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Ex: IT"
                    />
                  </div>

                  <div>
                    <label htmlFor="role" className="block text-sm font-medium mb-2">Rôle *</label>
                    <select
                      id="role"
                      value={newMember.role}
                      onChange={(e) => setNewMember({ ...newMember, role: e.target.value as TeamMember['role'] })}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      {ROLES.map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label} - {role.description}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button onClick={handleAddMember} className="flex-1">
                      <Save className="h-4 w-4 mr-2" />
                      Ajouter
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">
                      Annuler
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </CockpitShell>
  );
}

