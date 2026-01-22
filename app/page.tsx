"use client";

import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black">
      <Hero />
      <Services />
      <UseCases />
      <TrustedBy />
      <FeaturePillars />
      <Testimonials />
      <FAQ />
      <Footer />
    </main>
  );
}

/* -------------------------------------------------------
   HERO
------------------------------------------------------- */

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
          Powalyze est un cockpit conçu pour piloter les portefeuilles les plus
          sensibles.
        </motion.h1>

        <p className="text-slate-300 text-base md:text-lg mb-4">
          Un système pour la gouvernance moderne : risques, budgets, décisions,
          comités. Aligne ton organisation autour d'une seule source de vérité.
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
        <HeroVideoMock />
      </div>
    </section>
  );
}

function HeroVideoMock() {
  return (
    <motion.div
      className="h-72 rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-900 to-slate-950 overflow-hidden shadow-[0_0_60px_rgba(15,23,42,0.9)]"
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.1, duration: 0.45 }}
    >
      <div className="flex items-center justify-between px-3 py-2 text-[0.7rem] text-slate-300 bg-gradient-to-r from-slate-950 to-slate-900 border-b border-slate-800">
        <span>Powalyze — Vue d'ensemble</span>
        <span className="text-slate-400">Analyse active • IA en ligne</span>
      </div>

      <div className="p-3 text-[0.7rem] grid grid-cols-[1.1fr_1.4fr] gap-2">
        {/* Bloc gauche */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2">
          <div className="mb-1">
            <div className="text-slate-400 text-[0.65rem]">Projets actifs</div>
            <div className="text-slate-50 text-[0.85rem] font-semibold">
              42 • 4 à risque
            </div>
          </div>

          <div className="mb-1">
            <div className="text-slate-400 text-[0.65rem]">
              Budget consommé
            </div>
            <div className="text-slate-50 text-[0.85rem] font-semibold">
              7.8M€ • 98%
            </div>
          </div>

          <div className="mt-1 h-[70px] rounded-lg bg-gradient-to-b from-sky-500/25 via-transparent to-transparent border border-slate-800 relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-[radial-gradient(circle_at_10%_80%,rgba(59,130,246,0.7)_0,transparent_55%),radial-gradient(circle_at_70%_20%,rgba(244,114,182,0.7)_0,transparent_55%)] mix-blend-screen opacity-80"
              animate={{ x: [-10, 10], y: [0, -6] }}
              transition={{
                duration: 12,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </div>
        </div>

        {/* Bloc droit */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2 flex flex-col">
          <div className="flex items-center justify-between mb-1">
            <span className="text-slate-100 text-[0.75rem]">
              Chief of Staff IA
            </span>
            <span className="px-2 py-[2px] rounded-full border border-slate-600 text-[0.6rem] text-slate-300">
              Analyse continue
            </span>
          </div>

          <div className="flex flex-col gap-[3px] mt-1">
            <div className="flex items-center justify-between text-slate-300">
              <span>Optimiser portefeuille Q2</span>
              <span className="text-emerald-400">+12% vélocité</span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span>Identifier 3 projets à risque</span>
              <span className="text-emerald-400">-450K€</span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span>Fast‑track Cloud</span>
              <span className="text-emerald-400">+3 sem.</span>
            </div>
          </div>

          <div className="mt-2 text-[0.65rem] text-emerald-400">
            Portfolio sain • Aucun blocage critique détecté.
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------
   SERVICES
------------------------------------------------------- */

function Services() {
  return (
    <section className="px-[7vw] py-20 bg-gradient-to-b from-slate-950 to-slate-950">
      <h2 className="text-2xl md:text-[2rem] font-semibold mb-2">
        Pilotage exécutif, sans bruit.
      </h2>

      <p className="text-slate-400 text-sm md:text-base max-w-xl">
        Powalyze remplace les tableaux Excel, les slides et les mails éparpillés
        par un cockpit unique, lisible et actionnable.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <ServiceCard
          kicker="Pilotage"
          title="Vue d'ensemble portefeuille"
          body="Projets, budgets, équipes, risques et opportunités dans une seule vue. Filtrable par BU, sponsor, horizon."
        />

        <ServiceCard
          kicker="IA native"
          title="Analyse continue & prédiction"
          body="Détection automatique des dérives, recommandations chiffrées, scénarios what‑if en temps réel."
        />

        <ServiceCard
          kicker="Exécution"
          title="Actions recommandées"
          body="Plan d'actions concret : qui fait quoi, quand, avec quel impact sur le budget, le délai et le risque."
        />
      </div>
    </section>
  );
}

function ServiceCard({ kicker, title, body }: any) {
  return (
    <motion.div
      className="bg-panel border border-white/5 rounded-lgx p-6 shadow-soft hover:bg-panel-hover hover:border-blue-500/60 transition"
      whileHover={{ y: -2 }}
    >
      <div className="text-[0.7rem] uppercase tracking-[0.16em] text-slate-500 mb-1">
        {kicker}
      </div>

      <div className="text-sm font-semibold mb-2">{title}</div>

      <p className="text-xs md:text-sm text-slate-400">{body}</p>
    </motion.div>
  );
}

/* -------------------------------------------------------
   USE CASES
------------------------------------------------------- */

function UseCases() {
  return (
    <section className="px-[7vw] py-24 bg-slate-950">
      <h2 className="text-2xl md:text-[2rem] font-semibold mb-2">
        Conçu pour les vrais comités de pilotage.
      </h2>

      <p className="text-slate-400 text-sm md:text-base max-w-xl">
        Pas un gadget. Un outil de commandement pour DG, DSI, PMO, CFO.
      </p>

      <div className="grid md:grid-cols-3 gap-5 mt-7">
        <UseCaseCard
          title="Comité de pilotage mensuel"
          meta="Synthèse automatique, risques, décisions, exports prêts en 2 minutes."
          cta="→ Simuler dans le cockpit"
        />

        <UseCaseCard
          title="Réduction de coûts ciblée"
          meta="Scénarios -10% / -15% / -20% avec impact sur délais et risques."
          cta="→ Lancer un what‑if"
        />

        <UseCaseCard
          title="Fast‑track ERP / Cloud"
          meta="Simuler +2 FTE, arbitrer les priorités, sécuriser la date de go‑live."
          cta="→ Voir le plan IA"
        />
      </div>
    </section>
  );
}

function UseCaseCard({ title, meta, cta }: any) {
  return (
    <motion.div
      className="bg-panel-soft border border-white/5 rounded-2xl p-5 flex flex-col justify-between gap-3 text-sm cursor-pointer hover:bg-panel-hover hover:border-blue-500/70 transition"
      whileHover={{ y: -2 }}
    >
      <div>
        <div className="font-semibold mb-1">{title}</div>
        <div className="text-xs text-slate-400">{meta}</div>
      </div>

      <div className="text-[0.75rem] text-slate-400">{cta}</div>
    </motion.div>
  );
}

/* -------------------------------------------------------
   TRUSTED BY
------------------------------------------------------- */

function TrustedBy() {
  return (
    <section className="px-[7vw] py-20 bg-slate-950 border-t border-slate-800">
      <p className="text-center text-slate-400 text-sm mb-6">
        Adopté par les meilleures équipes produit
      </p>

      <div className="flex flex-wrap justify-center gap-10 opacity-70 text-sm md:text-base">
        <span className="font-semibold">OpenAI</span>
        <span className="font-semibold">Vercel</span>
        <span className="font-semibold">Coinbase</span>
        <span className="font-semibold">Ramp</span>
        <span className="font-semibold">Scale</span>
        <span className="font-semibold">Cursor</span>
      </div>
    </section>
  );
}

/* -------------------------------------------------------
   FEATURE PILLARS
------------------------------------------------------- */

function FeaturePillars() {
  return (
    <section className="px-[7vw] py-24 bg-gradient-to-b from-black to-slate-950">
      <div className="grid md:grid-cols-3 gap-10">
        <Pillar
          title="Conçu pour la gouvernance"
          desc="Un cockpit pensé pour les organisations complexes : portefeuilles, risques, arbitrages, décisions."
        />

        <Pillar
          title="Optimisé pour la vitesse"
          desc="IA proactive, actions recommandées, scénarios instantanés. Décidez plus vite, avec plus de certitude."
        />

        <Pillar
          title="Finition chirurgicale"
          desc="Interface premium, animations subtiles, lisibilité parfaite. Inspiré des meilleurs outils produits."
        />
      </div>
    </section>
  );
}

function Pillar({ title, desc }: any) {
  return (
    <div className="bg-panel border border-white/5 rounded-2xl p-8 shadow-soft hover:bg-panel-hover transition">
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-slate-400 text-sm">{desc}</p>
    </div>
  );
}

/* -------------------------------------------------------
   TESTIMONIALS
------------------------------------------------------- */

function Testimonials() {
  return (
    <section className="px-[7vw] py-24 bg-slate-950 text-center">
      <div className="text-lg md:text-xl max-w-3xl mx-auto mb-3">
        "Powalyze nous a fait gagner 3 semaines sur le Cloud et éviter 450K€ de
        dépassement."
      </div>

      <div className="text-xs md:text-sm text-slate-400">
        Directeur de programme — Transformation Cloud & ERP
      </div>
    </section>
  );
}

/* -------------------------------------------------------
   FAQ
------------------------------------------------------- */

function FAQ() {
  return (
    <section className="px-[7vw] py-24 bg-slate-950">
      <h2 className="text-2xl md:text-[2rem] font-semibold mb-6">
        Questions fréquentes
      </h2>

      <div className="max-w-xl">
        <details className="bg-panel border border-white/5 rounded-xl p-4 mb-3 text-sm">
          <summary className="cursor-pointer font-medium">
            Comment fonctionne l'IA de Powalyze ?
          </summary>

          <p className="mt-2 text-xs text-slate-400">
            Elle analyse en continu vos projets, budgets et charges pour
            détecter les dérives et recommander des actions.
          </p>
        </details>

        <details className="bg-panel border border-white/5 rounded-xl p-4 mb-3 text-sm">
          <summary className="cursor-pointer font-medium">
            Peut-on connecter nos outils ?
          </summary>

          <p className="mt-2 text-xs text-slate-400">
            Oui : API, fichiers plats, intégrations progressives (Jira, GitHub,
            ERP, CRM…).
          </p>
        </details>
      </div>
    </section>
  );
}

/* -------------------------------------------------------
   FOOTER
------------------------------------------------------- */

function Footer() {
  return (
    <footer className="px-[7vw] py-16 bg-black border-t border-slate-900">
      <h2 className="text-center text-2xl font-semibold mb-6">
        Planifiez le présent. Construisez le futur.
      </h2>

      <div className="flex justify-center gap-4 mb-12">
        <a
          href="/contact"
          className="px-5 py-2.5 rounded-full border border-slate-600 text-sm"
        >
          Contacter l'équipe
        </a>

        <a
          href="/cockpit"
          className="px-5 py-2.5 rounded-full bg-slate-50 text-slate-900 text-sm font-semibold"
        >
          Commencer
        </a>
      </div>

      <p className="text-center text-xs text-slate-500">
        Powalyze © Tous droits réservés
      </p>
    </footer>
  );
}
