"use client";

import React from 'react';
import Link from 'next/link';
import { Sparkles, Brain, Zap, Target, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

export default function IntelligenceIAPage() {
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
                Intelligence IA
              </span>
            </h1>
            <p className="text-xl text-blue-300 max-w-2xl mx-auto">
              Recevez des recommandations intelligentes pour améliorer la performance de votre portefeuille.
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Insights Prédictifs</h2>
              <p className="text-white/80 leading-relaxed mb-6">
                Notre IA analyse en continu vos données projet pour vous fournir des insights actionnables. 
                Anticipez les problèmes avant qu'ils ne surviennent et optimisez vos décisions.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <Target className="w-8 h-8 text-amber-400 mb-3" />
                  <h3 className="text-white font-semibold mb-2">Recommandations</h3>
                  <p className="text-white/60 text-sm">Actions prioritaires suggérées</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <AlertTriangle className="w-8 h-8 text-orange-400 mb-3" />
                  <h3 className="text-white font-semibold mb-2">Alertes précoces</h3>
                  <p className="text-white/60 text-sm">Détection automatique des risques</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <TrendingUp className="w-8 h-8 text-green-400 mb-3" />
                  <h3 className="text-white font-semibold mb-2">Opportunités</h3>
                  <p className="text-white/60 text-sm">Identification des gains potentiels</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Apprentissage Continu</h2>
              <p className="text-white/80 leading-relaxed mb-6">
                Plus vous utilisez Powalyze, plus l'IA devient précise. Elle apprend de vos décisions 
                et s'adapte à votre contexte organisationnel unique.
              </p>
              <ul className="space-y-3">
                {[
                  "Modèles adaptatifs à votre industrie",
                  "Amélioration continue de la précision",
                  "Personnalisation des recommandations",
                  "Intégration de vos feedbacks"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/80">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Automatisation Intelligente</h2>
              <p className="text-white/80 leading-relaxed">
                L'IA ne se contente pas d'analyser : elle agit. Automatisez les tâches répétitives, 
                générez des rapports intelligents et laissez l'IA optimiser vos processus.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-semibold rounded-xl transition-all shadow-lg shadow-amber-500/20">
              <Brain className="w-5 h-5" />
              Activer l'Intelligence IA
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
