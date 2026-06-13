export interface Publication {
  type: 'journal' | 'preprint';
  year: number;
  venue: string;
  title: string;
  authors: string; // "Belanger" is automatically bolded in the rendered list
  status: string; // honest label shown as a badge
  doi?: string;
  url?: string;
}

// Source of truth: 03_Career_and_Admin/PhD_Applications/00_Master/Publications.md (APA 7th).
// ⚠️ VERIFY every author list, venue, and DOI against the published record before this site is public —
//    publicly claimed Nature-tier co-authorship is a hard, checkable claim.
export const PUBLICATIONS: Publication[] = [
  {
    type: 'journal',
    year: 2026,
    venue: 'Nature',
    title: 'Plasticity and language in the anaesthetized human hippocampus',
    authors:
      'Katlowitz, K. A., Cole, E. R., Mickiewicz, E. A., Shah, S., Franch, M. C., Adkinson, J., Belanger, J. L., Mathura, R. K., Meszéna, D., McGinley, M., Muñoz, W., Banks, G. P., Cash, S. S., Hsu, C.-W., Paulk, A. C., Provenza, N. R., Watrous, A., Williams, Z., … Hayden, B. Y., & Sheth, S. A.',
    status: 'Advance online publication',
    doi: '10.1038/s41586-026-10448-0',
  },
  {
    type: 'journal',
    year: 2026,
    venue: 'Nature Human Behaviour',
    title: 'Attention is all you need (in the brain): Semantic contextualization in human hippocampus',
    authors:
      'Katlowitz, K. A., Belanger, J. L., Ismail, T., Chavez, A. G., Chericoni, A., Franch, M. C., Mickiewicz, E. A., Mathura, R. K., Paulo, D., Bartoli, E., Piantadosi, S. T., Provenza, N. R., Watrous, A. J., Sheth, S. A., & Hayden, B. Y.',
    status: 'In press',
  },
  {
    type: 'journal',
    year: 2026,
    venue: 'Nature Neuroscience',
    title: 'A population code for semantics in human hippocampus',
    authors:
      'Franch, M. C., Mickiewicz, E. A., Belanger, J., Joiner, B., Katlowitz, K. A., Zhu, H., Chavez, A. G., Chericoni, A., Paulo, D., Bartoli, E., Kemmer, S., Piantadosi, S. T., Provenza, N. R., Hennig, J. A., Sheth, S. A., & Hayden, B. Y.',
    status: 'In press',
  },
  {
    type: 'journal',
    year: 2026,
    venue: 'Cell',
    title: 'Shared neural geometries for bilingual semantic representations in human hippocampal neurons',
    authors:
      'Yan, X., Chavez, A. G., Franch, M. C., Katlowitz, K. A., Gautam, I., Kim, B., Krishna, A., Shrivastava, A., Van Arsdel, K., Belanger, J., Chericoni, A., Ismail, T., Mickiewicz, E. A., Paulo, D., Zhu, H., … Hayden, B. Y., & Sheth, S. A.',
    status: 'In press',
  },
  {
    type: 'preprint',
    year: 2026,
    venue: 'bioRxiv',
    title: 'A geometric foundation for word meaning in the brain',
    authors:
      'Zhu, H., Franch, M., Mickiewicz, E., Belanger, J., Cowan, R. L., Katlowitz, K., Chavez, A. G. L., Chericoni, A., Paulo, D., Yan, X., Bartoli, E., Hennig, J., Provenza, N., Smith, E. H., Piantadosi, S., Sheth, S., & Hayden, B. Y.',
    status: 'Preprint',
    doi: '10.64898/2026.01.28.702241',
  },
  {
    type: 'preprint',
    year: 2025,
    venue: 'bioRxiv',
    title: 'Mirror manifolds: Partially overlapping neural subspaces for speaking and listening',
    authors: 'Chavez, A. G., Franch, M., Mickiewicz, E. A., Baltazar, W., Belanger, J. L., Devara, D., … Hayden, B. Y.',
    status: 'Preprint',
  },
  {
    type: 'preprint',
    year: 2026,
    venue: 'bioRxiv',
    title: 'Neural signatures of impaired semantic contextualization in Autism Spectrum Disorder',
    authors: 'Franch, M., Katlowitz, K. A., Mickiewicz, E. A., Belanger, J. L., Mathura, R. K., Zhu, H., … Hayden, B. Y.',
    status: 'Preprint',
  },
  {
    type: 'preprint',
    year: 2026,
    venue: 'bioRxiv',
    title: 'Polysemanticity in human hippocampal neurons',
    authors: 'Yan, X., Li, J. A., Franch, M., Zhu, H., Cowan, R. L., Belanger, J., … Sheth, S.',
    status: 'Preprint',
  },
  {
    type: 'preprint',
    year: 2025,
    venue: 'bioRxiv',
    title: 'A semantotopic map in human hippocampus',
    authors: 'Mickiewicz, E. A., Franch, M., Katlowitz, K. A., Chavez, A. G., Zhu, H., Chericoni, A., Belanger, J. L., … Hayden, B. Y.',
    status: 'Preprint',
    doi: '10.1101/2025.10.31.685959',
  },
];
