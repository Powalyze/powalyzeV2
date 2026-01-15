"use client";

import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      {/* Hero Section */}
      <div className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgb(148 163 184)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium mb-8">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            Plateforme de gouvernance augmentée par l'IA
          </div>

          {/* Main Headline */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-slate-50 via-amber-200 to-slate-50 bg-clip-text text-transparent leading-tight">
            Powalyze
          </h1>

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-slate-200 mb-6">
            Le système de gouvernance stratégique
            <br />
            <span className="text-amber-400">nouvelle génération</span>
          </h2>

          <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Pilotez votre portefeuille de projets avec une intelligence artificielle révolutionnaire.
            Digital Twin, analyse quantique, auto-healing, optimisation de portfolio en temps réel.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-16">
            <Link
              href="/cockpit"
              className="group relative px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-lg font-bold rounded-full shadow-[0_0_40px_rgba(251,191,36,0.5)] hover:shadow-[0_0_60px_rgba(251,191,36,0.7)] transition-all duration-300 hover:scale-105"
            >
              <span className="relative z-10">🚀 Accéder au Cockpit Démo</span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
            </Link>

            <a
              href="#features"
              className="px-8 py-4 bg-slate-800/50 backdrop-blur-xl border border-slate-700 text-slate-200 text-lg font-semibold rounded-full hover:bg-slate-800/70 hover:border-slate-600 transition-all duration-300"
            >
              Découvrir les fonctionnalités
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
              <div className="text-3xl font-bold text-amber-400 mb-2">8+</div>
              <div className="text-sm text-slate-400">Modules IA avancés</div>
            </div>
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
              <div className="text-3xl font-bold text-emerald-400 mb-2">99.9%</div>
              <div className="text-sm text-slate-400">Précision prédictive</div>
            </div>
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
              <div className="text-3xl font-bold text-sky-400 mb-2">-40%</div>
              <div className="text-sm text-slate-400">Risques détectés en avance</div>
            </div>
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
              <div className="text-3xl font-bold text-violet-400 mb-2">24/7</div>
              <div className="text-sm text-slate-400">Monitoring temps réel</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="text-slate-400 text-sm mb-2">Découvrir</div>
          <div className="h-8 w-px bg-gradient-to-b from-slate-400 to-transparent" />
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Fonctionnalités <span className="text-amber-400">révolutionnaires</span>
          </h2>
          <p className="text-xl text-slate-400 text-center mb-16 max-w-3xl mx-auto">
            Une suite complète d&apos;outils d&apos;intelligence artificielle pour transformer votre gouvernance
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🔮",
                title: "Digital Twin",
                description: "Jumeau numérique en temps réel de vos projets avec prédictions ML et recommandations autonomes"
              },
              {
                icon: "⚛️",
                title: "Analyse Quantique",
                description: "Simulations Monte Carlo pour explorer tous les futurs possibles de votre portefeuille"
              },
              {
                icon: "🏥",
                title: "Auto-Healing",
                description: "Détection et correction automatique des problèmes avant qu'ils n'impactent vos projets"
              },
              {
                icon: "🧠",
                title: "NLP Sentiment",
                description: "Analyse des communications d'équipe pour détecter tensions et opportunités"
              },
              {
                icon: "📊",
                title: "Portfolio Optimization",
                description: "Recommandations IA pour optimiser l'allocation des ressources et maximiser la valeur"
              },
              {
                icon: "🔗",
                title: "Blockchain Audit",
                description: "Piste d'audit immuable avec hachage cryptographique pour une conformité totale"
              },
              {
                icon: "🎤",
                title: "Voice Commands",
                description: "Contrôle vocal avec NLP pour piloter votre cockpit mains libres"
              },
              {
                icon: "🌌",
                title: "Vue Galactique",
                description: "Visualisation immersive de votre écosystème projet en temps réel"
              },
              {
                icon: "⚡",
                title: "Décisions Augmentées",
                description: "Portail de décision avec scoring IA et évaluation multi-critères"
              }
            ].map((feature, i) => (
              <div
                key={i}
                className="group bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800/70 rounded-3xl p-6 hover:border-amber-500/50 hover:shadow-[0_0_40px_rgba(251,191,36,0.2)] transition-all duration-300 hover:scale-105"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-slate-50 mb-3 group-hover:text-amber-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-amber-500/10 to-sky-500/10 border border-amber-500/30 rounded-3xl p-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Prêt à transformer votre gouvernance ?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Explorez le cockpit de démonstration et découvrez la puissance de l&apos;IA appliquée à la gestion de portefeuille
          </p>
          <Link
            href="/cockpit"
            className="inline-block px-10 py-5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xl font-bold rounded-full shadow-[0_0_40px_rgba(251,191,36,0.5)] hover:shadow-[0_0_60px_rgba(251,191,36,0.7)] transition-all duration-300 hover:scale-105"
          >
            🎯 Lancer la démo interactive
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800/70 py-8 px-6">
        <div className="max-w-7xl mx-auto text-center text-slate-400 text-sm">
          <p>© 2026 Powalyze. Plateforme de gouvernance augmentée par IA.</p>
          <p className="mt-2">Digital Twin • Quantum Analysis • Auto-Healing • Portfolio Optimization</p>
        </div>
      </footer>
    </div>
  );
}
