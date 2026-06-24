# Content TODO — fill before / around launch

The site is **live** at https://jamesbelanger.github.io/ and rebuilds on every push to `main`.
Items below are what's left. The **"Needs James"** block is the only thing blocking a polished launch.

---

## ✅ Done (this scaffold)
- [x] Interactive **language-manifold** hero viz (`src/components/ManifoldViz.astro`) — replaces the JB monogram.
- [x] Real **OG link-preview image** at `public/og-image.png` (regenerate: `node scripts/make-og.mjs`).
- [x] One-command **custom-domain switch** (`node scripts/use-custom-domain.mjs`).
- [x] Publication DOIs reconciled (mismatched DOI dropped; verified DOIs kept).
- [x] **Current title** confirmed: **Research Technician**, Hayden Lab (`src/data/site.ts`).

---

## ⚠️ Needs James (drop the file / paste the link — I'll wire each in)

| What | Where it goes | Notes |
| --- | --- | --- |
| ~~**Google Scholar URL**~~ | ✅ done | `user=8RCoKNUAAAAJ` wired in (commit `f3ce846`). |
| ~~**ORCID iD URL**~~ | ✅ done | `0009-0003-3269-8810` wired in (commit `9e4ccde`). Add this site's URL to the ORCID record too. |
| **LinkedIn URL** (optional) | `src/data/site.ts` → `links.linkedin` | leave `''` to hide |
| ~~**Headshot**~~ | ✅ done | `public/headshot.jpg` in the home hero; manifold moved to its own showcase section below the bio |
| ~~**CV degree/year**~~ | ✅ done | B.A. · May 2025 (still optional: GPA, coursework, honors in `src/pages/cv.astro`) |
| **CV PDF** | `public/cv/Belanger_CV_2026-06.pdf` | drop the file, then set `links.cv` back to that path in `src/data/site.ts`. **Download buttons are hidden while `links.cv` is empty** (no dead link). |
| **4 research figures** | `public/figures/*.png` | **deferred until James publishes** — one per theme; pass `src=` to `<FigurePlaceholder />` in `src/pages/research.astro` |

> Verification note (kept for the record): only the **Nature** paper is confirmed published on the open
> web; the other 3 journal articles show as bioRxiv preprints with no public acceptance evidence. James
> affirmed they are genuinely in-press and chose to label them "In press." His call.

---

## Publications still to reconcile
- [ ] **"A geometric foundation for word meaning"** — the old DOI `10.64898/2026.01.28.702241` resolved to a
      *different* title. Find the correct bioRxiv DOI and re-add it in `src/data/publications.ts`.

---

## Domain & deploy (your action, then one command)
- [ ] Buy **jamesbelanger.io** (Cloudflare Registrar / Namecheap, ~$12–15/yr).
- [ ] Point DNS at GitHub Pages (apex A records + `www` CNAME — see DEPLOY.md).
- [ ] Run `node scripts/use-custom-domain.mjs`, commit, push.
- [ ] GitHub repo → Settings → Pages → Custom domain → enter domain, enable "Enforce HTTPS".
- [ ] Google Search Console: add the property, submit `…/sitemap-index.xml`. Cross-link site into ORCID/Scholar/email signature.

## Nice-to-have (post-application)
- [ ] A short technical writing / explainer section — only if you'll maintain it.
- [ ] Pull live demo / repo links onto more project cards (`src/data/projects.ts`).
