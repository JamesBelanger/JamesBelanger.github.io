import type { Publication } from '../data/publications';

const STOP = new Set(['a', 'an', 'the']);

// Stable BibTeX key, e.g. "katlowitz2026plasticity".
export function citeKey(pub: Publication): string {
  const surname = (pub.authors.split(',')[0] || 'ref').replace(/[^A-Za-z]/g, '').toLowerCase();
  const word =
    pub.title
      .split(/\s+/)
      .map((w) => w.replace(/[^A-Za-z]/g, '').toLowerCase())
      .find((w) => w && !STOP.has(w)) || 'untitled';
  return `${surname}${pub.year}${word}`;
}

// Best-effort conversion of an APA-style "Last, F. M., Last2, F., …" string into
// BibTeX "Last, F. M. and Last2, F." form. The vault source truncates long author
// lists with "…", which we represent as BibTeX "and others".
function bibAuthors(s: string): string {
  const hasEllipsis = /…|\.\.\./.test(s);
  const toks = s
    .replace(/…|\.\.\./g, '')
    .replace(/&/g, '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
  const authors: string[] = [];
  for (let i = 0; i < toks.length; ) {
    const surname = toks[i];
    const next = toks[i + 1];
    if (next && /[A-Z]\./.test(next)) {
      authors.push(`${surname}, ${next}`);
      i += 2;
    } else {
      authors.push(surname);
      i += 1;
    }
  }
  return authors.join(' and ') + (hasEllipsis ? ' and others' : '');
}

export function toBibtex(pub: Publication): string {
  const entryType = pub.type === 'journal' ? 'article' : 'misc';
  const fields = [
    `  author = {${bibAuthors(pub.authors)}}`,
    `  title = {{${pub.title}}}`,
    pub.type === 'journal' ? `  journal = {${pub.venue}}` : `  howpublished = {${pub.venue}}`,
    `  year = {${pub.year}}`,
  ];
  if (pub.doi) fields.push(`  doi = {${pub.doi}}`);
  if (pub.status) fields.push(`  note = {${pub.status}}`);
  return `@${entryType}{${citeKey(pub)},\n${fields.join(',\n')}\n}`;
}

// Plain-text reference, matching what the page displays.
export function toCitation(pub: Publication): string {
  const doi = pub.doi ? ` https://doi.org/${pub.doi}` : '';
  return `${pub.authors} (${pub.year}). ${pub.title}. ${pub.venue}.${doi}`;
}

export function toBibFile(pubs: Publication[]): string {
  return pubs.map(toBibtex).join('\n\n') + '\n';
}
