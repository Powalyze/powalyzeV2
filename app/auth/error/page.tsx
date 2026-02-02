'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

/**
 * Page erreur Auth - Affichée quand la validation email échoue
 * Causes possibles : code expiré, code invalide, lien réutilisé
 */

function AuthErrorContent() {
  const params = useSearchParams();
  const reason = params.get('reason');
  const message = params.get('message');

  const getErrorMessage = () => {
    if (reason === 'missing_code') {
      return "Le lien de validation ne contient pas de code de confirmation. Vérifiez que vous avez bien cliqué sur le lien complet dans l'email.";
    }
    if (reason === 'confirmation_failed') {
      return message || "La confirmation a échoué. Le lien a peut-être déjà été utilisé ou est expiré.";
    }
    if (reason?.includes('otp_expired')) {
      return "Le lien de validation a expiré ou a déjà été utilisé. Les liens de confirmation ne peuvent être utilisés qu'une seule fois.";
    }
    return "Une erreur s'est produite lors de la validation de votre compte.";
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-[#1C1F26] rounded-2xl p-8">
        {/* Icône erreur */}
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>

        {/* Titre */}
        <h1 className="text-2xl font-bold text-white text-center mb-4">
          Erreur de validation
        </h1>

        {/* Message d'erreur */}
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
          <p className="text-red-300 text-sm leading-relaxed">
            {getErrorMessage()}
          </p>
        </div>

        {/* Détails techniques (si disponibles) */}
        {reason && (
          <details className="mb-6">
            <summary className="text-sm text-slate-400 cursor-pointer hover:text-slate-300 mb-2">
              Détails techniques
            </summary>
            <div className="bg-slate-800/50 rounded p-3">
              <p className="text-xs text-slate-400 font-mono break-all">
                Reason: {reason}
              </p>
              {message && (
                <p className="text-xs text-slate-400 font-mono break-all mt-2">
                  Message: {message}
                </p>
              )}
            </div>
          </details>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href="/inscription"
            className="block w-full bg-[#D4AF37] hover:bg-[#C9A334] text-[#0A0F1C] font-semibold py-3 rounded-lg text-center transition-colors"
          >
            Créer un nouveau compte
          </Link>

          <Link
            href="/login"
            className="block w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg text-center transition-colors"
          >
            Se connecter
          </Link>
        </div>

        {/* Note explicative */}
        <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
          <p className="text-xs text-slate-400 leading-relaxed">
            <strong className="text-slate-300">Note :</strong> Si vous avez déjà validé votre compte, 
            essayez de vous connecter directement. Les liens de confirmation ne peuvent être utilisés qu'une seule fois.
          </p>
        </div>

        {/* Support */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-400">
            Besoin d'aide ?{' '}
            <Link href="/contact" className="text-[#D4AF37] hover:underline">
              Contactez le support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center">
        <div className="text-white">Chargement...</div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  );
}
