// ============================================================
// POWALYZE V2 — DEMO RESSOURCES PAGE
// ============================================================

import { Users, Lock } from 'lucide-react';
import Link from 'next/link';
import { MOCK_RESOURCES } from '@/lib/mock-data';

export default function DemoRessourcesPage() {
  const resources = MOCK_RESOURCES;
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Ressources</h1>
          <p className="text-slate-400 mt-1">Données de démonstration</p>
        </div>
        <Link
          href="/upgrade"
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 px-4 py-2 rounded-lg font-medium"
        >
          <Lock className="w-4 h-4" />
          Créer une ressource (Pro)
        </Link>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
          <p className="text-slate-400 text-sm">Total</p>
          <p className="text-2xl font-bold text-white">{resources.length}</p>
        </div>
        <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
          <p className="text-slate-400 text-sm">Humaines</p>
          <p className="text-2xl font-bold text-blue-500">
            {resources.filter(r => r.type === 'human').length}
          </p>
        </div>
        <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
          <p className="text-slate-400 text-sm">Matériel</p>
          <p className="text-2xl font-bold text-green-500">
            {resources.filter(r => r.type === 'material').length}
          </p>
        </div>
      </div>
      
      {/* Resources List */}
      <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800 border-b border-slate-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Capacité</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Unité</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Coût unitaire</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {resources.map(resource => (
              <tr key={resource.id} className="hover:bg-slate-800/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    <span className="text-white font-medium">{resource.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                    resource.type === 'human' ? 'bg-blue-500/20 text-blue-400' :
                    resource.type === 'material' ? 'bg-green-500/20 text-green-400' :
                    'bg-purple-500/20 text-purple-400'
                  }`}>
                    {resource.type === 'human' ? 'Humaine' :
                     resource.type === 'material' ? 'Matériel' : 'Financier'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-white">{resource.capacity}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-slate-300">{resource.unit}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-white font-medium">
                    {(resource.cost_per_unit || 0).toLocaleString('fr-FR')} €
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Upgrade CTA */}
      <div className="bg-blue-500/10 border border-blue-500 rounded-lg p-6">
        <h3 className="text-lg font-bold text-blue-400 mb-2">
          💡 Mode Démo - Données fictives
        </h3>
        <p className="text-blue-300 text-sm">
          Ces ressources sont des exemples. Pour gérer vos vraies ressources, 
          <Link href="/upgrade" className="underline font-medium ml-1">
            passez en Mode Pro
          </Link>.
        </p>
      </div>
    </div>
  );
}
