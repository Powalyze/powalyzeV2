import { Download, LayoutDashboard } from 'lucide-react';

export default function GuideCockpitPage() {
  return (
    <div className="space-y-8">
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-4xl font-bold">Guide complet du cockpit</h1>
        <p className="text-slate-400 mt-2">Maîtrisez votre tableau de bord exécutif</p>
      </div>

      <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
        <h2 className="text-xl font-bold mb-3">Vue d'ensemble</h2>
        <p className="text-slate-300 leading-relaxed">
          Le cockpit Powalyze centralise toutes vos données de gouvernance : projets, risques, décisions, ressources, 
          rapports Power BI. Interface personnalisable selon vos besoins.
        </p>
      </div>

      <div className="space-y-4">
        <Module title="Dashboard principal" features={[
          "KPI en temps réel",
          "Widgets drag & drop",
          "Filtres dynamiques",
          "Export PDF/Excel"
        ]} />
        <Module title="Projets" features={[
          "Vue grille/liste/Kanban",
          "Statut RAG",
          "Timeline Gantt",
          "Dépendances"
        ]} />
        <Module title="Risques" features={[
          "Matrice 5×5",
          "Heatmap interactive",
          "Plans de mitigation",
          "Alertes auto"
        ]} />
        <Module title="Décisions" features={[
          "Registre traçable",
          "Workflow d'approbation",
          "Historique complet",
          "Tags & recherche"
        ]} />
      </div>

      <div className="flex justify-center pt-8">
        <a href="/docs/guide-cockpit.pdf" className="flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold shadow-lg transition-all">
          <Download size={20} />
          Télécharger le guide PDF
        </a>
      </div>
    </div>
  );
}

function Module({ title, features }: { title: string; features: string[] }) {
  return (
    <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
      <h3 className="font-bold mb-2">{title}</h3>
      <ul className="space-y-1 text-sm text-slate-300">
        {features.map((f, i) => <li key={i}>• {f}</li>)}
      </ul>
    </div>
  );
}
