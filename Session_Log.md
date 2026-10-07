# Session Log — jamesbelanger.io

## 2026-10-06 (afternoon) — copy pass for general employers (commit `e3fd436`, live)
Audit against `resume_facts.md` and the job lanes James is applying to (AI workflow, forward-deployed, NLP / data
science, BI, enablement, clinical research). Committed by pathspec only; the uncommitted homepage work
(`PodcastRaster.astro`, `index.astro`, staged `NeuronWall.astro` deletion, empty `public/media/`) was left untouched.
- Bio (`site.ts`): added guides / staff training / first-line support at two hospitals.
- Project cards (`projects.ts`): plain-English lead before method names; removed "production engineering",
  "scraped from Instagram", "B2B concept", "competitive wedge", "FERPA-compliant".
- `/research`: empty figure placeholders no longer render; unbuilt "universal language manifold" theme removed
  (recover from `0c9c9b1` if wanted for PhD use); stale "Active" status dropped.
- `/projects/research-engine`: "Recording in progress" placeholder removed.
- Hospital Quality case study: title and meta now national (5,419); stale "roll-back commands have not been run" removed.
- ASR note: "a third of that gap" → "more than half" (body says about 60%).
- News: Nature Neuroscience and Cell now "in press", matching Publications.
- Demo footers (pronunciation, identity-resolution): no present-tense Baylor line, no "four years". These are site
  copies; the source repos still carry the old footers.
- 404 heading plain; `public/figures/README.txt` deleted.

**Open for James:** languages line (site says Portuguese + "intermediate" labels; fact sheet says Spanish, some French,
Japanese, Chinese); QA-Emb "I built a ... framework" wording; 704-neuron music numbers and spaCy / NLTK / Tableau tags
not in the fact sheet; Identity Resolution 769 (card) vs 858 (demo page title); News items all dated just "2026";
React 19 tag on Houston Eats vs the never-claim list.

## 2026-10-06 (late night) — News page brought up to date
James asked whether there was more news to post. There was: two items still said "in press" for papers that
are published, every date was a bare "2026", and two shipped things were missing.
- `src/data/news.ts` rewritten, newest first, with real months: Ask the Hospital Data (Oct, new), Nature
  Neuroscience published (Sep), Identity Resolution Lab + Pronunciation Coach (Sep), Hospital Quality Explorer,
  Cell published, Nature Human Behaviour in press with his equal-contribution role, Research Engine case study
  (Aug, new), Nature published (May), three preprints (May, Mar, Jan). Paper items link to their DOIs.
- `news.astro` formats `YYYY-MM` as "Oct 2026". Paper dates from Crossref/bioRxiv; project dates from git.

## 2026-10-06 (night) — Figures and an animation on the research page (SHIPPED, commit `e4f0805`, live)
The reorganised research page itself shipped as commit `6f8d0d5` (James: "yes i love it this is it"). He then
asked to showcase striking figures from the papers and his own animations.
- Reuse rights checked first (Crossref licence fields + bioRxiv API): Nature paper = open access, CC BY-NC-ND 4.0;
  Nature Neuroscience and Cell = NOT open access (no figures from them); all nine bioRxiv preprints = "no reuse"
  licence, copyright held by the authors.
- Added to `/research` (assets in `public/research/`, data in `FIGURES` in `src/data/research.ts`):
  1. `katlowitz-preprint-fig1.webp`: Figure 1 of the preprint of the Nature Human Behaviour paper, extracted
     from the locally saved bioRxiv PDF (`Downloads/2025.06.23.661103v2.full.pdf`, page 24), shown whole.
     Panel D is the syntactic-depth tree, i.e. James's linguistics. Credit: "(c) the authors".
  2. `nature-fig1.webp`: Figure 1 of the Nature paper from nature.com, shown whole and unaltered with the
     CC BY-NC-ND credit. Note it includes an intraoperative photo (panel a).
  3. `grammar-to-numbers.mp4` (+ poster): James's own manim explainer `SyntacticGCNIntro.mp4` (vault
     `QA_emb_CLIP_Minye/word_level/media/videos/syntactic_gcn_animation/1080p60/`), re-encoded 720p30, 0.9 MB,
     silent, plays on click. Method only, no recordings.
  Figures sit in a two-up grid under the papers list and open full size on click; the animation sits in
  "My own analysis".
- Not used: `ScaleDissociation.mp4` (states an interaction result the project notes say does not hold up
  out of sample). bioRxiv blocks automated downloads (Cloudflare 429), hence the local PDF.
- Browser-checked desktop + phone: images load, video plays, no overflow, no errors.
**James approved all three** (co-authored preprint figure, the surgery photo inside the Nature figure, the
explainer of an unpublished method): "go on all 3". Pushed; deploy succeeded; all four assets and the page
verified live.
**Open:** add the Nature Human Behaviour DOI + status when it goes live (10.1038/s41562-026-02543-z); per-paper
contribution lines for the other papers if James supplies them; EN/ES toggle.

## 2026-10-06 (evening) — Research page reorganised around what James did (LOCAL, uncommitted, not pushed)
James: the page was "disorganized", "to a normal researcher this sniffs very off", and should show industry
readers "solidly what I have done". What read wrong: lab-wide science written as "my research" with a
"Flagship" badge and a branded title; unpublished findings stated as settled; status notes ("figure validated");
a "forward-looking, not yet implemented" theme; long method-chip lists; a synthetic figure; no lab, role or
dates anywhere.
- `src/data/research.ts` rewritten: `ROLE`, `WORK` (Recording / Pipelines / Modelling, each a list of things he
  did with the fact-sheet numbers), `OWN_PROJECT` (the grammar-and-meaning analysis, labelled unpublished, with
  "What held up" and "What I threw out"), `OTHER_STUDIES` (music, bilingual: what he built, no findings claimed),
  `METHODS` (fact-sheet list only).
