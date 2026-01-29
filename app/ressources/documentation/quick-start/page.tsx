"use client";

import Link from "next/link";
import { ArrowRight, Download, CheckCircle, Play, BookOpen, FileText, Settings, Users } from "lucide-react";

export default function QuickStartPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Link href="/ressources/documentation" className="text-sm text-slate-400 hover:text-amber-400 transition-colors">
              ← Retour à la documentation
            </Link>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Guide de démarrage rapide
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-8">
            Tout ce dont vous avez besoin pour déployer Powalyze dans votre organisation en moins de 7 jours
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold text-lg shadow-lg transition-all">
              <Download size={20} />
              Télécharger le PDF complet (3.2 MB)
            </button>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-amber-400/50 hover:border-amber-400 text-white font-semibold text-lg transition-all"
            >
              Demander un accompagnement
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Déploiement en 7 jours</h2>
            <p className="text-xl text-slate-300">De la connexion initiale à votre premier COMEX</p>
          </div>

          <div className="space-y-6">
            <TimelineStep
              day="Jour 1"
              title="Connexion & Configuration initiale"
              description="Création compte, connexion Supabase, configuration des paramètres de base."
              duration="2 heures"
              tasks={[
                "Créer votre compte organisation Powalyze",
                "Connecter votre instance Supabase (ou créer nouvelle)",
                "Configurer OpenAI/Azure OpenAI pour l'IA",
                "Définir les paramètres généraux (langue, devise, fuseau horaire)",
              ]}
            />
            <TimelineStep
              day="Jour 2"
              title="Import des données existantes"
              description="Migration de vos données projets depuis vos outils actuels."
              duration="4 heures"
              tasks={[
                "Exporter vos projets depuis JIRA/Monday/Excel",
                "Mapper les champs (format CSV/Excel fourni)",
                "Importer vos 42 projets avec statuts RAG",
                "Importer risques et décisions historiques",
              ]}
            />
            <TimelineStep
              day="Jour 3"
              title="Configuration PMO & Méthodologies"
              description="Définition de votre gouvernance et rituels."
              duration="3 heures"
              tasks={[
                "Sélectionner vos méthodologies (Agile, Hermès, Cycle en V...)",
                "Configurer les workflows de décisions",
                "Définir les instances (COMEX, COPIL) et fréquences",
                "Personnaliser les templates de rapports",
              ]}
            />
            <TimelineStep
              day="Jour 4"
              title="Gestion des utilisateurs & Permissions"
              description="Création des comptes et droits d'accès."
              duration="2 heures"
              tasks={[
                "Créer les comptes utilisateurs (5-50 personnes)",
                "Définir les rôles (Admin, PMO, Chef projet, Viewer)",
                "Configurer Row Level Security (isolation tenant)",
                "Inviter l'équipe par email",
              ]}
            />
            <TimelineStep
              day="Jour 5"
              title="Power BI Integration (optionnel)"
              description="Connexion de vos rapports Power BI existants."
              duration="3 heures"
              tasks={[
                "Configurer Azure AD App pour Power BI Embedded",
                "Importer vos fichiers .pbix dans Powalyze",
                "Générer les tokens d'accès sécurisés",
                "Tester les rapports embarqués",
              ]}
            />
            <TimelineStep
              day="Jour 6"
              title="Formation de l'équipe"
              description="Onboarding et prise en main par les utilisateurs clés."
              duration="4 heures"
              tasks={[
                "Webinar de formation (2h) pour équipe PMO",
                "Exercices pratiques: créer projet, valider décision",
                "Configuration des alertes email personnalisées",
                "Q&A et cas d'usage spécifiques",
              ]}
            />
            <TimelineStep
              day="Jour 7"
              title="Premier COMEX avec Powalyze"
              description="Utilisation en situation réelle."
              duration="90 minutes"
              tasks={[
                "Générer le rapport IA Chief of Staff (6 actions)",
                "Présenter le dashboard exécutif en live",
                "Valider 3-5 décisions stratégiques dans l'outil",
                "Recueillir les feedbacks COMEX",
              ]}
            />
          </div>
        </div>
      </section>

      {/* Prerequisites */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Prérequis techniques</h2>
            <p className="text-xl text-slate-300">Ce dont vous avez besoin avant de commencer</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <PrerequisiteCard
              title="Environnement obligatoire"
              items={[
                "Compte Supabase (gratuit jusqu'à 500 MB)",
                "Clé API OpenAI ou Azure OpenAI (pour l'IA)",
                "Navigateur moderne (Chrome, Firefox, Edge, Safari)",
                "Connexion internet stable",
              ]}
              icon={<Settings size={32} />}
            />
            <PrerequisiteCard
              title="Données à préparer"
              items={[
                "Liste de vos projets actuels (Excel/CSV)",
                "Organigramme équipe (rôles et responsabilités)",
                "Liste des risques identifiés (optionnel)",
                "Décisions stratégiques récentes (optionnel)",
              ]}
              icon={<FileText size={32} />}
            />
            <PrerequisiteCard
              title="Power BI (optionnel)"
              items={[
                "Compte Power BI Pro ou Premium",
                "Azure AD App Registration (pour Embedded)",
                "Fichiers .pbix de vos rapports existants",
                "Droits admin sur votre workspace Power BI",
              ]}
              icon={<BookOpen size={32} />}
            />
            <PrerequisiteCard
              title="Équipe projet"
              items={[
                "1 Admin technique (config Supabase/OpenAI)",
                "1 PMO Manager (définition gouvernance)",
                "1-2 Chefs de projet (tests utilisateurs)",
                "Sponsor exécutif (validation finale)",
              ]}
              icon={<Users size={32} />}
            />
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Ressources complémentaires</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <ResourceCard
              title="Vidéo: Setup en 10 minutes"
              description="Tutoriel vidéo pour configurer votre première instance Powalyze."
              icon={<Play size={24} />}
              link="/ressources/videos/setup"
            />
            <ResourceCard
              title="Template CSV Import"
              description="Fichier Excel pré-formaté pour importer vos projets rapidement."
              icon={<Download size={24} />}
              link="/downloads/powalyze-import-template.xlsx"
            />
            <ResourceCard
              title="Checklist PDF"
              description="Checklist complète de déploiement imprimable (2 pages)."
              icon={<CheckCircle size={24} />}
              link="/downloads/powalyze-deployment-checklist.pdf"
            />
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Best practices de déploiement</h2>
          </div>

          <div className="space-y-4">
            <BestPracticeItem
              title="Commencez petit, pensez grand"
              description="Démarrez avec 10-15 projets pilotes avant de migrer les 100+ projets. Validez le workflow avec l'équipe PMO avant de déployer à l'organisation complète."
            />
            <BestPracticeItem
              title="Impliquez les sponsors dès le jour 1"
              description="Faites valider la gouvernance (instances, rituels) par le COMEX avant de configurer l'outil. Leur buy-in est critique pour l'adoption."
            />
            <BestPracticeItem
              title="Formation avant déploiement"
              description="Ne donnez jamais les accès avant d'avoir formé les utilisateurs. Un outil mal compris = abandon dans les 2 semaines."
            />
            <BestPracticeItem
              title="Itérez sur les dashboards"
              description="Vos premiers dashboards ne seront pas parfaits. Prévoyez 3 itérations sur 6 semaines en collectant les feedbacks utilisateurs."
            />
            <BestPracticeItem
              title="Préparez la conduite du changement"
              description="Powalyze remplace Excel: certains résisteront. Identifiez 3-5 champions internes pour évangéliser l'adoption."
            />
          </div>
        </div>
      </section>

      {/* Support CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Besoin d'aide pour démarrer ?</h2>
          <p className="text-xl text-slate-300 mb-8">
            Notre équipe peut vous accompagner pendant les 7 jours de déploiement
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-10 py-5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xl shadow-lg transition-all"
            >
              Réserver un accompagnement
              <ArrowRight size={24} />
            </Link>
            <Link
              href="/demo-interactive"
              className="inline-flex items-center gap-2 px-10 py-5 rounded-xl border-2 border-amber-400/50 hover:border-amber-400 text-white font-bold text-xl transition-all"
            >
              Tester la démo d'abord
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function TimelineStep({ day, title, description, duration, tasks }: {
  day: string;
  title: string;
  description: string;
  duration: string;
  tasks: string[];
}) {
  return (
    <div className="flex gap-6 items-start p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/50 transition-all">
      <div className="flex-shrink-0">
        <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-500/30 flex items-center justify-center">
          <span className="text-amber-400 font-bold text-sm">{day}</span>
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-2xl font-bold">{title}</h3>
          <span className="text-sm text-slate-400 px-3 py-1 rounded-lg bg-slate-800">{duration}</span>
        </div>
        <p className="text-slate-300 mb-4">{description}</p>
        <ul className="space-y-2">
          {tasks.map((task, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-slate-400">
              <CheckCircle size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
              <span>{task}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PrerequisiteCard({ title, items, icon }: {
  title: string;
  items: string[];
  icon: React.ReactNode;
}) {
  return (
    <div className="p-8 rounded-xl bg-slate-900/50 border border-slate-800">
      <div className="text-amber-400 mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
            <CheckCircle size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ResourceCard({ title, description, icon, link }: {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}) {
  return (
    <Link href={link}>
      <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/50 transition-all hover:scale-105">
        <div className="text-amber-400 mb-3">{icon}</div>
        <h4 className="text-lg font-bold mb-2">{title}</h4>
        <p className="text-sm text-slate-400">{description}</p>
        <div className="mt-4 flex items-center gap-2 text-amber-400 text-sm font-semibold">
          <span>Accéder</span>
          <ArrowRight size={16} />
        </div>
      </div>
    </Link>
  );
}

function BestPracticeItem({ title, description }: {
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-amber-500/50 transition-all">
      <div className="flex items-start gap-4">
        <CheckCircle size={24} className="text-emerald-400 mt-1 flex-shrink-0" />
        <div>
          <h4 className="text-lg font-bold mb-2">{title}</h4>
          <p className="text-sm text-slate-400">{description}</p>
        </div>
      </div>
    </div>
  );
}
