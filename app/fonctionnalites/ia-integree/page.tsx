"use client";

import React from "react";
import Link from "next/link";
import { Brain, ArrowLeft, Sparkles, Zap, MessageSquare, Target } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export default function IAIntegreePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6">
            <ArrowLeft size={20} />
            Retour à l'accueil
          </Link>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                IA Intégrée
              </h1>
              <p className="text-xl text-slate-300">
                L'IA n'est pas un module. Elle analyse, propose, agit et accompagne. En continu.
              </p>
            </div>
          </div>
        </div>

        <Card className="mb-8">
          <CardContent className="p-8">
            <p className="text-lg text-slate-300 leading-relaxed mb-6">
              Notre IA n'est pas une fonction à part, c'est le <strong className="text-purple-400">cœur vivant</strong> de Powalyze. 
              Elle travaille en arrière-plan, analyse chaque donnée, détecte les patterns et vous accompagne dans chaque décision.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <Sparkles className="text-purple-400" size={24} />
                  Analyse Prédictive
                </h3>
                <p className="text-slate-300">
                  L'IA anticipe les risques, identifie les opportunités et vous alerte avant que les problèmes n'apparaissent.
                </p>
              </div>

              <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <MessageSquare className="text-blue-400" size={24} />
                  Copilote Intelligent
                </h3>
                <p className="text-slate-300">
                  Posez vos questions en langage naturel. L'IA vous répond, explique et recommande des actions concrètes.
                </p>
              </div>

              <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <Zap className="text-amber-400" size={24} />
                  Auto-Healing
                </h3>
                <p className="text-slate-300">
                  L'IA détecte les anomalies et propose automatiquement des correctifs. 
                  Certains problèmes sont résolus avant même que vous ne les voyiez.
                </p>
              </div>

              <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <Target className="text-emerald-400" size={24} />
                  Recommandations Contextuelles
                </h3>
                <p className="text-slate-300">
                  L'IA comprend votre contexte unique et adapte ses suggestions à votre situation spécifique.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-12 text-center">
          <Link href="/inscription">
            <Button variant="primary" size="lg">
              Découvrir l'IA Powalyze
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
