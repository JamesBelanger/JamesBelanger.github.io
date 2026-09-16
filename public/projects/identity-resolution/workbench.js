// workbench.js — "Score one pair, live": renders the actual matching algorithm on real pairs
// from the dataset. Uses the same scorePair/candidatePairs the pipeline runs — nothing mocked.
import { candidatePairs, scorePair, jaroWinkler } from './match.js';

const $ = (id) => document.getElementById(id);
const pct = (x) => (100 * x).toFixed(0) + '%';

const CASES = [
  { key: 'exact', label: 'Exact strong keys', blurb: 'Same email or phone after normalization — deterministic evidence does most of the work.' },
  { key: 'fuzzy', label: 'Typo + nickname', blurb: 'No exact key. The merge is earned field by field: nickname-aware names, fuzzy strings.' },
  { key: 'family', label: 'The family trap', blurb: 'Same surname, same address — but two different people. The guard caps the score so siblings never merge.' },
  { key: 'miss', label: 'Near miss', blurb: 'Real similarity, not enough evidence. Below the threshold it stays unmerged — drag the slider left and watch the verdict flip.' },
];

let picked = {}, current = 'fuzzy', getState = null;

export function initWorkbench(stateGetter) {
  getState = stateGetter;
  const chips = $('wb-chips');
  chips.innerHTML = '';
  for (const c of CASES) {
    const el = document.createElement('span');
    el.className = 'chip' + (c.key === current ? ' on' : '');
    el.id = 'wbchip-' + c.key;
    el.textContent = c.label;
    el.addEventListener('click', () => { current = c.key; refreshChips(); renderCase(); });
    chips.append(el);
  }
}

function refreshChips() {
  for (const c of CASES) $('wbchip-' + c.key)?.classList.toggle('on', c.key === current);
}

/** Re-pick illustrative pairs from the freshly resolved records (called on every run). */
export function renderWorkbench() {
  const { rs } = getState().result;
  const pairs = candidatePairs(rs);
  const scored = pairs.map(([a, b]) => ({ a, b, ...scorePair(rs[a], rs[b]) }));
  const get = (p, f) => p.parts.find(x => x.field === f);
  const exactKey = (p) => (get(p, 'email')?.s >= 0.99) || (get(p, 'phone')?.s === 1);
  const visibleDiff = (p) => {
    const A = rs[p.a], B = rs[p.b];
    return ['first', 'last', 'email', 'phone', 'street'].filter(f => (A[f] || '') !== (B[f] || '')).length >= 2;
  };
  picked = {};
  // exact: strong key + still visibly messy elsewhere
  picked.exact = scored.filter(p => exactKey(p) && p.score >= 0.85 && visibleDiff(p)).sort((x, y) => y.score - x.score)[0];
  // fuzzy: no exact key, and the name similarity is visibly imperfect (a real typo/nickname, not
  // one that normalization already made identical) — yet the pair still merges at the default threshold
  const fuzzyPool = scored.filter(p => !exactKey(p) && !p.guard && p.score >= 0.75);
  picked.fuzzy = fuzzyPool.filter(p => { const n = get(p, 'name'); return n && n.s >= 0.70 && n.s <= 0.97; })
    .sort((x, y) => y.score - x.score)[0]
    || fuzzyPool.sort((x, y) => y.score - x.score)[0];
  // family: the guard fired
  picked.family = scored.filter(p => p.guard).sort((x, y) => y.score - x.score)[0];
  // miss: close but not enough
  picked.miss = scored.filter(p => !p.guard && p.score >= 0.6 && p.score < 0.74).sort((x, y) => y.score - x.score)[0];
  renderCase();
}

function normShown(raw, norm) {
  if (!raw) return '<span class="mut">–</span>';
  const r = String(raw), n = String(norm || '');
  if (!n) return `${esc(r)} <span class="wb-norm bad-val">→ invalid, quarantined</span>`;
  if (n.toLowerCase() === r.toLowerCase().trim()) return esc(r);
  return `${esc(r)} <span class="wb-norm">→ ${esc(n)}</span>`;
}
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

