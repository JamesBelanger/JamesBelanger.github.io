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
// technical method chips below. Swap each figure placeholder for a real export.
export const RESEARCH: ResearchTheme[] = [
  {
    id: 'language-manifold',
    title: 'The Language Manifold: how the hippocampus encodes syntax and semantics',
    flagship: true,
    status: 'Manuscript in preparation',
    summary:
      'In recordings from human hippocampus, syntactic and semantic information are not spread across separate, distributed populations — they are written into semi-orthogonal subspaces along a single, strikingly low-dimensional population axis. The brain’s solution is more compressed than the internal geometry of any state-of-the-art language model I compared it against. This is the core of my research: characterizing that geometry and asking what it teaches us about efficient computation.',
    methods: [
      'Poisson GLM (spike counts)',
      'Cross-validated GPU ridge (PyTorch)',
      '57-feature / 9-layer linguistic extraction',
      'GCN syntactic embedding (adversarially purified)',
      'SBERT semantic embedding',
      'Representational Similarity Analysis',
      'Principal-angle / semi-orthogonality',
      'Participation ratio & manifold capacity',
      'Benchmark vs. 10 open-weight LLMs',
    ],
    figure: {
      caption:
        'Figure: semi-orthogonal syntactic and semantic subspaces along a shared low-dimensional hippocampal population axis.',
      alt: 'Schematic of two semi-orthogonal subspaces embedded along a shared low-dimensional neural population axis.',
    },
    links: [{ label: 'Related preprint: A geometric foundation for word meaning', href: '/publications' }],
  },
  {
    id: 'llm-brain-alignment',
    title: 'Aligning language models to the brain (QA-Emb)',
    status: 'Multiple analyses complete; LLM-vs-brain figure validated',
    summary:
      'I built a question-answer embedding framework (QA-Emb) that interrogates the hidden states of large language models and aligns them against hippocampal population geometry. Across ten models, syntax is read out from shallower layers than semantics — a depth gap that survives length-controlled, grain-matched comparison in 9 of 10 models.',
    methods: [
      'QA-Emb (text & video)',
      'Layer-wise transformer extraction',
      'RDM / RSA',
      'Procrustes alignment',
      'Length-controlled partial-R² brain-score',
      'Wavelet null models',
    ],
    figure: {
      caption: 'Figure: layer-wise LLM-to-brain alignment — the syntax-before-semantics depth gap.',
      alt: 'Layer-wise alignment curves showing syntactic information peaking at shallower layers than semantic information.',
    },
  },
  {
    id: 'population-geometry',
    title: 'Poisson encoding across domains: music and grammar',
    status: 'Active',
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
  {
    id: 'universal-manifold',
    title: 'Toward a universal language manifold (forward-looking)',
    status: 'Designed & documented — not yet implemented',
    summary:
      'A research direction I have designed and specified: a sequence-to-sequence transformer that learns a language-agnostic semantic manifold directly from neural data, by forcing an encoder to translate hippocampal spike patterns across English, Spanish, and Hebrew renderings of the same narrative. It is the architectural payoff of the geometry work — treating the brain’s code as a prior for machines.',
    methods: [
      'Seq2seq transformer (POYO-style unit tokenization)',
      'Perceiver cross-attention bottleneck',
      'InfoNCE contrastive cross-lingual loss',
      'Language-adversarial gradient reversal',
      'Poisson reconstruction loss',
    ],
    figure: {
      caption: 'Figure: conceptual schematic of the trilingual brain-to-manifold encoder bottleneck.',
      alt: 'Schematic of a multilingual encoder-decoder compressing neural data into a shared latent manifold.',
    },
  },
];
