import { Download } from 'lucide-react';

export default function APIProjectsPage() {
  return (
    <div className="space-y-8">
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-4xl font-bold">Projects API</h1>
        <p className="text-slate-400 mt-2">CRUD operations sur les projets</p>
      </div>

      <div className="space-y-6">
        <Endpoint method="GET" path="/v1/projects" description="Liste tous les projets">
          <pre className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-sm text-green-400">
{`GET /v1/projects?status=in_progress&page=1

Response:
{
  "data": [
    {
      "id": "prj_abc123",
      "name": "Transformation Digitale",
      "status": "in_progress",
      "health": "green",
      "progress": 65,
      "budget": 500000,
      "spent": 325000
    }
  ]
}`}
          </pre>
        </Endpoint>

        <Endpoint method="POST" path="/v1/projects" description="Créer un projet">
          <pre className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-sm text-green-400">
{`POST /v1/projects
{
  "name": "Nouveau Projet",
  "description": "...",
  "owner": "john@company.com",
  "deadline": "2026-12-31"
}`}
          </pre>
        </Endpoint>

        <Endpoint method="PUT" path="/v1/projects/:id" description="Mettre à jour un projet" />
        <Endpoint method="DELETE" path="/v1/projects/:id" description="Supprimer un projet" />
      </div>

      <div className="flex justify-center pt-8">
        <a href="/docs/api-projects.pdf" className="flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold shadow-lg transition-all">
          <Download size={20} />
          Télécharger le PDF
        </a>
      </div>
    </div>
  );
}

function Endpoint({ method, path, description, children }: { method: string; path: string; description: string; children?: React.ReactNode }) {
  const colors: Record<string, string> = {
    GET: 'from-blue-400 to-blue-600',
    POST: 'from-green-400 to-green-600',
    PUT: 'from-yellow-400 to-yellow-600',
    DELETE: 'from-red-400 to-red-600'
  };
  
  return (
    <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
      <div className="flex items-center gap-3 mb-3">
        <span className={`px-3 py-1 rounded-lg bg-gradient-to-r ${colors[method]} text-white font-bold text-sm`}>{method}</span>
        <code className="text-amber-400">{path}</code>
      </div>
      <p className="text-slate-300 mb-3">{description}</p>
      {children}
    </div>
  );
}
