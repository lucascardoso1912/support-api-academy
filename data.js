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

const ENDPOINTS = [
  // ---------------- Autenticação ----------------
  {
    slug: "verificar-autenticacao",
    method: "GET",
    path: "/integration",
    title: "Validar Autenticação",
    category: "Autenticação",
    summary: "Confirma se um token está válido e retorna os dados da empresa autenticada.",
    quandoUsar: "Esse será sempre o primeiro passo de qualquer investigação técnica, a autenticação é o primeiro ponto de acesso à API antes de testar qualquer outro endpoint.",
    ferramentas: ["postman", "api"],
    testar: "Chame o endpoint sozinho, sem mais nada. Se voltar 200 com o nome da empresa, o token está válido. Se voltar 403, o problema é o token, ainda antes de qualquer outra investigação.",
    curl: `curl -X GET "https://api.contact2sale.com/integration" \\
  -H "Authorization: Bearer {token}"`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    video: ""
  },

  // ---------------- Leads ----------------
  {
    slug: "listar-leads",
    method: "GET",
    path: "/integration/leads",
    title: "Investigar Listagem de Leads",
    category: "Leads",
    summary: "Confirma se a API está retornando corretamente os leads da empresa, com filtros e paginação.",
    quandoUsar: "Utilize esta validação quando um cliente relatar divergências na listagem de leads, ou quando precisar confirmar se um lead específico está sendo retornado pela API.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Teste filtrando por phone ou email do cliente reclamado, é o jeito mais rápido de achar um lead específico numa investigação.",
    curl: `curl -X GET "https://api.contact2sale.com/integration/leads?status=em_negociacao&perpage=50" \\
  -H "Authorization: Bearer {token}"`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    video: ""
  },
  {
    slug: "buscar-lead",
    method: "GET",
    path: "/integration/leads/:id",
    title: "Investigar Lead Específico",
    category: "Leads",
    summary: "Retorna todo o detalhe de um lead pelo ID: histórico, mensagens e agendamentos.",
    quandoUsar: "Utilize quando já souber o ID do lead e precisar conferir o histórico completo dele, por exemplo para confirmar se uma mensagem ou atividade foi registrada corretamente.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Pegue o ID de um lead retornado em Investigar Listagem de Leads e chame este endpoint para conferir o detalhe completo dele.",
    curl: `curl -X GET "https://api.contact2sale.com/integration/leads/{id}" \\
  -H "Authorization: Bearer {token}"`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    video: ""
  },
  {
    slug: "criar-lead",
    method: "POST",
    path: "/integration/leads",
    title: "Testar Criação de Lead",
    category: "Leads",
    summary: "Cria um novo lead. É obrigatório enviar ao menos phone ou email, senão a API retorna 423.",
    quandoUsar: "Utilize quando o cliente relatar que leads não estão sendo criados pela integração dele, para isolar se o problema está na API ou no sistema de origem.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Envie um body mínimo só com name, phone e description para validar que o token tem permissão de criação antes de testar campos avançados.",
    curl: `curl -X POST "https://api.contact2sale.com/integration/leads" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"data":{"type":"lead","attributes":{"name":"Teste","phone":"11999999999"}}}'`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    video: ""
  },
  {
    slug: "atualizar-lead",
    method: "PUT",
    path: "/integration/leads/:id",
    title: "Testar Atualização de Lead",
    category: "Leads",
    summary: "Atualiza um lead existente. Suporta 3 formatos de body diferentes.",
    quandoUsar: "Utilize quando o cliente relatar que uma atualização (novo telefone, novo status do produto etc) não está refletindo no lead dentro do C2S.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Teste primeiro atualizando um único campo simples (como o nome do cliente) antes de testar o body completo, ajuda a isolar qual formato o sistema do cliente está usando.",
    curl: `curl -X PUT "https://api.contact2sale.com/integration/leads/{id}" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"lead":{"customer":{"name":"Nome Atualizado"}}}'`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    video: ""
  },
  {
    slug: "encaminhar-lead",
    method: "PUT",
    path: "/integration/leads/:id/forward",
    title: "Testar Encaminhamento de Lead",
    category: "Leads",
    summary: "Encaminha um lead de um vendedor para outro.",
    quandoUsar: "Utilize quando o cliente relatar que um lead não mudou de vendedor após uma tentativa de encaminhamento pela integração dele.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Confirme antes os IDs criptografados dos dois vendedores (origem e destino) usando o procedimento Investigar Lista de Vendedores.",
    curl: `curl -X PUT "https://api.contact2sale.com/integration/leads/{id}/forward" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"seller_from_id":"{id_origem}","seller_to_id":"{id_destino}"}'`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    video: ""
  },
  {
    slug: "listar-tags-lead",
    method: "GET",
    path: "/integration/leads/:id/tags",
    title: "Investigar Tags de um Lead",
    category: "Leads",
    summary: "Retorna todas as tags associadas a um lead específico.",
    quandoUsar: "Utilize quando o cliente relatar que uma tag esperada não aparece no lead, ou para confirmar o estado atual antes de adicionar/remover uma tag.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Use num lead que você já sabe que tem tag pra confirmar visualmente que a resposta bate com o que aparece no painel do C2S.",
    curl: `curl -X GET "https://api.contact2sale.com/integration/leads/{id}/tags" \\
  -H "Authorization: Bearer {token}"`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    video: ""
  },
  {
    slug: "adicionar-tag-lead",
    method: "POST",
    path: "/integration/leads/:id/tags",
    title: "Testar Adição de Tag",
    category: "Leads",
    summary: "Adiciona uma tag já existente a um lead.",
    quandoUsar: "Utilize quando o cliente relatar que a tag enviada pela integração dele não está sendo aplicada ao lead.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Pegue o ID de uma tag em Investigar Lista de Tags antes de testar aqui. A tag precisa já existir na empresa.",
    curl: `curl -X POST "https://api.contact2sale.com/integration/leads/{id}/tags" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"tag_id":"{tag_id}"}'`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    video: ""
  },
  {
    slug: "remover-tag-lead",
    method: "DELETE",
    path: "/integration/leads/:id/tags",
    title: "Testar Remoção de Tag",
    category: "Leads",
    summary: "Remove uma ou mais tags de um lead. Aceita tag_id como string única ou array.",
    quandoUsar: "Utilize quando uma tag precisar ser removida em massa ou quando o cliente relatar que a remoção pela integração dele não está funcionando.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Teste primeiro removendo uma única tag antes de testar com array de várias tags de uma vez.",
    curl: `curl -X DELETE "https://api.contact2sale.com/integration/leads/{id}/tags" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"tag_id":"{tag_id}"}'`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    video: ""
  },
  {
    slug: "marcar-lead-lido",
    method: "PUT",
    path: "/integration/leads/:id/read",
    title: "Testar Marcação de Lead como Lido",
    category: "Leads",
    summary: "Marca um lead como lido ou interagido.",
    quandoUsar: "Utilize quando o cliente relatar que leads continuam aparecendo como não lidos mesmo após interação pelo sistema dele.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Confirme no painel do C2S, antes e depois da chamada, que o indicador de não lido do lead sumiu.",
    curl: `curl -X PUT "https://api.contact2sale.com/integration/leads/{id}/read" \\
  -H "Authorization: Bearer {token}"`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    video: ""
  },
  {
    slug: "criar-mensagem-lead",
    method: "POST",
    path: "/integration/leads/:id/messages",
    title: "Testar Criação de Mensagem",
    category: "Leads",
    summary: "Cria uma mensagem dentro de um lead, para registrar o histórico de conversa vindo de um canal externo.",
    quandoUsar: "Utilize quando o cliente relatar que mensagens de um canal (WhatsApp, chat do site) não estão aparecendo no histórico do lead.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Envie uma mensagem de teste com o campo origin preenchido (ex: whatsapp) e confirme que ela aparece no card do lead no C2S.",
    curl: `curl -X POST "https://api.contact2sale.com/integration/leads/{id}/messages" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"body":"Mensagem de teste","from":"bot"}'`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    video: ""
  },
  {
    slug: "criar-atividade-lead",
    method: "POST",
    path: "/integration/leads/:id/activities",
    title: "Testar Criação de Atividade",
    category: "Leads",
    summary: "Cria uma atividade (agendamento) em um lead, com data, título e opção de notificação push.",
    quandoUsar: "Utilize quando o cliente relatar que agendamentos criados pela integração dele não aparecem para o vendedor, ou que a notificação não chegou.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Teste com send_push true e confirme se o vendedor responsável recebeu a notificação.",
    curl: `curl -X POST "https://api.contact2sale.com/integration/leads/{id}/activities" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"date":"2026-08-01T14:00:00Z","type":{"activity":true},"body":"Retornar contato"}'`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    video: ""
  },
  {
    slug: "atualizar-status-lead",
    method: "PUT",
    path: "/integration/leads/:id/status",
    title: "Testar Atualização de Status",
    category: "Leads",
    summary: "Atualiza o status de um lead. Quando status = 3, o lead é marcado como perdido/arquivado.",
    quandoUsar: "Utilize quando o cliente relatar que um lead deveria ter sido arquivado pela integração dele e continua ativo, ou o contrário.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Use um lead de teste para o status 3 e confirme se o motivo (lost_reason_ids) aparece certo no painel.",
    curl: `curl -X PUT "https://api.contact2sale.com/integration/leads/{id}/status" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"status":3,"message":"Cliente sem interesse","lost_reason_ids":[12]}'`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    video: ""
  },
  {
    slug: "fechar-negocio-lead",
    method: "POST",
    path: "/integration/leads/:id/done",
    title: "Testar Fechamento de Negócio",
    category: "Leads",
    summary: "Registra o fechamento de negócio (venda) de um lead, com valor e detalhes.",
    quandoUsar: "Utilize quando o cliente relatar que uma venda registrada pela integração dele não aparece no relatório de negócios fechados.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Teste em um lead de exemplo e confirme se ele muda de status e o valor aparece corretamente no relatório de vendas.",
    curl: `curl -X POST "https://api.contact2sale.com/integration/leads/{id}/done" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"done_type_negotiation":"sale","value":"500000"}'`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    video: ""
  },

  // ---------------- Vendedores ----------------
  {
    slug: "listar-vendedores",
    method: "GET",
    path: "/sellers",
    title: "Investigar Lista de Vendedores",
    category: "Vendedores",
    summary: "Lista todos os vendedores da empresa autenticada, incluindo empresas do grupo.",
    quandoUsar: "Utilize sempre que precisar do ID criptografado de um vendedor para outra chamada (encaminhar lead, configurar fila etc), ou quando o cliente relatar que um vendedor não aparece na integração.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Use este endpoint primeiro sempre que precisar do ID criptografado de um vendedor para outra chamada.",
    curl: `curl -X GET "https://api.contact2sale.com/sellers" \\
  -H "Authorization: Bearer {token}"`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    video: ""
  },
  {
    slug: "criar-vendedor",
    method: "POST",
    path: "/sellers",
    title: "Testar Criação de Vendedor",
    category: "Vendedores",
    summary: "Cria um novo vendedor na empresa.",
    quandoUsar: "Utilize quando o cliente relatar falha ao criar vendedores em massa pela integração dele, para isolar se o problema é da API ou do sistema de origem.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Confirme o company_id certo antes de testar, criar vendedor na empresa errada é o erro mais comum aqui.",
    curl: `curl -X POST "https://api.contact2sale.com/sellers" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"company_id":"{company_id}","name":"Novo Vendedor","email":"vendedor@exemplo.com"}'`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    video: ""
  },
  {
    slug: "atualizar-vendedor",
    method: "PUT",
    path: "/sellers/:id",
    title: "Testar Atualização de Vendedor",
    category: "Vendedores",
    summary: "Atualiza um vendedor existente. Aceita também campos de rotação e distribuição de leads.",
    quandoUsar: "Utilize quando o cliente relatar que dados de um vendedor (email, permissão de receber leads) não estão sendo atualizados corretamente.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Teste alterando um campo simples primeiro (nome ou email) antes de testar os campos de rotação/distribuição.",
    curl: `curl -X PUT "https://api.contact2sale.com/sellers/{id}" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Vendedor Atualizado"}'`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    video: ""
  },
  {
    slug: "timeshift-vendedores",
    method: "PUT",
    path: "/sellers/timeshift",
    title: "Testar Atualização de Rotação em Lote",
    category: "Vendedores",
    summary: "Atualiza em lote a configuração de rotação de múltiplos vendedores.",
    quandoUsar: "Utilize quando o cliente relatar que a ordem de rotação de leads entre vendedores está incorreta após uma atualização em lote.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Use com uma lista pequena de 2 ou 3 vendedores de teste antes de rodar em lote com o time inteiro.",
    curl: `curl -X PUT "https://api.contact2sale.com/sellers/timeshift" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"seller_ids":["{id_1}","{id_2}"]}'`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    video: ""
  },

  // ---------------- Empresas ----------------
  {
    slug: "listar-empresas",
    method: "GET",
    path: "/companies",
    title: "Investigar Empresas do Grupo",
    category: "Empresas",
    summary: "Lista todas as empresas do grupo (filiais) da empresa autenticada.",
    quandoUsar: "Utilize como primeiro passo em qualquer investigação envolvendo hierarquia ou filial, antes de olhar leads ou vendedores de uma empresa específica.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Confira se o número de filiais retornado bate com o que o cliente enxerga no painel dele.",
    curl: `curl -X GET "https://api.contact2sale.com/companies" \\
  -H "Authorization: Bearer {token}"`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    video: ""
  },

  // ---------------- Tags ----------------
  {
    slug: "listar-tags",
    method: "GET",
    path: "/tags",
    title: "Investigar Lista de Tags",
    category: "Tags",
    summary: "Lista as tags cadastradas na empresa, com filtro por nome ou autofill.",
    quandoUsar: "Utilize antes de testar Adição de Tag, você precisa do ID exato da tag, ou quando o cliente relatar que uma tag esperada não existe mais na empresa.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Use isso antes de testar Testar Adição de Tag, precisa do ID exato da tag.",
    curl: `curl -X GET "https://api.contact2sale.com/tags" \\
  -H "Authorization: Bearer {token}"`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    video: ""
  },
  {
    slug: "criar-tag",
    method: "POST",
    path: "/tags",
    title: "Testar Criação de Tag",
    category: "Tags",
    summary: "Cria uma nova tag. Se já existir uma tag com os mesmos parâmetros, retorna a existente.",
    quandoUsar: "Utilize quando o cliente relatar que a criação de tags pela integração dele está duplicando ou falhando.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Teste criando a mesma tag duas vezes de propósito para confirmar o comportamento de deduplicação (retorna 201 com chave errors).",
    curl: `curl -X POST "https://api.contact2sale.com/tags" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"tag":{"name":"Nova Tag","autofill":false}}'`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    video: ""
  },

  // ---------------- Distribuição ----------------
  {
    slug: "listar-regras-distribuicao",
    method: "GET",
    path: "/distribution_rules",
    title: "Investigar Regras de Distribuição",
    category: "Distribuição",
    summary: "Lista todas as regras de distribuição (regiões) da empresa e suas filiais.",
    quandoUsar: "Utilize quando o cliente relatar que leads de uma região específica não estão indo para o vendedor esperado.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Compare o retorno com o que está configurado na tela de distribuição do painel para validar que bate.",
    curl: `curl -X GET "https://api.contact2sale.com/distribution_rules" \\
  -H "Authorization: Bearer {token}"`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    video: ""
  },
  {
    slug: "criar-regra-distribuicao",
    method: "POST",
    path: "/distribution_rules",
    title: "Testar Criação de Regra de Distribuição",
    category: "Distribuição",
    summary: "Cria uma nova regra de distribuição vinculando uma região a um vendedor.",
    quandoUsar: "Utilize quando precisar validar, junto com o time de implantação, se uma nova regra de distribuição vai funcionar como esperado antes de aplicar em produção.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Teste com uma regra de prioridade alta isolada, depois confirme no painel se ela realmente está direcionando os leads certos.",
    curl: `curl -X POST "https://api.contact2sale.com/distribution_rules" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"cod_1":"SP","cod_2":"São Paulo","priority":1,"type_rule":"rotation","seller_id":"{seller_id}"}'`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    video: ""
  },
  {
    slug: "listar-filas-distribuicao",
    method: "GET",
    path: "/distribution_queues",
    title: "Investigar Filas de Distribuição",
    category: "Distribuição",
    summary: "Lista as filas de distribuição da empresa pai, com headers de paginação.",
    quandoUsar: "Utilize quando o cliente relatar que uma fila de distribuição não existe mais ou está com configuração diferente da esperada.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Confira os headers de paginação da resposta, não só o body, muita integração de cliente erra justamente aí.",
    curl: `curl -X GET "https://api.contact2sale.com/distribution_queues" \\
  -H "Authorization: Bearer {token}"`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    video: ""
  },
  {
    slug: "listar-vendedores-fila",
    method: "GET",
    path: "/distribution_queues/:id/sellers",
    title: "Investigar Vendedores de uma Fila",
    category: "Distribuição",
    summary: "Lista os vendedores de uma fila de distribuição específica, com paginação.",
    quandoUsar: "Utilize quando o cliente relatar que um vendedor não está recebendo leads de uma fila específica.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Pegue o ID da fila em Investigar Filas de Distribuição antes de testar aqui.",
    curl: `curl -X GET "https://api.contact2sale.com/distribution_queues/{id}/sellers" \\
  -H "Authorization: Bearer {token}"`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    video: ""
  },
  {
    slug: "atualizar-prioridades-fila",
    method: "PUT",
    path: "/distribution_queues/:id/sellers",
    title: "Testar Atualização de Prioridades",
    category: "Distribuição",
    summary: "Atualiza as prioridades dos vendedores dentro de uma fila de distribuição.",
    quandoUsar: "Utilize quando o cliente relatar que a ordem de prioridade de uma fila não está sendo respeitada na hora de distribuir leads.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Teste com uma fila pequena de 2 vendedores para confirmar visualmente a nova ordem antes de aplicar em filas grandes.",
    curl: `curl -X PUT "https://api.contact2sale.com/distribution_queues/{id}/sellers" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{ }'`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    video: ""
  },
  {
    slug: "redistribuir-lead",
    method: "POST",
    path: "/distribution_queues/:id/redistribute",
    title: "Testar Redistribuição de Lead",
    category: "Distribuição",
    summary: "Redistribui um lead específico pela fila, passando para o próximo vendedor da rotação.",
    quandoUsar: "Utilize quando o cliente pedir para reprocessar manualmente um lead que ficou parado sem vendedor.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Use um lead de teste e confirme no painel se o novo vendedor bate com o next_seller esperado da fila.",
    curl: `curl -X POST "https://api.contact2sale.com/distribution_queues/{id}/redistribute" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"id":"{lead_id}"}'`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    video: ""
  },
  {
    slug: "definir-proximo-vendedor",
    method: "PUT",
    path: "/distribution_queues/:id/next_seller",
    title: "Testar Definição do Próximo Vendedor",
    category: "Distribuição",
    summary: "Define manualmente o próximo vendedor na rotação da fila.",
    quandoUsar: "Utilize quando o cliente pedir para forçar manualmente qual vendedor deve receber o próximo lead da fila.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Confirme antes que o vendedor escolhido está com status enabled na fila, senão a chamada falha silenciosamente.",
    curl: `curl -X PUT "https://api.contact2sale.com/distribution_queues/{id}/next_seller" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"next_queue_seller_id":123}'`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    video: ""
  },

  // ---------------- Webhooks ----------------
  {
    slug: "assinar-webhook",
    method: "POST",
    path: "/api/subscribe",
    title: "Testar Assinatura de Webhook",
    category: "Webhooks",
    summary: "Assina eventos de webhook para leads: on_create_lead, on_update_lead ou on_close_lead. Só 1 endpoint por token.",
    quandoUsar: "Utilize quando o cliente relatar que não está recebendo notificações automáticas de leads no servidor dele.",
    ferramentas: ["postman", "api", "logs"],
    testar: "Assine um gatilho de cada vez e teste separadamente. Lembre que cadastrar uma nova URL apaga a assinatura anterior desse token.",
    curl: `curl -X POST "https://api.contact2sale.com/api/subscribe" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"hook_action":"on_create_lead","hook_url":"https://seu-servidor.com/webhook"}'`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    video: ""
  },
  {
    slug: "cancelar-webhook",
    method: "POST",
    path: "/api/unsubscribe",
    title: "Testar Cancelamento de Webhook",
    category: "Webhooks",
    summary: "Cancela a assinatura de um gatilho de webhook.",
    quandoUsar: "Utilize quando o cliente pedir para parar de receber um determinado evento, ou antes de reconfigurar uma nova URL de destino.",
    ferramentas: ["postman", "api", "logs"],
    testar: "Depois de cancelar, dispare a ação correspondente (ex: criar um lead) e confirme que o servidor do cliente não recebeu mais nada.",
    curl: `curl -X POST "https://api.contact2sale.com/api/unsubscribe" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"hook_action":"on_create_lead"}'`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    video: ""
  },

  // ---------------- Stand de Vendas ----------------
  {
    slug: "listar-estandes",
    method: "GET",
    path: "/integration/sales_stand/stands",
    title: "Investigar Lista de Estandes",
    category: "Stand de Vendas",
    summary: "Lista os estandes de vendas acessíveis pela hierarquia, com o formulário associado a cada um.",
    quandoUsar: "Utilize como primeiro passo sempre que for investigar qualquer caso do módulo Stand de Vendas, os IDs daqui alimentam os outros dois endpoints do módulo.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Confirme que o módulo Stand de Vendas está ativo na conta do cliente antes de investigar mais a fundo.",
    curl: `curl -X GET "https://api.contact2sale.com/integration/sales_stand/stands" \\
  -H "Authorization: Bearer {token}"`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    video: ""
  },
  {
    slug: "listar-leads-estande",
    method: "GET",
    path: "/integration/sales_stand/leads",
    title: "Investigar Leads do Estande",
    category: "Stand de Vendas",
    summary: "Lista os leads capturados em estandes de vendas, paginados de 50 em 50.",
    quandoUsar: "Utilize quando o cliente relatar que leads capturados no estande físico não aparecem no relatório dele.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Filtre por custom_lead_form_ids usando o ID obtido em Investigar Lista de Estandes para conferir só os leads de um formulário específico.",
    curl: `curl -X GET "https://api.contact2sale.com/integration/sales_stand/leads?start_date=2026-07-01&end_date=2026-07-26" \\
  -H "Authorization: Bearer {token}"`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    video: ""
  },
  {
    slug: "resumo-presencas-estande",
    method: "GET",
    path: "/integration/sales_stand/attendance_summaries",
    title: "Investigar Resumo de Presenças",
    category: "Stand de Vendas",
    summary: "Lista o resumo de presenças por vendedor, gerente ou empresa. start_date e end_date são obrigatórios.",
    quandoUsar: "Utilize quando o cliente questionar os números de um relatório de presença no estande.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Teste com um período curto (uma semana) primeiro para conferir os números antes de puxar um relatório mensal inteiro.",
    curl: `curl -X GET "https://api.contact2sale.com/integration/sales_stand/attendance_summaries?start_date=2026-07-01&end_date=2026-07-26" \\
  -H "Authorization: Bearer {token}"`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    video: ""
  },

  // ---------------- Blocklist ----------------
  {
    slug: "listar-blocklist",
    method: "GET",
    path: "/integration/hierarchy_blocklists",
    title: "Investigar Blocklist",
    category: "Blocklist",
    summary: "Lista as entradas da blocklist da hierarquia, da mais recente para a mais antiga.",
    quandoUsar: "Utilize quando o cliente relatar que um contato não está recebendo leads e você suspeitar que ele está bloqueado.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Confirme que o escopo retornado é o da hierarquia correta antes de investigar por que um contato específico está bloqueado.",
    curl: `curl -X GET "https://api.contact2sale.com/integration/hierarchy_blocklists" \\
  -H "Authorization: {token}"`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    video: ""
  },
  {
    slug: "adicionar-blocklist",
    method: "POST",
    path: "/integration/hierarchy_blocklists",
    title: "Testar Inclusão na Blocklist",
    category: "Blocklist",
    summary: "Adiciona telefone e/ou email à blocklist da hierarquia. Retorna 409 se já existir.",
    quandoUsar: "Utilize quando o cliente pedir para bloquear um contato manualmente, ou quando precisar confirmar se um número já está bloqueado antes de investigar outro sintoma.",
    ferramentas: ["postman", "api", "plataforma"],
    testar: "Teste enviando o mesmo telefone em dois formatos diferentes (com e sem DDI) para confirmar que o sistema reconhece como duplicado (409).",
    curl: `curl -X POST "https://api.contact2sale.com/integration/hierarchy_blocklists" \\
  -H "Authorization: {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"hierarchy_blocklist":{"phone":"11999998888","remove_leads":true}}'`,
    status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
    video: ""
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
