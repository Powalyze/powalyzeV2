// ============================================================
// POWALYZE COCKPIT V3 — DEMO PROJECT DETAIL PAGE
// ============================================================

import { getDemoData } from '@/lib/demo-data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users,
  Target,
  TrendingUp,
  Calendar,
  DollarSign,
  Sparkles
} from 'lucide-react';

interface Props {
  params: {
    id: string;
  };
}

export default function DemoProjetDetailPage({ params }: Props) {
  const data = getDemoData();
  const project = data.projects.find(p => p.id === params.id);
  
  if (!project) {
    notFound();
  }
  
  // Filtrer les risques et décisions associés
  const projectRisks = data.risks.filter(r => r.project_id === project.id);
  const projectDecisions = data.decisions.filter(d => d.project_id === project.id);
  
  const criticalRisks = projectRisks.filter(r => r.level === 'critical' || r.level === 'high');
  const pendingDecisions = projectDecisions.filter(d => d.status === 'pending');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation + Header */}
        <div>
          <Link
            href="/cockpit/demo/projets"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux projets</span>
          </Link>
          
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <div className={`w-4 h-4 rounded-full ${
                  project.rag_status === 'GREEN' ? 'bg-green-500 shadow-lg shadow-green-500/50' :
                  project.rag_status === 'YELLOW' ? 'bg-yellow-500 shadow-lg shadow-yellow-500/50' :
                  'bg-red-500 shadow-lg shadow-red-500/50'
                }`} />
                <h1 className="text-4xl font-bold text-white">{project.name}</h1>
              </div>
              <p className="text-slate-400 text-lg">{project.description}</p>
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
        </div>
        
        {/* KPIs du projet */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-purple-500/20 p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-slate-400 text-sm">Progression</span>
            </div>
            <div className="text-3xl font-bold text-white">{project.progress}%</div>
            <div className="h-2 bg-slate-800 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-500/20 p-2 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-400" />
              </div>
              <span className="text-slate-400 text-sm">Budget</span>
            </div>
            <div className="text-3xl font-bold text-white">
              {project.budget ? (project.budget / 1000000).toFixed(1) : 'N/A'}M €
            </div>
            <div className="text-slate-500 text-xs mt-2">Budget alloué</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-amber-500/20 p-2 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-slate-400 text-sm">Risques</span>
            </div>
            <div className="text-3xl font-bold text-white">{projectRisks.length}</div>
            {criticalRisks.length > 0 && (
              <div className="text-red-400 text-xs mt-2 font-semibold">
                {criticalRisks.length} critique{criticalRisks.length > 1 ? 's' : ''}
              </div>
            )}
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-indigo-500/20 p-2 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-indigo-400" />
              </div>
              <span className="text-slate-400 text-sm">Décisions</span>
            </div>
            <div className="text-3xl font-bold text-white">{projectDecisions.length}</div>
            {pendingDecisions.length > 0 && (
              <div className="text-amber-400 text-xs mt-2 font-semibold">
                {pendingDecisions.length} en attente
              </div>
            )}
          </div>
        </div>
        
        {/* Synthèse IA du projet */}
        <div className="bg-gradient-to-br from-purple-600/20 via-indigo-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-500/30 p-3 rounded-lg">
              <Sparkles className="w-6 h-6 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">🤖 Analyse IA du Projet</h2>
          </div>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-slate-200 text-lg leading-relaxed">
              Le projet <strong>{project.name}</strong> affiche une progression de <strong>{project.progress}%</strong> avec 
              un statut de santé <strong className={
                project.rag_status === 'GREEN' ? 'text-green-400' :
                project.rag_status === 'YELLOW' ? 'text-yellow-400' :
                'text-red-400'
              }>
                {project.rag_status === 'GREEN' ? 'VERT' : project.rag_status === 'YELLOW' ? 'JAUNE' : 'ROUGE'}
              </strong>.
              
              {criticalRisks.length > 0 && (
                <> Des risques critiques nécessitent une attention immédiate, notamment 
                concernant {criticalRisks[0].title.toLowerCase()}.</>
              )}
              
              {pendingDecisions.length > 0 && (
                <> {pendingDecisions.length} décision{pendingDecisions.length > 1 ? 's' : ''} stratégique{pendingDecisions.length > 1 ? 's' : ''} 
                {pendingDecisions.length > 1 ? 'sont' : 'est'} en attente de validation 
                {pendingDecisions[0].committee && ` par le ${pendingDecisions[0].committee}`}.</>
              )}
            </p>
          </div>
          
          <div className="mt-6 bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="font-semibold text-purple-400 mb-3">📊 Recommandations IA</div>
            <ul className="space-y-2 text-slate-300">
              {criticalRisks.length > 0 && (
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-1">•</span>
                  <span>Prioriser la mitigation des risques critiques identifiés</span>
                </li>
              )}
              {project.progress < 50 && (
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-1">•</span>
                  <span>Planifier des points de contrôle hebdomadaires pour accélérer la vélocité</span>
                </li>
              )}
              {pendingDecisions.length > 0 && (
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-1">•</span>
                  <span>Organiser une session de décision COMEX avant {pendingDecisions[0].date ? new Date(pendingDecisions[0].date).toLocaleDateString('fr-FR') : 'fin de mois'}</span>
                </li>
              )}
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                <span>Maintenir la communication active avec les parties prenantes</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Layout 2 colonnes : Risques + Décisions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Risques du projet */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">⚠️ Risques Associés</h2>
                <span className="text-slate-400 text-sm">{projectRisks.length} risque{projectRisks.length > 1 ? 's' : ''}</span>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              {projectRisks.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Aucun risque identifié pour ce projet</p>
                </div>
              ) : (
                projectRisks.map((risk) => (
                  <div
                    key={risk.id}
                    className="bg-white/5 rounded-lg p-4 border border-white/5 hover:border-white/20 transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-white">{risk.title}</h3>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${
                        risk.level === 'critical' ? 'bg-red-500/20 text-red-400' :
                        risk.level === 'high' ? 'bg-orange-500/20 text-orange-400' :
                        risk.level === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {risk.level === 'critical' ? 'CRITIQUE' :
                         risk.level === 'high' ? 'ÉLEVÉ' :
                         risk.level === 'medium' ? 'MOYEN' : 'FAIBLE'}
                      </span>
                    </div>
                    
                    <p className="text-slate-400 text-sm mb-3 line-clamp-2">
                      {risk.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <div>Probabilité: <span className="text-white font-semibold">{risk.probability}%</span></div>
                      <div>Impact: <span className="text-white font-semibold">{risk.impact}%</span></div>
                    </div>
                  </div>
                ))
              )}
              
              {projectRisks.length > 0 && (
                <Link
                  href="/cockpit/demo/risques"
                  className="block text-center text-indigo-400 hover:text-indigo-300 text-sm font-semibold mt-4"
                >
                  Voir tous les risques →
                </Link>
              )}
            </div>
          </div>
          
          {/* Décisions du projet */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">✅ Décisions</h2>
                <span className="text-slate-400 text-sm">{projectDecisions.length} décision{projectDecisions.length > 1 ? 's' : ''}</span>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              {projectDecisions.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Aucune décision associée à ce projet</p>
                </div>
              ) : (
                projectDecisions.map((decision) => (
                  <div
                    key={decision.id}
                    className="bg-white/5 rounded-lg p-4 border border-white/5 hover:border-white/20 transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        {decision.status === 'pending' && decision.date && new Date(decision.date) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && (
                          <span className="inline-block bg-red-500/20 text-red-400 text-xs font-bold px-2 py-0.5 rounded mb-2">
                            🔥 URGENT
                          </span>
                        )}
                        <h3 className="font-semibold text-white">{decision.title}</h3>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded flex-shrink-0 ml-2 ${
                        decision.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                        decision.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                        decision.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        {decision.status === 'pending' ? 'EN ATTENTE' :
                         decision.status === 'approved' ? 'APPROUVÉE' :
                         decision.status === 'rejected' ? 'REFUSÉE' : 'DIFFÉRÉE'}
                      </span>
                    </div>
                    
                    <p className="text-slate-400 text-sm mb-3 line-clamp-2">
                      {decision.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      {decision.committee && (
                        <div>Comité: <span className="text-white font-semibold">{decision.committee}</span></div>
                      )}
                      {decision.date && (
                        <div>
                          <Clock className="w-3 h-3 inline mr-1" />
                          <span className="text-white">{new Date(decision.date).toLocaleDateString('fr-FR')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              
              {projectDecisions.length > 0 && (
                <Link
                  href="/cockpit/demo/decisions"
                  className="block text-center text-indigo-400 hover:text-indigo-300 text-sm font-semibold mt-4"
                >
                  Voir toutes les décisions →
                </Link>
              )}
            </div>
          </div>
          
        </div>
        
        {/* CTA mode Pro */}
        <div className="bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 border border-indigo-500/30 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">
            Explorez toutes les fonctionnalités en mode Pro
          </h3>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Créez des scénarios prévisionnels, définissez des objectifs SMART, suivez les ressources, 
            et générez des rapports exécutifs personnalisés avec l'IA.
          </p>
          <Link
            href="/cockpit/pro"
            className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg font-bold hover:shadow-xl hover:shadow-purple-500/50 transition-all text-lg"
          >
            Activer le mode Pro →
          </Link>
        </div>
        
      </div>
    </div>
  );
}
