// gop.js — forced alignment + GOP scoring, a line-for-line port of python/scorer.py.
// Input: raw logits [T, 42] from the acoustic model; a sentence "plan" from sentences.json.
// Output: per-phone {word, phone, score, t0, t1} plus an overall score.

export const SIL = 0;

export function logSoftmax(logits, T, C) {
  const out = new Float64Array(T * C);
  for (let t = 0; t < T; t++) {
    let mx = -Infinity;
    for (let c = 0; c < C; c++) mx = Math.max(mx, logits[t * C + c]);
    let sum = 0;
    for (let c = 0; c < C; c++) sum += Math.exp(logits[t * C + c] - mx);
    const lse = mx + Math.log(sum);
    for (let c = 0; c < C; c++) out[t * C + c] = logits[t * C + c] - lse;
  }
  return out;
}

export function buildStates(plan) {
  const ids = [], skip = [], owner = [];
  const sil = () => { ids.push(SIL); skip.push(true); owner.push(-1); };
  sil();
  plan.forEach((item, k) => {
    for (const pid of item.ids) { ids.push(pid); skip.push(false); owner.push(k); }
    sil();
  });
  return { ids, skip, owner };
}

export function viterbi(lp, T, C, ids, skip) {
  const S = ids.length, NEG = -1e18;
  const emis = (t, s) => lp[t * C + ids[s]];
  let prev = new Float64Array(S).fill(NEG);
  const back = new Int32Array(T * S);
  prev[0] = emis(0, 0);
  if (skip[0] && S > 1) prev[1] = emis(0, 1);
  const cur = new Float64Array(S);
  for (let t = 1; t < T; t++) {
    for (let s = 0; s < S; s++) {
      let best = prev[s], choice = 0;
      if (s >= 1 && prev[s - 1] > best) { best = prev[s - 1]; choice = 1; }
      if (s >= 2 && skip[s - 1] && prev[s - 2] > best) { best = prev[s - 2]; choice = 2; }
      cur[s] = best + emis(t, s);
      back[t * S + s] = s - choice;
    }
    prev.set(cur);
  }
  let end = S - 1;
  if (skip[S - 1] && S > 1 && prev[S - 2] > prev[S - 1]) end = S - 2;
  const path = new Int32Array(T);
  path[T - 1] = end;
  for (let t = T - 1; t > 0; t--) path[t - 1] = back[t * S + path[t]];
  return path;
}

export const gopToScore = (gop) => Math.round(100 * Math.exp(1.4 * Math.min(gop, 0)));

export function scoreSentence(logits, T, C, plan, id2phone) {
  const lp = logSoftmax(logits, T, C);
  const { ids, skip, owner } = buildStates(plan);
  const path = viterbi(lp, T, C, ids, skip);
  const maxlp = new Float64Array(T);
  for (let t = 0; t < T; t++) {
    let mx = -Infinity;
    for (let c = 0; c < C; c++) mx = Math.max(mx, lp[t * C + c]);
    maxlp[t] = mx;
  }
  const phones = [];
  for (let s = 0; s < ids.length; s++) {
    if (owner[s] < 0) continue;
    let n = 0, acc = 0, t0 = -1, t1 = -1;
    for (let t = 0; t < T; t++) {
      if (path[t] === s) {
        if (t0 < 0) t0 = t;
        t1 = t + 1;
        acc += lp[t * C + ids[s]] - maxlp[t];
        n++;
      }
    }
    const gop = n ? acc / n : -5.0;
    phones.push({
      word: plan[owner[s]].word, phone: id2phone[ids[s]],
      score: gopToScore(gop), t0: Math.max(t0, 0) / 100, t1: Math.max(t1, 0) / 100,
    });
  }
  const overall = phones.length ? phones.reduce((a, p) => a + p.score, 0) / phones.length : 0;
  return { phones, overall: Math.round(overall * 10) / 10 };
}
