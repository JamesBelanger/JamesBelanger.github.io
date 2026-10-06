// Generate public/og-image.png (1200x630) for link previews.
// Reproducible: `node scripts/make-og.mjs [path/to/banner.png]`.
// The image is the collage banner (rendered by the vault's make_banner.py, the same
// script that exports the hero's cutouts) over the tagline on cream stock.
// Re-run after re-rendering the banner or editing the copy below.
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dir = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dir, '../public/og-image.png');
const BANNER =
  process.argv[2] ??
  'C:/Users/james/Second Brain/03_Career_and_Admin/Personal_Website/LinkedIn_Banner/out/linkedin_banner_industry_teal_marigold_2x.png';

const W = 1200;
const H = 630;
const BANNER_H = 300; // banner is 4:1

// --- palette (matches src/styles/global.css) ---
const PAPER = '#faf7ee';
const INK = '#141418';
const MUTED = '#5a5a55';
const POP = '#ffc82e';

const slab = `font-family="Rockwell, 'Zilla Slab', Georgia, serif"`;
const mono = `font-family="'Courier New', Courier, monospace"`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${PAPER}"/>
  <rect x="62" y="452" width="572" height="26" fill="${POP}"/>
  <text x="64" y="404" ${slab} font-size="62" font-weight="700" fill="${INK}">I turn messy data</text>
  <text x="64" y="472" ${slab} font-size="62" font-weight="700" fill="${INK}">into working tools.</text>
  <g transform="rotate(-1 64 540)">
    <rect x="64" y="520" width="606" height="40" fill="${INK}"/>
    <text x="82" y="547" ${mono} font-size="22" font-weight="700" letter-spacing="3" fill="${PAPER}">DATA · LANGUAGE · AI AUTOMATION</text>
  </g>
  <text x="1136" y="548" text-anchor="end" ${mono} font-size="24" font-weight="700" fill="${MUTED}">jamesbelanger.com</text>
</svg>`;

const banner = await sharp(BANNER).resize(W, BANNER_H).toBuffer();
await sharp(Buffer.from(svg))
  .composite([{ input: banner, top: 0, left: 0 }])
  .png()
  .toFile(OUT);
console.log('wrote', OUT);
