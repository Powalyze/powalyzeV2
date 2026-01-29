import Link from "next/link";
import { ArrowRight, Building2, TrendingUp, Users, CheckCircle } from "lucide-react";

export default function CasClientsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white pt-24">
      {/* Hero */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Cas clients
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Découvrez comment nos clients transforment leur gouvernance avec Powalyze
          </p>
        </div>
      </section>

      {/* Featured Case Study */}
      <section className="py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="p-12 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30">
            <div className="inline-block px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-sm font-semibold mb-6">
              📊 Cas phare
            </div>
            <h2 className="text-4xl font-bold mb-6">
              Groupe bancaire suisse : -40% de temps en comités
            </h2>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Un groupe bancaire de 5000 collaborateurs réussit sa transformation digitale en centralisant la gouvernance de 42 projets stratégiques dans Powalyze. Découvrez comment l'IA narrative a révolutionné leurs comités de direction.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 rounded-xl bg-slate-900/50 border border-blue-500/30">
                <div className="text-4xl font-bold text-blue-400 mb-2">-40%</div>
                <div className="text-slate-400">Temps passé en comités</div>
              </div>
              <div className="p-6 rounded-xl bg-slate-900/50 border border-blue-500/30">
                <div className="text-4xl font-bold text-blue-400 mb-2">42</div>
                <div className="text-slate-400">Projets centralisés</div>
              </div>
              <div className="p-6 rounded-xl bg-slate-900/50 border border-blue-500/30">
                <div className="text-4xl font-bold text-blue-400 mb-2">95%</div>
                <div className="text-slate-400">Satisfaction des PMO</div>
              </div>
            </div>
            <Link
              href="/ressources/cas-clients/banque-suisse"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 font-semibold transition-all"
            >
              Lire le cas complet
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Tous nos cas clients</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <CaseStudyCard
              icon={<Building2 className="text-purple-400" size={32} />}
              industry="Assurance"
              title="Transformation Agile à l'échelle"
              description="Migration de 8 équipes vers l'Agile avec maintien de la gouvernance Hermès pour la conformité réglementaire."
              results={[
                "Time-to-market réduit de 50%",
                "Conformité FINMA garantie",
                "220 utilisateurs formés"
              ]}
              href="/ressources/cas-clients/assurance-agile"
            />

            <CaseStudyCard
              icon={<Users className="text-emerald-400" size={32} />}
              industry="Administration publique"
              title="Gouvernance centralisée de 60 projets"
              description="Déploiement d'un PMO central pilotant 60 projets répartis sur 12 départements avec méthodologie Hermès."
              results={[
                "Visibilité temps réel pour le COMEX",
                "Économies de CHF 2.1M identifiées",
                "Cycles de décision 3x plus rapides"
              ]}
              href="/ressources/cas-clients/admin-publique"
            />

            <CaseStudyCard
              icon={<TrendingUp className="text-amber-400" size={32} />}
              industry="Industrie pharmaceutique"
              title="Portfolio management avec compliance 21 CFR Part 11"
              description="Gestion de portefeuille R&D avec traçabilité complète pour validation FDA et certification qualité."
              results={[
                "Conformité 21 CFR Part 11 validée",
                "Audit trail automatique complet",
                "Réduction de 60% des non-conformités"
              ]}
              href="/ressources/cas-clients/pharma"
            />

            <CaseStudyCard
              icon={<Building2 className="text-blue-400" size={32} />}
              industry="Télécommunications"
              title="Transformation cloud avec Power BI intégré"
              description="Migration de l'infrastructure vers Azure avec dashboards exécutifs Power BI générés automatiquement."
              results={[
                "500+ dashboards Power BI déployés",
                "Décisions data-driven +70%",
                "Adoption utilisateurs 92%"
              ]}
              href="/ressources/cas-clients/telecom"
            />

            <CaseStudyCard
              icon={<Users className="text-red-400" size={32} />}
              industry="Retail"
              title="Programme omnicanal piloté par l'IA"
              description="Transformation digitale de 150 points de vente avec prédictions IA sur les risques de retard."
              results={[
                "98% des projets livrés à l'heure",
                "Détection précoce de 23 risques majeurs",
                "ROI de 340% sur 18 mois"
              ]}
              href="/ressources/cas-clients/retail"
            />

            <CaseStudyCard
              icon={<TrendingUp className="text-purple-400" size={32} />}
              industry="Énergie"
              title="Transition énergétique : 15 projets interdépendants"
              description="Pilotage d'un méga-programme de transition énergétique avec gestion avancée des dépendances."
              results={[
                "15 projets synchronisés en temps réel",
                "Budget global maîtrisé à ±2%",
                "Jalons respectés à 96%"
              ]}
              href="/ressources/cas-clients/energie"
            />
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-20 px-6 bg-slate-900/30 border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Secteurs d'activité</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Finance & Banque", count: 12 },
              { name: "Assurance", count: 8 },
              { name: "Administration publique", count: 15 },
              { name: "Pharmaceutique", count: 6 },
              { name: "Télécoms", count: 5 },
              { name: "Énergie", count: 7 },
              { name: "Retail", count: 9 },
              { name: "Industrie", count: 11 },
              { name: "Transport", count: 4 }
            ].map((sector) => (
              <div
                key={sector.name}
                className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 text-center"
              >
                <div className="font-semibold text-lg mb-2">{sector.name}</div>
                <div className="text-sm text-slate-400">{sector.count} cas clients</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-slate-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Écrivons ensemble votre success story
          </h2>
          <p className="text-xl text-slate-300 mb-12">
            Que vous gériez 5 ou 500 projets, nous avons l'expertise et les outils pour transformer votre gouvernance.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-10 py-5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-lg shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all"
          >
            Parler à un expert
            <ArrowRight size={22} />
          </Link>
        </div>
      </section>
    </div>
  );
}

function CaseStudyCard({ icon, industry, title, description, results, href }: {
  icon: React.ReactNode;
  industry: string;
  title: string;
  description: string;
  results: string[];
  href: string;
}) {
  return (
    <Link
      href={href}
      className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/50 transition-all group"
    >
      <div className="mb-6">{icon}</div>
      <div className="inline-block px-3 py-1 rounded-full bg-slate-800 text-xs text-slate-400 mb-4">
        {industry}
      </div>
      <h3 className="text-2xl font-bold mb-4 group-hover:text-amber-400 transition-colors">
        {title}
      </h3>
      <p className="text-slate-400 mb-6 leading-relaxed">
        {description}
      </p>
      <div className="space-y-2 mb-6">
        <div className="text-sm font-semibold text-slate-500 uppercase">Résultats clés</div>
        {results.map((result, i) => (
          <div key={i} className="flex items-start gap-2 text-sm text-slate-300">
            <CheckCircle className="text-emerald-400 flex-shrink-0 mt-0.5" size={16} />
            <span>{result}</span>
          </div>
        ))}
      </div>
      <div className="inline-flex items-center gap-2 text-amber-400 font-semibold group-hover:gap-3 transition-all">
        Lire le cas complet
        <ArrowRight size={18} />
      </div>
    </Link>
  );
}
