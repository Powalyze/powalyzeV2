"use client";

import Link from "next/link";
import { ArrowRight, Shield, FileText, Users, CheckCircle, Target, Scale } from "lucide-react";
import Image from "next/image";

export default function ExpertiseGouvernancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Hero Section */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=2000&q=80"
            alt="Governance"
            fill
            className="object-cover opacity-20 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/80 to-slate-950" />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-sm font-semibold mb-6">
            <Shield size={16} />
            <span>Expertise Gouvernance</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Gouvernance<br />de Projets
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Cadres de gouvernance structurés pour piloter vos portefeuilles<br className="hidden md:block" />
            avec rigueur, transparence et efficacité.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold text-lg shadow-lg transition-all"
          >
            Parler à un expert Gouvernance
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Nos services Gouvernance</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              De la conception à l'opérationnel: une gouvernance adaptée à votre maturité
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <ServiceCard
              title="Design de Gouvernance"
              description="Conception d'un cadre de gouvernance sur-mesure: instances, rôles, processus décisionnels."
              features={[
                "Audit gouvernance existante",
                "Définition instances (COMEX, COPIL, CODIR)",
                "Matrice RACI étendue (décisions, validations)",
                "Processus d'escalade et arbitrage",
                "Documentation cadre de gouvernance",
              ]}
              icon={<Scale size={32} />}
            />
            <ServiceCard
              title="Mise en place Rituels"
              description="Structuration et animation des rituels de gouvernance: ordre du jour, cadences, livrables."
              features={[
                "Design ordre du jour COMEX/COPIL",
                "Templates reporting exécutif",
                "Automatisation préparation (IA)",
                "Animation rituels (shadowing)",
                "Amélioration continue rituels",
              ]}
              icon={<Users size={32} />}
            />
            <ServiceCard
              title="Traçabilité Décisions"
              description="Système complet de traçabilité des décisions stratégiques: workflow, impacts, historique."
              features={[
                "Workflow décisionnel (proposition → validation)",
                "Quantification impacts (budget, planning, ressources)",
                "Liens décisions ↔ projets ↔ risques",
                "Tableau de bord décisions COMEX",
                "Audit trail complet",
              ]}
              icon={<FileText size={32} />}
            />
            <ServiceCard
              title="Gouvernance Continue"
              description="Accompagnement long terme: pilotage, amélioration continue, formation équipes."
              features={[
                "Pilotage instances (animation COMEX/COPIL)",
                "Revue trimestrielle efficacité",
                "Coaching équipes gouvernance",
                "Adaptation processus (amélioration continue)",
                "Knowledge management (documentation)",
              ]}
              icon={<Target size={32} />}
            />
          </div>
        </div>
      </section>

      {/* Frameworks */}
      <section className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Frameworks de gouvernance</h2>
            <p className="text-xl text-slate-300">Nous nous appuyons sur les standards du marché</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <FrameworkCard
              name="COBIT"
              description="Framework IT governance: alignement stratégie IT/Business, gestion risques IT, conformité."
              usage="Grandes organisations, secteur financier"
            />
            <FrameworkCard
              name="ITIL"
              description="Gestion services IT: service delivery, incident management, change management."
              usage="Départements IT, outsourceurs"
            />
            <FrameworkCard
              name="ISO 21500"
              description="Standard international gestion de projet: processus, phases, domaines de connaissance."
              usage="Projets complexes, certifications"
            />
            <FrameworkCard
              name="PMBoK (PMI)"
              description="Guide des bonnes pratiques projet: 10 domaines, 5 groupes de processus, outils & techniques."
              usage="PMO traditionnels, secteur construction"
            />
            <FrameworkCard
              name="Prince2"
              description="Méthodologie structurée: 7 principes, 7 thèmes, 7 processus. Très répandu en Europe."
              usage="Secteur public, grandes entreprises UK/CH"
            />
            <FrameworkCard
              name="SAFe"
              description="Scaled Agile Framework: agile à l'échelle, program increments, trains agiles."
              usage="Transformations agiles grandes orgs"
            />
          </div>
        </div>
      </section>

      {/* Governance Layers */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Niveaux de gouvernance</h2>
            <p className="text-xl text-slate-300">Une gouvernance à 3 niveaux pour couvrir tous les besoins</p>
          </div>

          <div className="space-y-6">
            <LayerCard
              level="1"
              name="Gouvernance Stratégique"
              description="Niveau COMEX / C-Level: alignement stratégique, priorisation portfolio, allocation budgets."
              frequency="Mensuel ou trimestriel"
              participants="DG, DG adjoint, CFO, CIO, Directeurs métier"
              deliverables={["Dashboard portfolio exécutif", "Top 10 décisions stratégiques", "Budget & priorisation", "Risques critiques"]}
            />
            <LayerCard
              level="2"
              name="Gouvernance Tactique"
              description="Niveau COPIL / Program: pilotage programmes, arbitrage inter-projets, ressources."
              frequency="Bi-hebdomadaire ou mensuel"
              participants="Directeur PMO, Program Managers, Product Owners, Sponsors"
              deliverables={["Avancement programmes", "Risques & issues", "Demandes d'arbitrage", "Roadmap ajustements"]}
            />
            <LayerCard
              level="3"
              name="Gouvernance Opérationnelle"
              description="Niveau projet: suivi exécution, coordination équipes, résolution blocages."
              frequency="Hebdomadaire"
              participants="Chef de projet, Scrum Master, Tech Lead, équipe core"
              deliverables={["Sprint review", "Burndown charts", "Blockers & actions", "Planning prochaines itérations"]}
            />
          </div>
        </div>
      </section>

      {/* Case Study */}
      <section className="py-20 px-6 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-y border-slate-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Cas client</h2>
            <p className="text-xl text-slate-300">Refonte gouvernance PMO Assurances</p>
          </div>

          <div className="bg-slate-900/80 rounded-2xl border border-indigo-500/30 p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-4">Contexte</h3>
                <p className="text-slate-300 mb-4">
                  Compagnie d'assurances 3000+ employés avec 35 projets en parallèle mais gouvernance 
                  défaillante: décisions non tracées, COMEX inefficaces, aucune priorisation formalisée.
                </p>
                <h3 className="text-2xl font-bold mb-4 mt-6">Problématiques</h3>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="text-red-400 mt-1 flex-shrink-0" />
                    <span>COMEX de 4h sans décisions actionnables</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="text-red-400 mt-1 flex-shrink-0" />
                    <span>23 projets en parallèle sans priorisation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="text-red-400 mt-1 flex-shrink-0" />
                    <span>Décisions verbales non documentées</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="text-red-400 mt-1 flex-shrink-0" />
                    <span>Aucun suivi impacts post-décisions</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">Solution Powalyze</h3>
                <p className="text-slate-300 mb-4">
                  Refonte complète gouvernance: 3 niveaux (stratégique/tactique/opérationnel), rituels 
                  structurés, workflow décisions, formation 15 personnes. Livraison en 6 mois.
                </p>
                <h3 className="text-2xl font-bold mb-4 mt-6">Résultats (18 mois)</h3>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="text-emerald-400 mt-1 flex-shrink-0" />
                    <span>COMEX <strong className="text-emerald-400">90 minutes</strong> avec 8 décisions/mois</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="text-emerald-400 mt-1 flex-shrink-0" />
                    <span>Portfolio priorisé: <strong className="text-emerald-400">12 projets</strong> prioritaires</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="text-emerald-400 mt-1 flex-shrink-0" />
                    <span><strong className="text-emerald-400">100%</strong> décisions tracées et suivies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="text-emerald-400 mt-1 flex-shrink-0" />
                    <span>Satisfaction COMEX: <strong className="text-emerald-400">9.2/10</strong></span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-800">
              <p className="text-slate-300 italic">
                "La refonte de notre gouvernance a été un game-changer. Nos COMEX sont passés de réunions 
                interminables à des sessions ultra-efficaces où nous prenons des vraies décisions stratégiques."
              </p>
              <p className="text-sm text-indigo-400 mt-2">— CFO, Compagnie d'Assurances Suisse</p>
            </div>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Best practices gouvernance</h2>
            <p className="text-xl text-slate-300">Ce que nous avons appris sur 150+ projets</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <BestPracticeCard
              title="Rituels réguliers"
              description="COMEX mensuel fixe (même jour/heure) avec ordre du jour structuré et pré-read 48h avant."
            />
            <BestPracticeCard
              title="Décisions actionnables"
              description="Chaque décision doit avoir: responsable (qui), deadline (quand), impact quantifié (combien)."
            />
            <BestPracticeCard
              title="Priorisation transparente"
              description="Critères de priorisation publics (ROI, risque, stratégique) et appliqués de façon objective."
            />
            <BestPracticeCard
              title="Escalade claire"
              description="Processus d'escalade documenté: qui peut escalader quoi, à qui, dans quels délais."
            />
            <BestPracticeCard
              title="Données temps réel"
              description="Dashboards live vs slides PowerPoint: les participants voient la même data fraîche."
            />
            <BestPracticeCard
              title="Feedback loop"
              description="Revue trimestrielle efficacité gouvernance avec ajustements: ce qui marche, ce qui doit changer."
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <StatCard number="60+" label="Gouvernances déployées" />
            <StatCard number="-65%" label="Durée COMEX moyenne" />
            <StatCard number="8.7/10" label="Satisfaction instances" />
            <StatCard number="94%" label="Décisions suivies" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Prêt à structurer votre gouvernance ?</h2>
          <p className="text-xl text-slate-300 mb-8">
            Audit gouvernance gratuit (1h) pour identifier les quick wins
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-10 py-5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold text-xl shadow-lg transition-all"
          >
            Réserver mon audit gouvernance
            <ArrowRight size={24} />
          </Link>
        </div>
      </section>
    </div>
  );
}

