'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

/**
 * Page Inscription — Création compte Powalyze
 * Formulaire complet : Prénom, Nom, Email, Password, Entreprise (opt), Téléphone (opt)
 */
export default function InscriptionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    company: '',
    phone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Créer le compte Supabase avec PKCE flow
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            company: formData.company,
            phone: formData.phone,
          },
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      });

      if (authError) throw authError;

      // Vérifier si l'email doit être confirmé
      if (authData.user && !authData.session) {
        // Email confirmation requise
        setSuccess(true);
        // Redirection vers page de vérification email
        setTimeout(() => {
          router.push('/verification?email=' + encodeURIComponent(formData.email));
        }, 2000);
      } else if (authData.session) {
        // Session créée directement (email confirmation désactivée)
        setSuccess(true);
        setTimeout(() => {
          router.push('/onboarding/forfait');
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création du compte');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#1C1F26] rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">Compte créé !</h2>
          <p className="text-slate-300 mb-4">
            Un email de confirmation a été envoyé à <strong>{formData.email}</strong>
          </p>
          <p className="text-sm text-slate-400">Redirection automatique...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#D4AF37] mb-2">Créer votre compte</h1>
          <p className="text-slate-300">Rejoignez Powalyze et transformez votre gouvernance</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#1C1F26] rounded-2xl p-8 space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Prénom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-[#0A0F1C] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#D4AF37] transition"
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Nom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-[#0A0F1C] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#D4AF37] transition"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email professionnel <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-[#0A0F1C] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#D4AF37] transition"
              placeholder="john.doe@entreprise.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Mot de passe <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
              className="w-full px-4 py-3 bg-[#0A0F1C] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#D4AF37] transition"
              placeholder="••••••••"
            />
            <p className="text-xs text-slate-400 mt-1">Minimum 8 caractères</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Entreprise <span className="text-slate-500">(optionnel)</span>
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#0A0F1C] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#D4AF37] transition"
              placeholder="Votre Entreprise SA"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Téléphone <span className="text-slate-500">(optionnel)</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#0A0F1C] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#D4AF37] transition"
              placeholder="+33 6 12 34 56 78"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-[#D4AF37] hover:bg-[#C4A037] text-[#0A0F1C] font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Création en cours...' : 'Créer mon compte'}
          </button>

          <p className="text-center text-sm text-slate-400">
            Déjà un compte ?{' '}
            <Link href="/login" className="text-[#D4AF37] hover:underline">
              Se connecter
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
