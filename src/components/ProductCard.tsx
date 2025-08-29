import React, { useState } from 'react';
import { Eye, Heart, ShoppingBag, Star, Cuboid as Cube } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  discount: string;
  image: string;
  size: string;
  material: string;
  colors: string[];
  inStock: boolean;
  isNew: boolean;
  isSale: boolean;
  glbUrl?: string;
  usdzUrl?: string;
}

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
  onViewProduct: (id: string) => void;
}

export default function ProductCard({ product, viewMode, onViewProduct }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const hasAR = product.glbUrl || product.usdzUrl;

  if (viewMode === 'list') {
    return (
      <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:scale-[1.02] group border border-white/20 overflow-hidden">
        <div className="flex">
          {/* Image */}
          <div className="relative w-80 h-64 flex-shrink-0 bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 rounded-l-3xl overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-4 right-4 w-24 h-24 bg-emerald-100/20 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute bottom-4 left-4 w-20 h-20 bg-blue-100/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>
            
            <img
              src={product.image}
              alt={product.name}
              className="relative z-10 w-full h-full object-contain p-4 transition-all duration-1000 group-hover:scale-105"
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                e.currentTarget.src = "https://images.pexels.com/photos/6782567/pexels-photo-6782567.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop";
              }}
            />
            
            {/* Premium Badge */}
            <div className="absolute -top-2 left-6 bg-gradient-to-r from-emerald-800 to-emerald-700 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg z-20">
              Premium Collection
            </div>
            
            {/* Status Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
              {product.isNew && (
                <span className="bg-emerald-800/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                  New
                </span>
              )}
              {product.isSale && product.discount !== '0% OFF' && (
                <span className="bg-red-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                  {product.discount}
                </span>
              )}
              {!product.inStock && (
                <span className="bg-gray-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                  Out of Stock
                </span>
              )}
            </div>

            {/* 3D Viewer Button */}
            {hasAR && (
              <button
                className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm text-emerald-800 p-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group/btn border border-emerald-100 z-20"
                aria-label="View in 3D Room"
              >
                <Cube className="w-5 h-5 group-hover/btn:rotate-12 transition-transform duration-300" />
              </button>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-8 flex flex-col justify-between bg-white/95 backdrop-blur-sm">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-emerald-800 transition-colors">
                {product.name}
              </h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Size:</span>
                  <span className="font-semibold text-gray-900">{product.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Material:</span>
                  <span className="font-semibold text-gray-900">{product.material}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Colors:</span>
                  <span className="font-semibold text-gray-900">{product.colors.slice(0, 2).join(', ')}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-6">
                {product.discount !== '0% OFF' && (
                  <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-full text-lg font-bold shadow-lg">
                    {product.discount}
                  </div>
                )}
                <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium">
                  Premium Quality
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onViewProduct(product.id)}
                className="flex-1 bg-emerald-800 hover:bg-emerald-700 disabled:bg-gray-300 text-white py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:cursor-not-allowed disabled:transform-none"
                disabled={!product.inStock}
              >
                {product.inStock ? 'View Details' : 'Out of Stock'}
              </button>
              
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                  isLiked 
                    ? 'bg-red-50 border-red-200 text-red-600 shadow-lg' 
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-200'
                }`}
              >
                <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:scale-[1.02] group border border-white/20 overflow-hidden">
      {/* Image */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-4 right-4 w-24 h-24 bg-emerald-100/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-4 left-4 w-20 h-20 bg-blue-100/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        {/* Premium Badge */}
        <div className="absolute -top-2 left-4 bg-gradient-to-r from-emerald-800 to-emerald-700 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg z-20">
          Premium Collection
        </div>
        
        <img
          src={product.image}
          alt={product.name}
          className="relative z-10 w-full h-full object-contain p-6 transition-all duration-1000 group-hover:scale-105"
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.currentTarget.src = "https://images.pexels.com/photos/6782567/pexels-photo-6782567.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop";
          }}
        />
        
        {/* Status Badges */}
        <div className="absolute top-6 left-4 flex flex-col gap-2 z-20">
          {product.isNew && (
            <span className="bg-emerald-800/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
              New
            </span>
          )}
          {product.isSale && discount > 0 && (
            <span className="bg-red-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
              -{discount}%
            </span>
          )}
          {!product.inStock && (
            <span className="bg-gray-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
              Out of Stock
            </span>
          )}
        </div>

        {/* 3D Viewer Button */}
        {hasAR && (
          <button
            className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm text-emerald-800 p-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group/btn border border-emerald-100 z-20"
            aria-label="View in 3D Room"
          >
            <Cube className="w-5 h-5 group-hover/btn:rotate-12 transition-transform duration-300" />
          </button>
        )}

        {/* Product Info Overlay */}
        <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">{product.name}</h4>
              <p className="text-xs text-gray-600">{product.size}</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-emerald-800">${product.price.toLocaleString()}</div>
              <div className="text-xs text-gray-500">{product.material}</div>
            </div>
          </div>
        </div>
        
        {/* Quick View Button */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
          <button
            onClick={() => onViewProduct(product.id)}
            className="bg-white/95 backdrop-blur-sm text-gray-900 px-6 py-3 rounded-2xl font-semibold hover:bg-white transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Eye className="w-5 h-5" />
            Quick View
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 bg-white/95 backdrop-blur-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-emerald-800 transition-colors">
          {product.name}
        </h3>
        
        <div className="text-gray-600 mb-4 flex items-center gap-2">
          {product.size} • {product.material}
        </div>

        <div className="flex items-center justify-between mb-6">
          {product.discount !== '0% OFF' && (
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
              {product.discount}
            </div>
          )}
          
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`p-3 rounded-2xl transition-all duration-300 hover:scale-105 ${
              isLiked 
                ? 'bg-red-50 text-red-600 shadow-lg' 
                : 'bg-gray-50 text-gray-600 hover:text-red-600 hover:bg-red-50'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          </button>
        </div>

        <button
          onClick={() => onViewProduct(product.id)}
          className="w-full bg-emerald-800 hover:bg-emerald-700 focus:bg-emerald-700 disabled:bg-gray-300 text-white py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          disabled={!product.inStock}
          aria-label={`View details for ${product.name}`}
        >
          {product.inStock ? 'View Details' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}