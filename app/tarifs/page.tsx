import Link from "next/link";
import { CheckCircle, ArrowRight, Sparkles } from "lucide-react";

export default function TarifsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white pt-24">
      {/* Hero */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Un modèle hybride,<br />simple et transparent.
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Combinez SaaS et expertise selon vos besoins. Aucun engagement long terme, annulation à tout moment.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <PricingCard
              title="SaaS Essentiel"
              price="CHF 990"
              period="/ mois"
              description="Pour les équipes qui veulent démarrer rapidement avec un cockpit complet."
              features={[
                "Cockpit complet (projets, risques, décisions)",
                "IA stratégique intégrée",
                "Rapports automatisés",
                "Multilingue (FR/EN/DE/IT)",
                "Jusqu'à 10 utilisateurs",
                "Support email (48h)",
                "Mises à jour incluses",
                "Hébergement Suisse sécurisé"
              ]}
              cta="Démarrer gratuitement"
              href="/contact"
            />

            <PricingCard
              title="SaaS + Modules"
              price="Sur mesure"
              period=""
              description="Pour les organisations qui veulent personnaliser leur cockpit module par module."
              features={[
                "Tout du plan Essentiel",
                "Modules additionnels à la carte",
                "Intégrations Power BI avancées",
                "Personnalisation workflows",
                "Champs personnalisés",
                "Automatisations avancées",
                "Utilisateurs illimités",
                "Support prioritaire (24h)"
              ]}
              cta="Recevoir un devis"
              href="/contact"
              highlighted
            />

            <PricingCard
              title="Consulting + SaaS"
              price="Pack hybride"
              period=""
              description="Pour les organisations qui veulent un accompagnement expert sur site ou à distance."
              features={[
                "Tout du plan Modules",
                "Accompagnement PMO senior",
                "Expertise Data & Power BI",
                "Déploiement sur site",
                "Formation des équipes",
                "Coaching continu",
                "Revues mensuelles",
                "Support dédié (4h)"
              ]}
              cta="Parler à un expert"
              href="/contact"
            />
          </div>
        </div>
      </section>

      {/* Modules à la carte */}
      <section className="py-20 px-6 bg-slate-900/30 border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Modules additionnels</h2>
            <p className="text-xl text-slate-300">
              Enrichissez votre cockpit avec des modules spécialisés
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <ModuleCard
              title="IA Personnalisée"
              price="CHF 500/mois"
              description="Entraînement de l'IA sur vos données historiques, vocabulaire métier et contexte organisationnel."
            />
            <ModuleCard
              title="Power BI Premium"
              price="CHF 400/mois"
              description="Dashboards sur mesure, connecteurs avancés, pipelines de données automatisés."
            />
            <ModuleCard
              title="Multi-organisations"
              price="CHF 300/mois"
              description="Gestion de plusieurs organisations dans une seule instance, consolidation transverse."
            />
            <ModuleCard
              title="API & Webhooks"
              price="CHF 200/mois"
              description="Accès complet aux APIs REST, webhooks pour intégrations custom, documentation développeur."
            />
          </div>
        </div>
      </section>

      {/* Services Consulting */}
      <section className="py-20 px-6 border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Services d'accompagnement</h2>
            <p className="text-xl text-slate-300">
              Tarifs journaliers pour l'expertise humaine
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <ServiceCard
              title="PMO Senior"
              price="CHF 1'200"
              period="/ jour"
              description="Cadrage, pilotage de programmes, animation de comités, arbitrage de décisions."
            />
            <ServiceCard
              title="Data & Power BI Expert"
              price="CHF 1'000"
              period="/ jour"
              description="Architecture data, dashboards exécutifs, connecteurs, formation Power BI."
            />
            <ServiceCard
              title="Consultant Gouvernance"
              price="CHF 1'100"
              period="/ jour"
              description="Audit processus, design gouvernance cible, conduite du changement."
            />
            <ServiceCard
              title="Coach Agile / Transformation"
              price="CHF 900"
              period="/ jour"
              description="Accompagnement équipes, mentorat PMO internes, optimisation continue."
            />
          </div>

          <div className="mt-12 p-6 rounded-xl bg-gradient-to-r from-amber-500/10 to-sky-500/10 border border-amber-500/30 text-center">
            <p className="text-lg text-slate-300">
              <strong className="text-white">Packs forfaitaires disponibles</strong> pour engagements de 10, 20 ou 50 jours avec remises progressives.
            </p>
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
              question="Puis-je commencer avec le plan Essentiel et évoluer ensuite ?"
              answer="Oui, absolument. Vous pouvez démarrer avec le plan Essentiel et ajouter des modules ou du consulting à tout moment selon vos besoins."
            />
            <FAQItem
              question="Y a-t-il des frais cachés ou d'installation ?"
              answer="Non. Les prix affichés incluent l'hébergement, les mises à jour et le support standard. Seuls les modules additionnels et le consulting sont facturés en supplément."
            />
            <FAQItem
              question="Quelle est la durée d'engagement minimum ?"
              answer="Aucun engagement long terme. Les abonnements sont mensuels et résiliables à tout moment avec un préavis de 30 jours."
            />
            <FAQItem
              question="Proposez-vous des remises pour les ONGs ou le secteur public ?"
              answer="Oui, nous proposons des conditions préférentielles pour les organisations à but non lucratif et les administrations publiques. Contactez-nous pour en discuter."
            />
            <FAQItem
              question="Les tarifs incluent-ils la formation des utilisateurs ?"
              answer="Le plan Essentiel inclut une formation de base (2h). Les plans supérieurs incluent des sessions de formation étendues. Du coaching personnalisé est disponible à la carte."
            />
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-6 border-t border-slate-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Prêt à construire votre cockpit ?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Recevez une proposition personnalisée adaptée à vos enjeux et votre budget.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="group px-10 py-5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-lg shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all flex items-center gap-2 justify-center"
            >
              Recevoir une proposition
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={22} />
            </Link>
            <Link
              href="/signup?demo=true"
              className="px-10 py-5 rounded-xl border-2 border-amber-400/50 hover:border-amber-400 text-white font-bold text-lg transition-all"
            >
              Essayer gratuitement
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
