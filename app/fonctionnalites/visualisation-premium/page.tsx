"use client";

import React from "react";
import Link from "next/link";
import { Eye, ArrowLeft, CheckCircle, BarChart3, Database, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export default function VisualisationPremiumPage() {
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
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center">
              <Eye className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                Visualisation Premium
              </h1>
              <p className="text-xl text-slate-300">
                Power BI, Supabase et IA fusionnent pour offrir une vue 360° augmentée en temps réel.
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <p className="text-lg text-slate-300 leading-relaxed mb-6">
              La Visualisation Premium de Powalyze combine la puissance de <strong className="text-blue-400">Power BI</strong>, 
              la flexibilité de <strong className="text-cyan-400">Supabase</strong> et l'intelligence de l'IA pour créer 
              des dashboards qui comprennent votre métier. Visualisez vos données sous tous les angles avec des insights 
              automatiques et des analyses prédictives intégrées.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <BarChart3 className="text-blue-400" size={24} />
                  Tableaux de Bord Temps Réel
                </h3>
                <p className="text-slate-300">
                  Vos données actualisées en continu. Suivez vos KPIs stratégiques et opérationnels 
                  avec des dashboards qui se rafraîchissent automatiquement.
                </p>
              </div>

              <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <Database className="text-cyan-400" size={24} />
                  Intégration Power BI
                </h3>
                <p className="text-slate-300">
                  Connectez vos rapports Power BI existants à Powalyze. Enrichissez-les avec nos 
                  analyses IA et partagez-les avec vos équipes en un clic.
                </p>
              </div>

              <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <Eye className="text-emerald-400" size={24} />
                  Données Unifiées
                </h3>
                <p className="text-slate-300">
                  Consolidez toutes vos sources de données dans une vue unique. Projets, finances, 
                  ressources, risques : tout est centralisé et cohérent.
                </p>
              </div>

              <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <Sparkles className="text-purple-400" size={24} />
                  Insights Augmentés
                </h3>
                <p className="text-slate-300">
                  L'IA analyse vos données et vous suggère des insights pertinents. Détectez les 
                  tendances, anomalies et opportunités avant qu'elles ne deviennent critiques.
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
                "Dashboards personnalisés pour chaque niveau de l'organisation",
                "Intégration native avec Power BI et autres outils BI",
                "Actualisation en temps réel de toutes vos données",
                "Détection automatique des anomalies et tendances",
                "Partage sécurisé avec contrôle d'accès granulaire",
                "Export et scheduling automatique de vos rapports"
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
