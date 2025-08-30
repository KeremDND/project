import { useEffect, useRef } from 'react';

// Format followers: 12.4k, 1.2M
export const formatFollowers = (n: number) =>
  n >= 1_000_000 ? (n/1_000_000).toFixed(1)+'M' :
  n >= 1_000 ? (n/1_000).toFixed(1)+'k' : String(n);

// Autoplay on view (hook)
export function useAutoPlay() {
  const ref = useRef<HTMLDivElement|null>(null);
  
  useEffect(() => {
    if (!ref.current) return;
    
    const vids = Array.from(ref.current.querySelectorAll('video')) as HTMLVideoElement[];
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        const v = e.target as HTMLVideoElement;
        if (e.isIntersecting && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      });
    }, { rootMargin: '200px 0px' });
    
    vids.forEach(v => io.observe(v));
    return () => io.disconnect();
  }, []);
  
  return ref;
}
