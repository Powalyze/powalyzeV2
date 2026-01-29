import { Download, ListTree } from 'lucide-react';

export default function StructurerBacklogPage() {
  return (
    <div className="space-y-8">
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-4xl font-bold">Comment bien structurer son backlog</h1>
        <p className="text-slate-400 mt-2">Hiérarchie Epics → Stories → Tasks</p>
      </div>

      <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
        <h2 className="text-xl font-bold mb-3">Structure recommandée</h2>
        <pre className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-sm overflow-x-auto">
          <code className="text-green-400">{`📦 Epic : Refonte plateforme CRM
  📝 Story : En tant qu'utilisateur, je veux rechercher un contact
    ✅ Task : Design mockup recherche
    ✅ Task : API endpoint /search
    ✅ Task : Tests unitaires
  📝 Story : En tant que manager, je veux exporter les données
    ✅ Task : Bouton export CSV
    ✅ Task : Génération asynchrone`}</code>
        </pre>
      </div>

      <div className="space-y-4">
        <BestPractice
          title="Critères INVEST pour les stories"
          points={[
            "Independent : Pas de dépendance bloquante",
            "Negotiable : Discutable avec l'équipe",
            "Valuable : Apporte de la valeur business",
            "Estimable : L'équipe peut estimer en story points",
            "Small : Tient dans un sprint",
            "Testable : Critères d'acceptation clairs"
          ]}
        />

        <BestPractice
          title="Priorisation MoSCoW"
          points={[
            "Must have : Fonctionnalités critiques",
            "Should have : Important mais pas bloquant",
            "Could have : Nice-to-have",
            "Won't have : Hors scope"
          ]}
        />
      </div>

      <div className="flex justify-center pt-8">
        <a href="/docs/structurer-backlog.pdf" className="flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold shadow-lg transition-all">
          <Download size={20} />
          Télécharger le PDF
        </a>
      </div>
    </div>
  );
}

function BestPractice({ title, points }: { title: string; points: string[] }) {
  return (
    <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <ul className="space-y-2">
        {points.map((point, i) => (
          <li key={i} className="flex items-start gap-2 text-slate-300">
            <span className="text-amber-400 font-bold">→</span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
