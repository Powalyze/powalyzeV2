// ================================================================
// PACK 10 - CreateRiskModal
// ================================================================
// Modal de création de risque avec sliders sévérité + probabilité

'use client';

import { useState } from 'react';
import { RiskFormData, Project } from '@/types';
import { X, AlertTriangle } from 'lucide-react';
import { getSeverityLabel, getProbabilityLabel, getScoreLevelLabel } from '@/lib/ai-risk-agent';

interface CreateRiskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RiskFormData) => Promise<void>;
  projects: Project[];
}

export function CreateRiskModal({ isOpen, onClose, onSubmit, projects }: CreateRiskModalProps) {
  const [formData, setFormData] = useState<RiskFormData>({
    title: '',
    description: '',
    project_id: null,
    severity: 3, // Valeur par défaut: Modéré
    probability: 3, // Valeur par défaut: Moyenne
    mitigation_actions: ''
  });

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Calcul du score (severity × probability)
  const score = formData.severity * formData.probability;
  const scoreLabel = getScoreLevelLabel(score);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Le titre est obligatoire');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        project_id: null,
        severity: 3,
        probability: 3,
        mitigation_actions: ''
      });
      
      onClose();
    } catch (error) {
      console.error('Erreur création risque:', error);
      alert('Erreur lors de la création du risque');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0A0A0A] border border-[#1E1E1E] rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1E1E1E]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Nouveau Risque</h2>
              <p className="text-sm text-gray-400">Identifier et évaluer un risque</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#1E1E1E] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Titre */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Titre du risque *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Retard livraison fournisseur clé"
              className="w-full px-4 py-2 bg-[#111111] border border-[#1E1E1E] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Détails du risque, contexte, impacts potentiels..."
              rows={4}
              className="w-full px-4 py-2 bg-[#111111] border border-[#1E1E1E] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 resize-none"
            />
          </div>

          {/* Projet associé */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Projet associé
            </label>
            <select
              value={formData.project_id || ''}
              onChange={(e) => setFormData({ ...formData, project_id: e.target.value || null })}
              className="w-full px-4 py-2 bg-[#111111] border border-[#1E1E1E] rounded-lg text-white focus:outline-none focus:border-red-500/50"
            >
              <option value="">Aucun projet spécifique</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          {/* Scoring Section */}
          <div className="bg-[#111111] border border-[#1E1E1E] rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Évaluation du Risque</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Score:</span>
                <span className="text-lg font-bold text-red-500">{score}/25</span>
                <span className="text-xs text-gray-400">({scoreLabel})</span>
              </div>
            </div>

            {/* Sévérité */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-300">
                  Sévérité
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-red-500">{formData.severity}/5</span>
                  <span className="text-xs text-gray-400">({getSeverityLabel(formData.severity)})</span>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: parseInt(e.target.value) })}
                className="w-full h-2 bg-[#1E1E1E] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-500 [&::-webkit-slider-thumb]:cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Mineur</span>
                <span>Critique</span>
              </div>
            </div>

            {/* Probabilité */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-300">
                  Probabilité
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-orange-500">{formData.probability}/5</span>
                  <span className="text-xs text-gray-400">({getProbabilityLabel(formData.probability)})</span>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={formData.probability}
                onChange={(e) => setFormData({ ...formData, probability: parseInt(e.target.value) })}
                className="w-full h-2 bg-[#1E1E1E] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-500 [&::-webkit-slider-thumb]:cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Très faible</span>
                <span>Très élevée</span>
              </div>
            </div>
          </div>

          {/* Actions de mitigation */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Actions de mitigation (optionnel)
            </label>
            <textarea
              value={formData.mitigation_actions || ''}
              onChange={(e) => setFormData({ ...formData, mitigation_actions: e.target.value })}
              placeholder="Actions envisagées pour réduire ou éliminer le risque..."
              rows={3}
              className="w-full px-4 py-2 bg-[#111111] border border-[#1E1E1E] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1E1E1E]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title.trim()}
              className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Création...' : 'Créer le risque'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
