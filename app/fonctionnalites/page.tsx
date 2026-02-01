import { Metadata } from 'next';
import Link from 'next/link';
import { 
  BarChart3, 
  Brain, 
  Shield, 
  Zap, 
  FileText, 
  Users,
  ArrowRight 
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Fonctionnalités - Powalyze',
  description: 'Découvrez toutes les fonctionnalités de Powalyze pour optimiser votre gouvernance de portefeuille'
};

const features = [
  {
    icon: BarChart3,
    title: 'Tableaux de bord interactifs',
    description: 'Visualisez vos KPIs et métriques clés en temps réel',
    link: '/fonctionnalites/tableaux-de-bord'
  },
  {
    icon: Brain,
    title: 'IA intégrée',
    description: 'Génération automatique de narratifs et recommandations intelligentes',
    link: '/fonctionnalites/ia-integree'
  },
  {
    icon: FileText,
    title: 'Rapports Power BI',
    description: 'Intégration native avec vos rapports Power BI existants',
    link: '/fonctionnalites/rapports-powerbi'
  },
  {
    icon: Zap,
    title: 'Automatisation',
    description: 'Automatisez vos workflows et processus de gouvernance',
    link: '/fonctionnalites/automatisation'
  },
  {
    icon: Shield,
    title: 'Sécurité avancée',
    description: 'Protection des données et conformité RGPD',
    link: '/fonctionnalites/securite'
  },
  {
    icon: Users,
    title: 'Collaboration',
    description: 'Travaillez en équipe avec des rôles et permissions',
    link: '/cockpit/equipe'
  }
];

export default function FonctionnalitesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            Toutes les fonctionnalités <span className="text-amber-400">Powalyze</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Une plateforme complète pour piloter votre portefeuille de projets avec efficacité
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Link
                key={index}
                href={feature.link}
                className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-amber-400/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-amber-400/30 transition-colors">
                  <Icon className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-300 mb-4">
                  {feature.description}
                </p>
                <div className="flex items-center gap-2 text-amber-400 font-medium group-hover:gap-4 transition-all">
                  En savoir plus
                  <ArrowRight className="w-5 h-5" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-amber-400/20 to-amber-600/20 border border-amber-400/30 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Prêt à transformer votre gouvernance ?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Découvrez Powalyze en action avec notre démo interactive
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/cockpit-demo"
              className="inline-flex items-center gap-2 px-8 py-4 bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold rounded-xl transition-all duration-300"
            >
              Essayer la démo
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/tarifs"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-300 border border-white/20"
            >
              Voir les tarifs
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
