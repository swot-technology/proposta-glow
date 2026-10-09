/* Gerado de calc.js e bench.js (a mesma fonte da proposta em .docx). Não edite à mão. */
window.GP = window.GP || {};
GP.N = {
 "geradoEm": "07/10/2026",
 "validadeDias": 30,
 "validadeAte": "06/11/2026",
 "implantacao": {
  "financeiro": 96300,
  "comercial": 232500,
  "marketing": 0,
  "marketingReferencia": 70000,
  "total": 328800
 },
 "parcelas": [
  {
   "pct": 0.25,
   "quando": "Na assinatura",
   "marco": "início da etapa zero",
   "valor": 82200
  },
  {
   "pct": 0.25,
   "quando": "Semana 4",
   "marco": "GlowHub no ar na AWS e Financeiro conciliando com dados reais, em paralelo",
   "valor": 82200
  },
  {
   "pct": 0.25,
   "quando": "Semana 8",
   "marco": "Financeiro em produção e WhatsApp oficial no GlowHub",
   "valor": 82200
  },
  {
   "pct": 0.25,
   "quando": "Semana 12",
   "marco": "go-live nas 14 unidades, com o piloto do vendedor IA rodando",
   "valor": 82200
  }
 ],
 "mensal": {
  "sustentacao": 5000,
  "horasIncluidas": 0,
  "hospedagem": 2500,
  "hospedagemCompleta": 1000,
  "unidadesIncluidas": 15,
  "unidadeExtra": 350
 },
 "anterior": {
  "implantacao": 100000,
  "sustentacao": 8000,
  "operacao": 15000,
  "semanas": 10
 },
 "semanas": 12,
 "ipca12m": 0.0422,
 "dolar": 5,
 "claude": {
  "tetoBRL": 2000,
  "atendimentosNoTeto": {
   "min": 800,
   "max": 1200
  }
 },
 "meta": 3000,
 "hoje": {
  "takeBlip": {
   "min": 8000,
   "max": 14000
  },
  "jetSales": 2300,
  "p4play": 1000,
  "erpflex": 10000,
  "scale": {
   "investido": 60000,
   "servidor": 800
  },
  "mensalMin": 22100,
  "mensalMax": 28100
 },
 "econ": {
  "min": 10300,
  "max": 16300,
  "anoMin": 123600,
  "anoMax": 195600,
  "mesesAte36": 32,
  "total36Min": 329600,
  "total36Max": 521600
 },
 "novoMes": 12500,
 "mes": {
  "fixo": 9500,
  "meta": 3000,
  "difMin": -3800,
  "difMax": 2200
 },
 "festa": {
  "ticket": 3100,
  "porMes": 480,
  "conversao": 0.1,
  "oportunidadesMes": 4800
 },
 "paga": {
  "custoMes36": 17869.444444444445,
  "liquidoMesMin": 6047.222222222224,
  "liquidoMesMax": 11380.555555555558,
  "festasSemEcon": 5.764336917562725,
  "festasMin": 1.950716845878137,
  "festasMax": 3.6711469534050187,
  "pctMax": 0.007648222819593789,
  "pontosMax": 0.0007648222819593789
 },
 "tco36": 643300,
 "cenarios": [
  {
   "pp": 0.0025,
   "festas": 12,
   "receita": 37200,
   "ganhoMes": 38000,
   "payback": 8.652631578947368
  },
  {
   "pp": 0.005,
   "festas": 24,
   "receita": 74400,
   "ganhoMes": 75200,
   "payback": 4.372340425531915
  },
  {
   "pp": 0.01,
   "festas": 48,
   "receita": 148800,
   "ganhoMes": 149600,
   "payback": 2.197860962566845
  }
 ],
 "bench": {
  "pf": {
   "glowhub": 187.88571428571427,
   "min": 450,
   "max": 712,
   "tipico": 570,
   "descontoMin": 0.5824761904761905,
   "descontoTipico": 0.6703759398496241
  },
  "pfQtd": 1750,
  "pfTabela": [
   {
    "ref": "__GlowHub (esta proposta)__",
    "preco": "__R$ 188__",
    "total": "__R$ 0,33 mi__"
   },
   {
    "ref": "TRE-MT, pesquisa de preços de fábrica de software (2025)",
    "preco": "R$ 450 a 712",
    "total": "R$ 0,79 mi a R$ 1,25 mi"
   },
   {
    "ref": "TJAC, contrato com a Indra (2025)",
    "preco": "R$ 573,96",
    "total": "R$ 1,00 mi"
   },
   {
    "ref": "CDTN, contrato com a Case (2025)",
    "preco": "R$ 669,64",
    "total": "R$ 1,17 mi"
   },
   {
    "ref": "Governo federal, teto do pregão CodificaGov (2024 e 2025)",
    "preco": "R$ 1.266,45",
    "total": "R$ 2,22 mi"
   }
  ],
  "pfNota": "Os preços públicos já incluem documentação, garantia e os custos indiretos do fornecedor, como o preço do GlowHub. O CodificaGov é o teto aceito no pregão federal de 21 órgãos; os outros são preços contratados. Nenhuma software house publica preço por ponto de função no mercado privado.",
  "casaNum": {
   "low": 997500,
   "high": 2625000,
   "manut": {
    "low": 0.15,
    "high": 0.2
   }
  },
  "casa": [
   {
    "metodo": "Pontos de função",
    "premissa": "1.750 PF a R$ 450 a R$ 712 por PF, faixa dos contratos públicos de fábrica de software de 2025 e 2026 (típico, R$ 570)",
    "valor": "R$ 0,8 mi a R$ 1,2 mi"
   },
   {
    "metodo": "Horas",
    "premissa": "17.500 horas (10 horas por ponto, o índice de referência do governo federal) a R$ 150 a R$ 250 por hora, faixa de software house e de sênior PJ em 2026",
    "valor": "R$ 2,6 mi a R$ 4,4 mi"
   },
   {
    "metodo": "Só o vendedor IA",
    "premissa": "agente de IA no WhatsApp com integração a CRM, agenda e pagamento, em projeto à parte: uma peça do Comercial",
    "valor": "R$ 15 a 60 mil"
   }
  ],
  "tco": {
   "basico": 679624,
   "corporativo": 3851224,
   "glowhub": 643300,
   "casaLow": 1353212.5,
   "casaHigh": 3384200
  },
  "tcoTabela": [
   {
    "caminho": "Ferramentas prontas, nível básico",
    "conta": "R$ 18 mil por mês e cerca de R$ 25 mil de implantação. Não ligam a festa ao banco, não baixam recebíveis no ERPFLEX e mantêm a jornada em cinco sistemas",
    "total": "R$ 0,68 mi"
   },
   {
    "caminho": "GlowHub, com a Sustentação",
    "conta": "R$ 328,8 mil de implantação, com o Marketing de brinde; R$ 5 mil de sustentação e R$ 2,5 mil de hospedagem por mês; o Claude pago direto (teto de R$ 2 mil por mês)",
    "total": "R$ 0,64 mi",
    "destaque": true
   },
   {
    "caminho": "Software house tradicional",
    "conta": "R$ 1,0 mi a R$ 2,6 mi de desenvolvimento em 14 a 20 meses, e só então o uso começa; manutenção de 15% a 20% ao ano, AWS e Claude depois da entrega",
    "total": "R$ 1,4 mi a R$ 3,4 mi"
   },
   {
    "caminho": "Ferramentas prontas, nível corporativo",
    "conta": "R$ 105 mil por mês (HubSpot, agente de IA por conversa, CenterEdge) e cerca de R$ 70 mil de implantação",
    "total": "R$ 3,85 mi"
   }
  ],
  "grafico": {
   "rows": [
    {
     "name": "Ferramentas prontas, nível básico",
     "low": 679624,
     "valueText": "R$ 0,68 mi"
    },
    {
     "name": "GlowHub, com a Sustentação",
     "low": 643300,
     "valueText": "R$ 0,64 mi",
     "bold": true,
     "highlight": true
    },
    {
     "name": "Software house tradicional",
     "low": 1353212.5,
     "high": 3384200,
     "valueText": "R$ 1,4 mi a R$ 3,4 mi"
    },
    {
     "name": "Ferramentas prontas, nível corporativo",
     "low": 3851224,
     "valueText": "R$ 3,85 mi"
    }
   ],
   "max": 4500000
  },
  "saas": [
   {
    "necessidade": "Atendimento no WhatsApp e CRM, 40 usuários",
    "exemplos": "Kommo Advanced (US$ 35 por usuário) até HubSpot Sales Hub e Service Hub Professional (US$ 90 + US$ 90 por usuário); Zenvia, Octadesk e RD Station no meio",
    "low": 7000,
    "high": 36000
   },
   {
    "necessidade": "Agente de IA, cerca de 3 mil conversas por mês",
    "exemplos": "HubSpot Customer Agent (US$ 0,50 por conversa resolvida), Intercom Fin (US$ 0,99), Zendesk (R$ 9,50 a 12) e Salesforce Agentforce (US$ 2)",
    "low": 7500,
    "high": 30000
   },
   {
    "necessidade": "Reservas e agenda de festas, 14 parques",
    "exemplos": "Festero (R$ 299, feito para buffets) até CenterEdge (US$ 300 por parque); Rex e Bookeo no meio",
    "low": 299,
    "high": 21000
   },
   {
    "necessidade": "Conciliação de cartões, PIX e bancos, 14 CNPJs",
    "exemplos": "Conciliadora Completo (R$ 199 por CNPJ) e Premium (R$ 319); Equals e Kamino sob consulta",
    "low": 2786,
    "high": 4466
   },
   {
    "necessidade": "Atribuição e relatórios de mídia",
    "exemplos": "Tintim (R$ 197 por número), Stape e Reportei até Ruler Analytics Advanced (US$ 2.000) com Tintim em cada unidade",
    "low": 599,
    "high": 13568
   }
  ],
  "saasLow": 18184,
  "saasHigh": 105034,
  "saasTotal": "R$ 18 mil a R$ 105 mil",
  "prazo": {
   "sisp": 18.398602600351403,
   "jones": 19.825092369769365,
   "glowhub": 2.761795166858458,
   "sispMin": 13.798951950263552,
   "vezesMin": 4.996370518657928,
   "vezesMax": 7.178335528887325
  },
  "prazos": [
   {
    "caminho": "GlowHub",
    "prazo": "12 semanas",
    "base": "≈ 2,8 meses até o go-live nas 14 unidades; Financeiro e WhatsApp oficial em produção na semana 8",
    "highlight": true
   },
   {
    "caminho": "Software house, do zero",
    "prazo": "14 a 20 meses",
    "base": "índice do governo federal (SISP): 17,5 mil horas e prazo de 18,4 meses, ou 13,8 meses no limite de compressão; regra de Capers Jones: 19,8 meses, com 12 pessoas"
   },
   {
    "caminho": "Software houses, pelo que anunciam",
    "prazo": "6 a 12 meses ou mais",
    "base": "plataforma com integrações, papéis e segurança (ilink, 2026); de 3 meses a 1 ano no ágil, de 6 meses a 2 anos em cascata (oHub)"
   },
   {
    "caminho": "ERP pronto, só para implantar",
    "prazo": "9 meses",
    "base": "mediana de 2025 e 2026, sem desenvolver nada; cerca de 1 em cada 4 projetos atrasa (Panorama, ERP Report 2026)"
   },
   {
    "caminho": "Ferramentas prontas, cada uma",
    "prazo": "4 semanas a 3 meses",
    "base": "HubSpot Professional: 60 dias de onboarding; ROLLER: 4 semanas; atribuição: 30 a 90 dias até o dado ficar confiável. E as cinco continuam sem conversar"
   }
  ],
  "prazoGrafico": {
   "max": 24,
   "rows": [
    {
     "name": "GlowHub",
     "low": 2.761795166858458,
     "valueText": "12 semanas",
     "bold": true,
     "highlight": true
    },
    {
     "name": "ERP pronto, só a implantação",
     "low": 9,
     "valueText": "9 meses"
    },
    {
     "name": "Software house, do zero",
     "low": 13.798951950263552,
     "high": 19.825092369769365,
     "valueText": "14 a 20 meses"
    }
   ]
  },
  "porqueRapido": [
   "**Por que o GlowHub chega antes.** Ele não começa do zero: a base dos três módulos já roda em demonstração, com cerca de 1.500 testes automatizados. As 12 semanas são para ligar os sistemas reais, colocar o GlowHub no ar na AWS em São Paulo, virar o WhatsApp, rodar o piloto da IA e treinar as unidades.",
   "A engenharia usa o Claude em todo o ciclo, com teste automático e revisão. O próprio roteiro do governo (SISP 3.0, 2026) reconhece que a IA muda a produtividade dos times. E cada integração tem plano B por arquivo: se a API de um fornecedor atrasar, o prazo não muda.",
   "Só 31% dos projetos de TI terminam no prazo, no custo e com o escopo combinado (Standish Group, CHAOS 2020). Por isso o pagamento da Glow Park segue os marcos de entrega."
  ],
  "velocidade": "Um estudo publicado na Harvard Business Review auditou 2.241 empresas. Quem tentou contato em até uma hora teve quase 7 vezes mais chance de qualificar o cliente do que quem tentou uma hora depois, e mais de 60 vezes mais do que quem esperou 24 horas (Oldroyd, McElheran e Elkington, 2011). No Brasil, 25% das mensagens de venda pelo WhatsApp chegam fora do horário comercial, e os agentes de IA converteram tanto quanto o atendimento humano (OmniChat, Chat Commerce Report 2026).",
  "econ": {
   "implantacao": 668700,
   "implantacaoPct": 0.6703759398496241,
   "marketing": 70000,
   "sustMes": {
    "min": 7555.375,
    "max": 14531.166666666668
   },
   "ferramentasAno": {
    "min": 123600,
    "max": 195600
   },
   "corporativo3": 3207924,
   "casa3": {
    "min": 709912.5,
    "max": 2740900
   },
   "mesesAntes": {
    "min": 11.037156783405095,
    "max": 17.063297202910906
   },
   "sustAno": {
    "min": 90664.5,
    "max": 174374
   },
   "antecipacao": {
    "min": 821164.464685339,
    "max": 1269509.3118965714
   },
   "equipePropria": 1680000
  },
  "sustMercado": {
   "min": 12555.375,
   "max": 19531.166666666668
  },
  "sustTexto": "O mercado cobra de 15% a 20% do valor do sistema por ano para mantê-lo. Para um sistema de 1.750 pontos de função (R$ 1,00 mi a R$ 1,17 mi a preço de contrato público), isso dá R$ 13 a 20 mil por mês. A sustentação do GlowHub custa R$ 5 mil por mês, e as evoluções são orçadas por entrega.",
  "precoMercadoImpl": 997500,
  "economiaLinhas": [
   [
    "Implantação: 1.750 pontos de função",
    "R$ 1,00 mi (R$ 570 por ponto, típico dos contratos públicos)",
    "R$ 188 por ponto",
    "R$ 669 mil (67%)"
   ],
   [
    "Módulo de Marketing",
    "R$ 70 mil",
    "R$ 0, de brinde",
    "R$ 70 mil"
   ],
   [
    "Sustentação: 15% a 20% do valor do sistema ao ano",
    "R$ 13 a 20 mil por mês",
    "?",
    "R$ 91 a 174 mil por ano"
   ],
   [
    "Atendimento no WhatsApp: Take Blip e JetSales",
    "R$ 10 a 16 mil por mês, pagos hoje",
    "desligados na virada",
    "R$ 124 a 196 mil por ano"
   ],
   [
    "3 anos: ferramentas prontas corporativas",
    "R$ 3,85 mi",
    "?",
    "R$ 3,21 mi"
   ],
   [
    "3 anos: software house tradicional",
    "R$ 1,4 mi a R$ 3,4 mi",
    "?",
    "R$ 0,7 mi a R$ 2,7 mi"
   ],
   [
    "Prazo até operar",
    "14 a 20 meses",
    "12 semanas",
    "11 a 17 meses antes"
   ]
  ],
  "fontes": [
   "Atendimento e CRM: páginas de preço da Kommo, RD Station, Octadesk, Zenvia, HubSpot e Salesforce, consultadas em 07/10/2026.",
   "Agentes de IA: Intercom, Zendesk Brasil e Salesforce Agentforce (páginas oficiais, 07/10/2026). HubSpot Customer Agent: resolve247.ai, maio de 2026.",
   "Festas e reservas: Festero e Bookeo (páginas oficiais); CenterEdge e Rex, pelo blog da Rex (28/08/2026).",
   "Conciliação: conciliadora.com.br/planos. BPO financeiro: Levits (planos) e Creis (guia de preços, 2025).",
   "Mídia: Tintim, Stape, Wicked Reports, Ruler Analytics e Northbeam (páginas oficiais); Reportei, pelo Capterra.",
   "Ponto de função: TJAC, contrato 110/2024, aditivo de 2025 (R$ 573,96 por PF); TRE-MT, pesquisa de preços de 2025 (R$ 450,12 a 711,73); CDTN, contrato 11/2024 (R$ 669,64); Ministério da Gestão, pregão SRP 08/2023 (CodificaGov), teto de R$ 1.266,45 por PF nas atas de 2024 e 2025.",
   "Agente de IA no WhatsApp: SystemForge, abril de 2026 (R$ 15 a 60 mil por projeto, em 3 a 8 semanas). Sustentação: FWC Tecnologia, junho de 2026 (15% a 20% do valor do sistema por ano).",
   "Valor-hora: Lemon.io, Brasil, 3º trimestre de 2026 (sênior de US$ 42 a 50 por hora); Clutch (software houses brasileiras de US$ 25 a 99 por hora); Monitor do Mercado (sênior PJ de R$ 220 a 300 por hora).",
   "Prazo: Roteiro de Métricas do SISP 3.0 (Ministério da Gestão, Portaria SGD/MGI nº 3.656/2026), 10 horas por ponto de função; Roteiro do SISP 2.2 (2016), prazo = PF elevado a 0,39 para sistemas gerenciais com muitas integrações, comprimido em até 25%; regra de Capers Jones (prazo = PF elevado a 0,4; equipe = PF/150).",
   "Prazos de mercado: Panorama Consulting, ERP Report 2026 (mediana de 9 meses para implantar um ERP pronto); Standish Group, CHAOS 2020 (31% dos projetos no prazo, no custo e no escopo); ilink (fev/2026) e oHub (prazos anunciados por software houses); HubSpot, onboarding de 60 dias (BBD Boom); ROLLER, plano de implantação de 4 semanas; Northbeam, 30 a 90 dias até a atribuição ficar estável.",
   "Dólar a R$ 5,00, arredondado da PTAX de 06/10/2026 (Banco Central, R$ 4,97). Valores mensais sem as mensagens da Meta, que todos os caminhos pagam."
  ]
 }
};
