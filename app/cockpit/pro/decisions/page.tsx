// ============================================================
// POWALYZE COCKPIT PRO — DECISIONS PAGE
// ============================================================

import { getAllDecisions } from '@/lib/data-v2';
import { FileCheck, Clock, CheckCircle2, XCircle } from 'lucide-react';

export default async function DecisionsPage() {
  const decisions = await getAllDecisions();
  
  // Stats
  const stats = {
    total: decisions.length,
    pending: decisions.filter(d => d.status === 'pending').length,
    approved: decisions.filter(d => d.status === 'approved').length,
    rejected: decisions.filter(d => d.status === 'rejected').length
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Décisions</h1>
        <p className="text-slate-400">Suivi des décisions stratégiques et opérationnelles</p>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Total</span>
            <FileCheck className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-white">{stats.total}</div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-yellow-500/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">En attente</span>
            <Clock className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="text-3xl font-bold text-yellow-400">{stats.pending}</div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-green-500/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Approuvées</span>
            <CheckCircle2 className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-green-400">{stats.approved}</div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-red-500/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Rejetées</span>
            <XCircle className="w-5 h-5 text-red-400" />
          </div>
          <div className="text-3xl font-bold text-red-400">{stats.rejected}</div>
        </div>
      </div>
      
      {/* Decisions List */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Toutes les décisions</h2>
        </div>
        
        {decisions.length === 0 ? (
          <div className="p-12 text-center">
            <FileCheck className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 mb-2">Aucune décision enregistrée</p>
            <p className="text-slate-500 text-sm">Les décisions apparaîtront ici une fois créées</p>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {decisions.map((decision) => (
              <div key={decision.id} className="p-6 hover:bg-white/5 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white font-semibold">{decision.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        decision.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                        decision.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                        decision.status === 'deferred' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {decision.status}
                      </span>
                      {decision.committee && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-purple-500/20 text-purple-400">
                          {decision.committee}
                        </span>
                      )}
                    </div>
                    {decision.description && (
                      <p className="text-slate-400 text-sm mb-3">{decision.description}</p>
                    )}
                    {decision.decision_date && (
                      <div className="text-xs text-slate-500">
                        Date de décision: {new Date(decision.decision_date).toLocaleDateString('fr-FR')}
                      </div>
                    )}
                    {decision.impacts && decision.impacts.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {decision.impacts.map((impact: any, idx: number) => (
                          <span key={idx} className="px-2 py-1 bg-white/5 rounded text-xs text-slate-300">
                            {impact}
                          </span>
                        ))}
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
