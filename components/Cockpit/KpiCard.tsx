/**
 * COMPOSANT: KPICard
 * Carte KPI premium pour synthèses hautes
 * Maximum 3-4 cartes par module
 */

'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface KPICardProps {
  label: string;
  value: number | string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  variant?: 'default' | 'warning' | 'success' | 'danger';
}

export default function KPICard({ 
  label, 
  value, 
  icon, 
  trend, 
  trendValue,
  variant = 'default'
}: KPICardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'stable':
        return <Minus className="w-4 h-4 text-neutral-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="card-premium">
      <div className="flex items-start justify-between mb-4">
        <div className="text-2xl opacity-80">
          {icon}
        </div>
        {trend && trendValue && (
          <div className="flex items-center gap-1">
            {getTrendIcon()}
            <span className="text-xs font-medium">{trendValue}</span>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-sm opacity-70">{label}</p>
        <p className={`header-title text-3xl ${
          variant === 'danger' ? 'text-red-600' : 
          variant === 'warning' ? 'text-yellow-600' :
          variant === 'success' ? 'text-green-600' : ''
        }`}>
          {value}
        </p>
      </div>
    </div>
  );
}
