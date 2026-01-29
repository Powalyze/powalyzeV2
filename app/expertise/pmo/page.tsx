"use client";

import Link from "next/link";
import { ArrowRight, Target, TrendingUp, Users, BarChart3, CheckCircle, Zap } from "lucide-react";
import Image from "next/image";

export default function ExpertisePMOPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Hero Section */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=2000&q=80"
            alt="PMO Expertise"
            fill
            className="object-cover opacity-20 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/80 to-slate-950" />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-sm font-semibold mb-6">
            <Target size={16} />
            <span>Expertise PMO</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            PMO & Portfolio<br />Management
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            15 ans d'expérience en gouvernance de portefeuilles complexes.<br className="hidden md:block" />
            De la startup au groupe coté: nous structurons votre PMO.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold text-lg shadow-lg transition-all"
          >
            Parler à un expert PMO
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Nos services PMO</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Une approche sur-mesure adaptée à la maturité de votre organisation
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <ServiceCard
              title="Mise en place PMO"
              description="Structuration complète de votre bureau de gestion de projets: processus, outils, gouvernance, rituels."
              features={[
                "Audit de maturité PMO",
                "Définition des processus et KPIs",
                "Choix et déploiement des outils",
                "Formation des équipes",
                "Mise en place rituels (COMEX, COPIL)",
              ]}
              duration="3-6 mois"
            />
            <ServiceCard
              title="PMO as a Service"
              description="Nous prenons en charge l'opérationnel de votre PMO: reporting, pilotage, animation COMEX."
              features={[
                "Pilotage quotidien du portefeuille",
                "Reporting exécutif hebdomadaire",
                "Animation COMEX/COPIL",
                "Suivi budgets et ressources",
                "Escalade risques et décisions",
              ]}
              duration="Mission longue"
            />
            <ServiceCard
              title="Transformation PMO"
              description="Modernisation de votre PMO existant: digitalisation, méthodologies agiles, IA."
              features={[
                "Migration vers outils modernes",
                "Intégration méthodologies hybrides",
                "Automatisation reporting (IA)",
                "Amélioration continue des processus",
                "Change management",
              ]}
              duration="4-8 mois"
            />
            <ServiceCard
              title="Coaching PMO"
              description="Accompagnement de vos équipes PMO: montée en compétence, certifications, best practices."
              features={[
                "Coaching individuel PMO Manager",
                "Formation équipe PMO",
                "Revue processus et amélioration",
                "Préparation certifications (PMP, Prince2)",
                "Shadowing et mentoring",
              ]}
              duration="3-12 mois"
            />
          </div>
        </div>
      </section>

      {/* Methodologies */}
      <section className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Nos méthodologies</h2>
            <p className="text-xl text-slate-300">Nous maîtrisons toutes les approches de gestion de projets</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <MethodologyCard
              name="Agile / Scrum"
              description="Pour les projets IT, produits digitaux et innovation: sprints, user stories, rétrospectives."
              icon="🚀"
            />
            <MethodologyCard
              name="Cycle en V / Waterfall"
              description="Pour les projets infrastructure, industriels et réglementaires: phases séquentielles, jalons stricts."
              icon="📐"
            />
            <MethodologyCard
              name="Hermès / Prince2"
              description="Pour le secteur public et grandes organisations: gouvernance formelle, livrables normés."
              icon="🏛️"
            />
            <MethodologyCard
              name="Lean / Kanban"
              description="Pour l'optimisation continue et les projets à flux: visualisation, WIP, amélioration continue."
              icon="📊"
            />
            <MethodologyCard
              name="Hybride"
              description="Mix agile/traditionnel adapté à votre contexte: agilité sur le delivery, gouvernance structurée."
              icon="🔄"
            />
            <MethodologyCard
              name="SAFe / LeSS"
              description="Pour les transformations agiles à l'échelle: 50+ personnes, plusieurs équipes, multiple trains."
              icon="🌐"
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <StatCard number="150+" label="Projets pilotés" />
            <StatCard number="12M€+" label="Budgets gérés" />
            <StatCard number="25+" label="PMO déployés" />
            <StatCard number="87%" label="Taux de succès" />
          </div>
        </div>
      </section>

      {/* Case Study */}
      <section className="py-20 px-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-y border-slate-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Cas client</h2>
            <p className="text-xl text-slate-300">Transformation PMO chez un industriel suisse</p>
          </div>

          <div className="bg-slate-900/80 rounded-2xl border border-amber-500/30 p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-4">Contexte</h3>
                <p className="text-slate-300 mb-4">
                  Industriel 2000+ employés avec 45 projets IT/OT en parallèle, aucun PMO structuré, 
                  reporting manuel Excel, visibilité COMEX limitée.
                </p>
                <h3 className="text-2xl font-bold mb-4 mt-6">Problématiques</h3>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="text-red-400 mt-1 flex-shrink-0" />
                    <span>60% projets en retard, causes inconnues</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="text-red-400 mt-1 flex-shrink-0" />
                    <span>Dépassements budget récurrents (+25%)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="text-red-400 mt-1 flex-shrink-0" />
                    <span>Aucune priorisation formalisée</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="text-red-400 mt-1 flex-shrink-0" />
                    <span>Reporting COMEX préparé en 2 jours</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">Solution Powalyze</h3>
                <p className="text-slate-300 mb-4">
                  Déploiement PMO complet en 5 mois: définition processus, formation équipe PMO (4 personnes), 
                  mise en place Powalyze, automatisation reporting.
                </p>
                <h3 className="text-2xl font-bold mb-4 mt-6">Résultats (12 mois)</h3>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="text-emerald-400 mt-1 flex-shrink-0" />
                    <span><strong className="text-emerald-400">78%</strong> projets livrés à temps</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="text-emerald-400 mt-1 flex-shrink-0" />
                    <span><strong className="text-emerald-400">-40%</strong> dépassements budget</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="text-emerald-400 mt-1 flex-shrink-0" />
                    <span>Reporting COMEX en <strong className="text-emerald-400">15 minutes</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="text-emerald-400 mt-1 flex-shrink-0" />
                    <span>ROI PMO: <strong className="text-emerald-400">3.5x</strong> la première année</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">L'équipe PMO</h2>
            <p className="text-xl text-slate-300">Experts certifiés et opérationnels</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <TeamMemberCard
              name="Philippe Moreau"
              role="Senior PMO Manager"
              certifications={["PMP", "Prince2 Practitioner", "SAFe"]}
              experience="15 ans • 80+ projets"
            />
            <TeamMemberCard
              name="Sarah Dubois"
              role="Agile PMO Coach"
              certifications={["PSM III", "SAFe SPC", "Scrum@Scale"]}
              experience="12 ans • Transformations agiles"
            />
            <TeamMemberCard
              name="Marc Lefebvre"
              role="PMO Architect"
              certifications={["PgMP", "MoP", "MSP"]}
              experience="18 ans • Grandes organisations"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Prêt à structurer votre PMO ?</h2>
          <p className="text-xl text-slate-300 mb-8">
            Audit gratuit de maturité PMO (1h) pour identifier vos axes d'amélioration
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-10 py-5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xl shadow-lg transition-all"
          >
            Réserver mon audit gratuit
            <ArrowRight size={24} />
          </Link>
        </div>
      </section>
    </div>
  );
}

