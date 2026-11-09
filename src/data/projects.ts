export interface Project {
  name: string;
  // 'Research engineering' renders as "Lab work"; 'Product / full-stack' as "Personal projects" (projects.astro).
  category: 'Research engineering' | 'Product / full-stack';
  blurb: string;
  stack: string[];
  links?: { label: string; href: string }[];
}

// Plain descriptions only (2026-11-08 review): every number is on the resume fact sheet, agent-built work
// says so, and nothing is listed that isn't real work. Cut on 11-08: QA-Emb toolkit, Autonomous Research
// Engine, Graduation Name Pronouncer, Identity Resolution Lab.
export const PROJECTS: Project[] = [
  {
    name: 'Hospital Quality Explorer',
    category: 'Product / full-stack',
    blurb:
      'Look up any of 5,419 U.S. hospitals and compare it with similar hospitals on the federal quality measures, using public CMS data (799K rows) loaded into Postgres, with the comparisons computed in SQL. Version 2 added a question-answering demo (now offline) that answered with its SQL or a quoted CMS document, or declined. It was tested on 26 questions written after the configuration was frozen and got 22 right. Designed and directed by me; implemented with AI coding agents (Claude Code).',
    stack: ['PostgreSQL (Supabase)', 'SQL', 'Python', 'D3', 'DuckDB-WASM', 'FastAPI', 'Azure', 'pgvector'],
    links: [
      { label: 'Explorer', href: '/projects/hospital-quality/explore/' },
      { label: 'Ask the data (offline)', href: '/projects/hospital-quality/ask/' },
      { label: 'Case study', href: '/projects/hospital-quality' },
      { label: 'Houston dashboard', href: '/hospital-quality-dashboard.html' },
      { label: 'GitHub', href: 'https://github.com/JamesBelanger/hospital-quality-dashboard' },
    ],
  },
  {
    name: 'Pronunciation Coach (in-browser)',
    category: 'Product / full-stack',
    blurb:
      'Pronunciation feedback that runs entirely in the browser, so the audio never leaves the device. A pretrained wav2vec2 phoneme model, quantized from 380 MB to 123 MB, runs with ONNX in WebAssembly; forced alignment then scores each sound. The JavaScript scoring is checked against the Python reference with a parity test. A companion note benchmarks Whisper against Qwen3-ASR on faint conversational speech.',
    stack: ['wav2vec2', 'ONNX Runtime Web', 'Forced alignment', 'JavaScript', 'Python'],
    links: [
      { label: 'Live demo', href: '/projects/pronunciation/' },
      { label: 'ASR benchmark note', href: '/notes/whisper-vs-qwen3-asr/' },
      { label: 'GitHub', href: 'https://github.com/JamesBelanger/pronunciation-scoring' },
    ],
  },
  {
    name: 'Houston Eats',
    category: 'Product / full-stack',
    blurb:
      'An interactive map of Houston restaurants with location filtering and marker clustering, fed by a CSV → geocode → JSON pipeline. A personal project.',
    stack: ['React', 'Vite', 'Leaflet', 'Supabase', 'Tailwind CSS'],
    links: [{ label: 'Live demo', href: 'https://houston-eats.vercel.app' }],
  },
  {
    name: 'Spike-sorting quality control',
    category: 'Research engineering',
    blurb:
      'The pipeline that sorted the lab’s single-neuron recordings and checked the quality of each sorted unit, which I built on my own. It agreed with expert curation 98% of the time and cut manual review from 28% of the data to 5%. The lab adopted it as its standard, and other staff ran it daily. No demo, because the recordings are patient data.',
    stack: ['Python', 'MATLAB', 'UMAP'],
  },
  {
    name: 'Word-level language features for neural data',
    category: 'Research engineering',
    blurb:
      'Turns a transcript into word-by-word features for grammar (part of speech and syntactic structure, including a graph neural network over the parse) and for meaning (sentence-transformer embeddings), then tests with cross-validated Poisson regression which features predict the firing of individual neurons. Used on 435 hippocampal neurons and a 7,346-word podcast, and to compare 26 language models with the brain.',
    stack: ['Python', 'PyTorch', 'scikit-learn', 'Hugging Face'],
  },
];
