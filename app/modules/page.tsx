"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle, Zap, BarChart3, Users, FileText, GitBranch, Brain, Shield, Database, Workflow, Bell } from "lucide-react";

export default function ModulesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Hero Section */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-amber-100 to-white">
            Modules du Cockpit Powalyze
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Activez uniquement les modules dont vous avez besoin. Construisez votre cockpit sur mesure, module par module.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-semibold text-lg shadow-lg transition-all"
          >
            Demander une démo
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Modules Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ModuleCard
              icon={<BarChart3 size={32} />}
              title="Décisions"
              description="Suivez vos décisions stratégiques avec traçabilité complète, statuts et impacts."
              features={["Traçabilité complète", "Workflow d'approbation", "Historique des décisions", "Alertes automatiques"]}
              color="amber"
            />
            <ModuleCard
              icon={<Shield size={32} />}
              title="Risques"
              description="Identifiez, évaluez et mitigez vos risques projets avec matrice RAG automatique."
              features={["Matrice RAG", "Plans de mitigation", "Suivi des impacts", "Rapports automatisés"]}
              color="red"
            />
            <ModuleCard
              icon={<GitBranch size={32} />}
              title="Projets"
              description="Pilotez vos projets multi-méthodologies avec KPIs, vélocité et budgets."
              features={["Multi-méthodologies", "KPIs personnalisés", "Budgets & vélocité", "Gantt interactif"]}
              color="blue"
            />
            <ModuleCard
              icon={<FileText size={32} />}
              title="Rapports IA"
              description="Générez automatiquement des rapports narratifs exécutifs avec insights IA."
              features={["Génération auto", "Rapports COMEX", "Export PDF/DOCX", "Insights IA"]}
              color="purple"
            />
            <ModuleCard
              icon={<Users size={32} />}
              title="Ressources"
              description="Gérez votre pool de ressources, compétences et allocations projets."
              features={["Pool de ressources", "Matrice compétences", "Allocations", "Capacité planning"]}
              color="green"
            />
            <ModuleCard
              icon={<Database size={32} />}
              title="Données & PowerBI"
              description="Importez vos .pbix et visualisez vos rapports Power BI directement intégrés."
              features={["Import .pbix", "Viewer intégré", "Multi-rapports", "Tokens sécurisés"]}
              color="sky"
            />
            <ModuleCard
              icon={<Brain size={32} />}
              title="IA Chief of Staff"
              description="L'IA analyse votre portfolio et recommande 6 actions stratégiques prioritaires."
              features={["Actions prioritaires", "Analyse portfolio", "Recommandations", "Scoring confiance"]}
              color="purple"
            />
            <ModuleCard
              icon={<Workflow size={32} />}
              title="Méthodologies"
              description="Agile, Hermès, Cycle en V, Hybride. L'IA s'adapte à votre méthode de travail."
              features={["5 méthodologies", "Workflows adaptatifs", "Rituels intégrés", "Personnalisation"]}
              color="amber"
            />
            <ModuleCard
              icon={<Bell size={32} />}
              title="Anomalies & Alertes"
              description="Détection proactive des anomalies avec alertes temps réel et notifications."
              features={["Détection auto", "Alertes temps réel", "Notifications email", "Dashboard dédié"]}
              color="red"
            />
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-amber-500/10 to-sky-500/10 border-y border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Tarification modulaire et transparente</h2>
          <p className="text-xl text-slate-300 mb-8">
            Payez uniquement pour les modules activés. Pas de surprise, pas de frais cachés.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tarifs" className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-semibold text-lg transition-all">
              Voir les tarifs
            </Link>
            <Link href="/contact" className="px-8 py-4 rounded-xl border-2 border-amber-400/50 hover:border-amber-400 text-white font-semibold text-lg transition-all">
              Demander un devis
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function ModuleCard({ icon, title, description, features, color }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  color: string;
}) {
  const colors: Record<string, string> = {
    amber: "from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400",
    red: "from-red-500/20 to-red-600/10 border-red-500/30 text-red-400",
    blue: "from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400",
    purple: "from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400",
    green: "from-green-500/20 to-green-600/10 border-green-500/30 text-green-400",
    sky: "from-sky-500/20 to-sky-600/10 border-sky-500/30 text-sky-400"
  };

  return (
    <div className={`p-6 rounded-2xl bg-gradient-to-br border ${colors[color]} hover:scale-105 transition-transform`}>
      <div className="mb-4">{icon}</div>
      <h3 className="text-2xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-slate-400 mb-4">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
            <CheckCircle size={16} className={colors[color].split(' ')[2]} />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}