function ServiceCard({ title, description, features, duration }: {
  title: string;
  description: string;
  features: string[];
  duration: string;
}) {
  return (
    <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/50 transition-all">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-2xl font-bold">{title}</h3>
        <span className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-semibold">{duration}</span>
      </div>
      <p className="text-slate-300 mb-6">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm text-slate-400">
            <CheckCircle size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MethodologyCard({ name, description, icon }: {
  name: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/50 transition-all">
      <div className="text-4xl mb-3">{icon}</div>
      <h4 className="text-xl font-bold mb-2">{name}</h4>
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
      <div className="text-5xl font-bold text-amber-400 mb-2">{number}</div>
      <div className="text-slate-400">{label}</div>
    </div>
  );
}

function TeamMemberCard({ name, role, certifications, experience }: {
  name: string;
  role: string;
  certifications: string[];
  experience: string;
}) {
  return (
    <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/50 transition-all">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
        {name.split(' ').map(n => n[0]).join('')}
      </div>
      <h4 className="text-xl font-bold text-center mb-1">{name}</h4>
      <p className="text-sm text-amber-400 text-center mb-3">{role}</p>
      <div className="flex flex-wrap gap-2 justify-center mb-3">
        {certifications.map((cert, idx) => (
          <span key={idx} className="px-2 py-1 rounded bg-amber-500/20 text-amber-300 text-xs font-semibold">
            {cert}
          </span>
        ))}
      </div>
      <p className="text-xs text-slate-400 text-center">{experience}</p>
    </div>
  );
}
