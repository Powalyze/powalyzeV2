import { Download, AlertTriangle } from 'lucide-react';

export default function CartographieRisquesPage() {
  return (
    <div className="space-y-8">
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-4xl font-bold">Cartographie des risques</h1>
        <p className="text-slate-400 mt-2">Visualisez et mitigez les menaces</p>
      </div>

      <div className="space-y-6">
        <Section title="Créer un risque">
          <p>1. Cockpit → Risques → Nouveau risque</p>
          <p>2. Catégorie : Technique, Budget, RH, Réglementaire...</p>
          <p>3. Évaluez Probabilité (1-5) et Impact (1-5)</p>
          <p>4. Criticité calculée automatiquement</p>
        </Section>

        <Section title="Plans de mitigation">
          <p>Pour chaque risque majeur :</p>
          <ul className="list-disc list-inside ml-4 mt-2">
            <li>Action préventive (réduire la probabilité)</li>
            <li>Action corrective (réduire l'impact)</li>
            <li>Plan de contingence (si le risque se matérialise)</li>
            <li>Owner + deadline</li>
          </ul>
        </Section>

        <Section title="Alertes automatiques">
          <p>Powalyze notifie le PMO si :</p>
          <ul className="list-disc list-inside ml-4 mt-2">
            <li>Un risque passe en zone rouge</li>
            <li>Une action de mitigation est en retard</li>
            <li>Un risque est réalisé</li>
          </ul>
        </Section>
      </div>

      <div className="flex justify-center pt-8">
        <a href="/docs/cartographie-risques.pdf" className="flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold shadow-lg transition-all">
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
