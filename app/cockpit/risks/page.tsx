// ================================================================
// PACK 10 - PAGE RISQUES EXÉCUTIFS
// ================================================================
// Module complet de gestion des risques:
// - Desktop: Table + Heatmap + Panel IA
// - Mobile: Cards + Stats
// - Flows: Création, Analyse IA (AAR), Mitigation, Suivi

'use client';

import { useState, useEffect } from 'react';
import { RiskExecutive, RiskFilters, RiskFormData, RiskStats, Project } from '@/types';
import { 
  getRisks, 
  getRiskById, 
  createRisk, 
  getRisksStats,
  analyzeRisk,
  updateRiskStatus,
  addMitigationActions
} from '@/actions/risks';
import { RiskCard } from '@/components/risks/RiskCard';
import { RisksTable } from '@/components/risks/RisksTable';
import { RiskHeatmap } from '@/components/risks/RiskHeatmap';
import { AIRiskAnalysisPanel } from '@/components/risks/AIRiskAnalysisPanel';
import { CreateRiskModal } from '@/components/risks/CreateRiskModal';
import { Plus, AlertTriangle, TrendingUp, TrendingDown, Minus, BarChart3, Search, Filter } from 'lucide-react';
import { ToastProvider, useToast } from '@/components/ui/ToastProvider';

// Hook pour détecter mobile
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    
    listener();
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

// ================================================================
// COMPOSANT PAGE PRINCIPAL
// ================================================================

