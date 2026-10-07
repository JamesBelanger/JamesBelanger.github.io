export interface NewsItem {
  date: string; // ISO YYYY-MM (shown as "Oct 2026")
  text: string;
  href?: string;
}

// Newest first. Dates are real: paper dates from Crossref / bioRxiv (checked 2026-10-06), project dates from
// the day each went live on this site. Add an item when something ships or a paper changes status.
export const NEWS: NewsItem[] = [
  {
    date: '2026-10',
    text: 'Ask the Hospital Data is live: ask a question about U.S. hospital quality in plain English and see the SQL or the quoted source behind the answer.',
    href: '/projects/hospital-quality/ask/',
  },
  {
    date: '2026-09',
    text: '“A population code for semantics in human hippocampus” is published in Nature Neuroscience.',
    href: 'https://doi.org/10.1038/s41593-026-02436-4',
  },
  {
    date: '2026-09',
    text: 'Identity Resolution Lab is live: messy customer records matched in the browser, with precision and recall measured against ground truth.',
    href: '/projects/identity-resolution/',
  },
  {
    date: '2026-09',
    text: 'Pronunciation Coach is live: pronunciation scoring that runs entirely in the browser, with a Whisper vs Qwen3-ASR benchmark note.',
    href: '/projects/pronunciation/',
  },
  {
    date: '2026-08',
    text: 'Hospital Quality Explorer is live: 5,419 U.S. hospitals, report cards, and an in-browser SQL console.',
    href: '/projects/hospital-quality/explore/',
  },
  {
    date: '2026-08',
    text: '“Shared neural geometries for bilingual semantic representations in human hippocampal neurons” is published in Cell.',
    href: 'https://doi.org/10.1016/j.cell.2026.05.020',
  },
  {
    date: '2026-08',
    text: '“Attention is all you need (in the brain)”, on how hippocampal neurons put words in context, is in press at Nature Human Behaviour. I am an equal-contribution second author.',
    href: '/research',
  },
  {
    date: '2026-08',
    text: 'Autonomous Research Engine case study: a multi-agent system where every verdict has to survive two agents trying to refute it.',
    href: '/projects/research-engine',
  },
  {
    date: '2026-05',
    text: '“Plasticity and language in the anaesthetized human hippocampus” is published in Nature.',
    href: 'https://doi.org/10.1038/s41586-026-10448-0',
  },
  {
    date: '2026-05',
    text: 'New preprint: polysemanticity in human hippocampal neurons.',
    href: 'https://doi.org/10.64898/2026.05.02.722435',
  },
  {
    date: '2026-03',
    text: 'New preprint: neural signatures of impaired semantic contextualization in autism.',
    href: 'https://doi.org/10.64898/2026.03.16.712048',
  },
  {
    date: '2026-01',
    text: 'New preprint: a geometric foundation for word meaning in the brain.',
    href: 'https://doi.org/10.64898/2026.01.28.702241',
  },
];
