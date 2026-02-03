// ============================================================
// POWALYZE COCKPIT V3 — DEMO PROJETS PAGE
// ============================================================

import { getDemoData } from '@/lib/demo-data';
import { FolderKanban, AlertTriangle, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function DemoProjetsPage() {
  const data = getDemoData();
  const { projects, risks, decisions } = data;
  
  // Calculs pour les statistiques
  const healthyProjects = projects.filter(p => p.rag_status === 'GREEN').length;
  const avgProgress = Math.round(projects.reduce((acc, p) => acc + (p.progress || 0), 0) / projects.length);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header avec badge Demo */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Portfolio de Projets</h1>
            <p className="text-slate-400">Vue complète de vos initiatives stratégiques</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg font-semibold flex items-center gap-2">
              🎭 MODE DÉMO
            </span>
            <Link
              href="/cockpit/pro"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
            >
              Passer en mode Pro →
            </Link>
          </div>
        </div>
        
        {/* Statistiques clés */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <FolderKanban className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <p className="text-slate-400 text-sm mb-1">Total Projets</p>
            <p className="text-4xl font-bold text-white">{projects.length}</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-500/20 p-3 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <p className="text-slate-400 text-sm mb-1">En bonne santé</p>
            <p className="text-4xl font-bold text-green-400">{healthyProjects}</p>
            <p className="text-slate-500 text-xs mt-2">
              {Math.round((healthyProjects / projects.length) * 100)}% du portfolio
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-500/20 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <p className="text-slate-400 text-sm mb-1">Progression moyenne</p>
            <p className="text-4xl font-bold text-white">{avgProgress}%</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-amber-500/20 p-3 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <p className="text-slate-400 text-sm mb-1">Risques actifs</p>
            <p className="text-4xl font-bold text-amber-400">{risks.length}</p>
          </div>
        </div>
        
        {/* Liste des projets */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">Tous les Projets</h2>
          </div>
          
          <div className="divide-y divide-white/5">
            {projects.map((project) => {
              const projectRisks = risks.filter(r => r.project_id === project.id);
              const projectDecisions = decisions.filter(d => d.project_id === project.id);
              const criticalRisks = projectRisks.filter(r => r.level === 'critical' || r.level === 'high');
              
              return (
                <Link
                  key={project.id}
                  href={`/cockpit/demo/projets/${project.id}`}
                  className="block p-6 hover:bg-white/5 transition-all group"
                >
                  <div className="flex items-start gap-6">
                    {/* Indicateur de santé */}
                    <div className={`w-4 h-4 rounded-full mt-1 flex-shrink-0 ${
                      project.rag_status === 'GREEN' ? 'bg-green-500 shadow-lg shadow-green-500/50' :
                      project.rag_status === 'YELLOW' ? 'bg-yellow-500 shadow-lg shadow-yellow-500/50' :
                      'bg-red-500 shadow-lg shadow-red-500/50'
                    }`} />
                    
                    {/* Contenu principal */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                            {project.name}
                          </h3>
                          <p className="text-slate-400 text-sm mt-1 line-clamp-2">
                            {project.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-white">
                            {project.progress}%
                          </div>
                          <div className="text-slate-500 text-xs mt-1">progression</div>
                        </div>
                      </div>
                      
                      {/* Barre de progression */}
                      <div className="mb-4">
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                      
                      {/* Métadonnées */}
                      <div className="flex items-center gap-6 text-sm">
                        {project.budget && (
                          <div className="flex items-center gap-2 text-slate-400">
                            <span className="font-semibold">💰</span>
                            <span>{(project.budget / 1000000).toFixed(1)}M €</span>
                          </div>
                        )}
                        
                        {project.deadline && (
                          <div className="flex items-center gap-2 text-slate-400">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(project.deadline).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}</span>
                          </div>
                        )}
                        
                        {projectRisks.length > 0 && (
                          <div className={`flex items-center gap-2 ${criticalRisks.length > 0 ? 'text-red-400' : 'text-amber-400'}`}>
                            <AlertTriangle className="w-4 h-4" />
                            <span>{projectRisks.length} risque{projectRisks.length > 1 ? 's' : ''}</span>
                            {criticalRisks.length > 0 && (
                              <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-xs font-semibold">
                                {criticalRisks.length} critique{criticalRisks.length > 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                        )}
                        
                        {projectDecisions.length > 0 && (
                          <div className="flex items-center gap-2 text-indigo-400">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{projectDecisions.length} décision{projectDecisions.length > 1 ? 's' : ''}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
        
        {/* CTA mode Pro */}
        <div className="bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 border border-indigo-500/30 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">
            Prêt à gérer vos propres projets ?
          </h3>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Passez en mode Pro pour créer vos projets, suivre vos risques en temps réel, 
            et générer des rapports exécutifs avec l'intelligence artificielle.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/cockpit/pro"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg font-bold hover:shadow-xl hover:shadow-purple-500/50 transition-all text-lg"
            >
              Activer le mode Pro →
            </Link>
            <Link
              href="/cockpit/demo"
              className="border border-white/20 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/5 transition-all"
            >
              ← Retour au dashboard
            </Link>
          </div>
        </div>
        
      </div>
    </div>
  );
}
