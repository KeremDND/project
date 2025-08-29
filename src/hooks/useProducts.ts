import { useState, useEffect } from 'react';

interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
}

interface Category {
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  base_price: number;
  sale_price: number;
  is_featured: boolean;
  is_active: boolean;
  material: string;
  knot_density: string;
  sizes: any[];
  colors: string[];
  category: Category;
  product_images: ProductImage[];
}

interface UseProductsOptions {
  category?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock products data
      const mockProducts: Product[] = [
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
      
      // Apply filters
      let filteredProducts = mockProducts;
      
      if (options.category) {
        filteredProducts = filteredProducts.filter(p => p.category.slug === options.category);
      }
      
      if (options.featured) {
        filteredProducts = filteredProducts.filter(p => p.is_featured);
      }
      
      if (options.limit) {
        filteredProducts = filteredProducts.slice(0, options.limit);
      }
      
      setProducts(filteredProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [options.category, options.featured, options.limit, options.offset]);

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
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Mock product data
        const mockProduct: Product = {
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
        };
        
        setProduct(mockProduct);
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