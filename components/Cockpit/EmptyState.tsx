"use client";

import React from 'react';
import { useTranslation } from '@/lib/i18n';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  ctaText?: string;
  ctaAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  ctaText,
  ctaAction
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-slate-800/30 rounded-full p-6 mb-6">
        {Icon ? (
          <Icon className="w-16 h-16 text-slate-500" />
        ) : (
          <div className="w-16 h-16 bg-slate-700 rounded-full" />
        )}
      </div>
      
      <h3 className="text-xl font-semibold text-slate-300 mb-2">
        {title || t('cockpit.emptyState.title')}
      </h3>
      
      <p className="text-slate-500 text-center mb-8 max-w-md">
        {description || t('cockpit.emptyState.description')}
      </p>
      
      {ctaAction && (
        <button
          onClick={ctaAction}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium"
        >
          {ctaText || t('cockpit.emptyState.cta')}
        </button>
      )}
    </div>
  );
};
