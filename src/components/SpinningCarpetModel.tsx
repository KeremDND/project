import React, { useRef, useEffect } from 'react';
import { Cuboid as Cube } from 'lucide-react';

interface SpinningCarpetModelProps {
  imageUrl: string;
  alt: string;
  className?: string;
  onView3D?: () => void;
}

export default function SpinningCarpetModel({ imageUrl, alt, className = "", onView3D }: SpinningCarpetModelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  return (
    <div 
      ref={containerRef}
      className={`relative perspective-1000 ${className}`}
      style={{ perspective: '1000px' }}
    >
      {/* 3D Stage */}
      <div className="relative w-full h-full flex items-center justify-center">
        
        {/* Floating Background Elements */}
        <div className="absolute -top-8 -left-8 w-24 h-24 bg-emerald-100/40 rounded-full blur-xl animate-float"></div>
        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-blue-100/40 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
        
        {/* Main Container */}
        <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 lg:p-12 border border-white/20 transition-all duration-700 transform hover:scale-[1.02] group">
          
          {/* Premium Badge */}
          <div className="absolute -top-4 left-8 bg-gradient-to-r from-emerald-800 to-emerald-700 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
            Premium Collection
          </div>
          
          {/* 3D Spinning Carpet */}
          <div className="relative w-full h-[500px] lg:h-[600px] flex items-center justify-center overflow-hidden">
            <img
              ref={imageRef}
              src={imageUrl.startsWith('public/') ? imageUrl.replace('public/', '/') : imageUrl}
              alt={alt}
              className="w-full h-full object-contain transition-all duration-1000 group-hover:scale-105"
              style={{
                maxWidth: '95%',
                maxHeight: '95%',
              }}
              onError={(e) => {
                e.currentTarget.src = "public/cdn/Halylar/Cream/abadan-haly-Gunes- Cream- 2004- carpet-1080.jpg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop";
              }}
            />
          </div>
          
          {/* 3D Viewer Button */}
          <button
            onClick={onView3D}
            className="absolute top-8 right-8 bg-white/90 backdrop-blur-sm text-emerald-800 p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group/btn border border-emerald-100"
            aria-label="View in 3D Room"
          >
            <Cube className="w-6 h-6 group-hover/btn:rotate-12 transition-transform duration-300" />
          </button>
          
          {/* Product Info Overlay */}
          <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-gray-900">Signature Collection</h3>
                <p className="text-sm text-gray-600">250 × 350 cm</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-emerald-800">Premium</div>
                <div className="text-xs text-gray-500">Polypropylene</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}