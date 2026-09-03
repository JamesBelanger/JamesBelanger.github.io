// app.js — UI + audio + model plumbing for the pronunciation demo. gop.js does the math.
import { scoreSentence } from './gop.js';

// Model sources, tried in order. GitHub caps files at 100 MB and release assets are not
// CORS-fetchable, so production serves the 123 MB model as two same-origin chunks.
const MODEL_SOURCES = [
  ['model/charsiu_10ms_int8.onnx'],                                          // local dev
  ['model/charsiu_10ms_int8.part0', 'model/charsiu_10ms_int8.part1'],        // production
];
const MODEL_BYTES = 123084458;
const ORT_CDN = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.20.1/dist/';
const C = 42;
const ID2PHONE = { 0: '[SIL]', 1: 'NG', 2: 'F', 3: 'M', 4: 'AE', 5: 'R', 6: 'UW', 7: 'N', 8: 'IY', 9: 'AW', 10: 'V', 11: 'UH', 12: 'OW', 13: 'AA', 14: 'ER', 15: 'HH', 16: 'Z', 17: 'K', 18: 'CH', 19: 'W', 20: 'EY', 21: 'ZH', 22: 'T', 23: 'EH', 24: 'Y', 25: 'AH', 26: 'B', 27: 'P', 28: 'TH', 29: 'DH', 30: 'AO', 31: 'G', 32: 'L', 33: 'JH', 34: 'OY', 35: 'SH', 36: 'D', 37: 'AY', 38: 'S', 39: 'IH' };

const $ = (id) => document.getElementById(id);
let DATA = null, EXAMPLES = null, session = null, sentence = null;
let recorder = null, recChunks = [], lastAudio = null, lastURL = null;

async function boot() {
  [DATA, EXAMPLES] = await Promise.all([
    fetch('sentences.json').then(r => r.json()),
    fetch('examples.json').then(r => r.json()),
  ]);
  const sel = $('sentence');
  DATA.sentences.forEach((s, i) => sel.append(new Option(s.text, i)));
  sel.addEventListener('change', () => { sentence = DATA.sentences[+sel.value]; clearResult(); });
  sentence = DATA.sentences[0];
  renderExamples();
  $('record').addEventListener('click', toggleRecord);
  $('upload').addEventListener('change', onUpload);
  $('rescore').addEventListener('click', () => lastAudio && score(lastAudio));
}

// ---------------- examples (no model needed) ----------------
function renderExamples() {
  const host = $('examples');
  for (const ex of EXAMPLES.examples) {
    const card = document.createElement('div');
    card.className = 'excard';
    card.innerHTML = `<div class="excap">${ex.caption}</div><div class="extext">“${ex.text}”</div>`;
    const res = document.createElement('div');
    renderResult(res, ex.phones, ex.overall, ex.audio);
    card.append(res);
    host.append(card);
  }
}

// ---------------- model ----------------
async function ensureModel() {
  if (session) return session;
  const status = $('status');
  if (!window.ort) {
    status.textContent = 'Loading ONNX Runtime…';
    await new Promise((ok, err) => {
      const s = document.createElement('script');
      s.src = ORT_CDN + 'ort.min.js'; s.onload = ok; s.onerror = err;
      document.head.append(s);
    });
    ort.env.wasm.wasmPaths = ORT_CDN;
  }
  let buf = null;
  for (const parts of MODEL_SOURCES) {
    try {
      const chunks = []; let got = 0;
      for (const url of parts) {
        const resp = await fetch(url);
        if (!resp.ok) throw new Error(url + ' -> ' + resp.status);
        const reader = resp.body.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value); got += value.length;
          status.textContent = `Downloading the model… ${(got / 1e6).toFixed(0)} / ${(MODEL_BYTES / 1e6).toFixed(0)} MB (one time; cached by your browser)`;
        }
      }
      buf = new Uint8Array(got);
      let o = 0; for (const c of chunks) { buf.set(c, o); o += c.length; }
      break;
    } catch (e) { buf = null; /* try next source */ }
  }
  if (!buf) throw new Error('could not download the model');
  status.textContent = 'Compiling the model…';
  session = await ort.InferenceSession.create(buf, { executionProviders: ['wasm'] });
  status.textContent = '';
  return session;
}

// ---------------- audio ----------------
async function toMono16k(arrayBuffer) {
  const ac = new (window.AudioContext || window.webkitAudioContext)();
  const decoded = await ac.decodeAudioData(arrayBuffer);
  ac.close();
  const off = new OfflineAudioContext(1, Math.ceil(decoded.duration * 16000), 16000);
  const src = off.createBufferSource();
  src.buffer = decoded; src.connect(off.destination); src.start();
  const rendered = await off.startRendering();
  return rendered.getChannelData(0).slice();
}

