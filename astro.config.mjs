// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Current deploy target = GitHub Pages user site (served at the root).
  // ⚠️ When you attach the custom domain, change this to 'https://jamesbelanger.io'
  //    (and update public/robots.txt + add public/CNAME). See DEPLOY.md.
  site: 'https://jamesbelanger.com',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
