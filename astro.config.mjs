// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages with the custom domain in public/CNAME.
  // Change domains with `node scripts/use-custom-domain.mjs <domain>`.
  site: 'https://jamesbelanger.com',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
