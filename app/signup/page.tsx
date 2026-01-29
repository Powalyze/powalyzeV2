// app/signup/page.tsx
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSignup } from '@/hooks/useSignup';

export const dynamic = 'force-dynamic';

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
          <div className="animate-pulse">Chargement...</div>
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}

function SignupForm() {
  const { handleSignup, loading, error } = useSignup();
  const searchParams = useSearchParams();
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const redirectTo = searchParams?.get('redirect') || '/cockpit';
    const result = await handleSignup(
      email,
      password,
      firstName,
      lastName,
      company,
      redirectTo
    );

    if (result?.needsEmailConfirmation) {
      setSuccess(true);
    }
  }

  // Éviter l'hydratation mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="animate-pulse">Chargement...</div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="bg-slate-900 p-8 rounded-xl w-full max-w-md space-y-4 text-center">
          <h1 className="text-2xl font-semibold">Vérifiez votre email ✅</h1>
          <p className="text-slate-300 text-sm">
            Un email de confirmation vous a été envoyé. Cliquez sur le lien pour activer votre compte.
          </p>
          <p className="text-slate-500 text-xs">
            Vous pourrez ensuite accéder au cockpit et aux tarifs.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <form onSubmit={onSubmit} className="bg-slate-900 p-8 rounded-xl w-full max-w-md space-y-4">
        <h1 className="text-xl font-semibold">Créer un compte</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label htmlFor="firstName" className="text-xs text-slate-400">Prénom *</label>
            <input
              id="firstName"
              type="text"
              placeholder="Prénom"
              className="w-full p-2 rounded bg-slate-800"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="lastName" className="text-xs text-slate-400">Nom *</label>
            <input
              id="lastName"
              type="text"
              placeholder="Nom"
              className="w-full p-2 rounded bg-slate-800"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="company" className="text-xs text-slate-400">Société (optionnel)</label>
          <input
            id="company"
            type="text"
            placeholder="Société"
            className="w-full p-2 rounded bg-slate-800"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="email" className="text-xs text-slate-400">Email *</label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            className="w-full p-2 rounded bg-slate-800"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="text-xs text-slate-400">Mot de passe *</label>
          <input
            id="password"
            type="password"
            placeholder="Mot de passe"
            className="w-full p-2 rounded bg-slate-800"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-500 text-black py-2 rounded font-medium"
        >
          {loading ? 'Création…' : 'Créer mon compte'}
        </button>
      </form>
    </div>
  );
}
