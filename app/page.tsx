"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle, Zap, Shield, Sparkles, Users, TrendingUp, Brain, Settings, Globe, BarChart3, FileText, GitBranch, MessageSquare } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <main>
        <Hero />
        <ValueProposition />
        <AutomationFeatures />
        <FourPillars />
        <Methodologies />
        <CockpitModules />
        <Expertise />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
    </div>
  );
}

/* ========================================
   SECTION 1 - HERO
   ======================================== */

function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center">
      {/* Premium Background Image - Bureau / PMO / Power BI - Plus visible */}
      <div className="absolute inset-0 h-full w-full">
        <img
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=2072&q=80"
          alt="Equipe en réunion analysant des données"
          className="h-full w-full object-cover opacity-60 grayscale"
        />
      </div>
      
      {/* Video Background (fallback/overlay) */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover opacity-5"
        src="/videos/powalyze-manifeste.mp4"
      />
      
      {/* Gradient Overlay - Réduit pour plus de visibilité */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-900/60 to-slate-950/80" />
      
      {/* Ambient effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl animate-pulse" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-32 text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-amber-100 to-white">
          Le cockpit exécutif hybride,<br />intelligent et méthodologique.
        </h1>
        <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed">
          Un SaaS premium qui s'adapte à votre manière de travailler,<br className="hidden md:block" />
          amplifié par l'IA et accompagné par un expert PMO & Data.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/contact"
            className="group px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-semibold text-lg shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all flex items-center gap-2"
          >
            Découvrir le cockpit
            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
          </Link>
          <Link
            href="/contact"
            className="px-8 py-4 rounded-xl border-2 border-amber-400/50 hover:border-amber-400 text-white font-semibold text-lg transition-all"
          >
            Demander une démonstration
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ========================================
   SECTION 2 - PROPOSITION DE VALEUR
   ======================================== */

function ValueProposition() {
  return (
    <section className="py-32 px-6 border-t border-slate-800/50">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-8">
          Le premier cockpit qui s'adapte<br />à votre méthode de travail.
        </h2>
        <div className="max-w-4xl mx-auto space-y-6 text-lg text-slate-300">
          <p className="leading-relaxed">
            Powalyze combine :
          </p>
          <div className="grid md:grid-cols-2 gap-6 text-left mt-8">
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <CheckCircle className="text-amber-400 mb-3" size={32} />
              <h3 className="text-xl font-semibold mb-2">Un SaaS modulaire</h3>
              <p className="text-slate-400">Activez uniquement les fonctionnalités dont vous avez besoin. Construisez votre cockpit sur mesure.</p>
            </div>
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <Brain className="text-amber-400 mb-3" size={32} />
              <h3 className="text-xl font-semibold mb-2">Une IA narrative et méthodologique</h3>
              <p className="text-slate-400">L'IA comprend votre contexte et adapte ses recommandations à votre méthode de travail.</p>
            </div>
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <GitBranch className="text-amber-400 mb-3" size={32} />
              <h3 className="text-xl font-semibold mb-2">Votre méthode intégrée</h3>
              <p className="text-slate-400">Agile, Hermès, Cycle en V, Hybride... Le cockpit s'adapte automatiquement.</p>
            </div>
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <Users className="text-amber-400 mb-3" size={32} />
              <h3 className="text-xl font-semibold mb-2">Un expert à vos côtés</h3>
              <p className="text-slate-400">PMO senior, Data Analyst, Power BI Expert. Accompagnement sur site ou à distance.</p>
            </div>
          </div>
          <p className="text-xl font-semibold mt-12 text-white">
            Un pilotage complet, cohérent, intelligent.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ========================================
   NOUVELLE SECTION - AUTOMATISATION COMPLÈTE
   ======================================== */

function AutomationFeatures() {
  return (
    <section className="relative py-32 px-6 border-t border-slate-800/50 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
          alt="Data automation"
          className="h-full w-full object-cover opacity-5"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/95 via-slate-900/90 to-slate-950/95" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-amber-100 to-white">
            Passez d'Excel à un reporting structuré,<br />fiable et automatisé.
          </h2>
          <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
            Connectez vos outils (CRM, ERP, projets, fichiers), unifiez vos données et laissez Powalyze générer pour vous un reporting clair, cohérent et toujours à jour.
          </p>
          <p className="text-lg text-amber-400 mt-4 font-semibold">
            Les chiffres se transforment automatiquement en résumés exécutifs : résultats, risques, décisions, priorités.
          </p>
          <p className="text-xl text-white mt-6 font-bold">
            Vous ne consolidez plus des fichiers — vous pilotez enfin.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="space-y-12">
          {/* 1. Connexion des canaux */}
          <AutomationCard
            number="1"
            title="Connexion des canaux et connecteurs"
            subtitle="Vos données, toutes au même endroit."
            features={[
              "Connexion CRM, ERP, outils projets, RH, finances",
              "Connexion fichiers plats, Excel, CSV, SharePoint, Google Drive",
              "Connexion API natives ou personnalisées",
              "Rafraîchissement automatique (horaire, quotidien, hebdo, mensuel)"
            ]}
            message="Connectez vos outils existants en quelques clics. Powalyze s'adapte à votre organisation, pas l'inverse."
            icon="🔌"
          />

          {/* 2. Reporting structuré */}
          <AutomationCard
            number="2"
            title="Reporting structuré & modèle de données unifié"
            subtitle="Fini les fichiers éclatés. Fini les versions contradictoires."
            features={[
              "Modèle de données unique",
              "Indicateurs définis une fois pour toutes",
              "Rapports standardisés : Comité de direction, Pilotage projets, Risques, Finances, RH / Capacité / Charge",
              "Cockpit 360° avec filtres, drill-down, scénarios"
            ]}
            message="Un reporting cohérent, reproductible et fiable — chaque mois, sans effort."
            icon="📊"
          />

          {/* 3. Résumés automatiques */}
          <AutomationCard
            number="3"
            title="Résumés automatiques (narratifs exécutifs)"
            subtitle="Les chiffres deviennent des phrases prêtes pour vos comités."
            features={[
              'Synthèse mensuelle : "Le portefeuille affiche un avancement moyen de 78 %, avec 3 projets critiques concentrés sur la BU Europe. Les risques majeurs concernent les délais fournisseurs."',
              'Synthèse risques : "Deux programmes stratégiques présentent un risque de dépassement budgétaire lié à la hausse des coûts externes."',
              'Synthèse décisions : "Quatre décisions sont en attente depuis plus de 30 jours, dont deux impactent directement le lancement Q3."'
            ]}
            message="Vos rapports s'écrivent tout seuls. Vous n'avez plus qu'à décider."
            icon="🧠"
          />

          {/* 4. Automatisation complète */}
          <AutomationCard
            number="4"
            title="Automatisation complète du cycle de reporting"
            subtitle="Le reporting ne dépend plus de personne."
            features={[
              "Rafraîchissement automatique des données",
              "Génération automatique des résumés",
              "Génération automatique des rapports (PDF, cockpit, email)",
              "Envoi automatique aux parties prenantes",
              "Historisation et traçabilité"
            ]}
            message="Votre comité reçoit chaque mois un reporting prêt à l'emploi : chiffres + synthèse narrative + décisions à prendre."
            icon="🔁"
          />
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="inline-block p-8 rounded-2xl bg-gradient-to-r from-amber-500/20 to-sky-500/20 border-2 border-amber-500/50">
            <h3 className="text-2xl font-bold mb-4">Prêt à automatiser votre reporting ?</h3>
            <p className="text-slate-300 mb-6 max-w-2xl">
              Découvrez comment Powalyze transforme votre pilotage en quelques minutes.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-semibold text-lg shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all"
            >
              Demander une démonstration
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function AutomationCard({ 
  number, 
  title, 
  subtitle, 
  features, 
  message, 
  icon 
}: { 
  number: string; 
  title: string; 
  subtitle: string; 
  features: string[]; 
  message: string; 
  icon: string;
}) {
  return (
    <div className="p-8 md:p-10 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/50 transition-all group">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Icon & Number */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/20 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
            {icon}
          </div>
          <div className="text-6xl font-bold text-slate-800 mt-4">{number}</div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-2xl md:text-3xl font-bold mb-2">{title}</h3>
          <p className="text-lg text-amber-400 mb-6">{subtitle}</p>
          
          {/* Features List */}
          <ul className="space-y-3 mb-6">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3 text-slate-300">
                <CheckCircle className="text-amber-400 flex-shrink-0 mt-1" size={20} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          {/* Client Message */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-sky-500/10 border border-amber-500/30">
            <p className="text-slate-200 italic">
              <strong className="text-white not-italic">Message client : </strong>
              « {message} »
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========================================
   SECTION 3 - LES 4 PILIERS
   ======================================== */

function FourPillars() {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Premium Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop"
          alt="Team collaboration"
          className="h-full w-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-900/95" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Les 4 piliers de Powalyze</h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Une approche complète pour un pilotage stratégique optimal
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <PillarCard
            number="1"
            title="Un cockpit exécutif premium"
            description="Décisions, risques, projets, rapports, IA, multilingue. Tout ce dont vous avez besoin pour piloter vos portefeuilles complexes."
            icon={<BarChart3 size={40} />}
          />
          <PillarCard
            number="2"
            title="Une IA qui comprend votre méthode"
            description="L'IA adapte les workflows, les rituels, les recommandations et les rapports selon votre choix méthodologique."
            icon={<Brain size={40} />}
          />
          <PillarCard
            number="3"
            title="Un SaaS totalement modulable"
            description="Activez uniquement ce dont vous avez besoin. Construisez votre cockpit sur mesure, module par module."
            icon={<Settings size={40} />}
          />
          <PillarCard
            number="4"
            title="Un expert à vos côtés"
            description="PMO, Data Analyst, Power BI Expert. Accompagnement sur site ou à distance pour maximiser votre impact."
            icon={<Users size={40} />}
          />
        </div>
      </div>
    </section>
  );
}

function PillarCard({ number, title, description, icon }: { number: string; title: string; description: string; icon: React.ReactNode }) {
  return (
    <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/50 transition-all group">
      <div className="flex items-start gap-6">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
            {icon}
          </div>
        </div>
        <div>
          <div className="text-5xl font-bold text-slate-800 mb-3">{number}</div>
          <h3 className="text-2xl font-bold mb-3">{title}</h3>
          <p className="text-slate-400 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}

/* ========================================
   SECTION 4 - MÉTHODOLOGIES INTÉGRÉES
   ======================================== */

function Methodologies() {
  return (
    <section className="relative py-32 px-6 border-t border-slate-800/50 overflow-hidden">
      {/* Premium Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop"
          alt="Business analytics dashboard"
          className="h-full w-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/95 via-slate-950/90 to-slate-950/95" />
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Votre méthode. Votre rythme.<br />Votre gouvernance.
          </h2>
          <p className="text-xl text-slate-300">
            Powalyze s'adapte automatiquement à votre méthode de travail
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <MethodologyCard
            name="Agile"
            description="Sprints, backlogs, vélocité, rituels Scrum/Kanban intégrés"
          />
          <MethodologyCard
            name="Hermès"
            description="Phases, jalons, livrables selon la méthode suisse de référence"
          />
          <MethodologyCard
            name="Cycle en V"
            description="Séquencement classique, validations étapes, traçabilité complète"
          />
          <MethodologyCard
            name="Hybride"
            description="Combinaison intelligente de plusieurs approches méthodologiques"
          />
          <MethodologyCard
            name="Méthodes internes"
            description="Configuration personnalisée selon vos processus spécifiques"
          />
          <MethodologyCard
            name="Multi-projets"
            description="Gestion de portefeuilles avec méthodes différentes par projet"
          />
        </div>

        <div className="text-center p-8 rounded-xl bg-gradient-to-r from-amber-500/10 to-sky-500/10 border border-amber-500/30">
          <p className="text-lg text-slate-300">
            <strong className="text-white">L'IA ajuste automatiquement</strong> les rituels, les rapports, les risques et les décisions selon la méthode choisie.
          </p>
        </div>
      </div>
    </section>
  );
}

function MethodologyCard({ name, description }: { name: string; description: string }) {
  return (
    <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/50 transition-all">
      <h3 className="text-xl font-bold mb-2 text-amber-400">{name}</h3>
      <p className="text-slate-400 text-sm">{description}</p>
    </div>
  );
}

/* ========================================
   SECTION 5 - MODULES DU COCKPIT
   ======================================== */

function CockpitModules() {
  return (
    <section className="py-32 px-6 bg-slate-900/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Modules du cockpit</h2>
          <p className="text-xl text-slate-300">
            Un écosystème complet pour votre gouvernance exécutive
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <ModuleCard
            title="Décisions"
            description="Traçabilité complète, impacts quantifiés, suivi des engagements"
            icon={<CheckCircle size={24} />}
          />
          <ModuleCard
            title="Risques"
            description="Cartographie dynamique, mitigation, scénarios, alertes automatiques"
            icon={<Shield size={24} />}
          />
          <ModuleCard
            title="Projets"
            description="Portefeuilles, budgets, jalons, dépendances, vélocité prédictive"
            icon={<TrendingUp size={24} />}
          />
          <ModuleCard
            title="Rapports narratifs"
            description="Génération automatique de synthèses exécutives par l'IA"
            icon={<FileText size={24} />}
          />
          <ModuleCard
            title="IA stratégique"
            description="Chief of Staff virtuel, recommandations contextuelles, prédictions"
            icon={<Brain size={24} />}
          />
          <ModuleCard
            title="Multilingue"
            description="Français, anglais, allemand, italien - traduction instantanée"
            icon={<Globe size={24} />}
          />
          <ModuleCard
            title="Intégrations Power BI"
            description="Connecteurs natifs, dashboards embarqués, data pipelines"
            icon={<BarChart3 size={24} />}
          />
          <ModuleCard
            title="Personnalisation avancée"
            description="Workflows sur mesure, champs personnalisés, automatisations"
            icon={<Settings size={24} />}
          />
          <ModuleCard
            title="Collaboration"
            description="Commentaires, mentions, notifications, historique complet"
            icon={<MessageSquare size={24} />}
          />
        </div>
      </div>
    </section>
  );
}

function ModuleCard({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) {
  return (
    <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/50 transition-all group">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-400/20 to-amber-600/20 flex items-center justify-center text-amber-400 flex-shrink-0 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-bold mb-2">{title}</h3>
          <p className="text-sm text-slate-400">{description}</p>
        </div>
      </div>
    </div>
  );
}

/* ========================================
   SECTION 6 - EXPERTISE & ACCOMPAGNEMENT
   ======================================== */

function Expertise() {
  return (
    <section className="py-32 px-6 border-t border-slate-800/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Un outil puissant.<br />Un expert pour le déployer.
          </h2>
          <p className="text-xl text-slate-300">
            Ne restez pas seul face à la transformation
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <ExpertiseCard
            title="PMO senior"
            items={[
              "Cadrage et pilotage de programmes complexes",
              "Mise en place de la gouvernance",
              "Animation des comités de direction",
              "Escalade et arbitrage des décisions"
            ]}
          />
          <ExpertiseCard
            title="Data & Power BI"
            items={[
              "Architecture des flux de données",
              "Dashboards exécutifs sur mesure",
              "Connecteurs et intégrations",
              "Formation et transfert de compétences"
            ]}
          />
          <ExpertiseCard
            title="Gouvernance & Transformation"
            items={[
              "Audit des processus existants",
              "Design de la gouvernance cible",
              "Conduite du changement",
              "Alignement stratégique"
            ]}
          />
          <ExpertiseCard
            title="Coaching & Copilotage"
            items={[
              "Accompagnement des équipes sur site",
              "Mentorat des PMO internes",
              "Revue mensuelle des performances",
              "Optimisation continue des processus"
            ]}
          />
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/expertise"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-white font-semibold transition-all"
          >
            Découvrir nos expertises
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ExpertiseCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="p-8 rounded-xl bg-slate-900/50 border border-slate-800">
      <h3 className="text-2xl font-bold mb-6 text-amber-400">{title}</h3>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-slate-300">
            <CheckCircle className="text-amber-400 flex-shrink-0 mt-1" size={20} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ========================================
   SECTION 7 - TÉMOIGNAGES
   ======================================== */

function Testimonials() {
  return (
    <section className="py-32 px-6 border-t border-slate-800/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ce que disent nos clients</h2>
          <p className="text-xl text-slate-300">
            Des résultats concrets pour des organisations exigeantes
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <TestimonialCard
            quote="Powalyze nous a permis de réduire de 40% le temps passé en comités tout en améliorant drastiquement la qualité de nos décisions."
            author="Directeur PMO"
            company="Groupe bancaire suisse"
          />
          <TestimonialCard
            quote="L'IA narrative génère des synthèses exécutives que je n'aurais jamais eu le temps de produire manuellement. Un gain de temps considérable."
            author="Chief Data Officer"
            company="Assurance internationale"
          />
          <TestimonialCard
            quote="La modularité du cockpit nous permet d'adapter l'outil à chaque direction métier. Chacun a exactement ce dont il a besoin."
            author="CTO"
            company="Entreprise industrielle"
          />
          <TestimonialCard
            quote="L'accompagnement PMO senior a été déterminant pour structurer notre gouvernance et former nos équipes internes."
            author="VP Transformation"
            company="Administration publique"
          />
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ quote, author, company }: { quote: string; author: string; company: string }) {
  return (
    <div className="p-8 rounded-xl bg-slate-900/50 border border-slate-800">
      <p className="text-lg text-slate-300 mb-6 italic leading-relaxed">"{quote}"</p>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600" />
        <div>
          <div className="font-semibold">{author}</div>
          <div className="text-sm text-slate-400">{company}</div>
        </div>
      </div>
    </div>
  );
}

/* ========================================
   SECTION 9 - FAQ
   ======================================== */

function FAQ() {
  return (
    <section className="py-32 px-6 bg-slate-900/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Questions fréquentes</h2>
        </div>

        <div className="space-y-6">
          <FAQItem
            question="Comment l'IA s'adapte-t-elle à ma méthode de travail ?"
            answer="L'IA analyse votre configuration méthodologique (Agile, Hermès, Cycle en V, etc.) et adapte automatiquement les workflows, les rituels, les recommandations et les rapports. Elle comprend le contexte de chaque projet et ajuste ses suggestions en conséquence."
          />
          <FAQItem
            question="Puis-je utiliser Powalyze avec mes outils existants ?"
            answer="Oui, Powalyze propose des connecteurs natifs pour Power BI, des APIs REST complètes et des webhooks pour s'intégrer à votre écosystème existant. Nous accompagnons également la mise en place de ces intégrations."
          />
          <FAQItem
            question="Quelle est la différence entre le SaaS seul et l'offre hybride ?"
            answer="Le SaaS seul vous donne accès au cockpit complet avec support standard. L'offre hybride combine le SaaS avec l'expertise d'un PMO senior, Data Analyst ou Power BI Expert pour vous accompagner dans le déploiement, la configuration et l'optimisation continue."
          />
          <FAQItem
            question="Où sont hébergées mes données ?"
            answer="Vos données sont hébergées en Suisse, sur des infrastructures conformes aux normes les plus strictes (ISO 27001, GDPR). Nous proposons également des options d'hébergement dédié pour les organisations avec des exigences de sécurité élevées."
          />
          <FAQItem
            question="Comment se passe le déploiement ?"
            answer="Le déploiement se fait en 3 phases : (1) Cadrage de vos besoins et configuration initiale (2-3 jours), (2) Formation de vos équipes et paramétrage avancé (1 semaine), (3) Accompagnement continu et optimisation (3 mois). Nous adaptons le rythme selon vos contraintes."
          />
        </div>
      </div>
    </section>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/50 transition-all">
      <h3 className="text-xl font-bold mb-3">{question}</h3>
      <p className="text-slate-400 leading-relaxed">{answer}</p>
    </div>
  );
}

/* ========================================
   SECTION 10 - CTA FINAL
   ======================================== */

function FinalCTA() {
  return (
    <section className="py-32 px-6 border-t border-slate-800/50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-8">
          Construisons votre<br />cockpit exécutif.
        </h2>
        <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
          Que vous cherchiez un SaaS premium, un accompagnement expert ou les deux, nous créons la solution qui correspond à vos enjeux.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/contact"
            className="group px-10 py-5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-lg shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all flex items-center gap-2"
          >
            Demander une démonstration
            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={22} />
          </Link>
          <Link
            href="/contact"
            className="px-10 py-5 rounded-xl border-2 border-amber-400/50 hover:border-amber-400 text-white font-bold text-lg transition-all"
          >
            Parler à un expert
          </Link>
        </div>
        
        <div className="mt-16 pt-16 border-t border-slate-800/50 text-sm text-slate-500">
          <p>🇨🇭 Conçu et hébergé en Suisse • Conformité GDPR • Support multilingue</p>
        </div>
      </div>
    </section>
  );
}
