"use client";

import React from 'react';
import Link from 'next/link';
import { Sparkles, Zap, ArrowRight, Clock, Repeat, CheckCircle, Workflow } from 'lucide-react';

export default function AutomatisationPage() {
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
              <Zap className="w-10 h-10 text-amber-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                Automatisation
              </span>
            </h1>
            <p className="text-xl text-blue-300 max-w-2xl mx-auto">
              Automatisez vos workflows et gagnez jusqu'à 60% de temps sur les tâches répétitives.
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Workflows Intelligents</h2>
              <p className="text-white/80 leading-relaxed mb-6">
                Créez des workflows automatisés sans coder. Définissez des déclencheurs, des conditions, 
                et des actions pour automatiser n'importe quel processus métier.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <Repeat className="w-8 h-8 text-amber-400 mb-3" />
                  <h3 className="text-white font-semibold mb-2">Tâches récurrentes</h3>
                  <p className="text-white/60 text-sm">Éliminez les répétitions</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <Workflow className="w-8 h-8 text-blue-400 mb-3" />
                  <h3 className="text-white font-semibold mb-2">Processus complexes</h3>
                  <p className="text-white/60 text-sm">Workflows multi-étapes</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <Clock className="w-8 h-8 text-green-400 mb-3" />
                  <h3 className="text-white font-semibold mb-2">Gain de temps</h3>
                  <p className="text-white/60 text-sm">Jusqu'à 60% d'économie</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Exemples d'Automatisation</h2>
              <p className="text-white/80 leading-relaxed mb-6">
                Automatisez les tâches les plus courantes de la gestion de projet et concentrez-vous 
                sur ce qui compte vraiment : la création de valeur.
              </p>
              <ul className="space-y-3">
                {[
                  "Notification automatique des dépassements budgétaires",
                  "Génération de rapports hebdomadaires",
                  "Affectation automatique des ressources",
                  "Escalade des risques critiques",
                  "Mise à jour des statuts projet",
                  "Synchronisation avec outils tiers"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/80">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Intégrations Natives</h2>
              <p className="text-white/80 leading-relaxed mb-6">
                Connectez Powalyze à vos outils favoris : Slack, Teams, Jira, Azure DevOps, ServiceNow, et plus encore. 
                Créez des workflows cross-platform sans effort.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <h3 className="text-white font-semibold mb-2">Déclencheurs</h3>
                  <p className="text-white/60 text-sm">Lancez des workflows sur événements (nouveau projet, risque détecté, etc.)</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <h3 className="text-white font-semibold mb-2">Actions</h3>
                  <p className="text-white/60 text-sm">Envoi d'emails, création de tickets, mise à jour de statuts</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">ROI Mesurable</h2>
              <p className="text-white/80 leading-relaxed">
                Nos clients économisent en moyenne 12 heures par semaine grâce à l'automatisation. 
                Suivez vos gains de productivité avec des métriques détaillées.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-semibold rounded-xl transition-all shadow-lg shadow-amber-500/20">
              <Zap className="w-5 h-5" />
              Automatiser mes workflows
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
