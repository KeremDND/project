import fg from 'fast-glob';
import path from 'node:path';
import fs from 'node:fs/promises';
import sharp from 'sharp';

const SRC_ROOT = 'public/Images/Halylar';
const OUT_ROOT = 'public/cdn/Halylar';
const TARGETS = [480, 768, 1080, 1440, 1920];

const ensureDir = async (p) => fs.mkdir(p, { recursive: true });

console.log('🔍 Scanning for carpet images...');

const files = await fg(`${SRC_ROOT}/*/*.jpg`, { caseSensitiveMatch: false });
console.log(`📸 Found ${files.length} images to process`);

const manifest = [];

for (const file of files) {
  const color = path.basename(path.dirname(file)); // folder name = color
  const base = path.basename(file, path.extname(file)); // filename without ext
  const outDir = path.join(OUT_ROOT, color);
  await ensureDir(outDir);

  console.log(`⚡ Processing: ${color}/${base}`);

  try {
    const img = sharp(file).rotate().withMetadata({ icc: 'sRGB' });
    const meta = await img.metadata();
    const masterW = meta.width || 0;
    const masterH = meta.height || 0;

    const widths = TARGETS.filter(w => w <= masterW);
    if (widths.length === 0) widths.push(masterW); // at least one rendition

    const avif = [];
    const webp = [];
    const jpg = [];

    for (const w of widths) {
      // AVIF
      const avifPath = path.join(outDir, `${base}-${w}.avif`);
      await img.clone().resize({ width: w }).avif({ 
        quality: 50, 
        effort: 5, 
        chromaSubsampling: '4:4:4' 
      }).toFile(avifPath);
      avif.push({ src: `/${avifPath.replace(/\\/g, '/')}`, w });

      // WebP
      const webpPath = path.join(outDir, `${base}-${w}.webp`);
      await img.clone().resize({ width: w }).webp({ 
        quality: 80, 
        effort: 5 
      }).toFile(webpPath);
      webp.push({ src: `/${webpPath.replace(/\\/g, '/')}`, w });

      // JPEG fallback
      const jpgPath = path.join(outDir, `${base}-${w}.jpg`);
      await img.clone().resize({ width: w }).jpeg({ 
        quality: 82, 
        progressive: true, 
        mozjpeg: true 
      }).toFile(jpgPath);
      jpg.push({ src: `/${jpgPath.replace(/\\/g, '/')}`, w });
    }

    // Extract product info from filename
    const nameParts = base.split('-');
    const productName = nameParts.slice(2, -2).join(' '); // Extract name between "abadan-haly" and color/number
    const sku = nameParts[nameParts.length - 2]; // Second to last part is usually the SKU

    manifest.push({
      id: `${color.toLowerCase()}-${sku}`.replace(/\s+/g, '-'),
      name: productName || base.replace(/[-_]/g, ' ').trim(),
      sku: sku || base,
      color: color.replace(/([A-Z])/g, ' $1').trim(), // Add spaces to camelCase
      width: masterW,
      height: masterH,
      srcset: { avif, webp, jpg },
      // Optional hooks for 3D/AR (fill later if available)
      glbUrl: null,
      usdzUrl: null,
      posterUrl: null,
      // Enhanced alt text
      alt: `abadan-haly — ${sku || base}, ${color.toLowerCase()}, carpet`,
      // Additional metadata
      style: 'Traditional', // Default, can be enhanced later
      material: 'Premium Polypropylene',
      isFeatured: Math.random() > 0.7 // Random featured status
    });

  } catch (error) {
    console.error(`❌ Error processing ${file}:`, error);
  }
}

await ensureDir('data');
await fs.writeFile('data/carpets.json', JSON.stringify(manifest, null, 2), 'utf8');
console.log(`✅ Built ${manifest.length} items into data/carpets.json`);
console.log(`📁 Optimized images saved to ${OUT_ROOT}`);