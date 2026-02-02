'use client';

import { Suspense, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Bot, Save, Sparkles, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

/**
 * Page Paramètres IA
 * Configuration du modèle et du ton
 */
export default function AISettingsPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <AISettingsContent />
    </Suspense>
  );
}

interface AISettings {
  enabled: boolean;
  model: 'gpt4' | 'claude' | 'azure';
  tone: 'formel' | 'executif' | 'technique';
}

function AISettingsContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [settings, setSettings] = useState<AISettings>({
    enabled: false,
    model: 'gpt4',
    tone: 'executif',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('Non connecté');

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('organization_id, plan, pro_active, role')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      setIsDemo(profile.plan === 'demo' || !profile.pro_active);

      // Récupérer les settings
      const { data: aiSettings, error: settingsError } = await supabase
        .from('ai_settings')
        .select('*')
        .eq('organization_id', profile.organization_id)
        .single();

      if (settingsError && settingsError.code !== 'PGRST116') {
        throw settingsError;
      }

      if (aiSettings) {
        setSettings({
          enabled: aiSettings.enabled,
          model: aiSettings.model,
          tone: aiSettings.tone,
        });
      }
    } catch (err: any) {
      console.error('Erreur chargement settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (isDemo) {
      alert('La personnalisation de l\'IA est disponible uniquement en mode Pro.');
      return;
    }

    setSaving(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('Non connecté');

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      // Utiliser upsert avec PRIMARY KEY (organization_id)
      // Supabase détecte automatiquement la PK, pas besoin de onConflict
      const { error: upsertError } = await supabase
        .from('ai_settings')
        .upsert({
          organization_id: profile.organization_id,
          enabled: settings.enabled,
          model: settings.model,
          tone: settings.tone,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'organization_id',
          ignoreDuplicates: false
        });

      if (upsertError) throw upsertError;

      alert('Paramètres IA enregistrés avec succès !');
    } catch (err: any) {
      alert(err.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-[#0A0F1C] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-3 flex items-center gap-3">
            <Bot className="w-10 h-10 text-[#D4AF37]" />
            Paramètres IA Narrative
          </h1>
          <p className="text-lg text-slate-300">
            Configurez l'intelligence artificielle pour générer vos rapports exécutifs
          </p>
        </div>

        {/* Demo badge */}
        {isDemo && (
          <div className="mb-6 bg-blue-500/20 border border-blue-500/50 rounded-xl p-4">
            <p className="text-sm text-blue-300">
              <strong>Mode Demo :</strong> L'IA fonctionne en mode "exemple" avec des paramètres fixes. Passez en Pro pour personnaliser.
            </p>
          </div>
        )}

        {/* Card principale */}
        <div className="bg-[#1C1F26] rounded-2xl p-8 border border-slate-700">
          {/* Toggle Activer/Désactiver */}
          <div className="mb-8 pb-8 border-b border-slate-700">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                  Activer l'IA Narrative
                </h2>
                <p className="text-sm text-slate-400">
                  L'IA analysera automatiquement vos données et générera des synthèses exécutives en quelques secondes.
                </p>
              </div>
              <button
                onClick={() => !isDemo && setSettings({ ...settings, enabled: !settings.enabled })}
                disabled={isDemo}
                title={settings.enabled ? 'Désactiver l\'IA' : 'Activer l\'IA'}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition ${
                  settings.enabled ? 'bg-[#D4AF37]' : 'bg-slate-700'
                } ${isDemo ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                    settings.enabled ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Choix du modèle */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-white mb-4">Modèle IA</label>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { value: 'gpt4', label: 'GPT-4', desc: 'OpenAI (recommandé)' },
                { value: 'claude', label: 'Claude', desc: 'Anthropic' },
                { value: 'azure', label: 'Azure OpenAI', desc: 'Microsoft' },
              ].map((model) => (
                <button
                  key={model.value}
                  onClick={() => !isDemo && setSettings({ ...settings, model: model.value as any })}
                  disabled={isDemo}
                  className={`p-4 rounded-xl border-2 transition text-left ${
                    settings.model === model.value
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                      : 'border-slate-700 bg-[#0A0F1C] hover:border-slate-600'
                  } ${isDemo ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="text-base font-semibold text-white mb-1">{model.label}</div>
                  <div className="text-xs text-slate-400">{model.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Choix du ton */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-white mb-4">Ton du rapport</label>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { value: 'formel', label: 'Formel', desc: 'Langage soutenu' },
                { value: 'executif', label: 'Exécutif', desc: 'Synthétique et percutant' },
                { value: 'technique', label: 'Technique', desc: 'Détails opérationnels' },
              ].map((tone) => (
                <button
                  key={tone.value}
                  onClick={() => !isDemo && setSettings({ ...settings, tone: tone.value as any })}
                  disabled={isDemo}
                  className={`p-4 rounded-xl border-2 transition text-left ${
                    settings.tone === tone.value
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                      : 'border-slate-700 bg-[#0A0F1C] hover:border-slate-600'
                  } ${isDemo ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="text-base font-semibold text-white mb-1">{tone.label}</div>
                  <div className="text-xs text-slate-400">{tone.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Bouton sauvegarder */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-700">
            <button
              onClick={() => router.push('/cockpit/parametres/ia/prompts')}
              className="px-4 py-2 text-slate-300 hover:text-white transition"
            >
              Personnaliser les prompts →
            </button>
            <button
              onClick={handleSave}
              disabled={saving || isDemo}
              className="px-6 py-3 bg-[#D4AF37] hover:bg-[#C4A037] disabled:bg-slate-700 disabled:opacity-50 text-[#0A0F1C] rounded-lg font-semibold transition flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Zap className="w-4 h-4 animate-pulse" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Enregistrer
                </>
              )}
            </button>
          </div>
        </div>

        {/* Capacités de l'IA */}
        <div className="mt-8 bg-gradient-to-r from-[#D4AF37]/10 to-[#C4A037]/5 rounded-2xl p-6 border border-[#D4AF37]/30">
          <h3 className="text-lg font-semibold text-white mb-4">Capacités de l'IA Powalyze</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex gap-3">
              <div className="text-[#D4AF37]">✓</div>
              <div>
                <div className="text-sm font-medium text-white">Analyse de sentiment</div>
                <div className="text-xs text-slate-400">Détecte les signaux faibles dans les commentaires</div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-[#D4AF37]">✓</div>
              <div>
                <div className="text-sm font-medium text-white">Détection d'alertes</div>
                <div className="text-xs text-slate-400">Identifie les anomalies et patterns critiques</div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-[#D4AF37]">✓</div>
              <div>
                <div className="text-sm font-medium text-white">Prédictions</div>
                <div className="text-xs text-slate-400">Anticipe les retards et dérives budgétaires</div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-[#D4AF37]">✓</div>
              <div>
                <div className="text-sm font-medium text-white">Recommandations</div>
                <div className="text-xs text-slate-400">Actions prioritaires basées sur l'analyse</div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-[#D4AF37]">✓</div>
              <div>
                <div className="text-sm font-medium text-white">Traduction automatique</div>
                <div className="text-xs text-slate-400">FR / EN / DE en un clic</div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-[#D4AF37]">✓</div>
              <div>
                <div className="text-sm font-medium text-white">Génération rapide</div>
                <div className="text-xs text-slate-400">Rapports exécutifs en 10 secondes</div>
              </div>
            </div>
          </div>
        </div>

        {/* Pro CTA */}
        {isDemo && (
          <div className="mt-8 bg-gradient-to-r from-[#D4AF37]/20 to-[#C4A037]/10 rounded-2xl p-8 border border-[#D4AF37]/30">
            <h3 className="text-2xl font-semibold text-white mb-3">Débloquez l'IA complète en mode Pro</h3>
            <p className="text-slate-300 mb-6">
              Personnalisez les prompts, activez les prédictions avancées, générez des rapports multilingues et bénéficiez de l'accompagnement Fabrice pour structurer votre gouvernance narrative.
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
      <div className="text-white animate-pulse">Chargement des paramètres IA...</div>
    </div>
  );
}
