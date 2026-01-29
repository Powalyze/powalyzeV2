"use client";

import Link from "next/link";
import { ArrowRight, Brain, Sparkles, Zap, Target, TrendingUp, BarChart3, FileText, Users, Shield } from "lucide-react";

export default function IAPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Hero Section */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm font-semibold mb-6">
            <Sparkles size={16} />
            <span>Powered by GPT-4</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400">
            IA Chief of Staff
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            L'intelligence artificielle qui analyse votre portefeuille 24/7<br className="hidden md:block" />
            et vous recommande les 6 actions stratégiques prioritaires.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/demo-interactive"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold text-lg shadow-lg transition-all"
            >
              Tester l'IA maintenant
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-purple-400/50 hover:border-purple-400 text-white font-semibold text-lg transition-all"
            >
              Parler à un expert
            </Link>
          </div>
        </div>
      </section>

      {/* What IA Does */}
      <section className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ce que l'IA fait pour vous</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Une analyse continue et proactive de votre portefeuille de projets
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <IAFeatureCard
              icon={<Brain size={48} />}
              title="Analyse 24/7"
              description="L'IA scanne en permanence vos 42 projets, 156 décisions et 89 risques pour identifier des patterns et anomalies."
              color="purple"
            />
            <IAFeatureCard
              icon={<Target size={48} />}
              title="6 Actions Prioritaires"
              description="Chaque jour, l'IA vous recommande 6 actions concrètes avec impact quantifié et niveau de confiance (0-100%)."
              color="pink"
            />
            <IAFeatureCard
              icon={<TrendingUp size={48} />}
              title="Prédictions Projets"
              description="Probabilité de livraison à temps (87%), risque budget (+12%), vélocité prédite (23 pts) avec confiance 94%."
              color="purple"
            />
          </div>
        </div>
      </section>

      {/* IA Capabilities */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Capacités de l'IA</h2>
            <p className="text-xl text-slate-300">Bien plus qu'un simple assistant</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <CapabilityCard
              title="Rapports narratifs automatiques"
              description="Génère des rapports exécutifs complets en français avec storytelling, insights et recommandations."
              icon={<FileText size={32} />}
            />
            <CapabilityCard
              title="Détection d'anomalies"
              description="Identifie automatiquement les dérives budgétaires, les retards projets et les risques émergents."
              icon={<Shield size={32} />}
            />
            <CapabilityCard
              title="Recommandations contextuelles"
              description="Adapte ses recommandations selon votre méthodologie (Agile, Hermès, Cycle en V, Hybride)."
              icon={<Zap size={32} />}
            />
            <CapabilityCard
              title="Analyse de sentiment"
              description="Analyse les commentaires et feedbacks pour détecter les signaux faibles dans vos équipes."
              icon={<Users size={32} />}
            />
          </div>
        </div>
      </section>

      {/* Example Output */}
      <section className="py-20 px-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-y border-slate-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Exemple de sortie IA</h2>
            <p className="text-xl text-slate-300">Ce que l'IA génère chaque jour pour vous</p>
          </div>

          <div className="bg-slate-900/80 rounded-2xl border border-purple-500/30 p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Brain className="text-purple-400" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">📊 Analyse Portfolio - 28 janvier 2026</h3>
                <p className="text-slate-400 text-sm">Générée à 08:00 • Confiance: 94%</p>
              </div>
            </div>

            <div className="space-y-4">
              <ActionRecommendation
                number="1"
                title="Valider la décision #DEC-2024-089 cette semaine"
                impact="Débloque 3 projets (7.2M€) en attente depuis 14 jours"
                confidence={96}
                priority="URGENT"
              />
              <ActionRecommendation
                number="2"
                title="Renforcer l'équipe Cloud Migration (Projet #PRJ-456)"
                impact="Réduit le risque de retard de 78% → 23% (économie 450K€)"
                confidence={89}
                priority="HIGH"
              />
              <ActionRecommendation
                number="3"
                title="Revoir le budget alloué au projet Data Warehouse"
                impact="+12% de dépassement prédit (estimation +380K€)"
                confidence={87}
                priority="MEDIUM"
              />
            </div>

            <div className="mt-6 pt-6 border-t border-slate-800">
              <p className="text-sm text-slate-400">
                💡 <strong>Insight IA</strong>: Votre vélocité portfolio est en hausse de <strong className="text-green-400">+15%</strong> ce trimestre. 
                Capitaliser sur cette dynamique en priorisant les 3 projets à haute valeur métier identifiés ci-dessus.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Integration */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Intégration transparente</h2>
            <p className="text-xl text-slate-300">L'IA s'intègre naturellement dans votre workflow quotidien</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            <IntegrationStep number="1" title="Connexion données" description="L'IA accède à vos projets, risques, décisions" />
            <IntegrationStep number="2" title="Analyse continue" description="Analyse 24/7 de votre portefeuille" />
            <IntegrationStep number="3" title="Recommandations" description="6 actions prioritaires quotidiennes" />
            <IntegrationStep number="4" title="Action" description="Vous validez et exécutez" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Prêt à augmenter votre gouvernance avec l'IA ?</h2>
          <p className="text-xl text-slate-300 mb-8">
            Testez l'IA Chief of Staff gratuitement pendant 14 jours
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-10 py-5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-xl shadow-lg transition-all"
          >
            Démarrer l'essai gratuit
            <ArrowRight size={24} />
          </Link>
        </div>
      </section>
    </div>
  );
}

function IAFeatureCard({ icon, title, description, color }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  const colors: Record<string, string> = {
    purple: "from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400",
    pink: "from-pink-500/20 to-pink-600/10 border-pink-500/30 text-pink-400",
  };

  return (
    <div className={`p-8 rounded-2xl bg-gradient-to-br border ${colors[color]} hover:scale-105 transition-transform`}>
      <div className="mb-4">{icon}</div>
      <h3 className="text-2xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-slate-300">{description}</p>
    </div>
  );
}

function CapabilityCard({ title, description, icon }: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-purple-500/50 transition-all">
      <div className="text-purple-400 mb-3">{icon}</div>
      <h4 className="text-xl font-bold mb-2">{title}</h4>
      <p className="text-slate-400 text-sm">{description}</p>
    </div>
  );
}

function ActionRecommendation({ number, title, impact, confidence, priority }: {
  number: string;
  title: string;
  impact: string;
  confidence: number;
  priority: string;
}) {
  const priorityColors: Record<string, string> = {
    URGENT: "bg-red-500/20 text-red-400 border-red-500/30",
    HIGH: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    MEDIUM: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  };

  return (
    <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-start gap-3">
          <span className="text-2xl font-bold text-slate-600">#{number}</span>
          <div>
            <h4 className="font-semibold text-white">{title}</h4>
            <p className="text-sm text-slate-400 mt-1">💡 {impact}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-md text-xs font-semibold border ${priorityColors[priority]}`}>
          {priority}
        </span>
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span>Confiance: {confidence}%</span>
        <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-green-500" style={{ width: `${confidence}%` }} />
        </div>
      </div>
    </div>
  );
}

function IntegrationStep({ number, title, description }: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 rounded-full bg-purple-500/20 border-2 border-purple-500/30 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-purple-400">
        {number}
      </div>
      <h4 className="font-semibold mb-2">{title}</h4>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  );
}
