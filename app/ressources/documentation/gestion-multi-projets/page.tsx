import { Download, FolderKanban } from 'lucide-react';

export default function GestionMultiProjetsPage() {
  return (
    <div className="space-y-8">
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400/20 to-cyan-600/20 flex items-center justify-center">
            <FolderKanban className="text-cyan-400" size={24} />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Gestion Multi-Projets</h1>
            <p className="text-slate-400 mt-1">Pilotez votre portefeuille à 360°</p>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
        <h2 className="text-xl font-bold mb-3">Résumé</h2>
        <p className="text-slate-300 leading-relaxed">
          Gérez plusieurs projets simultanément avec des vues consolidées. Identifiez les dépendances, 
          optimisez l'allocation des ressources et suivez la santé globale du portefeuille.
        </p>
      </div>

      <div className="space-y-6">
        <Step number={1} title="Vue Portefeuille">
          <p>Accédez à <strong>Cockpit → Portefeuille</strong></p>
          <p>Visualisations disponibles :</p>
          <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
            <li><strong>Grille RAG</strong> : Statut vert/orange/rouge par projet</li>
            <li><strong>Timeline</strong> : Roadmap Gantt interactive</li>
            <li><strong>Budget tracker</strong> : Dépenses vs. Budget alloué</li>
            <li><strong>Matrice risques</strong> : Vue agrégée des menaces</li>
          </ul>
        </Step>

        <Step number={2} title="Dépendances inter-projets">
          <p>1. Ouvrez un projet</p>
          <p>2. Section <strong>Dépendances</strong></p>
          <p>3. Cliquez sur "+ Ajouter dépendance"</p>
          <p>4. Sélectionnez le projet bloquant/bloqué</p>
          <p>5. Type : Finish-to-Start, Start-to-Start, etc.</p>
          <div className="mt-3 p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
            <p className="text-sm"><strong>Alerte automatique :</strong> Powalyze vous notifie si un projet dépendant est en retard</p>
          </div>
        </Step>

        <Step number={3} title="Allocation des ressources">
          <p>1. <strong>Cockpit → Ressources</strong></p>
          <p>2. Vue globale : FTE disponible vs. alloué</p>
          <p>3. Glissez-déposez les personnes entre projets</p>
          <p>4. Visualisez les sur-allocations (rouge)</p>
        </Step>

        <Step number={4} title="Rapports consolidés">
          <p>Générez un rapport exécutif couvrant :</p>
          <ul className="list-disc list-inside ml-4 mt-2">
            <li>Santé globale du portefeuille</li>
            <li>Top 10 risques transverses</li>
            <li>Budget total consommé</li>
            <li>Prochaines échéances critiques</li>
          </ul>
        </Step>
      </div>

      <div className="flex justify-center pt-8">
        <a
          href="/docs/gestion-multi-projets.pdf"
          className="flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold shadow-lg transition-all"
        >
          <Download size={20} />
          Télécharger le guide PDF
        </a>
      </div>
    </div>
  );
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center font-bold text-white flex-shrink-0">
        {number}
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <div className="text-slate-300 space-y-2">{children}</div>
      </div>
    </div>
  );
}
