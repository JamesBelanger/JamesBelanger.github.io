// match.js — the identity-resolution engine: normalize -> block -> score pairs -> cluster -> golden records.
// Deliberately classic and explainable (deterministic + fuzzy), so every merge can show its reasons.

// ---------------- normalization ----------------
export function buildNickMap(nicknames) {
  const m = new Map();
  for (const [formal, nicks] of Object.entries(nicknames)) {
    for (const n of nicks) m.set(n.toLowerCase(), formal.toLowerCase());
  }
  return m;
}

const clean = (s) => (s || "").toLowerCase().replace(/[^a-z0-9@. ]/g, "").replace(/\s+/g, " ").trim();

export function normalizers(meta) {
  const nick = buildNickMap(meta.nicknames);
  const abbr = new Map();
  for (const [ab, long] of Object.entries(meta.street_abbr)) abbr.set(long.toLowerCase(), ab.toLowerCase());
  return {
    first(s) { const c = clean(s).replace(/\./g, ""); return nick.get(c) || c; },
    last(s) { return clean(s); },
    email(s) {
      const c = (s || "").toLowerCase().trim();
      return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(c) ? c : "";
    },
    phone(s) {
      let d = (s || "").replace(/\D/g, "");
      if (d.length === 11 && d.startsWith("1")) d = d.slice(1);
      return d.length === 10 ? d : "";
    },
    street(s) {
      return clean(s).split(" ").map(w => abbr.get(w) || w).join(" ");
    },
    zip(s) { return (s || "").trim(); },
  };
}

// ---------------- string similarity ----------------
export function jaroWinkler(a, b) {
  if (!a || !b) return 0;
  if (a === b) return 1;
  const range = Math.max(0, Math.floor(Math.max(a.length, b.length) / 2) - 1);
  const aM = new Array(a.length).fill(false), bM = new Array(b.length).fill(false);
  let matches = 0;
  for (let i = 0; i < a.length; i++) {
    for (let j = Math.max(0, i - range); j < Math.min(b.length, i + range + 1); j++) {
      if (!bM[j] && a[i] === b[j]) { aM[i] = bM[j] = true; matches++; break; }
    }
  }
  if (!matches) return 0;
  let t = 0, k = 0;
  for (let i = 0; i < a.length; i++) {
    if (aM[i]) { while (!bM[k]) k++; if (a[i] !== b[k]) t++; k++; }
  }
  t /= 2;
  const jaro = (matches / a.length + matches / b.length + (matches - t) / matches) / 3;
  let prefix = 0;
  while (prefix < Math.min(4, a.length, b.length) && a[prefix] === b[prefix]) prefix++;
  return jaro + prefix * 0.1 * (1 - jaro);
}

const tokenJaccard = (a, b) => {
  const A = new Set(a.split(" ").filter(Boolean)), B = new Set(b.split(" ").filter(Boolean));
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  return inter / (A.size + B.size - inter);
};

