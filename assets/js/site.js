/* O palco: a linha da festa, os capítulos com os números da proposta, a navegação, os atalhos e os valores ocultos */
(function () {
  const { h, s, $, $$, clear, fmt, announce } = GP;
  const N = GP.N;
  const B = N.bench;
  const CHAPTERS = ['abertura', 'por-dentro', 'retorno', 'economia', 'seguranca', 'como', 'perguntas', 'investimento'];
  const NB = ' ';

  /* ---------- formatos, os mesmos da proposta em .docx ---------- */
  const nf = (d) => new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: d });
  const brl0 = fmt.brl0;
  const mil = (v) => (v < 1000 ? brl0(v) : 'R$' + NB + nf(1).format(v / 1000) + NB + 'mil');
  const milFaixa = (a, b) => 'R$' + NB + nf(1).format(a / 1000) + ' a ' + nf(1).format(b / 1000) + NB + 'mil';
  const mi = (v, d = 2) => 'R$' + NB + new Intl.NumberFormat('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d }).format(v / 1e6) + NB + 'mi';
  const strip = (t) => String(t).replace(/__/g, '');

  /* ---------- valores ocultos até a revelação (tecla S) ---------- */
  const sx = (v) => h('span.sx', h('span.sx-v', v));
  const sxBRL = (v) => h('span.sx.sx-brl', h('span.sx-v', typeof v === 'number' ? brl0(v) : v));
  // **negrito** e {{trecho que some com os valores ocultos}}
  function rich(str) {
    return String(str).split(/(\*\*[^*]+\*\*|\{\{[^}]+\}\})/).filter(Boolean).map((part) => {
      if (part.startsWith('**') && part.endsWith('**')) return h('b', rich(part.slice(2, -2)));
      if (part.startsWith('{{') && part.endsWith('}}')) {
        const v = part.slice(2, -2);
        return v.startsWith('R$') ? sxBRL(v) : sx(v);
      }
      return part;
    });
  }
  const SX_KEY = 'glowhub-valores-ocultos';
  let sxTimer = null;
  const suspenseOn = () => document.body.classList.contains('suspense');
  function setSuspense(on, byUser) {
    const b = document.body;
    b.classList.toggle('suspense', on);
    clearTimeout(sxTimer);
    b.classList.remove('sx-reveal');
    if (!on && byUser) {
      void b.offsetWidth; // reinicia a animação de revelação
      b.classList.add('sx-reveal');
      sxTimer = setTimeout(() => b.classList.remove('sx-reveal'), 1600);
    }
    const btn = $('#sxBtn');
    btn.setAttribute('aria-pressed', String(on));
    btn.title = (on ? 'Revelar os valores' : 'Ocultar os valores') + ' (tecla S)';
    if (byUser) {
      try { localStorage.setItem(SX_KEY, on ? '1' : '0'); } catch (e) { /* sem armazenamento, vale só nesta visita */ }
      announce(on ? 'Valores ocultos.' : 'Valores revelados.');
    }
  }
  function storedSuspense() {
    try { return localStorage.getItem(SX_KEY) === '1'; } catch (e) { return false; }
  }

  /* =========================================================
     1. A linha da festa
     ========================================================= */
  const MOD = { mkt: { name: 'Marketing', c: '#00ADEE' }, com: { name: 'Comercial', c: '#EC268F' }, fin: { name: 'Financeiro', c: '#A1DA00' } };
  const STATIONS = [
    { mod: 'mkt', name: 'Anúncio', today: 'Meta Ads e Google Ads', hub: 'origem gravada no clique',
      hoje: 'A campanha leva a família ao WhatsApp, mas a origem se perde no caminho. Ninguém sabe qual anúncio trouxe qual festa.',
      glowhub: 'O clique no anúncio, o link rastreável ou o QR Code da unidade gravam a origem na conversa. Quando nada foi capturado, a IA ou o vendedor perguntam.',
      go: ['comercial', 'atendimento', { conv: 'mariana' }] },
    { mod: 'com', name: 'Conversa', today: 'Take Blip e JetSales', hub: 'WhatsApp oficial',
      hoje: `Duas ferramentas pagas para o mesmo canal, de ${milFaixa(N.econ.min, N.econ.max)} por mês. Parte da conversa acontece no celular do vendedor, fora de qualquer registro.`,
      glowhub: 'Os números oficiais da rede num inbox único, no computador e no celular, com filas por unidade, etiquetas e respostas rápidas. A entrada tem fila e reprocessamento: nenhuma mensagem se perde.',
      go: ['comercial', 'atendimento', { conv: 'mariana' }] },
    { mod: 'com', name: 'Qualificação', today: 'rodízio às cegas', hub: 'vendedor IA, 24 horas',
      hoje: 'Todo contato recebe o mesmo esforço, em rodízio. E 25% das mensagens de venda pelo WhatsApp chegam fora do horário comercial, quando ninguém responde.',
      glowhub: 'A Lu, vendedora IA, responde em segundos, qualifica e passa ao vendedor com o resumo pronto. Ela diz que é uma IA e passa para uma pessoa quando não sabe.',
      go: ['comercial', 'ia'] },
    { mod: 'com', name: 'Proposta e agenda', today: 'Scale e planilhas', hub: 'agenda de festas',
      hoje: 'A disponibilidade do buffet é conferida no Scale e em planilhas enquanto a família espera, e o funil não tem dono claro.',
      glowhub: 'A agenda de festas, o catálogo e as oportunidades no mesmo lugar. A pré-reserva segura a janela por 48 horas, e a IA só oferece o que a agenda mostra livre.',
      go: ['comercial', 'agenda'] },
    { mod: 'fin', name: 'Sinal no banco', today: 'print no WhatsApp', hub: 'PIX identificado',
      hoje: 'O sinal é pago por PIX e o comprovante chega como print no WhatsApp, para alguém conferir à mão.',
      glowhub: 'O PIX leva o número do orçamento. O banco confirma, a festa fica garantida e a oportunidade vira ganha sozinha: ninguém marca venda à mão.',
      go: ['financeiro', 'festas'] },
    { mod: 'fin', name: 'Festa e baixa', today: 'ERPFLEX à mão', hub: 'ERPFLEX sem digitar',
      hoje: 'O dinheiro do sinal só entra no ERPFLEX depois da festa, e 8% das vendas não chegam ao ERPFLEX. Corrigir leva até uma semana.',
      glowhub: 'Sinal e quitação viram adiantamento no ERPFLEX no dia do pagamento. Depois da festa, a baixa, e a conciliação diária confere que o orçamento zerou.',
      go: ['financeiro', 'vendas'] },
    { mod: 'mkt', name: 'Custo por festa', today: 'ninguém sabe', hub: 'por canal e unidade',
      hoje: 'A verba de mídia é decidida sem bússola: ninguém sabe quanto custa uma festa em cada canal nem em cada unidade.',
      glowhub: 'O investimento do Meta Ads e do Google Ads é lido todo dia e dividido pelas festas ganhas com aquela origem. A verba vai para onde dá festa.',
      go: ['marketing', 'midia'] },
  ];
  // os pontos onde a festa se perde hoje, um em cada trecho da linha
  const LEAKS = [
    { today: 'origem se perde', hub: 'origem gravada', title: 'A origem se perde',
      hoje: 'A família chega ao WhatsApp e ninguém registra de qual campanha ela veio. Sem isso, não existe custo por festa.',
      glowhub: 'O anúncio, o link ou o QR Code da unidade ficam gravados na conversa e seguem a família até a festa.',
      go: ['comercial', 'atendimento', { conv: 'mariana' }] },
    { today: 'família espera', hub: 'resposta em segundos', title: 'A família espera',
      hoje: 'Rodízio às cegas e ninguém responde fora do horário. Quem responde em até uma hora tem quase 7 vezes mais chance de qualificar o cliente.',
      glowhub: 'A Lu responde em segundos, 24 horas. Na passagem para o vendedor, o prazo de resposta começa a contar; se estourar, a conversa volta para a fila, com aviso à gestão.',
      go: ['comercial', 'atendimento', { conv: 'thiago' }] },
    { today: 'conversa no celular', hub: 'tudo no número oficial', title: 'A conversa vai para o celular',
      hoje: 'Parte da venda acontece no celular do vendedor, pelo JetSales, fora de qualquer registro da Glow Park. Se o vendedor sai, a família vai junto.',
      glowhub: 'Tudo nos números oficiais da rede, dentro do GlowHub. A conversa e a família são da Glow Park, e o vendedor nunca vê o telefone completo.',
      go: ['comercial', 'atendimento', { conv: 'mariana' }] },
    { today: 'comprovante por print', hub: 'banco confirma sozinho', title: 'Comprovante por print',
      hoje: 'A família paga o PIX e manda o print. Alguém confere à mão, e o pingue-pongue atrasa a reserva.',
      glowhub: 'O PIX leva o número do orçamento dentro. O banco confirma sozinho, para a equipe de festas e para o financeiro ao mesmo tempo.',
      go: ['financeiro', 'festas'] },
    { today: 'sinal some até a festa', hub: 'adiantamento no dia', title: 'O sinal some até a festa',
      hoje: 'O adiantamento só entra no ERPFLEX depois da festa. Até lá, o dinheiro que entrou não aparece na contabilidade.',
      glowhub: 'O adiantamento entra no ERPFLEX no dia do pagamento, e a baixa sai depois da festa, conferida.',
      go: ['financeiro', 'festas'] },
    { today: 'verba no escuro', hub: 'verba com bússola', title: 'A verba no escuro',
      hoje: 'Sem ligar a festa à campanha, não dá para saber qual canal e qual unidade dão retorno.',
      glowhub: 'Cada festa ganha soma na campanha que a trouxe. O custo por festa sai por canal, campanha e unidade, todos os dias.',
      go: ['marketing', 'midia'] },
  ];
  const STEP = 170; // milissegundos entre uma parada e a próxima quando a linha acende

  // linha em cobra, de 1000 de largura: quatro paradas em cima, a volta à direita e três embaixo
  function layoutWide() {
    const X = [110, 357, 603, 850], Y1 = 120, Y2 = 360, R = (Y2 - Y1) / 2, MY = (Y1 + Y2) / 2;
    const pos = [[X[0], Y1], [X[1], Y1], [X[2], Y1], [X[3], Y1], [X[3], Y2], [X[2], Y2], [X[1], Y2]];
    const segs = [`M${X[0]} ${Y1}H${X[1]}`, `M${X[1]} ${Y1}H${X[2]}`, `M${X[2]} ${Y1}H${X[3]}`, `M${X[3]} ${Y1}A${R} ${R} 0 0 1 ${X[3]} ${Y2}`, `M${X[3]} ${Y2}H${X[2]}`, `M${X[2]} ${Y2}H${X[1]}`];
    const grads = [[X[0], Y1, X[1], Y1], [X[1], Y1, X[2], Y1], [X[2], Y1, X[3], Y1], [X[3], Y1, X[3], Y2], [X[3], Y2, X[2], Y2], [X[2], Y2, X[1], Y2]];
    const labels = pos.map(([x, y], i) => (i < 4 ? { x, y1: y - 58, y2: y - 34, anchor: 'middle' } : { x, y1: y + 54, y2: y + 78, anchor: 'middle' }));
    const mid = (a, b) => (a + b) / 2;
    const leaks = [
      { x: mid(X[0], X[1]), y: Y1, lx: mid(X[0], X[1]), ly: Y1 + 42, anchor: 'middle' },
      { x: mid(X[1], X[2]), y: Y1, lx: mid(X[1], X[2]), ly: Y1 + 42, anchor: 'middle' },
      { x: mid(X[2], X[3]), y: Y1, lx: mid(X[2], X[3]), ly: Y1 + 42, anchor: 'middle' },
      { x: X[3] + R, y: MY, lx: X[3] + R - 24, ly: MY + 6, anchor: 'end' },
      { x: mid(X[3], X[2]), y: Y2, lx: mid(X[3], X[2]), ly: Y2 - 26, anchor: 'middle' },
      { x: mid(X[2], X[1]), y: Y2, lx: mid(X[2], X[1]), ly: Y2 - 26, anchor: 'middle' },
    ];
    const loop = { d: `M${X[1]} ${Y2}H190C120 ${Y2} 66 ${Y2 - 44} 66 ${MY}C66 ${Y1 + 50} 80 ${Y1} ${X[0]} ${Y1}`, lx: 92, ly: MY + 6, anchor: 'start' };
    const lens = [X[1] - X[0], X[2] - X[1], X[3] - X[2], Math.PI * R, X[3] - X[2], X[2] - X[1]];
    return { vb: '0 30 1000 430', pos, segs, lens, grads, labels, leaks, loop };
  }
  // no celular, a linha desce numa coluna só
  function layoutTall() {
    const x = 56, y0 = 70, dy = 130;
    const pos = Array.from({ length: 7 }, (_, i) => [x, y0 + i * dy]);
    const segs = pos.slice(0, 6).map(([px, py], i) => `M${px} ${py}V${pos[i + 1][1]}`);
    const grads = pos.slice(0, 6).map(([px, py], i) => [px, py, px, pos[i + 1][1]]);
    const labels = pos.map(([px, py]) => ({ x: px + 40, y1: py - 2, y2: py + 22, anchor: 'start' }));
    const leaks = pos.slice(0, 6).map(([px, py]) => ({ x: px, y: py + dy / 2, lx: px + 40, ly: py + dy / 2 + 6, anchor: 'start' }));
    const yl = pos[6][1];
    const loop = { d: `M${x} ${yl}C${x} ${yl + 44} 92 ${yl + 50} 140 ${yl + 50}H330C362 ${yl + 50} 378 ${yl + 34} 378 ${yl}V${y0}C378 ${y0 - 34} 362 ${y0 - 48} 330 ${y0 - 48}H100C76 ${y0 - 48} ${x} ${y0 - 36} ${x} ${y0}`, lx: 200, ly: yl + 82, anchor: 'middle' };
    const lens = segs.map(() => dy);
    return { vb: `0 0 400 ${yl + 96}`, pos, segs, lens, grads, labels, leaks, loop };
  }

  let hubMode = false;
  function buildLine() {
    const host = $('#line');
    clear(host);
    const tall = window.matchMedia('(max-width: 720px)').matches;
    const L = tall ? layoutTall() : layoutWide();
    const svg = s('svg', { class: 'line-svg', viewBox: L.vb, role: 'group', 'aria-label': 'A linha da festa: sete paradas, do anúncio ao custo por festa' });
    const defs = s('defs');
    // filtro em coordenadas da página: linha reta tem caixa de altura zero e sumiria com o filtro relativo
    defs.appendChild(s('filter', { id: 'glow', filterUnits: 'userSpaceOnUse', x: -60, y: -60, width: 1200, height: 1300 },
      s('feGaussianBlur', { stdDeviation: 4.5, result: 'b' }),
      s('feMerge', {}, s('feMergeNode', { in: 'b' }), s('feMergeNode', { in: 'SourceGraphic' }))));
    L.grads.forEach(([x1, y1, x2, y2], k) => defs.appendChild(s('linearGradient', { id: 'lg' + k, gradientUnits: 'userSpaceOnUse', x1, y1, x2, y2 },
      s('stop', { offset: '0', 'stop-color': MOD[STATIONS[k].mod].c }),
      s('stop', { offset: '1', 'stop-color': MOD[STATIONS[k + 1].mod].c }))));
    svg.appendChild(defs);
    L.segs.forEach((d) => svg.appendChild(s('path', { class: 'seg seg-today', d })));
    // o comprimento entra já na criação; medir depois disparava a transição e a linha aparecia pela metade
    L.segs.forEach((d, k) => svg.appendChild(s('path', { class: 'seg seg-hub', d, stroke: `url(#lg${k})`, filter: 'url(#glow)', style: `--d:${k * STEP}ms;--len:${Math.ceil(L.lens[k]) + 2}` })));
    svg.appendChild(s('path', { class: 'seg seg-loop', d: L.loop.d, style: `--d:${7 * STEP}ms` }));
    svg.appendChild(s('text', { class: 'loop-t', x: L.loop.lx, y: L.loop.ly, 'text-anchor': L.loop.anchor, style: `--d:${7 * STEP}ms` }, 'a verba volta para onde dá festa'));
    LEAKS.forEach((lk, k) => {
      const p = L.leaks[k];
      const g = s('g', { class: 'leak', tabindex: 0, role: 'button', 'aria-label': lk.title, style: `--d:${k * STEP + 240}ms` },
        s('circle', { cx: p.x, cy: p.y, r: 13 }),
        s('path', { class: 'leak-x', d: `M${p.x - 4.5} ${p.y - 4.5}L${p.x + 4.5} ${p.y + 4.5}M${p.x + 4.5} ${p.y - 4.5}L${p.x - 4.5} ${p.y + 4.5}` }),
        s('path', { class: 'leak-ok', d: `M${p.x - 5.5} ${p.y + 0.5}L${p.x - 1.5} ${p.y + 4.5}L${p.x + 5.5} ${p.y - 4}` }),
        s('text', { class: 'lt-today', x: p.lx, y: p.ly, 'text-anchor': p.anchor }, lk.today),
        s('text', { class: 'lt-hub', x: p.lx, y: p.ly, 'text-anchor': p.anchor }, lk.hub));
      bindOpen(g, () => openDrawer('leak', k));
      svg.appendChild(g);
    });
    STATIONS.forEach((st, k) => {
      const [x, y] = L.pos[k], lb = L.labels[k];
      const g = s('g', { class: 'st', tabindex: 0, role: 'button', 'aria-label': `Parada ${k + 1}: ${st.name}`, style: `--c:${MOD[st.mod].c};--d:${k * STEP}ms` },
        s('circle', { class: 'st-ring', cx: x, cy: y, r: 20 }),
        s('circle', { class: 'st-dot', cx: x, cy: y, r: 7 }),
        s('text', { class: 'st-name', x: lb.x, y: lb.y1, 'text-anchor': lb.anchor }, st.name),
        s('text', { class: 'st-sys st-sys-today', x: lb.x, y: lb.y2, 'text-anchor': lb.anchor }, st.today),
        s('text', { class: 'st-sys st-sys-hub', x: lb.x, y: lb.y2, 'text-anchor': lb.anchor }, st.hub));
      bindOpen(g, () => openDrawer('station', k));
      svg.appendChild(g);
    });
    host.appendChild(svg);
  }
  function bindOpen(el, fn) {
    el.addEventListener('click', fn);
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); } });
  }
  function setMode(mode, byUser) {
    hubMode = mode === 'glowhub';
    document.body.classList.toggle('hub', hubMode);
    $$('.toggle button').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.mode === mode)));
    $('#lineHint').textContent = hubMode ? 'Toque numa parada para ver o que o GlowHub faz ali.' : 'Toque numa parada ou num ponto laranja para ver onde a festa se perde hoje.';
    if (byUser) announce(hubMode ? 'Com o GlowHub: a linha inteira acesa, do anúncio ao custo por festa.' : 'Hoje: seis pontos onde a festa se perde.');
  }
  function buildFacts() {
    const host = $('#facts');
    [
      ['≈ 480', 'festas por mês, com ticket médio de R$ 3.100: 30% da receita da rede'],
      ['10%', 'de conversão: 6 mil oportunidades viraram 600 festas no período analisado'],
      ['5 sistemas', 'para uma venda de festa, e nenhum guarda a história inteira', true],
      ['8%', 'das vendas não chegam ao ERPFLEX; corrigir leva até uma semana', true],
    ].forEach(([v, t, bad]) => host.appendChild(h('div.fact', { class: bad ? 'bad' : null }, h('b', v), h('span', t))));
  }

  /* =========================================================
     Onde cada ponto pesa: os nove pontos do diagnóstico em quatro eixos
     ========================================================= */
  const AXES = [
    { name: 'Receita', em: 'na receita' },
    { name: 'Custo', em: 'no custo' },
    { name: 'Controle', em: 'no controle' },
    { name: 'Risco', em: 'no risco' },
  ];
  // w: 1 onde o ponto pesa, na ordem de AXES (leitura qualitativa do diagnóstico das festas).
  // obs e efeito vêm do diagnóstico; hub é o que o GlowHub faz no escopo desta proposta; next é o que fica fora dela.
  const POINTS = [
    { name: 'Jornada fragmentada', w: [0, 1, 1, 0],
      obs: 'Cinco sistemas e planilhas paralelas para concluir uma única venda.',
      efeito: 'Retrabalho, conciliação manual e informação que se perde nas passagens. No financeiro, só montar a base de conciliação do PIX toma cerca de 39 horas por mês.',
      hub: 'Os três módulos num sistema só. A campanha, a conversa, a festa e o sinal ficam ligados no banco de dados, e não numa conciliação de planilha.',
      go: ['comercial', 'atendimento', { conv: 'mariana' }] },
    { name: 'Registro parcial', w: [1, 0, 1, 0],
      obs: 'Com tantas ferramentas, parte do trabalho naturalmente acontece fora delas.',
      efeito: 'O funil fica incompleto. É efeito do desenho atual, não de falta de empenho da equipe.',
      hub: 'A conversa acontece nos números oficiais, dentro do GlowHub. A oportunidade fica ligada ao orçamento do Scale e só vira ganha quando o banco confirma o sinal, sem ninguém marcar à mão.',
      go: ['comercial', 'oportunidades'] },
    { name: 'Qualificação manual', w: [1, 1, 0, 0],
      obs: 'Todo contato recebe o mesmo esforço, tenha ou não intenção real de compra. E um quarto das mensagens de venda pelo WhatsApp chega fora do horário comercial, quando ninguém responde (OmniChat, 2026).',
      efeito: 'Energia comercial dispersa: boas oportunidades esperam enquanto contatos frios consomem tempo. Quem responde em até uma hora tem quase 7 vezes mais chance de qualificar o cliente do que quem responde uma hora depois (Harvard Business Review, 2011).',
      hub: 'A Lu, vendedora IA, atende em segundos, 24 horas, consulta pacotes e agenda e qualifica a família. Quem ainda está pesquisando recebe acompanhamento, e o vendedor assume com o resumo pronto.',
      go: ['comercial', 'ia'] },
    { name: 'Distribuição em rodízio', w: [1, 0, 0, 0],
      obs: 'A fila distribui por ordem de chegada, sem considerar o perfil do contato, a unidade ou o histórico de quem atende.',
      efeito: 'As melhores oportunidades nem sempre chegam a quem converte melhor.',
      hub: 'A Lu atende e qualifica primeiro, e o vendedor recebe a família com o resumo pronto. A passagem tem prazo de resposta: se estoura, a conversa volta para a fila ou para a IA, com aviso à gestão.',
      next: 'A distribuição por desempenho do vendedor fica para a próxima entrega do Comercial (R2), orçada à parte.',
      go: ['comercial', 'atendimento', { conv: 'thiago' }] },
    { name: 'Números sem confiança', w: [1, 0, 1, 0],
      obs: 'A gestão não confia plenamente no rastreamento das campanhas nem nos números consolidados.',
      efeito: 'Sem saber quanto custa cada festa em cada canal, o investimento em mídia é decidido sem bússola.',
      hub: 'A origem fica gravada em cada conversa, e o investimento do Meta Ads e do Google Ads é lido todo dia. O custo por festa sai por canal, campanha e unidade, e a venda só conta como ganha quando o banco confirma o sinal.',
      go: ['marketing', 'midia'] },
    { name: 'Relacionamento fora da gestão', w: [0, 0, 1, 1],
      obs: 'A conversa migra do número oficial para números operacionais.',
      efeito: 'Parte do histórico com o cliente fica fora do alcance da empresa, um risco de continuidade quando um vendedor sai.',
      hub: 'Tudo nos números oficiais da rede, dentro do GlowHub. A conversa e a família são da Glow Park, e o vendedor nunca vê o telefone completo: se ele sai, o histórico fica.',
      go: ['comercial', 'atendimento', { conv: 'mariana' }] },
    { name: 'Base de clientes parada', w: [1, 0, 0, 0],
      obs: 'Cerca de 200 mil cadastros de quem já pulou, e perto de 16 mil fazem aniversário a cada mês, sem ações ativas voltadas a festas.',
      efeito: 'A maior fonte de demanda qualificada segue inexplorada.',
      hub: 'Cada família que passa pelo GlowHub ganha uma ficha única, com festas, pagamentos e devoluções, consentimento por finalidade e limite de frequência de contato. É a base para abordar os clientes com segurança.',
      next: 'As campanhas para aniversariantes, reativação e horários vazios ficam para a próxima entrega do Marketing (R2), orçada à parte.',
      go: ['comercial', 'clientes'] },
    { name: 'Agenda pouco visível', w: [1, 0, 1, 0],
      obs: 'Com os dados distribuídos, é difícil enxergar em tempo real a ocupação de cada horário.',
      efeito: 'Horários ociosos passam sem ação comercial dedicada. Cada buffet comporta três festas por dia, e um horário que não foi vendido hoje não volta amanhã, como o assento de um voo ou o quarto de um hotel.',
      hub: 'A agenda dos buffets mostra dia, semana e mês, com a ocupação de cada janela e a pré-reserva. O painel comercial traz os horários livres das próximas 8 semanas.',
      go: ['comercial', 'agenda'] },
    { name: 'Custos sobrepostos', w: [0, 1, 0, 0],
      obs: `Duas ferramentas pagas para o mesmo canal, o Take Blip e o JetSales, de ${milFaixa(N.econ.min, N.econ.max)} por mês, além do esforço manual das planilhas.`,
      efeito: 'Custo recorrente e horas de conciliação que a consolidação libera.',
      hub: 'O GlowHub ocupa o lugar do Take Blip e do JetSales e custa quase o mesmo por mês, agora com o Financeiro, o Marketing e a IA juntos.',
      chapter: 'retorno' },
  ];
  const WORDS = ['nenhum', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
  const listPt = (a) => (a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' e ' + a[a.length - 1]);
  function weighRow(p, k) {
    const cell = (on) => h('td', on ? [h('span.wdot', { 'aria-hidden': 'true' }), h('span.sr-only', 'Pesa')] : h('span.sr-only', 'Não pesa'));
    // a seta fica colada à última palavra, para não cair sozinha na linha de baixo
    const cut = p.name.lastIndexOf(' ') + 1;
    const name = h('button.weigh-row', { type: 'button' }, p.name.slice(0, cut), h('span.wr-last', p.name.slice(cut), h('span.wr-go', { 'aria-hidden': 'true' }, '›')));
    // o clique vale na linha toda; o botão do nome é o que o teclado e o leitor de tela alcançam
    const row = h('tr', { onclick: () => { name.focus({ preventScroll: true }); openPoint(k); } },
      h('th', { scope: 'row' }, name),
      p.w.map(cell));
    return row;
  }
  function buildWeigh() {
    $('#weighTable').appendChild(h('table.weigh-tbl',
      h('caption.sr-only', 'Onde cada ponto do diagnóstico pesa: receita, custo, controle ou risco'),
      h('thead', h('tr', h('th', { scope: 'col' }, 'Ponto'), AXES.map((a) => h('th', { scope: 'col' }, a.name)))),
      h('tbody', POINTS.map(weighRow))));
    // a leitura vem da própria tabela: o eixo com mais pontos e quantos pesam nos outros
    const counts = AXES.map((_, a) => POINTS.filter((p) => p.w[a]).length);
    const [top, ...rest] = AXES.map((_, a) => a).sort((a, b) => counts[b] - counts[a]);
    const others = listPt(rest.map((a, i) => `${WORDS[counts[a]]}${i === 0 ? ' pesam' : ''} ${AXES[a].em}`));
    $('#weighStat').append(
      h('b', `${counts[top]} de ${POINTS.length}`),
      h('span', `pontos pesam ${AXES[top].em}. ${others.charAt(0).toUpperCase() + others.slice(1)}.`));
  }

  /* ---------- gaveta de cada parada ---------- */
  function openDrawer(kind, k) {
    const st = kind === 'leak' ? LEAKS[k] : STATIONS[k];
    const mod = kind === 'leak' ? null : MOD[st.mod];
    const body = $('#drawerBody');
    clear(body);
    body.appendChild(h('span.dw-mod', { style: '--c:' + (mod ? mod.c : 'var(--ember-2)') }, h('i'), mod ? `Parada ${k + 1} de 7, ${mod.name}` : 'Onde a festa se perde hoje'));
    body.appendChild(h('h3', { id: 'drawerTitle' }, kind === 'leak' ? st.title : st.name));
    body.appendChild(h('div.dw-block.today', h('h4', 'Hoje'), h('p', st.hoje)));
    body.appendChild(h('div.dw-block.hub', h('h4', 'Com o GlowHub'), h('p', st.glowhub)));
    body.appendChild(h('button.btn', { type: 'button', onclick: () => { closeDialog($('#drawer'), true); openProto(st.go); } }, 'Ver no protótipo'));
    openDialog($('#drawer'));
  }
  function openPoint(k) {
    const p = POINTS[k];
    const body = $('#drawerBody');
    clear(body);
    body.appendChild(h('span.dw-mod', { style: '--c:var(--ember-2)' }, h('i'), 'Onde pesa: ' + listPt(AXES.filter((_, a) => p.w[a]).map((a) => a.name))));
    body.appendChild(h('h3', { id: 'drawerTitle' }, p.name));
    body.appendChild(h('div.dw-block.today', h('h4', 'O que observamos'), h('p', p.obs)));
    body.appendChild(h('div.dw-block.today', h('h4', 'Efeito no negócio'), h('p', p.efeito)));
    body.appendChild(h('div.dw-block.hub', h('h4', 'Com o GlowHub'), h('p', p.hub)));
    if (p.next) body.appendChild(h('div.dw-block.next', h('h4', 'Fora desta proposta'), h('p', p.next)));
    const cta = p.chapter ? ['Ver a conta do mês', () => goChapter(p.chapter)] : p.go ? ['Ver no protótipo', () => openProto(p.go)] : null;
    if (cta) body.appendChild(h('button.btn', { type: 'button', onclick: () => { closeDialog($('#drawer'), true); cta[1](); } }, cta[0]));
    openDialog($('#drawer'));
  }
  function openProto(goTo) {
    const proto = $('#proto');
    if (proto) proto.scrollIntoView({ behavior: GP.reducedMotion() ? 'auto' : 'smooth', block: 'start' });
    if (goTo) GP.app.go(goTo[0], goTo[1], goTo[2] || {});
  }

  /* =========================================================
     3. O retorno
     ========================================================= */
  function buildRetorno() {
    const P = N.paga, H = N.hoje, M = N.mensal;
    $('#retornoLead').textContent = `O GlowHub ocupa o lugar do Take Blip e do JetSales e custa quase o mesmo por mês, agora com o Financeiro, o Marketing e a IA juntos. Com a implantação diluída em 3 anos, de ${Math.round(P.festasMin)} a ${Math.round(P.festasMax)} festas a mais por mês pagam tudo: menos de ${Math.ceil(P.pctMax * 100)}% das 480.`;
    // duas colunas na mesma escala: o que sai e o que entra
    const K = 0.018;
    const piece = (v, name, val, bg, cls) => h('span', { class: cls || null, style: `height:${Math.round(v * K)}px;${bg ? 'background:' + bg : ''}` }, h('em', name), val);
    const hoje = h('div.trade-col',
      h('div.trade-total', milFaixa(N.econ.min, N.econ.max), h('small', 'por mês, conforme a fatura')),
      h('div.trade-stack', { role: 'img', 'aria-label': `Hoje: Take Blip de ${milFaixa(H.takeBlip.min, H.takeBlip.max)} e JetSales de ${mil(H.jetSales)} por mês` },
        piece(H.takeBlip.max - H.takeBlip.min, 'mensagens, na fatura', 'até ' + mil(H.takeBlip.max - H.takeBlip.min), null, 'hatch'),
        piece(H.takeBlip.min, 'Take Blip', mil(H.takeBlip.min), 'var(--ember)'),
        piece(H.jetSales, 'JetSales', mil(H.jetSales), 'var(--ember-2)')),
      h('div.trade-name', 'Hoje'));
    const hub = h('div.trade-col',
      h('div.trade-total', sxBRL(N.novoMes), h('small', 'por mês, com tudo')),
      h('div.trade-stack', { role: 'img', 'aria-label': 'Com o GlowHub: sustentação, hospedagem, Claude e mensagens da Meta' },
        piece(N.meta, 'mensagens da Meta', mil(N.meta), '#7FD3F7'),
        piece(N.claude.tetoBRL, 'Claude, no teto', mil(N.claude.tetoBRL), 'var(--ai)'),
        piece(M.hospedagem, 'Hospedagem', sxBRL(mil(M.hospedagem)), '#C8EB5F'),
        piece(M.sustentacao, 'Sustentação', sxBRL(mil(M.sustentacao)), 'var(--lime)')),
      h('div.trade-name', 'Com o GlowHub'));
    const conta = h('table.trade-tbl', h('tbody',
      h('tr.out', h('td', 'Sai: Take Blip e JetSales'), h('td', '− ' + milFaixa(N.econ.min, N.econ.max))),
      h('tr', h('td', 'Entra: sustentação dos três módulos'), h('td', '+ ', sxBRL(M.sustentacao))),
      h('tr', h('td', 'Entra: hospedagem na AWS, na conta da Swot'), h('td', '+ ', sxBRL(M.hospedagem))),
      h('tr', h('td', 'Entra: Claude, no teto do orçamento da IA'), h('td', '+ ' + brl0(N.claude.tetoBRL))),
      h('tr', h('td', 'Entra: mensagens da Meta, pagas direto'), h('td', '+ ' + brl0(N.meta)))));
    const trade = h('div.panel-n',
      h('h3', 'A conta do mês, depois do go-live'),
      h('p.sub', 'O que sai e o que entra no caixa da Glow Park. Hoje as mensagens da Meta vêm dentro da fatura do Take Blip; com o GlowHub, são pagas direto à Meta.'),
      h('div.trade', hoje, hub),
      conta,
      h('p.trade-out', rich(`Conforme a fatura do mês, o GlowHub fica entre {{${brl0(-N.mes.difMin)}}} mais barato e {{${brl0(N.mes.difMax)}}} mais caro do que o Take Blip e o JetSales, **já com o Financeiro, o Marketing e a IA**.`)));

    // a calculadora da conversão
    const out = { festas: h('b'), receita: h('b'), payback: h('b', sx('')), ano: h('b') };
    const ppEl = h('p.calc-pp', { id: 'ppOut' });
    const slider = h('input.calc-slider', { type: 'range', id: 'pp', min: '0.1', max: '5', step: '0.05', value: '0.5', 'aria-describedby': 'ppHelp' });
    const presets = h('div.calc-presets', { role: 'group', 'aria-label': 'Cenários da proposta' },
      N.cenarios.map((c) => h('button', { type: 'button', dataset: { pp: String(c.pp * 100) }, onclick: () => { slider.value = String(c.pp * 100); update(); } }, '+' + nf(2).format(c.pp * 100) + ' ponto')));
    const pontos = (v) => '+' + nf(2).format(v) + (v < 2 ? ' ponto' : ' pontos');
    function update() {
      const pp = parseFloat(slider.value);
      const festas = (N.festa.oportunidadesMes * pp) / 100;
      const receita = festas * N.festa.ticket;
      const ganho = receita - (N.mes.difMin + N.mes.difMax) / 2;
      const payback = ganho > 0 ? N.implantacao.total / ganho : Infinity;
      ppEl.textContent = pontos(pp);
      out.festas.textContent = fmt.int(festas);
      out.receita.textContent = brl0(receita);
      out.payback.querySelector('.sx-v').textContent = nf(1).format(payback) + ' meses';
      out.ano.textContent = brl0(receita * 12);
      slider.setAttribute('aria-valuetext', `mais ${nf(2).format(pp)} ${pp < 2 ? 'ponto' : 'pontos'} de conversão: ${fmt.int(festas)} festas e ${brl0(receita)} a mais por mês`);
      presets.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(Math.abs(parseFloat(b.dataset.pp) - pp) < 0.001)));
    }
    slider.addEventListener('input', update);
    const calc = h('div.panel-n',
      h('h3', 'Quanto a conversão devolve'),
      h('p.sub', { id: 'ppHelp' }, `Sobre as cerca de ${fmt.int(N.festa.oportunidadesMes)} oportunidades por mês e o ticket médio de ${brl0(N.festa.ticket)}. O diagnóstico mira levar a conversão de 10% para 11% a 13%.`),
      h('label.calc-label', { for: 'pp' }, 'Ganho de conversão'),
      ppEl, slider,
      h('div.calc-scale', { 'aria-hidden': 'true' }, h('span', '+0,1 ponto'), h('span', '+5 pontos')),
      presets,
      h('div.calc-outs', { 'aria-live': 'polite' },
        h('div.calc-out', out.festas, h('span', 'festas a mais por mês')),
        h('div.calc-out', out.receita, h('span', 'de receita a mais por mês')),
        h('div.calc-out.hi', out.payback, h('span', 'para a implantação voltar')),
        h('div.calc-out', out.ano, h('span', 'de receita a mais em 12 meses'))),
      h('p.note', 'Receita de festas, antes do custo de cada festa. O retorno desconta o que o GlowHub custa a mais por mês, já com a economia de ferramentas. Cada festa a mais roda sobre o parque, o buffet e a equipe que a Glow Park já paga.'));
    update();
    $('#roi').append(trade, calc);

    $('#quote').append(
      h('blockquote', h('p', 'Quem tentou contato em até uma hora teve quase 7 vezes mais chance de qualificar o cliente do que quem tentou uma hora depois, e mais de 60 vezes mais do que quem esperou 24 horas.')),
      h('figcaption', 'Oldroyd, McElheran e Elkington, Harvard Business Review, 2011, com 2.241 empresas. No Brasil, 25% das mensagens de venda pelo WhatsApp chegam fora do horário comercial (OmniChat, 2026).'));

    [
      ['Horas do financeiro', 'Cerca de 39 horas por mês só para montar a base do PIX e 12 horas em devoluções. A rotina passa a rodar sozinha, e sobram as exceções.'],
      ['Dinheiro que escapa', 'As 8% das vendas fora do ERPFLEX, a taxa acima do contrato, o repasse que não caiu e o estorno em dobro passam a ser conferidos todo dia.'],
      ['Devoluções em até 1 dia', 'Hoje levam até 7 dias, e 43,65% das reclamações no Reclame Aqui falam de estorno.'],
      ['O Scale', `Com a agenda e o catálogo no GlowHub, o servidor de ${brl0(N.hoje.scale.servidor)} por mês pode ser desligado depois da avaliação técnica.`],
    ].forEach(([t, p]) => $('#notYet').appendChild(h('div', h('h4', t), h('p', p))));
  }

  /* =========================================================
     4. A economia
     ========================================================= */
  function buildEconomia() {
    const heads = ['Comparação', 'Mercado', 'GlowHub', 'A Glow Park economiza'];
    const cls = [null, 'mkt', 'hub', 'eco'];
    // linhas cujo valor do GlowHub e cuja economia revelam o preço
    const hide = (i, j) => j >= 2 && i !== 3 && i !== 6;
    $('#saveTable').appendChild(h('table.save-table',
      h('thead', h('tr', heads.map((t) => h('th', { scope: 'col' }, t)))),
      h('tbody', B.economiaLinhas.map((r, i) => h('tr', r.map((c, j) => h('td', { class: cls[j] }, j > 0 ? h('span.lbl', heads[j] + ': ') : null, hide(i, j) ? sx(c) : c)))))));

    const chart = (title, sub, rows, max, note) => h('div',
      h('h3', title), h('p.sub', sub),
      h('div.bars', rows.map((r) => {
        const lo = (r.low / max) * 100, hi = ((r.high || r.low) / max) * 100;
        return h('div.bar-row', { class: r.highlight ? 'me' : null },
          h('span', r.name),
          h('b', r.sx ? sx(r.valueText) : r.valueText),
          h('div.bar-track', { 'aria-hidden': 'true' },
            h('div.bar-fill', { style: `width:${lo}%` }),
            r.high ? h('div.bar-range', { style: `left:${lo}%;width:${hi - lo}%` }) : null));
      })),
      h('p.chart-note', note));
    $('#ecoCharts').append(
      chart('Custo total em 3 anos', 'Implantação, mensalidades, IA e hospedagem de cada caminho.',
        B.grafico.rows.map((r) => ({ ...r, sx: !!r.highlight })), 4e6,
        'As mensagens da Meta ficam de fora, porque todos os caminhos pagam. Trecho claro: do menor ao maior valor estimado.'),
      chart('Meses até operar', 'Quanto tempo até a Glow Park usar o sistema, em cada caminho.',
        B.prazoGrafico.rows, 21,
        'Software sob medida pelo roteiro de métricas do governo federal (SISP): 10 horas por ponto de função e prazo pela fórmula de Capers Jones. Trecho claro: do menor ao maior prazo estimado.'));

    [
      ['A base já roda', 'Os três módulos rodam em demonstração, com cerca de 1.500 testes automatizados. As 12 semanas são para ligar os sistemas reais, virar o WhatsApp, rodar o piloto da IA e treinar as unidades.'],
      ['Engenharia com IA', 'A equipe usa o Claude em todo o ciclo, com teste automático e revisão. Cada integração tem plano B por arquivo: se a API de um fornecedor atrasar, o prazo não muda.'],
      ['Pagamento por entrega', 'Só 31% dos projetos de TI terminam no prazo, no custo e com o escopo combinado (Standish Group). Por isso cada parcela da Glow Park segue um marco de entrega.'],
    ].forEach(([t, p]) => $('#whyFast').appendChild(h('div', h('h4', t), h('p', p))));

    const tbl = (cols, rows, opts = {}) => h('div', { style: 'overflow-x:auto' }, h('table',
      h('thead', h('tr', cols.map((c, j) => h('th', { class: (opts.right || []).includes(j) ? 'r' : null }, c)))),
      h('tbody', rows.map((r) => h('tr', { class: r.me ? 'me' : null }, r.cells.map((c, j) => h('td', { class: (opts.right || []).includes(j) ? 'r' : null }, c)))))));
    const more = (title, ...body) => h('details', h('summary', title), h('div.more-b', ...body));
    $('#ecoMore').append(
      more(`Preço por ponto de função: ${B.pfQtd.toLocaleString('pt-BR')} pontos no GlowHub`,
        tbl(['Referência', 'Preço por ponto', `Para ${B.pfQtd.toLocaleString('pt-BR')} pontos`], B.pfTabela.map((r, i) => ({ me: i === 0, cells: [strip(r.ref), i === 0 ? sx(strip(r.preco)) : r.preco, i === 0 ? sx(strip(r.total)) : r.total] })), { right: [1, 2] }),
        h('p', B.pfNota)),
      more(`Comprar ferramentas prontas: cinco assinaturas, de ${B.saasTotal} por mês`,
        tbl(['Necessidade', 'Exemplos de mercado', 'Por mês'], B.saas.map((x) => ({ cells: [x.necessidade, x.exemplos, mil(x.low) + ' a ' + mil(x.high)] })), { right: [2] }),
        h('p', 'O preço não é o maior problema desse caminho: nenhuma dessas ferramentas conversa com as outras, liga a festa ao sinal no banco, baixa recebíveis no ERPFLEX ou calcula o custo por festa em cada unidade.')),
      more('Construir com uma software house: de 14 a 20 meses',
        tbl(['Método', 'Premissa', 'Estimativa'], B.casa.map((c) => ({ cells: [c.metodo, c.premissa, c.valor] })), { right: [2] }),
        h('p', rich(B.sustTexto.replace(/(R\$\s?5\s?mil)/, '{{$1}}')))),
      more('Três anos, lado a lado',
        tbl(['Caminho', 'Como chega ao total', '36 meses'], B.tcoTabela.map((t) => ({ me: !!t.destaque, cells: [t.caminho, t.destaque ? sx(t.conta) : t.conta, t.destaque ? sx(t.total) : t.total] })), { right: [2] })),
      more('Prazos de mercado',
        tbl(['Caminho', 'Prazo', 'Base'], B.prazos.map((p) => ({ me: !!p.highlight, cells: [p.caminho, p.prazo, p.base] })), { right: [1] })),
      more('Fontes da pesquisa, de 07/10/2026', h('ul', B.fontes.map((f) => h('li', f)))));
  }

  /* =========================================================
     5. Segurança
     ========================================================= */
  const SEC_ICONS = {
    lock: 'M6 11h12v10H6z M8.5 11V7.5a3.5 3.5 0 0 1 7 0V11',
    users: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5 M16 4.6a3.3 3.3 0 0 1 0 6.2 M18 14.8c1.9.7 3 2.6 3 5.2',
    id: 'M3 5h18v14H3z M8.5 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M5.5 16c.5-1.7 1.6-2.5 3-2.5s2.5.8 3 2.5 M14 9h4 M14 13h4',
    cloud: 'M7 18h10a4 4 0 0 0 .6-8A6 6 0 0 0 6 9.5 4.3 4.3 0 0 0 7 18z',
    key: 'M8 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8z M12 12h9 M18 12v3 M21 12v2.5',
    plug: 'M9 3v5 M15 3v5 M7 8h10v4a5 5 0 0 1-10 0z M12 17v4',
    list: 'M9 6h11 M9 12h11 M9 18h11 M4.5 6h.01 M4.5 12h.01 M4.5 18h.01',
    spark: 'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z',
    shield: 'M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z M8.5 12l2.5 2.5 4.5-5',
  };
  const secIcon = (name) => s('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true' }, s('path', { d: SEC_ICONS[name] }));
  function buildSeguranca() {
    [
      ['R$ 7,19 mi', 'é o custo médio de um vazamento de dados no Brasil (IBM, 2025): mais de dez vezes o GlowHub inteiro em 3 anos'],
      ['até R$ 50 mi', 'de multa da LGPD por infração, até 2% do faturamento (art. 52)'],
      ['3 dias úteis', 'para avisar a ANPD e os titulares de um incidente (Resolução CD/ANPD 15/2024)'],
    ].forEach(([v, t]) => $('#secFacts').appendChild(h('div', h('b', v), h('span', t))));
    $('#secNote').textContent = 'Segurança também é economia: no Brasil, as empresas que usam IA e automação seguras pagam, em média, R$ 6,48 milhões por vazamento; as que não usam, R$ 8,78 milhões (IBM, Cost of a Data Breach 2025). Fontes: LGPD, art. 52; Resoluções CD/ANPD 15/2024 e 19/2024; Lei 15.211/2025 (ECA Digital).';
    [
      ['lock', 'Acesso', 'senha forte, sessão que expira e limite de tentativas', 'Senha guardada com Argon2id, o padrão recomendado hoje; sessão no servidor, com chave aleatória de 256 bits, que expira em 12 horas sem uso; limite de tentativas de login; proteção contra requisição forjada (CSRF).'],
      ['users', 'Permissões', 'cada pessoa vê só o seu papel e a sua unidade', 'O que cada pessoa vê é conferido no servidor em toda consulta, e não só na tela. Nas devoluções, quem valida não aprova.'],
      ['id', 'Dados pessoais', 'CPF, telefone e chave PIX cifrados', 'CPF, telefone e chave PIX cifrados com AES-256, com a chave fora do banco; telefone mascarado para o vendedor; nada pessoal nos logs.'],
      ['cloud', 'Infraestrutura', 'AWS em São Paulo, com backup diário', 'Contas separadas para produção e testes; banco e arquivos cifrados; backup diário com recuperação a um ponto no tempo; infraestrutura como código, que se recria do zero.'],
      ['key', 'Segredos', 'senhas e chaves num cofre, nunca no código', 'Senhas e chaves das integrações no AWS Secrets Manager; banco só por conexão TLS verificada, com rotação automática da senha.'],
      ['plug', 'Integrações', 'só entra o que chega assinado', 'Mensagem da Meta só entra com a assinatura conferida; acesso entre sistemas com token de escopo mínimo; arquivo recebido passa por verificação de malware antes de abrir; link de mídia expira em 15 minutos.'],
      ['list', 'Auditoria', 'trilha que ninguém altera, nem o sistema', 'O banco recusa alterar ou apagar um registro da trilha, até para o próprio sistema. Ela registra quem fez o quê, quando e de onde, inclusive cada ação da IA.'],
      ['spark', 'Inteligência artificial', 'a IA não vê dado sensível nem obedece à conversa', 'A IA não vê CPF, telefone completo nem dado de pagamento. O que a família escreve é tratado como dado, nunca como ordem, o que protege contra tentativa de manipular a IA. Ela não muda etapa, dono ou consentimento pelo texto.'],
      ['shield', 'LGPD', 'consentimento, exportar e anonimizar', 'Consentimento por finalidade; exportar e anonimizar os dados de um cliente pela tela; dado de criança só o necessário e nunca para plataforma de anúncio (ECA Digital); retenção em camadas; inventário de dados entregue ao encarregado da Glow Park.'],
    ].forEach(([ic, t, sub, p]) => $('#layers').appendChild(h('details.layer', h('summary', h('i', secIcon(ic)), h('span', h('b', t), h('small', sub))), h('p', p))));
    $('#promise').append(h('h3', 'O compromisso da Swot'), h('ul', [
      '**Atualizações de segurança** das bibliotecas e da infraestrutura, dentro da sustentação.',
      '**Monitoramento** com alarmes de erro, de fila, de integração e de custo.',
      '**Aviso de incidente em até 24 horas**, com o que aconteceu e o que foi feito, para a Glow Park cumprir o prazo de 3 dias úteis da ANPD.',
      '**Acordo de tratamento de dados no contrato:** a Glow Park é a controladora e a Swot, a operadora. Meta, Anthropic e AWS entram com as cláusulas de transferência internacional da Resolução CD/ANPD 19/2024.',
    ].map((t) => h('li', rich(t)))));
  }

  /* =========================================================
     6. Como fazemos
     ========================================================= */
  function buildComo() {
    [
      ['Conhece a Glow Park por dentro', 'O GlowHub nasceu dos seis mapas de processo do financeiro, desenhados pelo CEO, e do diagnóstico das festas. As decisões de desenho foram tomadas com a Glow Park em 03/10/2026.'],
      ['A base já existe', 'Os três módulos rodam em demonstração: 140 dos 181 requisitos estão prontos, e os outros dependem dos acessos reais ou estão em acabamento. São cerca de 1.500 testes automatizados.'],
      ['Experiência em produção', 'A Swot já opera um vendedor IA no WhatsApp para outra rede. O GlowHub traz o que essa operação ensinou: guardas na IA, avaliação antes de publicar e custo medido por conversa.'],
      ['Engenharia com IA, com teste e revisão', `É assim que um time de sete pessoas entrega em ${N.semanas} semanas o que o mercado leva de 14 a 20 meses.`],
      ['Qualidade que se mede', 'Cada regra que decide algo tem teste automático e cada requisito tem um roteiro de aceite. O Financeiro roda em paralelo ao processo atual antes de substituí-lo.'],
      ['Sem amarras', 'O GlowHub é da Glow Park: código, documentação e dados. A Swot ajuda a manter.'],
    ].forEach(([t, p]) => $('#why').appendChild(h('div', h('h3', t), h('p', p))));
    [
      ['Desenvolvimento', 'Equipe de 4 desenvolvedores', 'Responde pela arquitetura, pelo código, pelas integrações com os fornecedores e pela infraestrutura na AWS.'],
      ['Qualidade', 'Time de QA com 3 pessoas', 'Testa cada requisito pelo roteiro de aceite, homologa com os dados reais da Glow Park, acompanha a virada nas unidades e conduz o treinamento.'],
    ].forEach(([t, who, p]) => $('#team').appendChild(h('div', h('b', t), h('span', who), h('p', p))));

    const G = [
      { group: 'Fundação', c: '#C9D2EA' },
      { name: 'Etapa zero: acessos, linha de base e decisões', w: [1, 2], marks: { 2: 'P1' } },
      { name: 'GlowHub na AWS, homologação e produção', w: [1, 4], soft: true },
      { group: 'Financeiro', c: 'var(--lime)' },
      { name: 'Conectores reais e conciliação em paralelo', w: [2, 6] },
      { name: 'Devoluções: piloto em 2 unidades', w: [3, 5], soft: true },
      { name: 'Financeiro em produção', w: [7, 8], marks: { 8: '◆' } },
      { group: 'Comercial', c: 'var(--magenta)' },
      { name: 'Números oficiais, modelos da Meta e borda', w: [2, 5] },
      { name: 'Catálogo e base da IA, em oficina', w: [2, 4], soft: true },
      { name: 'Treino dos vendedores no número de teste', w: [5, 7], soft: true },
      { name: 'Virada do Take Blip e do JetSales', w: [8, 9], marks: { 8: '◆', 9: 'P2' } },
      { name: 'Vendedor IA: avaliação e piloto', w: [8, 12], soft: true, marks: { 12: 'P3' } },
      { group: 'Marketing', c: 'var(--cyan)' },
      { name: 'Convenção de origem, links e QR Codes', w: [1, 3], soft: true },
      { name: 'Contas de anúncio e painéis', w: [4, 8] },
      { name: 'Analista de marketing e resumo semanal', w: [8, 10], soft: true },
      { group: 'Entrega', c: '#C9D2EA' },
      { name: 'Treinamento nas 14 unidades e go-live', w: [9, 12], marks: { 12: '◆' } },
    ];
    const weeks = Array.from({ length: 12 }, (_, i) => i + 1);
    let color = '#C9D2EA';
    const rows = G.map((r) => {
      if (r.group) { color = r.c; return h('tr.g-group', { style: '--c:' + r.c }, h('td', { colspan: 13 }, r.group)); }
      return h('tr', h('td.g-name', r.name), weeks.map((wk) => {
        const on = wk >= r.w[0] && wk <= r.w[1];
        const mark = r.marks && r.marks[wk];
        return h('td.g-cell', on ? h('div.g-bar', { class: [wk === r.w[0] ? 'first' : '', wk === r.w[1] ? 'last' : ''].filter(Boolean).join(' ') || null, style: `--c:${color};${r.soft ? 'opacity:.55' : ''}` }) : null,
          mark ? h('span.g-mark', mark) : null);
      }));
    });
    $('#gantt').appendChild(h('table.gantt', h('caption.sr-only', 'Cronograma de 12 semanas por frente'),
      h('thead', h('tr', h('th', { scope: 'col' }, 'Semana'), weeks.map((wk) => h('th', { scope: 'col' }, String(wk))))),
      h('tbody', rows)));
    [
      ['P1, Fundação', 'semana 2', 'Linha de base medida, acessos liberados, operação-alvo e decisões de desenho aprovadas pela Glow Park.'],
      ['P2, Operação no GlowHub', 'semana 9', 'Toda a jornada no GlowHub, com Take Blip e JetSales desligados e 95% das festas do mês ligadas a uma oportunidade.'],
      ['P3, Ganho da IA', 'a partir da semana 12', 'Conversão igual ou melhor no grupo com IA, primeira resposta em segundos e passagem aprovada pelos vendedores. Pode fechar depois da semana 12, sem atrasar o go-live.'],
    ].forEach(([t, q, p]) => $('#gates').appendChild(h('div', h('b', t), h('em', q), h('span', p))));
    const deal = (t, items) => h('div', h('b', t), h('ul', items.map((x) => h('li', rich(x)))));
    $('#deals').append(
      deal('A Glow Park garante', [
        '**Até a semana 2, os acessos:** portfólio e app da Meta, os dois números oficiais, contas do Meta Ads e do Google Ads, chave da API do Claude e ERPFLEX, P4Play, lanchonete, site, Scale, adquirentes e bancos, com amostras de arquivo.',
        '**Um ponto focal por área:** financeiro, com cerca de 4 horas por semana, gestão comercial e marketing.',
        '**A oficina do catálogo, na semana 2:** pacotes, preços, buffets e janelas, adicionais, regras e perguntas frequentes. É a base da Lu.',
        '**Até a semana 5:** os modelos de mensagem aprovados pela Meta, a saída do Take Blip e as decisões em aberto.',
        '**A adesão dos vendedores** ao treino com o número de teste, o maior risco que o diagnóstico aponta.',
      ]),
      deal('A Swot garante', [
        '**Equipe dedicada**, com prazo, escopo e andamento aberto por requisito.',
        '**Plano B por arquivo** para cada fornecedor que atrasar, sem mexer no prazo.',
        '**Qualidade** com teste automatizado, roteiro de aceite, homologação com dados reais e garantia de 90 dias.',
        '**Hospedagem na AWS em São Paulo**, com backup e monitoramento, segurança e LGPD desde o desenho, sigilo e a entrega do código e dos dados à Glow Park.',
      ]));
  }

  /* =========================================================
     7. Perguntas da diretoria
     ========================================================= */
  function buildFaq() {
    const P = N.paga, E = B.econ, T = B.tco;
    const fmin = Math.round(P.festasMin), fmax = Math.round(P.festasMax);
    const FAQ = [
      { q: 'O investimento não é caro?', a: [
        `É menos da metade do que o mercado cobra por um sistema deste tamanho: {{R$ ${Math.round(B.pf.glowhub)}}} por ponto de função, contra R$ 450 a 712 nos contratos de fábrica de software. A implantação sai {{${mil(E.implantacao)}}} abaixo do preço típico.`,
        `E não é um gasto a mais. Descontado o que sai do Take Blip e do JetSales, o GlowHub custa de {{${milFaixa(P.liquidoMesMin, P.liquidoMesMax)}}} por mês em 3 anos, já com a implantação: o preço de ${fmin} a ${fmax} festas, menos de 1% das 480 do mês.`,
      ] },
      { q: 'E se a gente esperar?', a: [
        'Esperar também custa. A cada mês:',
        { ul: [
          `${milFaixa(N.econ.min, N.econ.max)} vão para ferramentas que não resolvem o problema;`,
          `cada meio ponto de conversão que não vem são cerca de ${N.cenarios[1].festas} festas, ou ${mil(N.cenarios[1].receita)} de receita;`,
          'um quarto das mensagens de venda chega fora do horário comercial, quando ninguém responde (OmniChat, 2026);',
          'o dinheiro segue sem conferência: 8% das vendas fora do ERPFLEX, taxas e créditos sem checagem.',
        ] },
      ] },
      { q: 'Por que não comprar ferramentas prontas?', a: [
        `Seriam cinco assinaturas, de ${B.saasTotal} por mês, que não conversam entre si, e esse é o problema que o diagnóstico encontrou. Em 3 anos, até o caminho mais barato custa ${T.glowhub < T.basico ? 'mais que' : 'perto do'} GlowHub (${mi(T.basico)} contra {{${mi(T.glowhub)}}}), e o corporativo custa ${mi(T.corporativo)}.`,
      ] },
      { q: 'Por que não montar uma equipe própria?', a: [
        `Pela referência do governo federal, um sistema deste tamanho pede ${((B.pfQtd * 10) / 1000).toLocaleString('pt-BR')} mil horas: de 6 a 12 pessoas por 14 a 20 meses. Só os salários de uma equipe enxuta, de 6 pessoas por 14 meses, chegariam a ${mi(E.equipePropria, 1)}, sem contar contratação, rotatividade e o risco de não entregar. Com a Swot, são ${N.semanas} semanas, e o código fica da Glow Park do mesmo jeito.`,
      ] },
      { q: 'Por que o valor é maior que o da proposta anterior?', a: [
        `Porque o escopo cresceu. A Central Financeira até ficou mais barata: {{${brl0(N.implantacao.financeiro)}}}, contra {{${brl0(N.anterior.implantacao)}}} na proposta de setembro, que cobria só o Financeiro; esta cobre a jornada inteira, da campanha ao dinheiro no banco.`,
        { table: [
          ['', 'Proposta de setembro', 'Esta proposta'],
          ['Módulos', 'Financeiro', 'Financeiro, Comercial e Marketing, sobre uma plataforma comum'],
          ['Quem usa', 'financeiro, controladoria, gerentes e o cliente que pede devolução', 'mais diretoria, gestão comercial, vendedores, SAC, marketing e equipe de festas'],
          ['Integrações', 'P4Play, PDVs, site, Scale, ERPFLEX, adquirentes e bancos', 'mais WhatsApp oficial, Meta Ads, Google Ads e Claude'],
          ['IA', 'copiloto financeiro e leitura de comprovantes', 'mais vendedor IA no WhatsApp, analista de marketing e avaliação de cada versão'],
          ['Propriedade', 'não definida', 'o GlowHub é da Glow Park: código, documentação e dados'],
          ['Mensalidade', `{{${brl0(N.anterior.sustentacao)}}}, só do Financeiro`, `{{${brl0(N.mensal.sustentacao)}}} de sustentação e {{${brl0(N.mensal.hospedagem)}}} de hospedagem, para os três módulos`],
        ] },
      ] },
      { q: 'E se não der certo?', a: [
        'O risco fica com a Swot, não com a Glow Park:',
        { ul: [
          '**O pagamento acompanha as entregas.** Cada parcela vence no marco combinado: o GlowHub no ar, o Financeiro em produção, o WhatsApp virado e o go-live.',
          '**A Glow Park vê antes de assinar.** A base dos três módulos já roda em demonstração.',
          '**A IA só se expande se provar ganho.** O piloto compara metade dos clientes novos, atendida pela IA, com a outra metade, sem IA.',
          '**Atrasos de fornecedor estão cobertos:** cada integração tem plano B por arquivo.',
          '**Garantia de 90 dias** depois do go-live, e o código e os dados são da Glow Park.',
        ] },
      ] },
      { q: 'E se a IA errar com um cliente?', a: [
        'A IA tem guardas no código, e não só nas instruções. Preço, horário e condição só saem do catálogo e da agenda. Ela diz que é uma IA e passa para uma pessoa quando não sabe. A gestão acompanha ao vivo, cada versão passa por avaliação antes de ir ao ar, e há teto de custo e botão de desligar, na rede e em cada número.',
      ] },
      { q: 'Os dados das famílias e das crianças estão seguros?', a: [
        'Sim. Os dados pessoais são cifrados, o acesso é por papel e unidade e a trilha de auditoria não pode ser alterada. Os dados ficam no Brasil, e a LGPD está no desenho. O detalhe está no capítulo 5, Segurança.',
      ] },
      { q: 'Vamos ficar presos à Swot?', a: [
        'Não. O GlowHub é da Glow Park: código, documentação e dados. A infraestrutura é código e pode ser recriada em outra conta. Se a sustentação terminar, a Swot entrega tudo e ajuda a migrar.',
      ] },
      { q: 'Quanto vamos pagar por mês depois do go-live?', a: [
        `Cerca de {{${brl0(N.novoMes)}}} com tudo: {{${brl0(N.mensal.sustentacao)}}} de sustentação, {{${brl0(N.mensal.hospedagem)}}} de hospedagem, até ${brl0(N.claude.tetoBRL)} de Claude e cerca de ${brl0(N.meta)} de mensagens da Meta. Hoje a Glow Park paga de ${milFaixa(N.econ.min, N.econ.max)} só ao Take Blip e ao JetSales.`,
      ] },
      { q: 'E se o prazo atrasar?', a: [
        'As parcelas seguem os marcos de entrega, e o ritual semanal mostra o andamento por requisito. O que depende da Glow Park está no capítulo 6: os acessos aos fornecedores e a aprovação dos modelos de mensagem pela Meta.',
      ] },
    ];
    const block = (b) => {
      if (typeof b === 'string') return h('p', rich(b));
      if (b.ul) return h('ul', b.ul.map((x) => h('li', rich(x))));
      return h('div', { style: 'overflow-x:auto' }, h('table',
        h('thead', h('tr', b.table[0].map((c) => h('th', c)))),
        h('tbody', b.table.slice(1).map((r) => h('tr', r.map((c) => h('td', rich(c))))))));
    };
    FAQ.forEach((f, i) => $('#faq').appendChild(h('details', { open: i === 0 || null }, h('summary', f.q), h('div.ans', f.a.map(block)))));
  }

  /* =========================================================
     8. Investimento e próximo passo
     ========================================================= */
  function buildInvestimento() {
    const I = N.implantacao, M = N.mensal, P = N.paga;
    const fmin = Math.round(P.festasMin), fmax = Math.round(P.festasMax);
    const prazoMercado = (B.prazos.find((x) => /software house/i.test(x.caminho)) || {}).prazo || '14 a 20 meses';
    const icon = (...paths) => s('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true' }, paths.map((d) => s('path', { d })));
    const giftIcon = () => icon('M3.5 8h17v4h-17z', 'M12 8v13', 'M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7', 'M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5');
    const checkIcon = () => icon('M5 12.5l4.5 4.5L19 7.5');
    $('#invLead').textContent = `Implantação dos três módulos em ${N.semanas} semanas, com o Marketing de brinde, paga por marco de entrega, e uma mensalidade a partir do go-live. Valores com impostos incluídos, válidos até ${N.validadeAte}.`;
    // a referência de mercado vem antes do preço, e fica à vista mesmo com os valores ocultos
    $('#offerRef').append(...rich(`Para o mesmo escopo, o mercado cobra cerca de **${mi(B.precoMercadoImpl)}** só na implantação (${brl0(B.pf.tipico)} por ponto de função, o preço típico dos contratos de fábrica de software) e leva de ${prazoMercado}. A pesquisa está no capítulo 4.`));
    // quatro números do mesmo tamanho: o que se paga, o que vem de brinde, o mês com tudo e o que paga isso
    const kpi = (cls, eyebrow, value, desc) => h('div.okpi', { class: cls }, h('span.okpi-e', eyebrow), h('b.okpi-v', value), h('span.okpi-d', desc));
    $('#offerKpis').append(
      kpi(null, 'Implantação', sxBRL(I.total), `dos três módulos, em ${N.semanas} semanas, paga em ${N.parcelas.length} parcelas, uma por entrega`),
      kpi('gift', [giftIcon(), 'De brinde'], sxBRL('R$ 0'), rich(`no Marketing: o módulo inteiro, avaliado em {{${brl0(I.marketingReferencia)}}}, sem custo de implantação`)),
      kpi(null, 'Por mês, com tudo', sxBRL(N.novoMes), `sustentação, hospedagem, IA no teto e mensagens estimadas, no lugar do Take Blip e do JetSales, que hoje custam ${milFaixa(N.econ.min, N.econ.max)}`),
      kpi(null, 'Para se pagar', [`${fmin} a ${fmax} `, h('small', 'festas')], `a mais por mês pagam, em receita, o GlowHub inteiro em 3 anos, menos de ${Math.ceil(P.pctMax * 100)}% das ${N.festa.porMes} de hoje`));
    const mod = (cls, name, c, desc, right) => h('li.mod', { class: cls }, h('div.mod-l', h('span.m-name', { style: c ? '--c:' + c : null }, c ? h('i') : null, name), h('span.m-desc', desc)), h('div.mod-r', right));
    const trust = (t, p) => h('div', h('b', checkIcon(), t), p);
    const main = h('div.offer-main',
      h('h3', 'O que entra na implantação'),
      h('ul.mods',
        mod(null, 'Financeiro', 'var(--lime)', 'A Central Financeira completa: conciliação diária, festas, devoluções, recebíveis e as integrações com o ERPFLEX, as adquirentes e os bancos.',
          [h('b', sxBRL(I.financeiro)), h('small.m-note', rich(`proposta de setembro: {{${brl0(N.anterior.implantacao)}}}`))]),
        mod(null, 'Comercial', 'var(--magenta)', 'WhatsApp oficial com a borda na AWS, atendimento com filas e prazo de resposta, vendedor IA com governança, oportunidades e agenda de festas.',
          h('b', sxBRL(I.comercial))),
        mod('gift', ['Marketing', h('span.m-tag', 'De brinde')], 'var(--cyan)', 'Origem em cada conversa, contas de anúncio, painéis de custo por festa e analista de marketing.',
          [h('span', h('s', sxBRL(I.marketingReferencia)), ' ', h('b.m-zero', sxBRL('R$ 0'))), h('small.m-note', 'valor de referência do módulo')]),
        mod(null, 'Plataforma comum', '#C9D2EA', 'Cliente único, LGPD, app no celular, avisos, auditoria, porta de IA e infraestrutura como código.', h('b', 'incluída')),
        mod('total', 'Total da implantação', null, ['em ', N.parcelas.length, ' parcelas de ', sxBRL(N.parcelas[0].valor), ', uma por entrega'], h('b', sxBRL(I.total)))),
      h('p.pay-t', 'Como se paga'),
      h('div.steps-pay', N.parcelas.map((p, i) => h('div', { class: i === 0 ? 'first' : null }, i === 0 ? h('span.pay-go', 'Para começar') : null, h('b', sxBRL(p.valor)), h('em', p.quando), p.marco))),
      h('p.pay-n', 'A primeira parcela inicia a etapa zero. As outras três vencem em até 10 dias depois de cada marco entregue.'));
    const trustRow = h('div.trust',
      trust('Paga por entrega', 'Três das quatro parcelas só vencem depois de um marco entregue.'),
      trust('Garantia de 90 dias', 'depois do go-live: defeito do escopo é corrigido sem custo, com ou sem a sustentação contratada.'),
      trust('Sem aprisionamento', 'O GlowHub é da Glow Park: código, documentação e dados. Se a sustentação terminar, a Swot entrega tudo e ajuda a migrar.'));
    const side = h('div.offer-side',
      h('div.side-card',
        h('h3', 'Pago à Swot, por mês, a partir do go-live'),
        h('p.side-big', sxBRL(M.sustentacao + M.hospedagem)),
        h('ul',
          h('li', h('span', 'Sustentação dos três módulos, até 15 unidades'), h('b', sxBRL(M.sustentacao))),
          h('li', h('span', 'Hospedagem na AWS em São Paulo, na conta da Swot'), h('b', sxBRL(M.hospedagem)))),
        h('p.vs', 'Monitoramento, correções, integrações em dia, suporte e atualizações de segurança. Evoluções orçadas por entrega; cada unidade acima de 15 soma ', sxBRL(M.unidadeExtra), ' por mês.')),
      h('div.side-card',
        h('h3', 'Pagos direto pela Glow Park, sem margem da Swot'),
        h('ul',
          h('li', h('span', 'Claude (Anthropic), com teto definido por política'), h('b', 'até ' + brl0(N.claude.tetoBRL))),
          h('li', h('span', 'Mensagens do WhatsApp (Meta), conforme o volume'), h('b', 'cerca de ' + brl0(N.meta)))),
        // a troca: o gasto de hoje é o ponto de comparação da mensalidade
        h('div.balance',
          h('h4', 'A conta do mês'),
          h('table.trade-tbl', h('tbody',
            h('tr.out', h('td', 'Saem: Take Blip e JetSales'), h('td', '− ' + milFaixa(N.econ.min, N.econ.max))),
            h('tr', h('td', 'Entra: o GlowHub, com tudo'), h('td', '+ ', sxBRL(N.novoMes))))),
          h('p.trade-out', rich(`Os dois são desligados na virada do WhatsApp. Conforme a fatura do mês, o GlowHub fica entre {{${brl0(-N.mes.difMin)}}} mais barato e {{${brl0(N.mes.difMax)}}} mais caro do que eles, **já com o Financeiro, o Marketing e a IA**.`)))));
    $('#offer').append(main, side, trustRow);
    [
      ['Propriedade', 'O GlowHub é da Glow Park: código-fonte, documentação e dados, com a cessão dos direitos patrimoniais completa na quitação da implantação.'],
      ['Dados e LGPD', 'Os dados são da Glow Park e podem ser exportados a qualquer momento. A Swot atua como operadora, com acordo de tratamento de dados no contrato.'],
      ['Saída', 'Se a sustentação terminar, a Swot entrega o código, os dados e a infraestrutura como código, e ajuda a migrar a hospedagem.'],
      ['Pagamento', 'Por boleto ou PIX, em até 10 dias depois de cada marco. Impostos incluídos.'],
      ['Mensalidade', `Contrato de 12 meses, renovável, com reajuste anual pelo IPCA (${nf(2).format(N.ipca12m * 100)}% nos 12 meses até agosto de 2026).`],
      ['Validade', `${N.validadeDias} dias, até ${N.validadeAte}. O início é em até 5 dias úteis depois da assinatura.`],
    ].forEach(([t, p]) => $('#terms').appendChild(h('div', h('b', t), p)));
    [
      ['Demonstração do GlowHub para a diretoria', 'A venda, a festa e a devolução de ponta a ponta, na base que já roda.'],
      ['Aprovação da proposta e assinatura do contrato', `Com a primeira parcela, de {{${brl0(N.parcelas[0].valor)}}}, começa a etapa zero.`],
      ['Semana 1', 'Os pedidos de acesso saem, a linha de base começa a ser medida e o GlowHub sobe na AWS em São Paulo.'],
    ].forEach(([t, p]) => $('#nextSteps').appendChild(h('li', h('div', h('b', t), h('span', rich(p))))));
  }

  /* =========================================================
     Diálogos, aviso e navegação
     ========================================================= */
  let lastFocus = null;
  function openDialog(el) {
    lastFocus = document.activeElement;
    el.hidden = false;
    const card = el.querySelector('.modal-card, .drawer-card');
    if (card) { card.scrollTop = 0; setTimeout(() => card.focus({ preventScroll: true }), 20); }
    document.body.style.overflow = 'hidden';
  }
  function closeDialog(el, keepFocus) {
    if (!el || el.hidden) return;
    el.hidden = true;
    document.body.style.overflow = '';
    if (!keepFocus && lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  const anyDialogOpen = () => $$('.modal:not([hidden]), .drawer:not([hidden])')[0] || null;
  GP.closeAll = () => $$('.modal:not([hidden]), .drawer:not([hidden])').forEach((d) => closeDialog(d, true));
  function trapTab(e, dlg) {
    const f = $$('button, [href], input, [tabindex]:not([tabindex="-1"])', dlg).filter((x) => !x.disabled && x.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && (document.activeElement === first || !f.includes(document.activeElement))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  let toastTimer = null;
  GP.toast = (msg) => {
    const t = $('#toast');
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.hidden = true; }, 3800);
  };

  function currentChapter() {
    const mid = window.innerHeight * 0.35;
    let cur = CHAPTERS[0];
    CHAPTERS.forEach((id) => { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top <= mid) cur = id; });
    return cur;
  }
  let navRaf = 0, lastCh = null;
  function markNav() {
    navRaf = 0;
    const cur = currentChapter();
    if (cur === lastCh) return;
    lastCh = cur;
    $$('.chapters a').forEach((a) => a.setAttribute('aria-current', String(a.dataset.ch === cur)));
    const nav = $('.chapters'), a = $(`.chapters a[data-ch="${cur}"]`);
    if (nav && a) {
      const ar = a.getBoundingClientRect(), nr = nav.getBoundingClientRect();
      if (ar.left < nr.left || ar.right > nr.right) nav.scrollLeft += ar.left - nr.left - (nr.width - ar.width) / 2;
    }
  }
  function goChapter(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: GP.reducedMotion() ? 'auto' : 'smooth', block: 'start' });
  }
  function onKey(e) {
    if (GP.tours.active()) return;
    const dlg = anyDialogOpen();
    if (e.key === 'Escape') { if (dlg) { e.preventDefault(); closeDialog(dlg); } return; }
    if (dlg) { if (e.key === 'Tab') trapTab(e, dlg); return; }
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'select' || tag === 'textarea' || e.altKey || e.ctrlKey || e.metaKey) return;
    const i = CHAPTERS.indexOf(currentChapter());
    if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); goChapter(CHAPTERS[Math.min(CHAPTERS.length - 1, i + 1)]); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); goChapter(CHAPTERS[Math.max(0, i - 1)]); }
    else if (/^[1-8]$/.test(e.key)) { e.preventDefault(); goChapter(CHAPTERS[+e.key - 1]); }
    else if (e.key === 'v' || e.key === 'V') setMode(hubMode ? 'hoje' : 'glowhub', true);
    else if (e.key === 's' || e.key === 'S') setSuspense(!suspenseOn(), true);
  }

  function init() {
    setSuspense(storedSuspense(), false);
    buildLine();
    setMode('hoje', false);
    buildFacts();
    buildWeigh();
    GP.app.mount($('#app'));
    GP.app.mountStory($('#story'));
    GP.phone.mount($('#phone'));
    GP.tours.launchers($('#tourLaunch'));
    buildRetorno();
    buildEconomia();
    buildSeguranca();
    buildComo();
    buildFaq();
    buildInvestimento();
    $$('.toggle button').forEach((b) => b.addEventListener('click', () => setMode(b.dataset.mode, true)));
    $('#sxBtn').addEventListener('click', () => setSuspense(!suspenseOn(), true));
    $('#keysBtn').addEventListener('click', () => openDialog($('#keys')));
    // a versão publicada como artifact não tem o botão de PDF (o quadro do artifact não imprime)
    const printBtn = $('#printBtn');
    if (printBtn) printBtn.addEventListener('click', () => window.print());
    $$('[data-close]').forEach((b) => b.addEventListener('click', () => closeDialog(b.closest('.modal, .drawer'))));
    $$('[data-tour-open]').forEach((b) => b.addEventListener('click', () => GP.tours.start(b.dataset.tourOpen)));
    document.addEventListener('keydown', onKey);
    window.addEventListener('scroll', () => { if (!navRaf) navRaf = requestAnimationFrame(markNav); }, { passive: true });
    markNav();
    const mq = window.matchMedia('(max-width: 720px)');
    if (mq.addEventListener) mq.addEventListener('change', buildLine); else if (mq.addListener) mq.addListener(buildLine);
  }

  GP.stage = { setMode, setSuspense, goChapter, openProto };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
