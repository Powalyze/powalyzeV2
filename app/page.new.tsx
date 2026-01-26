"use client";

import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black">
      <Hero />
    </main>
  );
}

function Hero() {
  return (
    <section className="px-[7vw] pt-28 pb-24 flex flex-col lg:flex-row gap-10 items-start">
      <div className="max-w-xl">
        <p className="text-xs text-slate-400 mb-3">
          Cockpit exécutif • Gouvernance IA • Portefeuilles complexes
        </p>
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Powalyze est un cockpit conçu pour piloter les portefeuilles les plus sensibles.
        </motion.h1>
        <p className="text-slate-300 text-base md:text-lg mb-4">
          Un système pour la gouvernance moderne : risques, budgets, décisions, comités.
          Aligne ton organisation autour d'une seule source de vérité.
        </p>
        <p className="text-slate-400 text-sm mb-6">
          Remplace les Excel, les slides et les mails dispersés par un cockpit
          temps réel, assisté par IA, inspiré des meilleurs outils produits.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="/cockpit"
            className="px-5 py-2.5 rounded-full bg-slate-50 text-slate-900 text-sm font-semibold"
          >
            Démarrer avec Powalyze
          </a>
          <a
            href="/contact"
            className="px-5 py-2.5 rounded-full border border-slate-600 text-sm text-slate-100"
          >
            Parler à un humain
          </a>
        </div>
      </div>

      <div className="flex-1 w-full">
        {/* Ici on mettra le mock cockpit / screenshot style Linear */}
        <div className="h-72 rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-900 to-slate-950" />
      </div>
    </section>
  );
}

