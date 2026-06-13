# jamesbelanger.io

Personal academic website for James Belanger — computational neuroscientist (the "language manifold" line of work).

Built with **Astro 5 + Tailwind CSS v4**, deployed on **Vercel**. Content is plain TypeScript data files (no CMS); editing is a quick commit.

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
| Research themes (4) | `src/data/research.ts` |
| Publications | `src/data/publications.ts` |
| Projects | `src/data/projects.ts` |
| News feed | `src/data/news.ts` |
| Pages | `src/pages/*.astro` |
| Theme tokens / colors / dark mode | `src/styles/global.css` |
| SEO + OpenGraph + JSON-LD | `src/components/BaseHead.astro` |

Most updates are data-only: add a paper to `publications.ts`, a line to `news.ts`, push, done.

## Deploy (Vercel)

1. Push to a GitHub repo.
2. Import it in Vercel — it auto-detects Astro (build: `astro build`, output: `dist`). No config needed.
3. Add the custom domain **jamesbelanger.io** in Vercel → Project → Domains, and point the registrar's
   nameservers / records at Vercel.

## Before going live

See **CONTENT-TODO.md** — placeholders (headshot, CV PDF, Scholar/ORCID, figures) and the
publications-accuracy check are listed there.
