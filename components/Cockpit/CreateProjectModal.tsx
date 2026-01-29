'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useCockpitCopy } from '@/lib/i18n/cockpit';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormData) => Promise<void>;
  language?: 'fr' | 'en';
}

export interface ProjectFormData {
  name: string;
  description?: string;
  budget?: number;
  status?: 'active' | 'pending';
}

export function CreateProjectModal({ 
  isOpen, 
  onClose, 
  onSubmit,
  language = 'fr' 
}: CreateProjectModalProps) {
  const copy = useCockpitCopy(language);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    status: 'active',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      // Reset form
      setFormData({ name: '', description: '', status: 'active' });
      onClose();
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-md mx-4 bg-slate-900 rounded-xl border border-slate-800 shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h2 className="text-xl font-semibold text-white">
            {copy.createProject.title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Project Name */}
          <div>
            <label htmlFor="project-name" className="block text-sm font-medium text-slate-300 mb-2">
              {copy.createProject.placeholder}
            </label>
            <input
              id="project-name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder={copy.createProject.placeholder}
              autoFocus
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="project-description" className="block text-sm font-medium text-slate-300 mb-2">
              {copy.createProject.description}
            </label>
            <textarea
              id="project-description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              placeholder={copy.createProject.description}
            />
          </div>

          {/* Budget (optional) */}
          <div>
            <label htmlFor="project-budget" className="block text-sm font-medium text-slate-300 mb-2">
              {copy.createProject.budget}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">€</span>
              <input
                id="project-budget"
                type="number"
                value={formData.budget || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  budget: e.target.value ? parseInt(e.target.value) : undefined 
                }))}
                className="w-full pl-8 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="0"
                min="0"
                step="1000"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors font-medium"
              disabled={isSubmitting}
            >
              {copy.createProject.cancel}
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.name.trim()}
              className="flex-1 px-4 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {copy.common.loading}
                </span>
              ) : (
                copy.createProject.cta
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
