// ============================================================
// STATUS BADGE - Professional Status Indicators
// ============================================================
'use client';

import { CheckCircle, Clock, AlertCircle, XCircle, Pause, Play } from 'lucide-react';

type StatusType = 
  | 'active' | 'pending' | 'completed' | 'blocked' | 'paused'
  | 'green' | 'yellow' | 'red' | 'grey'
  | 'low' | 'medium' | 'high' | 'critical'
  | 'draft' | 'approved' | 'rejected' | 'validated';

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  withIcon?: boolean;
}

export function StatusBadge({ status, label, size = 'md', withIcon = true }: StatusBadgeProps) {
  const configs: Record<StatusType, {
    color: string;
    icon: React.ElementType;
    defaultLabel: string;
  }> = {
    // Project Status
    active: { 
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', 
      icon: Play, 
      defaultLabel: 'Actif' 
    },
    pending: { 
      color: 'bg-amber-500/10 text-amber-400 border-amber-500/30', 
      icon: Clock, 
      defaultLabel: 'En attente' 
    },
    completed: { 
      color: 'bg-blue-500/10 text-blue-400 border-blue-500/30', 
      icon: CheckCircle, 
      defaultLabel: 'Terminé' 
    },
    blocked: { 
      color: 'bg-red-500/10 text-red-400 border-red-500/30', 
      icon: XCircle, 
      defaultLabel: 'Bloqué' 
    },
    paused: { 
      color: 'bg-slate-500/10 text-slate-400 border-slate-500/30', 
      icon: Pause, 
      defaultLabel: 'En pause' 
    },
    
    // Health Status
    green: { 
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', 
      icon: CheckCircle, 
      defaultLabel: 'Sain' 
    },
    yellow: { 
      color: 'bg-amber-500/10 text-amber-400 border-amber-500/30', 
      icon: AlertCircle, 
      defaultLabel: 'Attention' 
    },
    red: { 
      color: 'bg-red-500/10 text-red-400 border-red-500/30', 
      icon: XCircle, 
      defaultLabel: 'Critique' 
    },
    grey: { 
      color: 'bg-slate-500/10 text-slate-400 border-slate-500/30', 
      icon: Clock, 
      defaultLabel: 'Inactif' 
    },
    
    // Priority
    low: { 
      color: 'bg-slate-500/10 text-slate-400 border-slate-500/30', 
      icon: Clock, 
      defaultLabel: 'Faible' 
    },
    medium: { 
      color: 'bg-blue-500/10 text-blue-400 border-blue-500/30', 
      icon: AlertCircle, 
      defaultLabel: 'Moyen' 
    },
    high: { 
      color: 'bg-amber-500/10 text-amber-400 border-amber-500/30', 
      icon: AlertCircle, 
      defaultLabel: 'Élevé' 
    },
    critical: { 
      color: 'bg-red-500/10 text-red-400 border-red-500/30', 
      icon: AlertCircle, 
      defaultLabel: 'Critique' 
    },
    
    // Decision Status
    draft: { 
      color: 'bg-slate-500/10 text-slate-400 border-slate-500/30', 
      icon: Clock, 
      defaultLabel: 'Brouillon' 
    },
    approved: { 
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', 
      icon: CheckCircle, 
      defaultLabel: 'Approuvé' 
    },
    validated: { 
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', 
      icon: CheckCircle, 
      defaultLabel: 'Validé' 
    },
    rejected: { 
      color: 'bg-red-500/10 text-red-400 border-red-500/30', 
      icon: XCircle, 
      defaultLabel: 'Rejeté' 
    }
  };

  const config = configs[status];
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4'
  };

  return (
    <span 
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold border ${config.color} ${sizeClasses[size]} transition-all hover:scale-105`}
    >
      {withIcon && <Icon className={iconSizes[size]} />}
      <span>{label || config.defaultLabel}</span>
    </span>
  );
}
