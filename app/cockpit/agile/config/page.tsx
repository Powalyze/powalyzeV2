'use client';

import { Suspense, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Settings, CheckCircle, Zap, GitBranch, Target, Clock } from 'lucide-react';

/**
 * Page Configuration Agile
 * Choix et configuration de la méthodologie Agile
 */
export default function ConfigAgile Page() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ConfigAgileContent />
    </Suspense>
  );
}

interface AgileSettings {
  methodology: 'scrum' | 'kanban' | 'hybride';
  sprint_duration_weeks: number;
  ceremonies: {
    daily: boolean;
    review: boolean;
    retro: boolean;
  };
}

const METHODOLOGIES = [
  {
    value: 'scrum',
    label: 'Agile / Scrum',
    icon: Zap,
    description: 'Sprints itératifs avec cérémonies complètes',
    features: ['Daily Standup', 'Sprint Review', 'Retrospective', 'Planning Poker'],
    color: '#D4AF37',
  },
  {
    value: 'kanban',
    label: 'Kanban',
    icon: GitBranch,
    description: 'Flux continu avec WIP limits',
    features: ['Colonnes personnalisées', 'Limites WIP', 'Cycle time', 'Lead time'],
    color: '#A7C7FF',
  },
  {
    value: 'hybride',
    label: 'Hybride (ScrumBan)',
    icon: Target,
    description: 'Combinaison Scrum + Kanban',
    features: ['Sprints itératifs', 'WIP limits', 'Daily + Review', 'Flexibilité'],
    color: '#3DD68C',
  },
];

