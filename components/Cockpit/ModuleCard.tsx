"use client";

import React from 'react';
import '@/styles/design-system.css';

interface ModuleCardProps {
  title: string;
  subtitle: string;
  narration: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  icon?: React.ReactNode;
}

/**
 * ModuleCard - Structure premium unifiée pour tous les modules
 * 
 * A. Header premium (or/bleu)
 * B. Narration intégrée
 * C. Zone de travail (cartes blanches)
 * D. Actions alignées à droite
 */
export default function ModuleCard({
  title,
  subtitle,
  narration,
  children,
  actions,
  icon
}: ModuleCardProps) {
  return (
    <div className="ds-card ds-animate-fade-in">
      {/* A. Header Premium */}
      <div className="ds-card-header">
        <div>
          <div className="flex items-center gap-3 mb-1">
            {icon && <span className="ds-icon-gold">{icon}</span>}
            <h2 className="ds-card-title">{title}</h2>
          </div>
          <p className="ds-card-subtitle">{subtitle}</p>
        </div>
        
        {/* D. Actions alignées à droite */}
        {actions && (
          <div className="flex gap-2">
            {actions}
          </div>
        )}
      </div>

      {/* B. Narration intégrée */}
      {narration && (
        <div className="ds-narration">
          {narration}
        </div>
      )}

      {/* C. Zone de travail */}
      <div className="ds-card-body">
        {children}
      </div>
    </div>
  );
}
