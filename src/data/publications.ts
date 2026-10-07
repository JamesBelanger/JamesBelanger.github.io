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
// Statuses, DOIs and the Nature Neuroscience author list re-checked against Crossref + bioRxiv on 2026-10-06.
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
    status: 'Published · 654, 714–723',
    doi: '10.1038/s41586-026-10448-0',
  },
  {
    type: 'journal',
    year: 2026,
    venue: 'Nature Human Behaviour',
    // DOI assigned in proofs: 10.1038/s41562-026-02543-z. Not live as of 2026-10-06; add `doi` and update
    // `status` once it resolves.
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
      'Franch, M., Mickiewicz, E. A., Belanger, J. L., Joiner, B., Katlowitz, K. A., Zhu, H., Chavez, A. G., Chericoni, A., Goldman, A. M., Krishnan, V., Maheshwari, A., Paulo, D. L., Bartoli, E., Kemmer, S., Piantadosi, S. T., Provenza, N. R., Hennig, J. A., Sheth, S. A., & Hayden, B. Y.',
    status: 'Published online 30 Sep 2026',
    doi: '10.1038/s41593-026-02436-4',
  },
  {
    type: 'journal',
    year: 2026,
    venue: 'Cell',
    title: 'Shared neural geometries for bilingual semantic representations in human hippocampal neurons',
    authors:
      'Yan, X., Chavez, A. G., Franch, M. C., Katlowitz, K. A., Gautam, I., Kim, B., Krishna, A., Shrivastava, A., Van Arsdel, K., Belanger, J., Chericoni, A., Ismail, T., Mickiewicz, E. A., Paulo, D., Zhu, H., … Hayden, B. Y., & Sheth, S. A.',
    status: 'Published · 189(16), 5065–5080',
    doi: '10.1016/j.cell.2026.05.020',
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
    // Posted 2025 as "Mirror manifolds: Partially overlapping neural subspaces for speaking and listening";
    // retitled in v3 (2026-06-29).
    title: 'Hippocampus serves as a repository for spoken and heard word meanings during conversations',
    authors: 'Chavez, A. G., Franch, M., Mickiewicz, E. A., Baltazar, W., Belanger, J. L., Devara, D., Etta, M., Hamre, T., Ismail, T., Joiner, B., Kim, Y., Kona, A., Mansourian, K., Nangia, A., Pluenneke, M., Soubra, S., Venkateswaran, T., Venkudusamy, K., Chericoni, A., Kabotyanski, K. E., … Hayden, B. Y.',
    status: 'Preprint',
    doi: '10.1101/2025.09.20.677504',
  },
  {
    type: 'preprint',
    year: 2026,
    venue: 'bioRxiv',
    title: 'Neural signatures of impaired semantic contextualization in Autism Spectrum Disorder',
    authors: 'Franch, M., Katlowitz, K. A., Mickiewicz, E. A., Belanger, J. L., Mathura, R. K., Zhu, H., … Hayden, B. Y.',
    status: 'Preprint',
    doi: '10.64898/2026.03.16.712048',
  },
  {
    type: 'preprint',
    year: 2026,
    venue: 'bioRxiv',
    title: 'Polysemanticity in human hippocampal neurons',
    authors: 'Yan, X., Li, J. A., Franch, M., Zhu, H., Cowan, R. L., Belanger, J., Chavez, A. G., Chericoni, A., Ismail, T., Katlowitz, K. A., Kolibius, L. D., Mickiewicz, E. A., Paulo, D., Bartoli, E., Hennig, J. A., Frączek, T. M., Provenza, N. R., Rahimpour, S., Shofty, B., Smith, E., Jacobs, J., Hayden, B. Y., & Sheth, S. A.',
    status: 'Preprint',
    doi: '10.64898/2026.05.02.722435',
  },
  {
    type: 'preprint',
    year: 2025,
    venue: 'bioRxiv',
    title: 'A semantotopic map in human hippocampus',
    authors: 'Mickiewicz, E. A., Franch, M., Katlowitz, K. A., Chavez, A. G., Zhu, H., Chericoni, A., Yan, X., Belanger, J. L., Ismail, T., Paulo, D. L., Goldman, A. M., Krishnan, V., Maheshwari, A., Bartoli, E., Heilbronner, S. R., Provenza, N. R., Sheth, S. A., & Hayden, B. Y.',
    status: 'Preprint',
    doi: '10.1101/2025.10.31.685959',
  },
];
