import React from 'react';

type Rendition = { src: string; w: number };
type SrcSet = { avif: Rendition[]; webp: Rendition[]; jpg: Rendition[] };

interface CarpetItem {
  name: string;
  alt: string;
  srcset: SrcSet;
  width: number;
  height: number;
}

interface OptimizedCarpetPictureProps {
  item: CarpetItem;
  sizes?: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export function OptimizedCarpetPicture({
  item,
  sizes = "(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw",
  className = "",
  loading = "lazy"
}: OptimizedCarpetPictureProps) {
  const aspect = item.height && item.width ? (item.height / item.width) : (2020/1440);
  
  const toSrcset = (arr: Rendition[]) => 
    arr.sort((a, b) => a.w - b.w)
       .map(r => `${r.src} ${r.w}w`)
       .join(", ");
  
  const fallback = item.srcset.jpg
    .sort((a, b) => a.w - b.w)[Math.floor(item.srcset.jpg.length / 2)]?.src || "";

  return (
    <div 
      className={`relative overflow-hidden rounded-2xl ${className}`} 
      style={{ 
        aspectRatio: `${item.width}/${item.height || Math.round(item.width * aspect)}` 
      }}
    >
      <picture>
        <source 
          type="image/avif" 
          srcSet={toSrcset(item.srcset.avif)} 
          sizes={sizes} 
        />
        <source 
          type="image/webp" 
          srcSet={toSrcset(item.srcset.webp)} 
          sizes={sizes} 
        />
        <img
          src={fallback}
          alt={item.alt || item.name}
          loading={loading}
          decoding="async"
          className="w-full h-full object-cover"
        />
      </picture>
    </div>
  );
}

export default OptimizedCarpetPicture;