- `src/pages/research.astro` rewritten to match: role line with lab and dates -> What I did -> Papers it went
  into (the four journal papers from `publications.ts`, live statuses) -> My own analysis -> other studies ->
  methods. `ManifoldViz.astro` and `FigurePlaceholder.astro` deleted (unused; the former was the synthetic figure).
- Removed from the page: the "universal language manifold" theme, the Krumhansl-Kessler / 704-neuron music
  finding and the "decoders read gender and conjugation" result (not verified in the fact sheet or notes; the
  page now says what was built instead).
- Browser-checked desktop + phone: no overflow, no errors, home links resolve.
- **Linguistics block + paper contribution (James: his biggest contribution was the linguistics for Vigi
  Katlowitz's paper).** New first block in `WORK`: all linguistic features for the Nature Human Behaviour paper
  (356 hippocampal units, 10 participants; POS, dependency relations, syntactic depth, clause position, word
  frequency) and the embeddings (GPT-2, Llama-3, DeBERTa; GloVe, Word2Vec), plus his own 57-feature annotation.
  `PAPER_ROLES` in `research.ts` holds a per-paper contribution line; papers that have one sort first. Details
  checked against the proof (`Downloads/41562_2026_2543_Author.pdf`): "J.L.B. and T.I. contributed to this work
  equally"; J.L.B. conceptualized, performed the analysis, wrote. The proof's DOI (10.1038/s41562-026-02543-z)
  is not live yet; noted in `publications.ts`. Same facts added to the vault resume fact sheet.
- Projects page research cards: already rewritten in plain language by another session; left as they are.
**Needs James before pushing:** confirm the role statements are his to make as worded (solo spike sorter,
recruiting/enrolling, SOPs), the music and bilingual lines, and whether to name the Hayden Lab on the page.
Optional: one line per paper on what he contributed. The Projects page "Research engineering" cards still use
the older research-voice wording.

## 2026-10-06 (later) — Simulated spike raster with the real podcast words; publications refreshed
**Raster.** James asked for the lab's podcast raster in place of the made-up 1,008-square wall, then pulled back
from real data ("idk if the lab would be violating HIPAA or PHI") while keeping the stimulus ("the stimuli is
fine, but not the actual data"). Result, `SimRaster.astro` on the home page:
- WORDS = real: 100 words of the podcast with their true onsets, `src/data/podcast-words.json`, written by the
  vault script `QA_emb_CLIP_Minye/word_level/scripts/animate_population_raster.py --export-words`.
- SPIKES = simulated in the browser (seeded, same every load): 50 model neurons, 4-34 Hz busiest-on-top, 2 ms
  refractory, shared + private slow drift, bursts in a quarter of cells, brief responses to ~10% of words.
  Caption states plainly that the spikes are simulated and the words are real.
- Canvas, theme-aware, built and run only when scrolled near (62 ms one-off), still frame under reduced motion.
- A real-data version (re-coloured movie) was built first and then removed before anything was committed or
  pushed: no recording-derived file is in the repo or its history. `NeuronWall.astro` is deleted.
- The vault script keeps three harmless additions from that attempt: `--site`, `--mode`, `--export-words`.
  Two private renders remain in the vault (`figures/Figure_Dynamic_Raster_Site_{Light,Dark}.mp4`).

**Publications** (checked against Crossref + bioRxiv, 2026-10-06; James approved the update):
- Nature: now in an issue, 654, 714-723. Nature Neuroscience: published online 2026-09-30,
  doi 10.1038/s41593-026-02436-4, author list updated to the printed 19. Cell: published, 189(16), 5065-5080,
  doi 10.1016/j.cell.2026.05.020. Nature Human Behaviour: still in press (no DOI registered).
- "A geometric foundation for word meaning": DOI 10.64898/2026.01.28.702241 restored (now resolves to this title).
- "Mirror manifolds" retitled per its v3: "Hippocampus serves as a repository for spoken and heard word
  meanings during conversations".
- Home copy changed from "four in press" to three published + one in press. Vault `resume_facts.md` got a
  dated publication-status line so new resumes can say "published".
- Not shown on the site: a Publisher Correction to the Nature Neuroscience paper registered 2026-10-06
  (doi 10.1038/s41593-026-02501-y).

Browser-tested (desktop light, phone dark): raster runs, words advance, no media requests, no overflow, no
errors; publications page shows the new statuses and all DOIs resolve. Build note: `astro build` fails with
EPERM on Windows if an `astro preview` server is holding `dist/` open; stop the preview first.

## 2026-10-06 — SHIPPED (commit `0c9c9b1`, live on jamesbelanger.com)
James OK'd the unpublished finding numbers and chose to keep the "single, strikingly low-dimensional population
axis" sentence on /research ("that's what happened"). Everything in the four 2026-10-05 entries below was
committed as one commit, rebased onto two newer remote commits (hospital-quality Ask page + case-study fix; no
conflicts, new pages checked under the new styling), fast-forwarded to `main` and pushed. Deploy run succeeded;
live site verified (home, collage layers, audio, icons, OG image all 200).
**Open:** EN/ES toggle; README still describes .io + Vercel; James to keep ear-checking the name clips.

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
