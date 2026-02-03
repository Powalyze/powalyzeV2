// ============================================================
// POWALYZE COCKPIT V3 — DEMO DECISIONS PAGE
// ============================================================

import { getDemoData } from '@/lib/demo-data';
import { FileText, CheckCircle2, Clock, Users, Sparkles, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function DemoDecisionsPage() {
  const data = getDemoData();
  const { decisions, projects } = data;
  
  // Calculs pour stats
  const pendingDecisions = decisions.filter(d => d.status === 'pending');
  const approvedDecisions = decisions.filter(d => d.status === 'approved');
  const urgentDecisions = pendingDecisions.filter(d => {
    if (!d.date) return false;
    const decisionDate = new Date(d.date);
    const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    return decisionDate < weekFromNow;
  });
  
  // Grouper par statut (Kanban style)
  const decisionsByStatus = {
    pending: decisions.filter(d => d.status === 'pending'),
    approved: decisions.filter(d => d.status === 'approved'),
    rejected: decisions.filter(d => d.status === 'rejected'),
    deferred: decisions.filter(d => d.status === 'deferred'),
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header avec badge Demo */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Suivi des Décisions</h1>
            <p className="text-slate-400">Tableau de bord exécutif des décisions stratégiques</p>
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
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-indigo-500/20 p-2 rounded-lg">
                <FileText className="w-5 h-5 text-indigo-400" />
              </div>
              <span className="text-slate-400 text-sm">Total Décisions</span>
            </div>
            <div className="text-4xl font-bold text-white">{decisions.length}</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-amber-500/20 p-2 rounded-lg">
                <Clock className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-slate-400 text-sm">En Attente</span>
            </div>
            <div className="text-4xl font-bold text-amber-400">{pendingDecisions.length}</div>
            {urgentDecisions.length > 0 && (
              <div className="text-red-400 text-xs mt-2 font-semibold">
                {urgentDecisions.length} urgent{urgentDecisions.length > 1 ? 's' : ''}
              </div>
            )}
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-500/20 p-2 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              </div>
              <span className="text-slate-400 text-sm">Approuvées</span>
            </div>
            <div className="text-4xl font-bold text-green-400">{approvedDecisions.length}</div>
            <div className="text-slate-500 text-xs mt-2">
              {Math.round((approvedDecisions.length / decisions.length) * 100)}% du total
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-purple-500/20 p-2 rounded-lg">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-slate-400 text-sm">Comités</span>
            </div>
            <div className="text-4xl font-bold text-white">
              {new Set(decisions.map(d => d.committee).filter(Boolean)).size}
            </div>
            <div className="text-slate-500 text-xs mt-2">COMEX, CODIR, COPIL</div>
          </div>
        </div>
        
        {/* Analyse IA des décisions */}
        <div className="bg-gradient-to-br from-purple-600/20 via-indigo-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-500/30 p-3 rounded-lg">
              <Sparkles className="w-6 h-6 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">🤖 Analyse IA des Décisions</h2>
          </div>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-slate-200 text-lg leading-relaxed">
              Le portfolio présente <strong>{decisions.length} décisions stratégiques</strong>, dont <strong className="text-amber-400">{pendingDecisions.length} en attente de validation</strong>.
              
              {urgentDecisions.length > 0 && (
                <> <strong className="text-red-400">{urgentDecisions.length} décision{urgentDecisions.length > 1 ? 's' : ''}</strong> nécessite{urgentDecisions.length > 1 ? 'nt' : ''} une action urgente (échéance sous 7 jours).</>
              )}
              
              {approvedDecisions.length > 0 && (
                <> {approvedDecisions.length} décision{approvedDecisions.length > 1 ? 's ont' : ' a'} déjà été validée{approvedDecisions.length > 1 ? 's' : ''}, 
                représentant {Math.round((approvedDecisions.length / decisions.length) * 100)}% du total.</>
              )}
            </p>
          </div>
          
          <div className="mt-6 bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="font-semibold text-purple-400 mb-3">📊 Recommandations IA</div>
            <ul className="space-y-2 text-slate-300">
              {urgentDecisions.length > 0 && (
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Organiser une session COMEX urgente pour les {urgentDecisions.length} décisions critiques</span>
                </li>
              )}
              {pendingDecisions.length > 0 && (
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-1">•</span>
                  <span>Préparer les dossiers de décision avec impacts quantifiés et options alternatives</span>
                </li>
              )}
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                <span>Documenter les décisions approuvées pour créer une base de connaissance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Planifier un suivi post-décision pour valider les impacts réels</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Kanban Board des décisions */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Colonne En Attente */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
            <div className="bg-amber-500/20 p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  En Attente
                </h3>
                <span className="bg-amber-500/30 text-amber-300 px-2 py-0.5 rounded text-xs font-bold">
                  {decisionsByStatus.pending.length}
                </span>
              </div>
            </div>
            <div className="p-4 space-y-3">
              {decisionsByStatus.pending.map((decision) => {
                const project = projects.find(p => p.id === decision.project_id);
                const isUrgent = decision.date && new Date(decision.date) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
                
                return (
                  <div
                    key={decision.id}
                    className="bg-white/5 rounded-lg p-4 border border-white/5 hover:border-amber-400/50 transition-all"
                  >
                    {isUrgent && (
                      <span className="inline-block bg-red-500/20 text-red-400 text-xs font-bold px-2 py-0.5 rounded mb-2">
                        🔥 URGENT
                      </span>
                    )}
                    <h4 className="font-semibold text-white text-sm mb-2 line-clamp-2">
                      {decision.title}
                    </h4>
                    <p className="text-slate-400 text-xs mb-3 line-clamp-2">
                      {decision.description}
                    </p>
                    {project && (
                      <Link
                        href={`/cockpit/demo/projets/${project.id}`}
                        className="text-indigo-400 hover:text-indigo-300 text-xs block mb-2"
                      >
                        📁 {project.name}
                      </Link>
                    )}
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      {decision.committee && (
                        <span>{decision.committee}</span>
                      )}
                      {decision.date && (
                        <span>
                          <Calendar className="w-3 h-3 inline mr-1" />
                          {new Date(decision.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Colonne Approuvées */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
            <div className="bg-green-500/20 p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  Approuvées
                </h3>
                <span className="bg-green-500/30 text-green-300 px-2 py-0.5 rounded text-xs font-bold">
                  {decisionsByStatus.approved.length}
                </span>
              </div>
            </div>
            <div className="p-4 space-y-3">
              {decisionsByStatus.approved.map((decision) => {
                const project = projects.find(p => p.id === decision.project_id);
                
                return (
                  <div
                    key={decision.id}
                    className="bg-white/5 rounded-lg p-4 border border-white/5 hover:border-green-400/50 transition-all"
                  >
                    <h4 className="font-semibold text-white text-sm mb-2 line-clamp-2">
                      {decision.title}
                    </h4>
                    <p className="text-slate-400 text-xs mb-3 line-clamp-2">
                      {decision.description}
                    </p>
                    {project && (
                      <Link
                        href={`/cockpit/demo/projets/${project.id}`}
                        className="text-indigo-400 hover:text-indigo-300 text-xs block mb-2"
                      >
                        📁 {project.name}
                      </Link>
                    )}
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      {decision.committee && (
                        <span>{decision.committee}</span>
                      )}
                      {decision.date && (
                        <span>
                          {new Date(decision.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Colonne Rejetées */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
            <div className="bg-red-500/20 p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-red-400" />
                  Rejetées
                </h3>
                <span className="bg-red-500/30 text-red-300 px-2 py-0.5 rounded text-xs font-bold">
                  {decisionsByStatus.rejected.length}
                </span>
              </div>
            </div>
            <div className="p-4 space-y-3">
              {decisionsByStatus.rejected.length === 0 ? (
                <p className="text-slate-500 text-xs text-center py-4">Aucune décision rejetée</p>
              ) : (
                decisionsByStatus.rejected.map((decision) => {
                  const project = projects.find(p => p.id === decision.project_id);
                  
                  return (
                    <div
                      key={decision.id}
                      className="bg-white/5 rounded-lg p-4 border border-white/5 hover:border-red-400/50 transition-all opacity-70"
                    >
                      <h4 className="font-semibold text-white text-sm mb-2 line-clamp-2">
                        {decision.title}
                      </h4>
                      <p className="text-slate-400 text-xs mb-3 line-clamp-2">
                        {decision.description}
                      </p>
                      {project && (
                        <Link
                          href={`/cockpit/demo/projets/${project.id}`}
                          className="text-indigo-400 hover:text-indigo-300 text-xs block"
                        >
                          📁 {project.name}
                        </Link>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
          
          {/* Colonne Différées */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
            <div className="bg-slate-500/20 p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  Différées
                </h3>
                <span className="bg-slate-500/30 text-slate-300 px-2 py-0.5 rounded text-xs font-bold">
                  {decisionsByStatus.deferred.length}
                </span>
              </div>
            </div>
            <div className="p-4 space-y-3">
              {decisionsByStatus.deferred.length === 0 ? (
                <p className="text-slate-500 text-xs text-center py-4">Aucune décision différée</p>
              ) : (
                decisionsByStatus.deferred.map((decision) => {
                  const project = projects.find(p => p.id === decision.project_id);
                  
                  return (
                    <div
                      key={decision.id}
                      className="bg-white/5 rounded-lg p-4 border border-white/5 hover:border-slate-400/50 transition-all"
                    >
                      <h4 className="font-semibold text-white text-sm mb-2 line-clamp-2">
                        {decision.title}
                      </h4>
                      <p className="text-slate-400 text-xs mb-3 line-clamp-2">
                        {decision.description}
                      </p>
                      {project && (
                        <Link
                          href={`/cockpit/demo/projets/${project.id}`}
                          className="text-indigo-400 hover:text-indigo-300 text-xs block"
                        >
                          📁 {project.name}
                        </Link>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
          
        </div>
        
        {/* CTA mode Pro */}
        <div className="bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 border border-indigo-500/30 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">
            Digitalisez vos processus de décision avec le mode Pro
          </h3>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Créez des workflows d'approbation, suivez les délais en temps réel, 
            générez des rapports de gouvernance automatisés avec l'IA.
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
