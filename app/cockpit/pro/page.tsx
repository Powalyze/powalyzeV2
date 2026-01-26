"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Crown, Zap, Shield, HeadphonesIcon, TrendingUp, CheckCircle2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProPage() {
  const [userMode, setUserMode] = useState<'demo' | 'pro' | 'admin'>('demo');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check user mode - for now, mock
    // In production, fetch from Supabase
    setUserMode('demo');
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Chargement...</div>
      </div>
    );
  }

  // If user is in demo mode, show upgrade page
  if (userMode === 'demo') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 pt-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 rounded-full mb-6">
              <Crown className="text-amber-500" size={20} />
              <span className="text-amber-500 font-semibold">Mode PRO</span>
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">
              Passez en Mode <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-500">PRO</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Débloquez toutes les fonctionnalités premium et créez vos propres projets avec Powalyze PRO
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* Feature 1 */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-amber-500/50 transition-all">
              <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="text-amber-500" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Données Réelles</h3>
              <p className="text-slate-400 text-sm">
                Créez et gérez vos propres projets avec vos données réelles. Exit le mode démo.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-amber-500/50 transition-all">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="text-blue-500" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Connecteurs Avancés</h3>
              <p className="text-slate-400 text-sm">
                Intégrez Jira, Azure DevOps, Slack, GitHub, OpenAI et 10+ outils professionnels.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-amber-500/50 transition-all">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4">
                <HeadphonesIcon className="text-emerald-500" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Support Prioritaire</h3>
              <p className="text-slate-400 text-sm">
                Accès direct à l'équipe support avec réponse garantie sous 4h.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-amber-500/50 transition-all">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="text-purple-500" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">IA Illimitée</h3>
              <p className="text-slate-400 text-sm">
                Analyse prédictive, génération de rapports, insights automatiques sans limite.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-amber-500/50 transition-all">
              <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle2 className="text-red-500" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Power BI Intégré</h3>
              <p className="text-slate-400 text-sm">
                Connectez vos rapports Power BI et visualisez vos données en temps réel.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-amber-500/50 transition-all">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-4">
                <Crown className="text-cyan-500" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Export Avancé</h3>
              <p className="text-slate-400 text-sm">
                Exportez vos données en CSV, JSON, PDF, PowerPoint pour vos COMEX.
              </p>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-amber-500/30 rounded-2xl p-8 max-w-3xl mx-auto mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Powalyze PRO</h2>
              <div className="flex items-baseline justify-center gap-2 mb-4">
                <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-500">
                  399€
                </span>
                <span className="text-slate-400">/mois</span>
              </div>
              <p className="text-slate-400">Engagement annuel - Facturation mensuelle</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {[
                "Projets illimités",
                "Utilisateurs illimités",
                "Connecteurs avancés",
                "Support prioritaire 4h",
                "IA prédictive illimitée",
                "Export tous formats",
                "Power BI intégré",
                "Rapports automatisés",
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="text-emerald-500 flex-shrink-0" size={20} />
                  <span className="text-slate-300">{feature}</span>
                </div>
              ))}
            </div>

            <button className="w-full py-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-bold rounded-xl transition-all flex items-center justify-center gap-2 group">
              Passer en Mode PRO
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </button>

            <p className="text-center text-slate-500 text-sm mt-4">
              Garantie satisfait ou remboursé 30 jours
            </p>
          </div>

          {/* FAQ Preview */}
          <div className="text-center">
            <p className="text-slate-400 mb-4">Des questions ?</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 font-medium transition-colors"
            >
              Contactez notre équipe commerciale
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If user is PRO, show dashboard
  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Crown className="text-amber-500" size={24} />
              <h1 className="text-3xl font-bold text-white">Espace PRO</h1>
            </div>
            <p className="text-slate-400">Gérez votre abonnement et accédez aux ressources premium</p>
          </div>
          <div className="px-4 py-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 rounded-lg">
            <span className="text-amber-500 font-semibold">Mode PRO Actif</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <div className="text-sm text-slate-400 mb-1">Projets Créés</div>
            <div className="text-3xl font-bold text-white">12</div>
            <div className="text-sm text-emerald-500 mt-1">+3 ce mois</div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <div className="text-sm text-slate-400 mb-1">Connecteurs Actifs</div>
            <div className="text-3xl font-bold text-white">5</div>
            <div className="text-sm text-blue-500 mt-1">Jira, Slack, GitHub</div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <div className="text-sm text-slate-400 mb-1">IA Utilisée</div>
            <div className="text-3xl font-bold text-white">2.4k</div>
            <div className="text-sm text-purple-500 mt-1">Analyses ce mois</div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <div className="text-sm text-slate-400 mb-1">Utilisateurs</div>
            <div className="text-3xl font-bold text-white">8</div>
            <div className="text-sm text-cyan-500 mt-1">Licences actives</div>
          </div>
        </div>

        {/* Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Abonnement */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Abonnement</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Plan</span>
                <span className="text-white font-semibold">Powalyze PRO</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Statut</span>
                <span className="text-emerald-500 font-semibold">Actif</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Prochain renouvellement</span>
                <span className="text-white">15 février 2026</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Montant</span>
                <span className="text-white font-semibold">399€/mois</span>
              </div>
            </div>
            <button className="w-full mt-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors">
              Gérer l'abonnement
            </button>
          </div>

          {/* Support */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Support Prioritaire</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <HeadphonesIcon className="text-emerald-500 flex-shrink-0 mt-1" size={20} />
                <div>
                  <div className="text-white font-medium mb-1">Email: pro@powalyze.com</div>
                  <div className="text-sm text-slate-400">Réponse garantie sous 4h</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-blue-500 flex-shrink-0 mt-1" size={20} />
                <div>
                  <div className="text-white font-medium mb-1">Temps de réponse moyen</div>
                  <div className="text-sm text-slate-400">1h 23min ce mois</div>
                </div>
              </div>
            </div>
            <button className="w-full mt-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors">
              Contacter le support
            </button>
          </div>
        </div>

        {/* Resources */}
        <div className="mt-8 bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Ressources Premium</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/docs/pro"
              className="p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors group"
            >
              <div className="text-white font-medium mb-1 group-hover:text-amber-500 transition-colors">
                Documentation PRO
              </div>
              <div className="text-sm text-slate-400">Guides avancés et API</div>
            </Link>

            <Link
              href="/webinars"
              className="p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors group"
            >
              <div className="text-white font-medium mb-1 group-hover:text-amber-500 transition-colors">
                Webinars Exclusifs
              </div>
              <div className="text-sm text-slate-400">Sessions mensuelles</div>
            </Link>

            <Link
              href="/community"
              className="p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors group"
            >
              <div className="text-white font-medium mb-1 group-hover:text-amber-500 transition-colors">
                Communauté PRO
              </div>
              <div className="text-sm text-slate-400">Slack privé</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
