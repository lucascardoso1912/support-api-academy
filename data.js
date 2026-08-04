// ============================================================
// SUPPORT ACADEMY - base de conhecimento do time de Suporte C2S
//
// Arquitetura: tudo é "conteúdo" (CONTEUDOS), tipado por "tipo"
// (procedimento | conceito | erro | playbook | caso | ferramenta)
// e agrupado por "trilha" + "categoria". Pra criar uma trilha
// nova: adiciona um item em TRILHAS e alguns itens em CONTEUDOS
// apontando pra ela. Não precisa mexer no app.js.
//
// Campos universais de qualquer item de CONTEUDOS:
//   slug, trilha, categoria, tipo, titulo, resumo, keywords,
//   ordem (define a navegação anterior/próximo dentro da
//   categoria), favoritavel, quandoUsar, dicas?, problemasComuns?
//
// Campos por tipo:
//   procedimento: method, path, preRequisitos, ferramentas,
//     testar, curl, videoGroup, status, docOficial
//   conceito: conteudo[], exemplo?
//   erro: causaComum, comoInvestigar[], comoResolver
//   playbook: passos[]
//   caso: problema, causa, investigacao[], solucao, aprendizados,
//     palavrasChave[], statusCaso
//   ferramenta: linkUrl, linkLabel, collectionUrl, passos[]
// ============================================================

const TRILHAS = [
  {
    "slug": "fundamentos",
    "titulo": "Fundamentos",
    "descricao": "Conceitos básicos de API, HTTP e integrações. Comece por aqui se for novo na área técnica.",
    "icon": "book",
    "ordem": 1
  },
  {
    "slug": "api",
    "titulo": "API",
    "descricao": "Procedimentos guiados de investigação e teste da API do C2S, organizados por módulo de negócio.",
    "icon": "api",
    "ordem": 2
  },
  {
    "slug": "integracoes",
    "titulo": "Integrações",
    "descricao": "Como diferentes sistemas se conectam ao C2S.",
    "icon": "plug",
    "ordem": 3
  },
  {
    "slug": "troubleshooting",
    "titulo": "Troubleshooting",
    "descricao": "Como investigar e resolver os problemas mais comuns relatados pelos clientes.",
    "icon": "warning",
    "ordem": 4
  },
  {
    "slug": "playbooks",
    "titulo": "Playbooks",
    "descricao": "Fluxos, checklists e boas práticas de atendimento do time de suporte.",
    "icon": "playbook",
    "ordem": 5
  },
  {
    "slug": "casos-reais",
    "titulo": "Casos Reais",
    "descricao": "Investigações reais documentadas, do sintoma relatado até a causa raiz.",
    "icon": "case",
    "ordem": 6
  },
  {
    "slug": "boas-praticas",
    "titulo": "Boas Práticas",
    "descricao": "Padrões de qualidade, comunicação e postura do time de suporte.",
    "icon": "shield",
    "ordem": 7
  },
  {
    "slug": "ferramentas",
    "titulo": "Ferramentas",
    "descricao": "Aplicativos e recursos usados no dia a dia do suporte.",
    "icon": "wrench",
    "ordem": 8
  }
];

const TOOLS = {
  "postman": {
    "label": "Postman"
  },
  "api": {
    "label": "API C2S"
  },
  "plataforma": {
    "label": "Plataforma C2S"
  },
  "logs": {
    "label": "Logs da integração"
  }
};

const VIDEO_GROUPS = {
  "autenticacao-get": {
    "titulo": "Autenticação: validando o token (GET)",
    "resumo": "Como confirmar que um token é válido antes de investigar qualquer outra coisa.",
    "exemploPrincipal": "Validar Autenticação",
    "outrosExemplos": [],
    "ensina": [
      "Como montar uma requisição GET",
      "Como usar o header Authorization Bearer",
      "Como interpretar HTTP 200 e HTTP 403"
    ],
    "preRequisitos": [
      "Token de autenticação válido",
      "Postman ou terminal com curl"
    ],
    "duracao": "3-5 min",
    "video": "https://www.loom.com/share/70684644097d4bb7adf5535e10040e1d"
  },
  "leads-get": {
    "titulo": "Leads: requisições GET",
    "resumo": "Como investigar leads, seja em listagem, busca por ID ou consulta de tags de um lead.",
    "exemploPrincipal": "Investigar Listagem de Leads",
    "outrosExemplos": [
      "Investigar Lead Específico",
      "Investigar Tags de um Lead"
    ],
    "ensina": [
      "Como montar a requisição e usar filtros",
      "Como interpretar HTTP 200 e HTTP 403",
      "Como validar o retorno contra a Plataforma C2S",
      "Erros comuns em requisições GET de Leads"
    ],
    "preRequisitos": [
      "Token válido (ver Validar Autenticação)",
      "Um lead de teste já existente"
    ],
    "duracao": "8-10 min",
    "video": "https://www.loom.com/share/73a17bac40f6424887621feadad936a3"
  },
  "leads-post": {
    "titulo": "Leads: requisições POST",
    "resumo": "Como criar e registrar informações em um lead usando body JSON.",
    "exemploPrincipal": "Testar Criação de Lead",
    "outrosExemplos": [
      "Testar Criação de Mensagem",
      "Testar Criação de Atividade",
      "Testar Fechamento de Negócio"
    ],
    "ensina": [
      "Como montar o body em JSON",
      "Campos obrigatórios x opcionais",
      "Validação do resultado na Plataforma C2S",
      "Erros comuns (400, 422, 423)"
    ],
    "preRequisitos": [
      "Token válido",
      "Postman configurado com Content-Type: application/json"
    ],
    "duracao": "8-10 min",
    "video": ""
  },
  "leads-put": {
    "titulo": "Leads: requisições PUT",
    "resumo": "Como atualizar um lead existente e confirmar que a mudança foi aplicada.",
    "exemploPrincipal": "Testar Atualização de Lead",
    "outrosExemplos": [
      "Testar Encaminhamento de Lead",
      "Testar Marcação de Lead como Lido",
      "Testar Atualização de Status"
    ],
    "ensina": [
      "Diferença entre atualizar um campo simples e um body completo",
      "Validação do resultado após a atualização",
      "Erros comuns em requisições PUT de Leads"
    ],
    "preRequisitos": [
      "Token válido",
      "ID de um lead existente"
    ],
    "duracao": "8-10 min",
    "video": ""
  },
  "vendedores-get": {
    "titulo": "Vendedores: requisição GET",
    "resumo": "Como investigar a lista de vendedores da empresa.",
    "exemploPrincipal": "Investigar Lista de Vendedores",
    "outrosExemplos": [],
    "ensina": [
      "Como montar a requisição",
      "Como usar o ID retornado em outras chamadas (encaminhar lead, filas etc)"
    ],
    "preRequisitos": [
      "Token válido"
    ],
    "duracao": "4-5 min",
    "video": ""
  },
  "vendedores-post": {
    "titulo": "Vendedores: requisição POST",
    "resumo": "Como criar um vendedor novo na empresa.",
    "exemploPrincipal": "Testar Criação de Vendedor",
    "outrosExemplos": [],
    "ensina": [
      "Como montar o body em JSON",
      "Campo company_id e erros comuns de empresa errada"
    ],
    "preRequisitos": [
      "Token válido",
      "ID da empresa (company_id)"
    ],
    "duracao": "5-7 min",
    "video": ""
  },
  "vendedores-put": {
    "titulo": "Vendedores: requisições PUT",
    "resumo": "Como atualizar dados de um vendedor, individualmente ou em lote.",
    "exemploPrincipal": "Testar Atualização de Vendedor",
    "outrosExemplos": [
      "Testar Atualização de Rotação em Lote"
    ],
    "ensina": [
      "Atualização de campo simples x campos de rotação/distribuição",
      "Como testar em lote com segurança"
    ],
    "preRequisitos": [
      "Token válido",
      "ID de um vendedor existente"
    ],
    "duracao": "6-8 min",
    "video": ""
  },
  "empresas-get": {
    "titulo": "Empresas: requisição GET",
    "resumo": "Como investigar as empresas do grupo (filiais) de uma hierarquia.",
    "exemploPrincipal": "Investigar Empresas do Grupo",
    "outrosExemplos": [],
    "ensina": [
      "Como montar a requisição",
      "Quando usar isso como primeiro passo de uma investigação de hierarquia"
    ],
    "preRequisitos": [
      "Token válido"
    ],
    "duracao": "3-4 min",
    "video": ""
  },
  "tags-get": {
    "titulo": "Tags: requisição GET",
    "resumo": "Como investigar as tags cadastradas na empresa.",
    "exemploPrincipal": "Investigar Lista de Tags",
    "outrosExemplos": [],
    "ensina": [
      "Como montar a requisição e usar os filtros",
      "Como usar o ID retornado para Adicionar Tag a um lead"
    ],
    "preRequisitos": [
      "Token válido"
    ],
    "duracao": "3-4 min",
    "video": ""
  },
  "tags-post": {
    "titulo": "Tags: requisições POST",
    "resumo": "Como criar uma tag nova na empresa e como anexar uma tag existente a um lead.",
    "exemploPrincipal": "Testar Criação de Tag",
    "outrosExemplos": [
      "Testar Adição de Tag ao Lead"
    ],
    "ensina": [
      "Como montar o body em JSON",
      "Comportamento ao criar uma tag repetida (201 com chave errors)",
      "Diferença entre criar uma tag na empresa e anexar uma tag existente a um lead"
    ],
    "preRequisitos": [
      "Token válido",
      "Um lead de teste existente (para o exemplo de anexar tag)"
    ],
    "duracao": "6-8 min",
    "video": ""
  },
  "tags-delete": {
    "titulo": "Tags: requisição DELETE",
    "resumo": "Como remover uma tag de um lead e confirmar que ela realmente saiu.",
    "exemploPrincipal": "Testar Remoção de Tag do Lead",
    "outrosExemplos": [],
    "ensina": [
      "Como montar uma requisição DELETE com body",
      "Diferença entre remover 1 tag e remover várias de uma vez",
      "Como validar a remoção"
    ],
    "preRequisitos": [
      "Token válido",
      "Um lead com tag já aplicada"
    ],
    "duracao": "4-5 min",
    "video": ""
  },
  "distribuicao-get": {
    "titulo": "Distribuição: requisições GET",
    "resumo": "Como investigar regras e filas de distribuição de leads entre vendedores.",
    "exemploPrincipal": "Investigar Regras de Distribuição",
    "outrosExemplos": [
      "Investigar Filas de Distribuição",
      "Investigar Vendedores de uma Fila"
    ],
    "ensina": [
      "Como montar a requisição",
      "Como ler os headers de paginação",
      "Como comparar o retorno com o painel"
    ],
    "preRequisitos": [
      "Token válido"
    ],
    "duracao": "5-6 min",
    "video": ""
  },
  "distribuicao-post": {
    "titulo": "Distribuição: requisições POST",
    "resumo": "Como criar uma regra de distribuição e redistribuir um lead manualmente.",
    "exemploPrincipal": "Testar Criação de Regra de Distribuição",
    "outrosExemplos": [
      "Testar Redistribuição de Lead"
    ],
    "ensina": [
      "Como montar o body em JSON",
      "Como validar o efeito da regra no painel"
    ],
    "preRequisitos": [
      "Token válido",
      "ID de um vendedor"
    ],
    "duracao": "6-8 min",
    "video": ""
  },
  "distribuicao-put": {
    "titulo": "Distribuição: requisições PUT",
    "resumo": "Como atualizar prioridades de uma fila e definir o próximo vendedor da rotação.",
    "exemploPrincipal": "Testar Atualização de Prioridades",
    "outrosExemplos": [
      "Testar Definição do Próximo Vendedor"
    ],
    "ensina": [
      "Como montar o body em JSON",
      "Erros comuns quando o vendedor não está habilitado na fila"
    ],
    "preRequisitos": [
      "Token válido",
      "ID de uma fila de distribuição"
    ],
    "duracao": "5-7 min",
    "video": ""
  },
  "webhooks-post": {
    "titulo": "Webhooks: assinatura e cancelamento",
    "resumo": "Como configurar, testar e confirmar o recebimento de eventos de webhook.",
    "exemploPrincipal": "Testar Assinatura de Webhook",
    "outrosExemplos": [
      "Testar Cancelamento de Webhook"
    ],
    "ensina": [
      "Como assinar um gatilho (on_create_lead, on_update_lead, on_close_lead)",
      "A regra de 1 endpoint por token",
      "Como confirmar o recebimento no servidor do cliente",
      "Erros comuns de configuração"
    ],
    "preRequisitos": [
      "Token válido",
      "Um servidor de teste para receber o webhook (ex: webhook.site)"
    ],
    "duracao": "8-10 min",
    "video": ""
  },
  "stand-de-vendas-get": {
    "titulo": "Stand de Vendas: requisições GET",
    "resumo": "Como investigar estandes, leads capturados e resumo de presenças.",
    "exemploPrincipal": "Investigar Lista de Estandes",
    "outrosExemplos": [
      "Investigar Leads do Estande",
      "Investigar Resumo de Presenças"
    ],
    "ensina": [
      "Por que sempre começar por Listar Estandes",
      "Como usar os IDs retornados nos outros dois endpoints do módulo"
    ],
    "preRequisitos": [
      "Token válido",
      "Módulo Stand de Vendas ativo na conta"
    ],
    "duracao": "5-6 min",
    "video": ""
  },
  "blocklist-get": {
    "titulo": "Blocklist: requisição GET",
    "resumo": "Como investigar a blocklist de contatos de uma hierarquia.",
    "exemploPrincipal": "Investigar Blocklist",
    "outrosExemplos": [],
    "ensina": [
      "Como montar a requisição",
      "Escopo por hierarquia"
    ],
    "preRequisitos": [
      "Token válido",
      "Função de Hierarquia ativa na conta"
    ],
    "duracao": "3-4 min",
    "video": ""
  },
  "blocklist-post": {
    "titulo": "Blocklist: requisição POST",
    "resumo": "Como adicionar um contato à blocklist e o comportamento de duplicidade.",
    "exemploPrincipal": "Testar Inclusão na Blocklist",
    "outrosExemplos": [],
    "ensina": [
      "Como montar o body em JSON",
      "Como o telefone é normalizado",
      "Erro 409 de contato já bloqueado"
    ],
    "preRequisitos": [
      "Token válido",
      "Um telefone ou email de teste para bloquear"
    ],
    "duracao": "4-5 min",
    "video": ""
  }
};

