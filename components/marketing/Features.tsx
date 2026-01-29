// ============================================================================
// Features - Section des fonctionnalités clés
// ============================================================================

import { Brain, Shield, Zap, BarChart3, Users, Bell } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Brain,
      title: 'IA Générative',
      description:
        'Analyse automatique des risques et recommandations d\'actions par l\'intelligence artificielle.',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
    },
    {
      icon: Shield,
      title: 'Gouvernance Centralisée',
      description:
        'Tous vos risques, décisions et indicateurs dans un seul cockpit unifié.',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
    },
    {
      icon: Zap,
      title: 'Temps Réel',
      description:
        'Mise à jour instantanée des données, alertes intelligentes et tableaux de bord vivants.',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
    },
    {
      icon: BarChart3,
      title: 'Analytics Avancés',
      description:
        'Visualisations puissantes, tendances prédictives et rapports automatisés.',
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
    },
    {
      icon: Users,
      title: 'Collaboration',
      description:
        'Partagez vos cockpits avec votre équipe, commentaires et notifications intégrées.',
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
    },
    {
      icon: Bell,
      title: 'Alertes Intelligentes',
      description:
        'Notifications contextuelles basées sur vos seuils et l\'analyse IA.',
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
    },
  ];

  return (
    <section className="px-6 py-20 md:py-32 bg-slate-900/50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-full mb-6">
            <span className="text-xs font-medium text-slate-400">Fonctionnalités</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Tout ce dont vous avez besoin
            <br />
            pour piloter votre organisation
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Powalyze combine la simplicité d'utilisation d'un SaaS moderne avec la puissance
            de l'IA pour la gouvernance d'entreprise.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`${feature.bgColor} backdrop-blur-lg rounded-xl p-8 border ${feature.borderColor} hover:scale-105 transition-transform duration-300`}
              >
                <div className={`w-12 h-12 ${feature.bgColor} border ${feature.borderColor} rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className={feature.color} size={24} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-slate-400 mb-4">Prêt à découvrir Powalyze ?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/demo"
              className="inline-flex items-center justify-center px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg font-semibold transition-colors"
            >
              Essayer gratuitement
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 rounded-lg font-semibold transition-colors"
            >
              Nous contacter
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
