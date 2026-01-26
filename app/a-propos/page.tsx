"use client";

import React from 'react';
import Link from 'next/link';
import { Sparkles, Award, Briefcase, GraduationCap, Users, Target } from 'lucide-react';

export default function AProposPage() {
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
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-amber-300 to-yellow-500 bg-clip-text text-transparent">
                À propos de Powalyze
              </span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Une vision, une expertise, une plateforme révolutionnaire pour la gouvernance de projets.
            </p>
          </div>

          {/* Mission */}
          <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl border border-indigo-500/10 rounded-3xl p-8 mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">Notre Mission</h2>
            <p className="text-slate-300 leading-relaxed text-lg mb-4">
              Powalyze révolutionne la gouvernance de projets en combinant intelligence artificielle avancée 
              et expertise métier. Notre plateforme permet aux entreprises de piloter leurs portefeuilles 
              avec une précision inégalée, d'anticiper les risques et d'optimiser chaque euro investi.
            </p>
            <p className="text-slate-300 leading-relaxed text-lg">
              Nous croyons que la transformation digitale passe par des outils intelligents, intuitifs et 
              puissants qui augmentent les capacités humaines plutôt que de les remplacer.
            </p>
          </div>

          {/* Founder Profile */}
          <div className="bg-gradient-to-br from-amber-900/20 to-yellow-900/20 backdrop-blur-xl border border-amber-500/20 rounded-3xl p-8 mb-12">
            <div className="flex items-start gap-6 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Users className="w-10 h-10 text-slate-950" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Fabrice Fays</h2>
                <p className="text-amber-200 text-lg">Fondateur & CEO</p>
              </div>
            </div>

            <div className="space-y-8">
              {/* Experience */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Expérience Professionnelle</h3>
                </div>
                <div className="space-y-4 ml-13">
                  <div className="bg-slate-800/30 rounded-xl p-4">
                    <h4 className="text-white font-semibold mb-1">Expert en Gouvernance IT & PMO</h4>
                    <p className="text-amber-200/80 text-sm mb-2">15+ ans d'expérience</p>
                    <p className="text-slate-300 text-sm">
                      Spécialiste en transformation digitale, pilotage de portefeuilles projets complexes, 
                      et implémentation de solutions IA pour l'optimisation de la gouvernance.
                    </p>
                  </div>
                  <div className="bg-slate-800/30 rounded-xl p-4">
                    <h4 className="text-white font-semibold mb-1">Direction de Programmes Stratégiques</h4>
                    <p className="text-slate-300 text-sm">
                      Pilotage de programmes multi-millions d'euros dans les secteurs bancaire, 
                      pharmaceutique et technologique en Suisse et en France.
                    </p>
                  </div>
                  <div className="bg-slate-800/30 rounded-xl p-4">
                    <h4 className="text-white font-semibold mb-1">Conseil en Transformation Digitale</h4>
                    <p className="text-slate-300 text-sm">
                      Accompagnement d'entreprises internationales dans leur digitalisation et 
                      l'adoption de l'IA pour la gouvernance et le pilotage stratégique.
                    </p>
                  </div>
                </div>
              </div>

              {/* Expertise */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <Award className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Domaines d'Expertise</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-3 ml-13">
                  {[
                    "Intelligence Artificielle & Machine Learning",
                    "Gouvernance IT & PMO",
                    "Transformation Digitale",
                    "Gestion de Portefeuilles Projets",
                    "Power BI & Data Analytics",
                    "Architecture Cloud (Azure, AWS)",
                    "DevOps & Automatisation",
                    "Conformité & Sécurité (RGPD, ISO)"
                  ].map((skill, i) => (
                    <div key={i} className="bg-slate-800/30 rounded-lg px-4 py-2 text-slate-200 text-sm">
                      • {skill}
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Formation</h3>
                </div>
                <div className="space-y-3 ml-13">
                  <div className="bg-slate-800/30 rounded-xl p-4">
                    <h4 className="text-white font-semibold">Master en Management de Projets IT</h4>
                    <p className="text-slate-300 text-sm">Certifications PMP, Prince2, Agile/Scrum</p>
                  </div>
                  <div className="bg-slate-800/30 rounded-xl p-4">
                    <h4 className="text-white font-semibold">Spécialisation IA & Data Science</h4>
                    <p className="text-slate-300 text-sm">Machine Learning, Deep Learning, NLP</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl border border-indigo-500/10 rounded-3xl p-8 mb-12">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              <span className="bg-gradient-to-r from-amber-300 to-yellow-500 bg-clip-text text-transparent">
                Nos Valeurs
              </span>
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-white font-bold mb-2">Excellence</h3>
                <p className="text-slate-400 text-sm">
                  Nous visons l'excellence dans chaque fonctionnalité et interaction.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="text-white font-bold mb-2">Innovation</h3>
                <p className="text-slate-400 text-sm">
                  L'IA et les technologies émergentes au service de la gouvernance.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-white font-bold mb-2">Partenariat</h3>
                <p className="text-slate-400 text-sm">
                  Nous grandissons avec nos clients, leur succès est notre succès.
                </p>
              </div>
            </div>
          </div>

          {/* Presence */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-6">Présence Internationale</h2>
            <div className="flex flex-wrap justify-center gap-6 text-slate-300">
              <div className="bg-slate-800/30 px-6 py-3 rounded-xl">
                <span className="font-semibold text-white">🇨🇭 Suisse</span> - Genève
              </div>
              <div className="bg-slate-800/30 px-6 py-3 rounded-xl">
                <span className="font-semibold text-white">🇫🇷 France</span> - Paris
              </div>
              <div className="bg-slate-800/30 px-6 py-3 rounded-xl">
                <span className="font-semibold text-white">🌍 International</span>
              </div>
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

