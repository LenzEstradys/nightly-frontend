import React from 'react';

interface NightlyLogoProps {
  size?: number;
  animated?: boolean;
  variant?: 'full' | 'icon' | 'simple';
}

export const NightlyLogo: React.FC<NightlyLogoProps> = ({ 
  size = 200, 
  animated = true,
  variant = 'full' 
}) => {
  // Versión completa con animación
  if (variant === 'full') {
    return (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 200 240" 
        width={size} 
        height={size * 1.2}
        style={{ display: 'block' }}
      >
        <defs>
          <linearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#a855f7', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
          </linearGradient>
          
          <filter id="shadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
            <feOffset dx="0" dy="4" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Sombra */}
        <ellipse cx="100" cy="220" rx="40" ry="8" fill="#000000" opacity="0.2"/>
        
        {/* Pin principal */}
        <g filter="url(#shadow)">
          <path 
            d="M 100 20 C 60 20, 40 50, 40 85 C 40 140, 100 200, 100 200 C 100 200, 160 140, 160 85 C 160 50, 140 20, 100 20 Z" 
            fill="url(#mainGradient)" 
            stroke="#ffffff" 
            strokeWidth="4"
          />
        </g>
        
        {/* Cara */}
        <circle cx="100" cy="75" r="35" fill="#ffffff" opacity="0.95"/>
        
        {/* Ojos */}
        <path 
          d="M 85 65 Q 88 70, 91 65" 
          stroke="#a855f7" 
          strokeWidth="3" 
          strokeLinecap="round" 
          fill="none"
        />
        <circle cx="115" cy="68" r="4" fill="#a855f7"/>
        <circle cx="116" cy="67" r="1.5" fill="#ffffff"/>
        
        {/* Sonrisa */}
        <path 
          d="M 85 85 Q 100 95, 115 85" 
          stroke="#a855f7" 
          strokeWidth="3" 
          strokeLinecap="round" 
          fill="none"
        />
        
        {/* Mejillas */}
        <ellipse cx="80" cy="80" rx="6" ry="4" fill="#ec4899" opacity="0.3"/>
        <ellipse cx="120" cy="80" rx="6" ry="4" fill="#ec4899" opacity="0.3"/>
        
        {/* Destellos animados */}
        {animated && (
          <>
            <circle cx="90" cy="50" r="3" fill="#ffffff">
              <animate 
                attributeName="opacity" 
                values="0.4;1;0.4" 
                dur="1.5s" 
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="130" cy="45" r="2" fill="#ffffff">
              <animate 
                attributeName="opacity" 
                values="0.3;0.8;0.3" 
                dur="2s" 
                repeatCount="indefinite"
              />
            </circle>
          </>
        )}
        
        {/* Nota musical */}
        <g opacity="0.7">
          <circle cx="145" cy="60" r="4" fill="#ffffff"/>
          <rect x="145" y="45" width="2" height="15" fill="#ffffff"/>
          {animated && (
            <animate 
              attributeName="opacity" 
              values="0.5;1;0.5" 
              dur="3s" 
              repeatCount="indefinite"
            />
          )}
        </g>
        
        {/* Letra N */}
        <text 
          x="100" 
          y="180" 
          fontFamily="Arial, sans-serif" 
          fontSize="28" 
          fontWeight="bold" 
          fill="#ffffff" 
          textAnchor="middle"
        >
          N
        </text>
      </svg>
    );
  }
  
  // Versión icono (solo el pin, sin detalles)
  if (variant === 'icon') {
    return (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 100 120" 
        width={size} 
        height={size * 1.2}
      >
        <defs>
          <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#a855f7', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        
        <path 
          d="M 50 10 C 30 10, 20 25, 20 42.5 C 20 70, 50 100, 50 100 C 50 100, 80 70, 80 42.5 C 80 25, 70 10, 50 10 Z" 
          fill="url(#iconGradient)" 
          stroke="#ffffff" 
          strokeWidth="3"
        />
        
        <circle cx="50" cy="37.5" r="15" fill="#ffffff" opacity="0.95"/>
        
        <text 
          x="50" 
          y="44" 
          fontFamily="Arial, sans-serif" 
          fontSize="16" 
          fontWeight="bold" 
          fill="#a855f7" 
          textAnchor="middle"
        >
          N
        </text>
      </svg>
    );
  }
  
  // Versión simple (emoji style)
  return (
    <div style={{ fontSize: size, lineHeight: 1 }}>
      🌃
    </div>
  );
};

export default NightlyLogo;
