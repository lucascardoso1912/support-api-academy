# Módulo 4 — Regras e Filas de Distribuição

Responde a pergunta mais comum sobre roteamento: por que o lead foi para esse vendedor.

O C2S tem dois mecanismos de roteamento na API: **regras** (“leads com este código vão para este vendedor”) e **filas** (“leads giram entre estes vendedores, nesta ordem”).

## Aula 4.1 — `GET /distribution_rules`: Listar Regras de Distribuição

**Prática:** 6 min
**Objetivo:** ler as regras de distribuição de uma conta e explicar o roteamento.

### Conceito

Cada regra liga códigos a um vendedor, com prioridade:

| Campo | Significado |
| --- | --- |
| `cod_1`, `cod_2`, `cod_3` | Códigos que o lead precisa bater (ex.: região) |
| `priority` | Ordem de avaliação |
| `type_rule` | `distribution` ou `rotation` |
| `seller_id` | Vendedor que recebe |
| `company_id` | Empresa da regra |

### Passo a passo

1. Pasta `Regras de Distribuição` → `GET /distribution_rules — Listar Regras de Distribuição`.
2. **GET** `{{base_url}}/distribution_rules` → **Send**.
3. Leia as regras em ordem de `priority` e cruze o `seller_id` com `GET /sellers` para ver o nome.
4. Compare com a tela de distribuição do C2S.

Nos exemplos da documentação oficial, os três códigos são o código do empreendimento, o nome do empreendimento e o tipo de negociação (ex.: `ABC123`, `Empreendimento Centro`, `Compra`). A tela de distribuição do C2S mostra as mesmas regras: use-a para confirmar o que cada código significa na conta do cliente.

## Aula 4.2 — `POST /distribution_rules`: Criar Regra de Distribuição

**Prática:** 7 min
**Objetivo:** criar uma regra de distribuição e conferir que ela entrou na conta.

### Passo a passo

1. `POST /distribution_rules — Criar Regra de Distribuição`, **POST** `{{base_url}}/distribution_rules`.
2. Body:

```json
{
  "cod_1": "CURSO",
  "priority": 1,
  "type_rule": "distribution",
  "seller_id": "<ID do vendedor>",
  "company_id": "<company_id da Aula 1.4>"
}
```

3. **Send** → **201** `{ "message": "Distribution rule created successfully" }`. A resposta não traz o ID da regra.
4. Rode a Aula 4.1 e veja a regra nova na lista, com o vendedor e a prioridade que você escolheu.
5. Mande o **mesmo** body de novo: a API recusa com **422** `Essa regra já está cadastrada`. Não existem duas regras com os mesmos códigos.

### Cuidado

Uma regra com `priority: 1` pode desviar leads reais. Na conta de teste, apague a regra pela tela depois do teste (a API pública não documenta exclusão).

## Aula 4.3 — `GET /distribution_queues/list_queues`: Listar Filas de Distribuição

**Prática:** 6 min
**Objetivo:** listar as filas e descobrir quem recebe o próximo lead.

### Conceito

Uma fila gira leads entre vendedores. Cada fila traz `id`, `name`, `priority`, `status`, `rules` e **`next_seller`**, o próximo da vez.

**Atenção:** aqui os IDs de fila são **números inteiros**, não o texto criptografado do resto da API.

### Passo a passo

1. `GET /distribution_queues/list_queues — Listar Filas de Distribuição`.
2. **GET** `{{base_url}}/distribution_queues/list_queues`, Params `page = 1`, `per_page = 50`.
3. **Send** → localize a fila e o `next_seller`.
4. Anote o `id` da fila: é um número, usado nas Aulas 4.4 a 4.7.

Repare: aqui o parâmetro é `per_page` (com underline); em `/leads` é `perpage`.

## Aula 4.4 — `GET /distribution_queues/:id/sellers`: Listar Vendedores da Fila

**Prática:** 5 min
### Passo a passo

1. **GET** `{{base_url}}/distribution_queues/:id/sellers`, Path Variable `id` = o `id` da fila (Aula 4.3).
2. **Send** → a lista vem em `distribution_queue_sellers`, com a prioridade e o `status` de cada vendedor.
3. Anote o ID numérico de cada vínculo vendedor-fila: ele é usado nas Aulas 4.5 e 4.7.

## Aula 4.5 — `POST /distribution_queues/:id/sellers_priorities`: Atualizar Prioridades dos Vendedores

**Prática:** 5 min
**Objetivo:** mudar a ordem dos vendedores na fila.

### Passo a passo

1. **POST** `{{base_url}}/distribution_queues/:id/sellers_priorities`, Path Variable `id` = o `id` da fila (Aula 4.3).
2. Body com a nova ordem. Cada item usa o `id` do **vínculo** vendedor-fila (Aula 4.4), a prioridade e o `status`:

```json
{
  "distribution_queue_sellers": [
    { "id": 123456, "priority": 1, "status": 1 },
    { "id": 123457, "priority": 2, "status": 1 }
  ]
}
```

3. **Send** → `"Prioridades atualizadas com sucesso."` e a lista com as novas prioridades. Confira com a Aula 4.4.

**Cuidado:** `status: 1` mantém o vendedor ativo na fila. **Sem o `status`, a API desativa o vendedor** (status 0).

## Aula 4.6 — `POST /distribution_queues/:id/redistribute_lead`: Redistribuir Lead

**Prática:** 6 min
**Objetivo:** mandar um lead de volta para a fila, para que vá ao próximo vendedor.

### Passo a passo

1. **POST** `{{base_url}}/distribution_queues/:id/redistribute_lead`, Path Variable `id` = o `id` da fila (Aula 4.3).
2. Body — aqui o ID do **lead** (criptografado) vai no campo `id`:

```json
{ "id": "<lead_id>" }
```

3. **Send** → resposta com `success`, o novo `lead_id` e `new_seller`.
4. Use o `lead_id` da resposta nas próximas chamadas: ele pode mudar na redistribuição.

### Diferença para o forward (Aula 2.8)

| | `forward` | `redistribute_lead` |
| --- | --- | --- |
| Quem escolhe o vendedor | Você | A fila |
| Precisa de ID de vendedor | Sim, dois | Não |
| Pode mudar o `lead_id` | Não | Sim |

## Aula 4.7 — `POST /distribution_queues/:id/next_seller`: Definir Próximo Vendedor

**Prática:** 5 min
**Objetivo:** forçar quem recebe o próximo lead da fila.

### Passo a passo

1. Na Aula 4.4, anote o ID numérico do vínculo do vendedor desejado.
2. **POST** `{{base_url}}/distribution_queues/:id/next_seller`, Path Variable `id` = o `id` da fila (Aula 4.3).
3. Body (número, sem aspas):

```json
{ "next_queue_seller_id": 123 }
```

4. **Send** → resposta com o `next_seller` atualizado.
5. Rode a Aula 4.3 e confira o `next_seller` da fila.

### No suporte — investigando a distribuição de um lead

1. `GET /leads/:id`: quem recebeu e quando.
2. `GET /distribution_rules`: alguma regra bate com o lead?
3. `GET /distribution_queues/list_queues`: qual fila e quem era o `next_seller`.
4. `GET /distribution_queues/:id/sellers`: o vendedor esperado estava na fila e ativo?
5. `GET /sellers`: `is_recipient` do vendedor esperado está `true`?
