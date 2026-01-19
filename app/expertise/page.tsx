"use client";

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { 
  Target, Brain, BarChart3, Sparkles, Zap, Shield, 
  TrendingUp, Users, Clock, Award, ChevronRight,
  Rocket, Database, LineChart, Cpu
} from 'lucide-react';
import Link from 'next/link';

export default function ExpertisePage() {
  const expertiseAreas = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "PMO Augmenté",
      description: "Pas un PMO classique. Un PMO équipé de son propre cockpit exécutif intelligent.",
      features: [
        "Cockpit complet dès le premier jour",
        "Gouvernance prédictive par IA",
        "Pilotage multi-projets temps réel",
        "Automatisation des comités",
        "Détection proactive des risques"
      ],
      color: "from-blue-600 to-indigo-600"
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Data Analyst Stratégique",
      description: "Transformation des données brutes en décisions exécutives actionnables.",
      features: [
        "Analyse multi-sources (ERP, CRM, GitHub)",
        "Détection d'anomalies automatique",
        "Corrélations risques/budget/délais",
        "Prédictions basées sur historiques",
        "Dashboards exécutifs narratifs"
      ],
      color: "from-purple-600 to-pink-600"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Expert Power BI Premium",
      description: "Dashboards qui racontent une histoire et orientent la stratégie.",
      features: [
        "Modélisation données complexes",
        "Visualisations narratives",
        "Rapports auto-générés",
        "Synchronisation temps réel",
        "Optimisation performances"
      ],
      color: "from-amber-600 to-orange-600"
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "Architecte SaaS & IA",
      description: "Création de systèmes nerveux exécutifs avec IA prédictive intégrée.",
      features: [
        "Cockpits sur-mesure",
        "Intégrations intelligentes",
        "Automatisations conversationnelles",
        "Auto-healing des anomalies",
        "Scénarios What-If en temps réel"
      ],
      color: "from-green-600 to-emerald-600"
    }
  ];

  const differentiators = [
    {
      icon: <Rocket className="w-6 h-6 text-amber-400" />,
      title: "J'apporte mon propre outil",
      description: "Vous recrutez un PMO ? Vous obtenez un PMO + un cockpit exécutif complet. Opérationnel dès le premier jour."
    },
    {
      icon: <Brain className="w-6 h-6 text-purple-400" />,
      title: "Multi-compétences rares",
      description: "PMO + Data Analyst + Power BI + Développement SaaS. Profil unique qui couvre toute la chaîne de valeur."
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-green-400" />,
      title: "Orienté décisions, pas reporting",
      description: "Je ne crée pas des rapports. Je crée des systèmes qui prennent des décisions prédictives à votre place."
    },
    {
      icon: <Zap className="w-6 h-6 text-blue-400" />,
      title: "Autonomie totale",
      description: "J'arrive avec mes méthodes, mes cockpits, mes dashboards, mes automatisations. Vous gagnez 6 mois de setup."
    },
    {
      icon: <Award className="w-6 h-6 text-amber-400" />,
      title: "Positionnement premium",
      description: "Rigueur suisse, vision internationale, approche exécutive. Je travaille avec les décideurs stratégiques."
    },
    {
      icon: <Shield className="w-6 h-6 text-indigo-400" />,
      title: "Gouvernance augmentée",
      description: "Je ne fais pas que piloter vos projets. Je crée un système nerveux exécutif qui pilote lui-même."
    }
  ];

  const results = [
    { value: "-67%", label: "Temps de reporting", color: "text-green-400" },
    { value: "+340%", label: "Visibilité temps réel", color: "text-blue-400" },
    { value: "-52%", label: "Risques non détectés", color: "text-green-400" },
    { value: "+89%", label: "Décisions prédictives", color: "text-purple-400" },
    { value: "J+1", label: "Opérationnel", color: "text-amber-400" },
    { value: "1", label: "PMO = 1 équipe complète", color: "text-indigo-400" }
  ];

  return (
    <AppShell>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-slate-900 to-blue-900/20"></div>
          <div className="absolute inset-0">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-white rounded-full animate-pulse"
                style={{
                  width: `${Math.random() * 3}px`,
                  height: `${Math.random() * 3}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  opacity: Math.random() * 0.5,
                }}
              ></div>
            ))}
          </div>
          
          <div className="relative max-w-7xl mx-auto px-6 py-24">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 rounded-full px-6 py-2 mb-4">
                <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                <span className="text-sm text-purple-300">Architecte de Cockpits Exécutifs & Gouvernance Augmentée par IA</span>
              </div>
              
              <h1 className="text-6xl font-bold">
                <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 bg-clip-text text-transparent">
                  Pourquoi travailler
                </span>
                <br />
                <span className="text-white">avec Fabrice ?</span>
              </h1>
              
              <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Je ne suis pas un PMO classique. Je suis un <span className="text-amber-400 font-semibold">PMO augmenté</span> par mon propre SaaS, 
                un <span className="text-purple-400 font-semibold">Data Analyst stratégique</span> qui transforme les données en décisions, 
                et un <span className="text-blue-400 font-semibold">architecte Power BI</span> qui crée des cockpits exécutifs vivants.
              </p>
              
              <p className="text-2xl text-blue-400 font-semibold">
                Vous recrutez 1 PMO. Vous obtenez 1 équipe complète + 1 cockpit intelligent.
              </p>
              
              <div className="flex justify-center gap-4 pt-6">
                <Link 
                  href="/services"
                  className="px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
                >
                  Voir mes services
                  <ChevronRight className="w-5 h-5" />
                </Link>
                <Link 
                  href="/contact"
                  className="px-8 py-4 bg-slate-800 border border-slate-600 text-white rounded-xl font-semibold hover:bg-slate-700 hover:border-blue-500 transition-all duration-300"
                >
                  Me contacter
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-6 gap-6">
            {results.map((result, i) => (
              <div key={i} className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-slate-700 text-center hover:scale-105 transition-all duration-300">
                <p className={`text-4xl font-bold ${result.color} mb-2`}>{result.value}</p>
                <p className="text-sm text-slate-400">{result.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Expertise Areas */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Un profil unique : 4 expertises en 1</h2>
            <p className="text-lg text-slate-400">La combinaison rare qui transforme la gouvernance de projets</p>
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            {expertiseAreas.map((area, i) => (
              <div key={i} className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-all duration-300 group">
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${area.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {area.icon}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3">{area.title}</h3>
                <p className="text-slate-400 mb-6">{area.description}</p>
                
                <div className="space-y-3">
                  {area.features.map((feature, j) => (
                    <div key={j} className="flex items-start gap-3">
                      <ChevronRight className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Differentiators */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Ce qui me rend différent</h2>
            <p className="text-lg text-slate-400">6 avantages compétitifs que personne d'autre n'apporte</p>
          </div>
          
          <div className="grid grid-cols-3 gap-6">
            {differentiators.map((diff, i) => (
              <div key={i} className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-slate-700 hover:border-purple-500/50 hover:scale-105 transition-all duration-300">
                <div className="mb-4">
                  {diff.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{diff.title}</h3>
                <p className="text-sm text-slate-400">{diff.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Value Proposition */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="bg-gradient-to-r from-purple-900/30 via-slate-800 to-blue-900/30 p-12 rounded-2xl border border-purple-500/30">
            <div className="grid grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-white mb-6">
                  Powalyze + Fabrice = <span className="text-amber-400">Gouvernance Augmentée</span>
                </h2>
                <p className="text-lg text-slate-300 mb-6">
                  Vous ne recrutez pas un consultant. Vous intégrez un <span className="text-purple-400 font-semibold">système nerveux exécutif</span> complet, 
                  incarné par un expert qui apporte son propre cockpit intelligent.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-slate-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Cockpit opérationnel dès le premier jour
                  </li>
                  <li className="flex items-center gap-3 text-slate-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Gouvernance prédictive par IA
                  </li>
                  <li className="flex items-center gap-3 text-slate-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Dashboards Power BI exécutifs
                  </li>
                  <li className="flex items-center gap-3 text-slate-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Automatisation des processus
                  </li>
                  <li className="flex items-center gap-3 text-slate-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Détection proactive des risques
                  </li>
                </ul>
                <Link 
                  href="/services"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  Découvrir mes services
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
              
              <div className="space-y-4">
                <div className="bg-slate-800 p-6 rounded-xl border border-green-500/30">
                  <h4 className="text-lg font-bold text-green-400 mb-2">✓ Avec moi</h4>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li>→ Cockpit intelligent dès J+1</li>
                    <li>→ IA qui détecte les risques avant vous</li>
                    <li>→ Dashboards qui racontent l'histoire</li>
                    <li>→ Automatisations qui décident</li>
                    <li>→ 1 personne = 1 équipe PMO Office</li>
                  </ul>
                </div>
                
                <div className="bg-slate-800 p-6 rounded-xl border border-red-500/30 opacity-60">
                  <h4 className="text-lg font-bold text-red-400 mb-2">✗ PMO classique</h4>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li>→ Setup manuel de 6 mois</li>
                    <li>→ Risques détectés en retard</li>
                    <li>→ Tableaux Excel statiques</li>
                    <li>→ Reporting manuel chronophage</li>
                    <li>→ Besoin d'une équipe complète</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Final */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-12 rounded-2xl text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Prêt à augmenter votre gouvernance ?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Discutons de vos enjeux stratégiques et découvrez comment je peux transformer votre pilotage de projets.
            </p>
            <div className="flex justify-center gap-4">
              <Link 
                href="/contact"
                className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 hover:scale-105 transition-all duration-300"
              >
                Planifier un échange
              </Link>
              <Link 
                href="/services"
                className="px-8 py-4 bg-blue-700 border border-blue-400 text-white rounded-xl font-semibold hover:bg-blue-800 transition-all duration-300"
              >
                Voir mes services
              </Link>
            </div>
          </div>
        </div>

      </div>
    </AppShell>
  );
}
