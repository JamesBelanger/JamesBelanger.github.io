# Session Log — jamesbelanger.io

## 2026-06-24 (continued — later)
**Also shipped & deployed:**
- ORCID `0009-0003-3269-8810` (`9e4ccde`) + Google Scholar `user=8RCoKNUAAAAJ` (`f3ce846`) wired in (verified the
  Scholar profile via WebFetch — it's his; agent earlier missed it only because new profiles aren't in Scholar search yet).
- Hid placeholder `#` Scholar/ORCID links on home so no dead links went live (`a00c57b`).
- Headshot → `public/headshot.jpg` (sharp crop) in hero; manifold moved to its own showcase section; CV fixed to
  **B.A. · May 2025**; CV download buttons gated (`links.cv=''`) so no 404 until the PDF is added (`2a46390`).
- **Live flagship figure** (manifold on `/research`), **citations toolkit** (`/publications.bib` + per-paper Cite/BibTeX
  copy buttons, shared `src/lib/cite.ts`), **polish pack** (custom 404, apple-touch-icon + web manifest + theme-color
  via `scripts/make-icons.mjs`) (`b12c714`).

**Still pending James:** CV PDF (then restore `links.cv` path), research figures (deferred until he publishes),
buy jamesbelanger.io (then `node scripts/use-custom-domain.mjs`), Search Console, add site URL into ORCID/Scholar records.

## 2026-06-24
**Shipped (commit `0d97ce2`, pushed to main → live):**
- **Interactive language-manifold hero** (`src/components/ManifoldViz.astro`): rotating 3D point cloud of
  two semi-orthogonal subspaces (syntax/teal, semantics/amber) along a shared low-D population axis —
  the flagship result as a site mark. Vanilla canvas, no new deps, theme-aware (reads `--accent` + `.dark`
  via MutationObserver), static under `prefers-reduced-motion`, pauses off-screen (IntersectionObserver) /
  tab-hidden. Seeded PRNG (mulberry32, seed 20260624) for a stable cloud. Replaced the static "JB" monogram
  on the home hero (`src/pages/index.astro`).
- **OG link-preview image** `public/og-image.png` (1200×630) — was 404. Generated reproducibly by
  `scripts/make-og.mjs` (uses installed `sharp`; Segoe UI text renders fine on Windows; reuses the same
  point-cloud math as the viz). Visually verified.
- **`scripts/use-custom-domain.mjs`** — one-command switch to the custom domain: edits `astro.config.mjs`
  site, `public/robots.txt` sitemap line, writes `public/CNAME`, prints DNS + Search Console steps. Idempotent.
- **`CONTENT-TODO.md`** rewritten into a precise "Needs James" table (file → destination).

**Reviewed, no change needed:** all page copy is publication-ready; sitemap (7 pages) + footer + JSON-LD correct.

**Still blocked on James (drop file / paste link, I wire in):** real Scholar + ORCID URLs, headshot
(`public/headshot.jpg`), CV PDF (`public/cv/Belanger_CV_2026-06.pdf`) + grad year/GPA/coursework in
`src/pages/cv.astro`, 4 research figures (`public/figures/`), correct DOI for "A geometric foundation for
word meaning." Domain not yet bought (jamesbelanger.io).

**Next session:** wire in whatever assets James provides; when domain is bought, run the domain script.
