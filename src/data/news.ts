export interface NewsItem {
  date: string; // ISO YYYY-MM or YYYY-MM-DD
  text: string;
  href?: string;
}

// Seed entries — keep this fresh (even a few dated items a year signals an active, maintained site).
// TODO: replace with real dates/links as papers post and applications progress.
export const NEWS: NewsItem[] = [
  {
    date: '2026',
    text: 'Pronunciation Coach is live: pronunciation scoring that runs entirely in the browser, with a Whisper vs Qwen3-ASR benchmark note.',
    href: '/projects/pronunciation/',
  },
  {
    date: '2026',
    text: 'Identity Resolution Lab is live: messy customer records matched in the browser, with precision and recall measured against ground truth.',
    href: '/projects/identity-resolution/',
  },
  {
    date: '2026',
    text: 'Hospital Quality Explorer is live: 5,419 U.S. hospitals, report cards, and an in-browser SQL console.',
    href: '/projects/hospital-quality/explore/',
  },
  {
    date: '2026',
    text: 'Co-authored work on a population code for semantics in human hippocampus appears in Nature Neuroscience.',
    href: '/publications',
  },
  {
    date: '2026',
    text: '“Attention is all you need (in the brain)” — semantic contextualization in human hippocampus — in press at Nature Human Behaviour.',
    href: '/publications',
  },
  {
    date: '2026',
    text: 'Bilingual semantic geometries in human hippocampal neurons published in Cell.',
    href: '/publications',
  },
  {
    date: '2026',
    text: 'Plasticity and language in the anaesthetized human hippocampus published in Nature.',
    href: '/publications',
  },
  {
    date: '2026',
    text: 'New bioRxiv preprints on polysemanticity in hippocampal neurons and semantic contextualization in autism.',
    href: '/publications',
  },
];
