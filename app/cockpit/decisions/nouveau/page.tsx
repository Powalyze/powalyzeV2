import { createDecision } from "@/actions/decisions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export default async function NouveauDecisionPage() {
  const supabase = await createClient();
  
  // Récupérer la liste des projets
  const { data: projects } = await supabase
    .from("projects")
    .select("id, name")
    .order("name", { ascending: true });
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/cockpit/decisions"
          className="text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Nouvelle Décision</h1>
          <p className="text-slate-400 mt-1">Enregistrer une décision stratégique</p>
        </div>
      </div>

      <form action={createDecision} className="max-w-2xl">
        <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 space-y-6">
          {/* Titre */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-2">
              Titre de la décision *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Ex: Adoption Kubernetes en production"
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
              rows={4}
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Contexte et justification de la décision..."
            />
          </div>

          {/* Statut */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-slate-300 mb-2">
              Statut *
            </label>
            <select
              id="status"
              name="status"
              required
              defaultValue="pending"
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="pending">À prendre</option>
              <option value="in_progress">En cours</option>
              <option value="approved">Approuvée</option>
              <option value="rejected">Rejetée</option>
            </select>
          </div>

          {/* Décideur */}
          <div>
            <label htmlFor="decision_maker" className="block text-sm font-medium text-slate-300 mb-2">
              Décideur
            </label>
            <input
              type="text"
              id="decision_maker"
              name="decision_maker"
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Ex: Directeur Technique"
            />
          </div>

          {/* Projet associé */}
          <div>
            <label htmlFor="project_id" className="block text-sm font-medium text-slate-300 mb-2">
              Projet associé (optionnel)
            </label>
            <select
              id="project_id"
              name="project_id"
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Sélectionner un projet</option>
              {projects?.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-700">
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors"
            >
              Créer la décision
            </button>
            <Link
              href="/cockpit/decisions"
              className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
            >
              Annuler
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
