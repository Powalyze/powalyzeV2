"use client";

import React from 'react';
import Link from 'next/link';
import { Sparkles, LayoutDashboard, Gauge, BarChart, Grid, Sliders, CheckCircle } from 'lucide-react';

export default function TableauxDeBordPage() {
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
              <LayoutDashboard className="w-10 h-10 text-amber-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                Tableaux de Bord
              </span>
            </h1>
            <p className="text-xl text-blue-300 max-w-2xl mx-auto">
              Visualisez vos KPIs en temps réel avec des dashboards interactifs et personnalisables.
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Dashboards en Temps Réel</h2>
              <p className="text-white/80 leading-relaxed mb-6">
                Suivez vos projets en temps réel avec des tableaux de bord qui se mettent à jour automatiquement. 
                Visualisez instantanément l'état de votre portefeuille.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <Gauge className="w-8 h-8 text-amber-400 mb-3" />
                  <h3 className="text-white font-semibold mb-2">KPIs Essentiels</h3>
                  <p className="text-white/60 text-sm">Indicateurs de performance clés</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <BarChart className="w-8 h-8 text-blue-400 mb-3" />
                  <h3 className="text-white font-semibold mb-2">Graphiques avancés</h3>
                  <p className="text-white/60 text-sm">Visualisations riches et interactives</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <Grid className="w-8 h-8 text-green-400 mb-3" />
                  <h3 className="text-white font-semibold mb-2">Layouts flexibles</h3>
                  <p className="text-white/60 text-sm">Organisez selon vos besoins</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Personnalisation Totale</h2>
              <p className="text-white/80 leading-relaxed mb-6">
                Créez vos propres dashboards adaptés à votre rôle. Glissez-déposez les widgets, 
                ajustez les tailles, et sauvegardez vos configurations préférées.
              </p>
              <ul className="space-y-3">
                {[
                  "Drag & drop intuitif des widgets",
                  "Bibliothèque de 50+ composants visuels",
                  "Thèmes personnalisables",
                  "Partage de dashboards avec l'équipe"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/80">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Filtres Intelligents</h2>
              <p className="text-white/80 leading-relaxed">
                Affinez votre vue avec des filtres puissants : par projet, département, période, ou tout critère personnalisé. 
                Sauvegardez vos vues favorites pour y accéder en un clic.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-semibold rounded-xl transition-all shadow-lg shadow-amber-500/20">
              <LayoutDashboard className="w-5 h-5" />
              Créer mon dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
