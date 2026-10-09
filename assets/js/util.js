/* Utilitários compartilhados do site do GlowHub */
(function () {
  const GP = (window.GP = window.GP || {});

  /* ---------- DOM ---------- */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  // h('div.card#id', {attrs}, children...) — cria elementos sem innerHTML
  function h(tag, attrs, ...children) {
    const m = String(tag).match(/^([a-z0-9-]+)?((?:[.#][\w-]+)*)$/i);
    const el = document.createElement((m && m[1]) || 'div');
    if (m && m[2]) {
      m[2].replace(/([.#])([\w-]+)/g, (_, t, v) => {
        if (t === '.') el.classList.add(v);
        else el.id = v;
      });
    }
    if (attrs && (typeof attrs !== 'object' || attrs instanceof Node || Array.isArray(attrs))) {
      children.unshift(attrs);
      attrs = null;
    }
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (v == null || v === false) continue;
        if (k === 'class') el.className += (el.className ? ' ' : '') + v;
        else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
        else if (k === 'dataset') Object.assign(el.dataset, v);
        else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
        else if (k === 'html') el.innerHTML = v; // somente para markup estático do próprio protótipo
        else if (v === true) el.setAttribute(k, '');
        else el.setAttribute(k, v);
      }
    }
    appendAll(el, children);
    return el;
  }
  function appendAll(el, children) {
    for (const c of children.flat(Infinity)) {
      if (c == null || c === false) continue;
      el.appendChild(c instanceof Node ? c : document.createTextNode(String(c)));
    }
    return el;
  }
  // SVG
  const SVGNS = 'http://www.w3.org/2000/svg';
  function s(tag, attrs, ...children) {
    const el = document.createElementNS(SVGNS, tag);
    if (attrs) for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
      else if (k === 'text') el.textContent = v;
      else el.setAttribute(k, v);
    }
    for (const c of children.flat(Infinity)) {
      if (c == null || c === false) continue;
      el.appendChild(c instanceof Node ? c : document.createTextNode(String(c)));
    }
    return el;
  }
  function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); return el; }

  /* ---------- Números e datas (pt-BR) ---------- */
  const nfBRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  const nfBRL0 = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  const nfInt = new Intl.NumberFormat('pt-BR');
  const nf1 = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });
  const brl = (v) => nfBRL.format(v);
  const brl0 = (v) => nfBRL0.format(v);
  const int = (v) => nfInt.format(Math.round(v));
  const pct = (v, d = 1) => new Intl.NumberFormat('pt-BR', { maximumFractionDigits: d, minimumFractionDigits: 0 }).format(v * 100) + '%';
  // 12.900 → "12,9 mil"; 4.200.000 → "4,2 mi"
  const nf0 = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });
  function compactBRL(v) {
    const a = Math.abs(v);
    if (a >= 1e6) return 'R$ ' + nf1.format(v / 1e6) + ' mi';
    if (a >= 1e5) return 'R$ ' + nf0.format(v / 1e3) + ' mil';
    if (a >= 1e4) return 'R$ ' + nf1.format(v / 1e3) + ' mil';
    return brl0(v);
  }
  function compactInt(v) {
    const a = Math.abs(v);
    if (a >= 1e6) return nf1.format(v / 1e6) + ' mi';
    if (a >= 1e4) return nf1.format(v / 1e3) + ' mil';
    return int(v);
  }

  const DAY = 86400000;
  const today0 = (() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; })();
  const addDays = (d, n) => new Date(d.getTime() + n * DAY);
  const WD = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
  const WDL = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  const MON = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const pad = (n) => String(n).padStart(2, '0');
  const ddmm = (d) => pad(d.getDate()) + '/' + pad(d.getMonth() + 1);
  const ddmmyy = (d) => ddmm(d) + '/' + d.getFullYear();
  const wd = (d) => WD[d.getDay()];
  function relDay(d) {
    const diff = Math.round((d - today0) / DAY);
    if (diff === 0) return 'hoje';
    if (diff === -1) return 'ontem';
    if (diff === 1) return 'amanhã';
    if (diff > 1 && diff < 7) return WDL[d.getDay()];
    return wd(d) + ' ' + ddmm(d);
  }
  const isWeekend = (d) => d.getDay() === 0 || d.getDay() === 6 || d.getDay() === 5;

  /* ---------- Aleatório com semente (dados estáveis) ---------- */
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function rng(seed) {
    const r = mulberry32(seed);
    const api = () => r();
    api.int = (a, b) => a + Math.floor(r() * (b - a + 1));
    api.pick = (arr) => arr[Math.floor(r() * arr.length)];
    api.chance = (p) => r() < p;
    api.norm = (mu, sd) => { // Box-Muller
      let u = 0, v = 0;
      while (u === 0) u = r();
      while (v === 0) v = r();
      return mu + sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    };
    api.digits = (n) => Array.from({ length: n }, () => Math.floor(r() * 10)).join('');
    return api;
  }

  /* ---------- Movimento e acessibilidade ---------- */
  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function announce(msg) {
    let live = document.getElementById('gp-live');
    if (!live) {
      live = h('div#gp-live', { 'aria-live': 'polite', class: 'sr-only' });
      document.body.appendChild(live);
    }
    live.textContent = '';
    setTimeout(() => { live.textContent = msg; }, 30);
  }

  // Tooltip único e reutilizável (texto sempre via textContent)
  let tipEl = null;
  function tip() {
    if (!tipEl) {
      tipEl = h('div.gp-tip', { role: 'tooltip', 'aria-hidden': 'true' });
      document.body.appendChild(tipEl);
    }
    return tipEl;
  }
  function showTip(x, y, rows, title) {
    const t = tip();
    clear(t);
    if (title) t.appendChild(h('div.gp-tip-title', title));
    for (const r of rows) {
      t.appendChild(h('div.gp-tip-row',
        r.color ? h('span.gp-tip-key', { style: { background: r.color } }) : null,
        h('strong', r.value),
        h('span', r.label)));
    }
    t.classList.add('on');
    const pad = 14, w = t.offsetWidth, hh = t.offsetHeight;
    let left = x + pad, top = y - hh - pad;
    if (left + w > window.innerWidth - 8) left = x - w - pad;
    if (top < 8) top = y + pad;
    t.style.left = left + 'px';
    t.style.top = top + 'px';
  }
  function hideTip() { if (tipEl) tipEl.classList.remove('on'); }

  Object.assign(GP, {
    $, $$, h, s, clear, appendAll,
    fmt: { brl, brl0, int, pct, compactBRL, compactInt, ddmm, ddmmyy, wd, relDay, pad },
    date: { DAY, today0, addDays, WD, WDL, MON, isWeekend },
    rng, reducedMotion, announce, showTip, hideTip,
  });
})();
