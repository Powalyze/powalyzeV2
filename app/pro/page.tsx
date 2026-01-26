'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProPage() {
  const router = useRouter();
  const [clientCode, setClientCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleAccess(e: React.FormEvent) {
    e.preventDefault();
    
    if (!clientCode.trim()) {
      setError('Veuillez entrer votre code client');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Appel API pour valider le code client
      const response = await fetch('/api/auth/validate-client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: clientCode }),
      });

      const data = await response.json();

      if (data.success && data.client && data.token) {
        // Stocker le token JWT
        localStorage.setItem('powalyze_token', data.token);
        
        // Stocker les informations client
        sessionStorage.setItem('powalyze_client_code', data.client.code);
        sessionStorage.setItem('powalyze_client_name', data.client.name);
        sessionStorage.setItem('powalyze_client_org', data.client.organizationId);
        sessionStorage.setItem('powalyze_client_features', JSON.stringify(data.client.features));
        
        // Redirection selon le type de code
        if (data.client.code === 'DEMO') {
          // Mode DEMO -> cockpit avec données fictives
          router.push('/cockpit');
        } else {
          // Client réel -> cockpit Supabase avec données persistantes
          router.push('/cockpit-client-supabase');
        }
      } else {
        setError(data.error || 'Code client invalide. Vérifiez votre code ou contactez votre responsable Powalyze.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error validating client:', error);
      setError('Erreur de connexion. Veuillez réessayer.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl opacity-50" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-slate-800/50 px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <svg width="32" height="32" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="46" stroke="#C9A227" strokeWidth="4" />
              <path d="M30 55 L50 25 L70 55 L50 75 Z" fill="#C9A227" />
            </svg>
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Powalyze</div>
              <div className="text-sm text-slate-300">Accès Client Sécurisé</div>
            </div>
          </a>
          <a href="/cockpit" className="text-sm text-slate-400 hover:text-slate-300 transition">
            ← Retour à la démo
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center px-8 py-20">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-800/50 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/20 border border-amber-500/30 flex items-center justify-center">
                <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Accès Client Sécurisé</h1>
              <p className="text-sm text-slate-400">Entrez votre code pour accéder à votre cockpit</p>
            </div>

            {/* Form */}
            <form onSubmit={handleAccess} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="clientCode" className="block text-sm font-medium text-slate-300 mb-2">
                  Code Client
                </label>
                <input
                  id="clientCode"
                  type="text"
                  value={clientCode}
                  onChange={(e) => setClientCode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAccess(e)}
                  placeholder="Entrez votre code (ex: CLIENT-ACME)"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all font-mono uppercase"
                  autoComplete="off"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Vérification...
                  </span>
                ) : (
                  'Accéder au Cockpit'
                )}
              </button>
            </form>

            {/* Info */}
            <div className="mt-6 pt-6 border-t border-slate-800">
              <p className="text-xs text-slate-500 text-center">
                Vous n&apos;avez pas de code client ?{' '}
                <a href="/contact" className="text-amber-400 hover:text-amber-300 transition">
                  Contactez-nous
                </a>
              </p>
            </div>

            {/* Demo hint */}
            <div className="mt-4 bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
              <p className="text-xs text-blue-300 text-center">
                💡 Pour tester: utilisez le code <span className="font-mono font-semibold">DEMO</span>
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <p className="text-[10px] text-slate-400">Sécurisé</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-[10px] text-slate-400">Temps Réel</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <p className="text-[10px] text-slate-400">IA Intégrée</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/50 px-8 py-6 mt-auto">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xs text-slate-500">
            © 2026 Powalyze. Cockpit Exécutif & Gouvernance IA. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}

