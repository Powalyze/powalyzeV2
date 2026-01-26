"use client";

import React from 'react';
import Link from 'next/link';
import { Sparkles, Brain, TrendingUp, Zap, Shield, Clock, Target } from 'lucide-react';

export default function IAPredictivePage() {
  return (
    <div className="min-h-screen bg-black">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-amber-500/20">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
              Powalyze
            </span>
          </Link>
          <Link href="/register" className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black text-sm font-medium rounded-xl transition-all shadow-lg shadow-amber-500/20">
            Commencer
          </Link>
        </div>
      </nav>

      <div className="pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Brain className="w-10 h-10 text-amber-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                IA Prédictive
              </span>
            </h1>
            <p className="text-xl text-blue-300 max-w-2xl mx-auto">
              Anticipez les risques et optimisez vos ressources avec l'analyse prédictive avancée.
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl border border-indigo-500/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Prédiction des Risques</h2>
              <p className="text-slate-300 leading-relaxed mb-6">
                Notre moteur d'IA analyse en continu vos projets pour identifier les risques potentiels avant qu'ils ne deviennent critiques. 
                Grâce au machine learning, la plateforme apprend de vos données historiques et s'améliore constamment.
              </p>
              <ul className="space-y-3">
                {[
                  "Détection précoce des dérives budgétaires",
                  "Identification des goulots d'étranglement de ressources",
                  "Prévision des retards basée sur les tendances",
                  "Alertes intelligentes personnalisables"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300">
                    <Zap className="w-5 h-5 text-purple-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl border border-indigo-500/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Optimisation des Ressources</h2>
              <p className="text-slate-300 leading-relaxed mb-6">
                L'IA recommande la meilleure allocation de vos ressources en temps réel, en tenant compte des compétences, 
                de la disponibilité et des priorités stratégiques.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-800/30 rounded-xl p-4">
                  <Target className="w-8 h-8 text-amber-400 mb-3" />
                  <h3 className="text-white font-semibold mb-2">Allocation Optimale</h3>
                  <p className="text-slate-400 text-sm">Affectation automatique basée sur les compétences et la charge</p>
                </div>
                <div className="bg-slate-800/30 rounded-xl p-4">
                  <TrendingUp className="w-8 h-8 text-blue-400 mb-3" />
                  <h3 className="text-white font-semibold mb-2">Prévision de Charge</h3>
                  <p className="text-slate-400 text-sm">Anticipation des pics d'activité et besoins futurs</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Modèles Prédictifs</h2>
              <p className="text-slate-300 leading-relaxed">
                Nos algorithmes utilisent des techniques avancées de machine learning (régression, réseaux neuronaux, Random Forest) 
                pour créer des modèles prédictifs précis adaptés à votre contexte métier unique.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-purple-500/25">
              Essayer l'IA Prédictive
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

