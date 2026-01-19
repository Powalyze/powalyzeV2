"use client";

import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function CGUPage() {
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
              Conditions Générales d'Utilisation
            </span>
          </h1>

          <div className="space-y-8 text-slate-300">
            <section className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl border border-indigo-500/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">1. Objet</h2>
              <p className="leading-relaxed">
                Les présentes Conditions Générales d'Utilisation (CGU) ont pour objet de définir les modalités et conditions 
                d'utilisation de la plateforme Powalyze ainsi que les droits et obligations des parties dans ce cadre.
              </p>
            </section>

            <section className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl border border-indigo-500/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">2. Acceptation des CGU</h2>
              <p className="leading-relaxed">
                L'utilisation de la plateforme Powalyze implique l'acceptation pleine et entière des présentes CGU. 
                Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services.
              </p>
            </section>

            <section className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl border border-indigo-500/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">3. Services fournis</h2>
              <p className="leading-relaxed mb-4">
                Powalyze est une plateforme SaaS de gouvernance de projets incluant :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Tableaux de bord interactifs et analytics avancés</li>
                <li>Intelligence artificielle prédictive</li>
                <li>Gestion de portefeuille de projets</li>
                <li>Rapports et exports Power BI</li>
                <li>Automatisation de workflows</li>
                <li>Intégrations API</li>
              </ul>
            </section>

            <section className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl border border-indigo-500/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">4. Inscription et compte utilisateur</h2>
              <p className="leading-relaxed mb-4">
                Pour accéder aux services, vous devez créer un compte en fournissant des informations exactes et à jour. 
                Vous êtes responsable de la confidentialité de vos identifiants et de toutes les activités effectuées 
                sous votre compte.
              </p>
              <p className="leading-relaxed">
                Vous vous engagez à notifier immédiatement Powalyze de toute utilisation non autorisée de votre compte.
              </p>
            </section>

            <section className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl border border-indigo-500/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">5. Tarification et paiement</h2>
              <p className="leading-relaxed mb-4">
                Les tarifs de nos services sont indiqués sur notre page <Link href="/tarifs" className="text-amber-400 hover:text-amber-300">Tarifs</Link>. 
                Les paiements sont effectués mensuellement ou annuellement selon l'abonnement choisi.
              </p>
              <p className="leading-relaxed">
                En cas de non-paiement, Powalyze se réserve le droit de suspendre l'accès aux services après notification.
              </p>
            </section>

            <section className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl border border-indigo-500/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">6. Protection des données</h2>
              <p className="leading-relaxed mb-4">
                Powalyze s'engage à protéger vos données conformément au RGPD (Europe) et à la LPD (Suisse). 
                Vos données sont chiffrées end-to-end et stockées sur des serveurs sécurisés.
              </p>
              <p className="leading-relaxed">
                Nous ne vendons jamais vos données à des tiers. Pour plus d'informations, consultez notre 
                Politique de Confidentialité.
              </p>
            </section>

            <section className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl border border-indigo-500/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">7. Propriété intellectuelle</h2>
              <p className="leading-relaxed">
                Tous les éléments de la plateforme (code, design, algorithmes IA, documentation) sont la propriété 
                exclusive de Powalyze. Toute reproduction ou utilisation non autorisée est interdite.
              </p>
            </section>

            <section className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl border border-indigo-500/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">8. Responsabilité</h2>
              <p className="leading-relaxed mb-4">
                Powalyze met tout en œuvre pour assurer la disponibilité et la sécurité des services. Toutefois, 
                nous ne pouvons garantir une disponibilité 100% et ne saurions être tenus responsables des dommages 
                indirects résultant d'une interruption de service.
              </p>
              <p className="leading-relaxed">
                Pour les comptes Enterprise, un SLA de 99.9% est garanti contractuellement.
              </p>
            </section>

            <section className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl border border-indigo-500/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">9. Résiliation</h2>
              <p className="leading-relaxed">
                Vous pouvez résilier votre abonnement à tout moment depuis votre espace client. La résiliation prend 
                effet à la fin de la période de facturation en cours. Aucun remboursement n'est effectué pour la période 
                déjà payée.
              </p>
            </section>

            <section className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl border border-indigo-500/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">10. Droit applicable</h2>
              <p className="leading-relaxed">
                Les présentes CGU sont régies par le droit suisse pour les clients basés en Suisse et par le droit 
                français pour les clients basés en France. Tout litige sera soumis aux tribunaux compétents.
              </p>
            </section>

            <section className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl border border-indigo-500/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">11. Contact</h2>
              <p className="mb-2">Pour toute question concernant ces CGU :</p>
              <p className="mb-1">📧 <a href="mailto:contact@powalyze.com" className="text-amber-400 hover:text-amber-300">contact@powalyze.com</a></p>
              <p className="mb-1">📧 <a href="mailto:contact@powalyze.ch" className="text-amber-400 hover:text-amber-300">contact@powalyze.ch</a></p>
              <p>📞 +33 6 15 76 70 67</p>
            </section>

            <p className="text-slate-400 text-sm italic mt-8">
              Dernière mise à jour : Janvier 2026
            </p>
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
