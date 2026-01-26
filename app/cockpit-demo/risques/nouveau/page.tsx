import Link from "next/link";
import { createDemoRisk } from "@/actions/demo/risks";

export default function NouveauRisqueDemoPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link href="/cockpit-demo/risques" className="text-blue-400 hover:text-blue-300 text-sm">
          ← Retour aux risques
        </Link>
        <h1 className="text-3xl font-bold mt-4">Nouveau Risque - Mode DEMO</h1>
        <p className="text-slate-400 mt-1">Créer un nouveau risque dans la base de démonstration</p>
      </div>

      <form action={createDemoRisk} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-2">
            Titre du risque *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500 transition"
            placeholder="Ex: Retard de livraison fournisseur critique"
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
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500 transition"
            placeholder="Décrire le risque en détail..."
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="impact" className="block text-sm font-medium text-slate-300 mb-2">
              Impact (1-5) *
            </label>
            <input
              type="number"
              id="impact"
              name="impact"
              required
              min="1"
              max="5"
              defaultValue="3"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500 transition"
            />
            <p className="text-xs text-slate-500 mt-1">1 = Faible, 5 = Critique</p>
          </div>

          <div>
            <label htmlFor="probability" className="block text-sm font-medium text-slate-300 mb-2">
              Probabilité (1-5) *
            </label>
            <input
              type="number"
              id="probability"
              name="probability"
              required
              min="1"
              max="5"
              defaultValue="3"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500 transition"
            />
            <p className="text-xs text-slate-500 mt-1">1 = Peu probable, 5 = Très probable</p>
          </div>
        </div>

        <div>
          <label htmlFor="mitigation" className="block text-sm font-medium text-slate-300 mb-2">
            Plan de mitigation
          </label>
          <textarea
            id="mitigation"
            name="mitigation"
            rows={3}
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500 transition"
            placeholder="Actions pour réduire ou éliminer le risque..."
          />
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/20 transition"
          >
            Créer le Risque
          </button>
          <Link
            href="/cockpit-demo/risques"
            className="px-8 py-3 bg-slate-800 text-slate-300 rounded-lg font-medium hover:bg-slate-700 transition"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}
