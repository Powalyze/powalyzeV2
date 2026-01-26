"use client";

import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/50 backdrop-blur-xl border-b border-indigo-500/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">
              Powalyze
            </span>
          </Link>
        </div>
      </nav>

      <div className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">
            <span className="bg-gradient-to-r from-amber-300 to-yellow-500 bg-clip-text text-transparent">
              Mentions Légales
            </span>
          </h1>

          <div className="space-y-8 text-slate-300">
            <section className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl border border-indigo-500/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Éditeur du site</h2>
              <p className="mb-2"><strong className="text-white">Raison sociale:</strong> Powalyze SA</p>
              <p className="mb-2"><strong className="text-white">Siège social Suisse:</strong> Genève, Suisse</p>
              <p className="mb-2"><strong className="text-white">Siège social France:</strong> Paris, France</p>
              <p className="mb-2"><strong className="text-white">Email:</strong> contact@powalyze.com / contact@powalyze.ch</p>
              <p className="mb-2"><strong className="text-white">Téléphone:</strong> +33 6 15 76 70 67</p>
              <p className="mb-2"><strong className="text-white">Directeur de publication:</strong> Fabrice Fays</p>
            </section>

            <section className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl border border-indigo-500/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Hébergement</h2>
              <p className="mb-2"><strong className="text-white">Hébergeur:</strong> Vercel Inc.</p>
              <p className="mb-2"><strong className="text-white">Adresse:</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, USA</p>
              <p>Le site est hébergé sur une infrastructure cloud sécurisée avec des serveurs répartis mondialement.</p>
            </section>

            <section className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl border border-indigo-500/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Propriété intellectuelle</h2>
              <p className="leading-relaxed">
                L'ensemble du contenu de ce site (textes, images, logos, vidéos) est la propriété exclusive de Powalyze 
                et est protégé par les lois françaises et internationales relatives à la propriété intellectuelle. 
                Toute reproduction, même partielle, est strictement interdite sans autorisation préalable.
              </p>
            </section>

            <section className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl border border-indigo-500/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Protection des données personnelles</h2>
              <p className="leading-relaxed mb-4">
                Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi suisse sur la protection 
                des données (LPD), vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition 
                concernant vos données personnelles.
              </p>
              <p className="leading-relaxed">
                Pour exercer ces droits, contactez-nous à: <a href="mailto:contact@powalyze.com" className="text-amber-400 hover:text-amber-300">contact@powalyze.com</a>
              </p>
            </section>

            <section className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl border border-indigo-500/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Cookies</h2>
              <p className="leading-relaxed">
                Ce site utilise des cookies techniques nécessaires au bon fonctionnement du site et des cookies analytiques 
                pour améliorer l'expérience utilisateur. Vous pouvez paramétrer vos préférences de cookies à tout moment.
              </p>
            </section>

            <section className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl border border-indigo-500/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Contact</h2>
              <p className="mb-2">Pour toute question concernant les mentions légales :</p>
              <p className="mb-1">📧 <a href="mailto:contact@powalyze.com" className="text-amber-400 hover:text-amber-300">contact@powalyze.com</a></p>
              <p className="mb-1">📧 <a href="mailto:contact@powalyze.ch" className="text-amber-400 hover:text-amber-300">contact@powalyze.ch</a></p>
              <p>📞 +33 6 15 76 70 67</p>
            </section>
          </div>
        </div>
      </div>

      <footer className="py-12 px-6 border-t border-indigo-500/10">
        <div className="max-w-7xl mx-auto text-center text-slate-400 text-sm">
          © 2026 Powalyze - Tous droits réservés
        </div>
      </footer>
    </div>
  );
}

