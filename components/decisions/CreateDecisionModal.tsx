/**
 * CREATE DECISION MODAL (PACK 9)
 * Modal de création de décision avec scoring
 */

'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { DecisionFormData, Project } from '@/types';

interface CreateDecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DecisionFormData) => Promise<void>;
  projects?: Project[];
}

export function CreateDecisionModal({ isOpen, onClose, onSubmit, projects }: CreateDecisionModalProps) {
  const [formData, setFormData] = useState<DecisionFormData>({
    title: '',
    description: '',
    owner: '',
    project_id: null,
    impact_score: 3,
    urgency_score: 3,
    complexity_score: 3,
    deadline: null,
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
      // Reset form
      setFormData({
        title: '',
        description: '',
        owner: '',
        project_id: null,
        impact_score: 3,
        urgency_score: 3,
        complexity_score: 3,
        deadline: null,
      });
    } catch (error) {
      console.error('Erreur création décision:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0A0A0A] border border-[#1E1E1E] rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1E1E1E]">
          <h2 className="text-xl font-semibold text-white">Nouvelle décision</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Titre */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Titre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-[#111111] border border-[#1E1E1E] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Ex: Migrer vers Azure"
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
              className="w-full bg-[#111111] border border-[#1E1E1E] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
              rows={4}
              placeholder="Contexte et enjeux..."
            />
          </div>

          {/* Owner + Projet */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Owner <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.owner}
                onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                className="w-full bg-[#111111] border border-[#1E1E1E] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Ex: Marie Dupont"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Projet
              </label>
              <select
                value={formData.project_id || ''}
                onChange={(e) => setFormData({ ...formData, project_id: e.target.value || null })}
                className="w-full bg-[#111111] border border-[#1E1E1E] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="">Aucun</option>
                {projects?.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Scoring */}
          <div className="space-y-4 p-4 bg-[#111111] rounded-lg border border-[#1E1E1E]">
            <h3 className="text-sm font-medium text-gray-300">Scoring</h3>
            
            {/* Impact */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-gray-400">Impact</label>
                <span className="text-sm font-medium text-white">{formData.impact_score}/5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={formData.impact_score}
                onChange={(e) => setFormData({ ...formData, impact_score: parseInt(e.target.value) })}
                className="w-full h-2 bg-[#1E1E1E] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:rounded-full"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>Mineur</span>
                <span>Critique</span>
              </div>
            </div>

            {/* Urgence */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-gray-400">Urgence</label>
                <span className="text-sm font-medium text-white">{formData.urgency_score}/5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={formData.urgency_score}
                onChange={(e) => setFormData({ ...formData, urgency_score: parseInt(e.target.value) })}
                className="w-full h-2 bg-[#1E1E1E] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-orange-500 [&::-webkit-slider-thumb]:rounded-full"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>Long terme</span>
                <span>Immédiat</span>
              </div>
            </div>

            {/* Complexité */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-gray-400">Complexité</label>
                <span className="text-sm font-medium text-white">{formData.complexity_score}/5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={formData.complexity_score}
                onChange={(e) => setFormData({ ...formData, complexity_score: parseInt(e.target.value) })}
                className="w-full h-2 bg-[#1E1E1E] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:rounded-full"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>Simple</span>
                <span>Très complexe</span>
              </div>
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Deadline
            </label>
            <input
              type="date"
              value={formData.deadline ? new Date(formData.deadline).toISOString().split('T')[0] : ''}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value ? new Date(e.target.value) : null })}
              className="w-full bg-[#111111] border border-[#1E1E1E] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1E1E1E]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title || !formData.owner}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              {loading ? 'Création...' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
