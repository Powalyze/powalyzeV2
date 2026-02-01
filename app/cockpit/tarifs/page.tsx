'use client';

import { CockpitShell } from '@/components/cockpit/CockpitShell';
import { Check, Zap, Shield, Users, TrendingUp, Star } from 'lucide-react';
import Link from 'next/link';

export default function TarifsPage() {
  return (
    <CockpitShell>
      <div className="p-6 md:p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Passez en <span className="text-amber-500">Pro</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Débloquez toutes les fonctionnalités du cockpit exécutif et transformez votre gestion de portefeuille.
          </p>
        </div>

        {/* Comparaison Demo vs Pro */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Carte Demo (actuelle) */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
                <Users className="text-slate-400" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Demo</h3>
                <p className="text-sm text-slate-400">Votre plan actuel</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="text-3xl font-bold text-white mb-1">Gratuit</div>
              <p className="text-sm text-slate-400">Données fictives uniquement</p>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-3">
                <Check className="text-amber-500 flex-shrink-0 mt-0.5" size={18} />
                <span className="text-slate-300 text-sm">3 projets fictifs</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-amber-500 flex-shrink-0 mt-0.5" size={18} />
                <span className="text-slate-300 text-sm">Interface complète</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-amber-500 flex-shrink-0 mt-0.5" size={18} />
                <span className="text-slate-300 text-sm">Mode lecture seule</span>
              </div>
              <div className="flex items-start gap-3 opacity-40">
                <span className="text-slate-600">✗</span>
                <span className="text-slate-500 text-sm line-through">Vos propres projets</span>
              </div>
              <div className="flex items-start gap-3 opacity-40">
                <span className="text-slate-600">✗</span>
                <span className="text-slate-500 text-sm line-through">Création & modification</span>
              </div>
              <div className="flex items-start gap-3 opacity-40">
                <span className="text-slate-600">✗</span>
                <span className="text-slate-500 text-sm line-through">Rapports personnalisés</span>
              </div>
            </div>

            <div className="px-4 py-3 bg-slate-800/50 rounded-lg border border-slate-700 text-center">
              <span className="text-slate-400 text-sm">Vous êtes ici</span>
            </div>
          </div>

          {/* Carte Pro (recommandée) */}
          <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-2 border-amber-500/30 rounded-2xl p-8 relative overflow-hidden">
            {/* Badge Recommandé */}
            <div className="absolute top-4 right-4">
              <div className="px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                <Star size={12} fill="white" />
                Recommandé
              </div>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                <Zap className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Pro</h3>
                <p className="text-sm text-amber-400">Pour les professionnels</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="text-3xl font-bold text-white mb-1">
                49€<span className="text-lg text-slate-400 font-normal">/mois</span>
              </div>
              <p className="text-sm text-amber-400">Facturation mensuelle</p>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-3">
                <Check className="text-amber-500 flex-shrink-0 mt-0.5" size={18} />
                <span className="text-white text-sm font-medium">Projets illimités</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-amber-500 flex-shrink-0 mt-0.5" size={18} />
                <span className="text-white text-sm font-medium">Création & modification</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-amber-500 flex-shrink-0 mt-0.5" size={18} />
                <span className="text-white text-sm font-medium">Gestion des risques</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-amber-500 flex-shrink-0 mt-0.5" size={18} />
                <span className="text-white text-sm font-medium">Décisions & rapports</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-amber-500 flex-shrink-0 mt-0.5" size={18} />
                <span className="text-white text-sm font-medium">Équipe multi-utilisateurs</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-amber-500 flex-shrink-0 mt-0.5" size={18} />
                <span className="text-white text-sm font-medium">Support prioritaire</span>
              </div>
            </div>

            <button className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50">
              Activer Pro maintenant
            </button>

            <p className="text-center text-xs text-slate-400 mt-4">
              Sans engagement • Annulation à tout moment
            </p>
          </div>
        </div>

        {/* Fonctionnalités détaillées */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Ce que vous débloquez avec Pro
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mx-auto mb-4">
                <Shield size={32} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Vos données réelles</h3>
              <p className="text-sm text-slate-400">
                Gérez vos propres projets, risques et décisions en toute sécurité
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mx-auto mb-4">
                <TrendingUp size={32} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Rapports avancés</h3>
              <p className="text-sm text-slate-400">
                Générez des rapports personnalisés et suivez vos KPI en temps réel
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mx-auto mb-4">
                <Users size={32} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Collaboration</h3>
              <p className="text-sm text-slate-400">
                Invitez votre équipe et collaborez sur les projets stratégiques
              </p>
            </div>
          </div>
        </div>

        {/* FAQ rapide */}
        <div className="text-center">
          <p className="text-slate-400 mb-4">Une question ?</p>
          <Link 
            href="/contact"
            className="text-amber-500 hover:text-amber-400 font-medium transition-colors"
          >
            Contactez-nous
          </Link>
        </div>
      </div>
    </CockpitShell>
  );
}
