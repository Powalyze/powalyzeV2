"use client";

import { useState } from "react";
import { Users, Plus, Mail, Shield, Building2, X, Copy, Check } from "lucide-react";

interface NewUser {
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'client' | 'member';
  company: string;
}

export function AdminUserManagement() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [newUser, setNewUser] = useState<NewUser>({
    email: '',
    firstName: '',
    lastName: '',
    role: 'member',
    company: ''
  });

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    setTempPassword(null);

    try {
      const response = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création');
      }

      setSuccess(`Utilisateur ${newUser.email} créé avec succès !`);
      setTempPassword(data.temporaryPassword);
      
      // Réinitialiser le formulaire
      setNewUser({
        email: '',
        firstName: '',
        lastName: '',
        role: 'member',
        company: ''
      });

    } catch (err: any) {
      setError(err.message || 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }

  function copyPassword() {
    if (tempPassword) {
      navigator.clipboard.writeText(tempPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-8 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Users size={24} className="text-amber-400" />
            <h3 className="text-xl font-bold">Gestion des utilisateurs</h3>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-lg font-semibold transition-all"
          >
            <Plus size={18} />
            Nouveau utilisateur
          </button>
        </div>
        <p className="text-slate-400">
          Créez et gérez les accès utilisateurs. Les nouveaux utilisateurs reçoivent un mot de passe temporaire à changer lors de la première connexion.
        </p>
      </div>

      {/* Modal Création Utilisateur */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Créer un utilisateur</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setError(null);
                  setSuccess(null);
                  setTempPassword(null);
                }}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="text-green-400 font-semibold mb-2">{success}</p>
                {tempPassword && (
                  <div className="mt-4 p-3 bg-slate-800 rounded-lg border border-slate-700">
                    <p className="text-xs text-slate-400 mb-2">Mot de passe temporaire :</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-white font-mono bg-slate-950 px-3 py-2 rounded border border-slate-700">
                        {tempPassword}
                      </code>
                      <button
                        onClick={copyPassword}
                        className="p-2 bg-amber-500/20 hover:bg-amber-500/30 rounded border border-amber-500/50 transition-colors"
                        title="Copier"
                      >
                        {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} className="text-amber-400" />}
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      ⚠️ Communiquez ce mot de passe de manière sécurisée. L'utilisateur devra le changer à la première connexion.
                    </p>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    value={newUser.lastName}
                    onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                    placeholder="utilisateur@entreprise.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Société
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                  <input
                    type="text"
                    value={newUser.company}
                    onChange={(e) => setNewUser({ ...newUser, company: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                    placeholder="Nom de la société"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Rôle *
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as NewUser['role'] })}
                    className="w-full pl-11 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="member">Membre (Lecture seule)</option>
                    <option value="client">Client (Lecture/Écriture)</option>
                    <option value="admin">Administrateur (Tous droits)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setError(null);
                    setSuccess(null);
                    setTempPassword(null);
                  }}
                  className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg font-semibold transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Création...' : 'Créer l\'utilisateur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
