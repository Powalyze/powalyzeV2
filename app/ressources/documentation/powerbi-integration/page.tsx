import { Download, BarChart3, CheckCircle2 } from 'lucide-react';

export default function PowerBIIntegrationPage() {
  return (
    <div className="space-y-8">
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 flex items-center justify-center">
            <BarChart3 className="text-yellow-400" size={24} />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Power BI Integration</h1>
            <p className="text-slate-400 mt-1">Rapports visuels avancés</p>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
        <h2 className="text-xl font-bold mb-3">Résumé</h2>
        <p className="text-slate-300 leading-relaxed">
          Connectez vos données Powalyze à Power BI pour créer des tableaux de bord personnalisés. 
          Exploitez les modèles pré-configurés ou construisez vos propres rapports avec DirectQuery ou Import.
        </p>
      </div>

      <div className="space-y-6">
        <Step number={1} title="Générer les identifiants API">
          <p>1. Allez dans <strong>Paramètres → Intégrations → Power BI</strong></p>
          <p>2. Cliquez sur "Générer une clé API"</p>
          <p>3. Copiez le token (il ne sera affiché qu'une fois)</p>
          <p>4. Notez l'URL de l'endpoint : <code className="text-green-400">https://api.powalyze.com/v1/</code></p>
        </Step>

        <Step number={2} title="Configurer la source de données">
          <p>Dans Power BI Desktop :</p>
          <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
            <li>Obtenir les données → Web</li>
            <li>URL : <code className="text-green-400">https://api.powalyze.com/v1/projects</code></li>
            <li>Authentification : Clé API</li>
            <li>Collez votre token</li>
          </ul>
        </Step>

        <Step number={3} title="Importer les tables">
          <p>Tables disponibles :</p>
          <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
            <li><strong>projects</strong> : Liste des projets</li>
            <li><strong>risks</strong> : Matrice des risques</li>
            <li><strong>decisions</strong> : Registre des décisions</li>
            <li><strong>reports</strong> : Rapports générés par IA</li>
          </ul>
        </Step>

        <Step number={4} title="Publier sur Power BI Service">
          <p>1. Cliquez sur Publier</p>
          <p>2. Sélectionnez votre workspace</p>
          <p>3. Configurez l'actualisation automatique (horaire/quotidienne)</p>
          <p>4. Partagez le rapport avec votre équipe</p>
        </Step>
      </div>

      <div className="p-6 rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30">
        <h2 className="text-2xl font-bold mb-4">Modèles pré-construits</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <TemplateCard
            title="Executive Dashboard"
            metrics="RAG status, KPI, Tendances"
          />
          <TemplateCard
            title="Portfolio View"
            metrics="Vue multi-projets, Budget, Timeline"
          />
          <TemplateCard
            title="Risk Heatmap"
            metrics="Cartographie dynamique"
          />
          <TemplateCard
            title="Financial Tracking"
            metrics="Coûts, CAPEX/OPEX, Forecast"
          />
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <a
          href="/docs/powerbi-integration.pdf"
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
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-600 flex items-center justify-center font-bold text-white flex-shrink-0">
        {number}
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <div className="text-slate-300 space-y-2">{children}</div>
      </div>
    </div>
  );
}

function TemplateCard({ title, metrics }: { title: string; metrics: string }) {
  return (
    <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-slate-400">{metrics}</p>
    </div>
  );
}
