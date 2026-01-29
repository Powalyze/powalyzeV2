'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Brain, Plus, ThumbsUp, ThumbsDown, MessageSquare, Eye, Edit2, Copy, Trash2 } from 'lucide-react';
import { ToastProvider, useToast } from '@/components/ui/ToastProvider';
import { useCockpit } from '@/components/providers/CockpitProvider';
import { CockpitShell } from '@/components/cockpit/CockpitShell';
import { ActionMenu } from '@/components/ui/ActionMenu';
import { StatusBadge } from '@/components/ui/StatusBadge';

type DecisionStatus = 'draft' | 'pending' | 'validated' | 'rejected';
type DecisionImpact = 'low' | 'medium' | 'high' | 'critical';
type DecisionUrgency = 'low' | 'medium' | 'high' | 'critical';

interface Decision {
  id: string;
  title: string;
  description: string;
  status: DecisionStatus;
  impact: DecisionImpact;
  urgency: DecisionUrgency;
  owner: string;
  date: string;
  aiInsight: string;
  project: string;
}

function DecisionsPageContent() {
  const { showToast } = useToast();
  const { getItems, addItem, updateItem, deleteItem, refreshCount } = useCockpit();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [pendingReject, setPendingReject] = useState<{ id: string; title: string } | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    impact: 'medium' as DecisionImpact,
    urgency: 'medium' as DecisionUrgency,
    owner: '',
    project: ''
  });

  // Load decisions from store une seule fois
  useEffect(() => {
    if (!isInitialized) {
      const stored = getItems('decisions');
      if (stored.length === 0) {
        // Initialize with demo data (une seule fois)
        const demoDecisions: Decision[] = [
          {
            id: '1',
            title: 'Migration vers Azure Cloud',
            description: 'Décision stratégique de migrer l\'infrastructure',
            status: 'validated',
            impact: 'critical',
            urgency: 'high',
            owner: 'CTO',
            date: 'Il y a 2h',
            aiInsight: 'Impact financier positif estimé à +25%',
            project: 'Cloud Migration'
          },
          {
            id: '2',
            title: 'Adoption méthodologie Agile',
            description: 'Passage des équipes à Agile/Scrum',
            status: 'pending',
            impact: 'high',
            urgency: 'medium',
            owner: 'PMO',
            date: 'Il y a 5h',
            aiInsight: 'Amélioration vélocité attendue +30%',
            project: 'Transformation'
          }
        ];
        demoDecisions.forEach(d => addItem('decisions', d));
      }
      setIsInitialized(true);
    }
  }, [isInitialized, getItems, addItem]);

  // Utiliser directement getItems au lieu d'un state local
  // refreshCount force le re-calcul quand les données changent
  const decisions = refreshCount >= 0 ? getItems('decisions') : [];

  const handleCreate = () => {
    if (!formData.title.trim()) {
      showToast('error', 'Erreur', 'Le titre est obligatoire');
      return;
    }

    const newDecision: Decision = {
      ...formData,
      id: Date.now().toString(),
      status: 'draft',
      date: "À l'instant",
      aiInsight: "Nouvelle décision en attente d'analyse IA"
    };

    addItem('decisions', newDecision);
    setFormData({ title: '', description: '', impact: 'medium', urgency: 'medium', owner: '', project: '' });
    setShowNewModal(false);
    showToast('success', '✅ Décision créée', `"${newDecision.title}" a été enregistrée`);
  };

  const handleValidate = (id: string, title: string) => {
    updateItem('decisions', id, { status: 'validated' });
    showToast('success', 'Décision validée', `"${title}" approuvée`);
  };

  const handleReject = (id: string, title: string) => {
    setPendingReject({ id, title });
    setShowRejectModal(true);
  };

  const confirmReject = () => {
    if (pendingReject) {
      updateItem('decisions', pendingReject.id, { status: 'rejected' });
      showToast('warning', 'Décision rejetée', `"${pendingReject.title}" refusée`);
      setShowRejectModal(false);
      setPendingReject(null);
    }
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Supprimer "${title}" ?`)) {
      deleteItem('decisions', id);
      showToast('success', 'Supprimée', `"${title}" supprimée`);
    }
  };

  const handleDuplicate = (decision: Decision) => {
    const duplicate = {
      ...decision,
      id: undefined,
      title: `${decision.title} (copie)`,
      status: 'draft' as DecisionStatus,
      date: "À l'instant"
    };
    addItem('decisions', duplicate);
    showToast('success', 'Dupliquée', 'Décision copiée');
  };

  // Filtrer les décisions
  const filtered = decisions.filter(d =>
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <CockpitShell>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Décisions</h1>
            <p className="text-slate-400">Registre des décisions stratégiques avec IA</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowNewModal(true)}
              className="px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-lg font-semibold flex items-center gap-2"
            >
              <Plus size={20} />
              Nouvelle décision
            </button>
            <button 
              onClick={() => {
                showToast('info', '🤖 IA en cours', 'Analyse des décisions et génération de recommandations...');
                setTimeout(() => {
                  showToast('success', 'Recommandations IA', '3 recommandations stratégiques générées avec succès');
                }, 2000);
              }}
              className="px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg flex items-center gap-2"
            >
              <Brain size={18} />
              Recommandations IA
            </button>
          </div>
        </div>
      </div>
      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher une décision..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#111113] border border-slate-800 rounded-lg focus:border-purple-500/50 focus:outline-none"
          />
        </div>
      </div>

      {/* Decisions List */}
      <div className="grid gap-4">
        {filtered.map((decision) => (
          <div key={decision.id} className="bg-[#111113] border border-slate-800 rounded-xl p-6 hover:border-purple-500/30 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold">{decision.title}</h3>
                  <StatusBadge status={decision.status} />
                </div>
                <p className="text-slate-400 text-sm mb-3">{decision.description}</p>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>👤 {decision.owner}</span>
                  <span>📁 {decision.project}</span>
                  <span>⏰ {decision.date}</span>
                </div>
              </div>
              <ActionMenu
                items={[
                  { icon: Edit2, label: 'Éditer', onClick: () => showToast('info', 'Édition', 'Fonction à venir') },
                  { icon: Copy, label: 'Dupliquer', onClick: () => handleDuplicate(decision) },
                  { icon: Trash2, label: 'Supprimer', onClick: () => handleDelete(decision.id, decision.title), variant: 'danger' }
                ]}
              />
            </div>

            {decision.aiInsight && (
              <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-3 mb-4">
                <div className="flex items-start gap-2">
                  <Brain size={16} className="text-purple-400 mt-0.5" />
                  <p className="text-sm text-slate-300">{decision.aiInsight}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleValidate(decision.id, decision.title)}
                className="px-4 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded-lg text-sm flex items-center gap-2 text-green-400"
              >
                <ThumbsUp size={16} />
                Valider
              </button>
              <button
                onClick={() => handleReject(decision.id, decision.title)}
                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-sm flex items-center gap-2 text-red-400"
              >
                <ThumbsDown size={16} />
                Rejeter
              </button>
              <button 
                onClick={() => showToast('info', '💬 Commentaire', 'Fonction de commentaire disponible prochainement')}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm flex items-center gap-2"
              >
                <MessageSquare size={16} />
                Commenter
              </button>
              <button 
                onClick={() => showToast('info', '👁️ Détails', 'Vue détaillée de la décision disponible prochainement')}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm flex items-center gap-2"
              >
                <Eye size={16} />
                Détails
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <Brain size={48} className="mx-auto mb-4 opacity-20" />
            <p>Aucune décision trouvée</p>
          </div>
        )}
      </div>

      {/* New Decision Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowNewModal(false)}>
          <div className="bg-[#111113] border border-slate-800 rounded-xl p-6 max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Nouvelle décision</h2>
              <button onClick={() => setShowNewModal(false)} className="text-slate-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Titre *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 bg-[#0A0A0B] border border-slate-800 rounded-lg focus:border-purple-500/50 focus:outline-none"
                  placeholder="Ex: Migration vers le cloud"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 bg-[#0A0A0B] border border-slate-800 rounded-lg focus:border-purple-500/50 focus:outline-none"
                  placeholder="Détails de la décision..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Impact</label>
                  <select
                    value={formData.impact}
                    onChange={(e) => setFormData(prev => ({ ...prev, impact: e.target.value as DecisionImpact }))}
                    className="w-full px-4 py-2 bg-[#0A0A0B] border border-slate-800 rounded-lg"
                  >
                    <option value="low">Faible</option>
                    <option value="medium">Moyen</option>
                    <option value="high">Fort</option>
                    <option value="critical">Critique</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Urgence</label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => setFormData(prev => ({ ...prev, urgency: e.target.value as DecisionUrgency }))}
                    className="w-full px-4 py-2 bg-[#0A0A0B] border border-slate-800 rounded-lg"
                  >
                    <option value="low">Faible</option>
                    <option value="medium">Moyenne</option>
                    <option value="high">Haute</option>
                    <option value="critical">Critique</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Responsable</label>
                  <input
                    type="text"
                    value={formData.owner}
                    onChange={(e) => setFormData(prev => ({ ...prev, owner: e.target.value }))}
                    className="w-full px-4 py-2 bg-[#0A0A0B] border border-slate-800 rounded-lg"
                    placeholder="Ex: Marie Dupont"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Projet</label>
                  <input
                    type="text"
                    value={formData.project}
                    onChange={(e) => setFormData(prev => ({ ...prev, project: e.target.value }))}
                    className="w-full px-4 py-2 bg-[#0A0A0B] border border-slate-800 rounded-lg"
                    placeholder="Ex: Cloud Migration"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNewModal(false)}
                className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold"
              >
                Annuler
              </button>
              <button
                onClick={handleCreate}
                className="flex-1 px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-lg font-semibold"
              >
                Créer la décision
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Modal */}
      {showRejectModal && pendingReject && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowRejectModal(false)}>
          <div className="bg-[#111113] border border-red-500/30 rounded-xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <ThumbsDown size={24} className="text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Rejeter la décision</h2>
                <p className="text-sm text-slate-400">Cette action peut être annulée</p>
              </div>
            </div>

            <p className="text-slate-300 mb-6">
              Voulez-vous vraiment rejeter <strong className="text-white">"{pendingReject.title}"</strong> ?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmReject}
                className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 rounded-lg font-semibold transition-colors"
              >
                Rejeter
              </button>
            </div>
          </div>
        </div>
      )}
    </CockpitShell>
  );
}

export default function DecisionsPage() {
  return (
    <ToastProvider>
      <DecisionsPageContent />
    </ToastProvider>
  );
}
