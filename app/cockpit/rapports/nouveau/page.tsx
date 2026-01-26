import { createReport } from "@/actions/reports";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export default async function NouveauReportPage() {
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
          href="/cockpit/rapports"
          className="text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Nouveau Rapport</h1>
          <p className="text-slate-400 mt-1">Générer un nouveau rapport d'analyse</p>
        </div>
      </div>

      <form action={createReport} className="max-w-2xl">
        <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 space-y-6">
          {/* Titre */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-2">
              Titre du rapport *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Ex: Rapport mensuel janvier 2026"
            />
          </div>

          {/* Type de rapport */}
          <div>
            <label htmlFor="report_type" className="block text-sm font-medium text-slate-300 mb-2">
              Type de rapport *
            </label>
            <select
              id="report_type"
              name="report_type"
              required
              defaultValue="general"
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="general">Général</option>
              <option value="performance">Performance</option>
              <option value="budget">Budget</option>
              <option value="risks">Risques</option>
              <option value="executive">Synthèse exécutive</option>
            </select>
          </div>

          {/* Contenu */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-slate-300 mb-2">
              Contenu *
            </label>
            <textarea
              id="content"
              name="content"
              required
              rows={12}
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
              placeholder="Contenu détaillé du rapport..."
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
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors"
            >
              Créer le rapport
            </button>
            <Link
              href="/cockpit/rapports"
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
