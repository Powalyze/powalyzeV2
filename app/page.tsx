"use client";

import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black">
      <Hero />
      <UseCases />
      <TrustedBy />
      <FeaturePillars />
      <Testimonials />
      <FAQ />
      <Footer />
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

function UseCaseCard({ title, meta, cta }: { title: string; meta: string; cta: string }) {
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

function TrustedBy() {
  return (
    <section className="px-[7vw] py-20 bg-slate-950 border-t border-slate-800">
      <p className="text-center text-slate-400 text-sm mb-6">
        Adopté par les meilleures équipes produit
      </p>

      <div className="flex flex-wrap justify-center gap-10 opacity-70">
        <span className="text-lg font-semibold">OpenAI</span>
        <span className="text-lg font-semibold">Vercel</span>
        <span className="text-lg font-semibold">Coinbase</span>
        <span className="text-lg font-semibold">Ramp</span>
        <span className="text-lg font-semibold">Scale</span>
        <span className="text-lg font-semibold">Cursor</span>
      </div>
    </section>
  );
}

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

function Pillar({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-panel border border-white/5 rounded-2xl p-8 shadow-soft hover:bg-panel-hover transition">
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-slate-400 text-sm">{desc}</p>
    </div>
  );
}

function Testimonials() {
  return (
    <section className="px-[7vw] py-24 bg-slate-950 text-center">
      <div className="text-lg md:text-xl max-w-3xl mx-auto mb-3">
        "Powalyze nous a fait gagner 3 semaines sur le Cloud et éviter 450K€ de dépassement."
      </div>
      <div className="text-xs md:text-sm text-slate-400">
        Directeur de programme — Transformation Cloud & ERP
      </div>
    </section>
  );
}

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
            Elle analyse en continu vos projets, budgets et charges pour détecter
            les dérives et recommander des actions.
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
