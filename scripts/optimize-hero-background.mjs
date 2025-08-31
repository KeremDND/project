#!/usr/bin/env node

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const sourceImage = path.join(__dirname, '../Images/page images/Abadan Haly home page backgroound.png');
const outputDir = path.join(__dirname, '../public/images/page-images');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Sizes for responsive images
const sizes = [
  { width: 1280, suffix: '1280' },
  { width: 1920, suffix: '1920' },
  { width: 2560, suffix: '2560' }
];

async function optimizeHeroBackground() {
  try {
    console.log('🖼️  Optimizing hero background image...');
    
    // Process each size
    for (const size of sizes) {
      console.log(`Processing ${size.width}px width...`);
      
      // AVIF
      await sharp(sourceImage)
        .resize(size.width, null, { withoutEnlargement: true })
        .avif({ quality: 80 })
        .toFile(path.join(outputDir, `abadan-haly-home-page-background-${size.suffix}.avif`));
      
      // WebP
      await sharp(sourceImage)
        .resize(size.width, null, { withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(path.join(outputDir, `abadan-haly-home-page-background-${size.suffix}.webp`));
      
      // JPG fallback
      await sharp(sourceImage)
        .resize(size.width, null, { withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toFile(path.join(outputDir, `abadan-haly-home-page-background-${size.suffix}.jpg`));
    }
    
    // Create default versions (1920px)
    await sharp(sourceImage)
      .resize(1920, null, { withoutEnlargement: true })
      .avif({ quality: 80 })
      .toFile(path.join(outputDir, 'abadan-haly-home-page-background.avif'));
    
    await sharp(sourceImage)
      .resize(1920, null, { withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(path.join(outputDir, 'abadan-haly-home-page-background.webp'));
    
    await sharp(sourceImage)
      .resize(1920, null, { withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toFile(path.join(outputDir, 'abadan-haly-home-page-background.jpg'));
    
    console.log('✅ Hero background image optimization complete!');
    console.log('📁 Files saved to:', outputDir);
    
  } catch (error) {
    console.error('❌ Error optimizing hero background:', error);
    process.exit(1);
  }
}

optimizeHeroBackground();
