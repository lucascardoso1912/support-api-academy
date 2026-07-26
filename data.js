// ============================================================
// SUPPORT API ACADEMY — base de dados de endpoints
// Para adicionar um novo endpoint, copie um objeto do array
// ENDPOINTS abaixo, preencha os campos e pronto — ele aparece
// automaticamente no menu, na busca e na página de detalhes.
//
// Campo "video": cole o link do vídeo (Loom, YouTube não-listado,
// Drive, Streamable etc). Deixe "" se ainda não gravou — a seção
// de vídeo só aparece na página quando esse campo é preenchido.
// ============================================================

const ENDPOINTS = [
  {
    slug: "verificar-autenticacao",
    method: "GET",
    path: "/integration",
    title: "Verificar autenticação",
    category: "Autenticação",
    summary: "Valida o token e retorna os dados da empresa autenticada e suas sub-empresas.",
    description: "Use este endpoint como primeiro teste sempre que for validar um token novo ou investigar um caso de erro 403. Se o token for válido, a API responde com os dados da empresa. Se não for, você já sabe de cara que o problema é de autenticação — sem precisar tentar em outro endpoint mais complexo primeiro.",
    headers: [
      { key: "Authorization", value: "Bearer {token}", desc: "Token de autenticação (preferencial)" },
      { key: "Authentication", value: "{token}", desc: "Header alternativo para o mesmo token" }
    ],
    params: [],
    response: `{
  "company_name": "Empresa Exemplo",
  "company_id": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
  "sub_companies": [
    {
      "company_id": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
      "company_name": "Empresa Exemplo"
    },
    {
      "company_id": "d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1",
      "company_name": "Empresa Exemplo - Filial 2"
    }
  ]
}`,
    errors: [
      { code: "403", meaning: "not_authorized", cause: "Token ausente, expirado ou incorreto." }
    ],
    curl: `curl -X GET "https://api.contact2sale.com/integration" \\
  -H "Authorization: Bearer {token}"`,
    python: `import requests

url = "https://api.contact2sale.com/integration"
headers = {"Authorization": f"Bearer {TOKEN}"}

response = requests.get(url, headers=headers)
print(response.status_code)
print(response.json())`,
    video: ""
  },
  {
    slug: "listar-leads",
    method: "GET",
    path: "/integration/leads",
    title: "Listar leads",
    category: "Leads",
    summary: "Lista os leads da empresa autenticada, com filtros e paginação.",
    description: "Endpoint mais usado no dia a dia. Permite filtrar por status, tags, telefone, email e datas de criação/atualização, além de paginar os resultados. Muito útil para investigar 'o lead X não apareceu no CRM do cliente' — dá pra filtrar direto por telefone ou email do cliente reclamado.",
    headers: [
      { key: "Authorization", value: "Bearer {token}", desc: "Token de autenticação (preferencial)" },
      { key: "Authentication", value: "{token}", desc: "Header alternativo para o mesmo token" }
    ],
    params: [
      { name: "page", type: "integer", required: false, desc: "Número da página" },
      { name: "perpage", type: "integer", required: false, desc: "Itens por página (máximo 50)" },
      { name: "sort", type: "string", required: false, desc: "Campo de ordenação (created_at, updated_at). Prefixo - para DESC" },
      { name: "last_update", type: "string", required: false, desc: "Filtro por datetime ISO 8601 — leads atualizados desde esta data" },
      { name: "created_gte", type: "string", required: false, desc: "Leads criados a partir desta data (inclusive)" },
      { name: "created_lt", type: "string", required: false, desc: "Leads criados antes desta data" },
      { name: "updated_gte", type: "string", required: false, desc: "Leads atualizados a partir desta data (inclusive)" },
      { name: "updated_lt", type: "string", required: false, desc: "Leads atualizados antes desta data" },
      { name: "status", type: "string", required: false, desc: "novo, em_negociacao, convertido, negocio_fechado, arquivado, resgatado, pendente, recusado, finalizado" },
      { name: "tags", type: "string", required: false, desc: "Nomes de tags separados por vírgula" },
      { name: "phone", type: "string", required: false, desc: "Filtrar pelo telefone do cliente" },
      { name: "email", type: "string", required: false, desc: "Filtrar pelo email do cliente" },
      { name: "first_message", type: "boolean", required: false, desc: "Incluir primeira mensagem na resposta" },
      { name: "custom_attributes", type: "boolean", required: false, desc: "Incluir atributos customizados na resposta" },
      { name: "from_hierarchy_company", type: "boolean", required: false, desc: "Inclui o nome da hierarquia (empresa) que gerou o lead" }
    ],
    response: `{
  "data": [
    {
      "type": "lead",
      "id": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
      "internal_id": 12345678,
      "attributes": {
        "description": "Apartamento 3 quartos",
        "product": {
          "description": "[101] Apartamento 3 quartos",
          "price": "350.000,00",
          "city": "São Paulo"
        },
        "customer": {
          "name": "João Silva",
          "email": "joao.silva@email.com",
          "phone": "5511999999999"
        },
        "lead_status": {
          "alias": "under_negotiation",
          "name": "Em negociação"
        },
        "created_at": "2026-04-16T11:40:26.000-03:00",
        "updated_at": "2026-04-16T11:41:52.000-03:00"
      }
    }
  ],
  "pagination": {
    "current_page": 1,
    "per_page": 50,
    "total_count": 150,
    "total_pages": 3
  }
}`,
    errors: [
      { code: "403", meaning: "not_authorized", cause: "Token ausente, expirado ou incorreto." }
    ],
    curl: `curl -X GET "https://api.contact2sale.com/integration/leads?status=em_negociacao&perpage=50" \\
  -H "Authorization: Bearer {token}"`,
    python: `import requests

url = "https://api.contact2sale.com/integration/leads"
headers = {"Authorization": f"Bearer {TOKEN}"}
params = {"status": "em_negociacao", "perpage": 50}

response = requests.get(url, headers=headers, params=params)
print(response.status_code)
print(response.json())`,
    video: ""
  }
];

// Casos reais de investigação — adicione novos casos aqui
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
    causaRaiz: "Na maioria dos casos, token antigo/regenerado ou header montado errado (faltando 'Bearer ').",
    escalar: "Se o token validado manualmente funciona no Postman mas falha no sistema do cliente, o problema é do lado da integração dele — orientar o cliente, não escalar internamente."
  },
  {
    id: "CASO-002",
    titulo: "Lead não aparece na busca do cliente",
    problema: "Cliente diz que um lead criado não aparece no CRM dele.",
    passos: [
      "Buscar o lead em /integration/leads filtrando por phone ou email do cliente final",
      "Conferir o campo status do lead — pode estar arquivado ou em status que a integração do cliente ignora",
      "Conferir created_at/updated_at para saber se o filtro de data da integração do cliente está cobrindo o período",
      "Verificar from_hierarchy_company se a empresa usa hierarquia — o lead pode ter sido criado em outra sub-empresa"
    ],
    causaRaiz: "Geralmente é filtro de status ou de data na integração do próprio cliente, não um bug da API.",
    escalar: "Escalar apenas se o lead existir, estiver com status esperado, e mesmo assim não retornar na chamada correta."
  }
];

// Changelog do projeto
const CHANGELOG = [
  {
    versao: "1.0",
    data: "26 Jul 2026",
    itens: [
      "Estrutura inicial da trilha (Fundamentos, Endpoints, Postman, Troubleshooting, Casos Reais, Checklist)",
      "Endpoint: Verificar autenticação",
      "Endpoint: Listar leads",
      "2 casos reais documentados"
    ]
  }
];
