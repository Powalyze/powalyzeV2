// ============================================================
// POWALYZE COCKPIT PRO — RESSOURCES PAGE
// ============================================================

import { getAllResources } from '@/lib/data-v2';
import { Users, Package, DollarSign, TrendingUp } from 'lucide-react';

export default async function RessourcesPage() {
  const resources = await getAllResources();
  
  // Stats
  const stats = {
    total: resources.length,
    human: resources.filter(r => r.type === 'human').length,
    material: resources.filter(r => r.type === 'material').length,
    financial: resources.filter(r => r.type === 'financial').length
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Ressources</h1>
        <p className="text-slate-400">Gestion des ressources humaines, matérielles et financières</p>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Total</span>
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-white">{stats.total}</div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-purple-500/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Humaines</span>
            <Users className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-purple-400">{stats.human}</div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-green-500/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Matérielles</span>
            <Package className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-green-400">{stats.material}</div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-yellow-500/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Financières</span>
            <DollarSign className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="text-3xl font-bold text-yellow-400">{stats.financial}</div>
        </div>
      </div>
      
      {/* Resources List */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Toutes les ressources</h2>
        </div>
        
        {resources.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 mb-2">Aucune ressource enregistrée</p>
            <p className="text-slate-500 text-sm">Les ressources apparaîtront ici une fois créées</p>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {resources.map((resource) => (
              <div key={resource.id} className="p-6 hover:bg-white/5 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white font-semibold">{resource.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        resource.type === 'human' ? 'bg-purple-500/20 text-purple-400' :
                        resource.type === 'material' ? 'bg-green-500/20 text-green-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {resource.type === 'human' ? 'Humaine' :
                         resource.type === 'material' ? 'Matérielle' : 'Financière'}
                      </span>
                    </div>
                    <div className="flex gap-6 text-sm text-slate-400">
                      {resource.capacity && resource.unit && (
                        <div>
                          <span className="text-slate-500">Capacité: </span>
                          <span className="text-white font-medium">{resource.capacity} {resource.unit}</span>
                        </div>
                      )}
                      {resource.cost_per_unit && (
                        <div>
                          <span className="text-slate-500">Coût unitaire: </span>
                          <span className="text-white font-medium">{resource.cost_per_unit}€</span>
                        </div>
                      )}
                    </div>
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