async function toggleRecord() {
  const btn = $('record');
  if (recorder && recorder.state === 'recording') { recorder.stop(); return; }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
    recChunks = [];
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (e) => recChunks.push(e.data);
    recorder.onstop = async () => {
      stream.getTracks().forEach(t => t.stop());
      btn.textContent = 'Record yourself';
      btn.classList.remove('rec');
      const blob = new Blob(recChunks);
      score(await toMono16k(await blob.arrayBuffer()), blob);
    };
    recorder.start();
    btn.textContent = 'Stop';
    btn.classList.add('rec');
    $('status').textContent = 'Recording… read the sentence, then press Stop.';
  } catch (e) {
    $('status').textContent = 'Microphone unavailable (' + e.name + '). You can upload a WAV instead.';
  }
}

async function onUpload(e) {
  const f = e.target.files[0];
  if (f) score(await toMono16k(await f.arrayBuffer()), f);
}

// ---------------- scoring ----------------
async function score(audio, blobForPlayback = null) {
  lastAudio = audio;
  const status = $('status');
  try {
    await ensureModel();
    status.textContent = 'Scoring…';
    const x = new Float32Array(audio.length);
    let m = 0; for (const v of audio) m += v; m /= audio.length;
    let sd = 0; for (const v of audio) sd += (v - m) * (v - m); sd = Math.sqrt(sd / audio.length) + 1e-7;
    for (let i = 0; i < audio.length; i++) x[i] = (audio[i] - m) / sd;
    const out = await session.run({ input_values: new ort.Tensor('float32', x, [1, x.length]) });
    const logits = out.logits.data;
    const T = out.logits.dims[1];
    const { phones, overall } = scoreSentence(logits, T, C, sentence.plan, ID2PHONE);
    if (blobForPlayback) { if (lastURL) URL.revokeObjectURL(lastURL); lastURL = URL.createObjectURL(blobForPlayback); }
    renderResult($('result'), phones, overall, lastURL);
    $('rescore').hidden = true;
    status.textContent = '';
  } catch (e) {
    console.error(e);
    status.textContent = 'Something went wrong: ' + (e.message || e) + '. Reload and try again.';
  }
}

function clearResult() { $('result').innerHTML = ''; }

// ---------------- rendering ----------------
const band = (s) => s >= 80 ? 'good' : s >= 50 ? 'ok' : 'bad';

function renderResult(host, phones, overall, audioUrl) {
  host.innerHTML = '';
  const words = [];
  for (const p of phones) {
    if (!words.length || words[words.length - 1].word !== p.word || words[words.length - 1].done) {
      if (words.length) words[words.length - 1].done = true;
      words.push({ word: p.word, phones: [], done: false });
    }
    words[words.length - 1].phones.push(p);
  }
  const head = document.createElement('div');
  head.className = 'reshead';
  head.innerHTML = `<span class="big ${band(overall)}">${Math.round(overall)}</span><span class="of">/100</span>`;
  if (audioUrl) {
    const play = document.createElement('button');
    play.className = 'play'; play.textContent = '▶ play';
    const au = new Audio(audioUrl);
    play.addEventListener('click', () => { au.currentTime = 0; au.play(); });
    head.append(play);
  }
  host.append(head);
  const line = document.createElement('div');
  line.className = 'words';
  const detail = document.createElement('div');
  detail.className = 'phones';
  words.forEach((w) => {
    const avg = w.phones.reduce((a, p) => a + p.score, 0) / w.phones.length;
    const el = document.createElement('span');
    el.className = 'w ' + band(avg);
    el.textContent = w.word;
    el.title = Math.round(avg) + '/100 — click for phonemes';
    el.addEventListener('click', () => showPhones(detail, w, audioUrl));
    line.append(el, document.createTextNode(' '));
  });
  host.append(line, detail);
  const worst = phones.reduce((a, p) => p.score < a.score ? p : a, phones[0]);
  if (worst && worst.score < 80) {
    const hint = document.createElement('div');
    hint.className = 'hint';
    const ex = (DATA && DATA.examples_hint[worst.phone]) || '';
    hint.textContent = `Focus on ${worst.phone}${ex ? ` (as in “${ex}”)` : ''} in “${worst.word}” — ${worst.score}/100.`;
    host.append(hint);
  }
  if (words.length) showPhones(detail, words.reduce((a, w) => {
    const avg = (x) => x.phones.reduce((s, p) => s + p.score, 0) / x.phones.length;
    return avg(w) < avg(a) ? w : a;
  }, words[0]), audioUrl);
}

function showPhones(host, w, audioUrl) {
  host.innerHTML = `<span class="plab">${w.word}:</span> `;
  for (const p of w.phones) {
    const c = document.createElement('span');
    c.className = 'ph ' + band(p.score);
    c.textContent = `${p.phone} ${p.score}`;
    if (audioUrl && p.t1 > p.t0) {
      c.style.cursor = 'pointer';
      c.title = 'play this sound';
      c.addEventListener('click', () => {
        const au = new Audio(audioUrl);
        au.currentTime = Math.max(0, p.t0 - 0.05);
        au.play();
        setTimeout(() => au.pause(), (p.t1 - p.t0 + 0.15) * 1000);
      });
    }
    host.append(c, document.createTextNode(' '));
  }
}

boot();