function renderCase() {
  const host = $('wb');
  const cse = CASES.find(c => c.key === current);
  const p = picked[current];
  const { rs } = getState().result;
  const threshold = getState().threshold;
  host.innerHTML = '';
  const blurb = document.createElement('p');
  blurb.className = 'sub';
  blurb.style.margin = '10px 0';
  blurb.textContent = cse.blurb;
  host.append(blurb);
  if (!p) { host.append(Object.assign(document.createElement('p'), { className: 'caption', textContent: 'No pair of this kind exists in the current dataset.' })); return; }
  const A = rs[p.a], B = rs[p.b];

  // ---- the two records, raw -> normalized
  const rows = [
    ['Name', `${A.first} ${A.last}`, `${A.n_first} ${A.n_last}`, `${B.first} ${B.last}`, `${B.n_first} ${B.n_last}`],
    ['Email', A.email, A.n_email, B.email, B.n_email],
    ['Phone', A.phone, A.n_phone, B.phone, B.n_phone],
    ['Street', A.street, A.n_street, B.street, B.n_street],
    ['ZIP', A.zip, A.n_zip, B.zip, B.n_zip],
  ];
  let html = `<div class="tblwrap"><table class="srcs wb-tbl"><thead><tr><th></th>` +
    `<th>${A.source}<span class="rid">${A.id}</span></th><th>${B.source}<span class="rid">${B.id}</span></th>` +
    `<th>similarity</th><th>weight</th><th>contribution</th></tr></thead><tbody>`;
  const simFor = { Name: 'name', Email: 'email', Phone: 'phone', Street: 'address', ZIP: null };
  for (const [label, ra, na, rb, nb] of rows) {
    const f = simFor[label];
    const part = f ? p.parts.find(x => x.field === f) : null;
    let sim = '', w = '', contrib = '';
    if (label === 'ZIP') { sim = '<span class="mut">scored inside address</span>'; }
    else if (part) {
      sim = `<b>${pct(part.s)}</b>`;
      w = '× ' + part.w.toFixed(2);
      contrib = (part.s * part.w).toFixed(3);
    } else {
      sim = '<span class="mut">not compared — a side is missing, weight renormalizes</span>';
    }
    html += `<tr><th>${label}</th><td>${normShown(ra, na)}</td><td>${normShown(rb, nb)}</td>` +
      `<td>${sim}</td><td class="mut">${w}</td><td class="num">${contrib}</td></tr>`;
  }
  const raw = p.parts.reduce((a, x) => a + x.s * x.w, 0);
  html += `</tbody></table></div>`;
  host.insertAdjacentHTML('beforeend', html);

  // ---- the arithmetic, spelled out
  const math = document.createElement('div');
  math.className = 'wb-math';
  const terms = p.parts.map(x => `${pct(x.s)}×${x.w.toFixed(2)}`).join(' + ');
  let line = `score = (${terms}) ÷ ${p.wsum.toFixed(2)} = <b>${pct(raw / p.wsum)}</b>`;
  if (p.guard) line += ` → <b>guard caps it at ${pct(p.score)}</b> (different full first names at shared family evidence — likely two people, not one)`;
  math.innerHTML = line + ` <span class="mut">· dividing by ${p.wsum.toFixed(2)} renormalizes over the fields both records actually have</span>`;
  host.append(math);

  // ---- verdict against the live threshold
  const merge = p.score >= threshold;
  const v = document.createElement('div');
  v.className = 'wb-verdict ' + (merge ? 'yes' : 'no');
  v.innerHTML = `${pct(p.score)} ${merge ? '≥' : '<'} threshold ${pct(threshold)} → <b>${merge ? 'MERGE: same customer' : 'NO MERGE: kept separate'}</b>` +
    (current === 'family' && !merge ? ' — correctly. In production, borderline pairs like this route to a data-steward review queue, not a guess.' : '') +
    (current === 'miss' && !merge ? ' — drag the threshold slider above below this score and this verdict flips to MERGE. That dial is a business decision: the cost of a bad merge versus a missed one.' : '');
  host.append(v);
}
