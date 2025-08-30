import React, { useState, lazy, Suspense } from 'react';
import { Filter, Grid, List, Cuboid as Cube } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Lazy load 3D viewer
const Product3DViewer = lazy(() => import('./Product3DViewer'));

export default function Products() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [show3DViewer, setShow3DViewer] = useState(false);

  const filters = [
    { id: 'all', label: t('products.filter.all') },
    { id: 'traditional', label: 'Traditional' },
    { id: 'modern', label: 'Modern' },
    { id: 'classic', label: 'Classic' }
  ];

  const products = [
    {
      id: 1,
      name: 'Persian Heritage',
      category: 'traditional',
      price: '$1,299',
      image: 'https://images.pexels.com/photos/6782589/pexels-photo-6782589.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
      size: '200x300 cm',
      density: '400 knots/m²',
      material: 'Polypropylene'
    },
    {
      id: 2,
      name: 'Contemporary Wave',
      category: 'modern',
      price: '$899',
      image: 'https://images.pexels.com/photos/6782589/pexels-photo-6782589.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
      size: '160x230 cm',
      density: '350 knots/m²',
      material: 'Polypropylene',
      posterUrl: 'https://images.pexels.com/photos/6782589/pexels-photo-6782589.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop'
    },
    {
      id: 3,
      name: 'Royal Classic',
      category: 'classic',
      price: '$1,599',
      image: 'https://images.pexels.com/photos/6969831/pexels-photo-6969831.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
      size: '250x350 cm',
      density: '500 knots/m²',
      material: 'Polypropylene',
      posterUrl: 'https://images.pexels.com/photos/6969831/pexels-photo-6969831.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop'
    },
    {
      id: 4,
      name: 'Geometric Modern',
      category: 'modern',
      price: '$749',
      image: 'https://images.pexels.com/photos/6969832/pexels-photo-6969832.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
      size: '140x200 cm',
      density: '300 knots/m²',
      material: 'Polypropylene',
      posterUrl: 'https://images.pexels.com/photos/6969832/pexels-photo-6969832.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop'
    },
    {
      id: 5,
      name: 'Vintage Collection',
      category: 'traditional',
      price: '$1,199',
      image: 'https://images.pexels.com/photos/6969833/pexels-photo-6969833.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
      size: '180x270 cm',
      density: '450 knots/m²',
      material: 'Polypropylene'
    },
    {
      id: 6,
      name: 'Elegant Classic',
      category: 'classic',
      price: '$1,399',
      image: 'https://images.pexels.com/photos/6969834/pexels-photo-6969834.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
      size: '220x320 cm',
      density: '480 knots/m²',
      material: 'Polypropylene'
    }
  ];

  const filteredProducts = activeFilter === 'all' 
    ? products 
    : products.filter(product => product.category === activeFilter);

  const scrollToStores = () => {
    const element = document.getElementById('stores');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const open3DViewer = (product: any) => {
    const [width, height] = product.size.split('x').map((s: string) => parseInt(s.trim()));
    setSelectedProduct({
      ...product,
      sizeCm: { width, height }
    });
    setShow3DViewer(true);
  };

  const close3DViewer = () => {
    setShow3DViewer(false);
    setSelectedProduct(null);
  };
  return (
    <>
      <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {t('products.title')}
          </h2>
          <div className="w-24 h-1 bg-green-800 mx-auto"></div>
        </div>

        {/* Filters and View Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 space-y-4 md:space-y-0">
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  activeFilter === filter.id
                    ? 'bg-green-800 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* View Controls */}
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-green-800 shadow-sm'
                  : 'text-gray-600 hover:text-green-800'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-green-800 shadow-sm'
                  : 'text-gray-600 hover:text-green-800'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className={`grid gap-8 ${
          viewMode === 'grid' 
            ? 'md:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-1 max-w-4xl mx-auto'
        }`}>
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:scale-105 ${
                viewMode === 'list' ? 'flex' : ''
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`relative ${viewMode === 'list' ? 'w-80 flex-shrink-0' : ''}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className={`object-cover group-hover:scale-110 transition-transform duration-700 ${
                    viewMode === 'list' ? 'w-full h-full' : 'w-full h-64'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <button className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/30">
                  <Eye className="w-5 h-5" />
                </button>
              </div>
              
              <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Size:</span>
                    <span className="font-medium">{product.size}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Density:</span>
                    <span className="font-medium">{product.density}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Material:</span>
                    <span className="font-medium">{product.material}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-green-800">
                    {product.price}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <button 
                    onClick={() => open3DViewer(product)}
                    className="w-full bg-emerald-800 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center space-x-2"
                  >
                    <Cube className="w-4 h-4" />
                    <span>View in 3D Room</span>
                  </button>
                  
                  <button
                    onClick={scrollToStores}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg font-medium transition-colors duration-300"
                  >
                    Check local availability
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </section>

      {/* 3D Room Viewer Modal */}
      {show3DViewer && selectedProduct && (
        <Suspense fallback={
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p>Loading 3D Room Viewer...</p>
            </div>
          </div>
        }>
          <Product3DViewer
            productImage={selectedProduct.image}
            productName={selectedProduct.name}
            carpetSize={selectedProduct.sizeCm}
            isOpen={show3DViewer}
            onClose={close3DViewer}
            autoRotate={false}
            showControls={true}
          />
        </Suspense>
      )}
    </>
  );
}