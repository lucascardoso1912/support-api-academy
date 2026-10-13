# Módulo 5 — Stand de Vendas e Blocklist

Endpoints menos usados, mas que aparecem em clientes de incorporadoras e em casos de leads indesejados.

Os caminhos seguem o mesmo padrão do resto da API: `{{base_url}}/sales_stand/...` e `{{base_url}}/hierarchy_blocklists`. O `llms-full.txt` oficial mostra `/integration/integration/...`, mas o caminho com um `/integration` só é o que responde (confirmado na chamada de um cliente). Use sempre esse.

Pré-requisitos na conta do cliente:

| Seção | Só funciona com |
| --- | --- |
| Stand de Vendas | Módulo **Stand de Vendas** ativo |
| Blocklist | Função **Hierarquia** ativa. Sem ela, a API devolve **422** `translation missing: pt-BR.errors.messages.hierarchy_not_configured` |

**Nesta trilha, Stand de Vendas e Blocklist são só explicados.** Monte as requests para conhecer o formato, mas **não clique em Send**: nos testes do Suporte (Aula 7.4) essas chamadas não são executadas.

## Aula 5.1 — `GET /sales_stand/stands`: Listar Estandes

**Prática:** 5 min
**Objetivo:** entender como listar os stands de plantão/showroom e seus formulários.

### Conceito

Incorporadoras e revendas usam stands (plantão de vendas, showroom) onde o visitante faz check-in por formulário. Cada stand tem `id`, `name`, empresa e `custom_lead_form_id`.

### Passo a passo

1. Pasta `Stand de Vendas` → `GET /sales_stand/stands — Listar Estandes`.
2. **GET** `{{base_url}}/sales_stand/stands`.
3. Opcional: Params `company_ids[] = <company_id>` para filtrar por empresa. Para várias, repita a key `company_ids[]` em linhas diferentes.
4. A resposta traz, para cada stand, o `id` e o `custom_lead_form_id`, usado na Aula 5.2.

### Parâmetros com `[]`

`company_ids[]` é uma lista na URL. No Postman, cada item é uma linha na aba Params com a **mesma key**. A URL fica `?company_ids[]=A&company_ids[]=B`.

## Aula 5.2 — `GET /sales_stand/leads`: Listar Leads do Estande

**Prática:** 6 min
**Objetivo:** listar visitantes de um stand num período, com check-in e check-out.

### Passo a passo

1. **GET** `{{base_url}}/sales_stand/leads`.
2. Params:

| Key | Value |
| --- | --- |
| `start_date` | `2026-09-01` |
| `end_date` | `2026-09-23` |
| `custom_lead_form_ids[]` | ID do formulário da Aula 5.1 (opcional) |
| `company_ids[]` | `<company_id>` (opcional) |
| `page` | `1` |

3. A resposta traz, para cada visitante, cliente, vendedor, status e horários de entrada e saída.

Datas aqui são **AAAA-MM-DD**, sem hora.

## Aula 5.3 — `GET /sales_stand/attendance_summaries`: Resumo de Presenças

**Prática:** 5 min
**Objetivo:** tirar o resumo de atendimentos por diretor e gerente.

### Passo a passo

1. **GET** `{{base_url}}/sales_stand/attendance_summaries`.
2. Params **obrigatórios**: `start_date` e `end_date`. Opcionais: `sales_stand_ids[]`, `company_ids[]`, `page`.
3. A resposta traz a quantidade de atendimentos, o total de leads e o tempo médio por vendedor.

Sem `start_date` e `end_date`, a chamada falha: aqui as datas são obrigatórias.

## Aula 5.4 — `GET /hierarchy_blocklists`: Listar Blocklist

**Prática:** 4 min
**Objetivo:** conferir se um telefone ou e-mail está bloqueado.

### Conceito

A blocklist impede que leads novos de certos contatos sejam distribuídos em toda a hierarquia (matriz e filiais). Usos comuns: números de teste, funcionários, concorrentes, spam.

### Passo a passo

1. `GET /hierarchy_blocklists — Listar Blocklist`, **GET** `{{base_url}}/hierarchy_blocklists`.
2. A resposta traz a lista em `blocklists[]`, com telefone ou e-mail e datas, da mais recente para a mais antiga.

### No suporte

“O lead deste cliente nunca chega”: antes de investigar integração, confira se o contato está na blocklist.

## Aula 5.5 — `POST /hierarchy_blocklists`: Adicionar à Blocklist

**Prática:** 6 min
**Objetivo:** entender como se bloqueia um contato e o risco de `remove_leads`.

### Passo a passo

1. **POST** `{{base_url}}/hierarchy_blocklists`.
2. Body (casca `hierarchy_blocklist`):

```json
{
  "hierarchy_blocklist": {
    "phone": "11900000000",
    "remove_leads": false
  }
}
```

3. Resposta de sucesso: o contato entra na blocklist e, a partir daí, leads novos com esse telefone ou e-mail não são distribuídos na hierarquia.
4. Se o contato já estiver bloqueado, a API devolve **409**. O 409 também vale quando o mesmo telefone já está bloqueado com outra formatação (ex.: `+55 11 90000-0000`).

| Campo | Regra |
| --- | --- |
| `phone` / `email` | Pelo menos um dos dois |
| `remove_leads` | `true` também **remove ou redistribui os leads que já existem** desse contato, em segundo plano. Padrão `false` |

### Cuidado

Nunca use `remove_leads: true` na conta de um cliente sem autorização por escrito: os leads existentes saem do vendedor atual.

| Resposta | Significado |
| --- | --- |
| 409 | Contato já bloqueado |
| 422 `hierarchy_not_configured` | A conta não tem a função Hierarquia ativa: fale com o Comercial |

A API não tem rota para desbloquear um contato nem para excluir leads.
