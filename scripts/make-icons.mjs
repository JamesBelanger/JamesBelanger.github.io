// Generate PWA/bookmark icons + web manifest from public/favicon.svg.
// Reproducible: `node scripts/make-icons.mjs` (re-run if the favicon changes).
import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = dirname(fileURLToPath(import.meta.url));
const pub = resolve(__dir, '../public');
const svg = await readFile(resolve(pub, 'favicon.svg'));

// apple-touch-icon: opaque (iOS adds its own rounded mask).
await sharp(svg, { density: 384 })
  .resize(180, 180)
  .flatten({ background: '#0d7d7d' })
  .png()
  .toFile(resolve(pub, 'apple-touch-icon.png'));

for (const size of [192, 512]) {
  await sharp(svg, { density: 512 }).resize(size, size).png().toFile(resolve(pub, `icon-${size}.png`));
}

const manifest = {
  name: 'James Belanger',
  short_name: 'J. Belanger',
  theme_color: '#0d7d7d',
  background_color: '#0f1116',
  display: 'browser',
  icons: [
    { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
  ],
};
await writeFile(resolve(pub, 'site.webmanifest'), JSON.stringify(manifest, null, 2) + '\n');
console.log('wrote apple-touch-icon.png, icon-192.png, icon-512.png, site.webmanifest');
