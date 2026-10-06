export interface ResearchTheme {
  id: string;
  title: string;
  flagship?: boolean;
  status?: string;
  summary: string;
  methods: string[];
  figure: { caption: string; alt: string };
  links?: { label: string; href: string }[];
}

// Grounded in the vault's project inventory. Plain-language summaries up top,
// technical method chips below. Only the flagship theme renders a figure (research.astro).
export const RESEARCH: ResearchTheme[] = [
  {
    id: 'language-manifold',
    title: 'The Language Manifold: how the hippocampus encodes syntax and semantics',
    flagship: true,
    status: 'Manuscript in preparation',
    summary:
      'In recordings from human hippocampus, syntactic and semantic information are not spread across separate, distributed populations — they are written into semi-orthogonal subspaces along a single, strikingly low-dimensional population axis. Grammar is the stronger signal: in the hippocampus and anterior cingulate, syntactic features predict firing better than semantic ones, in both podcast listening and live conversation. This is the core of my research: characterizing that geometry and asking what it teaches us about efficient computation.',
    methods: [
      'Poisson GLM (spike counts)',
      'Cross-validated GPU ridge (PyTorch)',
      '57-feature / 9-layer linguistic extraction',
      'GCN syntactic embedding (adversarially purified)',
      'SBERT semantic embedding',
      'Representational Similarity Analysis',
      'Principal-angle / semi-orthogonality',
      'Participation ratio & manifold capacity',
      'Benchmark vs. 26 open-weight LLMs',
    ],
    figure: {
      caption:
        'Illustration, not data: semi-orthogonal syntactic and semantic subspaces along a shared low-dimensional hippocampal population axis.',
      alt: 'Schematic of two semi-orthogonal subspaces embedded along a shared low-dimensional neural population axis.',
    },
    links: [{ label: 'Related preprint: A geometric foundation for word meaning', href: '/publications' }],
  },
  {
    id: 'llm-brain-alignment',
    title: 'Aligning language models to the brain (QA-Emb)',
    status: 'Multiple analyses complete; LLM-vs-brain figure validated',
    summary:
      'I built a question-answer embedding framework (QA-Emb) that interrogates the hidden states of large language models and aligns them against hippocampal population geometry. Across 26 models, from 0.1 to 32.6 billion parameters, both the syntactic and the semantic components of every model predict hippocampal activity above chance, and the syntactic component predicts it better in 23 of the 26. Bigger models are not more brain-like: alignment does not grow with parameter count.',
    methods: [
      'QA-Emb (text & video)',
      'Layer-wise transformer extraction',
      'RDM / RSA',
      'Procrustes alignment',
      'Length-controlled partial-R² brain-score',
      'Wavelet null models',
    ],
    figure: {
      caption: 'Figure: layer-wise LLM-to-brain alignment across 26 models.',
      alt: 'Layer-wise alignment curves for syntactic and semantic components across 26 language models.',
    },
  },
  {
    id: 'population-geometry',
    title: 'Poisson encoding across domains: music and grammar',
    summary:
      'The same population-geometry toolkit generalizes beyond English narrative. In a piano-listening task I characterized 704 hippocampal neurons and found that the Krumhansl–Kessler tonal hierarchy — not the Circle of Fifths — best predicts their geometry, while dissociating absolute from relative pitch. In bilingual listeners, SVM decoders read grammatical gender and conjugation from Spanish-evoked activity.',
    methods: [
      'Poisson GLM + nested likelihood-ratio tests',
      'Circular pitch encoding (sin/cos)',
      'Confound-controlled regression',
      'Functional RSA (Krumhansl–Kessler)',
      'MDS population geometry',
      'SVM decoding (linear & RBF)',
    ],
    figure: {
      caption: 'Figure: hippocampal tuning to tonal function across 704 neurons (Krumhansl–Kessler model).',
      alt: 'Population geometry plot of hippocampal neural tuning to musical tonal hierarchy.',
    },
  },
];
