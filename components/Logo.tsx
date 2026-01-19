export default function PowalyzeLogo({ className = "", size = 40 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Cercle extérieur - Bleu électrique */}
      <circle
        cx="100"
        cy="100"
        r="95"
        stroke="url(#blueGradient)"
        strokeWidth="3"
        fill="none"
        opacity="0.6"
      />
      
      {/* Hexagone central - Structure */}
      <path
        d="M100 30 L160 65 L160 135 L100 170 L40 135 L40 65 Z"
        stroke="url(#goldGradient)"
        strokeWidth="4"
        fill="url(#centerGradient)"
        opacity="0.9"
      />
      
      {/* P stylisé - Forme moderne */}
      <path
        d="M70 80 L70 140 M70 80 L110 80 Q130 80 130 100 Q130 120 110 120 L70 120"
        stroke="url(#goldGradient)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* Points IA - 3 points brillants */}
      <circle cx="140" cy="70" r="6" fill="#3B82F6" opacity="0.8">
        <animate
          attributeName="opacity"
          values="0.4;1;0.4"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="150" cy="95" r="4" fill="#60A5FA" opacity="0.7">
        <animate
          attributeName="opacity"
          values="0.3;0.9;0.3"
          dur="2.5s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="145" cy="115" r="5" fill="#93C5FD" opacity="0.6">
        <animate
          attributeName="opacity"
          values="0.2;0.8;0.2"
          dur="3s"
          repeatCount="indefinite"
        />
      </circle>
      
      {/* Ligne de connexion IA */}
      <path
        d="M110 100 Q125 85 140 70"
        stroke="#3B82F6"
        strokeWidth="2"
        strokeDasharray="3,3"
        opacity="0.4"
      />
      
      {/* Gradients */}
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="50%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
        
        <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="50%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1E40AF" />
        </linearGradient>
        
        <radialGradient id="centerGradient">
          <stop offset="0%" stopColor="#1E293B" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0F172A" stopOpacity="0.95" />
        </radialGradient>
      </defs>
    </svg>
  );
}

// Version texte avec logo
export function PowalyzeLogoWithText({ className = "", logoSize = 40 }: { className?: string; logoSize?: number }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <PowalyzeLogo size={logoSize} />
      <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 bg-clip-text text-transparent">
        Powalyze
      </span>
    </div>
  );
}
