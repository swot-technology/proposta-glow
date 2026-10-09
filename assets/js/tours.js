/* Visitas guiadas: uma família do anúncio ao banco, a IA sob controle, o dinheiro do dia e uma devolução.
   Cada passo pode mudar a etapa da história, a tela do protótipo e o celular; ao voltar, o estado é refeito. */
(function () {
  const { h, s, $, clear } = GP;

  const TOURS = [
    {
      id: 'familia', title: 'Siga uma família', sub: 'Do anúncio ao sinal no banco', c: 'var(--magenta)',
      steps: [
        { etapa: 0, app: ['comercial', 'atendimento', { conv: 'joao' }], phone: 'familia', target: '#phone',
          t: 'Tudo começa num anúncio', p: 'A Mariana vê o anúncio de verão da Glow Park em Hortolândia e toca em Enviar mensagem. O clique já leva a campanha para dentro da conversa.' },
        { etapa: 1, play: true, app: ['comercial', 'atendimento', { conv: 'mariana' }], target: '#phone',
          t: 'A Lu responde em segundos', p: 'São 19h42, com a loja fechando. A vendedora IA diz que é uma IA, pergunta o que importa e consulta a agenda e o catálogo de verdade: preço e horário só saem dali.' },
        { target: '[data-tour="conv"]',
          t: 'A gestão vê tudo ao vivo', p: 'A conversa já está no Atendimento do GlowHub, com cada consulta que a Lu fez. A gestão acompanha e pode assumir a qualquer momento.' },
        { after: () => GP.com.openFicha(), target: '[data-tour="origem"]',
          t: 'A origem fica gravada na ficha', p: 'O botão Ficha mostra o contato, a festa e a origem: anúncio do Meta Ads, campanha festas_conversas_hortolandia_202611. É isso que permite, no fim, saber quanto custou cada festa.' },
        { etapa: 2, target: '[data-tour="conv"]',
          t: 'A Ana recebe com o resumo pronto', p: 'Quando a família quer proposta, a Lu passa a conversa para a vendedora da unidade com um resumo. A Ana marca se o resumo está certo, e o prazo de resposta começa a contar.' },
        { etapa: 3, app: ['comercial', 'oportunidades'], after: () => GP.com.openOpp('mariana'), target: '[data-tour="opp-pre"]',
          t: 'A data fica segura por 48 horas', p: 'Na oportunidade, a Ana pré-reserva o Salão Lune no sábado, das 14:00 às 17:00, e liga o orçamento 48213 do Scale. A pré-reserva vence em 48 horas.' },
        { app: ['comercial', 'agenda', { tab: 'semana' }], target: '[data-tour="cel-mariana"]',
          t: 'E aparece na agenda de festas', p: 'A agenda é a mesma para todos: a Lu não oferece a outra família o que já está pré-reservado.' },
        { etapa: 4, play: true, app: ['financeiro', 'festas'], target: '#phone',
          t: 'A cobrança sai da Central, sem comprovante', p: 'O Financeiro manda a cobrança do sinal com PIX copia e cola, com o número do orçamento dentro. A família paga no app do banco e não precisa mandar print.' },
        { etapa: 5, play: true, app: ['financeiro', 'festas'], target: '[data-tour="cob-mariana"]',
          t: 'O banco confirma às 20h03', p: 'O Financeiro recebe a confirmação do banco e lança o adiantamento no ERPFLEX no mesmo dia. A família recebe o "Recebemos o sinal" sozinha.' },
        { app: ['comercial', 'oportunidades'], target: '[data-tour="kb-ganha"]',
          t: 'A venda vira ganha sozinha', p: 'A OP-0412 sai do funil e entra nas encerradas como ganha, porque o sinal caiu no banco, e não porque alguém disse que fechou. É isso que dá confiança ao ranking e à comissão.' },
        { app: ['marketing', 'campanhas'], target: '[data-tour="camp-mariana"]',
          t: 'E a festa entra na conta da campanha', p: 'A festa da Mariana soma na campanha dela no Meta Ads: investimento dividido por festas ganhas, com o que a plataforma diz ao lado do que o GlowHub viu.' },
        { phone: 'diretoria', target: '#phone',
          t: 'Às 6h, o resumo da diretoria', p: 'Todo dia, a diretoria recebe no WhatsApp o resumo da véspera: o vendido, o conferido, os adiantamentos e as tratativas. O sinal da Alice entra no de amanhã, já como adiantamento.' },
      ],
    },
    {
      id: 'ia', title: 'A IA sob controle', sub: 'Onde atende, teto, limites, versões e avaliação', c: 'var(--ai)',
      steps: [
        { app: ['comercial', 'ia', { tab: 'vendedor' }], target: '[data-tour="ia-onde"]',
          t: 'Liga e desliga sem programar', p: 'A Lu atende na rede inteira ou só em um dos números, Vendas ou SAC, e o piloto sorteia metade dos clientes novos para comparar a conversão. Cada mudança fica registrada: quem decidiu e por quê.' },
        { target: '[data-tour="ia-teto"]',
          t: 'Teto de custo por mês', p: 'O orçamento da IA começa em R$ 2.000 por mês, cerca de US$ 400, pago direto à Anthropic. No limite, a Lu passa as conversas para a fila em vez de ficar muda.' },
        { target: '[data-tour="ia-limites"]',
          t: 'Limites em cada conversa', p: 'No máximo 25 turnos por atendimento e US$ 2,00 de IA por conversa no dia. Passou disso, a conversa vai para a fila; com 80%, a supervisão recebe o alerta.' },
        { app: ['comercial', 'ia', { tab: 'ao-vivo' }], target: '[data-tour="ia-ao-vivo"]',
          t: 'Supervisão ao vivo', p: 'A gestão vê cada conversa da Lu enquanto ela acontece, com os turnos, o custo e os alertas, e assume com um clique.' },
        { app: ['comercial', 'ia', { tab: 'avaliacao' }], target: '[data-tour="ia-cenarios"]',
          t: 'Cada versão é avaliada antes de ir ao ar', p: 'Os cenários conferem a fase, as ferramentas, a passagem e o tom, e nenhum preço inventado. Publicar exige nota mínima de 80% e no máximo 10 pontos abaixo da versão publicada.' },
        { app: ['comercial', 'ia', { tab: 'vendedor' }], target: '[data-tour="ia-versoes"]',
          t: 'E volta para a anterior em um clique', p: 'A Swot edita, testa e avalia; publicar é da gestão comercial. Se algo piorar, a versão anterior volta na hora.' },
        { app: ['comercial', 'painel'], target: '[data-tour="piloto"]',
          t: 'A IA só cresce se provar ganho', p: 'O Painel compara a conversão com a IA e sem ela, no piloto. A Lu só passa a atender todos os clientes novos se a conversão for igual ou melhor.' },
      ],
    },
    {
      id: 'dinheiro', title: 'O dinheiro do dia', sub: 'Da venda conferida ao caixa de 13 semanas', c: 'var(--lime)',
      reset: () => GP.fin.reset(),
      steps: [
        { app: ['financeiro', 'visao'], target: '[data-tour="luzes"]',
          t: 'As luzes da rede', p: 'Cada luz acesa é uma unidade com o dinheiro de ontem conferido no PDV, no ERPFLEX, na adquirente e no banco. Goiânia e Londrina ainda têm pendências.' },
        { target: '[data-tour="todo"]',
          t: 'Só o que precisa de alguém', p: 'O que casou, casou sozinho. O que não casou vira tratativa com dono e prazo, e cada item abre a origem.' },
        { app: ['financeiro', 'vendas'], target: '[data-tour="funil"]',
          t: '1.191 vendas conferidas em três lugares', p: 'Ontem, as 14 unidades venderam 1.191 vezes. O GlowHub confere cada venda no ERPFLEX e na adquirente ou no banco, todo dia às 6h.' },
        { target: '[data-tour="reenvio"]',
          t: 'Os 8% que não chegavam ao ERPFLEX', p: '95 vendas não subiram na primeira tentativa. O GlowHub reenviou 91 sozinho e abriu tratativa para 4. Pelos mapas, essa correção levava até uma semana.' },
        { after: () => GP.fin.openSale('P4-482167'), target: '[data-tour="venda-detalhe"]',
          t: 'A mesma chave nos três lados', p: 'A venda do Diego em Barra Funda: R$ 179,80 no P4Play e R$ 149,80 no PIX. O QR Code ficou com o valor antigo, e a diferença aparece no mesmo dia, com o nome do operador.' },
        { phone: 'gerente', after: () => GP.fin.openSale('P4-482167'), target: '#phone',
          t: 'A gerente fica sabendo às 6h04', p: 'O alerta chega no WhatsApp da gerente de Barra Funda, que conversa com a equipe e registra a perda.' },
        { app: ['financeiro', 'recebiveis'], setup: () => { GP.fin.state.recTab = 'banco'; }, target: '[data-tour="credito-menor"]',
          t: 'O que a adquirente agendou e o que caiu no banco', p: 'A Stone creditou R$ 3.411,80 a menos no Santander. O GlowHub cruza o arquivo da adquirente com o extrato e abre a cobrança.' },
        { app: ['financeiro', 'tratativas'], target: '[data-tour="tratativas"]',
          t: 'Cada divergência com dono e prazo', p: 'O que não casou sozinho vira tratativa, com dono, prazo e a origem a um toque. O relatório do dia sai em Excel e PDF.' },
        { app: ['financeiro', 'taxas'], target: '[data-tour="taxas"]',
          t: 'A taxa cobrada contra a do contrato', p: 'Neste mês, R$ 1.596,90 acima do contrato em duas modalidades. A contestação sai montada, com as vendas.' },
        { app: ['financeiro', 'caixa'], target: '[data-tour="caixa"]',
          t: 'O caixa das próximas 13 semanas', p: 'A agenda das adquirentes, as festas já pagas e as contas a pagar. Quando uma semana fura o mínimo, dá para simular a antecipação só ali.' },
        { app: ['financeiro', 'copiloto'], target: '[data-tour="copiloto"]',
          t: 'Pergunte em português', p: 'O copiloto lê a conciliação, a agenda das adquirentes, o ERPFLEX e os bancos. Cada resposta traz a fonte.' },
        { phone: 'diretoria', target: '#phone',
          t: 'O resumo chega às 6h', p: 'A diretoria começa o dia sabendo o que foi vendido, o que está conferido e o que precisa de decisão.' },
      ],
    },
    {
      id: 'devolucao', title: 'Siga uma devolução', sub: 'Do pedido do gerente ao dinheiro de volta', c: 'var(--lime)',
      reset: () => GP.fin.reset(),
      steps: [
        { app: ['financeiro', 'devolucoes'], phone: 'pedido', play: true, target: '#phone',
          t: 'O pedido nasce completo', p: 'A gerente registra a devolução no celular. Venda, valor e motivo são obrigatórios, e o GlowHub localiza a venda na hora. O e-mail em texto livre sai do processo.' },
        { setup: () => { GP.fin.state.mark = 'DEV-931'; }, target: '[data-tour="fila"]',
          t: 'Uma fila só, com checagem automática', p: 'O pedido entra na fila que o financeiro vê. O GlowHub confere se a venda existe, se já houve devolução e se o motivo é pré-aprovado. Este segue direto para o lote de hoje.' },
        { setup: () => { GP.fin.state.lote = 'enviado'; }, phone: 'aprovacao', target: '[data-tour="lote"]',
          t: 'O lote do dia vai para quem aprova', p: 'Às 16h, o lote vai para a controladoria. Quem validou não aprova: é a separação de funções que o mapa de estornos pedia.' },
        { setup: () => { GP.fin.state.lote = 'aprovado'; }, target: '#phone',
          t: 'Aprovado no celular', p: 'A controladoria aprova com a lista, os valores e os motivos na mão.' },
        { setup: () => { GP.fin.state.lote = 'efetivado'; }, target: '[data-tour="fila"]',
          t: 'O dinheiro volta pelo caminho de cada venda', p: 'Compra no site: estorno pela API da Getnet. Cartão no caixa: portal da adquirente com a venda já localizada. Depósito: PIX para a chave validada do cliente.' },
        { phone: 'portal', target: '#phone',
          t: 'O cliente acompanha sozinho', p: 'Cada etapa chega no WhatsApp do cliente, por um link. No Reclame Aqui, 43,65% das reclamações de março a agosto de 2026 são sobre estorno.' },
      ],
    },
  ];

  let tour = null, idx = 0, scrim, hole, bubble, lastFocus, placeTimer;

  function launchers(el) {
    clear(el);
    TOURS.forEach((t) => el.appendChild(h('button.tour-btn', { type: 'button', style: '--c:' + t.c, onclick: () => start(t.id) },
      h('i', s('svg', { viewBox: '0 0 24 24', 'aria-hidden': 'true' }, s('path', { d: 'M8.5 5.5v13l10-6.5z', fill: 'currentColor' }))),
      h('span', h('b', t.title), h('small', t.sub)))));
  }

  function start(id) {
    tour = TOURS.find((t) => t.id === id) || null;
    if (!tour) return;
    if (GP.closeAll) GP.closeAll();
    idx = 0;
    lastFocus = document.activeElement;
    scrim = $('#tourScrim');
    hole = $('#tourHole');
    bubble = $('#tourBubble');
    scrim.hidden = false;
    bubble.hidden = false;
    document.addEventListener('keydown', onKey, true);
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, { passive: true });
    const proto = $('#proto');
    if (proto) proto.scrollIntoView({ behavior: GP.reducedMotion() ? 'auto' : 'smooth', block: 'start' });
    setTimeout(() => showStep(true), GP.reducedMotion() ? 0 : 450);
  }
  function end() {
    if (!tour) return;
    tour = null;
    clearTimeout(placeTimer);
    scrim.hidden = true;
    bubble.hidden = true;
    document.removeEventListener('keydown', onKey, true);
    window.removeEventListener('resize', place);
    window.removeEventListener('scroll', place);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  function onKey(e) {
    if (!tour) return;
    const stop = () => { e.preventDefault(); e.stopPropagation(); };
    if (e.key === 'Escape') { stop(); end(); }
    else if (e.key === 'ArrowRight' || e.key === 'PageDown') { stop(); next(); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { stop(); prev(); }
  }
  function next() { if (idx < tour.steps.length - 1) { idx++; showStep(true); } else end(); }
  function prev() { if (idx > 0) { idx--; showStep(false); } }

  // refaz o estado acumulado até o passo atual: o estado do Financeiro, a etapa da história, a tela e o celular
  function apply(forward) {
    if (tour.reset) tour.reset();
    let etapa = null, app = null, phone = null;
    for (let i = 0; i <= idx; i++) {
      const x = tour.steps[i];
      if (x.setup) x.setup();
      if (x.etapa != null) etapa = x.etapa;
      if (x.app) app = x.app;
      if (x.phone) phone = x.phone;
    }
    const st = tour.steps[idx];
    const from = GP.app.state.etapa;
    if (app) GP.app.go(app[0], app[1], app[2] || {});
    if (etapa != null && etapa !== from) GP.app.setEtapa(etapa, { phone: false, toast: false });
    const play = forward && !!st.play && (phone !== 'familia' || (etapa != null && etapa > from));
    if (phone) GP.phone.show(phone, { from, play });
    // o que abre por cima da tela (a gaveta de uma venda) vem por último, só neste passo
    if (st.after) st.after();
  }

  function showStep(forward) {
    apply(forward);
    renderBubble();
    requestAnimationFrame(() => {
      const t = target();
      if (t) ensureVisible(t);
      place();
      clearTimeout(placeTimer);
      placeTimer = setTimeout(place, 420);
      const nb = bubble.querySelector('.tn-next');
      if (nb) nb.focus({ preventScroll: true });
    });
  }
  function target() {
    const sel = tour && tour.steps[idx].target;
    return sel ? document.querySelector(sel) : null;
  }
  function ensureVisible(t) {
    const r = t.getBoundingClientRect();
    const top = 80, bottom = window.innerHeight - 16;
    if (r.top >= top && r.bottom <= bottom) return;
    const y = window.scrollY + r.top - Math.max(top, (window.innerHeight - r.height) / 2);
    window.scrollTo({ top: Math.max(0, y), behavior: GP.reducedMotion() ? 'auto' : 'smooth' });
  }

  function renderBubble() {
    const st = tour.steps[idx];
    const last = idx === tour.steps.length - 1;
    clear(bubble);
    bubble.appendChild(h('button.tb-x', { type: 'button', 'aria-label': 'Encerrar a visita', onclick: end }, '×'));
    bubble.appendChild(h('div.tb-step', tour.title + ', passo ' + (idx + 1) + ' de ' + tour.steps.length));
    bubble.appendChild(h('h4', { id: 'tourTitle' }, st.t));
    bubble.appendChild(h('p', st.p));
    bubble.appendChild(h('div.tour-dots', { 'aria-hidden': 'true' }, tour.steps.map((_, i) => h('i', { class: i === idx ? 'on' : null }))));
    bubble.appendChild(h('div.tour-nav',
      idx > 0 ? h('button', { type: 'button', onclick: prev }, 'Voltar') : null,
      h('button.tn-next', { type: 'button', onclick: next }, last ? 'Concluir' : 'Próximo')));
  }

  function place() {
    if (!tour) return;
    const t = target();
    const vw = window.innerWidth, vh = window.innerHeight;
    const bw = bubble.offsetWidth || 380, bh = bubble.offsetHeight || 220;
    const clampX = (x) => Math.min(Math.max(12, x), vw - bw - 12);
    if (!t) {
      hole.style.opacity = 0;
      bubble.style.left = (vw - bw) / 2 + 'px';
      bubble.style.top = (vh - bh) / 2 + 'px';
      return;
    }
    const r = t.getBoundingClientRect(), pad = 6;
    const top = Math.max(4, r.top - pad), left = Math.max(4, r.left - pad);
    const bottom = Math.min(vh - 4, r.bottom + pad), right = Math.min(vw - 4, r.right + pad);
    Object.assign(hole.style, { opacity: 1, top: top + 'px', left: left + 'px', width: Math.max(0, right - left) + 'px', height: Math.max(0, bottom - top) + 'px' });
    let bx, by;
    if (vw - right >= bw + 28) { bx = right + 16; by = top; }
    else if (left >= bw + 28) { bx = left - bw - 16; by = top; }
    else if (vh - bottom >= bh + 24) { bx = clampX(left); by = bottom + 14; }
    else if (top >= bh + 24) { bx = clampX(left); by = top - bh - 14; }
    else { bx = clampX(left); by = vh - bh - 12; }
    by = Math.min(Math.max(12, by), vh - bh - 12);
    bubble.style.left = bx + 'px';
    bubble.style.top = by + 'px';
  }

  GP.tours = { launchers, start, end, active: () => !!tour, list: TOURS };
})();
