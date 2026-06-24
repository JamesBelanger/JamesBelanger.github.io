// One-command switch from the github.io URL to a custom domain.
// Run AFTER you have bought the domain and pointed DNS at GitHub Pages.
//   node scripts/use-custom-domain.mjs              # defaults to jamesbelanger.io
//   node scripts/use-custom-domain.mjs example.com  # any apex domain
//
// It edits astro.config.mjs (site), public/robots.txt (Sitemap line), and
// writes public/CNAME — then prints the remaining manual steps. Idempotent.
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dir, '..');
const domain = (process.argv[2] || 'jamesbelanger.io').replace(/^https?:\/\//, '').replace(/\/+$/, '');
const url = `https://${domain}`;

// 1) astro.config.mjs — site URL
const cfgPath = resolve(root, 'astro.config.mjs');
let cfg = await readFile(cfgPath, 'utf8');
cfg = cfg.replace(/site:\s*'[^']*'/, `site: '${url}'`);
await writeFile(cfgPath, cfg);

// 2) public/robots.txt — sitemap location
const robotsPath = resolve(root, 'public/robots.txt');
let robots = await readFile(robotsPath, 'utf8');
robots = robots.replace(/Sitemap:\s*\S+/, `Sitemap: ${url}/sitemap-index.xml`);
await writeFile(robotsPath, robots);

// 3) public/CNAME — tells GitHub Pages to serve the custom domain
await writeFile(resolve(root, 'public/CNAME'), `${domain}\n`);

console.log(`✓ Switched site to ${url}`);
console.log('  - astro.config.mjs  site updated');
console.log('  - public/robots.txt sitemap updated');
console.log('  - public/CNAME      written');
console.log('\nRemaining manual steps:');
console.log(`  1. Registrar DNS: apex ${domain} -> A 185.199.108.153/109/110/111;  www -> CNAME jamesbelanger.github.io`);
console.log('  2. GitHub repo -> Settings -> Pages -> Custom domain: ' + domain + ' (then "Enforce HTTPS")');
console.log('  3. git add -A && git commit -m "Switch to custom domain" && git push');
console.log(`  4. Google Search Console: add property ${url} and submit ${url}/sitemap-index.xml`);
