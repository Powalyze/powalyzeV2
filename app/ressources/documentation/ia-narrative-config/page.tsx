import { Download, Brain } from 'lucide-react';
export default function IANarrativeConfigPage() {
  return (<div className="space-y-8"><div className="border-b border-slate-800 pb-6"><h1 className="text-4xl font-bold">Configurer l'IA narrative</h1></div><div className="space-y-6"><p className="text-slate-300">Personnalisez les prompts, choisissez le modèle (GPT-4, Claude), définissez le ton (formel/exécutif/technique).</p></div><div className="flex justify-center pt-8"><a href="/docs/ia-narrative-config.pdf" className="flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold shadow-lg"><Download size={20} />Télécharger le PDF</a></div></div>);
}