// ---------------- pair scoring (weights sum to 1 over the comparisons both records support) ----------------
export function scorePair(x, y) {
  const parts = [];
  if (x.n_email && y.n_email) {
    let s = x.n_email === y.n_email ? 1 : 0;
    if (!s) {
      const [ux, dx] = x.n_email.split("@"), [uy, dy] = y.n_email.split("@");
      s = dx === dy ? 0.75 * jaroWinkler(ux, uy) : 0.4 * jaroWinkler(ux, uy);
    }
    parts.push({ field: "email", w: 0.3, s });
  }
  if (x.n_phone && y.n_phone) parts.push({ field: "phone", w: 0.25, s: x.n_phone === y.n_phone ? 1 : 0 });
  {
    const init = x.n_first.length === 1 || y.n_first.length === 1;
    const fs = init ? (x.n_first[0] === y.n_first[0] ? 0.8 : 0) : jaroWinkler(x.n_first, y.n_first);
    const ls = jaroWinkler(x.n_last, y.n_last);
    parts.push({ field: "name", w: 0.3, s: 0.45 * fs + 0.55 * ls });
  }
  if (x.n_street && y.n_street) {
    const zs = x.n_zip && y.n_zip ? (x.n_zip === y.n_zip ? 1 : 0) : 0.5;
    parts.push({ field: "address", w: 0.15, s: 0.6 * tokenJaccard(x.n_street, y.n_street) + 0.4 * zs });
  } else if (x.n_zip && y.n_zip) {
    parts.push({ field: "address", w: 0.08, s: x.n_zip === y.n_zip ? 1 : 0 });
  }
  const wsum = parts.reduce((a, p) => a + p.w, 0);
  let score = parts.reduce((a, p) => a + p.w * p.s, 0) / (wsum || 1);
  // Different-person guard: family members share surname, address, even a home phone — but two
  // clearly different full first names is strong evidence of two people. Cap such pairs below the
  // default threshold so households don't collapse into one "customer".
  let guard = false;
  {
    const init = x.n_first.length <= 1 || y.n_first.length <= 1 || x.first.includes(".") || y.first.includes(".");
    const emailProof = parts.some(p => p.field === "email" && p.s >= 0.99);
    if (!init && x.n_first && y.n_first && jaroWinkler(x.n_first, y.n_first) < 0.72) {
      if (score > 0.70) { score = 0.70; guard = true; }
    } else if (init && !emailProof && score > 0.74) {
      // An initial plus family-shared surname/address/phone could be either sibling — ambiguity
      // must not force a merge. A matching email is the tie-breaker that lifts the cap.
      score = 0.74; guard = true;
    }
  }
  return { score, parts, wsum, guard };
}

// ---------------- blocking: only compare records that share a cheap key ----------------
export function candidatePairs(records) {
  const blocks = new Map();
  const add = (key, i) => {
    if (!key) return;
    if (!blocks.has(key)) blocks.set(key, []);
    blocks.get(key).push(i);
  };
  records.forEach((r, i) => {
    add("p:" + r.n_phone, i);
    add("e:" + r.n_email, i);
    if (r.n_last.length >= 3) {
      add("z:" + r.n_zip + ":" + r.n_last.slice(0, 3), i);
      if (r.n_first) add("n:" + r.n_first.slice(0, 3) + ":" + r.n_last.slice(0, 3), i);
    }
    // typo-tolerant last-name key: sorted first 4 letters
    add("s:" + r.n_zip + ":" + [...r.n_last.replace(/ /g, "")].sort().slice(0, 4).join(""), i);
  });
  const seen = new Set();
  const pairs = [];
  for (const idxs of blocks.values()) {
    if (idxs.length < 2 || idxs.length > 60) continue;
    for (let a = 0; a < idxs.length; a++) {
      for (let b = a + 1; b < idxs.length; b++) {
        const key = idxs[a] < idxs[b] ? idxs[a] * 100000 + idxs[b] : idxs[b] * 100000 + idxs[a];
        if (!seen.has(key)) { seen.add(key); pairs.push([idxs[a], idxs[b]]); }
      }
    }
  }
  return pairs;
}

// ---------------- clustering (union-find) ----------------
class UF {
  constructor(n) { this.p = Array.from({ length: n }, (_, i) => i); }
  find(x) { while (this.p[x] !== x) { this.p[x] = this.p[this.p[x]]; x = this.p[x]; } return x; }
  union(a, b) { this.p[this.find(a)] = this.find(b); }
}

export function resolve(records, meta, threshold) {
  const N = normalizers(meta);
  const rs = records.map(r => ({
    ...r,
    n_first: N.first(r.first), n_last: N.last(r.last), n_email: N.email(r.email),
    n_phone: N.phone(r.phone), n_street: N.street(r.street), n_zip: N.zip(r.zip),
  }));
  const pairs = candidatePairs(rs);
  const scored = pairs.map(([a, b]) => ({ a, b, ...scorePair(rs[a], rs[b]) }));
  const uf = new UF(rs.length);
  const edges = scored.filter(p => p.score >= threshold);
  for (const e of edges) uf.union(e.a, e.b);
  const clusters = new Map();
  rs.forEach((r, i) => {
    const root = uf.find(i);
    if (!clusters.has(root)) clusters.set(root, []);
    clusters.get(root).push(i);
  });
  const golden = [...clusters.values()].map(idxs => makeGolden(rs, idxs, edges));
  golden.sort((a, b) => b.members.length - a.members.length);
  return { rs, golden, edges, nPairsScored: scored.length };
}

