# Session Log — jamesbelanger.io

## 2026-10-05 (late) — Page strip, icons, phone hero, real findings (same branch, still UNCOMMITTED)
James picked three follow-ups and asked for the home research block to show real findings, animated, because
the rotating manifold picture was a synthetic illustration ("kind of bs"). No résumé link until he has a job
(he tailors one per application).
- **Inner pages** open on `PageStrip.astro`: the bottom slice of the collage background (halftone + torn colour
  fields, no name). `BaseLayout` renders it whenever a page fills no `hero` slot. Torn edge factored out into
  `TornEdge.astro` (shared with the hero).
- **Icons**: marigold halftone tile with the name's ransom-note "J", from the vault's
  `make_banner.py --export-icons <site>/public` (icon-512/192, apple-touch-icon, favicon-32). `BaseHead` links the
  PNGs; `favicon.svg` (old teal "JB") and `scripts/make-icons.mjs` (its generator) removed with `git rm`.
  Manifest colours updated.
- **Phone hero** (< 640 px): same pieces re-pasted on a taller 800x760 sheet with the name over two rows
  (`PHONE` table + `phoneLetter()` in `CollageHero.astro`; pieces not in the table are hidden on phones). Hero is
  ~370 px tall at 390 px wide, up from ~150.
- **Home "Where it comes from"**: `NeuronWall.astro` (1,008 squares, one per recorded neuron, firing as a
  sentence goes by; captioned as an illustration, not data) + four finding cards with count-up numbers:
  1,008 neurons / 14 patients; 81,370 conversation words + 7,346-word podcast; grammar > meaning in 2 of 3
  regions (HPC p=8e-5, ACC p=0.019, OFC n.s.; podcast and conversation); 26 models 0.1B-32.6B, no gain with
  size (rho=-0.084, p=0.68), best = GPT-2 medium. Sources: memory notes `project_convo_region_comparison`,
  `project_qa_emb_local_llm_panel_expansion`, `project_qa_emb_subspace_alignment`. `ManifoldViz` is off the home
  page (still on /research, now captioned "Illustration, not data").
- **Research page corrected** (`src/data/research.ts`): removed two claims the project notes retired: the
  "syntax from shallower layers ... 9 of 10 models" depth gap (dead on the 26-model panel) and "more compressed
  than any state-of-the-art language model". Replaced with the 26-model result and the grammar > meaning
  replication. "Benchmark vs. 10" -> 26.
- Browser-tested desktop/dark/phone: animation runs, numbers land on their final values, no overflow, no errors.

