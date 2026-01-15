"use client";

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, X, TrendingUp, Users, Brain, Shield, Zap, Target } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      {/* Hero Section */}
      <div className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 overflow-hidden">
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

        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium mb-8">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            Plateforme de gouvernance augmentée par l'IA
          </div>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 text-slate-50 leading-tight">
            Pilotage portefeuille et gouvernance exécutive — IA, PMO, Power BI
          </h1>

          <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Vue 360° unifiée pour le pilotage stratégique des projets, la gestion des risques et la prise de décision COMEX. Automatisation IA, rapports Power BI natifs, multi-tenant et conforme.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-16">
            <Link
              href="/cockpit"
              className="group relative px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-lg font-bold rounded-full shadow-[0_0_40px_rgba(251,191,36,0.5)] hover:shadow-[0_0_60px_rgba(251,191,36,0.7)] transition-all duration-300 hover:scale-105"
            >
              <span className="relative z-10">Découvrir le cockpit en démo live</span>
            </Link>

            <Link
              href="#contact"
              className="px-8 py-4 bg-slate-800/50 backdrop-blur-xl border border-slate-700 text-slate-200 text-lg font-semibold rounded-full hover:bg-slate-800/70 hover:border-slate-600 transition-all duration-300"
            >
              Parler de votre contexte avec un expert
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-sm">
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-lg p-4">
              <div className="text-2xl font-bold text-emerald-400 mb-1">323%</div>
              <div className="text-xs text-slate-400">Return on Investment</div>
            </div>
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-400 mb-1">3.7m</div>
              <div className="text-xs text-slate-400">Time to Value</div>
            </div>
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-400 mb-1">99.94%</div>
              <div className="text-xs text-slate-400">Uptime Guarantee</div>
            </div>
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-lg p-4">
              <div className="text-2xl font-bold text-amber-400 mb-1">ISO 27001</div>
              <div className="text-xs text-slate-400">SOC 2 • GDPR</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pour qui ? */}
      <div className="py-24 px-6 bg-slate-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Pour qui <span className="text-amber-400">?</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Organisations qui pilotent des portefeuilles multi-projets avec contraintes réglementaires
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 hover:border-amber-500/50 transition-all">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-2xl font-bold text-white mb-4">PMO Stratégiques</h3>
              <p className="text-slate-400 mb-4">
                Visibilité totale sur les projets, risques, budgets, jalons. Traçabilité réglementaire intégrée.
              </p>
              <p className="text-sm text-emerald-400">
                Gagnez 40% de temps administratif, réduisez 65% des incidents de reporting, accélérez 3x la préparation des comités.
              </p>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 hover:border-amber-500/50 transition-all">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-2xl font-bold text-white mb-4">Data & Analytics</h3>
              <p className="text-slate-400 mb-4">
                Dashboards Power BI natifs : KPI temps réel, analyses prédictives, rapports COMEX.
              </p>
              <p className="text-sm text-emerald-400">
                Automatisez 80% du reporting, intégration Azure Synapse, accès multi-source sécurisé.
              </p>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 hover:border-amber-500/50 transition-all">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-white mb-4">Directions Exécutives</h3>
              <p className="text-slate-400 mb-4">
                Synthèses exécutives, alertes prioritaires, simulations IA, gouvernance centralisée.
              </p>
              <p className="text-sm text-emerald-400">
                Prenez les décisions critiques avec 100% de visibilité, zéro arbitrage à l'aveugle.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ce que Powalyze remplace */}
      <div className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Ce que Powalyze <span className="text-amber-400">remplace</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-red-400 mb-6">AVANT</h3>
              <div className="space-y-3">
                {[
                  "Excel morcelé : 15 fichiers, versions contradictoires",
                  "Reporting manuel : 8h/semaine par chef de projet",
                  "Alertes tardives : risques découverts après impact",
                  "COMEX en aveugle : décisions sur données obsolètes",
                  "Conformité fragile : traçabilité impossible en audit"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-slate-300">
                    <X size={20} className="text-red-400 mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-emerald-400 mb-6">AVEC POWALYZE</h3>
              <div className="space-y-3">
                {[
                  "Source unique : toute l'organisation alignée sur 1 vérité",
                  "Automatisation : reporting généré automatiquement",
                  "IA prédictive : alertes avant impact critique",
                  "COMEX temps réel : vue unifiée en 3 clics",
                  "Conformité native : audit trail intégral, horodaté"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-slate-300">
                    <CheckCircle2 size={20} className="text-emerald-400 mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-500/10 to-emerald-500/10 border border-amber-500/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-center text-amber-400 mb-8">RÉSULTAT MESURÉ</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
              {[
                { value: "40%", label: "de temps PMO libéré pour l'analyse stratégique" },
                { value: "65%", label: "d'erreurs de reporting éliminées" },
                { value: "3x", label: "plus rapide : préparation COMEX en 20min vs 1h" },
                { value: "100%", label: "des risques critiques anticipés (vs 30% réactif)" },
                { value: "Zéro", label: "non-conformité en audit" }
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Services d'excellence */}
      <div className="py-24 px-6 bg-slate-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Services <span className="text-amber-400">d'excellence</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Target className="text-amber-400" size={32} />,
                title: "Pilotage stratégique",
                items: ["Structuration des portefeuilles", "Mise en place des comités", "Définition des indicateurs", "Méthodologie de pilotage"]
              },
              {
                icon: <Users className="text-blue-400" size={32} />,
                title: "PMO as a Service",
                items: ["PMO externalisé", "Expertise métier", "Support continu", "Montée en compétence"]
              },
              {
                icon: <TrendingUp className="text-emerald-400" size={32} />,
                title: "Data & Analytics",
                items: ["Modélisation des données", "Consolidation des sources", "Construction de référentiels", "Analyse avancée"]
              },
              {
                icon: <Brain className="text-purple-400" size={32} />,
                title: "IA Prédictive",
                items: ["Détection des signaux faibles", "Anticipation des dérives", "Simulation des scénarios", "Recommandations intelligentes"]
              }
            ].map((service, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-amber-500/50 transition-all">
                <div className="mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-white mb-4">{service.title}</h3>
                <ul className="space-y-2">
                  {service.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-slate-400">
                      <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Démo interactive */}
      <div className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Démo <span className="text-amber-400">interactive</span>
            </h2>
            <p className="text-xl text-slate-400">
              Découvrez la puissance de Powalyze en action
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Vue portefeuille consolidée",
                description: "Toutes vos initiatives en un coup d'œil avec métriques temps réel",
                features: ["847 projets actifs suivis", "€2.8M de valeur consolidée", "94.7% de taux de succès", "Vision stratégique unifiée"]
              },
              {
                title: "Comités exécutifs en temps réel",
                description: "Préparez vos COMEX en 20 minutes au lieu d'1 heure",
                features: ["Live streaming des décisions", "12 participants synchronisés", "Statuts visuels instantanés", "Documentation automatique"]
              },
              {
                title: "IA prédictive intégrée",
                description: "Détectez les risques avant qu'ils ne deviennent critiques",
                features: ["Signaux faibles analysés", "Alertes anticipées", "Simulations de scénarios", "Recommandations intelligentes"]
              }
            ].map((demo, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-amber-500/50 transition-all">
                <h3 className="text-xl font-bold text-white mb-3">{demo.title}</h3>
                <p className="text-slate-400 mb-4 text-sm">{demo.description}</p>
                <ul className="space-y-2">
                  {demo.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-slate-300">
                      <Zap size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Nos marchés prioritaires */}
      <div className="py-24 px-6 bg-slate-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Nos marchés <span className="text-amber-400">prioritaires</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
              <div className="text-4xl mb-4">🇨🇭</div>
              <h3 className="text-2xl font-bold text-white mb-4">SUISSE</h3>
              <p className="text-slate-300">
                Implanté en Suisse romande, Powalyze applique des standards de précision, de conformité et de fiabilité dignes des environnements les plus exigeants.
              </p>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
              <div className="text-4xl mb-4">🇫🇷</div>
              <h3 className="text-2xl font-bold text-white mb-4">FRANCE</h3>
              <p className="text-slate-300">
                En France, Powalyze accompagne les directions générales, PMO et DAF dans la structuration de portefeuilles et la préparation des comités stratégiques.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-amber-500/10 to-sky-500/10 border border-amber-500/30 rounded-3xl p-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Passez d'un pilotage réactif à un pilotage <span className="text-amber-400">intelligent</span>
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Transformez votre gouvernance avec Powalyze
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link
              href="/cockpit"
              className="inline-block px-10 py-5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xl font-bold rounded-full shadow-[0_0_40px_rgba(251,191,36,0.5)] hover:shadow-[0_0_60px_rgba(251,191,36,0.7)] transition-all duration-300 hover:scale-105"
            >
              Essayer gratuitement
            </Link>
            <a
              href="mailto:contact@powalyze.com"
              className="inline-block px-10 py-5 bg-slate-800/50 border border-slate-700 text-slate-200 text-xl font-semibold rounded-full hover:bg-slate-800/70 transition-all duration-300"
            >
              Parler à un expert
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800/70 py-12 px-6 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
                  <span className="text-slate-950 font-bold text-sm">P</span>
                </div>
                <span className="text-white font-bold text-lg">Powalyze</span>
              </div>
              <p className="text-sm text-slate-400">
                Cockpit de gouvernance augmentée. PMO, IA, Power BI, conformité et pilotage stratégique.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">PRODUIT</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>Portfolio Manager</li>
                <li>Cockpit Exécutif</li>
                <li>Analytics & IA</li>
                <li>Cognitive Theater</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">SERVICES</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>PMO as a Service</li>
                <li>Data & Analytics</li>
                <li>Gouvernance exécutive</li>
                <li>Accompagnement IA</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">CONTACT</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>contact@powalyze.com</li>
                <li>Suisse & France</li>
              </ul>
              <h4 className="text-white font-bold mb-4 mt-6">LÉGAL</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>Confidentialité</li>
                <li>CGU</li>
                <li>RGPD</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-center text-slate-400 text-sm">
            <p>© 2026 Powalyze. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
