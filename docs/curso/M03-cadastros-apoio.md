# Módulo 3 — Usuários, Empresas e Tags

São as consultas que entregam os IDs que todo o resto da API pede.

## Aula 3.1 — `GET /me` e `GET /companies`: Informações da Empresa e Listar Empresas

**Prática:** 6 min
**Objetivo:** mapear a estrutura de empresas de um cliente com várias unidades.

### Conceito

Clientes grandes têm matriz e filiais (hierarquia). O token pertence a uma delas.

| Endpoint | Responde |
| --- | --- |
| `GET /me` | A empresa do token + `sub_companies` |
| `GET /companies` | Todas as empresas do grupo, com `id` e `name` |

### Passo a passo

1. Rode `GET /me — Informações da Empresa` (Aula 1.4) e anote quantas `sub_companies` existem.
2. Pasta `Empresas` → `GET /companies — Listar Empresas` → **GET** `{{base_url}}/companies` → **Send**.
3. Compare as duas listas.
4. Copie o `id` da filial desejada para `company_id` (botão direito → *Set*).

### No suporte

“O lead foi para a filial errada”: confira com `GET /me` de qual empresa é o token usado pela integração. Um token de matriz cria leads na matriz.

## Aula 3.2 — `GET /sellers`: Listar Vendedores

**Prática:** 6 min
**Objetivo:** achar o ID de um vendedor e ler as permissões dele.

### Passo a passo

1. Pasta `Usuários` → `GET /sellers — Listar Vendedores`.
2. **GET** `{{base_url}}/sellers` → **Send**.
3. Cada vendedor traz `id`, nome, e-mail, telefone, empresa e permissões.
4. Use a busca da resposta (lupa) para achar um vendedor pelo e-mail.

## Aula 3.3 — `POST /sellers`: Criar Vendedor

**Prática:** 8 min
**Objetivo:** cadastrar um vendedor pela API, com as permissões certas.

### Conceito

| Campo | Tipo | Significado |
| --- | --- | --- |
| `company_id` | ID | Empresa onde o vendedor entra |
| `name`, `username`, `email`, `phone1` | texto | Dados básicos |
| `is_recipient` | booleano | Recebe leads da distribuição |
| `is_rescue` | booleano | Atua como resgate |
| `is_master` | booleano | Perfil Master |
| `can_access_users` | booleano | Pode gerenciar usuários |
| `show_in_metrics` | booleano | Aparece nos relatórios |
| `external_id` | texto | ID no sistema do cliente |
| `team`, `own_captations_aux` | lista de números | Equipes e captações |

### Passo a passo

1. `POST /sellers — Criar Vendedor`, **POST** `{{base_url}}/sellers`.
2. Body:

```json
{
  "company_id": "<company_id da Aula 1.4>",
  "name": "Vendedor Curso",
  "username": "vendedor.curso",
  "email": "{{$randomEmail}}",
  "phone1": "11988887777",
  "is_recipient": true,
  "is_master": false,
  "show_in_metrics": false
}
```

3. **Send** → copie o `id` do vendedor criado: ele é usado na Aula 3.4.

4. Veja o vendedor na tela de usuários do C2S.

Se o `username` já existir, a API recusa com **422** `Nome de usuário já existente, por favor escolha outro`.

### Cuidado

Criar vendedor na conta de um cliente pode afetar licenças e distribuição. Na conta de teste, deixe `show_in_metrics: false`.

## Aula 3.4 — `PUT /sellers/:id`: Atualizar Vendedor

**Prática:** 6 min
**Objetivo:** mudar dados e permissões, por exemplo tirar um vendedor da distribuição.

### Passo a passo

1. `PUT /sellers/:id — Atualizar Vendedor`, **PUT** `{{base_url}}/sellers/:id`, Path Variable `id` = o `id` do vendedor (Aula 3.2 ou 3.3).
2. Body — vendedor sai de férias e para de receber leads:

```json
{
  "is_recipient": false
}
```

