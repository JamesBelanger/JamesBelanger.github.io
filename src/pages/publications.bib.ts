import type { APIRoute } from 'astro';
import { PUBLICATIONS } from '../data/publications';
import { toBibFile } from '../lib/cite';

// Static endpoint -> /publications.bib (downloadable BibTeX of all entries).
export const GET: APIRoute = () =>
  new Response(toBibFile(PUBLICATIONS), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
