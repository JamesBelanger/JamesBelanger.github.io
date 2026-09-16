// app.js — UI for the identity-resolution + householding demo. All computation happens in match.js, in your browser.
import { resolve, evaluate, profile, householdize, evaluateHouseholds, matchEnrichment } from './match.js';
import { initWorkbench, renderWorkbench } from './workbench.js';

const $ = (id) => document.getElementById(id);
const pct = (x, d = 1) => (100 * x).toFixed(d) + '%';
const FIELDS = ['first', 'last', 'email', 'phone', 'street', 'city', 'zip'];
const FLABEL = { first: 'First name', last: 'Last name', email: 'Email', phone: 'Phone', street: 'Street', city: 'City', zip: 'ZIP' };

let DATA = null, state = { threshold: 0.75, result: null, metrics: null, households: null, hhMetrics: null, enrich: null, query: '', selected: 0, view: 'customers' };

async function boot() {
  DATA = await fetch('data.json').then(r => r.json());
  const prof = profile(DATA.records, DATA.meta);
  renderProfile(prof);
  $('threshold').addEventListener('input', () => {
    $('thval').textContent = (+$('threshold').value).toFixed(2);
    run();
  });
  $('search').addEventListener('input', () => { state.query = $('search').value.toLowerCase(); renderTable(); });
  $('view-customers').addEventListener('click', () => setView('customers'));
  $('view-households').addEventListener('click', () => setView('households'));
  initWorkbench(() => state);
  run();
}

function setView(v) {
  state.view = v;
  $('view-customers').classList.toggle('on', v === 'customers');
  $('view-households').classList.toggle('on', v === 'households');
  renderTable();
}

function run() {
  state.threshold = +$('threshold').value;
  const t0 = performance.now();
  state.result = resolve(DATA.records, DATA.meta, state.threshold);
  state.metrics = evaluate(DATA.records, state.result.golden, DATA.truth);
  state.households = householdize(state.result.golden, state.result.rs);
  state.hhMetrics = evaluateHouseholds(DATA.records, state.result.golden, state.households, DATA.truth_household);
  state.enrich = matchEnrichment(state.result.golden, state.result.rs, DATA.third_party, DATA.meta);
  const ms = performance.now() - t0;
  renderHero(ms);
  renderMailer();
  renderWorkbench();
  state.selected = 0;
  renderTable();
  // showcase a clean multi-record cluster by default (all raw first names agree after normalization)
  const rs = state.result.rs;
  let pick = -1, bestN = 0;
  state.result.golden.forEach((g, gi) => {
    if (g.members.length < 3) return;
    const firsts = new Set(g.members.map(i => rs[i].n_first).filter(f => f && f.length > 1));
    if (firsts.size === 1 && g.members.length > bestN) { bestN = g.members.length; pick = gi; }
  });
  if (pick < 0) pick = Math.max(0, state.result.golden.findIndex(g => g.members.length > 1));
  showDetail(pick);
}

function renderHero(ms) {
  const { golden, nPairsScored } = state.result;
  const m = state.metrics, hm = state.hhMetrics;
  const mailable = state.households.filter(h => !h.noAddress).length;
  $('n-in').textContent = DATA.records.length.toLocaleString();
  $('n-out').textContent = golden.length.toLocaleString();
  $('n-merged').textContent = (DATA.records.length - golden.length).toLocaleString();
  $('n-hh').textContent = mailable.toLocaleString();
  $('hh-sub').textContent = `mailable households (+ ${(state.households.length - mailable).toLocaleString()} with no deliverable address) · ground truth: ${DATA.meta.n_households} households`;
  $('m-prec').textContent = pct(m.precision);
  $('m-rec').textContent = pct(m.recall);
  $('m-note').textContent = `identity pairs, vs ground truth · householding: precision ${pct(hm.precision)} / recall ${pct(hm.recall)} · ${nPairsScored.toLocaleString()} candidate pairs in ${ms.toFixed(0)} ms`;
  $('truth-note').textContent = `ground truth: ${DATA.meta.n_entities} real customers`;
}

