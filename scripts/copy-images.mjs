#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.join(__dirname, '../Images/page images');
const publicDir = path.join(__dirname, '../public/images/page-images');
const distDir = path.join(__dirname, '../dist/images/page-images');

async function copyImages() {
  try {
    console.log('📁 Copying hero background images...');
    
    // Ensure dist directory exists
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }
    
    // Copy original images
    if (fs.existsSync(sourceDir)) {
      const files = fs.readdirSync(sourceDir);
      for (const file of files) {
        const sourcePath = path.join(sourceDir, file);
        const destPath = path.join(distDir, file);
        fs.copyFileSync(sourcePath, destPath);
        console.log(`✅ Copied: ${file}`);
      }
    }
    
    // Copy Background_Image.jpg if it exists
    const backgroundImagePath = path.join(__dirname, '../dist/Images/Background_Image.jpg');
    if (fs.existsSync(backgroundImagePath)) {
      const destPath = path.join(distDir, 'Background_Image.jpg');
      fs.copyFileSync(backgroundImagePath, destPath);
      console.log('✅ Copied: Background_Image.jpg');
    }
    
    // Copy optimized images
    if (fs.existsSync(publicDir)) {
      const files = fs.readdirSync(publicDir);
      for (const file of files) {
        const sourcePath = path.join(publicDir, file);
        const destPath = path.join(distDir, file);
        fs.copyFileSync(sourcePath, destPath);
        console.log(`✅ Copied optimized: ${file}`);
      }
    }
    
    console.log('🎉 All images copied successfully!');
  } catch (error) {
    console.error('❌ Error copying images:', error);
    process.exit(1);
  }
}

copyImages();