function ConfigAgileContent() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<AgileSettings>({
    methodology: 'scrum',
    sprint_duration_weeks: 2,
    ceremonies: { daily: true, review: true, retro: true },
  });
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
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

      // Récupérer les settings existants
      const { data: settingsData, error: settingsError } = await supabase
        .from('agile_settings')
        .select('*')
        .eq('organization_id', profile.organization_id)
        .single();

      if (settingsError && settingsError.code !== 'PGRST116') {
        console.error('Erreur settings:', settingsError);
      }

      if (settingsData) {
        setSettings({
          methodology: settingsData.methodology,
          sprint_duration_weeks: settingsData.sprint_duration_weeks,
          ceremonies: settingsData.ceremonies,
        });
      }
    } catch (err: any) {
      console.error('Erreur chargement:', err);
      alert(err.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (isDemo) {
      alert('En mode Demo, les paramètres sont fixes (Scrum, 2 semaines).');
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

      // Upsert settings
      const { error } = await supabase
        .from('agile_settings')
        .upsert(
          {
            organization_id: profile.organization_id,
            methodology: settings.methodology,
            sprint_duration_weeks: settings.sprint_duration_weeks,
            ceremonies: settings.ceremonies,
          },
          { onConflict: 'organization_id' }
        );

      if (error) throw error;

      alert('✅ Configuration Agile enregistrée');
    } catch (err: any) {
      alert(err.message || 'Erreur sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-[#0A0F1C] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Settings className="w-8 h-8 text-[#D4AF37]" />
            Configuration Agile
          </h1>
          <p className="text-slate-400">Choisissez votre méthodologie et configurez vos sprints</p>
        </div>

        {/* Demo badge */}
        {isDemo && (
          <div className="mb-6 bg-blue-500/20 border border-blue-500/50 rounded-xl p-4">
            <p className="text-sm text-blue-300">
              <strong>Mode Demo :</strong> Méthodologie = Scrum uniquement • Durée sprint = 2 semaines fixe • Cérémonies non modifiables
            </p>
          </div>
        )}

        {/* Choix méthodologie */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Méthodologie Agile</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {METHODOLOGIES.map(method => {
              const Icon = method.icon;
              const isSelected = settings.methodology === method.value;

              return (
                <button
                  key={method.value}
                  onClick={() => !isDemo && setSettings({ ...settings, methodology: method.value as any })}
                  disabled={isDemo}
                  className={`bg-[#1C1F26] rounded-2xl p-6 border-2 transition ${
                    isSelected
                      ? 'border-[#D4AF37] shadow-lg shadow-[#D4AF37]/20'
                      : 'border-slate-700 hover:border-slate-600'
                  } ${isDemo ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <Icon className="w-8 h-8" style={{ color: method.color }} />
                    {isSelected && <CheckCircle className="w-6 h-6 text-[#D4AF37]" />}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{method.label}</h3>
                  <p className="text-sm text-slate-400 mb-4">{method.description}</p>
                  <ul className="space-y-2">
                    {method.features.map(feature => (
                      <li key={feature} className="text-xs text-slate-500 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>
        </div>

        {/* Configuration Sprint (Scrum/Hybride) */}
        {(settings.methodology === 'scrum' || settings.methodology === 'hybride') && (
          <div className="bg-[#1C1F26] rounded-2xl p-6 border border-slate-700 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#D4AF37]" />
              Configuration Sprint
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Durée du sprint (semaines)
                </label>
                <input
                  type="number"
                  min={1}
                  max={4}
                  value={settings.sprint_duration_weeks}
                  onChange={e => !isDemo && setSettings({ ...settings, sprint_duration_weeks: parseInt(e.target.value) })}
                  disabled={isDemo}
                  className="w-full px-4 py-2 bg-[#0A0F1C] border border-slate-700 rounded-lg text-white disabled:opacity-50"
                />
                <p className="text-xs text-slate-500 mt-1">Recommandé : 2 semaines</p>
              </div>
            </div>
          </div>
        )}

        {/* Cérémonies (Scrum/Hybride) */}
        {(settings.methodology === 'scrum' || settings.methodology === 'hybride') && (
          <div className="bg-[#1C1F26] rounded-2xl p-6 border border-slate-700 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Cérémonies Agile</h2>
            <div className="space-y-4">
              {[
                { key: 'daily', label: 'Daily Standup', desc: 'Réunion quotidienne de 15min' },
                { key: 'review', label: 'Sprint Review', desc: 'Démo des fonctionnalités terminées' },
                { key: 'retro', label: 'Retrospective', desc: 'Analyse du sprint écoulé' },
              ].map(ceremony => (
                <label
                  key={ceremony.key}
                  className={`flex items-center gap-3 p-4 bg-[#0A0F1C] rounded-lg border border-slate-700 ${
                    isDemo ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-slate-600'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={settings.ceremonies[ceremony.key as keyof typeof settings.ceremonies]}
                    onChange={e =>
                      !isDemo &&
                      setSettings({
                        ...settings,
                        ceremonies: {
                          ...settings.ceremonies,
                          [ceremony.key]: e.target.checked,
                        },
                      })
                    }
                    disabled={isDemo}
                    className="w-5 h-5 rounded border-slate-700"
                  />
                  <div>
                    <div className="text-sm font-semibold text-white">{ceremony.label}</div>
                    <div className="text-xs text-slate-500">{ceremony.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            disabled={isDemo || saving}
            className="px-6 py-3 bg-[#D4AF37] hover:bg-[#C4A037] text-[#0A0F1C] rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Enregistrement...' : 'Enregistrer la configuration'}
          </button>
          <button
            onClick={() => window.location.href = '/cockpit/agile'}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition"
          >
            Aller au Cockpit Agile
          </button>
        </div>

        {/* Pro CTA */}
        {isDemo && (
          <div className="mt-8 bg-gradient-to-r from-[#D4AF37]/20 to-[#C4A037]/10 rounded-2xl p-6 border border-[#D4AF37]/30">
            <h3 className="text-xl font-semibold text-white mb-2">Débloquez toutes les méthodologies</h3>
            <p className="text-slate-300 mb-4">
              Kanban, Hybride, cérémonies personnalisées, WIP limits, intégrations Jira/Azure DevOps...
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
      <div className="text-white animate-pulse">Chargement de la configuration...</div>
    </div>
  );
}
