import fs from 'node:fs/promises';
import path from 'node:path';
const SITE = process.env.SITE_ORIGIN || 'https://www.example.com';

const manifest = JSON.parse(await fs.readFile('data/carpets.json','utf8'));

// Put all images under a few synthetic URLs to avoid huge sitemaps per product page.
// Google accepts <image:image> entries under any listed <url>.
const CHUNK = 1000;
const urls = [];
for (let i=0; i<manifest.length; i+=CHUNK) {
  urls.push(manifest.slice(i, i+CHUNK));
}

const xmlEsc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

const body = urls.map((chunk, idx) => {
  const imagesXml = chunk.map(item => {
    const all = [...item.srcset.avif, ...item.srcset.webp, ...item.srcset.jpg];
    const locs = all.slice(0,3).map(r => 
      `      <image:image>\n        <image:loc>${xmlEsc(SITE + r.src)}</image:loc>\n        <image:title>${xmlEsc(item.name)}</image:title>\n        <image:caption>${xmlEsc(item.alt)}</image:caption>\n      </image:image>`
    ).join('\n');
    return locs;
  }).join('\n');
  return `
  <url>
    <loc>${SITE}/gallery?s=${idx+1}</loc>
${imagesXml}
  </url>`;
}).join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${body}
</urlset>`;

await fs.writeFile('public/sitemap-images.xml', xml, 'utf8');
console.log('✔ Wrote public/sitemap-images.xml');

