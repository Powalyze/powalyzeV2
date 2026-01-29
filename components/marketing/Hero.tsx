// ============================================================================
// Hero - Section héro de la page d'accueil
// ============================================================================

import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative px-6 py-20 md:py-32 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full">
              <span className="text-xs font-medium text-amber-400">
                Nouveau : IA générative intégrée
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
              Le cockpit exécutif
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                piloté par l'IA
              </span>
            </h1>

            <p className="text-lg text-slate-300 leading-relaxed">
              Centralisez vos risques, décisions et indicateurs dans un cockpit vivant.
              Inspiré des meilleurs SaaS comme Monday.com, conçu pour la gouvernance exécutive.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/demo"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 rounded-lg font-semibold text-base shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all"
              >
                Explorer le mode Demo
                <ArrowRight size={20} />
              </Link>

              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-100 rounded-lg font-semibold text-base transition-all"
              >
                Accéder au mode Pro
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-8 border-t border-slate-800">
              <div>
                <p className="text-2xl font-bold text-white">500+</p>
                <p className="text-sm text-slate-400">Organisations</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">50K+</p>
                <p className="text-sm text-slate-400">Items suivis</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">99.9%</p>
                <p className="text-sm text-slate-400">Uptime</p>
              </div>
            </div>
          </div>

          {/* Right: Visual */}
          <div className="relative">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-1 shadow-2xl">
              <div className="bg-slate-950 rounded-xl p-6 space-y-4">
                {/* Mock cockpit preview */}
                <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg" />
                  <div>
                    <p className="text-sm font-medium text-white">Cockpit Exécutif</p>
                    <p className="text-xs text-slate-500">Organisation Demo</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <p className="text-xs text-slate-400 mb-1">Critiques</p>
                    <p className="text-2xl font-bold text-red-400">3</p>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                    <p className="text-xs text-slate-400 mb-1">Warnings</p>
                    <p className="text-2xl font-bold text-yellow-400">7</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="bg-slate-800/50 rounded-lg p-3 flex items-center gap-3"
                    >
                      <div className="w-2 h-2 rounded-full bg-red-400" />
                      <div className="flex-1">
                        <div className="h-2 bg-slate-700 rounded w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>

                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm font-medium text-slate-300 transition-colors">
                  <Play size={16} />
                  Voir la démo vidéo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
