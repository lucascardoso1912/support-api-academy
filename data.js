// ============================================================
// SUPPORT API ACADEMY - base de dados de procedimentos
//
// Cada item aqui não é "documentação de endpoint": é um
// procedimento guiado de investigação/teste para o suporte.
// A doc oficial da API já cobre parâmetros e responses. Aqui
// o foco é: quando usar isso, com o que testar, e o vídeo
// mostrando o teste sendo feito de verdade.
//
// IMPORTANTE sobre o bloco de status: "validado" e
// "testadoPostman" começam como false de propósito. Só marque
// true depois de você mesmo ter executado o teste. É isso que
// dá credibilidade ao selo, forjar o status tira o valor dele.
//
// Para adicionar um procedimento novo, copie um objeto do
// array ENDPOINTS, preencha os campos e pronto: ele aparece
// sozinho no menu, na busca e ganha sua própria página.
// ============================================================

const CATEGORIES = [
  "Autenticação",
  "Leads",
  "Vendedores",
  "Empresas",
  "Tags",
  "Distribuição",
  "Webhooks",
  "Stand de Vendas",
  "Blocklist"
];

// Ferramentas possíveis: "postman", "api", "plataforma", "logs"
const TOOLS = {
  postman: { label: "Postman" },
  api: { label: "API C2S" },
  plataforma: { label: "Plataforma C2S" },
  logs: { label: "Logs da integração" }
};

