// ============================================================
// POWALYZE V2 — NEW PROJECT PAGE
// ============================================================

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { createProject } from '@/lib/data-v2';

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    
    try {
      await createProject({
        organization_id: '', // Will be filled by data-v2.ts
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        status: formData.get('status') as any,
        health: formData.get('health') as any,
        progress: Number(formData.get('progress')),
        budget: formData.get('budget') ? Number(formData.get('budget')) : undefined,
        deadline: formData.get('deadline') as string || undefined,
        starred: false,
      });
      
      router.push('/cockpit/pro/projets');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création du projet');
      setLoading(false);
    }
  }
  
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/cockpit/pro/projets"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux projets
        </Link>
        <h1 className="text-3xl font-bold text-white">Nouveau projet</h1>
        <p className="text-slate-400 mt-1">Créez un nouveau projet dans votre portfolio</p>
      </div>
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900 rounded-lg border border-slate-800 p-6 space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
            Nom du projet *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="ex: Migration Cloud Azure"
          />
        </div>
        
        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Décrivez les objectifs et le périmètre du projet"
          />
        </div>
        
        {/* Status & Health */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-slate-300 mb-2">
              Statut *
            </label>
            <select
              id="status"
              name="status"
              required
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="active">Actif</option>
              <option value="on-hold">En pause</option>
              <option value="completed">Terminé</option>
              <option value="cancelled">Annulé</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="health" className="block text-sm font-medium text-slate-300 mb-2">
              Santé *
            </label>
            <select
              id="health"
              name="health"
              required
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="green">Vert (on track)</option>
              <option value="yellow">Jaune (attention)</option>
              <option value="red">Rouge (critique)</option>
            </select>
          </div>
        </div>
        
        {/* Progress */}
        <div>
          <label htmlFor="progress" className="block text-sm font-medium text-slate-300 mb-2">
            Progression (0-100%) *
          </label>
          <input
            id="progress"
            name="progress"
            type="number"
            min="0"
            max="100"
            defaultValue="0"
            required
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        
        {/* Budget & Deadline */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-slate-300 mb-2">
              Budget (€)
            </label>
            <input
              id="budget"
              name="budget"
              type="number"
              min="0"
              step="1000"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="ex: 250000"
            />
          </div>
          
          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-slate-300 mb-2">
              Échéance
            </label>
            <input
              id="deadline"
              name="deadline"
              type="date"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-900 font-medium py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Création...' : 'Créer le projet'}
          </button>
          <Link
            href="/cockpit/pro/projets"
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}
