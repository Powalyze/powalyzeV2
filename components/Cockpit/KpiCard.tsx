"use client";

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface KpiCardProps {
  title: string;
  value: string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  subtitle?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  change,
  trend = 'neutral',
  icon,
  subtitle,
}) => {
  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="w-3 h-3" />;
    if (trend === 'down') return <TrendingDown className="w-3 h-3" />;
    return <Minus className="w-3 h-3" />;
  };
  
  const getTrendColor = () => {
    if (trend === 'up') return 'text-emerald-400 bg-emerald-500/10';
    if (trend === 'down') return 'text-red-400 bg-red-500/10';
    return 'text-slate-400 bg-slate-800';
  };
  
  return (
    <Card className="p-4 hover:border-slate-700 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon && <div className="text-slate-400">{icon}</div>}
          <span className="text-sm text-slate-400">{title}</span>
        </div>
        {change !== undefined && (
          <div className={cn('flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium', getTrendColor())}>
            {getTrendIcon()}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      
      <div className="mb-1">
        <div className="text-2xl font-bold text-slate-100">{value}</div>
      </div>
      
      {subtitle && (
        <div className="text-xs text-slate-500">{subtitle}</div>
      )}
    </Card>
  );
};
