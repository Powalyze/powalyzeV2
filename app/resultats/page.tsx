import { Metadata } from 'next';
import Link from 'next/link';
import { 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Users,
  CheckCircle,
  ArrowRight 
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Résultats clients - Powalyze',
  description: 'Découvrez les résultats obtenus par nos clients avec Powalyze'
};

const stats = [
  {
    icon: TrendingUp,
    value: '+40%',
    label: 'Productivité des équipes'
  },
  {
    icon: Clock,
    value: '-60%',
    label: 'Temps de reporting'
  },
  {
    icon: DollarSign,
    value: '€2.5M',
    label: 'Économies moyennes/an'
  },
  {
    icon: Users,
    value: '95%',
    label: 'Satisfaction utilisateurs'
  }
];

const testimonials = [
  {
    company: 'Entreprise CAC 40',
    sector: 'Industrie',
    quote: 'Powalyze a transformé notre façon de piloter nos 150+ projets. La visibilité en temps réel nous permet de prendre des décisions éclairées.',
    author: 'Directeur PMO',
    results: [
      'Réduction de 50% du temps de préparation COMEX',
      'Amélioration de 35% de la prédictibilité projet',
      'ROI atteint en 4 mois'
    ]
  },
  {
    company: 'Groupe bancaire international',
    sector: 'Finance',
    quote: 'L\'IA narrative de Powalyze génère des synthèses qui nous prenaient 2 jours auparavant. Un gain de temps considérable.',
    author: 'Chief Operating Officer',
    results: [
      'Automatisation de 80% des rapports',
      'Gain de 15h/semaine par manager',
      'Meilleure cohérence dans les communications'
    ]
  },
  {
    company: 'Scale-up tech',
    sector: 'Technology',
    quote: 'La plateforme nous a permis de structurer notre gouvernance tout en restant agiles. Indispensable pour notre croissance.',
    author: 'VP Engineering',
    results: [
      'Onboarding en 48h',
      'Adoption de 100% des équipes',
      'Time-to-market réduit de 25%'
    ]
  }
];

export default function ResultatsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            Résultats <span className="text-amber-400">mesurables</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Découvrez comment nos clients transforment leur gouvernance de portefeuille avec Powalyze
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center"
              >
                <div className="w-16 h-16 bg-amber-400/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-amber-400" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-300">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Testimonials */}
        <div className="space-y-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
            >
              <div className="flex items-start gap-6 mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-bold text-white">
                      {testimonial.company}
                    </h3>
                    <span className="text-sm px-3 py-1 bg-amber-400/20 text-amber-400 rounded-full">
                      {testimonial.sector}
                    </span>
                  </div>
                  <p className="text-lg text-slate-300 italic mb-4">
                    "{testimonial.quote}"
                  </p>
                  <p className="text-slate-400">
                    — {testimonial.author}
                  </p>
                </div>
              </div>
              
              <div className="border-t border-white/10 pt-6">
                <h4 className="text-white font-semibold mb-4">Résultats obtenus :</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  {testimonial.results.map((result, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300 text-sm">{result}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-amber-400/20 to-amber-600/20 border border-amber-400/30 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Obtenez les mêmes résultats
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Commencez votre transformation dès aujourd'hui
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/cockpit-demo"
              className="inline-flex items-center gap-2 px-8 py-4 bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold rounded-xl transition-all duration-300"
            >
              Essayer gratuitement
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-300 border border-white/20"
            >
              Demander une démo
            </Link>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center mt-12">
          <Link 
            href="/"
            className="text-slate-400 hover:text-white transition-colors"
          >
            ← Retour à l'accueil
          </Link>
        </div>

      </div>
    </div>
  );
}
