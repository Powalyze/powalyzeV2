'use client';

import { Suspense, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Link2, CheckCircle, AlertCircle } from 'lucide-react';

/**
 * Page Intégrations Agile
 * Connexion Jira / Azure DevOps
 */
export default function IntegrationsAgilePage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <IntegrationsAgileContent />
    </Suspense>
  );
}

interface Integration {
  id: string;
  name: string;
  logo: string;
  status: 'connected' | 'disconnected';
  description: string;
  features: string[];
}

function IntegrationsAgileContent() {
  const [loading, setLoading] = useState(true);
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'jira',
      name: 'Jira',
      logo: '🔷',
      status: 'disconnected',
      description: 'Synchronisation automatique des stories, epics, bugs et sprints',
      features: ['Stories bidirectionnelles', 'Epics & Bugs', 'Statuts temps réel', 'Webhooks'],
    },
    {
      id: 'azure-devops',
      name: 'Azure DevOps',
      logo: '🔵',
      status: 'disconnected',
      description: 'Import des work items, sprints, et boards Azure DevOps',
      features: ['Work Items', 'Sprints & Boards', 'Pull Requests', 'Pipelines CI/CD'],
    },
  ]);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    setLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('Non connecté');

      // Récupérer le profil
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('plan, pro_active')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      setIsDemo(profile.plan === 'demo' || !profile.pro_active);

      // TODO: Charger les intégrations depuis la DB
      // const { data: integrationsData } = await supabase.from('agile_integrations').select('*');
    } catch (err: any) {
      console.error('Erreur chargement:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (integrationId: string) => {
    if (isDemo) {
      alert('Les intégrations sont disponibles uniquement en mode Pro.');
      return;
    }

    // Simuler OAuth redirect
    if (integrationId === 'jira') {
      alert('Redirection vers Jira OAuth... (À implémenter)');
      // window.location.href = '/api/integrations/jira/oauth';
    } else if (integrationId === 'azure-devops') {
      alert('Redirection vers Azure DevOps OAuth... (À implémenter)');
      // window.location.href = '/api/integrations/azure-devops/oauth';
    }
  };

  const handleDisconnect = async (integrationId: string) => {
    if (confirm('Déconnecter cette intégration ?')) {
      // TODO: Appel API pour disconnect
      alert('Déconnexion... (À implémenter)');
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-[#0A0F1C] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Link2 className="w-8 h-8 text-[#D4AF37]" />
            Intégrations Agile
          </h1>
          <p className="text-slate-400">Connectez Jira, Azure DevOps et synchronisez automatiquement vos données</p>
        </div>

        {/* Demo badge */}
        {isDemo && (
          <div className="mb-6 bg-blue-500/20 border border-blue-500/50 rounded-xl p-4">
            <p className="text-sm text-blue-300">
              <strong>Mode Demo :</strong> Les intégrations Jira et Azure DevOps sont réservées au mode Pro.
            </p>
          </div>
        )}

        {/* Integrations Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {integrations.map(integration => (
            <div
              key={integration.id}
              className="bg-[#1C1F26] rounded-2xl p-6 border border-slate-700"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{integration.logo}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{integration.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {integration.status === 'connected' ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-green-400">Connecté</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 text-slate-500" />
                          <span className="text-sm text-slate-500">Non connecté</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-400 mb-4">{integration.description}</p>

              <div className="mb-6">
                <div className="text-xs font-semibold text-slate-500 mb-2">Fonctionnalités :</div>
                <ul className="space-y-2">
                  {integration.features.map(feature => (
                    <li key={feature} className="text-sm text-slate-400 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3">
                {integration.status === 'disconnected' ? (
                  <button
                    onClick={() => handleConnect(integration.id)}
                    disabled={isDemo}
                    className="flex-1 px-4 py-2 bg-[#D4AF37] hover:bg-[#C4A037] text-[#0A0F1C] rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Connecter
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleDisconnect(integration.id)}
                      className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-semibold transition"
                    >
                      Déconnecter
                    </button>
                    <button className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition">
                      Configurer
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Synchronisation automatique */}
        <div className="bg-[#1C1F26] rounded-2xl p-6 border border-slate-700 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Synchronisation automatique</h2>
          <p className="text-sm text-slate-400 mb-4">
            Les données sont synchronisées automatiquement toutes les 5 minutes via Edge Functions.
          </p>
          <ul className="space-y-2">
            {['Stories & Epics', 'Bugs & Issues', 'Sprints & Statuts', 'Assignations & Commentaires'].map(item => (
              <li key={item} className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle className="w-4 h-4 text-green-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Pro CTA */}
        {isDemo && (
          <div className="bg-gradient-to-r from-[#D4AF37]/20 to-[#C4A037]/10 rounded-2xl p-6 border border-[#D4AF37]/30">
            <h3 className="text-xl font-semibold text-white mb-2">Intégrations Jira & Azure DevOps</h3>
            <p className="text-slate-300 mb-4">
              Synchronisez automatiquement vos stories, epics, bugs et sprints avec vos outils existants.
            </p>
            <button className="px-6 py-3 bg-[#D4AF37] hover:bg-[#C4A037] text-[#0A0F1C] rounded-lg font-semibold transition">
              Passer en Mode Pro
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center">
      <div className="text-white animate-pulse">Chargement des intégrations...</div>
    </div>
  );
}
