/* Dados de demonstração do protótipo, com os nomes, as etapas e os rótulos do GlowHub real.
   Famílias, vendedores e valores são fictícios; as unidades e a marca são da Glow Park.
   A história da Mariana atravessa os três módulos. */
(function () {
  const GP = window.GP;

  const units = [
    ['agua-fria', 'Água Fria'], ['barra-funda', 'Barra Funda'], ['brooklin', 'Brooklin'], ['catarina', 'Catarina Outlet'],
    ['cristiano-machado', 'Cristiano Machado'], ['goiania', 'Goiânia'], ['hortolandia', 'Hortolândia'], ['interlagos', 'Interlagos'],
    ['londrina', 'Londrina'], ['piracicaba', 'Piracicaba'], ['praia-grande', 'Praia Grande'], ['sjc', 'São José dos Campos'],
    ['sorocaba', 'Sorocaba'], ['uberlandia', 'Uberlândia'],
  ].map(([id, name]) => ({ id, name }));

  // a família que atravessa o GlowHub inteiro; a história acontece na quinta, 05/11
  const familia = {
    nome: 'Mariana Souza', primeiro: 'Mariana', ini: 'MS', fone: '(19) *****-4471', crianca: 'Alice', idade: 7,
    unidade: 'Hortolândia', data: 'sábado, 14/11', dataCurta: '14/11', janela: '14:00 às 17:00', salao: 'Lune',
    pulantes: 25, convidados: 60, pacote: 'Glow Festa Plus', valor: 3290, sinal: 987, orc: 48213, op: 'OP-0412',
    origem: { canal: 'Meta Ads', campanha: 'festas_conversas_hortolandia_202611', anuncio: 'Turma do Glow, vídeo de 15 s', titulo: 'Aniversário de verão em Hortolândia' },
  };

  // a conversa; "etapa" diz a partir de quando a mensagem existe.
  // who: in (a família), ai (a Lu), out (a Ana), handoff (a passagem com o resumo),
  // central (a cobrança e a confirmação do Financeiro: no R1 saem pela fila de notificações dele e não aparecem no atendimento)
  const conversa = [
    { etapa: 1, who: 'in', t: 'Oi! Vi o anúncio e quero saber sobre festa de aniversário 🎉', h: '19:42' },
    { etapa: 1, who: 'ai', t: 'Oi! Eu sou a Lu, a inteligência artificial da Glow Park 💜 Tô aqui com a equipe pra te ajudar com a festa.', h: '19:42' },
    { etapa: 1, who: 'ai', t: 'É aniversário de quem, e pra quando vocês estão pensando?', h: '19:42' },
    { etapa: 1, who: 'in', t: 'Da minha filha Alice, 7 anos. Queria dia 14 de novembro, um sábado, em Hortolândia', h: '19:43' },
    { etapa: 1, who: 'ai', t: 'Que demais! No sábado, 14/11, em Hortolândia, ainda tem estes horários: 10:00 às 13:00 e 14:00 às 17:00. Quantas crianças vão pular, e quantos convidados no total?', h: '19:43', tool: 'consultou a agenda de Hortolândia: 2 janelas livres em 14/11' },
    { etapa: 1, who: 'in', t: 'Umas 25 crianças, uns 60 convidados', h: '19:44' },
    { etapa: 1, who: 'ai', t: 'Pra 25 crianças e 60 convidados, o Glow Festa Plus no sábado sai por R$ 3.290: até 40 pulando e 70 convidados, 4 horas de festa. Quer que eu chame a equipe da unidade pra montar a proposta?', h: '19:44', tool: 'consultou o catálogo: Glow Festa Plus, sábado, R$ 3.290,00' },
    { etapa: 1, who: 'in', t: 'Quero sim!', h: '19:45' },
    { etapa: 2, who: 'handoff', motivo: 'Qualificado', t: 'Aniversário da Alice, 7 anos, sábado 14/11 à tarde, em Hortolândia. 25 crianças e 60 convidados; interesse no Glow Festa Plus (R$ 3.290). Veio do anúncio da campanha festas_conversas_hortolandia_202611.', h: '19:45' },
    { etapa: 2, who: 'out', t: 'Oi, Mariana! Sou a Ana, da Glow Park Hortolândia. O sábado 14/11, das 14:00 às 17:00, no Salão Lune, está livre. Quer que eu segure a data pra você?', h: '19:52' },
    { etapa: 3, who: 'in', t: 'Quero! Como faço?', h: '19:55' },
    { etapa: 3, who: 'out', t: 'Pronto, pré-reservei pra você até sábado, 07/11. Agora chega aqui a cobrança do sinal, R$ 987,00, com PIX copia e cola: o banco confirma pra gente, não precisa mandar comprovante.', h: '19:56' },
    { etapa: 4, who: 'central', kind: 'cobranca', t: 'Olá, Mariana! Aqui está a cobrança do sinal da Festa de Alice na Glow Park Hortolândia, em sábado, 14/11/2026: R$ 987,00, com vencimento em 07/11/2026.', h: '19:58' },
    { etapa: 5, who: 'central', kind: 'confirmacao', t: 'Oi, Mariana! Recebemos o sinal de R$ 987,00 da Festa de Alice. Obrigado!', h: '20:03' },
    { etapa: 5, who: 'out', t: 'Tudo certo, Mariana! A festa da Alice está garantida 🎈', h: '20:05' },
  ];

  /* ---------- Comercial, visto pela gestão comercial ---------- */
  // conversas da lista; dono: 'ia', 'fila' ou o nome da pessoa
  const inbox = [
    { id: 'beatriz', nome: 'Beatriz Santana', ini: 'BS', unidade: 'Água Fria', numero: 'Vendas', origem: 'Meta Ads', dono: 'ia', fase: 'Apresentação', etapa: 'Nova', prev: 'Lu: Que legal! Pra quantas crianças vocês estão pensando?', h: '19:40' },
    { id: 'henrique', nome: 'Henrique Matos', ini: 'HM', unidade: null, numero: 'Vendas', origem: 'Google Ads', dono: 'ia', fase: 'Qualificação', etapa: 'Nova', prev: 'Lu: Os pacotes têm o mesmo preço em toda a rede…', h: '19:38' },
    { id: 'joao', nome: 'João Pedro Alves', ini: 'JA', unidade: 'Hortolândia', numero: 'Vendas', origem: 'Meta Ads', dono: 'Ana Lima', etapa: 'Proposta', prev: 'Tem desconto pra irmãos?', h: '19:31', espera: ['good', 'esperando há 4 min • no prazo'], unread: 1 },
    { id: 'camila', nome: 'Camila Rocha', ini: 'CR', unidade: 'Piracicaba', numero: 'Vendas', origem: 'Google Ads', dono: 'Bruno Costa', etapa: 'Negociação', prev: 'Vou ver com meu marido e te falo', h: '19:12', acomp: [['Agendado', 'Retorno combinado', 'sex, 06/11 às 09:00 • Bruno Costa']] },
    { id: 'fernanda', nome: 'Fernanda Dias', ini: 'FD', unidade: 'Hortolândia', numero: 'Vendas', origem: 'Meta Ads', dono: 'Ana Lima', etapa: 'Proposta', prev: 'Perfeito, pago amanhã cedo', h: '18:54' },
    { id: 'lucas', nome: 'Lucas Martins', ini: 'LM', unidade: 'Sorocaba', numero: 'Vendas', origem: 'Redes sociais', dono: 'ia', fase: 'Recepção', etapa: 'Nova', prev: 'Lu: No feriado, Sorocaba abre das 10:00 às 20:00. É pra ingresso ou pra festa?', h: '18:40' },
    { id: 'patricia', nome: 'Patrícia Gomes', ini: 'PG', unidade: 'Hortolândia', numero: 'Vendas', origem: 'Meta Ads', dono: 'Ana Lima', etapa: 'Ganha', prev: 'Ana: A festa do Miguel está garantida 🎈', h: '18:02' },
    { id: 'renata', nome: 'Renata Oliveira', ini: 'RO', unidade: 'Piracicaba', numero: 'Vendas', origem: 'Google Ads', dono: 'ia', fase: 'Acompanhamento', etapa: 'Em qualificação', prev: 'Obrigada, vou pensar', h: '17:20', acomp: [['Agendado', 'Retomada automática 1 de 2', 'sáb, 07/11 às 17:20 • por modelo aprovado'], ['Agendado', 'Retomada automática 2 de 2', 'qua, 11/11 às 17:20 • por modelo aprovado']] },
    { id: 'thiago', nome: 'Thiago Lima', ini: 'TL', unidade: 'Hortolândia', numero: 'Vendas', origem: 'QR na unidade', dono: 'fila', fila: 'Vendas • Hortolândia', etapa: 'Nova', prev: 'Qual o valor pra 40 crianças?', h: '16:47', espera: ['crit', 'esperando há 3 h • prazo estourado'], unread: 1 },
    { id: 'roberto', nome: 'Roberto Alves', ini: 'RA', unidade: null, numero: 'SAC', origem: 'Desconhecida', dono: 'fila', fila: 'Atendimento geral (SAC)', etapa: null, prev: 'Comprei ingresso no site e não chegou o e-mail', h: '19:32', espera: ['warn', 'esperando há 3 min • vence em 2 min'], unread: 1, prioridade: true },
  ];
  // as outras conversas, para quem clicar na lista
  const outras = {
    beatriz: [['in', 'Oi! Vi o anúncio da festa. Como funciona?', '19:39'], ['ai', 'Oi! Eu sou a Lu, a inteligência artificial da Glow Park 💜 A festa tem salão exclusivo, buffet e o parque pra pular. É aniversário de quem?', '19:39'], ['in', 'Do meu filho, vai fazer 6', '19:40'], ['ai', 'Que legal! Pra quantas crianças vocês estão pensando?', '19:40']],
    henrique: [['in', 'Depende, qual unidade é mais barata?', '19:37'], ['ai', 'Os pacotes têm o mesmo preço em toda a rede: o Glow Festa vai de R$ 1.890 a R$ 2.490, conforme o dia. Em qual unidade fica melhor pra vocês?', '19:38', 'consultou o catálogo: Glow Festa']],
    joao: [['in', 'Oi! Quanto fica a festa pra 30 crianças no sábado 21/11?', '19:18'], ['ai', 'Oi! Eu sou a Lu, a inteligência artificial da Glow Park 💜 Pra 30 crianças no sábado, o Glow Festa Plus sai por R$ 3.290. Quer que eu chame a equipe da unidade pra montar a proposta?', '19:18', 'consultou o catálogo: Glow Festa Plus, sábado, R$ 3.290,00'], ['in', 'Pode chamar', '19:19'], ['handoff', 'Aniversário do Pedro, 30 crianças, sábado 21/11. Quer o Glow Festa Plus; perguntou de desconto.', '19:19', 'Qualificado'], ['out', 'Oi, João! Sou a Ana. Separei o Salão Will, das 14:00 às 17:00. Posso mandar a proposta?', '19:24'], ['in', 'Tem desconto pra irmãos?', '19:31']],
    camila: [['in', 'Oi, queria orçamento pra festa da Sofia, dia 28/11', '18:40'], ['out', 'Oi, Camila! Sou o Bruno. Mandei a proposta do Glow Festa, R$ 2.490, com o salão às 10:00.', '18:58'], ['in', 'Vou ver com meu marido e te falo', '19:12'], ['note', 'Retorno combinado: sexta às 9h.', '19:13']],
    fernanda: [['out', 'Fernanda, a pré-reserva do dia 15/11 vale até sábado. A cobrança do sinal já foi para o seu WhatsApp.', '18:50'], ['in', 'Perfeito, pago amanhã cedo', '18:54']],
    lucas: [['in', 'Vocês abrem no feriado?', '18:40'], ['ai', 'Oi! Eu sou a Lu, a inteligência artificial da Glow Park 💜 No feriado, Sorocaba abre das 10:00 às 20:00. É pra ingresso ou pra festa?', '18:40', 'consultou a base de conhecimento: horários de Sorocaba']],
    patricia: [['in', 'Paguei agora', '17:52'], ['out', 'A festa do Miguel está garantida 🎈', '18:02']],
    renata: [['in', 'Quanto custa a festa pra 15 crianças?', '17:10'], ['ai', 'Oi! Eu sou a Lu, a inteligência artificial da Glow Park 💜 Pra 15 crianças, o Glow Festa sai por R$ 1.890 de segunda a quinta. Qual seria a data?', '17:10', 'consultou o catálogo: Glow Festa, dias de semana'], ['in', 'Obrigada, vou pensar', '17:20']],
    thiago: [['sys', 'Cliente do grupo sem IA do piloto: o atendimento vai para a fila da unidade', '16:47'], ['in', 'Qual o valor pra 40 crianças?', '16:47']],
    roberto: [['in', 'Comprei ingresso no site e não chegou o e-mail', '19:32']],
  };

  // oportunidades abertas, nas etapas do funil, e as encerradas
  const opps = {
    cols: ['Nova', 'Em qualificação', 'Qualificada', 'Proposta', 'Negociação'],
    abertas: [
      { op: 'OP-0411', nome: 'Beatriz Santana', unidade: 'Água Fria', info: 'filho, 6 anos', dono: 'Com a IA', col: 0 },
      { op: 'OP-0410', nome: 'Henrique Matos', unidade: 'Unidade a definir', info: 'data a definir', dono: 'Com a IA', col: 0 },
      { op: 'OP-0409', nome: 'Lucas Martins', unidade: 'Sorocaba', info: 'data a definir', dono: 'Com a IA', col: 0 },
      { op: 'OP-0398', nome: 'Thiago Lima', unidade: 'Hortolândia', info: '40 crianças', dono: 'Sem dono', col: 0 },
      { op: 'OP-0405', nome: 'Renata Oliveira', unidade: 'Piracicaba', info: 'dezembro • 15 crianças', dono: 'Com a IA', col: 1, momento: 'pesquisando' },
      { op: 'OP-0371', nome: 'Gustavo Reis', unidade: 'Sorocaba', info: 'sáb, 21/11 • 40 convidados', dono: 'Carla Mendes', col: 2 },
      { op: 'OP-0390', nome: 'João Pedro Alves', unidade: 'Hortolândia', info: 'sáb, 21/11 • 55 convidados', dono: 'Ana Lima', col: 3, orc: 48190 },
      { op: 'OP-0384', nome: 'Fernanda Dias', unidade: 'Hortolândia', info: 'dom, 15/11 • 45 convidados', dono: 'Ana Lima', col: 3, orc: 48177, pre: true },
      { op: 'OP-0377', nome: 'Camila Rocha', unidade: 'Piracicaba', info: 'sáb, 28/11 • 50 convidados', dono: 'Bruno Costa', col: 4, orc: 48151 },
    ],
    encerradas: [
      { op: 'OP-0366', nome: 'Patrícia Gomes', unidade: 'Hortolândia', res: ['good', 'Ganha 05/11'] },
      { op: 'OP-0359', nome: 'Rodrigo Nunes', unidade: 'Hortolândia', res: ['good', 'Ganha 05/11'] },
      { op: 'OP-0352', nome: 'Larissa Prado', unidade: 'Interlagos', res: ['muted', 'Perdida: Data indisponível'] },
      { op: 'OP-0348', nome: 'Bruno Carvalho', unidade: 'São José dos Campos', res: ['muted', 'Perdida: Preço'] },
    ],
  };

  // agenda de festas de Hortolândia, semana de 09/11 a 15/11; salões Will e Lune.
  // estado de cada salão na janela: livre, pre (pré-reservado), res (reservado), blq (bloqueado); "mariana" muda com a etapa
  const agendaFestas = {
    unidade: 'Hortolândia',
    dias: [
      { dia: 'seg, 09/11', jan: [['18:00 às 21:00', { Will: 'livre', Lune: 'livre' }]] },
      { dia: 'ter, 10/11', jan: [['18:00 às 21:00', { Will: 'livre', Lune: 'livre' }]] },
      { dia: 'qua, 11/11', jan: [['18:00 às 21:00', { Will: 'livre', Lune: 'livre' }]] },
      { dia: 'qui, 12/11', jan: [['18:00 às 21:00', { Will: 'livre', Lune: 'livre' }]] },
      { dia: 'sex, 13/11', jan: [['18:00 às 21:00', { Will: ['res', '18:00: Festa de Bia, 10 anos (orçamento 48020), 40 convidados'], Lune: 'livre' }]] },
      { dia: 'sáb, 14/11', we: true, jan: [
        ['10:00 às 13:00', { Will: ['res', '10:00: Festa de Helena, 6 anos (orçamento 47951), 45 convidados'], Lune: 'livre' }],
        ['14:00 às 17:00', { Will: ['res', '14:00: Festa de Laura, 8 anos (orçamento 48010), 50 convidados'], Lune: 'mariana' }],
        ['18:00 às 21:00', { Will: ['res', '18:00: Festa de Gael, 7 anos (orçamento 48033), 38 convidados'], Lune: ['res', '18:00: Festa de Enzo, 11 anos (orçamento 48061), 52 convidados'] }],
      ] },
      { dia: 'dom, 15/11', we: true, jan: [
        ['10:00 às 13:00', { Will: ['res', '10:00: Festa de Theo, 9 anos (orçamento 47980), 44 convidados'], Lune: ['res', '10:00: Festa de Maitê, 4 anos (orçamento 47933), 30 convidados'] }],
        ['14:00 às 17:00', { Will: 'livre', Lune: ['pre', '14:00: pré-reserva de Fernanda Dias (OP-0384), vence sáb, 07/11'] }],
        ['18:00 às 21:00', { Will: ['blq', 'Salão Will bloqueado: manutenção'], Lune: 'livre' }],
      ] },
    ],
  };

  // painel comercial, rede, últimos 30 dias
  const painel = {
    funil: [['Oportunidades', 4740], ['Qualificadas', 1940], ['Ganhas', 480], ['Perdidas', 2150], ['Em aberto', 2110]],
    perdas: [['Sem resposta', 820], ['Preço', 610], ['Data indisponível', 390], ['Fechou em outro lugar', 210], ['Desistiu da festa', 120]],
    fds: [['sáb, 07/11', 71], ['dom, 08/11', 64], ['sáb, 14/11', 77], ['dom, 15/11', 70], ['sáb, 21/11', 58], ['dom, 22/11', 49], ['sáb, 28/11', 41], ['dom, 29/11', 33]],
    tempo: [
      ['Primeira resposta (IA ou pessoa)', '8 s', 'mediana • 90% em até 25 s • 4.740'],
      ['Quando a IA respondeu primeiro', '6 s', 'mediana • 90% em até 14 s • 2.370'],
      ['Quando uma pessoa respondeu primeiro', '3 min', 'mediana • 90% em até 12 min • 2.370'],
      ['Da passagem da IA ao vendedor', '4 min', 'mediana • 90% em até 9 min • 1.180'],
      ['Prazo de resposta cumprido', '92%', 'de 1.310'],
    ],
    ia: [
      ['Atendimentos da IA', '980', '41% resolvidos sem pessoa'],
      ['Custo por atendimento', 'US$ 0,31', ''],
      ['Custo por festa ganha', 'US$ 3,01', ''],
      ['Piloto: conversão com IA × sem IA', '10,4% × 9,9%', 'metade dos clientes novos, sorteada'],
      ['Qualidade da passagem', '91%', 'dos resumos avaliados como certos'],
      ['Passagens por motivo', 'Qualificado 61%', 'Pediu uma pessoa 18%; Negociação de preço 9%'],
    ],
    versoes: [
      ['Lu v3', ['good', 'Publicada'], 860, '42%', 498, '92%', '6 s', '10,6%', 'US$ 0,31', 'US$ 2,79'],
      ['Lu v2', ['muted', 'Anterior'], 120, '35%', 78, '86%', '7 s', '9,8%', 'US$ 0,33', 'US$ 3,40'],
    ],
    conversao: [['Lu (vendedor IA, abriu a oportunidade)', 980, 101, '10,3%'], ['Ana Lima', 148, 21, '14,2%'], ['Bruno Costa', 141, 18, '12,8%'], ['Carla Mendes', 132, 16, '12,1%'], ['Rafael Prado', 115, 12, '10,4%']],
    vendedores: [['Ana Lima', 182, 21, 65100, '2 min', '96%'], ['Bruno Costa', 171, 18, 55800, '4 min', '91%'], ['Carla Mendes', 160, 16, 49600, '3 min', '93%'], ['Rafael Prado', 149, 12, 37200, '9 min', '78%'], ['Júlia Ramos', 131, 9, 27900, '6 min', '85%']],
    unidades: [['Barra Funda', 520, 58, 179800], ['Hortolândia', 410, 47, 145700], ['Interlagos', 395, 41, 127100], ['Brooklin', 380, 38, 117800], ['Sorocaba', 350, 33, 102300]],
    jornada: { registrada: ['96%', '461 de 480 festas', 'good', 'Na meta'], desconhecida: ['4,9%', '230 de 4.740 conversas', 'good', 'Na meta'], semResposta: 1 },
    livres: [['Água Fria', 176, 61, 4, 111], ['Barra Funda', 176, 72, 6, 98], ['Brooklin', 176, 58, 3, 115], ['Hortolândia', 176, 66, 5, 105], ['Interlagos', 176, 63, 2, 111]],
  };

  // vendedores IA
  const ia = {
    versoes: [
      { v: 'v4', sit: ['info', 'Em avaliação'], aval: 'rodando agora', pub: '—', obs: 'Pergunta os convidados junto com as crianças.' },
      { v: 'v3', sit: ['good', 'Publicada'], aval: 'Aprovada, 92%', pub: '02/11 10:22', obs: 'Passa para uma pessoa antes, quando pedem desconto.' },
      { v: 'v2', sit: ['muted', 'Anterior'], aval: 'Aprovada, 88%', pub: '18/10 09:40', obs: 'Primeira versão com o catálogo de novembro.' },
      { v: 'v1', sit: ['muted', 'Anterior'], aval: '—', pub: '07/10 10:30', obs: 'Versão inicial (configuração padrão do GlowHub).' },
    ],
    aoVivo: [
      ['Beatriz Santana', 'Água Fria • Vendas', 'Apresentação', 6, 'US$ 0,21', '19:40', null],
      ['Henrique Matos', 'Unidade a definir • Vendas', 'Qualificação', 21, 'US$ 0,74', '19:38', 'Muitos turnos'],
      ['Lucas Martins', 'Sorocaba • Vendas', 'Recepção', 2, 'US$ 0,04', '18:40', null],
      ['Renata Oliveira', 'Piracicaba • Vendas', 'Acompanhamento', 4, 'US$ 0,12', '17:20', null],
    ],
    base: [
      ['Horários e endereços', 'Publicada', 'Cada unidade abre das 10:00 às 22:00; aos domingos, até as 20:00. O endereço e o link de cada unidade estão no cadastro.'],
      ['Como funciona a festa', 'Publicada', 'Recepção, tempo de pulo, buffet e parabéns no salão exclusivo. A equipe da unidade cuida de tudo no dia.'],
      ['Segurança e idade', 'Rascunho', 'Crianças a partir de 2 anos; até 6 anos, com um adulto por perto. Meias antiderrapantes obrigatórias.'],
    ],
    avaliacoes: [['05/11 14:10', 'v4', ['info', 'Rodando'], '—', '—'], ['02/11 10:05', 'v3', ['good', 'Aprovada'], '92%', '0'], ['18/10 09:20', 'v2', ['good', 'Aprovada'], '88%', '0']],
    cenarios: [
      ['Ana ainda está pesquisando', '3 mensagens', 'fase apresentação • 2 ferramentas • não deve passar • sem preço inventado • tom'],
      ['Marcos precisa de cardápio sem glúten', '1 mensagem', 'fase encaminhamento • 2 ferramentas • deve passar • sem preço inventado • tom'],
      ['Juliana quer fechar', '1 mensagem', 'fase encaminhamento • 3 ferramentas • deve passar • sem preço inventado'],
      ['Pedido de desconto', '2 mensagens', 'deve passar • sem preço inventado • tom'],
      ['Data livre ou lotada, só pela agenda', '1 mensagem', 'fase apresentação • 1 ferramenta • sem preço inventado'],
      ['Unidade que não existe', '1 mensagem', '1 ferramenta • não deve passar • sem preço inventado • tom'],
      ['Festa de adulto', '1 mensagem', 'deve passar • sem preço inventado'],
    ],
    // o teto da proposta, R$ 2.000 por mês (cerca de US$ 400), dividido por recurso
    // de 01 a 05/11: cinco dias do mês, no ritmo dos US$ 304,30 dos últimos 30 dias
    uso: [['Vendedor IA', 50.7, 320, 1710], ['Copiloto do Financeiro', 2.1, 30, 15], ['Analista de marketing', 1.6, 30, 10], ['Simulador e avaliação do vendedor IA', 1.0, 15, 70], ['Juiz da avaliação', 0.2, 5, 70]],
  };

  // configuração comercial
  const config = {
    filas: [['Vendas • rede', 'Vendas • rede', '5 minutos', '1 de 2 disponíveis', 0], ['Atendimento geral (SAC)', 'Atendimento geral (SAC)', '5 minutos', '1 de 2 disponíveis', 1]]
      .concat(units.map((u) => ['Vendas • ' + u.name, 'Vendas da unidade', '5 minutos', u.id === 'hortolandia' ? '2 de 3 disponíveis' : u.id === 'sorocaba' || u.id === 'piracicaba' ? '1 de 2 disponíveis' : '1 de 1 disponível', u.id === 'hortolandia' ? 1 : 0])),
    pacotes: [['Glow Festa', 'Toda a rede', '30 pulando, 50 convidados, 3 h', 'Seg a qui: R$ 1.890,00; sex: R$ 2.190,00; sáb e dom: R$ 2.490,00'], ['Glow Festa Plus', 'Toda a rede', '40 pulando, 70 convidados, 4 h', 'Seg a qui: R$ 2.590,00; sex: R$ 2.890,00; sáb e dom: R$ 3.290,00']],
    adicionais: [['Hora extra de pulo', 'R$ 490,00', 'por festa'], ['Mesa de doces da Glow', 'R$ 380,00', 'por festa'], ['Kit pulseira neon', 'R$ 12,00', 'por convidado']],
    regras: [['Toda a rede', '30% na reserva', 'até 2 dias antes', 'a partir de 2 anos', 'termo assinado pelos responsáveis']],
    saloes: [['Will', 'Hortolândia', 70, '3 no fim de semana; 1 por noite na semana', '15/11, 18:00 (manutenção)'], ['Lune', 'Hortolândia', 70, '3 no fim de semana; 1 por noite na semana', 'nenhum'], ['Galáxia', 'Barra Funda', 80, '3 no fim de semana; 1 por noite na semana', 'nenhum'], ['Neon', 'Barra Funda', 60, '3 no fim de semana; 1 por noite na semana', 'nenhum']],
    etiquetas: ['Irmãos na mesma festa', 'Festa de empresa', 'Cliente antigo', 'Data flexível', 'Precisa de acessibilidade', 'Indicação de cliente'],
    respostas: [['/link', 'O link da unidade, com o endereço e o mapa'], ['/sinal', 'Como o sinal funciona: PIX com o número do orçamento, sem comprovante'], ['/horarios', 'Os horários de festa do fim de semana'], ['/cardapio', 'O cardápio do buffet, com as opções sem glúten e sem lactose']],
    perdas: ['Preço', 'Data indisponível', 'Fechou em outro lugar', 'Desistiu da festa', 'Sem resposta', 'Fora do perfil', 'Duplicada', 'Outro motivo'],
    resultados: ['Resolvido', 'Retorno agendado', 'Perdido', 'Sem resposta', 'Engano ou spam'],
  };

  // clientes com contato mais recente
  const clientes = [
    ['Mariana Souza', '(19) *****-4471', 'Hortolândia', 'Alice, 7 anos', 'mariana'],
    ['Beatriz Santana', '(11) *****-5512', 'Água Fria', 'filho, 6 anos', '05/11 19:40'],
    ['Henrique Matos', '(11) *****-7781', '—', '—', '05/11 19:38'],
    ['Roberto Alves', '(11) *****-3027', '—', '—', '05/11 19:32'],
    ['João Pedro Alves', '(19) *****-2208', 'Hortolândia', 'Pedro, 9 anos', '05/11 19:31'],
    ['Camila Rocha', '(19) *****-6631', 'Piracicaba', 'Sofia, 6 anos', '05/11 19:12'],
    ['Fernanda Dias', '(19) *****-0917', 'Hortolândia', 'Lara, 5 anos', '05/11 18:54'],
    ['Lucas Martins', '(15) *****-3340', 'Sorocaba', '—', '05/11 18:40'],
    ['Patrícia Gomes', '(19) *****-7712', 'Hortolândia', 'Miguel, 8 anos', '05/11 18:02'],
    ['Renata Oliveira', '(19) *****-5089', 'Piracicaba', '—', '05/11 17:20'],
    ['Thiago Lima', '(19) *****-1146', 'Hortolândia', '—', '05/11 16:47'],
  ];

  /* ---------- Marketing, rede, últimos 30 dias (07/10 a 05/11) ---------- */
  // canais com os nomes do GlowHub; plat = conversas que a plataforma diz ter iniciado
  const mkt = {
    canais: [
      { canal: 'Meta Ads', invest: 48200, conv: 2140, plat: 2384, qual: 900, festas: 218 },
      { canal: 'Google Ads', invest: 21600, conv: 690, plat: 742, qual: 290, festas: 74 },
      { canal: 'Redes sociais', invest: 0, conv: 640, qual: 250, festas: 62 },
      { canal: 'Site', invest: 0, conv: 190, qual: 80, festas: 15 },
      { canal: 'QR na unidade', invest: 0, conv: 470, qual: 190, festas: 40 },
      { canal: 'Indicação', invest: 0, conv: 380, qual: 170, festas: 52 },
      { canal: 'Desconhecida', invest: 0, conv: 230, qual: 60, festas: 19 },
    ],
    investFestas: 64888, foraIngressosMarca: 4300, foraSemMapa: 612.34,
    unidades: [
      { u: 'Rede / sem unidade', invest: 22000, conv: 940, plat: 1024, qual: 380, festas: 84 },
      { u: 'Interlagos', invest: 14082, conv: 428, plat: 414, qual: 220, festas: 54 },
      { u: 'Barra Funda', invest: 8900, conv: 520, plat: 570, qual: 210, festas: 58 },
      { u: 'Hortolândia', invest: 7626, conv: 412, plat: 455, qual: 170, festas: 41 },
      { u: 'Brooklin', invest: 6100, conv: 380, plat: 418, qual: 150, festas: 38 },
      { u: 'Sorocaba', invest: 4200, conv: 150, plat: 166, qual: 60, festas: 17 },
      { u: 'Londrina', invest: 1980, conv: 0, plat: 58, qual: 0, festas: 0 },
    ],
    semanas: [['07/10', 11900, 5200, 112], ['14/10', 12300, 5300, 118], ['21/10', 12600, 5500, 122], ['28/10', 11400, 5600, 128]],
    precisa: [
      ['warn', '1 campanha sem assunto e unidade (nome fora da convenção)', 'R$ 612,34 da rede fora do custo por festa até serem mapeadas.', 'Mapear', 'mapeamento'],
      ['crit', 'Campanha festas_conversas_londrina_202611 gastou e não trouxe conversa vista pelo GlowHub', 'Confira se o anúncio aponta para o número oficial e se é de clique para WhatsApp.', 'Abrir', 'campanha:festas_conversas_londrina_202611'],
      ['warn', 'Anúncio "Carrossel pacotes" com 64 conversas e nenhuma festa', 'Veja o que as conversas dizem antes de aumentar a verba.', 'Abrir', 'campanha:festas_conversas_rede_202611'],
    ],
    campanhas: [
      { nome: 'festas_conversas_hortolandia_202611', conta: 'Meta Ads, Glow Park • Festas', sit: 'Ativa', assunto: 'Festas, Hortolândia', invest: 7626, conv: 412, plat: 455, qual: 170, festas: 41, mariana: true,
        anuncios: [['Turma do Glow, vídeo de 15 s', 4210, 251, 27], ['Carrossel do Salão Lune', 3416, 161, 14]] },
      { nome: 'festas_conversas_rede_202611', conta: 'Meta Ads, Glow Park • Festas', sit: 'Ativa', assunto: 'Festas, Rede', invest: 12400, conv: 640, plat: 702, qual: 250, festas: 52,
        anuncios: [['Aniversário de verão', 7100, 402, 39], ['Carrossel pacotes', 3100, 64, 0], ['Vídeo Turma do Glow', 2200, 174, 13]] },
      { nome: 'festas_conversas_barra-funda_202611', conta: 'Meta Ads, Glow Park • Festas', sit: 'Ativa', assunto: 'Festas, Barra Funda', invest: 8900, conv: 520, plat: 570, qual: 210, festas: 58, anuncios: [['Barra Funda, fim de semana', 8900, 520, 58]] },
      { nome: 'festas_conversas_brooklin_202611', conta: 'Meta Ads, Glow Park • Festas', sit: 'Ativa', assunto: 'Festas, Brooklin', invest: 6100, conv: 380, plat: 418, qual: 150, festas: 38, anuncios: [['Brooklin, aniversário', 6100, 380, 38]] },
      { nome: 'festas_conversas_londrina_202611', conta: 'Meta Ads, Glow Park • Festas', sit: 'Ativa', assunto: 'Festas, Londrina', invest: 1980, conv: 0, plat: 58, qual: 0, festas: 0, problema: true, anuncios: [['Londrina, festa no sábado', 1980, 0, 0]] },
      { nome: 'festas_conversas_interlagos_202611', conta: 'Meta Ads, Glow Park • Festas', sit: 'Ativa', assunto: 'Festas, Interlagos', invest: 7482, conv: 188, plat: 160, qual: 120, festas: 29, anuncios: [['Interlagos, festa no salão', 7482, 188, 29]] },
      { nome: 'festas_busca_rede_202611', conta: 'Google Ads, Glow Park • Google', sit: 'Ativa', assunto: 'Festas, Rede', invest: 9600, conv: 300, plat: 322, qual: 130, festas: 32, anuncios: null },
      { nome: 'festas_pmax_sorocaba_202611', conta: 'Google Ads, Glow Park • Google', sit: 'Ativa', assunto: 'Festas, Sorocaba', invest: 4200, conv: 150, plat: 166, qual: 60, festas: 17, anuncios: null },
      { nome: 'festas_pmax_interlagos_202611', conta: 'Google Ads, Glow Park • Google', sit: 'Ativa', assunto: 'Festas, Interlagos', invest: 6600, conv: 240, plat: 254, qual: 100, festas: 25 },
      { nome: 'ingressos_trafego_rede_202611', conta: 'Meta Ads, Glow Park • Festas', sit: 'Ativa', assunto: 'Ingressos, Rede', invest: 3100, conv: 0, plat: 0, qual: 0, festas: 0, anuncios: [['Ingressos de novembro', 3100, 0, 0]] },
      { nome: 'marca_busca_rede_202611', conta: 'Google Ads, Glow Park • Google', sit: 'Ativa', assunto: 'Marca, Rede', invest: 1200, conv: 0, plat: 0, qual: 0, festas: 0, anuncios: null },
      { nome: 'Campanha Dia das Crianças', conta: 'Meta Ads, Glow Park • Festas', sit: 'Pausada', assunto: null, invest: 612.34, conv: 0, plat: 21, qual: 0, festas: 0, fora: true, anuncios: [['Dia das Crianças', 612.34, 0, 0]] },
    ],
    links: [
      { nome: 'Balcão Hortolândia', cod: 'GP-H7K2', canal: 'QR na unidade', unidade: 'Hortolândia', conv: 96, opp: 31, festas: 9, utm: 'utm_source=parque, utm_medium=qr, utm_campaign=festas_qr_hortolandia_202611' },
      { nome: 'Balcão Barra Funda', cod: 'GP-ELCE', canal: 'QR na unidade', unidade: 'Barra Funda', conv: 88, opp: 29, festas: 8, utm: 'utm_source=parque, utm_medium=qr, utm_campaign=festas_qr_barra-funda_202611' },
      { nome: 'Bio do Instagram', cod: 'GP-3W5Y', canal: 'Redes sociais', unidade: 'Rede', conv: 410, opp: 140, festas: 38, utm: 'utm_source=instagram, utm_medium=organic-social, utm_campaign=festas_bio_rede_202611' },
      { nome: 'Google, festa infantil', cod: 'GP-DY3D', canal: 'Google Ads', unidade: 'Rede', conv: 120, opp: 44, festas: 11, utm: 'utm_source=google, utm_medium=cpc, utm_campaign=festas_busca_rede_202611' },
    ],
  };

  // luzes da rede: acesa = dinheiro de ontem 100% conferido
  const luzes = units.map((u) => ({ ...u, on: !['goiania', 'londrina'].includes(u.id) }));

  const cobrancas = [
    { orc: 48213, cliente: 'Mariana Souza', festa: 'Alice, 14/11', unit: 'Hortolândia', tipo: 'Sinal', valor: 987, mariana: true },
    { orc: 48177, cliente: 'Fernanda Dias', festa: 'Lara, 15/11', unit: 'Hortolândia', tipo: 'Sinal', valor: 987, status: ['warn', 'Aguardando PIX'] },
    { orc: 48102, cliente: 'Patrícia Gomes', festa: 'Miguel, 21/11', unit: 'Hortolândia', tipo: 'Sinal', valor: 987, status: ['good', 'Confirmado pelo banco'], hora: '17:57' },
    { orc: 47988, cliente: 'Rodrigo Nunes', festa: 'Sofia, 22/11', unit: 'Hortolândia', tipo: 'Sinal', valor: 807, status: ['good', 'Confirmado pelo banco'], hora: '15:21' },
    { orc: 47710, cliente: 'Carolina Pires', festa: 'Davi, 15/11', unit: 'Interlagos', tipo: 'Quitação', valor: 1883, status: ['good', 'Confirmado pelo banco'], hora: '11:08' },
  ];

  /* ---------- Financeiro: hoje é quinta, 05/11; "ontem" é quarta, 04/11 ---------- */
  // adquirente e banco por unidade são ilustrativos
  const ACQ = { 'Água Fria': 'Rede', 'Barra Funda': 'Rede', Brooklin: 'Stone', 'Catarina Outlet': 'Rede', 'Cristiano Machado': 'Stone', Goiânia: 'Stone', Hortolândia: 'Rede', Interlagos: 'Rede', Londrina: 'Stone', Piracicaba: 'Rede', 'Praia Grande': 'Rede', 'São José dos Campos': 'Rede', Sorocaba: 'Rede', Uberlândia: 'Stone' };
  const BANK = { Rede: 'Itaú', Stone: 'Santander' };
  const GERENTES = { 'Água Fria': 'Renato', 'Barra Funda': 'Priscila', Brooklin: 'Marina', 'Catarina Outlet': 'Fábio', 'Cristiano Machado': 'Helena', Goiânia: 'Wesley', Hortolândia: 'Joana', Interlagos: 'Sérgio', Londrina: 'Karina', Piracicaba: 'Rodrigo', 'Praia Grande': 'Tatiane', 'São José dos Campos': 'Eduardo', Sorocaba: 'Luana', Uberlândia: 'Ícaro' };
  const R = GP.rng(20261105);
  const ALNUM = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const idPix = (hhmm) => 'E60701190' + '20261104' + hhmm.replace(':', '') + Array.from({ length: 11 }, () => ALNUM[Math.floor(R() * ALNUM.length)]).join('');

  // a amostra navegável das vendas de ontem; a história de cada divergência está em "nota"
  const txs = [
    { id: 'P4-482113', h: '14:32', unit: 'Barra Funda', canal: 'Ingressos', pdv: 'P4Play', op: 'Carla', valor: 229.8, forma: 'PIX', erp: 'ok', rec: 'ok', itens: '2 ingressos de 1 hora, fim de semana, e 2 pares de meia' },
    { id: 'P4-482167', h: '16:05', unit: 'Barra Funda', canal: 'Ingressos', pdv: 'P4Play', op: 'Diego', valor: 179.8, cobrado: 149.8, forma: 'PIX', erp: 'ok', rec: 'diff', itens: '2 ingressos de 1 hora e 1 par de meia incluído com o QR Code já aberto', nota: 'A venda foi editada com o QR Code aberto, e o PIX cobrou o valor antigo.' },
    { id: 'IM-470812', h: '11:46', unit: 'Interlagos', canal: 'Lanchonete', pdv: 'IMobile', op: 'Letícia', valor: 42.5, forma: 'Débito', erp: 'retry', rec: 'ok', nota: 'O ERPFLEX não respondeu a tempo; reenviada sozinha às 11:47.' },
    { id: 'P4-482201', h: '15:01', unit: 'Sorocaba', canal: 'Ingressos', pdv: 'P4Play', op: 'Júlio', valor: 169.8, forma: 'Crédito', erp: 'retry', rec: 'ok', nota: 'O ERPFLEX não respondeu a tempo; reenviada sozinha às 15:02.' },
    { id: 'P4-482244', h: '17:20', unit: 'Goiânia', canal: 'Ingressos', pdv: 'P4Play', op: 'Caio', valor: 254.7, forma: 'PIX', erp: 'pending', rec: 'ok', nota: 'O reenvio foi recusado pelo ERPFLEX: o produto não tem cadastro.' },
    { id: 'IM-470877', h: '13:12', unit: 'Londrina', canal: 'Lanchonete', pdv: 'IMobile', op: 'Aline', valor: 31, forma: 'Crédito', erp: 'ok', rec: 'missing', nota: 'A venda está no PDV, mas não há transação na Stone: pode ser uma maquininha fora do sistema.' },
    { id: 'TX-402271', h: '18:44', unit: 'Catarina Outlet', canal: 'Ingressos', pdv: 'Maquininha', op: 'sem operador', valor: 120, forma: 'Crédito', erp: 'none', rec: 'pos', nota: 'Passaram R$ 120,00 na maquininha sem venda no PDV: falta registrar a venda.' },
    { id: 'GP-118204', h: '10:08', unit: 'Brooklin', canal: 'Site', pdv: 'Site', op: 'compra no site', valor: 339.6, forma: 'Crédito', erp: 'ok', rec: 'weak', nota: 'A autorização voltou sem o CV; a venda foi conferida pelo número do pedido no extrato eletrônico da Getnet.' },
    { id: 'P4-482318', h: '17:52', unit: 'Hortolândia', canal: 'Ingressos', pdv: 'P4Play', op: 'Vitor', valor: 240, forma: 'PIX', erp: 'ok', rec: 'ok' },
    { id: 'P4-482335', h: '18:10', unit: 'Interlagos', canal: 'Ingressos', pdv: 'P4Play', op: 'Marcos', valor: 105, forma: 'Crédito', erp: 'ok', rec: 'ok' },
    { id: 'IM-470902', h: '18:31', unit: 'Água Fria', canal: 'Lanchonete', pdv: 'IMobile', op: 'Sabrina', valor: 24, forma: 'PIX', erp: 'ok', rec: 'ok' },
    { id: 'P4-482351', h: '19:02', unit: 'São José dos Campos', canal: 'Ingressos', pdv: 'P4Play', op: 'Pedro', valor: 84.9, forma: 'Débito', erp: 'ok', rec: 'ok' },
    { id: 'GP-118221', h: '19:40', unit: 'Praia Grande', canal: 'Site', pdv: 'Site', op: 'compra no site', valor: 169.8, forma: 'Crédito', erp: 'ok', rec: 'weak', nota: 'A autorização voltou sem o CV; a venda foi conferida pelo número do pedido no extrato eletrônico da Getnet.' },
    { id: 'P4-482377', h: '20:15', unit: 'Piracicaba', canal: 'Ingressos', pdv: 'P4Play', op: 'Bianca', valor: 149.8, forma: 'PIX', erp: 'ok', rec: 'ok' },
  ].sort((a, b) => a.h.localeCompare(b.h));
  txs.forEach((t) => {
    t.key = t.forma === 'PIX' ? ['ID PIX', idPix(t.h)] : t.canal === 'Site' ? ['Pedido', t.id] : ['NSU', String(400000 + Math.floor(R() * 599999))];
  });

  // agenda de recebíveis: dias úteis dos próximos 30 dias (20/11 é feriado); a segunda recebe o fim de semana
  const agenda = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date(2026, 10, 5 + i);
    const dow = d.getDay(), dm = d.getDate(), mo = d.getMonth();
    if (dow === 0 || dow === 6 || (mo === 10 && dm === 20)) continue;
    const f = dow === 1 ? 1.9 : dow === 2 ? 1.25 : 1;
    agenda.push({
      d, label: GP.date.WD[dow] + ' ' + GP.fmt.ddmm(d),
      Rede: Math.round(52000 * f * (0.85 + R() * 0.3)),
      Stone: Math.round(34000 * f * (0.85 + R() * 0.3)),
      Getnet: Math.round(5200 * (0.8 + R() * 0.4)),
    });
  }
  // agendado pela adquirente × creditado no banco, nos últimos dias úteis (02/11, Finados, sem expediente)
  const banco = [];
  [['sex 30/10'], ['ter 03/11'], ['qua 04/11']].forEach(([dia]) => {
    [['Rede', 52000, 'Itaú 0912-7'], ['Stone', 34000, 'Santander 3301-2'], ['Getnet', 5200, 'Itaú 0912-7']].forEach(([acq, base, conta]) => {
      const ag = Math.round(base * (0.8 + R() * 0.4) * 100) / 100;
      banco.push({ dia, acq, conta, agendado: ag, creditado: ag });
    });
  });
  const curto = banco.find((b) => b.dia === 'qua 04/11' && b.acq === 'Stone');
  curto.creditado = Math.round((curto.agendado - 3411.8) * 100) / 100;

  // caixa de 13 semanas, saldo no fim de cada semana (ilustrativo): 13º salário e folha apertam dezembro
  const caixa = [
    ['02/11', 1180000], ['09/11', 1105000], ['16/11', 1140000], ['23/11', 1395000], ['30/11', 610000],
    ['07/12', 455000], ['14/12', 690000], ['21/12', 412000], ['28/12', 905000], ['04/01', 840000],
    ['11/01', 1020000], ['18/01', 1310000], ['25/01', 1255000],
  ].map(([ini, saldo]) => ({ ini, saldo }));

  const fin = {
    hoje: 'quinta, 05/11', ontem: 'quarta, 04/11', ACQ, BANK, GERENTES,
    canais: [['Ingressos', 84210], ['Festas', 22640], ['Lanchonete', 6180], ['Site', 5430]],
    vendas: { total: 1191, ingressos: 1012, lanchonete: 145, site: 34, falhouPrimeira: 95, reenviadasOk: 91, comEquipe: 4, conciliadas: 1176, baixadas: 1168 },
    falhas: [['P4Play, ingressos', 81, '8,0% de 1.012 vendas'], ['IMobile, lanchonete', 12, '8,3% de 145 vendas'], ['Site', 2, '5,9% de 34 pedidos']],
    txs, agenda, banco, caixa,
    baixas: [
      { acq: 'Rede', parcelas: 1284, valor: 118412.37, baixadas: 1281, menor: 3 },
      { acq: 'Stone', parcelas: 902, valor: 81233.9, baixadas: 901, menor: 1 },
      { acq: 'Getnet', parcelas: 118, valor: 17930.2, baixadas: 118, menor: 0 },
    ],
    pagasMenor: [
      ['Rede', 'P4-471882', '2 de 3', 56.6, 54.21], ['Rede', 'P4-472014', '1 de 2', 60, 57.6],
      ['Rede', 'IM-470118', '1 de 1', 38.9, 36.4], ['Stone', 'P4-469907', '3 de 3', 40, 38.8],
    ],
    debitos: [
      { tipo: 'Estorno', acq: 'Rede', unit: 'Barra Funda', valor: 169.8, ok: true, status: 'Confere', det: 'com a devolução DEV-917', acao: 'Contas a receber cancelado no ERPFLEX' },
      { tipo: 'Estorno', acq: 'Getnet', unit: 'Brooklin', valor: 339.6, ok: false, status: 'Estorno em dobro', det: 'só há uma devolução aprovada', acao: 'Contestação pronta para cobrar R$ 339,60 da Getnet' },
      { tipo: 'Chargeback', acq: 'Stone', unit: 'Goiânia', valor: 254.7, ok: false, status: 'Contestação', det: 'do portador, venda de 02/10', acao: 'Defesa enviada; tratamento contábil a decidir' },
      { tipo: 'Chargeback', acq: 'Rede', unit: 'Interlagos', valor: 84.9, ok: false, status: 'Contestação', det: 'do portador, venda de 11/10', acao: 'Defesa enviada; tratamento contábil a decidir' },
      { tipo: 'Outro débito', acq: 'Stone', unit: 'Londrina', valor: 89.9, ok: true, status: 'Confere', det: 'aluguel de maquininha', acao: 'Listado para o financeiro' },
      { tipo: 'Estorno', acq: 'Rede', unit: 'São José dos Campos', valor: 120, ok: true, status: 'Confere', det: 'com a devolução DEV-921', acao: 'Contas a receber cancelado no ERPFLEX' },
    ],
    festas: { adiantamentos: 412380, pixHoje: 23, proximos7: 118, semBaixa: { orc: 47655, festa: 'Festa do Bento, 4 anos', unit: 'Brooklin', dia: 'domingo, 01/11', valor: 2007 } },
    site: {
      saldo: 214380, pedidos: 1152, vendidos: [34, 6118.4], usados: [29, 5237.9],
      aging: [['0 a 7 dias', 98120], ['8 a 30 dias', 71340], ['31 a 90 dias', 32960], ['91 a 180 dias', 9580], ['Mais de 180 dias', 2380]],
    },
    // status-base de cada pedido; o lote do dia muda a coluna de quem está nele
    devs: [
      { id: 'DEV-931', cliente: 'Ana Paula Ribeiro', unit: 'Barra Funda', motivo: 'Compra em duplicidade no site', canal: 'Site', forma: 'Estorno no cartão, Getnet', valor: 169.8, st: 'lote', pre: true, venda: 'GP-117980', hora: '15:12' },
      { id: 'DEV-932', cliente: 'Gabriel Nunes', unit: 'Interlagos', motivo: 'Ingresso não utilizado', canal: 'Caixa', forma: 'Estorno no cartão, Rede', valor: 84.9, st: 'nova', venda: 'P4-481902', hora: '16:40' },
      { id: 'DEV-933', cliente: 'Larissa Costa', unit: 'Goiânia', motivo: 'Desistência de festa', canal: 'Festa', forma: 'PIX para o cliente, Santander', valor: 750.2, st: 'nova', venda: 'Orçamento 47702', hora: '17:05' },
      { id: 'DEV-934', cliente: 'Felipe Andrade', unit: 'Sorocaba', motivo: 'Ingresso não utilizado', canal: 'Caixa', forma: 'Estorno no cartão, Rede', valor: 120, st: 'validacao', venda: 'P4-480127', hora: '10:22', dup: 'A mesma venda já foi devolvida em 22/10 (DEV-719)' },
      { id: 'DEV-935', cliente: 'Beatriz Santana', unit: 'Água Fria', motivo: 'Meia sem tamanho na unidade', canal: 'Caixa', forma: 'Estorno no cartão, Rede', valor: 30, st: 'lote', pre: true, venda: 'P4-481833', hora: '11:48' },
      { id: 'DEV-936', cliente: 'Rodrigo Pires', unit: 'Uberlândia', motivo: 'Cobrança em duplicidade no caixa', canal: 'Caixa', forma: 'Estorno no cartão, Stone', valor: 105, st: 'lote', venda: 'P4-481790', hora: '12:15' },
      { id: 'DEV-937', cliente: 'Vanessa Lopes', unit: 'Praia Grande', motivo: 'Compra em duplicidade no site', canal: 'Site', forma: 'Estorno no cartão, Getnet', valor: 229.8, st: 'lote', pre: true, venda: 'GP-118012', hora: '13:02' },
      { id: 'DEV-938', cliente: 'Lucas Teixeira', unit: 'Londrina', motivo: 'Desistência de festa', canal: 'Festa', forma: 'PIX para o cliente, Santander', valor: 550.2, st: 'lote', venda: 'Orçamento 47588', hora: '09:40' },
      { id: 'DEV-939', cliente: 'Carolina Dias', unit: 'Brooklin', motivo: 'Ingresso não utilizado', canal: 'Caixa', forma: 'Estorno no cartão, Stone', valor: 74.9, st: 'lote', venda: 'P4-481455', hora: '14:26' },
      { id: 'DEV-940', cliente: 'Henrique Matos', unit: 'Piracicaba', motivo: 'Compra em duplicidade no site', canal: 'Site', forma: 'Estorno no cartão, Getnet', valor: 140, st: 'lote', pre: true, venda: 'GP-118099', hora: '15:51' },
      { id: 'DEV-927', cliente: 'Isabela Freitas', unit: 'Sorocaba', motivo: 'Ingresso não utilizado', canal: 'Caixa', forma: 'Estorno no cartão, Rede', valor: 105, st: 'aprovada', venda: 'P4-480988', hora: 'ontem' },
      { id: 'DEV-921', cliente: 'Murilo Campos', unit: 'São José dos Campos', motivo: 'Ingresso não utilizado', canal: 'Caixa', forma: 'Estorno no cartão, Rede', valor: 120, st: 'efetivada', venda: 'P4-480514', hora: 'ontem' },
      { id: 'DEV-917', cliente: 'Natália Borges', unit: 'Barra Funda', motivo: 'Cobrança em duplicidade no caixa', canal: 'Caixa', forma: 'Estorno no cartão, Rede', valor: 169.8, st: 'efetivada', venda: 'P4-480402', hora: 'ontem' },
      { id: 'DEV-915', cliente: 'Otávio Reis', unit: 'Hortolândia', motivo: 'Desistência de festa', canal: 'Festa', forma: 'PIX para o cliente, Itaú', valor: 650.2, st: 'efetivada', venda: 'Orçamento 47390', hora: 'ontem' },
    ],
    devMotivos: [['Compra em duplicidade no site', 118], ['Ingresso não utilizado', 97], ['Desistência de festa', 64], ['Meia sem tamanho na unidade', 51], ['Cobrança em duplicidade no caixa', 30]],
    tratativas: [
      { id: 'T-2216', tipo: 'Venda fora do ERPFLEX', desc: 'Produto sem cadastro: o reenvio foi recusado', unit: 'Goiânia', valor: 254.7, dono: 'Bruna, financeiro', prazo: 'hoje, 16h', sla: 0.2, status: 'Cadastro pendente', go: ['vendas', 'P4-482244'] },
      { id: 'T-2211', tipo: 'Crédito a menor', desc: 'A Stone creditou R$ 3.411,80 a menos que o agendado', unit: 'Goiânia', valor: 3411.8, dono: 'Bruna, financeiro', prazo: 'hoje, 18h', sla: 0.35, status: 'Em cobrança', go: ['recebiveis', 'banco'] },
      { id: 'T-2218', tipo: 'Adiantamento sem baixa', desc: 'Festa do Bento (orçamento 47655) realizada e sem baixa', unit: 'Brooklin', valor: 2007, dono: 'Gerente Marina', prazo: 'hoje, 18h', sla: 0.4, status: 'Alerta enviado', go: ['festas'] },
      { id: 'T-2221', tipo: 'Venda sem transação', desc: 'R$ 31,00 na lanchonete sem transação na Stone', unit: 'Londrina', valor: 31, dono: 'Gerente Karina', prazo: 'amanhã, 12h', sla: 0.6, status: 'Aguardando gerente', go: ['vendas', 'IM-470877'] },
      { id: 'T-2214', tipo: 'Venda cobrada a menos', desc: 'PIX de R$ 149,80 para venda de R$ 179,80, operador Diego', unit: 'Barra Funda', valor: 30, dono: 'Gerente Priscila', prazo: 'amanhã, 12h', sla: 0.7, status: 'Aguardando gerente', go: ['vendas', 'P4-482167'] },
      { id: 'T-2219', tipo: 'Transação sem venda', desc: 'R$ 120,00 na maquininha sem venda no PDV', unit: 'Catarina Outlet', valor: 120, dono: 'Gerente Fábio', prazo: 'amanhã, 12h', sla: 0.75, status: 'Aguardando registro', go: ['vendas', 'TX-402271'] },
      { id: 'T-2215', tipo: 'Estorno em duplicidade', desc: 'A Getnet estornou duas vezes a mesma venda do site', unit: 'Brooklin', valor: 339.6, dono: 'Bruna, financeiro', prazo: 'sexta, 18h', sla: 0.85, status: 'Contestação aberta', go: ['recebiveis', 'debitos'] },
      { id: 'T-2220', tipo: 'Chargeback', desc: 'Contestação do portador, venda de 02/10', unit: 'Goiânia', valor: 254.7, dono: 'Bruna, financeiro', prazo: 'sexta, 18h', sla: 0.9, status: 'Decidir tratamento', go: ['recebiveis', 'debitos'] },
    ],
    // taxas ilustrativas: contrato × cobrado no mês
    taxas: [
      { acq: 'Rede', mod: 'Débito', contratada: 0.0095, cobrada: 0.0095, volume: 412000 },
      { acq: 'Rede', mod: 'Crédito à vista', contratada: 0.0185, cobrada: 0.0185, volume: 986000 },
      { acq: 'Rede', mod: 'Crédito de 2 a 6 vezes', contratada: 0.0235, cobrada: 0.0249, volume: 294500 },
      { acq: 'Stone', mod: 'Débito', contratada: 0.0089, cobrada: 0.0089, volume: 268000 },
      { acq: 'Stone', mod: 'Crédito à vista', contratada: 0.0179, cobrada: 0.0199, volume: 592300 },
      { acq: 'Getnet', mod: 'Crédito, site', contratada: 0.0249, cobrada: 0.0249, volume: 171000 },
    ],
  };

  GP.data = { units, familia, conversa, inbox, outras, opps, agendaFestas, painel, ia, config, clientes, mkt, luzes, cobrancas, fin };
})();
