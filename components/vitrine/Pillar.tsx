'use client';

import React from 'react';

export interface PillarProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function Pillar({ icon, title, description }: PillarProps) {
  return (
    <div className="text-center space-y-4 group">
      {/* Icône avec cercle doré */}
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gold to-gold-dark text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
        <span className="w-10 h-10">
          {icon}
        </span>
      </div>

      {/* Titre */}
      <h3 className="ds-subtitle-navy text-xl font-semibold">
        {title}
      </h3>

      {/* Description */}
      <p className="ds-body text-neutral-700 leading-relaxed max-w-sm mx-auto">
        {description}
      </p>
    </div>
  );
}
