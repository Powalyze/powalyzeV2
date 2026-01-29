// ============================================================================
// CockpitKpis - Cartes KPIs avec statistiques
// ============================================================================

import type { Item } from '@/lib/types-saas';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface Props {
  items: Item[];
}

export default function CockpitKpis({ items }: Props) {
  const stats = {
    total: items.length,
    critical: items.filter((i) => i.status === 'critical').length,
    warning: items.filter((i) => i.status === 'warning').length,
    ok: items.filter((i) => i.status === 'ok').length,
    risks: items.filter((i) => i.type === 'risk').length,
    decisions: items.filter((i) => i.type === 'decision').length,
    kpis: items.filter((i) => i.type === 'kpi').length,
  };

  const kpiCards = [
    {
      title: 'Items Critiques',
      value: stats.critical,
      icon: AlertCircle,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
    },
    {
      title: 'Avertissements',
      value: stats.warning,
      icon: Clock,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
    },
    {
      title: 'Items OK',
      value: stats.ok,
      icon: CheckCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
    },
    {
      title: 'Total Items',
      value: stats.total,
      subtitle: `${stats.risks} risques • ${stats.decisions} décisions • ${stats.kpis} KPIs`,
      color: 'text-slate-400',
      bgColor: 'bg-slate-800/50',
      borderColor: 'border-slate-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpiCards.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <div
            key={index}
            className={`${kpi.bgColor} backdrop-blur-lg rounded-lg p-6 border ${kpi.borderColor}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-2">{kpi.title}</p>
                <p className={`text-3xl font-bold ${kpi.color}`}>{kpi.value}</p>
                {kpi.subtitle && (
                  <p className="text-xs text-slate-500 mt-2">{kpi.subtitle}</p>
                )}
              </div>
              {Icon && <Icon className={kpi.color} size={24} />}
            </div>
          </div>
        );
      })}
    </div>
  );
}
