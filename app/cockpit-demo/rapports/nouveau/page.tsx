import Link from "next/link";
import { createDemoReport } from "@/actions/demo/reports";

export default function NouveauRapportDemoPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link href="/cockpit-demo/rapports" className="text-blue-400 hover:text-blue-300 text-sm">
          ← Retour aux rapports
        </Link>
        <h1 className="text-3xl font-bold mt-4">Nouveau Rapport - Mode DEMO</h1>
        <p className="text-slate-400 mt-1">Générer un nouveau rapport dans la base de démonstration</p>
      </div>

      <form action={createDemoReport} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-2">
            Titre du rapport *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-purple-500 transition"
            placeholder="Ex: Rapport exécutif Q1 2026"
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-slate-300 mb-2">
            Type de rapport *
          </label>
          <select
            id="type"
            name="type"
            required
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-purple-500 transition"
          >
            <option value="executive">Exécutif</option>
            <option value="technical">Technique</option>
            <option value="financial">Financier</option>
            <option value="project">Projet</option>
            <option value="risk">Risques</option>
          </select>
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-slate-300 mb-2">
            Contenu *
          </label>
          <textarea
            id="content"
            name="content"
            required
            rows={8}
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-purple-500 transition"
            placeholder="Contenu détaillé du rapport..."
          />
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/20 transition"
          >
            Créer le Rapport
          </button>
          <Link
            href="/cockpit-demo/rapports"
            className="px-8 py-3 bg-slate-800 text-slate-300 rounded-lg font-medium hover:bg-slate-700 transition"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}
