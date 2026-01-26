'use client';

import Link from 'next/link';
import { Check, Sparkles, Crown, ArrowRight, Shield, Users, BarChart3 } from 'lucide-react';

export default function DemoLanding() {
  const features = [
    {
      icon: BarChart3,
      title: 'Dashboard Cockpit',
      description: 'Visualisez vos projets en temps réel avec un tableau de bord intuitif'
    },
    {
      icon: Users,
      title: 'Gestion d\'équipe',
      description: 'Collaborez efficacement avec votre équipe sur les projets'
    },
    {
      icon: Sparkles,
      title: 'IA Basique',
      description: 'Bénéficiez de suggestions intelligentes pour vos décisions'
    },
    {
      icon: Shield,
      title: 'Sécurisé',
      description: 'Vos données sont protégées et sauvegardées automatiquement'
    }
  ];

  const demoIncludes = [
    'Dashboard cockpit simplifié',
    'Gestion de 5 projets maximum',
    'Rapports de base',
    'Support par email',
    'Accès à la page Tarifs'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <Link href="/" className="inline-block mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 hover:scale-105 transition-transform">
              <span className="text-4xl font-bold text-white">P</span>
            </div>
          </Link>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Mode Démo Gratuit
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Découvrez Powalyze en
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Mode Démo
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Testez gratuitement notre plateforme de gouvernance de portefeuille.
            Aucune carte bancaire requise.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/demo/signup">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Créer un compte Démo
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <Link href="/auth/demo/login">
              <button className="px-8 py-4 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors">
                Se connecter
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            Fonctionnalités incluses
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 text-sm">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-xl p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
            Ce qui est inclus
          </h2>
          <ul className="space-y-4">
            {demoIncludes.map((item, index) => (
              <li key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-slate-700">{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <Link href="/auth/demo/signup">
              <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity">
                Commencer Gratuitement
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Upgrade CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 md:p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl mb-6">
            <Crown className="w-8 h-8 text-amber-500" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Besoin de plus ?
          </h2>
          <p className="text-amber-100 text-lg mb-6 max-w-2xl mx-auto">
            Passez à la version Pro pour débloquer tous les projets, l'IA avancée,
            le support prioritaire et bien plus encore.
          </p>
          <Link href="/pro">
            <button className="px-8 py-4 bg-white text-amber-600 rounded-xl font-semibold hover:bg-amber-50 transition-colors">
              Découvrir la Version Pro
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-600 text-sm">
              © 2026 Powalyze. Tous droits réservés.
            </p>
            <div className="flex gap-6">
              <Link href="/cgu" className="text-slate-600 hover:text-blue-600 text-sm">
                CGU
              </Link>
              <Link href="/mentions-legales" className="text-slate-600 hover:text-blue-600 text-sm">
                Mentions légales
              </Link>
              <Link href="/contact" className="text-slate-600 hover:text-blue-600 text-sm">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
