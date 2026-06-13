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
  {
    date: '2026',
    text: 'Preparing PhD applications (computational neuroscience / CISE track) for the upcoming cycle.',
  },
];
