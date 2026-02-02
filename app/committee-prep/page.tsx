'use client';

import { Suspense, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Bot, FileText, Download, Mail, Copy, Zap, AlertTriangle, TrendingUp, Target } from 'lucide-react';

/**
 * Committee Prep — Génération Brief Exécutif
 */
export default function CommitteePrepPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <CommitteePrepContent />
    </Suspense>
  );
}

interface BriefData {
  synthese: string;
  projets_critiques: Array<{
    name: string;
    status: string;
    risk: string;
  }>;
  top_risques: Array<{
    title: string;
    score: number;
    mitigation: string;
  }>;
  decisions_strategiques: Array<{
    title: string;
    impact: string;
  }>;
  kpi_alerte: Array<{
    name: string;
    value: number;
    deviation: string;
  }>;
  recommandations: string[];
}

function CommitteePrepContent() {
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(false);
  const [brief, setBrief] = useState<BriefData | null>(null);
  const [generationTime, setGenerationTime] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('Non connecté');

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('organization_id, plan, pro_active')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      setIsDemo(profile.plan === 'demo' || !profile.pro_active);

      // Vérifier si l'IA est activée
      const { data: aiSettings } = await supabase
        .from('ai_settings')
        .select('enabled')
        .eq('organization_id', profile.organization_id)
        .single();

      setAiEnabled(aiSettings?.enabled || false);
    } catch (err: any) {
      console.error('Erreur chargement:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    const startTime = Date.now();

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'comex' }),
      });

      if (!response.ok) throw new Error('Erreur génération');

      const data = await response.json();
      setBrief(data.brief);
      setGenerationTime(Date.now() - startTime);
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la génération');
    } finally {
      setGenerating(false);
    }
  };

  const handleExportPDF = () => {
    if (isDemo) {
      alert('Export PDF disponible en mode Pro uniquement');
      return;
    }
    // TODO: Génération PDF
    alert('Export PDF en cours de développement');
  };

  const handleExportWord = () => {
    if (isDemo) {
      alert('Export Word disponible en mode Pro uniquement');
      return;
    }
    // TODO: Génération Word
    alert('Export Word en cours de développement');
  };

  const handleCopyMarkdown = () => {
    if (!brief) return;

    const markdown = `# Brief Exécutif COMEX

## Synthèse
${brief.synthese}

## Projets Critiques
${brief.projets_critiques.map(p => `- **${p.name}** (${p.status}): ${p.risk}`).join('\n')}

## Top 5 Risques
${brief.top_risques.map((r, i) => `${i + 1}. **${r.title}** (Score: ${r.score}) - ${r.mitigation}`).join('\n')}

## Décisions Stratégiques
${brief.decisions_strategiques.map(d => `- **${d.title}**: ${d.impact}`).join('\n')}

## KPI en Alerte
${brief.kpi_alerte.map(k => `- **${k.name}**: ${k.value} (${k.deviation})`).join('\n')}

## Recommandations
${brief.recommandations.map((r, i) => `${i + 1}. ${r}`).join('\n')}
`;

    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendEmail = () => {
    if (isDemo) {
      alert('Envoi par email disponible en mode Pro uniquement');
      return;
    }
    // TODO: Email modal
    alert('Envoi email en cours de développement');
  };

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-[#0A0F1C] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-3 flex items-center gap-3">
            <Bot className="w-10 h-10 text-[#D4AF37]" />
            Committee Prep — Brief Exécutif
          </h1>
          <p className="text-lg text-slate-300">
            L'IA analyse votre portefeuille et génère un rapport COMEX en 10 secondes
          </p>
        </div>

        {/* Demo/IA désactivée */}
        {!aiEnabled && (
          <div className="mb-6 bg-amber-500/20 border border-amber-500/50 rounded-xl p-4">
            <p className="text-sm text-amber-300">
              <strong>IA désactivée :</strong> Activez l'IA narrative dans les paramètres pour générer des rapports.
            </p>
          </div>
        )}

        {isDemo && (
          <div className="mb-6 bg-blue-500/20 border border-blue-500/50 rounded-xl p-4">
            <p className="text-sm text-blue-300">
              <strong>Mode Demo :</strong> Le brief généré est un exemple. Passez en Pro pour des analyses réelles avec vos données.
            </p>
          </div>
        )}

        {/* Génération */}
        <div className="bg-[#1C1F26] rounded-2xl p-8 border border-slate-700 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-2">Générer le brief</h2>
              <p className="text-sm text-slate-400">
                L'IA va analyser automatiquement vos projets, risques, décisions et KPI
              </p>
            </div>
            <button
              onClick={handleGenerate}
              disabled={generating || !aiEnabled}
              className="px-6 py-3 bg-[#D4AF37] hover:bg-[#C4A037] disabled:bg-slate-700 disabled:opacity-50 text-[#0A0F1C] rounded-lg font-semibold transition flex items-center gap-2"
            >
              {generating ? (
                <>
                  <Zap className="w-5 h-5 animate-pulse" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Bot className="w-5 h-5" />
                  Générer le brief
                </>
              )}
            </button>
          </div>

          {generating && (
            <div className="bg-[#0A0F1C] rounded-lg p-6 border border-slate-700">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse"></div>
                <div className="text-sm text-slate-300">Analyse des projets critiques...</div>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="text-sm text-slate-300">Évaluation des risques...</div>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                <div className="text-sm text-slate-300">Synthèse des décisions...</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
                <div className="text-sm text-slate-300">Génération du brief...</div>
              </div>
            </div>
          )}
        </div>

        {/* Résultat */}
        {brief && (
          <>
            {/* Stats génération */}
            <div className="mb-6 flex items-center justify-between bg-gradient-to-r from-[#D4AF37]/10 to-[#C4A037]/5 rounded-xl p-4 border border-[#D4AF37]/30">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#D4AF37]" />
                <span className="text-white font-semibold">Brief généré en {(generationTime / 1000).toFixed(1)}s</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleExportPDF}
                  title="Exporter en PDF"
                  className="p-2 hover:bg-slate-700 rounded-lg transition"
                >
                  <Download className="w-5 h-5 text-slate-300" />
                </button>
                <button
                  onClick={handleCopyMarkdown}
                  title="Copier en Markdown"
                  className="p-2 hover:bg-slate-700 rounded-lg transition"
                >
                  {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-slate-300" />}
                </button>
                <button
                  onClick={handleSendEmail}
                  title="Envoyer par email"
                  className="p-2 hover:bg-slate-700 rounded-lg transition"
                >
                  <Mail className="w-5 h-5 text-slate-300" />
                </button>
              </div>
            </div>

            {/* Synthèse */}
            <div className="bg-[#1C1F26] rounded-2xl p-8 border border-slate-700 mb-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#D4AF37]" />
                Synthèse Exécutive
              </h3>
              <p className="text-slate-300 leading-relaxed">{brief.synthese}</p>
            </div>

            {/* Projets Critiques */}
            <div className="bg-[#1C1F26] rounded-2xl p-8 border border-slate-700 mb-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                Projets Critiques
              </h3>
              <div className="space-y-4">
                {brief.projets_critiques.map((projet, idx) => (
                  <div key={idx} className="bg-[#0A0F1C] rounded-lg p-4 border border-red-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-white font-semibold">{projet.name}</div>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        projet.status === 'RED' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {projet.status}
                      </div>
                    </div>
                    <div className="text-sm text-slate-400">{projet.risk}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Risques */}
            <div className="bg-[#1C1F26] rounded-2xl p-8 border border-slate-700 mb-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-400" />
                Top 5 Risques
              </h3>
              <div className="space-y-3">
                {brief.top_risques.map((risque, idx) => (
                  <div key={idx} className="bg-[#0A0F1C] rounded-lg p-4 border border-slate-700">
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-white font-medium">{idx + 1}. {risque.title}</div>
                      <div className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded text-xs font-semibold">
                        Score: {risque.score}
                      </div>
                    </div>
                    <div className="text-sm text-slate-400">{risque.mitigation}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Décisions & KPI */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Décisions */}
              <div className="bg-[#1C1F26] rounded-2xl p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4">Décisions Stratégiques</h3>
                <div className="space-y-3">
                  {brief.decisions_strategiques.map((decision, idx) => (
                    <div key={idx} className="bg-[#0A0F1C] rounded-lg p-3 border border-slate-700">
                      <div className="text-sm font-medium text-white mb-1">{decision.title}</div>
                      <div className="text-xs text-slate-400">{decision.impact}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* KPI Alerte */}
              <div className="bg-[#1C1F26] rounded-2xl p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4">KPI en Alerte</h3>
                <div className="space-y-3">
                  {brief.kpi_alerte.map((kpi, idx) => (
                    <div key={idx} className="bg-[#0A0F1C] rounded-lg p-3 border border-red-500/30">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-medium text-white">{kpi.name}</div>
                        <div className="text-sm text-red-400 font-semibold">{kpi.value}</div>
                      </div>
                      <div className="text-xs text-slate-400">{kpi.deviation}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommandations */}
            <div className="bg-gradient-to-r from-[#D4AF37]/20 to-[#C4A037]/10 rounded-2xl p-8 border border-[#D4AF37]/30">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#D4AF37]" />
                Recommandations
              </h3>
              <div className="space-y-3">
                {brief.recommandations.map((reco, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="text-[#D4AF37] font-semibold">{idx + 1}.</div>
                    <div className="text-white">{reco}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Pro CTA */}
        {isDemo && (
          <div className="mt-8 bg-gradient-to-r from-[#D4AF37]/20 to-[#C4A037]/10 rounded-2xl p-8 border border-[#D4AF37]/30">
            <h3 className="text-2xl font-semibold text-white mb-3">Débloquez l'IA complète en mode Pro</h3>
            <p className="text-slate-300 mb-6">
              Analysez vos données réelles, exportez en PDF/Word, envoyez par email et bénéficiez de l'accompagnement Fabrice pour structurer vos rapports COMEX.
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
      <div className="text-white animate-pulse">Chargement...</div>
    </div>
  );
}

// Import Check icon
import { Check } from 'lucide-react';
