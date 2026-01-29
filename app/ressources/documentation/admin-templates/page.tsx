import { Download, FileText } from 'lucide-react';
export default function AdminTemplatesPage() {
  return (<div className="space-y-8"><div className="border-b border-slate-800 pb-6"><h1 className="text-4xl font-bold">Templates personnalisés</h1></div><div className="space-y-6"><p className="text-slate-300">Créez des templates réutilisables pour projets, rapports et documents.</p></div><div className="flex justify-center pt-8"><a href="/docs/admin-templates.pdf" className="flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold shadow-lg"><Download size={20} />Télécharger le PDF</a></div></div>);
}
