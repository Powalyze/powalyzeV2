import { Download, AlertCircle } from 'lucide-react';

export default function APIRisksPage() {
  return (
    <div className="space-y-8">
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-4xl font-bold">Risks API</h1>
      </div>
      <div className="space-y-6">
        <p className="text-slate-300">Endpoints :</p>
        <ul className="list-disc list-inside space-y-2 text-slate-300">
          <li><code className="text-green-400">GET /v1/risks</code> - Liste tous les risques</li>
          <li><code className="text-green-400">POST /v1/risks</code> - Créer un risque</li>
          <li><code className="text-green-400">PUT /v1/risks/:id</code> - Mettre à jour</li>
          <li><code className="text-green-400">DELETE /v1/risks/:id</code> - Supprimer</li>
        </ul>
      </div>
      <div className="flex justify-center pt-8">
        <a href="/docs/api-risks.pdf" className="flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold shadow-lg">
          <Download size={20} />Télécharger le PDF
        </a>
      </div>
    </div>
  );
}
