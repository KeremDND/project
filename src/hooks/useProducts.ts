import { useState, useEffect } from 'react';
import { db, subscriptions } from '../lib/supabase';
import type { ProductWithImages } from '../types/database';

interface UseProductsOptions {
  category?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<ProductWithImages[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if Supabase is connected
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        console.info('Supabase not connected. Using mock data.');
        return useMockData();
      }
      
      // First check if tables exist by making a simple query
      try {
        const testQuery = await db.testConnection();
        if (testQuery.error) {
          console.warn('Database tables not found. Using mock data.');
          console.info('💡 To fix: Click "Connect to Supabase" button in the top right, then run the database migrations.');
          return useMockData();
        }
      } catch (err) {
        console.warn('Database connection test failed. Using mock data.');
        return useMockData();
      }
      
      // If tables exist, fetch real data
      const { data, error: fetchError } = await db.getProducts(options);
      
      if (fetchError) {
        console.error('Error fetching products:', fetchError);
        setError(fetchError);
      } else {
        setProducts(data || []);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const useMockData = () => {
    const mockProducts = [
      {
        id: '1',
        name: 'Traditional Persian Carpet',
        slug: 'traditional-persian-carpet',
        description: 'Beautiful handwoven traditional carpet with intricate patterns',
        base_price: 1400,
        sale_price: 1200,
        is_featured: true,
        is_active: true,
        material: 'Premium Polypropylene',
        knot_density: '450 knots/m²',
        sizes: [{"size": "200x300", "price": 1200}],
        colors: ['Burgundy & Gold', 'Navy & Cream'],
        category: { name: 'Traditional', slug: 'traditional' },
        product_images: [{
          id: '1',
          product_id: '1',
          image_url: 'https://images.pexels.com/photos/6969831/pexels-photo-6969831.jpeg',
          alt_text: 'Traditional Persian Carpet',
          is_primary: true,
          sort_order: 1,
          created_at: new Date().toISOString()
        }]
      },
      {
        id: '2',
        name: 'Modern Geometric Carpet',
        slug: 'modern-geometric-carpet',
        description: 'Contemporary design with geometric patterns',
        base_price: 1050,
        sale_price: 800,
        is_featured: true,
        is_active: true,
        material: 'Premium Polypropylene',
        knot_density: '380 knots/m²',
        sizes: [{"size": "160x230", "price": 800}],
        colors: ['Charcoal & Silver', 'Blue & White'],
        category: { name: 'Modern', slug: 'modern' },
        product_images: [{
          id: '2',
          product_id: '2',
          image_url: 'https://images.pexels.com/photos/6969832/pexels-photo-6969832.jpeg',
          alt_text: 'Modern Geometric Carpet',
          is_primary: true,
          sort_order: 1,
          created_at: new Date().toISOString()
        }]
      }
    ];
    
    setProducts(mockProducts as any);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [options.category, options.featured, options.limit, options.offset]);

  // Subscribe to real-time updates
  useEffect(() => {
    const subscription = subscriptions.subscribeToProducts((payload) => {
      console.log('Product update:', payload);
      // Refetch products when there are changes
      fetchProducts();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const refetch = () => {
    fetchProducts();
  };

  return {
    products,
    loading,
    error,
    refetch
  };
}

export function useProduct(slug: string) {
  const [product, setProduct] = useState<ProductWithImages | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error: fetchError } = await db.getProduct(slug);
        
        if (fetchError) {
          throw fetchError;
        }
        
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  return {
    product,
    loading,
    error
  };
}