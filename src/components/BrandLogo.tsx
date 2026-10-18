import React from 'react';
import { Play } from 'lucide-react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showSubtitle?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ 
  size = 'md', 
  className = '',
  showSubtitle = true 
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-13 h-13',
  };

  const playSizes = {
    sm: 'w-3.5 h-3.5 ml-0.5',
    md: 'w-4 h-4 ml-0.5',
    lg: 'w-5 h-5 ml-0.5',
    xl: 'w-6 h-6 ml-0.5',
  };

  const titleSizes = {
    sm: 'text-base',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-4xl',
  };

  const badgeSizes = {
    sm: 'text-[9px] -top-1 px-1 py-0.2',
    md: 'text-[10px] sm:text-[11px] -top-1.5 px-1.5 py-0.5',
    lg: 'text-xs -top-2 px-1.5 py-0.5',
    xl: 'text-sm -top-2.5 px-2 py-0.5',
  };

  const subSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px] sm:text-[11px]',
    lg: 'text-xs',
    xl: 'text-sm',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Sleek Gradient Brand Emblem */}
      <div className={`${iconSizes[size]} rounded-xl bg-gradient-to-tr from-cyan-400 via-teal-300 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/25 shrink-0 group-hover:scale-105 transition-transform`}>
        <Play className={`${playSizes[size]} fill-slate-950 text-slate-950`} />
      </div>

      {/* Brand Typography: Nest TV with HD above/after V, and by Naim Xbz beneath */}
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-baseline">
          <span className={`${titleSizes[size]} font-black tracking-tight text-white font-['Outfit']`}>
            Nest TV
          </span>
          <sup 
            className={`relative ${badgeSizes[size]} font-black text-cyan-300 font-mono tracking-wider ml-1 rounded-md bg-cyan-950/90 border border-cyan-400/50 shadow-sm shadow-cyan-500/20`}
            title="High Definition"
          >
            HD
          </sup>
        </div>

        {showSubtitle && (
          <div className={`${subSizes[size]} font-medium text-slate-400 tracking-wider font-sans mt-0.5 flex items-center gap-1`}>
            <span>by</span>
            <span className="text-cyan-300 font-bold tracking-normal hover:text-white transition-colors">
              Naim Xbz
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
