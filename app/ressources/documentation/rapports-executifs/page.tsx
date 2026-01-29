import { Download, FileText } from 'lucide-react';

export default function RapportsExecutifsPage() {
  return (
    <div className="space-y-8">
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-4xl font-bold">Rapports exécutifs impactants</h1>
        <p className="text-slate-400 mt-2">Communiquez clairement au COMEX</p>
      </div>

      <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
        <h2 className="text-xl font-bold mb-4">Structure idéale (1 page A4)</h2>
        <div className="space-y-3 text-slate-300">
          <Section title="1. Executive Summary (3 lignes)" content="L'essentiel en 30 secondes de lecture" />
          <Section title="2. RAG Status" content="Visualisation immédiate : 🟢 3 projets OK | 🟡 2 en vigilance | 🔴 1 critique" />
          <Section title="3. Top 3 Décisions requises" content="Listez uniquement les arbitrages urgents" />
          <Section title="4. Top 3 Risques" content="Les menaces majeures du moment" />
          <Section title="5. Next Steps" content="2-3 actions concrètes pour les 15 prochains jours" />
        </div>
      </div>

      <div className="p-6 rounded-xl bg-amber-500/10 border border-amber-500/30">
        <h3 className="text-xl font-bold mb-3">Règles d'or</h3>
        <ul className="space-y-2 text-slate-300">
          <li>✅ Aller droit au but (pas de jargon technique)</li>
          <li>✅ Chiffres clés : €, %, dates</li>
          <li>✅ Graphiques simples (pas de camemberts 3D)</li>
          <li>✅ Highlight en gras les points critiques</li>
          <li>❌ Éviter les pavés de texte</li>
          <li>❌ Pas de détails opérationnels</li>
        </ul>
      </div>

      <div className="flex justify-center pt-8">
        <a href="/docs/rapports-executifs.pdf" className="flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold shadow-lg transition-all">
          <Download size={20} />
          Télécharger le template
        </a>
      </div>
    </div>
  );
}

function Section({ title, content }: { title: string; content: string }) {
  return (
    <div className="pl-4 border-l-2 border-amber-500">
      <h4 className="font-semibold">{title}</h4>
      <p className="text-sm text-slate-400">{content}</p>
    </div>
  );
}
