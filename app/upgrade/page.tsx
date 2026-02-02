// ============================================================
// POWALYZE V2 — UPGRADE PAGE
// ============================================================

import { upgradeToPro } from '@/lib/auth-actions-v2';
import { getCurrentPlan } from '@/lib/auth-v2';
import { Check, Zap } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function UpgradePage() {
  const plan = await getCurrentPlan();
  
  // Si déjà Pro, rediriger
  if (plan !== 'demo') {
    redirect('/cockpit/pro');
  }
  
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Passez en Mode Pro
          </h1>
          <p className="text-xl text-slate-400">
            Débloquez toutes les fonctionnalités de Powalyze
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Plan Pro</h2>
          </div>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>Créez et gérez vos propres projets</p>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>Suivez les risques et décisions en temps réel</p>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>Gérez les ressources et dépendances</p>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>Génération de rapports exécutifs par IA</p>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>API & Webhooks pour intégrations</p>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>Support prioritaire</p>
            </div>
          </div>
          
          <form action={upgradeToPro}>
            <button
              type="submit"
              className="w-full bg-white text-amber-600 font-bold py-4 px-6 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Activer le Mode Pro (Gratuit pour le moment)
            </button>
          </form>
          
          <p className="text-sm text-center mt-4 opacity-75">
            Actuellement en accès gratuit pendant la phase de lancement
          </p>
        </div>
        
        <div className="text-center">
          <a href="/cockpit/demo" className="text-slate-400 hover:text-white text-sm">
            ← Retour au Mode Démo
          </a>
        </div>
      </div>
    </div>
  );
}
