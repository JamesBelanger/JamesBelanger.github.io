// Generate public/og-image.png (1200x630) for link previews.
// Reproducible: `node scripts/make-og.mjs`. Renders an SVG (the site's manifold
// motif + identity) to PNG with sharp. Re-run after editing copy below.
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dir = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dir, '../public/og-image.png');

const W = 1200;
const H = 630;

// --- palette (matches src/styles/global.css dark theme) ---
const BG = '#0f1116';
const FG = '#e8e9ec';
const MUTED = '#9aa1ab';
const SYN = '#50d1c6'; // teal — syntax
const SEM = '#f0a868'; // amber — semantics
const LINE = '#272c36';

// --- deterministic manifold point cloud (mirrors ManifoldViz.astro) ---
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(20260624);
const gauss = () => {
  const u = Math.max(rng(), 1e-9);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rng());
};
const nrm = (v) => {
  const m = Math.hypot(...v) || 1;
  return v.map((x) => x / m);
};

const U = [0, 1, 0];
const S1 = nrm([1, 0, 0.12]);
const S2 = nrm([0.34, 0, 1]);
const cx = 930;
const cy = H / 2;
const scale = 92;
const t = 0.7; // fixed nice angle
const PHI = -0.42;
const cy_t = Math.cos(t),
  sy_t = Math.sin(t),
  cphi = Math.cos(PHI),
  sphi = Math.sin(PHI);
const proj = (p) => {
  const x = p[0] * cy_t + p[2] * sy_t;
  const z = -p[0] * sy_t + p[2] * cy_t;
  const y = p[1] * cphi - z * sphi;
  const depth = p[1] * sphi + z * cphi;
  return { sx: cx + x * scale, sy: cy - y * scale, depth };
};

const dots = [];
for (let g = 0; g < 2; g++) {
  const S = g === 0 ? S1 : S2;
  for (let i = 0; i < 95; i++) {
    const a = gauss() * 1.0;
    const b = gauss() * 0.42;
    const base = [a * U[0] + b * S[0] + gauss() * 0.05, a * U[1] + b * S[1], a * U[2] + b * S[2] + gauss() * 0.05];
    const pr = proj(base);
    dots.push({ ...pr, c: g === 0 ? SYN : SEM });
  }
}
dots.sort((p, q) => p.depth - q.depth);
const axis0 = proj([0, -2.7, 0]);
const axis1 = proj([0, 2.7, 0]);

const dotsSvg = dots
  .map((d) => {
    const k = Math.max(0, Math.min(1, (d.depth + 3) / 6));
    const r = (1.4 + 2.0 * k) * 1.7;
    const op = (0.35 + 0.55 * k).toFixed(2);
    return `<circle cx="${d.sx.toFixed(1)}" cy="${d.sy.toFixed(1)}" r="${r.toFixed(1)}" fill="${d.c}" opacity="${op}"/>`;
  })
  .join('');

const ff = `font-family="Segoe UI, Arial, Helvetica, sans-serif"`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect x="0" y="0" width="${W}" height="6" fill="${SYN}"/>
  <line x1="${axis0.sx.toFixed(1)}" y1="${axis0.sy.toFixed(1)}" x2="${axis1.sx.toFixed(1)}" y2="${axis1.sy.toFixed(1)}" stroke="${SYN}" stroke-width="1.5" opacity="0.18"/>
  ${dotsSvg}
  <text x="80" y="248" ${ff} font-size="76" font-weight="700" fill="${FG}">James Belanger</text>
  <text x="80" y="300" ${ff} font-size="30" font-weight="600" fill="${SYN}">Computational Neuroscientist</text>
  <text x="80" y="372" ${ff} font-size="27" fill="${MUTED}">The geometry of language in single-neuron</text>
  <text x="80" y="408" ${ff} font-size="27" fill="${MUTED}">recordings of the human brain.</text>
  <line x1="80" y1="470" x2="430" y2="470" stroke="${LINE}" stroke-width="1.5"/>
  <text x="80" y="512" ${ff} font-size="23" fill="${MUTED}">Hayden Lab · Baylor College of Medicine</text>
  <text x="80" y="560" ${ff} font-size="23" font-weight="600" fill="${FG}">jamesbelanger.io</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(OUT);
console.log('wrote', OUT);
