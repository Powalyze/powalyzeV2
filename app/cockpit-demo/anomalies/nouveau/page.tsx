import Link from "next/link";
import { createDemoAnomaly } from "@/actions/demo/anomalies";

export default function NouvelleAnomalieDemoPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link href="/cockpit-demo/anomalies" className="text-blue-400 hover:text-blue-300 text-sm">
          ← Retour aux anomalies
        </Link>
        <h1 className="text-3xl font-bold mt-4">Nouvelle Anomalie - Mode DEMO</h1>
        <p className="text-slate-400 mt-1">Signaler une nouvelle anomalie dans la base de démonstration</p>
      </div>

      <form action={createDemoAnomaly} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-2">
            Titre de l'anomalie *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-orange-500 transition"
            placeholder="Ex: Écart budgétaire important détecté"
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
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-orange-500 transition"
            placeholder="Décrire l'anomalie détectée..."
          />
        </div>

        <div>
          <label htmlFor="severity" className="block text-sm font-medium text-slate-300 mb-2">
            Sévérité *
          </label>
          <select
            id="severity"
            name="severity"
            required
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-orange-500 transition"
          >
            <option value="low">Faible</option>
            <option value="medium">Moyenne</option>
            <option value="high">Haute</option>
            <option value="critical">Critique</option>
          </select>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-orange-500/20 transition"
          >
            Créer l'Anomalie
          </button>
          <Link
            href="/cockpit-demo/anomalies"
            className="px-8 py-3 bg-slate-800 text-slate-300 rounded-lg font-medium hover:bg-slate-700 transition"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}