function renderMailer() {
  const raw = DATA.records.length;
  const customers = state.result.golden.length;
  const mailable = state.households.filter(h => !h.noAddress).length;
  const saved = raw - mailable;
  $('mail-raw').textContent = raw.toLocaleString();
  $('mail-cust').textContent = customers.toLocaleString();
  $('mail-hh').textContent = mailable.toLocaleString();
  $('mail-saved').textContent = `${saved.toLocaleString()} fewer letters than mailing the raw list (${pct(saved / raw, 0)} less print and postage) — and no household gets the same catalog twice.`;
  const e = state.enrich;
  $('enrich-note').textContent = `3rd-party demographics append: ${e.matched.toLocaleString()} of ${DATA.third_party.length.toLocaleString()} vendor rows matched onto customers by normalized email/phone (${e.coverage.toLocaleString()} customers enriched, ${pct(e.coverage / customers, 0)} coverage); ${e.unmatched} rows failed to match — mostly corrupted keys, quarantined rather than force-joined.`;
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
  if (state.view === 'households') return renderHouseholdTable();
  const tb = $('rows');
  tb.innerHTML = '';
  $('thead-row').innerHTML = '<th>Customer</th><th>Email</th><th>Phone</th><th>City</th><th></th>';
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
    const enrich = g.enrich ? ` <span class="enr" title="3rd-party append: ${g.enrich.age_band}, ${g.enrich.income_band}">+</span>` : '';
    tr.innerHTML = `<td class="name">${f.first} ${f.last}${enrich}</td><td>${f.email || '<span class="mut">–</span>'}</td>` +
      `<td>${f.phone || '<span class="mut">–</span>'}</td><td>${f.city || ''}</td>` +
      `<td class="num">${g.members.length > 1 ? `<span class="badge">${g.members.length} records</span>` : '<span class="mut">1</span>'}</td>`;
    tr.addEventListener('click', () => showDetail(gi));
    tb.append(tr);
  });
  $('tbl-note').textContent = `showing ${shown} of ${state.result.golden.length.toLocaleString()} unified customers — click one to see why its records merged (“+” = 3rd-party demographics attached)`;
}

function renderHouseholdTable() {
  const tb = $('rows');
  tb.innerHTML = '';
  $('thead-row').innerHTML = '<th>Household</th><th>Members</th><th>City</th><th></th><th></th>';
  const q = state.query;
  let shown = 0;
  for (const h of state.households) {
    if (h.noAddress) continue;
    const members = h.customers.map(gi => state.result.golden[gi].fields);
    const names = members.map(f => f.first).join(', ');
    const hay = (h.address + ' ' + h.surname + ' ' + names).toLowerCase();
    if (q && !hay.includes(q)) continue;
    if (shown >= 60) break;
    shown++;
    const tr = document.createElement('tr');
    tr.innerHTML = `<td class="name">${h.address.split(',')[0]}</td>` +
      `<td>${members.map(f => `${f.first} ${f.last}`).join(' · ')}</td>` +
      `<td>${members[0].city || ''}</td>` +
      `<td class="num">${h.size > 1 ? `<span class="badge">${h.size} people</span>` : '<span class="mut">1</span>'}</td>` +
      `<td class="mut">1 mailer</td>`;
    tr.addEventListener('click', () => showDetail(h.customers[0]));
    tb.append(tr);
  }
  $('tbl-note').textContent = `showing ${shown} of ${state.households.filter(h => !h.noAddress).length.toLocaleString()} mailable households — sorted largest first; click one to inspect a member`;
}

function showDetail(gi) {
  state.selected = gi;
  if (state.view === 'customers') renderTable();
  const g = state.result.golden[gi];
  const { rs } = state.result;
  const host = $('detail');
  host.innerHTML = '';
  const f = g.fields;
  host.append(el('h3', `${f.first} ${f.last} — ${g.members.length} source record${g.members.length > 1 ? 's' : ''}`));

  // household + enrichment context lines
  if (g.hid !== null && g.hid !== undefined) {
    const h = state.households.find(x => x.id === g.hid);
    if (h && !h.noAddress) {
      const others = h.customers.filter(x => x !== gi).map(x => {
        const of = state.result.golden[x].fields;
        return `${of.first} ${of.last}`;
      });
      const line = el('p', `Household: ${h.address}` + (others.length ? ` — shared with ${others.join(', ')} (one mailer for the ${h.size})` : ' — single-member household'), 'hhline');
      host.append(line);
    } else {
      host.append(el('p', 'Household: no deliverable address on any source record — excluded from mail campaigns, reachable by email/phone only.', 'hhline'));
    }
  }
  if (g.enrich) {
    host.append(el('p', `3rd-party append (matched via ${g.enrich.via}): age ${g.enrich.age_band} · income ${g.enrich.income_band} · ${g.enrich.homeowner ? 'homeowner' : 'renter'} · segment “${g.enrich.segment}”`, 'enrline'));
  } else {
    host.append(el('p', 'No 3rd-party demographics matched for this customer.', 'enrline mut'));
  }

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
      line.innerHTML = `<span class="epair">${rs[e.a].id} ↔ ${rs[e.b].id}</span> <span class="escore">${(e.score * 100).toFixed(0)}%</span> <span class="eparts">${partTxt}${e.guard ? ' · capped by first-name-conflict guard' : ''}</span>`;
      host.append(line);
    }
    host.append(el('p', 'Each link shows the per-field similarity × its weight; weights renormalize over the fields both records actually have. Records join the same customer when any chain of links clears the threshold.', 'caption'));
  } else {
    host.append(el('p', 'A single source record — nothing merged (correctly, if this customer only ever appeared once).', 'caption'));
  }
}

const el = (tag, text, cls) => { const e = document.createElement(tag); e.textContent = text; if (cls) e.className = cls; return e; };

boot();
