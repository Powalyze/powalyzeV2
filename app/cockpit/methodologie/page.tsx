'use client';

import { useState } from 'react';
import { Search, TrendingUp, Brain, Zap, CheckCircle, AlertTriangle, FileText, Settings, ChevronDown, X, Target, Users, Calendar, BarChart3 } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';

type MethodologyType = 'agile' | 'hermes' | 'cycle-v' | 'hybrid';
type CustomPhase = {
  id: string;
  name: string;
  duration: string;
  deliverables: string[];
};

interface Methodology {
  id: MethodologyType;
  name: string;
  description: string;
  advantages: string[];
  usage: string;
  icon: string;
}

export default function MethodologiePage() {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [showAIRecommendationsModal, setShowAIRecommendationsModal] = useState(false);
  const [selectedMethodology, setSelectedMethodology] = useState<MethodologyType | null>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [customPhases, setCustomPhases] = useState<CustomPhase[]>([
    { id: '1', name: 'Cadrage & Analyse', duration: '2 semaines', deliverables: ['Cahier des charges', 'Étude de faisabilité'] },
    { id: '2', name: 'Conception', duration: '3 semaines', deliverables: ['Architecture technique', 'Maquettes UX/UI'] },
    { id: '3', name: 'Développement', duration: '8 semaines', deliverables: ['Code source', 'Tests unitaires'] },
    { id: '4', name: 'Tests & Validation', duration: '2 semaines', deliverables: ['Rapport de tests', 'Plan de déploiement'] },
  ]);

  const methodologies: Methodology[] = [
    {
      id: 'agile',
      name: 'Agile (Scrum/Kanban)',
      description: 'Méthodologie itérative avec cycles courts et amélioration continue',
      advantages: ['Livraisons fréquentes', 'Adaptabilité élevée', 'Feedback client continu', 'Collaboration équipe renforcée'],
      usage: 'Recommandé pour: Projets évolutifs, startups, innovation',
      icon: '🚀'
    },
    {
      id: 'hermes',
      name: 'Hermès',
      description: 'Méthode suisse pour gestion de projet structurée (administration publique)',
      advantages: ['Conformité réglementaire', 'Documentation complète', 'Gouvernance rigoureuse', 'Traçabilité totale'],
      usage: 'Recommandé pour: Secteur public, projets institutionnels',
      icon: '🏛️'
    },
    {
      id: 'cycle-v',
      name: 'Cycle en V',
      description: 'Approche séquentielle avec phases de validation croisées',
      advantages: ['Structure claire', 'Validation rigoureuse', 'Risques maîtrisés', 'Documentation détaillée'],
      usage: 'Recommandé pour: Projets critiques, industrie, santé',
      icon: '📐'
    },
    {
      id: 'hybrid',
      name: 'Hybride (Agile + Cycle-V)',
      description: 'Combinaison des avantages des méthodes agiles et traditionnelles',
      advantages: ['Flexibilité contrôlée', 'Validation régulière', 'Adaptabilité mesurée', 'Double gouvernance'],
      usage: 'Recommandé pour: Grandes entreprises, transformation digitale',
      icon: '⚡'
    }
  ];

  const handleAnalyzePortfolio = () => {
    setShowAnalysisModal(true);
    showToast('info', "Analyse en cours...", "L'IA analyse votre portefeuille de projets");
  };

  const handleViewAIRecommendations = () => {
    setShowAIRecommendationsModal(true);
    showToast('info', "Recommandations IA", "6 méthodologies suggérées par l'IA");
  };

  const handleSelectMethodology = (id: MethodologyType) => {
    setSelectedMethodology(id);
    setShowConfirmationModal(true);
  };

  const handleApplyMethodology = () => {
    if (!selectedMethodology) return;
    
    const method = methodologies.find(m => m.id === selectedMethodology);
    showToast('success', "✅ Méthodologie activée", `${method?.name} appliquée à tous vos projets`);
    setShowConfirmationModal(false);
    setSelectedMethodology(null);
  };

  const handleCreateCustom = () => {
    setCustomizing(true);
    showToast('info', "Mode personnalisation", "Créez votre méthodologie sur mesure");
  };

  const handleGenerateWithAI = () => {
    showToast('info', "🤖 Génération IA...", "L'IA crée une méthodologie adaptée à votre contexte");
    
    setTimeout(() => {
      showToast('success', "✅ Méthodologie générée", "5 phases créées automatiquement");
    }, 2000);
  };

  const handleSaveDraft = () => {
    showToast('success', "💾 Brouillon enregistré", "Votre méthodologie personnalisée est sauvegardée");
  };

  const handleApplyCustom = () => {
    showToast('success', "✅ Méthodologie activée", "Votre méthodologie personnalisée est maintenant active");
    setCustomizing(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Méthodologie</h1>
            <p className="text-slate-400">Choisissez et personnalisez votre approche projet</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleAnalyzePortfolio}
              className="px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg flex items-center gap-2 transition-all"
            >
              <TrendingUp size={18} />
              Analyser mon portefeuille
            </button>
            <button
              onClick={handleViewAIRecommendations}
              className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg flex items-center gap-2 transition-all"
            >
              <Brain size={18} />
              Recommandations IA
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher une méthodologie..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#111113] border border-slate-800 rounded-lg focus:border-purple-500/50 focus:outline-none"
          />
        </div>
      </div>

      {/* Methodologies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {methodologies.map((method) => (
          <div
            key={method.id}
            className="bg-[#111113] border border-slate-800 rounded-xl p-6 hover:border-purple-500/30 transition-all cursor-pointer"
            onClick={() => handleSelectMethodology(method.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{method.icon}</span>
                <div>
                  <h3 className="text-xl font-semibold">{method.name}</h3>
                  <p className="text-sm text-slate-400 mt-1">{method.description}</p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-semibold text-slate-300 mb-2">Avantages:</h4>
              <ul className="space-y-1">
                {method.advantages.map((adv, i) => (
                  <li key={i} className="text-sm text-slate-400 flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-400 flex-shrink-0" />
                    {adv}
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-xs text-slate-500 italic mb-4">{method.usage}</div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSelectMethodology(method.id);
              }}
              className="w-full px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg text-sm font-semibold transition-all"
            >
              Activer cette méthodologie
            </button>
          </div>
        ))}
      </div>

      {/* Custom Methodology Builder */}
      <div className="bg-[#111113] border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-1">Créer ma méthodologie personnalisée</h2>
            <p className="text-slate-400">Adaptez votre processus à vos besoins spécifiques</p>
          </div>
          {!customizing && (
            <button
              onClick={handleCreateCustom}
              className="px-6 py-2 bg-amber-500 hover:bg-amber-600 rounded-lg font-semibold transition-all"
            >
              Créer ma méthodologie
            </button>
          )}
        </div>

        {customizing && (
          <div className="space-y-6">
            {/* Phases */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Target size={20} />
                  Phases du projet
                </h3>
                <button
                  onClick={handleGenerateWithAI}
                  className="px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg text-sm flex items-center gap-2"
                >
                  <Zap size={16} />
                  Générer avec l'IA
                </button>
              </div>
              <div className="space-y-3">
                {customPhases.map((phase) => (
                  <div key={phase.id} className="bg-[#0A0A0B] border border-slate-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{phase.name}</h4>
                      <span className="text-sm text-slate-400">{phase.duration}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {phase.deliverables.map((del, i) => (
                        <span key={i} className="px-2 py-1 bg-slate-800 rounded text-xs">
                          {del}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Workflows */}
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                <BarChart3 size={20} />
                Workflows de validation
              </h3>
              <div className="bg-[#0A0A0B] border border-slate-800 rounded-lg p-4">
                <p className="text-slate-400 text-sm">Configuration des étapes de validation et approbation</p>
              </div>
            </div>

            {/* Rituals */}
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                <Calendar size={20} />
                Rituels & Cérémonies
              </h3>
              <div className="bg-[#0A0A0B] border border-slate-800 rounded-lg p-4">
                <p className="text-slate-400 text-sm">Définissez vos réunions récurrentes (daily, sprint review, etc.)</p>
              </div>
            </div>

            {/* Reports */}
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                <FileText size={20} />
                Rapports automatiques
              </h3>
              <div className="bg-[#0A0A0B] border border-slate-800 rounded-lg p-4">
                <p className="text-slate-400 text-sm">Configurez la génération automatique de rapports</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSaveDraft}
                className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition-all"
              >
                Enregistrer brouillon
              </button>
              <button
                onClick={handleApplyCustom}
                className="flex-1 px-6 py-3 bg-amber-500 hover:bg-amber-600 rounded-lg font-semibold transition-all"
              >
                Activer ma méthodologie
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Portfolio Analysis Modal */}
      {showAnalysisModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowAnalysisModal(false)}>
          <div className="bg-[#111113] border border-slate-800 rounded-xl p-6 max-w-3xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Analyse de votre portefeuille</h2>
              <button onClick={() => setShowAnalysisModal(false)}><X size={24} /></button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-[#0A0A0B] border border-slate-800 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="text-green-400" size={20} />
                  <h3 className="font-semibold">12 projets actifs analysés</h3>
                </div>
                <p className="text-slate-400 text-sm">67% en méthodologie Agile, 33% en Cycle-V</p>
              </div>

              <div className="bg-[#0A0A0B] border border-slate-800 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Brain className="text-purple-400" size={20} />
                  <h3 className="font-semibold">Analyse IA</h3>
                </div>
                <p className="text-slate-400 text-sm">
                  Vos projets montrent une forte adaptabilité. Une méthodologie hybride pourrait améliorer la gouvernance tout en conservant l'agilité.
                </p>
              </div>

              <div className="bg-[#0A0A0B] border border-slate-800 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle className="text-amber-400" size={20} />
                  <h3 className="font-semibold">Points d'attention</h3>
                </div>
                <ul className="space-y-1 text-sm text-slate-400">
                  <li>• 3 projets avec retards de livraison</li>
                  <li>• Documentation insuffisante sur 5 projets</li>
                  <li>• Manque de rituels standardisés</li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => {
                setShowAnalysisModal(false);
                setShowAIRecommendationsModal(true);
              }}
              className="w-full px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-lg font-semibold"
            >
              Voir les recommandations IA
            </button>
          </div>
        </div>
      )}

      {/* AI Recommendations Modal */}
      {showAIRecommendationsModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowAIRecommendationsModal(false)}>
          <div className="bg-[#111113] border border-slate-800 rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Brain className="text-purple-400" />
                Recommandations IA
              </h2>
              <button onClick={() => setShowAIRecommendationsModal(false)}><X size={24} /></button>
            </div>

            <div className="space-y-4">
              {[
                { method: 'Hybride (Agile + Cycle-V)', confidence: 94, reason: 'Équilibre parfait entre agilité et gouvernance pour votre portefeuille mixte' },
                { method: 'Agile (Scrum)', confidence: 87, reason: 'Forte adaptabilité pour vos projets innovants' },
                { method: 'Hermès', confidence: 76, reason: 'Conformité réglementaire pour vos projets institutionnels' },
                { method: 'SAFe (Scaled Agile)', confidence: 72, reason: 'Coordination optimale pour vos grandes équipes' },
                { method: 'Kanban', confidence: 68, reason: 'Gestion de flux continue pour vos projets de maintenance' },
                { method: 'Cycle en V', confidence: 61, reason: 'Rigueur nécessaire pour vos projets critiques' }
              ].map((rec, i) => (
                <div key={i} className="bg-[#0A0A0B] border border-slate-800 rounded-lg p-4 hover:border-purple-500/30 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{rec.method}</h3>
                    <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm font-semibold">
                      {rec.confidence}% confiance
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mb-3">{rec.reason}</p>
                  <button
                    onClick={() => {
                      showToast('success', "✅ Recommandation appliquée", `${rec.method} activée sur vos projets`);
                      setShowAIRecommendationsModal(false);
                    }}
                    className="px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg text-sm transition-all"
                  >
                    Appliquer cette méthodologie
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmationModal && selectedMethodology && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowConfirmationModal(false)}>
          <div className="bg-[#111113] border border-slate-800 rounded-xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Confirmer l'activation</h2>
              <button onClick={() => setShowConfirmationModal(false)}><X size={24} /></button>
            </div>

            <p className="text-slate-400 mb-6">
              Êtes-vous sûr de vouloir activer <strong className="text-white">{methodologies.find(m => m.id === selectedMethodology)?.name}</strong> sur tous vos projets ?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmationModal(false)}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold"
              >
                Annuler
              </button>
              <button
                onClick={handleApplyMethodology}
                className="flex-1 px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg font-semibold"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
