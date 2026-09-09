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
  const score = parts.reduce((a, p) => a + p.w * p.s, 0) / (wsum || 1);
  return { score, parts, wsum };
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
