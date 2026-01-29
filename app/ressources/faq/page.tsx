import { ChevronDown } from "lucide-react";
import Link from "next/link";

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white pt-24">
      {/* Hero */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Questions fréquentes
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Tout ce que vous devez savoir sur Powalyze : SaaS, méthodologies, IA, accompagnement et tarifs
          </p>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-20 px-6 border-t border-slate-800/50">
        <div className="max-w-4xl mx-auto space-y-16">
          {/* Général */}
          <FAQSection
            title="🎯 Général"
            questions={[
              {
                q: "Qu'est-ce que Powalyze exactement ?",
                a: "Powalyze est un cockpit exécutif SaaS qui combine : (1) une plateforme complète de gouvernance de portefeuilles (projets, risques, décisions, rapports), (2) une intelligence artificielle narrative qui génère des synthèses exécutives et des recommandations stratégiques, et (3) une expertise humaine (PMO senior, Data Analyst, Power BI Expert) disponible sur site ou à distance."
              },
              {
                q: "Quelle est la différence avec les autres outils de gestion de projets ?",
                a: "Powalyze n'est pas un outil de gestion de projets opérationnel (comme Jira ou Monday). C'est un cockpit EXÉCUTIF conçu pour les comités de direction, les PMO et les portfolios managers. L'IA comprend votre méthodologie (Agile, Hermès, Cycle en V) et adapte automatiquement les workflows, rapports et recommandations."
              },
              {
                q: "Est-ce que Powalyze remplace mon PMO ?",
                a: "Non, Powalyze AUGMENTE votre PMO. L'IA automatise les tâches chronophages (consolidation de données, génération de rapports, détection d'anomalies) pour libérer du temps sur les activités à haute valeur ajoutée : arbitrage, coaching, facilitation. Nous proposons également un accompagnement par un PMO senior si besoin."
              },
              {
                q: "Combien de temps prend le déploiement ?",
                a: "Pour un déploiement standard : 2-3 jours de cadrage et configuration initiale, 1 semaine de formation et paramétrage avancé, puis 3 mois d'accompagnement continu pour optimiser l'adoption et les processus. Un projet pilote peut démarrer en 48h."
              }
            ]}
          />

          {/* Méthodologies */}
          <FAQSection
            title="⚙️ Méthodologies"
            questions={[
              {
                q: "Quelles méthodologies sont supportées ?",
                a: "Agile (Scrum, Kanban, SAFe), Hermès (toutes versions), Cycle en V, Prince2, PMBOK, méthodes hybrides et même vos processus internes personnalisés. L'IA s'adapte automatiquement à la méthode choisie pour chaque projet."
              },
              {
                q: "Peut-on mélanger plusieurs méthodologies ?",
                a: "Absolument. C'est même une force de Powalyze. Vous pouvez avoir des projets en Agile, d'autres en Hermès et d'autres en Cycle en V, le tout piloté depuis un seul cockpit avec un reporting consolidé. L'IA gère automatiquement les synchronisations et les dépendances inter-projets."
              },
              {
                q: "Comment l'IA adapte-t-elle les recommandations selon la méthode ?",
                a: "L'IA analyse le contexte méthodologique de chaque projet (rituels, phases, jalons) et ajuste ses suggestions : recommandations de priorisation de backlog en Agile, alertes sur la traçabilité en Cycle en V, validation de conformité Hermès, etc."
              },
              {
                q: "Dois-je changer ma façon de travailler ?",
                a: "Non. Powalyze s'adapte à VOS processus existants. Vous pouvez configurer les workflows, les templates de rapports et les rituels selon vos besoins. L'IA apprend progressivement de vos habitudes pour mieux vous assister."
              }
            ]}
          />

          {/* IA */}
          <FAQSection
            title="🤖 Intelligence Artificielle"
            questions={[
              {
                q: "Quelle technologie d'IA utilisez-vous ?",
                a: "Nous utilisons les modèles GPT-4 et Claude (Anthropic) pour la génération de texte, combinés à des algorithmes propriétaires d'analyse prédictive pour la vélocité, les risques et les budgets. Tous les prompts sont optimisés pour le contexte de gouvernance de projets."
              },
              {
                q: "L'IA peut-elle se tromper ?",
                a: "Oui, comme toute IA. C'est pourquoi nous affichons toujours un score de confiance pour chaque recommandation et nous encourageons la validation humaine. L'IA est un copilote, pas un pilote automatique. Les décisions critiques restent entre vos mains."
              },
              {
                q: "Mes données servent-elles à entraîner l'IA ?",
                a: "Non. Vos données restent strictement confidentielles et ne sont JAMAIS utilisées pour entraîner les modèles d'IA génériques. Nous proposons même une option d'IA personnalisée entraînée uniquement sur VOS données historiques (module optionnel)."
              },
              {
                q: "L'IA fonctionne-t-elle en mode déconnecté ?",
                a: "Non, l'IA nécessite une connexion internet pour accéder aux modèles de langage. En revanche, toutes les fonctionnalités de base du cockpit (création de projets, saisie de risques, etc.) fonctionnent hors ligne avec synchronisation automatique."
              }
            ]}
          />

          {/* Sécurité & Données */}
          <FAQSection
            title="🔒 Sécurité & Données"
            questions={[
              {
                q: "Où sont hébergées mes données ?",
                a: "En Suisse, sur l'infrastructure cloud d'un provider certifié ISO 27001. Nous proposons également des options d'hébergement dédié (private cloud) ou on-premise pour les organisations avec des exigences de sécurité élevées."
              },
              {
                q: "Êtes-vous conformes GDPR ?",
                a: "Oui, Powalyze est 100% conforme au RGPD. Vous contrôlez totalement vos données : export, suppression, anonymisation. Nous avons un DPO dédié et des accords de traitement de données (DPA) disponibles sur demande."
              },
              {
                q: "Qui peut accéder à mes données ?",
                a: "Uniquement les utilisateurs que vous autorisez. L'équipe Powalyze ne peut JAMAIS accéder à vos données sans votre autorisation explicite (sauf support technique avec votre accord). Toutes les données sont chiffrées au repos et en transit (TLS 1.3, AES-256)."
              },
              {
                q: "Puis-je exporter mes données ?",
                a: "Oui, à tout moment, dans tous les formats standards : Excel, CSV, JSON, XML, PDF. Vous restez propriétaire de vos données et pouvez les récupérer en quelques clics sans contrainte ni délai."
              }
            ]}
          />

          {/* Tarifs */}
          <FAQSection
            title="💰 Tarifs & Abonnement"
            questions={[
              {
                q: "Combien coûte Powalyze ?",
                a: "Le SaaS Essentiel démarre à CHF 990/mois pour jusqu'à 10 utilisateurs. Les modules additionnels (IA personnalisée, Power BI avancé, etc.) sont disponibles à partir de CHF 500/mois. L'accompagnement expert est tarifé selon vos besoins. Contactez-nous pour un devis personnalisé."
              },
              {
                q: "Y a-t-il un engagement de durée ?",
                a: "Non. Tous nos abonnements SaaS sont sans engagement, résiliables à tout moment avec un préavis de 30 jours. Nous croyons que vous resterez parce que Powalyze vous apporte de la valeur, pas parce que vous êtes contractuellement lié."
              },
              {
                q: "Proposez-vous un essai gratuit ?",
                a: "Oui, 30 jours d'essai gratuit avec accès complet au cockpit (projets, risques, décisions, IA, rapports). Pas de carte bancaire requise. Un expert Powalyze vous accompagne dans la prise en main."
              },
              {
                q: "Les mises à jour sont-elles incluses ?",
                a: "Oui, toutes les mises à jour et nouvelles fonctionnalités sont automatiquement incluses dans votre abonnement, sans surcoût. Vous bénéficiez toujours de la dernière version de Powalyze."
              }
            ]}
          />

          {/* Support */}
          <FAQSection
            title="🎓 Support & Formation"
            questions={[
              {
                q: "Quel niveau de support est inclus ?",
                a: "Le plan Essentiel inclut le support par email (réponse sous 48h ouvrées). Les plans supérieurs bénéficient d'un support prioritaire (24h) et d'une hotline téléphonique. L'accompagnement expert inclut un support dédié 4h."
              },
              {
                q: "Proposez-vous des formations ?",
                a: "Oui, nous proposons des formations sur site ou à distance : formation utilisateurs (demi-journée), formation administrateurs (1 jour complet), formation avancée IA et Power BI (2 jours). Certaines formules incluent les formations dans le package d'accompagnement."
              },
              {
                q: "Y a-t-il une documentation complète ?",
                a: "Oui, nous mettons à disposition : documentation utilisateur en ligne (FR/EN/DE/IT), vidéos tutorielles, base de connaissances, API documentation complète pour les développeurs, et un centre de ressources avec guides et best practices."
              },
              {
                q: "Puis-je obtenir de l'aide pour la configuration initiale ?",
                a: "Absolument. Chaque nouveau client bénéficie d'une session de cadrage gratuite (2h) avec un expert Powalyze pour configurer le cockpit selon vos besoins. Des forfaits de déploiement assisté sont également disponibles."
              }
            ]}
          />
        </div>
      </section>

      {/* Still have questions */}
      <section className="py-20 px-6 bg-slate-900/30 border-t border-slate-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Vous ne trouvez pas votre réponse ?
          </h2>
          <p className="text-xl text-slate-300 mb-12">
            Notre équipe est là pour répondre à toutes vos questions spécifiques
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-lg shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all"
            >
              Nous contacter
            </Link>
            <Link
              href="/ressources/documentation"
              className="px-8 py-4 rounded-xl border-2 border-slate-800 hover:border-amber-500/50 text-white font-semibold text-lg transition-all"
            >
              Consulter la documentation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FAQSection({ title, questions }: {
  title: string;
  questions: { q: string; a: string; }[];
}) {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">{title}</h2>
      <div className="space-y-4">
        {questions.map((item, i) => (
          <details
            key={i}
            className="group p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/50 transition-all"
          >
            <summary className="flex items-start justify-between cursor-pointer list-none">
              <h3 className="text-lg font-semibold pr-4">{item.q}</h3>
              <ChevronDown className="flex-shrink-0 text-amber-400 group-open:rotate-180 transition-transform" size={24} />
            </summary>
            <p className="mt-4 text-slate-300 leading-relaxed border-t border-slate-800 pt-4">
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}
