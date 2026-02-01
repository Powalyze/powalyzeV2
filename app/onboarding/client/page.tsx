'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function ClientOnboarding() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    objective: '',
    methodology: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          status: 'ACTIVE',
          rag_status: 'GRAY',
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        }),
      });

      if (!response.ok) throw new Error('Erreur création projet');

      const { project } = await response.json();
      router.push(`/cockpit/client?project=${project.id}`);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la création du projet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full p-8 bg-white/10 backdrop-blur-xl border-white/20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-3">
            Bienvenue dans Powalyze
          </h1>
          <p className="text-lg text-slate-300">
            Créons votre premier projet ensemble
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Nom du projet <span className="text-red-400">*</span>
            </label>
            <input
              required
              type="text"
              placeholder="Ex: Transformation digitale 2026"
              value={formData.name}
              onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Description
            </label>
            <textarea
              placeholder="Décrivez brièvement votre projet..."
              value={formData.description}
              onChange={(e: any) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Objectif principal
            </label>
            <input
              type="text"
              placeholder="Ex: Augmenter la productivité de 30%"
              value={formData.objective}
              onChange={(e: any) => setFormData({ ...formData, objective: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Méthodologie
            </label>
            <input
              type="text"
              placeholder="Ex: Agile, Waterfall, Hybrid..."
              value={formData.methodology}
              onChange={(e: any) => setFormData({ ...formData, methodology: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Button
            type="submit"
            disabled={loading || !formData.name}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-6 text-lg"
          >
            {loading ? 'Création en cours...' : 'Créer mon projet'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
