import Link from "next/link";
import { createDemoConnector } from "@/actions/demo/connectors";

export default function NouveauConnecteurDemoPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link href="/cockpit-demo/connecteurs" className="text-blue-400 hover:text-blue-300 text-sm">
          ← Retour aux connecteurs
        </Link>
        <h1 className="text-3xl font-bold mt-4">Nouveau Connecteur - Mode DEMO</h1>
        <p className="text-slate-400 mt-1">Configurer un nouveau connecteur dans la base de démonstration</p>
      </div>

      <form action={createDemoConnector} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
            Nom du connecteur *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500 transition"
            placeholder="Ex: Jira Production"
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-slate-300 mb-2">
            Type *
          </label>
          <select
            id="type"
            name="type"
            required
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500 transition"
          >
            <option value="jira">Jira</option>
            <option value="slack">Slack</option>
            <option value="github">GitHub</option>
            <option value="gitlab">GitLab</option>
            <option value="azure_devops">Azure DevOps</option>
            <option value="teams">Microsoft Teams</option>
          </select>
        </div>

        <div>
          <label htmlFor="api_url" className="block text-sm font-medium text-slate-300 mb-2">
            URL de l'API *
          </label>
          <input
            type="url"
            id="api_url"
            name="api_url"
            required
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500 transition"
            placeholder="https://api.example.com/v1"
          />
        </div>

        <div>
          <label htmlFor="api_key" className="block text-sm font-medium text-slate-300 mb-2">
            Clé API *
          </label>
          <input
            type="password"
            id="api_key"
            name="api_key"
            required
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500 transition"
            placeholder="••••••••••••••••"
          />
          <p className="text-xs text-slate-500 mt-1">La clé sera chiffrée et sécurisée</p>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-cyan-500/20 transition"
          >
            Créer le Connecteur
          </button>
          <Link
            href="/cockpit-demo/connecteurs"
            className="px-8 py-3 bg-slate-800 text-slate-300 rounded-lg font-medium hover:bg-slate-700 transition"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}
