// ============================================================
// POWALYZE COCKPIT PRO — RAPPORTS IA PAGE
// ============================================================

import { getAllReports } from '@/lib/data-v2';
import { FileText, Sparkles, Clock, TrendingUp } from 'lucide-react';

export default async function RapportsPage() {
  const reports = await getAllReports();
  
  // Stats
  const stats = {
    total: reports.length,
    executive: reports.filter((r: any) => r.type === 'executive').length,
    project: reports.filter((r: any) => r.type === 'project').length,
    risk: reports.filter((r: any) => r.type === 'risk').length
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          Rapports IA
          <Sparkles className="w-8 h-8 text-purple-400" />
        </h1>
        <p className="text-slate-400">Rapports générés automatiquement par l'intelligence artificielle</p>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Total</span>
            <FileText className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-white">{stats.total}</div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-purple-500/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Executive</span>
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-purple-400">{stats.executive}</div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-green-500/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Projets</span>
            <FileText className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-green-400">{stats.project}</div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-yellow-500/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Risques</span>
            <Clock className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="text-3xl font-bold text-yellow-400">{stats.risk}</div>
        </div>
      </div>
      
      {/* Reports List */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Tous les rapports</h2>
        </div>
        
        {reports.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 mb-2">Aucun rapport généré</p>
            <p className="text-slate-500 text-sm">Les rapports IA apparaîtront ici une fois générés via le wizard</p>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {reports.map((report) => (
              <div key={report.id} className="p-6 hover:bg-white/5 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Sparkles className="w-5 h-5 text-purple-400" />
                      <h3 className="text-white font-semibold">{report.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        report.type === 'executive' ? 'bg-purple-500/20 text-purple-400' :
                        report.type === 'project' ? 'bg-blue-500/20 text-blue-400' :
                        report.type === 'risk' ? 'bg-red-500/20 text-red-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {report.type}
                      </span>
                    </div>
                    {report.content && (
                      <p className="text-slate-400 text-sm mb-3 line-clamp-3">{report.content}</p>
                    )}
                    {report.generated_at && (
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Clock className="w-4 h-4" />
                        <span>Généré le {new Date(report.generated_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
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
