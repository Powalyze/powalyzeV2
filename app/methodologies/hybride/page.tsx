import Link from "next/link";
import { CheckCircle, ArrowRight, Zap, GitMerge, Sparkles, BarChart3, Users, Shield } from "lucide-react";

export default function HybridMethodologyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white pt-24">
      {/* Hero */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="inline-block px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-semibold mb-6">
            Approche Hybride
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Le meilleur des<br />deux mondes
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl">
            Combinez la flexibilité de l'Agile avec la rigueur des méthodes prédictives. Powalyze orchestre intelligemment différentes approches au sein d'un même portefeuille.
          </p>
        </div>
      </section>

      {/* Pourquoi Hybride */}
      <section className="py-20 px-6 border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Pourquoi une approche hybride ?
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <ReasonCard
              icon={<Zap className="text-amber-400" size={32} />}
              title="Flexibilité selon le contexte"
              description="Certains projets nécessitent l'agilité, d'autres la rigueur prédictive. L'hybride permet d'adapter l'approche projet par projet."
            />

            <ReasonCard
              icon={<GitMerge className="text-amber-400" size={32} />}
              title="Transition progressive"
              description="Migrez progressivement vers l'Agile sans révolutionner toute votre organisation du jour au lendemain."
            />

            <ReasonCard
              icon={<Sparkles className="text-amber-400" size={32} />}
              title="Optimisation continue"
              description="Profitez du meilleur de chaque méthode : la vélocité de l'Agile et la traçabilité du prédictif."
            />
          </div>

          <div className="p-8 rounded-2xl bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-500/30">
            <h3 className="text-2xl font-bold mb-4">Exemple concret</h3>
            <p className="text-slate-300 leading-relaxed">
              Un programme de transformation peut combiner :
              <span className="block mt-2 ml-6">
                → <strong className="text-emerald-400">Agile</strong> pour le développement de features produit<br />
                → <strong className="text-blue-400">Hermès</strong> pour la gouvernance globale et les jalons réglementaires<br />
                → <strong className="text-purple-400">Cycle en V</strong> pour les composants critiques nécessitant une certification
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Scénarios hybrides */}
      <section className="py-20 px-6 bg-slate-900/30 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Scénarios hybrides pris en charge
          </h2>

          <div className="space-y-6">
            <HybridScenarioCard
              title="Agile dans un cadre prédictif"
              description="Gouvernance globale en Cycle en V ou Hermès avec des équipes produit en Agile"
              configuration={{
                global: "Hermès 4 phases",
                teams: "Sprints Scrum 2 semaines",
                sync: "Jalons Hermès = fin de releases Agile"
              }}
              benefits={[
                "Conformité réglementaire garantie",
                "Flexibilité produit maintenue",
                "Reporting consolidé automatique"
              ]}
            />

            <HybridScenarioCard
              title="Workstreams avec méthodologies différentes"
              description="Plusieurs workstreams en parallèle avec des approches adaptées à chaque contexte"
              configuration={{
                workstream1: "Front-end → Agile",
                workstream2: "Back-end core → Cycle en V",
                workstream3: "Infrastructure → Hermès"
              }}
              benefits={[
                "Optimisation par domaine",
                "Coordination inter-workstreams automatique",
                "Vision consolidée temps réel"
              ]}
            />

            <HybridScenarioCard
              title="Transition progressive vers Agile"
              description="Migration step-by-step d'une organisation traditionnelle vers l'Agile"
              configuration={{
                phase1: "Projets pilotes en Agile",
                phase2: "Extension progressive aux autres équipes",
                phase3: "Gouvernance agile généralisée"
              }}
              benefits={[
                "Transition maîtrisée et mesurée",
                "Apprentissage graduel des équipes",
                "Retour en arrière possible"
              ]}
            />
          </div>
        </div>
      </section>

      {/* Comment Powalyze orchestre */}
      <section className="py-20 px-6 border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Comment Powalyze orchestre l'hybride
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <OrchestrationCard
              icon={<BarChart3 className="text-amber-400" size={32} />}
              title="Reporting unifié"
              description="Un seul dashboard consolidant les projets Agile, Hermès et Cycle en V avec des métriques normalisées."
              features={[
                "Métriques normalisées (RAG status, vélocité, budget)",
                "Drill-down dans chaque méthodologie",
                "Vues personnalisées par stakeholder"
              ]}
            />

            <OrchestrationCard
              icon={<GitMerge className="text-amber-400" size={32} />}
              title="Synchronisation automatique"
              description="Gestion automatique des dépendances et synchronisations entre projets de méthodologies différentes."
              features={[
                "Détection des dépendances inter-projets",
                "Alertes sur décalages de planning",
                "Recommandations de synchronisation"
              ]}
            />

            <OrchestrationCard
              icon={<Users className="text-amber-400" size={32} />}
              title="Gouvernance unifiée"
              description="Comités et décisions centralisés avec visibilité sur tous les projets quelle que soit leur méthode."
              features={[
                "Comités de pilotage multi-méthodologies",
                "Décisions tracées et impactées automatiquement",
                "Escalade intelligente selon criticité"
              ]}
            />

            <OrchestrationCard
              icon={<Shield className="text-amber-400" size={32} />}
              title="Risques consolidés"
              description="Identification et mitigation des risques à l'échelle du portefeuille avec impacts croisés."
              features={[
                "Cartographie des risques globale",
                "Analyse d'impact inter-projets",
                "Plans de mitigation coordonnés"
              ]}
            />
          </div>
        </div>
      </section>

      {/* Configuration */}
      <section className="py-20 px-6 bg-slate-900/30 border-t border-slate-800/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Configuration projet par projet
          </h2>

          <div className="space-y-4">
            <ConfigStep
              number="1"
              title="Sélectionnez la méthodologie par projet"
              description="Chaque projet peut avoir sa propre méthode : Agile, Hermès, Cycle en V ou même une méthode custom."
            />
            <ConfigStep
              number="2"
              title="Définissez les points de synchronisation"
              description="Indiquez les jalons clés où les projets doivent se synchroniser (releases, go-live, comités)."
            />
            <ConfigStep
              number="3"
              title="Configurez le reporting consolidé"
              description="Choisissez les métriques à consolider et la fréquence de reporting au niveau portefeuille."
            />
            <ConfigStep
              number="4"
              title="L'IA orchestre automatiquement"
              description="Powalyze gère les dépendances, alerte sur les risques et synchronise les équipes."
            />
          </div>

          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-lg shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all"
            >
              Démarrer avec l'Hybride
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/methodologies"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-slate-800 hover:border-amber-500/50 text-white font-semibold text-lg transition-all"
            >
              Voir toutes les méthodologies
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function ReasonCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/50 transition-all">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function HybridScenarioCard({ title, description, configuration, benefits }: {
  title: string;
  description: string;
  configuration: Record<string, string>;
  benefits: string[];
}) {
  return (
    <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/50 transition-all">
      <h3 className="text-2xl font-bold mb-3 text-amber-400">{title}</h3>
      <p className="text-slate-400 mb-6">{description}</p>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="text-sm font-semibold text-slate-500 uppercase mb-3">Configuration</div>
          <div className="space-y-2">
            {Object.entries(configuration).map(([key, value]) => (
              <div key={key} className="text-sm">
                <span className="text-slate-500">{key}:</span>{" "}
                <span className="text-slate-300">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold text-slate-500 uppercase mb-3">Bénéfices</div>
          <ul className="space-y-2">
            {benefits.map((benefit, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <CheckCircle className="text-amber-400 flex-shrink-0 mt-0.5" size={16} />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function OrchestrationCard({ icon, title, description, features }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
}) {
  return (
    <div className="p-6 rounded-xl bg-slate-900/50 border border-amber-500/30">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-400 text-sm mb-4">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
            <CheckCircle className="text-amber-400 flex-shrink-0 mt-0.5" size={14} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ConfigStep({ number, title, description }: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4 p-6 rounded-xl bg-slate-900/50 border border-slate-800">
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400/20 to-amber-600/20 flex items-center justify-center">
        <span className="text-xl font-bold text-amber-400">{number}</span>
      </div>
      <div>
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-slate-400 text-sm">{description}</p>
      </div>
    </div>
  );
}
