'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import EnterpriseRequestForm from '@/components/EnterpriseRequestForm';
import SubscribeProButton from '@/components/SubscribeProButton';

export default function PricingPage() {
  const router = useRouter();
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [showEnterpriseForm, setShowEnterpriseForm] = useState(false);

  const prices = {
    monthly: { pro: 29, enterprise: 'Sur devis' },
    yearly: { pro: 24, enterprise: 'Sur devis' }
  };

  const handleStartPro = () => {
    router.push('/signup?plan=pro');
  };

  const handleRequestEnterprise = () => {
    setShowEnterpriseForm(true);
  };

  const handleCloseForm = () => {
    setShowEnterpriseForm(false);
  };

  return (
    <>
      <div className="min-h-screen bg-slate-950 text-white">
        {/* Header géré par app/layout.tsx via <Navbar /> */}
        
        <main className="relative">
          {/* Hero Section */}
          <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent pointer-events-none"></div>
            
            <div className="relative max-w-7xl mx-auto">
              <div className="text-center max-w-4xl mx-auto mb-16">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-400 mb-6">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                  <span className="uppercase tracking-wider">Tarifs</span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Un cockpit qui travaille{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500">
                    pour vous
                  </span>
                </h1>
                
                <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
                  <strong className="text-white">Pro</strong> pour démarrer immédiatement. <strong className="text-white">Entreprise</strong> pour orchestrer un portefeuille stratégique complet. Vous choisissez votre rythme, le cockpit s'adapte.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full sm:w-auto px-8 py-3 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-semibold hover:shadow-lg hover:shadow-amber-500/50 transition-all"
                  >
                    Voir les plans
                  </button>
                  <button
                    onClick={handleRequestEnterprise}
                    className="w-full sm:w-auto px-8 py-3 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-white transition-all"
                  >
                    Parler à un expert
                  </button>
                </div>
              </div>

              {/* Cockpit Preview Card */}
              <div className="max-w-4xl mx-auto">
                <div className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-700/50 shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent rounded-2xl pointer-events-none"></div>
                  
                  <div className="relative">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs">
                          <div className="w-2 h-2 rounded-full bg-green-400"></div>
                          <span className="text-slate-300">Dashboard</span>
                        </div>
                        <span className="text-xs text-slate-400">Vue Pro</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400">
                        <span>IA activée</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                      <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/50">
                        <div className="text-xs text-slate-400 mb-1">Portefeuille</div>
                        <div className="text-2xl font-bold mb-1">32 projets</div>
                        <div className="text-xs text-green-400">+3 ce mois</div>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/50">
                        <div className="text-xs text-slate-400 mb-1">Décisions</div>
                        <div className="text-2xl font-bold mb-1">7 comités</div>
                        <div className="text-xs text-amber-400">2 bloquantes</div>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/50">
                        <div className="text-xs text-slate-400 mb-1">Risques</div>
                        <div className="text-2xl font-bold mb-1">5 majeurs</div>
                        <div className="text-xs text-red-400">Suivi actif</div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-slate-700/50 space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Narratif exécutif généré</span>
                        <span className="text-amber-400 font-medium">12 secondes</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Rapport mensuel prêt</span>
                        <span className="text-green-400 font-medium">COMEX validé</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Billing Toggle */}
          <section className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto flex justify-center">
              <div className="inline-flex items-center gap-2 p-1 rounded-full bg-slate-800/80 border border-slate-700">
                <button
                  onClick={() => setBillingInterval('monthly')}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                    billingInterval === 'monthly'
                      ? 'bg-slate-700 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Mensuel
                </button>
                <button
                  onClick={() => setBillingInterval('yearly')}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                    billingInterval === 'yearly'
                      ? 'bg-slate-700 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Annuel
                </button>
                <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-xs text-green-400 font-medium">
                  -20% annuel
                </div>
              </div>
            </div>
          </section>

          {/* Pricing Plans */}
          <section id="plans" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-8">
                
                {/* PRO PLAN */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl opacity-20 group-hover:opacity-30 blur transition-opacity"></div>
                  <div className="relative p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-500/40 shadow-2xl h-full flex flex-col">
                    <div className="flex-grow">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-2xl font-bold">Pro</h3>
                            <span className="px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 font-medium">
                              Recommandé
                            </span>
                          </div>
                          <p className="text-sm text-slate-400">
                            Le cockpit complet pour démarrer sans projet IT
                          </p>
                        </div>
                      </div>

                      <div className="mb-8">
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-5xl font-bold">
                            {billingInterval === 'monthly' ? prices.monthly.pro : prices.yearly.pro}€
                          </span>
                          <span className="text-slate-400">/mois/utilisateur</span>
                        </div>
                        <p className="text-sm text-slate-400">
                          {billingInterval === 'monthly' 
                            ? 'Facturation mensuelle, résiliable à tout moment' 
                            : 'Facturation annuelle (288€/an/utilisateur)'}
                        </p>
                      </div>

                      <div className="space-y-4 mb-8">
                        <div>
                          <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3">Core Features</div>
                          <ul className="space-y-2.5">
                            {[
                              'Cockpit complet : projets, risques, décisions',
                              'Projets illimités avec vues filtrées',
                              'Rapports automatiques mensuels',
                              'Exports PDF & partage sécurisé',
                              'Multi-langues : FR/EN/DE/NO/ES/IT'
                            ].map((feature, i) => (
                              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                                <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <div className="text-xs uppercase tracking-wider text-amber-500 font-semibold mb-3">IA Incluse</div>
                          <ul className="space-y-2.5">
                            {[
                              "Narratifs exécutifs générés automatiquement",
                              "Synthèses prêtes pour comités",
                              "Détection d'anomalies & alertes"
                            ].map((feature, i) => (
                              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                                <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3">Support</div>
                          <ul className="space-y-2.5">
                            {[
                              'Support par email sous 24h',
                              'Essai 14 jours avant engagement'
                            ].map((feature, i) => (
                              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                                <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-700/50 space-y-3">
                      <SubscribeProButton
                        billingInterval={billingInterval}
                        className="w-full px-6 py-3.5 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-semibold hover:shadow-lg hover:shadow-amber-500/50 transition-all"
                      >
                        S'abonner au plan Pro
                      </SubscribeProButton>
                      <p className="text-center text-xs text-slate-400">
                        Idéal pour PMO, équipes projet, directions opérationnelles
                      </p>
                    </div>
                  </div>
                </div>

                {/* ENTERPRISE PLAN */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-10 group-hover:opacity-20 blur transition-opacity"></div>
                  <div className="relative p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-700/50 shadow-2xl h-full flex flex-col">
                    <div className="flex-grow">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-2xl font-bold">Entreprise</h3>
                            <span className="px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-400 font-medium">
                              Sur mesure
                            </span>
                          </div>
                          <p className="text-sm text-slate-400">
                            Gouvernance avancée pour portefeuilles complexes
                          </p>
                        </div>
                      </div>

                      <div className="mb-8">
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-5xl font-bold">Sur devis</span>
                        </div>
                        <p className="text-sm text-slate-400">
                          Tarifs adaptés à votre contexte et volumes
                        </p>
                      </div>

                      <div className="space-y-4 mb-8">
                        <div>
                          <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3">Tout Pro, plus</div>
                          <ul className="space-y-2.5">
                            {[
                              'Tout le mode Pro pour toutes vos équipes',
                              'Connecteurs avancés : ERP, CRM, API',
                              'Rôles & permissions multi-équipes',
                              'Gouvernance multi-BU personnalisée'
                            ].map((feature, i) => (
                              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                                <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <div className="text-xs uppercase tracking-wider text-purple-400 font-semibold mb-3">Accompagnement</div>
                          <ul className="space-y-2.5">
                            {[
                              'Onboarding dédié & cadrage métier',
                              'Support prioritaire avec SLA',
                              'Formation équipes & sponsors',
                              'Option déploiement dédié'
                            ].map((feature, i) => (
                              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                                <svg className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-700/50 space-y-3">
                      <button
                        onClick={handleRequestEnterprise}
                        className="w-full px-6 py-3.5 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-semibold hover:shadow-lg hover:shadow-amber-500/50 transition-all"
                      >
                        Demander un devis
                      </button>
                      <p className="text-center text-xs text-slate-400">
                        Idéal pour groupes, ETI, administrations, programmes stratégiques
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-slate-900/50">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">Questions fréquentes</h2>
                <p className="text-lg text-slate-400">
                  Tout ce qu'il faut savoir sur nos plans Pro et Entreprise
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    q: "Pro et Entreprise utilisent-ils le même cockpit ?",
                    a: "Oui. Le cockpit est identique : projets, risques, décisions, narratifs IA. La différence se joue sur l'ampleur du déploiement, les intégrations tierces et le niveau d'accompagnement."
                  },
                  {
                    q: "Peut-on commencer en Pro puis passer en Entreprise ?",
                    a: "Absolument. Beaucoup d'organisations démarrent avec quelques équipes en Pro, puis migrent vers Entreprise quand le cockpit devient le référentiel central pour plusieurs BU."
                  },
                  {
                    q: "Comment fonctionne l'essai Pro ?",
                    a: "Vous accédez au cockpit Pro complet pendant 14 jours. L'objectif : vérifier si le cockpit répond à vos enjeux de gouvernance réels, pas juste \"tester un outil\"."
                  },
                  {
                    q: "Que se passe-t-il si j'arrête l'abonnement Pro ?",
                    a: "Vous pouvez exporter vos données avant la fin. Le cockpit n'est plus accessible après résiliation, mais vous pouvez revenir quand vos besoins évoluent."
                  },
                  {
                    q: "Comment demander un devis Entreprise ?",
                    a: "Cliquez sur \"Demander un devis\" ci-dessus. Nous cadrons ensemble votre contexte (volumes, intégrations, gouvernance) et vous recevez une proposition claire."
                  }
                ].map((faq, i) => (
                  <div
                    key={i}
                    className="rounded-xl bg-slate-800/40 border border-slate-700/50 overflow-hidden backdrop-blur-sm"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                      className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left hover:bg-slate-800/60 transition-colors"
                    >
                      <span className="font-medium">{faq.q}</span>
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        openFaqIndex === i 
                          ? 'border-amber-500 text-amber-500' 
                          : 'border-slate-600 text-slate-400'
                      }`}>
                        {openFaqIndex === i ? '−' : '+'}
                      </div>
                    </button>
                    {openFaqIndex === i && (
                      <div className="px-6 pb-4 text-slate-300 leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Prêt à démarrer ?
              </h2>
              <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
                Essayez Pro pendant 14 jours ou discutez avec nous de vos besoins Entreprise.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={handleStartPro}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-semibold hover:shadow-lg hover:shadow-amber-500/50 transition-all"
                >
                  Essayer Pro gratuitement
                </button>
                <button
                  onClick={handleRequestEnterprise}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-white transition-all"
                >
                  Demander un devis Entreprise
                </button>
              </div>
            </div>
          </section>

        </main>
      </div>

      {/* Enterprise Form Modal */}
      {showEnterpriseForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-slate-900 border-b border-slate-700">
              <h3 className="text-2xl font-bold">Demande de devis Entreprise</h3>
              <button
                onClick={handleCloseForm}
                className="p-2 rounded-lg hover:bg-slate-800 transition"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <EnterpriseRequestForm />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
