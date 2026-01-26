"use client";

import React, { useState } from "react";
import { UserPlus, Mail, Trash2, Shield, CheckCircle, Clock, X, Key } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  status: "active" | "pending" | "suspended";
  createdDate: string;
  lastLogin?: string;
  role: "client" | "admin";
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([
    { id: "1", name: "Sophie Martin", email: "sophie@acme.com", company: "ACME Corp", phone: "+33 6 12 34 56 78", status: "active", createdDate: "2026-01-10", lastLogin: "2026-01-16", role: "client" },
    { id: "2", name: "Thomas Dubois", email: "thomas@techstart.io", company: "TechStart", phone: "+33 6 98 76 54 32", status: "active", createdDate: "2026-01-12", lastLogin: "2026-01-15", role: "client" },
    { id: "3", name: "Marie Laurent", email: "marie@innovcorp.fr", company: "InnovCorp", phone: "+33 7 11 22 33 44", status: "pending", createdDate: "2026-01-15", role: "client" },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    role: "client" as "client" | "admin",
  });

  const handleAddClient = () => {
    if (!newClient.name || !newClient.email || !newClient.company) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const tempPassword = `Powalyze${Math.floor(Math.random() * 10000)}!`;
    
    const client: Client = {
      id: Date.now().toString(),
      ...newClient,
      status: "pending",
      createdDate: new Date().toISOString().split('T')[0],
    };

    setClients([...clients, client]);
    
    // Simulation d'envoi d'email
    alert(`✅ Client ajouté avec succès !\n\n📧 Email envoyé à ${newClient.email}\n\nContenu de l'email :\n━━━━━━━━━━━━━━━━━━━\nBonjour ${newClient.name},\n\nVotre compte Powalyze a été créé avec succès.\n\n🔐 Identifiants de connexion :\nEmail: ${newClient.email}\nMot de passe temporaire: ${tempPassword}\n\n⚠️ IMPORTANT : Vous devrez changer votre mot de passe lors de votre première connexion.\n\n🔗 Accédez au cockpit : https://www.powalyze.com/login\n\nCordialement,\nL'équipe Powalyze`);
    
    setNewClient({ name: "", email: "", company: "", phone: "", role: "client" });
    setShowAddModal(false);
  };

  const handleDeleteClient = (id: string) => {
    const client = clients.find(c => c.id === id);
    if (confirm(`Êtes-vous sûr de vouloir supprimer le client "${client?.name}" ?\n\nCette action est irréversible.`)) {
      setClients(clients.filter(c => c.id !== id));
      alert(`✅ Client "${client?.name}" supprimé avec succès.`);
    }
  };

  const handleSuspendClient = (id: string) => {
    setClients(clients.map(c => 
      c.id === id 
        ? { ...c, status: c.status === "suspended" ? "active" : "suspended" as "active" | "pending" | "suspended" }
        : c
    ));
  };

  const handleResendCredentials = (client: Client) => {
    const tempPassword = `Powalyze${Math.floor(Math.random() * 10000)}!`;
    alert(`📧 Email de rappel envoyé à ${client.email}\n\nNouveau mot de passe temporaire: ${tempPassword}\n\nLe client devra changer ce mot de passe à la première connexion.`);
  };

  const stats = {
    total: clients.length,
    active: clients.filter(c => c.status === "active").length,
    pending: clients.filter(c => c.status === "pending").length,
    suspended: clients.filter(c => c.status === "suspended").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Gestion des Clients</h1>
            <p className="text-slate-400">Tableau de bord administrateur - Gérez les accès au Cockpit Powalyze</p>
          </div>
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            <UserPlus size={20} />
            Ajouter un client
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-white">{stats.total}</div>
                  <div className="text-sm text-slate-400">Clients total</div>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-xl">
                  <Shield className="text-blue-400" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-emerald-400">{stats.active}</div>
                  <div className="text-sm text-slate-400">Actifs</div>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-xl">
                  <CheckCircle className="text-emerald-400" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-amber-400">{stats.pending}</div>
                  <div className="text-sm text-slate-400">En attente</div>
                </div>
                <div className="p-3 bg-amber-500/10 rounded-xl">
                  <Clock className="text-amber-400" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-red-400">{stats.suspended}</div>
                  <div className="text-sm text-slate-400">Suspendus</div>
                </div>
                <div className="p-3 bg-red-500/10 rounded-xl">
                  <X className="text-red-400" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Clients List */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-white mb-6">Liste des clients ({clients.length})</h2>
            <div className="space-y-4">
              {clients.map(client => (
                <div key={client.id} className="bg-slate-800/30 rounded-xl p-6 border border-slate-800 hover:border-slate-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 flex-1">
                      {/* Avatar */}
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                        {client.name.split(' ').map(n => n[0]).join('')}
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-white">{client.name}</h3>
                          <Badge variant={
                            client.status === 'active' ? 'success' :
                            client.status === 'pending' ? 'warning' :
                            'danger'
                          }>
                            {client.status === 'active' ? 'Actif' :
                             client.status === 'pending' ? 'En attente' :
                             'Suspendu'}
                          </Badge>
                          {client.role === 'admin' && (
                            <Badge variant="danger">
                              <Shield size={14} />
                              Admin
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
                          <div className="flex items-center gap-2 text-slate-400">
                            <Mail size={14} />
                            {client.email}
                          </div>
                          <div className="text-slate-400">
                            🏢 {client.company}
                          </div>
                          <div className="text-slate-400">
                            📱 {client.phone}
                          </div>
                          <div className="text-slate-400">
                            📅 Créé le {new Date(client.createdDate).toLocaleDateString('fr-FR')}
                          </div>
                          {client.lastLogin && (
                            <div className="text-slate-400">
                              🔑 Dernière connexion: {new Date(client.lastLogin).toLocaleDateString('fr-FR')}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleResendCredentials(client)}
                          title="Renvoyer les identifiants"
                        >
                          <Key size={16} />
                        </Button>
                        <Button
                          variant={client.status === "suspended" ? "primary" : "outline"}
                          size="sm"
                          onClick={() => handleSuspendClient(client.id)}
                          title={client.status === "suspended" ? "Réactiver" : "Suspendre"}
                        >
                          {client.status === "suspended" ? <CheckCircle size={16} /> : <X size={16} />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClient(client.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-800">
            <div className="border-b border-slate-800 p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">Ajouter un client</h2>
                <p className="text-slate-400 text-sm">Le client recevra ses identifiants par email</p>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                title="Fermer"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-2">Nom complet *</label>
                <input
                  type="text"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                  placeholder="Jean Dupont"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-2">Email *</label>
                <input
                  type="email"
                  value={newClient.email}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                  placeholder="jean.dupont@entreprise.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-2">Entreprise *</label>
                <input
                  type="text"
                  value={newClient.company}
                  onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                  placeholder="ACME Corp"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-2">Téléphone</label>
                <input
                  type="tel"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                  placeholder="+33 6 12 34 56 78"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-2">Rôle</label>
                <select
                  value={newClient.role}
                  onChange={(e) => setNewClient({ ...newClient, role: e.target.value as "client" | "admin" })}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                  title="Sélectionnez un rôle"
                >
                  <option value="client">Client - Accès Cockpit</option>
                  <option value="admin">Admin - Accès complet</option>
                </select>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <div className="flex gap-3">
                  <Mail className="text-blue-400 flex-shrink-0" size={20} />
                  <div className="text-sm text-blue-300">
                    Un email sera automatiquement envoyé au client avec un mot de passe temporaire. 
                    Il devra le changer lors de sa première connexion.
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowAddModal(false)}
                >
                  Annuler
                </Button>
                <Button 
                  variant="primary" 
                  className="flex-1"
                  onClick={handleAddClient}
                >
                  <UserPlus size={18} />
                  Ajouter le client
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

