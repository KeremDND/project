import React, { useRef, useEffect, useState, useCallback } from 'react';
import { X, RotateCcw, ZoomIn, ZoomOut, Move, Eye, Camera, Settings, Home, Maximize } from 'lucide-react';
import * as THREE from 'three';

interface Product3DViewerProps {
  productImage: string;
  productName: string;
  carpetSize: { width: number; height: number }; // in cm
  isOpen: boolean;
  onClose: () => void;
  autoRotate?: boolean;
  showControls?: boolean;
}

interface CameraState {
  radius: number;
  theta: number;
  phi: number;
  target: THREE.Vector3;
}

export default function Product3DViewer({
  productImage,
  productName,
  carpetSize,
  isOpen,
  onClose,
  autoRotate = false,
  showControls = true
}: Product3DViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    carpet?: THREE.Mesh;
    animationId?: number;
    controls: {
      isDragging: boolean;
      previousMouse: { x: number; y: number };
      cameraState: CameraState;
    };
  }>();

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(50);
  const [isAutoRotating, setIsAutoRotating] = useState(autoRotate);
  const [showSettings, setShowSettings] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Camera configuration
  const CAMERA_CONFIG = {
    minRadius: 2,
    maxRadius: 12,
    defaultRadius: 6,
    defaultTheta: Math.PI / 4,
    defaultPhi: Math.PI / 3,
    rotationSpeed: 0.005,
    zoomSpeed: 0.1,
    autoRotateSpeed: 0.3
  };

  // Initialize 3D scene
  const initializeScene = useCallback(() => {
    if (!mountRef.current || !isOpen) return;
    
    setLoadingProgress(10);

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafc);
    scene.fog = new THREE.Fog(0xf8fafc, 10, 50);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    
    setLoadingProgress(30);

    mountRef.current.appendChild(renderer.domElement);

    // Create living room environment
    setLoadingProgress(50);
    createLivingRoomEnvironment(scene);

    // Initialize camera controls
    const cameraState: CameraState = {
      radius: CAMERA_CONFIG.defaultRadius,
      theta: CAMERA_CONFIG.defaultTheta,
      phi: CAMERA_CONFIG.defaultPhi,
      target: new THREE.Vector3(0, 0, 0)
    };

    const controls = {
      isDragging: false,
      previousMouse: { x: 0, y: 0 },
      cameraState
    };

    // Update camera position
    updateCameraPosition(camera, cameraState);

    // Store scene reference
    sceneRef.current = {
      scene,
      camera,
      renderer,
      controls,
      carpet: undefined,
      animationId: undefined
    };

    // Load carpet texture
    setLoadingProgress(70);
    loadCarpetTexture(scene, productImage, carpetSize);

    // Start animation loop
    setLoadingProgress(90);
    startAnimationLoop();

    // Setup event listeners
    setupEventListeners(renderer.domElement);

    setLoadingProgress(100);
    setTimeout(() => setIsLoading(false), 200);
  }, [isOpen, productImage, carpetSize]);

  // Create realistic living room environment
  const createLivingRoomEnvironment = (scene: THREE.Scene) => {
    // Clean studio lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    // Studio directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = false;
    scene.add(directionalLight);

    // Create clean studio floor only
    createStudioFloor(scene);
  };

  // Create clean studio floor
  const createStudioFloor = (scene: THREE.Scene) => {
    const floorMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

    // Clean white studio floor
    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.01;
    floor.receiveShadow = false;
    scene.add(floor);
  };

  // Load carpet texture and create carpet mesh
  const loadCarpetTexture = (scene: THREE.Scene, imageUrl: string, size: { width: number; height: number }) => {
    const loader = new THREE.TextureLoader();
    
    // Add CORS handling for production
    loader.setCrossOrigin('anonymous');
    
    loader.load(
      imageUrl,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.generateMipmaps = false;
        texture.minFilter = THREE.LinearFilter;
        
        // Convert cm to meters
        const carpetWidth = size.width / 100;
        const carpetHeight = size.height / 100;
        
        const carpetGeometry = new THREE.PlaneGeometry(carpetWidth, carpetHeight);
        const carpetMaterial = new THREE.MeshBasicMaterial({
          map: texture,
        });
        
        const carpet = new THREE.Mesh(carpetGeometry, carpetMaterial);
        carpet.rotation.x = -Math.PI / 2;
        carpet.position.set(0, 0.003, 0);
        
        scene.add(carpet);
        
        if (sceneRef.current) {
          sceneRef.current.carpet = carpet;
        }
      },
      (progress) => {
        // Loading progress
        if (progress.total > 0) {
          const percentComplete = Math.round((progress.loaded / progress.total) * 100);
          setLoadingProgress(70 + (percentComplete * 0.2));
        }
      },
      (error) => {
        console.error('Error loading carpet texture:', error);
        setHasError(true);
        setIsLoading(false);
      }
    );
  };

  // Update camera position based on spherical coordinates
  const updateCameraPosition = (camera: THREE.PerspectiveCamera, state: CameraState) => {
    const { radius, theta, phi, target } = state;
    
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    
    camera.position.set(x, y, z);
    camera.lookAt(target);
    
    // Update zoom level indicator
    const zoomPercent = Math.round(((CAMERA_CONFIG.maxRadius - radius) / (CAMERA_CONFIG.maxRadius - CAMERA_CONFIG.minRadius)) * 100);
    setZoomLevel(zoomPercent);
  };

  // Animation loop
  const startAnimationLoop = () => {
    const animate = () => {
      if (!sceneRef.current) return;
      
      const { scene, camera, renderer, controls } = sceneRef.current;
      
      // Auto rotation
      if (isAutoRotating && !controls.isDragging) {
        controls.cameraState.theta += CAMERA_CONFIG.autoRotateSpeed * 0.01;
      }
      
      updateCameraPosition(camera, controls.cameraState);
      renderer.render(scene, camera);
      
      sceneRef.current.animationId = requestAnimationFrame(animate);
    };
    
    animate();
  };

  // Event listeners for controls
  const setupEventListeners = (canvas: HTMLCanvasElement) => {
    // Mouse events
    const handleMouseDown = (event: MouseEvent) => {
      if (!sceneRef.current) return;
      
      sceneRef.current.controls.isDragging = true;
      sceneRef.current.controls.previousMouse = { x: event.clientX, y: event.clientY };
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!sceneRef.current || !sceneRef.current.controls.isDragging) return;
      
      const { controls } = sceneRef.current;
      const deltaX = event.clientX - controls.previousMouse.x;
      const deltaY = event.clientY - controls.previousMouse.y;
      
      controls.cameraState.theta += deltaX * CAMERA_CONFIG.rotationSpeed;
      controls.cameraState.phi -= deltaY * CAMERA_CONFIG.rotationSpeed;
      
      // Clamp phi to prevent flipping
      controls.cameraState.phi = Math.max(0.1, Math.min(Math.PI - 0.1, controls.cameraState.phi));
      
      controls.previousMouse = { x: event.clientX, y: event.clientY };
    };

    const handleMouseUp = () => {
      if (!sceneRef.current) return;
      sceneRef.current.controls.isDragging = false;
    };

    const handleWheel = (event: WheelEvent) => {
      if (!sceneRef.current) return;
      
      event.preventDefault();
      const { controls } = sceneRef.current;
      
      controls.cameraState.radius += event.deltaY * CAMERA_CONFIG.zoomSpeed * 0.01;
      controls.cameraState.radius = Math.max(
        CAMERA_CONFIG.minRadius,
        Math.min(CAMERA_CONFIG.maxRadius, controls.cameraState.radius)
      );
    };

    // Touch events for mobile
    const handleTouchStart = (event: TouchEvent) => {
      if (!sceneRef.current || event.touches.length !== 1) return;
      
      const touch = event.touches[0];
      sceneRef.current.controls.isDragging = true;
      sceneRef.current.controls.previousMouse = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!sceneRef.current || !sceneRef.current.controls.isDragging || event.touches.length !== 1) return;
      
      event.preventDefault();
      const touch = event.touches[0];
      const { controls } = sceneRef.current;
      const deltaX = touch.clientX - controls.previousMouse.x;
      const deltaY = touch.clientY - controls.previousMouse.y;
      
      controls.cameraState.theta += deltaX * CAMERA_CONFIG.rotationSpeed;
      controls.cameraState.phi -= deltaY * CAMERA_CONFIG.rotationSpeed;
      
      controls.cameraState.phi = Math.max(0.1, Math.min(Math.PI - 0.1, controls.cameraState.phi));
      
      controls.previousMouse = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchEnd = () => {
      if (!sceneRef.current) return;
      sceneRef.current.controls.isDragging = false;
    };

    // Add event listeners
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);

    // Store cleanup function
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('wheel', handleWheel);
      
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  };

  // Control functions
  const resetView = () => {
    if (!sceneRef.current) return;
    
    const { controls } = sceneRef.current;
    controls.cameraState.radius = CAMERA_CONFIG.defaultRadius;
    controls.cameraState.theta = CAMERA_CONFIG.defaultTheta;
    controls.cameraState.phi = CAMERA_CONFIG.defaultPhi;
  };

  const zoomIn = () => {
    if (!sceneRef.current) return;
    
    const { controls } = sceneRef.current;
    controls.cameraState.radius = Math.max(
      CAMERA_CONFIG.minRadius,
      controls.cameraState.radius - 0.5
    );
  };

  const zoomOut = () => {
    if (!sceneRef.current) return;
    
    const { controls } = sceneRef.current;
    controls.cameraState.radius = Math.min(
      CAMERA_CONFIG.maxRadius,
      controls.cameraState.radius + 0.5
    );
  };

  const takeScreenshot = () => {
    if (!sceneRef.current) return;
    
    const { renderer } = sceneRef.current;
    const canvas = renderer.domElement;
    const link = document.createElement('a');
    link.download = `${productName.replace(/\s+/g, '-').toLowerCase()}-3d-view.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Handle window resize
  const handleResize = useCallback(() => {
    if (!sceneRef.current || !mountRef.current) return;
    
    const { camera, renderer } = sceneRef.current;
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }, []);

  // Initialize scene when component mounts or opens
  useEffect(() => {
    if (isOpen) {
      initializeScene();
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (sceneRef.current) {
        if (sceneRef.current.animationId) {
          cancelAnimationFrame(sceneRef.current.animationId);
        }
        
        if (mountRef.current && sceneRef.current.renderer.domElement) {
          mountRef.current.removeChild(sceneRef.current.renderer.domElement);
        }
        
        sceneRef.current.renderer.dispose();
        sceneRef.current = undefined;
      }
      
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen, initializeScene, handleResize]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
      <div className="w-full h-full max-w-7xl mx-4 my-4 bg-white rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{productName} - 3D Room View</h2>
            <p className="text-gray-600">{carpetSize.width} × {carpetSize.height} cm</p>
          </div>
          
          <div className="flex items-center gap-3">
            {showControls && (
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            )}
            
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
              title="Close"
              aria-label="Close 3D viewer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* 3D Viewer */}
        <div className="relative flex-1" style={{ height: 'calc(100vh - 200px)' }}>
          <div ref={mountRef} className="w-full h-full" />
          
          {/* Loading State */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/90">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-emerald-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg font-semibold">Loading 3D Room</p>
                <div className="w-64 bg-gray-200 rounded-full h-2 mt-4 mx-auto">
                  <div 
                    className="bg-emerald-800 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${loadingProgress}%` }}
                  ></div>
                </div>
                <p className="text-gray-500 text-sm mt-2">{loadingProgress}% Complete</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-white">
              <div className="text-center p-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load 3D View</h3>
                <p className="text-gray-600 mb-4">Unable to load the product image or 3D environment</p>
                <button
                  onClick={() => {
                    setHasError(false);
                    setIsLoading(true);
                    initializeScene();
                  }}
                  className="bg-emerald-800 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Controls */}
          {showControls && !isLoading && !hasError && (
            <>
              {/* Main Controls */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg flex gap-2">
                  <button
                    onClick={zoomIn}
                    className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={zoomOut}
                    className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    onClick={resetView}
                    className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                    title="Reset View"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={takeScreenshot}
                    className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                    title="Take Screenshot"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                {/* Auto Rotate Toggle */}
                <button
                  onClick={() => setIsAutoRotating(!isAutoRotating)}
                  className={`p-2 rounded-lg shadow-lg transition-colors ${
                    isAutoRotating 
                      ? 'bg-emerald-800 text-white' 
                      : 'bg-white/90 backdrop-blur-sm hover:bg-gray-100'
                  }`}
                  title="Toggle Auto Rotation"
                >
                  <Move className="w-4 h-4" />
                </button>
              </div>

              {/* Zoom Indicator */}
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                <div className="flex items-center gap-2 text-sm">
                  <Eye className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">Zoom: {zoomLevel}%</span>
                </div>
              </div>

              {/* Instructions */}
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-sm">
                <h4 className="font-semibold text-gray-900 mb-2">3D Room Controls</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>Drag:</strong> Rotate around carpet</li>
                  <li>• <strong>Scroll:</strong> Zoom in/out</li>
                  <li>• <strong>Touch:</strong> Rotate on mobile</li>
                  <li>• <strong>Room view:</strong> See carpet in living room</li>
                </ul>
              </div>
            </>
          )}

          {/* Settings Panel */}
          {showSettings && (
            <div className="absolute top-16 right-4 bg-white rounded-lg shadow-xl p-4 w-64">
              <h4 className="font-semibold text-gray-900 mb-3">3D Room Settings</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-700">Auto Rotate</label>
                  <button
                    onClick={() => setIsAutoRotating(!isAutoRotating)}
                    className={`w-10 h-6 rounded-full transition-colors ${
                      isAutoRotating ? 'bg-emerald-800' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      isAutoRotating ? 'translate-x-5' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                
                <div>
                  <label className="text-sm text-gray-700 block mb-1">Zoom Level</label>
                  <div className="text-lg font-semibold text-emerald-800">{zoomLevel}%</div>
                </div>
                
                <div>
                  <label className="text-sm text-gray-700 block mb-1">Product Size</label>
                  <div className="text-sm text-gray-600">{carpetSize.width} × {carpetSize.height} cm</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}