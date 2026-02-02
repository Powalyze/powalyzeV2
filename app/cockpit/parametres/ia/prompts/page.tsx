'use client';

import { Suspense, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { FileText, Save, Zap, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

/**
 * Page Personnalisation Prompts IA
 */
export default function AIPromptsPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <AIPromptsContent />
    </Suspense>
  );
}

interface Prompts {
  global: string;
  comex: string;
  risks: string;
  decisions: string;
  kpi: string;
}

const DEFAULT_PROMPTS: Prompts = {
  global: 'Vous êtes un assistant IA spécialisé en gestion de portefeuille de projets. Analysez les données fournies et produisez des synthèses claires et actionnables.',
  comex: 'Rédige un brief exécutif de 500 mots maximum, en mettant l\'accent sur les décisions à prendre et les risques financiers. Utilise un ton factuel et précis. Structurez en 4 sections : Synthèse, Projets Critiques, Top Risques, Recommandations.',
  risks: 'Analyse les risques fournis et identifie les 5 plus critiques. Pour chaque risque, évalue la probabilité d\'occurrence, l\'impact potentiel et recommande des actions de mitigation concrètes.',
  decisions: 'Synthétise les décisions stratégiques récentes en identifiant leur impact sur le portefeuille, les dépendances entre décisions et les actions de suivi nécessaires.',
  kpi: 'Analyse les KPI fournis et détecte les dérives significatives. Pour chaque dérive, identifie la cause probable, l\'impact sur les objectifs et recommande des actions correctives.',
};

function AIPromptsContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [prompts, setPrompts] = useState<Prompts>(DEFAULT_PROMPTS);

  useEffect(() => {
    loadPrompts();
  }, []);

  const loadPrompts = async () => {
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

      // Récupérer les prompts personnalisés
      const { data: customPrompts, error: promptsError } = await supabase
        .from('ai_prompts')
        .select('*')
        .eq('organization_id', profile.organization_id);

      if (promptsError && promptsError.code !== 'PGRST116') {
        throw promptsError;
      }

      if (customPrompts && customPrompts.length > 0) {
        const loadedPrompts = { ...DEFAULT_PROMPTS };
        customPrompts.forEach((p: any) => {
          loadedPrompts[p.type as keyof Prompts] = p.content;
        });
        setPrompts(loadedPrompts);
      }
    } catch (err: any) {
      console.error('Erreur chargement prompts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (isDemo) {
      alert('La personnalisation des prompts est disponible uniquement en mode Pro.');
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

      // Upsert tous les prompts
      const promptsToUpsert = Object.entries(prompts).map(([type, content]) => ({
        organization_id: profile.organization_id,
        type,
        content,
        updated_at: new Date().toISOString(),
      }));

      // Spécifier onConflict sur la PRIMARY KEY composite
      const { error: upsertError } = await supabase
        .from('ai_prompts')
        .upsert(promptsToUpsert, {
          onConflict: 'organization_id,type',
          ignoreDuplicates: false
        });

      if (upsertError) throw upsertError;

      alert('Prompts IA enregistrés avec succès !');
    } catch (err: any) {
      alert(err.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Réinitialiser tous les prompts aux valeurs par défaut ?')) {
      setPrompts(DEFAULT_PROMPTS);
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-[#0A0F1C] p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="mb-4 text-slate-400 hover:text-white transition flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux paramètres
          </button>
          <h1 className="text-4xl font-bold text-white mb-3 flex items-center gap-3">
            <FileText className="w-10 h-10 text-[#D4AF37]" />
            Personnalisation des Prompts
          </h1>
          <p className="text-lg text-slate-300">
            Adaptez les instructions de l'IA pour correspondre à votre culture d'entreprise
          </p>
        </div>

        {/* Demo badge */}
        {isDemo && (
          <div className="mb-6 bg-amber-500/20 border border-amber-500/50 rounded-xl p-4">
            <p className="text-sm text-amber-300">
              <strong>Mode Demo :</strong> Les prompts sont affichés en lecture seule. Passez en Pro pour les personnaliser.
            </p>
          </div>
        )}

        {/* Prompts */}
        <div className="space-y-6">
          {/* Prompt Global */}
          <div className="bg-[#1C1F26] rounded-2xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-3">Prompt Global</h3>
            <p className="text-sm text-slate-400 mb-4">
              Instructions générales pour toutes les générations IA
            </p>
            <textarea
              value={prompts.global}
              onChange={(e) => !isDemo && setPrompts({ ...prompts, global: e.target.value })}
              disabled={isDemo}
              rows={4}
              className="w-full bg-[#0A0F1C] border border-slate-700 rounded-lg p-4 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Prompt COMEX */}
          <div className="bg-[#1C1F26] rounded-2xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-3">Prompt COMEX</h3>
            <p className="text-sm text-slate-400 mb-4">
              Génération du brief exécutif pour le comité de direction
            </p>
            <textarea
              value={prompts.comex}
              onChange={(e) => !isDemo && setPrompts({ ...prompts, comex: e.target.value })}
              disabled={isDemo}
              rows={5}
              className="w-full bg-[#0A0F1C] border border-slate-700 rounded-lg p-4 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Prompt Risques */}
          <div className="bg-[#1C1F26] rounded-2xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-3">Prompt Risques</h3>
            <p className="text-sm text-slate-400 mb-4">
              Analyse et priorisation des risques
            </p>
            <textarea
              value={prompts.risks}
              onChange={(e) => !isDemo && setPrompts({ ...prompts, risks: e.target.value })}
              disabled={isDemo}
              rows={5}
              className="w-full bg-[#0A0F1C] border border-slate-700 rounded-lg p-4 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Prompt Décisions */}
          <div className="bg-[#1C1F26] rounded-2xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-3">Prompt Décisions</h3>
            <p className="text-sm text-slate-400 mb-4">
              Synthèse des décisions stratégiques
            </p>
            <textarea
              value={prompts.decisions}
              onChange={(e) => !isDemo && setPrompts({ ...prompts, decisions: e.target.value })}
              disabled={isDemo}
              rows={5}
              className="w-full bg-[#0A0F1C] border border-slate-700 rounded-lg p-4 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Prompt KPI */}
          <div className="bg-[#1C1F26] rounded-2xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-3">Prompt KPI</h3>
            <p className="text-sm text-slate-400 mb-4">
              Détection des dérives et alertes
            </p>
            <textarea
              value={prompts.kpi}
              onChange={(e) => !isDemo && setPrompts({ ...prompts, kpi: e.target.value })}
              disabled={isDemo}
              rows={5}
              className="w-full bg-[#0A0F1C] border border-slate-700 rounded-lg p-4 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={handleReset}
            disabled={isDemo}
            className="px-4 py-2 text-slate-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Réinitialiser aux valeurs par défaut
          </button>
          <button
            onClick={handleSave}
            disabled={saving || isDemo}
            className="px-8 py-3 bg-[#D4AF37] hover:bg-[#C4A037] disabled:bg-slate-700 disabled:opacity-50 text-[#0A0F1C] rounded-lg font-semibold transition flex items-center gap-2"
          >
            {saving ? (
              <>
                <Zap className="w-4 h-4 animate-pulse" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Enregistrer les prompts
              </>
            )}
          </button>
        </div>

        {/* Pro CTA */}
        {isDemo && (
          <div className="mt-8 bg-gradient-to-r from-[#D4AF37]/20 to-[#C4A037]/10 rounded-2xl p-8 border border-[#D4AF37]/30">
            <h3 className="text-2xl font-semibold text-white mb-3">Personnalisez votre IA en mode Pro</h3>
            <p className="text-slate-300 mb-6">
              Adaptez les prompts à votre culture d'entreprise, votre terminologie et vos priorités stratégiques. Bénéficiez de l'accompagnement Fabrice pour structurer votre gouvernance narrative.
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
      <div className="text-white animate-pulse">Chargement des prompts IA...</div>
    </div>
  );
}
