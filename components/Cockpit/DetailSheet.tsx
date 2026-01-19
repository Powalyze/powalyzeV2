'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface DetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function DetailSheet({ 
  isOpen, 
  onClose, 
  title, 
  children 
}: DetailSheetProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 ds-animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl ds-animate-slide-in-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header fixe */}
        <div className="sticky top-0 bg-white border-b border-neutral-200 px-8 py-6 flex items-center justify-between z-10">
          <h2 className="ds-title-gold text-2xl">{title}</h2>
          <button 
            onClick={onClose} 
            className="ds-btn ds-btn-ghost hover:bg-neutral-100 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenu scrollable */}
        <div className="overflow-y-auto max-h-[calc(90vh-88px)] p-8 space-y-8">
          {children}
        </div>
      </div>
    </div>
  );
}

export function DetailSection({ 
  title, 
  children, 
  icon 
}: { 
  title: string; 
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        {icon && <span className="text-gold">{icon}</span>}
        <h3 className="ds-subtitle-navy text-lg font-semibold">{title}</h3>
      </div>
      <div className="pl-7">
        {children}
      </div>
    </section>
  );
}

export function DetailField({ 
  label, 
  value 
}: { 
  label: string; 
  value: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-3 gap-4 py-3 border-b border-neutral-100 last:border-0">
      <span className="text-sm font-medium text-neutral-600">{label}</span>
      <span className="col-span-2 text-sm text-navy">{value}</span>
    </div>
  );
}
