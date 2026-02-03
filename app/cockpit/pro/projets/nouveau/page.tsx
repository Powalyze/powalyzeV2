// ============================================================
// POWALYZE COCKPIT V3 — NEW PROJECT PAGE (IA-NATIVE)
// ============================================================

'use client';

import { useState } from 'react';
import { ArrowLeft, Sparkles, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createProjectAction } from '@/lib/project-actions';

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiSuggesting, setAiSuggesting] = useState(false);
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const result = await createProjectAction(formData);
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
    // La redirection est gérée par la server action
    // (vers le wizard si continue_wizard = true, sinon vers /cockpit/pro/projets)
  }
  
  // Fonction pour enrichir avec l'IA (Phase 4)
  async function suggestWithAI() {
    setAiSuggesting(true);
    // TODO Phase 4: Appeler l'API IA pour suggestions
    setTimeout(() => {
      setAiSuggesting(false);
    }, 2000);
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <Link
            href="/cockpit/pro"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au dashboard
          </Link>
          <div className="flex items-center gap-4 mb-3">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Nouveau Projet</h1>
              <p className="text-slate-400">Assisté par Intelligence Artificielle</p>
            </div>
          </div>
        </div>
        
        {/* Info banner */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="bg-blue-500/20 p-2 rounded-lg flex-shrink-0">
              <Sparkles className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-blue-400 font-semibold mb-2">🤖 Mode IA-Native Activé</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Créez votre projet en quelques clics. L'IA vous proposera ensuite d'enrichir automatiquement 
                votre projet avec des risques potentiels, des décisions stratégiques, et des scénarios prévisionnels.
              </p>
            </div>
          </div>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8 space-y-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-400 font-semibold">Erreur</p>
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            </div>
          )}
          
          {/* Informations principales */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="bg-indigo-500/20 text-indigo-400 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                Informations Principales
              </h2>
            </div>
            
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-300 mb-2">
                Nom du projet <span className="text-red-400">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="ex: Transformation Cloud Azure"
              />
              <p className="text-slate-500 text-xs mt-2">Un nom clair et descriptif pour votre projet</p>
            </div>
            
            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-slate-300 mb-2">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                placeholder="Décrivez les objectifs, le périmètre et les enjeux du projet..."
              />
              <p className="text-slate-500 text-xs mt-2">Plus la description est détaillée, meilleures seront les suggestions IA</p>
            </div>
          </div>
          
          {/* Paramètres du projet */}
          <div className="space-y-6 pt-6 border-t border-white/10">
            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="bg-purple-500/20 text-purple-400 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                Paramètres du Projet
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Budget */}
              <div>
                <label htmlFor="budget" className="block text-sm font-semibold text-slate-300 mb-2">
                  Budget (€)
                </label>
                <input
                  id="budget"
                  name="budget"
                  type="number"
                  min="0"
                  step="1000"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="2500000"
                />
              </div>
              
              {/* Deadline */}
              <div>
                <label htmlFor="deadline" className="block text-sm font-semibold text-slate-300 mb-2">
                  Échéance
                </label>
                <input
                  id="deadline"
                  name="deadline"
                  type="date"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-semibold text-slate-300 mb-2">
                  Statut Initial
                </label>
                <select
                  id="status"
                  name="status"
                  defaultValue="active"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  <option value="active">Actif</option>
                  <option value="on-hold">En pause</option>
                </select>
              </div>
              
              {/* Health */}
              <div>
                <label htmlFor="health" className="block text-sm font-semibold text-slate-300 mb-2">
                  Santé Initiale
                </label>
                <select
                  id="health"
                  name="health"
                  defaultValue="green"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  <option value="green">🟢 Vert (on track)</option>
                  <option value="yellow">🟡 Jaune (attention)</option>
                  <option value="red">🔴 Rouge (critique)</option>
                </select>
              </div>
            </div>
            
            {/* Progress */}
            <div>
              <label htmlFor="progress" className="block text-sm font-semibold text-slate-300 mb-2">
                Progression Initiale (%)
              </label>
              <div className="flex items-center gap-4">
                <input
                  id="progress"
                  name="progress"
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="0"
                  className="flex-1"
                  onInput={(e) => {
                    const target = e.target as HTMLInputElement;
                    const output = document.getElementById('progress-value');
                    if (output) output.textContent = target.value;
                  }}
                />
                <span id="progress-value" className="text-white font-bold w-12 text-right">0</span>
                <span className="text-slate-400">%</span>
              </div>
            </div>
          </div>
          
          {/* Wizard option */}
          <div className="space-y-6 pt-6 border-t border-white/10">
            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="bg-amber-500/20 text-amber-400 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                Enrichissement IA (Optionnel)
              </h2>
            </div>
            
            <div className="bg-gradient-to-br from-purple-600/10 via-indigo-600/10 to-blue-600/10 border border-purple-500/30 rounded-lg p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-purple-500/20 p-2 rounded-lg flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Assistant Wizard IA en 5 Étapes</h3>
                  <p className="text-slate-300 text-sm mb-4">
                    L'IA peut vous guider pour enrichir automatiquement votre projet :
                  </p>
                  <ul className="space-y-2 text-slate-300 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span>Identification des risques potentiels</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span>Suggestions de décisions stratégiques</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span>Génération de scénarios prévisionnels</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span>Définition d'objectifs SMART</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span>Rapport IA synthétique</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="continue_wizard"
                  value="true"
                  className="w-5 h-5 rounded border-white/20 bg-slate-800/50 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-white font-medium">
                  Continuer avec le Wizard IA après création
                </span>
              </label>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 px-6 rounded-lg hover:shadow-xl hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Création en cours...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Créer le Projet</span>
                </>
              )}
            </button>
            <Link
              href="/cockpit/pro"
              className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold rounded-lg transition-all"
            >
              Annuler
            </Link>
          </div>
        </form>
        
        {/* Aide contextuelle */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <h3 className="text-white font-semibold mb-3">💡 Conseils pour un projet réussi</h3>
          <ul className="space-y-2 text-slate-300 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-indigo-400 mt-1">•</span>
              <span>Soyez précis dans la description pour obtenir de meilleures suggestions IA</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-400 mt-1">•</span>
              <span>Vous pourrez toujours modifier ces informations plus tard</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-400 mt-1">•</span>
              <span>Le Wizard IA est optionnel mais fortement recommandé pour les nouveaux projets</span>
            </li>
          </ul>
        </div>
        
      </div>
    </div>
  );
}
