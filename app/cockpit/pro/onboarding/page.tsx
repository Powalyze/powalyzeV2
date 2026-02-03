export default function ProOnboardingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            🚀 Bienvenue dans votre Cockpit
          </h1>
          <p className="text-lg text-slate-600">
            Commencez par créer votre premier projet
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Un projet est l'unité centrale de gouvernance
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Dans Powalyze, chaque projet regroupe ses risques, décisions, ressources et rapports. 
              L'IA vous assistera pour créer un projet complet en moins de 2 minutes.
            </p>
          </div>

          <a 
            href="/cockpit/pro/projets/nouveau" 
            className="block w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
          >
            <span className="flex items-center justify-center gap-2">
              <span>🤖</span>
              <span>Créer mon premier projet</span>
              <span className="text-sm opacity-90">(assisté par IA)</span>
            </span>
          </a>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500 mb-3">ou</p>
            <a 
              href="/cockpit/demo" 
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              🎭 Voir le cockpit en mode démo
            </a>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-3xl mb-2">⚡</div>
            <div className="text-sm font-medium text-slate-900">Rapide</div>
            <div className="text-xs text-slate-600 mt-1">2 minutes avec l'IA</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-sm font-medium text-slate-900">Complet</div>
            <div className="text-xs text-slate-600 mt-1">Risques + Décisions</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-3xl mb-2">🔄</div>
            <div className="text-sm font-medium text-slate-900">Évolutif</div>
            <div className="text-xs text-slate-600 mt-1">Enrichissez plus tard</div>
          </div>
        </div>
      </div>
    </div>
  );
}
