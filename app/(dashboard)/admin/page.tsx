"use client";

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import {
  Users, Shield, Settings, Crown, Mail, Phone, Calendar,
  UserPlus, Trash2, Edit, Check, X, Search, Filter
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Administrateur Principal',
      email: 'admin@powalyze.com',
      role: 'admin',
      status: 'active',
      createdAt: '2025-01-01',
      lastLogin: '2026-01-16'
    },
    {
      id: '2',
      name: 'Manager Projet',
      email: 'manager@powalyze.com',
      role: 'manager',
      status: 'active',
      createdAt: '2025-06-15',
      lastLogin: '2026-01-15'
    },
    {
      id: '3',
      name: 'Utilisateur Standard',
      email: 'user@powalyze.com',
      role: 'user',
      status: 'active',
      createdAt: '2025-12-01',
      lastLogin: '2026-01-14'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [editingUser, setEditingUser] = useState<string | null>(null);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'manager': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'user': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      setUsers(users.filter(u => u.id !== id));
      alert('Utilisateur supprimé avec succès');
    }
  };

  const handleToggleStatus = (id: string) => {
    setUsers(users.map(u => 
      u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
    ));
  };

  const handleChangeRole = (id: string, newRole: 'admin' | 'manager' | 'user') => {
    setUsers(users.map(u => 
      u.id === id ? { ...u, role: newRole } : u
    ));
    setEditingUser(null);
    alert(`Rôle modifié avec succès`);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <AppShell>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Administration</h1>
              <p className="text-gray-400">Gestion des utilisateurs et des droits</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-purple-500/20">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-purple-400" />
              <span className="text-3xl font-bold text-white">{users.length}</span>
            </div>
            <p className="text-gray-400">Total Utilisateurs</p>
          </div>
          
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-purple-500/20">
            <div className="flex items-center justify-between mb-2">
              <Crown className="w-8 h-8 text-yellow-400" />
              <span className="text-3xl font-bold text-white">
                {users.filter(u => u.role === 'admin').length}
              </span>
            </div>
            <p className="text-gray-400">Administrateurs</p>
          </div>
          
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-blue-500/20">
            <div className="flex items-center justify-between mb-2">
              <Shield className="w-8 h-8 text-blue-400" />
              <span className="text-3xl font-bold text-white">
                {users.filter(u => u.role === 'manager').length}
              </span>
            </div>
            <p className="text-gray-400">Managers</p>
          </div>
          
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-green-500/20">
            <div className="flex items-center justify-between mb-2">
              <Check className="w-8 h-8 text-green-400" />
              <span className="text-3xl font-bold text-white">
                {users.filter(u => u.status === 'active').length}
              </span>
            </div>
            <p className="text-gray-400">Actifs</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-slate-700 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
              >
                <option value="all">Tous les rôles</option>
                <option value="admin">Administrateurs</option>
                <option value="manager">Managers</option>
                <option value="user">Utilisateurs</option>
              </select>
            </div>
            
            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:scale-105 transition-all flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Nouvel Utilisateur
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Utilisateur</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Rôle</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Statut</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Créé le</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Dernière connexion</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id} className="border-b border-slate-700/50 hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-sm text-gray-400 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {editingUser === user.id ? (
                        <select
                          value={user.role}
                          onChange={(e) => handleChangeRole(user.id, e.target.value as any)}
                          className="px-3 py-1 bg-slate-900 border border-slate-600 rounded text-white text-sm"
                        >
                          <option value="admin">Admin</option>
                          <option value="manager">Manager</option>
                          <option value="user">User</option>
                        </select>
                      ) : (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                          {user.role === 'admin' ? 'Administrateur' : user.role === 'manager' ? 'Manager' : 'Utilisateur'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${
                          user.status === 'active' 
                            ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                            : 'bg-red-500/20 text-red-300 border-red-500/30'
                        }`}
                      >
                        {user.status === 'active' ? 'Actif' : 'Inactif'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {new Date(user.lastLogin).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingUser(editingUser === user.id ? null : user.id)}
                          className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors text-blue-400"
                          title="Modifier le rôle"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