const CONTEUDOS = [
  {
    "trilha": "fundamentos",
    "tipo": "conceito",
    "keywords": [
      "como",
      "funciona",
      "uma",
      "api"
    ],
    "favoritavel": true,
    "quandoUsar": "Bom pra revisar sempre que um termo técnico aparecer numa investigação e você quiser confirmar o conceito rapidinho.",
    "slug": "como-funciona-uma-api",
    "categoria": "Conceitos Básicos",
    "titulo": "Como funciona uma API",
    "resumo": "A porta de entrada pra um sistema conversar com outro, sem precisar acessar a interface visual.",
    "conteudo": [
      "Pense na API como um garçom: você (o sistema que chama) faz um pedido, o garçom (a API) leva até a cozinha (o servidor do C2S) e traz de volta o prato pronto (a resposta). Toda a lógica de negócio fica escondida, você só interage com um contrato bem definido de requisição e resposta.",
      "No caso do C2S, a API de integração permite que sistemas externos (imobiliárias, portais, CRMs de clientes) criem, consultem e atualizem leads, vendedores e tags sem precisar acessar o painel visual."
    ],
    "dicas": [
      "Sempre que for investigar um caso, pergunte primeiro: isso é um problema da API, ou do sistema do cliente que está chamando ela?"
    ],
    "ordem": 1
  },
  {
    "trilha": "fundamentos",
    "tipo": "conceito",
    "keywords": [
      "http"
    ],
    "favoritavel": true,
    "quandoUsar": "Bom pra revisar sempre que um termo técnico aparecer numa investigação e você quiser confirmar o conceito rapidinho.",
    "slug": "http",
    "categoria": "Conceitos Básicos",
    "titulo": "HTTP",
    "resumo": "O protocolo que toda chamada de API usa pra viajar pela internet.",
    "conteudo": [
      "HTTP é a linguagem comum que navegadores, aplicativos e sistemas usam pra pedir e receber informação pela internet. Toda chamada da API do C2S é uma requisição HTTP: você envia um pedido pra um endereço específico, e o servidor responde com um resultado e um status."
    ],
    "ordem": 2
  },
  {
    "trilha": "fundamentos",
    "tipo": "conceito",
    "keywords": [
      "metodos",
      "http",
      "métodos"
    ],
    "favoritavel": true,
    "quandoUsar": "Bom pra revisar sempre que um termo técnico aparecer numa investigação e você quiser confirmar o conceito rapidinho.",
    "slug": "metodos-http",
    "categoria": "Conceitos Básicos",
    "titulo": "Métodos HTTP",
    "resumo": "O verbo que diz o que você quer fazer com um recurso.",
    "conteudo": [
      "GET busca ou lista informação (ex: listar leads). POST cria um novo registro (ex: criar lead). PUT atualiza um registro existente (ex: atualizar status). DELETE remove algo (ex: remover tag). Esse padrão se repete em praticamente toda a API do C2S."
    ],
    "ordem": 3
  },
  {
    "trilha": "fundamentos",
    "tipo": "conceito",
    "keywords": [
      "status",
      "code"
    ],
    "favoritavel": true,
    "quandoUsar": "Bom pra revisar sempre que um termo técnico aparecer numa investigação e você quiser confirmar o conceito rapidinho.",
    "slug": "status-code",
    "categoria": "Conceitos Básicos",
    "titulo": "Status Code",
    "resumo": "O número que a resposta traz dizendo se a requisição deu certo ou não.",
    "conteudo": [
      "2xx significa sucesso, a requisição funcionou. 4xx significa erro de quem chamou (token errado, dado inválido). 5xx significa erro do lado do servidor, essa é a faixa que normalmente já justifica escalar direto."
    ],
    "ordem": 4
  },
  {
    "trilha": "fundamentos",
    "tipo": "conceito",
    "keywords": [
      "headers"
    ],
    "favoritavel": true,
    "quandoUsar": "Bom pra revisar sempre que um termo técnico aparecer numa investigação e você quiser confirmar o conceito rapidinho.",
    "slug": "headers",
    "categoria": "Anatomia da Requisição",
    "titulo": "Headers",
    "resumo": "Metadados enviados junto com a requisição, como o token de autenticação.",
    "conteudo": [
      "Headers carregam informação sobre a requisição em si, não sobre o conteúdo dela. Na API do C2S, o mais importante é o Authorization, que carrega o token no formato 'Bearer {token}'. Outro comum é o Content-Type, que avisa que o body está em JSON."
    ],
    "ordem": 1
  },
  {
    "trilha": "fundamentos",
    "tipo": "conceito",
    "keywords": [
      "body"
    ],
    "favoritavel": true,
    "quandoUsar": "Bom pra revisar sempre que um termo técnico aparecer numa investigação e você quiser confirmar o conceito rapidinho.",
    "slug": "body",
    "categoria": "Anatomia da Requisição",
    "titulo": "Body",
    "resumo": "O conteúdo enviado numa requisição POST ou PUT, geralmente em formato JSON.",
    "conteudo": [
      "O body é onde vai o 'conteúdo' da requisição: os dados do lead que você quer criar, o novo status que você quer aplicar, etc. Requisições GET normalmente não têm body, só query parameters."
    ],
    "ordem": 2
  },
  {
    "trilha": "fundamentos",
    "tipo": "conceito",
    "keywords": [
      "path",
      "parameters"
    ],
    "favoritavel": true,
    "quandoUsar": "Bom pra revisar sempre que um termo técnico aparecer numa investigação e você quiser confirmar o conceito rapidinho.",
    "slug": "path-parameters",
    "categoria": "Anatomia da Requisição",
    "titulo": "Path Parameters",
    "resumo": "Partes variáveis dentro do próprio endereço da requisição.",
    "conteudo": [
      "Em /integration/leads/:id, o :id é um path parameter, você substitui ele pelo ID real do lead que quer consultar. É diferente de um filtro (query parameter), o path parameter identifica exatamente qual recurso você quer acessar."
    ],
    "exemplo": "GET /integration/leads/a1b2c3d4 (a1b2c3d4 é o valor real no lugar de :id)",
    "ordem": 3
  },
  {
    "trilha": "fundamentos",
    "tipo": "conceito",
    "keywords": [
      "query",
      "parameters"
    ],
    "favoritavel": true,
    "quandoUsar": "Bom pra revisar sempre que um termo técnico aparecer numa investigação e você quiser confirmar o conceito rapidinho.",
    "slug": "query-parameters",
    "categoria": "Anatomia da Requisição",
    "titulo": "Query Parameters",
    "resumo": "Filtros e opções passados depois do ? na URL.",
    "conteudo": [
      "Query parameters vão depois do ? na URL, separados por &. São usados pra filtrar, paginar ou ajustar o que a requisição retorna, sem mudar qual recurso está sendo acessado."
    ],
    "exemplo": "GET /integration/leads?status=novo&page=2",
    "ordem": 4
  },
  {
    "trilha": "fundamentos",
    "tipo": "conceito",
    "keywords": [
      "autenticacao",
      "bearer",
      "autenticação"
    ],
    "favoritavel": true,
    "quandoUsar": "Bom pra revisar sempre que um termo técnico aparecer numa investigação e você quiser confirmar o conceito rapidinho.",
    "slug": "autenticacao-bearer",
    "categoria": "Autenticação",
    "titulo": "Autenticação Bearer",
    "resumo": "O jeito como o token é enviado em toda chamada da API do C2S.",
    "conteudo": [
      "Bearer é um esquema de autenticação onde você simplesmente 'carrega' (bear) o token no header Authorization. Na prática: Authorization: Bearer {token}. Sem esse header correto, a API do C2S responde 403 not_authorized."
    ],
    "dicas": [
      "Confunda-se menos: o header pode ser Authorization (preferencial) ou Authentication (alternativo), mas o valor sempre carrega o token."
    ],
    "ordem": 1
  },
  {
    "trilha": "fundamentos",
    "tipo": "conceito",
    "keywords": [
      "json"
    ],
    "favoritavel": true,
    "quandoUsar": "Bom pra revisar sempre que um termo técnico aparecer numa investigação e você quiser confirmar o conceito rapidinho.",
    "slug": "json",
    "categoria": "Autenticação",
    "titulo": "JSON",
    "resumo": "O formato de dados que a API do C2S manda e recebe.",
    "conteudo": [
      "JSON é um formato de texto que representa dados como pares de chave e valor, parecido com um dicionário. Toda resposta da API do C2S vem em JSON, e todo body de POST/PUT também deve estar em JSON válido."
    ],
    "exemplo": "{\n  \"nome\": \"João Silva\",\n  \"status\": \"em_negociacao\",\n  \"ativo\": true\n}",
    "ordem": 2
  },
  {
    "slug": "verificar-autenticacao",
    "trilha": "api",
    "categoria": "Autenticação",
    "tipo": "procedimento",
    "titulo": "Validar Autenticação",
    "resumo": "Confirma se um token está válido e retorna os dados da empresa autenticada.",
    "keywords": [
      "verificar",
      "autenticacao",
      "validar",
      "autenticação"
    ],
    "ordem": 1,
    "favoritavel": true,
    "method": "GET",
    "path": "/integration",
    "quandoUsar": "Esse é sempre o primeiro passo de qualquer investigação técnica. Use também quando o cliente relatar erro de acesso à API, antes de testar qualquer outro endpoint.",
    "preRequisitos": [],
    "ferramentas": [
      "postman",
      "api"
    ],
    "testar": "Chame o endpoint sozinho, sem mais nada. Se voltar 200 com o nome da empresa, o token está válido. Se voltar 403, o problema é o token, antes mesmo de qualquer outra investigação.",
    "curl": "curl -X GET \"https://api.contact2sale.com/integration\" \\\n  -H \"Authorization: Bearer {token}\"",
    "videoGroup": "autenticacao-get",
    "status": {
      "validado": false,
      "testadoPostman": false,
      "revisao": "Jul/2026"
    },
    "docOficial": true
  },
  {
    "slug": "listar-leads",
    "trilha": "api",
    "categoria": "Leads",
    "tipo": "procedimento",
    "titulo": "Investigar Listagem de Leads",
    "resumo": "Confirma se a API está retornando corretamente os leads da empresa, com filtros e paginação.",
    "keywords": [
      "listar",
      "leads",
      "investigar",
      "listagem"
    ],
    "ordem": 1,
    "favoritavel": true,
    "method": "GET",
    "path": "/integration/leads",
    "quandoUsar": "Use quando um cliente relatar divergências na listagem de leads, ou quando precisar confirmar se um lead específico está sendo retornado pela API.",
    "preRequisitos": [],
    "ferramentas": [
      "postman",
      "api",
      "plataforma"
    ],
    "testar": "Teste filtrando por phone ou email do cliente reclamado, é o jeito mais rápido de achar um lead específico numa investigação.",
    "curl": "curl -X GET \"https://api.contact2sale.com/integration/leads?status=em_negociacao&perpage=50\" \\\n  -H \"Authorization: Bearer {token}\"",
    "videoGroup": "leads-get",
    "status": {
      "validado": false,
      "testadoPostman": false,
      "revisao": "Jul/2026"
    },
    "docOficial": true
  },
  {
    "slug": "buscar-lead",
    "trilha": "api",
    "categoria": "Leads",
    "tipo": "procedimento",
    "titulo": "Investigar Lead Específico",
    "resumo": "Retorna todo o detalhe de um lead pelo ID: histórico, mensagens e agendamentos.",
    "keywords": [
      "buscar",
      "lead",
      "investigar",
      "específico"
    ],
    "ordem": 2,
    "favoritavel": true,
    "method": "GET",
    "path": "/integration/leads/:id",
    "quandoUsar": "Use quando já souber o ID do lead e precisar conferir o histórico completo dele, por exemplo para confirmar se uma mensagem ou atividade foi registrada corretamente.",
    "preRequisitos": [],
    "ferramentas": [
      "postman",
      "api",
      "plataforma"
    ],
    "testar": "Pegue o ID de um lead retornado em Investigar Listagem de Leads e chame este endpoint para conferir o detalhe completo dele.",
    "curl": "curl -X GET \"https://api.contact2sale.com/integration/leads/{id}\" \\\n  -H \"Authorization: Bearer {token}\"",
    "videoGroup": "leads-get",
    "status": {
      "validado": false,
      "testadoPostman": false,
      "revisao": "Jul/2026"
    },
    "docOficial": true
  },
  {
    "slug": "criar-lead",
    "trilha": "api",
    "categoria": "Leads",
    "tipo": "procedimento",
    "titulo": "Testar Criação de Lead",
    "resumo": "Cria um novo lead. É obrigatório enviar ao menos phone ou email, senão a API retorna 423.",
    "keywords": [
      "criar",
      "lead",
      "testar",
      "criação"
    ],
    "ordem": 3,
    "favoritavel": true,
    "method": "POST",
    "path": "/integration/leads",
    "quandoUsar": "Indicado quando o cliente relatar que leads não estão sendo criados pela integração dele: ajuda a isolar se o problema está na API ou no sistema de origem.",
    "preRequisitos": [],
    "ferramentas": [
      "postman",
      "api",
      "plataforma"
    ],
    "testar": "Envie um body mínimo só com name, phone e description para validar que o token tem permissão de criação antes de testar campos avançados.",
    "curl": "curl -X POST \"https://api.contact2sale.com/integration/leads\" \\\n  -H \"Authorization: Bearer {token}\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"data\":{\"type\":\"lead\",\"attributes\":{\"name\":\"Teste\",\"phone\":\"11999999999\"}}}'",
    "videoGroup": "leads-post",
    "status": {
      "validado": false,
      "testadoPostman": false,
      "revisao": "Jul/2026"
    },
    "docOficial": true
  },
  {
    "slug": "atualizar-lead",
    "trilha": "api",
    "categoria": "Leads",
    "tipo": "procedimento",
    "titulo": "Testar Atualização de Lead",
    "resumo": "Atualiza um lead existente. Suporta 3 formatos de body diferentes.",
    "keywords": [
      "atualizar",
      "lead",
      "testar",
      "atualização"
    ],
    "ordem": 4,
    "favoritavel": true,
    "method": "PUT",
    "path": "/integration/leads/:id",
    "quandoUsar": "Use quando o cliente relatar que uma atualização (novo telefone, novo status do produto etc) não está refletindo no lead dentro do C2S.",
    "preRequisitos": [],
    "ferramentas": [
      "postman",
      "api",
      "plataforma"
    ],
    "testar": "Teste primeiro atualizando um único campo simples (como o nome do cliente) antes de testar o body completo, ajuda a isolar qual formato o sistema do cliente está usando.",
    "curl": "curl -X PUT \"https://api.contact2sale.com/integration/leads/{id}\" \\\n  -H \"Authorization: Bearer {token}\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"lead\":{\"customer\":{\"name\":\"Nome Atualizado\"}}}'",
    "videoGroup": "leads-put",
    "status": {
      "validado": false,
      "testadoPostman": false,
      "revisao": "Jul/2026"
    },
    "docOficial": true
  },
  {
    "slug": "encaminhar-lead",
    "trilha": "api",
    "categoria": "Leads",
    "tipo": "procedimento",
    "titulo": "Testar Encaminhamento de Lead",
    "resumo": "Encaminha um lead de um vendedor para outro.",
    "keywords": [
      "encaminhar",
      "lead",
      "testar",
      "encaminhamento"
    ],
    "ordem": 5,
    "favoritavel": true,
    "method": "PUT",
    "path": "/integration/leads/:id/forward",
    "quandoUsar": "Indicado quando o cliente relatar que um lead não mudou de vendedor após uma tentativa de encaminhamento pela integração dele.",
    "preRequisitos": [],
    "ferramentas": [
      "postman",
      "api",
      "plataforma"
    ],
    "testar": "Confirme antes os IDs criptografados dos dois vendedores (origem e destino) usando o procedimento Investigar Lista de Vendedores.",
    "curl": "curl -X PUT \"https://api.contact2sale.com/integration/leads/{id}/forward\" \\\n  -H \"Authorization: Bearer {token}\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"seller_from_id\":\"{id_origem}\",\"seller_to_id\":\"{id_destino}\"}'",
    "videoGroup": "leads-put",
    "status": {
      "validado": false,
      "testadoPostman": false,
      "revisao": "Jul/2026"
    },
    "docOficial": true
  },
  {
    "slug": "listar-tags-lead",
    "trilha": "api",
    "categoria": "Leads",
    "tipo": "procedimento",
    "titulo": "Investigar Tags de um Lead",
    "resumo": "Retorna todas as tags associadas a um lead específico.",
    "keywords": [
      "listar",
      "tags",
      "lead",
      "investigar"
    ],
    "ordem": 6,
    "favoritavel": true,
    "method": "GET",
    "path": "/integration/leads/:id/tags",
    "quandoUsar": "Use quando o cliente relatar que uma tag esperada não aparece no lead, ou para conferir o estado atual antes de adicionar ou remover uma tag.",
    "preRequisitos": [],
    "ferramentas": [
      "postman",
      "api",
      "plataforma"
    ],
    "testar": "Use num lead que você já sabe que tem tag para confirmar visualmente que a resposta bate com o painel do C2S. Esse endpoint é o que você usa para validar qualquer teste de Adicionar ou Remover Tag.",
    "curl": "curl -X GET \"https://api.contact2sale.com/integration/leads/{id}/tags\" \\\n  -H \"Authorization: Bearer {token}\"",
    "videoGroup": "leads-get",
    "status": {
      "validado": false,
      "testadoPostman": false,
      "revisao": "Jul/2026"
    },
    "docOficial": true
  },
  {
    "slug": "marcar-lead-lido",
    "trilha": "api",
    "categoria": "Leads",
    "tipo": "procedimento",
    "titulo": "Testar Marcação de Lead como Lido",
    "resumo": "Marca um lead como lido ou interagido.",
    "keywords": [
      "marcar",
      "lead",
      "lido",
      "testar",
      "marcação",
      "como"
    ],
    "ordem": 7,
    "favoritavel": true,
    "method": "PUT",
    "path": "/integration/leads/:id/read",
    "quandoUsar": "Indicado quando o cliente relatar que leads continuam aparecendo como não lidos mesmo depois da interação pelo sistema dele.",
    "preRequisitos": [],
    "ferramentas": [
      "postman",
      "api",
      "plataforma"
    ],
    "testar": "Confirme no painel do C2S, antes e depois da chamada, que o indicador de não lido do lead sumiu.",
    "curl": "curl -X PUT \"https://api.contact2sale.com/integration/leads/{id}/read\" \\\n  -H \"Authorization: Bearer {token}\"",
    "videoGroup": "leads-put",
    "status": {
      "validado": false,
      "testadoPostman": false,
      "revisao": "Jul/2026"
    },
    "docOficial": true
  },
  {
    "slug": "criar-mensagem-lead",
    "trilha": "api",
    "categoria": "Leads",
    "tipo": "procedimento",
    "titulo": "Testar Criação de Mensagem",
    "resumo": "Cria uma mensagem dentro de um lead, para registrar o histórico de conversa vindo de um canal externo.",
    "keywords": [
      "criar",
      "mensagem",
      "lead",
      "testar",
      "criação"
    ],
    "ordem": 8,
    "favoritavel": true,
    "method": "POST",
    "path": "/integration/leads/:id/messages",
    "quandoUsar": "Use quando o cliente relatar que mensagens de um canal (WhatsApp, chat do site) não estão aparecendo no histórico do lead.",
    "preRequisitos": [],
    "ferramentas": [
      "postman",
      "api",
      "plataforma"
    ],
    "testar": "Envie uma mensagem de teste com o campo origin preenchido (ex: whatsapp) e confirme que ela aparece no card do lead no C2S.",
    "curl": "curl -X POST \"https://api.contact2sale.com/integration/leads/{id}/messages\" \\\n  -H \"Authorization: Bearer {token}\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"body\":\"Mensagem de teste\",\"from\":\"bot\"}'",
    "videoGroup": "leads-post",
    "status": {
      "validado": false,
      "testadoPostman": false,
      "revisao": "Jul/2026"
    },
    "docOficial": true
  },
  {
    "slug": "criar-atividade-lead",
    "trilha": "api",
    "categoria": "Leads",
    "tipo": "procedimento",
    "titulo": "Testar Criação de Atividade",
    "resumo": "Cria uma atividade (agendamento) em um lead, com data, título e opção de notificação push.",
    "keywords": [
      "criar",
      "atividade",
      "lead",
      "testar",
      "criação"
    ],
    "ordem": 9,
    "favoritavel": true,
    "method": "POST",
    "path": "/integration/leads/:id/activities",
    "quandoUsar": "Indicado quando o cliente relatar que agendamentos criados pela integração dele não aparecem para o vendedor, ou que a notificação não chegou.",
    "preRequisitos": [],
    "ferramentas": [
      "postman",
      "api",
      "plataforma"
    ],
    "testar": "Teste com send_push true e confirme se o vendedor responsável recebeu a notificação.",
    "curl": "curl -X POST \"https://api.contact2sale.com/integration/leads/{id}/activities\" \\\n  -H \"Authorization: Bearer {token}\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"date\":\"2026-08-01T14:00:00Z\",\"type\":{\"activity\":true},\"body\":\"Retornar contato\"}'",
    "videoGroup": "leads-post",
    "status": {
      "validado": false,
      "testadoPostman": false,
      "revisao": "Jul/2026"
    },
    "docOficial": true
  },
  {
    "slug": "atualizar-status-lead",
    "trilha": "api",
    "categoria": "Leads",
    "tipo": "procedimento",
    "titulo": "Testar Atualização de Status",
    "resumo": "Atualiza o status de um lead. Quando status = 3, o lead é marcado como perdido/arquivado.",
    "keywords": [
      "atualizar",
      "status",
      "lead",
      "testar",
      "atualização"
    ],
    "ordem": 10,
    "favoritavel": true,
    "method": "PUT",
    "path": "/integration/leads/:id/status",
    "quandoUsar": "Use quando o cliente relatar que um lead deveria ter sido arquivado pela integração dele e continua ativo, ou o contrário.",
    "preRequisitos": [],
    "ferramentas": [
      "postman",
      "api",
      "plataforma"
    ],
    "testar": "Use um lead de teste para o status 3 e confirme se o motivo (lost_reason_ids) aparece certo no painel.",
    "curl": "curl -X PUT \"https://api.contact2sale.com/integration/leads/{id}/status\" \\\n  -H \"Authorization: Bearer {token}\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"status\":3,\"message\":\"Cliente sem interesse\",\"lost_reason_ids\":[12]}'",
    "videoGroup": "leads-put",
    "status": {
      "validado": false,
      "testadoPostman": false,
      "revisao": "Jul/2026"
    },
    "docOficial": true
  },
  {
    "slug": "fechar-negocio-lead",
    "trilha": "api",
    "categoria": "Leads",
    "tipo": "procedimento",
    "titulo": "Testar Fechamento de Negócio",
    "resumo": "Registra o fechamento de negócio (venda) de um lead, com valor e detalhes.",
    "keywords": [
      "fechar",
      "negocio",
      "lead",
      "testar",
      "fechamento",
      "negócio"
    ],
    "ordem": 11,
    "favoritavel": true,
    "method": "POST",
    "path": "/integration/leads/:id/done",
    "quandoUsar": "Indicado quando o cliente relatar que uma venda registrada pela integração dele não aparece no relatório de negócios fechados.",
    "preRequisitos": [],
    "ferramentas": [
      "postman",
      "api",
      "plataforma"
    ],
    "testar": "Teste em um lead de exemplo e confirme se ele muda de status e o valor aparece corretamente no relatório de vendas.",
    "curl": "curl -X POST \"https://api.contact2sale.com/integration/leads/{id}/done\" \\\n  -H \"Authorization: Bearer {token}\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"done_type_negotiation\":\"sale\",\"value\":\"500000\"}'",
    "videoGroup": "leads-post",
    "status": {
      "validado": false,
      "testadoPostman": false,
      "revisao": "Jul/2026"
    },
    "docOficial": true
  },
  {
    "slug": "listar-vendedores",
    "trilha": "api",
    "categoria": "Vendedores",
    "tipo": "procedimento",
    "titulo": "Investigar Lista de Vendedores",
    "resumo": "Lista todos os vendedores da empresa autenticada, incluindo empresas do grupo.",
    "keywords": [
      "listar",
      "vendedores",
      "investigar",
      "lista"
    ],
    "ordem": 1,
    "favoritavel": true,
    "method": "GET",
    "path": "/sellers",
    "quandoUsar": "Esse é o ponto de partida sempre que precisar do ID criptografado de um vendedor para outra chamada (encaminhar lead, configurar fila etc). Use também quando o cliente relatar que um vendedor não aparece na integração.",
    "preRequisitos": [],
    "ferramentas": [
      "postman",
      "api",
      "plataforma"
    ],
    "testar": "Use este endpoint primeiro sempre que precisar do ID criptografado de um vendedor para outra chamada.",
    "curl": "curl -X GET \"https://api.contact2sale.com/sellers\" \\\n  -H \"Authorization: Bearer {token}\"",
    "videoGroup": "vendedores-get",
    "status": {
      "validado": false,
      "testadoPostman": false,
      "revisao": "Jul/2026"
    },
    "docOficial": true
  },
  {
    "slug": "criar-vendedor",
    "trilha": "api",
    "categoria": "Vendedores",
    "tipo": "procedimento",
    "titulo": "Testar Criação de Vendedor",
    "resumo": "Cria um novo vendedor na empresa.",
    "keywords": [
      "criar",
      "vendedor",
      "testar",
      "criação"
    ],
    "ordem": 2,
    "favoritavel": true,
    "method": "POST",
    "path": "/sellers",
    "quandoUsar": "Indicado quando o cliente relatar falha ao criar vendedores em massa pela integração dele: ajuda a isolar se o problema é da API ou do sistema de origem.",
    "preRequisitos": [],
    "ferramentas": [
      "postman",
      "api",
      "plataforma"
    ],
    "testar": "Confirme o company_id certo antes de testar: criar vendedor na empresa errada é o erro mais comum aqui.",
    "curl": "curl -X POST \"https://api.contact2sale.com/sellers\" \\\n  -H \"Authorization: Bearer {token}\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"company_id\":\"{company_id}\",\"name\":\"Novo Vendedor\",\"email\":\"vendedor@exemplo.com\"}'",
    "videoGroup": "vendedores-post",
    "status": {
      "validado": false,
      "testadoPostman": false,
      "revisao": "Jul/2026"
    },
    "docOficial": true
  },
  {
    "slug": "atualizar-vendedor",
    "trilha": "api",
    "categoria": "Vendedores",
    "tipo": "procedimento",
    "titulo": "Testar Atualização de Vendedor",
    "resumo": "Atualiza um vendedor existente. Aceita também campos de rotação e distribuição de leads.",
    "keywords": [
      "atualizar",
      "vendedor",
      "testar",
      "atualização"
    ],
    "ordem": 3,
    "favoritavel": true,
    "method": "PUT",
    "path": "/sellers/:id",
    "quandoUsar": "Use quando o cliente relatar que dados de um vendedor (email, permissão de receber leads) não estão sendo atualizados corretamente.",
    "preRequisitos": [],
    "ferramentas": [
      "postman",
      "api",
      "plataforma"
    ],
    "testar": "Teste alterando um campo simples primeiro (nome ou email) antes de testar os campos de rotação/distribuição.",
    "curl": "curl -X PUT \"https://api.contact2sale.com/sellers/{id}\" \\\n  -H \"Authorization: Bearer {token}\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"name\":\"Vendedor Atualizado\"}'",
    "videoGroup": "vendedores-put",
    "status": {
      "validado": false,
      "testadoPostman": false,
      "revisao": "Jul/2026"
    },
    "docOficial": true
  },
  {
    "slug": "timeshift-vendedores",
    "trilha": "api",
    "categoria": "Vendedores",
    "tipo": "procedimento",
    "titulo": "Testar Atualização de Rotação em Lote",
    "resumo": "Atualiza em lote a configuração de rotação de múltiplos vendedores.",
    "keywords": [
      "timeshift",
      "vendedores",
      "testar",
      "atualização",
      "rotação",
      "lote"
    ],
    "ordem": 4,
    "favoritavel": true,
    "method": "PUT",
    "path": "/sellers/timeshift",
    "quandoUsar": "Indicado quando o cliente relatar que a ordem de rotação de leads entre vendedores ficou incorreta após uma atualização em lote.",
    "preRequisitos": [],
    "ferramentas": [
      "postman",
      "api",
      "plataforma"
    ],
    "testar": "Use com uma lista pequena de 2 ou 3 vendedores de teste antes de rodar em lote com o time inteiro.",
    "curl": "curl -X PUT \"https://api.contact2sale.com/sellers/timeshift\" \\\n  -H \"Authorization: Bearer {token}\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"seller_ids\":[\"{id_1}\",\"{id_2}\"]}'",
    "videoGroup": "vendedores-put",
    "status": {
      "validado": false,
      "testadoPostman": false,
      "revisao": "Jul/2026"
    },
    "docOficial": true
  },
  {
    "slug": "listar-empresas",
    "trilha": "api",
    "categoria": "Empresas",
    "tipo": "procedimento",
    "titulo": "Investigar Empresas do Grupo",
    "resumo": "Lista todas as empresas do grupo (filiais) da empresa autenticada.",
    "keywords": [
      "listar",
      "empresas",
      "investigar",
      "grupo"
    ],
    "ordem": 1,
    "favoritavel": true,
    "method": "GET",
    "path": "/companies",
    "quandoUsar": "Esse é o primeiro passo em qualquer investigação envolvendo hierarquia ou filial, antes de olhar leads ou vendedores de uma empresa específica.",
    "preRequisitos": [],
    "ferramentas": [
      "postman",
      "api",
      "plataforma"
    ],
    "testar": "Confira se o número de filiais retornado bate com o que o cliente vê no painel dele.",
    "curl": "curl -X GET \"https://api.contact2sale.com/companies\" \\\n  -H \"Authorization: Bearer {token}\"",
    "videoGroup": "empresas-get",
    "status": {
      "validado": false,
      "testadoPostman": false,
      "revisao": "Jul/2026"
    },
    "docOficial": true
  },
  {
    "slug": "listar-tags",
    "trilha": "api",
    "categoria": "Tags",
    "tipo": "procedimento",
    "titulo": "Investigar Lista de Tags",
    "resumo": "Lista as tags cadastradas na empresa, com filtro por nome ou autofill.",
    "keywords": [
      "listar",
      "tags",
      "investigar",
      "lista"
    ],
    "ordem": 1,
    "favoritavel": true,
    "method": "GET",
    "path": "/tags",
    "quandoUsar": "Use antes de testar a Adição de Tag, já que você vai precisar do ID exato dela, ou quando o cliente relatar que uma tag esperada não existe mais na empresa.",
    "preRequisitos": [],
    "ferramentas": [
      "postman",
      "api",
      "plataforma"
    ],
    "testar": "Use isso antes de testar a Adição de Tag: você vai precisar do ID exato dela.",
    "curl": "curl -X GET \"https://api.contact2sale.com/tags\" \\\n  -H \"Authorization: Bearer {token}\"",
    "videoGroup": "tags-get",
    "status": {
      "validado": false,
      "testadoPostman": false,
      "revisao": "Jul/2026"
    },
    "docOficial": true
  },
  {
    "slug": "criar-tag",
    "trilha": "api",
    "categoria": "Tags",
    "tipo": "procedimento",
    "titulo": "Testar Criação de Tag",
    "resumo": "Cria uma nova tag. Se já existir uma tag com os mesmos parâmetros, retorna a existente.",
    "keywords": [
      "criar",
      "tag",
      "testar",
      "criação"
    ],
    "ordem": 2,
    "favoritavel": true,
    "method": "POST",
    "path": "/tags",
    "quandoUsar": "Indicado quando o cliente relatar que a criação de tags pela integração dele está duplicando ou falhando.",
    "preRequisitos": [],
    "ferramentas": [
      "postman",
      "api",
      "plataforma"
    ],
    "testar": "Teste criando a mesma tag duas vezes de propósito para confirmar o comportamento de deduplicação (retorna 201 com chave errors).",
    "curl": "curl -X POST \"https://api.contact2sale.com/tags\" \\\n  -H \"Authorization: Bearer {token}\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"tag\":{\"name\":\"Nova Tag\",\"autofill\":false}}'",
    "videoGroup": "tags-post",
    "status": {
      "validado": false,
      "testadoPostman": false,
      "revisao": "Jul/2026"
    },
    "docOficial": true
  },
  {
    "slug": "adicionar-tag-lead",
    "trilha": "api",
    "categoria": "Tags",
    "tipo": "procedimento",
    "titulo": "Testar Adição de Tag ao Lead",
    "resumo": "Adiciona uma tag já existente a um lead. Fisicamente é um endpoint de Leads, mas pedagogicamente pertence ao módulo Tags.",
    "keywords": [
      "adicionar",
      "tag",
      "lead",
      "testar",
      "adição"
    ],
    "ordem": 3,
    "favoritavel": true,
    "method": "POST",
    "path": "/integration/leads/:id/tags",
    "quandoUsar": "Indicado quando o cliente relatar que a tag enviada pela integração dele não está sendo aplicada ao lead.",
    "preRequisitos": [],
    "ferramentas": [
      "postman",
      "api",
      "plataforma"
    ],
    "testar": "Pegue o ID de uma tag em Investigar Lista de Tags antes de testar aqui (a tag precisa já existir na empresa). Depois de adicionar, confira em Investigar Tags de um Lead se ela aparece na lista, essa é a validação que fecha o teste. Erro comum: usar o nome da tag em vez do ID criptografado.",
    "curl": "curl -X POST \"https://api.contact2sale.com/integration/leads/{id}/tags\" \\\n  -H \"Authorization: Bearer {token}\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"tag_id\":\"{tag_id}\"}'",
    "videoGroup": "tags-post",
    "status": {
      "validado": false,
      "testadoPostman": false,
      "revisao": "Jul/2026"
    },
    "docOficial": true
  },
  {
    "slug": "remover-tag-lead",
    "trilha": "api",
    "categoria": "Tags",
    "tipo": "procedimento",
    "titulo": "Testar Remoção de Tag do Lead",
    "resumo": "Remove uma ou mais tags de um lead. Aceita tag_id como string única ou array. Fisicamente é um endpoint de Leads, mas pedagogicamente pertence ao módulo Tags.",
    "keywords": [
      "remover",
      "tag",
      "lead",
      "testar",
      "remoção"
    ],
    "ordem": 4,
    "favoritavel": true,
    "method": "DELETE",
    "path": "/integration/leads/:id/tags",
    "quandoUsar": "Use quando uma tag precisar ser removida em massa, ou quando o cliente relatar que a remoção pela integração dele não está funcionando.",
    "preRequisitos": [],
    "ferramentas": [
      "postman",
      "api",
      "plataforma"
    ],
    "testar": "Teste primeiro removendo uma única tag antes de testar com array de várias tags de uma vez. Depois de remover, confirme em Investigar Tags de um Lead que ela realmente sumiu da lista. Erro comum: reenviar o tag_id de uma tag que já foi removida.",
    "curl": "curl -X DELETE \"https://api.contact2sale.com/integration/leads/{id}/tags\" \\\n  -H \"Authorization: Bearer {token}\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"tag_id\":\"{tag_id}\"}'",
    "videoGroup": "tags-delete",
    "status": {
      "validado": false,
      "testadoPostman": false,
      "revisao": "Jul/2026"
    },
    "docOficial": true
  },
  {
    "slug": "listar-regras-distribuicao",
    "trilha": "api",
    "categoria": "Distribuição",
    "tipo": "procedimento",
    "titulo": "Investigar Regras de Distribuição",
    "resumo": "Lista todas as regras de distribuição (regiões) da empresa e suas filiais.",
    "keywords": [
      "listar",
      "regras",
      "distribuicao",
      "investigar",
      "distribuição"
    ],
    "ordem": 1,
    "favoritavel": true,
    "method": "GET",
    "path": "/distribution_rules",
    "quandoUsar": "Use quando o cliente relatar que leads de uma região específica não estão indo para o vendedor esperado.",
    "preRequisitos": [],
    "ferramentas": [
      "postman",
      "api",
      "plataforma"
    ],
    "testar": "Compare o retorno com o que está configurado na tela de distribuição do painel para validar que bate.",
    "curl": "curl -X GET \"https://api.contact2sale.com/distribution_rules\" \\\n  -H \"Authorization: Bearer {token}\"",
    "videoGroup": "distribuicao-get",
    "status": {
      "validado": false,
      "testadoPostman": false,
      "revisao": "Jul/2026"
    },
    "docOficial": true
  },
  {
    "slug": "criar-regra-distribuicao",
    "trilha": "api",
    "categoria": "Distribuição",
    "tipo": "procedimento",
    "titulo": "Testar Criação de Regra de Distribuição",
    "resumo": "Cria uma nova regra de distribuição vinculando uma região a um vendedor.",
    "keywords": [
      "criar",
      "regra",
      "distribuicao",
      "testar",
      "criação",
      "distribuição"
    ],
    "ordem": 2,
    "favoritavel": true,
    "method": "POST",
    "path": "/distribution_rules",
    "quandoUsar": "Indicado quando precisar validar, junto com o time de implantação, se uma nova regra de distribuição vai funcionar como esperado antes de ir para produção.",
    "preRequisitos": [],
    "ferramentas": [
      "postman",
      "api",
      "plataforma"
    ],
    "testar": "Teste com uma regra de prioridade alta isolada, depois confirme no painel se ela realmente está direcionando os leads certos.",
    "curl": "curl -X POST \"https://api.contact2sale.com/distribution_rules\" \\\n  -H \"Authorization: Bearer {token}\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"cod_1\":\"SP\",\"cod_2\":\"São Paulo\",\"priority\":1,\"type_rule\":\"rotation\",\"seller_id\":\"{seller_id}\"}'",
    "videoGroup": "distribuicao-post",
    "status": {
      "validado": false,
      "testadoPostman": false,
      "revisao": "Jul/2026"
    },
    "docOficial": true
  },
  {
    "slug": "listar-filas-distribuicao",
    "trilha": "api",
    "categoria": "Distribuição",
    "tipo": "procedimento",
    "titulo": "Investigar Filas de Distribuição",
    "resumo": "Lista as filas de distribuição da empresa pai, com headers de paginação.",
    "keywords": [
      "listar",
      "filas",
      "distribuicao",
      "investigar",
      "distribuição"
    ],
    "ordem": 3,
    "favoritavel": true,
    "method": "GET",
    "path": "/distribution_queues",
    "quandoUsar": "Use quando o cliente relatar que uma fila de distribuição não existe mais ou está com configuração diferente da esperada.",
    "preRequisitos": [],
    "ferramentas": [
      "postman",
      "api",
      "plataforma"
    ],
    "testar": "Confira os headers de paginação da resposta, não só o body, muita integração de cliente erra justamente aí.",
    "curl": "curl -X GET \"https://api.contact2sale.com/distribution_queues\" \\\n  -H \"Authorization: Bearer {token}\"",
    "videoGroup": "distribuicao-get",
    "status": {
      "validado": false,
      "testadoPostman": false,
      "revisao": "Jul/2026"
    },
    "docOficial": true
  },
  {
    "slug": "listar-vendedores-fila",
    "trilha": "api",
    "categoria": "Distribuição",
    "tipo": "procedimento",
    "titulo": "Investigar Vendedores de uma Fila",
    "resumo": "Lista os vendedores de uma fila de distribuição específica, com paginação.",
    "keywords": [
      "listar",
      "vendedores",
      "fila",
      "investigar",
      "uma"
    ],
    "ordem": 4,
    "favoritavel": true,
    "method": "GET",
    "path": "/distribution_queues/:id/sellers",
    "quandoUsar": "Indicado quando o cliente relatar que um vendedor não está recebendo leads de uma fila específica.",
    "preRequisitos": [],
    "ferramentas": [
      "postman",
      "api",
      "plataforma"
    ],
    "testar": "Pegue o ID da fila em Investigar Filas de Distribuição antes de testar aqui.",
    "curl": "curl -X GET \"https://api.contact2sale.com/distribution_queues/{id}/sellers\" \\\n  -H \"Authorization: Bearer {token}\"",
    "videoGroup": "distribuicao-get",
    "status": {
      "validado": false,
      "testadoPostman": false,
      "revisao": "Jul/2026"
    },
    "docOficial": true
  },
  {
    "slug": "atualizar-prioridades-fila",
    "trilha": "api",
    "categoria": "Distribuição",
    "tipo": "procedimento",
    "titulo": "Testar Atualização de Prioridades",
    "resumo": "Atualiza as prioridades dos vendedores dentro de uma fila de distribuição.",
    "keywords": [
      "atualizar",
      "prioridades",
      "fila",
      "testar",
      "atualização"
    ],
    "ordem": 5,
    "favoritavel": true,
    "method": "PUT",
    "path": "/distribution_queues/:id/sellers",
    "quandoUsar": "Use quando o cliente relatar que a ordem de prioridade de uma fila não está sendo respeitada na hora de distribuir leads.",
    "preRequisitos": [],
    "ferramentas": [
      "postman",
      "api",
      "plataforma"
    ],
    "testar": "Teste com uma fila pequena de 2 vendedores para confirmar visualmente a nova ordem antes de aplicar em filas grandes.",
    "curl": "curl -X PUT \"https://api.contact2sale.com/distribution_queues/{id}/sellers\" \\\n  -H \"Authorization: Bearer {token}\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{ }'",
    "videoGroup": "distribuicao-put",
    "status": {
      "validado": false,
      "testadoPostman": false,
      "revisao": "Jul/2026"
    },
    "docOficial": true
  },
  {
    "slug": "redistribuir-lead",
    "trilha": "api",
    "categoria": "Distribuição",
    "tipo": "procedimento",
    "titulo": "Testar Redistribuição de Lead",
    "resumo": "Redistribui um lead específico pela fila, passando para o próximo vendedor da rotação.",
    "keywords": [
      "redistribuir",
      "lead",
      "testar",
      "redistribuição"
    ],
    "ordem": 6,
    "favoritavel": true,
    "method": "POST",
    "path": "/distribution_queues/:id/redistribute",
    "quandoUsar": "Indicado quando o cliente pedir para reprocessar manualmente um lead que ficou parado sem vendedor.",
    "preRequisitos": [],
    "ferramentas": [
      "postman",
      "api",
      "plataforma"
    ],
    "testar": "Use um lead de teste e confirme no painel se o novo vendedor bate com o next_seller esperado da fila.",
    "curl": "curl -X POST \"https://api.contact2sale.com/distribution_queues/{id}/redistribute\" \\\n  -H \"Authorization: Bearer {token}\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"id\":\"{lead_id}\"}'",
    "videoGroup": "distribuicao-post",
    "status": {
      "validado": false,
      "testadoPostman": false,
      "revisao": "Jul/2026"
    },
    "docOficial": true
  },
  {
    "slug": "definir-proximo-vendedor",
    "trilha": "api",
    "categoria": "Distribuição",
    "tipo": "procedimento",
    "titulo": "Testar Definição do Próximo Vendedor",
    "resumo": "Define manualmente o próximo vendedor na rotação da fila.",
    "keywords": [
      "definir",
      "proximo",
      "vendedor",
      "testar",
      "definição",
      "próximo"
    ],
    "ordem": 7,
    "favoritavel": true,
    "method": "PUT",
    "path": "/distribution_queues/:id/next_seller",
    "quandoUsar": "Use quando o cliente pedir para forçar manualmente qual vendedor deve receber o próximo lead da fila.",
    "preRequisitos": [],
    "ferramentas": [
      "postman",
      "api",
      "plataforma"
    ],
    "testar": "Confirme antes que o vendedor escolhido está com status enabled na fila, senão a chamada falha silenciosamente.",
    "curl": "curl -X PUT \"https://api.contact2sale.com/distribution_queues/{id}/next_seller\" \\\n  -H \"Authorization: Bearer {token}\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"next_queue_seller_id\":123}'",
    "videoGroup": "distribuicao-put",
    "status": {
      "validado": false,
      "testadoPostman": false,
      "revisao": "Jul/2026"
    },
    "docOficial": true
  },
  {
    "slug": "assinar-webhook",
    "trilha": "api",
    "categoria": "Webhooks",
    "tipo": "procedimento",
    "titulo": "Testar Assinatura de Webhook",
    "resumo": "Assina eventos de webhook para leads: on_create_lead, on_update_lead ou on_close_lead. Só 1 endpoint por token.",
    "keywords": [
      "assinar",
      "webhook",
      "testar",
      "assinatura"
    ],
    "ordem": 1,
    "favoritavel": true,
    "method": "POST",
    "path": "/api/subscribe",
    "quandoUsar": "Indicado quando o cliente relatar que não está recebendo notificações automáticas de leads no servidor dele.",
    "preRequisitos": [],
    "ferramentas": [
      "postman",
      "api",
      "logs"
    ],
    "testar": "Assine um gatilho de cada vez e teste separadamente. Lembre que cadastrar uma nova URL apaga a assinatura anterior desse token.",
    "curl": "curl -X POST \"https://api.contact2sale.com/api/subscribe\" \\\n  -H \"Authorization: Bearer {token}\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"hook_action\":\"on_create_lead\",\"hook_url\":\"https://seu-servidor.com/webhook\"}'",
    "videoGroup": "webhooks-post",
    "status": {
      "validado": false,
      "testadoPostman": false,
      "revisao": "Jul/2026"
    },
    "docOficial": true
  },
  {
    "slug": "cancelar-webhook",
    "trilha": "api",
    "categoria": "Webhooks",
    "tipo": "procedimento",
    "titulo": "Testar Cancelamento de Webhook",
    "resumo": "Cancela a assinatura de um gatilho de webhook.",
    "keywords": [
      "cancelar",
      "webhook",
      "testar",
      "cancelamento"
    ],
    "ordem": 2,
    "favoritavel": true,
    "method": "POST",
    "path": "/api/unsubscribe",
    "quandoUsar": "Use quando o cliente pedir para parar de receber um determinado evento, ou antes de reconfigurar uma nova URL de destino.",
    "preRequisitos": [],
    "ferramentas": [
      "postman",
      "api",
      "logs"
    ],
    "testar": "Depois de cancelar, dispare a ação correspondente (ex: criar um lead) e confirme que o servidor do cliente não recebeu mais nada.",
    "curl": "curl -X POST \"https://api.contact2sale.com/api/unsubscribe\" \\\n  -H \"Authorization: Bearer {token}\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"hook_action\":\"on_create_lead\"}'",
    "videoGroup": "webhooks-post",
    "status": {
      "validado": false,
      "testadoPostman": false,
      "revisao": "Jul/2026"
    },
    "docOficial": true
  },
  {
    "slug": "listar-estandes",
    "trilha": "api",
    "categoria": "Stand de Vendas",
    "tipo": "procedimento",
    "titulo": "Investigar Lista de Estandes",
    "resumo": "Lista os estandes de vendas acessíveis pela hierarquia, com o formulário associado a cada um.",
    "keywords": [
      "listar",
      "estandes",
      "investigar",
      "lista"
    ],
    "ordem": 1,
    "favoritavel": true,
    "method": "GET",
    "path": "/integration/sales_stand/stands",
    "quandoUsar": "Esse é sempre o primeiro passo ao investigar qualquer caso do módulo Stand de Vendas: os IDs retornados aqui alimentam os outros dois endpoints do módulo.",
    "preRequisitos": [],
    "ferramentas": [
      "postman",
      "api",
      "plataforma"
    ],
    "testar": "Confirme que o módulo Stand de Vendas está ativo na conta do cliente antes de investigar mais a fundo.",
    "curl": "curl -X GET \"https://api.contact2sale.com/integration/sales_stand/stands\" \\\n  -H \"Authorization: Bearer {token}\"",
    "videoGroup": "stand-de-vendas-get",
    "status": {
      "validado": false,
      "testadoPostman": false,
      "revisao": "Jul/2026"
    },
    "docOficial": true
  },
  {
    "slug": "listar-leads-estande",
    "trilha": "api",
    "categoria": "Stand de Vendas",
    "tipo": "procedimento",
    "titulo": "Investigar Leads do Estande",
    "resumo": "Lista os leads capturados em estandes de vendas, paginados de 50 em 50.",
    "keywords": [
      "listar",
      "leads",
      "estande",
      "investigar"
    ],
    "ordem": 2,
    "favoritavel": true,
    "method": "GET",
    "path": "/integration/sales_stand/leads",
    "quandoUsar": "Indicado quando o cliente relatar que leads capturados no estande físico não aparecem no relatório dele.",
    "preRequisitos": [],
    "ferramentas": [
      "postman",
      "api",
      "plataforma"
    ],
    "testar": "Filtre por custom_lead_form_ids usando o ID obtido em Investigar Lista de Estandes para conferir só os leads de um formulário específico.",
    "curl": "curl -X GET \"https://api.contact2sale.com/integration/sales_stand/leads?start_date=2026-07-01&end_date=2026-07-26\" \\\n  -H \"Authorization: Bearer {token}\"",
    "videoGroup": "stand-de-vendas-get",
    "status": {
      "validado": false,
      "testadoPostman": false,
      "revisao": "Jul/2026"
    },
    "docOficial": true
  },
  {
    "slug": "resumo-presencas-estande",
    "trilha": "api",
    "categoria": "Stand de Vendas",
    "tipo": "procedimento",
    "titulo": "Investigar Resumo de Presenças",
    "resumo": "Lista o resumo de presenças por vendedor, gerente ou empresa. start_date e end_date são obrigatórios.",
    "keywords": [
      "resumo",
      "presencas",
      "estande",
      "investigar",
      "presenças"
    ],
    "ordem": 3,
    "favoritavel": true,
    "method": "GET",
    "path": "/integration/sales_stand/attendance_summaries",
    "quandoUsar": "Use quando o cliente questionar os números de um relatório de presença no estande.",
    "preRequisitos": [],
    "ferramentas": [
      "postman",
      "api",
      "plataforma"
    ],
    "testar": "Teste com um período curto (uma semana) primeiro para conferir os números antes de puxar um relatório mensal inteiro.",
    "curl": "curl -X GET \"https://api.contact2sale.com/integration/sales_stand/attendance_summaries?start_date=2026-07-01&end_date=2026-07-26\" \\\n  -H \"Authorization: Bearer {token}\"",
    "videoGroup": "stand-de-vendas-get",
    "status": {
      "validado": false,
      "testadoPostman": false,
      "revisao": "Jul/2026"
    },
    "docOficial": true
  },
  {
    "slug": "listar-blocklist",
    "trilha": "api",
    "categoria": "Blocklist",
    "tipo": "procedimento",
    "titulo": "Investigar Blocklist",
    "resumo": "Lista as entradas da blocklist da hierarquia, da mais recente para a mais antiga.",
    "keywords": [
      "listar",
      "blocklist",
      "investigar"
    ],
    "ordem": 1,
    "favoritavel": true,
    "method": "GET",
    "path": "/integration/hierarchy_blocklists",
    "quandoUsar": "Indicado quando o cliente relatar que um contato não está recebendo leads e a suspeita for de que ele está bloqueado.",
    "preRequisitos": [],
    "ferramentas": [
      "postman",
      "api",
      "plataforma"
    ],
    "testar": "Confirme que o escopo retornado é o da hierarquia correta antes de investigar por que um contato específico está bloqueado.",
    "curl": "curl -X GET \"https://api.contact2sale.com/integration/hierarchy_blocklists\" \\\n  -H \"Authorization: {token}\"",
    "videoGroup": "blocklist-get",
    "status": {
      "validado": false,
      "testadoPostman": false,
      "revisao": "Jul/2026"
    },
    "docOficial": true
  },
  {
    "slug": "adicionar-blocklist",
    "trilha": "api",
    "categoria": "Blocklist",
    "tipo": "procedimento",
    "titulo": "Testar Inclusão na Blocklist",
    "resumo": "Adiciona telefone e/ou email à blocklist da hierarquia. Retorna 409 se já existir.",
    "keywords": [
      "adicionar",
      "blocklist",
      "testar",
      "inclusão"
    ],
    "ordem": 2,
    "favoritavel": true,
    "method": "POST",
    "path": "/integration/hierarchy_blocklists",
    "quandoUsar": "Use quando o cliente pedir para bloquear um contato manualmente, ou quando precisar confirmar se um número já está bloqueado antes de investigar outro sintoma.",
    "preRequisitos": [],
    "ferramentas": [
      "postman",
      "api",
      "plataforma"
    ],
    "testar": "Teste enviando o mesmo telefone em dois formatos diferentes (com e sem DDI) para confirmar que o sistema reconhece como duplicado (409).",
    "curl": "curl -X POST \"https://api.contact2sale.com/integration/hierarchy_blocklists\" \\\n  -H \"Authorization: {token}\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"hierarchy_blocklist\":{\"phone\":\"11999998888\",\"remove_leads\":true}}'",
    "videoGroup": "blocklist-post",
    "status": {
      "validado": false,
      "testadoPostman": false,
      "revisao": "Jul/2026"
    },
    "docOficial": true
  },
  {
    "trilha": "integracoes",
    "tipo": "conceito",
    "keywords": [
      "visao",
      "geral",
      "integracoes",
      "visão",
      "integrações"
    ],
    "favoritavel": true,
    "quandoUsar": "Ponto de partida pra quem for investigar qualquer tipo de integração.",
    "slug": "visao-geral-integracoes",
    "categoria": "Visão Geral",
    "titulo": "Visão Geral de Integrações",
    "resumo": "Como diferentes tipos de sistema costumam se conectar ao C2S. Trilha em construção.",
    "conteudo": [
      "Essa trilha vai reunir o conhecimento sobre os tipos mais comuns de integração que chegam no suporte: portais imobiliários, CRMs de terceiros, automações (N8N, Zapier) e sistemas próprios de clientes. Por enquanto, use a trilha API para os detalhes técnicos de cada endpoint."
    ],
    "ordem": 1
  },
  {
    "trilha": "troubleshooting",
    "tipo": "erro",
    "keywords": [
      "erro",
      "400"
    ],
    "favoritavel": true,
    "quandoUsar": "Use quando o cliente relatar esse sintoma específico, antes de investigar qualquer outra coisa.",
    "slug": "erro-400",
    "categoria": "Códigos de Status",
    "titulo": "Erro 400",
    "resumo": "Bad Request: o corpo da requisição está mal formatado ou inválido.",
    "causaComum": "JSON inválido, campo com tipo errado (string no lugar de number), ou vírgula/aspas faltando no body.",
    "comoInvestigar": [
      "Validar o JSON enviado num validador (ex: jsonlint.com)",
      "Conferir se os tipos batem com o esperado na documentação oficial",
      "Testar o mesmo payload isolado no Postman"
    ],
    "comoResolver": "Corrija o formato do JSON e reenvie. Se persistir mesmo com JSON válido, escale com o payload exato usado.",
    "ordem": 1
  },
  {
    "trilha": "troubleshooting",
    "tipo": "erro",
    "keywords": [
      "erro",
      "401"
    ],
    "favoritavel": true,
    "quandoUsar": "Use quando o cliente relatar esse sintoma específico, antes de investigar qualquer outra coisa.",
    "slug": "erro-401",
    "categoria": "Códigos de Status",
    "titulo": "Erro 401",
    "resumo": "Unauthorized: token ausente ou não reconhecido nesse ponto da cadeia.",
    "causaComum": "A API do C2S normalmente responde 403 pra falha de autenticação, não 401. Um 401 costuma vir de outro sistema na cadeia da integração (ex: o servidor do próprio cliente).",
    "comoInvestigar": [
      "Confirmar em qual sistema o 401 está aparecendo: no C2S ou no sistema do cliente",
      "Se for no C2S, tratar como o verbete de Erro 403 (ver Troubleshooting)"
    ],
    "comoResolver": "Se o 401 vier de fora da API do C2S, oriente o cliente a revisar a autenticação do sistema dele.",
    "ordem": 2
  },
  {
    "trilha": "troubleshooting",
    "tipo": "erro",
    "keywords": [
      "erro",
      "403"
    ],
    "favoritavel": true,
    "quandoUsar": "Use quando o cliente relatar esse sintoma específico, antes de investigar qualquer outra coisa.",
    "slug": "erro-403",
    "categoria": "Códigos de Status",
    "titulo": "Erro 403",
    "resumo": "Forbidden: token ausente, expirado ou inválido na API do C2S.",
    "causaComum": "Token antigo/regenerado, ou header montado errado (faltando 'Bearer ').",
    "comoInvestigar": [
      "Testar o token isolado em GET /integration",
      "Confirmar se o token não foi regenerado no painel do C2S",
      "Conferir se não há espaço ou aspas sobrando no valor do header"
    ],
    "comoResolver": "Gere um token novo no painel e reconfigure o header. Se funciona isolado no Postman mas falha no sistema do cliente, o problema é da integração dele.",
    "ordem": 3
  },
  {
    "trilha": "troubleshooting",
    "tipo": "erro",
    "keywords": [
      "erro",
      "404"
    ],
    "favoritavel": true,
    "quandoUsar": "Use quando o cliente relatar esse sintoma específico, antes de investigar qualquer outra coisa.",
    "slug": "erro-404",
    "categoria": "Códigos de Status",
    "titulo": "Erro 404",
    "resumo": "Not Found: o endpoint ou o recurso não existe.",
    "causaComum": "URL digitada errada, ou um ID (lead, vendedor, fila) que não existe mais ou nunca existiu.",
    "comoInvestigar": [
      "Conferir a URL letra por letra contra a documentação oficial",
      "Confirmar que o ID usado realmente existe (ex: buscando o lead antes)"
    ],
    "comoResolver": "Corrija a URL ou o ID. Se ambos estiverem certos e mesmo assim der 404, escale.",
    "ordem": 4
  },
  {
    "trilha": "troubleshooting",
    "tipo": "erro",
    "keywords": [
      "erro",
      "422"
    ],
    "favoritavel": true,
    "quandoUsar": "Use quando o cliente relatar esse sintoma específico, antes de investigar qualquer outra coisa.",
    "slug": "erro-422",
    "categoria": "Códigos de Status",
    "titulo": "Erro 422",
    "resumo": "Unprocessable Entity: a validação dos dados falhou.",
    "causaComum": "Campo obrigatório ausente, ou valor fora do formato esperado.",
    "comoInvestigar": [
      "Conferir quais campos são obrigatórios para aquele endpoint na documentação oficial",
      "Testar removendo campos opcionais um a um até isolar o campo problemático"
    ],
    "comoResolver": "Ajuste o campo apontado (quando a resposta indicar qual foi) e reenvie.",
    "ordem": 5
  },
  {
    "trilha": "troubleshooting",
    "tipo": "erro",
    "keywords": [
      "erro",
      "500"
    ],
    "favoritavel": true,
    "quandoUsar": "Use quando o cliente relatar esse sintoma específico, antes de investigar qualquer outra coisa.",
    "slug": "erro-500",
    "categoria": "Códigos de Status",
    "titulo": "Erro 500",
    "resumo": "Internal Server Error: falha do lado do servidor do C2S.",
    "causaComum": "Instabilidade momentânea ou um bug real no processamento da requisição.",
    "comoInvestigar": [
      "Tentar reproduzir a chamada de novo depois de alguns segundos",
      "Confirmar se o payload usado é válido (descartar erro do lado de quem chama)"
    ],
    "comoResolver": "Escale sempre, com prints completos do request e do response. Esse é o único status da lista que normalmente não se resolve sozinho.",
    "ordem": 6
  },
  {
    "trilha": "troubleshooting",
    "tipo": "erro",
    "keywords": [
      "webhook",
      "nao",
      "dispara",
      "não"
    ],
    "favoritavel": true,
    "quandoUsar": "Use quando o cliente relatar esse sintoma específico, antes de investigar qualquer outra coisa.",
    "slug": "webhook-nao-dispara",
    "categoria": "Problemas Comuns",
    "titulo": "Webhook não dispara",
    "resumo": "O cliente configurou um webhook, mas não está recebendo os eventos esperados.",
    "causaComum": "Assinatura nunca foi criada, ou um segundo cadastro de URL apagou a assinatura anterior (só existe 1 endpoint por token).",
    "comoInvestigar": [
      "Confirmar com o cliente qual gatilho ele espera (on_create_lead, on_update_lead, on_close_lead)",
      "Reassinar o webhook e testar disparando a ação correspondente",
      "Confirmar que o servidor do cliente responde 200 ao receber o evento"
    ],
    "comoResolver": "Reassine o webhook para o gatilho certo. Lembre o cliente que cadastrar uma nova URL substitui a anterior.",
    "ordem": 1
  },
  {
    "trilha": "troubleshooting",
    "tipo": "erro",
    "keywords": [
      "lead",
      "nao",
      "cria",
      "não"
    ],
    "favoritavel": true,
    "quandoUsar": "Use quando o cliente relatar esse sintoma específico, antes de investigar qualquer outra coisa.",
    "slug": "lead-nao-cria",
    "categoria": "Problemas Comuns",
    "titulo": "Lead não cria",
    "resumo": "A chamada de criação de lead não está funcionando como esperado.",
    "causaComum": "Faltou enviar phone ou email (a API exige ao menos um dos dois, senão retorna 423).",
    "comoInvestigar": [
      "Conferir se o payload enviado tem phone ou email preenchido",
      "Testar um payload mínimo isolado no Postman"
    ],
    "comoResolver": "Garanta que ao menos phone ou email esteja presente no body.",
    "ordem": 2
  },
  {
    "trilha": "troubleshooting",
    "tipo": "erro",
    "keywords": [
      "lead",
      "duplicado"
    ],
    "favoritavel": true,
    "quandoUsar": "Use quando o cliente relatar esse sintoma específico, antes de investigar qualquer outra coisa.",
    "slug": "lead-duplicado",
    "categoria": "Problemas Comuns",
    "titulo": "Lead duplicado",
    "resumo": "O mesmo lead aparece mais de uma vez no painel do cliente.",
    "causaComum": "Reenvio (retry) da mesma requisição de criação pelo sistema de origem, sem checar se o lead já existia.",
    "comoInvestigar": [
      "Comparar o created_at dos leads suspeitos",
      "Verificar se vêm do mesmo external_id/source"
    ],
    "comoResolver": "Veja o caso completo em Casos Reais > Lead duplicado no painel para o passo a passo detalhado.",
    "ordem": 3
  },
  {
    "trilha": "troubleshooting",
    "tipo": "erro",
    "keywords": [
      "token",
      "invalido",
      "inválido"
    ],
    "favoritavel": true,
    "quandoUsar": "Use quando o cliente relatar esse sintoma específico, antes de investigar qualquer outra coisa.",
    "slug": "token-invalido",
    "categoria": "Problemas Comuns",
    "titulo": "Token inválido",
    "resumo": "Sintoma relatado com frequência pelo cliente, geralmente é o mesmo problema do Erro 403.",
    "causaComum": "Token regenerado, expirado, ou header montado errado.",
    "comoInvestigar": [
      "Seguir o mesmo roteiro do verbete Erro 403"
    ],
    "comoResolver": "Ver Erro 403 para o passo a passo completo.",
    "ordem": 4
  },
  {
    "trilha": "troubleshooting",
    "tipo": "erro",
    "keywords": [
      "timeout"
    ],
    "favoritavel": true,
    "quandoUsar": "Use quando o cliente relatar esse sintoma específico, antes de investigar qualquer outra coisa.",
    "slug": "timeout",
    "categoria": "Problemas Comuns",
    "titulo": "Timeout",
    "resumo": "A requisição demora demais e nunca recebe resposta.",
    "causaComum": "Alto volume de requisições em um curto período, instabilidade de rede do cliente, ou lentidão momentânea do servidor.",
    "comoInvestigar": [
      "Medir o tempo de resposta em uma chamada isolada no Postman",
      "Perguntar ao cliente se o timeout acontece em todas as chamadas ou só em algumas",
      "Verificar se não há um loop de retry agravando o volume de chamadas"
    ],
    "comoResolver": "Se for pontual, oriente reenviar. Se for recorrente ou em massa, escale com o horário exato e o volume de chamadas.",
    "ordem": 5
  },
  {
    "trilha": "playbooks",
    "tipo": "playbook",
    "keywords": [
      "checklist",
      "antes",
      "de",
      "escalar"
    ],
    "favoritavel": true,
    "quandoUsar": "Consulte sempre que a situação descrita no título se aplicar ao seu atendimento atual.",
    "slug": "checklist-antes-de-escalar",
    "categoria": "Investigação",
    "titulo": "Checklist antes de escalar",
    "resumo": "Os pontos que você deve confirmar antes de abrir um chamado técnico.",
    "passos": [
      "Testei o token em GET /integration isoladamente?",
      "Confirmei o header correto (Authorization vs Authentication)?",
      "Reproduzi o erro no Postman, fora do sistema do cliente?",
      "Conferi o status code e a página de Troubleshooting?",
      "Verifiquei se é 4xx (provável erro de quem chama) ou 5xx (servidor)?",
      "Busquei um caso parecido em Casos Reais?",
      "Se vou escalar: tenho prints do request e do response completos?"
    ],
    "ordem": 1
  },
  {
    "trilha": "playbooks",
    "tipo": "playbook",
    "keywords": [
      "como",
      "conduzir",
      "investigacao",
      "uma",
      "investigação"
    ],
    "favoritavel": true,
    "quandoUsar": "Consulte sempre que a situação descrita no título se aplicar ao seu atendimento atual.",
    "slug": "como-conduzir-investigacao",
    "categoria": "Investigação",
    "titulo": "Como conduzir uma investigação",
    "resumo": "O roteiro geral pra investigar qualquer problema técnico relatado por um cliente.",
    "passos": [
      "Reproduza o sintoma: peça o passo a passo exato de como o cliente chegou no problema",
      "Valide a autenticação primeiro, sempre (Validar Autenticação)",
      "Isole a chamada específica que está falhando e teste ela sozinha no Postman",
      "Compare o resultado esperado com o que a Plataforma C2S mostra",
      "Só depois de tudo isso, decida se é caso de orientar o cliente ou de escalar"
    ],
    "ordem": 2
  },
  {
    "trilha": "playbooks",
    "tipo": "playbook",
    "keywords": [
      "como",
      "reduzir",
      "tempo",
      "de",
      "atendimento"
    ],
    "favoritavel": true,
    "quandoUsar": "Consulte sempre que a situação descrita no título se aplicar ao seu atendimento atual.",
    "slug": "como-reduzir-tempo-de-atendimento",
    "categoria": "Atendimento",
    "titulo": "Como reduzir tempo de atendimento",
    "resumo": "Hábitos que aceleram uma investigação sem perder qualidade.",
    "passos": [
      "Comece sempre pelo Checklist antes de escalar, muitos casos se resolvem sozinhos ali",
      "Tenha o Postman configurado com Environment pronto, evita perder tempo montando headers toda vez",
      "Use Casos Reais como referência antes de investigar do zero",
      "Documente um caso novo assim que resolver, isso acelera o próximo colega que pegar algo parecido"
    ],
    "ordem": 1
  },
  {
    "trilha": "playbooks",
    "tipo": "playbook",
    "keywords": [
      "mensagens",
      "prontas"
    ],
    "favoritavel": true,
    "quandoUsar": "Consulte sempre que a situação descrita no título se aplicar ao seu atendimento atual.",
    "slug": "mensagens-prontas",
    "categoria": "Atendimento",
    "titulo": "Mensagens prontas",
    "resumo": "Modelos de resposta pra situações recorrentes (adapte o tom antes de enviar).",
    "passos": [
      "Pedido de mais informação: 'Pra investigar isso com precisão, você pode me confirmar o telefone ou email do lead em questão?'",
      "Orientação de token: 'O token usado pode ter sido regenerado no painel. Você pode gerar um novo em Configurações > Integração e testar novamente?'",
      "Encerramento de caso resolvido: 'Confirmamos que o comportamento está correto agora. Qualquer coisa, é só chamar novamente.'"
    ],
    "ordem": 2
  },
  {
    "trilha": "playbooks",
    "tipo": "playbook",
    "keywords": [
      "fluxos",
      "de",
      "atendimento"
    ],
    "favoritavel": true,
    "quandoUsar": "Consulte sempre que a situação descrita no título se aplicar ao seu atendimento atual.",
    "slug": "fluxos-de-atendimento",
    "categoria": "Atendimento",
    "titulo": "Fluxos de atendimento",
    "resumo": "A ordem recomendada de passos, do primeiro contato até o encerramento.",
    "passos": [
      "Primeiro contato: entender o sintoma relatado, sem assumir a causa ainda",
      "Investigação: seguir Como conduzir uma investigação",
      "Resposta: orientar o cliente ou escalar, dependendo da causa raiz encontrada",
      "Encerramento: confirmar com o cliente que o problema foi resolvido",
      "Registro: se for um caso novo ou raro, documentar em Casos Reais"
    ],
    "ordem": 3
  },
  {
    "trilha": "playbooks",
    "tipo": "playbook",
    "keywords": [
      "validacoes",
      "obrigatorias",
      "validações",
      "obrigatórias"
    ],
    "favoritavel": true,
    "quandoUsar": "Consulte sempre que a situação descrita no título se aplicar ao seu atendimento atual.",
    "slug": "validacoes-obrigatorias",
    "categoria": "Investigação",
    "titulo": "Validações obrigatórias",
    "resumo": "O que nunca pode faltar antes de considerar uma investigação encerrada.",
    "passos": [
      "Confirmar que o teste foi reproduzido fora do sistema do cliente (Postman ou API direto)",
      "Confirmar o status code exato retornado, não só 'deu erro'",
      "Confirmar se o comportamento é consistente ou intermitente",
      "Registrar a causa raiz encontrada, mesmo quando o caso não vira uma página de Casos Reais"
    ],
    "ordem": 3
  },
  {
    "slug": "caso-erro-403",
    "trilha": "casos-reais",
    "categoria": "Autenticação",
    "tipo": "caso",
    "titulo": "Cliente recebe 403 ao chamar a API",
    "resumo": "Integração do cliente retorna { \"error\": \"not_authorized\" } com status 403.",
    "keywords": [
      "caso",
      "erro",
      "403",
      "cliente",
      "recebe",
      "chamar",
      "api"
    ],
    "ordem": 1,
    "favoritavel": true,
    "problema": "Integração do cliente retorna { \"error\": \"not_authorized\" } com status 403.",
    "causa": "Na maioria dos casos, é token antigo/regenerado ou header montado errado (faltando 'Bearer ').",
    "investigacao": [
      "Confirmar se o header usado é Authorization (Bearer {token}) ou Authentication",
      "Testar o token isolado no endpoint GET /integration",
      "Verificar se o token não expirou ou foi regenerado no painel do C2S",
      "Confirmar que não há espaço extra ou aspas sobrando no valor do header"
    ],
    "solucao": "Oriente o cliente a gerar um token novo no painel do C2S e reconfigurar o header Authorization como 'Bearer {token}'. Se o token validado manualmente funciona no Postman mas falha no sistema do cliente, o problema é da integração dele.",
    "aprendizados": "Sempre valide o token isolado em GET /integration antes de investigar qualquer outro sintoma. Isso economiza tempo e evita investigar o endpoint errado.",
    "palavrasChave": [
      "caso",
      "erro",
      "403",
      "cliente",
      "recebe",
      "chamar",
      "api"
    ],
    "statusCaso": "Resolvido"
  },
  {
    "slug": "caso-lead-nao-aparece",
    "trilha": "casos-reais",
    "categoria": "Leads",
    "tipo": "caso",
    "titulo": "Lead não aparece na busca do cliente",
    "resumo": "Cliente diz que um lead criado não aparece no CRM dele.",
    "keywords": [
      "caso",
      "lead",
      "nao",
      "aparece",
      "não",
      "busca",
      "cliente"
    ],
    "ordem": 1,
    "favoritavel": true,
    "problema": "Cliente diz que um lead criado não aparece no CRM dele.",
    "causa": "Geralmente é filtro de status ou de data na integração do próprio cliente, não um bug da API.",
    "investigacao": [
      "Buscar o lead em /integration/leads filtrando por phone ou email do cliente final",
      "Conferir o campo status do lead, pode estar arquivado ou em um status que a integração do cliente ignora",
      "Conferir created_at e updated_at para saber se o filtro de data da integração do cliente cobre o período",
      "Verificar from_hierarchy_company se a empresa usa hierarquia, o lead pode ter sido criado em outra sub-empresa"
    ],
    "solucao": "Confirme que o lead existe via GET /integration/leads filtrando por phone/email. Se existir e estiver com status esperado, oriente o cliente a revisar o filtro de status/data da integração dele antes de escalar.",
    "aprendizados": "'Lead sumiu' quase nunca é a API. Comece sempre confirmando se o lead existe antes de suspeitar de bug.",
    "palavrasChave": [
      "caso",
      "lead",
      "nao",
      "aparece",
      "não",
      "busca",
      "cliente"
    ],
    "statusCaso": "Resolvido"
  },
  {
    "slug": "caso-lead-duplicado",
    "trilha": "casos-reais",
    "categoria": "Leads",
    "tipo": "caso",
    "titulo": "Lead duplicado no painel",
    "resumo": "O mesmo lead aparece duas ou mais vezes no painel do cliente.",
    "keywords": [
      "duplicado",
      "lead",
      "dedupe"
    ],
    "ordem": 2,
    "favoritavel": true,
    "problema": "Cliente relata que o mesmo cliente final gerou vários leads iguais no painel em um curto intervalo de tempo.",
    "causa": "Na maioria das vezes, o sistema de origem do cliente está reenviando a mesma requisição de criação de lead (por retry automático ou por um webhook duplicado), e o e-mail/telefone não bateu com nenhuma regra de deduplicação.",
    "investigacao": [
      "Buscar os leads duplicados em GET /integration/leads filtrando por phone ou email",
      "Comparar os created_at dos leads suspeitos, duplicidade por retry costuma ter poucos segundos de diferença",
      "Verificar external_id e source de cada um, se vierem do mesmo parceiro isso reforça a suspeita de reenvio",
      "Perguntar ao cliente se a integração dele tem lógica de retry em caso de timeout"
    ],
    "solucao": "Confirme com o cliente se a integração dele reenvia em caso de timeout sem verificar se o lead anterior foi criado. Oriente a implementar uma verificação de idempotência (ex: checar por email/telefone antes de criar) do lado dele.",
    "aprendizados": "A API do C2S não tem deduplicação automática por padrão, então isso precisa ser tratado no lado de quem está criando os leads.",
    "palavrasChave": [
      "duplicado",
      "lead",
      "retry",
      "dedupe"
    ],
    "statusCaso": "Resolvido"
  },
  {
    "slug": "caso-problema-distribuicao",
    "trilha": "casos-reais",
    "categoria": "Distribuição",
    "tipo": "caso",
    "titulo": "Vendedor não recebe leads da fila",
    "resumo": "Um vendedor específico deveria estar recebendo leads de uma fila de distribuição, mas não está.",
    "keywords": [
      "distribuicao",
      "fila",
      "vendedor"
    ],
    "ordem": 1,
    "favoritavel": true,
    "problema": "Cliente relata que um vendedor cadastrado numa fila de distribuição não está recebendo os leads esperados.",
    "causa": "O vendedor pode estar com status diferente de enabled dentro daquela fila específica, mesmo estando ativo na empresa.",
    "investigacao": [
      "Confirmar o ID da fila em GET /distribution_queues",
      "Listar os vendedores da fila em GET /distribution_queues/:id/sellers e conferir o status de cada um",
      "Comparar com a lista geral de vendedores em GET /sellers pra confirmar que ele está ativo na empresa",
      "Verificar se existe alguma regra de distribuição (GET /distribution_rules) direcionando os leads pra outro vendedor antes de chegar na fila"
    ],
    "solucao": "Se o vendedor estiver desabilitado só na fila, reabilite via PUT /distribution_queues/:id/sellers. Se o problema for uma regra de distribuição concorrente, ajuste a prioridade dela.",
    "aprendizados": "Vendedor ativo na empresa não significa vendedor ativo numa fila específica, são dois status independentes.",
    "palavrasChave": [
      "distribuicao",
      "fila",
      "vendedor",
      "rotacao"
    ],
    "statusCaso": "Resolvido"
  },
  {
    "trilha": "boas-praticas",
    "tipo": "playbook",
    "keywords": [
      "comunicacao",
      "com",
      "cliente",
      "comunicação"
    ],
    "favoritavel": true,
    "quandoUsar": "Vale revisar periodicamente, não só quando surge um problema.",
    "slug": "comunicacao-com-cliente",
    "categoria": "Comunicação",
    "titulo": "Comunicação com o cliente",
    "resumo": "Como explicar um problema técnico sem parecer que está \"empurrando\" a culpa pro lado do cliente.",
    "passos": [
      "Descreva o que foi testado e o resultado, antes de qualquer conclusão",
      "Evite dizer 'o problema é da sua integração' sem antes mostrar a evidência",
      "Sempre que possível, ofereça o próximo passo concreto, não só o diagnóstico"
    ],
    "ordem": 1
  },
  {
    "trilha": "boas-praticas",
    "tipo": "playbook",
    "keywords": [
      "registro",
      "de",
      "atendimento"
    ],
    "favoritavel": true,
    "quandoUsar": "Vale revisar periodicamente, não só quando surge um problema.",
    "slug": "registro-de-atendimento",
    "categoria": "Processo",
    "titulo": "Registro de atendimento",
    "resumo": "O mínimo que todo atendimento técnico deveria deixar registrado.",
    "passos": [
      "O sintoma exato relatado pelo cliente",
      "O que foi testado e o resultado (com prints quando fizer sentido)",
      "A causa raiz identificada",
      "A orientação dada ou o motivo do escalonamento"
    ],
    "ordem": 1
  },
  {
    "trilha": "boas-praticas",
    "tipo": "playbook",
    "keywords": [
      "postura",
      "em",
      "investigacoes",
      "tecnicas",
      "investigações",
      "técnicas"
    ],
    "favoritavel": true,
    "quandoUsar": "Vale revisar periodicamente, não só quando surge um problema.",
    "slug": "postura-em-investigacoes-tecnicas",
    "categoria": "Processo",
    "titulo": "Postura em investigações técnicas",
    "resumo": "Como manter o rigor técnico sem travar o atendimento.",
    "passos": [
      "Teste antes de afirmar, nunca assuma a causa sem reproduzir",
      "Se não souber, é melhor dizer 'vou validar e retorno' do que arriscar uma resposta errada",
      "Peça ajuda de um colega mais experiente quando o caso fugir do padrão, isso não é fraqueza, é eficiência"
    ],
    "ordem": 2
  },
  {
    "trilha": "ferramentas",
    "tipo": "ferramenta",
    "keywords": [
      "postman"
    ],
    "favoritavel": true,
    "slug": "postman",
    "categoria": "Ferramentas de Teste",
    "titulo": "Postman",
    "resumo": "Onde você testa a API sem precisar escrever código, ótimo pra validar um caso antes de decidir se escala ou não.",
    "quandoUsar": "Use sempre que precisar reproduzir uma chamada isolada, fora do sistema do cliente, pra confirmar se o problema é da API ou da integração dele.",
    "linkUrl": "https://www.postman.com/",
    "linkLabel": "Abrir Postman",
    "collectionUrl": "",
    "passos": [
      "Criar uma Collection nova chamada \"C2S API\"",
      "Criar um Environment com as variáveis base_url (https://api.contact2sale.com/integration) e token",
      "Na aba Authorization da requisição, selecionar Bearer Token e usar {{token}}",
      "Criar a primeira requisição: GET {{base_url}} para validar o token",
      "Se vier 200 com os dados da empresa, o token está OK",
      "Duplicar a requisição para testar os outros endpoints"
    ],
    "ordem": 1
  }
];

