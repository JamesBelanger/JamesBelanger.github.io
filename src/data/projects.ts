export interface Project {
  name: string;
  category: 'Research engineering' | 'Product / full-stack';
  blurb: string;
  stack: string[];
  links?: { label: string; href: string }[];
}

export const PROJECTS: Project[] = [
  {
    name: 'Hippocampal linguistic encoding pipeline',
    category: 'Research engineering',
    blurb:
      'End-to-end, reproducible pipeline mapping language onto single-neuron activity: 57-feature / 9-layer linguistic extraction → adversarially purified GCN + SBERT embeddings → cross-validated Poisson / ridge encoding with confound controls. Scales to 435 neurons across 7,346 word-level timepoints.',
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
      'Poisson GLM suite with nested likelihood-ratio tests, circular pitch encoding, MFCC spectral PCs, and multi-system clock-drift compensation — plus a UMAP-based spike-sorting quality-triage tool for waveform clustering diagnostics.',
    stack: ['MATLAB', 'Python', 'librosa', 'UMAP'],
  },
  {
    name: 'Houston Eats',
    category: 'Product / full-stack',
    blurb:
      'An interactive web map for discovering Houston restaurants scraped from Instagram, with location filtering, marker clustering, and a CSV→geocode→JSON data pipeline. A shipped, full-stack app — concrete evidence of production engineering.',
    stack: ['React 19', 'Vite', 'Leaflet', 'Supabase', 'Tailwind CSS'],
    links: [{ label: 'GitHub', href: 'https://github.com/JamesBelanger/houston-eats' }],
  },
  {
    name: 'Graduation Name Pronouncer',
    category: 'Product / full-stack',
    blurb:
      'A B2B concept for accurate pronunciation of names (especially non-English) at graduation ceremonies. Dual-mode: model-generated pronunciation via multilingual grapheme-to-phoneme + a curated lexicon (the competitive wedge), plus self-recording capture. IPA as source of truth; all voice data self-hosted (FERPA-compliant).',
    stack: ['Python', 'Flask', 'espeak-ng', 'Piper / Kokoro TTS', 'scikit-learn'],
  },
];
