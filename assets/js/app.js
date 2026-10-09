/* A janela do GlowHub no protótipo, com o mesmo menu, os mesmos nomes e a mesma ordem do sistema real.
   As telas de cada módulo vêm de comercial.js, marketing.js e financeiro.js, por defineScreens.
   A história da Mariana (etapa 0 a 5) atravessa as telas: conversa, oportunidade, agenda, cobrança e campanha. */
(function () {
  const { h, s, clear } = GP;

  /* ---------- ícones de traço, 24 x 24 ---------- */
  const ICONS = {
    home: 'M3 11l9-7 9 7 M5 10v10h14V10 M10 20v-6h4v6',
    chat: 'M4 5h16v11H9l-5 4z',
    cal: 'M4 6h16v14H4z M4 10h16 M8 3v5 M16 3v5',
    user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5',
    list: 'M9 6h11 M9 12h11 M9 18h11 M4.5 6h.01 M4.5 12h.01 M4.5 18h.01',
    ext: 'M14 4h6v6 M20 4l-9 9 M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5',
    chart: 'M4 20v-9 M10 20V5 M16 20v-6 M3 20h18',
    spark: 'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z M19 16l.7 1.8 1.8.7-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7z',
    ask: 'M4 5h16v11H9l-5 4z M12 7.5l.8 1.9 1.9.8-1.9.8-.8 1.9-.8-1.9-1.9-.8 1.9-.8z',
    bulb: 'M9 18h6 M10 21h4 M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z',
    receipt: 'M6 3h12v18l-3-2-3 2-3-2-3 2z M9 8h6 M9 12h6 M9 16h3',
    check: 'M5 12.5l4.5 4.5L19 7.5',
    clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 7v5l3.5 2',
    alert: 'M12 3.5l9 16.5H3z M12 10v4.5 M12 17.4v.2',
    info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 11v6 M12 7.4v.2',
    cake: 'M3 21h18 M5 21v-8h14v8 M5 15.5c2 1.2 3.5 1.2 5 0s3-1.2 5 0 3 1.2 4 0 M12 8v5 M12 4.6v.2',
    globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M3 12h18 M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z',
    undo: 'M9 14L4 9l5-5 M4 9h10.5a5.5 5.5 0 0 1 0 11H11',
    flag: 'M5 21V4 M5 4h11l-2 4 2 4H5',
    percent: 'M19 5L5 19 M7.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z M16.5 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z',
    wallet: 'M3 7h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M3 7l12-3v3 M16 13.5h2',
    card: 'M3 6h18v12H3z M3 10h18 M7 15h3',
    bank: 'M3 10h18 M5 10v8 M9.5 10v8 M14.5 10v8 M19 10v8 M3 21h18 M12 3l9 5H3z',
    sync: 'M20 11a8 8 0 0 0-14.3-4.9L4 8 M4 4v4h4 M4 13a8 8 0 0 0 14.3 4.9L20 16 M20 20v-4h-4',
    settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z',
    bell: 'M6 16V11a6 6 0 0 1 12 0v5l2 2H4z M10 20a2 2 0 0 0 4 0',
    search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z M20 20l-4-4',
    plus: 'M12 5v14 M5 12h14',
    x: 'M6 6l12 12 M18 6L6 18',
    clip: 'M21 11.5l-8.5 8.5a5 5 0 0 1-7-7l8.5-8.5a3.3 3.3 0 0 1 4.7 4.7L10.2 17.7a1.7 1.7 0 0 1-2.4-2.4L15.5 7.6',
    mic: 'M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3z M19 11a7 7 0 0 1-14 0 M12 18v3',
    send: 'M21 3L10 14 M21 3l-7 18-4-7-7-4z',
    back: 'M15 18l-6-6 6-6',
    phone: 'M7 3h10v18H7z M11 18h2',
  };
  function icon(name) {
    return s('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true', focusable: 'false' },
      s('path', { d: ICONS[name] || ICONS.info }));
  }
  const CHIP_ICON = { good: 'check', warn: 'clock', crit: 'alert', info: 'info', ai: 'spark', muted: 'clock', stage: 'sync', navy: 'cake' };
  // chip de situação: sempre com ícone e rótulo; "stage" é a etapa de uma oportunidade, como no sistema
  const chip = (kind, label, ic) => h('span.chip.' + kind, icon(ic || CHIP_ICON[kind] || 'info'), label);
  // um elemento que não é botão, mas age como um (linha da lista, cartão do funil)
  const press = (fn) => ({ role: 'button', tabindex: 0, onclick: fn, onkeydown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); } } });
  const toast = (m) => { if (GP.toast) GP.toast(m); };
  const pct1 = (v) => new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(v * 100) + '%';
  const avatar = (ini, dark) => h('span.a-av', { class: dark ? 'dark' : null, 'aria-hidden': 'true' }, ini);

  /* ---------- pedaços de tela ---------- */
  const hrow = (title, sub, ...actions) => h('div.a-hrow',
    h('div', h('h3.a-h', title), sub ? h('p.a-sub', sub) : null),
    actions.length ? h('div.a-actions', actions) : null);
  const panel = (attrs, title, small, ...body) => h('section.a-panel', attrs, h('div.a-panel-h', title, small ? h('small', small) : null), ...body);
  const kpi = (label, value, note, up) => h('div.a-kpi', h('span', label), h('b', value), note ? h('small', { class: up === true ? 'up' : up === 'bad' ? 'bad' : null }, note) : null);
  const stack = (...els) => h('div', { style: 'display:grid;gap:12px;align-content:start;min-width:0' }, ...els);
  const flashCls = () => (state.flash ? 'app-flash' : null);
  // abas de uma tela (o Segmented do sistema), guardadas no estado da janela
  function tabs(screen, list, label, def) {
    const cur = state.tabs[screen] || def || list[0][0];
    return h('div.a-seg', { role: 'tablist', 'aria-label': label },
      list.map(([k, l]) => h('button', { type: 'button', role: 'tab', 'aria-selected': String(cur === k), dataset: { keep: screen + '-' + k }, onclick: () => { state.tabs[screen] = k; render(screen + '-' + k); } }, l)));
  }
  const tabOf = (screen, def) => state.tabs[screen] || def;

  /* ---------- módulos: a ordem e os rodapés do sistema ---------- */
  const MODS = [
    { id: 'financeiro', name: 'Financeiro', foot: 'Nenhum real no escuro', screens: [] },
    { id: 'comercial', name: 'Comercial', foot: 'Nenhuma família sem resposta', screens: [] },
    { id: 'marketing', name: 'Marketing', foot: 'Cada festa com a sua origem', screens: [] },
  ];
  const ETAPAS = ['Viu o anúncio', 'Conversa com a Lu', 'Passou para a Ana', 'Pré-reserva', 'Cobrança do sinal', 'Sinal no banco'];
  const state = { mod: 'comercial', screen: 'atendimento', etapa: 5, conv: 'mariana', tabs: {}, flash: false };
  const SCREENS = {};
  let root, modsEl, unitEl, sideEl, mainEl, storyEl, drawerEl;

  /* ---------- gaveta de detalhe, dentro da janela do app ---------- */
  function openDrawer(title, sub, body, opts = {}) {
    clear(drawerEl);
    drawerEl.appendChild(h('div.a-drawer-h',
      h('div', h('h4', { id: 'aDrawerTitle' }, title), sub ? h('p', sub) : null),
      h('button.a-drawer-x', { type: 'button', 'aria-label': 'Fechar o detalhe', onclick: closeDrawer }, '×')));
    GP.appendAll(drawerEl, [body]);
    if (opts.tour) drawerEl.dataset.tour = opts.tour; else delete drawerEl.dataset.tour;
    drawerEl.hidden = false;
    drawerEl.scrollTop = 0;
    if (opts.focus !== false) setTimeout(() => { const x = drawerEl.querySelector('.a-drawer-x'); if (x) x.focus({ preventScroll: true }); }, 30);
  }
  function closeDrawer() {
    if (!drawerEl || drawerEl.hidden) return;
    drawerEl.hidden = true;
    clear(drawerEl);
    mainEl.querySelectorAll('.sel').forEach((e) => e.classList.remove('sel'));
  }
  const drawerOpen = () => !!drawerEl && !drawerEl.hidden;

  /* ---------- montagem e navegação ---------- */
  function mount(el) {
    root = el;
    clear(root);
    modsEl = h('div.a-mods', { role: 'group', 'aria-label': 'Módulos do GlowHub' },
      MODS.map((m) => h('button', { type: 'button', dataset: { mod: m.id }, onclick: () => go(m.id) }, m.name)));
    unitEl = h('span.a-unit');
    sideEl = h('nav.app-side', { 'aria-label': 'Telas do módulo' });
    mainEl = h('div.app-main', { tabindex: '-1' });
    drawerEl = h('aside.a-drawer', { hidden: true, 'aria-labelledby': 'aDrawerTitle' });
    root.appendChild(h('div.app-top',
      h('img', { src: 'assets/img/glow-logo.png', alt: 'Glow Park' }), h('span.a-name', 'GlowHub'), modsEl,
      unitEl, h('span.a-date', 'qui, 05/11'),
      h('span.a-bell', { title: 'Avisos' }, icon('bell')),
      h('span.a-avatar', { title: 'Gestão comercial', 'aria-label': 'Gestão comercial' }, 'GC')));
    root.appendChild(h('div.app-body', sideEl, mainEl));
    root.appendChild(drawerEl);
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape' || !drawerOpen() || (GP.tours && GP.tours.active())) return;
      if (document.querySelector('.modal:not([hidden]), .drawer:not([hidden])')) return;
      e.preventDefault();
      closeDrawer();
    });
    render();
  }
  const screensOf = (m) => m.screens.filter((x) => x.id);
  // keep: o mesmo controle volta a ter o foco depois de redesenhar a tela
  function render(keep) {
    const m = MODS.find((x) => x.id === state.mod) || MODS[1];
    const sc = screensOf(m).find((x) => x.id === state.screen) || screensOf(m)[0];
    state.mod = m.id;
    state.screen = sc.id;
    closeDrawer();
    modsEl.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mod === m.id)));
    unitEl.textContent = typeof sc.unit === 'function' ? sc.unit() : sc.unit || 'Todas as unidades';
    clear(sideEl);
    m.screens.forEach((x) => {
      if (x.group) { sideEl.appendChild(h('div.a-group', x.group)); return; }
      const badge = x.badge ? x.badge() : 0;
      sideEl.appendChild(h('button', { type: 'button', title: x.name, 'aria-current': x.id === sc.id ? 'page' : null, onclick: () => go(m.id, x.id) },
        icon(x.icon), h('span.lbl', x.name), badge ? h('span.a-badge', { 'aria-label': badge + ' ' + (x.badgeLabel || 'esperando') }, String(badge)) : null));
    });
    sideEl.appendChild(h('div.a-side-foot', h('img', { src: 'assets/img/glow-will.png', alt: '' }), h('span', m.foot)));
    clear(mainEl);
    mainEl.appendChild(SCREENS[sc.id]());
    const msgs = mainEl.querySelector('.ib-msgs');
    if (msgs) msgs.scrollTop = msgs.scrollHeight;
    if (keep) {
      const el = mainEl.querySelector(`[data-keep="${keep}"]`);
      if (el) el.focus({ preventScroll: true });
    }
  }
  function go(mod, screen, opts = {}) {
    state.mod = mod;
    const m = MODS.find((x) => x.id === mod) || MODS[1];
    state.screen = screen && screensOf(m).some((x) => x.id === screen) ? screen : screensOf(m)[0].id;
    if (opts.conv) state.conv = opts.conv;
    if (opts.tab) state.tabs[state.screen] = opts.tab;
    if (opts.conv && GP.com) GP.com.resetList();
    render();
    if (opts.after) opts.after();
  }
  // outro arquivo define as telas de um módulo: a lista da lateral (com grupos) e as funções que desenham cada tela
  function defineScreens(modId, defs, fns) {
    const m = MODS.find((x) => x.id === modId);
    m.screens = defs;
    Object.assign(SCREENS, fns);
  }
  function setEtapa(n, opts = {}) {
    const prev = state.etapa;
    state.etapa = Math.max(0, Math.min(ETAPAS.length - 1, n));
    if (state.etapa >= 1 && prev === 0) state.conv = 'mariana';
    state.flash = state.etapa !== prev && !GP.reducedMotion();
    render();
    state.flash = false;
    syncStory();
    if (opts.phone !== false && GP.phone) GP.phone.refresh({ from: prev, play: false });
    if (state.etapa === 5 && prev < 5 && opts.toast !== false) toast('Sinal confirmado pelo banco: R$ 987,00. A oportunidade OP-0412 virou ganha.');
  }

  /* ---------- a barra da história, acima do protótipo ---------- */
  const STORY = [
    ['comercial', 'atendimento'],
    ['comercial', 'atendimento'],
    ['comercial', 'atendimento'],
    ['comercial', 'oportunidades', () => GP.com && GP.com.openOpp('mariana')],
    ['financeiro', 'festas'],
    ['comercial', 'oportunidades'],
  ];
  function mountStory(el) {
    storyEl = el;
    clear(el);
    el.appendChild(h('span', { id: 'storyLabel' }, 'A história da Mariana'));
    el.appendChild(h('ol', { 'aria-labelledby': 'storyLabel' }, ETAPAS.map((t, i) => h('li', h('button', { type: 'button', onclick: () => storyGo(i) }, t)))));
    syncStory();
  }
  function storyGo(i) {
    const prev = state.etapa;
    state.mod = STORY[i][0];
    state.screen = STORY[i][1];
    if (i >= 1) state.conv = 'mariana';
    if (GP.com) GP.com.resetList();
    setEtapa(i, { phone: false });
    if (STORY[i][2]) STORY[i][2]();
    if (GP.phone) GP.phone.show('familia', { from: prev, play: i === prev + 1 });
  }
  function syncStory() {
    if (!storyEl) return;
    storyEl.querySelectorAll('button').forEach((b, i) => {
      b.classList.toggle('done', i < state.etapa);
      b.classList.toggle('last', i === ETAPAS.length - 1);
      if (i === state.etapa) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
    });
  }

  GP.ui = { icon, chip, press, hrow, panel, kpi, stack, toast, pct1, avatar, flashCls, tabs, tabOf, openDrawer, closeDrawer, REDE: 'Todas as unidades' };
  GP.app = { mount, mountStory, go, render, setEtapa, defineScreens, state, ETAPAS };
})();
