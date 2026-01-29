import Link from "next/link";
import { CheckCircle, ArrowRight, Zap, TrendingUp, Users, Target, BarChart3, Clock } from "lucide-react";

export default function AgileMethodologyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white pt-24">
      {/* Hero */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="inline-block px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold mb-6">
            Méthodologie Agile
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Sprints, Backlogs<br />et Vélocité Prédictive
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl">
            Powalyze intègre nativement les rituels Agile pour piloter vos projets en mode itératif avec des métriques en temps réel et des prédictions basées sur votre vélocité historique.
          </p>
        </div>
      </section>

      {/* Principaux bénéfices */}
      <section className="py-20 px-6 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            L'Agile dans Powalyze
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="text-emerald-400" size={32} />}
              title="Sprints & Itérations"
              description="Planifiez vos sprints, définissez les objectifs, suivez la progression en temps réel et célébrez les livrables à chaque fin d'itération."
              features={[
                "Durée configurable (1-4 semaines)",
                "Capacity planning par équipe",
                "Sprint goals et engagements",
                "Review et retrospective intégrées"
              ]}
            />

            <FeatureCard
              icon={<Target className="text-emerald-400" size={32} />}
              title="Backlog Priorisé"
              description="Gérez votre backlog produit avec des mécanismes de priorisation intelligents (MoSCoW, WSJF, Valeur/Effort)."
              features={[
                "Priorisation automatique par valeur",
                "Estimations en story points ou heures",
                "Dépendances visuelles entre stories",
                "Affinage du backlog assisté par IA"
              ]}
            />

            <FeatureCard
              icon={<TrendingUp className="text-emerald-400" size={32} />}
              title="Vélocité & Prédictions"
              description="L'IA calcule automatiquement votre vélocité moyenne et prédit les dates de livraison probables."
              features={[
                "Burndown charts en temps réel",
                "Prédictions de fin de sprint",
                "Alertes sur risques de débordement",
                "Recommandations de capacité"
              ]}
            />

            <FeatureCard
              icon={<Users className="text-emerald-400" size={32} />}
              title="Rituels Scrum/Kanban"
              description="Tous les rituels Agile sont supportés avec des templates prêts à l'emploi et des guides contextuels."
              features={[
                "Daily standup (asynchrone ou sync)",
                "Sprint planning avec poker planning",
                "Sprint review automatisée",
                "Rétrospectives avec actions trackées"
              ]}
            />

            <FeatureCard
              icon={<BarChart3 className="text-emerald-400" size={32} />}
              title="Métriques Agiles"
              description="Suivez les KPIs essentiels : vélocité, lead time, cycle time, throughput et predictability."
              features={[
                "Cumulative flow diagram",
                "Control charts pour la stabilité",
                "Lead time & cycle time par story",
                "Predictability score du sprint"
              ]}
            />

            <FeatureCard
              icon={<Clock className="text-emerald-400" size={32} />}
              title="Flow & Kanban"
              description="Visualisez votre flux de travail avec des boards Kanban et optimisez continuellement votre débit."
              features={[
                "Work In Progress (WIP) limits",
                "Flow efficiency tracking",
                "Blockers automatiquement détectés",
                "Optimisation du throughput par l'IA"
              ]}
            />
          </div>
        </div>
      </section>

      {/* Comment l'IA adapte Agile */}
      <section className="py-20 px-6 bg-slate-900/30 border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Comment l'IA optimise votre Agile
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <AIFeatureCard
              title="Prédictions de vélocité"
              description="L'IA analyse votre historique de sprints et prédit la vélocité probable des prochaines itérations, en tenant compte des variations saisonnières et des événements exceptionnels."
            />
            <AIFeatureCard
              title="Détection d'anomalies"
              description="Le système détecte automatiquement les sprints anormaux (vélocité basse, trop de débordements) et suggère des actions correctives."
            />
            <AIFeatureCard
              title="Affinement intelligent du backlog"
              description="L'IA suggère des user stories à affiner en priorité en fonction de la proximité du sprint planning et de la complexité estimée."
            />
            <AIFeatureCard
              title="Optimisation de capacité"
              description="Recommandations sur la répartition des ressources entre sprints en fonction de la charge prévisionnelle et des dépendances."
            />
          </div>
        </div>
      </section>

      {/* Cas d'usage */}
      <section className="py-20 px-6 border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Cas d'usage concrets
          </h2>

          <div className="space-y-6">
            <UseCaseCard
              title="Startup SaaS - 3 squads Scrum"
              context="Une startup avec 3 équipes produit (30 personnes) travaillant en sprints de 2 semaines."
              solution="Powalyze centralise les 3 backlogs, synchronise les releases cross-équipes et prédit les dates de livraison des features majeures en fonction de la vélocité de chaque squad."
              results={[
                "Visibilité complète sur les 6 prochains sprints",
                "Réduction de 60% du temps de coordination inter-squads",
                "Prédictions de livraison fiables à ±1 semaine"
              ]}
            />

            <UseCaseCard
              title="Transformation Agile - Banque régionale"
              context="Une banque de 200 personnes en cours de transformation Agile avec 8 tribus."
              solution="Déploiement progressif de Powalyze comme outil de référence pour structurer les rituels, former les équipes et suivre la maturité Agile de chaque tribu."
              results={[
                "Adoption Agile mesurée et trackée par KPIs",
                "Coaching IA adapté au niveau de maturité de chaque équipe",
                "Dashboard exécutif consolidant les 8 tribus"
              ]}
            />
          </div>
        </div>
      </section>

      {/* Configuration */}
      <section className="py-20 px-6 bg-slate-900/30 border-t border-slate-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Configurez Agile en 3 clics
          </h2>
          <p className="text-xl text-slate-300 mb-12">
            Sélectionnez "Agile" comme méthode, définissez la durée de vos sprints et c'est parti. Le cockpit s'adapte automatiquement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-slate-950 font-bold text-lg shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all"
            >
              Démarrer avec Agile
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/methodologies"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-slate-800 hover:border-emerald-500/50 text-white font-semibold text-lg transition-all"
            >
              Voir toutes les méthodologies
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description, features }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  features: string[];
}) {
  return (
    <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/50 transition-all">
      <div className="mb-6">{icon}</div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-slate-400 mb-6">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
            <CheckCircle className="text-emerald-400 flex-shrink-0 mt-0.5" size={16} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AIFeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-500/10 to-slate-900/50 border border-emerald-500/30">
      <h3 className="text-xl font-bold mb-3 text-emerald-400">{title}</h3>
      <p className="text-slate-300 leading-relaxed">{description}</p>
    </div>
  );
}

function UseCaseCard({ title, context, solution, results }: { 
  title: string; 
  context: string; 
  solution: string; 
  results: string[];
}) {
  return (
    <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800">
      <h3 className="text-2xl font-bold mb-4 text-emerald-400">{title}</h3>
      <div className="space-y-4 mb-6">
        <div>
          <div className="text-sm font-semibold text-slate-500 uppercase mb-2">Contexte</div>
          <p className="text-slate-300">{context}</p>
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-500 uppercase mb-2">Solution Powalyze</div>
          <p className="text-slate-300">{solution}</p>
        </div>
      </div>
      <div>
        <div className="text-sm font-semibold text-slate-500 uppercase mb-3">Résultats</div>
        <ul className="space-y-2">
          {results.map((result, i) => (
            <li key={i} className="flex items-start gap-2 text-slate-300">
              <CheckCircle className="text-emerald-400 flex-shrink-0 mt-0.5" size={18} />
              <span>{result}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
