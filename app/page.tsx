"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#050509] text-white">
      <Navbar />
      <main className="pt-24">
        <Hero />
        <Logos />
        <Pillars />
        <SectionIA />
        <SectionOps />
        <SectionDirection />
        <SectionProjects />
        <SectionDocs />
        <SectionIssues />
        <SectionCycles />
        <SectionInsights />
        <SectionWorkflows />
        <SectionExtras />
        <Footer />
      </main>
    </div>
  );
}

/* NAVBAR */

function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-40 border-b border-white/5 bg-black/40 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm font-semibold tracking-tight">
            Powalyze
          </Link>
          <nav className="hidden md:flex items-center gap-5 text-xs text-white/70">
            <Link href="#product">Produit</Link>
            <Link href="#governance">Gouvernance IA</Link>
            <Link href="#insights">Insights</Link>
            <Link href="#workflows">Workflows</Link>
            <Link href="#customers">Clients</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <Link href="/login" className="hidden md:inline">
            Connexion
          </Link>
          <Link
            href="/cockpit"
            className="px-3 py-1.5 rounded-full bg-white text-black font-medium"
          >
            Démarrer
          </Link>
        </div>
      </div>
    </header>
  );
}

/* HERO */

function Hero() {
  return (
    <section
      id="product"
      className="mx-auto max-w-6xl px-4 py-24 md:py-32 grid md:grid-cols-[1.1fr,1fr] gap-12 items-center"
    >
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-4">
          Cockpit exécutif • Gouvernance IA • Portefeuilles complexes
        </p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-5">
          Powalyze est un cockpit conçu pour piloter les portefeuilles les plus
          sensibles.
        </h1>
        <p className="text-sm md:text-base text-white/70 mb-4 max-w-xl">
          Un système moderne pour la gouvernance : risques, budgets, décisions,
          comités. Une seule source de vérité pour les équipes dirigeantes.
        </p>
        <p className="text-xs md:text-sm text-white/50 mb-6 max-w-xl">
          Remplace les Excel, les slides et les mails dispersés par un cockpit
          temps réel assisté par IA, inspiré des meilleurs outils produits.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/cockpit"
            className="px-4 py-2 rounded-full bg-white text-black text-xs font-semibold"
          >
            Démarrer avec Powalyze
          </Link>
          <Link
            href="/contact"
            className="px-4 py-2 rounded-full border border-white/15 text-xs text-white/80"
          >
            Parler à un humain
          </Link>
        </div>
      </div>
      <div className="relative">
        <div className="absolute -inset-10 bg-[radial-gradient(circle_at_top,_rgba(96,165,250,0.3),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(244,114,182,0.25),_transparent_60%)] opacity-70" />
        <div className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/0 p-4">
          <div className="flex items-center justify-between text-[10px] text-white/60 mb-3">
            <span>Vue d'ensemble portefeuille</span>
            <span>Analyse IA active</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-[11px]">
            <div className="space-y-2">
              <Kpi label="Projets actifs" value="42" detail="4 à risque" />
              <Kpi label="Budget total" value="7.8M€" detail="98% consommé" />
              <Kpi label="Taux de succès" value="94%" detail="+4 pts vs objectif" />
            </div>
            <div className="space-y-2">
              <div className="rounded-xl border border-white/10 p-2">
                <div className="text-[10px] text-white/60 mb-1">
                  Chief of Staff IA
                </div>
                <ul className="space-y-1 text-[11px] text-white/80">
                  <li>• Optimiser portefeuille Q2 (+12% vélocité)</li>
                  <li>• Identifier 3 projets à risque (-450K€)</li>
                  <li>• Fast‑track Cloud (+3 semaines)</li>
                </ul>
              </div>
              <div className="rounded-xl border border-white/10 p-2 text-[10px] text-white/60">
                Portfolio sain • Aucun blocage critique détecté.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Kpi({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-xl border border-white/10 p-2">
      <div className="text-[10px] text-white/50">{label}</div>
      <div className="text-sm font-semibold">{value}</div>
      <div className="text-[10px] text-white/50">{detail}</div>
    </div>
  );
}

/* LOGOS */

function Logos() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-center text-xs text-white/50 mb-6">
        Adopté par les meilleures équipes produit
      </p>
      <div className="flex flex-wrap justify-center gap-8 text-xs text-white/60">
        <span>OpenAI</span>
        <span>Vercel</span>
        <span>Coinbase</span>
        <span>Ramp</span>
        <span>Scale</span>
        <span>Cursor</span>
      </div>
    </section>
  );
}

