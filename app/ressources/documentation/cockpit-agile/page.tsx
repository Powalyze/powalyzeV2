import { Download, Zap, BarChart3, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function CockpitAgilePage() {
  return (
    <div className="space-y-8">
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400/20 to-blue-600/20 flex items-center justify-center">
            <Zap className="text-blue-400" size={24} />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Créer un Cockpit Agile</h1>
            <p className="text-slate-400 mt-1">Pilotage Scrum/Kanban en temps réel</p>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
        <h2 className="text-xl font-bold mb-3">Résumé</h2>
        <p className="text-slate-300 leading-relaxed">
          Configurez un cockpit Agile complet pour suivre vos sprints, burndown charts, vélocité d'équipe 
          et story points. Intégrez Jira ou Azure DevOps pour synchroniser automatiquement vos user stories, 
          bugs et épics. Visualisez la santé de vos itérations en un coup d'œil.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">Configuration Sprint</h2>
        <div className="space-y-6">
          <Step number={1} title="Activer le mode Agile">
            <p>1. Allez dans <strong>Cockpit → Méthodologie</strong></p>
            <p>2. Sélectionnez "Agile/Scrum" ou "Kanban"</p>
            <p>3. Définissez la durée de sprint (1-4 semaines)</p>
            <p>4. Configurez les cérémonies (Daily, Review, Retro)</p>
          </Step>

          <Step number={2} title="Créer le Product Backlog">
            <p>1. Accédez à <strong>Projets → Backlog</strong></p>
            <p>2. Ajoutez vos user stories</p>
            <p>3. Estimez en story points</p>
            <p>4. Priorisez avec le Product Owner</p>
            <div className="mt-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
              <p className="text-sm"><strong>Format recommandé :</strong> En tant que [rôle], je veux [action], afin de [bénéfice]</p>
            </div>
          </Step>

          <Step number={3} title="Lancer le Sprint">
            <p>1. Cliquez sur "Nouveau Sprint"</p>
            <p>2. Sélectionnez les stories à inclure</p>
            <p>3. Définissez l'objectif du sprint</p>
            <p>4. Validez et démarrez le chronomètre</p>
          </Step>

          <Step number={4} title="Suivre la vélocité">
            <p>Powalyze calcule automatiquement :</p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Vélocité moyenne sur les 3 derniers sprints</li>
              <li>Burndown chart en temps réel</li>
              <li>Taux de complétion des stories</li>
              <li>Prédictions basées sur l'IA</li>
            </ul>
          </Step>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30">
        <h2 className="text-2xl font-bold mb-4">Bonnes pratiques Agile</h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <CheckCircle2 className="text-green-400 flex-shrink-0 mt-1" size={20} />
            <span><strong>Story mapping :</strong> Organisez visuellement vos epics et stories</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="text-green-400 flex-shrink-0 mt-1" size={20} />
            <span><strong>WIP limits :</strong> Limitez le travail en cours pour optimiser le flux</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="text-green-400 flex-shrink-0 mt-1" size={20} />
            <span><strong>Retrospectives :</strong> Documentez les actions d'amélioration</span>
          </li>
        </ul>
      </div>

      <div className="flex justify-center pt-8">
        <a
          href="/docs/cockpit-agile.pdf"
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
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center font-bold text-white flex-shrink-0">
        {number}
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <div className="text-slate-300 space-y-2">{children}</div>
      </div>
    </div>
  );
}
