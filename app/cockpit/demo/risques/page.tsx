// ============================================================
// POWALYZE V2 — DEMO RISQUES PAGE
// ============================================================

import { AlertTriangle, Lock } from 'lucide-react';
import Link from 'next/link';
import { MOCK_RISKS } from '@/lib/mock-data';

export default function DemoRisquesPage() {
  const risks = MOCK_RISKS;
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Risques</h1>
          <p className="text-slate-400 mt-1">Données de démonstration</p>
        </div>
        <Link
          href="/upgrade"
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 px-4 py-2 rounded-lg font-medium"
        >
          <Lock className="w-4 h-4" />
          Créer un risque (Pro)
        </Link>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
          <p className="text-slate-400 text-sm">Total</p>
          <p className="text-2xl font-bold text-white">{risks.length}</p>
        </div>
        <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
          <p className="text-slate-400 text-sm">Critiques</p>
          <p className="text-2xl font-bold text-red-500">
            {risks.filter(r => r.level === 'critical').length}
          </p>
        </div>
        <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
          <p className="text-slate-400 text-sm">Élevés</p>
          <p className="text-2xl font-bold text-orange-500">
            {risks.filter(r => r.level === 'high').length}
          </p>
        </div>
        <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
          <p className="text-slate-400 text-sm">Ouverts</p>
          <p className="text-2xl font-bold text-yellow-500">
            {risks.filter(r => r.status === 'open').length}
          </p>
        </div>
      </div>
      
      {/* Risks List */}
      <div className="space-y-4">
        {risks.map(risk => (
          <div key={risk.id} className="bg-slate-900 rounded-lg p-6 border border-slate-800">
            <div className="flex items-start gap-4">
              <AlertTriangle className={`w-6 h-6 flex-shrink-0 ${
                risk.level === 'critical' ? 'text-red-500' :
                risk.level === 'high' ? 'text-orange-500' :
                risk.level === 'medium' ? 'text-yellow-500' :
                'text-blue-500'
              }`} />
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-white">{risk.title}</h3>
                  <span className={`px-3 py-1 text-xs font-medium rounded ${
                    risk.level === 'critical' ? 'bg-red-500/20 text-red-400' :
                    risk.level === 'high' ? 'bg-orange-500/20 text-orange-400' :
                    risk.level === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {risk.level === 'critical' ? 'Critique' :
                     risk.level === 'high' ? 'Élevé' :
                     risk.level === 'medium' ? 'Moyen' : 'Faible'}
                  </span>
                </div>
                <p className="text-slate-400 mb-3">{risk.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-slate-500 text-sm">Probabilité</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-slate-800 rounded-full h-2">
                        <div
                          className="bg-red-500 h-full rounded-full"
                          style={{ width: `${(risk.probability || 0) * 100}%` }}
                        />
                      </div>
                      <span className="text-white text-sm">{Math.round((risk.probability || 0) * 100)}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-slate-500 text-sm">Impact</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-slate-800 rounded-full h-2">
                        <div
                          className="bg-orange-500 h-full rounded-full"
                          style={{ width: `${(risk.impact || 0) * 100}%` }}
                        />
                      </div>
                      <span className="text-white text-sm">{Math.round((risk.impact || 0) * 100)}%</span>
                    </div>
                  </div>
                </div>
                
                {risk.mitigation_plan && (
                  <div className="bg-slate-800 rounded-lg p-3">
                    <p className="text-slate-400 text-sm font-medium mb-1">Plan de mitigation</p>
                    <p className="text-slate-300 text-sm">{risk.mitigation_plan}</p>
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
          Ces risques sont des exemples. Pour gérer vos vrais risques, 
          <Link href="/upgrade" className="underline font-medium ml-1">
            passez en Mode Pro
          </Link>.
        </p>
      </div>
    </div>
  );
}
