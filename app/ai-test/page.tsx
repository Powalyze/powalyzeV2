'use client';

import { useState } from 'react';
import { generateExecutiveSummary, generateCommitteeBrief, generatePriorityActionsView, isAIConfigured, getAIConfigStatus } from '@/lib/ai';
import { Sparkles, FileText, Target, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';


export default function AITestPage() {
  const [loading, setLoading] = useState(false);
  const [activeTest, setActiveTest] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, { success: boolean; content: string; error?: string }>>({});

  const aiConfigured = isAIConfigured();
  const aiStatus = getAIConfigStatus();

  async function testExecutiveSummary() {
    setLoading(true);
    setActiveTest('executive');
    try {
      // Demo data removed
      setResults(prev => ({
        ...prev,
        executive: { success: false, content: '', error: 'Demo data removed' },
      }));
    } catch (error: any) {
      setResults(prev => ({
        ...prev,
        executive: { success: false, content: '', error: error.message },
      }));
    } finally {
      setLoading(false);
      setActiveTest(null);
    }
  }

  async function testCommitteeBrief() {
    setLoading(true);
    setActiveTest('committee');
    try {
      // Demo data removed
      setResults(prev => ({
        ...prev,
        committee: { success: false, content: '', error: 'Demo data removed' },
      }));
    } catch (error: any) {
      setResults(prev => ({
        ...prev,
        committee: { success: false, content: '', error: error.message },
      }));
    } finally {
      setLoading(false);
      setActiveTest(null);
    }
  }

  async function testPriorityActions() {
    setLoading(true);
    setActiveTest('actions');
    try {
      // Demo data removed
      setResults(prev => ({
        ...prev,
        actions: { success: false, content: '', error: 'Demo data removed' },
      }));
    } catch (error: any) {
      setResults(prev => ({
        ...prev,
        actions: { success: false, content: '', error: error.message },
      }));
    } finally {
      setLoading(false);
      setActiveTest(null);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      {/* DemoBadge removed */}
      
      <header className="border-b border-slate-800 px-8 py-4">
        <div className="flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-amber-400" />
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Powalyze</div>
            <div className="text-sm text-slate-300">Tests IA Narrative · Environnement de Validation</div>
          </div>
        </div>
      </header>

      <main className="flex-1 px-8 py-6 max-w-7xl mx-auto w-full">
        {/* Status IA */}
        <div className={`mb-6 p-4 rounded-2xl border ${
          aiConfigured 
            ? 'bg-emerald-500/10 border-emerald-500/30' 
            : 'bg-amber-400/10 border-amber-400/30'
        }`}>
          <div className="flex items-center gap-3">
            {aiConfigured ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            ) : (
              <AlertCircle className="h-5 w-5 text-amber-400" />
            )}
            <div>
              <div className="text-sm font-semibold text-slate-100">{aiStatus}</div>
              {!aiConfigured && (
                <div className="text-xs text-slate-400 mt-1">
                  Configurez OPENAI_API_KEY ou AZURE_OPENAI_* dans .env.local pour activer l'IA réelle
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mode Info removed */}

        {/* Tests IA */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Test 1: Executive Summary */}
          <button
            onClick={testExecutiveSummary}
            disabled={loading}
            className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-amber-400/50 transition disabled:opacity-50 text-left"
          >
            <FileText className="h-8 w-8 text-amber-400 mb-3" />
            <h3 className="text-sm font-semibold text-slate-100 mb-2">Synthèse Exécutive</h3>
            <p className="text-xs text-slate-400 mb-4">
              Génère une synthèse complète du portfolio avec points d'attention, risques, arbitrages et recommandations.
            </p>
            {activeTest === 'executive' && (
              <div className="text-xs text-amber-400 flex items-center gap-2">
                <div className="animate-spin h-3 w-3 border-2 border-amber-400 border-t-transparent rounded-full" />
                Génération en cours...
              </div>
            )}
            {results.executive && (
              <div className={`text-xs flex items-center gap-2 ${
                results.executive.success ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {results.executive.success ? (
                  <CheckCircle2 className="h-3 w-3" />
                ) : (
                  <XCircle className="h-3 w-3" />
                )}
                {results.executive.success ? 'Généré avec succès' : 'Erreur'}
              </div>
            )}
          </button>

          {/* Test 2: Committee Brief */}
          <button
            onClick={testCommitteeBrief}
            disabled={loading}
            className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-amber-400/50 transition disabled:opacity-50 text-left"
          >
            <FileText className="h-8 w-8 text-blue-400 mb-3" />
            <h3 className="text-sm font-semibold text-slate-100 mb-2">Brief de Comité</h3>
            <p className="text-xs text-slate-400 mb-4">
              Prépare une note exécutive pour un comité avec ordre du jour, décisions et recommandations.
            </p>
            {activeTest === 'committee' && (
              <div className="text-xs text-blue-400 flex items-center gap-2">
                <div className="animate-spin h-3 w-3 border-2 border-blue-400 border-t-transparent rounded-full" />
                Génération en cours...
              </div>
            )}
            {results.committee && (
              <div className={`text-xs flex items-center gap-2 ${
                results.committee.success ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {results.committee.success ? (
                  <CheckCircle2 className="h-3 w-3" />
                ) : (
                  <XCircle className="h-3 w-3" />
                )}
                {results.committee.success ? 'Généré avec succès' : 'Erreur'}
              </div>
            )}
          </button>

          {/* Test 3: Priority Actions */}
          <button
            onClick={testPriorityActions}
            disabled={loading}
            className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-amber-400/50 transition disabled:opacity-50 text-left"
          >
            <Target className="h-8 w-8 text-red-400 mb-3" />
            <h3 className="text-sm font-semibold text-slate-100 mb-2">Actions Prioritaires</h3>
            <p className="text-xs text-slate-400 mb-4">
              Analyse les actions en cours et génère une vue de pilotage avec priorités et recommandations.
            </p>
            {activeTest === 'actions' && (
              <div className="text-xs text-red-400 flex items-center gap-2">
                <div className="animate-spin h-3 w-3 border-2 border-red-400 border-t-transparent rounded-full" />
                Génération en cours...
              </div>
            )}
            {results.actions && (
              <div className={`text-xs flex items-center gap-2 ${
                results.actions.success ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {results.actions.success ? (
                  <CheckCircle2 className="h-3 w-3" />
                ) : (
                  <XCircle className="h-3 w-3" />
                )}
                {results.actions.success ? 'Généré avec succès' : 'Erreur'}
              </div>
            )}
          </button>
        </div>

        {/* Results Display */}
        <div className="space-y-4">
          {Object.entries(results).map(([key, result]) => (
            <div key={key} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-slate-100 mb-3 flex items-center gap-2">
                {result.success ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-400" />
                )}
                {key === 'executive' && 'Synthèse Exécutive'}
                {key === 'committee' && 'Brief de Comité'}
                {key === 'actions' && 'Actions Prioritaires'}
              </h3>
              
              {result.success ? (
                <div className="prose prose-invert prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-lg border border-slate-800">
                    {result.content}
                  </pre>
                </div>
              ) : (
                <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <div className="font-semibold mb-1">Erreur:</div>
                  {result.error}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex gap-4">
          <a 
            href="/cockpit-real" 
            className="text-xs text-slate-400 hover:text-slate-300 transition"
          >
            ← Retour au Cockpit
          </a>
          <a 
            href="/committee-prep" 
            className="text-xs text-slate-400 hover:text-slate-300 transition"
          >
            Préparation de Comité →
          </a>
        </div>
      </main>
    </div>
  );
}

