import { getDemoData } from '@/lib/demo-data';
import Link from 'next/link';

export default function DemoPage() {
  const data = getDemoData();
  
  const criticalRisks = data.risks.filter(r => r.level === 'critical' || r.level === 'high');
  const pendingDecisions = data.decisions.filter(d => d.status === 'pending');
  const activeProjects = data.projects.filter(p => p.status === 'active');
  
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Badge Mode Démo + Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Dashboard Exécutif</h1>
          <p className="text-lg text-slate-600">Vue d'ensemble de votre portefeuille de projets</p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium text-sm border border-blue-200 shadow-sm">
            🎭 MODE DÉMO — Données fictives à titre d'exemple
          </span>
          <Link 
            href="/cockpit/pro"
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl text-sm font-medium"
          >
            Passer en mode Pro →
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="text-3xl font-bold text-slate-900">{data.projects.length}</div>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
          </div>
          <div className="text-sm text-slate-600">Projets actifs</div>
          <div className="mt-2 text-xs text-green-600 font-medium">↑ +2 ce mois</div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="text-3xl font-bold text-green-600">75%</div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-sm text-slate-600">Santé globale</div>
          <div className="mt-2 text-xs text-slate-500">8 🟢 3 🟡 1 🔴</div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="text-3xl font-bold text-orange-600">{criticalRisks.length}</div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <div className="text-sm text-slate-600">Risques critiques</div>
          <div className="mt-2 text-xs text-orange-600 font-medium">⚠️ Attention requise</div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="text-3xl font-bold text-indigo-600">{pendingDecisions.length}</div>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <div className="text-sm text-slate-600">Décisions en attente</div>
          <div className="mt-2 text-xs text-red-600 font-medium">1 urgente COMEX</div>
        </div>
      </div>

      {/* Synthèse IA */}
      <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 p-8 rounded-xl border border-purple-200 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="text-5xl">🤖</div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-2xl font-bold text-slate-900">
                Synthèse IA du Portefeuille
              </h2>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium border border-purple-200">
                Généré il y a 2 heures
              </span>
            </div>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 leading-relaxed text-base">
                Votre portefeuille de <strong className="text-slate-900">{data.projects.length} projets</strong> présente 
                une santé globale <strong className="text-green-600">correcte (75%)</strong>, 
                mais <strong className="text-orange-600">{criticalRisks.length} risques critiques</strong> nécessitent 
                une attention immédiate. La vélocité du projet <strong>"{data.projects[0].name}"</strong> est en baisse 
                de <span className="text-red-600 font-semibold">23%</span> ce mois-ci, avec un risque de dépassement 
                budgétaire de 15%. Le projet <strong>"{data.projects[1].name}"</strong> nécessite une décision 
                COMEX urgente concernant l'arbitrage budget de 270K€.
              </p>
              <div className="mt-4 p-4 bg-white/60 rounded-lg border border-purple-200">
                <div className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <span className="text-purple-600">💡</span>
                  Recommandations IA
                </div>
                <ul className="space-y-1 text-sm text-slate-700">
                  <li>• Prioriser la mitigation des risques techniques sur "{data.projects[0].name}"</li>
                  <li>• Planifier une revue COMEX pour "{data.projects[1].name}" avant le <strong>15/02/2026</strong></li>
                  <li>• Réallouer 2 ressources seniors vers le projet "{data.projects[2].name}"</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Projets Clés */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Projets Clés</h2>
          <Link 
            href="/cockpit/demo/projets"
            className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-1"
          >
            Voir tous les projets
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="p-6 space-y-4">
          {data.projects.map((project) => {
            const healthColor = 
              project.health === 'green' ? 'bg-green-500' : 
              project.health === 'yellow' ? 'bg-yellow-500' : 
              'bg-red-500';
            
            const healthLabel =
              project.health === 'green' ? '🟢 Excellent' :
              project.health === 'yellow' ? '🟡 Attention' :
              '🔴 Critique';
            
            const projectRisks = data.risks.filter(r => r.project_id === project.id);
            const projectDecisions = data.decisions.filter(d => d.project_id === project.id);
            const criticalProjectRisks = projectRisks.filter(r => r.level === 'critical');
            
            return (
              <Link 
                key={project.id}
                href={`/cockpit/demo/projets/${project.id}`}
                className="block p-6 border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-3 h-3 rounded-full ${healthColor} mt-1.5 shadow-sm`} />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {project.name}
                          </h3>
                          <span className="text-xs text-slate-500 font-medium">{healthLabel}</span>
                        </div>
                        {project.deadline && (
                          <div className="text-right">
                            <div className="text-xs text-slate-500">Échéance</div>
                            <div className="text-sm font-medium text-slate-700">
                              {new Date(project.deadline).toLocaleDateString('fr-FR', { 
                                month: 'short', 
                                year: 'numeric' 
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>
                      
                      {/* Progress bar */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-slate-600 font-medium">Progression</span>
                          <span className="font-semibold text-slate-900">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                      
                      {/* Méta infos */}
                      <div className="flex items-center gap-6 mt-4 text-sm">
                        {project.budget && (
                          <span className="text-slate-600 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium">{(project.budget / 1000000).toFixed(1)}M €</span>
                          </span>
                        )}
                        {projectRisks.length > 0 && (
                          <span className={`flex items-center gap-1 ${criticalProjectRisks.length > 0 ? 'text-red-600 font-medium' : 'text-orange-600'}`}>
                            <span>⚠️</span>
                            {projectRisks.length} risque{projectRisks.length > 1 ? 's' : ''}
                            {criticalProjectRisks.length > 0 && ` (${criticalProjectRisks.length} critique${criticalProjectRisks.length > 1 ? 's' : ''})`}
                          </span>
                        )}
                        {projectDecisions.length > 0 && (
                          <span className="flex items-center gap-1 text-indigo-600">
                            <span>✅</span>
                            {projectDecisions.length} décision{projectDecisions.length > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Radar Risques + Décisions Urgentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Risques */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">🚨 Radar Risques</h2>
            <Link 
              href="/cockpit/demo/risques"
              className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
            >
              Voir tout →
            </Link>
          </div>
          <div className="space-y-3">
            {criticalRisks.slice(0, 3).map((risk) => {
              const levelColor = 
                risk.level === 'critical' ? 'bg-red-100 text-red-800 border-red-200' :
                risk.level === 'high' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                'bg-yellow-100 text-yellow-800 border-yellow-200';
              
              const project = data.projects.find(p => p.id === risk.project_id);
              
              return (
                <div key={risk.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-orange-300 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium border ${levelColor}`}>
                          {risk.level === 'critical' ? '🔴 CRITIQUE' : '🟠 ÉLEVÉ'}
                        </span>
                        {project && (
                          <span className="text-xs text-slate-500">{project.name}</span>
                        )}
                      </div>
                      <h4 className="font-semibold text-slate-900 text-sm line-clamp-1">
                        {risk.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                        {risk.description}
                      </p>
                    </div>
                  </div>
                  {risk.probability !== undefined && risk.impact !== undefined && (
                    <div className="flex items-center gap-4 mt-3 text-xs">
                      <div className="flex items-center gap-1">
                        <span className="text-slate-500">Probabilité:</span>
                        <span className="font-medium text-slate-700">{risk.probability}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-slate-500">Impact:</span>
                        <span className="font-medium text-slate-700">{risk.impact}%</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Décisions Urgentes */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">🎯 Décisions Urgentes</h2>
            <Link 
              href="/cockpit/demo/decisions"
              className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
            >
              Voir tout →
            </Link>
          </div>
          <div className="space-y-3">
            {pendingDecisions.map((decision) => {
              const project = data.projects.find(p => p.id === decision.project_id);
              const isUrgent = decision.decision_date && 
                new Date(decision.decision_date) <= new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);
              
              return (
                <div key={decision.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-indigo-300 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {isUrgent && (
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                            🔴 URGENT
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200">
                          {decision.committee}
                        </span>
                      </div>
                      <h4 className="font-semibold text-slate-900 text-sm line-clamp-1">
                        {decision.title}
                      </h4>
                      {project && (
                        <p className="text-xs text-slate-500 mt-1">{project.name}</p>
                      )}
                    </div>
                  </div>
                  {decision.decision_date && (
                    <div className="mt-3 text-xs text-slate-600">
                      <span className="text-slate-500">Échéance:</span>{' '}
                      <span className="font-medium">
                        {new Date(decision.decision_date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Passer en Pro */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 rounded-xl text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-3">Prêt à gérer vos propres projets ?</h2>
            <p className="text-indigo-100 text-lg leading-relaxed max-w-2xl">
              Passez en mode Pro pour créer et gérer vos projets réels avec l'assistance de l'IA. 
              Toutes les fonctionnalités que vous venez de voir sont disponibles pour vos données.
            </p>
          </div>
          <Link 
            href="/cockpit/pro"
            className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-colors shadow-lg hover:shadow-xl flex items-center gap-2 whitespace-nowrap"
          >
            <span>Activer le mode Pro</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
