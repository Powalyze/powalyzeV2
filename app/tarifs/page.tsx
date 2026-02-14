import Link from "next/link";
import { CheckCircle, ArrowRight, Sparkles } from "lucide-react";

export default function TarifsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white pt-24">
      {/* Hero */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Une plateforme évolutive,<br />des tarifs sur mesure.
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Mode DEMO gratuit illimité ou mode PRO avec accompagnement. Découvrez nos offres après inscription.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <PricingCard
              title="Mode DEMO"
              price="Gratuit"
              period="pour toujours"
              description="Explorez toutes les fonctionnalités avec des données de démonstration."
              features={[
                "Accès complet à la plateforme",
                "Toutes les fonctionnalités débloquées",
                "Données de démonstration réalistes",
                "Idéal pour tester et évaluer",
                "Aucune carte bancaire requise",
                "Sans limite de temps",
                "Mode bac à sable illimité",
                "Parfait pour POC et démos"
              ]}
              cta="Démarrer gratuitement"
              href="/signup"
            />

            <PricingCard
              title="Mode PRO Starter"
              price="Nous contacter"
              period="/ personne / mois"
              description="Pour les équipes qui veulent démarrer avec leurs vraies données."
              features={[
                "Tout du mode DEMO",
                "Vos données réelles en production",
                "Connexion Supabase incluse",
                "IA stratégique personnalisée",
                "Jusqu'à 10 utilisateurs",
                "Support email (48h)",
                "Sauvegardes automatiques",
                "Hébergement sécurisé"
              ]}
              cta="S'inscrire pour voir les tarifs"
              href="/signup"
            />

            <PricingCard
              title="Mode HYBRIDE"
              price="Tarif personnalisé"
              period="selon vos besoins"
              description="Combinez plateforme, modules avancés et expertise humaine."
              features={[
                "Tout du plan PRO",
                "Modules additionnels à la carte",
                "Accompagnement PMO expert",
                "Power BI sur mesure",
                "Utilisateurs illimités",
                "Formation des équipes",
                "Support prioritaire (4h)",
                "Consulting + SaaS intégré"
              ]}
              cta="S'inscrire pour un devis"
              href="/signup"
              highlighted
            />
          </div>

          {/* Bande informative */}
          <div className="mt-12 p-6 rounded-xl bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-500/30 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="text-amber-400" size={24} />
              <p className="text-xl font-bold text-white">
                Tarifs détaillés disponibles après inscription
              </p>
            </div>
            <p className="text-slate-300">
              Inscrivez-vous gratuitement pour découvrir nos tarifs adaptés à la taille de votre équipe et vos besoins spécifiques.
            </p>
          </div>
        </div>
      </section>

      {/* Avantages du mode HYBRIDE */}
      <section className="py-20 px-6 bg-slate-900/30 border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Pourquoi choisir le mode HYBRIDE ?</h2>
            <p className="text-xl text-slate-300">
              Le meilleur des deux mondes : technologie et expertise humaine
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-xl bg-slate-800/50 border border-slate-700">
              <h3 className="text-2xl font-bold mb-4 text-amber-400">🚀 Plateforme SaaS</h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-400 flex-shrink-0 mt-1" size={20} />
                  <span>Cockpit exécutif en temps réel 24/7</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-400 flex-shrink-0 mt-1" size={20} />
                  <span>IA pour prédictions et recommandations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-400 flex-shrink-0 mt-1" size={20} />
                  <span>Automatisations et workflows intelligents</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-400 flex-shrink-0 mt-1" size={20} />
                  <span>Intégrations Jira, Slack, Azure DevOps...</span>
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-xl bg-slate-800/50 border border-slate-700">
              <h3 className="text-2xl font-bold mb-4 text-purple-400">👥 Expertise Humaine</h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-400 flex-shrink-0 mt-1" size={20} />
                  <span>PMO senior pour cadrage et pilotage</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-400 flex-shrink-0 mt-1" size={20} />
                  <span>Expert Data & Power BI pour dashboards</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-400 flex-shrink-0 mt-1" size={20} />
                  <span>Formation et coaching continu des équipes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-400 flex-shrink-0 mt-1" size={20} />
                  <span>Accompagnement gouvernance et transformation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Comparaison des modes */}
      <section className="py-20 px-6 border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Comparez nos modes</h2>
            <p className="text-xl text-slate-300">
              Choisissez le mode adapté à votre maturité PMO
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left p-4 text-slate-400">Fonctionnalité</th>
                  <th className="text-center p-4">Mode DEMO</th>
                  <th className="text-center p-4">Mode PRO</th>
                  <th className="text-center p-4 bg-amber-500/10">Mode HYBRIDE</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                <tr className="border-b border-slate-800">
                  <td className="p-4">Accès à la plateforme</td>
                  <td className="text-center p-4">✅</td>
                  <td className="text-center p-4">✅</td>
                  <td className="text-center p-4 bg-amber-500/5">✅</td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="p-4">Vos données en production</td>
                  <td className="text-center p-4">❌</td>
                  <td className="text-center p-4">✅</td>
                  <td className="text-center p-4 bg-amber-500/5">✅</td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="p-4">IA personnalisée</td>
                  <td className="text-center p-4">❌</td>
                  <td className="text-center p-4">✅</td>
                  <td className="text-center p-4 bg-amber-500/5">✅</td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="p-4">Modules additionnels</td>
                  <td className="text-center p-4">❌</td>
                  <td className="text-center p-4">💰</td>
                  <td className="text-center p-4 bg-amber-500/5">✅</td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="p-4">Accompagnement PMO</td>
                  <td className="text-center p-4">❌</td>
                  <td className="text-center p-4">❌</td>
                  <td className="text-center p-4 bg-amber-500/5">✅</td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="p-4">Formation équipes</td>
                  <td className="text-center p-4">❌</td>
                  <td className="text-center p-4">2h</td>
                  <td className="text-center p-4 bg-amber-500/5">Illimitée</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold">Tarif par personne/mois</td>
                  <td className="text-center p-4 text-green-400 font-bold">Gratuit</td>
                  <td className="text-center p-4 font-bold">Nous contacter</td>
                  <td className="text-center p-4 bg-amber-500/5 text-amber-400 font-bold">Sur mesure</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Tarifs */}
      <section className="py-20 px-6 bg-slate-900/30 border-t border-slate-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Questions fréquentes</h2>
          </div>

          <div className="space-y-6">
            <FAQItem
              question="Comment fonctionne le mode DEMO ?"
              answer="Le mode DEMO vous donne accès gratuit à la plateforme complète avec des données fictives. Explorez toutes les fonctionnalités sans limite de temps ni engagement. Aucune carte bancaire requise."
            />
            <FAQItem
              question="Puis-je voir les tarifs détaillés avant de m'inscrire ?"
              answer="Nos tarifs sont personnalisés en fonction de votre nombre d'utilisateurs, projets et modules choisis. Créez votre compte gratuit pour recevoir une proposition sur mesure adaptée à vos besoins réels."
            />
            <FAQItem
              question="Qu'est-ce que le mode HYBRIDE concrètement ?"
              answer="Le mode HYBRIDE combine la plateforme SaaS + l'intervention d'experts PMO, Data et gouvernance. C'est notre offre premium pour les organisations qui veulent la technologie ET l'accompagnement humain. Tarifs au forfait mensuel par personne."
            />
            <FAQItem
              question="Comment sont calculés les tarifs par personne ?"
              answer="Chaque utilisateur actif de la plateforme compte comme 1 personne. Le tarif mensuel par personne dépend du mode choisi (PRO ou HYBRIDE) et dégressif selon le volume. Contactez-nous après inscription pour un devis précis."
            />
            <FAQItem
              question="Proposez-vous des remises pour les ONGs ou le secteur public ?"
              answer="Oui, nous proposons des conditions préférentielles pour les organisations à but non lucratif et les administrations publiques. Inscrivez-vous pour recevoir une offre adaptée."
            />
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-6 border-t border-slate-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Prêt à transformer votre gouvernance ?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Créez votre compte gratuit et recevez une proposition personnalisée.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="group px-10 py-5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-lg shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all flex items-center gap-2 justify-center"
            >
              Créer mon compte gratuit
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={22} />
            </Link>
            <Link
              href="/cockpit/projets"
              className="px-10 py-5 rounded-xl border-2 border-amber-400/50 hover:border-amber-400 text-white font-bold text-lg transition-all"
            >
              Essayer le mode DEMO
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function PricingCard({ title, price, period, description, features, cta, href, highlighted }: { title: string; price: string; period: string; description: string; features: string[]; cta: string; href: string; highlighted?: boolean }) {
  return (
    <div className={`p-8 rounded-2xl ${highlighted ? 'bg-gradient-to-b from-amber-500/10 to-slate-900/50 border-2 border-amber-500' : 'bg-slate-900/50 border border-slate-800'} hover:scale-105 transition-transform`}>
      {highlighted && (
        <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold mb-4">
          <Sparkles size={16} />
          <span>RECOMMANDÉ</span>
        </div>
      )}
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <div className="mb-4">
        <span className="text-4xl font-bold text-amber-400">{price}</span>
        {period && <span className="text-slate-400 text-lg">{period}</span>}
      </div>
      <p className="text-slate-400 mb-6">{description}</p>
      <ul className="space-y-3 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
            <CheckCircle className="text-amber-400 flex-shrink-0 mt-0.5" size={16} />
            {feature}
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className={`block w-full text-center px-6 py-3 rounded-xl font-semibold transition-all ${
          highlighted
            ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 shadow-lg shadow-amber-500/30'
            : 'bg-slate-800 hover:bg-slate-700 text-white'
        }`}
      >
        {cta}
      </Link>
    </div>
  );
}

function ModuleCard({ title, price, description }: { title: string; price: string; description: string }) {
  return (
    <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/50 transition-all">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-xl font-bold">{title}</h3>
        <span className="text-amber-400 font-semibold whitespace-nowrap">{price}</span>
      </div>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  );
}

function ServiceCard({ title, price, period, description }: { title: string; price: string; period: string; description: string }) {
  return (
    <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <div className="mb-3">
        <span className="text-2xl font-bold text-amber-400">{price}</span>
        <span className="text-slate-400">{period}</span>
      </div>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/50 transition-all">
      <h3 className="text-lg font-bold mb-2">{question}</h3>
      <p className="text-slate-400 leading-relaxed">{answer}</p>
    </div>
  );
}