// ============================================================
// VÍDEOS por recurso (URL) + método HTTP.
//
// Feedback da liderança: não faz sentido gravar um vídeo pra
// cada endpoint, muitos são bem parecidos entre si. Então os
// vídeos agora cobrem "esse recurso + esse método" (ex: Leads
// GET, Leads POST), mostrando o exemplo principal na tela e
// citando os outros endpoints parecidos como exemplo extra.
//
// Todos os vídeos serão hospedados no Loom. Cole o link no
// campo "video" do grupo correspondente quando estiver pronto,
// ele passa a valer pra todos os procedimentos daquele grupo.
// ============================================================
const VIDEO_GROUPS = {
  "autenticacao-get": {
    titulo: "Autenticação: validando o token (GET)",
    resumo: "Como confirmar que um token é válido antes de investigar qualquer outra coisa.",
    exemploPrincipal: "Validar Autenticação",
    outrosExemplos: [],
    ensina: [
      "Como montar uma requisição GET",
      "Como usar o header Authorization Bearer",
      "Como interpretar HTTP 200 e HTTP 403"
    ],
    video: ""
  },
  "leads-get": {
    titulo: "Leads: requisições GET",
    resumo: "Como investigar leads, seja em listagem, busca por ID ou consulta de tags.",
    exemploPrincipal: "Investigar Listagem de Leads",
    outrosExemplos: ["Investigar Lead Específico", "Investigar Tags de um Lead"],
    ensina: [
      "Como montar a requisição e usar filtros",
      "Como interpretar HTTP 200 e HTTP 403",
      "Como validar o retorno contra a Plataforma C2S",
      "Erros comuns em requisições GET de Leads"
    ],
    video: ""
  },
  "leads-post": {
    titulo: "Leads: requisições POST",
    resumo: "Como criar e registrar informações em um lead usando body JSON.",
    exemploPrincipal: "Testar Criação de Lead",
    outrosExemplos: ["Testar Adição de Tag", "Testar Criação de Mensagem", "Testar Criação de Atividade", "Testar Fechamento de Negócio"],
    ensina: [
      "Como montar o body em JSON",
      "Campos obrigatórios x opcionais",
      "Validação do resultado na Plataforma C2S",
      "Erros comuns (400, 422, 423)"
    ],
    video: ""
  },
  "leads-put": {
    titulo: "Leads: requisições PUT",
    resumo: "Como atualizar um lead existente e confirmar que a mudança foi aplicada.",
    exemploPrincipal: "Testar Atualização de Lead",
    outrosExemplos: ["Testar Encaminhamento de Lead", "Testar Marcação de Lead como Lido", "Testar Atualização de Status"],
    ensina: [
      "Diferença entre atualizar um campo simples e um body completo",
      "Validação do resultado após a atualização",
      "Erros comuns em requisições PUT de Leads"
    ],
    video: ""
  },
  "leads-delete": {
    titulo: "Leads: requisição DELETE",
    resumo: "Como remover uma tag de um lead e confirmar que ela realmente saiu.",
    exemploPrincipal: "Testar Remoção de Tag",
    outrosExemplos: [],
    ensina: [
      "Como montar uma requisição DELETE com body",
      "Diferença entre remover 1 tag e remover várias de uma vez",
      "Como validar a remoção"
    ],
    video: ""
  },
  "vendedores-get": {
    titulo: "Vendedores: requisição GET",
    resumo: "Como investigar a lista de vendedores da empresa.",
    exemploPrincipal: "Investigar Lista de Vendedores",
    outrosExemplos: [],
    ensina: ["Como montar a requisição", "Como usar o ID retornado em outras chamadas (encaminhar lead, filas etc)"],
    video: ""
  },
  "vendedores-post": {
    titulo: "Vendedores: requisição POST",
    resumo: "Como criar um vendedor novo na empresa.",
    exemploPrincipal: "Testar Criação de Vendedor",
    outrosExemplos: [],
    ensina: ["Como montar o body em JSON", "Campo company_id e erros comuns de empresa errada"],
    video: ""
  },
  "vendedores-put": {
    titulo: "Vendedores: requisições PUT",
    resumo: "Como atualizar dados de um vendedor, individualmente ou em lote.",
    exemploPrincipal: "Testar Atualização de Vendedor",
    outrosExemplos: ["Testar Atualização de Rotação em Lote"],
    ensina: ["Atualização de campo simples x campos de rotação/distribuição", "Como testar em lote com segurança"],
    video: ""
  },
  "empresas-get": {
    titulo: "Empresas: requisição GET",
    resumo: "Como investigar as empresas do grupo (filiais) de uma hierarquia.",
    exemploPrincipal: "Investigar Empresas do Grupo",
    outrosExemplos: [],
    ensina: ["Como montar a requisição", "Quando usar isso como primeiro passo de uma investigação de hierarquia"],
    video: ""
  },
  "tags-get": {
    titulo: "Tags: requisição GET",
    resumo: "Como investigar as tags cadastradas na empresa.",
    exemploPrincipal: "Investigar Lista de Tags",
    outrosExemplos: [],
    ensina: ["Como montar a requisição e usar os filtros", "Como usar o ID retornado para Adicionar Tag a um lead"],
    video: ""
  },
  "tags-post": {
    titulo: "Tags: requisição POST",
    resumo: "Como criar uma tag nova e o comportamento de deduplicação.",
    exemploPrincipal: "Testar Criação de Tag",
    outrosExemplos: [],
    ensina: ["Como montar o body em JSON", "Comportamento ao criar uma tag repetida (201 com chave errors)"],
    video: ""
  },
  "distribuicao-get": {
    titulo: "Distribuição: requisições GET",
    resumo: "Como investigar regras e filas de distribuição de leads entre vendedores.",
    exemploPrincipal: "Investigar Regras de Distribuição",
    outrosExemplos: ["Investigar Filas de Distribuição", "Investigar Vendedores de uma Fila"],
    ensina: ["Como montar a requisição", "Como ler os headers de paginação", "Como comparar o retorno com o painel"],
    video: ""
  },
  "distribuicao-post": {
    titulo: "Distribuição: requisições POST",
    resumo: "Como criar uma regra de distribuição e redistribuir um lead manualmente.",
    exemploPrincipal: "Testar Criação de Regra de Distribuição",
    outrosExemplos: ["Testar Redistribuição de Lead"],
    ensina: ["Como montar o body em JSON", "Como validar o efeito da regra no painel"],
    video: ""
  },
  "distribuicao-put": {
    titulo: "Distribuição: requisições PUT",
    resumo: "Como atualizar prioridades de uma fila e definir o próximo vendedor da rotação.",
    exemploPrincipal: "Testar Atualização de Prioridades",
    outrosExemplos: ["Testar Definição do Próximo Vendedor"],
    ensina: ["Como montar o body em JSON", "Erros comuns quando o vendedor não está habilitado na fila"],
    video: ""
  },
  "webhooks-post": {
    titulo: "Webhooks: assinatura e cancelamento",
    resumo: "Como configurar, testar e confirmar o recebimento de eventos de webhook.",
    exemploPrincipal: "Testar Assinatura de Webhook",
    outrosExemplos: ["Testar Cancelamento de Webhook"],
    ensina: [
      "Como assinar um gatilho (on_create_lead, on_update_lead, on_close_lead)",
      "A regra de 1 endpoint por token",
      "Como confirmar o recebimento no servidor do cliente",
      "Erros comuns de configuração"
    ],
    video: ""
  },
  "stand-de-vendas-get": {
    titulo: "Stand de Vendas: requisições GET",
    resumo: "Como investigar estandes, leads capturados e resumo de presenças.",
    exemploPrincipal: "Investigar Lista de Estandes",
    outrosExemplos: ["Investigar Leads do Estande", "Investigar Resumo de Presenças"],
    ensina: ["Por que sempre começar por Listar Estandes", "Como usar os IDs retornados nos outros dois endpoints do módulo"],
    video: ""
  },
  "blocklist-get": {
    titulo: "Blocklist: requisição GET",
    resumo: "Como investigar a blocklist de contatos de uma hierarquia.",
    exemploPrincipal: "Investigar Blocklist",
    outrosExemplos: [],
    ensina: ["Como montar a requisição", "Escopo por hierarquia"],
    video: ""
  },
  "blocklist-post": {
    titulo: "Blocklist: requisição POST",
    resumo: "Como adicionar um contato à blocklist e o comportamento de duplicidade.",
    exemploPrincipal: "Testar Inclusão na Blocklist",
    outrosExemplos: [],
    ensina: ["Como montar o body em JSON", "Como o telefone é normalizado", "Erro 409 de contato já bloqueado"],
    video: ""
  }
};

