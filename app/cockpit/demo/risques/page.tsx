// ============================================================
// POWALYZE COCKPIT V3 — DEMO RISQUES PAGE
// ============================================================

import { getDemoData } from '@/lib/demo-data';
import { AlertTriangle, Target, Shield, TrendingUp, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function DemoRisquesPage() {
  const data = getDemoData();
  const { risks, projects } = data;
  
  // Calculs pour stats
  const criticalRisks = risks.filter(r => r.level === 'critical');
  const highRisks = risks.filter(r => r.level === 'high');
  const avgProbability = Math.round(risks.reduce((acc, r) => acc + (r.probability || 0), 0) / risks.length);
  const avgImpact = Math.round(risks.reduce((acc, r) => acc + (r.impact || 0), 0) / risks.length);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header avec badge Demo */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Gestion des Risques</h1>
            <p className="text-slate-400">Matrice complète des risques portfolio</p>
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
              <div className="bg-red-500/20 p-2 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <span className="text-slate-400 text-sm">Total Risques</span>
            </div>
            <div className="text-4xl font-bold text-white">{risks.length}</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-red-600/20 p-2 rounded-lg">
                <Shield className="w-5 h-5 text-red-500" />
              </div>
              <span className="text-slate-400 text-sm">Critiques</span>
            </div>
            <div className="text-4xl font-bold text-red-400">{criticalRisks.length}</div>
            <div className="text-slate-500 text-xs mt-2">Nécessitent action immédiate</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-amber-500/20 p-2 rounded-lg">
                <Target className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-slate-400 text-sm">Probabilité Moy.</span>
            </div>
            <div className="text-4xl font-bold text-white">{avgProbability}%</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-orange-500/20 p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-orange-400" />
              </div>
              <span className="text-slate-400 text-sm">Impact Moyen</span>
            </div>
            <div className="text-4xl font-bold text-white">{avgImpact}%</div>
          </div>
        </div>
        
        {/* Analyse IA des risques */}
        <div className="bg-gradient-to-br from-purple-600/20 via-indigo-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-500/30 p-3 rounded-lg">
              <Sparkles className="w-6 h-6 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">🤖 Analyse IA des Risques</h2>
          </div>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-slate-200 text-lg leading-relaxed">
              Le portfolio présente <strong>{risks.length} risques actifs</strong>, dont <strong className="text-red-400">{criticalRisks.length} critiques</strong> et <strong className="text-amber-400">{highRisks.length} élevés</strong>. 
              La probabilité moyenne de matérialisation est de <strong>{avgProbability}%</strong> avec un impact moyen de <strong>{avgImpact}%</strong>.
              
              {criticalRisks.length > 0 && (
                <> Les risques critiques nécessitent une attention immédiate, notamment 
                "<em>{criticalRisks[0].title}</em>" qui pourrait impacter significativement 
                le projet {projects.find(p => p.id === criticalRisks[0].project_id)?.name}.</>
              )}
            </p>
          </div>
          
          <div className="mt-6 bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="font-semibold text-purple-400 mb-3">📊 Recommandations IA</div>
            <ul className="space-y-2 text-slate-300">
              {criticalRisks.length > 0 && (
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Activer immédiatement les plans de mitigation pour les {criticalRisks.length} risques critiques</span>
                </li>
              )}
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-1">•</span>
                <span>Planifier une revue de risques hebdomadaire avec les chefs de projet</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-1">•</span>
                <span>Allouer des ressources supplémentaires aux projets avec risques élevés</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                <span>Documenter les leçons apprises pour les risques résolus</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Liste des risques */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">Tous les Risques</h2>
          </div>
          
          <div className="p-6 space-y-4">
            {risks.map((risk) => {
              const project = projects.find(p => p.id === risk.project_id);
              
              return (
                <div
                  key={risk.id}
                  className="bg-white/5 rounded-lg p-6 border border-white/5 hover:border-white/20 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <AlertTriangle className={`w-6 h-6 flex-shrink-0 mt-1 ${
                      risk.level === 'critical' ? 'text-red-500' :
                      risk.level === 'high' ? 'text-orange-500' :
                      risk.level === 'medium' ? 'text-yellow-500' :
                      'text-blue-500'
                    }`} />
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">{risk.title}</h3>
                          {project && (
                            <Link
                              href={`/cockpit/demo/projets/${project.id}`}
                              className="text-indigo-400 hover:text-indigo-300 text-sm"
                            >
                              📁 {project.name}
                            </Link>
                          )}
                        </div>
                        <span className={`px-3 py-1 text-xs font-bold rounded flex-shrink-0 ml-4 ${
                          risk.level === 'critical' ? 'bg-red-500/20 text-red-400' :
                          risk.level === 'high' ? 'bg-orange-500/20 text-orange-400' :
                          risk.level === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {risk.level === 'critical' ? 'CRITIQUE' :
                           risk.level === 'high' ? 'ÉLEVÉ' :
                           risk.level === 'medium' ? 'MOYEN' : 'FAIBLE'}
                        </span>
                      </div>
                      
                      <p className="text-slate-400 mb-4">{risk.description}</p>
                      
                      <div className="grid grid-cols-2 gap-6 mb-4">
                        <div>
                          <p className="text-slate-500 text-sm mb-2">Probabilité</p>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-slate-800 rounded-full h-2.5 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-red-500 to-orange-500 h-full"
                                style={{ width: `${risk.probability}%` }}
                              />
                            </div>
                            <span className="text-white text-sm font-semibold w-12 text-right">
                              {risk.probability}%
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-slate-500 text-sm mb-2">Impact</p>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-slate-800 rounded-full h-2.5 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-orange-500 to-red-600 h-full"
                                style={{ width: `${risk.impact}%` }}
                              />
                            </div>
                            <span className="text-white text-sm font-semibold w-12 text-right">
                              {risk.impact}%
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {risk.mitigation_plan && (
                        <div className="bg-slate-800/50 rounded-lg p-4 border border-white/5">
                          <p className="text-green-400 text-sm font-semibold mb-2">
                            🛡️ Plan de Mitigation
                          </p>
                          <p className="text-slate-300 text-sm leading-relaxed">
                            {risk.mitigation_plan}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* CTA mode Pro */}
        <div className="bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 border border-indigo-500/30 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">
            Gérez vos risques en temps réel avec le mode Pro
          </h3>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Suivez l'évolution des risques, déclenchez des alertes automatiques, 
            générez des matrices de risques personnalisées avec l'IA.
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
