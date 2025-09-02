import { useState, lazy, Suspense, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Cuboid as Cube, Search, Eye, ArrowDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCarpetManifest } from '../hooks/useCarpetManifest';
import { OptimizedCarpetPicture } from './OptimizedCarpetPicture';

// Lazy load components
const Product3DViewer = lazy(() => import('./Product3DViewer'));
const AbadanAI = lazy(() => import('./AbadanAI'));

export default function Gallery() {
  const { i18n } = useTranslation();
  const language = i18n.language;
  const { carpets, loading: manifestLoading, error: manifestError } = useCarpetManifest();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [show3DViewer, setShow3DViewer] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResults, setAiResults] = useState<any[]>([]);
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [colorFilter, setColorFilter] = useState<string[]>([]);
  const [styleFilter, setStyleFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [visibleProducts, setVisibleProducts] = useState(12);
  const [loading, setLoading] = useState(false);

  const galleryRef = useRef<HTMLDivElement>(null);

  // Debug logging
  useEffect(() => {
    console.log('Gallery component - carpets data:', carpets);
    console.log('Gallery component - manifestLoading:', manifestLoading);
    console.log('Gallery component - manifestError:', manifestError);
    console.log('Gallery component - carpets length:', carpets?.length);
    
    // Test data accessibility
    if (carpets && carpets.length > 0) {
      console.log('First carpet sample:', carpets[0]);
      console.log('First carpet image path:', carpets[0].srcset?.jpg?.[0]?.src);
    }
  }, [carpets, manifestLoading, manifestError]);

  // Test data loading manually
  useEffect(() => {
    const testDataLoading = async () => {
      try {
        console.log('Testing data loading manually...');
        const response = await fetch('/data/carpets.json');
        console.log('Manual test response:', response.status, response.ok);
        if (response.ok) {
          const data = await response.json();
          console.log('Manual test data length:', data.length);
        }
      } catch (err) {
        console.error('Manual test failed:', err);
      }
    };
    
    testDataLoading();
  }, []);

  // AI Results Listener
  useEffect(() => {
    function handler(e: any) {
      const data = e.detail;
      console.log('Abadan AI results received:', data);
      // You can use data.ids to pre-filter items or highlight results
    }
    
    window.addEventListener("abadan-ai", handler as any);
    return () => window.removeEventListener("abadan-ai", handler as any);
  }, []);



  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage === null) return;
      
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          navigateImage('prev');
          break;
        case 'ArrowRight':
          navigateImage('next');
          break;
      }
    };

    if (selectedImage !== null) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedImage]);

  // Check for AI results on mount
  useEffect(() => {
    const aiResults = sessionStorage.getItem("abadan_ai_results");
    if (aiResults) {
      try {
        const data = JSON.parse(aiResults);
        console.log('Abadan AI results from sessionStorage:', data);
        // You can use data.ids to pre-filter items or highlight results
      } catch (error) {
        console.error('Error parsing AI results:', error);
      }
    }
  }, []);

  const colorOptions = [
    { name: 'Grey', value: 'Grey', color: '#9CA3AF' },
    { name: 'Dark Grey', value: 'Dark Grey', color: '#6B7280' },
    { name: 'Cream', value: 'Cream', color: '#FEF3C7' },
    { name: 'Green', value: 'Green', color: '#10B981' },
    { name: 'Red', value: 'Red', color: '#EF4444' }
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
      src: carpet.srcset?.jpg?.[carpet.srcset.jpg.length - 1]?.src || '',
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
        return String(b.id).localeCompare(String(a.id));
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

  // AI Lightbox Listener
  useEffect(() => {
    function handler(e: any) {
      const { productId, productName } = e.detail;
      console.log('Opening AI lightbox for:', productName);
      
      // Find the product in displayedProducts and open lightbox
      const productIndex = displayedProducts.findIndex(p => p.id === productId);
      if (productIndex !== -1) {
        openLightbox(productIndex);
      } else {
        // If not found in current displayed products, search in all products
        const allProductIndex = products.findIndex(p => p.id === productId);
        if (allProductIndex !== -1) {
          // Update filters to show this product
          setSearchTerm(productName);
          setStyleFilter('all');
          setColorFilter([]);
          // Wait for filter update then open lightbox
          setTimeout(() => {
            const newIndex = displayedProducts.findIndex(p => p.id === productId);
            if (newIndex !== -1) {
              openLightbox(newIndex);
            }
          }, 100);
        }
      }
    }
    
    window.addEventListener("open-gallery-lightbox", handler as any);
    return () => window.removeEventListener("open-gallery-lightbox", handler as any);
  }, [displayedProducts, products]);

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
    document.body.style.overflow = 'hidden';
    
    // Smooth scroll to top for better lightbox experience
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          <section className="min-h-screen bg-white py-12 pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Compact Hero / Title Bar */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-[#0F3B2F] via-[#10B981] to-[#059669] bg-clip-text text-transparent">
            Gallery
          </h1>
        </div>

          {/* Abadan AI Component */}
          <Suspense fallback={
            <div className="mb-12 text-center">
              <div className="w-8 h-8 border-2 border-[#0F3B2F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading Abadan AI...</p>
            </div>
          }>
            <AbadanAI />
          </Suspense>

          {/* Filter + Sort Bar (sticky) */}
          <div className="sticky top-24 z-30 bg-white/90 backdrop-blur-xl border-2 border-gradient-to-r from-black/20 via-gray-800/30 to-black/20 rounded-3xl p-6 mb-8 shadow-2xl">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by name or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0F3B2F] focus:border-[#0F3B2F] outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm text-gray-900 placeholder-gray-500"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                
                {/* Style Filter */}
                <select
                  value={styleFilter}
                  onChange={(e) => setStyleFilter(e.target.value)}
                  className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0F3B2F] focus:border-[#0F3B2F] outline-none text-sm bg-white/80 backdrop-blur-sm text-gray-900 font-medium"
                >
                  <option value="all" className="bg-white text-gray-900">All Styles</option>
                  <option value="modern" className="bg-white text-gray-900">Modern</option>
                  <option value="classic" className="bg-white text-gray-900">Classic</option>
                  <option value="traditional" className="bg-white text-gray-900">Traditional</option>
                  <option value="minimal" className="bg-white text-gray-900">Minimal</option>
                  <option value="kids" className="bg-white text-gray-900">Kids</option>
                </select>

                {/* Color Filter */}
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-800 font-semibold">Colors:</span>
                  <div className="flex gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => handleColorFilter(color.value)}
                        className={`w-7 h-7 rounded-full border-2 transition-all duration-300 hover:scale-110 ${
                          colorFilter.includes(color.value) 
                            ? 'border-gray-800 scale-110 shadow-lg' 
                            : 'border-gray-400 hover:border-gray-600'
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
                  className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0F3B2F] focus:border-[#0F3B2F] outline-none text-sm bg-white/80 backdrop-blur-sm text-gray-900 font-medium"
                >
                  <option value="popular" className="bg-white text-gray-900">Popular</option>
                  <option value="newest" className="bg-white text-gray-900">Newest</option>
                  <option value="name-asc" className="bg-white text-gray-900">Name A-Z</option>
                  <option value="name-desc" className="bg-white text-gray-900">Name Z-A</option>
                  <option value="sku-asc" className="bg-white text-gray-900">SKU 0-9</option>
                  <option value="sku-desc" className="bg-white text-gray-900">SKU 9-0</option>
                </select>

                {/* Clear Filters */}
                {(searchTerm || colorFilter.length > 0 || styleFilter !== 'all') && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors bg-white/60 backdrop-blur-sm rounded-lg hover:bg-white/80 border border-gray-300"
                  >
                    Clear filters
                  </button>
                )}
              </div>

              {/* Results Count */}
              <div className="text-sm text-gray-800 font-semibold bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-300">
                {filteredProducts.length} carpets
              </div>
            </div>
          </div>

          {/* Gallery Grid */}
          <div ref={galleryRef} className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12 scroll-smooth">
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
                  {product.optimizedData?.srcset?.jpg?.[0]?.src ? (
                    <img
                      src={product.optimizedData.srcset.jpg[0].src}
                      alt={`abadan-haly — ${product.sku}, ${product.dominantColor}, ${product.type}, carpet`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading={index < 8 ? 'eager' : 'lazy'}
                      onError={(e) => {
                        console.log('Image failed to load:', e.currentTarget.src);
                        e.currentTarget.src = '/Images/Halylar/Cream/abadan-haly-Gunes- Cream- 2004- carpet.jpg';
                      }}
                    />
                  ) : (
                    <img
                      src={product.src}
                      alt={`abadan-haly — ${product.sku}, ${product.dominantColor}, ${product.type}, carpet`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading={index < 8 ? 'eager' : 'lazy'}
                      onError={(e) => {
                        console.log('Image failed to load:', e.currentTarget.src);
                        e.currentTarget.src = '/Images/Halylar/Cream/abadan-haly-Cream- 2004- carpet.jpg';
                      }}
                    />
                  )}
                  
                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          open3DViewer(product);
                        }}
                        className="bg-white/95 backdrop-blur-sm text-[#0F3B2F] px-4 py-2 rounded-lg shadow-lg hover:bg-white transition-all duration-200 flex items-center gap-2 hover:scale-105"
                        title="View in 3D"
                      >
                        <Cube className="w-4 h-4" />
                        <span className="text-sm font-medium">3D</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openLightbox(index);
                        }}
                        className="bg-white/95 backdrop-blur-sm text-[#0F3B2F] px-4 py-2 rounded-lg shadow-lg hover:bg-white transition-all duration-200 flex items-center gap-2 hover:scale-105"
                        title="Fullscreen View"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="text-sm font-medium">View</span>
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
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-500"
              onClick={closeLightbox}
            >
              
              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute top-6 right-6 text-white hover:text-gray-300 transition-all duration-300 z-20 bg-white/20 backdrop-blur-xl rounded-full p-3 hover:bg-white/30 hover:scale-110 border border-white/30"
                title="Close (Esc)"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Image Counter */}
              <div className="absolute top-6 left-6 text-white bg-white/20 backdrop-blur-xl rounded-full px-4 py-2 text-sm font-medium border border-white/30">
                {selectedImage + 1} / {displayedProducts.length}
              </div>
              
              {/* Navigation */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage('prev');
                }}
                className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-all duration-300 z-20 bg-white/20 backdrop-blur-xl rounded-full p-3 hover:bg-white/30 hover:scale-110 border border-white/30"
                title="Previous image (←)"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage('next');
                }}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-all duration-300 z-20 bg-white/20 backdrop-blur-xl rounded-full p-3 hover:bg-white/30 hover:scale-110 border border-white/30"
                title="Next image (→)"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              
              {/* Image Container - Fullscreen Centered */}
              <div className="absolute inset-0 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                {displayedProducts[selectedImage].optimizedData?.srcset?.jpg?.[0]?.src ? (
                  <img
                    src={displayedProducts[selectedImage].optimizedData.srcset.jpg[0].src}
                    alt={`abadan-haly — ${displayedProducts[selectedImage].sku}, ${displayedProducts[selectedImage].dominantColor}, ${displayedProducts[selectedImage].type}, carpet`}
                    className="max-w-[95vw] max-h-[calc(100vh-180px)] object-contain transition-all duration-500 ease-out shadow-2xl rounded-lg"
                    onError={(e) => {
                      console.log('Image failed to load:', e.currentTarget.src);
                      e.currentTarget.src = '/Images/Halylar/Cream/abadan-haly-Gunes- Cream- 2004- carpet.jpg';
                    }}
                  />
                ) : (
                  <img
                    src={displayedProducts[selectedImage].src}
                    alt={`abadan-haly — ${displayedProducts[selectedImage].sku}, ${displayedProducts[selectedImage].dominantColor}, ${displayedProducts[selectedImage].type}, carpet`}
                    className="max-w-[95vw] max-h-[calc(100vh-180px)] object-contain transition-all duration-500 ease-out shadow-2xl rounded-lg"
                    onError={(e) => {
                      console.log('Image failed to load:', e.currentTarget.src);
                      e.currentTarget.src = '/Images/Halylar/Cream/abadan-haly-Gunes- Cream- 2004- carpet.jpg';
                    }}
                  />
                )}
              </div>
              
              {/* Image Info */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white text-center bg-white/20 backdrop-blur-xl rounded-3xl p-6 max-w-md mx-4 border border-white/30 shadow-2xl">
                <h3 className="text-xl font-semibold mb-3">
                  {displayedProducts[selectedImage].name}
                </h3>
                <div className="flex items-center justify-center gap-4 mb-4">
                  <span className="bg-white/30 px-3 py-1 rounded-lg text-sm backdrop-blur-sm">
                    {displayedProducts[selectedImage].sku}
                  </span>
                  <span className="bg-[#0F3B2F]/80 px-3 py-1 rounded-lg text-sm backdrop-blur-sm">
                    {displayedProducts[selectedImage].type}
                  </span>
                </div>
                <p className="text-gray-200 mb-4 text-sm">
                  {displayedProducts[selectedImage].description}
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      open3DViewer(displayedProducts[selectedImage]);
                      closeLightbox();
                    }}
                    className="bg-[#0F3B2F]/90 hover:bg-[#0F3B2F] text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 backdrop-blur-sm hover:scale-105"
                  >
                    <Cube className="w-4 h-4" />
                    View in 3D
                  </button>
                  {(displayedProducts[selectedImage].glbUrl || displayedProducts[selectedImage].usdzUrl) && (
                    <button className="bg-white/30 hover:bg-white/40 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 backdrop-blur-sm hover:scale-105">
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