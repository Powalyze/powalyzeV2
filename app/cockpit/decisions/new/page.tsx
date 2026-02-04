"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BackButton } from "@/components/BackButton";
import { Loader2 } from "lucide-react";

type Project = {
  id: string;
  name: string;
  status: string;
};

export default function NewDecisionPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    project_id: '',
    priority: 'medium',
    due_date: '',
    owner: '',
    impact_area: 'project'
  });

  useEffect(() => {
    fetch('/api/cockpit/projects')
      .then(r => r.json())
      .then(data => setProjects(data.projects || data));
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/cockpit/decisions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push('/cockpit/decisions');
      } else {
        const error = await res.json();
        alert(`Erreur: ${error.error}`);
      }
    } catch (error) {
      console.error('Failed to create decision:', error);
      alert('Erreur lors de la création de la décision');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="border-b border-slate-800/50 bg-slate-900/30 backdrop-blur">
        <div className="max-w-[1000px] mx-auto px-6 py-6">
          <BackButton fallback="/cockpit/decisions" />
          <h1 className="text-3xl font-bold mt-2">Créer une décision stratégique</h1>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Titre de la décision *
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                placeholder="Ex: Valider le budget Q2 2026"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Projet lié *
              </label>
              <select
                name="project_id"
                value={form.project_id}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="">Sélectionner un projet</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.status})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Priorité
                </label>
                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="low">Basse</option>
                  <option value="medium">Moyenne</option>
                  <option value="high">Haute</option>
                  <option value="critical">Critique</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Échéance
                </label>
                <input
                  type="date"
                  name="due_date"
                  value={form.due_date}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Responsable
              </label>
              <input
                name="owner"
                value={form.owner}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                placeholder="Nom du responsable"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                placeholder="Décrivez le contexte et les enjeux de cette décision..."
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => router.push('/cockpit/decisions')}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || !form.title || !form.project_id}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-semibold shadow-lg shadow-amber-500/30 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Création...
                </>
              ) : (
                'Créer la décision'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
