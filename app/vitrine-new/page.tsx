'use client';

import React from 'react';
import { ArrowRight, Play, Target, Shield, Zap, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function VitrineNew() {
  return (
    <div className="min-h-screen bg-neutral-white">
      {/* Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-neutral-light">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold to-navy flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="header-title text-2xl">Powalyze</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#fonctionnalites" className="text-sm hover:text-gold transition-colors">Fonctionnalités</a>
            <a href="#differentiation" className="text-sm hover:text-gold transition-colors">Différenciation</a>
            <a href="#tarifs" className="text-sm hover:text-gold transition-colors">Tarifs</a>
            <Link href="/cockpit-real" className="btn-primary">
              <ArrowRight className="w-4 h-4" />
              Entrer dans le cockpit
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section avec Vidéo */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-20"
          >
            <source src="/videos/cockpit-demo.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-white/90 via-neutral-white/70 to-neutral-white" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/20 rounded-full mb-8">
            <div className="w-2 h-2 bg-gold rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-gold">Cockpit Exécutif 2026</span>
          </div>

          <h1 className="header-title text-6xl md:text-7xl mb-6">
            Gouvernez en narratif,
            <br />
            <span className="text-gold">décidez en confiance</span>
          </h1>

          <p className="header-subtitle text-xl mb-12 max-w-3xl mx-auto">
            Powalyze transforme votre gouvernance en cockpit exécutif vivant : projets, risques, décisions pilotés par IA narrative.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link href="/cockpit-real" className="btn-primary text-lg px-8 py-4">
              <Play className="w-5 h-5" />
              Voir le cockpit en action
            </Link>
            <button className="btn-secondary text-lg px-8 py-4">
              <ChevronDown className="w-5 h-5" />
              Découvrir les modules
            </button>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm opacity-70">
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Sécurisé & Confidentiel
            </span>
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              IA Narrative Intégrée
            </span>
            <span className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Décisions Augmentées
            </span>
          </div>
        </div>
      </section>

      {/* Modules Phares */}
      <section id="fonctionnalites" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="header-title text-5xl mb-4">3 modules phares</h2>
            <p className="header-subtitle text-xl">Risques, Décisions, Projets : pilotez tout depuis un seul cockpit</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Module Risques */}
            <Link href="/cockpit/projets" className="card-premium group cursor-pointer">
              <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target className="w-7 h-7 text-green-700" />
              </div>
              <h3 className="header-title text-2xl mb-3">Projets</h3>
              <p className="text-sm opacity-70 mb-6">
                Kanban intelligent, alertes prédictives, vélocité temps réel. Sachez exactement où agir.
              </p>
              <div className="flex items-center gap-2 text-gold font-semibold">
                <span>Voir le module</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Module Décisions */}
            <Link href="/risques" className="card-premium group cursor-pointer">
              <div className="w-14 h-14 rounded-xl bg-red-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-red-700" />
              </div>
              <h3 className="header-title text-2xl mb-3">Risques</h3>
              <p className="text-sm opacity-70 mb-6">
                Matrice probabilité/impact, scénarios IA, plans de mitigation. Anticipez avant qu'il ne soit trop tard.
              </p>
              <div className="flex items-center gap-2 text-gold font-semibold">
                <span>Voir le module</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Module Projets */}
            <Link href="/decisions" className="card-premium group cursor-pointer">
              <div className="w-14 h-14 rounded-xl bg-gold/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-gold" />
              </div>
              <h3 className="header-title text-2xl mb-3">Décisions</h3>
              <p className="text-sm opacity-70 mb-6">
                Timeline COMEX, vélocité d'arbitrage, impact cascade. Documentez et exécutez sans friction.
              </p>
              <div className="flex items-center gap-2 text-gold font-semibold">
                <span>Voir le module</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Différenciation */}
      <section id="differentiation" className="py-24 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-gold text-5xl font-bold mb-6">
                Narratif, pas numérique
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Powalyze ne vous noie pas dans les chiffres. Il raconte l'histoire de votre portefeuille.
              </p>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gold/20 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">IA Narrative</h4>
                    <p className="opacity-70">Synthèses exécutives, recommandations actionnables, scénarios prospectifs générés en temps réel</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gold/20 flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Proactif</h4>
                    <p className="opacity-70">Alertes intelligentes, prédictions de dérive, suggestions d'arbitrage avant que le risque ne se matérialise</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gold/20 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Exécutif</h4>
                    <p className="opacity-70">Conçu pour COMEX, COO, PMO. Pas de tableaux Excel. Pas de silos. Juste l'essentiel pour décider.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-premium bg-white/5 border-white/10">
              <div className="aspect-video bg-gradient-to-br from-gold/20 to-navy/40 rounded-lg flex items-center justify-center">
                <Play className="w-20 h-20 text-gold" />
              </div>
              <p className="text-sm opacity-60 mt-4 text-center">Vidéo de démonstration cockpit</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tarifs */}
      <section id="tarifs" className="py-24">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="header-title text-5xl mb-4">Un seul plan, zéro friction</h2>
          <p className="header-subtitle text-xl mb-12">
            Accès complet, IA narrative incluse, support premium. Pas de paliers, pas de surprises.
          </p>

          <div className="card-premium max-w-xl mx-auto border-2 border-gold">
            <div className="text-center mb-8">
              <div className="inline-block px-4 py-1 bg-gold text-white rounded-full text-sm font-bold mb-4">
                PRO
              </div>
              <div className="flex items-baseline justify-center gap-2 mb-2">
                <span className="text-6xl font-bold text-gold">Sur devis</span>
              </div>
              <p className="opacity-70">Forfait annuel, adapté à votre organisation</p>
            </div>

            <ul className="space-y-4 mb-8 text-left">
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-green-700 text-sm">✓</span>
                </div>
                <span>Tous les modules (Projets, Risques, Décisions, Comités)</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-green-700 text-sm">✓</span>
                </div>
                <span>IA narrative illimitée (GPT-4)</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-green-700 text-sm">✓</span>
                </div>
                <span>Utilisateurs illimités</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-green-700 text-sm">✓</span>
                </div>
                <span>Support prioritaire & onboarding personnalisé</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-green-700 text-sm">✓</span>
                </div>
                <span>Power BI & connecteurs API</span>
              </li>
            </ul>

            <Link href="/contact" className="btn-primary w-full justify-center text-lg py-4">
              Demander une démo personnalisée
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 bg-gradient-to-br from-gold/10 to-navy/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="header-title text-5xl mb-6">
            Prêt à gouverner en narratif ?
          </h2>
          <p className="header-subtitle text-xl mb-12">
            Testez Powalyze en 2 minutes. Aucune installation, aucune carte bancaire.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/cockpit-real" className="btn-primary text-lg px-10 py-5">
              <Play className="w-5 h-5" />
              Accéder au cockpit démo
            </Link>
            <Link href="/contact" className="btn-secondary text-lg px-10 py-5">
              Parler à un expert
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold to-white flex items-center justify-center">
                  <span className="text-navy font-bold text-xl">P</span>
                </div>
                <span className="text-gold text-2xl font-bold">Powalyze</span>
              </div>
              <p className="text-sm opacity-70">Cockpit exécutif & gouvernance IA</p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Produit</h4>
              <ul className="space-y-2 text-sm opacity-70">
                <li><a href="#fonctionnalites" className="hover:text-gold transition-colors">Fonctionnalités</a></li>
                <li><a href="#tarifs" className="hover:text-gold transition-colors">Tarifs</a></li>
                <li><Link href="/cockpit-real" className="hover:text-gold transition-colors">Démo</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Entreprise</h4>
              <ul className="space-y-2 text-sm opacity-70">
                <li><Link href="/a-propos" className="hover:text-gold transition-colors">À propos</Link></li>
                <li><Link href="/contact" className="hover:text-gold transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Légal</h4>
              <ul className="space-y-2 text-sm opacity-70">
                <li><Link href="/mentions-legales" className="hover:text-gold transition-colors">Mentions légales</Link></li>
                <li><Link href="/cgu" className="hover:text-gold transition-colors">CGU</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-sm opacity-50 text-center">
            © 2026 Powalyze. Cockpit exécutif de nouvelle génération.
          </div>
        </div>
      </footer>
    </div>
  );
}

