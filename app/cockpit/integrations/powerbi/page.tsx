'use client';

import { Suspense, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Key, Copy, Check, Download, ExternalLink, Shield, Zap, BarChart3, TrendingUp } from 'lucide-react';

/**
 * Page Intégration Power BI
 * Génération API Key + Tutoriel + Modèles .pbix
 */
export default function PowerBIIntegrationPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <PowerBIContent />
    </Suspense>
  );
}

interface ApiKey {
  id: string;
  name: string;
  last_4: string;
  created_at: string;
  expires_at: string;
  last_used_at: string | null;
}

interface PowerBIModel {
  id: string;
  name: string;
  description: string;
  file_url: string;
  category: string;
  is_pro_only: boolean;
}

function PowerBIContent() {
  const [loading, setLoading] = useState(true);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newToken, setNewToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [models, setModels] = useState<PowerBIModel[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('Non connecté');

      // Récupérer le profil
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('organization_id, plan, pro_active')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      setIsDemo(profile.plan === 'demo' || !profile.pro_active);

      // Récupérer les clés API existantes
      const { data: keysData, error: keysError } = await supabase
        .from('api_keys')
        .select('*')
        .eq('organization_id', profile.organization_id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (keysError) throw keysError;

      setApiKeys(keysData || []);

      // Récupérer les modèles Power BI
      const { data: modelsData, error: modelsError } = await supabase
        .from('powerbi_models')
        .select('*')
        .order('category', { ascending: true });

      if (modelsError) throw modelsError;

      setModels(modelsData || []);
    } catch (err: any) {
      console.error('Erreur chargement:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateToken = async () => {
    if (isDemo) {
      alert('La génération de clés API est disponible uniquement en mode Pro.');
      return;
    }

    try {
      const response = await fetch('/api/powerbi/generate-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Erreur génération token');

      const { token } = await response.json();
      setNewToken(token);
      loadData(); // Recharger la liste
    } catch (err: any) {
      alert(err.message || 'Erreur génération token');
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadModel = async (model: PowerBIModel) => {
    if (isDemo && model.is_pro_only) {
      alert('Ce modèle est réservé aux utilisateurs Pro.');
      return;
    }

    // Télécharger le fichier
    window.open(model.file_url, '_blank');
  };

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-[#0A0F1C] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-3 flex items-center gap-3">
            <BarChart3 className="w-10 h-10 text-[#D4AF37]" />
            Intégration Power BI
          </h1>
          <p className="text-lg text-slate-300">
            Connectez Powalyze à Power BI pour créer des dashboards exécutifs automatisés
          </p>
        </div>

        {/* Demo badge */}
        {isDemo && (
          <div className="mb-6 bg-blue-500/20 border border-blue-500/50 rounded-xl p-4">
            <p className="text-sm text-blue-300">
              <strong>Mode Demo :</strong> L'intégration Power BI complète est disponible en mode Pro uniquement.
            </p>
          </div>
        )}

        {/* Étape 1 : Générer clé API */}
        <div className="bg-[#1C1F26] rounded-2xl p-8 border border-slate-700 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-2 flex items-center gap-2">
                <Key className="w-6 h-6 text-[#D4AF37]" />
                1. Générer une clé API
              </h2>
              <p className="text-slate-400">Cette clé permet à Power BI d'accéder à vos données Powalyze</p>
            </div>
            {!isDemo && (
              <button
                onClick={handleGenerateToken}
                className="px-6 py-3 bg-[#D4AF37] hover:bg-[#C4A037] text-[#0A0F1C] rounded-lg font-semibold transition flex items-center gap-2"
              >
                <Key className="w-4 h-4" />
                Générer une nouvelle clé
              </button>
            )}
          </div>

          {/* Nouvelle clé générée */}
          {newToken && (
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/10 border border-green-500/50 rounded-xl p-6 mb-6">
              <div className="flex items-start justify-between mb-3">
                <Shield className="w-6 h-6 text-green-400" />
                <button
                  onClick={() => handleCopy(newToken)}
                  className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded transition text-sm flex items-center gap-2"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copié' : 'Copier'}
                </button>
              </div>
              <p className="text-sm text-white font-mono bg-black/30 p-4 rounded-lg mb-3 break-all">{newToken}</p>
              <p className="text-xs text-amber-300">
                ⚠️ Sauvegardez cette clé maintenant. Elle ne sera plus affichée.
              </p>
            </div>
          )}

          {/* Liste des clés existantes */}
          {apiKeys.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-300 mb-3">Clés actives</h3>
              <div className="space-y-2">
                {apiKeys.map(key => (
                  <div
                    key={key.id}
                    className="bg-[#0A0F1C] rounded-lg p-4 border border-slate-700 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-sm font-medium text-white">{key.name}</div>
                      <div className="text-xs text-slate-500 mt-1">
                        ****{key.last_4} • Créé le {new Date(key.created_at).toLocaleDateString('fr-FR')}
                        {key.last_used_at && ` • Dernière utilisation : ${new Date(key.last_used_at).toLocaleDateString('fr-FR')}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Étape 2 : Configurer Power BI */}
        <div className="bg-[#1C1F26] rounded-2xl p-8 border border-slate-700 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-[#D4AF37]" />
            2. Configurer Power BI Desktop
          </h2>

          <div className="space-y-6">
            {/* Étape 2.1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center text-[#0A0F1C] font-bold">
                1
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Obtenir les données → Web</h3>
                <p className="text-slate-400 mb-3">Dans Power BI Desktop, cliquez sur "Obtenir les données" puis "Web"</p>
              </div>
            </div>

            {/* Étape 2.2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center text-[#0A0F1C] font-bold">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">Entrer l'URL de l'API</h3>
                <div className="bg-[#0A0F1C] rounded-lg p-4 border border-slate-700 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <code className="text-sm text-green-400">https://api.powalyze.com/v1/projects</code>
                    <button
                      onClick={() => handleCopy('https://api.powalyze.com/v1/projects')}
                      className="p-1 hover:bg-slate-700 rounded transition"
                      title="Copier l'URL"
                    >
                      <Copy className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-500">Autres endpoints disponibles : /risks, /decisions, /reports</p>
              </div>
            </div>

            {/* Étape 2.3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center text-[#0A0F1C] font-bold">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">Authentification</h3>
                <p className="text-slate-400 mb-3">Choisir "Clé API" puis coller votre token dans le header Authorization</p>
                <div className="bg-[#0A0F1C] rounded-lg p-4 border border-slate-700">
                  <code className="text-sm text-slate-300">Authorization: Bearer [VOTRE_TOKEN]</code>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Étape 3 : Modèles pré-construits */}
        <div className="bg-[#1C1F26] rounded-2xl p-8 border border-slate-700 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
            <Download className="w-6 h-6 text-[#D4AF37]" />
            3. Télécharger les modèles pré-construits
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                name: 'Executive Dashboard',
                description: 'RAG status, KPI, tendances, avancement global',
                category: 'executive',
                icon: TrendingUp,
                is_pro_only: false,
              },
              {
                name: 'Portfolio View',
                description: 'Vue multi-projets avec budget et timeline',
                category: 'portfolio',
                icon: BarChart3,
                is_pro_only: false,
              },
              {
                name: 'Risk Heatmap',
                description: 'Cartographie dynamique des risques',
                category: 'risk',
                icon: Shield,
                is_pro_only: true,
              },
              {
                name: 'Financial Tracking',
                description: 'Coûts, CAPEX/OPEX, forecast',
                category: 'financial',
                icon: TrendingUp,
                is_pro_only: true,
              },
            ].map((model, index) => {
              const Icon = model.icon;
              const isLocked = isDemo && model.is_pro_only;

              return (
                <div
                  key={index}
                  className={`bg-[#0A0F1C] rounded-xl p-6 border ${isLocked ? 'border-amber-500/30' : 'border-slate-700'}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <Icon className="w-8 h-8 text-[#D4AF37]" />
                    {model.is_pro_only && (
                      <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-semibold rounded">
                        PRO
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{model.name}</h3>
                  <p className="text-sm text-slate-400 mb-4">{model.description}</p>
                  <button
                    onClick={() => handleDownloadModel(model as any)}
                    disabled={isLocked}
                    className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:opacity-50 text-white rounded-lg transition flex items-center justify-center gap-2"
                    title={isLocked ? "Disponible en mode Pro" : `Télécharger ${model.name}`}
                  >
                    <Download className="w-4 h-4" />
                    Télécharger .pbix
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Documentation */}
        <div className="bg-gradient-to-r from-[#D4AF37]/10 to-[#C4A037]/5 rounded-2xl p-6 border border-[#D4AF37]/30">
          <div className="flex items-start gap-4">
            <ExternalLink className="w-6 h-6 text-[#D4AF37] flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Documentation complète</h3>
              <p className="text-slate-300 mb-4">
                Consultez notre guide complet pour configurer Power BI Service, l'actualisation automatique et le partage avec votre équipe.
              </p>
              <a
                href="/ressources/documentation/powerbi-integration"
                className="inline-flex items-center gap-2 text-[#D4AF37] hover:text-[#C4A037] transition"
              >
                Voir la documentation
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Pro CTA */}
        {isDemo && (
          <div className="mt-8 bg-gradient-to-r from-[#D4AF37]/20 to-[#C4A037]/10 rounded-2xl p-8 border border-[#D4AF37]/30">
            <h3 className="text-2xl font-semibold text-white mb-3">Passez en mode Pro</h3>
            <p className="text-slate-300 mb-6">
              Débloquez l'intégration Power BI complète avec génération de clés API, actualisation automatique et tous les modèles premium.
            </p>
            <button className="px-8 py-4 bg-[#D4AF37] hover:bg-[#C4A037] text-[#0A0F1C] rounded-lg font-semibold text-lg transition">
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
      <div className="text-white animate-pulse">Chargement de l'intégration Power BI...</div>
    </div>
  );
}
