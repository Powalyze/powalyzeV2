import Link from 'next/link';
import { ChevronLeft, BarChart3, Database, TrendingUp, Shield } from 'lucide-react';

export default function PowerBIPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          href="/expertise"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-[#F59E0B] transition-colors mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          Retour aux expertises
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-[#F59E0B]/10 rounded-xl">
              <BarChart3 className="w-8 h-8 text-[#F59E0B]" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Intégration Power BI
              </h1>
              <p className="text-xl text-gray-400">
                Visualisez vos données de gouvernance avec Power BI
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Feature Card */}
          <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-6">
            <div className="flex items-start gap-4 mb-4">
              <Database className="w-6 h-6 text-[#F59E0B] flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Connexion Automatique
                </h3>
                <p className="text-gray-400">
                  Powalyze se connecte automatiquement à vos rapports Power BI existants pour enrichir vos analyses de portefeuille.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-6">
            <div className="flex items-start gap-4 mb-4">
              <TrendingUp className="w-6 h-6 text-[#F59E0B] flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Analyses Avancées
                </h3>
                <p className="text-gray-400">
                  Créez des tableaux de bord personnalisés avec vos KPIs de gouvernance et partagez-les avec vos équipes.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-6">
            <div className="flex items-start gap-4 mb-4">
              <Shield className="w-6 h-6 text-[#F59E0B] flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Sécurité Renforcée
                </h3>
                <p className="text-gray-400">
                  Toutes les connexions sont sécurisées avec OAuth 2.0 et les permissions Power BI sont respectées.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-6">
            <div className="flex items-start gap-4 mb-4">
              <BarChart3 className="w-6 h-6 text-[#F59E0B] flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Intégration Native
                </h3>
                <p className="text-gray-400">
                  Accédez à vos rapports directement depuis le cockpit Powalyze sans quitter la plateforme.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-[#F59E0B]/10 to-[#F59E0B]/5 border border-[#F59E0B]/20 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Prêt à connecter Power BI ?
          </h2>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Activez l'intégration Power BI depuis les paramètres de votre cockpit pour commencer.
          </p>
          <Link
            href="/cockpit/donnees"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#F59E0B] text-black font-semibold rounded-lg hover:bg-[#D97706] transition-colors"
          >
            Configurer Power BI
          </Link>
        </div>
      </div>
    </div>
  );
}
