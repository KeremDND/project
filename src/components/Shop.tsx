import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Grid, List } from 'lucide-react';
import ProductCard from './ProductCard';

interface Product {
  id: number;
  name: string;
  discount: string;
  image: string;
  size: string;
  style: string;
  material: string;
  color: string;
  availability: string;
  rating: number;
  reviews: number;
}

interface ShopProps {
  onNavigate: (page: string, productId?: number) => void;
}

export function Shop({ onNavigate }: ShopProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    size: 'all',
    color: 'all',
    material: 'all',
    style: 'all',
    priceRange: 'all'
  });

  // Demo products data
  const products: Product[] = [
    {
      id: 1,
      name: 'Persian Heritage Classic',
      price: 1299,
      image: 'https://images.pexels.com/photos/6969831/pexels-photo-6969831.jpeg?auto=compress&cs=tinysrgb&w=800',
      size: '200x300',
      style: 'Traditional',
      material: 'Wool',
      color: 'Red',
      availability: 'In Stock',
      rating: 4.8,
      reviews: 124
    },
    {
      id: 2,
      name: 'Modern Geometric Blue',
      price: 899,
      image: 'https://images.pexels.com/photos/6969832/pexels-photo-6969832.jpeg?auto=compress&cs=tinysrgb&w=800',
      size: '160x230',
      style: 'Modern',
      material: 'Polypropylene',
      color: 'Blue',
      availability: 'In Stock',
      rating: 4.6,
      reviews: 89
    },
    {
      id: 3,
      name: 'Vintage Medallion',
      price: 1599,
      image: 'https://images.pexels.com/photos/6969833/pexels-photo-6969833.jpeg?auto=compress&cs=tinysrgb&w=800',
      size: '250x350',
      style: 'Classic',
      material: 'Wool',
      color: 'Cream',
      availability: 'Limited',
      rating: 4.9,
      reviews: 156
    },
    {
      id: 4,
      name: 'Contemporary Abstract',
      price: 749,
      image: 'https://images.pexels.com/photos/6969834/pexels-photo-6969834.jpeg?auto=compress&cs=tinysrgb&w=800',
      size: '140x200',
      style: 'Modern',
      material: 'Cotton',
      color: 'Gray',
      availability: 'In Stock',
      rating: 4.5,
      reviews: 67
    },
    {
      id: 5,
      name: 'Royal Palace Design',
      price: 1899,
      image: 'https://images.pexels.com/photos/6969835/pexels-photo-6969835.jpeg?auto=compress&cs=tinysrgb&w=800',
      size: '220x320',
      style: 'Traditional',
      material: 'Wool',
      color: 'Brown',
      availability: 'In Stock',
      rating: 4.7,
      reviews: 203
    },
    {
      id: 6,
      name: 'Minimalist Lines',
      price: 649,
      image: 'https://images.pexels.com/photos/6969836/pexels-photo-6969836.jpeg?auto=compress&cs=tinysrgb&w=800',
      size: '180x270',
      style: 'Modern',
      material: 'Polypropylene',
      color: 'Green',
      availability: 'In Stock',
      rating: 4.4,
      reviews: 45
    }
  ];

  // Filter products based on search and filters
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSize = filters.size === 'all' || product.size.includes(filters.size);
      const matchesStyle = filters.style === 'all' || product.style.toLowerCase() === filters.style.toLowerCase();
      const matchesColor = filters.color === 'all' || product.color.toLowerCase() === filters.color.toLowerCase();
      const matchesMaterial = filters.material === 'all' || product.material.toLowerCase() === filters.material.toLowerCase();
      
      return matchesSearch && matchesSize && matchesStyle && matchesColor && matchesMaterial;
    });
  }, [searchTerm, filters, products]);

  const handleStoreLocator = () => {
    // Navigate to home page and scroll to stores section
    onNavigate('home');
    setTimeout(() => {
      const element = document.querySelector('[data-section="stores"]');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <section className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Shop Carpets
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Discover our premium collection of handcrafted carpets. Each piece combines 
            traditional artistry with modern quality standards.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search carpets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200"
            />
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            {/* Filter Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
              </button>

              {/* Quick Filters */}
              <select
                value={filters.style}
                onChange={(e) => setFilters({...filters, style: e.target.value})}
                className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="all">All Styles</option>
                <option value="traditional">Traditional</option>
                <option value="modern">Modern</option>
                <option value="classic">Classic</option>
              </select>

              <select
                value={filters.size}
                onChange={(e) => setFilters({...filters, size: e.target.value})}
                className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="all">All Sizes</option>
                <option value="140x200">140x200 cm</option>
                <option value="160x230">160x230 cm</option>
                <option value="200x300">200x300 cm</option>
                <option value="250x350">250x350 cm</option>
              </select>
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 mr-2">
                {filteredProducts.length} products
              </span>
              
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white text-emerald-800 shadow-sm'
                      : 'text-gray-600 hover:text-emerald-800'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white text-emerald-800 shadow-sm'
                      : 'text-gray-600 hover:text-emerald-800'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'grid-cols-1 max-w-4xl mx-auto'
        }`}>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              viewMode={viewMode}
              onViewProduct={(id) => onNavigate('product', id)}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No carpets found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilters({
                  size: 'all',
                  color: 'all',
                  material: 'all',
                  style: 'all',
                  priceRange: 'all'
                });
              }}
              className="px-6 py-3 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default Shop