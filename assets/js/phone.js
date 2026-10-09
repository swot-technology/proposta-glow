/* O celular ao lado do protótipo: a família (anúncio, WhatsApp e PIX), a gerente (alerta e pedido de devolução),
   a controladoria (aprovação do lote), o cliente da devolução e a diretoria (resumo das 6h) */
(function () {
  const { h, s, clear, fmt } = GP;
  const D = GP.data;
  const F = D.familia;
  const HORA = ['19:41', '19:45', '19:52', '19:56', '19:58', '20:05'];
  let root, screenEl, captionEl, tabsEl, view = 'familia', timers = [];
  const TABS = [['familia', 'Família'], ['gerente', 'Gerente'], ['aprovacao', 'Aprovação'], ['diretoria', 'Diretoria']];
  // a aba que fica marcada em cada tela; o cliente da devolução não tem aba própria
  const TAB_OF = { familia: 'familia', gerente: 'gerente', pedido: 'gerente', aprovacao: 'aprovacao', portal: null, diretoria: 'diretoria' };
  const chk = () => s('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true' }, s('path', { d: 'M5 12.5l4.5 4.5L19 7.5' }));

  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }
  const toBottom = (el) => { el.scrollTop = el.scrollHeight; };

  function mount(el) {
    root = el;
    clear(root);
    root.appendChild(h('div.phone-notch', { 'aria-hidden': 'true' }));
    screenEl = h('div.phone-screen');
    root.appendChild(screenEl);
    captionEl = h('p.phone-caption', { 'aria-live': 'polite' });
    tabsEl = h('div.ph-tabs', { role: 'group', 'aria-label': 'Ver o celular de' },
      TABS.map(([v, label]) => h('button', { type: 'button', dataset: { v }, onclick: () => show(v) }, label)));
    root.after(captionEl, tabsEl);
    show('familia');
  }

  function statusBar(t) { return h('div.ph-status', h('span', t), h('span', '5G  86%')); }
  function head(title, sub, verified) {
    return h('div.ph-head', h('img', { src: 'assets/img/glow-logo-white.png', alt: '' }),
      h('div', h('b', title, verified ? h('span.verified', { title: 'Conta comercial oficial', 'aria-label': 'conta oficial' }) : null), h('span', sub)));
  }

  /* ---------- a família ---------- */
  function anuncio() {
    return {
      feed: true, time: HORA[0], caption: 'Celular da Mariana: o anúncio de verão de Hortolândia',
      body: [
        h('div.ph-feedbar', 'Para você', h('span', 'agora')),
        h('div.ph-body', { style: 'padding:0' },
          h('article.ph-ad',
            h('div.ph-ad-h', h('img', { src: 'assets/img/glow-logo-white.png', alt: '' }), h('div', h('b', 'Glow Park'), h('span', 'Patrocinado'))),
            h('div.ph-ad-art', h('img', { src: 'assets/img/glow-niver.png', alt: 'Personagem da Glow Park em clima de aniversário' }), h('b', F.origem.titulo)),
            h('p', 'Festa com salão exclusivo, buffet e muito pulo na Glow Park Hortolândia. Escolha a data com a gente pelo WhatsApp.'),
            h('button.cta', { type: 'button', onclick: startConversa }, 'Enviar mensagem')),
          h('div.ph-ad-next', { 'aria-hidden': 'true' })),
      ],
    };
  }
  function startConversa() {
    GP.app.go('comercial', 'atendimento', { conv: 'mariana' });
    GP.app.setEtapa(1, { phone: false });
    show('familia', { from: 0, play: true });
  }
  function refCard() {
    // a mensagem que nasce de um anúncio chega com a prévia dele: é assim que a origem entra na conversa
    return h('div.ref', h('img', { src: 'assets/img/glow-niver.png', alt: '' }), h('div', h('b', 'Glow Park'), h('span', 'Anúncio: ' + F.origem.titulo)));
  }
  // no WhatsApp, tudo chega da conta da Glow Park: a Lu e a Ana se apresentam no texto
  function bubble(m, first, paid) {
    if (m.who === 'in') return h('div.bub.me', first ? refCard() : null, m.t, h('time', m.h));
    if (m.who === 'central' && m.kind === 'cobranca') return pixMsg(m, paid);
    return h('div.bub', m.t, h('time', m.h));
  }
  // a cobrança do Financeiro, com o texto do sistema; o botão simula a família pagando no app do banco
  function pixMsg(m, paid) {
    const btn = h('button.ph-pay', { type: 'button', disabled: paid || null, onclick: pay }, paid ? 'Pago no app do banco às 20:02' : 'Copiar o código e pagar');
    return h('div.bub', m.t, h('br'), h('br'), 'PIX copia e cola (o pagamento é identificado sozinho, não precisa mandar comprovante):',
      h('code.ph-pix-code', '00020126580014BR.GOV.BCB.PIX0136…GLOW' + F.orc + 'S…6304A1F3'), btn, h('time', m.h));
  }
  function pay(ev) {
    const b = ev.currentTarget;
    b.disabled = true;
    b.textContent = 'Pagando…';
    later(() => {
      // o banco avisa o GlowHub; o Financeiro mostra a confirmação na mesma hora
      GP.app.go('financeiro', 'festas');
      GP.app.setEtapa(5, { phone: false });
      show('familia', { from: 4, play: true });
    }, GP.reducedMotion() ? 0 : 900);
  }
  function familia(o) {
    const e = GP.app.state.etapa;
    if (e === 0) return anuncio();
    const items = [];
    D.conversa.filter((m) => m.etapa <= e && ['in', 'ai', 'out', 'central'].includes(m.who)).forEach((m, i) => {
      items.push({ etapa: m.etapa, who: m.who, el: bubble(m, i === 0, e >= 5) });
    });
    const body = h('div.ph-body', items.map((x) => x.el));
    if (o.play && o.from != null && !GP.reducedMotion()) animate(body, items.filter((x) => x.etapa > o.from));
    return {
      time: HORA[e],
      caption: e >= 5 ? 'Celular da Mariana: a festa da Alice está garantida' : 'Celular da Mariana, no WhatsApp oficial da Glow Park',
      body: [head('Glow Park', 'conta comercial oficial', true), body],
    };
  }
  // as mensagens novas chegam uma a uma; a Lu e a Ana "digitam" antes
  function animate(body, list) {
    list.forEach((x) => { x.el.hidden = true; });
    let t = 300;
    list.forEach((x) => {
      if (x.who === 'in' || x.who === 'central') {
        later(() => { body.appendChild(x.el); x.el.hidden = false; toBottom(body); }, t);
        t += 650;
      } else {
        const dots = h('div.typing', { 'aria-hidden': 'true' }, h('i'), h('i'), h('i'));
        later(() => { body.appendChild(dots); toBottom(body); }, t);
        t += 750;
        later(() => { dots.remove(); body.appendChild(x.el); x.el.hidden = false; toBottom(body); }, t);
        t += 450;
      }
    });
  }

  /* ---------- a diretoria: o resumo das 6h, com as linhas do sistema ---------- */
  function diretoria() {
    const FN = D.fin;
    const receber = FN.agenda.reduce((acc, x) => acc + x.Rede + x.Stone + x.Getnet, 0);
    const vendido = FN.canais.reduce((acc, c) => acc + c[1], 0);
    const V = FN.vendas;
    const lines = [
      `Vendido: ${fmt.brl(vendido)} em ${fmt.int(V.total)} vendas; 98,7% conferido com adquirente e banco.`,
      `ERPFLEX: 99,7% das vendas; ${V.reenviadasOk} reenviadas sozinhas, ${V.comEquipe} com a equipe.`,
      `A receber em 30 dias: ${fmt.brl(receber)}.`,
      `Adiantamentos de clientes: festas ${fmt.brl(FN.festas.adiantamentos)}, site ${fmt.brl(FN.site.saldo)}.`,
      `Tratativas abertas: ${FN.tratativas.length}.`,
      'Crédito a menor da Stone em Goiânia: R$ 3.411,80.',
      'Aprovar o lote de devoluções de hoje: R$ 1.299,70.',
    ];
    return {
      time: '06:05', caption: 'Celular da diretoria: o resumo das 6h, no WhatsApp',
      body: [
        head('GlowHub', 'resumo diário da rede'),
        h('div.ph-body',
          h('div.bub', h('b', 'Bom dia! Resumo de quarta, 04/11/2026:'), lines.map((l) => [h('br'), '• ' + l]), h('br'), h('br'), 'Detalhes: glowhub.glowpark.com.br',
            h('button.bl', { type: 'button', onclick: () => GP.app.go('financeiro', 'visao') }, 'Abrir no GlowHub'),
            h('time', '06:05')),
          h('div.bub.me', 'Obrigado. Vejo Goiânia com o financeiro às 9h.', h('time', '06:41'))),
      ],
    };
  }

  /* ---------- o Financeiro no celular ---------- */
  function gerente() {
    return {
      time: '08:17', caption: 'Celular da gerente de Barra Funda',
      body: [
        head('GlowHub', 'alertas de Barra Funda'),
        h('div.ph-body',
          h('div.bub', h('b', 'Bom dia, Priscila.'), ' Barra Funda vendeu R$ 9.870 ontem. Tudo conferido, com uma exceção.', h('time', '06:04')),
          h('div.bub', h('b', 'Venda PIX cobrada a menos'), h('br'), 'Venda P4-482167, às 16:05, operador Diego.', h('br'),
            'Vendido: R$ 179,80. Cobrado no PIX: R$ 149,80.', h('br'), 'Uma meia foi incluída com o QR Code já aberto.',
            h('button.bl', { type: 'button', onclick: () => GP.fin.openSaleFromAnywhere('P4-482167') }, 'Ver a venda'), h('time', '06:04')),
          h('div.bub.me', 'Vou conversar com o Diego hoje. Pode registrar como perda.', h('time', '08:16')),
          h('div.bub', 'Registrado. É a 2ª ocorrência do Diego no mês.', h('time', '08:17'))),
      ],
    };
  }
  function pedido(o) {
    const d = D.fin.devs.find((x) => x.id === 'DEV-931');
    const fields = [['Cliente', d.cliente], ['Venda no site', d.venda], ['Valor', fmt.brl(d.valor)], ['Motivo', d.motivo], ['Como devolver', 'Estorno no cartão da compra']];
    const animate = o.play && !GP.reducedMotion();
    const els = fields.map(([k, v]) => { const val = h('div', animate ? '' : v); return { v, val, el: h('div.ph-field', h('span', k), val) }; });
    const ok = h('div.ph-ok', { hidden: animate || null }, chk(), h('span', 'Venda localizada, sem devolução anterior. Motivo pré-aprovado: entra no lote de hoje.'));
    const send = h('button.ph-btn', { type: 'button', hidden: animate || null, onclick: () => {
      send.textContent = 'Pedido enviado';
      send.classList.add('ok');
      send.disabled = true;
      if (GP.toast) GP.toast('O pedido DEV-931 entrou na fila única, no lote de hoje.');
    } }, 'Enviar o pedido');
    if (animate) {
      let t = 300;
      els.forEach((f) => {
        later(() => { f.val.classList.add('typing-in'); }, t);
        later(() => { f.val.textContent = f.v; f.val.classList.remove('typing-in'); }, t + 420);
        t += 560;
      });
      later(() => { ok.hidden = false; send.hidden = false; }, t + 150);
    }
    return {
      time: '15:12', top: true, caption: 'Celular da gerente Priscila: um pedido de devolução',
      body: [head('GlowHub', 'devolução, Barra Funda'), h('div.ph-body', h('div.ph-card', h('h4', 'Nova devolução'), els.map((f) => f.el), ok, send))],
    };
  }
  function aprovacao() {
    const L = GP.fin.loteInfo(), lote = GP.fin.state.lote;
    const approved = lote === 'aprovado' || lote === 'efetivado';
    const card = lote === 'aberto'
      ? [h('h4', 'Lote de hoje'), h('p', `${L.n} pedidos até agora, ${fmt.brl(L.v)}. O lote fecha às 16h e chega aqui para a sua aprovação.`)]
      : [
        h('h4', 'Lote de hoje'),
        h('div.ph-big', approved ? 'Aprovado' : fmt.brl(L.v)),
        h('p', approved ? 'Devolução liberada para o financeiro.' : `${L.n} pedidos de ${L.units} unidades. Quem validou não aprova.`),
        approved ? null : h('div.ph-list', L.list.slice(0, 5).map((d) => h('div.ph-row', h('span', d.cliente.split(' ')[0] + ', ' + d.unit), h('b', fmt.brl(d.valor)))),
          L.n > 5 ? h('div.ph-row', h('span', '+ ' + (L.n - 5) + ' pedidos'), h('b', '')) : null),
        h('button.ph-btn', { type: 'button', class: approved ? 'ok' : null, disabled: approved || null, onclick: () => GP.fin.approveLote() }, approved ? 'Lote aprovado' : 'Aprovar o lote'),
        approved ? null : h('button.ph-btn.ghost', { type: 'button', onclick: () => { if (GP.toast) GP.toast('Os motivos e os anexos de cada pedido abrem aqui.'); } }, 'Ver motivos e anexos'),
      ];
    return { time: '16:02', top: true, caption: 'Celular da controladoria, quem aprova', body: [head('GlowHub', 'aprovações'), h('div.ph-body', h('div.ph-card', card))] };
  }
  function portal() {
    const d = D.fin.devs.find((x) => x.id === 'DEV-931');
    const lote = GP.fin.state.lote;
    const done = lote === 'efetivado', appr = done || lote === 'aprovado';
    const step = (cls, n, t, sub) => h('li', { class: cls }, h('i', cls === 'done' ? chk() : String(n)), h('div', h('b', t), h('span', sub)));
    return {
      time: '16:40', top: true, caption: 'Celular da cliente: o link recebido no WhatsApp',
      body: [
        h('div.ph-portal-h', h('img', { src: 'assets/img/glow-logo-white.png', alt: 'Glow Park' })),
        h('div.ph-body',
          h('div.ph-card', h('h4', 'Sua devolução'), h('p', d.id + ', ' + d.motivo.toLowerCase()), h('div.ph-big', fmt.brl(d.valor)),
            h('ol.ph-steps',
              step('done', 1, 'Pedido registrado', 'hoje às ' + d.hora + ', na unidade'),
              step('done', 2, 'Conferido', 'a compra em dobro foi confirmada'),
              step(appr ? 'done' : 'now', 3, 'Aprovado', appr ? 'hoje às 16:02' : 'previsto para hoje às 16h'),
              step(done ? 'done' : '', 4, 'Estorno no seu cartão', done ? 'feito hoje; aparece na fatura em até 2 ciclos' : 'no mesmo dia da aprovação'))),
          h('p.ph-note', 'Você recebe cada atualização no WhatsApp.')),
      ],
    };
  }

  // desenho de um QR Code (ilustrativo, não é escaneável)
  // seed: um texto (o código do link) ou nada; o desenho muda com ele
  function qr(seed) {
    let n0 = 48213;
    for (const ch of String(seed || '')) n0 = (n0 * 31 + ch.charCodeAt(0)) % 2147483647;
    const R = GP.rng(n0), n = 25, c = 6;
    const g = s('svg', { viewBox: `0 0 ${n * c} ${n * c}`, role: 'img', 'aria-label': 'QR Code ilustrativo' });
    g.appendChild(s('rect', { width: n * c, height: n * c, fill: '#fff' }));
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      const inFinder = (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9);
      if (!inFinder && R() < 0.47) g.appendChild(s('rect', { x: x * c, y: y * c, width: c, height: c, fill: '#0E1A3A' }));
    }
    [[0, 0], [n - 7, 0], [0, n - 7]].forEach(([x, y]) => {
      g.appendChild(s('rect', { x: x * c, y: y * c, width: 7 * c, height: 7 * c, fill: '#0E1A3A' }));
      g.appendChild(s('rect', { x: (x + 1) * c, y: (y + 1) * c, width: 5 * c, height: 5 * c, fill: '#fff' }));
      g.appendChild(s('rect', { x: (x + 2) * c, y: (y + 2) * c, width: 3 * c, height: 3 * c, fill: '#0E1A3A' }));
    });
    return g;
  }

  function show(v, o = {}) {
    clearTimers();
    view = v;
    const sc = ({ diretoria, gerente, aprovacao, portal, pedido: () => pedido(o) }[v] || (() => familia(o)))();
    clear(screenEl);
    screenEl.classList.toggle('feed', !!sc.feed);
    screenEl.appendChild(statusBar(sc.time));
    sc.body.forEach((b) => screenEl.appendChild(b));
    captionEl.textContent = sc.caption;
    tabsEl.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.v === TAB_OF[v])));
    const body = screenEl.querySelector('.ph-body');
    if (body && !sc.feed && !sc.top) toBottom(body);
  }
  function refresh(o) { if (view === 'familia') show('familia', o || {}); }

  GP.phone = { mount, show, refresh, view: () => view, qr: (seed) => qr(seed) };
})();
