// ============================================================
// POWALYZE COCKPIT PRO — RISQUES PAGE
// ============================================================

import { getAllRisks } from '@/lib/data-v2';
import { Shield, AlertTriangle, TrendingUp, CheckCircle2 } from 'lucide-react';

export default async function RisquesPage() {
  const risks = await getAllRisks();
  
  // Stats
  const stats = {
    total: risks.length,
    high: risks.filter(r => r.level === 'high' || r.level === 'critical').length,
    open: risks.filter(r => r.status === 'open').length,
    mitigated: risks.filter(r => r.status === 'mitigated').length
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Risques</h1>
        <p className="text-slate-400">Gestion et suivi des risques organisationnels</p>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Total</span>
            <Shield className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-white">{stats.total}</div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-red-500/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Critiques</span>
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div className="text-3xl font-bold text-red-400">{stats.high}</div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-yellow-500/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Ouverts</span>
            <TrendingUp className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="text-3xl font-bold text-yellow-400">{stats.open}</div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-green-500/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Atténués</span>
            <CheckCircle2 className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-green-400">{stats.mitigated}</div>
        </div>
      </div>
      
      {/* Risks List */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Tous les risques</h2>
        </div>
        
        {risks.length === 0 ? (
          <div className="p-12 text-center">
            <Shield className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 mb-2">Aucun risque identifié</p>
            <p className="text-slate-500 text-sm">Les risques apparaîtront ici une fois créés</p>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {risks.map((risk) => (
              <div key={risk.id} className="p-6 hover:bg-white/5 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white font-semibold">{risk.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        risk.level === 'critical' ? 'bg-red-500/20 text-red-400' :
                        risk.level === 'high' ? 'bg-orange-500/20 text-orange-400' :
                        risk.level === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {risk.level}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        risk.status === 'open' ? 'bg-yellow-500/20 text-yellow-400' :
                        risk.status === 'monitoring' ? 'bg-blue-500/20 text-blue-400' :
                        risk.status === 'mitigated' ? 'bg-green-500/20 text-green-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        {risk.status}
                      </span>
                    </div>
                    {risk.description && (
                      <p className="text-slate-400 text-sm mb-3">{risk.description}</p>
                    )}
                    {risk.mitigation_plan && (
                      <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <p className="text-slate-300 text-sm"><strong>Plan d'atténuation:</strong> {risk.mitigation_plan}</p>
                      </div>
                    )}
                  </div>
                  <div className="ml-4 flex gap-2">
                    {risk.probability && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{risk.probability}%</div>
                        <div className="text-xs text-slate-400">Probabilité</div>
                      </div>
                    )}
                    {risk.impact && (
                      <div className="text-center ml-4">
                        <div className="text-2xl font-bold text-white">{risk.impact}/10</div>
                        <div className="text-xs text-slate-400">Impact</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
