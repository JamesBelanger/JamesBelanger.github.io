export interface Project {
  name: string;
  category: 'Research engineering' | 'Product / full-stack';
  blurb: string;
  stack: string[];
  links?: { label: string; href: string }[];
}

export const PROJECTS: Project[] = [
  {
    name: 'Hospital Quality Explorer',
    category: 'Product / full-stack',
    blurb:
      'Look up any of 5,419 U.S. hospitals and see how it compares with its peers on the federal quality measures. Built on public CMS Care Compare data (799k rows across six datasets) in a Postgres star schema, with the benchmarks computed in SQL instead of loaded from benchmark tables. The interactive explorer lets you define a peer group and get a report card, linked comparisons, a map, weighted rankings, and an in-browser SQL console (DuckDB-WASM) over the same tables. Version 2 adds a live question-answering demo: plain-English questions are answered with model-written SQL (validated, run under a read-only login) or quoted CMS documentation, or declined, and the case study covers how it was evaluated and what broke.',
    stack: ['PostgreSQL (Supabase)', 'SQL', 'Python ETL', 'D3', 'DuckDB-WASM', 'Tableau Public', 'FastAPI', 'Azure Container Apps', 'pgvector'],
    links: [
      { label: 'Ask the data (live)', href: '/projects/hospital-quality/ask/' },
      { label: 'Explorer', href: '/projects/hospital-quality/explore/' },
      { label: 'Case study', href: '/projects/hospital-quality' },
      { label: 'Houston dashboard', href: '/hospital-quality-dashboard.html' },
      { label: 'GitHub', href: 'https://github.com/JamesBelanger/hospital-quality-dashboard' },
    ],
  },
  {
    name: 'Identity Resolution Lab',
    category: 'Product / full-stack',
    blurb:
      '769 synthetic messy customer records from four source systems, matched and merged into one record per customer, live in the browser. Every match shows which rule fired, and precision and recall are measured against known ground truth and update as you drag the match threshold. At the default threshold it finds 451 customers against a ground truth of 450. Under the hood: normalization, blocking, fuzzy matching (nickname-aware Jaro-Winkler, weighted field scores), union-find clustering, and survivorship.',
    stack: ['Entity resolution', 'Data quality', 'Vanilla JS', 'Python data generator'],
    links: [
      { label: 'Live demo', href: '/projects/identity-resolution/' },
      { label: 'GitHub', href: 'https://github.com/JamesBelanger/identity-resolution' },
    ],
  },
  {
    name: 'Pronunciation Coach (in-browser)',
    category: 'Product / full-stack',
    blurb:
      'The core feedback loop of a pronunciation-learning app, running entirely in the browser: a wav2vec2 phoneme model (ONNX/WebAssembly), Viterbi forced alignment, and per-phoneme goodness-of-pronunciation scoring — no server, audio never leaves the device. Python reference implementation and ONNX export in the open repo; companion write-up benchmarks Whisper vs Qwen3-ASR on faint conversational speech.',
    stack: ['wav2vec2', 'ONNX Runtime Web', 'Forced alignment (Viterbi)', 'GOP scoring', 'Vanilla JS'],
    links: [
      { label: 'Live demo', href: '/projects/pronunciation/' },
      { label: 'ASR benchmark note', href: '/notes/whisper-vs-qwen3-asr/' },
      { label: 'GitHub', href: 'https://github.com/JamesBelanger/pronunciation-scoring' },
    ],
  },
  {
    name: 'Autonomous Research Engine',
    category: 'Research engineering',
    blurb:
      'An unattended multi-agent LLM system that harvests literature claims, investigates them, and subjects every verdict to adversarial refutation — two refuter agents with different attack lenses; majority refutation kills; unfalsifiable claims are parked, not answered. Headless Claude Code + Task Scheduler + a plain-markdown ledger; no servers, no database.',
    stack: ['Claude Code (headless)', 'Multi-agent orchestration', 'PowerShell', 'Markdown ledger'],
    links: [
      { label: 'Case study', href: '/projects/research-engine' },
      { label: 'GitHub', href: 'https://github.com/JamesBelanger/research-engine' },
    ],
  },
  {
    name: 'Hippocampal linguistic encoding pipeline',
    category: 'Research engineering',
    blurb:
      'Turns a transcript into word-by-word language features (grammar and meaning) and tests which of them predict the firing of individual human neurons. Reproducible end to end: 57-feature / 9-layer linguistic extraction → adversarially purified GCN + SBERT embeddings → cross-validated Poisson / ridge regression with confound controls. Scales to 435 neurons across 7,346 word-level timepoints.',
    stack: ['Python', 'PyTorch', 'scikit-learn', 'spaCy', 'NLTK', 'HuggingFace'],
  },
  {
    name: 'QA-Emb — LLM interrogation & brain alignment toolkit',
    category: 'Research engineering',
    blurb:
      'A question-answer embedding framework that extracts interpretable structure from LLM hidden states and aligns it to neural population geometry via RDM/RSA and Procrustes, with length-controlled brain-score and wavelet null models.',
    stack: ['Python', 'transformers', 'sentence-transformers', 'NumPy/SciPy'],
  },
  {
    name: 'Music GLM & spike-sorting tooling',
    category: 'Research engineering',
    blurb:
      'Statistical models that test which features of music (pitch, timbre) individual neurons respond to, plus a tool that speeds up quality review of sorted recordings. Under the hood: a Poisson GLM suite with nested likelihood-ratio tests, circular pitch encoding, MFCC spectral PCs, and multi-system clock-drift compensation, and a UMAP-based spike-sorting quality-triage tool.',
    stack: ['MATLAB', 'Python', 'librosa', 'UMAP'],
  },
  {
    name: 'Houston Eats',
    category: 'Product / full-stack',
    blurb:
      'An interactive web map for discovering Houston restaurants, with location filtering, marker clustering, and a CSV→geocode→JSON data pipeline. A personal project.',
    stack: ['React 19', 'Vite', 'Leaflet', 'Supabase', 'Tailwind CSS'],
    links: [{ label: 'GitHub', href: 'https://github.com/JamesBelanger/houston-eats' }],
  },
  {
    name: 'Graduation Name Pronouncer',
    category: 'Product / full-stack',
    blurb:
      'A prototype for getting names right at graduation ceremonies, especially non-English names. It generates a pronunciation with multilingual grapheme-to-phoneme models and a curated lexicon, and lets students record their own. IPA is the source of truth, and voice data stays self-hosted.',
    stack: ['Python', 'Flask', 'espeak-ng', 'Piper / Kokoro TTS', 'scikit-learn'],
  },
];
