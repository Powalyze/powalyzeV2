"use client";

import { createAnomaly } from "@/actions/anomalies";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCockpitData } from "@/lib/cockpitData";

export default function NouveauAnomaliePage() {
  // Récupérer la liste des projets depuis cockpitData
  const cockpitData = getCockpitData();
  const projects = cockpitData.projects;
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/cockpit/anomalies"
          className="text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Nouvelle Anomalie</h1>
          <p className="text-slate-400 mt-1">Signaler un incident ou une anomalie</p>
        </div>
      </div>

      <form action={createAnomaly} className="max-w-2xl">
        <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 space-y-6">
          {/* Titre */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-2">
              Titre de l'anomalie *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Ex: Erreur authentification API"
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
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
              placeholder="Détails de l'anomalie observée..."
            />
          </div>

          {/* Sévérité */}
          <div>
            <label htmlFor="severity" className="block text-sm font-medium text-slate-300 mb-2">
              Sévérité *
            </label>
            <select
              id="severity"
              name="severity"
              required
              defaultValue="medium"
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="low">Mineure</option>
              <option value="medium">Moyenne</option>
              <option value="high">Majeure</option>
              <option value="critical">Critique</option>
            </select>
          </div>

          {/* Projet associé */}
          <div>
            <label htmlFor="project_id" className="block text-sm font-medium text-slate-300 mb-2">
              Projet associé (optionnel)
            </label>
            <select
              id="project_id"
              name="project_id"
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="">Sélectionner un projet</option>
              {projects.map((project) => (
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
              className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-medium transition-colors"
            >
              Créer l'anomalie
            </button>
            <Link
              href="/cockpit/anomalies"
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
