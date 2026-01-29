import { Download } from 'lucide-react';
export default function APIReportsPage() {
  return (<div className="space-y-8"><div className="border-b border-slate-800 pb-6"><h1 className="text-4xl font-bold">Reports API</h1></div><div className="space-y-6"><p className="text-slate-300">Générez et récupérez des rapports via API.</p><code className="block p-4 rounded-lg bg-slate-950 border border-slate-800 text-sm text-green-400">POST /v1/reports/generate</code></div><div className="flex justify-center pt-8"><a href="/docs/api-reports.pdf" className="flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold shadow-lg"><Download size={20} />Télécharger le PDF</a></div></div>);
}
