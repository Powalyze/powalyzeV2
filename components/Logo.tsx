import React from 'react';

interface LogoProps {
  size?: number;
  variant?: 'light' | 'dark';
  className?: string;
  showText?: boolean;
}

export default function Logo({ 
  size = 48, 
  variant = 'light',
  className = '',
  showText = true 
}: LogoProps) {
  const isLight = variant === 'light';
  const textColor = isLight ? 'text-white' : 'text-slate-900';
  const glowColor = isLight ? 'rgba(212, 175, 55, 0.4)' : 'rgba(212, 175, 55, 0.3)';
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo SVG avec effet premium */}
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none"
        className="flex-shrink-0"
        style={{
          filter: `drop-shadow(0 0 8px ${glowColor}) drop-shadow(0 0 16px ${glowColor})`
        }}
      >
        {/* Cercle extérieur avec gradient doré */}
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#f4e5c3', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#d4af37', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#c9a227', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="goldGradientDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#d4af37', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#c9a227', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#b8941f', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        
        {/* Cercle principal */}
        <circle 
          cx="50" 
          cy="50" 
          r="46" 
          stroke={`url(#${isLight ? 'goldGradient' : 'goldGradientDark'})`}
          strokeWidth="4" 
          fill="none"
          opacity="0.9"
        />
        
        {/* Diamant central stylisé (P de Powalyze) */}
        <path 
          d="M30 55 L50 25 L70 55 L50 75 Z" 
          fill={`url(#${isLight ? 'goldGradient' : 'goldGradientDark'})`}
          opacity="0.95"
        />
        
        {/* Accent subtil au centre */}
        <circle 
          cx="50" 
          cy="50" 
          r="8" 
          fill={isLight ? '#fff' : '#1e293b'}
          opacity="0.3"
        />
      </svg>
      
      {/* Texte Powalyze */}
      {showText && (
        <div className="flex flex-col">
          <span className={`font-semibold tracking-tight ${textColor} text-xl md:text-2xl`}
                style={{
                  textShadow: isLight 
                    ? '0 0 20px rgba(212, 175, 55, 0.3)' 
                    : '0 0 15px rgba(212, 175, 55, 0.2)'
                }}>
            Powalyze
          </span>
          <span className={`text-xs tracking-[0.15em] uppercase ${isLight ? 'text-white/50' : 'text-slate-600'}`}>
            Executive Cockpit
          </span>
        </div>
      )}
    </div>
  );
}

// Version compacte pour mobile
export function LogoCompact({ size = 40, variant = 'light' }: { size?: number; variant?: 'light' | 'dark' }) {
  return <Logo size={size} variant={variant} showText={false} />;
}

// Version avec texte vertical pour sidebar
export function LogoVertical({ size = 48, variant = 'light' }: { size?: number; variant?: 'light' | 'dark' }) {
  const isLight = variant === 'light';
  const textColor = isLight ? 'text-white' : 'text-slate-900';
  const glowColor = isLight ? 'rgba(212, 175, 55, 0.4)' : 'rgba(212, 175, 55, 0.3)';
  
  return (
    <div className="flex flex-col items-center gap-2">
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none"
        style={{
          filter: `drop-shadow(0 0 8px ${glowColor}) drop-shadow(0 0 16px ${glowColor})`
        }}
      >
        <defs>
          <linearGradient id="goldGradientV" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#f4e5c3', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#d4af37', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#c9a227', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="46" stroke="url(#goldGradientV)" strokeWidth="4" fill="none" opacity="0.9" />
        <path d="M30 55 L50 25 L70 55 L50 75 Z" fill="url(#goldGradientV)" opacity="0.95" />
        <circle cx="50" cy="50" r="8" fill={isLight ? '#fff' : '#1e293b'} opacity="0.3" />
      </svg>
      <span className={`font-semibold ${textColor} text-sm tracking-tight`}>
        Powalyze
      </span>
    </div>
  );
}

// Ancien export pour compatibilité
export function PowalyzeLogo({ className = "", size = 40 }: { className?: string; size?: number }) {
  return <Logo size={size} variant="light" showText={false} className={className} />;
}

// Version texte avec logo
export function PowalyzeLogoWithText({ className = "", logoSize = 40 }: { className?: string; logoSize?: number }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Logo size={logoSize} variant="light" showText={false} />
      <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 bg-clip-text text-transparent">
        Powalyze
      </span>
    </div>
  );
}
