import * as THREE from 'three';

export interface LivingRoomTextures {
  floorWood?: string;
  wallTexture?: string;
  sofaFabric?: string;
  chairFabric?: string;
  blinds?: string;
  sky?: string;
  tableWood?: string;
}

export function createLivingRoomScene(
  carpetImage?: string,
  carpetSize = { width: 2, height: 3 },
  textures: LivingRoomTextures = {}
): THREE.Group {
  const scene = new THREE.Group();
  const loader = new THREE.TextureLoader();

  // PROFESSIONAL DESIGN PLAN: MODERN ORGANIC STYLE
  // Color Palette: Warm whites, sage green, natural wood, charcoal accents
  // Materials: Natural textures, mixed metals, organic shapes

  // Enhanced Materials - Modern Organic Palette
  const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0xf5f1eb, // Warm white oak
    roughness: 0.4,
    metalness: 0.0,
    map: null
  });

  // Feature wall - Sage green accent
  const accentWallMaterial = new THREE.MeshStandardMaterial({
    color: 0x9caf88, // Sophisticated sage green
    roughness: 0.7,
    metalness: 0.0
  });

  // Main walls - Warm white
  const wallMaterial = new THREE.MeshStandardMaterial({
    color: 0xfaf8f5, // Warm white
    roughness: 0.8,
    metalness: 0.0
  });

  // Textured accent wall material
  const texturedWallMaterial = new THREE.MeshStandardMaterial({
    color: 0xf0ede7, // Subtle textured warm white
    roughness: 0.9,
    metalness: 0.0
  });

  // Premium sofa material - Charcoal linen
  const sofaMaterial = new THREE.MeshStandardMaterial({
    color: 0x4a4a4a, // Sophisticated charcoal
    roughness: 0.8,
    metalness: 0.0
  });

  // Accent chair - Warm cream
  const chairMaterial = new THREE.MeshStandardMaterial({
    color: 0xf7f3ed, // Warm cream
    roughness: 0.7,
    metalness: 0.0
  });

  // Natural wood materials
  const lightWoodMaterial = new THREE.MeshStandardMaterial({
    color: 0xe8d5b7, // Light natural wood
    roughness: 0.3,
    metalness: 0.0
  });

  const darkWoodMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b6914, // Rich walnut
    roughness: 0.4,
    metalness: 0.0
  });

  // Brass accent material
  const brassMaterial = new THREE.MeshStandardMaterial({
    color: 0xb8860b,
    roughness: 0.2,
    metalness: 0.8
  });

  // Create sophisticated wood floor texture
  const createWoodTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;
    
    // Base warm white oak color
    ctx.fillStyle = '#f5f1eb';
    ctx.fillRect(0, 0, 1024, 1024);
    
    // Add subtle wood grain
    ctx.strokeStyle = '#ede9e3';
    ctx.lineWidth = 1;
    for (let i = 0; i < 1024; i += 128) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(1024, i + Math.sin(i * 0.01) * 10);
      ctx.stroke();
    }
    
    // Add plank divisions
    ctx.strokeStyle = '#e8e4de';
    ctx.lineWidth = 2;
    for (let i = 0; i < 1024; i += 256) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 1024);
      ctx.stroke();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(6, 6);
    return texture;
  };

  floorMaterial.map = createWoodTexture();

  // Create subtle textured wall pattern
  const createTexturedWall = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    ctx.fillStyle = '#f0ede7';
    ctx.fillRect(0, 0, 512, 512);
    
    // Add subtle texture pattern
    ctx.fillStyle = '#ebe8e1';
    for (let x = 0; x < 512; x += 32) {
      for (let y = 0; y < 512; y += 32) {
        if ((x + y) % 64 === 0) {
          ctx.fillRect(x, y, 16, 16);
        }
      }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3, 3);
    return texture;
  };

  texturedWallMaterial.map = createTexturedWall();

  // ROOM STRUCTURE
  // Premium wide-plank flooring
  const floorGeometry = new THREE.PlaneGeometry(12, 16);
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.01;
  floor.receiveShadow = true;
  scene.add(floor);

  // Room walls with sophisticated color scheme
  const wallHeight = 3.2; // Higher ceilings for elegance
  const wallGeometry = new THREE.PlaneGeometry(12, wallHeight);
  
  // Back wall - Sage green feature wall
  const backWall = new THREE.Mesh(wallGeometry, accentWallMaterial);
  backWall.position.set(0, wallHeight/2, -8);
  backWall.receiveShadow = true;
  scene.add(backWall);

  // Left wall - Textured warm white
  const leftWallGeometry = new THREE.PlaneGeometry(16, wallHeight);
  const leftWall = new THREE.Mesh(leftWallGeometry, texturedWallMaterial);
  leftWall.position.set(-6, wallHeight/2, 0);
  leftWall.rotation.y = Math.PI / 2;
  leftWall.receiveShadow = true;
  scene.add(leftWall);

  // Right wall - Clean warm white
  const rightWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
  rightWall.position.set(6, wallHeight/2, 0);
  rightWall.rotation.y = -Math.PI / 2;
  rightWall.receiveShadow = true;
  scene.add(rightWall);

  // Ceiling - Warm white
  const ceilingGeometry = new THREE.PlaneGeometry(12, 16);
  const ceilingMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.9,
    metalness: 0.0
  });
  const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = wallHeight;
  ceiling.receiveShadow = true;
  scene.add(ceiling);

  // FURNITURE LAYOUT - PROFESSIONAL ARRANGEMENT

  // 1. MAIN SEATING: Modern sectional sofa (charcoal linen)
  const sofaGroup = new THREE.Group();
  
  // Main sofa section - longer and lower profile
  const sofaBaseGeometry = new THREE.BoxGeometry(4.2, 0.5, 1.1);
  const sofaBase = new THREE.Mesh(sofaBaseGeometry, sofaMaterial);
  sofaBase.position.set(0, 0.25, 0);
  sofaBase.castShadow = true;
  sofaGroup.add(sofaBase);

  // Modern low back
  const sofaBackGeometry = new THREE.BoxGeometry(4.2, 0.7, 0.2);
  const sofaBack = new THREE.Mesh(sofaBackGeometry, sofaMaterial);
  sofaBack.position.set(0, 0.6, -0.45);
  sofaBack.castShadow = true;
  sofaGroup.add(sofaBack);

  // Sleek arms
  const sofaArmGeometry = new THREE.BoxGeometry(0.2, 0.6, 1.1);
  const sofaArmLeft = new THREE.Mesh(sofaArmGeometry, sofaMaterial);
  sofaArmLeft.position.set(-2.0, 0.55, 0);
  sofaArmLeft.castShadow = true;
  sofaGroup.add(sofaArmLeft);

  const sofaArmRight = new THREE.Mesh(sofaArmGeometry, sofaMaterial);
  sofaArmRight.position.set(2.0, 0.55, 0);
  sofaArmRight.castShadow = true;
  sofaGroup.add(sofaArmRight);

  // Accent pillows - sage green and cream
  const pillowGeometry = new THREE.BoxGeometry(0.35, 0.35, 0.15);
  
  // Sage pillow
  const sagePillowMaterial = new THREE.MeshStandardMaterial({
    color: 0x9caf88,
    roughness: 0.7,
    metalness: 0.0
  });
  const sagePillow = new THREE.Mesh(pillowGeometry, sagePillowMaterial);
  sagePillow.position.set(-0.8, 0.6, 0.15);
  sagePillow.castShadow = true;
  sofaGroup.add(sagePillow);

  // Cream pillow
  const creamPillowMaterial = new THREE.MeshStandardMaterial({
    color: 0xf7f3ed,
    roughness: 0.7,
    metalness: 0.0
  });
  const creamPillow = new THREE.Mesh(pillowGeometry, creamPillowMaterial);
  creamPillow.position.set(0.8, 0.6, 0.15);
  creamPillow.castShadow = true;
  sofaGroup.add(creamPillow);

  sofaGroup.position.set(-0.5, 0, -4.5);
  scene.add(sofaGroup);

  // 2. ACCENT SEATING: Modern swivel chair
  const chairGroup = new THREE.Group();
  
  // Rounded chair base
  const chairBaseGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.4, 16);
  const chairBase = new THREE.Mesh(chairBaseGeometry, chairMaterial);
  chairBase.position.set(0, 0.2, 0);
  chairBase.castShadow = true;
  chairGroup.add(chairBase);

  // Curved back
  const chairBackGeometry = new THREE.SphereGeometry(0.6, 16, 8, 0, Math.PI);
  const chairBack = new THREE.Mesh(chairBackGeometry, chairMaterial);
  chairBack.position.set(0, 0.7, -0.2);
  chairBack.rotation.x = Math.PI / 2;
  chairBack.castShadow = true;
  chairGroup.add(chairBack);

  // Brass swivel base
  const swiveBaseGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 16);
  const swiveBase = new THREE.Mesh(swiveBaseGeometry, brassMaterial);
  swiveBase.position.set(0, 0.05, 0);
  swiveBase.castShadow = true;
  chairGroup.add(swiveBase);

  chairGroup.position.set(3.2, 0, -2.5);
  chairGroup.rotation.y = -Math.PI / 8;
  scene.add(chairGroup);

  // 3. COFFEE TABLE: Live-edge wood with brass legs
  const tableGroup = new THREE.Group();
  
  // Organic live-edge top
  const tableTopGeometry = new THREE.BoxGeometry(1.6, 0.06, 0.9);
  const tableTop = new THREE.Mesh(tableTopGeometry, lightWoodMaterial);
  tableTop.position.set(0, 0.4, 0);
  tableTop.castShadow = true;
  tableGroup.add(tableTop);

  // Brass hairpin legs
  const legGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.4, 8);
  const legPositions = [
    [-0.7, 0.2, -0.35],
    [0.7, 0.2, -0.35],
    [-0.7, 0.2, 0.35],
    [0.7, 0.2, 0.35]
  ];

  legPositions.forEach(pos => {
    const leg = new THREE.Mesh(legGeometry, brassMaterial);
    leg.position.set(pos[0], pos[1], pos[2]);
    leg.castShadow = true;
    tableGroup.add(leg);
  });

  tableGroup.position.set(0.3, 0, -2.8);
  scene.add(tableGroup);

  // 4. SIDE TABLE: Walnut with brass accents
  const sideTableGroup = new THREE.Group();
  
  // Round walnut top
  const sideTableGeometry = new THREE.CylinderGeometry(0.35, 0.35, 0.05, 16);
  const sideTable = new THREE.Mesh(sideTableGeometry, darkWoodMaterial);
  sideTable.position.set(0, 0.5, 0);
  sideTable.castShadow = true;
  sideTableGroup.add(sideTable);

  // Brass pedestal base
  const pedestalGeometry = new THREE.CylinderGeometry(0.15, 0.25, 0.5, 16);
  const pedestal = new THREE.Mesh(pedestalGeometry, brassMaterial);
  pedestal.position.set(0, 0.25, 0);
  pedestal.castShadow = true;
  sideTableGroup.add(pedestal);

  sideTableGroup.position.set(-3.8, 0, -4);
  scene.add(sideTableGroup);

  // 5. LIGHTING DESIGN

  // Statement pendant light - Brass and glass
  const pendantGroup = new THREE.Group();
  
  const pendantShadeGeometry = new THREE.SphereGeometry(0.25, 16, 8);
  const pendantShadeMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.8,
    roughness: 0.1,
    metalness: 0.0
  });
  const pendantShade = new THREE.Mesh(pendantShadeGeometry, pendantShadeMaterial);
  pendantShade.position.set(0, 2.2, 0);
  pendantShade.castShadow = true;
  pendantGroup.add(pendantShade);

  // Brass fixture
  const fixtureGeometry = new THREE.CylinderGeometry(0.05, 0.08, 0.15, 8);
  const fixture = new THREE.Mesh(fixtureGeometry, brassMaterial);
  fixture.position.set(0, 2.4, 0);
  fixture.castShadow = true;
  pendantGroup.add(fixture);

  pendantGroup.position.set(0.3, 0, -2.8);
  scene.add(pendantGroup);

  // Table lamp on side table
  const lampGroup = new THREE.Group();
  
  const lampBaseGeometry = new THREE.CylinderGeometry(0.08, 0.12, 0.25, 8);
  const lampBaseMaterial = new THREE.MeshStandardMaterial({
    color: 0x2c2c2c, // Matte black ceramic
    roughness: 0.9,
    metalness: 0.0
  });
  const lampBase = new THREE.Mesh(lampBaseGeometry, lampBaseMaterial);
  lampBase.position.set(0, 0.7, 0);
  lampBase.castShadow = true;
  lampGroup.add(lampBase);

  // Linen shade
  const lampShadeGeometry = new THREE.CylinderGeometry(0.15, 0.18, 0.2, 8);
  const lampShadeMaterial = new THREE.MeshStandardMaterial({
    color: 0xf7f3ed,
    roughness: 0.8,
    metalness: 0.0
  });
  const lampShade = new THREE.Mesh(lampShadeGeometry, lampShadeMaterial);
  lampShade.position.set(0, 0.95, 0);
  lampShade.castShadow = true;
  lampGroup.add(lampShade);

  lampGroup.position.set(-3.8, 0.5, -4);
  scene.add(lampGroup);

  // 6. DECORATIVE ELEMENTS

  // Gallery wall - Modern art collection
  const artGroup = new THREE.Group();
  
  const frameGeometry = new THREE.BoxGeometry(0.5, 0.6, 0.03);
  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a, // Black frames
    roughness: 0.7,
    metalness: 0.0
  });

  // Three pieces in asymmetrical arrangement
  const artPositions = [
    [-0.6, 0.4, 0],
    [0.1, 0.2, 0],
    [0.8, 0.5, 0]
  ];

  artPositions.forEach((pos, index) => {
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.position.set(pos[0], pos[1], pos[2]);
    frame.castShadow = true;
    artGroup.add(frame);
  });

  artGroup.position.set(-1, 2, -7.9);
  scene.add(artGroup);

  // Statement plant - Fiddle leaf fig
  const plantGroup = new THREE.Group();
  
  // Modern planter
  const planterGeometry = new THREE.CylinderGeometry(0.25, 0.3, 0.4, 8);
  const planterMaterial = new THREE.MeshStandardMaterial({
    color: 0xf7f3ed, // Cream ceramic
    roughness: 0.2,
    metalness: 0.0
  });
  const planter = new THREE.Mesh(planterGeometry, planterMaterial);
  planter.position.set(0, 0.2, 0);
  planter.castShadow = true;
  plantGroup.add(planter);

  // Large fiddle leaf
  const leavesGeometry = new THREE.SphereGeometry(0.6, 8, 6);
  const leavesMaterial = new THREE.MeshStandardMaterial({
    color: 0x4a5d23, // Deep green
    roughness: 0.8,
    metalness: 0.0
  });
  const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
  leaves.position.set(0, 1.2, 0);
  leaves.scale.set(0.8, 1.5, 0.8);
  leaves.castShadow = true;
  plantGroup.add(leaves);

  plantGroup.position.set(4.5, 0, -6);
  scene.add(plantGroup);

  // Floor lamp - Arc design
  const floorLampGroup = new THREE.Group();
  
  // Marble base
  const lampFloorBaseGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16);
  const marbleMaterial = new THREE.MeshStandardMaterial({
    color: 0xf5f5f5,
    roughness: 0.1,
    metalness: 0.0
  });
  const lampFloorBase = new THREE.Mesh(lampFloorBaseGeometry, marbleMaterial);
  lampFloorBase.position.set(0, 0.05, 0);
  lampFloorBase.castShadow = true;
  floorLampGroup.add(lampFloorBase);

  // Brass arc
  const arcGeometry = new THREE.TorusGeometry(1.2, 0.02, 8, 16, Math.PI);
  const arc = new THREE.Mesh(arcGeometry, brassMaterial);
  arc.position.set(0, 1.5, 0);
  arc.rotation.z = Math.PI / 2;
  arc.castShadow = true;
  floorLampGroup.add(arc);

  floorLampGroup.position.set(4, 0, -1);
  scene.add(floorLampGroup);

  // Large window with natural light
  const windowGroup = new THREE.Group();
  
  // Window frame - Black steel
  const windowFrameGeometry = new THREE.BoxGeometry(3.5, 2.5, 0.1);
  const windowFrameMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    roughness: 0.3,
    metalness: 0.7
  });
  const windowFrame = new THREE.Mesh(windowFrameGeometry, windowFrameMaterial);
  windowFrame.position.set(0, 0, 0);
  windowFrame.castShadow = true;
  windowGroup.add(windowFrame);

  // Glass with subtle tint
  const windowGlassGeometry = new THREE.PlaneGeometry(3.3, 2.3);
  const windowGlassMaterial = new THREE.MeshStandardMaterial({
    color: 0xf0f8ff,
    transparent: true,
    opacity: 0.2,
    roughness: 0.0,
    metalness: 0.0
  });
  const windowGlass = new THREE.Mesh(windowGlassGeometry, windowGlassMaterial);
  windowGlass.position.set(0, 0, 0.05);
  windowGroup.add(windowGlass);

  windowGroup.position.set(3, 2, 5.9);
  windowGroup.rotation.y = Math.PI;
  scene.add(windowGroup);

  // CARPET PLACEMENT - Central focus
  if (carpetImage) {
    loader.setCrossOrigin('anonymous');
    loader.load(carpetImage, (texture) => {
      texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.flipY = false; // Ensure proper orientation
      
      const carpetGeometry = new THREE.PlaneGeometry(carpetSize.width, carpetSize.height);
      const carpetMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.9,
        metalness: 0.0,
        transparent: false,
        side: THREE.DoubleSide
      });
      
      const carpet = new THREE.Mesh(carpetGeometry, carpetMaterial);
      carpet.rotation.x = -Math.PI / 2;
      carpet.position.set(0.3, 0.003, -3.2); // Perfectly centered in seating area
      carpet.receiveShadow = true;
      carpet.castShadow = true;
      
      scene.add(carpet);
    });
  } else {
    // Default neutral area rug
    const rugGeometry = new THREE.PlaneGeometry(2.8, 2.0);
    const rugMaterial = new THREE.MeshStandardMaterial({
      color: 0xe8e4de, // Warm neutral
      roughness: 0.9,
      metalness: 0.0
    });
    const rug = new THREE.Mesh(rugGeometry, rugMaterial);
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(0.3, 0.003, -3.2);
    rug.receiveShadow = true;
    rug.castShadow = true;
    scene.add(rug);
  }

  return scene;
}