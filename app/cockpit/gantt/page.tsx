import { GanttChart } from "@/components/cockpit/GanttChart";

export default function GanttPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Diagramme de Gantt</h1>
          <p className="text-slate-400">
            Visualisez la timeline complète de votre portfolio de projets
          </p>
        </div>
      </div>

      <GanttChart />

      {/* Legend & Tips */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="font-bold text-white mb-4">💡 Conseils d'utilisation</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-amber-400">•</span>
              Glissez-déposez les barres pour ajuster les dates
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400">•</span>
              Utilisez les poignées pour redimensionner la durée
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400">•</span>
              Les flèches indiquent les dépendances entre tâches
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400">•</span>
              Cliquez sur une tâche pour voir les détails
            </li>
          </ul>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="font-bold text-white mb-4">📊 Statistiques</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Nombre de phases</span>
              <span className="font-bold text-white">5</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Durée totale</span>
              <span className="font-bold text-white">6 mois</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Progression globale</span>
              <span className="font-bold text-white">43%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Chemin critique</span>
              <span className="font-bold text-red-400">Phase 3 → 4</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
