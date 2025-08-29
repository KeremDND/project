import React, { useState, useRef, useEffect, Suspense } from 'react';
import { X, RotateCcw, Eye, Smartphone, Camera, RotateCw } from 'lucide-react';
import { useARLinks } from '../hooks/useARLinks';
import { LivingRoomScene } from './LivingRoomScene';

// Import model-viewer types
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

export interface CarpetViewerProps {
  name: string;
  imageUrl?: string;
  glbUrl?: string;
  usdzUrl?: string;
  posterUrl?: string;
  sizeCm: { width: number; height: number };
  mode?: "studio" | "living";
  autoRotate?: boolean;
  isFullscreen?: boolean;
  onClose?: () => void;
  textures?: {
    floorWood?: string;
    wallTexture?: string;
    sofaFabric?: string;
    chairFabric?: string;
    blinds?: string;
    sky?: string;
    tableWood?: string;
  };
}

type ViewPreset = 'default' | 'detail';
type LightingMode = 'studio' | 'living';

export default function CarpetARViewer({
  name,
  imageUrl,
  glbUrl,
  usdzUrl,
  posterUrl,
  sizeCm,
  mode = "studio",
  autoRotate = false,
  isFullscreen = false,
  onClose,
  textures
}: CarpetViewerProps) {
  const [currentPreset, setCurrentPreset] = useState<ViewPreset>('default');
  const [isAutoRotating, setIsAutoRotating] = useState(autoRotate);
  const [lightingMode, setLightingMode] = useState<LightingMode>(mode === 'living' ? 'living' : 'studio');
  const [currentMode, setCurrentMode] = useState(mode);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showQR, setShowQR] = useState(false);
  
  const modelViewerRef = useRef<any>(null);
  const { getSceneViewerLink, getQuickLookLink, generateQRCode } = useARLinks();

  // Respect reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsAutoRotating(false);
    }
  }, [prefersReducedMotion]);

  const handlePresetChange = (preset: ViewPreset) => {
    setCurrentPreset(preset);
    if (modelViewerRef.current) {
      const mv = modelViewerRef.current;
      if (preset === 'default') {
        mv.cameraOrbit = '45deg 75deg 2.5m';
        mv.fieldOfView = '45deg';
      } else if (preset === 'detail') {
        mv.cameraOrbit = '25deg 60deg 1.2m';
        mv.fieldOfView = '30deg';
      }
    }
  };

  const handleReset = () => {
    setCurrentPreset('default');
    setIsAutoRotating(autoRotate && !prefersReducedMotion);
    if (modelViewerRef.current) {
      const mv = modelViewerRef.current;
      mv.cameraOrbit = '45deg 75deg 2.5m';
      mv.fieldOfView = '45deg';
    }
  };

  const handleARLaunch = () => {
    if (!glbUrl && !usdzUrl) return;
    
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    if (isIOS && usdzUrl) {
      window.open(getQuickLookLink(usdzUrl, name), '_blank');
    } else if (isAndroid && glbUrl) {
      window.open(getSceneViewerLink(glbUrl, name), '_blank');
    } else if (modelViewerRef.current) {
      // Try WebXR if available
      modelViewerRef.current.activateAR();
    }
  };

  const handleScreenshot = () => {
    if (modelViewerRef.current && typeof modelViewerRef.current.toDataURL === 'function') {
      const canvas = modelViewerRef.current.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${name.replace(/\s+/g, '-').toLowerCase()}-view.png`;
      link.href = canvas;
      link.click();
    } else {
      console.warn('Screenshot feature not available - model-viewer not ready or toDataURL method not supported');
    }
  };

  const toggleMode = () => {
    const newMode = currentMode === 'studio' ? 'living' : 'studio';
    setCurrentMode(newMode);
    setLightingMode(newMode === 'living' ? 'living' : 'studio');
  };

  // Calculate scale for Three.js (1 unit = 1 meter)
  const scaleX = sizeCm.width / 100;
  const scaleZ = sizeCm.height / 100;

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'w-full'}`}>
      {/* Header */}
      <div className="flex justify-between items-start p-6 pb-4">
        <div>
          <h1 className="font-hand text-3xl md:text-4xl text-emerald-900 mb-2">
            Abadan Haly, Owadan Haly
          </h1>
          <h2 className="text-xl font-semibold text-gray-900">{name}</h2>
          <p className="text-gray-600">{sizeCm.width} × {sizeCm.height} cm</p>
        </div>
        
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            aria-label="Close viewer"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Main Viewer */}
      <div className="relative mx-6 mb-6">
        <div 
          className="relative bg-white rounded-2xl shadow-lg overflow-hidden"
          style={{ height: isFullscreen ? 'calc(100vh - 200px)' : '560px' }}
        >
          {/* Controls Toolbar */}
          <div className="absolute top-4 right-4 z-10 flex flex-wrap gap-2">
            {/* View Presets */}
            <div className="flex bg-white/90 backdrop-blur-sm rounded-lg p-1 shadow-sm">
              <button
                onClick={() => handlePresetChange('default')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  currentPreset === 'default' 
                    ? 'bg-emerald-800 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Default
              </button>
              <button
                onClick={() => handlePresetChange('detail')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  currentPreset === 'detail' 
                    ? 'bg-emerald-800 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Detail
              </button>
            </div>

            {/* Mode Toggle */}
            <button
              onClick={toggleMode}
              className={`px-3 py-2 backdrop-blur-sm rounded-lg shadow-sm transition-colors text-sm font-medium ${
                currentMode === 'living' 
                  ? 'bg-emerald-800 text-white' 
                  : 'bg-white/90 text-gray-700 hover:bg-white'
              }`}
              aria-label={`Switch to ${currentMode === 'studio' ? 'living room' : 'studio'} mode`}
            >
              {currentMode === 'studio' ? '3D Room' : 'Studio'}
            </button>

            {/* Auto Rotate */}
            {!prefersReducedMotion && (
              <button
                onClick={() => setIsAutoRotating(!isAutoRotating)}
                className={`p-2 backdrop-blur-sm rounded-lg shadow-sm transition-colors ${
                  isAutoRotating 
                    ? 'bg-emerald-800 text-white' 
                    : 'bg-white/90 text-gray-700 hover:bg-white'
                }`}
                aria-label="Toggle auto rotation"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            )}

            {/* AR Button */}
            {(glbUrl || usdzUrl) && (
              <button
                onClick={handleARLaunch}
                className="px-4 py-2 bg-emerald-800 text-white rounded-lg shadow-sm hover:bg-emerald-700 transition-colors flex items-center gap-2"
                aria-label="View in AR"
              >
                <Smartphone className="w-4 h-4" />
                <span className="hidden sm:inline">AR</span>
              </button>
            )}

            {/* Screenshot */}
            <button
              onClick={handleScreenshot}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white transition-colors"
              aria-label="Take screenshot"
            >
              <Camera className="w-4 h-4" />
            </button>

            {/* Reset */}
            <button
              onClick={handleReset}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white transition-colors"
              aria-label="Reset view"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Model Viewer */}
          {glbUrl ? (
            <model-viewer
              ref={modelViewerRef}
              src={glbUrl}
              ios-src={usdzUrl}
              alt={name}
              poster={posterUrl || imageUrl}
              camera-controls
              auto-rotate={isAutoRotating}
              ar
              ar-modes="webxr scene-viewer quick-look"
              ar-scale="fixed"
              exposure="1.0"
              environment-image={lightingMode === 'studio' ? 'neutral' : 'legacy'}
              camera-orbit="45deg 75deg 2.5m"
              field-of-view="45deg"
              min-camera-orbit="auto auto 1m"
              max-camera-orbit="auto auto 5m"
              max-field-of-view="60deg"
              min-field-of-view="20deg"
              style={{
                width: '100%',
                height: '100%',
                background: currentMode === 'studio' ? '#ffffff' : 'linear-gradient(to bottom, #f8fafc, #e2e8f0)',
                borderRadius: '16px'
              }}
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setHasError(true);
                setIsLoading(false);
              }}
            />
          ) : (
            // Fallback: Three.js scene with image texture
            <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-2xl">
              <Suspense fallback={<div className="text-gray-500">Loading 3D scene...</div>}>
                <LivingRoomScene
                  carpetImage={imageUrl}
                  carpetSize={{ width: scaleX, height: scaleZ }}
                  mode={currentMode}
                  autoRotate={isAutoRotating && !prefersReducedMotion}
                  textures={textures}
                />
              </Suspense>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-emerald-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading 3D model...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-white rounded-2xl">
              <div className="text-center p-8">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">3D Model Unavailable</h3>
                <p className="text-gray-600 mb-4">Showing 2D preview instead</p>
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt={name}
                    className="max-w-full max-h-64 object-contain mx-auto rounded-lg shadow-sm"
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* QR Code Modal */}
        {showQR && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20 rounded-2xl">
            <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Scan for Mobile AR</h3>
                <button
                  onClick={() => setShowQR(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="text-center">
                <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-gray-500">QR Code</span>
                </div>
                <p className="text-sm text-gray-600">
                  Scan with your phone to view in AR
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Info Panel */}
      <div className="mx-6 mb-6 bg-gray-50 rounded-xl p-6">
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Specifications</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>Size: {sizeCm.width} × {sizeCm.height} cm</li>
              <li>Material: Premium Polypropylene</li>
              <li>Density: 400+ knots/m²</li>
              <li>Origin: Made in Turkmenistan</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Care Instructions</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>Regular vacuuming recommended</li>
              <li>Professional cleaning yearly</li>
              <li>Rotate periodically for even wear</li>
              <li>Keep away from direct sunlight</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">AR Features</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>True-to-scale visualization</li>
              <li>Room placement preview</li>
              <li>Multiple viewing angles</li>
              <li>Works on iOS & Android</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}