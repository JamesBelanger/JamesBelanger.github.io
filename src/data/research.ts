// What James did in the lab, organised by the work itself rather than by "research theme".
// Every number here is on the verified fact sheet used for his resumes
// (vault: 03_Career_and_Admin/Layoff_2026/Applications/_tools/resume_facts.md) or in the
// project notes for the grammar/meaning analysis. Keep it that way: no result goes on this
// page unless it still stands, and unpublished work is labelled as unpublished.

export const ROLE = {
  title: 'Research Technician',
  lab: 'Hayden Lab, Department of Neurosurgery, Baylor College of Medicine',
  dates: 'May 2024 to September 2026',
};

export interface WorkArea {
  id: string;
  name: string;
  line: string;
  items: string[];
}

export const WORK: WorkArea[] = [
  {
    id: 'linguistics',
    name: 'Linguistics',
    line: 'The language side of the lab’s analyses.',
    items: [
      'Did all of the linguistics for the lab’s Nature Human Behaviour paper (356 hippocampal neurons, 10 patients): every word of the podcasts tagged for part of speech, dependency relations, syntactic depth, clause boundaries, position within the clause, and word frequency.',
      'Extracted the word embeddings those neurons were compared against, from five models: GPT-2, Llama-3 and DeBERTa for words in context, GloVe and Word2Vec for words on their own.',
      'Built a 57-feature linguistic annotation of every word for my own grammar-and-meaning analysis.',
    ],
  },
  {
    id: 'recording',
    name: 'Recording',
    line: 'Getting the data, at the hospital bedside.',
    items: [
      'Ran research recording sessions with epilepsy patients at two hospitals, Baylor St. Luke’s and Texas Children’s, working alongside neurosurgeons, epileptologists and nurses.',
      'Recruited and enrolled patients into studies, under IRB protocols and HIPAA.',
      'Traced noisy electrode bundles to an electrical fault rather than their location in the brain, and showed which part of the noise re-referencing could and could not remove.',
      'Wrote the lab’s standard operating procedures for data handling and electrode reconstruction, and trained lab staff on them.',
    ],
  },
  {
    id: 'pipelines',
    name: 'Pipelines',
    line: 'Turning raw recordings into data people can analyse.',
    items: [
      'Spike sorting and quality control, built solo: 98% agreement with expert curation, with manual review cut from 28% of the data to 5%. Adopted lab-wide and run daily by other staff.',
      'Electrode localization: 203 contacts on 19 leads localized within 0.16 mm of the hand-validated result with no manual steps. The lab’s ten-step reconstruction procedure now runs end to end, with a person approving the result before anything is uploaded.',
      'Speech transcription and word-level alignment for patient recordings, run locally so the audio never left the site.',
      'Automatic redaction of patient identifiers from clinical log files.',
    ],
  },
  {
    id: 'modelling',
    name: 'Modelling',
    line: 'Asking what each neuron was tracking.',
    items: [
      'Poisson and logistic regression models of single-neuron firing, checked with cross-validation, permutation tests, bootstrap confidence intervals and confound-matched controls.',
      'Datasets of 435 neurons in the main analysis and 1,008 pooled across 14 patients.',
      'Embeddings from 26 language models, extracted on a GPU cluster as a job array that finishes in about two minutes.',
    ],
  },
];

// What James did on a given paper, keyed by its title in publications.ts. Only add a line he has
// stated himself; the Nature Human Behaviour one also matches that paper's contribution statement
// ("J.L.B. and T.I. contributed equally"; J.L.B. conceptualized, performed the analysis, wrote).
export const PAPER_ROLES: Record<string, string> = {
  'Attention is all you need (in the brain): Semantic contextualization in human hippocampus':
    'Equal-contribution second author. I did the linguistics and the language-model embeddings, and helped design the analysis, run it and write the paper. It shows that hippocampal neurons track where a word sits in its clause, and that their response to a word carries a weighted mix of the words before it, weighted much as a language model’s attention would.',
};

// James's own analysis project. Unpublished: label it, and keep the retractions visible.
export const OWN_PROJECT = {
  id: 'grammar-and-meaning',
  title: 'Grammar and meaning in single neurons',
  status: 'Unpublished. Manuscript in preparation, so the numbers may change.',
  question:
    'When someone hears a sentence, do neurons in the hippocampus track its grammar, its meaning, or both? And do language models split the two the same way the brain does?',
  held: [
    'Grammar was the stronger signal in the hippocampus and the anterior cingulate, but not in orbitofrontal cortex. The pattern was the same for people listening to a podcast and for live conversation (14 patients, 81,370 words).',
    'Grammar and meaning are carried by overlapping groups of neurons, along directions that are partly separate, and both load mostly on a single shared axis of population activity.',
    'Across 26 language models, from 0.1 to 32.6 billion parameters, the grammatical part of a model predicted the neurons better than its semantic part in 23 of the 26. Bigger models did no better than small ones.',
  ],
  dropped: [
    'A large grammar-over-meaning effect at the level of whole sentences. It was sentence length, not grammar, and it vanished once length was fully controlled.',
    'A trend for bigger language models to match the brain better. It held across 10 models and disappeared with 26.',
    'A finding that models keep grammar in shallower layers than meaning. It reversed on the larger set of models.',
  ],
};

export const OTHER_STUDIES = [
  {
    name: 'Music',
    text: 'Poisson regression with nested likelihood-ratio tests for a piano-listening study, including pitch encoding and correction for clock drift between recording systems.',
  },
  {
    name: 'Bilingual listening',
    text: 'Decoders for grammatical gender and verb conjugation in recordings from people listening to Spanish.',
  },
];

export const METHODS = [
  'Poisson and logistic GLMs',
  'Cross-validation',
  'Permutation tests',
  'Bootstrap confidence intervals',
  'Confound-matched controls',
  'PCA / CCA',
  'UMAP',
  'Python',
  'MATLAB',
  'R',
  'PyTorch',
  'scikit-learn',
  'Hugging Face',
  'SLURM GPU clusters',
];