function RisksPageContent() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { showToast } = useToast();

  // État
  const [risks, setRisks] = useState<RiskExecutive[]>([]);
  const [selectedRisk, setSelectedRisk] = useState<RiskExecutive | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAILoading] = useState(false);
  const [filters, setFilters] = useState<RiskFilters>({});
  const [stats, setStats] = useState<RiskStats>({
    total: 0,
    open: 0,
    in_progress: 0,
    mitigated: 0,
    closed: 0,
    critical: 0,
    high: 0,
    moderate: 0,
    low: 0,
    rising: 0,
    stable: 0,
    falling: 0,
    heatmap: []
  });
  const [projects, setProjects] = useState<Project[]>([]);

  // Chargement initial
  useEffect(() => {
    loadRisks();
    loadStats();
    // TODO: Charger les projets depuis Supabase
  }, [filters]);

  async function loadRisks() {
    setLoading(true);
    try {
      // TODO: Récupérer organizationId depuis le contexte auth
      const organizationId = 'demo-org-id';
      const data = await getRisks(filters, organizationId);
      setRisks(data);
    } catch (error) {
      console.error('Erreur chargement risques:', error);
      showToast('error', 'Erreur lors du chargement des risques');
    } finally {
      setLoading(false);
    }
  }

  async function loadStats() {
    try {
      // TODO: Récupérer organizationId depuis le contexte auth
      const organizationId = 'demo-org-id';
      const data = await getRisksStats(organizationId);
      setStats(data);
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    }
  }

  // Créer un risque
  async function handleCreateRisk(data: RiskFormData) {
    try {
      // TODO: Récupérer organizationId et userId depuis le contexte auth
      const organizationId = 'demo-org-id';
      const userId = 'demo-user-id';
      
      await createRisk(data, organizationId, userId);
      showToast('success', 'Risque créé avec succès');
      loadRisks();
      loadStats();
    } catch (error) {
      console.error('Erreur création risque:', error);
      showToast('error', 'Erreur lors de la création du risque');
      throw error;
    }
  }

  // Sélectionner un risque
  async function handleSelectRisk(risk: RiskExecutive) {
    try {
      // Recharger le risque complet avec relations
      const organizationId = 'demo-org-id';
      const fullRisk = await getRiskById(risk.id, organizationId);
      setSelectedRisk(fullRisk);
    } catch (error) {
      console.error('Erreur sélection risque:', error);
      showToast('error', 'Erreur lors de la sélection du risque');
    }
  }

  // Analyser avec IA (Agent AAR)
  async function handleAnalyzeWithAI() {
    if (!selectedRisk) return;

    setAILoading(true);
    showToast('info', 'Analyse IA en cours...');

    try {
      const organizationId = 'demo-org-id';
      const analysis = await analyzeRisk(selectedRisk.id, organizationId);
      
      // Recharger le risque avec l'analyse
      const updatedRisk = await getRiskById(selectedRisk.id, organizationId);
      setSelectedRisk(updatedRisk);
      
      showToast('success', 'Analyse IA complétée');
      loadRisks(); // Rafraîchir la liste pour afficher le badge IA
    } catch (error) {
      console.error('Erreur analyse IA:', error);
      showToast('error', 'Erreur lors de l\'analyse IA');
    } finally {
      setAILoading(false);
    }
  }

  // Changer le statut
  async function handleUpdateStatus(status: 'open' | 'in_progress' | 'mitigated' | 'closed') {
    if (!selectedRisk) return;

    try {
      const organizationId = 'demo-org-id';
      await updateRiskStatus(selectedRisk.id, status, organizationId);
      
      showToast('success', 'Statut mis à jour');
      loadRisks();
      loadStats();
      
      // Recharger le risque
      const updated = await getRiskById(selectedRisk.id, organizationId);
      setSelectedRisk(updated);
    } catch (error) {
      console.error('Erreur changement statut:', error);
      showToast('error', 'Erreur lors de la mise à jour du statut');
    }
  }

  // Click cellule heatmap
  function handleHeatmapCellClick(severity: number, probability: number) {
    setFilters({
      ...filters,
      severity: severity as any,
      probability: probability as any
    });
    setShowHeatmap(false);
  }

  // ================================================================
  // RENDER MOBILE
  // ================================================================

  if (isMobile) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Risques</h1>
            <p className="text-sm text-gray-400">{stats.total} risques identifiés</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="p-3 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Stats Mini (2 cols) */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#111111] border border-[#1E1E1E] rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-500">{stats.open}</div>
            <div className="text-xs text-gray-400 mt-1">Ouverts</div>
          </div>
          <div className="bg-[#111111] border border-[#1E1E1E] rounded-lg p-4">
            <div className="text-2xl font-bold text-red-500">{stats.critical}</div>
            <div className="text-xs text-gray-400 mt-1">Critiques</div>
          </div>
        </div>

        {/* Liste des risques */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-8 text-gray-400">Chargement...</div>
          ) : risks.length === 0 ? (
            <div className="bg-[#111111] border border-[#1E1E1E] rounded-lg p-8 text-center">
              <AlertTriangle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">Aucun risque identifié</p>
            </div>
          ) : (
            risks.map((risk) => (
              <RiskCard
                key={risk.id}
                risk={risk}
                onClick={() => handleSelectRisk(risk)}
              />
            ))
          )}
        </div>

        {/* Modal Création */}
        <CreateRiskModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateRisk}
          projects={projects}
        />
      </div>
    );
  }

  // ================================================================
  // RENDER DESKTOP
  // ================================================================

  return (
    <div className="flex h-screen overflow-hidden bg-[#0A0A0A]">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Risques Exécutifs</h1>
            <p className="text-gray-400 mt-1">Gestion et analyse des risques stratégiques</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                showHeatmap
                  ? 'bg-orange-500 text-white'
                  : 'bg-[#111111] border border-[#1E1E1E] text-gray-300 hover:border-orange-500/50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Heatmap
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nouveau risque
            </button>
          </div>
        </div>

        {/* Stats Dashboard (5 KPIs + 3 Tendances) */}
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-[#111111] border border-[#1E1E1E] rounded-lg p-4">
            <div className="text-3xl font-bold text-white">{stats.total}</div>
            <div className="text-sm text-gray-400 mt-1">Total</div>
          </div>
          <div className="bg-[#111111] border border-blue-500/20 rounded-lg p-4">
            <div className="text-3xl font-bold text-blue-500">{stats.open}</div>
            <div className="text-sm text-gray-400 mt-1">Ouverts</div>
          </div>
          <div className="bg-[#111111] border border-orange-500/20 rounded-lg p-4">
            <div className="text-3xl font-bold text-orange-500">{stats.in_progress}</div>
            <div className="text-sm text-gray-400 mt-1">En cours</div>
          </div>
          <div className="bg-[#111111] border border-red-500/20 rounded-lg p-4">
            <div className="text-3xl font-bold text-red-500">{stats.critical}</div>
            <div className="text-sm text-gray-400 mt-1">Critiques</div>
          </div>
          <div className="bg-[#111111] border border-green-500/20 rounded-lg p-4">
            <div className="text-3xl font-bold text-green-500">{stats.mitigated}</div>
            <div className="text-sm text-gray-400 mt-1">Mitigés</div>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex items-center gap-4 bg-[#111111] border border-[#1E1E1E] rounded-lg p-4">
          <Filter className="w-4 h-4 text-gray-400" />
          
          <select
            value={filters.status || 'all'}
            onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
            className="px-3 py-2 bg-[#0A0A0A] border border-[#1E1E1E] rounded text-sm text-gray-300 focus:outline-none focus:border-red-500/50"
          >
            <option value="all">Tous les statuts</option>
            <option value="open">Ouverts</option>
            <option value="in_progress">En cours</option>
            <option value="mitigated">Mitigés</option>
            <option value="closed">Clôturés</option>
          </select>

          <select
            value={filters.trend || 'all'}
            onChange={(e) => setFilters({ ...filters, trend: e.target.value as any })}
            className="px-3 py-2 bg-[#0A0A0A] border border-[#1E1E1E] rounded text-sm text-gray-300 focus:outline-none focus:border-red-500/50"
          >
            <option value="all">Toutes les tendances</option>
            <option value="rising">↑ En aggravation</option>
            <option value="stable">→ Stable</option>
            <option value="falling">↓ En diminution</option>
          </select>

          <div className="flex-1" />

          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={filters.search || ''}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 bg-[#0A0A0A] border border-[#1E1E1E] rounded text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-red-500/50"
            />
          </div>
        </div>

        {/* Heatmap OU Table */}
        {showHeatmap ? (
          <RiskHeatmap
            heatmap={stats.heatmap}
            onCellClick={handleHeatmapCellClick}
          />
        ) : (
          <RisksTable
            risks={risks}
            onSelectRisk={handleSelectRisk}
            selectedRiskId={selectedRisk?.id}
          />
        )}
      </div>

      {/* Right Panel (Détail + IA) */}
      {selectedRisk && (
        <div className="w-96 border-l border-[#1E1E1E] bg-[#0A0A0A] overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Titre risque */}
            <div>
              <h2 className="text-xl font-bold text-white mb-2">{selectedRisk.title}</h2>
              {selectedRisk.description && (
                <p className="text-sm text-gray-400 leading-relaxed">{selectedRisk.description}</p>
              )}
            </div>

            {/* Métriques */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#111111] border border-[#1E1E1E] rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-1">Sévérité</div>
                <div className="text-lg font-bold text-red-500">{selectedRisk.severity}/5</div>
              </div>
              <div className="bg-[#111111] border border-[#1E1E1E] rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-1">Probabilité</div>
                <div className="text-lg font-bold text-orange-500">{selectedRisk.probability}/5</div>
              </div>
            </div>

            {/* Score */}
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
              <div className="text-xs text-gray-400 mb-1">Score global</div>
              <div className="text-4xl font-bold text-red-500">{selectedRisk.score}/25</div>
            </div>

            {/* Bouton Analyse IA */}
            {!selectedRisk.ai_analysis && (
              <button
                onClick={handleAnalyzeWithAI}
                disabled={aiLoading}
                className="w-full px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {aiLoading ? 'Analyse en cours...' : 'Analyser avec l\'IA (AAR)'}
              </button>
            )}

            {/* Panel Analyse IA */}
            {selectedRisk.ai_analysis && (
              <AIRiskAnalysisPanel
                analysis={selectedRisk.ai_analysis}
                loading={aiLoading}
              />
            )}

            {/* Actions rapides */}
            <div className="space-y-2">
              <button
                onClick={() => handleUpdateStatus('in_progress')}
                className="w-full px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-500 rounded-lg transition-colors text-sm"
              >
                Marquer en cours
              </button>
              <button
                onClick={() => handleUpdateStatus('mitigated')}
                className="w-full px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-500 rounded-lg transition-colors text-sm"
              >
                Marquer comme mitigé
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Création */}
      <CreateRiskModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateRisk}
        projects={projects}
      />
    </div>
  );
}

// ================================================================
// EXPORT PAGE AVEC TOAST PROVIDER
// ================================================================

export default function RisksPage() {
  return (
    <ToastProvider>
      <RisksPageContent />
    </ToastProvider>
  );
}
