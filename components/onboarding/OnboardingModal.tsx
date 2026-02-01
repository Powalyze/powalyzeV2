/**
 * PACK 27 - Wizard d'onboarding guidé (Simplifié)
 */

'use client';

import { useState } from 'react';

interface OnboardingModalProps {
  open: boolean;
  onComplete: () => void;
}

export function OnboardingModal({ open, onComplete }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(1);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-900 rounded-xl p-6 max-w-2xl w-full mx-4 border border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-4">Bienvenue sur Powalyze</h2>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <div
                key={step}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step <= currentStep ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400'
                }`}
              >
                {step}
              </div>
            ))}
          </div>
        </div>

        <div className="min-h-[200px] text-white">
          {currentStep === 1 && (
            <div>
              <p className="mb-4">Votre cockpit exécutif pour piloter vos projets</p>
              <p className="text-sm text-gray-400">
                Nous allons vous guider en 6 étapes pour créer votre premier projet.
              </p>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <label className="block mb-2">Nom de votre organisation</label>
              <input
                type="text"
                placeholder="Ex: Acme Corporation"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
            </div>
          )}

          {currentStep === 6 && (
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="font-semibold text-lg mb-4">L'IA pour booster votre gouvernance</h3>
              <ul className="text-sm text-gray-400 space-y-2 text-left max-w-md mx-auto">
                <li>✨ Génération automatique de résumés exécutifs</li>
                <li>🎯 Recommandations proactives</li>
                <li>📈 Prédictions de budget et de délais</li>
              </ul>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-4 py-2 border border-slate-700 text-white rounded-lg disabled:opacity-50"
          >
            Précédent
          </button>
          <button
            onClick={() => {
              if (currentStep === 6) {
                onComplete();
              } else {
                setCurrentStep(currentStep + 1);
              }
            }}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg"
          >
            {currentStep === 6 ? 'Terminer' : 'Suivant'}
          </button>
        </div>
      </div>
    </div>
  );
}
