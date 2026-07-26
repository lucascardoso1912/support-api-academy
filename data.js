// ============================================================
// SUPPORT API ACADEMY - base de dados de endpoints
//
// Schema enxuto de propósito: a doc oficial da API já lista
// todos os parâmetros e respostas completas, então aqui só
// entra o essencial para o suporte saber o que o endpoint faz
// e como testar. O grosso do conteúdo de cada página é o vídeo.
//
// Para adicionar um endpoint novo, copie um objeto do array
// ENDPOINTS, preencha os campos e pronto: ele aparece sozinho
// no menu, na busca e ganha sua própria página.
//
// Campo "video": cole o link do vídeo (Loom, YouTube não listado,
// Drive, Streamable etc). Deixe "" se ainda não gravou; a seção
// de vídeo só aparece na página quando esse campo é preenchido.
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

const ENDPOINTS = [
  // ---------------- Autenticação ----------------
  {
    slug: "verificar-autenticacao",
    method: "GET",
    path: "/integration",
    title: "Verificar autenticação",
    category: "Autenticação",
    summary: "Valida o token e retorna os dados da empresa autenticada e suas sub-empresas.",
    testar: "Chame o endpoint sozinho, sem mais nada. Se voltar 200 com o nome da empresa, o token está válido. Se voltar 403, o problema é o token antes de qualquer outra investigação.",
    curl: `curl -X GET "https://api.contact2sale.com/integration" \\
  -H "Authorization: Bearer {token}"`,
    video: ""
  },

  // ---------------- Leads ----------------
  {
    slug: "listar-leads",
    method: "GET",
    path: "/integration/leads",
    title: "Listar leads",
    category: "Leads",
    summary: "Lista os leads da empresa autenticada, com filtros (status, tags, telefone, email, datas) e paginação.",
    testar: "Teste filtrando por phone ou email do cliente reclamado, é o jeito mais rápido de achar um lead específico numa investigação.",
    curl: `curl -X GET "https://api.contact2sale.com/integration/leads?status=em_negociacao&perpage=50" \\
  -H "Authorization: Bearer {token}"`,
    video: ""
  },
  {
    slug: "buscar-lead",
    method: "GET",
    path: "/integration/leads/:id",
    title: "Buscar lead por ID",
    category: "Leads",
    summary: "Retorna um lead específico pelo ID criptografado, com todo o histórico, mensagens e agendamentos.",
    testar: "Pegue o ID de um lead retornado em Listar Leads e chame este endpoint para conferir o detalhe completo dele.",
    curl: `curl -X GET "https://api.contact2sale.com/integration/leads/{id}" \\
  -H "Authorization: Bearer {token}"`,
    video: ""
  },
  {
    slug: "criar-lead",
    method: "POST",
    path: "/integration/leads",
    title: "Criar lead",
    category: "Leads",
    summary: "Cria um novo lead. É obrigatório enviar ao menos phone ou email, senão retorna 423.",
    testar: "Envie um body mínimo só com name, phone e description para validar que o token tem permissão de criação antes de testar campos avançados.",
    curl: `curl -X POST "https://api.contact2sale.com/integration/leads" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"data":{"type":"lead","attributes":{"name":"Teste","phone":"11999999999"}}}'`,
    video: ""
  },
  {
    slug: "atualizar-lead",
    method: "PUT",
    path: "/integration/leads/:id",
    title: "Atualizar lead",
    category: "Leads",
    summary: "Atualiza um lead existente. Suporta 3 formatos de body: via data.attributes (legado), reset de created_at, ou atualização completa (cliente, produto, mensagem).",
    testar: "Teste primeiro atualizando um único campo simples (como o nome do cliente) antes de testar o body completo, ajuda a isolar qual formato o sistema do cliente está usando.",
    curl: `curl -X PUT "https://api.contact2sale.com/integration/leads/{id}" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"lead":{"customer":{"name":"Nome Atualizado"}}}'`,
    video: ""
  },
  {
    slug: "encaminhar-lead",
    method: "PUT",
    path: "/integration/leads/:id/forward",
    title: "Encaminhar lead",
    category: "Leads",
    summary: "Encaminha um lead de um vendedor para outro.",
    testar: "Confirme antes os IDs criptografados dos dois vendedores (origem e destino) usando o endpoint Listar Vendedores.",
    curl: `curl -X PUT "https://api.contact2sale.com/integration/leads/{id}/forward" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"seller_from_id":"{id_origem}","seller_to_id":"{id_destino}"}'`,
    video: ""
  },
  {
    slug: "listar-tags-lead",
    method: "GET",
    path: "/integration/leads/:id/tags",
    title: "Listar tags do lead",
    category: "Leads",
    summary: "Retorna todas as tags associadas a um lead.",
    testar: "Use num lead que você já sabe que tem tag pra confirmar visualmente que a resposta bate com o que aparece no painel do C2S.",
    curl: `curl -X GET "https://api.contact2sale.com/integration/leads/{id}/tags" \\
  -H "Authorization: Bearer {token}"`,
    video: ""
  },
  {
    slug: "adicionar-tag-lead",
    method: "POST",
    path: "/integration/leads/:id/tags",
    title: "Adicionar tag ao lead",
    category: "Leads",
    summary: "Adiciona uma tag existente a um lead.",
    testar: "Pegue o ID de uma tag em Listar Tags antes de testar aqui. A tag precisa já existir na empresa.",
    curl: `curl -X POST "https://api.contact2sale.com/integration/leads/{id}/tags" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"tag_id":"{tag_id}"}'`,
    video: ""
  },
  {
    slug: "remover-tag-lead",
    method: "DELETE",
    path: "/integration/leads/:id/tags",
    title: "Remover tag do lead",
    category: "Leads",
    summary: "Remove uma ou mais tags de um lead. Aceita tag_id como string única ou array.",
    testar: "Teste primeiro removendo uma única tag antes de testar com array de várias tags de uma vez.",
    curl: `curl -X DELETE "https://api.contact2sale.com/integration/leads/{id}/tags" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"tag_id":"{tag_id}"}'`,
    video: ""
  },
  {
    slug: "marcar-lead-lido",
    method: "PUT",
    path: "/integration/leads/:id/read",
    title: "Marcar lead como lido",
    category: "Leads",
    summary: "Marca um lead como lido ou interagido.",
    testar: "Confirme no painel do C2S, antes e depois da chamada, que o indicador de não lido do lead sumiu.",
    curl: `curl -X PUT "https://api.contact2sale.com/integration/leads/{id}/read" \\
  -H "Authorization: Bearer {token}"`,
    video: ""
  },
  {
    slug: "criar-mensagem-lead",
    method: "POST",
    path: "/integration/leads/:id/messages",
    title: "Criar mensagem no lead",
    category: "Leads",
    summary: "Cria uma mensagem dentro de um lead, útil para registrar o histórico de conversa vindo de um canal externo.",
    testar: "Envie uma mensagem de teste com o campo origin preenchido (ex: whatsapp) e confirme que ela aparece no card do lead no C2S.",
    curl: `curl -X POST "https://api.contact2sale.com/integration/leads/{id}/messages" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"body":"Mensagem de teste","from":"bot"}'`,
    video: ""
  },
  {
    slug: "criar-atividade-lead",
    method: "POST",
    path: "/integration/leads/:id/activities",
    title: "Criar atividade no lead",
    category: "Leads",
    summary: "Cria uma atividade (agendamento) em um lead, com data, título e opção de notificação push.",
    testar: "Teste com send_push true e confirme se o vendedor responsável recebeu a notificação.",
    curl: `curl -X POST "https://api.contact2sale.com/integration/leads/{id}/activities" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"date":"2026-08-01T14:00:00Z","type":{"activity":true},"body":"Retornar contato"}'`,
    video: ""
  },
  {
    slug: "atualizar-status-lead",
    method: "PUT",
    path: "/integration/leads/:id/status",
    title: "Atualizar status do lead",
    category: "Leads",
    summary: "Atualiza o status de um lead. Quando status = 3, o lead é marcado como perdido/arquivado.",
    testar: "Use um lead de teste para o status 3 e confirme se o motivo (lost_reason_ids) aparece certo no painel.",
    curl: `curl -X PUT "https://api.contact2sale.com/integration/leads/{id}/status" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"status":3,"message":"Cliente sem interesse","lost_reason_ids":[12]}'`,
    video: ""
  },
  {
    slug: "fechar-negocio-lead",
    method: "POST",
    path: "/integration/leads/:id/done",
    title: "Registrar fechamento de negócio",
    category: "Leads",
    summary: "Registra o fechamento de negócio (venda) de um lead, com valor e detalhes.",
    testar: "Teste em um lead de exemplo e confirme se ele muda de status e o valor aparece corretamente no relatório de vendas.",
    curl: `curl -X POST "https://api.contact2sale.com/integration/leads/{id}/done" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"done_type_negotiation":"sale","value":"500000"}'`,
    video: ""
  },

  // ---------------- Vendedores ----------------
  {
    slug: "listar-vendedores",
    method: "GET",
    path: "/sellers",
    title: "Listar vendedores",
    category: "Vendedores",
    summary: "Lista todos os vendedores da empresa autenticada, incluindo empresas do grupo.",
    testar: "Use este endpoint primeiro sempre que precisar do ID criptografado de um vendedor para outra chamada (encaminhar lead, filas etc).",
    curl: `curl -X GET "https://api.contact2sale.com/sellers" \\
  -H "Authorization: Bearer {token}"`,
    video: ""
  },
  {
    slug: "criar-vendedor",
    method: "POST",
    path: "/sellers",
    title: "Criar vendedor",
    category: "Vendedores",
    summary: "Cria um novo vendedor na empresa.",
    testar: "Confirme o company_id certo antes de testar, criar vendedor na empresa errada é o erro mais comum aqui.",
    curl: `curl -X POST "https://api.contact2sale.com/sellers" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"company_id":"{company_id}","name":"Novo Vendedor","email":"vendedor@exemplo.com"}'`,
    video: ""
  },
  {
    slug: "atualizar-vendedor",
    method: "PUT",
    path: "/sellers/:id",
    title: "Atualizar vendedor",
    category: "Vendedores",
    summary: "Atualiza um vendedor existente. Aceita também campos de rotação e distribuição de leads.",
    testar: "Teste alterando um campo simples primeiro (nome ou email) antes de testar os campos de rotação/distribuição.",
    curl: `curl -X PUT "https://api.contact2sale.com/sellers/{id}" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Vendedor Atualizado"}'`,
    video: ""
  },
  {
    slug: "timeshift-vendedores",
    method: "PUT",
    path: "/sellers/timeshift",
    title: "Atualizar timeshift em lote",
    category: "Vendedores",
    summary: "Atualiza em lote a configuração de rotação de múltiplos vendedores. Processados em ordem reversa, com prioridade escalonada em 1 segundo.",
    testar: "Use com uma lista pequena de 2 ou 3 vendedores de teste antes de rodar em lote com o time inteiro.",
    curl: `curl -X PUT "https://api.contact2sale.com/sellers/timeshift" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"seller_ids":["{id_1}","{id_2}"]}'`,
    video: ""
  },

  // ---------------- Empresas ----------------
  {
    slug: "listar-empresas",
    method: "GET",
    path: "/companies",
    title: "Listar empresas",
    category: "Empresas",
    summary: "Lista todas as empresas do grupo (filiais) da empresa autenticada.",
    testar: "Útil como primeiro passo em qualquer investigação envolvendo hierarquia ou filial.",
    curl: `curl -X GET "https://api.contact2sale.com/companies" \\
  -H "Authorization: Bearer {token}"`,
    video: ""
  },

  // ---------------- Tags ----------------
  {
    slug: "listar-tags",
    method: "GET",
    path: "/tags",
    title: "Listar tags",
    category: "Tags",
    summary: "Lista as tags cadastradas na empresa autenticada, com filtro por nome ou autofill.",
    testar: "Use isso antes de testar Adicionar tag ao lead, precisa do ID exato da tag.",
    curl: `curl -X GET "https://api.contact2sale.com/tags" \\
  -H "Authorization: Bearer {token}"`,
    video: ""
  },
  {
    slug: "criar-tag",
    method: "POST",
    path: "/tags",
    title: "Criar tag",
    category: "Tags",
    summary: "Cria uma nova tag. Se já existir uma tag com os mesmos parâmetros, retorna a existente (201 com chave errors).",
    testar: "Teste criando a mesma tag duas vezes de propósito para confirmar esse comportamento de deduplicação.",
    curl: `curl -X POST "https://api.contact2sale.com/tags" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"tag":{"name":"Nova Tag","autofill":false}}'`,
    video: ""
  },

  // ---------------- Distribuição ----------------
  {
    slug: "listar-regras-distribuicao",
    method: "GET",
    path: "/distribution_rules",
    title: "Listar regras de distribuição",
    category: "Distribuição",
    summary: "Lista todas as regras de distribuição (regiões) da empresa e suas filiais.",
    testar: "Compare o retorno com o que está configurado na tela de distribuição do painel para validar que bate.",
    curl: `curl -X GET "https://api.contact2sale.com/distribution_rules" \\
  -H "Authorization: Bearer {token}"`,
    video: ""
  },
  {
    slug: "criar-regra-distribuicao",
    method: "POST",
    path: "/distribution_rules",
    title: "Criar regra de distribuição",
    category: "Distribuição",
    summary: "Cria uma nova regra de distribuição vinculando uma região a um vendedor.",
    testar: "Teste com uma regra de prioridade alta isolada, depois confirme no painel se ela realmente está direcionando os leads certos.",
    curl: `curl -X POST "https://api.contact2sale.com/distribution_rules" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"cod_1":"SP","cod_2":"São Paulo","priority":1,"type_rule":"rotation","seller_id":"{seller_id}"}'`,
    video: ""
  },
  {
    slug: "listar-filas-distribuicao",
    method: "GET",
    path: "/distribution_queues",
    title: "Listar filas de distribuição",
    category: "Distribuição",
    summary: "Lista as filas de distribuição da empresa pai. Retorna headers de paginação (Total-pages, Total-entries, Current-page).",
    testar: "Confira os headers de paginação da resposta, não só o body, muita integração de cliente erra justamente aí.",
    curl: `curl -X GET "https://api.contact2sale.com/distribution_queues" \\
  -H "Authorization: Bearer {token}"`,
    video: ""
  },
  {
    slug: "listar-vendedores-fila",
    method: "GET",
    path: "/distribution_queues/:id/sellers",
    title: "Listar vendedores da fila",
    category: "Distribuição",
    summary: "Lista os vendedores de uma fila de distribuição específica, com paginação.",
    testar: "Pegue o ID da fila em Listar filas de distribuição antes de testar aqui.",
    curl: `curl -X GET "https://api.contact2sale.com/distribution_queues/{id}/sellers" \\
  -H "Authorization: Bearer {token}"`,
    video: ""
  },
  {
    slug: "atualizar-prioridades-fila",
    method: "PUT",
    path: "/distribution_queues/:id/sellers",
    title: "Atualizar prioridades da fila",
    category: "Distribuição",
    summary: "Atualiza as prioridades dos vendedores dentro de uma fila de distribuição.",
    testar: "Teste com uma fila pequena de 2 vendedores para confirmar visualmente a nova ordem antes de aplicar em filas grandes.",
    curl: `curl -X PUT "https://api.contact2sale.com/distribution_queues/{id}/sellers" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{ }'`,
    video: ""
  },
  {
    slug: "redistribuir-lead",
    method: "POST",
    path: "/distribution_queues/:id/redistribute",
    title: "Redistribuir lead",
    category: "Distribuição",
    summary: "Redistribui um lead específico pela fila de distribuição, passando para o próximo vendedor da rotação.",
    testar: "Use um lead de teste e confirme no painel se o novo vendedor bate com o next_seller esperado da fila.",
    curl: `curl -X POST "https://api.contact2sale.com/distribution_queues/{id}/redistribute" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"id":"{lead_id}"}'`,
    video: ""
  },
  {
    slug: "definir-proximo-vendedor",
    method: "PUT",
    path: "/distribution_queues/:id/next_seller",
    title: "Definir próximo vendedor da fila",
    category: "Distribuição",
    summary: "Define manualmente o próximo vendedor na rotação da fila. O vendedor precisa estar habilitado na fila.",
    testar: "Confirme antes que o vendedor escolhido está com status enabled na fila, senão a chamada falha silenciosamente.",
    curl: `curl -X PUT "https://api.contact2sale.com/distribution_queues/{id}/next_seller" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"next_queue_seller_id":123}'`,
    video: ""
  },

  // ---------------- Webhooks ----------------
  {
    slug: "assinar-webhook",
    method: "POST",
    path: "/api/subscribe",
    title: "Assinar webhook",
    category: "Webhooks",
    summary: "Assina eventos de webhook para leads: on_create_lead, on_update_lead ou on_close_lead. Só é possível 1 endpoint por token; um segundo cadastro apaga o primeiro.",
    testar: "Assine um gatilho de cada vez e teste separadamente. Lembre que cadastrar uma nova URL apaga a assinatura anterior desse token.",
    curl: `curl -X POST "https://api.contact2sale.com/api/subscribe" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"hook_action":"on_create_lead","hook_url":"https://seu-servidor.com/webhook"}'`,
    video: ""
  },
  {
    slug: "cancelar-webhook",
    method: "POST",
    path: "/api/unsubscribe",
    title: "Cancelar webhook",
    category: "Webhooks",
    summary: "Cancela a assinatura de um gatilho de webhook.",
    testar: "Depois de cancelar, dispare a ação correspondente (ex: criar um lead) e confirme que o servidor do cliente não recebeu mais nada.",
    curl: `curl -X POST "https://api.contact2sale.com/api/unsubscribe" \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"hook_action":"on_create_lead"}'`,
    video: ""
  },

  // ---------------- Stand de Vendas ----------------
  {
    slug: "listar-estandes",
    method: "GET",
    path: "/integration/sales_stand/stands",
    title: "Listar estandes",
    category: "Stand de Vendas",
    summary: "Lista os estandes de vendas acessíveis pela hierarquia da empresa, com o formulário associado a cada um. Só funciona se o módulo de Stand de Vendas estiver ativo na conta.",
    testar: "Sempre comece por aqui: os IDs retornados (stand e formulário) alimentam os outros dois endpoints deste módulo.",
    curl: `curl -X GET "https://api.contact2sale.com/integration/sales_stand/stands" \\
  -H "Authorization: Bearer {token}"`,
    video: ""
  },
  {
    slug: "listar-leads-estande",
    method: "GET",
    path: "/integration/sales_stand/leads",
    title: "Listar leads do estande",
    category: "Stand de Vendas",
    summary: "Lista os leads capturados em estandes de vendas, paginados de 50 em 50.",
    testar: "Filtre por custom_lead_form_ids usando o ID obtido em Listar estandes para conferir só os leads de um formulário específico.",
    curl: `curl -X GET "https://api.contact2sale.com/integration/sales_stand/leads?start_date=2026-07-01&end_date=2026-07-26" \\
  -H "Authorization: Bearer {token}"`,
    video: ""
  },
  {
    slug: "resumo-presencas-estande",
    method: "GET",
    path: "/integration/sales_stand/attendance_summaries",
    title: "Resumo de presenças",
    category: "Stand de Vendas",
    summary: "Lista o resumo de presenças por vendedor, gerente ou empresa, paginado de 50 em 50. start_date e end_date são obrigatórios.",
    testar: "Teste com um período curto (uma semana) primeiro para conferir os números antes de puxar um relatório mensal inteiro.",
    curl: `curl -X GET "https://api.contact2sale.com/integration/sales_stand/attendance_summaries?start_date=2026-07-01&end_date=2026-07-26" \\
  -H "Authorization: Bearer {token}"`,
    video: ""
  },

  // ---------------- Blocklist ----------------
  {
    slug: "listar-blocklist",
    method: "GET",
    path: "/integration/hierarchy_blocklists",
    title: "Listar blocklist",
    category: "Blocklist",
    summary: "Lista as entradas da blocklist da hierarquia, da mais recente para a mais antiga. Só funciona se a função de Hierarquia estiver ativa na conta.",
    testar: "Confirme que o escopo retornado é o da hierarquia correta antes de investigar por que um contato específico está bloqueado.",
    curl: `curl -X GET "https://api.contact2sale.com/integration/hierarchy_blocklists" \\
  -H "Authorization: {token}"`,
    video: ""
  },
  {
    slug: "adicionar-blocklist",
    method: "POST",
    path: "/integration/hierarchy_blocklists",
    title: "Adicionar à blocklist",
    category: "Blocklist",
    summary: "Adiciona telefone e/ou email à blocklist da hierarquia. Pelo menos um dos dois é obrigatório. Retorna 409 se já existir.",
    testar: "Teste enviando o mesmo telefone em dois formatos diferentes (com e sem DDI) para confirmar que o sistema reconhece como duplicado (409).",
    curl: `curl -X POST "https://api.contact2sale.com/integration/hierarchy_blocklists" \\
  -H "Authorization: {token}" \\
  -H "Content-Type: application/json" \\
  -d '{"hierarchy_blocklist":{"phone":"11999998888","remove_leads":true}}'`,
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
    versao: "1.1",
    data: "26 Jul 2026",
    itens: [
      "Todos os endpoints da API mapeados: Leads, Vendedores, Empresas, Tags, Distribuição, Webhooks, Stand de Vendas e Blocklist",
      "Páginas de endpoint simplificadas: sem tabela de parâmetros e sem response completo (isso já mora na doc oficial), focadas em resumo, como testar e vídeo de demonstração",
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
