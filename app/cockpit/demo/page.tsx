"use client";

import { CockpitShell } from "@/components/cockpit/CockpitShell";

export default function CockpitDemoPage() {
  return (
    <CockpitShell>
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Cockpit Démo</h1>
          <p className="text-slate-400">Découvrez toutes les fonctionnalités</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-2">Projets</h3>
            <p className="text-slate-400">Gérez votre portefeuille de projets</p>
          </div>
          
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-2">Risques</h3>
            <p className="text-slate-400">Identifiez et mitigez les risques</p>
          </div>
          
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-2">Décisions</h3>
            <p className="text-slate-400">Suivez vos décisions stratégiques</p>
          </div>
        </div>
      </div>
    </CockpitShell>
  );
}
