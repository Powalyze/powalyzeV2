import Link from "next/link";
import { CheckCircle, BarChart3, Shield, FileText, Brain, Globe, Settings, Users } from "lucide-react";

export default function LeCockpitPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white pt-24">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Le Cockpit Powalyze
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-12">
            Un écosystème complet pour piloter vos portefeuilles complexes avec intelligence et méthode.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-semibold text-lg shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all"
          >
            Demander une démonstration
          </Link>
        </div>
      </section>

      {/* Modules Grid */}
      <section className="py-20 px-6 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Modules disponibles
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <ModuleCard
              icon={<CheckCircle size={32} />}
              title="Décisions"
              description="Traçabilité complète des décisions stratégiques, impacts quantifiés, suivi des engagements et historique détaillé."
              features={[
                "Workflow d'approbation",
                "Impacts quantifiés",
                "Liens projets/risques",
                "Historique complet"
              ]}
            />

            <ModuleCard
              icon={<Shield size={32} />}
              title="Risques"
              description="Cartographie dynamique des risques, plans de mitigation, scénarios et alertes automatiques basées sur des seuils."
              features={[
                "Matrice de criticité",
                "Plans de mitigation",
                "Scénarios what-if",
                "Alertes intelligentes"
              ]}
            />

            <ModuleCard
              icon={<BarChart3 size={32} />}
              title="Projets"
              description="Gestion de portefeuilles, budgets consolidés, jalons, dépendances et prédictions de vélocité par l'IA."
              features={[
                "Portefeuilles multi-projets",
                "Budgets & jalons",
                "Dépendances visuelles",
                "Prédictions IA"
              ]}
            />

            <ModuleCard
              icon={<FileText size={32} />}
              title="Rapports"
              description="Génération automatique de synthèses exécutives personnalisées selon le destinataire et le contexte."
              features={[
                "Templates personnalisables",
                "Génération par IA",
                "Export multi-formats",
                "Programmation automatique"
              ]}
            />

            <ModuleCard
              icon={<Brain size={32} />}
              title="IA Stratégique"
              description="Chief of Staff virtuel qui analyse votre portefeuille et génère des recommandations contextuelles."
              features={[
                "Analyse contextuelle",
                "Recommandations actionnables",
                "Détection d'anomalies",
                "Prédictions avancées"
              ]}
            />

            <ModuleCard
              icon={<Globe size={32} />}
              title="Multilingue"
              description="Interface et contenus disponibles en français, anglais, allemand et italien avec traduction instantanée."
              features={[
                "4 langues disponibles",
                "Traduction automatique",
                "Adaptation culturelle",
                "Support local"
              ]}
            />

            <ModuleCard
              icon={<BarChart3 size={32} />}
              title="Power BI"
              description="Connecteurs natifs pour Power BI, dashboards embarqués et pipelines de données automatisés."
              features={[
                "Connecteurs natifs",
                "Dashboards intégrés",
                "Data pipelines",
                "Synchronisation temps réel"
              ]}
            />

            <ModuleCard
              icon={<Settings size={32} />}
              title="Personnalisation"
              description="Workflows sur mesure, champs personnalisés, automatisations et règles métier spécifiques."
              features={[
                "Workflows configurables",
                "Champs personnalisés",
                "Automatisations avancées",
                "Règles métier"
              ]}
            />

            <ModuleCard
              icon={<Users size={32} />}
              title="Collaboration"
              description="Commentaires contextuels, mentions d'utilisateurs, notifications intelligentes et historique complet."
              features={[
                "Commentaires riches",
                "Mentions & notifications",
                "Historique d'activité",
                "Permissions granulaires"
              ]}
            />
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-20 px-6 bg-slate-900/30 border-t border-slate-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Une intégration fluide avec vos outils
          </h2>
          <p className="text-xl text-slate-300 mb-12">
            Powalyze se connecte à votre écosystème existant via des APIs REST complètes, des webhooks et des connecteurs natifs.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <h3 className="text-lg font-bold mb-2">APIs REST</h3>
              <p className="text-sm text-slate-400">Documentation complète, authentification sécurisée, endpoints versionnés</p>
            </div>
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <h3 className="text-lg font-bold mb-2">Webhooks</h3>
              <p className="text-sm text-slate-400">Notifications en temps réel, événements configurables, retry automatique</p>
            </div>
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <h3 className="text-lg font-bold mb-2">Power BI</h3>
              <p className="text-sm text-slate-400">Connecteur natif, dashboards embarqués, synchronisation bidirectionnelle</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-6 border-t border-slate-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Prêt à découvrir le cockpit ?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Demandez une démonstration personnalisée ou testez immédiatement en mode Demo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-semibold text-lg shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all"
            >
              Demander une démonstration
            </Link>
            <Link
              href="/signup?demo=true"
              className="px-8 py-4 rounded-xl border-2 border-amber-400/50 hover:border-amber-400 text-white font-semibold text-lg transition-all"
            >
              Essayer le mode Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function ModuleCard({ icon, title, description, features }: { icon: React.ReactNode; title: string; description: string; features: string[] }) {
  return (
    <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/50 transition-all group">
      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/20 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-400 mb-4 text-sm">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}
