import { Download, Key } from 'lucide-react';

export default function APIOverviewPage() {
  return (
    <div className="space-y-8">
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-4xl font-bold">API Overview & Authentication</h1>
        <p className="text-slate-400 mt-2">Base URL : https://api.powalyze.com/v1</p>
      </div>

      <div className="space-y-6">
        <Section title="Authentication">
          <p>Toutes les requêtes nécessitent une clé API :</p>
          <pre className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-sm text-green-400 mt-3">
{`Authorization: Bearer pk_live_xxxxx`}
          </pre>
        </Section>

        <Section title="Rate Limits">
          <ul className="list-disc list-inside ml-4 mt-2">
            <li><strong>Demo :</strong> 100 req/heure</li>
            <li><strong>Pro :</strong> 1000 req/heure</li>
            <li><strong>Enterprise :</strong> Illimité</li>
          </ul>
        </Section>

        <Section title="Response Format">
          <pre className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-sm text-green-400 mt-3">
{`{
  "data": { ... },
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 150
  }
}`}
          </pre>
        </Section>
      </div>

      <div className="flex justify-center pt-8">
        <a href="/docs/api-overview.pdf" className="flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold shadow-lg transition-all">
          <Download size={20} />
          Télécharger le PDF
        </a>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <div className="text-slate-300 space-y-2">{children}</div>
    </div>
  );
}
