# Session Log — jamesbelanger.io

## 2026-06-25 — Custom domain LIVE
- James bought **jamesbelanger.com** at Cloudflare Registrar (.com chosen over .io: available, cheaper ~$10–12, more standard).
- Cloudflare DNS, **grey-cloud / DNS-only**: 4× `A @` → 185.199.108–111.153; `CNAME www` → jamesbelanger.github.io
  (www CNAME repeatedly failed to save — still pending; apex fully works).
- `node scripts/use-custom-domain.mjs jamesbelanger.com` → public/CNAME + astro.config + robots; commit `fa30838`, deployed.
- Set Pages custom domain + **Enforce HTTPS** via `gh api PUT .../pages`; cert_state=approved. **https://jamesbelanger.com live & valid.**
- Remaining: add www CNAME; Google Search Console; put the URL into ORCID/Scholar profiles.

## 2026-06-25 — CV buildout (all live on jamesbelanger.com)
- Wired in **ORCID** (0009-0003-3269-8810) + **Google Scholar** (user=8RCoKNUAAAAJ); **LinkedIn** (/in/jamesluibelanger).
- **Uploaded CV PDF**, then rebuilt it repeatedly from the Word source via python-docx edits + Word COM `ExportAsFixedFormat`
  (MS Word at Office16; pixel-perfect). Editable master: `Downloads\James Belanger - Resume 2026 (updated).docx` (suggest rename → CV).
- **Degree FINAL (per James's LinkedIn):** B.A. — 3 majors (Linguistics, Cognitive Sciences, Psychology) · minors Spanish & Neuroscience
  · May 2025 · GPA 3.94 · **Cum Laude**. (Earlier "Cognitive Sciences (Psych & Ling) + Data Science minor" wording was wrong.)
- Added to site + CV: **honors thesis** (Kemmer), **Teaching** (TA Words in English/Kemmer), **Leadership** (Pres., Rice Linguistics
  Student Assoc.), 4th research role (**Fette SURF** 2022), **Honors** (Psi Chi $3k + others), **Conference presentations**
  (posters: Human Single-Neuron Mtg 2025, SNL 2025; attended SfN Nov 2024).
- **CV-vs-résumé decision:** keep ONE comprehensive **academic CV** (CV-only on the site — correct for grad school). Now 3 pages (fine).
- Status: James pausing; will resume later. Everything already auto-deployed/live. Optional next: Research Interests blurb / grad coursework.

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

- **CV uploaded** (`0ca96bc`): full 2026 CV → `public/cv/Belanger_CV_2026-06.pdf`, download buttons re-enabled;
  **LinkedIn** added; degree/GPA/prior-positions aligned to the CV. Title stays **Research Technician** (CV says
  Assistant — James's call to keep site as Technician); mentoring bullet kept.

**Still pending James:** research figures (deferred until he publishes), buy jamesbelanger.io
(then `node scripts/use-custom-domain.mjs`), Search Console, add site URL into ORCID/Scholar records.
Optional: re-export CV PDF to say "Research Technician" + add mentoring line, to match the site.

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
