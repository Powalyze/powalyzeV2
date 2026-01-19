'use client';

import React from 'react';
import Image from 'next/image';

export interface ModuleShowcaseProps {
  title: string;
  screenshot: string;
  narrative: string;
  icon?: React.ReactNode;
}

export default function ModuleShowcase({ 
  title, 
  screenshot, 
  narrative,
  icon 
}: ModuleShowcaseProps) {
  return (
    <div className="group ds-card overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
      {/* Screenshot */}
      <div className="relative aspect-video bg-neutral-100 overflow-hidden">
        <Image
          src={screenshot}
          alt={`Module ${title}`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Contenu */}
      <div className="p-6 space-y-3">
        <div className="flex items-center gap-3">
          {icon && <span className="text-gold">{icon}</span>}
          <h3 className="ds-subtitle-navy text-xl font-semibold">{title}</h3>
        </div>
        <p className="ds-body text-neutral-700 leading-relaxed">
          {narrative}
        </p>
      </div>
    </div>
  );
}