const ENDPOINTS = [
  // ---------------- Autenticação ----------------
  {
    slug: "verificar-autenticacao",
    method: "GET",
    path: "/integration",
    title: "Validar Autenticação",
    category: "Autenticação",
    summary: "Confirma se um token está válido e retorna os dados da empresa autenticada.",
    quandoUsar: "Esse é sempre o primeiro passo de qualquer investigação técnica. Use também quando o cliente relatar erro de acesso à API, antes de testar qualquer outro endpoint.",
    ferramentas: ["postman", "api"],
    testar: "Chame o endpoint sozinho, sem mais nada. Se voltar 200 com o nome da empresa, o token está válido. Se voltar 403, o problema é o token, antes mesmo de qualquer outra investigação.",
    curl: `curl -X GET "https://api.contact2sale.com/integration" \\
  -H "Authorization: Bearer {token}"`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    videoGroup: "autenticacao-get"
  },

  // ---------------- Leads ----------------
  {
    slug: "listar-leads",
    method: "GET",
    path: "/integration/leads",
    title: "Investigar Listagem de Leads",
    category: "Leads",
    summary: "Confirma se a API está retornando corretamente os leads da empresa, com filtros e paginação.",
    quandoUsar: "Use quando um cliente relatar divergências na listagem de leads, ou quando precisar confirmar se um lead específico está sendo retornado pela API.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Teste filtrando por phone ou email do cliente reclamado, é o jeito mais rápido de achar um lead específico numa investigação.",
    curl: `curl -X GET "https://api.contact2sale.com/integration/leads?status=em_negociacao&perpage=50" \\
  -H "Authorization: Bearer {token}"`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    videoGroup: "leads-get"
  },
  {
    slug: "buscar-lead",
    method: "GET",
    path: "/integration/leads/:id",
    title: "Investigar Lead Específico",
    category: "Leads",
    summary: "Retorna todo o detalhe de um lead pelo ID: histórico, mensagens e agendamentos.",
    quandoUsar: "Use quando já souber o ID do lead e precisar conferir o histórico completo dele, por exemplo para confirmar se uma mensagem ou atividade foi registrada corretamente.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Pegue o ID de um lead retornado em Investigar Listagem de Leads e chame este endpoint para conferir o detalhe completo dele.",
    curl: `curl -X GET "https://api.contact2sale.com/integration/leads/{id}" \\
  -H "Authorization: Bearer {token}"`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    videoGroup: "leads-get"
  },
  {
    slug: "criar-lead",
    method: "POST",
    path: "/integration/leads",
    title: "Testar Criação de Lead",
    category: "Leads",
    summary: "Cria um novo lead. É obrigatório enviar ao menos phone ou email, senão a API retorna 423.",
    quandoUsar: "Indicado quando o cliente relatar que leads não estão sendo criados pela integração dele: ajuda a isolar se o problema está na API ou no sistema de origem.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Envie um body mínimo só com name, phone e description para validar que o token tem permissão de criação antes de testar campos avançados.",
    curl: `curl -X POST "https://api.contact2sale.com/integration/leads" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"data":{"type":"lead","attributes":{"name":"Teste","phone":"11999999999"}}}'`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    videoGroup: "leads-post"
  },
  {
    slug: "atualizar-lead",
    method: "PUT",
    path: "/integration/leads/:id",
    title: "Testar Atualização de Lead",
    category: "Leads",
    summary: "Atualiza um lead existente. Suporta 3 formatos de body diferentes.",
    quandoUsar: "Use quando o cliente relatar que uma atualização (novo telefone, novo status do produto etc) não está refletindo no lead dentro do C2S.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Teste primeiro atualizando um único campo simples (como o nome do cliente) antes de testar o body completo, ajuda a isolar qual formato o sistema do cliente está usando.",
    curl: `curl -X PUT "https://api.contact2sale.com/integration/leads/{id}" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"lead":{"customer":{"name":"Nome Atualizado"}}}'`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    videoGroup: "leads-put"
  },
  {
    slug: "encaminhar-lead",
    method: "PUT",
    path: "/integration/leads/:id/forward",
    title: "Testar Encaminhamento de Lead",
    category: "Leads",
    summary: "Encaminha um lead de um vendedor para outro.",
    quandoUsar: "Indicado quando o cliente relatar que um lead não mudou de vendedor após uma tentativa de encaminhamento pela integração dele.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Confirme antes os IDs criptografados dos dois vendedores (origem e destino) usando o procedimento Investigar Lista de Vendedores.",
    curl: `curl -X PUT "https://api.contact2sale.com/integration/leads/{id}/forward" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"seller_from_id":"{id_origem}","seller_to_id":"{id_destino}"}'`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    videoGroup: "leads-put"
  },
  {
    slug: "listar-tags-lead",
    method: "GET",
    path: "/integration/leads/:id/tags",
    title: "Investigar Tags de um Lead",
    category: "Leads",
    summary: "Retorna todas as tags associadas a um lead específico.",
    quandoUsar: "Use quando o cliente relatar que uma tag esperada não aparece no lead, ou para conferir o estado atual antes de adicionar ou remover uma tag.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Use num lead que você já sabe que tem tag para confirmar visualmente que a resposta bate com o painel do C2S. Esse endpoint é o que você usa para validar qualquer teste de Adicionar ou Remover Tag.",
    curl: `curl -X GET "https://api.contact2sale.com/integration/leads/{id}/tags" \\
  -H "Authorization: Bearer {token}"`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    videoGroup: "leads-get"
  },
  {
    slug: "adicionar-tag-lead",
    method: "POST",
    path: "/integration/leads/:id/tags",
    title: "Testar Adição de Tag",
    category: "Leads",
    summary: "Adiciona uma tag já existente a um lead.",
    quandoUsar: "Indicado quando o cliente relatar que a tag enviada pela integração dele não está sendo aplicada ao lead.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Pegue o ID de uma tag em Investigar Lista de Tags antes de testar aqui (a tag precisa já existir na empresa). Depois de adicionar, confira em Investigar Tags de um Lead se ela aparece na lista, essa é a validação que fecha o teste. Erro comum: usar o nome da tag em vez do ID criptografado.",
    curl: `curl -X POST "https://api.contact2sale.com/integration/leads/{id}/tags" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"tag_id":"{tag_id}"}'`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    videoGroup: "leads-post"
  },
  {
    slug: "remover-tag-lead",
    method: "DELETE",
    path: "/integration/leads/:id/tags",
    title: "Testar Remoção de Tag",
    category: "Leads",
    summary: "Remove uma ou mais tags de um lead. Aceita tag_id como string única ou array.",
    quandoUsar: "Use quando uma tag precisar ser removida em massa, ou quando o cliente relatar que a remoção pela integração dele não está funcionando.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Teste primeiro removendo uma única tag antes de testar com array de várias tags de uma vez. Depois de remover, confirme em Investigar Tags de um Lead que ela realmente sumiu da lista. Erro comum: reenviar o tag_id de uma tag que já foi removida.",
    curl: `curl -X DELETE "https://api.contact2sale.com/integration/leads/{id}/tags" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"tag_id":"{tag_id}"}'`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    videoGroup: "leads-delete"
  },
  {
    slug: "marcar-lead-lido",
    method: "PUT",
    path: "/integration/leads/:id/read",
    title: "Testar Marcação de Lead como Lido",
    category: "Leads",
    summary: "Marca um lead como lido ou interagido.",
    quandoUsar: "Indicado quando o cliente relatar que leads continuam aparecendo como não lidos mesmo depois da interação pelo sistema dele.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Confirme no painel do C2S, antes e depois da chamada, que o indicador de não lido do lead sumiu.",
    curl: `curl -X PUT "https://api.contact2sale.com/integration/leads/{id}/read" \\
  -H "Authorization: Bearer {token}"`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    videoGroup: "leads-put"
  },
  {
    slug: "criar-mensagem-lead",
    method: "POST",
    path: "/integration/leads/:id/messages",
    title: "Testar Criação de Mensagem",
    category: "Leads",
    summary: "Cria uma mensagem dentro de um lead, para registrar o histórico de conversa vindo de um canal externo.",
    quandoUsar: "Use quando o cliente relatar que mensagens de um canal (WhatsApp, chat do site) não estão aparecendo no histórico do lead.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Envie uma mensagem de teste com o campo origin preenchido (ex: whatsapp) e confirme que ela aparece no card do lead no C2S.",
    curl: `curl -X POST "https://api.contact2sale.com/integration/leads/{id}/messages" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"body":"Mensagem de teste","from":"bot"}'`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    videoGroup: "leads-post"
  },
  {
    slug: "criar-atividade-lead",
    method: "POST",
    path: "/integration/leads/:id/activities",
    title: "Testar Criação de Atividade",
    category: "Leads",
    summary: "Cria uma atividade (agendamento) em um lead, com data, título e opção de notificação push.",
    quandoUsar: "Indicado quando o cliente relatar que agendamentos criados pela integração dele não aparecem para o vendedor, ou que a notificação não chegou.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Teste com send_push true e confirme se o vendedor responsável recebeu a notificação.",
    curl: `curl -X POST "https://api.contact2sale.com/integration/leads/{id}/activities" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"date":"2026-08-01T14:00:00Z","type":{"activity":true},"body":"Retornar contato"}'`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    videoGroup: "leads-post"
  },
  {
    slug: "atualizar-status-lead",
    method: "PUT",
    path: "/integration/leads/:id/status",
    title: "Testar Atualização de Status",
    category: "Leads",
    summary: "Atualiza o status de um lead. Quando status = 3, o lead é marcado como perdido/arquivado.",
    quandoUsar: "Use quando o cliente relatar que um lead deveria ter sido arquivado pela integração dele e continua ativo, ou o contrário.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Use um lead de teste para o status 3 e confirme se o motivo (lost_reason_ids) aparece certo no painel.",
    curl: `curl -X PUT "https://api.contact2sale.com/integration/leads/{id}/status" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"status":3,"message":"Cliente sem interesse","lost_reason_ids":[12]}'`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    videoGroup: "leads-put"
  },
  {
    slug: "fechar-negocio-lead",
    method: "POST",
    path: "/integration/leads/:id/done",
    title: "Testar Fechamento de Negócio",
    category: "Leads",
    summary: "Registra o fechamento de negócio (venda) de um lead, com valor e detalhes.",
    quandoUsar: "Indicado quando o cliente relatar que uma venda registrada pela integração dele não aparece no relatório de negócios fechados.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Teste em um lead de exemplo e confirme se ele muda de status e o valor aparece corretamente no relatório de vendas.",
    curl: `curl -X POST "https://api.contact2sale.com/integration/leads/{id}/done" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"done_type_negotiation":"sale","value":"500000"}'`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    videoGroup: "leads-post"
  },

  // ---------------- Vendedores ----------------
  {
    slug: "listar-vendedores",
    method: "GET",
    path: "/sellers",
    title: "Investigar Lista de Vendedores",
    category: "Vendedores",
    summary: "Lista todos os vendedores da empresa autenticada, incluindo empresas do grupo.",
    quandoUsar: "Esse é o ponto de partida sempre que precisar do ID criptografado de um vendedor para outra chamada (encaminhar lead, configurar fila etc). Use também quando o cliente relatar que um vendedor não aparece na integração.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Use este endpoint primeiro sempre que precisar do ID criptografado de um vendedor para outra chamada.",
    curl: `curl -X GET "https://api.contact2sale.com/sellers" \\
  -H "Authorization: Bearer {token}"`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    videoGroup: "vendedores-get"
  },
  {
    slug: "criar-vendedor",
    method: "POST",
    path: "/sellers",
    title: "Testar Criação de Vendedor",
    category: "Vendedores",
    summary: "Cria um novo vendedor na empresa.",
    quandoUsar: "Indicado quando o cliente relatar falha ao criar vendedores em massa pela integração dele: ajuda a isolar se o problema é da API ou do sistema de origem.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Confirme o company_id certo antes de testar: criar vendedor na empresa errada é o erro mais comum aqui.",
    curl: `curl -X POST "https://api.contact2sale.com/sellers" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"company_id":"{company_id}","name":"Novo Vendedor","email":"vendedor@exemplo.com"}'`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    videoGroup: "vendedores-post"
  },
  {
    slug: "atualizar-vendedor",
    method: "PUT",
    path: "/sellers/:id",
    title: "Testar Atualização de Vendedor",
    category: "Vendedores",
    summary: "Atualiza um vendedor existente. Aceita também campos de rotação e distribuição de leads.",
    quandoUsar: "Use quando o cliente relatar que dados de um vendedor (email, permissão de receber leads) não estão sendo atualizados corretamente.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Teste alterando um campo simples primeiro (nome ou email) antes de testar os campos de rotação/distribuição.",
    curl: `curl -X PUT "https://api.contact2sale.com/sellers/{id}" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Vendedor Atualizado"}'`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    videoGroup: "vendedores-put"
  },
  {
    slug: "timeshift-vendedores",
    method: "PUT",
    path: "/sellers/timeshift",
    title: "Testar Atualização de Rotação em Lote",
    category: "Vendedores",
    summary: "Atualiza em lote a configuração de rotação de múltiplos vendedores.",
    quandoUsar: "Indicado quando o cliente relatar que a ordem de rotação de leads entre vendedores ficou incorreta após uma atualização em lote.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Use com uma lista pequena de 2 ou 3 vendedores de teste antes de rodar em lote com o time inteiro.",
    curl: `curl -X PUT "https://api.contact2sale.com/sellers/timeshift" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"seller_ids":["{id_1}","{id_2}"]}'`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    videoGroup: "vendedores-put"
  },

  // ---------------- Empresas ----------------
  {
    slug: "listar-empresas",
    method: "GET",
    path: "/companies",
    title: "Investigar Empresas do Grupo",
    category: "Empresas",
    summary: "Lista todas as empresas do grupo (filiais) da empresa autenticada.",
    quandoUsar: "Esse é o primeiro passo em qualquer investigação envolvendo hierarquia ou filial, antes de olhar leads ou vendedores de uma empresa específica.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Confira se o número de filiais retornado bate com o que o cliente vê no painel dele.",
    curl: `curl -X GET "https://api.contact2sale.com/companies" \\
  -H "Authorization: Bearer {token}"`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    videoGroup: "empresas-get"
  },

  // ---------------- Tags ----------------
  {
    slug: "listar-tags",
    method: "GET",
    path: "/tags",
    title: "Investigar Lista de Tags",
    category: "Tags",
    summary: "Lista as tags cadastradas na empresa, com filtro por nome ou autofill.",
    quandoUsar: "Use antes de testar a Adição de Tag, já que você vai precisar do ID exato dela, ou quando o cliente relatar que uma tag esperada não existe mais na empresa.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Use isso antes de testar a Adição de Tag: você vai precisar do ID exato dela.",
    curl: `curl -X GET "https://api.contact2sale.com/tags" \\
  -H "Authorization: Bearer {token}"`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    videoGroup: "tags-get"
  },
  {
    slug: "criar-tag",
    method: "POST",
    path: "/tags",
    title: "Testar Criação de Tag",
    category: "Tags",
    summary: "Cria uma nova tag. Se já existir uma tag com os mesmos parâmetros, retorna a existente.",
    quandoUsar: "Indicado quando o cliente relatar que a criação de tags pela integração dele está duplicando ou falhando.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Teste criando a mesma tag duas vezes de propósito para confirmar o comportamento de deduplicação (retorna 201 com chave errors).",
    curl: `curl -X POST "https://api.contact2sale.com/tags" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"tag":{"name":"Nova Tag","autofill":false}}'`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    videoGroup: "tags-post"
  },

  // ---------------- Distribuição ----------------
  {
    slug: "listar-regras-distribuicao",
    method: "GET",
    path: "/distribution_rules",
    title: "Investigar Regras de Distribuição",
    category: "Distribuição",
    summary: "Lista todas as regras de distribuição (regiões) da empresa e suas filiais.",
    quandoUsar: "Use quando o cliente relatar que leads de uma região específica não estão indo para o vendedor esperado.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Compare o retorno com o que está configurado na tela de distribuição do painel para validar que bate.",
    curl: `curl -X GET "https://api.contact2sale.com/distribution_rules" \\
  -H "Authorization: Bearer {token}"`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    videoGroup: "distribuicao-get"
  },
  {
    slug: "criar-regra-distribuicao",
    method: "POST",
    path: "/distribution_rules",
    title: "Testar Criação de Regra de Distribuição",
    category: "Distribuição",
    summary: "Cria uma nova regra de distribuição vinculando uma região a um vendedor.",
    quandoUsar: "Indicado quando precisar validar, junto com o time de implantação, se uma nova regra de distribuição vai funcionar como esperado antes de ir para produção.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Teste com uma regra de prioridade alta isolada, depois confirme no painel se ela realmente está direcionando os leads certos.",
    curl: `curl -X POST "https://api.contact2sale.com/distribution_rules" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"cod_1":"SP","cod_2":"São Paulo","priority":1,"type_rule":"rotation","seller_id":"{seller_id}"}'`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    videoGroup: "distribuicao-post"
  },
  {
    slug: "listar-filas-distribuicao",
    method: "GET",
    path: "/distribution_queues",
    title: "Investigar Filas de Distribuição",
    category: "Distribuição",
    summary: "Lista as filas de distribuição da empresa pai, com headers de paginação.",
    quandoUsar: "Use quando o cliente relatar que uma fila de distribuição não existe mais ou está com configuração diferente da esperada.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Confira os headers de paginação da resposta, não só o body, muita integração de cliente erra justamente aí.",
    curl: `curl -X GET "https://api.contact2sale.com/distribution_queues" \\
  -H "Authorization: Bearer {token}"`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    videoGroup: "distribuicao-get"
  },
  {
    slug: "listar-vendedores-fila",
    method: "GET",
    path: "/distribution_queues/:id/sellers",
    title: "Investigar Vendedores de uma Fila",
    category: "Distribuição",
    summary: "Lista os vendedores de uma fila de distribuição específica, com paginação.",
    quandoUsar: "Indicado quando o cliente relatar que um vendedor não está recebendo leads de uma fila específica.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Pegue o ID da fila em Investigar Filas de Distribuição antes de testar aqui.",
    curl: `curl -X GET "https://api.contact2sale.com/distribution_queues/{id}/sellers" \\
  -H "Authorization: Bearer {token}"`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    videoGroup: "distribuicao-get"
  },
  {
    slug: "atualizar-prioridades-fila",
    method: "PUT",
    path: "/distribution_queues/:id/sellers",
    title: "Testar Atualização de Prioridades",
    category: "Distribuição",
    summary: "Atualiza as prioridades dos vendedores dentro de uma fila de distribuição.",
    quandoUsar: "Use quando o cliente relatar que a ordem de prioridade de uma fila não está sendo respeitada na hora de distribuir leads.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Teste com uma fila pequena de 2 vendedores para confirmar visualmente a nova ordem antes de aplicar em filas grandes.",
    curl: `curl -X PUT "https://api.contact2sale.com/distribution_queues/{id}/sellers" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{ }'`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    videoGroup: "distribuicao-put"
  },
  {
    slug: "redistribuir-lead",
    method: "POST",
    path: "/distribution_queues/:id/redistribute",
    title: "Testar Redistribuição de Lead",
    category: "Distribuição",
    summary: "Redistribui um lead específico pela fila, passando para o próximo vendedor da rotação.",
    quandoUsar: "Indicado quando o cliente pedir para reprocessar manualmente um lead que ficou parado sem vendedor.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Use um lead de teste e confirme no painel se o novo vendedor bate com o next_seller esperado da fila.",
    curl: `curl -X POST "https://api.contact2sale.com/distribution_queues/{id}/redistribute" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"id":"{lead_id}"}'`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    videoGroup: "distribuicao-post"
  },
  {
    slug: "definir-proximo-vendedor",
    method: "PUT",
    path: "/distribution_queues/:id/next_seller",
    title: "Testar Definição do Próximo Vendedor",
    category: "Distribuição",
    summary: "Define manualmente o próximo vendedor na rotação da fila.",
    quandoUsar: "Use quando o cliente pedir para forçar manualmente qual vendedor deve receber o próximo lead da fila.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Confirme antes que o vendedor escolhido está com status enabled na fila, senão a chamada falha silenciosamente.",
    curl: `curl -X PUT "https://api.contact2sale.com/distribution_queues/{id}/next_seller" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"next_queue_seller_id":123}'`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    videoGroup: "distribuicao-put"
  },

  // ---------------- Webhooks ----------------
  {
    slug: "assinar-webhook",
    method: "POST",
    path: "/api/subscribe",
    title: "Testar Assinatura de Webhook",
    category: "Webhooks",
    summary: "Assina eventos de webhook para leads: on_create_lead, on_update_lead ou on_close_lead. Só 1 endpoint por token.",
    quandoUsar: "Indicado quando o cliente relatar que não está recebendo notificações automáticas de leads no servidor dele.",
    ferramentas: ["postman", "api", "logs"],
    testar: "Assine um gatilho de cada vez e teste separadamente. Lembre que cadastrar uma nova URL apaga a assinatura anterior desse token.",
    curl: `curl -X POST "https://api.contact2sale.com/api/subscribe" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"hook_action":"on_create_lead","hook_url":"https://seu-servidor.com/webhook"}'`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    videoGroup: "webhooks-post"
  },
  {
    slug: "cancelar-webhook",
    method: "POST",
    path: "/api/unsubscribe",
    title: "Testar Cancelamento de Webhook",
    category: "Webhooks",
    summary: "Cancela a assinatura de um gatilho de webhook.",
    quandoUsar: "Use quando o cliente pedir para parar de receber um determinado evento, ou antes de reconfigurar uma nova URL de destino.",
    ferramentas: ["postman", "api", "logs"],
    testar: "Depois de cancelar, dispare a ação correspondente (ex: criar um lead) e confirme que o servidor do cliente não recebeu mais nada.",
    curl: `curl -X POST "https://api.contact2sale.com/api/unsubscribe" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"hook_action":"on_create_lead"}'`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    videoGroup: "webhooks-post"
  },

  // ---------------- Stand de Vendas ----------------
  {
    slug: "listar-estandes",
    method: "GET",
    path: "/integration/sales_stand/stands",
    title: "Investigar Lista de Estandes",
    category: "Stand de Vendas",
    summary: "Lista os estandes de vendas acessíveis pela hierarquia, com o formulário associado a cada um.",
    quandoUsar: "Esse é sempre o primeiro passo ao investigar qualquer caso do módulo Stand de Vendas: os IDs retornados aqui alimentam os outros dois endpoints do módulo.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Confirme que o módulo Stand de Vendas está ativo na conta do cliente antes de investigar mais a fundo.",
    curl: `curl -X GET "https://api.contact2sale.com/integration/sales_stand/stands" \\
  -H "Authorization: Bearer {token}"`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    videoGroup: "stand-de-vendas-get"
  },
  {
    slug: "listar-leads-estande",
    method: "GET",
    path: "/integration/sales_stand/leads",
    title: "Investigar Leads do Estande",
    category: "Stand de Vendas",
    summary: "Lista os leads capturados em estandes de vendas, paginados de 50 em 50.",
    quandoUsar: "Indicado quando o cliente relatar que leads capturados no estande físico não aparecem no relatório dele.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Filtre por custom_lead_form_ids usando o ID obtido em Investigar Lista de Estandes para conferir só os leads de um formulário específico.",
    curl: `curl -X GET "https://api.contact2sale.com/integration/sales_stand/leads?start_date=2026-07-01&end_date=2026-07-26" \\
  -H "Authorization: Bearer {token}"`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    videoGroup: "stand-de-vendas-get"
  },
  {
    slug: "resumo-presencas-estande",
    method: "GET",
    path: "/integration/sales_stand/attendance_summaries",
    title: "Investigar Resumo de Presenças",
    category: "Stand de Vendas",
    summary: "Lista o resumo de presenças por vendedor, gerente ou empresa. start_date e end_date são obrigatórios.",
    quandoUsar: "Use quando o cliente questionar os números de um relatório de presença no estande.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Teste com um período curto (uma semana) primeiro para conferir os números antes de puxar um relatório mensal inteiro.",
    curl: `curl -X GET "https://api.contact2sale.com/integration/sales_stand/attendance_summaries?start_date=2026-07-01&end_date=2026-07-26" \\
  -H "Authorization: Bearer {token}"`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    videoGroup: "stand-de-vendas-get"
  },

  // ---------------- Blocklist ----------------
  {
    slug: "listar-blocklist",
    method: "GET",
    path: "/integration/hierarchy_blocklists",
    title: "Investigar Blocklist",
    category: "Blocklist",
    summary: "Lista as entradas da blocklist da hierarquia, da mais recente para a mais antiga.",
    quandoUsar: "Indicado quando o cliente relatar que um contato não está recebendo leads e a suspeita for de que ele está bloqueado.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Confirme que o escopo retornado é o da hierarquia correta antes de investigar por que um contato específico está bloqueado.",
    curl: `curl -X GET "https://api.contact2sale.com/integration/hierarchy_blocklists" \\
  -H "Authorization: {token}"`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    videoGroup: "blocklist-get"
  },
  {
    slug: "adicionar-blocklist",
    method: "POST",
    path: "/integration/hierarchy_blocklists",
    title: "Testar Inclusão na Blocklist",
    category: "Blocklist",
    summary: "Adiciona telefone e/ou email à blocklist da hierarquia. Retorna 409 se já existir.",
    quandoUsar: "Use quando o cliente pedir para bloquear um contato manualmente, ou quando precisar confirmar se um número já está bloqueado antes de investigar outro sintoma.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Teste enviando o mesmo telefone em dois formatos diferentes (com e sem DDI) para confirmar que o sistema reconhece como duplicado (409).",
    curl: `curl -X POST "https://api.contact2sale.com/integration/hierarchy_blocklists" \\
  -H "Authorization: {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"hierarchy_blocklist":{"phone":"11999998888","remove_leads":true}}'`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    videoGroup: "blocklist-post"
  }
];

