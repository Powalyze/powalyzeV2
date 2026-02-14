// ============================================================================
// LoginForm - Connexion OU Accès Demo Simplifié
// ============================================================================

'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import { Mail, Lock, Eye, EyeOff, User, Building2, Zap } from 'lucide-react';
import Link from 'next/link';

type TabMode = 'login' | 'demo';

export default function LoginForm() {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();
  
  const [mode, setMode] = useState<TabMode>('demo');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Demo mode fields
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Sign in with Supabase
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('🔐 [LOGIN] Réponse Supabase:', { 
        hasData: !!data, 
        hasUser: !!data?.user, 
        hasSession: !!data?.session,
        error: signInError?.message 
      });

      if (signInError) {
        console.error('❌ [LOGIN] Erreur d\'authentification:', signInError);
        setError(signInError.message);
        setLoading(false);
        return;
      }

      if (!data.session) {
        console.error('❌ [LOGIN] Pas de session créée');
        setError('Échec de création de session');
        setLoading(false);
        return;
      }

      if (!data.user) {
        console.error('❌ [LOGIN] Pas d\'utilisateur trouvé');
        setError('Erreur de connexion');
        setLoading(false);
        return;
      }

      console.log('✅ [LOGIN] Session créée:', {
        userId: data.user.id,
        email: data.user.email,
        sessionToken: data.session.access_token ? 'présent' : 'absent'
      });

      // 2. S'assurer que l'utilisateur a les droits Pro actifs
      console.log('🔧 [LOGIN] Activation des droits Pro...');
      try {
        const { data: existingUser } = await supabase
          .from('users')
          .select('pro_active')
          .eq('id', data.user.id)
          .single();

        if (!existingUser || !existingUser.pro_active) {
          // Activer le mode Pro automatiquement
          const { error: updateError } = await supabase
            .from('users')
            .upsert({
              id: data.user.id,
              email: data.user.email,
              pro_active: true,
              role: 'admin',
              created_at: new Date().toISOString()
            }, {
              onConflict: 'id'
            });

          if (updateError) {
            console.warn('⚠️ [LOGIN] Erreur activation Pro:', updateError);
          } else {
            console.log('✅ [LOGIN] Droits Pro activés');
          }
        } else {
          console.log('✅ [LOGIN] Droits Pro déjà actifs');
        }
      } catch (err) {
        console.warn('⚠️ [LOGIN] Erreur vérification Pro:', err);
      }

      // 3. ATTENTE PROPAGATION SESSION + HARD RELOAD (RENFORCÉ)
      // Important: Utiliser window.location.href pour forcer un reload complet
      // Cela garantit que le middleware côté serveur voit la nouvelle session
      console.log('🔄 [LOGIN] Redirection vers /cockpit/projets (hard reload)');
      
      // Vérification que la session est bien persistée ET que les cookies sont écrits
      const savedSession = await supabase.auth.getSession();
      if (!savedSession.data.session) {
        console.error('❌ [LOGIN] Session non trouvée après login!');
        setError('Erreur de session - veuillez réessayer');
        setLoading(false);
        return;
      }
      
      console.log('✅ [LOGIN] Session confirmée persistée:', {
        userId: savedSession.data.session.user.id,
        hasAccessToken: !!savedSession.data.session.access_token,
        expiresAt: savedSession.data.session.expires_at
      });
      
      // Vérifier que les cookies sont effectivement présents dans le navigateur
      const hasCookies = document.cookie.includes('sb-') && 
                        document.cookie.includes('-auth-token');
      
      if (!hasCookies) {
        console.warn('⚠️ [LOGIN] Cookies Supabase non détectés dans le navigateur');
        // Attendre un peu plus longtemps
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Délai augmenté (2s) pour garantir l'écriture des cookies côté serveur
      console.log('⏳ [LOGIN] Attente 2s propagation cookies...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Hard reload au lieu de router.push() pour synchroniser session client/serveur
      console.log('🚀 [LOGIN] Lancement hard reload...');
      window.location.href = '/cockpit';
      
    } catch (err: any) {
      setError(err.message || 'Erreur inconnue');
      setLoading(false);
    }
  };

  const handleDemoSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Générer un mot de passe aléatoire pour le mode demo
      const randomPassword = Math.random().toString(36).slice(-12) + 'Aa1!';

      // 1. Créer le compte Supabase
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password: randomPassword,
        options: {
          data: {
            full_name: fullName,
            company: company || 'Demo',
          },
          emailRedirectTo: `${window.location.origin}/cockpit`,
        }
      });

      console.log('🎯 [DEMO] Création compte:', { 
        hasData: !!data, 
        hasUser: !!data?.user, 
        error: signUpError?.message 
      });

      if (signUpError) {
        console.error('❌ [DEMO] Erreur création:', signUpError);
        
        // Si l'utilisateur existe déjà, essayer de se connecter
        if (signUpError.message.includes('already registered')) {
          setError('Cet email existe déjà. Utilisez l\'onglet "Connexion" avec votre mot de passe.');
          setLoading(false);
          return;
        }
        
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      if (!data.user) {
        setError('Erreur de création de compte');
        setLoading(false);
        return;
      }

      console.log('✅ [DEMO] Compte créé:', {
        userId: data.user.id,
        email: data.user.email,
      });

      // 2. Activer automatiquement le mode Pro
      console.log('🔧 [DEMO] Activation Pro...');
      try {
        const { error: updateError } = await supabase
          .from('users')
          .upsert({
            id: data.user.id,
            email: data.user.email,
            full_name: fullName,
            company: company || 'Demo',
            pro_active: true,
            role: 'client',
            created_at: new Date().toISOString()
          }, {
            onConflict: 'id'
          });

        if (updateError) {
          console.warn('⚠️ [DEMO] Erreur activation Pro:', updateError);
        } else {
          console.log('✅ [DEMO] Pro activé');
        }
      } catch (err) {
        console.warn('⚠️ [DEMO] Erreur Pro:', err);
      }

      // 3. Si le compte nécessite une confirmation email
      if (data.session) {
        // Session créée directement - rediriger
        console.log('✅ [DEMO] Session directe - redirection');
        await new Promise(resolve => setTimeout(resolve, 1000));
        window.location.href = '/cockpit';
      } else {
        // Besoin de confirmation email
        console.log('📧 [DEMO] Confirmation email requise');
        setError('Un email de confirmation a été envoyé. Cliquez sur le lien pour accéder.');
        setLoading(false);
      }
      
    } catch (err: any) {
      console.error('❌ [DEMO] Erreur:', err);
      setError(err.message || 'Erreur inconnue');
      setLoading(false);
    }
  };

  return (
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
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Accès au Cockpit</h1>
          <p className="text-slate-400">Connectez-vous ou essayez gratuitement</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-slate-800/50 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setMode('demo')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
              mode === 'demo'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="inline-block mr-2" size={16} />
            Accès Demo
          </button>
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
              mode === 'login'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Lock className="inline-block mr-2" size={16} />
            Connexion
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Form Demo */}
        {mode === 'demo' && (
          <form onSubmit={handleDemoSignup} className="space-y-4">
            <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <p className="text-sm text-amber-300">
                ✨ Accès instantané sans mot de passe. Entrez simplement vos informations.
              </p>
            </div>

            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-slate-300 mb-2">
                Nom complet *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jean Dupont"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-11 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email-demo" className="block text-sm font-medium text-slate-300 mb-2">
                Email professionnel *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input
                  id="email-demo"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@entreprise.com"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-11 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-slate-300 mb-2">
                Entreprise (optionnel)
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input
                  id="company"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Mon Entreprise"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-11 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 rounded-lg transition-all font-semibold shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Création en cours...' : '🚀 Accéder au Cockpit'}
            </button>
          </form>
        )}

        {/* Form Login */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email-login" className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input
                  id="email-login"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@entreprise.com"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-11 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
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

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 rounded-lg transition-all font-semibold shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
