"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Send, Sparkles } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
      {/* Navigation */}
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
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-slate-300 hover:text-white transition-colors text-sm">
              Connexion
            </Link>
            <Link 
              href="/register" 
              className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 text-sm font-medium rounded-xl transition-all shadow-lg shadow-amber-500/25"
            >
              Commencer
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-amber-300 to-yellow-500 bg-clip-text text-transparent">
                Contactez-nous
              </span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Une question ? Un projet ? Notre équipe est à votre écoute.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl border border-indigo-500/10 rounded-3xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Nos coordonnées</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2">Email</h3>
                      <a href="mailto:contact@powalyze.com" className="text-slate-400 hover:text-white transition-colors block">
                        contact@powalyze.com
                      </a>
                      <a href="mailto:contact@powalyze.ch" className="text-slate-400 hover:text-white transition-colors block">
                        contact@powalyze.ch
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2">Téléphone</h3>
                      <a href="tel:+33615767067" className="text-slate-400 hover:text-white transition-colors">
                        +33 6 15 76 70 67
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2">Nos bureaux</h3>
                      <p className="text-slate-400">
                        <strong className="text-white">Suisse:</strong> Genève<br />
                        <strong className="text-white">France:</strong> Paris<br />
                        <strong className="text-white">Présence:</strong> Internationale
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-900/20 to-yellow-900/20 backdrop-blur-xl border border-amber-500/20 rounded-3xl p-6">
                <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  Réponse rapide
                </h3>
                <p className="text-amber-200/80 text-sm">
                  Nous nous engageons à vous répondre sous 24h ouvrées.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl border border-indigo-500/10 rounded-3xl p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Send className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Message envoyé !</h3>
                  <p className="text-slate-400">
                    Merci pour votre message. Nous vous répondrons dans les plus brefs délais.
                  </p>
                </div>
              ) : (
                <form
                  action="https://formspree.io/f/mblzvddg"
                  method="POST"
                  onSubmit={() => setTimeout(() => setSubmitted(true), 100)}
                >
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-white font-medium mb-2">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="w-full px-4 py-3 bg-slate-800/50 border border-indigo-500/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors"
                        placeholder="Jean Dupont"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-white font-medium mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="w-full px-4 py-3 bg-slate-800/50 border border-indigo-500/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors"
                        placeholder="jean@exemple.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="company" className="block text-white font-medium mb-2">
                        Société
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-indigo-500/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors"
                        placeholder="Votre entreprise"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-white font-medium mb-2">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-indigo-500/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors"
                        placeholder="+33 6 12 34 56 78"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-white font-medium mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-indigo-500/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors resize-none"
                        placeholder="Parlez-nous de votre projet..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full px-8 py-4 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 font-semibold rounded-xl transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                      Envoyer le message
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-indigo-500/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-slate-950" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">
                Powalyze
              </span>
            </div>
            <div className="flex items-center gap-8 text-sm text-slate-400">
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
              <Link href="/tarifs" className="hover:text-white transition-colors">Tarifs</Link>
              <Link href="/a-propos" className="hover:text-white transition-colors">À propos</Link>
              <Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link>
              <Link href="/cgu" className="hover:text-white transition-colors">CGU</Link>
              <span>© 2026 Powalyze</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
