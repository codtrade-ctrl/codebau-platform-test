import React from 'react';

interface CodeBauLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  variant?: 'light' | 'dark'; // 'dark' = on dark background (white text), 'light' = on light background (navy text)
  className?: string;
}

export const CodeBauLogo: React.FC<CodeBauLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  variant = 'dark',
  className = ''
}) => {
  const iconSizes = {
    sm: 'w-8 h-8 text-sm rounded-lg',
    md: 'w-10 h-10 text-base rounded-xl',
    lg: 'w-12 h-12 text-lg rounded-2xl'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  const subSizes = {
    sm: 'text-[8px]',
    md: 'text-[10px]',
    lg: 'text-[11px]'
  };

  const isDarkBg = variant === 'dark';

  return (
    <div className={`flex items-center gap-2.5 cursor-pointer group ${className}`}>
      {/* Brand Emblem - Geometric Construction Block & C/B Structural Beam Motif */}
      <div
        className={`${iconSizes[size]} ${isDarkBg ? 'bg-[#0f172a] border-[#f97316]/60' : 'bg-[#0f172a] border-[#f97316]'} border text-white font-black flex items-center justify-center shadow-md group-hover:border-[#f97316] group-hover:scale-105 transition-all shrink-0 relative overflow-hidden`}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="cbOrangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
          </defs>
          {/* Base construction block */}
          <rect x="0" y="0" width="100" height="100" rx="22" fill="url(#cbOrangeGrad)" />
          {/* Outer beam border */}
          <rect x="4" y="4" width="92" height="92" rx="18" fill="none" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="2.5" />
          {/* C Letter Construct (Stylized Construction Crane / Beams) */}
          <path d="M 68 32 L 40 32 C 32 32 28 36 28 44 L 28 56 C 28 64 32 68 40 68 L 68 68" stroke="#0f172a" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 68 32 L 40 32 C 32 32 28 36 28 44 L 28 56 C 28 64 32 68 40 68 L 68 68" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* B Letter Beam Construct */}
          <path d="M 48 32 L 68 32 C 73 32 76 35 76 39.5 C 76 44 73 47 68 47 L 48 47 L 70 47 C 75 47 78 50.5 78 55.5 C 78 60.5 75 64 70 64 L 48 64" stroke="#0f172a" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Corner Construction Level Spark */}
          <polygon points="80,18 86,28 74,28" fill="#fef08a" />
        </svg>
      </div>

      {/* Brand Text & Official Slogan */}
      <div>
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`${textSizes[size]} font-extrabold tracking-tight ${isDarkBg ? 'text-white' : 'text-[#0f172a]'}`}>
            CODE<span className="text-[#f97316]">BAU</span>
          </span>
        </div>
        {showSubtitle && (
          <p className={`${subSizes[size]} ${isDarkBg ? 'text-slate-300' : 'text-slate-600'} tracking-wider font-bold mt-0.5`}>
            Construiește cu încredere.
          </p>
        )}
      </div>
    </div>
  );
};