// ---------------- survivorship: build the golden record ----------------
const FIELDS = ["first", "last", "email", "phone", "street", "city", "zip"];
function makeGolden(rs, idxs, edges) {
  const g = { members: idxs, fields: {} };
  for (const f of FIELDS) {
    const votes = new Map();
    for (const i of idxs) {
      const norm = rs[i]["n_" + f] !== undefined ? rs[i]["n_" + f] : clean(rs[i][f]);
      const raw = rs[i][f];
      if (!norm && !raw) continue;
      const key = norm || clean(raw);
      if (!key) continue;
      if (!votes.has(key)) votes.set(key, { n: 0, best: raw });
      const v = votes.get(key);
      v.n++;
      if (better(raw, v.best)) v.best = raw;
    }
    let win = null;
    for (const v of votes.values()) if (!win || v.n > win.n || (v.n === win.n && better(v.best, win.best))) win = v;
    g.fields[f] = win ? win.best : "";
  }
  g.edges = edges.filter(e => idxs.includes(e.a) && idxs.includes(e.b));
  g.completeness = FIELDS.reduce((a, f) => a + (g.fields[f] ? 1 : 0), 0) / FIELDS.length;
  return g;
}
function better(a, b) {  // prefer longer, properly-cased display variants
  if (!b) return true;
  if (!a) return false;
  const cased = (s) => /[A-Z]/.test(s) && /[a-z]/.test(s);
  if (cased(a) !== cased(b)) return cased(a);
  return a.length > b.length;
}

// ---------------- evaluation against ground truth ----------------
export function evaluate(records, golden, truth) {
  const trueGroups = new Map();
  records.forEach(r => {
    const e = truth[r.id];
    if (!trueGroups.has(e)) trueGroups.set(e, []);
    trueGroups.get(e).push(r.id);
  });
  const pairKey = (a, b) => (a < b ? a + "|" + b : b + "|" + a);
  const truePairs = new Set();
  for (const ids of trueGroups.values()) {
    for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) truePairs.add(pairKey(ids[i], ids[j]));
  }
  let predicted = 0, correct = 0;
  for (const g of golden) {
    const ids = g.members.map(i => records[i].id);
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        predicted++;
        if (truePairs.has(pairKey(ids[i], ids[j]))) correct++;
      }
    }
  }
  return {
    precision: predicted ? correct / predicted : 1,
    recall: truePairs.size ? correct / truePairs.size : 1,
    truePairs: truePairs.size, predictedPairs: predicted,
  };
}

// ---------------- data-quality profile (pre-merge) ----------------
export function profile(records, meta) {
  const N = normalizers(meta);
  const out = { completeness: {}, invalidEmail: 0, invalidPhone: 0 };
  for (const f of FIELDS) out.completeness[f] = 0;
  for (const r of records) {
    for (const f of FIELDS) if ((r[f] || "").trim()) out.completeness[f]++;
    if ((r.email || "").trim() && !N.email(r.email)) out.invalidEmail++;
    if ((r.phone || "").trim() && !N.phone(r.phone)) out.invalidPhone++;
  }
  for (const f of FIELDS) out.completeness[f] = out.completeness[f] / records.length;
  return out;
}

