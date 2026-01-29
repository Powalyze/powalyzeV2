import { Download, Sparkles, Brain } from 'lucide-react';

export default function IANarrativePage() {
  return (
    <div className="space-y-8">
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400/20 to-purple-600/20 flex items-center justify-center">
            <Sparkles className="text-purple-400" size={24} />
          </div>
          <div>
            <h1 className="text-4xl font-bold">IA Narrative et Rapports</h1>
            <p className="text-slate-400 mt-1">Génération automatique de synthèses exécutives</p>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
        <h2 className="text-xl font-bold mb-3">Résumé</h2>
        <p className="text-slate-300 leading-relaxed">
          L'IA de Powalyze analyse vos projets, risques et décisions pour générer des narratives claires 
          et percutantes. Créez des rapports COMEX, briefs exécutifs et documents de gouvernance en quelques secondes.
        </p>
      </div>

      <div className="space-y-6">
        <Step number={1} title="Activer l'IA narrative">
          <p>1. <strong>Cockpit → Paramètres → IA & Automatisations</strong></p>
          <p>2. Activez "Génération de narratives"</p>
          <p>3. Choisissez le modèle : GPT-4, Claude ou Azure OpenAI</p>
          <p>4. Définissez le ton : Formel, Exécutif, Technique</p>
        </Step>

        <Step number={2} title="Générer un rapport COMEX">
          <p>1. Allez dans <strong>Committee Prep</strong></p>
          <p>2. Sélectionnez "Brief Exécutif"</p>
          <p>3. L'IA analyse automatiquement :
            <ul className="list-disc list-inside ml-4 mt-2">
              <li>Projets critiques (statut RED)</li>
              <li>Top 5 risques</li>
              <li>Décisions stratégiques récentes</li>
              <li>KPI en dérive</li>
            </ul>
          </p>
          <p>4. Cliquez sur "Générer" → Document prêt en 10s</p>
        </Step>

        <Step number={3} title="Personnaliser les prompts">
          <p>Vous pouvez modifier les instructions :</p>
          <pre className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-sm text-green-400 mt-3">
{`Prompt exemple:
"Rédige une synthèse exécutive de 500 mots
maximum, en mettant l'accent sur les décisions
à prendre et les risques financiers.
Utilise un ton factuel et précis."`}
          </pre>
        </Step>

        <Step number={4} title="Exporter et partager">
          <p>Formats disponibles :</p>
          <ul className="list-disc list-inside ml-4 mt-2">
            <li>PDF premium (avec logo et charte)</li>
            <li>Word (.docx) éditable</li>
            <li>Markdown pour Confluence/Notion</li>
            <li>Email direct aux stakeholders</li>
          </ul>
        </Step>
      </div>

      <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Brain size={24} className="text-purple-400" />
          Capacités de l'IA
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <AICapability
            title="Analyse de sentiment"
            description="Détecte les alertes faibles dans les commentaires"
          />
          <AICapability
            title="Prédictions"
            description="Probabilité de retard/dérapage basée sur l'historique"
          />
          <AICapability
            title="Recommandations"
            description="Actions prioritaires pour le PMO"
          />
          <AICapability
            title="Résumés multilingues"
            description="Traduit les rapports en FR/EN/DE automatiquement"
          />
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <a
          href="/docs/ia-narrative.pdf"
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
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center font-bold text-white flex-shrink-0">
        {number}
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <div className="text-slate-300 space-y-2">{children}</div>
      </div>
    </div>
  );
}

function AICapability({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  );
}
