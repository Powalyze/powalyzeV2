"use client";

import React from "react";
import Link from "next/link";
import { Brain, ArrowLeft, CheckCircle, Zap, Eye, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export default function GouvernanceAugmenteePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6">
            <ArrowLeft size={20} />
            Retour à l'accueil
          </Link>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                Gouvernance Augmentée
              </h1>
              <p className="text-xl text-slate-300">
                Un cockpit multi-niveaux : stratégie, pilotage opérationnel, actions rapides
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <p className="text-lg text-slate-300 leading-relaxed mb-6">
              La Gouvernance Augmentée de Powalyze transforme votre pilotage stratégique en un système nerveux exécutif intelligent. 
              Notre cockpit multi-niveaux vous offre une <strong className="text-amber-400">visualisation unifiée</strong> de toute votre organisation, 
              de la stratégie globale aux actions quotidiennes.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <Zap className="text-amber-400" size={24} />
                  Vue Stratégique
                </h3>
                <p className="text-slate-300">
                  Suivez vos OKRs, KPIs stratégiques et alignement organisationnel en temps réel. 
                  Prenez des décisions éclairées basées sur des données consolidées.
                </p>
              </div>

              <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <Eye className="text-blue-400" size={24} />
                  Pilotage Opérationnel
                </h3>
                <p className="text-slate-300">
                  Gérez vos projets, ressources et budgets avec une vue 360°. 
                  Détectez les écarts instantanément et ajustez votre trajectoire.
                </p>
              </div>

              <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <TrendingUp className="text-emerald-400" size={24} />
                  Actions Rapides
                </h3>
                <p className="text-slate-300">
                  Des dashboards opérationnels pour chaque équipe. Automatisez les tâches répétitives 
                  et concentrez-vous sur la valeur ajoutée.
                </p>
              </div>

              <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <CheckCircle className="text-purple-400" size={24} />
                  Visualisation Unifiée
                </h3>
                <p className="text-slate-300">
                  Une seule interface pour tout piloter. Finies les données éparpillées dans 10 outils différents. 
                  Tout est centralisé et cohérent.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Bénéfices clés</h2>
            <div className="space-y-4">
              {[
                "Alignement stratégique garanti entre direction et équipes",
                "Réduction de 60% du temps passé en réunions de suivi",
                "Détection précoce des risques et opportunités",
                "Décisions data-driven basées sur des insights en temps réel",
                "Agilité accrue : pivotez rapidement selon le contexte",
                "Transparence totale pour toutes les parties prenantes"
              ].map((benefit, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="text-emerald-400 flex-shrink-0 mt-1" size={20} />
                  <span className="text-slate-300">{benefit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link href="/inscription">
            <Button variant="primary" size="lg">
              Demander une démo
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

