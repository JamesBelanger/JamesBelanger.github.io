# Content TODO — fill before / around launch

The site is **live** at https://jamesbelanger.github.io/ and rebuilds on every push to `main`.
Items below are what's left. The **"Needs James"** block is the only thing blocking a polished launch.

---

## ✅ Done (this scaffold)
- [x] Interactive **language-manifold** viz (`src/components/ManifoldViz.astro`) — home showcase + the flagship figure on `/research`.
- [x] **Headshot** in home hero (`public/headshot.jpg`); **Google Scholar** + **ORCID** wired in.
- [x] **Citations toolkit**: `/publications.bib` download + per-paper "Cite" / "BibTeX" copy buttons (`src/lib/cite.ts`).
- [x] **Polish**: custom `404` page, apple-touch-icon + web manifest + theme-color (`node scripts/make-icons.mjs`).
- [x] Real **OG link-preview image** at `public/og-image.png` (regenerate: `node scripts/make-og.mjs`).
- [x] One-command **custom-domain switch** (`node scripts/use-custom-domain.mjs`).
- [x] Publication DOIs reconciled; **title** confirmed Research Technician; **degree** B.A. · May 2025.

---

## ⚠️ Needs James (drop the file / paste the link — I'll wire each in)

| What | Where it goes | Notes |
| --- | --- | --- |
| ~~**Google Scholar URL**~~ | ✅ done | `user=8RCoKNUAAAAJ` wired in (commit `f3ce846`). |
| ~~**ORCID iD URL**~~ | ✅ done | `0009-0003-3269-8810` wired in (commit `9e4ccde`). Add this site's URL to the ORCID record too. |
| ~~**LinkedIn URL**~~ | ✅ done | `linkedin.com/in/jamesluibelanger` (from CV) |
| ~~**Headshot**~~ | ✅ done | `public/headshot.jpg` in the home hero; manifold moved to its own showcase section below the bio |
| ~~**CV degree/year/GPA**~~ | ✅ done | aligned to uploaded CV: B.A. Cognitive Sciences (Psych & Ling), Data Science minor, Spanish, May 2025, GPA 3.94 |
| ~~**CV PDF**~~ | ✅ done | `public/cv/Belanger_CV_2026-06.pdf` (full 2026 CV); download buttons re-enabled. **Re-export & overwrite this file to update.** |
| **4 research figures** | `public/figures/*.png` | **deferred until James publishes** — one per theme; pass `src=` to `<FigurePlaceholder />` in `src/pages/research.astro` |

> Verification note (kept for the record): only the **Nature** paper is confirmed published on the open
> web; the other 3 journal articles show as bioRxiv preprints with no public acceptance evidence. James
> affirmed they are genuinely in-press and chose to label them "In press." His call.

---

## Publications still to reconcile
- [ ] **"A geometric foundation for word meaning"** — the old DOI `10.64898/2026.01.28.702241` resolved to a
      *different* title. Find the correct bioRxiv DOI and re-add it in `src/data/publications.ts`.

---

## Domain & deploy ✅ LIVE at https://jamesbelanger.com
- [x] Bought **jamesbelanger.com** at Cloudflare Registrar (2026-06-25; .com beat .io — cheaper + standard).
- [x] DNS: 4× `A @` → 185.199.108–111.153 + `CNAME www` → jamesbelanger.github.io, all **grey-cloud (DNS only)**.
- [x] `node scripts/use-custom-domain.mjs jamesbelanger.com` → committed + deployed; Pages custom domain + **Enforce HTTPS** on (cert approved).
- [ ] ⚠️ **`www` CNAME** kept failing to save in Cloudflare — re-add it (apex works regardless).
- [ ] Google Search Console: add property `https://jamesbelanger.com`, submit `/sitemap-index.xml`.
- [ ] Add `https://jamesbelanger.com` into your **ORCID** + **Google Scholar** profiles + email signature.

## Nice-to-have (post-application)
- [ ] A short technical writing / explainer section — only if you'll maintain it.
- [ ] Pull live demo / repo links onto more project cards (`src/data/projects.ts`).
