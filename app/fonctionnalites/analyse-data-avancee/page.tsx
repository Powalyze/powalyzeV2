"use client";

import React from "react";
import Link from "next/link";
import { Database, ArrowLeft, CheckCircle, Brain, LineChart, Sparkles, Layers } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export default function AnalyseDataAvanceePage() {
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
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Database className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                Analyse Data Avancée
              </h1>
              <p className="text-xl text-slate-300">
                Analyse prédictive, data warehouse unifié, insights IA, tableaux de bord intelligents.
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <p className="text-lg text-slate-300 leading-relaxed mb-6">
              L'Analyse Data Avancée de Powalyze transforme vos données brutes en intelligence stratégique. 
              Notre <strong className="text-violet-400">data warehouse unifié</strong> consolide toutes vos sources, 
              pendant que l'IA analyse en continu pour détecter les patterns cachés et générer des insights actionnables. 
              Prenez des décisions basées sur des prédictions fiables, pas sur des intuitions.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <LineChart className="text-violet-400" size={24} />
                  Analyse Prédictive
                </h3>
                <p className="text-slate-300">
                  Modèles ML entraînés sur vos données historiques pour prédire les tendances futures. 
                  Anticipez les besoins en ressources, budgets et délais avec une précision de 95%.
                </p>
              </div>

              <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <Layers className="text-purple-400" size={24} />
                  Data Warehouse Unifié
                </h3>
                <p className="text-slate-300">
                  Consolidez toutes vos sources de données dans un référentiel unique. ERP, CRM, outils 
                  projet : tout est synchronisé et accessible en temps réel.
                </p>
              </div>

              <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <Brain className="text-cyan-400" size={24} />
                  Insights IA
                </h3>
                <p className="text-slate-300">
                  L'IA analyse vos données en continu et vous alerte sur les anomalies, corrélations 
                  et opportunités. Recevez des recommandations contextualisées et actionnables.
                </p>
              </div>

              <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <Sparkles className="text-emerald-400" size={24} />
                  Tableaux de Bord Intelligents
                </h3>
                <p className="text-slate-300">
                  Dashboards qui s'adaptent à votre rôle et vos priorités. L'IA met en avant les métriques 
                  importantes et masque le bruit superflu.
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
                "Source unique de vérité pour toutes vos données",
                "Prédictions fiables avec des modèles ML entraînés sur votre contexte",
                "Détection automatique des anomalies et corrélations cachées",
                "Réduction de 80% du temps d'analyse manuelle",
                "Intégration avec tous vos outils existants (API REST, webhooks)",
                "Conformité RGPD et sécurité enterprise-grade"
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
