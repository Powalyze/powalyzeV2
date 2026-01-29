import { Download, Sparkles } from 'lucide-react';

export default function RapportsIAPage() {
  return (
    <div className="space-y-8">
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-4xl font-bold">Génération de rapports IA</h1>
        <p className="text-slate-400 mt-2">Synthèses intelligentes en quelques secondes</p>
      </div>

      <div className="space-y-6">
        <Section title="Types de rapports disponibles">
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Brief exécutif</strong> : 1 page pour COMEX</li>
            <li><strong>Rapport de gouvernance</strong> : Document complet multi-projets</li>
            <li><strong>Analyse de risques</strong> : Deep dive sur les menaces</li>
            <li><strong>Post-mortem projet</strong> : Lessons learned</li>
          </ul>
        </Section>

        <Section title="Personnaliser le prompt">
          <p>Modifiez les instructions IA selon vos besoins :</p>
          <pre className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-sm text-green-400 mt-3">
{`"Génère un rapport mensuel mettant l'accent sur 
les coûts et les écarts de planning. Utilise un 
ton formel et factuel. 800 mots maximum."`}
          </pre>
        </Section>

        <Section title="Formats d'export">
          <ul className="list-disc list-inside ml-4 mt-2">
            <li>PDF premium (avec charte graphique)</li>
            <li>Word éditable</li>
            <li>Markdown</li>
            <li>HTML embarquable</li>
          </ul>
        </Section>
      </div>

      <div className="flex justify-center pt-8">
        <a href="/docs/rapports-ia.pdf" className="flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold shadow-lg transition-all">
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
