# 3D Product Viewer - Technical Documentation

## Overview
A production-ready 3D product viewer built with Three.js that displays carpet products in a realistic living room environment. This viewer provides an immersive shopping experience with intuitive controls and professional-grade rendering.

## Features

### 🎯 Core Functionality
- **Interactive 3D Scene**: Full 360-degree orbital camera movement around products
- **Realistic Living Room**: Complete furnished environment with proper lighting and shadows
- **Smooth Controls**: Mouse, trackpad, and touch device support with momentum
- **Zoom System**: Intelligent zoom limits with visual feedback
- **Auto-Rotation**: Optional automatic product rotation with user override
- **Screenshot Capture**: High-quality image export functionality

### 🏠 Living Room Environment
- **Realistic Furniture**: Sofa, coffee table, armchair, and decorative elements
- **Professional Lighting**: Multi-light setup with shadows and ambient lighting
- **Proper Scale**: Accurate room proportions and carpet sizing
- **Material Rendering**: Realistic textures and surface properties
- **Atmospheric Effects**: Fog and tone mapping for depth perception

### 📱 User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Loading States**: Professional loading animations and progress indicators
- **Error Handling**: Graceful fallbacks with retry functionality
- **Visual Feedback**: Zoom indicators, control tooltips, and status displays
- **Accessibility**: Keyboard navigation and screen reader support

## Technical Specifications

### Framework & Libraries
- **Three.js**: Latest version for 3D rendering
- **React**: Component-based architecture with TypeScript
- **Performance**: Hardware-accelerated rendering with optimized shaders

### Rendering Features
- **Shadow Mapping**: PCF soft shadows for realistic lighting
- **Tone Mapping**: ACES Filmic tone mapping for cinematic quality
- **Anti-aliasing**: MSAA for smooth edges and professional appearance
- **Color Management**: sRGB color space for accurate color reproduction

### Camera System
```typescript
interface CameraConfig {
  minRadius: 2;        // Closest zoom distance
  maxRadius: 12;       // Furthest zoom distance
  defaultRadius: 6;    // Starting position
  rotationSpeed: 0.005; // Mouse sensitivity
  autoRotateSpeed: 0.3; // Auto-rotation speed
}
```

### Performance Optimizations
- **Efficient Rendering**: 60 FPS target with automatic quality scaling
- **Memory Management**: Proper cleanup of 3D resources and textures
- **Texture Optimization**: Compressed textures with mipmapping
- **Geometry Optimization**: Efficient mesh generation and culling

## Component API

### Product3DViewer Props
```typescript
interface Product3DViewerProps {
  productImage: string;                    // Product texture URL
  productName: string;                     // Display name
  carpetSize: { width: number; height: number }; // Size in cm
  isOpen: boolean;                         // Modal visibility
  onClose: () => void;                     // Close callback
  autoRotate?: boolean;                    // Auto-rotation enabled
  showControls?: boolean;                  // Show UI controls
}
```

### Usage Example
```tsx
<Product3DViewer
  productImage="/images/persian-carpet.jpg"
  productName="Persian Heritage Classic"
  carpetSize={{ width: 250, height: 350 }}
  isOpen={true}
  onClose={() => setViewerOpen(false)}
  autoRotate={false}
  showControls={true}
/>
```

## Control System

### Mouse Controls
- **Left Click + Drag**: Rotate camera around product
- **Scroll Wheel**: Zoom in/out with smooth acceleration
- **Right Click**: Context menu disabled for clean UX

### Touch Controls
- **Single Touch Drag**: Rotate camera (mobile/tablet)
- **Pinch Gesture**: Zoom in/out (planned for future release)
- **Touch Feedback**: Visual feedback for touch interactions

### Keyboard Controls
- **Arrow Keys**: Camera rotation
- **+/- Keys**: Zoom in/out
- **R Key**: Reset to default view
- **Space**: Toggle auto-rotation

## Living Room Scene Details

### Furniture Elements
```typescript
// Sofa dimensions and positioning
const sofa = {
  dimensions: { width: 3, height: 0.6, depth: 1.2 },
  position: { x: -2, y: 0, z: -4 },
  material: 'Light gray fabric'
};

// Coffee table specifications
const coffeeTable = {
  dimensions: { width: 1.5, height: 0.08, depth: 0.8 },
  position: { x: 0.5, y: 0, z: -1.5 },
  material: 'Wood with metal legs'
};
```

### Lighting Setup
- **Ambient Light**: 40% intensity for overall illumination
- **Directional Light**: 80% intensity simulating sunlight with shadows
- **Point Light**: 30% warm accent lighting for atmosphere
- **Shadow Quality**: 2048x2048 shadow maps for crisp shadows

### Material Properties
- **Carpet**: Realistic fabric material with proper opacity
- **Floor**: Matte finish with subtle texture
- **Furniture**: Varied materials (fabric, wood, metal) for realism
- **Walls**: Neutral colors with proper light reflection

