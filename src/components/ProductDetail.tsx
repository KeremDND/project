import React, { useState } from 'react';
import { ArrowLeft, Heart, Share2, MapPin, Eye, Star, Shield, Truck, RotateCcw } from 'lucide-react';
import CarpetARViewer from './CarpetARViewer';

interface ProductDetailProps {
  productId: string | null;
  onNavigate: (page: 'home' | 'shop' | 'product' | 'gallery' | 'certificates' | 'about' | 'support') => void;
}

export default function ProductDetail({ productId, onNavigate }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showARViewer, setShowARViewer] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedSize, setSelectedSize] = useState('200x300');

  // Demo product data
  const product = {
    id: productId || '1',
    name: 'Persian Heritage Collection',
    discount: `${Math.floor(Math.random() * 16)}% OFF`,
    rating: 4.8,
    reviewCount: 127,
    images: [
      '/src/assets/carpet 4.PNG',
      '/src/assets/carpet 3.PNG',
      '/src/assets/Hero-carpet.PNG'
    ],
    description: 'Experience the timeless beauty of traditional Persian craftsmanship with our Heritage Collection carpet. Each piece is meticulously woven using premium polypropylene fibers, ensuring durability while maintaining the authentic look and feel of classic Persian designs.',
    features: [
      'Hand-selected premium polypropylene fibers',
      'Traditional Persian weaving techniques',
      'Fade-resistant colors with UV protection',
      'Anti-slip backing for safety',
      'Easy maintenance and cleaning',
      'Suitable for high-traffic areas'
    ],
    specifications: {
      material: 'Premium Polypropylene',
      density: '400 knots per m²',
      pile: '12mm',
      backing: 'Anti-slip latex',
      origin: 'Made in Turkmenistan',
      warranty: '5 years'
    },
    sizes: [
      { size: '140x200', price:  },
      { size: '160x230', price:  },
      { size: '200x300', price:  },
      { size: '250x350', price: 0 }
    ],
    colors: ['Burgundy & Gold', 'Navy & Cream', 'Forest & Beige'],
    inStock: true,
    stockCount: 12,
    glbUrl: '/models/persian-heritage.glb',
    usdzUrl: '/models/persian-heritage.usdz',
    posterUrl: '/src/assets/carpet 4.PNG'
  };

  const selectedSizeData = product.sizes.find(s => s.size === selectedSize);
  const currentPrice = selectedSizeData?.price || product.price;
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - currentPrice) / product.originalPrice) * 100)
    : 0;

  const relatedProducts = [
    {
      id: '2',
      name: 'Contemporary Wave',
      image: '/src/assets/carpet 3.PNG',
      size: '160x230 cm'
    },
    {
      id: '3',
      name: 'Royal Classic',
      image: '/src/assets/Hero-carpet.PNG',
      size: '250x350 cm'
    }
  ];

  const storeAvailability = [
    { store: 'Ashgabat Main Showroom', distance: '2.3 km', stock: 8 },
    { store: 'Central District Store', distance: '5.7 km', stock: 3 },
    { store: 'Berkararlyk Store', distance: '8.1 km', stock: 5 }
  ];

  return (
    <>
      <section className="min-h-screen bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
            <button
              onClick={() => {
                onNavigate('home');
                setTimeout(() => {
                  const element = document.querySelector('[data-section="stores"]');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }, 100);
              }}
              className="flex items-center gap-2 hover:text-emerald-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Shop
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.pexels.com/photos/6782567/pexels-photo-6782567.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop";
                  }}
                />
                
                {/* AR Button */}
                <button
                  onClick={() => setShowARViewer(true)}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-emerald-800 px-4 py-2 rounded-xl font-medium hover:bg-white transition-colors flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View in AR
                </button>

                {/* Sale Badge */}
                {discount > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    -{discount}% OFF
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              <div className="flex gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                      selectedImage === index 
                        ? 'border-emerald-800' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              
              {/* Header */}
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">
                      {product.rating} ({product.reviewCount} reviews)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="text-3xl font-bold text-emerald-800">
                    ${currentPrice.toLocaleString()}
                  </div>
                  {product.originalPrice && (
                    <div className="text-xl text-gray-500 line-through">
                      ${product.originalPrice.toLocaleString()}
                    </div>
                  )}
                  {discount > 0 && (
                    <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                      Save ${(product.originalPrice! - currentPrice).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Size</h3>
                <div className="grid grid-cols-2 gap-3">
                  {product.sizes.map((sizeOption) => (
                    <button
                      key={sizeOption.size}
                      onClick={() => setSelectedSize(sizeOption.size)}
                      className={`p-4 rounded-xl border-2 text-left transition-colors ${
                        selectedSize === sizeOption.size
                          ? 'border-emerald-800 bg-emerald-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium">{sizeOption.size} cm</div>
                      <div className="text-sm text-gray-600">
                        ${sizeOption.price.toLocaleString()}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <div className="flex gap-3">
                  <button className="flex-1 bg-emerald-800 hover:bg-emerald-700 text-white py-4 rounded-2xl font-semibold text-lg transition-colors">
                    Add to Cart
                  </button>
                  
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`p-4 rounded-2xl border-2 transition-colors ${
                      isLiked 
                        ? 'border-red-200 bg-red-50 text-red-600' 
                        : 'border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-600'
                    }`}
                  >
                    <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                  </button>
                  
                  <button className="p-4 rounded-2xl border-2 border-gray-200 text-gray-600 hover:border-gray-300 transition-colors">
                    <Share2 className="w-6 h-6" />
                  </button>
                </div>

                <button
                  onClick={() => setShowARViewer(true)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-4 rounded-2xl font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Eye className="w-5 h-5" />
                  View in Your Room (AR)
                </button>
              </div>

              {/* Stock Status */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-green-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium">In Stock</span>
                  <span className="text-sm">({product.stockCount} available)</span>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <Shield className="w-6 h-6 text-emerald-800 mx-auto mb-2" />
                  <div className="text-sm font-medium">5 Year Warranty</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <Truck className="w-6 h-6 text-emerald-800 mx-auto mb-2" />
                  <div className="text-sm font-medium">Free Delivery</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <RotateCcw className="w-6 h-6 text-emerald-800 mx-auto mb-2" />
                  <div className="text-sm font-medium">30 Day Returns</div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-16">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                <button className="border-b-2 border-emerald-800 text-emerald-800 py-4 px-1 font-medium">
                  Description
                </button>
                <button className="text-gray-500 hover:text-gray-700 py-4 px-1 font-medium">
                  Specifications
                </button>
                <button className="text-gray-500 hover:text-gray-700 py-4 px-1 font-medium">
                  Care Instructions
                </button>
                <button className="text-gray-500 hover:text-gray-700 py-4 px-1 font-medium">
                  Reviews
                </button>
              </nav>
            </div>

            <div className="py-8">
              <div className="grid lg:grid-cols-2 gap-12">
                <div>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {product.description}
                  </p>
                  
                  <h4 className="font-semibold text-gray-900 mb-4">Key Features:</h4>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-emerald-800 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Specifications</h4>
                    <div className="space-y-3">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <span className="font-medium text-gray-900">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Store Availability */}
          <div className="mt-16 bg-gray-50 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Store Availability</h3>
              <button
                onClick={() => onNavigate('stores')}
                className="flex items-center gap-2 text-emerald-800 hover:text-emerald-700 font-medium"
              >
                <MapPin className="w-4 h-4" />
                Find All Stores
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {storeAvailability.map((store, index) => (
                <div key={index} className="bg-white rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{store.store}</h4>
                  <div className="text-sm text-gray-600 mb-2">{store.distance} away</div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${
                      store.stock > 5 ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {store.stock} in stock
                    </span>
                    <button className="text-emerald-800 hover:text-emerald-700 text-sm font-medium">
                      Call Store
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">You Might Also Like</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct.id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
                  onClick={() => onNavigate('product', relatedProduct.id)}
                >
                  <div className="aspect-square">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{relatedProduct.name}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-emerald-800">
                        ${relatedProduct.price.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-600">{relatedProduct.size}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AR Viewer Modal */}
      {showARViewer && (
        <CarpetARViewer
          name={product.name}
          imageUrl={product.images[0]}
          glbUrl={product.glbUrl}
          usdzUrl={product.usdzUrl}
          posterUrl={product.posterUrl}
          sizeCm={{ 
            width: parseInt(selectedSize.split('x')[0]), 
            height: parseInt(selectedSize.split('x')[1]) 
          }}
          mode="studio"
          autoRotate={false}
          isFullscreen={true}
          onClose={() => setShowARViewer(false)}
        />
      )}
    </>
  );
}