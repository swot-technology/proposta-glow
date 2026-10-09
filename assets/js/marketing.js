/* O Marketing do GlowHub, como no sistema: Painel de mídia, Campanhas, Origem e links e Analista de marketing.
   As colunas são as do sistema (Investimento, Conversas, Custo/conv., Qualificadas, Festas, Custo/festa, ROAS);
   "plat." é o que a plataforma diz, ao lado do que o GlowHub viu. A festa da Mariana soma no Meta Ads. */
(function () {
  const { h, fmt } = GP;
  const { icon, chip, press, hrow, panel, toast, tabs, tabOf, openDrawer } = GP.ui;
  const D = GP.data;
  const M = D.mkt;
  const F = D.familia;
  const won = () => (GP.app.state.etapa >= 5 ? 1 : 0);
  const go = (screen, opts) => GP.app.go('marketing', screen, opts);
  const brl0 = fmt.brl0, brl = fmt.brl, nf = (v) => fmt.int(v);
  const nf1 = (v) => new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(v);
  const pct0 = (v) => Math.round(v * 100) + '%';
  const btn = (label, fn, cls) => h('button.a-btn' + (cls ? '.' + cls : ''), { type: 'button', onclick: fn }, label);
  const link = (label, fn) => h('button.a-link', { type: 'button', onclick: fn }, label);
  const tbl = (head, body, right = []) => h('div.a-scroll', h('table.a-table',
    h('thead', h('tr', head.map((c, j) => h('th', { class: right.includes(j) ? 'r' : null }, c)))), h('tbody', body)));
  const TICKET = 3100;
  // o nome da campanha quebra nos sublinhados, não no meio da palavra
  const wb = (name) => name.split('_').flatMap((x, i, all) => (i < all.length - 1 ? [x + '_', h('wbr')] : [x]));

  // o período escolhido muda a escala dos números (a demonstração guarda os últimos 30 dias)
  const PER = { mes: ['Este mês', 'de 01/11/2026 a 05/11/2026', 5 / 30], passado: ['Mês passado', 'de 01/10/2026 a 31/10/2026', 31 / 30], '30': ['Últimos 30 dias', 'de 07/10/2026 a 05/11/2026', 1] };
  const per = () => PER[tabOf('mkt-periodo', '30')];
  const sc = (v) => Math.round(v * per()[2]);
  const periodTabs = () => tabs('mkt-periodo', [['mes', 'Este mês'], ['passado', 'Mês passado'], ['30', 'Últimos 30 dias']], 'Período', '30');

  // as colunas de sempre; o que não tem fonte aparece como "—", nunca como zero
  const STD = ['Investimento', 'Conversas', 'Custo/conv.', 'Qualificadas', 'Festas', 'Custo/festa', 'ROAS'];
  function stdCells(r) {
    const inv = r.invest ? sc(r.invest) : 0, conv = sc(r.conv), fest = sc(r.festas);
    return [
      h('td.r', inv ? brl0(inv) : '—'),
      h('td.r', nf(conv), r.plat != null ? h('span.plat', { title: 'A plataforma diz ' + nf(sc(r.plat)) }, 'plat. ' + nf(sc(r.plat))) : null),
      h('td.r', inv && conv ? brl(inv / conv) : '—'),
      h('td.r', nf(sc(r.qual))),
      h('td.r', nf(fest)),
      h('td.r', inv && fest ? brl(inv / fest) : '—'),
      h('td.r', inv ? nf1((fest * TICKET) / inv) : '—'),
    ];
  }
  // a festa da Mariana entra no Meta Ads, em Hortolândia e na campanha dela
  const withWon = (r, key) => (won() && r[key] ? { ...r, festas: r.festas + 1 } : r);

  /* =========================================================
     Painel de mídia
     ========================================================= */
  function scrPainel() {
    const canais = M.canais.map((c) => withWon({ ...c, mariana: c.canal === 'Meta Ads' }, 'mariana'));
    const festas = canais.reduce((a, c) => a + c.festas, 0);
    const conv = canais.reduce((a, c) => a + c.conv, 0);
    const qual = canais.reduce((a, c) => a + c.qual, 0);
    const meta = canais[0];
    const inv = sc(M.investFestas);
    const custo = inv / sc(festas);
    const unidades = M.unidades.map((u) => withWon({ ...u, mariana: u.u === 'Hortolândia' }, 'mariana'));
    const maxW = Math.max(...M.semanas.map((w) => w[1] + w[2]));
    const maxF = Math.max(...M.semanas.map((w) => w[3])) + 1;
    return h('div',
      hrow('Painel de mídia', `Rede inteira, ${per()[1]}. Investimento lido das plataformas até ontem; festa ganha é sinal confirmado pelo Financeiro.`, periodTabs()),
      h('div.mk-top',
        h('section.a-panel.mk-hero', { 'data-tour': 'custo-festa' },
          h('div.a-panel-h', 'Custo por festa', h('small', chip('info', 'Coorte ainda aberta', 'sync'))),
          h('div.budget', h('span.a-muted', 'Investimento em festas ÷ festas ganhas da coorte'), h('b.mk-big', brl(custo)),
            h('p', '▼ 6% sobre o período anterior (R$ 143,80).'),
            h('p.a-muted', `Fora do custo por festa: ${brl0(sc(M.foraIngressosMarca))} em ingressos e marca; ${brl(M.foraSemMapa)} de campanhas sem mapeamento.`))),
        h('div.mk-stats',
          h('div.a-kpi', h('span', 'Investimento em festas'), h('b', brl0(inv)), h('small', 'ROAS ' + nf1((sc(festas) * TICKET) / inv))),
          h('div.a-kpi', h('span', 'Conversas'), h('b', nf(sc(conv))), h('small', `A Meta diz ${nf(sc(meta.plat))}; ${pct0(qual / conv)} qualificadas`)),
          h('div.a-kpi', h('span', 'Festas ganhas'), h('b', nf(sc(festas))), h('small', { class: won() ? 'up' : null }, `${brl0(sc(festas) * TICKET)} em festas` + (won() ? '; +1 agora: Mariana' : ''))))),
      panel({ style: 'margin-top:12px', 'data-tour': 'precisa' }, 'O que precisa de você', M.precisa.length + ' itens',
        h('ul.pz', M.precisa.map(([k, t, d, a, dest]) => h('li', h('span.pz-i', { class: k }, icon('alert')), h('div', h('b', t), h('small', d)), link(a, () => follow(dest)))))),
      panel({ style: 'margin-top:12px', 'data-tour': 'por-canal' }, 'Por canal', null,
        tbl(['Canal'].concat(STD), canais.map((c) => h('tr', { class: c.mariana && won() ? 'hl' : null, 'data-tour': c.canal === 'Meta Ads' ? 'mid-meta' : null }, h('td', h('b', c.canal)), stdCells(c))), [1, 2, 3, 4, 5, 6, 7]),
        h('p.a-foot', { style: 'padding:0 14px 12px' }, 'Origem informada pelas famílias (fora dos canais, sem dado por trás): Indicação de alguém 41, Instagram 22, Passou pelo parque 18.')),
      panel({ style: 'margin-top:12px' }, 'Por unidade', null,
        tbl(['Unidade'].concat(STD), unidades.map((u) => h('tr', { class: u.mariana && won() ? 'hl' : null }, h('td', u.u), stdCells(u))), [1, 2, 3, 4, 5, 6, 7])),
      h('div.a-grid2', { style: 'margin-top:12px' },
        panel(null, 'Investimento por semana', 'últimas 4 semanas',
          h('div.colchart', h('div.cc-plot.short', { role: 'img', 'aria-label': 'Investimento por semana, Meta Ads e Google Ads' }, M.semanas.map(([d, meta2, goog]) => {
            const col = h('div.cc-col', h('span', { style: `height:${(meta2 / maxW) * 100}%;background:#0A8FD6` }), h('span', { style: `height:${(goog / maxW) * 100}%;background:#7A3FC0` }));
            col.title = `Semana de ${d}: Meta Ads ${brl0(meta2)}, Google Ads ${brl0(goog)}`;
            return col;
          })), h('div.cc-x', M.semanas.map((w) => h('span', w[0])))),
          h('div.cc-legend', h('span', h('i', { style: 'background:#0A8FD6' }), 'Meta Ads'), h('span', h('i', { style: 'background:#7A3FC0' }), 'Google Ads'), link('Ver como tabela', () => toast('Todo gráfico do GlowHub também abre como tabela.')))),
        panel(null, 'Festas ganhas por semana', 'últimas 4 semanas',
          h('div.colchart', h('div.cc-plot.short', M.semanas.map(([d, , , f], i) => {
            const v = f + (i === M.semanas.length - 1 ? won() : 0);
            const col = h('div.cc-col', h('span', { style: `height:${(v / maxF) * 100}%;background:#E0268A` }));
            col.title = `Semana de ${d}: ${v} festas`;
            return col;
          })), h('div.cc-x', M.semanas.map((w) => h('span', w[0])))),
          h('div.cc-legend', h('span', h('i', { style: 'background:#E0268A' }), 'festas ganhas'), link('Ver como tabela', () => toast('Todo gráfico do GlowHub também abre como tabela.'))))),
      h('p.a-foot', { style: 'margin:10px 2px 0' }, 'Contas lidas: Glow Park • Festas, Meta Ads (05/11 06:00); Glow Park • Google, Google Ads (05/11 06:00).'));
  }
  function follow(dest) {
    if (dest === 'mapeamento') { go('origem', { tab: 'mapeamento' }); return; }
    if (dest.startsWith('campanha:')) { go('campanhas', { after: () => openCampanha(dest.slice(9)) }); }
  }

  /* =========================================================
     Campanhas
     ========================================================= */
  const SIT = { Ativa: 'good', Pausada: 'muted' };
  function campanhas() {
    const plat = tabOf('mkt-plat', 'todas');
    const prob = !!GP.app.state.tabs['mkt-prob'];
    return M.campanhas.map((c) => withWon(c, 'mariana'))
      .filter((c) => (plat === 'todas' || c.conta.startsWith(plat === 'meta' ? 'Meta' : 'Google')) && (!prob || c.problema || c.fora || (c.conv >= 30 && !c.festas)));
  }
  function scrCampanhas() {
    const prob = !!GP.app.state.tabs['mkt-prob'];
    const rows = campanhas();
    return h('div',
      hrow('Campanhas', `${per()[1].replace(/^de /, 'De ')}. Conversas, oportunidades e festas são as que o GlowHub viu; "plat." é o que a plataforma diz.`, periodTabs()),
      h('div.a-row', tabs('mkt-plat', [['todas', 'Todas'], ['meta', 'Meta Ads'], ['google', 'Google Ads']], 'Plataforma'),
        h('label.a-check', h('input', { type: 'checkbox', checked: prob || null, onchange: (e) => { GP.app.state.tabs['mkt-prob'] = e.target.checked ? 'sim' : ''; GP.app.render(); } }), 'Só com problema')),
      panel({ 'data-tour': 'campanhas' }, 'Campanhas com investimento ou conversa no período', null,
        rows.length ? tbl(['Campanha'].concat(STD), rows.map((c) => h('tr.click', { class: c.mariana && won() ? 'hl' : null, 'data-tour': c.mariana ? 'camp-mariana' : null, dataset: { camp: c.nome }, ...press(() => openCampanha(c.nome)) },
          h('td.camp', h('b', wb(c.nome)), h('span.sub', c.conta + (c.assunto ? ' • ' + c.assunto : '')),
            h('span.camp-chips', chip(SIT[c.sit] || 'muted', c.sit), c.fora ? chip('warn', 'Fora da convenção') : null, c.assunto ? null : chip('crit', 'Sem mapeamento'))),
          stdCells(c))), [1, 2, 3, 4, 5, 6, 7]) : h('p.ib-empty', 'Nenhuma campanha com investimento ou conversa no período.')));
  }
  function openCampanha(nome) {
    const c0 = M.campanhas.find((x) => x.nome === nome);
    if (!c0) return;
    const c = withWon(c0, 'mariana');
    const main = document.querySelector('#app .app-main');
    if (main) { main.querySelectorAll('tr.sel').forEach((x) => x.classList.remove('sel')); const row = main.querySelector(`tr[data-camp="${nome}"]`); if (row) row.classList.add('sel'); }
    const conv = sc(c.conv), opp = Math.round(conv * 0.92), qual = sc(c.qual), prop = Math.round(qual * 0.55), fest = sc(c.festas);
    const steps = [['Conversas', conv], ['Oportunidades', opp], ['Qualificadas', qual], ['Propostas', prop], ['Festas ganhas', fest]];
    const max = Math.max(conv, 1);
    openDrawer(c.nome, c.conta + ' • ' + (c.assunto || 'sem mapeamento'), [
      h('section.a-sec', h('h5', 'Funil da coorte'), h('div.funil', steps.map(([l, v]) => h('div.fb', h('span', l), h('div.fb-t', h('i', { class: l === 'Festas ganhas' ? 'good' : 's1', style: `width:${(v / max) * 100}%` })), h('b', nf(v))))),
        h('p.a-muted', conv ? `${nf(Math.round(opp * 0.4))} perdidas: Sem resposta ${nf(Math.round(opp * 0.18))}, Preço ${nf(Math.round(opp * 0.1))}. Metade fecha em até 6 dias. Custo por festa: ${fest ? brl(sc(c.invest) / fest) : '—'}.` : 'Nenhuma conversa vista pelo GlowHub: confira se o anúncio aponta para o número oficial e se é de clique para WhatsApp.')),
      h('section.a-sec', h('h5', 'Anúncios'), c.anuncios
        ? tbl(['Anúncio', 'Investimento', 'Conversas', 'Festas', 'Custo/festa'], c.anuncios.map(([n, i, cv, f]) => {
          const ff = f + (c.mariana && won() && n === F.origem.anuncio ? 1 : 0);
          return h('tr', { class: c.mariana && n === F.origem.anuncio ? 'hl' : null }, h('td', n), h('td.r', brl0(sc(i))), h('td.r', nf(sc(cv))), h('td.r', nf(sc(ff))), h('td.r', ff ? brl(sc(i) / sc(ff)) : '—'));
        }), [1, 2, 3, 4])
        : h('p.a-muted', 'Campanha sem anúncios no nível de anúncio (Performance Max).')),
      c.mariana ? h('section.a-sec', h('h5', 'Oportunidades da coorte'), h('ol.a-hist', h('li', h('b', F.op), ' Mariana Souza, Hortolândia ', GP.app.state.etapa >= 5 ? chip('good', 'Ganha 05/11') : chip('stage', GP.app.state.etapa >= 3 ? 'Proposta' : GP.app.state.etapa === 2 ? 'Qualificada' : 'Nova', 'sync')), h('li', h('b', 'OP-0390'), ' João Pedro Alves, Hortolândia ', chip('stage', 'Proposta', 'sync')))) : null,
      c.fora ? h('section.a-sec', h('h5', 'Mapeamento'), h('p', 'O nome não diz o assunto e a unidade.'), h('div.a-row', h('div.a-select.static', 'Assunto: Festas'), h('div.a-select.static', 'Unidade: Rede'), btn('Salvar o mapeamento', () => toast('Mapeada à mão: o investimento entra no custo por festa.'), 'primary'))) : null,
    ], { tour: 'campanha' });
  }

  /* =========================================================
     Origem e links
     ========================================================= */
  function scrOrigem() {
    const tab = tabOf('origem', 'links');
    const body = { links: oLinks, convencao: oConvencao, mapeamento: oMapeamento, saude: oSaude }[tab]();
    return h('div',
      hrow('Origem e links', 'Sem origem confiável na entrada, nenhum painel depois resolve: links com código, a convenção dos nomes e a saúde do rastreamento.', tabs('origem', [['links', 'Links'], ['convencao', 'Convenção'], ['mapeamento', 'Mapeamento'], ['saude', 'Saúde']], 'Origem e links')),
      body);
  }
  function oLinks() {
    return panel({ 'data-tour': 'links' }, 'Links rastreáveis', btn('+ Novo link', novoLink),
      tbl(['Link', 'Código', 'Canal', 'Unidade', 'Conversas', 'Oportunidades', 'Festas'], M.links.map((l) => h('tr.click', { ...press(() => openLink(l)) },
        h('td', h('b', l.nome)), h('td', h('span.mono', l.cod)), h('td', l.canal), h('td', l.unidade), h('td.r', nf(l.conv)), h('td.r', nf(l.opp)), h('td.r', nf(l.festas)))), [4, 5, 6]));
  }
  function openLink(l) {
    openDrawer(l.nome, l.cod + ' • ' + l.canal + ' • ' + l.unidade, [
      h('section.a-sec', btn('Copiar o link', () => toast('Link copiado: wa.me com o texto pronto e o código ' + l.cod + '.'), 'primary'),
        h('p', `Abre o WhatsApp do número Vendas com o texto pronto e o código ${l.cod}. UTM: ${l.utm}.`)),
      h('section.a-sec', h('h5', 'QR Code para impressão'), h('div.qr-box', GP.phone && GP.phone.qr ? GP.phone.qr(l.cod) : null), h('div.a-row', btn('Baixar PNG', () => toast('QR Code baixado em PNG.')), btn('Baixar SVG', () => toast('QR Code baixado em SVG, para a gráfica.')))),
      h('section.a-sec', h('h5', 'Resultado'), h('div.vs-cols.three', h('div', h('b', nf(l.conv)), h('span', 'conversas')), h('div', h('b', nf(l.opp)), h('span', 'oportunidades')), h('div', h('b', nf(l.festas)), h('span', 'festas')))),
      h('section.a-sec', link('Desligar o link (o código deixa de valer)', () => toast('Na demonstração, o link continua ligado.'))),
    ]);
  }
  function novoLink() {
    const field = (l, v) => h('label.a-lbl', l, h('div.a-input.static', v));
    openDrawer('Novo link rastreável', 'O GlowHub gera o código, o link do WhatsApp e o QR Code', [
      h('section.a-sec', field('Nome', 'Balcão Sorocaba'), field('Número de destino', 'Vendas'), field('Canal', 'QR na unidade'), field('Unidade', 'Sorocaba'),
        field('utm_source', 'parque'), field('utm_medium', 'qr'), field('utm_campaign', 'festas_qr_sorocaba_202611'), field('Texto pronto (o código vai no fim)', 'Oi! Quero saber da festa de aniversário'),
        h('div.a-actions-row', btn('Criar o link', () => toast('Link criado: código GP-S9QX, com o link do WhatsApp e o QR Code.'), 'primary'))),
    ]);
  }
  function oConvencao() {
    const rows = [
      ['utm_source', 'meta, google, instagram, tiktok, site, parque, base, indicacao', 'meta'],
      ['utm_medium', 'cpc, paid-social, organic-social, qr, whatsapp-base, referral', 'paid-social'],
      ['utm_campaign e nome da campanha', 'assunto_objetivo_unidade_aaaamm', 'festas_conversas_hortolandia_202611'],
      ['utm_content', 'identificador do anúncio', '{{ad.id}} na Meta, {creative} no Google'],
      ['utm_term', 'palavra-chave', '{keyword} no Google'],
    ];
    const ok = !!GP.app.state.tabs['mkt-conf'];
    return h('div.a-grid2',
      panel({ 'data-tour': 'convencao' }, 'A convenção', null,
        h('p.a-foot', { style: 'padding:10px 14px 0' }, 'Tudo em minúsculas, sem acento; hífen dentro do campo e sublinhado entre os campos. O mesmo padrão vale para o nome da campanha nas plataformas: é por ele que o GlowHub sabe o assunto e a unidade de cada investimento.'),
        tbl(['Parâmetro', 'Valores', 'Exemplo'], rows.map((r) => h('tr', h('td', h('b', r[0])), h('td', r[1]), h('td.r', h('span.mono', r[2])))), [2])),
      panel(null, 'Conferir um link ou um nome', null, h('div.budget',
        h('div.a-input.static.tall', F.origem.campanha),
        btn('Conferir', () => { GP.app.state.tabs['mkt-conf'] = 'sim'; GP.app.render(); }, 'primary'),
        ok ? h('div', chip('good', 'Dentro da convenção'), h('p', 'O GlowHub entendeu: assunto festas, objetivo conversas, unidade Hortolândia, novembro de 2026.')) : null)));
  }
  function oMapeamento() {
    return panel({ 'data-tour': 'mapeamento' }, 'Campanhas das plataformas', null,
      tbl(['Campanha', 'Como foi mapeada', ''], M.campanhas.map((c) => h('tr', h('td', h('b', c.nome), h('span.sub', c.conta)),
        h('td', c.fora ? [chip('crit', 'Sem mapeamento'), h('span.sub', 'o nome não diz o assunto e a unidade')] : 'pela convenção'),
        h('td.r', c.fora ? btn('Mapear', () => go('campanhas', { after: () => openCampanha(c.nome) }), 'primary') : null)))));
  }
  function oSaude() {
    const stat = (l, v, ch) => h('div.a-kpi', h('span', l), h('b', v), h('small', ch));
    return h('div', { style: 'display:grid;gap:12px' },
      h('div.a-kpis', { 'data-tour': 'saude' },
        stat('Conversas com origem conhecida', '95,1%', chip('good', 'Na meta (90% ou mais)')),
        stat('Anúncio da Meta com identificador de clique', '98,4%', chip('good', 'Na meta')),
        stat('Códigos reconhecidos', '97,2%', chip('good', 'Na meta (95%)')),
        stat('Campanhas sem mapeamento', '1', chip('warn', 'Acima da meta (zero)'))),
      h('div.a-grid2',
        panel(null, 'Por número', null, tbl(['Número', 'Conversas', 'Sem origem'], [['Vendas', 4310, '190 (4%)'], ['SAC', 430, '40 (9%)']].map((r) => h('tr', h('td', r[0]), h('td.r', nf(r[1])), h('td.r', r[2]))), [1, 2])),
        panel(null, 'Por unidade', null, tbl(['Unidade', 'Conversas', 'Sem origem'], [['Hortolândia', 410, '12 (3%)'], ['Barra Funda', 520, '19 (4%)'], ['Londrina', 190, '27 (14%)']].map((r) => h('tr', { class: r[0] === 'Londrina' ? 'hl' : null }, h('td', r[0]), h('td.r', nf(r[1])), h('td.r', r[2]))), [1, 2]))),
      panel({ 'data-tour': 'contas' }, 'Contas de anúncio', btn('Ler agora', () => toast('Leitura pedida: os números aparecem em instantes.')),
        tbl(['Conta', 'Modo', 'Saúde', 'Última leitura'], [['Glow Park • Festas', 'Meta Ads'], ['Glow Park • Google', 'Google Ads']].map(([n, p]) => h('tr', h('td', h('b', n), h('span.sub', p)), h('td', chip('info', 'API')), h('td', chip('good', 'Funcionando')), h('td', '05/11 06:00 ', chip('good', 'Ok'))))),
        h('p.a-foot', { style: 'padding:0 14px 12px' }, 'Plano B por arquivo: se a API de uma plataforma atrasar, o CSV exportado entra no lugar, com o resultado de cada linha.')));
  }

  /* =========================================================
     Analista de marketing
     ========================================================= */
  const FONTE = 'Fonte: GlowHub (investimento lido da Meta e do Google; conversas vistas pelo GlowHub; festas com sinal confirmado pelo Financeiro).';
  // as respostas usam os números das telas; a festa da Mariana entra quando o sinal cai
  const QA = [
    ['Qual campanha trouxe a festa mais barata neste mês?', () => {
      const cs = M.campanhas.map((c) => withWon(c, 'mariana')).filter((c) => c.festas > 0 && c.assunto && c.assunto.startsWith('Festas'));
      const best = cs.reduce((x, y) => (y.invest / y.festas < x.invest / x.festas ? y : x));
      return `${best.nome}: ${brl(best.invest / best.festas)} por festa, com ${nf(best.festas)} festas ganhas e ${brl0(best.invest)} investidos. A mais cara foi festas_conversas_londrina_202611, que gastou R$ 1.980 e não trouxe conversa vista pelo GlowHub.`;
    }, FONTE],
    ['Quais anúncios têm muita conversa e nenhuma festa?', () => 'O "Carrossel pacotes", da campanha festas_conversas_rede_202611: 64 conversas e nenhuma festa. A maioria das conversas pergunta preço de ingresso, não de festa.', FONTE],
    ['Meta ou Google: qual tem o menor custo por festa?', () => {
      const meta = withWon({ ...M.canais[0], mariana: true }, 'mariana'), goog = M.canais[1];
      return `Meta Ads: ${brl(meta.invest / meta.festas)} por festa (${nf(meta.festas)} festas, ${brl0(meta.invest)}). Google Ads: ${brl(goog.invest / goog.festas)} (${nf(goog.festas)} festas, ${brl0(goog.invest)}). Na Meta, a conversa também custa menos: ${brl(meta.invest / meta.conv)} contra ${brl(goog.invest / goog.conv)}.`;
    }, FONTE],
    ['Por que o custo por conversa subiu na última semana?', () => 'Subiu 9% na Meta, de R$ 21,10 para R$ 23,00: a campanha festas_conversas_brooklin_202611 dobrou a verba no fim de semana e trouxe só 12% mais conversas. No Google, ficou estável.', FONTE + ' Meta Ads (atribuição da própria plataforma, pelo servidor MCP de anúncios).'],
    ['Quanto da origem das conversas está desconhecida, e onde?', () => '4,9% (230 de 4.740), dentro da meta de 10%. Londrina tem 14%: o anúncio de lá não aponta para o número oficial.', FONTE],
  ];
  function scrAnalista() {
    const q = GP.app.state.tabs['mkt-q'];
    const a = q != null && q !== '' ? QA[+q] : null;
    return h('div',
      hrow('Analista de marketing', 'Lê o GlowHub e, só para consulta, as contas de anúncio. Não altera anúncios; diz de onde tirou cada número.', chip('good', 'Meta Ads ligada'), chip('good', 'Google Ads ligado')),
      h('section.a-panel.chat', { 'data-tour': 'analista' },
        h('div.chat-log', { 'aria-live': 'polite' },
          h('div.chat-bot', h('img', { src: 'assets/img/glow-will.png', alt: '' }), h('p', 'Oi! Eu leio o investimento, as conversas e as festas por você: qual campanha trouxe a festa mais barata, que anúncio conversa e não fecha, Meta ou Google no mês. Comece por uma das perguntas abaixo.')),
          a ? [h('div.ask', h('div.q', a[0]), h('div.a', a[1](), h('small', a[2])))] : null),
        h('div.sugg', QA.map((x, i) => h('button', { type: 'button', 'aria-pressed': String(String(i) === q), dataset: { keep: 'q-' + i }, onclick: () => { GP.app.state.tabs['mkt-q'] = String(i); GP.app.render('q-' + i); } }, x[0]))),
        h('div.chat-in', h('div.a-input.static.grow', 'Ex.: que anúncios têm muita conversa e nenhuma festa?'), h('span.a-btn.primary.off', icon('send'), ' Perguntar'))),
      h('p.a-foot', { style: 'margin:10px 2px 0' }, 'Toda segunda, o resumo "Mídia da semana" vai por e-mail para a diretoria e o marketing, com o custo por festa e o que mais mudou.'));
  }

  GP.app.defineScreens('marketing', [
    { group: 'Mídia' },
    { id: 'midia', name: 'Painel de mídia', icon: 'home' },
    { id: 'campanhas', name: 'Campanhas', icon: 'list' },
    { id: 'origem', name: 'Origem e links', icon: 'ext' },
    { group: 'Inteligência' },
    { id: 'analista', name: 'Analista de marketing', icon: 'spark' },
  ], { midia: scrPainel, campanhas: scrCampanhas, origem: scrOrigem, analista: scrAnalista });

  GP.mkt = { openCampanha };
})();
