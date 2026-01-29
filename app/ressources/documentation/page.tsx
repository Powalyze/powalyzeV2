import Link from "next/link";
import { BookOpen, Code, Zap, Settings, Database, Shield, ArrowRight } from "lucide-react";

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white pt-24">
      {/* Hero */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Documentation
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Guides utilisateurs, références API, intégrations et bonnes pratiques pour tirer le meilleur de Powalyze
          </p>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="p-12 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/30">
            <div className="flex items-center gap-4 mb-6">
              <Zap className="text-emerald-400" size={40} />
              <h2 className="text-4xl font-bold">Quick Start</h2>
            </div>
            <p className="text-xl text-slate-300 mb-8">
              Démarrez avec Powalyze en 15 minutes : configuration initiale, création de votre premier projet, configuration de votre méthodologie.
            </p>
            <Link
              href="/ressources/documentation/quick-start"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 font-semibold transition-all"
            >
              Commencer maintenant
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Documentation Sections */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Sections de documentation</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <DocSection
              icon={<BookOpen className="text-blue-400" size={32} />}
              title="Guides utilisateurs"
              description="Apprenez à utiliser chaque module du cockpit : projets, risques, décisions, rapports, IA, Power BI."
              links={[
                { title: "Guide complet du cockpit", href: "/ressources/documentation/guides/cockpit" },
                { title: "Gestion des projets", href: "/ressources/documentation/guides/projets" },
                { title: "Cartographie des risques", href: "/ressources/documentation/guides/risques" },
                { title: "Registre des décisions", href: "/ressources/documentation/guides/decisions" },
                { title: "Génération de rapports IA", href: "/ressources/documentation/guides/rapports" },
                { title: "Configuration des méthodologies", href: "/ressources/documentation/guides/methodologies" }
              ]}
            />

            <DocSection
              icon={<Code className="text-purple-400" size={32} />}
              title="API Reference"
              description="Intégrez Powalyze avec vos systèmes via notre API REST complète. Authentification OAuth2, webhooks, SDKs."
              links={[
                { title: "API Overview & Authentication", href: "/ressources/documentation/api/overview" },
                { title: "Projects API", href: "/ressources/documentation/api/projects" },
                { title: "Risks API", href: "/ressources/documentation/api/risks" },
                { title: "Decisions API", href: "/ressources/documentation/api/decisions" },
                { title: "Reports API", href: "/ressources/documentation/api/reports" },
                { title: "Webhooks & Events", href: "/ressources/documentation/api/webhooks" }
              ]}
            />

            <DocSection
              icon={<Settings className="text-amber-400" size={32} />}
              title="Configuration & Admin"
              description="Administration de la plateforme : gestion des utilisateurs, rôles, permissions, paramètres généraux."
              links={[
                { title: "Configuration initiale", href: "/ressources/documentation/admin/setup" },
                { title: "Gestion des utilisateurs & rôles", href: "/ressources/documentation/admin/users" },
                { title: "Configuration des workflows", href: "/ressources/documentation/admin/workflows" },
                { title: "Templates personnalisés", href: "/ressources/documentation/admin/templates" },
                { title: "Notifications & alertes", href: "/ressources/documentation/admin/notifications" },
                { title: "Paramètres de sécurité", href: "/ressources/documentation/admin/security" }
              ]}
            />

            <DocSection
              icon={<Database className="text-emerald-400" size={32} />}
              title="Intégrations"
              description="Connectez Powalyze à vos outils existants : Jira, Azure DevOps, Power BI, Slack, Teams, ServiceNow."
              links={[
                { title: "Power BI Integration", href: "/ressources/documentation/integrations/powerbi" },
                { title: "Jira Connector", href: "/ressources/documentation/integrations/jira" },
                { title: "Azure DevOps Sync", href: "/ressources/documentation/integrations/azure-devops" },
                { title: "Microsoft Teams", href: "/ressources/documentation/integrations/teams" },
                { title: "Slack Notifications", href: "/ressources/documentation/integrations/slack" },
                { title: "ServiceNow ITSM", href: "/ressources/documentation/integrations/servicenow" }
              ]}
            />

            <DocSection
              icon={<Zap className="text-red-400" size={32} />}
              title="IA & Automatisations"
              description="Configurez et optimisez l'IA narrative, les prédictions et les automatisations pour votre contexte."
              links={[
                { title: "Configurer l'IA narrative", href: "/ressources/documentation/ia/narrative" },
                { title: "Prédictions de vélocité Agile", href: "/ressources/documentation/ia/velocite" },
                { title: "Détection d'anomalies", href: "/ressources/documentation/ia/anomalies" },
                { title: "Recommandations stratégiques", href: "/ressources/documentation/ia/recommandations" },
                { title: "Automatisations avancées", href: "/ressources/documentation/ia/automatisations" },
                { title: "IA personnalisée (training)", href: "/ressources/documentation/ia/custom" }
              ]}
            />

            <DocSection
              icon={<Shield className="text-blue-400" size={32} />}
              title="Sécurité & Conformité"
              description="Sécurité des données, conformité GDPR, certifications, audit logs, backup & recovery."
              links={[
                { title: "Architecture de sécurité", href: "/ressources/documentation/security/architecture" },
                { title: "Conformité GDPR", href: "/ressources/documentation/security/gdpr" },
                { title: "Certifications (ISO 27001)", href: "/ressources/documentation/security/certifications" },
                { title: "Audit logs & traçabilité", href: "/ressources/documentation/security/audit" },
                { title: "Backup & disaster recovery", href: "/ressources/documentation/security/backup" },
                { title: "Hébergement & infrastructure", href: "/ressources/documentation/security/hosting" }
              ]}
            />
          </div>
        </div>
      </section>

      {/* Video Tutorials */}
      <section className="py-20 px-6 bg-slate-900/30 border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Tutoriels vidéo</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <VideoCard
              title="Configuration initiale (10 min)"
              description="Créez votre compte, configurez votre organisation et lancez votre premier projet."
              duration="10:23"
              href="/ressources/documentation/videos/setup"
            />
            <VideoCard
              title="Créer un cockpit Agile (15 min)"
              description="Configuration complète d'un projet Agile avec sprints, backlog et vélocité."
              duration="15:47"
              href="/ressources/documentation/videos/agile"
            />
            <VideoCard
              title="Power BI Integration (12 min)"
              description="Connectez vos dashboards Power BI et visualisez vos données en temps réel."
              duration="12:18"
              href="/ressources/documentation/videos/powerbi"
            />
            <VideoCard
              title="IA narrative et rapports (8 min)"
              description="Générez des synthèses exécutives automatiques avec l'IA narrative."
              duration="08:35"
              href="/ressources/documentation/videos/ia-reports"
            />
            <VideoCard
              title="Gestion multi-projets (18 min)"
              description="Pilotez un portefeuille de projets avec différentes méthodologies."
              duration="18:22"
              href="/ressources/documentation/videos/portfolio"
            />
            <VideoCard
              title="API & Webhooks (20 min)"
              description="Intégrez Powalyze avec vos systèmes via l'API REST et les webhooks."
              duration="20:15"
              href="/ressources/documentation/videos/api"
            />
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="py-20 px-6 border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Bonnes pratiques</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <BestPracticeCard
              title="10 règles d'or pour un cockpit efficace"
              description="Les principes essentiels pour tirer le maximum de valeur de votre cockpit exécutif."
              href="/ressources/documentation/best-practices/cockpit"
            />
            <BestPracticeCard
              title="Comment bien structurer son backlog"
              description="Priorisation, estimation, affinage : les bonnes pratiques pour un backlog performant."
              href="/ressources/documentation/best-practices/backlog"
            />
            <BestPracticeCard
              title="Matrice de risques : guide complet"
              description="Identification, évaluation, mitigation : tout pour une gestion des risques optimale."
              href="/ressources/documentation/best-practices/risques"
            />
            <BestPracticeCard
              title="Rapports exécutifs impactants"
              description="Les éléments clés pour des rapports qui font vraiment prendre des décisions."
              href="/ressources/documentation/best-practices/rapports"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-slate-900/30 border-t border-slate-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Besoin d'aide ?
          </h2>
          <p className="text-xl text-slate-300 mb-12">
            Notre équipe support est disponible pour répondre à toutes vos questions techniques
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-lg shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all"
            >
              Contacter le support
            </Link>
            <Link
              href="/ressources/faq"
              className="px-8 py-4 rounded-xl border-2 border-slate-800 hover:border-amber-500/50 text-white font-semibold text-lg transition-all"
            >
              Voir la FAQ
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function DocSection({ icon, title, description, links }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  links: { title: string; href: string; }[];
}) {
  return (
    <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800">
      <div className="mb-6">{icon}</div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-slate-400 mb-6">{description}</p>
      <ul className="space-y-3">
        {links.map((link, i) => (
          <li key={i}>
            <Link
              href={link.href}
              className="flex items-center gap-2 text-slate-300 hover:text-amber-400 transition-colors"
            >
              <ArrowRight size={16} className="flex-shrink-0" />
              <span className="text-sm">{link.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function VideoCard({ title, description, duration, href }: {
  title: string;
  description: string;
  duration: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/50 transition-all group"
    >
      <div className="aspect-video rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 mb-4 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-purple-500/10" />
        <div className="relative w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
          <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-slate-950 border-b-8 border-b-transparent ml-1" />
        </div>
        <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-slate-950/80 text-xs font-semibold">
          {duration}
        </div>
      </div>
      <h3 className="text-lg font-bold mb-2 group-hover:text-amber-400 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-slate-400">{description}</p>
    </Link>
  );
}

function BestPracticeCard({ title, description, href }: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="p-6 rounded-xl bg-gradient-to-br from-emerald-500/10 to-slate-900/50 border border-emerald-500/30 hover:border-emerald-500/50 transition-all group"
    >
      <h3 className="text-xl font-bold mb-3 group-hover:text-emerald-400 transition-colors">
        {title}
      </h3>
      <p className="text-slate-400 text-sm mb-4">{description}</p>
      <div className="inline-flex items-center gap-2 text-emerald-400 font-semibold text-sm group-hover:gap-3 transition-all">
        Lire le guide
        <ArrowRight size={16} />
      </div>
    </Link>
  );
}
