import Link from "next/link";
import { CheckCircle, ArrowRight, Layers, TestTube, FileCheck, GitCompare, AlertTriangle } from "lucide-react";

export default function CycleVMethodologyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white pt-24">
      {/* Hero */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="inline-block px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-sm font-semibold mb-6">
            Cycle en V
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Séquencement rigoureux<br />et validation complète
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl">
            Pour les projets nécessitant une approche séquentielle avec des phases distinctes et des validations formelles à chaque étape. Traçabilité complète des exigences jusqu'aux tests.
          </p>
        </div>
      </section>

      {/* Schéma du V */}
      <section className="py-20 px-6 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Les phases du Cycle en V
          </h2>

          {/* Descente du V */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-purple-400 mb-6">↓ Phases descendantes (Spécification)</h3>
              
              <VPhaseCard
                number="1"
                title="Analyse des besoins"
                description="Expression et validation des besoins métier"
                deliverables={["Cahier des charges", "Spécifications fonctionnelles"]}
                validates="Tests d'acceptation"
              />

              <VPhaseCard
                number="2"
                title="Conception générale"
                description="Architecture globale du système"
                deliverables={["Architecture système", "Spécifications techniques générales"]}
                validates="Tests d'intégration"
              />

              <VPhaseCard
                number="3"
                title="Conception détaillée"
                description="Spécifications détaillées de chaque module"
                deliverables={["Spécifications détaillées", "Modèles de données"]}
                validates="Tests unitaires"
              />

              <VPhaseCard
                number="4"
                title="Codage / Développement"
                description="Implémentation technique des composants"
                deliverables={["Code source", "Documentation technique"]}
                validates="Validation du code"
              />
            </div>

            {/* Montée du V */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-purple-400 mb-6">↑ Phases ascendantes (Validation)</h3>

              <VPhaseCard
                number="5"
                title="Tests unitaires"
                description="Validation de chaque composant isolément"
                deliverables={["Rapports de tests unitaires", "Couverture de code"]}
                validates="Conception détaillée"
              />

              <VPhaseCard
                number="6"
                title="Tests d'intégration"
                description="Validation de l'intégration des modules"
                deliverables={["Rapports d'intégration", "Résolution des interfaces"]}
                validates="Conception générale"
              />

              <VPhaseCard
                number="7"
                title="Tests système"
                description="Validation du système complet"
                deliverables={["Rapport de tests système", "Validation technique"]}
                validates="Architecture système"
              />

              <VPhaseCard
                number="8"
                title="Tests d'acceptation (UAT)"
                description="Validation métier par les utilisateurs"
                deliverables={["PV de recette", "Acceptation finale"]}
                validates="Besoins métier"
              />
            </div>
          </div>

          <div className="text-center p-8 rounded-xl bg-gradient-to-r from-purple-500/10 to-slate-900/50 border border-purple-500/30">
            <p className="text-lg text-slate-300">
              <strong className="text-white">Traçabilité bidirectionnelle garantie</strong> : Chaque exigence est reliée à ses spécifications, son code et ses tests de validation.
            </p>
          </div>
        </div>
      </section>

      {/* Matrice de traçabilité */}
      <section className="py-20 px-6 bg-slate-900/30 border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Matrice de traçabilité automatisée
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <TraceabilityCard
              icon={<GitCompare size={32} />}
              title="Exigences → Tests"
              description="Chaque exigence métier est automatiquement reliée à ses cas de tests d'acceptation."
              coverage="100% de couverture garantie"
            />

            <TraceabilityCard
              icon={<Layers size={32} />}
              title="Spécifications → Code"
              description="Les spécifications techniques sont tracées jusqu'aux modules de code correspondants."
              coverage="Traçabilité bidirectionnelle"
            />

            <TraceabilityCard
              icon={<TestTube size={32} />}
              title="Tests → Résultats"
              description="Suivi en temps réel de l'exécution des tests et de leur statut (passé/échoué)."
              coverage="Dashboard temps réel"
            />
          </div>

          <div className="p-8 rounded-2xl bg-slate-900/50 border border-purple-500/30">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <FileCheck className="text-purple-400" size={32} />
              Alertes de non-conformité
            </h3>
            <p className="text-slate-300 mb-4">
              L'IA détecte automatiquement les manques de traçabilité et alerte lorsque :
            </p>
            <ul className="grid md:grid-cols-2 gap-3">
              {[
                "Une exigence n'a pas de test associé",
                "Un module n'est couvert par aucun test",
                "Une spécification est modifiée sans mise à jour des tests",
                "Des tests échouent de manière récurrente",
                "Le taux de couverture descend sous le seuil défini",
                "Des dépendances non documentées sont détectées"
              ].map((alert, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-300">
                  <AlertTriangle className="text-amber-400 flex-shrink-0 mt-0.5" size={16} />
                  <span className="text-sm">{alert}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Gestion des changements */}
      <section className="py-20 px-6 border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Gestion stricte des changements
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <ChangeManagementCard
              title="Demande de changement"
              description="Toute modification passe par un workflow d'approbation avec analyse d'impact automatique."
              steps={[
                "Expression du besoin de changement",
                "Analyse d'impact sur les phases en aval",
                "Estimation des coûts et délais",
                "Approbation par le comité",
                "Mise à jour de la traçabilité"
              ]}
            />

            <ChangeManagementCard
              title="Impact automatique"
              description="L'IA calcule automatiquement l'impact d'un changement sur les phases, tests et planning."
              steps={[
                "Identification des éléments impactés",
                "Calcul du delta de charge",
                "Mise à jour du planning",
                "Notification des parties prenantes",
                "Revue de la matrice de traçabilité"
              ]}
            />
          </div>
        </div>
      </section>

      {/* Cas d'usage */}
      <section className="py-20 px-6 bg-slate-900/30 border-t border-slate-800/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Idéal pour les projets critiques
          </h2>

          <div className="space-y-6">
            <UseCaseCard
              title="Système bancaire core"
              description="Migration d'un système bancaire legacy vers une nouvelle plateforme avec exigences de conformité strictes."
              benefits={[
                "Traçabilité complète pour l'audit",
                "Validation formelle à chaque phase",
                "Documentation exhaustive automatisée"
              ]}
            />

            <UseCaseCard
              title="Dispositif médical"
              description="Développement d'un logiciel médical nécessitant une certification (FDA, CE) avec traçabilité totale."
              benefits={[
                "Conformité réglementaire garantie",
                "Dossier de certification généré automatiquement",
                "Gestion des risques intégrée"
              ]}
            />

            <UseCaseCard
              title="Système de sécurité critique"
              description="Infrastructure de sécurité pour une installation industrielle avec validation formelle requise."
              benefits={[
                "Spécifications techniques rigoureuses",
                "Tests exhaustifs avec preuve de couverture",
                "Archivage pérenne de la documentation"
              ]}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-slate-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Cycle en V avec IA et traçabilité
          </h2>
          <p className="text-xl text-slate-300 mb-12">
            Gardez la rigueur du Cycle en V tout en bénéficiant de l'intelligence artificielle pour optimiser la traçabilité et la gestion des changements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white font-bold text-lg shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all"
            >
              Démarrer avec Cycle en V
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/methodologies"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-slate-800 hover:border-purple-500/50 text-white font-semibold text-lg transition-all"
            >
              Voir toutes les méthodologies
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function VPhaseCard({ number, title, description, deliverables, validates }: {
  number: string;
  title: string;
  description: string;
  deliverables: string[];
  validates: string;
}) {
  return (
    <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-purple-500/50 transition-all">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400/20 to-purple-600/20 flex items-center justify-center">
          <span className="text-lg font-bold text-purple-400">{number}</span>
        </div>
        <h3 className="text-lg font-bold">{title}</h3>
      </div>
      <p className="text-sm text-slate-400 mb-3">{description}</p>
      <div className="space-y-2 mb-3">
        {deliverables.map((item, i) => (
          <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
            <CheckCircle className="text-purple-400 flex-shrink-0 mt-0.5" size={14} />
            <span>{item}</span>
          </div>
        ))}
      </div>
      <div className="text-xs text-purple-400 font-semibold">
        ↔ Valide : {validates}
      </div>
    </div>
  );
}

function TraceabilityCard({ icon, title, description, coverage }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  coverage: string;
}) {
  return (
    <div className="p-6 rounded-xl bg-slate-900/50 border border-purple-500/30">
      <div className="text-purple-400 mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-400 mb-4 text-sm">{description}</p>
      <div className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold inline-block">
        {coverage}
      </div>
    </div>
  );
}

function ChangeManagementCard({ title, description, steps }: {
  title: string;
  description: string;
  steps: string[];
}) {
  return (
    <div className="p-8 rounded-xl bg-slate-900/50 border border-slate-800">
      <h3 className="text-xl font-bold mb-3 text-purple-400">{title}</h3>
      <p className="text-slate-400 mb-6">{description}</p>
      <ol className="space-y-2">
        {steps.map((step, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-xs font-bold text-purple-400">
              {i + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function UseCaseCard({ title, description, benefits }: {
  title: string;
  description: string;
  benefits: string[];
}) {
  return (
    <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
      <h3 className="text-xl font-bold mb-2 text-purple-400">{title}</h3>
      <p className="text-slate-400 mb-4 text-sm">{description}</p>
      <ul className="space-y-2">
        {benefits.map((benefit, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
            <CheckCircle className="text-purple-400 flex-shrink-0 mt-0.5" size={16} />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