3. **Send** → confira na resposta e com `GET /sellers`.

Além dos campos da criação, aceita `recipient_rotation`, `recipient_distribution`, `recipient_memory` e `can_view_bucket`.

## Aula 3.5 — `PUT /sellers/batch_update_timeshift`: Batch Update Timeshift

**Prática:** 6 min
**Objetivo:** definir, numa chamada só, a ordem em que uma equipe volta a receber leads.

### Conceito

A API processa os vendedores da lista **de trás para frente** e registra o último lead recebido de cada um com 1 segundo de diferença. Na prática, a ordem da lista define a ordem de prioridade entre esses vendedores.

### Passo a passo

1. Colete os IDs com `GET /sellers`.
2. `PUT /sellers/batch_update_timeshift — Batch Update Timeshift`, **PUT** `{{base_url}}/sellers/batch_update_timeshift`.
3. Body:

```json
{
  "seller_ids": ["<id vendedor 1>", "<id vendedor 2>"]
}
```

4. **Send** → `{ "success": true }`.

A documentação oficial também lista `recipient_rotation`, `recipient_distribution` e `recipient_memory` neste body. Eles são opcionais: para definir a ordem, basta `seller_ids`.

### Observação

A rota `batch_update_timeshift` fica no lugar do `:id`. Por isso ela precisa ser uma request separada, sem Path Variable.

## Aula 3.6 — `GET /tags`: Listar Tags

**Prática:** 5 min
**Objetivo:** achar o ID de uma tag pelo nome.

### Conceito

Lista as tags da empresa do token com `id`, `name`, `enabled`, `autofill` e `instructions`. Aceita dois filtros:

| Param | Exemplo | Efeito |
| --- | --- | --- |
| `name` | `Quente` | Só a tag com esse nome (não diferencia maiúsculas) |
| `autofill` | `true` | Só tags de preenchimento automático |

### Passo a passo

1. Pasta `Tags` → `GET /tags — Listar Tags`.
2. **GET** `{{base_url}}/tags` → **Send** → veja todas.
3. Params: `name = Quente` → **Send** → só uma.
4. Copie o `id` da tag: é ele que os endpoints de tag do lead pedem (Aula 2.9).

### Atenção

O filtro `name` não diferencia maiúsculas (`quente` acha `Quente`), mas precisa do nome completo. Liste sem filtro quando não souber a grafia.

## Aula 3.7 — `POST /tags`: Criar Tag

**Prática:** 5 min
**Objetivo:** criar uma tag sem risco de duplicar.

### Conceito

Se já existe uma tag com o mesmo nome, a API **devolve a existente** em vez de criar outra. Isso torna seguro chamar `POST /tags` sempre antes de aplicar uma tag, sem precisar consultar antes.

### Passo a passo

1. `POST /tags — Criar Tag`, **POST** `{{base_url}}/tags`.
2. Body (a casca aqui é `tag`):

```json
{
  "tag": {
    "name": "Curso",
    "autofill": false,
    "instructions": "Tag usada nos testes do curso de API"
  }
}
```

3. **Send** → a API responde **201** com a tag dentro de `tag`: `id`, `company_id` e datas.
4. Copie o `id` da tag criada.
5. Envie de novo o mesmo body. A resposta continua **201** e o `id` é o mesmo, mas agora vem uma chave `errors` avisando que a tag já existia. Isso não é falha.

### Resumo das cascas da API

| Endpoint | Casca do body |
| --- | --- |
| `POST /leads` | `data → attributes` |
| `PUT /leads/:id` | `lead` |
| `POST /tags` | `tag` |
| `POST /hierarchy_blocklists` | `hierarchy_blocklist` |
| Demais | JSON direto, sem casca |

Guarde esta tabela: casca errada é a causa nº 1 de erro de integração.

### Exercício

Fluxo “garantir e aplicar tag”: `POST /tags` (cria ou devolve) → `POST /leads/:id/create_tag` com o `tag_id` salvo → `GET /leads/:id/tags`.
