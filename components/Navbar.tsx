'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User, LogOut, Shield, TestTube } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'demo' | 'pro' | 'admin' | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        fetchUserProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setUserRole(null);
        setUserEmail(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setIsAuthenticated(true);
      setUserEmail(session.user.email || null);
      await fetchUserProfile(session.user.id);
    }
  }

  async function fetchUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (!error && data) {
      setUserRole(data.role as 'demo' | 'pro' | 'admin');
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/');
  }

  const isOnCockpitDemo = pathname?.startsWith('/cockpit-demo');
  const isOnCockpitPro = pathname?.startsWith('/cockpit') && !pathname?.startsWith('/cockpit-demo');

  return (
    <header className="fixed top-0 inset-x-0 z-40 border-b border-slate-800/70 bg-slate-950/80 backdrop-blur">
      <div className="px-[7vw] h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm font-semibold tracking-tight">
            Powalyze
          </Link>
          <nav className="hidden md:flex items-center gap-4 text-xs text-slate-400">
            <Link href="/a-propos">Produit</Link>
            <Link href="/cas-usage">Cas d'usage</Link>
            <Link href="/services">Services</Link>
            <Link href="/temoignages">Clients</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3 text-xs">
          {/* Bouton Démo */}
          <Link 
            href="/cockpit-demo"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${
              isOnCockpitDemo 
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TestTube className="h-3.5 w-3.5" />
            Démo
          </Link>

          {/* Bouton Accès Pro */}
          <Link 
            href="/cockpit"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${
              isOnCockpitPro 
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="h-3.5 w-3.5" />
            Accès Pro
          </Link>

          {isAuthenticated ? (
            <>
              {/* Info utilisateur */}
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 text-xs">
                <User className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-slate-300">{userEmail}</span>
                {userRole && (
                  <span className={`px-2 py-0.5 rounded-full font-medium ${
                    userRole === 'admin' 
                      ? 'bg-purple-500/20 text-purple-400'
                      : userRole === 'pro'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {userRole.toUpperCase()}
                  </span>
                )}
              </div>

              {/* Bouton Admin (si admin) */}
              {userRole === 'admin' && (
                <Link 
                  href="/admin/users"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30 transition-colors"
                >
                  <Shield className="h-3.5 w-3.5" />
                  Admin
                </Link>
              )}

              {/* Bouton Déconnexion */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-slate-400 hover:text-slate-200 transition-colors">
                Connexion
              </Link>
              <Link
                href="/register"
                className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-900 font-semibold hover:bg-white transition-colors"
              >
                Commencer
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
