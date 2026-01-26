import { createConnector } from "@/actions/connectors";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NouveauConnecteurPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/cockpit/connecteurs"
          className="text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Nouveau Connecteur</h1>
          <p className="text-slate-400 mt-1">Ajouter une nouvelle intégration externe</p>
        </div>
      </div>

      <form action={createConnector} className="max-w-2xl">
        <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 space-y-6">
          {/* Nom */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
              Nom du connecteur *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Jira Production"
            />
          </div>

          {/* Type */}
          <div>
            <label htmlFor="connector_type" className="block text-sm font-medium text-slate-300 mb-2">
              Type de connecteur *
            </label>
            <select
              id="connector_type"
              name="connector_type"
              required
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Sélectionner un type</option>
              <option value="jira">Jira</option>
              <option value="azure-devops">Azure DevOps</option>
              <option value="github">GitHub</option>
              <option value="slack">Slack</option>
              <option value="openai">OpenAI</option>
              <option value="notion">Notion</option>
              <option value="asana">Asana</option>
              <option value="salesforce">Salesforce</option>
              <option value="zendesk">Zendesk</option>
              <option value="servicenow">ServiceNow</option>
              <option value="other">Autre</option>
            </select>
          </div>

          {/* API URL */}
          <div>
            <label htmlFor="api_url" className="block text-sm font-medium text-slate-300 mb-2">
              URL de l'API *
            </label>
            <input
              type="url"
              id="api_url"
              name="api_url"
              required
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://api.example.com"
            />
          </div>

          {/* API Key */}
          <div>
            <label htmlFor="api_key" className="block text-sm font-medium text-slate-300 mb-2">
              Clé API
            </label>
            <input
              type="password"
              id="api_key"
              name="api_key"
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="sk-..."
            />
          </div>

          {/* Secret */}
          <div>
            <label htmlFor="secret" className="block text-sm font-medium text-slate-300 mb-2">
              Secret
            </label>
            <input
              type="password"
              id="secret"
              name="secret"
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Secret token"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-700">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
            >
              Créer le connecteur
            </button>
            <Link
              href="/cockpit/connecteurs"
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