// Casos reais de investigação; adicione novos casos aqui
const CASOS = [
  {
    id: "CASO-001",
    titulo: "Cliente recebe 403 ao chamar a API",
    problema: "Integração do cliente retorna { \"error\": \"not_authorized\" } com status 403.",
    passos: [
      "Confirmar se o header usado é Authorization (Bearer {token}) ou Authentication",
      "Testar o token isolado no endpoint GET /integration",
      "Verificar se o token não expirou ou foi regenerado no painel do C2S",
      "Confirmar que não há espaço extra ou aspas sobrando no valor do header"
    ],
    causaRaiz: "Na maioria dos casos, é token antigo/regenerado ou header montado errado (faltando 'Bearer ').",
    escalar: "Se o token validado manualmente funciona no Postman mas falha no sistema do cliente, o problema é da integração dele; oriente o cliente em vez de escalar internamente."
  },
  {
    id: "CASO-002",
    titulo: "Lead não aparece na busca do cliente",
    problema: "Cliente diz que um lead criado não aparece no CRM dele.",
    passos: [
      "Buscar o lead em /integration/leads filtrando por phone ou email do cliente final",
      "Conferir o campo status do lead, pode estar arquivado ou em um status que a integração do cliente ignora",
      "Conferir created_at e updated_at para saber se o filtro de data da integração do cliente cobre o período",
      "Verificar from_hierarchy_company se a empresa usa hierarquia, o lead pode ter sido criado em outra sub-empresa"
    ],
    causaRaiz: "Geralmente é filtro de status ou de data na integração do próprio cliente, não um bug da API.",
    escalar: "Escale apenas se o lead existir, estiver com status esperado, e mesmo assim não retornar na chamada correta."
  }
];

