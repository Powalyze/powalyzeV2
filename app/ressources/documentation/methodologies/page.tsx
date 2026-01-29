import { Download, GitBranch } from 'lucide-react';

export default function MethodologiesPage() {
  return (
    <div className="space-y-8">
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-4xl font-bold">Configuration des méthodologies</h1>
        <p className="text-slate-400 mt-2">Agile, Waterfall, Hermès, Hybride</p>
      </div>

      <div className="space-y-6">
        <Method title="Agile / Scrum">
          <ul className="list-disc list-inside ml-4 mt-2">
            <li>Sprints de 1-4 semaines</li>
            <li>Burndown charts automatiques</li>
            <li>Cérémonies : Daily, Review, Retro</li>
            <li>Backlog priorisé</li>
          </ul>
        </Method>

        <Method title="Waterfall / Cycle en V">
          <ul className="list-disc list-inside ml-4 mt-2">
            <li>Phases séquentielles : Analyse → Design → Build → Test → Deploy</li>
            <li>Jalons avec gates de validation</li>
            <li>Gantt classique</li>
          </ul>
        </Method>

        <Method title="Hermès (Suisse)">
          <ul className="list-disc list-inside ml-4 mt-2">
            <li>Modules : Initialisation, Conception, Réalisation, Déploiement, Clôture</li>
            <li>Livrables formels à chaque phase</li>
            <li>Conformité administration publique</li>
          </ul>
        </Method>

        <Method title="Hybride">
          <ul className="list-disc list-inside ml-4 mt-2">
            <li>Mix Agile + Waterfall selon les workstreams</li>
            <li>Flexible et adaptatif</li>
          </ul>
        </Method>
      </div>

      <div className="flex justify-center pt-8">
        <a href="/docs/methodologies.pdf" className="flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold shadow-lg transition-all">
          <Download size={20} />
          Télécharger le PDF
        </a>
      </div>
    </div>
  );
}

function Method({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <div className="text-slate-300">{children}</div>
    </div>
  );
}
