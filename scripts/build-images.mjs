import fg from 'fast-glob';
import path from 'node:path';
import fs from 'node:fs/promises';
import sharp from 'sharp';
import slugify from 'slugify';

const SRC_ROOT = 'images/Halylar';               // your uploaded masters
const OUT_ROOT = 'public/cdn/Halylar';          // public, optimized outputs
const MANIFEST = 'data/carpets.json';
const TARGETS = [480, 768, 1080, 1440, 1920];   // responsive widths

// Optional GEO context for alt text (edit as you like)
const GEO = {
  brand: 'Abadan Haly',
  country: 'Turkmenistan'
};

const ensureDir = async (p) => fs.mkdir(p, { recursive: true });
const toWords = s => s.replace(/\.(jpe?g|png|webp|avif)$/i,'').replace(/[_-]+/g,' ').trim();
const toSlug = s => slugify(s, { lower: true, strict: true });

// Try to parse size from filename like: ...-200x300.jpg or ...-200×300.jpg
const parseSize = base => {
  const m = base.match(/(\d{2,4})\s?[x×]\s?(\d{2,4})/i);
  return m ? { widthCm: +m[1], heightCm: +m[2] } : null;
};

const files = await fg(`${SRC_ROOT}/*/*.{jpg,jpeg,png,bmp}`, { caseSensitiveMatch: false });
const manifest = [];

for (const file of files) {
  try {
    console.log(`Processing: ${file}`);
    
    const colorFolder = path.basename(path.dirname(file));
    const color = colorFolder.toLowerCase(); // normalize
    const baseName = path.basename(file);
    const base = baseName.replace(/\.(jpe?g|png|bmp)$/i,'');
    const words = toWords(base);
    const humanName = words.replace(/\b\w/g, c => c.toUpperCase());
    const size = parseSize(base) || {};
    const slug = toSlug(`${humanName} ${color}`);

    // Prepare IO
    const outDir = path.join(OUT_ROOT, color);
    await ensureDir(outDir);

  // Read master, normalize orientation/profile
  let img;
  try {
    img = sharp(file).rotate().withMetadata({ icc: 'sRGB' });
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
    continue;
  }
  
  const meta = await img.metadata();
  const masterW = meta.width || 0;
  const masterH = meta.height || 0;

  // Pick widths without upscaling
  const widths = TARGETS.filter(w => w <= masterW);
  if (widths.length === 0 && masterW) widths.push(masterW);

  const makePath = (w, ext) => path.join(outDir, `${toSlug(base)}-${w}.${ext}`);
  const avif = [], webp = [], jpg = [];

  for (const w of widths) {
    const common = img.clone().resize({ width: w });

    const avifPath = makePath(w, 'avif');
    await common.avif({ quality: 50, effort: 5, chromaSubsampling: '4:4:4' }).toFile(avifPath);
    avif.push({ src: `/cdn/Halylar/${color}/${toSlug(base)}-${w}.avif`, w });

    const webpPath = makePath(w, 'webp');
    await common.webp({ quality: 80, effort: 5 }).toFile(webpPath);
    webp.push({ src: `/cdn/Halylar/${color}/${toSlug(base)}-${w}.webp`, w });

    const jpgPath = makePath(w, 'jpg');
    await common.jpeg({ quality: 82, progressive: true, mozjpeg: true }).toFile(jpgPath);
    jpg.push({ src: `/cdn/Halylar/${color}/${toSlug(base)}-${w}.jpg`, w });
  }

  // Dominant color (for swatches)
  const stats = await img.stats();
  const d = stats.dominant || { r: 200, g: 200, b: 200 };
  const dominantColorHex = `#${[d.r,d.g,d.b].map(v=>v.toString(16).padStart(2,'0')).join('')}`;

  // SEO/GEO alt text (short, descriptive, locale-friendly)
  const sizeLabel = size.widthCm && size.heightCm ? `${size.widthCm}×${size.heightCm} cm` : '';
  const alt = [
    `${humanName} carpet`,
    sizeLabel,
    color,
    `${GEO.brand}, ${GEO.country}`
  ].filter(Boolean).join(' — ');

    manifest.push({
      id: `${color}-${toSlug(base)}`,
      name: humanName,
      color,
      slug,
      alt,
      width: masterW,
      height: masterH,
      sizeCm: size,
      dominantColorHex,
      srcset: { avif, webp, jpg },
      // hooks for 3D/AR if you add them later
      glbUrl: null, usdzUrl: null, posterUrl: null
    });
    
    console.log(`✓ Processed: ${humanName} (${color})`);
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
    continue;
  }
}

await ensureDir('data');
await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2), 'utf8');
console.log(`✔ Built ${manifest.length} images → ${MANIFEST} and /public/cdn/Halylar/*`);