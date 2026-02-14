"use client";

import Link from "next/link";
import { ArrowRight, Play, CheckCircle, BarChart3, Shield, FileText, Users, Zap, Brain } from "lucide-react";

export default function DemoInteractivePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-sm font-semibold mb-6">
            <Play size={16} />
            <span>Démo en direct</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400">
            Testez Powalyze<br />en 2 minutes
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto">
            Découvrez le cockpit exécutif intelligent en action.<br />
            Aucune installation requise.
          </p>
        </div>
      </section>

      {/* Video/Demo Section */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900">
            {/* Demo Video Placeholder */}
            <div className="aspect-video bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-500/30 flex items-center justify-center mx-auto mb-6 hover:bg-emerald-500/30 transition-all cursor-pointer">
                  <Play size={40} className="text-emerald-400 ml-2" />
                </div>
                <p className="text-xl text-slate-300 font-semibold mb-2">Démo vidéo interactive</p>
                <p className="text-sm text-slate-400">Cliquez pour découvrir Powalyze en action</p>
              </div>
            </div>

            {/* Video Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 to-transparent p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-400">
                  <span className="font-semibold text-white">Durée:</span> 2:34
                </div>
                <Link
                  href="/contact"
                  className="px-6 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-all"
                >
                  Réserver ma démo personnalisée
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Features */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Explorez les fonctionnalités clés</h2>
            <p className="text-xl text-slate-300">Découvrez ce que vous pouvez faire avec Powalyze</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <DemoFeature
              icon={<BarChart3 size={32} />}
              title="Vue Portefeuille 360°"
              description="42 projets • Santé RAG en temps réel • KPIs automatisés"
              demoLink="/cockpit/projets"
              color="blue"
            />
            <DemoFeature
              icon={<Brain size={32} />}
              title="IA Chief of Staff"
              description="6 actions prioritaires • Prédictions • Insights"
              demoLink="/cockpit/projets"
              color="purple"
            />
            <DemoFeature
              icon={<Shield size={32} />}
              title="Gestion des Risques"
              description="Matrice RAG • 89 risques tracés • Plans de mitigation"
              demoLink="/cockpit/projets"
              color="red"
            />
            <DemoFeature
              icon={<FileText size={32} />}
              title="Décisions Tracées"
              description="156 décisions • Workflow d'approbation • Historique complet"
              demoLink="/cockpit/projets"
              color="amber"
            />
            <DemoFeature
              icon={<Users size={32} />}
              title="Gestion Ressources"
              description="Pool 127 ressources • Matrice compétences • Allocations"
              demoLink="/cockpit/projets"
              color="green"
            />
            <DemoFeature
              icon={<Zap size={32} />}
              title="Power BI Intégré"
              description="Import .pbix • Viewer embed • Tokens sécurisés"
              demoLink="/cockpit/projets"
              color="sky"
            />
          </div>
        </div>
      </section>

      {/* Quick Tour Steps */}
      <section className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Parcours guidé de 2 minutes</h2>
            <p className="text-xl text-slate-300">Suivez ce parcours pour découvrir l'essentiel</p>
          </div>

          <div className="space-y-6">
            <TourStep
              number="1"
              title="Connexion à l'environnement démo"
              description="Accédez instantanément à un portefeuille de 42 projets pré-configuré"
              time="15 sec"
            />
            <TourStep
              number="2"
              title="Explorez le dashboard exécutif"
              description="Visualisez la santé de votre portefeuille en un coup d'œil: RAG status, budgets, vélocité"
              time="30 sec"
            />
            <TourStep
              number="3"
              title="Consultez les recommandations IA"
              description="Découvrez les 6 actions prioritaires générées par l'IA Chief of Staff"
              time="30 sec"
            />
            <TourStep
              number="4"
              title="Naviguez dans les modules"
              description="Projets, Risques, Décisions, Ressources, Power BI: testez chaque module"
              time="45 sec"
            />
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/cockpit/projets"
              className="inline-flex items-center gap-2 px-10 py-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xl shadow-lg transition-all"
            >
              Démarrer la démo maintenant
              <ArrowRight size={24} />
            </Link>
            <p className="mt-4 text-sm text-slate-400">Aucune installation • Aucune inscription • Accès immédiat</p>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Cas d'usage réels</h2>
            <p className="text-xl text-slate-300">Scénarios que vous pouvez tester dans la démo</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <UseCaseCard
              title="Préparer un COMEX en 5 minutes"
              description="Générez automatiquement un rapport exécutif complet avec l'IA: synthèse portfolio, actions prioritaires, risques critiques, recommandations."
              icon="📊"
            />
            <UseCaseCard
              title="Identifier les projets à risque"
              description="Filtrez les projets en statut ROUGE, consultez les risques associés, visualisez les plans de mitigation et les décisions en attente."
              icon="🚨"
            />
            <UseCaseCard
              title="Valider une décision stratégique"
              description="Soumettez une décision au workflow d'approbation, suivez son cycle de validation, consultez l'historique et les impacts projet."
              icon="✅"
            />
            <UseCaseCard
              title="Analyser vos données Power BI"
              description="Importez un fichier .pbix, visualisez vos rapports directement dans le cockpit, partagez avec votre équipe via tokens sécurisés."
              icon="📈"
            />
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 px-6 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-y border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-2xl md:text-3xl text-slate-200 italic mb-8">
            "J'ai testé la démo en 2 minutes et j'ai immédiatement compris comment Powalyze allait 
            transformer notre gouvernance de portefeuille. L'IA Chief of Staff est bluffante."
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center text-2xl font-bold text-white">
              SC
            </div>
            <div className="text-left">
              <p className="font-semibold text-white">Sophie Cartier</p>
              <p className="text-sm text-slate-400">Directrice PMO • Fortune 500</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Convaincu ? Passez en mode production</h2>
          <p className="text-xl text-slate-300 mb-8">
            Importez vos données réelles et déployez Powalyze pour votre organisation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-10 py-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xl shadow-lg transition-all"
            >
              Réserver ma démo personnalisée
              <ArrowRight size={24} />
            </Link>
            <Link
              href="/tarifs"
              className="inline-flex items-center gap-2 px-10 py-5 rounded-xl border-2 border-emerald-400/50 hover:border-emerald-400 text-white font-bold text-xl transition-all"
            >
              Voir les tarifs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function DemoFeature({ icon, title, description, demoLink, color }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  demoLink: string;
  color: string;
}) {
  const colors: Record<string, string> = {
    blue: "from-blue-500/20 to-blue-600/10 border-blue-500/30 hover:border-blue-500/50",
    purple: "from-purple-500/20 to-purple-600/10 border-purple-500/30 hover:border-purple-500/50",
    red: "from-red-500/20 to-red-600/10 border-red-500/30 hover:border-red-500/50",
    amber: "from-amber-500/20 to-amber-600/10 border-amber-500/30 hover:border-amber-500/50",
    green: "from-green-500/20 to-green-600/10 border-green-500/30 hover:border-green-500/50",
    sky: "from-sky-500/20 to-sky-600/10 border-sky-500/30 hover:border-sky-500/50",
  };

  return (
    <Link href={demoLink}>
      <div className={`p-6 rounded-2xl bg-gradient-to-br border ${colors[color]} hover:scale-105 transition-all cursor-pointer`}>
        <div className="text-emerald-400 mb-3">{icon}</div>
        <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
        <p className="text-sm text-slate-300">{description}</p>
        <div className="mt-4 flex items-center gap-2 text-emerald-400 text-sm font-semibold">
          <span>Tester maintenant</span>
          <ArrowRight size={16} />
        </div>
      </div>
    </Link>
  );
}

function TourStep({ number, title, description, time }: {
  number: string;
  title: string;
  description: string;
  time: string;
}) {
  return (
    <div className="flex items-start gap-6 p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/50 transition-all">
      <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-500/30 flex items-center justify-center flex-shrink-0 text-xl font-bold text-emerald-400">
        {number}
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
        <p className="text-slate-300 text-sm">{description}</p>
      </div>
      <div className="text-sm text-slate-400 flex-shrink-0">
        <CheckCircle size={16} className="inline mr-1 text-emerald-400" />
        {time}
      </div>
    </div>
  );
}

function UseCaseCard({ title, description, icon }: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="p-8 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/50 transition-all">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-2xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-slate-300">{description}</p>
    </div>
  );
}
