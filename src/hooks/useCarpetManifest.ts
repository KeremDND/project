import { useState, useEffect } from 'react';

interface CarpetItem {
  id: string;
  name: string;
  sku: string;
  color: string;
  width: number;
  height: number;
  srcset: {
    avif: { src: string; w: number }[];
    webp: { src: string; w: number }[];
    jpg: { src: string; w: number }[];
  };
  glbUrl?: string | null;
  usdzUrl?: string | null;
  posterUrl?: string | null;
  alt: string;
  style: string;
  material: string;
  isFeatured: boolean;
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
        
        // Use static carpet data - the JSON file doesn't exist in production
        const staticCarpets = [
          {
            id: 'nusay-cream-2004',
            name: 'Nusay Premium Collection',
            sku: '2004',
            color: 'Cream',
            width: 1440,
            height: 2020,
            srcset: {
              avif: [{ src: 'https://images.pexels.com/photos/6969831/pexels-photo-6969831.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop', w: 800 }],
              webp: [{ src: 'https://images.pexels.com/photos/6969831/pexels-photo-6969831.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop', w: 800 }],
              jpg: [{ src: 'https://images.pexels.com/photos/6969831/pexels-photo-6969831.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop', w: 800 }]
            },
            alt: 'abadan-haly — 2004, cream, traditional, carpet',
            style: 'Traditional',
            material: 'Premium Polypropylene',
            isFeatured: true,
            glbUrl: null,
            usdzUrl: null,
            posterUrl: null
          },
          {
            id: 'grey-2078',
            name: 'Gunes Grey Collection',
            sku: '2078',
            color: 'Grey',
            width: 1440,
            height: 2020,
            srcset: {
              avif: [{ src: 'https://images.pexels.com/photos/6969832/pexels-photo-6969832.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop', w: 800 }],
              webp: [{ src: 'https://images.pexels.com/photos/6969832/pexels-photo-6969832.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop', w: 800 }],
              jpg: [{ src: 'https://images.pexels.com/photos/6969832/pexels-photo-6969832.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop', w: 800 }]
            },
            alt: 'abadan-haly — 2078, grey, carpet',
            style: 'Traditional',
            material: 'Premium Polypropylene',
            isFeatured: false,
            glbUrl: null,
            usdzUrl: null,
            posterUrl: null
          },
          {
            id: 'cream-2095',
            name: 'Gunes Cream Collection',
            sku: '2095',
            color: 'Cream',
            width: 1440,
            height: 2020,
            srcset: {
              avif: [{ src: 'https://images.pexels.com/photos/6969833/pexels-photo-6969833.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop', w: 800 }],
              webp: [{ src: 'https://images.pexels.com/photos/6969833/pexels-photo-6969833.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop', w: 800 }],
              jpg: [{ src: 'https://images.pexels.com/photos/6969833/pexels-photo-6969833.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop', w: 800 }]
            },
            alt: 'abadan-haly — 2095, cream, modern, carpet',
            style: 'Modern',
            material: 'Premium Polypropylene',
            isFeatured: false,
            glbUrl: null,
            usdzUrl: null,
            posterUrl: null
          },
          {
            id: 'red-2361',
            name: 'Gunes Red Collection',
            sku: '2361',
            color: 'Red',
            width: 1440,
            height: 2020,
            srcset: {
              avif: [{ src: 'https://images.pexels.com/photos/6969834/pexels-photo-6969834.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop', w: 800 }],
              webp: [{ src: 'https://images.pexels.com/photos/6969834/pexels-photo-6969834.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop', w: 800 }],
              jpg: [{ src: 'https://images.pexels.com/photos/6969834/pexels-photo-6969834.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop', w: 800 }]
            },
            alt: 'abadan-haly — 2361, red, traditional, carpet',
            style: 'Traditional',
            material: 'Premium Polypropylene',
            isFeatured: true,
            glbUrl: null,
            usdzUrl: null,
            posterUrl: null
          },
          {
            id: 'green-2361',
            name: 'Gunes Green Collection',
            sku: '2361',
            color: 'Green',
            width: 1440,
            height: 2020,
            srcset: {
              avif: [{ src: 'https://images.pexels.com/photos/6969835/pexels-photo-6969835.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop', w: 800 }],
              webp: [{ src: 'https://images.pexels.com/photos/6969835/pexels-photo-6969835.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop', w: 800 }],
              jpg: [{ src: 'https://images.pexels.com/photos/6969835/pexels-photo-6969835.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop', w: 800 }]
            },
            alt: 'abadan-haly — 2361, green, modern, carpet',
            style: 'Modern',
            material: 'Premium Polypropylene',
            isFeatured: true,
            glbUrl: null,
            usdzUrl: null,
            posterUrl: null
          }
        ];
        
        setCarpets(staticCarpets);
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
  
  // Get unique styles for filtering
  const styles = Array.from(new Set(carpets.map(c => c.style))).sort();

  return {
    carpets,
    colors,
    styles,
    loading,
    error
  };
}