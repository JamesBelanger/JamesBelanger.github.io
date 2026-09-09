// app.js — UI for the identity-resolution demo. All computation happens in match.js, in your browser.
import { resolve, evaluate, profile } from './match.js';

const $ = (id) => document.getElementById(id);
const pct = (x, d = 1) => (100 * x).toFixed(d) + '%';
const FIELDS = ['first', 'last', 'email', 'phone', 'street', 'city', 'zip'];
const FLABEL = { first: 'First name', last: 'Last name', email: 'Email', phone: 'Phone', street: 'Street', city: 'City', zip: 'ZIP' };

let DATA = null, state = { threshold: 0.75, result: null, metrics: null, query: '', selected: 0 };

async function boot() {
  DATA = await fetch('data.json').then(r => r.json());
  const prof = profile(DATA.records, DATA.meta);
  renderProfile(prof);
  $('threshold').addEventListener('input', () => {
    $('thval').textContent = (+$('threshold').value).toFixed(2);
    run();
  });
  $('search').addEventListener('input', () => { state.query = $('search').value.toLowerCase(); renderTable(); });
  run();
}

function run() {
  state.threshold = +$('threshold').value;
  const t0 = performance.now();
  state.result = resolve(DATA.records, DATA.meta, state.threshold);
  state.metrics = evaluate(DATA.records, state.result.golden, DATA.truth);
  const ms = performance.now() - t0;
  renderHero(ms);
  state.selected = 0;
  renderTable();
  const firstMulti = state.result.golden.findIndex(g => g.members.length > 1);
  showDetail(firstMulti >= 0 ? firstMulti : 0);
}

function renderHero(ms) {
  const { golden, nPairsScored } = state.result;
  const m = state.metrics;
  $('n-in').textContent = DATA.records.length.toLocaleString();
  $('n-out').textContent = golden.length.toLocaleString();
  $('n-merged').textContent = (DATA.records.length - golden.length).toLocaleString();
  $('m-prec').textContent = pct(m.precision);
  $('m-rec').textContent = pct(m.recall);
  $('m-note').textContent = `pairwise, against the generator's ground truth · ${nPairsScored.toLocaleString()} candidate pairs scored in ${ms.toFixed(0)} ms (of ${(DATA.records.length * (DATA.records.length - 1) / 2).toLocaleString()} possible — blocking does the pruning)`;
  const truthN = DATA.meta.n_entities;
  $('truth-note').textContent = `ground truth: ${truthN} real customers`;
}

function renderProfile(p) {
  const host = $('quality');
  host.innerHTML = '';
  for (const f of FIELDS) {
    const row = document.createElement('div');
    row.className = 'qrow';
    row.innerHTML = `<span class="ql">${FLABEL[f]}</span><span class="qbar"><span style="width:${pct(p.completeness[f], 0)}"></span></span><span class="qv">${pct(p.completeness[f], 0)}</span>`;
    host.append(row);
  }
  $('q-invalid').textContent = `${p.invalidEmail} malformed emails · ${p.invalidPhone} bad phone numbers · found and quarantined by normalization, not silently merged`;
}

function renderTable() {
  const tb = $('rows');
  tb.innerHTML = '';
  const q = state.query;
  let shown = 0;
  state.result.golden.forEach((g, gi) => {
    const f = g.fields;
    const hay = (f.first + ' ' + f.last + ' ' + f.email + ' ' + f.city).toLowerCase();
    if (q && !hay.includes(q)) return;
    if (shown >= 60) return;
    shown++;
    const tr = document.createElement('tr');
    if (gi === state.selected) tr.className = 'sel';
    tr.innerHTML = `<td class="name">${f.first} ${f.last}</td><td>${f.email || '<span class="mut">–</span>'}</td>` +
      `<td>${f.phone || '<span class="mut">–</span>'}</td><td>${f.city || ''}</td>` +
      `<td class="num">${g.members.length > 1 ? `<span class="badge">${g.members.length} records</span>` : '<span class="mut">1</span>'}</td>`;
    tr.addEventListener('click', () => showDetail(gi));
    tb.append(tr);
  });
  $('tbl-note').textContent = `showing ${shown} of ${state.result.golden.length.toLocaleString()} unified customers — click one to see why its records merged`;
}

function showDetail(gi) {
  state.selected = gi;
  renderTable();
  const g = state.result.golden[gi];
  const { rs } = state.result;
  const host = $('detail');
  host.innerHTML = '';
  const f = g.fields;
  host.append(el('h3', `${f.first} ${f.last} — ${g.members.length} source record${g.members.length > 1 ? 's' : ''}`));

  const tbl = document.createElement('table');
  tbl.className = 'srcs';
  tbl.innerHTML = '<thead><tr><th></th>' + g.members.map(i => `<th>${rs[i].source}<span class="rid">${rs[i].id}</span></th>`).join('') +
    '<th class="gold">Golden record</th></tr></thead>';
  const tb = document.createElement('tbody');
  for (const fd of FIELDS) {
    const tr = document.createElement('tr');
    const vals = g.members.map(i => rs[i][fd] || '');
    const uniq = new Set(vals.filter(Boolean).map(v => v.toLowerCase()));
    tr.innerHTML = `<th>${FLABEL[fd]}</th>` +
      vals.map(v => `<td class="${uniq.size > 1 ? 'differs' : ''}">${v || '<span class="mut">–</span>'}</td>`).join('') +
      `<td class="gold">${g.fields[fd] || '<span class="mut">–</span>'}</td>`;
    tb.append(tr);
  }
  tbl.append(tb);
  const wrap = document.createElement('div');
  wrap.className = 'tblwrap';
  wrap.append(tbl);
  host.append(wrap);

  if (g.edges.length) {
    host.append(el('h4', 'Why they merged'));
    for (const e of g.edges.slice(0, 6)) {
      const line = document.createElement('div');
      line.className = 'edge';
      const partTxt = e.parts.map(p => `${p.field} ${(p.s * 100).toFixed(0)}%×${p.w}`).join(' · ');
      line.innerHTML = `<span class="epair">${rs[e.a].id} ↔ ${rs[e.b].id}</span> <span class="escore">${(e.score * 100).toFixed(0)}%</span> <span class="eparts">${partTxt}</span>`;
      host.append(line);
    }
    host.append(el('p', 'Each link shows the per-field similarity × its weight; weights renormalize over the fields both records actually have. Records join the same customer when any chain of links clears the threshold.', 'caption'));
  } else {
    host.append(el('p', 'A single source record — nothing merged (correctly, if this customer only ever appeared once).', 'caption'));
  }
}

const el = (tag, text, cls) => { const e = document.createElement(tag); e.textContent = text; if (cls) e.className = cls; return e; };

boot();
