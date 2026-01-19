'use client';

import { useState, useEffect } from 'react';
import { getAllClients, generateClientCode } from '@/lib/clientCodes';
import type { ClientConfig } from '@/lib/clientCodes';

export default function AdminClientsPage() {
  const [clients, setClients] = useState<ClientConfig[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    code: '',
  });

  useEffect(() => {
    loadClients();
  }, []);

  function loadClients() {
    const allClients = getAllClients();
    setClients(allClients);
  }

  function handleGenerateCode() {
    const generated = generateClientCode(newClient.name);
    setNewClient({ ...newClient, code: generated });
  }

  function handleAddClient() {
    // Dans une vraie application, ceci ferait un appel API
    alert(`Pour ajouter le client "${newClient.name}" avec le code "${newClient.code}", 
ajoutez-le manuellement dans lib/clientCodes.ts ou implémentez une API Supabase.`);
    setShowAddForm(false);
    setNewClient({ name: '', code: '' });
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="46" stroke="#C9A227" strokeWidth="4" />
              <path d="M30 55 L50 25 L70 55 L50 75 Z" fill="#C9A227" />
            </svg>
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Powalyze</div>
              <div className="text-sm text-slate-300">Administration Clients</div>
            </div>
          </div>
          <a 
            href="/" 
            className="text-xs text-slate-400 hover:text-slate-300 transition"
          >
            ← Retour à l'accueil
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Title & Actions */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-100 mb-2">
                Gestion des Codes Clients
              </h1>
              <p className="text-slate-400">
                {clients.length} code{clients.length > 1 ? 's' : ''} client{clients.length > 1 ? 's' : ''} configuré{clients.length > 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-semibold rounded-xl transition text-sm"
            >
              {showAddForm ? 'Annuler' : '+ Nouveau Client'}
            </button>
          </div>

          {/* Add Form */}
          {showAddForm && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 mb-6">
              <h2 className="text-lg font-semibold text-slate-100 mb-4">Nouveau Client</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">
                    Nom du Client
                  </label>
                  <input
                    type="text"
                    value={newClient.name}
                    onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                    placeholder="ACME Corporation"
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400/50 transition text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">
                    Code Client
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newClient.code}
                      onChange={(e) => setNewClient({ ...newClient, code: e.target.value })}
                      placeholder="CLIENT-ACME"
                      className="flex-1 px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400/50 transition text-sm"
                    />
                    <button
                      onClick={handleGenerateCode}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition text-sm"
                    >
                      Générer
                    </button>
                  </div>
                </div>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
                <p className="text-xs text-blue-300">
                  💡 <strong>Note:</strong> Pour ajouter réellement ce client, vous devez l'ajouter manuellement dans <code className="bg-slate-950 px-1 py-0.5 rounded">lib/clientCodes.ts</code> ou implémenter une API avec Supabase.
                </p>
              </div>
              <button
                onClick={handleAddClient}
                disabled={!newClient.name || !newClient.code}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Voir les Instructions
              </button>
            </div>
          )}

          {/* Clients Table */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Nom
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Organisation ID
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Fonctionnalités
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Expiration
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client, index) => (
                    <tr 
                      key={client.code}
                      className={`border-b border-slate-800 hover:bg-slate-900/80 transition ${
                        index % 2 === 0 ? 'bg-slate-950/30' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm font-semibold text-amber-400">
                          {client.code}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-100">{client.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs text-slate-400">{client.organizationId}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          client.status === 'active' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          client.status === 'inactive' ? 'bg-slate-500/20 text-slate-300 border border-slate-500/30' :
                          'bg-red-500/20 text-red-300 border border-red-500/30'
                        }`}>
                          {client.status === 'active' ? '✓ Actif' :
                           client.status === 'inactive' ? '○ Inactif' :
                           '⚠ Suspendu'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          {client.features?.aiNarrative && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px]">
                              IA
                            </span>
                          )}
                          {client.features?.committeePrep && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px]">
                              Comité
                            </span>
                          )}
                          {client.features?.advancedReports && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px]">
                              Reports
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {client.expiresAt ? (
                          <span className="text-xs text-slate-400">
                            {new Date(client.expiresAt).toLocaleDateString('fr-FR')}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-500">Illimitée</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-slate-100 mb-4">
              📋 Comment Ajouter un Nouveau Client
            </h2>
            <div className="space-y-4 text-sm text-slate-300">
              <div>
                <h3 className="font-semibold text-amber-400 mb-2">Option 1: Fichier de Configuration (Simple)</h3>
                <ol className="list-decimal list-inside space-y-2 text-slate-400">
                  <li>Ouvrir <code className="bg-slate-950 px-2 py-1 rounded text-amber-300">lib/clientCodes.ts</code></li>
                  <li>Ajouter un nouveau client dans l'objet <code className="bg-slate-950 px-2 py-1 rounded">CLIENT_CODES</code></li>
                  <li>Redéployer l'application</li>
                </ol>
              </div>
              <div>
                <h3 className="font-semibold text-blue-400 mb-2">Option 2: Base de Données Supabase (Production)</h3>
                <ol className="list-decimal list-inside space-y-2 text-slate-400">
                  <li>Créer une table <code className="bg-slate-950 px-2 py-1 rounded">client_codes</code> dans Supabase</li>
                  <li>Créer une API pour gérer les codes (CRUD)</li>
                  <li>Mettre à jour cette interface pour utiliser l'API</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