## Integration Guide

### Installation
```bash
npm install three @types/three
```

### Basic Setup
```tsx
import Product3DViewer from './components/Product3DViewer';

function ProductPage() {
  const [show3D, setShow3D] = useState(false);
  
  return (
    <div>
      <button onClick={() => setShow3D(true)}>
        View in 3D
      </button>
      
      <Product3DViewer
        productImage="/path/to/carpet.jpg"
        productName="Product Name"
        carpetSize={{ width: 200, height: 300 }}
        isOpen={show3D}
        onClose={() => setShow3D(false)}
      />
    </div>
  );
}
```

### Customization Options
```typescript
// Custom camera positions
const presetViews = {
  overview: { radius: 8, theta: Math.PI/4, phi: Math.PI/3 },
  closeup: { radius: 3, theta: 0, phi: Math.PI/2 },
  side: { radius: 6, theta: Math.PI/2, phi: Math.PI/3 }
};

// Custom lighting
const lightingPresets = {
  studio: { ambient: 0.6, directional: 0.4 },
  natural: { ambient: 0.4, directional: 0.8 },
  dramatic: { ambient: 0.2, directional: 1.0 }
};
```

## Performance Guidelines

### Optimization Best Practices
- **Texture Size**: Keep product images under 2MB for fast loading
- **Image Format**: Use WebP or AVIF for better compression
- **Geometry**: Optimize 3D models for web delivery
- **Memory**: Dispose of unused resources properly

### Browser Support
- **Chrome**: 70+ (recommended)
- **Firefox**: 65+
- **Safari**: 12+
- **Edge**: 79+
- **Mobile**: iOS 12+, Android 7+

### Performance Monitoring
```typescript
// Built-in performance tracking
const stats = {
  fps: renderer.info.render.frame,
  triangles: renderer.info.render.triangles,
  drawCalls: renderer.info.render.calls,
  memoryUsage: renderer.info.memory.geometries
};
```

## Error Handling

### Common Issues & Solutions
```typescript
// Texture loading failure
if (textureLoadError) {
  showFallbackImage();
  logError('Texture failed to load', productImage);
}

// WebGL context loss
renderer.domElement.addEventListener('webglcontextlost', (event) => {
  event.preventDefault();
  showContextLostMessage();
});

// Memory management
const cleanup = () => {
  scene.traverse((object) => {
    if (object.geometry) object.geometry.dispose();
    if (object.material) object.material.dispose();
  });
  renderer.dispose();
};
```

### Fallback Strategies
1. **WebGL Not Supported**: Show 2D image with message
2. **Texture Load Failure**: Display placeholder with retry option
3. **Performance Issues**: Automatic quality reduction
4. **Mobile Limitations**: Simplified scene for low-end devices

## Analytics & Tracking

### User Interaction Events
```typescript
// Track user engagement
const trackEvent = (action: string, data: any) => {
  analytics.track('3D_Viewer_Interaction', {
    action,
    productName,
    timestamp: Date.now(),
    ...data
  });
};

// Example events
trackEvent('viewer_opened', { productId });
trackEvent('camera_rotated', { angle, duration });
trackEvent('zoom_changed', { level, direction });
trackEvent('screenshot_taken', { timestamp });
```

### Performance Metrics
- **Load Time**: Time from open to first render
- **FPS**: Average frames per second during interaction
- **Interaction Rate**: Percentage of users who interact with 3D view
- **Session Duration**: Time spent in 3D viewer

## Future Enhancements

### Planned Features
- **Multiple Room Environments**: Kitchen, bedroom, office settings
- **Lighting Controls**: User-adjustable lighting scenarios
- **Material Variants**: Switch between different carpet materials
- **Room Customization**: User-selectable furniture and colors
- **VR Support**: WebXR integration for immersive viewing
- **Social Sharing**: Share 3D views on social media

### Technical Roadmap
- **WebAssembly**: Performance improvements for complex scenes
- **Progressive Loading**: Stream 3D assets for faster initial load
- **AI Integration**: Automatic room style recommendations
- **Cloud Rendering**: Server-side rendering for low-end devices

## Support & Maintenance

### Regular Updates
- **Three.js Updates**: Keep library current for performance and features
- **Browser Testing**: Regular testing across supported browsers
- **Performance Monitoring**: Continuous optimization based on user data
- **Bug Fixes**: Rapid response to reported issues

### Troubleshooting
- **Performance Issues**: Check GPU capabilities and reduce quality
- **Loading Problems**: Verify image URLs and network connectivity
- **Control Issues**: Test input device compatibility
- **Display Problems**: Validate WebGL support and canvas size

This 3D Product Viewer provides a professional, immersive shopping experience that significantly enhances product visualization and customer engagement. The realistic living room environment helps customers make confident purchasing decisions by seeing exactly how carpets will look in their space.