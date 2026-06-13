# Content TODO — fill before launch

Everything below is a placeholder in the scaffold. Knock these out and the site is ready.

## ⚠️ Verify first (accuracy)
- [ ] **Publications** (`src/data/publications.ts`) — confirm every author list, venue, status, and DOI
      against the published record. Publicly claimed Nature-tier co-authorship is a hard, checkable claim.
      (Pulled from your vault `00_Master/Publications.md`, which had several lists truncated with "…".)
- [x] **Current title** — confirmed: **Research Technician**, Hayden Lab (set in `src/data/site.ts`).
      (Still confirm student-vs-graduated status / graduation year for the CV.)

## Identity & links (`src/data/site.ts`)
- [ ] Real **Google Scholar** profile URL (currently `#`).
- [ ] Real **ORCID** iD URL (currently `#`) — and add this site to your ORCID record.
- [ ] Optional **LinkedIn** URL (leave `''` to hide).

## Assets
- [ ] **Headshot** → swap the "JB" monogram on the home page (`src/pages/index.astro`) for
      `<img src="/headshot.jpg" alt="James Belanger" .../>`; also use it (or a clean figure) as
      `public/og-image.png` (1200×630) for link previews.
- [ ] **CV PDF** → export to `public/cv/Belanger_CV_2026-06.pdf` (fill the placeholders in your vault CV first:
      graduation year, GPA, coursework, honors).
- [ ] **Research figures** → export 4 (one per theme) into `public/figures/` and pass `src=` to
      `<FigurePlaceholder />` in `src/pages/research.astro`. Each needs a caption + alt text (already stubbed).
- [ ] **Project links** → add live demo / repo links where you have them (`src/data/projects.ts`).

## Domain & deploy
- [ ] Buy **jamesbelanger.io** (Cloudflare Registrar / Namecheap).
- [ ] Push to GitHub, import to Vercel, attach the domain.
- [ ] After deploy: submit `sitemap-index.xml` to Google Search Console; cross-link the site into
      ORCID, Scholar, and your email signature.

## Nice-to-have (post-application, "M4")
- [ ] One interactive React island (e.g. a PSTH / subspace-geometry viz) as an engineering-signal differentiator.
- [ ] A short technical explainer / writing section — only if you'll actually maintain it.