// ---------------- v2: householding ----------------
// Marketing-style householding on top of resolved customers: same normalized address is the
// candidate household; within an address, customers join a household when they share a surname
// or a phone number (so roommates with different names and phones stay separate).
export function householdize(golden, rs) {
  const byAddr = new Map();
  golden.forEach((g, gi) => {
    g.hid = null;
    const street = mode(g.members.map(i => rs[i].n_street).filter(Boolean));
    const zip = mode(g.members.map(i => rs[i].n_zip).filter(Boolean));
    g._addrKey = street ? street + "|" + zip : null;
    g._last = mode(g.members.map(i => rs[i].n_last).filter(Boolean)) || "";
    g._phones = new Set(g.members.map(i => rs[i].n_phone).filter(Boolean));
    if (!g._addrKey) return;
    if (!byAddr.has(g._addrKey)) byAddr.set(g._addrKey, []);
    byAddr.get(g._addrKey).push(gi);
  });
  const households = [];
  for (const [addrKey, gis] of byAddr.entries()) {
    // union goldens at this address that share surname or a phone
    const parent = new Map(gis.map(x => [x, x]));
    const find = (x) => { while (parent.get(x) !== x) { parent.set(x, parent.get(parent.get(x))); x = parent.get(x); } return x; };
    for (let a = 0; a < gis.length; a++) {
      for (let b = a + 1; b < gis.length; b++) {
        const A = golden[gis[a]], B = golden[gis[b]];
        const shareName = A._last && A._last === B._last;
        const sharePhone = [...A._phones].some(p => B._phones.has(p));
        if (shareName || sharePhone) parent.set(find(gis[a]), find(gis[b]));
      }
    }
    const groups = new Map();
    for (const gi of gis) {
      const r = find(gi);
      if (!groups.has(r)) groups.set(r, []);
      groups.get(r).push(gi);
    }
    for (const members of groups.values()) households.push({ addrKey, customers: members });
  }
  // customers with no usable address become single-customer households (not mailable)
  golden.forEach((g, gi) => {
    if (!g._addrKey) households.push({ addrKey: null, customers: [gi], noAddress: true });
  });
  households.forEach((h, k) => {
    h.id = k;
    h.customers.forEach(gi => { golden[gi].hid = k; });
    const first = golden[h.customers[0]];
    h.address = first.fields.street ? `${first.fields.street}, ${first.fields.city} ${first.fields.zip}` : "(no deliverable address)";
    h.surname = first._last;
    h.size = h.customers.length;
  });
  return households.sort((a, b) => b.size - a.size);
}
const mode = (arr) => {
  if (!arr.length) return null;
  const c = new Map();
  let best = arr[0], bn = 0;
  for (const v of arr) { const n = (c.get(v) || 0) + 1; c.set(v, n); if (n > bn) { bn = n; best = v; } }
  return best;
};

/** Pairwise household precision/recall at the record level, against ground-truth household ids. */
export function evaluateHouseholds(records, golden, households, truthH) {
  const recHH = new Map();       // record id -> predicted household id
  for (const g of golden) {
    for (const i of g.members) recHH.set(records[i].id, g.hid);
  }
  const trueGroups = new Map();
  records.forEach(r => {
    const h = truthH[r.id];
    if (!trueGroups.has(h)) trueGroups.set(h, []);
    trueGroups.get(h).push(r.id);
  });
  const pairKey = (a, b) => (a < b ? a + "|" + b : b + "|" + a);
  const truePairs = new Set();
  for (const ids of trueGroups.values()) {
    for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) truePairs.add(pairKey(ids[i], ids[j]));
  }
  const predGroups = new Map();
  for (const [rid, hh] of recHH.entries()) {
    if (!predGroups.has(hh)) predGroups.set(hh, []);
    predGroups.get(hh).push(rid);
  }
  let predicted = 0, correct = 0;
  for (const ids of predGroups.values()) {
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        predicted++;
        if (truePairs.has(pairKey(ids[i], ids[j]))) correct++;
      }
    }
  }
  return { precision: predicted ? correct / predicted : 1, recall: truePairs.size ? correct / truePairs.size : 1 };
}

// ---------------- v2: third-party enrichment append ----------------
/** Match a 3rd-party demographics file onto golden records by normalized email, then phone. */
export function matchEnrichment(golden, rs, thirdParty, meta) {
  const N = normalizers(meta);
  const byEmail = new Map(), byPhone = new Map();
  golden.forEach((g, gi) => {
    for (const i of g.members) {
      if (rs[i].n_email) byEmail.set(rs[i].n_email, gi);
      if (rs[i].n_phone) byPhone.set(rs[i].n_phone, gi);
    }
    g.enrich = null;
  });
  let matched = 0, unmatched = 0;
  for (const row of thirdParty) {
    const e = N.email(row.email), p = N.phone(row.phone);
    const gi = (e && byEmail.has(e)) ? byEmail.get(e) : (p && byPhone.has(p)) ? byPhone.get(p) : null;
    if (gi === null) { unmatched++; continue; }
    matched++;
    if (!golden[gi].enrich) golden[gi].enrich = { ...row, via: (e && byEmail.has(e)) ? "email" : "phone" };
  }
  const coverage = golden.filter(g => g.enrich).length;
  return { matched, unmatched, coverage };
}
