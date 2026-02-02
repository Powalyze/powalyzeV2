'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

/**
 * Page Vérification Email
 * Gère la confirmation après inscription + tokens de vérification
 */
export default function VerificationPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <VerificationContent />
    </Suspense>
  );
}

function VerificationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [message, setMessage] = useState('');
  const email = searchParams?.get('email') || '';
  const token = searchParams?.get('token') || '';

  useEffect(() => {
    // Si token présent → vérification automatique
    if (token) {
      verifyToken();
    } else {
      // Sinon → attente de clic sur email
      setStatus('pending');
    }
  }, [token]);

  const verifyToken = async () => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email',
      });

      if (error) throw error;

      setStatus('success');
      setMessage('Email vérifié ! Redirection vers le choix du forfait...');
      
      // Redirection vers choix forfait après 2s
      setTimeout(() => {
        router.push('/onboarding/forfait');
      }, 2000);
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Erreur lors de la vérification');
    }
  };

  const resendEmail = async () => {
    if (!email) return;

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) throw error;

      setMessage('Email renvoyé ! Vérifiez votre boîte de réception.');
    } catch (err: any) {
      setMessage(err.message || 'Erreur lors de l\'envoi');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-[#1C1F26] rounded-2xl p-8 text-center">
        {status === 'pending' && (
          <>
            <div className="w-16 h-16 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">Vérifiez votre email</h2>
            <p className="text-slate-300 mb-6">
              Un email de confirmation a été envoyé à{' '}
              {email && <strong className="text-white">{email}</strong>}
            </p>
            <p className="text-sm text-slate-400 mb-6">
              Cliquez sur le lien dans l'email pour activer votre compte.
            </p>
            
            {email && (
              <button
                onClick={resendEmail}
                className="text-[#D4AF37] hover:underline text-sm"
              >
                Renvoyer l'email
              </button>
            )}
            
            {message && (
              <p className="mt-4 text-sm text-green-400">{message}</p>
            )}
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">Email vérifié !</h2>
            <p className="text-slate-300 mb-4">{message}</p>
            <div className="animate-pulse text-[#D4AF37]">Redirection...</div>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">Erreur de vérification</h2>
            <p className="text-red-400 mb-6">{message}</p>
            <Link
              href="/inscription"
              className="inline-block px-6 py-3 bg-[#D4AF37] text-[#0A0F1C] rounded-lg font-semibold hover:bg-[#C4A037] transition"
            >
              Retour à l'inscription
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center">
      <div className="text-white animate-pulse">Chargement...</div>
    </div>
  );
}
