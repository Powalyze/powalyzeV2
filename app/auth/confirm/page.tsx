'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function AuthConfirmPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-6">
          <div className="max-w-md w-full bg-slate-900/70 border border-slate-800 rounded-2xl p-8 text-center">
            <div className="animate-pulse text-slate-300">Validation en cours...</div>
          </div>
        </div>
      }
    >
      <ConfirmContent />
    </Suspense>
  );
}

function ConfirmContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const exchange = async () => {
      try {
        const code = searchParams?.get('code');
        const tokenHash = searchParams?.get('token_hash') || searchParams?.get('token');
        const type = searchParams?.get('type') || 'signup';

        if (!code && !tokenHash) {
          setStatus('error');
          return;
        }

        const supabase = createSupabaseBrowserClient();
        const { error } = code
          ? await supabase.auth.exchangeCodeForSession(code)
          : await supabase.auth.verifyOtp({
              type: type as 'signup' | 'invite' | 'magiclink' | 'recovery' | 'email_change',
              token_hash: tokenHash as string
            });

        if (error) {
          setStatus('error');
          return;
        }

        const { data: userData } = await supabase.auth.getUser();
        const user = userData?.user;

        if (user?.email) {
          await fetch('/api/auth/welcome-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: user.email,
              firstName: user.user_metadata?.first_name || '',
              lastName: user.user_metadata?.last_name || '',
              company: user.user_metadata?.company || ''
            })
          });
        }

        setStatus('success');
        setTimeout(() => router.push('/welcome'), 1200);
      } catch {
        setStatus('error');
      }
    };

    exchange();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-6">
      <div className="max-w-md w-full bg-slate-900/70 border border-slate-800 rounded-2xl p-8 text-center">
        {status === 'loading' && (
          <>
            <div className="animate-pulse text-slate-300">Validation en cours...</div>
          </>
        )}
        {status === 'success' && (
          <>
            <h1 className="text-2xl font-bold mb-3">Email confirmé ✅</h1>
            <p className="text-slate-300">Redirection vers votre tableau de bord...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <h1 className="text-2xl font-bold mb-3">Lien invalide</h1>
            <p className="text-slate-400 mb-6">Le lien de confirmation est expiré ou incorrect.</p>
            <Link href="/signup" className="text-amber-400 hover:text-amber-300">
              Retourner à l’inscription
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
