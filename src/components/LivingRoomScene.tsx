import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { createLivingRoomScene, LivingRoomTextures } from '../lib/three/livingRoom';

interface LivingRoomSceneProps {
  carpetImage?: string;
  carpetSize: { width: number; height: number };
  mode: 'studio' | 'living';
  autoRotate?: boolean;
  textures?: LivingRoomTextures;
}

export function LivingRoomScene({
  carpetImage,
  carpetSize,
  mode,
  autoRotate = false,
  textures = {}
}: LivingRoomSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: any;
    animationId?: number;
  }>();

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(mode === 'studio' ? 0xffffff : 0xf8fafc);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(3, 2, 4);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    scene.add(directionalLight);

    // Add room scene
    if (mode === 'living') {
      const roomScene = createLivingRoomScene(carpetImage, carpetSize, textures);
      scene.add(roomScene);
    } else {
      // Studio mode - just the carpet
      if (carpetImage) {
        const loader = new THREE.TextureLoader();
        loader.setCrossOrigin('anonymous');
        loader.load(carpetImage, (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          
          const carpetGeometry = new THREE.PlaneGeometry(carpetSize.width, carpetSize.height);
          const carpetMaterial = new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 0.85,
            metalness: 0.0
          });
          
          const carpet = new THREE.Mesh(carpetGeometry, carpetMaterial);
          carpet.rotation.x = -Math.PI / 2;
          carpet.position.y = 0;
          carpet.receiveShadow = true;
          carpet.castShadow = true;
          
          scene.add(carpet);
        });
      }

      // Studio floor
      const floorGeometry = new THREE.PlaneGeometry(10, 10);
      const floorMaterial = new THREE.ShadowMaterial({ opacity: 0.1 });
      const floor = new THREE.Mesh(floorGeometry, floorMaterial);
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = -0.01;
      floor.receiveShadow = true;
      scene.add(floor);
    }

    // Controls (simplified orbit controls)
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let spherical = new THREE.Spherical(5, Math.PI / 3, Math.PI / 4);

    const handleMouseDown = (event: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging) return;

      const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y
      };

      spherical.theta -= deltaMove.x * 0.01;
      spherical.phi += deltaMove.y * 0.01;
      spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));

      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleWheel = (event: WheelEvent) => {
      spherical.radius += event.deltaY * 0.01;
      spherical.radius = Math.max(1, Math.min(10, spherical.radius));
    };

    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    renderer.domElement.addEventListener('wheel', handleWheel);

    // Animation loop
    let autoRotateAngle = 0;
    const animate = () => {
      if (autoRotate) {
        autoRotateAngle += 0.005;
        spherical.theta = autoRotateAngle;
      }

      // Update camera position
      const position = new THREE.Vector3();
      position.setFromSpherical(spherical);
      camera.position.copy(position);
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      sceneRef.current!.animationId = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      const newWidth = mountRef.current.clientWidth;
      const newHeight = mountRef.current.clientHeight;
      
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    sceneRef.current = {
      scene,
      camera,
      renderer,
      controls: {
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleWheel
      }
    };

    return () => {
      if (sceneRef.current?.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId);
      }
      
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      renderer.domElement.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      renderer.dispose();
    };
  }, [carpetImage, carpetSize, mode, autoRotate, textures]);

  return <div ref={mountRef} className="w-full h-full" />;
}