// Changelog do projeto
const CHANGELOG = [
  {
    versao: "3.0",
    data: "31 Jul 2026",
    itens: [
      "Vídeos reorganizados por recurso + método HTTP (ex: Leads GET, Vendedores PUT), 18 grupos no total, a pedido da liderança do suporte",
      "Cada página de procedimento mostra o exemplo principal do vídeo e cita os outros endpoints parecidos abordados nele",
      "Categorias da barra lateral viraram pastas clicáveis (abre/fecha), a categoria do procedimento atual abre sozinha",
      "Removido o suporte a vídeo local embutido: todos os vídeos passam a ser link (Loom)",
      "Nenhum procedimento foi removido; os 35 continuam existindo, cada um com sua própria página"
    ]
  },
  {
    versao: "2.1",
    data: "31 Jul 2026",
    itens: [
      "Rollback da estratégia de vídeo por padrão de requisição: voltamos a 1 vídeo por procedimento",
      "Primeiro vídeo real adicionado: Validar Autenticação, com player embutido na própria página",
      "Suporte a vídeo local (arquivo .mp4 dentro da pasta videos/) além de links externos (Loom, YouTube etc)"
    ]
  },
  {
    versao: "2.0",
    data: "27 Jul 2026",
    itens: [
      "Nova estratégia de vídeo: em vez de 1 vídeo por endpoint, os vídeos agora ensinam padrões de requisição (GET, POST, PUT) e são compartilhados entre procedimentos parecidos",
      "Webhooks e Casos Reais continuam com vídeo exclusivo",
      "Cada página de procedimento mostra o vídeo do padrão e explica o que ele cobre, deixando claro que não é exclusivo daquele endpoint",
      "Vídeo dedicado adicionado à página Casos Reais",
      "Textos de Listar Tags, Adicionar Tag e Remover Tag enriquecidos com passos de validação e erros comuns",
      "Nenhum procedimento foi removido; os 35 continuam existindo, cada um com sua própria página"
    ]
  },
  {
    versao: "1.5",
    data: "27 Jul 2026",
    itens: [
      "Revisão de português em todos os blocos \"Quando utilizar\" e \"Como testar\" dos 33 procedimentos",
      "Corrigida a frase de abertura de Validar Autenticação e outras construções repetitivas ou confusas",
      "Variação nas aberturas de frase (Use / Indicado quando / Esse é o primeiro passo) para reduzir repetição"
    ]
  },
  {
    versao: "1.4",
    data: "27 Jul 2026",
    itens: [
      "Tema claro ajustado: tons de branco menos estourados, superfícies em cinza claro em camadas",
      "Badge de versão da home corrigido para puxar a versão atual automaticamente",
      "Página de Changelog removida da navegação"
    ]
  },
  {
    versao: "1.3",
    data: "27 Jul 2026",
    itens: [
      "Favicon adicionado (ícone </> em azul, combinando com a identidade visual)",
      "Botão \"Voltar\" no topo de toda página, essencial para navegação no celular",
      "Tema claro adicionado, com alternância salva no navegador da pessoa"
    ]
  },
  {
    versao: "1.2",
    data: "26 Jul 2026",
    itens: [
      "Reformulado como ferramenta de trabalho do suporte, não documentação de API: títulos orientados à ação (Investigar/Testar), bloco \"Quando utilizar\" e \"Ferramentas necessárias\" em cada procedimento",
      "Selo de status por procedimento: validado pelo suporte, vídeo disponível, testado no Postman e última revisão",
      "Status de validação começam como pendentes; são marcados como concluídos conforme cada procedimento é realmente executado"
    ]
  },
  {
    versao: "1.1",
    data: "26 Jul 2026",
    itens: [
      "Todos os endpoints da API mapeados: Leads, Vendedores, Empresas, Tags, Distribuição, Webhooks, Stand de Vendas e Blocklist",
      "Páginas de endpoint simplificadas: sem tabela de parâmetros e sem response completo",
      "Paleta atualizada para grafite e azul, sem emoji na interface"
    ]
  },
  {
    versao: "1.0",
    data: "26 Jul 2026",
    itens: [
      "Estrutura inicial da trilha (Fundamentos, Endpoints, Postman, Troubleshooting, Casos Reais, Checklist)",
      "Endpoints iniciais: Verificar autenticação e Listar leads",
      "2 casos reais documentados"
    ]
  }
];
