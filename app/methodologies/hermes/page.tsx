import Link from "next/link";
import { CheckCircle, ArrowRight, Shield, Flag, FileText, GitBranch, Users, Settings } from "lucide-react";

export default function HermesMethodologyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white pt-24">
      {/* Hero */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="inline-block px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-semibold mb-6">
            Méthode Hermès
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            La méthode suisse<br />de référence
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl">
            Powalyze structure automatiquement votre gouvernance selon les 4 phases Hermès : initialisation, conception, réalisation et déploiement. Conformité garantie avec la méthode officielle de l'administration fédérale suisse.
          </p>
        </div>
      </section>

      {/* Les 4 phases Hermès */}
      <section className="py-20 px-6 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Les 4 phases Hermès dans Powalyze
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <PhaseCard
              number="1"
              title="Initialisation"
              description="Définition du projet, étude de faisabilité, analyse des risques initiale et décision de lancement."
              deliverables={[
                "Mandat de projet",
                "Étude de faisabilité",
                "Analyse préliminaire des risques",
                "Décision Go/No-Go"
              ]}
              milestones={["Jalon d'initialisation", "Décision de lancement"]}
            />

            <PhaseCard
              number="2"
              title="Conception"
              description="Élaboration détaillée de la solution, architecture, planning détaillé et préparation de la réalisation."
              deliverables={[
                "Concept détaillé",
                "Architecture système",
                "Plan de projet détaillé",
                "Spécifications techniques"
              ]}
              milestones={["Jalon de conception", "Autorisation de réalisation"]}
            />

            <PhaseCard
              number="3"
              title="Réalisation"
              description="Développement, tests, intégration et préparation du déploiement selon le plan validé."
              deliverables={[
                "Système réalisé et testé",
                "Documentation technique",
                "Plan de déploiement",
                "Plan de formation"
              ]}
              milestones={["Jalons intermédiaires", "Jalon de réalisation"]}
            />

            <PhaseCard
              number="4"
              title="Déploiement"
              description="Mise en production, formation des utilisateurs, transfert aux équipes opérationnelles et clôture."
              deliverables={[
                "Système en production",
                "Utilisateurs formés",
                "Documentation opérationnelle",
                "Rapport de clôture"
              ]}
              milestones={["Jalon de déploiement", "Acceptation finale"]}
            />
          </div>
        </div>
      </section>

      {/* Rôles et responsabilités */}
      <section className="py-20 px-6 bg-slate-900/30 border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Rôles Hermès intégrés
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <RoleCard
              icon={<Shield size={32} />}
              title="Mandant"
              description="Propriétaire du projet, responsable des décisions stratégiques et du budget."
              responsibilities={[
                "Décisions aux jalons",
                "Approbation des livrables majeurs",
                "Arbitrage des escalades"
              ]}
            />

            <RoleCard
              icon={<Users size={32} />}
              title="Chef de projet"
              description="Pilotage opérationnel, coordination des équipes et suivi de l'avancement."
              responsibilities={[
                "Planification détaillée",
                "Gestion des ressources",
                "Reporting régulier"
              ]}
            />

            <RoleCard
              icon={<Settings size={32} />}
              title="Experts métiers"
              description="Spécialistes apportant leur expertise technique, méthodologique ou métier."
              responsibilities={[
                "Validation des solutions",
                "Support technique",
                "Revues de qualité"
              ]}
            />

            <RoleCard
              icon={<FileText size={32} />}
              title="Utilisateurs clés"
              description="Représentants des utilisateurs finaux participant à la validation."
              responsibilities={[
                "Expression des besoins",
                "Validation UAT",
                "Feedback continu"
              ]}
            />

            <RoleCard
              icon={<GitBranch size={32} />}
              title="Comité de pilotage"
              description="Instance décisionnelle sur les orientations stratégiques du projet."
              responsibilities={[
                "Décisions aux jalons",
                "Validation du budget",
                "Arbitrage des conflits"
              ]}
            />

            <RoleCard
              icon={<Flag size={32} />}
              title="Assurance qualité"
              description="Garantie de la conformité aux standards et aux exigences."
              responsibilities={[
                "Audits qualité",
                "Validation livrables",
                "Conformité processus"
              ]}
            />
          </div>
        </div>
      </section>

      {/* Livrables automatisés */}
      <section className="py-20 px-6 border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Livrables Hermès automatisés
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <DeliverableCard
              title="Mandat de projet"
              description="Généré automatiquement avec les objectifs, le périmètre, les ressources et le budget."
            />
            <DeliverableCard
              title="Plan de projet détaillé"
              description="Phases, jalons, activités, dépendances et allocation des ressources."
            />
            <DeliverableCard
              title="Registre des risques"
              description="Identification, évaluation, plans de mitigation et suivi continu des risques."
            />
            <DeliverableCard
              title="Rapport d'avancement"
              description="Statut des phases, écarts, décisions prises et actions en cours."
            />
            <DeliverableCard
              title="Documentation de conception"
              description="Architecture, spécifications techniques, interfaces et modèles de données."
            />
            <DeliverableCard
              title="Rapport de clôture"
              description="Bilan du projet, leçons apprises, livrables produits et recommandations."
            />
          </div>
        </div>
      </section>

      {/* Conformité et certifications */}
      <section className="py-20 px-6 bg-slate-900/30 border-t border-slate-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Conformité Hermès garantie
          </h2>
          <p className="text-xl text-slate-300 mb-12">
            Powalyze respecte intégralement la méthode Hermès version 5 et génère tous les livrables requis selon les standards officiels.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 rounded-xl bg-slate-900/50 border border-blue-500/30">
              <div className="text-3xl font-bold text-blue-400 mb-2">100%</div>
              <div className="text-slate-400">Conformité Hermès 5</div>
            </div>
            <div className="p-6 rounded-xl bg-slate-900/50 border border-blue-500/30">
              <div className="text-3xl font-bold text-blue-400 mb-2">40+</div>
              <div className="text-slate-400">Livrables types intégrés</div>
            </div>
            <div className="p-6 rounded-xl bg-slate-900/50 border border-blue-500/30">
              <div className="text-3xl font-bold text-blue-400 mb-2">4</div>
              <div className="text-slate-400">Langues officielles (FR/DE/IT/EN)</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-lg shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all"
            >
              Démarrer avec Hermès
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/methodologies"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-slate-800 hover:border-blue-500/50 text-white font-semibold text-lg transition-all"
            >
              Voir toutes les méthodologies
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function PhaseCard({ number, title, description, deliverables, milestones }: { 
  number: string; 
  title: string; 
  description: string; 
  deliverables: string[];
  milestones: string[];
}) {
  return (
    <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 transition-all">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-400/20 to-blue-600/20 flex items-center justify-center">
          <span className="text-3xl font-bold text-blue-400">{number}</span>
        </div>
        <h3 className="text-2xl font-bold">{title}</h3>
      </div>
      <p className="text-slate-400 mb-6">{description}</p>
      
      <div className="space-y-4">
        <div>
          <div className="text-sm font-semibold text-slate-500 uppercase mb-2">Livrables</div>
          <ul className="space-y-2">
            {deliverables.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <CheckCircle className="text-blue-400 flex-shrink-0 mt-0.5" size={16} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <div className="text-sm font-semibold text-slate-500 uppercase mb-2">Jalons</div>
          <ul className="space-y-2">
            {milestones.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <Flag className="text-blue-400 flex-shrink-0 mt-0.5" size={16} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function RoleCard({ icon, title, description, responsibilities }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  responsibilities: string[];
}) {
  return (
    <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
      <div className="text-blue-400 mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-400 text-sm mb-4">{description}</p>
      <ul className="space-y-2">
        {responsibilities.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
            <CheckCircle className="text-blue-400 flex-shrink-0 mt-0.5" size={14} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DeliverableCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-slate-900/50 border border-blue-500/30">
      <h3 className="text-lg font-bold mb-2 text-blue-400">{title}</h3>
      <p className="text-slate-300 text-sm">{description}</p>
    </div>
  );
}