function ServiceCard({ title, description, features, icon }: {
  title: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
}) {
  return (
    <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 transition-all">
      <div className="text-indigo-400 mb-4">{icon}</div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-slate-300 mb-6">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm text-slate-400">
            <CheckCircle size={16} className="text-indigo-400 mt-0.5 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FrameworkCard({ name, description, usage }: {
  name: string;
  description: string;
  usage: string;
}) {
  return (
    <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 transition-all">
      <h4 className="text-xl font-bold mb-2 text-indigo-400">{name}</h4>
      <p className="text-sm text-slate-300 mb-3">{description}</p>
      <p className="text-xs text-slate-500"><strong>Usage:</strong> {usage}</p>
    </div>
  );
}

function LayerCard({ level, name, description, frequency, participants, deliverables }: {
  level: string;
  name: string;
  description: string;
  frequency: string;
  participants: string;
  deliverables: string[];
}) {
  return (
    <div className="p-8 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 transition-all">
      <div className="flex items-start gap-6">
        <div className="w-12 h-12 rounded-full bg-indigo-500/20 border-2 border-indigo-500/30 flex items-center justify-center flex-shrink-0 text-xl font-bold text-indigo-400">
          {level}
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold mb-2">{name}</h3>
          <p className="text-slate-300 mb-4">{description}</p>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-slate-500 mb-1">Fréquence</p>
              <p className="text-indigo-400 font-semibold">{frequency}</p>
            </div>
            <div>
              <p className="text-slate-500 mb-1">Participants</p>
              <p className="text-slate-300">{participants}</p>
            </div>
            <div>
              <p className="text-slate-500 mb-1">Livrables</p>
              <ul className="space-y-1">
                {deliverables.map((item, idx) => (
                  <li key={idx} className="text-slate-300">{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BestPracticeCard({ title, description }: {
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 transition-all">
      <CheckCircle size={24} className="text-indigo-400 mb-3" />
      <h4 className="text-lg font-bold mb-2">{title}</h4>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  );
}

function StatCard({ number, label }: {
  number: string;
  label: string;
}) {
  return (
    <div className="text-center">
      <div className="text-5xl font-bold text-indigo-400 mb-2">{number}</div>
      <div className="text-slate-400">{label}</div>
    </div>
  );
}
