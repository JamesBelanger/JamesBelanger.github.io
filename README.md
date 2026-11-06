# jamesbelanger.com

Source for [jamesbelanger.com](https://jamesbelanger.com), James Belanger's personal site: projects, research and notes.

Built with **Astro 5 + Tailwind CSS v4**. Every push to `main` builds and deploys to **GitHub Pages** through `.github/workflows/deploy.yml`. Content is plain TypeScript data files (no CMS).

## Run locally

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output -> ./dist
npm run preview  # serve the build
```

Requires Node 18.20+, 20.3+, or 22+.

## Where things live

| What | File |
| --- | --- |
| Name, role, tagline, links, nav | `src/data/site.ts` |
| Research | `src/data/research.ts` |
| Publications | `src/data/publications.ts` |
| Projects | `src/data/projects.ts` |
| News feed | `src/data/news.ts` |
| Pages | `src/pages/*.astro` |
| Theme tokens / colors / dark mode | `src/styles/global.css` |
| SEO + OpenGraph + JSON-LD | `src/components/BaseHead.astro` |

Most updates are data-only: add a paper to `publications.ts` or a line to `news.ts`, then push.

## Custom domain

The domain is set by `node scripts/use-custom-domain.mjs <domain>`, which writes `public/CNAME`, the `site` value in `astro.config.mjs` and the sitemap line in `public/robots.txt`.
