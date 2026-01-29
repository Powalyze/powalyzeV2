import Link from "next/link";
import { CheckCircle, ArrowRight, Users, BarChart3, Shield, TrendingUp } from "lucide-react";

export default function ExpertisePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white pt-24">
      {/* Hero */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Un outil puissant.<br />Un expert pour le déployer.
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Ne restez pas seul face à la transformation. Nos experts PMO, Data et Power BI vous accompagnent sur site ou à distance.
          </p>
        </div>
      </section>

      {/* Expertise Cards */}
      <section className="py-20 px-6 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <ExpertiseCard
              icon={<Users size={40} />}
              title="PMO Senior"
              description="Un Project Management Officer expérimenté pour structurer, piloter et optimiser vos programmes complexes."
              services={[
                "Cadrage et pilotage de programmes complexes",
                "Mise en place de la gouvernance",
                "Animation des comités de direction",
                "Escalade et arbitrage des décisions",
                "Reporting exécutif et tableaux de bord",
                "Gestion des risques et des dépendances"
              ]}
              href="/contact"
            />

            <ExpertiseCard
              icon={<BarChart3 size={40} />}
              title="Data & Power BI"
              description="Un expert data pour architecturer vos flux de données et créer des dashboards exécutifs sur mesure."
              services={[
                "Architecture des flux de données",
                "Dashboards exécutifs Power BI",
                "Connecteurs et intégrations",
                "Modélisation des données",
                "Formation et transfert de compétences",
                "Optimisation des performances"
              ]}
              href="/contact"
            />

            <ExpertiseCard
              icon={<Shield size={40} />}
              title="Gouvernance & Transformation"
              description="Un consultant pour auditer vos processus et designer votre gouvernance cible."
              services={[
                "Audit des processus existants",
                "Design de la gouvernance cible",
                "Conduite du changement",
                "Alignement stratégique",
                "Définition des rôles et responsabilités",
                "Mise en place des rituels"
              ]}
              href="/contact"
            />

            <ExpertiseCard
              icon={<TrendingUp size={40} />}
              title="Coaching & Copilotage"
              description="Un coach pour accompagner vos équipes au quotidien et optimiser continuellement vos pratiques."
              services={[
                "Accompagnement des équipes sur site",
                "Mentorat des PMO internes",
                "Revue mensuelle des performances",
                "Optimisation continue des processus",
                "Formation avancée aux outils",
                "Support décisionnel stratégique"
              ]}
              href="/contact"
            />
          </div>
        </div>
      </section>

      {/* Modes d'intervention */}
      <section className="py-20 px-6 bg-slate-900/30 border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Modes d'intervention</h2>
            <p className="text-xl text-slate-300">
              Choisissez la formule qui correspond le mieux à vos contraintes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <InterventionCard
              title="Sur site"
              description="Présence physique dans vos locaux pour une immersion complète dans votre contexte."
              ideal="Idéal pour les phases de cadrage, les ateliers et les périodes critiques."
            />
            <InterventionCard
              title="À distance"
              description="Accompagnement en visioconférence, flexible et efficace pour le suivi continu."
              ideal="Idéal pour le coaching régulier, les revues et le support opérationnel."
            />
            <InterventionCard
              title="Hybride"
              description="Combinaison de présence sur site et de suivi à distance selon les besoins."
              ideal="Idéal pour optimiser les coûts tout en maintenant la proximité nécessaire."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-slate-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Discutons de vos enjeux
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Chaque organisation est unique. Parlons de votre contexte pour définir l'accompagnement le plus adapté.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-10 py-5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-lg shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all"
          >
            Prendre rendez-vous avec un expert
            <ArrowRight size={22} />
          </Link>
        </div>
      </section>
    </div>
  );
}

function ExpertiseCard({ icon, title, description, services, href }: { icon: React.ReactNode; title: string; description: string; services: string[]; href: string }) {
  return (
    <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/50 transition-all group">
      <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/20 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-slate-400 mb-6">{description}</p>
      <ul className="space-y-2 mb-6">
        {services.map((service, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
            <CheckCircle className="text-amber-400 flex-shrink-0 mt-0.5" size={16} />
            {service}
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-semibold group-hover:gap-3 transition-all"
      >
        Demander un accompagnement
        <ArrowRight size={18} />
      </Link>
    </div>
  );
}

function InterventionCard({ title, description, ideal }: { title: string; description: string; ideal: string }) {
  return (
    <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-300 mb-4 text-sm">{description}</p>
      <p className="text-xs text-slate-500 italic">{ideal}</p>
    </div>
  );
}

