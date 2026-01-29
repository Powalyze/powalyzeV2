import { Download, FileCheck } from 'lucide-react';

export default function RegistreDecisionsPage() {
  return (
    <div className="space-y-8">
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-4xl font-bold">Registre des décisions</h1>
        <p className="text-slate-400 mt-2">Traçabilité complète des arbitrages</p>
      </div>

      <div className="space-y-6">
        <Section title="Enregistrer une décision">
          <p>1. Cockpit → Décisions → Nouvelle décision</p>
          <p>2. Remplissez : Titre, Contexte, Options évaluées</p>
          <p>3. Décision prise + Justification</p>
          <p>4. Assignez un responsable de mise en œuvre</p>
        </Section>

        <Section title="Workflow d'approbation">
          <p>Définissez un circuit de validation :</p>
          <ul className="list-disc list-inside ml-4 mt-2">
            <li>Draft → Soumise → En révision → Approuvée/Rejetée</li>
            <li>Notifications automatiques aux validateurs</li>
            <li>Commentaires et échanges tracés</li>
          </ul>
        </Section>

        <Section title="Traçabilité auditable">
          <p>Chaque modification est horodatée avec l'auteur. Impossible de supprimer une décision approuvée.</p>
        </Section>
      </div>

      <div className="flex justify-center pt-8">
        <a href="/docs/registre-decisions.pdf" className="flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold shadow-lg transition-all">
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