**Needs James:** (1) the finding numbers are from an unpublished manuscript; confirm he and his co-authors are
fine with them public. (2) Review the remaining flagship sentence on /research ("a single, strikingly
low-dimensional population axis"); the notes mark the 1-D result as partly retracted. (3) go -> commit + push.

## 2026-10-05 (night) — Playable names + degree line (same branch, still UNCOMMITTED)
James approved the layout ("lets keep it the way youve styled it") and settled the degree: **B.A. Cognitive
Sciences only for now** (`SITE.education`, shown under the bio); minor/GPA can come back later.
- **Spoken name per script.** `scripts/make-name-audio.py` (edge-tts, native male neural voice per locale, rate
  -12%) writes `public/audio/name-<lang>.mp3` for en, ja, ko, hi, ar, ru, el, he, zh, th, am (~14 KB each).
  Armenian has no edge-tts voice, so it shows without a play button. Re-run the script after editing a
  transliteration; a hand recording at the same path wins, and `public/audio/name.mp3` replaces the English clip.
- `NameScripts.astro`: a play button beside the cycling script plays the language on screen and holds the cycle
  while it speaks; added Amharic + Armenian to `nameScripts` (11 scripts).
- Collage name chips are now buttons (`chip-<lang>` tags from the banner export): clicking one switches the line
  to that language and plays it, via a `name:say` document event. The Braille chip plays English.
- Browser-tested: chip -> line switches + clip plays; cycle play button; English; no-clip language hides the
  button; no console errors.
- **English clip fixed.** James: it's buh-LAN-jer, stress on LAN (/bəˈlændʒɚ/). The edge-tts voice put the
  energy on the first syllable (BEL-an-jer). `name-en.mp3` is now rendered from the exact phonemes
  (`dʒˈeɪmz bəlˈændʒɚ`) with the Kokoro engine in the vault's `graduation_name_pronouncer` (`am_michael`);
  syllable-energy check shows a short weak "buh" then a longer, stronger "LAN". `make-name-audio.py` now skips
  English unless asked, and its docstring has the exact command.
- **Hard final r (James, corrected):** his "not a hard r ... almost British" was a complaint about the CLIP,
  not a request; I first misread it and dropped the r, then reverted. Page IPA is `/dʒeɪmz bəˈlændʒɚ/`. Clip
  re-rendered as `dʒˈeɪmz bəlˈændʒɚɹ` in Kokoro voice `am_liam`, chosen by measurement from 45 candidates
  (9 voices x 5 endings): r-colouring held ~140 ms with F3 ~1700 Hz, vs ~40 ms for the first clip.
**Needs James:** listen to all 11 clips (TTS reads the transliteration, so a wrong spelling is audible; the
English voice may not stress "Belanger" his way); then go -> commit, merge, push.

## 2026-10-05 (evening) — Industry repositioning + collage redesign (branch `personal-touches`, UNCOMMITTED, not deployed)
James: "lean in on the industry version ... reflect the entire website based on this." Site now matches the
job-search positioning (source of facts: vault `Layoff_2026/Applications/_tools/resume_facts.md`; every number
on the home page is from that sheet, and its never-claim list was respected).
- **Hero = the LinkedIn collage, live.** `src/components/CollageHero.astro` re-assembles the banner from 52
  separate WebP cutouts in `public/collage/` (+ `layers.json`), exported by the vault's
  `LinkedIn_Banner/make_banner.py --export-layers`. Per-piece depth drives pointer drift + scroll parallax via
  three CSS custom properties; paste-down load animation; stickers/chips sway; pieces lift on hover; 10 clippings
  are links (browser -> /projects, mic/speech -> Pronunciation Coach, grid -> Identity Lab, histogram -> Hospital
  Explorer, agents/code -> Research Engine, brain/manifold -> /research, stamp -> /contact). Below 46rem the stage
  stops shrinking and crops around the name. Torn lower edge. Mounted through a new `hero` slot in `BaseLayout`.
- **Design system** (`src/styles/global.css`): cream stock / ink / collage teal + marigold (`--pop`), paper grain
  overlay, Zilla Slab headings + Courier Prime labels (2 new @fontsource deps), `.label` (label-maker strip),
  `.clip` (pasted clipping card), `.hl` (marker highlight), `.halftone`. Dark mode kept.
- **Copy** (`src/data/site.ts`): title "Data, Language, AI Automation"; tagline "I turn messy data into working
  tools."; new `description`, `bio`, `languages`; `role`/`affiliation`/`shortBio`/`arc` removed; `url` fixed
  .io -> .com. Home = intro -> What I do (3 lanes with proof) -> Try the work (4 demos) -> Where it comes from
  (research as evidence) -> languages + contact. Nav now leads with Projects.
- Contact page: PhD-seeking line -> looking for full-time work (Houston, remote or relocating); affiliation row
  removed. News: PhD-applications item removed, 3 shipped-demo items added. Projects page: shipped tools first.
  Research lede in past tense. JSON-LD: jobTitle/affiliation dropped, knowsAbout updated.
- `scripts/make-og.mjs` rewritten: OG image = banner over tagline (old one said "Computational Neuroscientist,
  Hayden Lab, jamesbelanger.io").
- Browser-tested (Edge/playwright-core): no console errors or failed requests, no horizontal overflow at 390 px
  or 1440 px on home/projects/contact/research, pointer drift moves pieces, all 10 home internal links 200.

**Needs James before it ships:** (1) degree wording: resume fact sheet says "B.A. Cognitive Sciences, Minor in
Data Science, GPA 3.95"; the old site said triple major + Spanish/Neuroscience minors, 3.94. Home page now names
no degree; decide which wording goes back. (2) OK the public "looking for full-time work" line on /contact.
(3) transliterations / IPA / Spanish glosses / `public/audio/name.mp3` (from the earlier entry). (4) say go ->
commit, merge to main, push (auto-deploys).
**Not done:** EN/ES toggle; README still describes .io + Vercel; research page body text still in a
research-identity voice ("the core of my research").

## 2026-10-05 — "Personal touches" (branch `personal-touches`, UNCOMMITTED, not deployed)
Goal: make the site read as James's, not as a default AI template. Reference = justin-jungle.vercel.app
(scroll-driven paper diorama; plain HTML/CSS/vanilla JS, pinned stage + 650vh spacer, 5 parallax speeds,
still "stick puppet" hero with a CSS bob, ~40 WebP cutouts). Decided NOT to clone it; language is the motif.
- **`src/components/NameScripts.astro`** — under the hero name: IPA + play button, and a 2.6 s cycle through
  9 scripts (ja, ko, hi, ar, ru, el, he, zh, th). Data in `src/data/site.ts` (`ipa`, `nameScripts`).
  Play button uses `public/audio/name.mp3` if present, else browser speech synthesis.
- **`src/components/Gloss.astro`** — tagline parses on hover/focus/tap: constituent underline + popover with
  phrase category and Spanish gloss. Pure CSS. Data: `SITE.taglineGloss`.
- **`src/components/SpikeRaster.astro`** — fixed right-gutter canvas (≥1280 px only): 12 "place cells" tuned to
  scroll position fire as you scroll, spikes rise and fade. Off under reduced motion. Mounted in `BaseLayout`.
- Browser-tested (Edge via playwright-core): cycle advances, gloss shows, raster draws on scroll and clears at
  rest, no horizontal overflow at 390 px, no console errors. Two bugs fixed on the way: `offsetParent` is always
  null for `position: fixed` (raster never drew); hidden absolute popovers widened the page on phones.

**Needs James:** (1) verify all 9 transliterations + the IPA (assumed anglicized /bəˈlændʒɚ/); (2) check the
Spanish glosses; (3) record `public/audio/name.mp3` in his own voice; (4) say go → commit + merge + push.
**Next:** real EN/ES toggle (Astro i18n, `/es/` routes; all of `src/data/*.ts` needs Spanish — James reviews);
then decide on a scroll-scene hero ("a sentence travels through a brain", paper style).

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
