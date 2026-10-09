/* O Comercial do GlowHub, como no sistema: Painel, Atendimento, Oportunidades, Agenda de festas, Clientes,
   Vendedores IA e Configuração comercial. A história da Mariana muda a conversa, a oportunidade e a agenda. */
(function () {
  const { h, fmt } = GP;
  const { icon, chip, press, hrow, panel, kpi, stack, toast, pct1, avatar, flashCls, tabs, tabOf, openDrawer, closeDrawer } = GP.ui;
  const D = GP.data;
  const F = D.familia;
  const A = () => GP.app.state;
  const E = () => GP.app.state.etapa;
  const go = (screen, opts) => GP.app.go('comercial', screen, opts);
  const brl0 = fmt.brl0;
  const nf = (v) => fmt.int(v);
  const btn = (label, fn, cls) => h('button.a-btn' + (cls ? '.' + cls : ''), { type: 'button', onclick: fn }, label);
  const link = (label, fn) => h('button.a-link', { type: 'button', onclick: fn }, label);
  const tbl = (head, body, right = []) => h('div.a-scroll', h('table.a-table',
    h('thead', h('tr', head.map((c, j) => h('th', { class: right.includes(j) ? 'r' : null }, c)))), h('tbody', body)));
  const stageKind = (st) => (st === 'Ganha' ? 'good' : st === 'Perdida' ? 'muted' : 'stage');

  /* =========================================================
     Atendimento
     ========================================================= */
  // a aba e os filtros da lista ficam até a pessoa mudar; abrir uma conversa de fora volta para Todas
  const list = {};
  function resetList() { Object.assign(list, { tab: 'todas', etapa: '', origem: '', dono: '', numero: '', esperando: false, naoLidas: false, encerradas: false }); }
  resetList();

  function marianaRow() {
    const e = E();
    if (e < 1) return null;
    const base = { id: 'mariana', nome: F.nome, ini: F.ini, unidade: F.unidade, numero: 'Vendas', origem: 'Meta Ads' };
    if (e === 1) return { ...base, dono: 'ia', fase: 'Qualificação', etapa: 'Nova', prev: 'Quero sim!', h: '19:45' };
    if (e === 2) return { ...base, dono: 'Ana Lima', etapa: 'Qualificada', prev: 'Ana: Oi, Mariana! Sou a Ana, da Glow Park Hortolândia…', h: '19:52' };
    if (e <= 4) return { ...base, dono: 'Ana Lima', etapa: 'Proposta', prev: 'Ana: Pronto, pré-reservei pra você até sábado, 07/11…', h: '19:56' };
    return { ...base, dono: 'Ana Lima', etapa: 'Ganha', prev: 'Ana: Tudo certo, Mariana! A festa da Alice está garantida 🎈', h: '20:05' };
  }
  // como no sistema: a conversa com prioridade fica no alto da lista
  const rows = () => { const m = marianaRow(); const all = m ? [m, ...D.inbox] : D.inbox.slice(); return all.filter((r) => r.prioridade).concat(all.filter((r) => !r.prioridade)); };
  const TABS = [['minhas', 'Minhas'], ['fila', 'Fila'], ['ia', 'Com a IA'], ['todas', 'Todas']];
  const inTab = (r, t) => (t === 'minhas' ? r.dono === 'Gestão comercial' : t === 'fila' ? r.dono === 'fila' : t === 'ia' ? r.dono === 'ia' : true);
  function filtered() {
    return rows().filter((r) => inTab(r, list.tab)
      && (!list.etapa || r.etapa === list.etapa)
      && (!list.origem || r.origem === list.origem)
      && (!list.dono || (list.dono === 'ia' || list.dono === 'fila' ? r.dono === list.dono : r.dono === list.dono))
      && (!list.numero || r.numero === list.numero)
      && (!list.esperando || !!r.espera)
      && (!list.naoLidas || !!r.unread)
      && !list.encerradas);
  }
  const ownerText = (r) => (r.dono === 'ia' ? 'IA • ' + r.fase : r.dono === 'fila' ? r.fila : r.dono);
  function rowEl(r) {
    const on = r.id === A().conv;
    return h('div.ib-row', {
      class: [on ? 'on' : '', r.id === 'mariana' ? flashCls() : ''].filter(Boolean).join(' ') || null,
      'aria-current': on ? 'true' : null, dataset: { keep: 'row-' + r.id },
      ...press(() => { A().conv = r.id; GP.app.render('row-' + r.id); }),
    },
    avatar(r.ini, r.dono === 'ia'),
    h('div.ib-r',
      h('div.ib-r1', h('b', r.nome), h('time', r.h)),
      h('div.ib-r2', h('span.ib-prev', r.prev), r.unread ? h('span.ib-unread', String(r.unread)) : null),
      h('div.ib-r3', r.prioridade ? h('span.ib-prio', 'Prioridade') : null, h('span', ownerText(r) + ' • ' + (r.unidade || 'Unidade a definir')), r.etapa ? chip(stageKind(r.etapa), r.etapa) : null),
      r.espera ? h('div.ib-r4', chip(r.espera[0], r.espera[1])) : null));
  }
  function selectF(key, first, opts) {
    return h('select.a-select', { 'aria-label': first, dataset: { keep: 'f-' + key }, onchange: (e) => { list[key] = e.target.value; GP.app.render('f-' + key); } },
      h('option', { value: '' }, first), opts.map(([v, l]) => h('option', { value: v, selected: list[key] === v || null }, l)));
  }
  function checkF(key, label) {
    return h('label.a-check', h('input', { type: 'checkbox', checked: list[key] || null, dataset: { keep: 'c-' + key }, onchange: (e) => { list[key] = e.target.checked; GP.app.render('c-' + key); } }), label);
  }
  function scrAtendimento() {
    const all = rows();
    if (!all.some((r) => r.id === A().conv)) A().conv = all[0].id;
    const shown = filtered();
    const count = (t) => all.filter((r) => inTab(r, t)).length;
    const empty = list.encerradas || list.etapa || list.origem || list.dono || list.numero || list.esperando || list.naoLidas
      ? h('div.ib-empty', h('p', 'Nenhuma conversa com estes filtros.'), btn('Limpar filtros', () => { const t = list.tab; resetList(); list.tab = t; GP.app.render(); }))
      : h('div.ib-empty', h('p', list.tab === 'minhas' ? 'Nenhuma conversa com você agora.' : list.tab === 'fila' ? 'A fila está vazia.' : 'Nenhuma conversa aqui.'));
    const listEl = h('section.a-panel.ib-list', { 'aria-label': 'Conversas' },
      h('div.ib-tabs', { role: 'tablist', 'aria-label': 'Conversas' },
        TABS.map(([id, label]) => h('button', { type: 'button', role: 'tab', 'aria-selected': String(list.tab === id), dataset: { keep: 'tab-' + id }, onclick: () => { list.tab = id; GP.app.render('tab-' + id); } },
          label, id !== 'todas' && count(id) ? h('span.ib-n', String(count(id))) : null))),
      h('div.ib-filters',
        h('div.a-input', icon('search'), h('span', 'Nome ou 4 últimos dígitos')),
        h('div.ib-sel',
          selectF('etapa', 'Todas as etapas', D.opps.cols.concat(['Ganha']).map((x) => [x, x])),
          selectF('origem', 'Todas as origens', ['Meta Ads', 'Google Ads', 'Redes sociais', 'Site', 'QR na unidade', 'Base de clientes', 'Indicação', 'Desconhecida'].map((x) => [x, x])),
          selectF('dono', 'Todos os donos', [['ia', 'IA'], ['fila', 'Sem dono (na fila)'], ['Ana Lima', 'Ana Lima'], ['Bruno Costa', 'Bruno Costa']]),
          selectF('numero', 'Todos os números', [['Vendas', 'Vendas'], ['SAC', 'SAC']])),
        h('div.ib-checks', checkF('esperando', 'Esperando resposta'), checkF('naoLidas', 'Não lidas'), checkF('encerradas', 'Encerradas'))),
      h('div.ib-rows', shown.length ? shown.map(rowEl) : empty));
    const r = all.find((x) => x.id === A().conv);
    return h('div', hrow('Atendimento', null), h('div.inbox', listEl, convEl(r)));
  }

  /* ---------- a conversa aberta ---------- */
  function msgEl(m) {
    if (m.who === 'handoff') {
      return h('div.handoff', h('b', 'A IA passou a conversa: ' + m.motivo + '.'), h('p', m.t),
        h('div.handoff-a', btn('Resumo certo', () => toast('Obrigado: a avaliação do resumo melhora as próximas passagens.')), btn('Resumo errado', () => toast('Marcado: o resumo errado vira um cenário de avaliação da Lu.'))));
    }
    if (m.who === 'sys') return h('div.msg.sys', h('span', m.t), h('time', m.h));
    if (m.who === 'note') return h('div.msg.note', h('small', 'Nota interna'), m.t, h('time', m.h));
    const tool = m.tool ? m.tool.charAt(0).toUpperCase() + m.tool.slice(1) : null;
    const who = m.who === 'ai' ? h('small', h('span.ia-b', 'IA'), ' Vendedor IA') : m.who === 'out' ? h('small', m.autor || 'Ana Lima') : null;
    return h('div.msg.' + m.who, who, m.t, tool ? h('span.tool', icon('spark'), ' ', tool) : null, h('time', m.h));
  }
  function msgsOf(r) {
    if (r.id === 'mariana') return D.conversa.filter((m) => m.etapa <= E() && m.who !== 'central');
    return (D.outras[r.id] || []).map(([who, t, hh, extra]) => (who === 'handoff' ? { who, t, h: hh, motivo: extra } : { who, t, h: hh, tool: extra, autor: who === 'out' ? (r.dono === 'Bruno Costa' ? 'Bruno Costa' : 'Ana Lima') : null }));
  }
  function convActions(r) {
    if (r.id === 'mariana' && E() === 1) {
      return [btn('Assumir a conversa', () => { GP.app.setEtapa(2); toast('A conversa passou para a Ana Lima, com o resumo da Lu.'); }, 'ink'), btn('Transferir', () => toast('Transferir: para outra fila ou outra pessoa, com o motivo.')), btn([icon('clock'), 'Agendar retorno'], () => toast('O retorno agendado aparece no acompanhamento da conversa.')), btn('Encerrar', () => toast('Encerrar pede o resultado: resolvido, retorno agendado, perdido, sem resposta ou engano.')), btn([icon('spark'), 'Turnos da IA'], () => toast('Turnos da IA: cada resposta da Lu, com as ferramentas que ela usou e o custo.')), fichaBtn(r)];
    }
    const own = r.dono === 'ia'
      ? [btn('Assumir a conversa', () => toast('Na demonstração, a conversa segue com a Lu.'), 'ink'), btn([icon('spark'), 'Turnos da IA'], () => toast('Turnos da IA: cada resposta da Lu, com as ferramentas que ela usou e o custo.'))]
      : r.dono === 'fila' ? [btn('Pegar da fila', () => toast('Na demonstração, a conversa segue na fila.'), 'ink')]
        : [btn('Assumir a conversa', () => toast('Assumir passa a conversa para você, com registro na auditoria.'), 'ink'), btn('Devolver para a IA', () => toast('Devolver para a IA: a Lu retoma com o histórico.'))];
    return own.concat([btn('Transferir', () => toast('Transferir: para outra fila ou outra pessoa, com o motivo.')), btn([icon('clock'), 'Agendar retorno'], () => toast('O retorno agendado aparece no acompanhamento da conversa.')), btn('Encerrar', () => toast('Encerrar pede o resultado: resolvido, retorno agendado, perdido, sem resposta ou engano.')), fichaBtn(r)]);
  }
  const fichaBtn = (r) => h('button.a-btn', { type: 'button', 'data-tour': 'ficha-btn', onclick: () => openFicha(r) }, icon('user'), 'Ficha');
  function convEl(r) {
    const e = E();
    const isM = r.id === 'mariana';
    const fone = isM ? F.fone : (D.clientes.find((c) => c[0] === r.nome) || [null, '(11) *****-0000'])[1];
    const owner = r.dono === 'ia' ? 'Com a IA • ' + r.fase : r.dono === 'fila' ? 'Na fila ' + r.fila : 'Com ' + r.dono;
    const janela = isM ? (e >= 3 ? 'Janela fecha 06/11 às 19:55' : 'Janela fecha 06/11 às 19:45') : 'Janela fecha 06/11 às ' + r.h;
    const acomp = r.acomp ? h('div.acomp', h('b', icon('clock'), ' Acompanhamento'),
      r.acomp.map(([st, t, d]) => h('div.acomp-r', chip('info', st, 'sync'), h('div', h('span', t), h('small', d)), btn('Cancelar', () => toast('Acompanhamento cancelado.'))))) : null;
    return h('section.a-panel.ib-conv', { 'data-tour': 'conv', 'aria-label': 'Conversa com ' + r.nome },
      h('div.ib-conv-h',
        h('b.ib-name', r.nome),
        h('div.ib-meta', fone + ' • Número de ' + r.numero + ' • ', h('b', owner), ' • ' + janela),
        h('div.ib-meta', r.unidade ? 'Unidade ' + r.unidade : 'Unidade a definir'),
        link('+ Etiquetar', () => toast('As etiquetas viram filtro no atendimento.')),
        h('div.ib-acts', convActions(r))),
      acomp,
      h('div.ib-msgs', h('span.ib-day', 'Hoje'), msgsOf(r).map(msgEl)),
      h('div.compose',
        h('div.compose-t', h('button', { type: 'button', 'aria-pressed': 'true' }, 'Responder'), h('button', { type: 'button', 'aria-pressed': 'false', onclick: () => toast('A nota interna só a equipe vê; @nome avisa um colega.') }, 'Nota interna')),
        h('div.compose-r', h('span.compose-i', icon('clip')), h('span.compose-i', icon('mic')), h('div.compose-f', 'Escreva a mensagem (/ para respostas rápidas)'), h('span.compose-s', icon('send'), 'Enviar'))));
  }

  /* ---------- a ficha, ao lado da conversa ---------- */
  function festaFields() {
    return [['Unidade', F.unidade], ['Data', 'sáb, 14/11'], ['Horário preferido', 'tarde'], ['Crianças pulando', String(F.pulantes)], ['Convidados', String(F.convidados)], ['Aniversariante', F.crianca + ', ' + F.idade + ' anos'], ['Pacote de interesse', F.pacote], ['Momento', 'quer fechar']];
  }
  const kv = (pairs) => h('div.a-kv', pairs.map(([k, v]) => [h('span', k), h('div', v)]));
  // a ficha da conversa: no sistema, o botão Ficha abre o painel ao lado da conversa
  function openFicha(r) {
    if (!r) r = rows().find((x) => x.id === A().conv) || rows()[0];
    openDrawer('Ficha', r.nome, r.id === 'mariana' ? fichaMariana() : fichaOutra(r), { tour: 'ficha' });
  }
  function fichaMariana() {
    const e = E();
    const st = marianaRow().etapa;
    const lune = e >= 5 ? chip('navy', 'Lune', 'cake') : e >= 3 ? chip('warn', 'Lune', 'clock') : chip('good', 'Lune', 'check');
    return [
      h('section.a-sec', h('h5', 'Contato'), h('div.a-kv', h('span', 'Telefone'), h('div', F.fone, ' ', link('Revelar', () => toast('Revelar o telefone pede a permissão e fica na auditoria. O vendedor não vê o número inteiro.'))))),
      h('section.a-sec', { 'data-tour': 'festa-ficha' }, h('h5', 'Festa ' + F.op, ' ', chip(stageKind(st), st)), kv(festaFields()), h('div.a-actions-row.flush', btn('Abrir a oportunidade', () => openOpp('mariana')))),
      h('section.a-sec', h('h5', 'Disponibilidade em sábado, 14/11, Hortolândia'), h('div.slots', h('span.slot-t', '14:00 às 17:00'), chip('navy', 'Will', 'cake'), lune)),
      h('section.a-sec', { 'data-tour': 'origem' }, h('h5', 'Origem'), h('p', h('b', 'Anúncio Meta Ads: '), F.origem.campanha), h('p.a-muted', 'Anúncio: ' + F.origem.anuncio)),
      h('section.a-sec', h('h5', 'Aniversariantes'), h('p', 'Alice, 7 anos: aniversário em 14/11')),
      h('section.a-sec', h('h5', 'Festas e pagamentos'), h('p', e >= 5 ? 'Sinal de R$ 987,00 confirmado pelo banco às 20:03.' : e >= 4 ? 'Cobrança do sinal enviada: R$ 987,00.' : 'Nenhuma festa anterior.')),
      h('section.a-sec', h('h5', 'Consentimentos'), h('p', 'Atendimento: sim, pela conversa de 05/11.'), h('p.a-muted', 'Novidades e promoções: não pediu.')),
    ];
  }
  function fichaOutra(r) {
    const op = D.opps.abertas.find((o) => o.nome === r.nome) || D.opps.encerradas.find((o) => o.nome === r.nome);
    const fone = (D.clientes.find((c) => c[0] === r.nome) || [null, '(11) *****-0000'])[1];
    return [
      h('section.a-sec', h('h5', 'Contato'), h('div.a-kv', h('span', 'Telefone'), h('div', fone, ' ', link('Revelar', () => toast('Revelar o telefone pede a permissão e fica na auditoria.'))))),
      op ? h('section.a-sec', h('h5', 'Festa ' + op.op, ' ', chip(stageKind(r.etapa || 'Nova'), r.etapa || 'Nova')), h('p', op.unidade + (op.info ? ' • ' + op.info : '')), h('div.a-actions-row.flush', btn('Abrir a oportunidade', () => openOpp(op.op))))
        : h('section.a-sec', h('h5', 'Festa'), h('p.a-muted', 'Nenhuma festa em negociação.'), h('div.a-actions-row.flush', btn('Abrir oportunidade', () => toast('A oportunidade nasce ligada à conversa e à origem.')))),
      h('section.a-sec', h('h5', 'Origem'), r.origem === 'Desconhecida'
        ? [chip('muted', 'Origem desconhecida', 'info'), h('div.a-select.static', { style: 'margin-top:8px' }, 'Como conheceu a Glow Park…')]
        : h('p', h('b', r.origem === 'QR na unidade' ? 'Link Balcão Hortolândia (GP-H7K2)' : r.origem === 'Redes sociais' ? 'Link Bio do Instagram (GP-3W5Y)' : 'Anúncio ' + r.origem + ': '), r.origem === 'Meta Ads' || r.origem === 'Google Ads' ? (r.origem === 'Meta Ads' ? 'festas_conversas_hortolandia_202611' : 'festas_busca_rede_202611') : '')),
    ];
  }

  /* =========================================================
     Oportunidades
     ========================================================= */
  function marianaOpp() {
    const e = E();
    if (e < 1) return null;
    const col = e === 1 ? 0 : e === 2 ? 2 : 3;
    return { op: F.op, nome: F.nome, unidade: F.unidade, info: 'sáb, 14/11 • 60 convidados', dono: e === 1 ? 'Com a IA' : 'Ana Lima', col, momento: e >= 2 ? 'quer fechar' : null, orc: e >= 3 ? F.orc : null, pre: e >= 3 && e <= 4, mine: true, ganha: e >= 5 };
  }
  function scrOportunidades() {
    const m = marianaOpp();
    const abertas = D.opps.abertas.slice();
    if (m && !m.ganha) abertas.unshift(m);
    const card = (o) => h('div.kb-card.click', { class: [o.mine ? 'hl' : '', o.mine ? flashCls() : ''].filter(Boolean).join(' ') || null, 'data-tour': o.mine ? 'kb-mariana' : null, ...press(() => openOpp(o.mine ? 'mariana' : o.op)) },
      h('div.kb-top', h('b', o.nome), h('span.kb-code', o.op)),
      h('span.kb-info', o.unidade + (o.info ? ' • ' + o.info : '')),
      h('span.kb-info.muted', [o.dono, o.momento, o.orc ? 'orçamento ' + o.orc : null].filter(Boolean).join(' • ')),
      o.pre ? chip('warn', 'Horário pré-reservado', 'clock') : null);
    const closed = D.opps.encerradas.slice();
    if (m && m.ganha) closed.unshift({ op: F.op, nome: F.nome, unidade: F.unidade, res: ['good', 'Ganha 05/11'], mine: true });
    return h('div',
      hrow('Oportunidades', 'Cada festa em negociação, da primeira mensagem ao sinal. Ganha só quando o Financeiro confirma o sinal do orçamento ligado.',
        h('div.a-input.sm', icon('search'), h('span', 'Nome ou OP-0000')), h('label.a-check', h('input', { type: 'checkbox' }), 'Só as minhas')),
      h('div.kanban', { 'data-tour': 'kanban' }, D.opps.cols.map((name, i) => {
        const cs = abertas.filter((o) => o.col === i);
        return h('div.kb-col', { role: 'group', 'aria-label': name + ', ' + cs.length }, h('h5', name, h('b', String(cs.length))), cs.length ? cs.map(card) : h('p.kb-more', 'Nenhuma.'));
      })),
      panel({ style: 'margin-top:12px' }, 'Encerradas nos últimos 30 dias', null,
        tbl(['Oportunidade', 'Família', 'Unidade', 'Resultado'], closed.map((o) => h('tr.click', { class: [o.mine ? 'hl' : '', o.mine ? flashCls() : ''].filter(Boolean).join(' ') || null, 'data-tour': o.mine ? 'kb-ganha' : null, ...press(() => openOpp(o.mine ? 'mariana' : o.op)) },
          h('td', h('b', o.op)), h('td', o.nome), h('td', o.unidade), h('td', chip(o.res[0], o.res[1], o.res[0] === 'good' ? 'check' : 'info'))))) ));
  }
  // a gaveta da oportunidade: a festa, o orçamento do Scale, a pré-reserva, as etapas e o histórico
  function openOpp(id) {
    if (id !== 'mariana') {
      const o = D.opps.abertas.find((x) => x.op === id) || D.opps.encerradas.find((x) => x.op === id);
      if (!o) return;
      openDrawer(o.op + ' • ' + o.nome, o.unidade, [
        h('section.a-sec', h('h5', 'A festa'), kv([['Unidade', o.unidade], ['Data e convidados', o.info || '—'], ['Com', o.dono || '—']])),
        h('section.a-sec', h('h5', 'Orçamento do Scale'), o.orc ? h('p', 'Orçamento ' + o.orc + ' ligado: aguardando o sinal.') : h('p.a-muted', 'Nenhum orçamento ligado ainda.')),
        o.res ? h('section.a-sec', h('h5', 'Resultado'), chip(o.res[0], o.res[1])) : h('section.a-sec', h('h5', 'Avançar ou encerrar'), h('div.a-actions-row', ['Qualificada', 'Proposta', 'Negociação'].map((s) => btn(s, () => toast('Na demonstração, as outras oportunidades não mudam de etapa.'))), btn('Marcar como perdida', () => toast('Marcar como perdida pede o motivo.')))),
      ]);
      return;
    }
    const e = E();
    const st = marianaRow() ? marianaRow().etapa : 'Nova';
    const hist = [['05/11 19:42', 'Criada pela IA, com a origem Anúncio Meta Ads'], e >= 2 ? ['05/11 19:45', 'Qualificada: a IA passou para Ana Lima'] : null, e >= 3 ? ['05/11 19:55', 'Proposta: horário pré-reservado e orçamento 48213 ligado'] : null, e >= 4 ? ['05/11 19:58', 'Cobrança do sinal enviada pelo Financeiro'] : null, e >= 5 ? ['05/11 20:03', 'Ganha: sinal confirmado pelo banco'] : null].filter(Boolean);
    const orc = e >= 3
      ? h('div', h('p', h('b', 'Orçamento 48213'), ' ligado'), e >= 5 ? chip('good', 'Sinal confirmado') : chip('warn', 'Aguardando o sinal'))
      : h('div', h('div.a-input.static', 'Número do orçamento'), h('p.a-muted', 'Sugestão: orçamento 48213, ', h('span.chip.info.sm', 'Mesmo telefone'), ' ', link('Ligar', () => { GP.app.setEtapa(3); openOpp('mariana'); toast('Orçamento 48213 ligado e horário pré-reservado.'); })));
    const pre = e >= 5
      ? h('p', 'Reservado: sáb, 14/11, 14:00 às 17:00, Salão Lune. A festa foi aprovada no Scale.')
      : e >= 3
        ? h('div', h('p', h('b', 'Pré-reservado: sáb, 14/11, 14:00 às 17:00, Salão Lune'), ' • vence sáb, 07/11 às 19:55'), h('div.a-actions-row', btn('Prorrogar', () => toast('Prorrogar estende a pré-reserva por mais 48 horas.')), btn('Liberar', () => toast('Liberar devolve a janela para a agenda.'))))
        : h('div', h('p.a-muted', 'Horários livres em sáb, 14/11:'), h('div.a-actions-row', btn('10:00 • Lune (70)', () => toast('Na história, a Mariana prefere a tarde.')), btn('14:00 • Lune (70)', () => { GP.app.setEtapa(3); openOpp('mariana'); toast('Horário pré-reservado: sáb, 14/11, 14:00, Salão Lune. Vence em 48 horas.'); }, 'primary')));
    openDrawer(F.op + ' • ' + F.nome, null, [
      h('div.a-sec', chip(stageKind(st), st), ' ', h('span.a-muted', e === 1 ? 'com a IA' : 'com Ana Lima'), h('div', link('Abrir a conversa', () => go('atendimento', { conv: 'mariana' })))),
      h('section.a-sec', h('h5', 'A festa'), kv(festaFields().concat([['Necessidades especiais', '—']]))),
      h('section.a-sec', h('h5', 'Orçamento do Scale'), orc),
      h('section.a-sec', { 'data-tour': 'opp-pre' }, h('h5', 'Pré-reserva do horário'), pre),
      h('section.a-sec', h('h5', 'Avançar ou encerrar'), e >= 5 ? h('p', 'Ganha em 05/11, com o sinal confirmado pelo Financeiro. Ninguém marca uma oportunidade como ganha à mão.')
        : h('div.a-actions-row', ['Qualificada', 'Proposta', 'Negociação'].map((s) => btn(s, () => toast('Na história da Mariana, as etapas seguem a barra acima do protótipo.'))), btn('Marcar como perdida', () => toast('Marcar como perdida pede o motivo: preço, data indisponível, fechou em outro lugar…')))),
      h('section.a-sec', h('h5', 'Histórico'), h('ol.a-hist', hist.map(([t, d]) => h('li', h('time', t), ' ' + d)))),
    ], { tour: 'opp' });
  }

  /* =========================================================
     Agenda de festas
     ========================================================= */
  const SLOT = { livre: ['good', 'check', 'livre'], pre: ['warn', 'clock', 'pré-reservado'], res: ['navy', 'cake', 'reservado'], blq: ['crit', 'x', 'bloqueado'] };
  function slotOf(v) {
    if (v !== 'mariana') return Array.isArray(v) ? v : [v, null];
    const e = E();
    if (e >= 5) return ['res', '14:00: Festa de Alice, 7 anos (orçamento 48213), 60 convidados', true];
    if (e >= 3) return ['pre', '14:00: pré-reserva de Mariana Souza (OP-0412), vence sáb, 07/11', true];
    return ['livre', null, true];
  }
  const heat = (v) => (v === 0 ? 'none' : v <= 20 ? 1 : v <= 40 ? 2 : v <= 60 ? 3 : v <= 80 ? 4 : 5);
  function scrAgenda() {
    const view = tabOf('agenda', 'semana');
    const head = hrow('Agenda de festas', 'Hortolândia: as janelas de cada salão na semana. A festa aprovada no Scale ocupa a janela; a pré-reserva segura por 48 horas.');
    const NAV = { dia: ['Dia anterior', 'Próximo dia'], semana: ['Semana anterior', 'Próxima semana'], mes: ['Mês anterior', 'Próximo mês'] }[view];
    const controls = h('div.ag-ctrl', tabs('agenda', [['dia', 'Dia'], ['semana', 'Semana'], ['mes', 'Mês']], 'Visão da agenda', 'semana'),
      btn([icon('back'), NAV[0]], () => toast('Na demonstração, a agenda mostra a semana da festa da Alice.')), btn('Hoje', () => toast('Hoje é quinta, 05/11; a agenda mostra a semana da festa da Alice.')), btn(NAV[1], () => toast('Na demonstração, a agenda mostra a semana da festa da Alice.')),
      h('select.a-select', { 'aria-label': 'Salões' }, h('option', 'Todos os salões'), h('option', 'Will'), h('option', 'Lune')));
    const legend = h('div.ag-leg', Object.values(SLOT).map(([k, ic, l]) => chip(k, l, ic)));
    let body;
    if (view === 'dia') {
      const d = D.agendaFestas.dias.find((x) => x.dia === 'sáb, 14/11');
      body = panel(null, 'sábado, 14/11', '3 janelas • 2 salões', tbl(['Janela', 'Will', 'Lune'], d.jan.map(([j, sal]) => h('tr', h('td', h('b', j)), ['Will', 'Lune'].map((nm) => {
        const [k, txt, mine] = slotOf(sal[nm]);
        return h('td', { 'data-tour': mine ? 'cel-mariana' : null }, chip(SLOT[k][0], SLOT[k][2], SLOT[k][1]), txt ? h('span.sub', txt.replace(/^\d\d:\d\d: /, '')) : null);
      })))));
    } else if (view === 'mes') {
      // 1º de novembro de 2026 é domingo; a semana de 09 a 15/11 bate com a visão de semana
      const occ = [null, null, null, null, null, null, 83, 50, 0, 0, 50, 50, 83, 67, 0, 0, 0, 0, 50, (E() >= 5 ? 83 : 67), 40, 0, 0, 0, 0, 50, 50, 33, 0, 0, 0, 0, 0, 33, 17, 0];
      body = panel(null, 'Novembro de 2026', 'mais escuro, mais reservado', h('div.ag-month', ['seg', 'ter', 'qua', 'qui', 'sex', 'sáb', 'dom'].map((w) => h('span.ag-mh', w)),
        occ.map((v, i) => (v === null ? h('span') : h('span.ag-md', { class: ['heat-' + heat(v), i === 10 ? 'today' : ''].filter(Boolean).join(' '), title: `${i - 5}/11: ${v}% ocupado` + (i === 19 && E() >= 3 ? (E() >= 5 ? '; festa da Alice' : '; pré-reserva da Alice') : '') }, h('b', String(i - 5), i === 19 && E() >= 3 ? icon(E() >= 5 ? 'cake' : 'clock') : null), h('small', v + '%'))))),
        h('div.ag-leg.left', h('span.a-muted', 'Ocupação:'), ['0%', 'até 20%', 'até 40%', 'até 60%', 'até 80%', 'acima de 80%'].map((t, k) => h('span.ag-key', h('i', { class: 'heat-' + (k === 0 ? 'none' : k) }), t))));
    } else {
      body = h('div.a-panel.agw', { 'data-tour': 'agenda' }, legend, D.agendaFestas.dias.map((d) => {
        let offered = 0, taken = 0;
        const lines = [];
        const wins = d.jan.map(([j, sal]) => {
          const chips = ['Will', 'Lune'].map((nm) => {
            const [k, txt, mine] = slotOf(sal[nm]);
            if (k !== 'blq') offered++;
            if (k === 'res') taken++;
            if (txt && k !== 'blq') lines.push([txt, mine]);
            return h('span', { 'data-tour': mine ? 'cel-mariana' : null, class: mine ? flashCls() : null }, chip(SLOT[k][0], nm, SLOT[k][1]));
          });
          const free = ['Will', 'Lune'].filter((nm) => slotOf(sal[nm])[0] === 'livre').length;
          return h('div.agw-win', { class: free ? null : 'full' }, h('b', j), h('span', free ? free + ' de 2 livres' : 'Lotada'), h('div.agw-chips', chips));
        });
        return h('div.agw-day', { class: d.we ? 'we' : null },
          h('div.agw-d', h('b', d.dia), h('span', ' • ' + (offered ? Math.round((taken / offered) * 100) : 0) + '%'), h('small', 'ocupado')),
          h('div.agw-wins', wins),
          h('div.agw-list', lines.map(([t, mine]) => h('p', { class: mine ? 'mine' : null }, t))));
      }));
    }
    return h('div', head, controls, body);
  }

  /* =========================================================
     Clientes
     ========================================================= */
  function scrClientes() {
    const e = E();
    const rowsC = D.clientes.filter((c) => c[4] !== 'mariana' || e >= 1);
    return h('div',
      hrow('Clientes', 'O histórico de cada família: conversas, oportunidades, festas, pagamentos e consentimentos. Busque pelo nome ou pelos quatro últimos dígitos do telefone.', h('div.a-input.sm', icon('search'), h('span', 'Nome ou 4 dígitos'))),
      panel({ 'data-tour': 'clientes' }, 'Com contato mais recente', null,
        tbl(['Cliente', 'Telefone', 'Unidade preferida', 'Crianças', 'Último contato'], rowsC.map((c) => h('tr.click', { class: c[4] === 'mariana' ? 'hl' : null, ...press(() => openCliente(c)) },
          h('td', h('b', c[0])), h('td', h('span.mono', c[1])), h('td', c[2]), h('td', c[3]), h('td', c[4] === 'mariana' ? '05/11 ' + (marianaRow() ? marianaRow().h : '19:42') : c[4]))))));
  }
  function openCliente(c) {
    if (c[4] !== 'mariana') {
      openDrawer(c[0], 'unidade preferida ' + c[2], [h('section.a-sec', h('h5', 'Quem é'), kv([['Telefones e contas', c[1]], ['Crianças', c[3]]])), h('section.a-sec', h('h5', 'Linha do tempo'), h('p.a-muted', 'Conversas, oportunidades, festas, pagamentos e consentimentos, na ordem em que aconteceram.'))]);
      return;
    }
    const e = E();
    const tl = [
      ['chat', 'Atendimento pelo número Vendas', '05/11 19:42 • origem Anúncio Meta Ads: ' + F.origem.campanha],
      ['flag', 'Oportunidade OP-0412 aberta', '05/11 19:42 • pela IA'],
      e >= 2 ? ['user', 'A IA passou a conversa para Ana Lima', '05/11 19:45 • Qualificado'] : null,
      e >= 3 ? ['cal', 'Horário pré-reservado: sáb, 14/11, 14:00, Salão Lune', '05/11 19:55 • vence sáb, 07/11'] : null,
      e >= 4 ? ['receipt', 'Cobrança do sinal enviada: R$ 987,00', '05/11 19:58 • PIX com o identificador do orçamento 48213'] : null,
      e >= 5 ? ['bank', 'Sinal confirmado pelo banco: R$ 987,00', '05/11 20:03 • adiantamento no ERPFLEX'] : null,
      e >= 5 ? ['cake', 'Oportunidade OP-0412 ganha', '05/11 20:03 • Festa de Alice, sábado, 14/11'] : null,
      ['check', 'Consentimento de atendimento', '05/11 19:42 • pela conversa'],
    ].filter(Boolean);
    openDrawer(F.nome, 'Cliente desde 05/11 19:42 • unidade preferida ' + F.unidade, [
      h('div.a-actions-row', btn('Exportar os dados', () => toast('Exportar: os dados do titular, para atender a LGPD.')), btn('Unir com outro cadastro', () => toast('Unir dois cadastros da mesma família mantém o histórico dos dois.')), btn('Anonimizar', () => toast('Anonimizar pede confirmação e fica na auditoria.'))),
      h('section.a-sec', h('h5', 'Quem é'), kv([['Telefones e contas', F.fone], ['Crianças', 'Alice, 7 anos (aniversário em 14/11)'], ['Consentimentos', 'atendimento, com a prova da conversa; sem marketing']])),
      h('section.a-sec', h('h5', 'Oportunidades'), h('p', h('b', F.op), ' ', chip(stageKind(marianaRow() ? marianaRow().etapa : 'Nova'), marianaRow() ? marianaRow().etapa : 'Nova'), ' Hortolândia')),
      h('section.a-sec', h('h5', 'Linha do tempo'), h('div.a-chips', ['Tudo', 'Conversas', 'Oportunidades', 'Festas', 'Pagamentos e devoluções', 'Consentimentos'].map((t, i) => h('span.a-pill', { class: i === 0 ? 'on' : null }, t))),
        h('ol.a-tl', tl.map(([ic, t, d]) => h('li', h('span.tl-i', icon(ic)), h('div', h('b', t), h('small', d)))))),
    ], { tour: 'cliente' });
  }

  /* =========================================================
     Painel comercial
     ========================================================= */
  function scrPainel() {
    const P = D.painel;
    const won = E() >= 5 ? 1 : 0;
    const total = P.funil[0][1];
    const per = tabOf('painel', '30');
    const fb = (label, v, cls) => h('div.fb', h('span', label), h('div.fb-t', h('i', { class: cls, style: `width:${(v / total) * 100}%` })), h('b', nf(v) + ' ' + Math.round((v / total) * 100) + '%'));
    const ganhas = P.funil[2][1] + won;
    return h('div',
      hrow('Painel comercial', `Rede inteira: oportunidades e atendimentos abertos nos últimos ${per} dias. Festa ganha é sinal confirmado pelo Financeiro.`, tabs('painel', [['7', '7 dias'], ['30', '30 dias'], ['90', '90 dias']], 'Período', '30')),
      h('div.a-kpis',
        kpi('Esperando resposta agora', '3', 'Atendimento geral (SAC): 1', 'bad'),
        kpi('Sem resposta há mais de 10 min', '1', 'Responda primeiro estas famílias', 'bad'),
        kpi('Prazo de resposta estourado', '1', 'Passagens e filas fora do prazo', 'bad'),
        kpi('Pré-reservas vencendo', String(E() >= 3 && E() <= 4 ? 2 : 1), rows().filter((r) => r.dono === 'ia').length + ' conversas com a IA agora')),
      h('div.a-grid2',
        panel({ 'data-tour': 'funil-coorte' }, 'Funil da coorte', chip('info', 'Janela de 90 dias ainda aberta', 'sync'),
          h('div.funil', h('span.a-muted', 'Conversão de oportunidade em festa'), h('b.funil-n', pct1(ganhas / total)), h('p.a-muted', `${nf(ganhas)} festas ganhas de ${nf(total)} oportunidades; metade fecha em até 6 dias.`),
            fb('Oportunidades', total, 's1'), fb('Qualificadas', P.funil[1][1], 's1'), fb('Ganhas', ganhas, 'good'), fb('Perdidas', P.funil[3][1], 'crit'), fb('Em aberto', P.funil[4][1] - won, 'warn'),
            h('b.small-h', 'Motivos de perda'), h('ul.perdas', P.perdas.map(([m, n]) => h('li', m + ' (' + nf(n) + ')'))))),
        stack(
          panel(null, 'Festas ganhas no período', null, h('div.budget', h('b.big', nf(ganhas)), h('p', `${brl0(ganhas * 3100)}; ticket médio R$ 3.100`))),
          panel(null, 'Próximos fins de semana', 'reservados de 84 horários', h('div.hbars', P.fds.map(([d, v]) => h('div.hb', h('span', d), h('div.hb-track', h('div.hb-fill', { style: `width:${(v / 84) * 100}%` })), h('b', v + (d === 'sáb, 14/11' ? won : 0) + '/84'))))))),
      h('div.a-grid2', { style: 'margin-top:12px' },
        panel(null, 'Tempo de resposta', null, h('div.kvr', P.tempo.map(([l, v, d]) => h('div', h('span', l), h('span', h('b', v), ' ' + d))))),
        panel({ 'data-tour': 'piloto' }, 'Vendedores IA', 'US$ 304,30 em modelos', h('div.kvr', P.ia.map(([l, v, d]) => h('div', { class: /Piloto/.test(l) ? 'hl' : null }, h('span', l), h('span', h('b', v), d ? ' ' + d : '')))))),
      panel({ style: 'margin-top:12px', class: 'tight' }, 'Vendedores IA por versão', null,
        h('p.a-desc', 'Cada atendimento conta para a versão do último turno da IA nele; cada oportunidade, para a versão que atendeu a família antes de ela ser aberta. Grupo sem IA (piloto): 9,9% de conversão no período.'),
        tbl(['Versão', 'Situação', 'Atendimentos', 'Resolvidos sem pessoa', 'Passagens', 'Qualidade da passagem', '1ª resposta (mediana)', 'Conversão', 'Custo por atendimento', 'Custo por festa'],
          P.versoes.map((r) => h('tr', h('td', h('b', r[0])), h('td', chip(r[1][0], r[1][1])), r.slice(2).map((c) => h('td.r', String(c))))), [2, 3, 4, 5, 6, 7, 8, 9])),
      panel({ style: 'margin-top:12px' }, 'Conversão por vendedor', null,
        h('p.a-desc', 'Oportunidades abertas no período, ganhas em até 90 dias. A pessoa conta pelas oportunidades de que é dona; o vendedor IA, pelas que abriu, mesmo depois de passar para uma pessoa.'),
        tbl(['Vendedor', 'Oportunidades', 'Ganhas', 'Conversão'], P.conversao.map((r, i) => h('tr', h('td', r[0]), h('td.r', nf(r[1])), h('td.r', String(r[2] + (i === 1 ? won : 0))), h('td.r', r[3]))), [1, 2, 3])),
      h('div.a-stack', { style: 'margin-top:12px' },
        panel(null, 'Vendedores', '5 de 14 pessoas',
          tbl(['#', 'Pessoa', 'Atendimentos', 'Ganhas', 'Valor', '1ª resposta', 'No prazo'], P.vendedores.map((r, i) => h('tr', h('td', (i + 1) + 'º'), h('td.nw', r[0]), h('td.r', nf(r[1])), h('td.r', String(r[2] + (i === 0 ? won : 0))), h('td.r', brl0(r[3] + (i === 0 ? won * F.valor : 0))), h('td.r', r[4]), h('td.r', r[5]))), [2, 3, 4, 5, 6])),
        panel(null, 'Unidades', 'as cinco com mais oportunidades', tbl(['Unidade', 'Oportunidades', 'Ganhas', 'Valor'], P.unidades.map((r) => h('tr', h('td', r[0]), h('td.r', nf(r[1])), h('td.r', String(r[2] + (r[0] === 'Hortolândia' ? won : 0))), h('td.r', brl0(r[3] + (r[0] === 'Hortolândia' ? won * F.valor : 0))))), [1, 2, 3]))),
      panel({ style: 'margin-top:12px' }, 'Qualidade da jornada', 'para a gestão',
        h('div.jor',
          h('div', h('b.jor-h', 'Jornada registrada no GlowHub'), h('p.a-muted', 'Festas de outubro de 2026 (orçamentos aprovados no Scale) ligadas a uma oportunidade. Meta: 95%.'),
            h('p', h('b.jor-n', P.jornada.registrada[0]), ' ' + P.jornada.registrada[1] + ' ', chip(P.jornada.registrada[2], P.jornada.registrada[3])), h('div.meter.good', h('i', { style: 'width:96%' }))),
          h('div', h('b.jor-h', 'Origem desconhecida'), h('p.a-muted', 'Conversas de 07/10/2026 a 05/11/2026 sem origem identificada. Meta: abaixo de 10%.'),
            h('p', h('b.jor-n', P.jornada.desconhecida[0]), ' ' + P.jornada.desconhecida[1] + ' ', chip(P.jornada.desconhecida[2], P.jornada.desconhecida[3])), h('p.a-muted', '41 contaram como conheceram a Glow Park.')),
          h('div', h('b.jor-h', 'Atendimentos sem resposta'), h('p.a-muted', 'Famílias esperando há mais de 10 minutos agora. A promessa é zero.'),
            h('p', h('b.jor-n', String(P.jornada.semResposta)), ' ', chip('crit', 'Responder agora')), h('ul.a-ul', h('li', 'Hortolândia: 1'), h('li', 'Número Vendas: 1')),
            link('Ver a lista no atendimento', () => { go('atendimento', { conv: 'thiago' }); })))),
      panel({ style: 'margin-top:12px' }, 'Horários livres nas próximas 8 semanas', 'de 05/11 a 30/12',
        tbl(['Unidade', 'Oferecidos', 'Reservados', 'Pré-reservados', 'Livres', 'Ocupação'], P.livres.map((r) => h('tr', h('td', r[0]), r.slice(1).map((c) => h('td.r', String(c))), h('td.r', Math.round((r[2] / r[1]) * 100) + '%'))), [1, 2, 3, 4, 5])));
  }

  /* =========================================================
     Vendedores IA
     ========================================================= */
  const iaSwitch = { rede: true, Vendas: '', SAC: '', piloto: true };
  function scrIA() {
    const tab = tabOf('ia', 'vendedor');
    const head = hrow('Vendedores IA', 'A IA atende na hora, qualifica a festa e passa para a equipe com o resumo. Ela é humanizada, mas nunca se passa por uma pessoa.');
    const tb = tabs('ia', [['vendedor', 'Vendedor IA'], ['ao-vivo', 'Ao vivo'], ['base', 'Base de conhecimento'], ['simulador', 'Simulador'], ['avaliacao', 'Avaliação'], ['uso', 'Uso e custo']], 'Vendedores IA');
    const body = { vendedor: iaVendedor, 'ao-vivo': iaAoVivo, base: iaBase, simulador: iaSimulador, avaliacao: iaAvaliacao, uso: iaUso }[tab]();
    return h('div', head, tb, body);
  }
  function iaVendedor() {
    const sel = (num) => h('label.a-row', h('select.a-select', { 'aria-label': 'IA no número ' + num, onchange: (e) => { iaSwitch[num] = e.target.value; } }, [['', 'Como a rede'], ['on', 'Ligada'], ['off', 'Desligada']].map(([v, l]) => h('option', { value: v, selected: iaSwitch[num] === v || null }, l))), ' no número ' + num);
    const used = D.ia.uso[0][1], cap = D.ia.uso[0][2];
    return h('div', { style: 'display:grid;gap:12px' },
      panel({ 'data-tour': 'ia-onde' }, 'Onde a IA atende', iaSwitch.rede ? chip('good', 'Ligada na rede') : chip('muted', 'Desligada na rede'),
        h('div.budget',
          h('label.a-check', h('input', { type: 'checkbox', checked: iaSwitch.rede || null, onchange: (e) => { iaSwitch.rede = e.target.checked; } }), 'Ligada em toda a rede'),
          sel('SAC'), sel('Vendas'),
          h('label.a-check', h('input', { type: 'checkbox', checked: iaSwitch.piloto || null }), 'Piloto com grupo de comparação: ', h('span.a-num', '50'), ' % dos clientes novos com a IA; o resto vai para a fila (para comparar a conversão)'),
          h('span.small-h', 'Quem decidiu e por quê'), h('div.a-row', h('div.a-input.static.grow', 'Ex.: gestão comercial, piloto de novembro'), btn('Registrar', () => toast('Registrado: quem ligou ou desligou, quando e por quê, na auditoria.'), 'ink')))),
      panel({ 'data-tour': 'ia-teto' }, 'Orçamento do mês', chip('good', 'Dentro do orçamento'),
        h('div.budget', h('p', `US$ ${fmtUsd(used)} de US$ ${fmtUsd(cap)}. No limite, a IA passa as conversas para a fila em vez de ficar muda.`), h('div.meter.good', h('i', { style: `width:${(used / cap) * 100}%` })))),
      h('div.a-grid2',
        panel({ 'data-tour': 'ia-limites' }, 'Limites da IA', null, h('div.budget',
          h('p', 'No limite de turnos ou de custo do dia, a IA passa a conversa para a fila, como no fim do orçamento do mês. Hoje: 25 turnos por atendimento e US$ 2,00 de IA por conversa no dia.'),
          h('div.lim', h('label', 'Turnos por atendimento', h('span.a-num', '25')), h('label', 'Custo por conversa no dia (US$)', h('span.a-num', '2,00')), h('label', 'Alerta da supervisão (%)', h('span.a-num', '80'))))),
        panel(null, 'Quando a IA atende', null, h('div.budget', h('div.a-kv.roomy',
          h('span', 'Conversas da IA'), h('div', '24 horas por dia, todos os dias, onde ela está ligada.'),
          h('span', 'Filas'), h('div', 'Cobre fora do horário de atendimento humano de cada fila; no horário, depois de 15 minutos sem resposta de uma pessoa.'),
          h('span', 'Onde mudar'), h('div', 'O horário humano é o de cada fila, em ', h('a.a-link', { href: '#', onclick: (ev) => { ev.preventDefault(); go('configuracao', { tab: 'filas' }); } }, 'Configuração comercial › Filas e horários'), '; a cobertura e as demais decisões, em ', h('b', 'Configuração › Decisões'), '; a cadência de acompanhamento, em ', h('b', 'Decisões › Acompanhamento'), '.'))))),
      panel({ 'data-tour': 'ia-versoes' }, 'Versões de Lu', btn('+ Editar num rascunho', () => toast('O rascunho passa pela avaliação antes de publicar; publicar é da gestão comercial.')),
        tbl(['Versão', 'Situação', 'Avaliação', 'Publicada', 'Observação', ''], D.ia.versoes.map((v) => h('tr', h('td', h('b', v.v), ' Lu'), h('td', chip(v.sit[0], v.sit[1], v.sit[0] === 'info' ? 'sync' : null)), h('td', v.aval), h('td', v.pub), h('td', v.obs),
          h('td.r', v.sit[1] === 'Anterior' ? link('Voltar para esta versão', () => toast('Voltar para a ' + v.v + ' leva um clique. Na demonstração, a v3 continua publicada.')) : null))))));
  }
  const fmtUsd = (v) => new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v);
  function iaAoVivo() {
    const live = D.ia.aoVivo.slice();
    if (E() === 1) live.unshift([F.nome, 'Hortolândia • Vendas', 'Qualificação', 7, 'US$ 0,19', '19:45', null, true]);
    return panel({ 'data-tour': 'ia-ao-vivo', class: 'tight' }, 'Conversas da IA agora', 'alerta de turnos acima de 80% de 25; de custo acima de 80% de US$ 2,00 por conversa no dia',
      tbl(['Conversa', 'Situação', 'Fase', 'Turnos', 'Custo', 'Última mensagem', 'Alertas', ''], live.map((r) => h('tr', { class: r[7] ? 'hl' : null },
        h('td', h('b', r[0]), h('span.sub', r[1])), h('td', chip('stage', 'Com a IA', 'sync')), h('td', r[2]), h('td.r', String(r[3])), h('td.r', r[4], h('span.sub', 'hoje ' + r[4])), h('td', r[5]), h('td', r[6] ? chip('warn', r[6]) : '—'),
        h('td.r', h('div.acts-col', btn('Assumir', () => { if (r[7]) { GP.app.setEtapa(2); toast('A conversa passou para a Ana Lima, com o resumo da Lu.'); } else toast('Assumir passa a conversa para você; a Lu para de responder.'); }, 'ink'), link('Ver conversa', () => go('atendimento', { conv: r[7] ? 'mariana' : (D.inbox.find((x) => x.nome === r[0]) || {}).id || 'mariana' })))))), [3, 4]));
  }
  function iaBase() {
    return h('div', { style: 'display:grid;gap:12px' },
      panel(null, 'Base de conhecimento', h('select.a-select', { 'aria-label': 'Parte da base' }, h('option', 'Rede (vale para todas as unidades)'), D.units.map((u) => h('option', u.name))),
        h('div.budget', h('p.a-muted', 'Preço não mora aqui: mora no catálogo, que a IA consulta por ferramenta. Cada seção tem versões: o rascunho só entra na IA depois de publicado pela gestão comercial.'),
          D.ia.base.map(([t, st, body]) => h('div.kb-sec', h('div.a-row.between', h('b', t), chip(st === 'Publicada' ? 'good' : 'warn', st)), h('p', body),
            h('div.a-row', link(st === 'Publicada' ? 'Editar' : 'Editar o rascunho', () => toast('A edição vira rascunho até a gestão publicar.')), st === 'Rascunho' ? link('Publicar a seção', () => toast('Seção publicada: entra na próxima versão avaliada da Lu.')) : null))))),
      panel(null, 'Materiais da rede', null, h('div.budget', h('p', 'Cardápio do buffet (PDF), fotos dos salões e o regulamento do parque. A Lu envia o material certo quando a família pede.'))));
  }
  function iaSimulador() {
    const sim = tabOf('ia-sim', 'parado');
    return panel({ 'data-tour': 'ia-sim' }, 'Simular uma conversa', null, h('div.budget',
      h('p.a-muted', 'Converse com uma versão como se fosse uma família. A IA responde de verdade, com o catálogo e a agenda de hoje, mas nada sai pelo WhatsApp e nada é gravado no atendimento.'),
      h('div.a-row', h('label.a-lbl', 'Versão', h('select.a-select', h('option', 'v4 • Lu (em avaliação)'), h('option', { selected: true }, 'v3 • Lu (publicada)'))), h('label.a-lbl', 'A família chega pela unidade', h('select.a-select', h('option', 'Unidade a descobrir'), h('option', { selected: true }, 'Hortolândia'))),
        btn(sim === 'rodando' ? 'Recomeçar' : 'Começar', () => { GP.app.state.tabs['ia-sim'] = 'rodando'; GP.app.render(); }, 'primary')),
      sim === 'rodando' ? h('div.ib-msgs.sim', h('div.msg.in', 'Tem horário dia 21 de novembro?', h('time', 'agora')), h('div.msg.ai', h('small', h('span.ia-b', 'IA'), ' Vendedor IA'), 'Oi! Eu sou a Lu, a inteligência artificial da Glow Park 💜 No sábado, 21/11, em Hortolândia, tem 10:00 às 13:00 e 18:00 às 21:00. É aniversário de quem?', h('span.tool', icon('spark'), ' Consultou a agenda de Hortolândia'), h('time', 'agora')), h('p.a-muted', 'Simulação: o custo conta no orçamento do simulador.')) : null));
  }
  function iaAvaliacao() {
    return h('div', { style: 'display:grid;gap:12px' },
      panel(null, 'Avaliações', h('select.a-select', { 'aria-label': 'Versão' }, h('option', 'v4 • Lu'), h('option', 'v3 • Lu')),
        h('div.budget', h('p.a-muted', 'Cada avaliação roda os cenários ativos contra a versão e contra a publicada, sem nada sair pelo WhatsApp. Publicar exige a última avaliação aprovada: nota mínima de 80%, nenhum preço inventado e no máximo 10 pontos abaixo da publicada.')),
        tbl(['Início', 'Versão', 'Resultado', 'Nota', 'Falhas críticas'], D.ia.avaliacoes.map((r) => h('tr', h('td', r[0]), h('td', r[1]), h('td', chip(r[2][0], r[2][1], r[2][0] === 'info' ? 'sync' : null)), h('td.r', r[3]), h('td.r', r[4]))), [3, 4])),
      panel({ 'data-tour': 'ia-cenarios' }, 'Cenários', btn('+ Novo cenário', () => toast('Um cenário novo também nasce de uma conversa marcada: "Virar cenário".')),
        tbl(['Cenário', 'Origem', 'O que confere', 'Situação'], D.ia.cenarios.map(([n, msgs, what]) => h('tr', h('td', h('b', n), h('span.sub', msgs)), h('td', 'Diagnóstico'), h('td', what), h('td', chip('good', 'Ativo')))))));
  }
  function iaUso() {
    const tot = D.ia.uso.reduce((a, r) => [a[0] + r[1], a[1] + r[2], a[2] + r[3]], [0, 0, 0]);
    return h('div', { style: 'display:grid;gap:12px' },
      panel({ 'data-tour': 'ia-uso' }, 'Uso de IA em novembro de 2026', 'teto de R$ 2.000 por mês, cerca de US$ 400',
        tbl(['Recurso', 'Gasto', 'Orçamento', 'Chamadas', 'Leitura do cache'], D.ia.uso.map((r) => h('tr', h('td', r[0]), h('td.r', 'US$ ' + fmtUsd(r[1])), h('td.r', 'US$ ' + fmtUsd(r[2])), h('td.r', nf(r[3])), h('td.r', '62%')))
          .concat([h('tr.tot', h('td', h('b', 'Total')), h('td.r', h('b', 'US$ ' + fmtUsd(tot[0]))), h('td.r', h('b', 'US$ ' + fmtUsd(tot[1]))), h('td.r', h('b', nf(tot[2]))), h('td'))]), [1, 2, 3, 4])),
      panel(null, 'WhatsApp em novembro de 2026', chip('warn', 'Preços prováveis, a conferir'),
        h('p.a-foot', { style: 'padding:10px 14px 0' }, 'Mensagens pagas da API oficial, pelo preço da categoria que a Meta informou em cada entrega.'),
        h('div.vs-cols.three', h('div', h('b', 'R$ 499,53'), h('span', 'custo no mês')), h('div', h('b', '6.900'), h('span', 'mensagens pagas')), h('div', h('b', '3.930'), h('span', 'mensagens gratuitas')))));
  }

  /* =========================================================
     Configuração comercial
     ========================================================= */
  const CFG_SUB = {
    filas: 'Cada unidade tem a sua fila de vendas; a rede tem a fila de vendas enquanto a unidade não é conhecida e a do atendimento geral (SAC). O prazo de resposta conta só no horário de atendimento.',
    catalogo: 'Os pacotes e os preços por dia e janela, os adicionais e as regras da festa. É a única fonte da IA para preço: o que não está aqui, ela não fala.',
    saloes: 'Os salões de cada unidade, as janelas de festa por dia da semana e os bloqueios. A agenda e a IA leem daqui.',
    etiquetas: 'As etiquetas que marcam as conversas e viram filtro no atendimento. Quem atende a conversa aplica e tira.',
    respostas: 'As respostas rápidas da equipe: o vendedor digita / no campo de resposta e escolhe. Cada pessoa também tem as suas.',
    motivos: 'Os motivos de perda e os resultados de encerramento que as pessoas escolhem: o nome, a ordem, o que fica na lista e os motivos detalhados.',
  };
  function scrConfig() {
    const tab = tabOf('configuracao', 'filas');
    const C = D.config;
    const body = {
      filas: () => panel(null, 'Filas e horários', null, tbl(['Fila', 'Tipo', 'Prazo', 'Agora', 'Pessoas', 'Esperando'], C.filas.map((r) => h('tr', h('td', h('b', r[0])), h('td', r[1]), h('td', r[2]), h('td', chip('good', 'No horário')), h('td', r[3]), h('td.r', String(r[4])))), [5])),
      catalogo: () => h('div', { style: 'display:grid;gap:12px' },
        panel({ 'data-tour': 'catalogo' }, 'Pacotes de festa', btn('+ Novo pacote', () => toast('Pacote novo: a IA passa a oferecer depois de salvo.')), tbl(['Pacote', 'Onde', 'Inclui', 'Preços', 'Situação'], C.pacotes.map((r) => h('tr', h('td', h('b', r[0])), h('td', r[1]), h('td', r[2]), h('td', r[3]), h('td', chip('good', 'À venda')))))),
        panel(null, 'Adicionais', btn('+ Novo adicional', () => toast('Sem adicional no catálogo, a IA diz que a equipe confirma.')), tbl(['Adicional', 'Preço', 'Como cobra'], C.adicionais.map((r) => h('tr', h('td', h('b', r[0])), h('td.r', r[1]), h('td', r[2]))), [1])),
        panel(null, 'Regras da festa', 'a rede define o padrão; cada unidade muda só o que for diferente', tbl(['Onde', 'Sinal', 'Quitação', 'Idade', 'Documentos'], C.regras.map((r) => h('tr', h('td', h('b', r[0])), r.slice(1).map((c) => h('td', c))))))),
      saloes: () => panel(null, 'Salões e janelas', btn('+ Novo salão', () => toast('Salão novo entra na agenda e na IA.')), tbl(['Salão', 'Unidade', 'Convidados', 'Janelas', 'Bloqueios', 'Situação'], C.saloes.map((r) => h('tr', h('td', h('b', r[0])), h('td', r[1]), h('td.r', String(r[2])), h('td', r[3]), h('td', r[4]), h('td', chip('good', 'Ativo')))), [2])),
      etiquetas: () => panel(null, 'Etiquetas', btn('+ Nova etiqueta', () => toast('A etiqueta nova aparece no filtro do atendimento.')), h('div.a-chips.pad', C.etiquetas.map((t) => h('span.a-pill', t)))),
      respostas: () => panel(null, 'Respostas rápidas da equipe', btn('+ Nova resposta', () => toast('A resposta rápida aparece quando o vendedor digita /.')), tbl(['Atalho', 'O que diz'], C.respostas.map((r) => h('tr', h('td', h('b.mono', r[0])), h('td', r[1]))))),
      motivos: () => h('div.a-grid2', panel(null, 'Motivos de perda', null, h('ol.a-list', C.perdas.map((m) => h('li', m)))), panel(null, 'Resultados do encerramento', null, h('ol.a-list', C.resultados.map((m) => h('li', m))))),
    }[tab]();
    return h('div', hrow('Configuração comercial', CFG_SUB[tab]),
      tabs('configuracao', [['filas', 'Filas e horários'], ['catalogo', 'Catálogo'], ['saloes', 'Salões'], ['etiquetas', 'Etiquetas'], ['respostas', 'Respostas rápidas'], ['motivos', 'Motivos']], 'Configuração comercial'), body);
  }

  GP.app.defineScreens('comercial', [
    { group: 'Todo dia' },
    { id: 'painel', name: 'Painel', icon: 'home' },
    { id: 'atendimento', name: 'Atendimento', icon: 'chat' },
    { id: 'oportunidades', name: 'Oportunidades', icon: 'cake' },
    { id: 'agenda', name: 'Agenda de festas', icon: 'cal', unit: 'Hortolândia' },
    { id: 'clientes', name: 'Clientes', icon: 'user' },
    { group: 'Inteligência' },
    { id: 'ia', name: 'Vendedores IA', icon: 'spark' },
    { group: 'Configuração' },
    { id: 'configuracao', name: 'Configuração comercial', icon: 'clock' },
  ], { painel: scrPainel, atendimento: scrAtendimento, oportunidades: scrOportunidades, agenda: scrAgenda, clientes: scrClientes, ia: scrIA, configuracao: scrConfig });

  GP.com = { resetList, openOpp, openFicha: () => openFicha(), openCliente: () => openCliente(D.clientes[0]), close: closeDrawer };
})();
