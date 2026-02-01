'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Crown, Sparkles, Shield, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

/**
 * Page Pro SaaS - Version Production
 * Inscription au mode PRO avec authentification Supabase
 */
export default function ProSaaSPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
          company,
          mode: 'pro' // Force mode PRO
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Signup failed');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
    } catch (err) {
      console.error('Signup error:', err);
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
        <div className="bg-slate-900 border border-emerald-500/20 rounded-2xl p-8 max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="text-emerald-500" size={32} />
          </div>
          
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-white">Compte Pro créé !</h1>
            <p className="text-slate-400">
              Un email de confirmation vous a été envoyé à <span className="text-emerald-400 font-semibold">{email}</span>
            </p>
            <p className="text-slate-500 text-sm">
              Cliquez sur le lien dans l'email pour activer votre compte et accéder au cockpit Pro.
            </p>
          </div>

          <div className="pt-4">
            <Link 
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-400 transition-colors"
            >
              Se connecter
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-500/30 rounded-full mb-6">
            <Crown className="text-amber-500" size={20} />
            <span className="text-amber-500 font-semibold">Version PRO</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Passez en Mode <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-emerald-500">PRO</span>
          </h1>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Débloquez toutes les fonctionnalités premium de Powalyze et créez vos propres projets
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-3">
            <Sparkles className="text-amber-500" size={32} />
            <h3 className="text-lg font-semibold">IA Narrative Complète</h3>
            <p className="text-sm text-slate-400">
              Génération automatique de rapports exécutifs, briefs COMEX, et analyses prédictives
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-3">
            <Shield className="text-emerald-500" size={32} />
            <h3 className="text-lg font-semibold">Données Sécurisées</h3>
            <p className="text-sm text-slate-400">
              Vos projets stockés dans Supabase avec isolation complète et sauvegardes automatiques
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-3">
            <TrendingUp className="text-blue-500" size={32} />
            <h3 className="text-lg font-semibold">Projets Illimités</h3>
            <p className="text-sm text-slate-400">
              Gérez autant de projets que nécessaire sans limitation, avec export CSV/PDF/PPT
            </p>
          </div>
        </div>

        {/* Signup Form */}
        <div className="max-w-md mx-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Créer un compte Pro</h2>
              <p className="text-slate-400 text-sm">Accès complet au cockpit en production</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="firstName" className="text-xs text-slate-400">Prénom *</label>
                  <input
                    id="firstName"
                    type="text"
                    placeholder="Prénom"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
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
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="company" className="text-xs text-slate-400">Société *</label>
                <input
                  id="company"
                  type="text"
                  placeholder="Nom de votre société"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="email" className="text-xs text-slate-400">Email professionnel *</label>
                <input
                  id="email"
                  type="email"
                  placeholder="vous@entreprise.com"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
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
                  placeholder="Minimum 8 caractères"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-semibold rounded-lg hover:from-amber-400 hover:to-emerald-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Création en cours...
                  </span>
                ) : (
                  'Créer mon compte Pro'
                )}
              </button>
            </form>

            <div className="pt-4 border-t border-slate-800 text-center text-sm text-slate-400">
              Vous avez déjà un compte ?{' '}
              <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold">
                Se connecter
              </Link>
            </div>
          </div>

          {/* Trust Signals */}
          <div className="mt-8 text-center space-y-3">
            <div className="flex items-center justify-center gap-6 text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <Shield size={14} />
                <span>Données chiffrées</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle size={14} />
                <span>RGPD conforme</span>
              </div>
              <div className="flex items-center gap-1">
                <Crown size={14} />
                <span>Support prioritaire</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

