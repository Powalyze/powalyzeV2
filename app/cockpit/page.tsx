'use client';

import { CockpitShell } from "@/components/cockpit/CockpitShell";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function CockpitIndexPage() {
  return (
    <CockpitShell>
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="max-w-2xl text-center space-y-8">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/30 flex items-center justify-center backdrop-blur-sm">
              <Sparkles size={48} className="text-amber-400" />
            </div>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Bienvenue sur Powalyze
            </h1>
            <p className="text-lg text-slate-400">
              Votre cockpit exécutif pour la gouvernance de portefeuille
            </p>
          </div>

          {/* Empty State Message */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 backdrop-blur-sm">
            <p className="text-slate-300 text-lg mb-6">
              Pour créer vos premiers projets et accéder aux fonctionnalités avancées,
              <br />
              <span className="text-white font-semibold">activez votre abonnement Pro.</span>
            </p>
            
            <div className="flex items-center justify-center gap-2 text-sm text-slate-500 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span>Projets illimités</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span>Risques & Décisions</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span>Rapports IA</span>
              </div>
            </div>

            <Link
              href="/cockpit/tarifs"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-amber-500/30"
            >
              Découvrir les offres
              <ArrowRight size={20} />
            </Link>
          </div>

          {/* Footer Note */}
          <p className="text-sm text-slate-500">
            Vous souhaitez tester avant d'activer Pro ?{' '}
            <Link href="/demo" className="text-amber-400 hover:text-amber-300 underline">
              Essayez la démo publique
            </Link>
          </p>
        </div>
      </div>
    </CockpitShell>
  );
}
