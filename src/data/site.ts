// Central site configuration. Edit the TODO fields before going live.
export const SITE = {
  name: 'James Belanger',
  // Browser tab / default <title>
  title: 'James Belanger — Computational Neuroscientist',
  // Current title — confirmed by James (2026-06).
  role: 'Research Technician',
  tagline:
    'Computational neuroscientist studying the geometry of language in single-neuron and LFP recordings of the human brain.',
  shortBio:
    'I study how the human brain represents language. My work measures the geometry of syntax and semantics in single-neuron population codes and asks a question that bridges neuroscience and AI: can the brain’s compressed, low-dimensional language code serve as a design principle for more efficient, compositional machine-learning models?',
  arc:
    'My path was deliberate: a B.A. in Cognitive Sciences (Psychology and Linguistics) with a Data Science minor at Rice gave me the formal structure of language; a research position in the Hayden Lab at Baylor College of Medicine turned that into quantitative, code-driven neuroscience — building real Poisson encoding and LLM-alignment pipelines on human intracranial data.',
  url: 'https://jamesbelanger.io',
  email: 'jamesluibelanger@gmail.com',
  affiliation: 'Hayden Lab, Baylor College of Medicine',
  affiliationShort: 'Baylor College of Medicine',
  location: 'Houston, TX',
  // og:image used for link previews. TODO: add a headshot or clean figure at /public/og-image.png (1200x630)
  ogImage: '/og-image.png',
  links: {
    scholar: 'https://scholar.google.com/citations?user=8RCoKNUAAAAJ',
    orcid: 'https://orcid.org/0009-0003-3269-8810',
    github: 'https://github.com/JamesBelanger',
    linkedin: 'https://www.linkedin.com/in/jamesluibelanger',
    cv: '/cv/Belanger_CV_2026-06.pdf',
  },
};

export const NAV = [
  { href: '/', label: 'About' },
  { href: '/research', label: 'Research' },
  { href: '/publications', label: 'Publications' },
  { href: '/projects', label: 'Projects' },
  { href: '/cv', label: 'CV' },
  { href: '/news', label: 'News' },
  { href: '/contact', label: 'Contact' },
];