/* 3 PILLIERS */

function Pillars() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <div className="grid md:grid-cols-3 gap-8">
        <Pillar
          title="Conçu pour la gouvernance"
          text="Un cockpit pensé pour les organisations complexes : portefeuilles, risques, arbitrages, décisions."
        />
        <Pillar
          title="Optimisé pour la vitesse"
          text="IA proactive, actions recommandées, scénarios instantanés. Décidez plus vite, avec plus de certitude."
        />
        <Pillar
          title="Finition chirurgicale"
          text="Interface premium, lisibilité parfaite, expérience moderne inspirée des meilleurs outils produits."
        />
      </div>
    </section>
  );
}

function Pillar({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <p className="text-sm text-white/70">{text}</p>
    </div>
  );
}

/* SECTION IA */

function SectionIA() {
  return (
    <section
      id="governance"
      className="mx-auto max-w-6xl px-4 py-24 grid md:grid-cols-[1.1fr,1fr] gap-12 items-center"
    >
      <div>
        <h2 className="text-2xl md:text-3xl font-semibold mb-3">
          Gouvernance assistée par IA
        </h2>
        <p className="text-sm text-white/70 mb-4 max-w-lg">
          Powalyze analyse en continu vos projets, budgets et charges pour
          détecter les dérives, recommander des actions et simuler des scénarios
          d'arbitrage.
        </p>
        <p className="text-xs text-white/50 mb-6 max-w-lg">
          L'IA ne remplace pas vos comités, elle les prépare : synthèses,
          risques, décisions, impacts chiffrés.
        </p>
        <Link
          href="/cockpit"
          className="inline-flex items-center gap-2 text-xs font-semibold"
        >
          Découvrir le cockpit IA
          <span>→</span>
        </Link>
      </div>
      <div className="relative">
        <div className="absolute -inset-10 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.35),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(56,189,248,0.25),_transparent_60%)] opacity-80" />
        <div className="relative rounded-2xl border border-white/10 bg-black/60 p-4 text-[11px] space-y-3">
          <div className="flex items-center justify-between text-white/60">
            <span>Chief of Staff IA</span>
            <span>Analyse continue</span>
          </div>
          <div className="space-y-2">
            <InsightLine
              title="Réduction de coûts ciblée"
              detail="-10% à -20% sans impact critique"
            />
            <InsightLine
              title="Fast‑track ERP / Cloud"
              detail="+2 FTE, +3 semaines de marge"
            />
            <InsightLine
              title="Portefeuille Q2"
              detail="+12% vélocité, -450K€ de risque"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function InsightLine({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/80">{title}</span>
      <span className="text-white/60">{detail}</span>
    </div>
  );
}

/* SELF-DRIVING OPS */

function SectionOps() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 grid md:grid-cols-2 gap-10">
      <div>
        <h3 className="text-lg font-semibold mb-2">Opérations auto‑pilotées</h3>
        <p className="text-sm text-white/70 mb-3">
          Automatisez le tri, la priorisation et la préparation des comités.
          Powalyze propose des plans d'actions prêts à être validés.
        </p>
        <p className="text-xs text-white/50">
          Moins de temps à consolider, plus de temps à décider.
        </p>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Connecteurs Powalyze</h3>
        <p className="text-sm text-white/70 mb-3">
          Connectez vos outils : Jira, GitHub, Slack, ERP, CRM, fichiers plats.
          Powalyze devient la couche de gouvernance au‑dessus de votre stack.
        </p>
        <p className="text-xs text-white/50">
          Les données restent là où elles sont, la décision se prend dans le
          cockpit.
        </p>
      </div>
    </section>
  );
}

