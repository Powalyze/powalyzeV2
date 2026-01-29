import { Download, FolderOpen } from 'lucide-react';

export default function GestionProjetsPage() {
  return (
    <div className="space-y-8">
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-4xl font-bold">Gestion des projets</h1>
        <p className="text-slate-400 mt-2">Pilotage complet du cycle de vie</p>
      </div>

      <div className="space-y-6">
        <Section title="Créer un projet">
          <p>1. Cockpit → Projets → Nouveau projet</p>
          <p>2. Remplissez : Nom, Description, Owner, Dates, Budget</p>
          <p>3. Choisissez la méthodologie : Agile / Waterfall / Hermes</p>
        </Section>

        <Section title="Suivre l'avancement">
          <p>Indicateurs clés :</p>
          <ul className="list-disc list-inside ml-4 mt-2">
            <li>% Completion (auto-calculé depuis les tasks)</li>
            <li>Budget consommé vs. alloué</li>
            <li>Date fin prévue vs. deadline</li>
            <li>Vélocité (story points/sprint si Agile)</li>
          </ul>
        </Section>

        <Section title="Gérer les dépendances">
          <p>Liez les projets entre eux pour visualiser les impacts en cascade.</p>
        </Section>
      </div>

      <div className="flex justify-center pt-8">
        <a href="/docs/gestion-projets.pdf" className="flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold shadow-lg transition-all">
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
