import { Download, Webhook, Code2 } from 'lucide-react';

export default function APIWebhooksPage() {
  return (
    <div className="space-y-8">
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400/20 to-green-600/20 flex items-center justify-center">
            <Webhook className="text-green-400" size={24} />
          </div>
          <div>
            <h1 className="text-4xl font-bold">API & Webhooks</h1>
            <p className="text-slate-400 mt-1">Intégrez Powalyze dans votre écosystème</p>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
        <h2 className="text-xl font-bold mb-3">Résumé</h2>
        <p className="text-slate-300 leading-relaxed">
          L'API REST de Powalyze permet d'automatiser vos workflows, synchroniser des données externes 
          et recevoir des notifications en temps réel via webhooks.
        </p>
      </div>

      <div className="space-y-6">
        <Step number={1} title="Obtenir une clé API">
          <p>1. <strong>Paramètres → Développeurs → API Keys</strong></p>
          <p>2. Cliquez sur "Créer une clé"</p>
          <p>3. Définissez les permissions (Read, Write, Admin)</p>
          <p>4. Copiez le token : <code className="text-green-400">pk_live_...</code></p>
        </Step>

        <Step number={2} title="Effectuer votre premier appel">
          <pre className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-sm overflow-x-auto">
            <code className="text-green-400">{`curl https://api.powalyze.com/v1/projects \\
  -H "Authorization: Bearer pk_live_xxxxx" \\
  -H "Content-Type: application/json"
  
// Réponse
{
  "data": [
    {
      "id": "prj_abc123",
      "name": "Transformation Digitale",
      "status": "in_progress",
      "health": "green"
    }
  ]
}`}</code>
          </pre>
        </Step>

        <Step number={3} title="Configurer un Webhook">
          <p>1. <strong>Paramètres → Webhooks</strong></p>
          <p>2. "+ Nouveau webhook"</p>
          <p>3. URL de destination : <code className="text-green-400">https://votre-app.com/webhook</code></p>
          <p>4. Événements à écouter :</p>
          <ul className="list-disc list-inside ml-4 mt-2">
            <li><code>project.created</code></li>
            <li><code>risk.escalated</code></li>
            <li><code>decision.approved</code></li>
            <li><code>report.generated</code></li>
          </ul>
        </Step>

        <Step number={4} title="Exemple d'automatisation">
          <p>Scénario : Créer automatiquement un ticket Jira quand un risque devient critique</p>
          <pre className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-sm mt-3">
            <code className="text-green-400">{`// Votre endpoint reçoit:
{
  "event": "risk.escalated",
  "data": {
    "id": "risk_xyz",
    "title": "Dépassement budget",
    "severity": "high",
    "project_id": "prj_abc123"
  }
}

// Votre code crée le ticket Jira
await jira.createIssue({
  fields: {
    project: { key: "PMO" },
    summary: data.title,
    priority: { name: "High" }
  }
});`}</code>
          </pre>
        </Step>
      </div>

      <div className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Code2 size={24} className="text-green-400" />
          Endpoints principaux
        </h2>
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          <Endpoint method="GET" path="/v1/projects" />
          <Endpoint method="POST" path="/v1/projects" />
          <Endpoint method="GET" path="/v1/risks" />
          <Endpoint method="PUT" path="/v1/risks/:id" />
          <Endpoint method="GET" path="/v1/decisions" />
          <Endpoint method="POST" path="/v1/reports/generate" />
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <a
          href="/docs/api-webhooks.pdf"
          className="flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold shadow-lg transition-all"
        >
          <Download size={20} />
          Télécharger le guide PDF
        </a>
      </div>
    </div>
  );
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center font-bold text-white flex-shrink-0">
        {number}
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <div className="text-slate-300 space-y-2">{children}</div>
      </div>
    </div>
  );
}

function Endpoint({ method, path }: { method: string; path: string }) {
  const colors: Record<string, string> = {
    GET: 'text-blue-400 border-blue-400/30',
    POST: 'text-green-400 border-green-400/30',
    PUT: 'text-yellow-400 border-yellow-400/30',
    DELETE: 'text-red-400 border-red-400/30'
  };
  
  return (
    <div className="flex items-center gap-2 p-2 rounded border bg-slate-900/50">
      <span className={`px-2 py-0.5 rounded text-xs font-bold border ${colors[method]}`}>{method}</span>
      <code className="text-slate-300 text-xs">{path}</code>
    </div>
  );
}
