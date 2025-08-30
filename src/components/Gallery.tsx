import React, { useState, lazy, Suspense, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Filter, Cuboid as Cube, Award, Shield, Leaf, ZoomIn, ZoomOut, RotateCcw, Search, Sparkles, Send, Bot, Users, Factory, Globe, MessageCircle, Lightbulb, Eye, SlidersHorizontal, Grid, List, ArrowDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCarpetManifest } from '../hooks/useCarpetManifest';
import { OptimizedCarpetPicture } from './OptimizedCarpetPicture';

// Lazy load 3D viewer
const Product3DViewer = lazy(() => import('./Product3DViewer'));

export default function Gallery() {
  const { t, language } = useLanguage();
  const { carpets, colors: availableColors, styles: availableStyles, loading: manifestLoading, error: manifestError } = useCarpetManifest();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [show3DViewer, setShow3DViewer] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResults, setAiResults] = useState<any[]>([]);
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [showAiInfo, setShowAiInfo] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [colorFilter, setColorFilter] = useState<string[]>([]);
  const [styleFilter, setStyleFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [visibleProducts, setVisibleProducts] = useState(12);
  const [loading, setLoading] = useState(false);

  const galleryRef = useRef<HTMLDivElement>(null);

  const filters = [
    { id: 'all', label: 'All Carpets' },
    { id: 'modern', label: 'Modern' },
    { id: 'classic', label: 'Classic' },
    { id: 'traditional', label: 'Traditional' },
    { id: 'minimal', label: 'Minimal' },
    { id: 'kids', label: 'Kids' }
  ];

  const colorOptions = [
    { name: 'Grey', value: 'Grey', color: '#9CA3AF' },
    { name: 'Dark Grey', value: 'Dark Grey', color: '#6B7280' },
    { name: 'Cream', value: 'Cream', color: '#FEF3C7' },
    { name: 'Green', value: 'Green', color: '#10B981' },
    { name: 'Red', value: 'Red', color: '#EF4444' }
  ];

  const sizeOptions = [
    { label: '120×180 cm', value: '120x180' },
    { label: '160×230 cm', value: '160x230' },
    { label: '200×300 cm', value: '200x300' },
    { label: '300×400 cm', value: '300x400' }
  ];

  // Use optimized carpet data from manifest
  const products = carpets.map(carpet => {
    // Extract SKU from name (e.g., "Abadan Haly Gunes Cream 2004 Carpet" -> "2004")
    const skuMatch = carpet.name.match(/\b(\d{4})\b/);
    const sku = skuMatch ? skuMatch[1] : carpet.id;
    
    // Determine style from name
    const name = carpet.name.toLowerCase();
    let style = 'Traditional'; // Default
    if (name.includes('modern')) style = 'Modern';
    if (name.includes('classic')) style = 'Classic';
    
    // Determine if featured (you can customize this logic)
    const isFeatured = carpet.name.includes('Nusay') || carpet.name.includes('Premium');
    
    return {
      id: carpet.id,
      name: carpet.name,
      sku: sku,
      src: carpet.srcset.jpg[carpet.srcset.jpg.length - 1]?.src || '', // Use highest quality fallback for compatibility
      category: style.toLowerCase(),
      colors: [carpet.color.toLowerCase().replace(/\s+/g, '')],
      dominantColor: carpet.color.toLowerCase().replace(/\s+/g, ''),
      type: style,
      description: `Premium ${style.toLowerCase()} carpet in ${carpet.color.toLowerCase()}`,
      material: 'Premium Polypropylene',
      isFeatured: isFeatured,
      glbUrl: carpet.glbUrl,
      usdzUrl: carpet.usdzUrl,
      posterUrl: carpet.posterUrl,
      optimizedData: carpet // Store full optimized data for OptimizedCarpetPicture
    };
  });

  // Use all products from manifest
  const allProducts = products;

  const aiTranslations = {
    tm: {
      subtitle: 'Siziň üçin iň oňat halyny tapyň we kompaniýa barada soraň',
      placeholder: 'Arzuw edýän halylaryňyz barada aýdyň...',
      searchButton: 'Halyny tap',
      searching: 'AI gözleýär...',
      aboutToggle: 'Abadan Haly barada'
    },
    ru: {
      subtitle: 'Найдите идеальный ковер и узнайте о компании',
      placeholder: 'Расскажите о ковре вашей мечты...',
      searchButton: 'Найти ковер',
      searching: 'AI ищет...',
      aboutToggle: 'О компании Abadan Haly'
    },
    en: {
      subtitle: 'Find the perfect carpet and learn about our company',
      placeholder: 'Tell us about your dream carpet, an heirloom of elegance designed exclusively...',
      searchButton: 'Find my carpet',
      searching: 'AI is searching...',
      aboutToggle: 'About Abadan Haly'
    }
  };

  const currentAiLang = aiTranslations[language as keyof typeof aiTranslations] || aiTranslations.en;

  // Filter products
  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStyle = styleFilter === 'all' || product.category === styleFilter;
    const matchesColor = colorFilter.length === 0 || colorFilter.some(color => 
      product.colors.includes(color) || product.dominantColor.includes(color.toLowerCase().replace(/\s+/g, ''))
    );
    
    return matchesSearch && matchesStyle && matchesColor;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return b.id - a.id;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'sku-asc':
        return a.sku.localeCompare(b.sku);
      case 'sku-desc':
        return b.sku.localeCompare(a.sku);
      default: // popular
        return b.isFeatured ? 1 : -1;
    }
  });

  const displayedProducts = sortedProducts.slice(0, visibleProducts);

  const handleAiSearch = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsAiSearching(true);
    
    setTimeout(() => {
      const keywords = aiPrompt.toLowerCase();
      
      // Company information responses
      let response = '';
      let carpetResults: any[] = [];
      
      // Check for company-related questions
      if (keywords.includes('people') || keywords.includes('employee') || keywords.includes('worker') || 
          keywords.includes('staff') || keywords.includes('человек') || keywords.includes('işçi') || 
          keywords.includes('çalışan') || keywords.includes('işgär')) {
        response = language === 'tm' ? 
          '🏭 Abadan Haly-da 600+ hünärmen işleýär. 24/7 önümçilik bilen Türkmenistanyň iň uly haly öndürijisi.' :
          language === 'ru' ?
          '🏭 В Abadan Haly работает более 600 специалистов. Работаем 24/7 — крупнейший производитель ковров в Туркменистане.' :
          '🏭 Abadan Haly employs 600+ specialists. We operate 24/7 production — Turkmenistan\'s largest carpet manufacturer.';
      }
      else if (keywords.includes('production') || keywords.includes('capacity') || keywords.includes('million') ||
               keywords.includes('производство') || keywords.includes('önümçilik')) {
        response = language === 'tm' ?
          '📊 2020-nji ýylda 3 million m² haly öndürdik - Türkmenistanda milli rekord. 8 sany Vandewiele dokma maşyny bilen.' :
          language === 'ru' ?
          '📊 В 2020 году произвели 3 миллиона м² ковров — национальный рекорд Туркменистана. 8 ткацких станков Vandewiele.' :
          '📊 In 2020, we produced 3 million m² of carpets — a national record in Turkmenistan. 8 Belgian Vandewiele looms.';
      }
      else if (keywords.includes('founded') || keywords.includes('history') || keywords.includes('when') ||
               keywords.includes('основан') || keywords.includes('esaslandyrylan')) {
        response = language === 'tm' ?
          '🏛️ Abadan Haly 2016-njy ýylyň 15-nji fewralynda esaslandyryldy. 3 maşyndan başlap, häzir 8 sany Vandewiele dokma maşyny.' :
          language === 'ru' ?
          '🏛️ Abadan Haly основана 15 февраля 2016 года. Начали с 3 станков, сейчас 8 ткацких станков Vandewiele.' :
          '🏛️ Abadan Haly was founded on 15 February 2016. Started with 3 machines, now 8 Belgian Vandewiele looms.';
      }
      else if (keywords.includes('certificate') || keywords.includes('iso') || keywords.includes('quality') ||
               keywords.includes('сертификат') || keywords.includes('şahadatnama')) {
        response = language === 'tm' ?
          '🏆 3 sany ISO şahadatnamalarymyz bar: ISO 9001 (Hil), ISO 14001 (Daşky gurşaw), ISO 45001 (Howpsuzlyk). "Iň köp eksport edilen önümler ýyly" baýragy.' :
          language === 'ru' ?
          '🏆 У нас 3 сертификата ISO: ISO 9001 (Качество), ISO 14001 (Экология), ISO 45001 (Безопасность). Награда "Год самых экспортируемых товаров".' :
          '🏆 We have 3 ISO certifications: ISO 9001 (Quality), ISO 14001 (Environment), ISO 45001 (Safety). "Year of Most Exported Products" award.';
      }
      else if (keywords.includes('yarn') || keywords.includes('material') || keywords.includes('neumag') ||
               keywords.includes('пряжа') || keywords.includes('ýüp')) {
        response = language === 'tm' ?
          '🧵 Öz polipropilen ýübümizi Nemaň nemis senagat liniýalarynda öndürýäris. Bu reňk durnuklygy we yzygiderlilik üpjün edýär.' :
          language === 'ru' ?
          '🧵 Производим собственную полипропиленовую пряжу на немецких промышленных линиях Neumag. Это обеспечивает стойкость цвета и консистенцию.' :
          '🧵 We spin our own polypropylene yarn on German Neumag industrial lines. This ensures color-fastness and consistency.';
      }
      else {
        // Carpet recommendations
        const results = products.filter(product => 
          product.name.toLowerCase().includes(keywords) ||
          product.description.toLowerCase().includes(keywords) ||
          product.category.toLowerCase().includes(keywords) ||
          product.colors.some(color => keywords.includes(color)) ||
          (keywords.includes('modern') && product.category === 'modern') ||
          (keywords.includes('traditional') && product.category === 'traditional') ||
          (keywords.includes('classic') && product.category === 'classic') ||
          (keywords.includes('minimal') && product.category === 'minimal') ||
          (keywords.includes('kids') && product.category === 'kids') ||
          (keywords.includes('living') && ['modern', 'classic'].includes(product.category)) ||
          (keywords.includes('bedroom') && ['minimal', 'classic'].includes(product.category))
        );
        
        carpetResults = results;
        
        if (results.length > 0) {
          const matchReason = keywords.includes('living') ? 'perfect for living room spaces' :
                             keywords.includes('bedroom') ? 'ideal for bedroom comfort' :
                             keywords.includes('modern') ? 'contemporary design aesthetic' :
                             keywords.includes('traditional') ? 'classic heritage patterns' :
                             'matches your preferences';
          
          response = language === 'tm' ?
            `✨ ${results.length} sany haly tapdym - ${matchReason}. Premium hilli we dürli ölçeglerde.` :
            language === 'ru' ?
            `✨ Нашел ${results.length} ковров - ${matchReason}. Премиальное качество в различных размерах.` :
            `✨ Found ${results.length} carpets - ${matchReason}. Premium quality in various sizes.`;
        } else {
          response = language === 'tm' ?
            '🤔 Bu gözleg boýunça haly tapylmady. Başga açar sözler bilen synanyşyň.' :
            language === 'ru' ?
            '🤔 По этому запросу ковры не найдены. Попробуйте другие ключевые слова.' :
            '🤔 No carpets found for this search. Try different keywords.';
        }
      }
      
      setAiResponse(response);
      setAiResults(carpetResults);
      setIsAiSearching(false);
    }, 1500);
  };

  const handleColorFilter = (color: string) => {
    setColorFilter(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color)
        : [...prev, color.toLowerCase().replace(/\s+/g, '')]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setColorFilter([]);
    setStyleFilter('all');
    setSortBy('popular');
  };

  const loadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setVisibleProducts(prev => prev + 8);
      setLoading(false);
    }, 500);
  };

  const openLightbox = (index: number) => {
    setSelectedImage(index);
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImage === null) return;
    
    const newIndex = direction === 'next' 
      ? (selectedImage + 1) % displayedProducts.length
      : (selectedImage - 1 + displayedProducts.length) % displayedProducts.length;
    
    setSelectedImage(newIndex);
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const open3DViewer = (product: any) => {
    setSelectedProduct({
      ...product,
      sizeCm: { width: 200, height: 300 }
    });
    setShow3DViewer(true);
  };

  return (
    <>
      <section className="min-h-screen bg-white py-8 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Compact Hero / Title Bar */}
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-[#1A1A1A] mb-4">
              Gallery
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Filter by size, color, style, and material. Preview in 3D/AR.
            </p>
          </div>

          {/* Abadan AI — Prompt Bar */}
          <div className="mb-16 relative overflow-hidden">
            {/* Dynamic Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0F3B2F] via-emerald-800 to-emerald-900 rounded-3xl">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-green-500/10 to-emerald-500/10 animate-pulse"></div>
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                <div className="absolute top-8 left-8 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-float"></div>
                <div className="absolute bottom-8 right-8 w-40 h-40 bg-emerald-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-green-300/5 rounded-full blur-3xl animate-pulse"></div>
              </div>
            </div>
            
            {/* Content */}
            <div className="relative z-10 p-8 lg:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                  {currentAiLang.subtitle}
                </h2>
              </div>
              
              {/* AI Interface */}
              <div className="max-w-4xl mx-auto">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
                  
                  {/* Main Input */}
                  <div className="flex gap-4 mb-6">
                    <div className="flex-1 relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                        <MessageCircle className="text-white/60 w-5 h-5" />
                        <div className="w-px h-6 bg-white/20"></div>
                      </div>
                      <input
                        type="text"
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder={currentAiLang.placeholder}
                        className="w-full pl-16 pr-6 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-white/50 outline-none transition-all duration-300 text-lg"
                        onKeyPress={(e) => e.key === 'Enter' && handleAiSearch()}
                      />
                    </div>
                    <button
                      onClick={handleAiSearch}
                      disabled={isAiSearching || !aiPrompt.trim()}
                      className="bg-white/20 hover:bg-white/30 disabled:bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:transform-none flex items-center gap-3 border border-white/30"
                    >
                      {isAiSearching ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          {currentAiLang.searching}
                        </>
                      ) : (
                        <>
                          {currentAiLang.searchButton}
                        </>
                      )}
                    </button>
                  </div>
                  
                  {/* About Company Toggle */}
                  <div className="text-center">
                    <button
                      onClick={() => setShowAiInfo(!showAiInfo)}
                      className="text-white/80 hover:text-white text-sm font-medium transition-colors flex items-center gap-2 mx-auto"
                    >
                      <Factory className="w-4 h-4" />
                      {currentAiLang.aboutToggle}
                      <ArrowDown className={`w-4 h-4 transition-transform ${showAiInfo ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {/* Company Info Panel */}
                  {showAiInfo && (
                    <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 animate-fade-in">
                      <div className="grid md:grid-cols-2 gap-6 text-white/90">
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Factory className="w-4 h-4" />
                            Production Scale
                          </h4>
                          <ul className="space-y-1 text-sm">
                            <li>• Founded: 15 February 2016</li>
                            <li>• Team: 600+ employees</li>
                            <li>• Operations: 24/7 non-stop</li>
                            <li>• Record: 3M m² in 2020</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Award className="w-4 h-4" />
                            Quality & Exports
                          </h4>
                          <ul className="space-y-1 text-sm">
                            <li>• 8 Belgian Vandewiele looms</li>
                            <li>• In-house Neumag yarn</li>
                            <li>• ISO 9001/14001/45001</li>
                            <li>• Exports: KZ, AF, TR</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* AI Response */}
                  {aiResponse && (
                    <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 animate-fade-in">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <p className="text-white/90 leading-relaxed">{aiResponse}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* AI Carpet Results */}
                  {aiResults.length > 0 && (
                    <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 animate-fade-in">
                      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                        Recommendations:
                      </h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        {aiResults.slice(0, 3).map((product, index) => (
                          <div 
                            key={index} 
                            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 cursor-pointer hover:bg-white/20 transition-all duration-300 border border-white/20 group" 
                            onClick={() => open3DViewer(product)}
                          >
                            <div className="aspect-[0.71] overflow-hidden rounded-lg mb-3">
                              <img 
                                src={product.src} 
                                alt={`abadan-haly — ${product.sku}, ${product.dominantColor}, ${product.type}, carpet`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                              />
                            </div>
                            <h4 className="font-semibold text-white text-sm mb-1">{product.name}</h4>
                            <p className="text-white/70 text-xs mb-2">{product.sku}</p>
                            <div className="flex items-center justify-between">
                              <button className="text-white/80 hover:text-white text-xs font-medium flex items-center gap-1">
                                <Cube className="w-3 h-3" />
                                3D View
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Filter + Sort Bar (sticky) */}
          <div className="sticky top-24 z-30 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl p-4 mb-8 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by name or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F3B2F] focus:border-[#0F3B2F] outline-none transition-all duration-180"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                
                {/* Style Filter */}
                <select
                  value={styleFilter}
                  onChange={(e) => setStyleFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F3B2F] outline-none text-sm"
                >
                  <option value="all">All Styles</option>
                  <option value="modern">Modern</option>
                  <option value="classic">Classic</option>
                  <option value="traditional">Traditional</option>
                  <option value="minimal">Minimal</option>
                  <option value="kids">Kids</option>
                </select>

                {/* Color Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Colors:</span>
                  <div className="flex gap-1">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => handleColorFilter(color.value)}
                        className={`w-6 h-6 rounded-full border-2 transition-all duration-180 ${
                          colorFilter.includes(color.value) 
                            ? 'border-[#0F3B2F] scale-110' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        style={{ backgroundColor: color.color }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F3B2F] outline-none text-sm"
                >
                  <option value="popular">Popular</option>
                  <option value="newest">Newest</option>
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                  <option value="sku-asc">SKU 0-9</option>
                  <option value="sku-desc">SKU 9-0</option>
                </select>

                {/* Clear Filters */}
                {(searchTerm || colorFilter.length > 0 || styleFilter !== 'all') && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-[#0F3B2F] transition-colors"
                  >
                    Clear filters
                  </button>
                )}
              </div>

              {/* Results Count */}
              <div className="text-sm text-gray-600">
                {filteredProducts.length} carpets
              </div>
            </div>
          </div>

          {/* Gallery Grid */}
          <div ref={galleryRef} className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {manifestLoading && (
              <div className="col-span-full text-center py-12">
                <div className="w-8 h-8 border-2 border-[#0F3B2F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading optimized carpet images...</p>
              </div>
            )}
            
            {manifestError && (
              <div className="col-span-full text-center py-12">
                <p className="text-red-600 mb-4">Error loading carpet data: {manifestError}</p>
                <p className="text-gray-600 text-sm">Using fallback images...</p>
              </div>
            )}
            
            {displayedProducts.map((product, index) => (
              <div
                key={product.id}
                className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Image Container */}
                <div 
                  className="relative aspect-[0.71] overflow-hidden cursor-pointer"
                  onClick={() => openLightbox(index)}
                >
                  {product.optimizedData ? (
                    <OptimizedCarpetPicture
                      item={product.optimizedData}
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="group-hover:scale-105 transition-transform duration-700"
                      loading={index < 8 ? 'eager' : 'lazy'}
                    />
                  ) : (
                    <img
                      src={product.src}
                      alt={`abadan-haly — ${product.sku}, ${product.dominantColor}, ${product.type}, carpet`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading={index < 8 ? 'eager' : 'lazy'}
                      onError={(e) => {
                        // Fallback to a working image if the BMP fails to load
                        e.currentTarget.src = "https://images.pexels.com/photos/6969831/pexels-photo-6969831.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop";
                      }}
                    />
                  )}
                  
                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          open3DViewer(product);
                        }}
                        className="bg-white/90 backdrop-blur-sm text-[#0F3B2F] p-2 rounded-lg shadow-lg hover:bg-white transition-colors"
                        title="View in 3D"
                      >
                        <Cube className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openLightbox(index);
                        }}
                        className="bg-white/90 backdrop-blur-sm text-[#0F3B2F] p-2 rounded-lg shadow-lg hover:bg-white transition-colors"
                        title="Quick View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Discount Badge */}
                  {product.isFeatured && (
                    <div className="absolute top-3 right-3 bg-[#C6A866] text-white px-2 py-1 rounded-lg text-xs font-bold">
                      Featured
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-[#1A1A1A] mb-1 text-sm leading-tight">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                    <span>{product.sku}</span>
                    <span className="capitalize">{product.type}</span>
                  </div>
                  
                  {/* Color Indicators */}
                  <div className="flex items-center gap-1 mb-3">
                    {[product.dominantColor].map((color, colorIndex) => {
                      const colorOption = colorOptions.find(c => c.value.toLowerCase().replace(/\s+/g, '') === color);
                      return colorOption ? (
                        <div
                          key={colorIndex}
                          className="w-3 h-3 rounded-full border border-gray-200"
                          style={{ backgroundColor: colorOption.color }}
                          title={colorOption.name}
                        />
                      ) : null;
                    })}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => open3DViewer(product)}
                      className="flex-1 bg-[#0F3B2F] hover:bg-[#0F3B2F]/90 text-white py-2 px-3 rounded-lg text-xs font-medium transition-colors duration-180 flex items-center justify-center gap-1"
                    >
                      <Cube className="w-3 h-3" />
                      3D
                    </button>
                    <button className="flex-1 bg-[#F7F7F8] hover:bg-gray-200 text-[#1A1A1A] py-2 px-3 rounded-lg text-xs font-medium transition-colors duration-180">
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Skeleton Loaders */}
            {loading && Array.from({ length: 8 }).map((_, index) => (
              <div key={`skeleton-${index}`} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="aspect-[0.71] bg-gray-200"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  <div className="flex gap-1">
                    <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                    <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 h-8 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1 h-8 bg-gray-200 rounded-lg"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          {visibleProducts < sortedProducts.length && (
            <div className="text-center mb-16">
              <button
                onClick={loadMore}
                disabled={loading}
                className="bg-[#F7F7F8] hover:bg-gray-200 disabled:bg-gray-100 text-[#1A1A1A] px-8 py-3 rounded-xl font-medium transition-colors duration-180 flex items-center gap-2 mx-auto"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#1A1A1A] border-t-transparent rounded-full animate-spin"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    Load more
                    <ArrowDown className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-[#F7F7F8] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">
                No carpets match those filters
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={clearFilters}
                className="bg-[#0F3B2F] hover:bg-[#0F3B2F]/90 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-180"
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Lightbox */}
          {selectedImage !== null && (
            <div 
              className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
              onClick={closeLightbox}
            >
              
              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors z-20 bg-white/10 backdrop-blur-sm rounded-full p-3 hover:bg-white/20"
              >
                <X className="w-6 h-6" />
              </button>
              
              {/* Navigation */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage('prev');
                }}
                className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-20 bg-white/10 backdrop-blur-sm rounded-full p-3 hover:bg-white/20"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage('next');
                }}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-20 bg-white/10 backdrop-blur-sm rounded-full p-3 hover:bg-white/20"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              
              {/* Image */}
              <div className="max-w-4xl max-h-[80vh] mx-4" onClick={(e) => e.stopPropagation()}>
                {displayedProducts[selectedImage].optimizedData ? (
                  <OptimizedCarpetPicture
                    item={displayedProducts[selectedImage].optimizedData}
                    sizes="80vw"
                    className="max-w-full max-h-full object-contain rounded-xl"
                    loading="eager"
                  />
                ) : (
                  <img
                    src={displayedProducts[selectedImage].src}
                    alt={`abadan-haly — ${displayedProducts[selectedImage].sku}, ${displayedProducts[selectedImage].dominantColor}, ${displayedProducts[selectedImage].type}, carpet`}
                    className="max-w-full max-h-full object-contain rounded-xl"
                  />
                )}
              </div>
              
              {/* Image Info */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-4">
                <h3 className="text-xl font-semibold mb-2">
                  {displayedProducts[selectedImage].name}
                </h3>
                <div className="flex items-center justify-center gap-4 mb-4">
                  <span className="bg-white/20 px-3 py-1 rounded-lg text-sm">
                    {displayedProducts[selectedImage].sku}
                  </span>
                  <span className="bg-[#0F3B2F]/80 px-3 py-1 rounded-lg text-sm">
                    {displayedProducts[selectedImage].type}
                  </span>
                </div>
                <p className="text-gray-300 mb-4">
                  {displayedProducts[selectedImage].description}
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      open3DViewer(displayedProducts[selectedImage]);
                      closeLightbox();
                    }}
                    className="bg-[#0F3B2F] hover:bg-[#0F3B2F]/90 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <Cube className="w-4 h-4" />
                    View in 3D
                  </button>
                  {(displayedProducts[selectedImage].glbUrl || displayedProducts[selectedImage].usdzUrl) && (
                    <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      View in AR
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3D Viewer Modal */}
      {show3DViewer && selectedProduct && (
        <Suspense fallback={
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p>Loading 3D viewer...</p>
            </div>
          </div>
        }>
          <Product3DViewer
            productImage={selectedProduct.optimizedData?.srcset.jpg[selectedProduct.optimizedData.srcset.jpg.length - 1]?.src || selectedProduct.src}
            productName={selectedProduct.name}
            carpetSize={{ width: 200, height: 300 }}
            isOpen={show3DViewer}
            onClose={() => {
              setShow3DViewer(false);
              setSelectedProduct(null);
            }}
            autoRotate={false}
            showControls={true}
          />
        </Suspense>
      )}
    </>
  );
}