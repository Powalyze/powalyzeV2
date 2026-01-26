"use client";

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import {
  Plug, Check, X, Settings, Link as LinkIcon, ArrowRight,
  Github, Gitlab, Cloud, Database, Mail, Calendar, Slack,
  MessageSquare, FileText, Box, Zap
} from 'lucide-react';

interface Connector {
  id: string;
  name: string;
  description: string;
  icon: any;
  status: 'connected' | 'disconnected';
  category: 'dev' | 'cloud' | 'communication' | 'productivity';
  config?: {
    url?: string;
    apiKey?: string;
    username?: string;
  };
}

export default function ConnecteursPage() {
  const [connectors, setConnectors] = useState<Connector[]>([
    {
      id: '1',
      name: 'GitHub',
      description: 'Synchronisez vos repositories et issues',
      icon: Github,
      status: 'connected',
      category: 'dev',
      config: {
        username: 'powalyze'
      }
    },
    {
      id: '2',
      name: 'GitLab',
      description: 'Intégrez vos projets GitLab',
      icon: Gitlab,
      status: 'disconnected',
      category: 'dev'
    },
    {
      id: '3',
      name: 'Azure DevOps',
      description: 'Connectez vos boards et pipelines',
      icon: Cloud,
      status: 'connected',
      category: 'dev',
      config: {
        url: 'https://dev.azure.com/powalyze'
      }
    },
    {
      id: '4',
      name: 'Jira',
      description: 'Importez vos tickets et sprints',
      icon: Box,
      status: 'disconnected',
      category: 'productivity'
    },
    {
      id: '5',
      name: 'Slack',
      description: 'Recevez des notifications sur Slack',
      icon: Slack,
      status: 'connected',
      category: 'communication',
      config: {
        url: 'https://powalyze.slack.com'
      }
    },
    {
      id: '6',
      name: 'Microsoft Teams',
      description: 'Intégration avec Teams',
      icon: MessageSquare,
      status: 'disconnected',
      category: 'communication'
    },
    {
      id: '7',
      name: 'Google Calendar',
      description: 'Synchronisez vos jalons et deadlines',
      icon: Calendar,
      status: 'disconnected',
      category: 'productivity'
    },
    {
      id: '8',
      name: 'Power BI',
      description: 'Exportez vos données vers Power BI',
      icon: Database,
      status: 'connected',
      category: 'cloud',
      config: {
        url: 'https://app.powerbi.com/powalyze'
      }
    },
    {
      id: '9',
      name: 'SendGrid',
      description: 'Envoi d\'emails automatisés',
      icon: Mail,
      status: 'disconnected',
      category: 'communication'
    },
    {
      id: '10',
      name: 'Webhooks',
      description: 'Créez des webhooks personnalisés',
      icon: Zap,
      status: 'connected',
      category: 'dev',
      config: {
        url: 'https://api.powalyze.com/webhooks'
      }
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Tous', count: connectors.length },
    { id: 'dev', label: 'Développement', count: connectors.filter(c => c.category === 'dev').length },
    { id: 'cloud', label: 'Cloud & BI', count: connectors.filter(c => c.category === 'cloud').length },
    { id: 'communication', label: 'Communication', count: connectors.filter(c => c.category === 'communication').length },
    { id: 'productivity', label: 'Productivité', count: connectors.filter(c => c.category === 'productivity').length }
  ];

  const handleToggleConnection = (id: string) => {
    setConnectors(connectors.map(c => 
      c.id === id 
        ? { ...c, status: c.status === 'connected' ? 'disconnected' : 'connected' }
        : c
    ));
    
    const connector = connectors.find(c => c.id === id);
    if (connector) {
      alert(
        connector.status === 'connected' 
          ? `${connector.name} déconnecté` 
          : `${connector.name} connecté avec succès`
      );
    }
  };

  const filteredConnectors = selectedCategory === 'all' 
    ? connectors 
    : connectors.filter(c => c.category === selectedCategory);

  const connectedCount = connectors.filter(c => c.status === 'connected').length;

  return (
    <AppShell>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                <Plug className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Connecteurs</h1>
                <p className="text-gray-400">Intégrez vos outils favoris avec Powalyze</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 px-6 py-3 rounded-xl border border-green-500/20">
                <p className="text-sm text-gray-400">Connecteurs actifs</p>
                <p className="text-3xl font-bold text-green-400">{connectedCount}/{connectors.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Filter */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-slate-700 mb-6">
          <div className="flex flex-wrap gap-3">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                    : 'bg-slate-900 text-gray-400 hover:bg-slate-800 border border-slate-700'
                }`}
              >
                {cat.label}
                <span className="ml-2 px-2 py-0.5 bg-white/10 rounded-full text-xs">
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Connectors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConnectors.map(connector => {
            const Icon = connector.icon;
            return (
              <div
                key={connector.id}
                className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-slate-700 hover:border-green-500/30 transition-all hover:scale-105"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${
                    connector.status === 'connected'
                      ? 'bg-green-500/20 text-green-300 border-green-500/30'
                      : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                  }`}>
                    {connector.status === 'connected' ? (
                      <>
                        <Check className="w-3 h-3" />
                        Connecté
                      </>
                    ) : (
                      <>
                        <X className="w-3 h-3" />
                        Déconnecté
                      </>
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{connector.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{connector.description}</p>

                {connector.config && connector.status === 'connected' && (
                  <div className="mb-4 p-3 bg-slate-900/50 rounded-lg">
                    {connector.config.url && (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <LinkIcon className="w-4 h-4" />
                        <span className="truncate">{connector.config.url}</span>
                      </div>
                    )}
                    {connector.config.username && (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span>@{connector.config.username}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleConnection(connector.id)}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                      connector.status === 'connected'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30'
                        : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:scale-105'
                    }`}
                  >
                    {connector.status === 'connected' ? (
                      <>
                        <X className="w-4 h-4" />
                        Déconnecter
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Connecter
                      </>
                    )}
                  </button>
                  
                  {connector.status === 'connected' && (
                    <button
                      className="px-4 py-2 bg-slate-900 text-gray-400 rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors"
                      title="Configurer"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-6 rounded-xl border border-blue-500/20">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <ArrowRight className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-1">Besoin d'aide pour configurer un connecteur ?</h3>
              <p className="text-gray-400">Consultez notre documentation ou contactez le support technique</p>
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:scale-105 transition-all font-semibold">
              Documentation
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

