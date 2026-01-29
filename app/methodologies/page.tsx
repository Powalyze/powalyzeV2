import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";

export default function MethodologiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white pt-24">
      {/* Hero */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Votre méthode.<br />Notre intelligence.
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Powalyze s'adapte automatiquement à votre méthode de travail : Agile, Hermès, Cycle en V, Hybride ou vos processus internes.
          </p>
        </div>
      </section>

      {/* Methodologies Grid */}
      <section className="py-20 px-6 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <MethodologyCard
              name="Agile"
              tagline="Sprints, backlogs et vélocité"
              description="Powalyze intègre nativement les rituels Agile : planification de sprints, backlogs priorisés, burndown charts, vélocité prédictive et rétrospectives automatisées."
              features={[
                "Sprints et itérations",
                "Backlog priorisé",
                "Burndown & vélocité",
                "Rituels Scrum/Kanban",
                "Métriques agiles (lead time, cycle time)",
                "Prédictions de livraison"
              ]}
              href="/methodologies/agile"
            />

            <MethodologyCard
              name="Hermès"
              tagline="La méthode suisse de référence"
              description="Phases, jalons et livrables selon le standard Hermès. Powalyze structure automatiquement votre gouvernance selon les 4 phases : initialisation, conception, réalisation, déploiement."
              features={[
                "4 phases structurées",
                "Jalons de décision",
                "Livrables normalisés",
                "Rôles et responsabilités",
                "Documentation conforme",
                "Templates officiels"
              ]}
              href="/methodologies/hermes"
            />

            <MethodologyCard
              name="Cycle en V"
              tagline="Séquencement et validation"
              description="Approche classique en cascade avec validations étape par étape. Powalyze assure la traçabilité complète entre spécifications, développement et tests."
              features={[
                "Phases séquentielles",
                "Validations par étape",
                "Traçabilité exigences → tests",
                "Documentation exhaustive",
                "Revues formelles",
                "Contrôle de conformité"
              ]}
              href="/methodologies/cycle-v"
            />

            <MethodologyCard
              name="Hybride"
              tagline="Le meilleur des deux mondes"
              description="Combinaison intelligente d'approches agiles et prédictives. Powalyze permet de mixer les méthodes selon la nature de chaque projet ou workstream."
              features={[
                "Flexibilité méthodologique",
                "Adaptation par projet",
                "Gouvernance unifiée",
                "Rituels sur mesure",
                "Reporting consolidé",
                "Optimisation continue"
              ]}
              href="/methodologies/hybride"
            />
          </div>
        </div>
      </section>

      {/* How AI Adapts */}
      <section className="py-20 px-6 bg-slate-900/30 border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Comment l'IA s'adapte à votre méthode
            </h2>
            <p className="text-xl text-slate-300">
              L'intelligence artificielle comprend votre contexte méthodologique et ajuste ses recommandations en conséquence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <AdaptationCard
              title="Workflows automatiques"
              description="Les étapes, validations et transitions sont configurées selon votre méthode. L'IA propose automatiquement les actions suivantes."
            />
            <AdaptationCard
              title="Rapports contextuels"
              description="Les synthèses exécutives utilisent le vocabulaire et les métriques de votre méthode (vélocité agile, jalons Hermès, etc.)."
            />
            <AdaptationCard
              title="Recommandations ciblées"
              description="Les actions suggérées respectent les contraintes et rituels de votre approche méthodologique."
            />
          </div>
        </div>
      </section>

      {/* Custom Methodologies */}
      <section className="py-20 px-6 border-t border-slate-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Vous avez votre propre méthode ?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Powalyze peut être configuré pour s'adapter à vos processus internes, nomenclatures et rituels spécifiques.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-semibold text-lg shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all"
          >
            Discutons de votre contexte
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}

function MethodologyCard({ name, tagline, description, features, href }: { name: string; tagline: string; description: string; features: string[]; href: string }) {
  return (
    <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/50 transition-all group">
      <h3 className="text-3xl font-bold mb-2 text-amber-400">{name}</h3>
      <p className="text-sm text-slate-400 mb-4 italic">{tagline}</p>
      <p className="text-slate-300 mb-6 leading-relaxed">{description}</p>
      <ul className="space-y-2 mb-6">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
            <CheckCircle className="text-amber-400 flex-shrink-0 mt-0.5" size={16} />
            {feature}
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-semibold group-hover:gap-3 transition-all"
      >
        En savoir plus
        <ArrowRight size={18} />
      </Link>
    </div>
  );
}

function AdaptationCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
