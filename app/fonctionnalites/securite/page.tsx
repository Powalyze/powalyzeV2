"use client";

import React from 'react';
import Link from 'next/link';
import { Sparkles, Shield, Lock, Eye, FileCheck, Server, CheckCircle } from 'lucide-react';

export default function SecuritePage() {
  return (
    <div className="min-h-screen bg-black">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-amber-500/20">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
              Powalyze
            </span>
          </Link>
          <Link href="/register" className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black text-sm font-medium rounded-xl transition-all shadow-lg shadow-amber-500/20">
            Commencer
          </Link>
        </div>
      </nav>

      <div className="pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-amber-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                Sécurité Maximale
              </span>
            </h1>
            <p className="text-xl text-blue-300 max-w-2xl mx-auto">
              Conformité RGPD, ISO 27001, SOC 2. Vos données sont protégées par chiffrement end-to-end.
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Chiffrement de Bout en Bout</h2>
              <p className="text-white/80 leading-relaxed mb-6">
                Toutes vos données sont chiffrées avec les standards les plus élevés (AES-256). 
                Vos informations restent confidentielles, même en transit et au repos.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <Lock className="w-8 h-8 text-amber-400 mb-3" />
                  <h3 className="text-white font-semibold mb-2">AES-256</h3>
                  <p className="text-white/60 text-sm">Chiffrement militaire</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <Server className="w-8 h-8 text-blue-400 mb-3" />
                  <h3 className="text-white font-semibold mb-2">Hébergement sécurisé</h3>
                  <p className="text-white/60 text-sm">Datacenters certifiés</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <Eye className="w-8 h-8 text-green-400 mb-3" />
                  <h3 className="text-white font-semibold mb-2">Monitoring 24/7</h3>
                  <p className="text-white/60 text-sm">Surveillance continue</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Conformité Réglementaire</h2>
              <p className="text-white/80 leading-relaxed mb-6">
                Nous respectons toutes les normes de conformité internationales pour garantir 
                la protection de vos données et celle de vos clients.
              </p>
              <ul className="space-y-3">
                {[
                  "RGPD (Règlement Général sur la Protection des Données)",
                  "ISO 27001 (Sécurité de l'information)",
                  "SOC 2 Type II (Conformité opérationnelle)",
                  "Audits de sécurité réguliers"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/80">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Contrôle d'Accès Granulaire</h2>
              <p className="text-white/80 leading-relaxed mb-6">
                Définissez précisément qui peut voir quoi. Gérez les permissions par utilisateur, 
                équipe ou projet avec une granularité totale.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <FileCheck className="w-8 h-8 text-amber-400 mb-3" />
                  <h3 className="text-white font-semibold mb-2">Authentification forte</h3>
                  <p className="text-white/60 text-sm">MFA, SSO, et biométrie disponibles</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <Shield className="w-8 h-8 text-blue-400 mb-3" />
                  <h3 className="text-white font-semibold mb-2">Rôles personnalisables</h3>
                  <p className="text-white/60 text-sm">Permissions adaptées à votre organisation</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Sauvegardes et Récupération</h2>
              <p className="text-white/80 leading-relaxed">
                Sauvegardes automatiques quotidiennes avec rétention de 30 jours. 
                Récupération point-in-time en cas de besoin.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-semibold rounded-xl transition-all shadow-lg shadow-amber-500/20">
              <Shield className="w-5 h-5" />
              Sécuriser mes projets
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
