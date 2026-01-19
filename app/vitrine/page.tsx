'use client';

import React from 'react';
import Link from 'next/link';
import { Target, Shield, Zap, Brain, Lock, Gauge, Award, TrendingUp, Users } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

export default function VitrinePage() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Premium Gradient */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-navy via-navy-dark to-black">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-navy/50 to-black/80"></div>
        
        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
          <div className="inline-block px-6 py-2 mb-8 rounded-full bg-gold/10 border border-gold/30">
            <span className="text-sm font-semibold text-gold uppercase tracking-wider">
              Cockpit Exécutif Premium
            </span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent leading-tight">
            Gouvernance<br />Intelligence Augmentée
          </h1>
          
          <p className="text-xl md:text-2xl text-neutral-200 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
            La plateforme de pilotage stratégique conçue pour les comités de direction. 
            Narratif, proactif, exécutif.
          </p>
          
          <div className="flex gap-6 justify-center mb-16">
            <Link href="/cockpit" className="ds-btn ds-btn-primary ds-btn-lg group">
              <Target className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              Accéder au cockpit
            </Link>
            <Link href="/contact" className="ds-btn ds-btn-secondary ds-btn-lg">
              Demander une démo
            </Link>
          </div>

          {/* Metrics Banner */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto pt-12 border-t border-gold/20">
            <div className="text-center">
              <div className="text-4xl font-bold text-gold mb-2">98%</div>
              <div className="text-sm text-neutral-400 uppercase tracking-wide">Précision IA</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gold mb-2">-40%</div>
              <div className="text-sm text-neutral-400 uppercase tracking-wide">Temps de décision</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gold mb-2">24/7</div>
              <div className="text-sm text-neutral-400 uppercase tracking-wide">Surveillance</div>
            </div>
          </div>
        </div>
      </section>

      {/* Modules Exécutifs */}
      <section className="ds-section ds-container">
        <div className="text-center mb-20">
          <div className="inline-block px-6 py-2 mb-6 rounded-full bg-gold/5 border border-gold/20">
            <span className="text-sm font-semibold text-gold uppercase tracking-wider">
              Modules Stratégiques
            </span>
          </div>
          <h2 className="ds-title-gold text-5xl md:text-6xl mb-6">
            Un cockpit unifié
          </h2>
          <p className="text-neutral-600 max-w-3xl mx-auto text-lg leading-relaxed">
            Chaque module suit la même structure : vision haute, analyse IA narrative, actions immédiates.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Module Risques */}
          <div className="ds-card group hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border-l-4 border-red-500">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-navy">Risques</h3>
            </div>
            <p className="text-neutral-600 mb-6 leading-relaxed">
              Cartographie proactive des risques critiques avec probabilité, impact et mitigation en temps réel.
            </p>
            <div className="flex items-center text-gold font-semibold group-hover:gap-3 gap-2 transition-all">
              <span>Vision 360°</span>
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          {/* Module Décisions */}
          <div className="ds-card group hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border-l-4 border-purple-500">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-navy">Décisions</h3>
            </div>
            <p className="text-neutral-600 mb-6 leading-relaxed">
              Timeline chronologique des décisions stratégiques avec contexte, comités, échéances et suivi.
            </p>
            <div className="flex items-center text-gold font-semibold group-hover:gap-3 gap-2 transition-all">
              <span>Traçabilité totale</span>
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          {/* Module Projets */}
          <div className="ds-card group hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border-l-4 border-blue-500">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Gauge className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-navy">Projets</h3>
            </div>
            <p className="text-neutral-600 mb-6 leading-relaxed">
              Kanban exécutif avec progression, budget, deadline et analyse prédictive de réussite.
            </p>
            <div className="flex items-center text-gold font-semibold group-hover:gap-3 gap-2 transition-all">
              <span>Pilotage temps réel</span>
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
        </div>
      </section>

      {/* Intelligence Narrative */}
      <section className="ds-section-compact bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="ds-container">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-start gap-6 mb-12">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center flex-shrink-0">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-navy mb-4">
                  Intelligence narrative transversale
                </h2>
                <p className="text-xl text-neutral-700 leading-relaxed">
                  Chaque module intègre une synthèse IA exécutive : quoi, pourquoi, action. 
                  Pas de graphiques inutiles. Du texte structuré pour la décision rapide.
                </p>
              </div>
            </div>

            <div className="ds-card bg-white/80 backdrop-blur border-l-4 border-gold">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-gold" />
                <h3 className="text-xl font-semibold text-navy">Exemple de synthèse IA</h3>
              </div>
              <p className="text-neutral-700 mb-3 leading-relaxed">
                <strong>Résumé exécutif :</strong> Le projet Migration Cloud Azure accumule un retard de 3 semaines 
                avec un risque budgétaire de 12%. L'équipe Cloud rencontre des difficultés techniques sur la migration 
                des bases de données legacy.
              </p>
              <p className="text-neutral-700 mb-3 leading-relaxed">
                <strong>Analyse :</strong> Ce retard est principalement dû à la sous-estimation initiale de la 
                complexité des schémas de données existants et au manque de documentation fournisseur.
              </p>
              <p className="text-neutral-700 leading-relaxed">
                <strong>Action recommandée :</strong> Allouer un consultant senior Azure pendant 2 sprints, 
                revoir l'échéance de livraison de +4 semaines et valider budget complémentaire en Comité Tech.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Différenciateurs Premium */}
      <section className="ds-section ds-container">
        <div className="text-center mb-20">
          <div className="inline-block px-6 py-2 mb-6 rounded-full bg-gold/5 border border-gold/20">
            <span className="text-sm font-semibold text-gold uppercase tracking-wider">
              Excellence Opérationnelle
            </span>
          </div>
          <h2 className="ds-title-gold text-5xl md:text-6xl mb-6">
            Conçu pour l'exigence
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {/* Narratif */}
          <div className="text-center group">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gold via-gold-light to-gold mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Brain className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-navy mb-4">Narratif</h3>
            <p className="text-neutral-600 leading-relaxed max-w-sm mx-auto">
              Pas de dashboards colorés. Du texte structuré, du contexte, des recommandations. 
              Conçu pour la décision rapide.
            </p>
          </div>

          {/* Proactif */}
          <div className="text-center group">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gold via-gold-light to-gold mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Zap className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-navy mb-4">Proactif</h3>
            <p className="text-neutral-600 leading-relaxed max-w-sm mx-auto">
              L'IA détecte les signaux faibles, anticipe les retards, suggère les arbitrages. 
              Vous restez en avance.
            </p>
          </div>

          {/* Exécutif */}
          <div className="text-center group">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gold via-gold-light to-gold mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Award className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-navy mb-4">Exécutif</h3>
            <p className="text-neutral-600 leading-relaxed max-w-sm mx-auto">
              Ton professionnel, données fiables, respect total de la confidentialité. 
              Pour les comités de direction.
            </p>
          </div>
        </div>
      </section>

      {/* Sécurité & Confidentialité */}
      <section className="ds-section-compact bg-navy">
        <div className="ds-container">
          <div className="max-w-4xl mx-auto text-center">
            <Lock className="w-16 h-16 text-gold mx-auto mb-8" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Sécurité absolue
            </h2>
            <p className="text-xl text-neutral-300 mb-12 leading-relaxed">
              Hébergement souverain, chiffrement end-to-end, conformité RGPD, ISO 27001. 
              Vos données stratégiques restent vos données.
            </p>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-gold mb-2">99.99%</div>
                <div className="text-sm text-neutral-400 uppercase tracking-wide">Disponibilité</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gold mb-2">ISO 27001</div>
                <div className="text-sm text-neutral-400 uppercase tracking-wide">Certifié</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gold mb-2">RGPD</div>
                <div className="text-sm text-neutral-400 uppercase tracking-wide">Conforme</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final Premium */}
      <section className="ds-section bg-gradient-to-br from-gold via-gold-light to-gold">
        <div className="ds-container text-center">
          <Users className="w-20 h-20 text-navy mx-auto mb-8 opacity-80" />
          <h2 className="text-5xl md:text-6xl font-bold text-navy mb-6">
            Prêt à transformer votre gouvernance ?
          </h2>
          <p className="text-xl text-navy-dark mb-12 max-w-3xl mx-auto opacity-90">
            Rejoignez les comités de direction qui pilotent avec intelligence et anticipation.
          </p>
          <div className="flex gap-6 justify-center">
            <Link href="/cockpit" className="ds-btn bg-navy text-white hover:bg-navy-dark ds-btn-lg border-0">
              <Target className="w-5 h-5" />
              Accéder au cockpit
            </Link>
            <Link href="/contact" className="ds-btn bg-white text-navy hover:bg-neutral-100 ds-btn-lg border-0">
              Demander une démo privée
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Premium */}
      <footer className="bg-neutral-900 text-neutral-400 py-16">
        <div className="ds-container">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Branding */}
            <div>
              <h3 className="text-2xl font-bold text-gold mb-4">Powalyze</h3>
              <p className="text-sm leading-relaxed">
                Cockpit exécutif & gouvernance augmentée par l'intelligence artificielle.
              </p>
            </div>

            {/* Produit */}
            <div>
              <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Produit</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/vitrine" className="hover:text-gold transition-colors">Fonctionnalités</Link></li>
                <li><Link href="/tarifs" className="hover:text-gold transition-colors">Tarifs</Link></li>
                <li><Link href="/cockpit" className="hover:text-gold transition-colors">Accéder au cockpit</Link></li>
              </ul>
            </div>

            {/* Entreprise */}
            <div>
              <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Entreprise</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/a-propos" className="hover:text-gold transition-colors">À propos</Link></li>
                <li><Link href="/contact" className="hover:text-gold transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Légal */}
            <div>
              <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Légal</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/mentions-legales" className="hover:text-gold transition-colors">Mentions légales</Link></li>
                <li><Link href="/cgu" className="hover:text-gold transition-colors">CGU</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-800 pt-8 text-center text-sm">
            <p>&copy; {currentYear} Powalyze. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
