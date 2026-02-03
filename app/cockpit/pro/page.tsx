// ============================================================
// POWALYZE COCKPIT V3 — PRO DASHBOARD PAGE
// ============================================================

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { FolderKanban, AlertTriangle, FileText, TrendingUp, Plus, Sparkles, BarChart3, Target } from 'lucide-react';
import Link from 'next/link';

export default async function ProDashboardPage() {
  const supabase = await createClient();
  
  // Vérifier l'authentification
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    redirect('/login');
  }
  
  // Récupérer le profil pour obtenir organization_id
  const { data: profile } = await supabase
    .from('profiles')
    .select('organization_id')
    .eq('id', user.id)
    .single();
  
  if (!profile?.organization_id) {
    redirect('/cockpit/pro/onboarding');
  }
  
  const organizationId = profile.organization_id;
  
  // Charger les projets réels depuis Supabase
  const { data: projects = [], error: projectsError } = await supabase
    .from('projects')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });
  
  // Si aucun projet, rediriger vers onboarding
  if (!projects || projects.length === 0) {
    redirect('/cockpit/pro/onboarding');
  }
  
  // Charger les risques
  const { data: risks } = await supabase
    .from('risks')
    .select('*')
    .eq('organization_id', organizationId);
  
  // Charger les décisions
  const { data: decisions } = await supabase
    .from('decisions')
    .select('*')
    .eq('organization_id', organizationId);
  
  // Safe arrays
  const safeRisks = risks || [];
  const safeDecisions = decisions || [];
  
  // Calculer les statistiques
  const activeProjects = projects.filter(p => p.status === 'active');
  const criticalRisks = safeRisks.filter(r => r.level === 'critical' || r.level === 'high');
  const pendingDecisions = safeDecisions.filter(d => d.status === 'pending');
  
  const avgProgress = projects.length > 0 
    ? Math.round(projects.reduce((acc, p) => acc + (p.progress || 0), 0) / projects.length)
    : 0;
  
  const healthyProjects = projects.filter(p => p.health === 'GREEN').length;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header avec actions rapides */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Dashboard Exécutif</h1>
            <p className="text-slate-400">Pilotage en temps réel de votre portfolio</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/cockpit/pro/projets/nouveau"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nouveau Projet
            </Link>
            <Link
              href="/committee-prep"
              className="bg-white/5 backdrop-blur-sm border border-white/10 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Rapport IA
            </Link>
          </div>
        </div>
        
        {/* KPIs principaux */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <FolderKanban className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <p className="text-slate-400 text-sm mb-1">Projets Actifs</p>
            <p className="text-4xl font-bold text-white">{activeProjects.length}</p>
            <p className="text-slate-500 text-xs mt-2">sur {projects.length} total</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-500/20 p-3 rounded-lg">
                <Target className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <p className="text-slate-400 text-sm mb-1">Santé Globale</p>
            <p className="text-4xl font-bold text-green-400">{healthyProjects}</p>
            <p className="text-slate-500 text-xs mt-2">
              {Math.round((healthyProjects / projects.length) * 100)}% en bonne santé
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${
                criticalRisks.length > 0 ? 'bg-red-500/20' : 'bg-amber-500/20'
              }`}>
                <AlertTriangle className={`w-6 h-6 ${
                  criticalRisks.length > 0 ? 'text-red-400' : 'text-amber-400'
                }`} />
              </div>
            </div>
            <p className="text-slate-400 text-sm mb-1">Risques Critiques</p>
            <p className={`text-4xl font-bold ${
              criticalRisks.length > 0 ? 'text-red-400' : 'text-white'
            }`}>
              {criticalRisks.length}
            </p>
            <p className="text-slate-500 text-xs mt-2">sur {safeRisks.length} risques totaux</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${
                pendingDecisions.length > 0 ? 'bg-amber-500/20' : 'bg-indigo-500/20'
              }`}>
                <FileText className={`w-6 h-6 ${
                  pendingDecisions.length > 0 ? 'text-amber-400' : 'text-indigo-400'
                }`} />
              </div>
            </div>
            <p className="text-slate-400 text-sm mb-1">Décisions en Attente</p>
            <p className={`text-4xl font-bold ${
              pendingDecisions.length > 0 ? 'text-amber-400' : 'text-white'
            }`}>
              {pendingDecisions.length}
            </p>
            <p className="text-slate-500 text-xs mt-2">sur {safeDecisions.length} décisions totales</p>
          </div>
        </div>
        
        {/* Synthèse IA du portfolio (placeholder pour Phase 4) */}
        <div className="bg-gradient-to-br from-purple-600/20 via-indigo-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-500/30 p-3 rounded-lg">
              <Sparkles className="w-6 h-6 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">🤖 Synthèse IA du Portfolio</h2>
          </div>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-slate-200 text-lg leading-relaxed">
              Votre portfolio comporte <strong>{projects.length} projet{projects.length > 1 ? 's' : ''}</strong> avec 
              une progression moyenne de <strong>{avgProgress}%</strong>.
              
              {criticalRisks.length > 0 && (
                <> <strong className="text-red-400">{criticalRisks.length} risque{criticalRisks.length > 1 ? 's' : ''} critique{criticalRisks.length > 1 ? 's' : ''}</strong> nécessite{criticalRisks.length > 1 ? 'nt' : ''} une attention immédiate.</>
              )}
              
              {pendingDecisions.length > 0 && (
                <> {pendingDecisions.length} décision{pendingDecisions.length > 1 ? 's' : ''} stratégique{pendingDecisions.length > 1 ? 's' : ''} 
                {pendingDecisions.length > 1 ? 'sont' : 'est'} en attente de validation.</>
              )}
            </p>
          </div>
          
          <div className="mt-6 bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="font-semibold text-purple-400 mb-3">📊 Prochaines Actions Recommandées</div>
            <ul className="space-y-2 text-slate-300">
              {criticalRisks.length > 0 && (
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Traiter en priorité les {criticalRisks.length} risques critiques identifiés</span>
                </li>
              )}
              {pendingDecisions.length > 0 && (
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-1">•</span>
                  <span>Organiser une session COMEX pour valider les {pendingDecisions.length} décisions en attente</span>
                </li>
              )}
              {avgProgress < 50 && (
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-1">•</span>
                  <span>Accélérer la vélocité des projets (progression moyenne {avgProgress}%)</span>
                </li>
              )}
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                <span>Maintenir la communication avec les parties prenantes</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Liste des projets */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Projets en Cours</h2>
            <Link
              href="/cockpit/pro/projets"
              className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold"
            >
              Voir tous les projets →
            </Link>
          </div>
          
          <div className="divide-y divide-white/5">
            {projects.slice(0, 5).map((project) => {
              const projectRisks = safeRisks.filter(r => r.project_id === project.id);
              const projectDecisions = safeDecisions.filter(d => d.project_id === project.id);
              const criticalProjectRisks = projectRisks.filter(r => r.level === 'critical' || r.level === 'high');
              
              return (
                <Link
                  key={project.id}
                  href={`/cockpit/pro/projets/${project.id}`}
                  className="block p-6 hover:bg-white/5 transition-all group"
                >
                  <div className="flex items-start gap-6">
                    {/* Indicateur de santé */}
                    <div className={`w-4 h-4 rounded-full mt-1 flex-shrink-0 ${
                      project.health === 'GREEN' ? 'bg-green-500 shadow-lg shadow-green-500/50' :
                      project.health === 'YELLOW' ? 'bg-yellow-500 shadow-lg shadow-yellow-500/50' :
                      'bg-red-500 shadow-lg shadow-red-500/50'
                    }`} />
                    
                    {/* Contenu */}
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
                            {project.progress || 0}%
                          </div>
                          <div className="text-slate-500 text-xs mt-1">progression</div>
                        </div>
                      </div>
                      
                      {/* Barre de progression */}
                      <div className="mb-4">
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
                            style={{ width: `${project.progress || 0}%` }}
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
                        
                        {projectRisks.length > 0 && (
                          <div className={`flex items-center gap-2 ${criticalProjectRisks.length > 0 ? 'text-red-400' : 'text-amber-400'}`}>
                            <AlertTriangle className="w-4 h-4" />
                            <span>{projectRisks.length} risque{projectRisks.length > 1 ? 's' : ''}</span>
                            {criticalProjectRisks.length > 0 && (
                              <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-xs font-semibold">
                                {criticalProjectRisks.length} critique{criticalProjectRisks.length > 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                        )}
                        
                        {projectDecisions.length > 0 && (
                          <div className="flex items-center gap-2 text-indigo-400">
                            <FileText className="w-4 h-4" />
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
        
        {/* Liens rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/cockpit/pro/risques"
            className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-red-500/50 transition-all group"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="bg-red-500/20 p-3 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Gestion des Risques</h3>
            </div>
            <p className="text-slate-400 text-sm">
              {safeRisks.length} risque{safeRisks.length > 1 ? 's' : ''} identifié{safeRisks.length > 1 ? 's' : ''}
              {criticalRisks.length > 0 && `, dont ${criticalRisks.length} critique${criticalRisks.length > 1 ? 's' : ''}`}
            </p>
          </Link>
          
          <Link
            href="/cockpit/pro/decisions"
            className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-indigo-500/50 transition-all group"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="bg-indigo-500/20 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Suivi des Décisions</h3>
            </div>
            <p className="text-slate-400 text-sm">
              {safeDecisions.length} décision{safeDecisions.length > 1 ? 's' : ''}
              {pendingDecisions.length > 0 && `, ${pendingDecisions.length} en attente`}
            </p>
          </Link>
          
          <Link
            href="/committee-prep"
            className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition-all group"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="bg-purple-500/20 p-3 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Rapports Exécutifs</h3>
            </div>
            <p className="text-slate-400 text-sm">
              Générez des rapports COMEX avec l'IA
            </p>
          </Link>
        </div>
        
      </div>
    </div>
  );
}
