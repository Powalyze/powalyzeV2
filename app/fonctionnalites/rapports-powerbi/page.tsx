"use client";

import React from 'react';
import Link from 'next/link';
import { Sparkles, FileText, Download, Share2, BarChart3, TrendingUp, CheckCircle } from 'lucide-react';

export default function RapportsPowerBIPage() {
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
              <FileText className="w-10 h-10 text-amber-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                Rapports Power BI
              </span>
            </h1>
            <p className="text-xl text-blue-300 max-w-2xl mx-auto">
              Intégration native avec Power BI pour des rapports professionnels et des analyses approfondies.
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Intégration Power BI Native</h2>
              <p className="text-white/80 leading-relaxed mb-6">
                Connectez directement Powalyze à Power BI et créez des rapports personnalisés 
                avec toutes vos données projet. Aucune exportation manuelle nécessaire.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <BarChart3 className="w-8 h-8 text-amber-400 mb-3" />
                  <h3 className="text-white font-semibold mb-2">Connecteur direct</h3>
                  <p className="text-white/60 text-sm">Synchronisation en temps réel</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <TrendingUp className="w-8 h-8 text-blue-400 mb-3" />
                  <h3 className="text-white font-semibold mb-2">Templates prêts</h3>
                  <p className="text-white/60 text-sm">Bibliothèque de modèles</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <Share2 className="w-8 h-8 text-green-400 mb-3" />
                  <h3 className="text-white font-semibold mb-2">Partage facilité</h3>
                  <p className="text-white/60 text-sm">Distribution automatique</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Rapports Prédéfinis</h2>
              <p className="text-white/80 leading-relaxed mb-6">
                Accédez à une bibliothèque de rapports prêts à l'emploi conçus par des experts PMO. 
                Personnalisez-les selon vos besoins ou créez les vôtres from scratch.
              </p>
              <ul className="space-y-3">
                {[
                  "Tableau de bord exécutif",
                  "Analyse de portefeuille",
                  "Performance financière",
                  "Utilisation des ressources",
                  "Analyse des risques",
                  "Reporting mensuel/trimestriel"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/80">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Export Multi-Format</h2>
              <p className="text-white/80 leading-relaxed mb-6">
                Exportez vos rapports dans le format de votre choix : PDF, Excel, PowerPoint, ou publiez-les 
                directement dans Power BI Service pour un accès web.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <Download className="w-8 h-8 text-amber-400 mb-3" />
                  <h3 className="text-white font-semibold mb-2">Exports programmés</h3>
                  <p className="text-white/60 text-sm">Envoi automatique selon calendrier</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <Share2 className="w-8 h-8 text-blue-400 mb-3" />
                  <h3 className="text-white font-semibold mb-2">Distribution intelligente</h3>
                  <p className="text-white/60 text-sm">Envoyer aux bons interlocuteurs</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Collaboration Avancée</h2>
              <p className="text-white/80 leading-relaxed">
                Partagez vos rapports avec votre équipe, ajoutez des commentaires, et suivez les versions. 
                Tout est centralisé dans Powalyze.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-semibold rounded-xl transition-all shadow-lg shadow-amber-500/20">
              <FileText className="w-5 h-5" />
              Créer mes rapports
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

