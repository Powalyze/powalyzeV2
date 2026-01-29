"use client";

import Link from "next/link";
import { ArrowRight, Database, TrendingUp, BarChart3, CheckCircle, Zap, LineChart } from "lucide-react";
import Image from "next/image";

export default function ExpertiseDataPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Hero Section */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=2000&q=80"
            alt="Data Analytics"
            fill
            className="object-cover opacity-20 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/80 to-slate-950" />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/20 border border-sky-500/30 text-sky-300 text-sm font-semibold mb-6">
            <Database size={16} />
            <span>Expertise Data & Analytics</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Data, Analytics<br />& Power BI
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Transformez vos données projets en insights actionnables.<br className="hidden md:block" />
            Du lac de données au dashboard exécutif.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white font-semibold text-lg shadow-lg transition-all"
          >
            Parler à un expert Data
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Nos services Data</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              De la stratégie data à l'implémentation: une approche end-to-end
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <ServiceCard
              title="Architecture Data Portfolio"
              description="Conception d'un data lake centralisé pour agréger vos données projets, risques, ressources et financières."
              features={[
                "Audit sources de données existantes",
                "Design data model (star schema)",
                "ETL/ELT pipelines (Azure Data Factory, Airflow)",
                "Data quality & governance",
                "Sécurité et accès (RBAC, RLS)",
              ]}
              icon={<Database size={32} />}
            />
            <ServiceCard
              title="Dashboards Power BI"
              description="Création de dashboards exécutifs sur-mesure pour piloter votre portefeuille en temps réel."
              features={[
                "Ateliers besoins métier",
                "Design UX/UI dashboards",
                "DAX avancé (mesures, time intelligence)",
                "Row Level Security (RLS)",
                "Déploiement et formation",
              ]}
              icon={<BarChart3 size={32} />}
            />
            <ServiceCard
              title="Intégration Powalyze ↔ Power BI"
              description="Connectez Powalyze à vos rapports Power BI existants: import, visualisation, partage."
              features={[
                "Import fichiers .pbix dans Powalyze",
                "Viewer Power BI embarqué",
                "Tokens sécurisés pour partage",
                "Synchronisation données Powalyze → Power BI",
                "Automation refresh (API Power BI)",
              ]}
              icon={<Zap size={32} />}
            />
            <ServiceCard
              title="Analyse Prédictive & IA"
              description="Exploitez vos données historiques pour prédire les risques projets et optimiser les décisions."
              features={[
                "Modèles prédictifs (risque retard, budget)",
                "Anomaly detection (alertes automatiques)",
                "Sentiment analysis (commentaires projets)",
                "Recommendations engine",
                "MLOps pipelines (Azure ML, Python)",
              ]}
              icon={<TrendingUp size={32} />}
            />
          </div>
        </div>
      </section>

      {/* Power BI Expertise */}
      <section className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Expertise Power BI avancée</h2>
            <p className="text-xl text-slate-300">Certifiés Microsoft, expérience terrain</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ExpertiseCard
              title="DAX Expert"
              description="Mesures complexes, time intelligence, filtres avancés, optimisation performances."
              level="Expert"
            />
            <ExpertiseCard
              title="Data Modeling"
              description="Star schema, snowflake, tables de faits et dimensions, relations complexes."
              level="Expert"
            />
            <ExpertiseCard
              title="Power Query (M)"
              description="Transformations avancées, paramétrage, performance tuning, fonctions custom."
              level="Expert"
            />
            <ExpertiseCard
              title="Row Level Security"
              description="RLS dynamique, rôles, SSO Azure AD, sécurité tenant multi-organisationnel."
              level="Expert"
            />
            <ExpertiseCard
              title="Embedded Analytics"
              description="Power BI Embedded, iframes sécurisés, tokens, automation API, white-labeling."
              level="Expert"
            />
            <ExpertiseCard
              title="Power BI Service"
              description="Workspaces, capacities, gateways, incremental refresh, deployment pipelines."
              level="Expert"
            />
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Stack technologique</h2>
            <p className="text-xl text-slate-300">Les technologies que nous maîtrisons</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <TechCard name="Power BI" category="Visualization" />
            <TechCard name="Azure Synapse" category="Data Warehouse" />
            <TechCard name="Azure Data Factory" category="ETL/ELT" />
            <TechCard name="Python / Pandas" category="Data Science" />
            <TechCard name="SQL Server" category="Database" />
            <TechCard name="PostgreSQL" category="Database" />
            <TechCard name="Databricks" category="Big Data" />
            <TechCard name="Azure ML" category="Machine Learning" />
            <TechCard name="Tableau" category="Visualization" />
            <TechCard name="Qlik Sense" category="Visualization" />
            <TechCard name="Apache Airflow" category="Orchestration" />
            <TechCard name="dbt" category="Transformation" />
          </div>
        </div>
      </section>

      {/* Case Study */}
      <section className="py-20 px-6 bg-gradient-to-r from-sky-500/10 to-blue-500/10 border-y border-slate-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Cas client</h2>
            <p className="text-xl text-slate-300">Data Platform pour PMO bancaire</p>
          </div>

          <div className="bg-slate-900/80 rounded-2xl border border-sky-500/30 p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-4">Contexte</h3>
                <p className="text-slate-300 mb-4">
                  PMO bancaire pilotant 120+ projets réglementaires avec données éparpillées dans 8 outils 
                  (JIRA, Monday, Excel, SharePoint). Reporting manuel pénible, aucune vue consolidée.
                </p>
                <h3 className="text-2xl font-bold mb-4 mt-6">Challenge</h3>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="text-red-400 mt-1 flex-shrink-0" />
                    <span>3 jours pour préparer le COMEX mensuel</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="text-red-400 mt-1 flex-shrink-0" />
                    <span>Données non fiables (double saisie)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="text-red-400 mt-1 flex-shrink-0" />
                    <span>Aucune analyse historique possible</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="text-red-400 mt-1 flex-shrink-0" />
                    <span>Silos de données entre départements</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">Solution Powalyze</h3>
                <p className="text-slate-300 mb-4">
                  Data Platform complète: Azure Synapse + ETL automatisés + 12 dashboards Power BI + 
                  intégration Powalyze. Livraison en 4 mois.
                </p>
                <h3 className="text-2xl font-bold mb-4 mt-6">Résultats</h3>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="text-emerald-400 mt-1 flex-shrink-0" />
                    <span>COMEX préparé en <strong className="text-emerald-400">30 minutes</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="text-emerald-400 mt-1 flex-shrink-0" />
                    <span><strong className="text-emerald-400">100%</strong> fiabilité des données (source unique)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="text-emerald-400 mt-1 flex-shrink-0" />
                    <span>3 ans d'historique analysables</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="text-emerald-400 mt-1 flex-shrink-0" />
                    <span><strong className="text-emerald-400">-85%</strong> temps reporting</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-800">
              <p className="text-slate-300 italic">
                "Nous avons enfin une vue consolidée temps réel de nos 120 projets. Les dashboards Power BI 
                ont transformé nos COMEX: de 3h de présentation PowerPoint à 45 minutes interactives."
              </p>
              <p className="text-sm text-sky-400 mt-2">— Directeur PMO, Banque Privée Suisse</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <StatCard number="50+" label="Data platforms livrées" />
            <StatCard number="200+" label="Dashboards créés" />
            <StatCard number="5TB+" label="Données traitées" />
            <StatCard number="92%" label="Satisfaction client" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Prêt à valoriser vos données ?</h2>
          <p className="text-xl text-slate-300 mb-8">
            Audit data gratuit (1h) pour identifier vos quick wins
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-10 py-5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white font-bold text-xl shadow-lg transition-all"
          >
            Réserver mon audit data
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
    <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-sky-500/50 transition-all">
      <div className="text-sky-400 mb-4">{icon}</div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-slate-300 mb-6">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm text-slate-400">
            <CheckCircle size={16} className="text-sky-400 mt-0.5 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ExpertiseCard({ title, description, level }: {
  title: string;
  description: string;
  level: string;
}) {
  return (
    <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-sky-500/50 transition-all">
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-xl font-bold">{title}</h4>
        <span className="px-2 py-1 rounded bg-sky-500/20 text-sky-300 text-xs font-semibold">{level}</span>
      </div>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  );
}

function TechCard({ name, category }: {
  name: string;
  category: string;
}) {
  return (
    <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-sky-500/50 transition-all text-center">
      <div className="text-lg font-bold mb-1">{name}</div>
      <div className="text-xs text-slate-500">{category}</div>
    </div>
  );
}

function StatCard({ number, label }: {
  number: string;
  label: string;
}) {
  return (
    <div className="text-center">
      <div className="text-5xl font-bold text-sky-400 mb-2">{number}</div>
      <div className="text-slate-400">{label}</div>
    </div>
  );
}
