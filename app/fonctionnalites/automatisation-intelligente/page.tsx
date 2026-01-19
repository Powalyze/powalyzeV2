"use client";

import React from "react";
import Link from "next/link";
import { Workflow, ArrowLeft, CheckCircle, Zap, TrendingUp, Bell, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export default function AutomatisationIntelligentePage() {
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
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
              <Workflow className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                Automatisation Intelligente
              </h1>
              <p className="text-xl text-slate-300">
                Auto-healing, prédictions, scénarios what-if, alertes contextuelles. Tout est automatisé.
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <p className="text-lg text-slate-300 leading-relaxed mb-6">
              L'Automatisation Intelligente de Powalyze libère vos équipes des tâches répétitives. 
              Notre système d'<strong className="text-emerald-400">auto-healing</strong> corrige automatiquement 
              les problèmes détectés, pendant que l'IA anticipe les risques et vous propose des actions préventives. 
              Concentrez-vous sur la stratégie, nous gérons l'opérationnel.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <Zap className="text-emerald-400" size={24} />
                  Auto-Healing
                </h3>
                <p className="text-slate-300">
                  Détection et correction automatique des anomalies. Le système ajuste les ressources, 
                  réaffecte les tâches et prévient les équipes concernées sans intervention manuelle.
                </p>
              </div>

              <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <TrendingUp className="text-teal-400" size={24} />
                  Prédictions IA
                </h3>
                <p className="text-slate-300">
                  L'IA prédit les dépassements budgétaires, retards et surcharges avant qu'ils ne surviennent. 
                  Recevez des recommandations d'actions correctives personnalisées.
                </p>
              </div>

              <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <GitBranch className="text-blue-400" size={24} />
                  Scénarios What-If
                </h3>
                <p className="text-slate-300">
                  Simulez différentes décisions et visualisez leurs impacts. Testez vos hypothèses 
                  avant de les mettre en œuvre dans le monde réel.
                </p>
              </div>

              <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <Bell className="text-purple-400" size={24} />
                  Alertes Contextuelles
                </h3>
                <p className="text-slate-300">
                  Notifications intelligentes qui comprennent votre contexte. Seules les alertes 
                  critiques et actionnables vous parviennent, au bon moment.
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
                "Réduction de 70% du temps passé sur les tâches administratives",
                "Prévention automatique des dérapages de planning et budget",
                "Optimisation continue des allocations de ressources",
                "Détection précoce des risques avec suggestions d'actions",
                "Workflows personnalisables selon vos processus métier",
                "ROI mesurable dès les premiers mois d'utilisation"
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
