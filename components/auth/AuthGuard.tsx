'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requirePro?: boolean;
  redirectTo?: string;
}

/**
 * AuthGuard - Protège les routes nécessitant une authentification
 * 
 * IMPORTANT: Ce composant ne redirige QUE si l'utilisateur n'est PAS authentifié.
 * Il NE DOIT PAS rediriger les utilisateurs déjà connectés.
 */
export function AuthGuard({ 
  children, 
  requireAuth = true, 
  requirePro = false,
  redirectTo = '/login'
}: AuthGuardProps) {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasPro, setHasPro] = useState(false);
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 [AuthGuard] Auth state changed:', event, !!session);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setIsAuthenticated(true);
          await checkProStatus(session?.user?.id);
        } else if (event === 'SIGNED_OUT') {
          setIsAuthenticated(false);
          setHasPro(false);
          if (requireAuth) {
            router.push(redirectTo);
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [requireAuth, redirectTo]);

  async function checkAuth() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      console.log('🔍 [AuthGuard] Checking auth:', { 
        hasUser: !!user, 
        userId: user?.id,
        error: error?.message 
      });

      if (error || !user) {
        setIsAuthenticated(false);
        setIsChecking(false);
        
        if (requireAuth) {
          console.log('⚠️ [AuthGuard] No auth, redirecting to:', redirectTo);
          router.push(redirectTo);
        }
        return;
      }

      setIsAuthenticated(true);
      
      if (requirePro) {
        await checkProStatus(user.id);
      }
      
      setIsChecking(false);
    } catch (err) {
      console.error('❌ [AuthGuard] Error checking auth:', err);
      setIsAuthenticated(false);
      setIsChecking(false);
      
      if (requireAuth) {
        router.push(redirectTo);
      }
    }
  }

  async function checkProStatus(userId?: string) {
    if (!userId) return;
    
    try {
      const { data: userData } = await supabase
        .from('users')
        .select('pro_active')
        .eq('id', userId)
        .single();

      const isPro = userData?.pro_active === true;
      setHasPro(isPro);

      if (requirePro && !isPro) {
        console.log('⚠️ [AuthGuard] Pro required but not active, redirecting to /cockpit');
        router.push('/cockpit');
      }
    } catch (err) {
      console.error('❌ [AuthGuard] Error checking Pro status:', err);
    }
  }

  // If we're checking or user is not authenticated when auth is required
  if (isChecking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // If auth is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400">Redirection vers la page de connexion...</p>
        </div>
      </div>
    );
  }

  // If Pro is required but user doesn't have Pro
  if (requirePro && !hasPro) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400">Accès Pro requis. Redirection...</p>
        </div>
      </div>
    );
  }

  // All checks passed, render children
  return <>{children}</>;
}
