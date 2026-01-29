'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import { User, LogOut, ChevronDown, Menu, X } from 'lucide-react';

export function Navbar() {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();
  const pathname = usePathname();
  const [userId, setUserId] = useState<string | null>(null);
  const [mode, setMode] = useState<'pro' | 'demo' | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setUserId(null);
      setMode(null);
      setUserEmail(null);
      return;
    }
    
    setUserId(user.id);
    setUserEmail(user.email || null);
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('mode')
      .eq('id', user.id)
      .single();
    
    setMode(profile?.mode ?? null);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUserId(null);
    setMode(null);
    setUserEmail(null);
    router.push('/');
  }

  const isLoggedIn = !!userId;
  const isCockpitPage = pathname?.startsWith('/cockpit');

  // Si on est dans le cockpit, afficher une navbar simplifiée
  if (isCockpitPage) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo-powalyze.svg" alt="Powalyze" className="w-14 h-14" />
          <span className="text-white font-bold text-xl">Powalyze</span>
        </Link>

        {isLoggedIn && (
          <div className="flex items-center gap-4">
            <Link href="/cockpit" className="text-sm text-slate-300 hover:text-white">
              Cockpit
            </Link>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
              <User className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-300">{userEmail}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-white transition-colors"
              title="Se déconnecter"
            >
              <LogOut size={18} />
            </button>
          </div>
        )}
      </nav>
    );
  }

  // Navbar marketing pour la vitrine
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/50 bg-slate-950/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo-powalyze.svg" alt="Powalyze" className="w-14 h-14" />
            <span className="text-white font-bold text-xl">Powalyze</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            <Link href="/" className="text-sm text-slate-300 hover:text-white transition-colors">
              Accueil
            </Link>
            
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm text-slate-300 hover:text-white transition-colors">
                Le Cockpit
                <ChevronDown size={16} className="group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-56 py-2 bg-slate-900 border border-slate-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <Link href="/le-cockpit" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white">
                  Vue d'ensemble
                </Link>
                <Link href="/modules" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white">
                  Modules
                </Link>
                <Link href="/ia" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white">
                  IA intégrée
                </Link>
                <Link href="/demo-interactive" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white">
                  Démonstration interactive
                </Link>
              </div>
            </div>

            <div className="relative group">
              <button className="flex items-center gap-1 text-sm text-slate-300 hover:text-white transition-colors">
                Méthodologies
                <ChevronDown size={16} className="group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-56 py-2 bg-slate-900 border border-slate-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <Link href="/methodologies" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white">
                  Vue d'ensemble
                </Link>
                <Link href="/methodologies/agile" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white">
                  Agile
                </Link>
                <Link href="/methodologies/hermes" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white">
                  Hermès
                </Link>
                <Link href="/methodologies/cycle-v" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white">
                  Cycle en V
                </Link>
                <Link href="/methodologies/hybride" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white">
                  Hybride
                </Link>
              </div>
            </div>

            <div className="relative group">
              <button className="flex items-center gap-1 text-sm text-slate-300 hover:text-white transition-colors">
                Expertise
                <ChevronDown size={16} className="group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-56 py-2 bg-slate-900 border border-slate-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <Link href="/expertise" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white">
                  Vue d'ensemble
                </Link>
                <Link href="/expertise/pmo" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white">
                  PMO senior
                </Link>
                <Link href="/expertise/data" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white">
                  Data Analyst
                </Link>
                <Link href="/expertise/powerbi" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white">
                  Power BI Expert
                </Link>
                <Link href="/expertise/gouvernance" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white">
                  Gouvernance
                </Link>
              </div>
            </div>

            <Link href="/tarifs" className="text-sm text-slate-300 hover:text-white transition-colors">
              Tarifs
            </Link>

            <div className="relative group">
              <button className="flex items-center gap-1 text-sm text-slate-300 hover:text-white transition-colors">
                Ressources
                <ChevronDown size={16} className="group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-56 py-2 bg-slate-900 border border-slate-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <Link href="/ressources/blog" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white">
                  Blog / Insights
                </Link>
                <Link href="/ressources/cas-clients" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white">
                  Cas clients
                </Link>
                <Link href="/ressources/faq" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white">
                  FAQ
                </Link>
                <Link href="/ressources/documentation" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white">
                  Documentation
                </Link>
              </div>
            </div>
          </div>

          {/* CTA Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            {!isLoggedIn ? (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 transition-all text-sm font-medium"
                >
                  Se connecter
                </Link>
                <Link
                  href="/inscription"
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-semibold text-sm shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all"
                >
                  Créer un compte
                </Link>
              </>
            ) : (
              <>
                <Link href="/cockpit" className="px-4 py-2 text-sm text-amber-400 hover:text-amber-300">
                  Mon Cockpit
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Déconnexion
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 py-4 border-t border-slate-800 space-y-2">
            <Link href="/" className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg">
              Accueil
            </Link>
            <Link href="/le-cockpit" className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg">
              Le Cockpit
            </Link>
            <Link href="/methodologies" className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg">
              Méthodologies
            </Link>
            <Link href="/expertise" className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg">
              Expertise
            </Link>
            <Link href="/tarifs" className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg">
              Tarifs
            </Link>
            <Link href="/ressources/blog" className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg">
              Ressources
            </Link>
            {!isLoggedIn ? (
              <>
                <Link href="/login" className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg">
                  Se connecter
                </Link>
                <Link href="/inscription" className="block px-4 py-2 bg-amber-500 text-slate-950 font-semibold rounded-lg hover:bg-amber-400">
                  Créer un compte
                </Link>
              </>
            ) : (
              <>
                <Link href="/cockpit" className="block px-4 py-2 text-amber-400 hover:bg-slate-900 rounded-lg">
                  Mon Cockpit
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg"
                >
                  Déconnexion
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
