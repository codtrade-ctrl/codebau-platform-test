import React, { useState } from 'react';
import { Package, ImageOff } from 'lucide-react';

interface ProductImageProps {
  src?: string;
  alt: string;
  category?: string;
  className?: string;
  objectFit?: 'cover' | 'contain';
  aspectRatio?: string;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  category = 'Materiale de Construcții',
  className = '',
  objectFit = 'cover',
  aspectRatio = 'aspect-square'
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // If URL is missing or invalid, or load failed, render fallback placeholder
  const showFallback = !src || hasError;

  if (showFallback) {
    return (
      <div 
        className={`w-full ${aspectRatio} bg-[#F8FAF9] border border-[#D9E2E1] rounded-xl flex flex-col items-center justify-center p-4 text-center select-none relative overflow-hidden group ${className}`}
      >
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:12px_12px] opacity-30" />
        
        <div className="relative z-10 flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-white border border-[#D9E2E1] flex items-center justify-center text-[#087F5B] shadow-sm group-hover:scale-105 transition-transform">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#0D1B2A] line-clamp-1">{category}</p>
            <p className="text-[10px] font-semibold text-[#5C6670] uppercase tracking-wider mt-0.5">
              Imagine demonstrativă
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${aspectRatio} bg-[#F8FAF9] ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#E9ECEF] animate-pulse flex items-center justify-center">
          <Package className="w-6 h-6 text-[#5C6670]" />
        </div>
      )}
      <img
        src={src}
        alt={alt || 'Imagine produs CodeBau'}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full ${objectFit === 'contain' ? 'object-contain p-2' : 'object-cover'} transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
};
