import Link from "next/link";
import { createDemoDecision } from "@/actions/demo/decisions";

export default function NouvelleDecisionDemoPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link href="/cockpit-demo/decisions" className="text-blue-400 hover:text-blue-300 text-sm">
          ← Retour aux décisions
        </Link>
        <h1 className="text-3xl font-bold mt-4">Nouvelle Décision - Mode DEMO</h1>
        <p className="text-slate-400 mt-1">Enregistrer une nouvelle décision dans la base de démonstration</p>
      </div>

      <form action={createDemoDecision} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-2">
            Titre de la décision *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500 transition"
            placeholder="Ex: Validation du budget Q2 2026"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500 transition"
            placeholder="Contexte et détails de la décision..."
          />
        </div>

        <div>
          <label htmlFor="decision_maker" className="block text-sm font-medium text-slate-300 mb-2">
            Décideur *
          </label>
          <input
            type="text"
            id="decision_maker"
            name="decision_maker"
            required
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500 transition"
            placeholder="Ex: Marie Dupont (CEO)"
          />
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-emerald-500/20 transition"
          >
            Créer la Décision
          </button>
          <Link
            href="/cockpit-demo/decisions"
            className="px-8 py-3 bg-slate-800 text-slate-300 rounded-lg font-medium hover:bg-slate-700 transition"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}
