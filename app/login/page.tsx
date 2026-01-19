"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Set authentication
    localStorage.setItem('powalyze_auth', 'true');
    // Redirect to cockpit or to the page they were trying to access
    const redirect = searchParams.get('redirect') || '/cockpit';
    router.push(redirect);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-6 py-12">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
            <span className="text-slate-950 font-bold text-2xl">P</span>
          </div>
          <span className="text-white font-bold text-2xl">Powalyze</span>
        </Link>

        {/* Login Card */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-800/50 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Bon retour !</h1>
            <p className="text-slate-400">Connectez-vous à votre cockpit</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@entreprise.com"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-11 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-11 pr-12 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-amber-500 focus:ring-offset-slate-900"
                />
                <span className="text-sm text-slate-400">Se souvenir de moi</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-amber-400 hover:text-amber-300 transition-colors">
                Mot de passe oublié ?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 rounded-lg transition-all font-semibold shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50"
            >
              Se connecter
              <ArrowRight size={20} />
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-900/50 text-slate-400">Ou continuer avec</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-lg transition-all text-slate-300">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-lg transition-all text-slate-300">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.5 6.507a.809.809 0 0 0-.098-.307.835.835 0 0 0-.197-.245.833.833 0 0 0-.291-.161.818.818 0 0 0-.319-.036c-.218.014-.421.101-.586.249a8.13 8.13 0 0 1-2.063 1.106c-.698-1.024-1.853-1.697-3.164-1.697-2.092 0-3.793 1.701-3.793 3.793 0 .297.033.586.094.865-3.154-.151-5.943-1.671-7.814-3.964a.831.831 0 0 0-.676-.327c-.179 0-.355.062-.495.178a.837.837 0 0 0-.291.497c-.065.291-.176.569-.329.826a3.75 3.75 0 0 0-.396.848 3.793 3.793 0 0 0-.2 1.183c0 1.09.462 2.075 1.202 2.765a2.46 2.46 0 0 1-.482-.119.832.832 0 0 0-.65.094.826.826 0 0 0-.391.541c0 .036 0 .072.006.108 0 1.543.871 2.885 2.148 3.563-.202.022-.408.008-.607-.043a.83.83 0 0 0-.625.146.834.834 0 0 0-.356.557c.422 1.332 1.597 2.312 3.016 2.581-1.301.946-2.853 1.455-4.489 1.455-.293 0-.586-.016-.879-.047a.832.832 0 0 0-.595 1.404c1.873 1.245 4.062 1.901 6.335 1.901 7.602 0 11.762-6.297 11.762-11.762 0-.179-.004-.357-.011-.535.81-.586 1.512-1.314 2.083-2.158a.831.831 0 0 0-.041-.997z" />
              </svg>
              Microsoft
            </button>
          </div>

          {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-slate-400">
              Pas encore de compte ?{" "}
              <Link href="/register" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
                Créer un compte
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Notice */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            Mode démo actif - Connexion automatique au cockpit
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
