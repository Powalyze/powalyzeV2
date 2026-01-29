'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle, LayoutDashboard, Sparkles, ShieldCheck, LogIn } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';

export default function WelcomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createSupabaseBrowserClient();
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="animate-pulse text-slate-300">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24">
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-sm font-semibold">
            <Sparkles size={16} />
            Bienvenue sur Powalyze
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {isAuthenticated ? 'Votre espace est prêt ✨' : 'Inscription confirmée ! 🎉'}
          </h1>
          <p className="text-slate-300 text-lg mb-10">
            {isAuthenticated 
              ? 'Vous pouvez maintenant accéder au cockpit, explorer les modules et consulter les tarifs.'
              : 'Votre compte a été créé avec succès. Connectez-vous pour accéder à votre cockpit.'
            }
          </p>

          {!isAuthenticated && (
            <div className="mb-12 p-6 rounded-xl bg-gradient-to-r from-amber-500/10 to-emerald-500/10 border border-amber-500/30">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <LogIn size={22} className="text-amber-400" />
                Prochaine étape : Connexion
              </h3>
              <p className="text-slate-300 mb-4">
                Votre email a été confirmé ! Cliquez ci-dessous pour vous connecter avec vos identifiants.
              </p>
              <Link 
                href="/login" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold rounded-lg transition-all"
              >
                Se connecter maintenant <ArrowRight size={18} />
              </Link>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-3 mb-3">
                <LayoutDashboard className="text-amber-400" size={22} />
                <h3 className="text-lg font-semibold">Accéder au cockpit</h3>
              </div>
              <p className="text-slate-400 text-sm mb-4">
                Suivez vos projets, décisions et risques avec un cockpit exécutif complet.
              </p>
              <Link href="/cockpit" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300">
                Ouvrir le cockpit <ArrowRight size={16} />
              </Link>
            </div>

            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-3 mb-3">
                <ShieldCheck className="text-emerald-400" size={22} />
                <h3 className="text-lg font-semibold">Accès tarifs</h3>
              </div>
              <p className="text-slate-400 text-sm mb-4">
                Les tarifs sont désormais disponibles uniquement pour les utilisateurs inscrits.
              </p>
              <Link href="/tarifs" className="inline-flex items-center gap-2 text-emerald-300 hover:text-emerald-200">
                Voir les tarifs <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800">
            <h3 className="text-lg font-semibold mb-3">Checklist de démarrage</h3>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li className="flex items-center gap-2"><CheckCircle className="text-emerald-400" size={16} /> Compléter votre profil</li>
              <li className="flex items-center gap-2"><CheckCircle className="text-emerald-400" size={16} /> Créer votre premier projet</li>
              <li className="flex items-center gap-2"><CheckCircle className="text-emerald-400" size={16} /> Inviter votre équipe</li>
              <li className="flex items-center gap-2"><CheckCircle className="text-emerald-400" size={16} /> Générer votre premier rapport IA</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