/* DIRECTION / TIMELINE */

function SectionDirection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24">
      <h2 className="text-2xl md:text-3xl font-semibold mb-3">
        Définissez la direction
      </h2>
      <p className="text-sm text-white/70 mb-6 max-w-xl">
        Alignez votre organisation autour d'une feuille de route unifiée :
        initiatives, jalons, capacités, risques et décisions.
      </p>
      <div className="rounded-2xl border border-white/10 bg-black/60 p-4 h-40 flex items-center justify-center text-xs text-white/50">
        Timeline stratégique (initiatives, jalons, capacités) — placeholder
      </div>
    </section>
  );
}

/* PROJECTS */

function SectionProjects() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 grid md:grid-cols-2 gap-10">
      <div>
        <h3 className="text-lg font-semibold mb-2">Vue projet complète</h3>
        <p className="text-sm text-white/70 mb-3">
          Spécifications, jalons, tâches, risques, décisions, documents. Chaque
          projet devient une unité de pilotage claire.
        </p>
        <p className="text-xs text-white/50">
          Une vue unique pour les sponsors, les équipes et les PMO.
        </p>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Mises à jour projet</h3>
        <p className="text-sm text-white/70 mb-3">
          Communiquez l'avancement, les alertes et les décisions en un format
          lisible, prêt pour les comités.
        </p>
        <p className="text-xs text-white/50">
          Fini les slides bricolées la veille du comité.
        </p>
      </div>
    </section>
  );
}

/* DOCS / INITIATIVES / MILESTONES / INSIGHTS */

function SectionDocs() {
  const items = [
    {
      title: "Documents collaboratifs",
      text: "Rédigez, commentez et structurez les décisions et analyses.",
    },
    {
      title: "Initiatives",
      text: "Coordonnez les efforts stratégiques à travers les portefeuilles.",
    },
    {
      title: "Jalons",
      text: "Découpez vos projets en phases concrètes et pilotables.",
    },
    {
      title: "Insights",
      text: "Analysez la vélocité, le scope et les tendances.",
    },
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <div className="grid md:grid-cols-4 gap-6">
        {items.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-white/10 bg-white/5 p-4"
          >
            <h4 className="text-sm font-semibold mb-1">{item.title}</h4>
            <p className="text-xs text-white/70">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ISSUES */

function SectionIssues() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24">
      <h2 className="text-2xl md:text-3xl font-semibold mb-3">
        Gestion des anomalies et actions
      </h2>
      <p className="text-sm text-white/70 mb-6 max-w-xl">
        Créez, suivez et résolvez les problèmes rapidement. Powalyze relie
        anomalies, risques, décisions et impacts budgétaires.
      </p>
      <div className="rounded-2xl border border-white/10 bg-black/60 p-4 h-48 flex items-center justify-center text-xs text-white/50">
        Board des anomalies et actions — placeholder
      </div>
    </section>
  );
}

/* CYCLES + TRIAGE */

function SectionCycles() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 grid md:grid-cols-2 gap-10">
      <div>
        <h3 className="text-lg font-semibold mb-2">Cycles</h3>
        <p className="text-sm text-white/70 mb-3">
          Rythmez votre organisation avec des cycles de pilotage clairs :
          mensuels, trimestriels, annuels.
        </p>
        <p className="text-xs text-white/50">
          Chaque cycle devient une boucle d'apprentissage et d'arbitrage.
        </p>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Triage</h3>
        <p className="text-sm text-white/70 mb-3">
          Gérez les demandes entrantes, les urgences et les signaux faibles
          avant qu'ils ne deviennent des crises.
        </p>
        <p className="text-xs text-white/50">
          Une inbox exécutive pour les sujets qui comptent vraiment.
        </p>
      </div>
    </section>
  );
}

/* INSIGHTS */

