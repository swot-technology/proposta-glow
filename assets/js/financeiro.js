/* O Financeiro do GlowHub: a Central Financeira por dentro.
   Hoje é quinta, 05/11; as vendas conferidas são as de ontem, quarta, 04/11. */
(function () {
  const { h, clear, fmt } = GP;
  const { icon, chip, press, hrow, panel, kpi, stack, toast, pct1, openDrawer, closeDrawer, REDE } = GP.ui;
  const D = GP.data;
  const FN = D.fin;
  const F = D.familia;
  const A = () => GP.app.state;

  // estado do Financeiro na demonstração; o lote do dia vai de aberto a enviado, aprovado e devolvido
  const st = { recTab: 'agenda', venFilter: 'todas', lote: 'aberto', ant: 0, q: 0, mark: null };
  function reset() { Object.assign(st, { recTab: 'agenda', venFilter: 'todas', lote: 'aberto', ant: 0, q: 0, mark: null }); }

  const brl = fmt.brl, brl0 = fmt.brl0;
  const pct2 = (v) => new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v * 100) + '%';
  const sum = (arr, f) => arr.reduce((a, x) => a + f(x), 0);
  const meter = (ratio, tone) => h('div.meter' + (tone ? '.' + tone : ''), { 'aria-hidden': 'true' }, h('i', { style: `width:${Math.max(0, Math.min(100, ratio * 100))}%` }));
  const goFin = (screen) => GP.app.go('financeiro', screen);
  const onScreen = (screen) => A().mod === 'financeiro' && A().screen === screen;
  const btn = (label, fn, primary) => h(primary ? 'button.a-btn.primary' : 'button.a-btn', { type: 'button', onclick: fn }, label);
  const tableP = (head, rows, right = []) => h('div.a-scroll', h('table.a-table',
    h('thead', h('tr', head.map((c, j) => h('th', { class: right.includes(j) ? 'r' : null }, c)))),
    h('tbody', rows)));
  // dica ao passar o mouse, com as cores fora do app (o balão fica no corpo da página)
  function tipOn(el, title, rows) {
    el.addEventListener('pointermove', (e) => GP.showTip(e.clientX, e.clientY, rows, title));
    el.addEventListener('pointerleave', GP.hideTip);
  }
  function steps(list) {
    return h('ol.a-steps', list.map((x) => h('li', { class: x.tone || null },
      h('span.sdot', icon(x.tone === 'crit' || x.tone === 'warn' ? 'alert' : x.tone === 'wait' ? 'clock' : 'check')),
      h('div', h('b', x.t), x.d ? h('span', x.d) : null, x.time ? h('time', ' ' + x.time) : null))));
  }
  const SERIES = ['#0A8FD6', '#E0268A', '#6F9C00', '#7A3FC0'];
  const ACQS = [['Rede', SERIES[0]], ['Stone', SERIES[1]], ['Getnet', SERIES[2]]];

  /* =========================================================
     Visão do dia
     ========================================================= */
  function loteInfo() {
    const list = FN.devs.filter((d) => d.st === 'lote');
    return { list, n: list.length, v: sum(list, (d) => d.valor), units: new Set(list.map((d) => d.unit)).size };
  }
  function todo() {
    const L = loteInfo();
    return [
      { k: 'crit', l: 'Hoje, 18h', t: 'Goiânia: a Stone creditou R$ 3.411,80 a menos que o agendado', d: 'Tratativa T-2211, com a Bruna, do financeiro', go: () => openRec('banco') },
      { k: 'crit', l: 'Hoje, 16h', t: 'Goiânia: venda de R$ 254,70 fora do ERPFLEX', d: 'Produto sem cadastro; o reenvio foi recusado', go: () => openSaleFromAnywhere('P4-482244') },
      { k: 'warn', l: 'Amanhã', t: 'Barra Funda: PIX cobrado R$ 30,00 a menos', d: 'QR Code aberto com o valor antigo, operador Diego. A gerente foi avisada.', go: () => openSaleFromAnywhere('P4-482167') },
      st.lote === 'efetivado'
        ? { k: 'good', l: 'Feito', t: 'Lote de devoluções de hoje devolvido', d: 'Os clientes foram avisados no WhatsApp', go: () => goFin('devolucoes') }
        : { k: 'info', l: '16h', t: `Lote de devoluções de hoje: ${L.n} pedidos, ${brl(L.v)}`, d: 'Aprovação da controladoria, no celular', go: () => goFin('devolucoes') },
      { k: 'warn', l: 'Sexta', t: 'Stone: crédito à vista a 1,99%; o contrato diz 1,79%', d: 'Contestação pronta, com as vendas do mês', go: () => goFin('taxas') },
    ];
  }
  function splitCanais() {
    const tot = sum(FN.canais, (c) => c[1]);
    return h('div.split',
      h('div.split-bar', { role: 'img', 'aria-label': 'Vendas de ontem por canal: ' + FN.canais.map(([l, v]) => l + ' ' + brl0(v)).join(', ') },
        FN.canais.map(([l, v], i) => {
          const seg = h('span', { style: `width:${(v / tot) * 100}%;background:${SERIES[i]}` });
          tipOn(seg, l, [{ value: brl0(v), label: pct1(v / tot) + ' do dia', color: SERIES[i] }]);
          return seg;
        })),
      h('div.split-legend', FN.canais.map(([l, v], i) => h('span', h('i', { style: 'background:' + SERIES[i] }), h('b', fmt.compactBRL(v)), ' ' + l.toLowerCase()))));
  }
  function scrVisao() {
    const on = D.luzes.filter((u) => u.on).length;
    const won = A().etapa >= 5;
    const V = FN.vendas;
    const items = todo();
    return h('div',
      hrow('Visão do dia', `Rede, ${FN.hoje}. As vendas de ontem foram conferidas às 6h05 no PDV, no ERPFLEX, na adquirente e no banco.`),
      h('div.lights', { 'data-tour': 'luzes' },
        h('div.lights-h', h('b', `${on} de 14 unidades com o dinheiro de ontem conferido`), h('span', 'luzes da rede')),
        h('div.lights-row', D.luzes.map((u) => h('div.light', { class: u.on ? 'on' : null, title: u.name + (u.on ? ': tudo conferido' : ': com pendência') }, h('i'), u.name)))),
      h('div.a-kpis',
        kpi('Vendas de ontem', brl0(sum(FN.canais, (c) => c[1])), fmt.int(V.total) + ' vendas em 14 unidades'),
        kpi('Conferido nos três lados', pct1(V.conciliadas / V.total), 'PDV, adquirente e banco'),
        kpi('Reenviadas ao ERPFLEX', V.reenviadasOk + ' de ' + V.falhouPrimeira, 'sozinhas, em minutos', true),
        kpi('Sinais de festa hoje', won ? '24' : '23', won ? '+1 agora: Mariana, R$ 987' : 'confirmados pelo banco', won)),
      h('div.a-grid2',
        panel({ 'data-tour': 'todo' }, 'Precisa de alguém', 'toque para abrir a origem',
          h('ul.todo', items.map((x) => h('li.click', press(x.go), chip(x.k, x.l), h('b', x.t), h('small', x.d))))),
        stack(
          panel(null, 'Ontem, por canal', 'passe o mouse', splitCanais()),
          panel(null, 'Festas: o dinheiro antes da festa', 'hoje',
            h('div.vs-cols',
              h('div', h('b', won ? 'R$ 49,6 mil' : 'R$ 48,6 mil'), h('span', 'em sinais e quitações confirmados pelo banco')),
              h('div', h('b', '100%'), h('span', 'lançados como adiantamento no ERPFLEX'))),
            h('p.a-foot', { style: 'padding:0 14px 12px' }, 'O sinal entra no ERPFLEX no dia do pagamento, e não depois da festa.')))));
  }

  /* =========================================================
     Vendas conferidas
     ========================================================= */
  const ERP = { ok: ['good', 'No ERPFLEX'], retry: ['info', 'Reenviada'], pending: ['crit', 'Com a equipe'], none: ['muted', 'Sem venda'] };
  const REC = { ok: ['good', 'Conferida'], diff: ['crit', 'Valor diferente'], missing: ['warn', 'Sem transação'], pos: ['warn', 'Sem venda no PDV'], weak: ['info', 'Pelo pedido'] };
  const FILTERS = [['todas', 'Todas'], ['diverg', 'Com divergência'], ['reenv', 'Reenviadas'], ['Ingressos', 'Ingressos'], ['Lanchonete', 'Lanchonete'], ['Site', 'Site']];
  const diverg = (t) => (t.rec !== 'ok' && t.rec !== 'weak') || t.erp === 'pending';
  function scrVendas() {
    const V = FN.vendas;
    let rows = FN.txs;
    if (st.venFilter === 'diverg') rows = rows.filter(diverg);
    else if (st.venFilter === 'reenv') rows = rows.filter((t) => t.erp === 'retry');
    else if (st.venFilter !== 'todas') rows = rows.filter((t) => t.canal === st.venFilter);
    const step = (label, value, note, ratio) => h('div.a-kpi', h('span', label), h('b', value), meter(ratio, 's1'), h('small', note));
    const maxF = Math.max(...FN.falhas.map((f) => f[1]));
    return h('div',
      hrow('Vendas conferidas', `Ontem, ${FN.ontem}: cada venda no PDV, no ERPFLEX e na adquirente ou no banco. Roda todo dia às 6h.`),
      h('div.a-kpis', { 'data-tour': 'funil' },
        step('Vendidas nos PDVs', fmt.int(V.total), 'P4Play, IMobile e site', 1),
        step('No ERPFLEX', fmt.int(V.total - V.comEquipe), V.reenviadasOk + ' reenviadas sozinhas', (V.total - V.comEquipe) / V.total),
        step('Conferidas', fmt.int(V.conciliadas), 'com a adquirente ou o banco', V.conciliadas / V.total),
        step('Baixadas no ERPFLEX', fmt.int(V.baixadas), 'com banco e data', V.baixadas / V.total)),
      h('div.a-grid2',
        panel({ 'data-tour': 'reenvio' }, 'O reenvio ao ERPFLEX', 'ontem',
          h('div.retry', h('b', V.reenviadasOk + ' de ' + V.falhouPrimeira),
            h('p', `vendas que não subiram ao ERPFLEX na primeira tentativa foram reenviadas sozinhas, em minutos. ${V.comEquipe} precisam de alguém. Pelos mapas, essa correção levava até uma semana.`))),
        panel(null, 'Falha na primeira tentativa', 'por sistema, ontem',
          h('div.hbars', FN.falhas.map(([l, v, note]) => h('div.hb', { title: note }, h('span', l), h('div.hb-track', h('div.hb-fill', { style: `width:${(v / maxF) * 100}%` })), h('b', String(v))))))),
      panel({ style: 'margin-top:12px' }, 'Vendas de ontem', `amostra de ${rows.length} de ${fmt.int(V.total)}; toque numa venda`,
        h('div.a-seg', { role: 'group', 'aria-label': 'Filtrar vendas', style: 'margin:10px 14px 4px' },
          FILTERS.map(([k, l]) => h('button', { type: 'button', 'aria-pressed': String(st.venFilter === k), dataset: { keep: 'vf-' + k }, onclick: () => { st.venFilter = k; GP.app.render('vf-' + k); } }, l))),
        tableP(['Hora', 'Unidade', 'Canal', 'Valor', 'Forma', 'ERPFLEX', 'Conferência'],
          rows.map((t) => h('tr.click', { dataset: { tx: t.id }, ...press(() => openSale(t.id)) },
            h('td', t.h), h('td', h('b', t.unit), h('span.sub', t.id)), h('td', t.canal, h('span.sub', t.pdv)),
            h('td.r', brl(t.valor)), h('td', t.forma), h('td', chip(...ERP[t.erp])), h('td', chip(...REC[t.rec]))))
            .concat(rows.length ? [] : [h('tr', h('td', { colspan: 7 }, 'Nenhuma venda neste filtro.'))]), [3])));
  }
  function openSale(id) {
    const t = FN.txs.find((x) => x.id === id);
    if (!t) return;
    const main = document.querySelector('#app .app-main');
    if (main) {
      main.querySelectorAll('tr.sel').forEach((e) => e.classList.remove('sel'));
      const row = main.querySelector(`tr[data-tx="${id}"]`);
      if (row) row.classList.add('sel');
    }
    const acq = FN.ACQ[t.unit], bank = FN.BANK[acq];
    const pago = t.cobrado != null ? t.cobrado : t.valor;
    const payer = t.forma === 'PIX' ? (acq === 'Rede' ? 'Itaú, PIX recebidos' : 'Stone, arquivo de PIX') : t.canal === 'Site' ? 'Getnet, extrato eletrônico' : acq + ', arquivo de vendas';
    const [kl, kv] = t.key;
    const short = kv.length > 18 ? kv.slice(0, 10) + '…' + kv.slice(-6) : kv;
    const erpN = 'VD ' + (731000 + (parseInt(t.id.replace(/\D/g, ''), 10) % 9000));
    const box = (src, val, key, bad) => h('div.keybox', { class: bad ? 'bad' : null }, h('span.ksrc', src), h('span.kval', val), h('span.kkey', key));
    const keys = h('div.keys3',
      t.rec === 'pos' ? box('PDV', 'sem venda', 'nenhuma venda registrada', true) : box(t.pdv, brl(t.valor), kl + ' ' + short),
      t.erp === 'pending' ? box('ERPFLEX', 'não entrou', 'reenvio recusado', true)
        : t.erp === 'none' ? box('ERPFLEX', 'sem lançamento', 'falta a venda', true)
          : box('ERPFLEX', brl(t.valor), erpN + ', ' + kl + ' ' + short),
      t.rec === 'missing' ? box(payer, 'sem registro', 'nenhuma transação', true) : box(t.rec === 'pos' ? acq + ', maquininha' : payer, brl(pago), kl + ' ' + short, t.rec === 'diff'));
    const tl = [];
    if (t.rec !== 'pos') tl.push({ t: 'Venda no ' + t.pdv, d: (t.itens || t.canal) + (t.canal !== 'Site' ? ', operador ' + t.op : ''), time: t.h });
    if (t.erp === 'ok') tl.push({ t: 'Integrada ao ERPFLEX', d: 'em 10 segundos' });
    if (t.erp === 'retry') tl.push({ t: 'Não subiu na primeira tentativa', d: 'o ERPFLEX não respondeu a tempo', tone: 'warn' }, { t: 'Reenviada pelo GlowHub', d: t.nota });
    if (t.erp === 'pending') tl.push({ t: 'Reenvio recusado', d: t.nota, tone: 'crit' }, { t: 'Tratativa T-2216 aberta', d: 'com a Bruna, do financeiro, prazo hoje às 16h', tone: 'wait' });
    if (t.forma === 'PIX' && t.rec !== 'missing') tl.push({ t: 'PIX creditado', d: payer + ', lido por API' });
    if (t.rec === 'ok') tl.push({ t: 'Conferida pela chave ' + kl, d: 'o mesmo valor nos três lados', time: '06:02' }, { t: 'Contas a receber baixado no ERPFLEX', d: (t.forma === 'PIX' ? bank : acq) + ', crédito de 04/11', time: '06:03' });
    if (t.rec === 'weak') tl.push({ t: 'Conferida pelo número do pedido', d: t.nota, time: '06:05' });
    if (t.rec === 'diff') tl.push({ t: 'Valor diferente: ' + brl(t.valor - pago) + ' a menos', d: t.nota, tone: 'crit', time: '06:02' }, { t: 'Gerente avisada no WhatsApp', d: 'Priscila, com o nome do operador', time: '06:04' }, { t: 'Tratativa T-2214 aberta', d: 'prazo amanhã às 12h', tone: 'wait' });
    if (t.rec === 'missing') tl.push({ t: 'Venda sem transação na adquirente', d: t.nota, tone: 'crit', time: '06:02' }, { t: 'Tratativa T-2221 aberta', d: 'gerente Karina, prazo amanhã às 12h', tone: 'wait' });
    if (t.rec === 'pos') tl.push({ t: 'Transação na maquininha', d: brl(t.valor) + ' no crédito', time: t.h }, { t: 'Sem venda no PDV', d: t.nota, tone: 'crit', time: '06:02' }, { t: 'Tratativa T-2219 aberta', d: 'gerente Fábio, prazo amanhã às 12h', tone: 'wait' });
    const acts = t.rec === 'diff'
      ? [btn('Registrar como perda', () => toast('Registrado como perda de caixa, com o operador Diego.'), true), btn('Ver o alerta da gerente', () => { if (GP.phone) GP.phone.show('gerente'); })]
      : t.erp === 'pending' ? [btn('Cadastrar o produto e reenviar', () => toast('Produto cadastrado. A venda foi reenviada ao ERPFLEX.'), true)]
        : t.rec === 'pos' ? [btn('Pedir o registro da venda', () => toast('Pedido de registro enviado ao gerente Fábio.'), true)] : [];
    openDrawer('Venda ' + t.id, `${t.unit}, ontem às ${t.h}` + (t.canal === 'Site' ? ', compra no site' : t.rec === 'pos' ? '' : ', operador ' + t.op), [
      h('section.a-sec', h('h5', 'A mesma venda nos três lados'), keys),
      h('section.a-sec', h('h5', 'A vida da venda'), steps(tl)),
      acts.length ? h('div.a-actions-row', acts) : null,
    ], { tour: 'venda-detalhe' });
  }
  function openSaleFromAnywhere(id) {
    st.venFilter = 'todas';
    goFin('vendas');
    openSale(id);
  }

  /* =========================================================
     Recebíveis
     ========================================================= */
  const REC_TABS = [['agenda', 'Agenda'], ['baixas', 'Baixas no ERPFLEX'], ['debitos', 'Débitos'], ['banco', 'Banco']];
  function openRec(tab) { st.recTab = tab; goFin('recebiveis'); }
  function scrRecebiveis() {
    const body = { agenda: recAgenda, baixas: recBaixas, debitos: recDebitos, banco: recBanco }[st.recTab]();
    return h('div',
      hrow('Recebíveis', 'O que as adquirentes vão pagar, o que pagaram, o que debitaram e o que chegou ao banco. A Rede pela API, a Stone pelo arquivo diário e a Getnet pelo extrato eletrônico.'),
      h('div.a-seg', { role: 'tablist', 'aria-label': 'Recebíveis' },
        REC_TABS.map(([k, l]) => h('button', { type: 'button', role: 'tab', 'aria-selected': String(st.recTab === k), dataset: { keep: 'rt-' + k }, onclick: () => { st.recTab = k; GP.app.render('rt-' + k); } }, l))),
      body);
  }
  function recAgenda() {
    const ag = FN.agenda;
    const tot = (arr, k) => sum(arr, (a) => a[k]);
    const next5 = ag.slice(0, 5);
    const max = Math.max(...ag.map((a) => a.Rede + a.Stone + a.Getnet));
    const plot = h('div.cc-plot', { role: 'img', 'aria-label': `Agenda de recebíveis dos próximos 30 dias: Rede ${fmt.compactBRL(tot(ag, 'Rede'))}, Stone ${fmt.compactBRL(tot(ag, 'Stone'))} e Getnet ${fmt.compactBRL(tot(ag, 'Getnet'))}` });
    ag.forEach((a) => {
      const col = h('div.cc-col');
      ACQS.forEach(([k, c]) => col.appendChild(h('span', { style: `height:${(a[k] / max) * 100}%;background:${c}` })));
      tipOn(col, a.label, ACQS.map(([k, c]) => ({ value: brl0(a[k]), label: k, color: c })).concat([{ value: brl0(a.Rede + a.Stone + a.Getnet), label: 'no dia' }]));
      plot.appendChild(col);
    });
    return h('div',
      h('div.a-kpis',
        kpi('Próximos 5 dias úteis', fmt.compactBRL(tot(next5, 'Rede') + tot(next5, 'Stone') + tot(next5, 'Getnet')), 'as três adquirentes'),
        kpi('Rede, 30 dias', fmt.compactBRL(tot(ag, 'Rede')), 'API de gestão de vendas'),
        kpi('Stone, 30 dias', fmt.compactBRL(tot(ag, 'Stone')), 'arquivo de conciliação'),
        kpi('Getnet, 30 dias', fmt.compactBRL(tot(ag, 'Getnet')), 'extrato eletrônico')),
      panel(null, 'Agenda de recebíveis, próximos 30 dias', 'valor líquido por dia útil; passe o mouse',
        h('div.colchart', plot, h('div.cc-x', { 'aria-hidden': 'true' }, ag.map((a, i) => h('span', i % 3 === 0 ? a.label.split(' ')[1] : '')))),
        h('div.cc-legend', ACQS.map(([k, c]) => h('span', h('i', { style: 'background:' + c }), k)), h('span.a-muted', 'a segunda-feira recebe o fim de semana; 20/11 é feriado'))));
  }
  function recBaixas() {
    return h('div',
      panel(null, 'Parcelas pagas ontem', 'arquivo da adquirente × parcela esperada',
        tableP(['Adquirente', 'Parcelas', 'Valor', 'Baixadas', 'Conferência'],
          FN.baixas.map((b) => h('tr', h('td', h('b', b.acq)), h('td.r', fmt.int(b.parcelas)), h('td.r', brl(b.valor)), h('td.r', fmt.int(b.baixadas)),
            h('td', b.menor ? chip('warn', b.menor + (b.menor > 1 ? ' pagas a menor' : ' paga a menor')) : chip('good', 'todas conferem')))), [1, 2, 3]),
        h('p.a-foot', { style: 'padding:0 14px 12px' }, 'Cada parcela que confere é baixada no ERPFLEX com o banco e a data do crédito. A baixa de títulos que já existem é acertada com a ERPFLEX na etapa zero.')),
      panel({ style: 'margin-top:12px' }, 'Parcelas pagas a menor', 'em análise',
        tableP(['Adquirente', 'Venda', 'Parcela', 'Esperado', 'Pago', 'Diferença', 'Situação'],
          FN.pagasMenor.map(([a, v, p, esp, pago]) => h('tr', h('td', a), h('td', v), h('td', p), h('td.r', brl(esp)), h('td.r', brl(pago)), h('td.r', brl(pago - esp)), h('td', chip('warn', 'em análise')))), [3, 4, 5])));
  }
  function recDebitos() {
    return panel({ 'data-tour': 'debitos' }, 'Débitos das adquirentes, últimos 7 dias', 'estornos cruzados com as devoluções',
      tableP(['Tipo', 'Unidade', 'Valor', 'Conferência', 'O que o GlowHub fez'],
        FN.debitos.map((d) => h('tr', h('td', h('b', d.tipo), h('span.sub', d.acq)), h('td', d.unit), h('td.r', brl(d.valor)),
          h('td', d.ok ? chip('good', d.status) : chip(d.tipo === 'Chargeback' ? 'warn' : 'crit', d.status), h('span.sub', d.det)), h('td', h('span.a-muted', d.acao)))), [2]),
      h('div.a-actions-row', btn('Contestar o estorno duplicado', () => toast('Contestação enviada à Getnet, com a prova do estorno duplicado.'), true)));
  }
  function recBanco() {
    const curto = FN.banco.find((b) => b.creditado < b.agendado);
    return h('div',
      panel({ 'data-tour': 'credito-menor' }, 'Crédito a menor', 'Stone, ' + curto.dia,
        h('div.retry', h('b.bad', brl(curto.agendado - curto.creditado)),
          h('p', `O valor que o arquivo da Stone agendou para ${curto.dia} não entrou inteiro na conta `, h('span.nw', curto.conta), '. A cobrança sai com o arquivo e o extrato anexados.')),
        h('div.a-actions-row', btn('Cobrar a Stone', () => toast('Cobrança enviada à Stone, com o arquivo e o extrato anexados.'), true), btn('Ver a tratativa T-2211', () => goFin('tratativas')))),
      panel({ style: 'margin-top:12px' }, 'Agendado pela adquirente × creditado no banco', 'últimos 3 dias úteis; 02/11 foi feriado',
        tableP(['Adquirente e dia', 'Conta', 'Agendado', 'Creditado', 'Conferência'],
          FN.banco.slice().reverse().map((b) => {
            const dif = b.creditado - b.agendado;
            return h('tr', { class: dif ? 'hl' : null }, h('td', h('b', b.acq), h('span.sub', b.dia)), h('td', b.conta), h('td.r', brl(b.agendado)), h('td.r', brl(b.creditado)),
              h('td', dif ? chip('crit', brl(-dif) + ' a menos') : chip('good', 'confere')));
          }), [2, 3])));
  }

  /* =========================================================
     Festas e sinais
     ========================================================= */
  // como nos modelos do sistema: "Festa de Alice"
  const nomeFesta = (festa) => { const [n, dia] = festa.split(', '); return 'Festa de ' + n + ', ' + dia; };
  function cobRows() {
    const e = A().etapa;
    return D.cobrancas.filter((c) => !c.mariana || e >= 3).map((c) => {
      if (!c.mariana) return { ...c, erp: c.status[0] === 'good' ? 'Adiantamento lançado' : 'Lança quando o banco confirmar' };
      // com o horário pré-reservado e o orçamento ligado, o sinal da Mariana espera o envio da cobrança (RF-FES-02)
      if (e === 3) return { ...c, status: ['muted', 'Cobrança a enviar'], hora: null, erp: 'Lança quando o banco confirmar', aEnviar: true };
      return { ...c, status: e >= 5 ? ['good', 'Confirmado pelo banco às 20:03'] : ['warn', 'Aguardando o PIX'], hora: e >= 5 ? '20:03' : null, erp: e >= 5 ? 'Adiantamento lançado às 20:04' : 'Lança quando o banco confirmar' };
    });
  }
  function openCob(c) {
    if (c.aEnviar) {
      openDrawer('Orçamento ' + c.orc, `${nomeFesta(c.festa)}, ${c.unit}. ${c.cliente}.`, [
        h('section.a-sec', h('h5', 'A cobrança'), h('p', `Sinal de ${brl(c.valor)}, 30% do Glow Festa Plus de ${brl(F.valor)}, por PIX com identificador: txid GLOW${c.orc}S…, com vencimento no sábado, 07/11, junto com a pré-reserva.`)),
        h('section.a-sec', h('h5', 'Como chega à família'), h('p', 'No WhatsApp, pelo número oficial da Glow Park, com o PIX copia e cola. O pagamento é identificado sozinho: ninguém pede comprovante.')),
        h('div.a-actions-row', btn('Enviar a cobrança do sinal', () => {
          GP.app.setEtapa(4, { phone: false });
          if (GP.phone) GP.phone.show('familia', { from: 3, play: true });
          toast('Cobrança do sinal enviada no WhatsApp da Mariana: R$ 987,00, com o PIX copia e cola.');
        }, true)),
      ]);
      return;
    }
    const ok = c.status[0] === 'good';
    const bank = FN.BANK[FN.ACQ[c.unit]];
    const main = document.querySelector('#app .app-main');
    if (main) {
      main.querySelectorAll('tr.sel').forEach((x) => x.classList.remove('sel'));
      const row = main.querySelector(`tr[data-orc="${c.orc}"]`);
      if (row) row.classList.add('sel');
    }
    openDrawer('Orçamento ' + c.orc, `${nomeFesta(c.festa)}, ${c.unit}. ${c.cliente}.`, [
      h('section.a-sec', h('h5', 'A cobrança'), steps([
        { t: `${c.tipo}: ${brl(c.valor)} por PIX com identificador`, d: 'txid GLOW' + c.orc + c.tipo[0] + '…', time: '' },
        ok ? { t: 'Confirmado pelo ' + bank, d: 'sem comprovante: o banco avisou o GlowHub', time: c.hora || '' } : { t: 'Aguardando o pagamento', d: 'a família recebeu o QR Code no WhatsApp', tone: 'wait' },
      ])),
      ok ? h('section.a-sec', h('h5', 'Lançamento no ERPFLEX, no dia do pagamento'),
        h('div.entry', h('div', h('span', 'D Banco ' + bank), h('b', brl(c.valor))), h('div', h('span', 'C Adiantamento de clientes, orçamento ' + c.orc), h('b', brl(c.valor))))) : null,
      h('section.a-sec', h('h5', 'Depois da festa'), h('p', 'O gerente confirma o consumo, a venda sai montada a partir do orçamento e o adiantamento vira receita. A conciliação diária confere que o orçamento zerou.')),
      ok ? null : h('div.a-actions-row', btn('Reenviar a cobrança', () => toast('Cobrança reenviada no WhatsApp da família.'), true)),
    ]);
  }
  function scrFestas() {
    const e = A().etapa;
    const FS = FN.festas, sb = FS.semBaixa;
    return h('div',
      hrow('Festas e sinais', 'PIX com o número do orçamento dentro: o banco confirma, e o adiantamento entra no ERPFLEX no mesmo dia. O painel substitui a planilha de festas.'),
      h('div.a-kpis',
        kpi('Adiantamentos de festas', fmt.compactBRL(FS.adiantamentos + (e >= 5 ? F.sinal : 0)), 'no ERPFLEX, de festas ainda não realizadas'),
        kpi('PIX de festa confirmados hoje', String(FS.pixHoje + (e >= 5 ? 1 : 0)), 'pelo banco, sem pedir comprovante', true),
        kpi('Festas nos próximos 7 dias', String(FS.proximos7), 'em 14 unidades'),
        kpi('Realizadas sem baixa', '1', 'alerta para o gerente e o financeiro')),
      panel({ 'data-tour': 'festas-tabela' }, 'Cobranças de festas', 'hoje; toque numa cobrança',
        tableP(['Orçamento', 'Cliente', 'Festa', 'Tipo', 'Valor', 'No banco', 'No ERPFLEX'],
          cobRows().map((c) => h('tr.click', { class: c.mariana ? 'hl' : null, 'data-tour': c.mariana ? 'cob-mariana' : null, dataset: { orc: String(c.orc) }, ...press(() => openCob(c)) },
            h('td', String(c.orc)), h('td', c.cliente), h('td', c.festa), h('td', c.tipo), h('td.r', brl(c.valor)),
            h('td', chip(c.status[0], c.status[1])), h('td', c.erp))), [4])),
      panel({ style: 'margin-top:12px' }, 'Realizada sem baixa', sb.unit,
        h('div.retry', h('b.bad', brl(sb.valor)),
          h('p', `${sb.festa}, ${sb.dia}: adiantamentos esperando a baixa. Com o consumo confirmado pelo gerente, a venda sai montada a partir do orçamento ${sb.orc} e os adiantamentos viram receita.`)),
        h('div.a-actions-row', btn('Lançar a venda e baixar', () => toast('Venda lançada e adiantamentos de ' + brl(sb.valor) + ' baixados.'), true))));
  }

  /* =========================================================
     Ingressos do site
     ========================================================= */
  function scrSite() {
    const S = FN.site;
    const maxA = Math.max(...S.aging.map((a) => a[1]));
    return h('div',
      hrow('Ingressos do site', 'O dinheiro do site entra como adiantamento de cliente no dia da compra e vira receita quando o ingresso é usado.'),
      h('div.a-kpis',
        kpi('Ingressos pagos e não usados', fmt.compactBRL(S.saldo), fmt.int(S.pedidos) + ' pedidos'),
        kpi('Vendidos ontem', brl(S.vendidos[1]), S.vendidos[0] + ' pedidos entraram no adiantamento'),
        kpi('Usados ontem', brl(S.usados[1]), S.usados[0] + ' pedidos viraram receita'),
        kpi('Fora do ERPFLEX', '0', 'de ' + S.vendidos[0] + ' pedidos de ontem', true)),
      h('div.a-grid2',
        panel(null, 'Idade do saldo', 'há quanto tempo o ingresso está sem uso',
          h('div.hbars', S.aging.map(([l, v]) => h('div.hb', h('span', l), h('div.hb-track', h('div.hb-fill', { style: `width:${(v / maxA) * 100}%` })), h('b', fmt.compactBRL(v))))),
          h('p.a-foot', { style: 'padding:0 14px 12px' }, `Mais de 180 dias: ${brl0(S.aging[4][1])}. A regra para virar receita é decidida com a Glow Park e o contador (CPC 47).`)),
        panel(null, 'As duas conciliações do site', 'ontem',
          h('div.vs-cols',
            h('div', h('b', '34 de 34'), h('span', 'pedidos do site chegaram ao P4Play, pelo número do pedido')),
            h('div', h('b', '34 de 34'), h('span', 'casados com a Getnet pelo extrato eletrônico'))),
          h('p.a-foot', { style: 'padding:0 14px 12px' }, 'O CV não volta no retorno da autorização da Getnet. O extrato eletrônico diário traz o CV, o TID e o número do pedido, e o GlowHub concilia por eles.'))));
  }

  /* =========================================================
     Devoluções
     ========================================================= */
  const DEV_COLS = [['nova', 'Novas'], ['validacao', 'Em validação'], ['lote', 'No lote de hoje'], ['aprovada', 'Aprovadas'], ['efetivada', 'Dinheiro devolvido']];
  function devCol(d) {
    if (d.st === 'lote') return st.lote === 'aprovado' ? 'aprovada' : st.lote === 'efetivado' ? 'efetivada' : 'lote';
    if (d.st === 'aprovada') return st.lote === 'efetivado' ? 'efetivada' : 'aprovada';
    return d.st;
  }
  function rerender(screen) { if (onScreen(screen)) GP.app.render(); }
  function sendLote() {
    st.lote = 'enviado';
    rerender('devolucoes');
    if (GP.phone) GP.phone.show('aprovacao');
    toast('Lote enviado para a aprovação da controladoria.');
  }
  function approveLote() {
    st.lote = 'aprovado';
    rerender('devolucoes');
    if (GP.phone && GP.phone.view() === 'aprovacao') GP.phone.show('aprovacao');
    toast('Lote aprovado no celular pela controladoria.');
  }
  function effectLote() {
    st.lote = 'efetivado';
    rerender('devolucoes');
    if (GP.phone) GP.phone.show('portal');
    toast('Dinheiro devolvido. Os clientes foram avisados no WhatsApp.');
  }
  function devCard(d) {
    return h('div.kb-card.click', { class: st.mark === d.id ? 'hl' : null, dataset: { dev: d.id }, ...press(() => openDev(d.id)) },
      h('b', d.cliente), h('span.kb-info', d.motivo),
      h('div.kb-meta', h('span', d.unit), h('span', brl(d.valor))),
      d.dup ? chip('crit', 'Já devolvida') : d.pre ? chip('good', 'Pré-aprovado') : chip('muted', d.canal));
  }
  function openDev(id) {
    const d = FN.devs.find((x) => x.id === id);
    const col = devCol(d);
    const checks = [
      { t: 'Venda ' + d.venda + ' localizada', d: brl(d.valor) + ', ' + d.unit },
      d.dup ? { t: 'Devolução anterior para a mesma venda', d: d.dup, tone: 'crit' } : { t: 'Nenhuma devolução anterior para esta venda', d: 'a soma devolvida não passa do valor da venda' },
      d.pre ? { t: 'Motivo pré-aprovado', d: 'segue direto para o lote do dia' } : { t: 'Motivo pede validação', d: 'o financeiro confere antes do lote', tone: col === 'nova' || col === 'validacao' ? 'wait' : '' },
      d.forma.startsWith('PIX') ? { t: 'Chave PIX validada', d: 'o nome do titular confere com o do cliente' } : null,
    ].filter(Boolean);
    const exec = d.forma.startsWith('PIX') ? 'PIX para a chave do cliente, pela remessa do banco' : d.forma.includes('Getnet') ? 'Estorno pela API da Getnet' : 'Portal da ' + d.forma.split(', ')[1] + ', com a venda já localizada';
    openDrawer(d.id + ', ' + d.cliente, `${d.unit}. Pedido da gerência, ${d.hora === 'ontem' ? 'ontem' : 'hoje às ' + d.hora}.`, [
      h('section.a-sec', h('h5', 'O pedido'), h('div.a-kv', h('span', 'Motivo'), h('div', d.motivo), h('span', 'Valor'), h('div', brl(d.valor)), h('span', 'Como volta'), h('div', d.forma), h('span', 'Situação'), h('div', DEV_COLS.find((c) => c[0] === col)[1]))),
      h('section.a-sec', h('h5', 'Checagem automática'), steps(checks)),
      h('section.a-sec', h('h5', 'Depois da aprovação'), h('p', exec + '. O comprovante fica no pedido e o cliente recebe cada etapa no WhatsApp.')),
      d.dup && col === 'validacao' ? h('div.a-actions-row', btn('Recusar por duplicidade', () => { closeDrawer(); toast('Pedido recusado por duplicidade. O gerente recebeu o motivo.'); }, true)) : null,
    ]);
  }
  function scrDevolucoes() {
    const L = loteInfo();
    const msg = {
      aberto: 'Fecha às 16h e vai para a controladoria. Quem validou não aprova.',
      enviado: 'Enviado à controladoria, que aprova no celular.',
      aprovado: 'Aprovado. Pronto para devolver.',
      efetivado: 'Estornos pela API e pelos portais das adquirentes; PIX pelo Itaú e pelo Santander.',
    }[st.lote];
    const action = {
      aberto: btn('Enviar para aprovação', sendLote, true),
      enviado: btn('Abrir o celular da controladoria', () => { if (GP.phone) GP.phone.show('aprovacao'); }),
      aprovado: btn('Devolver o dinheiro', effectLote, true),
      efetivado: btn('Ver o que o cliente vê', () => { if (GP.phone) GP.phone.show('portal'); }),
    }[st.lote];
    const maxM = Math.max(...FN.devMotivos.map((m) => m[1]));
    const way = (ic, t, d, tag) => h('li', h('span.way-i', icon(ic)), h('b', t), h('small', d), h('em', tag));
    return h('div',
      hrow('Devoluções', 'Pedido do gerente no celular, checagem automática, lote diário com aprovação e o dinheiro de volta ao cliente.'),
      h('div.a-kpis',
        kpi('Do pedido ao dinheiro', '0,8 dia', 'pelos mapas, até 7 dias hoje', true),
        kpi('Devoluções no mês', '360', 'média declarada no mapa'),
        kpi('Sem validação manual', '46%', 'motivos pré-aprovados'),
        kpi('Reclame Aqui: estorno', '43,65%', 'das reclamações, de março a agosto')),
      panel(null, 'Fila única', 'toque num pedido',
        h('div.lote', { 'data-tour': 'lote' },
          h('div', h('b', st.lote === 'efetivado' ? 'Lote de hoje devolvido' : `Lote de hoje: ${L.n} pedidos de ${L.units} unidades, ${brl(L.v)}`), h('span', msg)),
          action),
        h('div.kanban.short', { 'data-tour': 'fila' }, DEV_COLS.map(([k, l]) => {
          const items = FN.devs.filter((d) => devCol(d) === k);
          return h('div.kb-col', { role: 'group', 'aria-label': l + ', ' + items.length },
            h('h5', l, h('b', String(items.length))),
            items.slice(0, 5).map(devCard),
            items.length > 5 ? h('p.kb-more', '+ ' + (items.length - 5) + ' pedidos') : null);
        }))),
      h('div.a-grid2', { style: 'margin-top:12px' },
        panel(null, 'Motivos no mês', 'pedidos',
          h('div.hbars.wide', FN.devMotivos.map(([l, v]) => h('div.hb', h('span', l), h('div.hb-track', h('div.hb-fill', { style: `width:${(v / maxM) * 100}%` })), h('b', String(v)))))),
        panel(null, 'Como o dinheiro volta', null,
          h('ul.ways',
            way('globe', 'Compra no site', 'estorno pela API da Getnet, total ou parcial', 'automático'),
            way('card', 'Cartão no caixa', 'portal da Rede ou da Stone, com a venda já localizada', 'assistido'),
            way('bank', 'Depósito', 'PIX para a chave validada do cliente', 'automático')))));
  }

  /* =========================================================
     Tratativas
     ========================================================= */
  function follow([screen, arg]) {
    if (screen === 'vendas') { openSaleFromAnywhere(arg); return; }
    if (screen === 'recebiveis') { openRec(arg || 'agenda'); return; }
    goFin(screen);
  }
  function scrTratativas() {
    const T = FN.tratativas;
    const tone = (t) => (t.sla < 0.3 ? 'crit' : t.sla < 0.6 ? 'warn' : 'info');
    return h('div',
      hrow('Tratativas', 'Toda divergência vira uma tratativa com dono e prazo. O relatório do dia sai em Excel e PDF.',
        btn('Baixar o relatório do dia', () => toast('Relatório do dia gerado em Excel e PDF.'))),
      h('div.a-kpis',
        kpi('Abertas', String(T.length), 'em 6 unidades'),
        kpi('Vencem hoje', String(T.filter((t) => t.prazo.startsWith('hoje')).length), 'todas com dono'),
        kpi('Resolvidas em 7 dias', '38', 'a maioria no mesmo dia', true),
        kpi('Tempo médio até resolver', '1,2 dia', 'pelos mapas, até uma semana')),
      panel({ 'data-tour': 'tratativas' }, 'Fila de tratativas', 'toque para abrir a origem',
        tableP(['Tratativa', 'Unidade', 'Valor', 'Dono', 'Prazo', 'Situação'],
          T.map((t) => h('tr.click', press(() => follow(t.go)),
            h('td', h('b', t.tipo), h('span.sub', t.id + ': ' + t.desc)), h('td', t.unit), h('td.r', brl(t.valor)), h('td', t.dono),
            h('td', { style: 'min-width:110px' }, h('span', t.prazo), meter(t.sla, tone(t))),
            h('td', chip(tone(t), t.status)))), [2])));
  }

  /* =========================================================
     Taxas
     ========================================================= */
  function taxasAcima() {
    const rows = FN.taxas.map((t) => ({ ...t, dif: (t.cobrada - t.contratada) * t.volume }));
    return { rows, total: sum(rows, (r) => Math.max(0, r.dif)), n: rows.filter((r) => r.dif > 0.005).length };
  }
  function scrTaxas() {
    const { rows, total, n } = taxasAcima();
    return h('div',
      hrow('Taxas das adquirentes', 'O GlowHub compara a taxa cobrada em cada venda com a taxa do contrato. Taxas ilustrativas.'),
      panel({ 'data-tour': 'taxas' }, 'Cobrado acima do contrato', 'neste mês',
        h('div.retry', h('b.bad', brl(total)),
          h('p', `em ${n} modalidades. Referência do Banco Central, 1º semestre de 2025: MDR médio de 2,16% no crédito e 1,08% no débito.`)),
        h('div.a-actions-row', btn('Montar a contestação', () => toast('Contestação montada com as vendas do mês e o contrato.'), true))),
      panel({ style: 'margin-top:12px' }, 'Taxa contratada × cobrada', 'mês atual',
        tableP(['Adquirente', 'Modalidade', 'Contrato', 'Cobrada', 'Volume', 'Diferença', 'Situação'],
          rows.map((r) => h('tr', { class: r.dif > 0.005 ? 'hl' : null },
            h('td', h('b', r.acq)), h('td', r.mod), h('td.r', pct2(r.contratada)), h('td.r', pct2(r.cobrada)), h('td.r', brl0(r.volume)),
            h('td.r', r.dif > 0.005 ? brl(r.dif) : 'nenhuma'), h('td', r.dif > 0.005 ? chip('crit', 'acima do contrato') : chip('good', 'confere')))), [2, 3, 4, 5])));
  }

  /* =========================================================
     Caixa de 13 semanas
     ========================================================= */
  const MIN = 500000, TAXA_ANT = 0.0159;
  function caixaSerie() {
    const W = FN.caixa;
    const first = W.findIndex((w) => w.saldo < MIN);
    const custo = st.ant * TAXA_ANT;
    return W.map((w, i) => {
      let y = w.saldo;
      if (st.ant && first >= 0) { if (i >= first && i < first + 4) y += st.ant; else if (i >= first + 4) y -= custo; }
      return { ini: w.ini, y };
    });
  }
  function scrCaixa() {
    const max = Math.max(...FN.caixa.map((w) => w.saldo)) * 1.12;
    const bars = FN.caixa.map(() => h('div.cx-bar'));
    bars.forEach((b, i) => {
      b.addEventListener('pointermove', (e) => { const x = caixaSerie()[i]; GP.showTip(e.clientX, e.clientY, [{ value: brl0(x.y), label: 'no fim da semana', color: x.y < MIN ? '#D03B3B' : SERIES[0] }], 'Semana de ' + x.ini); });
      b.addEventListener('pointerleave', GP.hideTip);
    });
    const plot = h('div.cx-plot', { role: 'img', 'aria-label': 'Saldo projetado no fim de cada uma das próximas 13 semanas, com a linha do saldo mínimo' },
      h('div.cx-min', { style: `bottom:${(MIN / max) * 100}%` }), bars);
    const minOut = h('b'), minSub = h('p'), status = h('div'), antOut = h('output', { for: 'antRange' }), cost = h('small', { id: 'antCost' });
    const slider = h('input#antRange', { type: 'range', min: 0, max: 300000, step: 25000, value: st.ant, 'aria-describedby': 'antCost' });
    function update() {
      const data = caixaSerie();
      data.forEach((x, i) => { bars[i].style.height = (x.y / max) * 100 + '%'; bars[i].classList.toggle('low', x.y < MIN); });
      const below = data.filter((x) => x.y < MIN);
      const min = data.reduce((a, x) => (x.y < a.y ? x : a), data[0]);
      minOut.textContent = fmt.compactBRL(min.y);
      minSub.textContent = `na semana de ${min.ini}. Saldo mínimo definido: ${fmt.compactBRL(MIN)}.`;
      clear(status).appendChild(below.length ? chip('crit', below.length + (below.length > 1 ? ' semanas abaixo do mínimo' : ' semana abaixo do mínimo')) : chip('good', 'nenhuma semana abaixo do mínimo'));
      antOut.textContent = st.ant ? fmt.compactBRL(st.ant) : 'nada';
      cost.textContent = st.ant
        ? `Custo estimado: ${brl(st.ant * TAXA_ANT)}, a 1,59% ao mês (taxa ilustrativa). Antecipar só na semana que fura o mínimo custa menos do que antecipar sempre.`
        : 'Arraste para simular a antecipação da agenda da Rede na primeira semana abaixo do mínimo.';
      slider.setAttribute('aria-valuetext', st.ant ? 'antecipar ' + fmt.compactBRL(st.ant) : 'sem antecipação');
    }
    slider.addEventListener('input', () => { st.ant = +slider.value; update(); });
    update();
    return h('div',
      hrow('Caixa de 13 semanas', 'Saldo no fim de cada semana, com a agenda das adquirentes, as festas já pagas e as contas a pagar. Valores ilustrativos.'),
      h('div.a-grid2',
        panel({ 'data-tour': 'caixa' }, 'Saldo projetado', 'fim de cada semana; passe o mouse',
          h('div.cx', plot, h('div.cx-x', { 'aria-hidden': 'true' }, FN.caixa.map((w) => h('span', w.ini)))),
          h('div.cc-legend', h('span', h('i', { style: 'background:' + SERIES[0] }), 'saldo da semana'), h('span', h('i', { style: 'background:#D03B3B' }), 'abaixo do mínimo'), h('span', h('i.dash'), 'saldo mínimo, ' + fmt.compactBRL(MIN)))),
        panel(null, 'Antecipar ou esperar', 'simulação',
          h('div.budget.cx-side',
            h('span.a-muted', 'Menor saldo previsto'), minOut, minSub, status,
            h('label', { for: 'antRange' }, 'Antecipar da agenda da Rede: ', antOut), slider, cost))));
  }

  /* =========================================================
     Copiloto
     ========================================================= */
  const QA = [
    { q: 'Quanto a Stone vai pagar nos próximos dias?',
      a: () => { const d5 = FN.agenda.slice(0, 5); const top = d5.reduce((a, x) => (x.Stone > a.Stone ? x : a), d5[0]); return `A Stone tem ${brl(sum(d5, (x) => x.Stone))} agendados para os próximos 5 dias úteis, em 5 depósitos no Santander. O maior cai na ${GP.date.WDL[top.d.getDay()]}, ${fmt.ddmm(top.d)}: ${brl(top.Stone)}, com as vendas do fim de semana.`; },
      src: 'Fonte: arquivo de conciliação da Stone de hoje, 6h.' },
    { q: 'Tem alguma coisa estranha nas vendas de ontem?',
      a: () => 'Quatro pontos. Em Barra Funda, uma venda PIX de R$ 179,80 foi cobrada por R$ 149,80: o QR Code ficou com o valor antigo. Em Catarina Outlet, R$ 120,00 passaram na maquininha sem venda no PDV. Em Goiânia, uma venda não entrou no ERPFLEX porque o produto não tem cadastro. Em Londrina, uma venda da lanchonete não tem transação na Stone.',
      src: 'Fonte: conciliação das vendas de ontem.' },
    { q: 'Quanto temos de adiantamento de festas e do site?',
      a: () => `Festas: ${brl0(FN.festas.adiantamentos)} em adiantamentos no ERPFLEX. Site: ${brl0(FN.site.saldo)} em ${fmt.int(FN.site.pedidos)} pedidos ainda não usados, dos quais ${brl0(FN.site.aging[4][1])} têm mais de 180 dias.`,
      src: 'Fonte: conta de adiantamento de clientes no ERPFLEX e saldo do site no GlowHub.' },
    { q: 'Qual parque mais pediu devolução neste mês?',
      a: () => 'Barra Funda, com 41 pedidos. O motivo mais comum lá é compra em duplicidade no site. Em Goiânia e em Londrina aparecem compras feitas para Hortolândia: o botão de compra dessas páginas abre o checkout com Hortolândia selecionada.',
      src: 'Fonte: fila de devoluções e página de unidades do site.' },
    { q: 'Quanto as adquirentes cobraram acima do contrato?',
      a: () => `Neste mês, ${brl(taxasAcima().total)}: a Rede no crédito de 2 a 6 vezes e a Stone no crédito à vista. A contestação já pode ser montada na tela de taxas.`,
      src: 'Fonte: auditoria de taxas do GlowHub.' },
  ];
  function scrCopiloto() {
    const a = QA[st.q];
    return h('div',
      hrow('Copiloto financeiro', 'Pergunte em português. Ele lê a conciliação, a agenda das adquirentes, o ERPFLEX e os bancos, e cada resposta traz a fonte.'),
      panel({ 'data-tour': 'copiloto' }, 'Pergunte', 'nesta demonstração, escolha uma pergunta',
        h('div.sugg', QA.map((x, i) => h('button', { type: 'button', 'aria-pressed': String(i === st.q), dataset: { keep: 'cq-' + i }, onclick: () => { st.q = i; GP.app.render('cq-' + i); } }, x.q))),
        h('div.ask', { 'aria-live': 'polite' }, h('div.q', a.q), h('div.a', a.a(), h('small', a.src)))));
  }

  /* ---------- as telas do módulo, na ordem da lateral ---------- */
  GP.app.defineScreens('financeiro', [
    { group: 'Todo dia' },
    { id: 'visao', name: 'Visão do dia', icon: 'bulb', unit: REDE },
    { id: 'vendas', name: 'Vendas', icon: 'receipt', unit: REDE, badge: () => FN.txs.filter(diverg).length, badgeLabel: 'com divergência' },
    { id: 'recebiveis', name: 'Recebíveis', icon: 'cal', unit: REDE },
    { id: 'festas', name: 'Festas e sinais', icon: 'cake', unit: REDE },
    { id: 'site', name: 'Ingressos do site', icon: 'globe', unit: REDE },
    { id: 'devolucoes', name: 'Devoluções', icon: 'undo', unit: REDE, badge: () => FN.devs.filter((d) => ['nova', 'validacao'].includes(devCol(d))).length, badgeLabel: 'para validar' },
    { id: 'tratativas', name: 'Tratativas', icon: 'flag', unit: REDE, badge: () => FN.tratativas.length, badgeLabel: 'abertas' },
    { group: 'Inteligência' },
    { id: 'taxas', name: 'Taxas', icon: 'percent', unit: REDE },
    { id: 'caixa', name: 'Caixa', icon: 'wallet', unit: REDE },
    { id: 'copiloto', name: 'Copiloto', icon: 'ask', unit: REDE },
  ], {
    visao: scrVisao, vendas: scrVendas, recebiveis: scrRecebiveis, festas: scrFestas, site: scrSite,
    devolucoes: scrDevolucoes, tratativas: scrTratativas, taxas: scrTaxas, caixa: scrCaixa, copiloto: scrCopiloto,
  });

  GP.fin = { state: st, reset, loteInfo, openSale, openSaleFromAnywhere, openRec, sendLote, approveLote, effectLote };
})();
