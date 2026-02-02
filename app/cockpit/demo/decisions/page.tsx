// ============================================================
// POWALYZE V2 — DEMO DECISIONS PAGE
// ============================================================

import { FileText, Lock } from 'lucide-react';
import Link from 'next/link';
import { MOCK_DECISIONS } from '@/lib/mock-data';

export default function DemoDecisionsPage() {
  const decisions = MOCK_DECISIONS;
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Décisions</h1>
          <p className="text-slate-400 mt-1">Données de démonstration</p>
        </div>
        <Link
          href="/upgrade"
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 px-4 py-2 rounded-lg font-medium"
        >
          <Lock className="w-4 h-4" />
          Créer une décision (Pro)
        </Link>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
          <p className="text-slate-400 text-sm">Total</p>
          <p className="text-2xl font-bold text-white">{decisions.length}</p>
        </div>
        <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
          <p className="text-slate-400 text-sm">Approuvées</p>
          <p className="text-2xl font-bold text-green-500">
            {decisions.filter(d => d.status === 'approved').length}
          </p>
        </div>
        <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
          <p className="text-slate-400 text-sm">En attente</p>
          <p className="text-2xl font-bold text-yellow-500">
            {decisions.filter(d => d.status === 'pending').length}
          </p>
        </div>
      </div>
      
      {/* Decisions List */}
      <div className="space-y-4">
        {decisions.map(decision => (
          <div key={decision.id} className="bg-slate-900 rounded-lg p-6 border border-slate-800">
            <div className="flex items-start gap-4">
              <FileText className="w-6 h-6 text-blue-500 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-white">{decision.title}</h3>
                    <p className="text-slate-400 text-sm mt-1">
                      {decision.committee} • {decision.decision_date ? new Date(decision.decision_date).toLocaleDateString('fr-FR') : 'N/A'}
                    </p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded ${
                    decision.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                    decision.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {decision.status === 'approved' ? 'Approuvée' :
                     decision.status === 'rejected' ? 'Rejetée' : 'En attente'}
                  </span>
                </div>
                
                <p className="text-slate-300 mb-4">{decision.description}</p>
                
                {decision.impacts && (
                  <div className="bg-slate-800 rounded-lg p-4">
                    <p className="text-slate-400 text-sm font-medium mb-2">Impacts</p>
                    <div className="grid grid-cols-3 gap-4">
                      {Object.entries(decision.impacts).map(([key, value]) => (
                        <div key={key}>
                          <p className="text-slate-500 text-xs capitalize">{key}</p>
                          <p className="text-white text-sm font-medium">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Upgrade CTA */}
      <div className="bg-blue-500/10 border border-blue-500 rounded-lg p-6">
        <h3 className="text-lg font-bold text-blue-400 mb-2">
          💡 Mode Démo - Données fictives
        </h3>
        <p className="text-blue-300 text-sm">
          Ces décisions sont des exemples. Pour gérer vos vraies décisions, 
          <Link href="/upgrade" className="underline font-medium ml-1">
            passez en Mode Pro
          </Link>.
        </p>
      </div>
    </div>
  );
}
