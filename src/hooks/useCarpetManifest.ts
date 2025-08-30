import { useState, useEffect } from 'react';

interface CarpetItem {
  id: string;
  name: string;
  color: string;
  slug: string;
  alt: string;
  width: number;
  height: number;
  sizeCm: { widthCm?: number; heightCm?: number };
  dominantColorHex: string;
  srcset: {
    avif: { src: string; w: number }[];
    webp: { src: string; w: number }[];
    jpg: { src: string; w: number }[];
  };
  glbUrl?: string | null;
  usdzUrl?: string | null;
  posterUrl?: string | null;
}

export function useCarpetManifest() {
  const [carpets, setCarpets] = useState<CarpetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadManifest = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load the actual carpet manifest data
        const response = await fetch('/data/carpets.json');
        if (!response.ok) {
          throw new Error(`Failed to load carpet data: ${response.status}`);
        }
        
        const carpetData = await response.json();
        setCarpets(carpetData);
      } catch (err) {
        console.error('Error loading carpet data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load carpet data');
      } finally {
        setLoading(false);
      }
    };

    loadManifest();
  }, []);

  // Get unique colors for filtering
  const colors = Array.from(new Set(carpets.map(c => c.color))).sort();
  
  // Extract style from name (fallback to 'Traditional' if not found)
  const styles = Array.from(new Set(carpets.map(c => {
    const name = c.name.toLowerCase();
    if (name.includes('traditional')) return 'Traditional';
    if (name.includes('modern')) return 'Modern';
    if (name.includes('classic')) return 'Classic';
    return 'Traditional'; // Default
  }))).sort();

  return {
    carpets,
    colors,
    styles,
    loading,
    error
  };
}