function SectionInsights() {
  return (
    <section id="insights" className="mx-auto max-w-6xl px-4 py-24">
      <h2 className="text-2xl md:text-3xl font-semibold mb-3">
        Insights Powalyze
      </h2>
      <p className="text-sm text-white/70 mb-6 max-w-xl">
        Analysez vos données en profondeur : vélocité, capacité, risques,
        dérives, corrélations. Une vue analytique conçue pour les comités.
      </p>
      <div className="rounded-2xl border border-white/10 bg-black/60 p-4 h-56 flex items-center justify-center text-xs text-white/50">
        Scatter chart Insights — placeholder
      </div>
    </section>
  );
}

/* WORKFLOWS & INTEGRATIONS */

function SectionWorkflows() {
  return (
    <section id="workflows" className="mx-auto max-w-6xl px-4 py-20">
      <h2 className="text-2xl md:text-3xl font-semibold mb-3">
        Workflows et intégrations
      </h2>
      <p className="text-sm text-white/70 mb-6 max-w-xl">
        Étendez les capacités de Powalyze avec des workflows personnalisés,
        des vues adaptées à chaque rôle et des intégrations profondes.
      </p>
      <ul className="grid md:grid-cols-2 gap-3 text-sm text-white/70">
        <li>Workflows personnalisés</li>
        <li>Vues exécutives et opérationnelles</li>
        <li>Filtres avancés et segments</li>
        <li>SLAs et alertes intelligentes</li>
      </ul>
    </section>
  );
}

/* EXTRAS (CUSTOMER REQUESTS / GIT / MOBILE / ASKS) */

function SectionExtras() {
  const items = [
    {
      title: "Demandes clients",
      text: "Construisez ce que vos clients veulent vraiment, en reliant feedbacks, roadmap et décisions.",
    },
    {
      title: "Workflows Git",
      text: "Automatisez vos PR, commits et déploiements en lien avec vos décisions de portefeuille.",
    },
    {
      title: "Powalyze Mobile",
      text: "Pilotez vos projets et portefeuilles depuis n'importe où, en mobilité.",
    },
    {
      title: "Powalyze Asks",
      text: "Transformez les demandes en actions concrètes, reliées à vos projets et décisions.",
    },
  ];
  return (
    <section
      id="customers"
      className="mx-auto max-w-6xl px-4 py-20 grid md:grid-cols-4 gap-6"
    >
      {items.map((item) => (
        <div
          key={item.title}
          className="rounded-2xl border border-white/10 bg-white/5 p-4"
        >
          <h3 className="text-sm font-semibold mb-1">{item.title}</h3>
          <p className="text-xs text-white/70">{item.text}</p>
        </div>
      ))}
    </section>
  );
}

/* FOOTER */

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/80">
      <div className="mx-auto max-w-6xl px-4 py-16 space-y-10">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-3">
            Planifiez le présent. Construisez le futur.
          </h2>
          <div className="flex justify-center gap-3">
            <Link
              href="/contact"
              className="px-4 py-2 rounded-full border border-white/15 text-xs text-white/80"
            >
              Contacter l'équipe
            </Link>
            <Link
              href="/cockpit"
              className="px-4 py-2 rounded-full bg-white text-black text-xs font-semibold"
            >
              Commencer
            </Link>
          </div>
        </div>
        <div className="grid md:grid-cols-5 gap-8 text-xs text-white/60">
          <FooterColumn
            title="Fonctionnalités"
            items={["Pilotage", "IA", "Insights", "Demandes clients", "Mobile"]}
          />
          <FooterColumn
            title="Produit"
            items={["Tarifs", "Méthode", "Intégrations", "Documentation"]}
          />
          <FooterColumn
            title="Entreprise"
            items={["À propos", "Clients", "Carrières"]}
          />
          <FooterColumn
            title="Ressources"
            items={["Développeurs", "Status", "Startups"]}
          />
          <FooterColumn
            title="Contact"
            items={["Nous contacter", "Communauté"]}
          />
        </div>
        <p className="text-[11px] text-white/40">
          Powalyze © Tous droits réservés
        </p>
      </div>
    </footer>
  );
}

function FooterColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="text-xs font-semibold mb-2 text-white/80">{title}</h4>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
