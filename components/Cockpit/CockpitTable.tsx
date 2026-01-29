// ============================================================================
// CockpitTable - Tableau des items (risques, décisions, KPIs)
// ============================================================================

'use client';

import type { Item } from '@/lib/types-saas';
import { AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface Props {
  items: Item[];
  mode: 'pro' | 'demo';
}

export default function CockpitTable({ items, mode }: Props) {
  const [filter, setFilter] = useState<'all' | 'risk' | 'decision' | 'kpi'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ok' | 'warning' | 'critical'>('all');

  const filteredItems = items.filter((item) => {
    if (filter !== 'all' && item.type !== filter) return false;
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    return true;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical':
        return <AlertTriangle className="text-red-400" size={18} />;
      case 'warning':
        return <Clock className="text-yellow-400" size={18} />;
      case 'ok':
        return <CheckCircle className="text-green-400" size={18} />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      critical: 'bg-red-500/10 border-red-500/30 text-red-400',
      warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
      ok: 'bg-green-500/10 border-green-500/30 text-green-400',
    };
    return styles[status as keyof typeof styles] || '';
  };

  const getTypeBadge = (type: string) => {
    const styles = {
      risk: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
      decision: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
      kpi: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    };
    const labels = {
      risk: 'Risque',
      decision: 'Décision',
      kpi: 'KPI',
    };
    return {
      style: styles[type as keyof typeof styles],
      label: labels[type as keyof typeof labels],
    };
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-lg rounded-lg border border-slate-800/50">
      {/* Header avec filtres */}
      <div className="p-6 border-b border-slate-800/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Items du Cockpit</h2>
          {mode === 'demo' && (
            <span className="text-xs text-slate-500">
              Mode lecture seule - Passez au mode Pro pour modifier
            </span>
          )}
        </div>

        {/* Filtres */}
        <div className="flex gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white"
          >
            <option value="all">Tous les types</option>
            <option value="risk">Risques</option>
            <option value="decision">Décisions</option>
            <option value="kpi">KPIs</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white"
          >
            <option value="all">Tous les statuts</option>
            <option value="critical">Critique</option>
            <option value="warning">Avertissement</option>
            <option value="ok">OK</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Titre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Propriétaire
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Échéance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                IA
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                  Aucun item trouvé
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => {
                const typeBadge = getTypeBadge(item.type);
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-800/30 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${typeBadge.style}`}
                      >
                        {typeBadge.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-white">{item.title}</p>
                        {item.description && (
                          <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-300">{item.owner || '-'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.score !== undefined && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white">{item.score}</span>
                          <TrendingUp className="text-slate-500" size={14} />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.due_date && (
                        <span className="text-sm text-slate-300">
                          {new Date(item.due_date).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {item.ai_comment && (
                        <div className="max-w-xs">
                          <p className="text-xs text-slate-400 line-clamp-2">
                            {item.ai_comment}
                          </p>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
