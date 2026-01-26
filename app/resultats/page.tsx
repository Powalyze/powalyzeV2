"use client";

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { 
  TrendingUp, TrendingDown, Clock, Award, CheckCircle, 
  Target, Shield, Zap, Users, DollarSign, BarChart3,
  Brain, Sparkles, ChevronRight, Rocket
} from 'lucide-react';
import Link from 'next/link';

export default function ResultsPage() {
  const caseStudies = [
    {
      client: "Groupe Industriel CAC40",
      sector: "Manufacturing & Supply Chain",
      challenge: "Gouvernance de 23 projets stratégiques sans visibilité temps réel. Risques détectés trop tard. Reporting manuel chronophage (3 jours/semaine).",
      solution: [
        "Déploiement Cockpit Powalyze complet en 3 semaines",
        "Intégrations ERP SAP + CRM Salesforce + GitHub",
        "Dashboards Power BI exécutifs pour COMEX",
        "Automatisation détection risques IA",
        "Formation 12 Project Managers"
      ],
      results: [
        { metric: "-67%", label: "Temps de reporting", trend: "down", color: "text-green-400" },
        { metric: "+92%", label: "Visibilité temps réel", trend: "up", color: "text-blue-400" },
        { metric: "3", label: "Risques critiques évités", trend: "up", color: "text-amber-400" },
        { metric: "-450K€", label: "Budget économisé", trend: "down", color: "text-green-400" },
        { metric: "J+1", label: "Opérationnel", trend: "neutral", color: "text-purple-400" }
      ],
      quote: "Fabrice a transformé notre gouvernance. Nous avons maintenant une vision prédictive que nous n'avions jamais eue.",
      author: "Marie Laurent, CFO",
      duration: "3 semaines setup + 6 mois accompagnement",
      impact: "ROI 340% la première année",
      color: "from-blue-600 to-indigo-600"
    },
    {
      client: "Scale-up Fintech",
      sector: "Financial Services & Banking",
      challenge: "Croissance rapide (50→180 personnes en 18 mois). Perte de contrôle sur 8 produits simultanés. Données éparpillées. Pas de PMO.",
      solution: [
        "Mise en place gouvernance agile avec Powalyze",
        "Création modèle de données unifié",
        "Dashboards Power BI product-market fit",
        "Automatisation workflows Slack + GitHub + Supabase",
        "Rôle de PMO exécutif pendant 9 mois"
      ],
      results: [
        { metric: "+85%", label: "Vélocité équipes", trend: "up", color: "text-green-400" },
        { metric: "-58%", label: "Time-to-market", trend: "down", color: "text-green-400" },
        { metric: "100%", label: "Visibilité produits", trend: "up", color: "text-blue-400" },
        { metric: "0", label: "Deadline manquée", trend: "neutral", color: "text-amber-400" },
        { metric: "12", label: "Roadmaps synchronisées", trend: "up", color: "text-purple-400" }
      ],
      quote: "Il est arrivé avec son cockpit et nous étions opérationnels en 48h. Impressionnant. Notre board a adoré les dashboards.",
      author: "Thomas Dubois, CTO",
      duration: "9 mois mission PMO",
      impact: "Série B levée 6 mois avant prévisions",
      color: "from-purple-600 to-pink-600"
    },
    {
      client: "Banque Privée Suisse",
      sector: "Wealth Management",
      challenge: "Conformité réglementaire complexe. 15 projets IT simultanés. Besoin de reporting exécutif pour régulateurs. Dashboards Excel obsolètes.",
      solution: [
        "Refonte complète architecture Power BI",
        "Création dashboards conformité temps réel",
        "Modélisation données multi-sources (Core Banking, CRM, Compliance)",
        "Automatisation rapports régulateurs (FINMA)",
        "Formation équipe Data (6 personnes)"
      ],
      results: [
        { metric: "-73%", label: "Temps rapports FINMA", trend: "down", color: "text-green-400" },
        { metric: "+100%", label: "Conformité temps réel", trend: "up", color: "text-blue-400" },
        { metric: "24/7", label: "Monitoring live", trend: "neutral", color: "text-amber-400" },
        { metric: "0", label: "Audit findings", trend: "neutral", color: "text-green-400" },
        { metric: "18", label: "Dashboards premium", trend: "up", color: "text-purple-400" }
      ],
      quote: "Les dashboards sont devenus notre outil de pilotage stratégique quotidien. Narratifs, prédictifs, actionnables.",
      author: "Sophie Martin, VP Programs",
      duration: "6 semaines Data + 3 mois Power BI",
      impact: "Audit FINMA passé sans remarques",
      color: "from-amber-600 to-orange-600"
    }
  ];

  const metrics = [
    { 
      value: "23", 
      label: "Clients accompagnés", 
      description: "CAC40, scale-ups, banques privées",
      icon: <Users className="w-8 h-8 text-blue-400" />
    },
    { 
      value: "180+", 
      label: "Projets pilotés", 
      description: "Gouvernance multi-projets complexes",
      icon: <Target className="w-8 h-8 text-purple-400" />
    },
    { 
      value: "94%", 
      label: "Taux de succès", 
      description: "Objectifs atteints ou dépassés",
      icon: <Award className="w-8 h-8 text-amber-400" />
    },
    { 
      value: "4.8M€", 
      label: "Budgets économisés", 
      description: "Détection proactive des risques",
      icon: <DollarSign className="w-8 h-8 text-green-400" />
    },
    { 
      value: "-67%", 
      label: "Temps reporting", 
      description: "Moyenne sur 23 clients",
      icon: <Clock className="w-8 h-8 text-blue-400" />
    },
    { 
      value: "340%", 
      label: "ROI moyen", 
      description: "Première année d'utilisation",
      icon: <TrendingUp className="w-8 h-8 text-green-400" />
    }
  ];

  const impacts = [
    {
      category: "Visibilité",
      items: [
        "Vision 360° temps réel du portefeuille",
        "Dashboards exécutifs narratifs",
        "Alertes proactives sur anomalies",
        "Reporting automatisé hebdo/mensuel"
      ],
      icon: <BarChart3 className="w-6 h-6 text-blue-400" />,
      color: "border-blue-500/30"
    },
    {
      category: "Décisions",
      items: [
        "Détection risques 3-6 semaines avant",
        "Scénarios What-If en temps réel",
        "Recommandations IA actionnables",
        "Simulations d'impact budget/timeline"
      ],
      icon: <Brain className="w-6 h-6 text-purple-400" />,
      color: "border-purple-500/30"
    },
    {
      category: "Performance",
      items: [
        "Vélocité +85% moyenne",
        "Time-to-market -58%",
        "Charge équipes optimisée",
        "Réallocation auto des ressources"
      ],
      icon: <Zap className="w-6 h-6 text-amber-400" />,
      color: "border-amber-500/30"
    },
    {
      category: "Conformité",
      items: [
        "Audits passés sans remarques",
        "Traçabilité complète",
        "Rapports régulateurs auto",
        "Governance workflows certifiés"
      ],
      icon: <Shield className="w-6 h-6 text-green-400" />,
      color: "border-green-500/30"
    }
  ];

  return (
    <AppShell>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        
        {/* Hero */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-slate-900 to-blue-900/20"></div>
          
          <div className="relative max-w-7xl mx-auto px-6 py-24">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-6 py-2 mb-4">
                <CheckCircle className="w-4 h-4 text-green-400 animate-pulse" />
                <span className="text-sm text-green-300">Résultats Mesurables • Impact Quantifié</span>
              </div>
              
              <h1 className="text-6xl font-bold">
                <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 bg-clip-text text-transparent">
                  Études de Cas
                </span>
                <br />
                <span className="text-white">Résultats concrets, impact mesurable</span>
              </h1>
              
              <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                23 clients accompagnés. 180+ projets pilotés. 4.8M€ économisés. 94% de taux de succès.
                <br />
                <span className="text-blue-400 font-semibold">Découvrez comment j'ai transformé leur gouvernance.</span>
              </p>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-6 gap-6">
            {metrics.map((metric, i) => (
              <div key={i} className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-slate-700 hover:scale-105 transition-all duration-300 group">
                <div className="mb-4 opacity-80 group-hover:opacity-100 transition-opacity">
                  {metric.icon}
                </div>
                <p className="text-4xl font-bold text-white mb-2">{metric.value}</p>
                <p className="text-sm font-semibold text-slate-300 mb-1">{metric.label}</p>
                <p className="text-xs text-slate-500">{metric.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Case Studies */}
        <div className="max-w-7xl mx-auto px-6 py-16 space-y-16">
          {caseStudies.map((study, i) => (
            <div key={i} className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${study.color}`}></div>
              
              <div className="p-12">
                {/* Header */}
                <div className="grid grid-cols-3 gap-6 mb-8 pb-8 border-b border-slate-700">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Client</p>
                    <p className="text-xl font-bold text-white">{study.client}</p>
                    <p className="text-sm text-blue-400">{study.sector}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Durée</p>
                    <p className="text-lg font-semibold text-white">{study.duration}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Impact</p>
                    <p className="text-lg font-semibold text-amber-400">{study.impact}</p>
                  </div>
                </div>

                {/* Challenge */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-red-400 mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Défi initial
                  </h3>
                  <p className="text-slate-300 text-lg">{study.challenge}</p>
                </div>

                {/* Solution */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
                    <Rocket className="w-5 h-5" />
                    Solution mise en place
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {study.solution.map((item, j) => (
                      <div key={j} className="flex items-start gap-2 text-slate-300">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Results */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Résultats mesurables
                  </h3>
                  <div className="grid grid-cols-5 gap-4">
                    {study.results.map((result, j) => (
                      <div key={j} className="bg-slate-800/50 p-4 rounded-xl text-center border border-slate-700">
                        <p className={`text-3xl font-bold ${result.color} mb-1`}>{result.metric}</p>
                        <p className="text-xs text-slate-400">{result.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quote */}
                <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 p-6 rounded-xl border border-purple-500/30">
                  <div className="flex items-start gap-4">
                    <Sparkles className="w-8 h-8 text-purple-400 flex-shrink-0" />
                    <div>
                      <p className="text-lg text-slate-300 italic mb-3">"{study.quote}"</p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600"></div>
                        <div>
                          <p className="font-semibold text-white">{study.author}</p>
                          <p className="text-sm text-slate-400">{study.client}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Impacts Grid */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">4 catégories d'impact</h2>
            <p className="text-lg text-slate-400">Les bénéfices mesurables d'une gouvernance augmentée</p>
          </div>
          
          <div className="grid grid-cols-4 gap-6">
            {impacts.map((impact, i) => (
              <div key={i} className={`bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border ${impact.color} hover:scale-105 transition-all duration-300`}>
                <div className="mb-4">
                  {impact.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{impact.category}</h3>
                <ul className="space-y-2">
                  {impact.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-slate-300">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0 mt-1.5"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 p-12 rounded-2xl text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Prêt à obtenir des résultats similaires ?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Discutons de vos enjeux et définissons ensemble comment transformer votre gouvernance avec des résultats mesurables.
            </p>
            <div className="flex justify-center gap-4">
              <Link 
                href="/contact"
                className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                Planifier un échange
                <ChevronRight className="w-5 h-5" />
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