const CHANGELOG = [
  {
    "versao": "6.0",
    "data": "03 Ago 2026",
    "itens": [
      "Reestruturação completa: a plataforma deixou de ser só \"API Academy\" e virou Support Academy, uma base de conhecimento do suporte organizada por trilhas",
      "Novas trilhas: Fundamentos, Integrações, Troubleshooting, Playbooks, Boas Práticas e Ferramentas, além de API e Casos Reais",
      "Arquitetura de dados unificada (CONTEUDOS): qualquer trilha nova é só um objeto novo no data.js, sem precisar mexer no app.js",
      "Favoritos e progresso (não iniciado, em andamento, concluído) salvos no navegador de cada pessoa",
      "Breadcrumb, navegação de conteúdo anterior/próximo, e busca global cobrindo todas as trilhas",
      "Dashboard na home com números dinâmicos (procedimentos, vídeos, trilhas, casos reais)",
      "Checklist de escalonamento migrado para dentro de Playbooks",
      "Nenhum conteúdo da API foi perdido: os 35 procedimentos e os 18 grupos de vídeo continuam intactos"
    ]
  },
  {
    "versao": "5.0",
    "data": "01 Ago 2026",
    "itens": [
      "Sistema de design elevado: sombras/elevação consistentes, curva de easing premium, brilho de destaque sutil (glow) usado com critério",
      "Microinterações: cards com lift ao passar o mouse, botões com feedback de clique, thumbnail do Loom com zoom sutil, checkbox customizado e animado no Checklist",
      "Transição de entrada suave (fade + slide) a cada navegação entre páginas",
      "Indicador de item ativo na barra lateral com barra de destaque à esquerda",
      "Hero da home com brilho radial discreto e título com leve gradiente, sem aplicar esse efeito nas páginas de trabalho (procedimentos, tabelas, código) para manter a legibilidade em uso prolongado",
      "Scrollbar customizada, hover em linhas de tabela, sombra e transições refinadas em botões e blocos de informação"
    ]
  },
  {
    "versao": "4.0",
    "data": "01 Ago 2026",
    "itens": [
      "Documentação reorganizada por módulo de negócio, não só por URL: Adicionar/Remover Tag do Lead saem de Leads e passam a viver em Tags, já que compartilham vídeo com os demais procedimentos de Tags",
      "Vídeos adicionados: Autenticação (GET) e Leads (GET, cobrindo Listar Leads, Buscar Lead e Listar Tags de um Lead)",
      "Botão de destaque para abrir o Postman na aba Postman, com espaço reservado para o link da Collection oficial",
      "Player de vídeo do Loom redesenhado: tamanho grande, thumbnail em destaque, abre em nova aba ao clicar em qualquer área",
      "Novo cabeçalho automático em toda página com vídeo: Objetivo, Endpoints abordados, Pré-requisitos e Tempo estimado, gerado a partir do VIDEO_GROUPS (sem duplicar conteúdo)",
      "Barra lateral: dentro de cada categoria, os procedimentos agora aparecem agrupados por método HTTP (GET, POST, PUT, DELETE)",
      "Nenhum procedimento foi removido; os 35 continuam existindo, cada um com sua própria página"
    ]
  },
  {
    "versao": "3.0",
    "data": "31 Jul 2026",
    "itens": [
      "Vídeos reorganizados por recurso + método HTTP (ex: Leads GET, Vendedores PUT), 18 grupos no total, a pedido da liderança do suporte",
      "Cada página de procedimento mostra o exemplo principal do vídeo e cita os outros endpoints parecidos abordados nele",
      "Categorias da barra lateral viraram pastas clicáveis (abre/fecha), a categoria do procedimento atual abre sozinha",
      "Removido o suporte a vídeo local embutido: todos os vídeos passam a ser link (Loom)",
      "Nenhum procedimento foi removido; os 35 continuam existindo, cada um com sua própria página"
    ]
  },
  {
    "versao": "2.1",
    "data": "31 Jul 2026",
    "itens": [
      "Rollback da estratégia de vídeo por padrão de requisição: voltamos a 1 vídeo por procedimento",
      "Primeiro vídeo real adicionado: Validar Autenticação, com player embutido na própria página",
      "Suporte a vídeo local (arquivo .mp4 dentro da pasta videos/) além de links externos (Loom, YouTube etc)"
    ]
  },
  {
    "versao": "2.0",
    "data": "27 Jul 2026",
    "itens": [
      "Nova estratégia de vídeo: em vez de 1 vídeo por endpoint, os vídeos agora ensinam padrões de requisição (GET, POST, PUT) e são compartilhados entre procedimentos parecidos",
      "Webhooks e Casos Reais continuam com vídeo exclusivo",
      "Cada página de procedimento mostra o vídeo do padrão e explica o que ele cobre, deixando claro que não é exclusivo daquele endpoint",
      "Vídeo dedicado adicionado à página Casos Reais",
      "Textos de Listar Tags, Adicionar Tag e Remover Tag enriquecidos com passos de validação e erros comuns",
      "Nenhum procedimento foi removido; os 35 continuam existindo, cada um com sua própria página"
    ]
  },
  {
    "versao": "1.5",
    "data": "27 Jul 2026",
    "itens": [
      "Revisão de português em todos os blocos \"Quando utilizar\" e \"Como testar\" dos 33 procedimentos",
      "Corrigida a frase de abertura de Validar Autenticação e outras construções repetitivas ou confusas",
      "Variação nas aberturas de frase (Use / Indicado quando / Esse é o primeiro passo) para reduzir repetição"
    ]
  },
  {
    "versao": "1.4",
    "data": "27 Jul 2026",
    "itens": [
      "Tema claro ajustado: tons de branco menos estourados, superfícies em cinza claro em camadas",
      "Badge de versão da home corrigido para puxar a versão atual automaticamente",
      "Página de Changelog removida da navegação"
    ]
  },
  {
    "versao": "1.3",
    "data": "27 Jul 2026",
    "itens": [
      "Favicon adicionado (ícone </> em azul, combinando com a identidade visual)",
      "Botão \"Voltar\" no topo de toda página, essencial para navegação no celular",
      "Tema claro adicionado, com alternância salva no navegador da pessoa"
    ]
  },
  {
    "versao": "1.2",
    "data": "26 Jul 2026",
    "itens": [
      "Reformulado como ferramenta de trabalho do suporte, não documentação de API: títulos orientados à ação (Investigar/Testar), bloco \"Quando utilizar\" e \"Ferramentas necessárias\" em cada procedimento",
      "Selo de status por procedimento: validado pelo suporte, vídeo disponível, testado no Postman e última revisão",
      "Status de validação começam como pendentes; são marcados como concluídos conforme cada procedimento é realmente executado"
    ]
  },
  {
    "versao": "1.1",
    "data": "26 Jul 2026",
    "itens": [
      "Todos os endpoints da API mapeados: Leads, Vendedores, Empresas, Tags, Distribuição, Webhooks, Stand de Vendas e Blocklist",
      "Páginas de endpoint simplificadas: sem tabela de parâmetros e sem response completo",
      "Paleta atualizada para grafite e azul, sem emoji na interface"
    ]
  },
  {
    "versao": "1.0",
    "data": "26 Jul 2026",
    "itens": [
      "Estrutura inicial da trilha (Fundamentos, Endpoints, Postman, Troubleshooting, Casos Reais, Checklist)",
      "Endpoints iniciais: Verificar autenticação e Listar leads",
      "2 casos reais documentados"
    ]
  }
];

