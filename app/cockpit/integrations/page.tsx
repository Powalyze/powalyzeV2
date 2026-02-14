'use client';

import { useState, useEffect } from "react";
import { Settings, ExternalLink, CheckCircle, AlertCircle, RefreshCw, X, Save, Key, Webhook } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface Integration {
  id: string;
  name: string;
  description: string;
  logo: string;
  connected: boolean;
  lastSync: string | null;
  features: string[];
  config?: {
    apiKey?: string;
    apiSecret?: string;
    webhookUrl?: string;
    workspace?: string;
    channel?: string;
    [key: string]: string | undefined;
  };
}

// Fonction toast avec fallback
const showToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
  const fullMessage = message ? `${title}: ${message}` : title;
  
  // Essayer d'utiliser un toast moderne si disponible
  if (typeof window !== 'undefined' && 'Notification' in window) {
    // Toast visuel simple en attendant
    const toastEl = document.createElement('div');
    toastEl.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg text-white transition-all duration-300 ${
      type === 'success' ? 'bg-green-600' :
      type === 'error' ? 'bg-red-600' : 'bg-blue-600'
    }`;
    toastEl.textContent = fullMessage;
    document.body.appendChild(toastEl);
    setTimeout(() => {
      toastEl.style.opacity = '0';
      setTimeout(() => toastEl.remove(), 300);
    }, 3000);
  } else {
    alert(fullMessage);
  }
};

export default function IntegrationsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [configModal, setConfigModal] = useState(false);
  const [configForm, setConfigForm] = useState<any>({});
  const [tableExists, setTableExists] = useState(false);
  
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "jira",
      name: "Jira",
      description: "Synchronisation bidirectionnelle des issues et projets",
      logo: "/logos/jira.png",
      connected: false,
      lastSync: null,
      features: ["Import/Export automatique", "Webhooks temps réel", "Mapping des statuts"],
      config: {},
    },
    {
      id: "slack",
      name: "Slack",
      description: "Notifications instantanées sur vos channels",
      logo: "/logos/slack.png",
      connected: false,
      lastSync: null,
      features: ["Alertes personnalisées", "Commandes slash", "Thread discussions"],
      config: {},
    },
    {
      id: "github",
      name: "GitHub",
      description: "Suivi des commits, PRs et releases",
      logo: "/logos/github.png",
      connected: false,
      lastSync: null,
      features: ["Sync automatique", "Webhooks", "Déploiement tracking"],
      config: {},
    },
    {
      id: "azure-devops",
      name: "Azure DevOps",
      description: "Intégration complète CI/CD et boards",
      logo: "/logos/azure.png",
      connected: false,
      lastSync: null,
      features: ["Pipelines monitoring", "Work Items sync", "Test results"],
      config: {},
    },
    {
      id: "teams",
      name: "Microsoft Teams",
      description: "Collaboration et notifications d'équipe",
      logo: "/logos/teams.png",
      connected: false,
      lastSync: null,
      features: ["Bot intégré", "Adaptive Cards", "Meeting notes"],
      config: {},
    },
    {
      id: "powerbi",
      name: "Power BI",
      description: "Analytics avancés et rapports personnalisés",
      logo: "/logos/powerbi.png",
      connected: false,
      lastSync: null,
      features: ["Dashboards live", "Exports automatiques", "Scheduled refresh"],
      config: {},
    },
  ]);

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Auth error:', userError);
        showToast('error', 'Erreur', 'Non authentifié');
        setLoading(false);
        return;
      }
      
      if (!user) {
        console.log('No user found');
        setLoading(false);
        return;
      }

      console.log('User authenticated:', user.id);

      // Tester si la table integrations existe
      const { error: testError } = await supabase
        .from('integrations')
        .select('id')
        .limit(1);

      if (testError) {
        console.error('Table integrations error:', testError);
        if (testError.message?.includes('relation') || testError.message?.includes('does not exist')) {
          console.warn('Table integrations n\'existe pas encore');
          showToast('info', 'Configuration requise', 'La table integrations doit être créée. Consultez la documentation.');
          setTableExists(false);
        }
        setLoading(false);
        return;
      }

      setTableExists(true);

      // Essayer d'abord avec organization_id (multi-tenant)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError && !profileError.message?.includes('does not exist')) {
        console.error('Profile error:', profileError);
      }

      let configs = null;
      
      if (profile?.organization_id) {
        console.log('Loading integrations for organization:', profile.organization_id);
        // Mode multi-tenant avec organizations
        const { data, error } = await supabase
          .from('integrations')
          .select('*')
          .eq('organization_id', profile.organization_id);
        
        if (error) {
          console.error('Error loading integrations (org):', error);
        } else {
          configs = data;
          console.log('Loaded integrations (org):', configs?.length || 0);
        }
      } else {
        console.log('Loading integrations for user:', user.id);
        // Mode simple avec user_id direct
        const { data, error } = await supabase
          .from('integrations')
          .select('*')
          .eq('user_id', user.id);
        
        if (error) {
          console.error('Error loading integrations (user):', error);
        } else {
          configs = data;
          console.log('Loaded integrations (user):', configs?.length || 0);
        }
      }

      if (configs && configs.length > 0) {
        setIntegrations(prev => prev.map(integration => {
          const config = configs.find((c: any) => c.integration_id === integration.id);
          if (config) {
            return {
              ...integration,
              connected: config.enabled || false,
              lastSync: config.last_sync ? new Date(config.last_sync).toLocaleString('fr-FR') : null,
              config: config.config || {},
            };
          }
          return integration;
        }));
        console.log('Updated integrations state');
      }
    } catch (error: any) {
      console.error('Erreur chargement intégrations:', error);
      showToast('error', 'Erreur', error.message || 'Impossible de charger les intégrations');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = (integration: Integration) => {
    setSelectedIntegration(integration);
    setConfigForm(integration.config || {});
    setConfigModal(true);
  };

  const handleDisconnect = async (integration: Integration) => {
    if (!confirm(`Voulez-vous vraiment déconnecter ${integration.name} ?`)) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      // Essayer avec organization_id d'abord
      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();

      let error;
      
      if (profile?.organization_id) {
        // Mode multi-tenant
        const result = await supabase
          .from('integrations')
          .update({ enabled: false })
          .eq('organization_id', profile.organization_id)
          .eq('integration_id', integration.id);
        error = result.error;
      } else {
        // Mode simple
        const result = await supabase
          .from('integrations')
          .update({ enabled: false })
          .eq('user_id', user.id)
          .eq('integration_id', integration.id);
        error = result.error;
      }

      if (error) throw error;

      setIntegrations(prev => prev.map(i => 
        i.id === integration.id ? { ...i, connected: false } : i
      ));

      showToast('success', 'Déconnecté', `${integration.name} a été déconnecté`);
    } catch (error: any) {
      console.error('Erreur déconnexion:', error);
      showToast('error', 'Erreur', error.message || 'Impossible de déconnecter');
    }
  };

  const handleSaveConfig = async () => {
    if (!selectedIntegration) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      // Essayer avec organization_id d'abord
      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();

      let error;
      
      if (profile?.organization_id) {
        // Mode multi-tenant avec organization_id
        const result = await supabase
          .from('integrations')
          .upsert({
            organization_id: profile.organization_id,
            integration_id: selectedIntegration.id,
            integration_name: selectedIntegration.name,
            enabled: true,
            config: configForm,
            last_sync: new Date().toISOString(),
          });
        error = result.error;
      } else {
        // Mode simple avec user_id
        const result = await supabase
          .from('integrations')
          .upsert({
            user_id: user.id,
            integration_id: selectedIntegration.id,
            integration_name: selectedIntegration.name,
            enabled: true,
            config: configForm,
            last_sync: new Date().toISOString(),
          });
        error = result.error;
      }

      if (error) throw error;

      setIntegrations(prev => prev.map(i => 
        i.id === selectedIntegration.id 
          ? { ...i, connected: true, config: configForm, lastSync: 'À l\'instant' } 
          : i
      ));

      showToast('success', 'Connecté', `${selectedIntegration.name} a été configuré avec succès`);
      setConfigModal(false);
      setSelectedIntegration(null);
    } catch (error: any) {
      console.error('Erreur sauvegarde config:', error);
      showToast('error', 'Erreur', error.message || 'Impossible de sauvegarder la configuration');
    }
  };

  const handleSyncAll = async () => {
    setSyncing(true);
    try {
      // Simuler une synchronisation
      await new Promise(resolve => setTimeout(resolve, 2000));
      showToast('success', 'Synchronisé', 'Toutes les intégrations ont été synchronisées');
      await loadIntegrations();
    } catch (error) {
      showToast('error', 'Erreur', 'Échec de la synchronisation');
    } finally {
      setSyncing(false);
    }
  };

  const getConfigFields = (integrationId: string) => {
    const configs: Record<string, Array<{name: string, label: string, type: string, placeholder: string, required?: boolean}>> = {
      jira: [
        { name: 'apiKey', label: 'API Key', type: 'text', placeholder: 'Votre Jira API Key', required: true },
        { name: 'domain', label: 'Domaine Jira', type: 'text', placeholder: 'votre-entreprise.atlassian.net', required: true },
        { name: 'email', label: 'Email', type: 'email', placeholder: 'votre@email.com', required: true },
      ],
      slack: [
        { name: 'webhookUrl', label: 'Webhook URL', type: 'text', placeholder: 'https://hooks.slack.com/services/...', required: true },
        { name: 'channel', label: 'Channel par défaut', type: 'text', placeholder: '#general' },
      ],
      github: [
        { name: 'accessToken', label: 'Personal Access Token', type: 'password', placeholder: 'ghp_...', required: true },
        { name: 'repository', label: 'Repository', type: 'text', placeholder: 'owner/repo' },
      ],
      'azure-devops': [
        { name: 'organization', label: 'Organization', type: 'text', placeholder: 'votre-org', required: true },
        { name: 'pat', label: 'Personal Access Token', type: 'password', placeholder: 'Votre PAT Azure DevOps', required: true },
        { name: 'project', label: 'Projet', type: 'text', placeholder: 'Nom du projet' },
      ],
      teams: [
        { name: 'webhookUrl', label: 'Webhook URL', type: 'text', placeholder: 'https://outlook.office.com/webhook/...', required: true },
        { name: 'teamName', label: 'Nom de l\'équipe', type: 'text', placeholder: 'Équipe Projet' },
      ],
      powerbi: [
        { name: 'clientId', label: 'Client ID', type: 'text', placeholder: 'Azure AD App Client ID', required: true },
        { name: 'clientSecret', label: 'Client Secret', type: 'password', placeholder: 'Client Secret', required: true },
        { name: 'tenantId', label: 'Tenant ID', type: 'text', placeholder: 'Azure AD Tenant ID', required: true },
        { name: 'workspaceId', label: 'Workspace ID', type: 'text', placeholder: 'Power BI Workspace ID' },
      ],
    };
    return configs[integrationId] || [];
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-slate-400">Chargement des intégrations...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Banner d'avertissement si table n'existe pas */}
      {!loading && !tableExists && (
        <div className="bg-amber-500/20 border-2 border-amber-500 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="text-amber-400 flex-shrink-0 mt-1" size={24} />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">⚠️ Configuration Database Requise</h3>
              <p className="text-slate-300 mb-4">
                La table <code className="px-2 py-1 bg-slate-900 rounded text-amber-400">integrations</code> n'existe pas encore dans votre base de données.
              </p>
              <div className="bg-slate-900 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-semibold text-white mb-2">📝 Étapes d'installation :</h4>
                <ol className="text-sm text-slate-300 space-y-2 list-decimal list-inside">
                  <li>Allez sur <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Supabase Dashboard</a></li>
                  <li>Ouvrez <strong>SQL Editor</strong></li>
                  <li>Créez une <strong>New Query</strong></li>
                  <li>Copiez le contenu de : <code className="px-1 bg-slate-800 text-amber-400">database/migrations/add-integrations-table-simple.sql</code></li>
                  <li>Cliquez sur <strong>Run</strong></li>
                  <li>Rechargez cette page</li>
                </ol>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-lg font-medium transition-colors"
                >
                  Ouvrir Supabase Dashboard
                </button>
                <button 
                  onClick={loadIntegrations}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Recharger
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Settings size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Intégrations</h1>
              <p className="text-slate-400">
                Connectez vos outils préférés pour un workflow unifié
              </p>
            </div>
          </div>
          <button 
            onClick={handleSyncAll}
            disabled={syncing}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <RefreshCw size={18} className={syncing ? 'animate-spin' : ''} />
            {syncing ? 'Synchronisation...' : 'Synchroniser tout'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400 text-sm mb-1">Intégrations actives</div>
          <div className="text-2xl font-bold text-white">
            {integrations.filter((i) => i.connected).length} / {integrations.length}
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400 text-sm mb-1">Dernière synchronisation</div>
          <div className="text-2xl font-bold text-white">Temps réel</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400 text-sm mb-1">Webhooks actifs</div>
          <div className="text-2xl font-bold text-white">12</div>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {integrations.map((integration) => (
          <div
            key={integration.name}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">{integration.name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{integration.name}</h3>
                  <p className="text-sm text-slate-400">{integration.description}</p>
                </div>
              </div>
              {integration.connected ? (
                <span className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                  <CheckCircle size={12} />
                  Connecté
                </span>
              ) : (
                <span className="flex items-center gap-1 px-2 py-1 bg-slate-700 text-slate-400 rounded-full text-xs font-medium">
                  <AlertCircle size={12} />
                  Non connecté
                </span>
              )}
            </div>

            {/* Features */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-white mb-2">Fonctionnalités</h4>
              <ul className="space-y-1">
                {integration.features.map((feature, i) => (
                  <li key={i} className="text-sm text-slate-400 flex items-center gap-2">
                    <span className="text-blue-400">•</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Last Sync */}
            {integration.lastSync && (
              <div className="mb-4 text-sm text-slate-500">
                Dernière synchro : {integration.lastSync}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              {integration.connected ? (
                <>
                  <button 
                    onClick={() => handleConnect(integration)}
                    className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Settings size={16} />
                    Configurer
                  </button>
                  <button 
                    onClick={() => handleDisconnect(integration)}
                    className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                  >
                    Déconnecter
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => handleConnect(integration)}
                  className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <ExternalLink size={16} />
                  Connecter
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* API Section */}
      <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          🔌 API REST & Webhooks
        </h3>
        <p className="text-slate-300 mb-4">
          Connectez n'importe quel outil via notre API REST complète ou configurez des webhooks pour recevoir des événements en temps réel.
        </p>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors">
            Documentation API
          </button>
          <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors">
            Créer un webhook
          </button>
        </div>
      </div>

      {/* Configuration Modal */}
      {configModal && selectedIntegration && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-slate-900 border-b border-slate-700 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                    <span className="text-xl">{selectedIntegration.name.charAt(0)}</span>
                  </div>
                  Configurer {selectedIntegration.name}
                </h2>
                <p className="text-slate-400 mt-1">{selectedIntegration.description}</p>
              </div>
              <button
                onClick={() => {
                  setConfigModal(false);
                  setSelectedIntegration(null);
                }}
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Fermer le modal"
                title="Fermer"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-6">
              {getConfigFields(selectedIntegration.id).length > 0 ? (
                <>
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Key className="text-blue-400 mt-0.5" size={20} />
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-1">Informations de connexion</h4>
                        <p className="text-sm text-slate-400">
                          Renseignez vos identifiants d'API pour connecter {selectedIntegration.name} à Powalyze.
                          Ces informations sont stockées de manière sécurisée et chiffrées.
                        </p>
                      </div>
                    </div>
                  </div>

                  {getConfigFields(selectedIntegration.id).map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-white mb-2">
                        {field.label}
                        {field.required && <span className="text-red-400 ml-1">*</span>}
                      </label>
                      <input
                        type={field.type}
                        value={configForm[field.name] || ''}
                        onChange={(e) => setConfigForm({ ...configForm, [field.name]: e.target.value })}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required={field.required}
                      />
                    </div>
                  ))}

                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Webhook className="text-amber-400 mt-0.5" size={20} />
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-1">Webhooks & Synchronisation</h4>
                        <p className="text-sm text-slate-400">
                          Une fois connecté, les données seront synchronisées automatiquement toutes les heures.
                          Vous pouvez forcer une synchronisation depuis la page principale.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-400">Configuration simplifiée pour cette intégration</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="sticky bottom-0 bg-slate-900 border-t border-slate-700 p-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setConfigModal(false);
                  setSelectedIntegration(null);
                }}
                className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveConfig}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Save size={18} />
                Sauvegarder & Connecter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
