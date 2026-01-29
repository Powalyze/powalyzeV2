// ============================================================================
// HowItWorks - Section expliquant le fonctionnement en 3 étapes
// ============================================================================

import { UserPlus, Settings, Rocket } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: UserPlus,
      title: 'Créez votre compte',
      description:
        'Inscription en 2 minutes. Aucune carte bancaire requise pour commencer.',
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
    },
    {
      number: '02',
      icon: Settings,
      title: 'Configurez votre cockpit',
      description:
        'Onboarding automatique : votre organisation et cockpit créés instantanément.',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
    },
    {
      number: '03',
      icon: Rocket,
      title: 'Pilotez en temps réel',
      description:
        'Ajoutez vos items, invitez votre équipe, et laissez l\'IA vous guider.',
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
    },
  ];

  return (
    <section className="px-6 py-20 md:py-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-full mb-6">
            <span className="text-xs font-medium text-slate-400">Comment ça marche</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            3 étapes pour démarrer
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Déployez votre cockpit exécutif en quelques minutes, pas en semaines.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connection lines (hidden on mobile) */}
          <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-amber-500 via-blue-500 to-green-500" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                {/* Step card */}
                <div className={`${step.bgColor} backdrop-blur-lg rounded-xl p-8 border ${step.borderColor} text-center`}>
                  {/* Number badge */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-slate-900 border-2 border-slate-700 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-slate-400">{step.number}</span>
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 ${step.bgColor} border ${step.borderColor} rounded-lg flex items-center justify-center mx-auto mb-6 mt-4`}>
                    <Icon className={step.color} size={32} />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <a
            href="/demo"
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 rounded-lg font-bold text-lg shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all"
          >
            Commencer maintenant
          </a>
          <p className="text-sm text-slate-500 mt-4">Gratuit, sans engagement</p>
        </div>
      </div>
    </section>
  );
}
