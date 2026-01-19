"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Check, Sparkles, Zap, Crown, Rocket, Lock } from 'lucide-react';

export default function TarifsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem('powalyze_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      setIsLoading(false);
    } else {
      // Rediriger vers login si non authentifié
      router.push('/login?redirect=/tarifs&message=Veuillez vous connecter pour voir les tarifs');
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="text-slate-400 mt-4">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-amber-500/30 p-8 rounded-2xl max-w-md text-center">
          <Lock className="w-16 h-16 text-amber-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Accès Restreint</h2>
          <p className="text-slate-400 mb-6">Vous devez créer un compte pour accéder aux tarifs</p>
          <Link href="/register" className="px-6 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 rounded-xl font-semibold hover:scale-105 transition-all inline-block">
            Créer un compte
          </Link>
        </div>
      </div>
    );
  }

  const plans = [
    {
      name: "Starter",
      icon: Zap,
      price: "99",
      currency: "€",
      period: "/personne/mois",
      description: "Parfait pour les PME qui démarrent",
      minUsers: "5 utilisateurs minimum",
      features: [
        "Jusqu'à 10 projets actifs",
        "Tableaux de bord basiques",
        "Support par email",
        "1 GB de stockage par utilisateur",
        "Rapports mensuels",
        "Intégrations limitées (5)",
      ],
      cta: "Commencer",
      popular: false,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      name: "Professional",
      icon: Crown,
      price: "199",
      currency: "€",
      period: "/personne/mois",
      description: "Pour les entreprises en croissance",
      minUsers: "10 utilisateurs minimum",
      features: [
        "Projets illimités",
        "Tableaux de bord avancés + IA",
        "Support prioritaire 24/7",
        "10 GB de stockage par utilisateur",
        "Rapports personnalisés en temps réel",
        "Intégration Power BI incluse",
        "API accès complet",
        "Formation en ligne illimitée",
        "Chief of Staff IA activé",
      ],
      cta: "Essai gratuit 30 jours",
      popular: true,
      gradient: "from-amber-400 to-yellow-500",
    },
    {
      name: "Enterprise",
      icon: Rocket,
      price: "Sur mesure",
      currency: "",
      period: "",
      description: "Solution complète pour grandes organisations",
      minUsers: "50 utilisateurs minimum",
      features: [
        "Tarif dégressif à partir de 149€/personne",
        "Projets et utilisateurs illimités",
        "Tous les modules IA premium",
        "Support dédié + Account Manager",
        "Stockage illimité",
        "Living Sphere 3D interactive",
        "Intégrations sur mesure illimitées",
        "Formation sur site",
        "SLA garanti 99.9%",
        "Conformité avancée (ISO, SOC2)",
        "Déploiement on-premise possible",
        "Auto-Healing IA activé",
      ],
      cta: "Nous contacter",
      popular: false,
      gradient: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/50 backdrop-blur-xl border-b border-indigo-500/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">
              Powalyze
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-slate-300 hover:text-white transition-colors text-sm">
              Connexion
            </Link>
            <Link 
              href="/register" 
              className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 text-sm font-medium rounded-xl transition-all shadow-lg shadow-amber-500/25"
            >
              Commencer
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-amber-300 to-yellow-500 bg-clip-text text-transparent">
                Tarifs transparents
              </span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Choisissez le plan qui correspond à vos besoins. Changez ou annulez à tout moment.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              return (
                <div
                  key={index}
                  className={`relative bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl border rounded-3xl p-8 transition-all duration-300 ${
                    plan.popular
                      ? 'border-amber-500/50 shadow-2xl shadow-amber-500/20 scale-105'
                      : 'border-indigo-500/10 hover:border-indigo-500/30'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="px-4 py-1 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 text-sm font-bold rounded-full">
                        Le plus populaire
                      </span>
                    </div>
                  )}

                  <div className={`w-14 h-14 bg-gradient-to-br ${plan.gradient} bg-opacity-20 rounded-2xl flex items-center justify-center mb-6`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-slate-400 text-sm mb-4">{plan.description}</p>
                  {plan.minUsers && (
                    <p className="text-amber-400 text-xs font-semibold mb-4 bg-amber-500/10 px-3 py-2 rounded-lg border border-amber-500/20">
                      📌 {plan.minUsers}
                    </p>
                  )}

                  <div className="mb-8">
                    {plan.price === "Sur mesure" ? (
                      <>
                        <div className="text-3xl font-bold text-white mb-2">Sur mesure</div>
                        <p className="text-green-400 text-xs font-semibold">
                          💰 À partir de 149€/personne pour +100 utilisateurs
                        </p>
                      </>
                    ) : (
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-white">{plan.price}</span>
                        <span className="text-xl text-white">{plan.currency}</span>
                        <span className="text-slate-400 text-sm">{plan.period}</span>
                      </div>
                    )}
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={plan.name === "Enterprise" ? "/contact" : "/register"}
                    className={`block w-full text-center px-6 py-3 rounded-xl font-semibold transition-all ${
                      plan.popular
                        ? 'bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 shadow-lg shadow-amber-500/25'
                        : 'bg-white/5 hover:bg-white/10 text-white border border-indigo-500/20'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              );
            })}
          </div>

          {/* FAQ Section */}
          <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl border border-indigo-500/10 rounded-3xl p-12">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              <span className="bg-gradient-to-r from-amber-300 to-yellow-500 bg-clip-text text-transparent">
                Questions fréquentes
              </span>
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-white font-semibold mb-2">Puis-je changer de plan ?</h3>
                <p className="text-slate-400 text-sm">
                  Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements prennent effet immédiatement.
                </p>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-2">Quelle est la politique d'annulation ?</h3>
                <p className="text-slate-400 text-sm">
                  Aucun engagement. Vous pouvez annuler votre abonnement à tout moment sans frais supplémentaires.
                </p>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-2">Offrez-vous des réductions pour les ONG ?</h3>
                <p className="text-slate-400 text-sm">
                  Oui, nous offrons des réductions spéciales pour les organisations à but non lucratif et les établissements d'enseignement. Contactez-nous pour plus d'informations.
                </p>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-2">Les données sont-elles sécurisées ?</h3>
                <p className="text-slate-400 text-sm">
                  Absolument. Toutes les données sont chiffrées end-to-end et nous sommes conformes RGPD, ISO 27001 et SOC 2.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Besoin d'un plan personnalisé ?
            </h2>
            <p className="text-slate-400 mb-8">
              Notre équipe commerciale est là pour vous aider à trouver la solution idéale.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/25"
            >
              Contacter l'équipe commerciale
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-indigo-500/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-slate-950" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">
                Powalyze
              </span>
            </div>
            <div className="flex items-center gap-8 text-sm text-slate-400">
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
              <Link href="/tarifs" className="hover:text-white transition-colors">Tarifs</Link>
              <Link href="/a-propos" className="hover:text-white transition-colors">À propos</Link>
              <Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link>
              <Link href="/cgu" className="hover:text-white transition-colors">CGU</Link>
              <span>© 2026 Powalyze</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
