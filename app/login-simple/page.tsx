'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, AlertCircle } from 'lucide-react';
import Link from 'next/link';

/**
 * SYSTÈME D'AUTH SIMPLIFIÉ - Pas de Supabase, juste localStorage
 * 
 * Comptes de démo :
 * - admin@powalyze.com / admin123
 * - demo@powalyze.com / demo123
 */

const DEMO_ACCOUNTS = [
  { email: 'admin@powalyze.com', password: 'admin123', name: 'Admin', role: 'admin', hasPro: true },
  { email: 'demo@powalyze.com', password: 'demo123', name: 'Demo User', role: 'user', hasPro: true },
  { email: 'test@powalyze.com', password: 'test123', name: 'Test User', role: 'user', hasPro: true }
];

export default function SimpleLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simuler un petit délai pour l'UX
    await new Promise(resolve => setTimeout(resolve, 500));

    // Vérifier les identifiants
    const account = DEMO_ACCOUNTS.find(
      acc => acc.email.toLowerCase() === email.toLowerCase() && acc.password === password
    );

    if (!account) {
      setError('Email ou mot de passe incorrect');
      setLoading(false);
      return;
    }

    // Créer un token simple
    const token = {
      email: account.email,
      name: account.name,
      role: account.role,
      hasPro: account.hasPro,
      timestamp: Date.now()
    };

    // Stocker dans localStorage  
    localStorage.setItem('powalyze_auth', JSON.stringify(token));
    
    // CRITIQUE: Créer aussi un cookie pour le middleware
    document.cookie = `simple_auth_token=${JSON.stringify(token)}; path=/; max-age=86400; SameSite=Lax`;
    
    console.log('✅ [SIMPLE AUTH] Login réussi:', account.email);

    // Redirection directe avec délai minimal
    await new Promise(resolve => setTimeout(resolve, 300));
    window.location.href = '/cockpit/projets';
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
            <span className="text-slate-950 font-bold text-2xl">P</span>
          </div>
          <span className="text-white font-bold text-2xl">Powalyze</span>
        </Link>

        {/* Card */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-800/50">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Connexion Simple</h1>
            <p className="text-slate-400">Accès direct à votre cockpit</p>
          </div>

          {/* Comptes de démo */}
          <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <p className="text-sm text-amber-400 font-semibold mb-2">Comptes de test :</p>
            <div className="text-xs text-slate-300 space-y-1">
              <div>• admin@powalyze.com / admin123</div>
              <div>• demo@powalyze.com / demo123</div>
              <div>• test@powalyze.com / test123</div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3">
              <AlertCircle className="text-red-400 flex-shrink-0" size={20} />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-slate-400 text-sm font-semibold mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-11 pr-4 py-3 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  placeholder="votre@email.com"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-slate-400 text-sm font-semibold mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-11 pr-4 py-3 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold transition-all shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <Link 
              href="/" 
              className="text-sm text-slate-400 hover:text-amber-400 transition-colors"
            >
              ← Retour à l'accueil
            </Link>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 text-center text-sm text-slate-500">
          <p>✨ Système d'authentification simplifié</p>
          <p className="mt-1">Pas de complexité, accès direct au cockpit</p>
        </div>
      </div>
    </div>
  );
}
