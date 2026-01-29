import { Download, Target, TrendingUp } from 'lucide-react';

export default function CockpitEfficacePage() {
  return (
    <div className="space-y-8">
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/20 flex items-center justify-center">
            <Target className="text-amber-400" size={24} />
          </div>
          <div>
            <h1 className="text-4xl font-bold">10 règles d'or pour un cockpit efficace</h1>
            <p className="text-slate-400 mt-1">Bonnes pratiques de gouvernance</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <Rule number={1} title="Définissez 5-7 KPI maximum">
          <p>Un cockpit surchargé perd en impact. Concentrez-vous sur :</p>
          <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
            <li>% projets GREEN/YELLOW/RED</li>
            <li>Budget global (€ dépensé vs. alloué)</li>
            <li>Top 3 risques critiques</li>
            <li>Vélocité des équipes Agile</li>
            <li>Taux de décisions closes dans les délais</li>
          </ul>
        </Rule>

        <Rule number={2} title="Mettez à jour hebdomadairement minimum">
          <p>Un cockpit obsolète est inutile. Ritualisez :</p>
          <ul className="list-disc list-inside ml-4 mt-2">
            <li>Vendredi 16h : MAJ des statuts projets</li>
            <li>Alerte automatique si pas de mise à jour en 7 jours</li>
          </ul>
        </Rule>

        <Rule number={3} title="Utilisez les codes couleur RAG systématiquement">
          <p>🟢 GREEN : Tout est sous contrôle<br/>
          🟡 YELLOW : Vigilance requise, risques identifiés<br/>
          🔴 RED : Escalade immédiate nécessaire</p>
        </Rule>

        <Rule number={4} title="Liez risques et décisions">
          <p>Chaque risque majeur doit déclencher une décision formelle. Tracez le lien.</p>
        </Rule>

        <Rule number={5} title="Automatisez les rapports récurrents">
          <p>Configurez l'IA pour générer :</p>
          <ul className="list-disc list-inside ml-4 mt-2">
            <li>Brief hebdomadaire (envoyé le lundi)</li>
            <li>Rapport COMEX mensuel</li>
            <li>Alertes critiques en temps réel</li>
          </ul>
        </Rule>

        <Rule number={6} title="Donnez un propriétaire à chaque élément">
          <p>Pas de projet/risque/décision sans owner désigné. Accountability absolue.</p>
        </Rule>

        <Rule number={7} title="Revoyez le portefeuille en steering mensuel">
          <p>1 heure/mois pour arbitrer :</p>
          <ul className="list-disc list-inside ml-4 mt-2">
            <li>Stop/Go/Pivot des projets</li>
            <li>Réallocation des ressources</li>
            <li>Validation des décisions majeures</li>
          </ul>
        </Rule>

        <Rule number={8} title="Archivez, ne supprimez pas">
          <p>Gardez l'historique pour les audits et rétrospectives.</p>
        </Rule>

        <Rule number={9} title="Formez les nouveaux arrivants">
          <p>10 minutes d'onboarding pour comprendre le cockpit suffisent.</p>
        </Rule>

        <Rule number={10} title="Mesurez l'adoption">
          <p>Track : Taux de connexion, fréquence de MAJ, satisfaction utilisateurs.</p>
        </Rule>
      </div>

      <div className="flex justify-center pt-8">
        <a href="/docs/cockpit-efficace.pdf" className="flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold shadow-lg transition-all">
          <Download size={20} />
          Télécharger le PDF
        </a>
      </div>
    </div>
  );
}

function Rule({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/50 transition-colors">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-slate-950 flex-shrink-0">
          {number}
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <div className="text-slate-300 space-y-2">{children}</div>
        </div>
      </div>
    </div>
  );
}
