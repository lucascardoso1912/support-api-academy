# Gera postman/API-C2S.postman_collection.json e postman/C2S.postman_environment.json
# Uso (na raiz do projeto):  powershell -ExecutionPolicy Bypass -File tools/build-postman.ps1
# Fonte: docs/00-referencia-api.md + spec/openapi.json (oficial).

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$outDir = Join-Path $root 'postman'
New-Item -ItemType Directory -Force $outDir | Out-Null

# ---------------------------------------------------------------- helpers

function Lines([string]$text) { ,@($text -split "`r?`n") }

function New-Url([string]$path, $query) {
    $raw = '{{base_url}}' + $path
    $url = [ordered]@{
        raw  = $raw
        host = @('{{base_url}}')
        path = @($path.Trim('/') -split '/')
    }
    if ($query) {
        $url.query = @($query | ForEach-Object {
            [ordered]@{ key = $_[0]; value = $_[1]; disabled = [bool]$_[2]; description = $_[3] }
        })
        $enabled = @($query | Where-Object { -not $_[2] } | ForEach-Object { "$($_[0])=$($_[1])" })
        if ($enabled.Count) { $url.raw = $raw + '?' + ($enabled -join '&') }
    }
    $url
}

function Req {
    param(
        [string]$Name, [string]$Method, [string]$Path, [string]$Desc,
        [string]$Body, [string]$Test, $Query, [string]$Pre
    )
    $request = [ordered]@{
        method      = $Method
        header      = @()
        url         = New-Url $Path $Query
        description = $Desc
    }
    if ($Body) {
        $request.header = @([ordered]@{ key = 'Content-Type'; value = 'application/json' })
        $request.body = [ordered]@{
            mode    = 'raw'
            raw     = $Body.Trim()
            options = [ordered]@{ raw = [ordered]@{ language = 'json' } }
        }
    }
    $events = @()
    if ($Pre)  { $events += [ordered]@{ listen = 'prerequest'; script = [ordered]@{ type = 'text/javascript'; exec = (Lines $Pre.Trim()) } } }
    if ($Test) { $events += [ordered]@{ listen = 'test';       script = [ordered]@{ type = 'text/javascript'; exec = (Lines $Test.Trim()) } } }
    $item = [ordered]@{ name = $Name; request = $request }
    if ($events.Count) { $item.event = $events }
    $item
}

function Folder([string]$Name, [string]$Desc, [array]$Items) {
    [ordered]@{ name = $Name; description = $Desc; item = $Items }
}

# Trechos de teste reutilizados
function T-Status([int[]]$codes) {
    $list = ($codes -join ', ')
    "pm.test(`"Status HTTP esperado ($list)`", () => pm.expect(pm.response.code).to.be.oneOf([$list]));"
}
$T_Json = 'let r = {}; try { r = pm.response.json(); } catch (e) { pm.test("Resposta é JSON válido", () => { throw e; }); }'
$T_Success = 'pm.test("success = true", () => pm.expect(r.success).to.eql(true));'
# teste mais comum: status esperado + resposta em JSON válido
function T-Basic([int[]]$codes) { "$(T-Status $codes)`n$T_Json" }

# ---------------------------------------------------------------- Informações Gerais e Empresas

$me = Req -Name 'Informações da Empresa · GET /me' -Method GET -Path '/me' -Desc @'
**Primeiro teste de todo caso de API.** Confirma que o token funciona e a qual empresa pertence.
Salva `company_id` no environment.
'@ -Test (@"
$(T-Status 200)
$T_Json
pm.test("Retorna company_name e company_id", () => {
    pm.expect(r).to.have.property("company_name");
    pm.expect(r).to.have.property("company_id");
});
if (r.company_id) pm.environment.set("company_id", r.company_id);
console.log("Token pertence a: " + r.company_name + " (" + r.company_id + ")");
"@)

$companies = Req -Name 'Listar Empresas · GET /companies' -Method GET -Path '/companies' -Desc 'Lista as empresas do grupo (`id`, `name`). Use para achar o `company_id` da unidade certa.' -Test (@"
$(T-Status 200)
$T_Json
pm.test("Retorna uma lista de empresas", () => pm.expect(r).to.be.an("array"));
(Array.isArray(r) ? r : []).forEach(c => console.log(c.id + "  " + c.name));
"@)

# ---------------------------------------------------------------- Leads

$leadCreate = Req -Name 'Criar Lead · POST /leads' -Method POST -Path '/leads' -Desc @'
Cria um lead. **Único endpoint com envelope `data.type.attributes`.**
Obrigatório: `phone` **ou** `email` (sem os dois → 423).
`received_by` na resposta = vendedor que recebeu o lead. Salva `lead_id`.
Valores de `channel_id`: 1 a 5 (1 = Internet, padrão).
'@ -Body @'
{
  "data": {
    "type": "lead",
    "attributes": {
      "name": "Pedro Silva (TESTE SUPORTE)",
      "email": "pedro.teste+{{$timestamp}}@exemplo.com",
      "phone": "{{test_phone}}",
      "description": "Apartamento 2 quartos",
      "prop_ref": "AP12345",
      "price": "R$ 250.000,00",
      "city": "Campinas",
      "neighbourhood": "Botafogo",
      "channel_id": 1,
      "body": "Olá, tenho interesse no imóvel.",
      "source": "suporte_postman",
      "external_id": "SUP-{{$timestamp}}"
    }
  }
}
'@ -Test (@"
$(T-Status 200,201)
$T_Json
$T_Success
pm.test("Retornou lead_id", () => pm.expect(r.lead_id).to.be.a("string").and.not.empty);
if (r.lead_id) pm.environment.set("lead_id", r.lead_id);
if (r.received_by) pm.environment.set("seller_from_id", r.received_by.id);
if (r.received_by) console.log("Lead recebido por: " + r.received_by.name + " <" + r.received_by.email + ">");
"@)

$leadList = Req -Name 'Listar Leads · GET /leads' -Method GET -Path '/leads' -Desc @'
Busca leads. Ative só os filtros que precisar na aba **Params**. Máximo 50 por página.
`status` aceita: novo, em_negociacao, convertido, negocio_fechado, arquivado, resgatado, pendente, recusado, finalizado.
`sort` aceita created_at / updated_at (prefixo `-` = decrescente).
Salva o `id` do primeiro resultado em `lead_id`.
'@ -Query @(
    ,@('sort', '-created_at', $false, 'Mais recentes primeiro')
    ,@('perpage', '10', $false, 'Máximo 50')
    ,@('page', '1', $true, 'Página')
    ,@('phone', '{{test_phone}}', $true, 'Telefone do cliente')
    ,@('email', 'pedro@exemplo.com', $true, 'E-mail do cliente')
    ,@('created_gte', '2026-09-01T03:00:00Z', $true, 'Criados a partir de (inclusive). Só UTC com Z')
    ,@('created_lt', '2026-10-01T03:00:00Z', $true, 'Criados antes de. Só UTC com Z')
    ,@('updated_gte', '2026-09-01T03:00:00Z', $true, 'Atualizados a partir de. Só UTC com Z')
    ,@('updated_lt', '2026-10-01T03:00:00Z', $true, 'Atualizados antes de. Só UTC com Z')
    ,@('status', 'novo', $true, 'novo, em_negociacao, arquivado... (status=new devolve 0)')
    ,@('tags', 'Quente', $true, 'Nomes de tags separados por vírgula')
) -Test (@"
$(T-Status 200)
$T_Json
pm.test("Retorna data[] e meta.total", () => {
    pm.expect(r.data).to.be.an("array");
    pm.expect(r.meta).to.have.property("total");
});
if (r.meta) {
    const perpage = Number(pm.request.url.query.get("perpage")) || 10;
    console.log("Total: " + r.meta.total + " lead(s) em " + Math.ceil(r.meta.total / perpage) + " página(s) de " + perpage);
}
if (r.data && r.data.length) pm.environment.set("lead_id", r.data[0].id);
"@)

$T_LeadDetail = @"
$(T-Status 200)
$T_Json
pm.test("Retorna data.id igual ao lead_id", () => pm.expect(r.data.id).to.eql(pm.environment.get("lead_id")));
"@

$leadGet = Req -Name 'Buscar Lead por ID · GET /leads/:id' -Method GET -Path '/leads/{{lead_id}}' -Desc 'Lead completo: cliente, produto, vendedor, status, mensagens, atividades (`schedulated_actions`) e tags. 404 = o lead está em outra empresa do grupo. Não use `from_hierarchy_company` (erro na API).' -Test $T_LeadDetail

$leadPut = Req -Name 'Atualizar Lead · PUT /leads/:id' -Method PUT -Path '/leads/{{lead_id}}' -Desc 'Envie só o que muda, dentro de `lead` (sem envelope `data`).' -Body @'
{
  "lead": {
    "channel_id": 1,
    "customer": { "name": "Pedro Silva (TESTE ATUALIZADO)" },
    "product": { "description": "Apartamento 3 quartos" }
  }
}
'@ -Test (@"
$(T-Status 200)
$T_Json
pm.test("Resposta traz o lead atualizado", () => { pm.expect(r.success).to.eql(true); pm.expect(r).to.have.property("lead"); });
"@)

$leadForward = Req -Name 'Encaminhar Lead · PATCH /leads/:id/forward' -Method PATCH -Path '/leads/{{lead_id}}/forward' -Desc @'
Transfere o lead. Rode antes **GET /sellers** e preencha `seller_from_id` (atual) e `seller_id` (novo) no environment.
'@ -Pre @'
["seller_from_id", "seller_id"].forEach(v => {
    if (!pm.environment.get(v)) throw new Error("Preencha '" + v + "' no environment (use GET /sellers).");
});
'@ -Body @'
{
  "seller_from_id": "{{seller_from_id}}",
  "seller_to_id": "{{seller_id}}"
}
'@ -Test (@"
$(T-Status 200)
$T_Json
$T_Success
if (r.lead) console.log("Novo seller_id (numérico interno): " + r.lead.seller_id);
"@)

$leadTags = Req -Name 'Listar Tags do Lead · GET /leads/:id/tags' -Method GET -Path '/leads/{{lead_id}}/tags' -Desc 'Lista as tags aplicadas ao lead.' -Test (T-Basic 200)

$T_NeedTag = @'
if (!pm.environment.get("tag_id")) throw new Error("Preencha 'tag_id' (rode GET /tags ou POST /tags).");
'@

$leadAddTag = Req -Name 'Adicionar Tag ao Lead · POST /leads/:id/create_tag' -Method POST -Path '/leads/{{lead_id}}/create_tag' -Desc 'Aplica a tag `{{tag_id}}` ao lead.' -Pre $T_NeedTag -Body @'
{ "tag_id": "{{tag_id}}" }
'@ -Test (@"
$(T-Status 200,201)
$T_Json
$T_Success
"@)

$leadRemoveTag = Req -Name 'Remover Tag do Lead · POST /leads/:id/remove_tag' -Method POST -Path '/leads/{{lead_id}}/remove_tag' -Desc 'Remove uma tag. Também aceita lista: `{ "tag_id": ["id1", "id2"] }`.' -Pre $T_NeedTag -Body @'
{ "tag_id": "{{tag_id}}" }
'@ -Test (T-Basic 200,201)

$leadRead = Req -Name 'Marcar Lead como Lido · POST /leads/:id/mark_as_interacted' -Method POST -Path '/leads/{{lead_id}}/mark_as_interacted' -Desc 'Sem body. Usado quando o atendimento acontece fora do C2S (ex.: chatbot).' -Test (@"
$(T-Status 200)
$T_Json
$T_Success
pm.test("read_at preenchido", () => pm.expect(r.lead.read_at).to.be.a("string"));
"@)

$leadMsg = Req -Name 'Criar Mensagem no Lead · POST /leads/:id/create_message' -Method POST -Path '/leads/{{lead_id}}/create_message' -Desc 'Grava mensagem no histórico (chatbots / WhatsApp). Opcionais: `url`, `external_id`, `parent_message_id`, `tags`.' -Body @'
{
  "body": "Mensagem de teste do Suporte",
  "from": "bot",
  "origin": "whatsapp",
  "message_type": "text",
  "sender_name": "Assistente Virtual",
  "created_at": "{{$isoTimestamp}}"
}
'@ -Test (T-Basic 200,201)

$leadActivity = Req -Name 'Criar Atividade no Lead · POST /leads/:id/create_activity' -Method POST -Path '/leads/{{lead_id}}/create_activity' -Desc 'Cria atividade/lembrete. Aparece em `schedulated_actions`. `send_push: true` notifica o vendedor.' -Body @'
{
  "date": "2026-12-01T14:00:00-03:00",
  "type": { "activity": true },
  "body": "Ligar para confirmar visita (TESTE)",
  "send_push": false,
  "title": "Retorno ao cliente"
}
'@ -Test (T-Basic 200,201)

$leadStatus = Req -Name 'Atualizar Status do Lead · POST /leads/:id/update_status' -Method POST -Path '/leads/{{lead_id}}/update_status' -Desc @'
`status`: 0 = novo, 1 = em negociação, 3 = perdido/arquivado.
`lost_reason_ids` são IDs de motivo de perda da conta **[Validar origem]**.
'@ -Body @'
{
  "status": 3,
  "message": "Teste do Suporte - cliente sem interesse",
  "lost_reason_ids": []
}
'@ -Test (@"
$(T-Status 200,201)
$T_Json
if (r.data && r.data.attributes && r.data.attributes.lead_status)
    console.log("Status agora: " + r.data.attributes.lead_status.name + " (" + r.data.attributes.lead_status.alias + ")");
"@)

$leadDeal = Req -Name 'Fechar Negócio do Lead · POST /leads/:id/done_deal' -Method POST -Path '/leads/{{lead_id}}/done_deal' -Desc 'Registra negócio fechado. **Data só `AAAA-MM-DD`.**' -Body @'
{
  "prop_ref": "AP12345",
  "done_type_negotiation": "sale",
  "info": "Venda de teste do Suporte",
  "date": "2026-09-23",
  "value": "250000"
}
'@ -Test (T-Basic 200,201)

# ---------------------------------------------------------------- Usuários

$sellers = Req -Name 'Listar Vendedores · GET /sellers' -Method GET -Path '/sellers' -Desc 'Lista vendedores (id criptografado, nome, e-mail, flags). Mostra os IDs no Console. Copie o do vendedor de destino para `seller_id`.' -Test (@"
$(T-Status 200)
$T_Json
pm.test("Retorna uma lista", () => pm.expect(r).to.be.an("array"));
(Array.isArray(r) ? r : []).forEach(s => console.log(s.id + "  " + s.name + "  recebe=" + s.is_recipient + "  master=" + s.is_master));
"@)

$sellerCreate = Req -Name 'Criar Vendedor · POST /sellers' -Method POST -Path '/sellers' -Desc 'Cria vendedor na empresa `{{company_id}}` (rode GET /me antes). Salva o `id` em `new_seller_id`.' -Body @'
{
  "company_id": "{{company_id}}",
  "name": "Vendedor Teste Suporte",
  "username": "vendedor.teste.{{$timestamp}}",
  "email": "vendedor.teste+{{$timestamp}}@exemplo.com",
  "phone1": "11988887777",
  "is_recipient": false,
  "is_master": false
}
'@ -Test (@"
$(T-Status 200,201)
$T_Json
pm.test("Retornou id", () => pm.expect(r.id).to.be.a("string"));
if (r.id) pm.environment.set("new_seller_id", r.id);
"@)

$sellerUpdate = Req -Name 'Atualizar Vendedor · PUT /sellers/:id' -Method PUT -Path '/sellers/{{new_seller_id}}' -Desc 'Aceita os campos do POST + `recipient_rotation`, `recipient_distribution`, `recipient_memory`, `can_view_bucket`.' -Body @'
{
  "name": "Vendedor Teste Suporte (editado)",
  "is_recipient": false
}
'@ -Test (T-Basic 200)

$sellerBatch = Req -Name 'Batch Update Timeshift · PUT /sellers/batch_update_timeshift' -Method PUT -Path '/sellers/batch_update_timeshift' -Desc @'
Atualiza rodízio de vários vendedores. Processa em ordem reversa e escalona `last_lead_received_at` em 1s para definir prioridade.
Valores de `recipient_*` **[Validar]** — o spec oficial mostra só "...".
'@ -Body @'
{
  "seller_ids": ["{{new_seller_id}}"],
  "recipient_rotation": "[Validar]",
  "recipient_distribution": "[Validar]",
  "recipient_memory": "[Validar]"
}
'@ -Test (T-Basic 200)

# ---------------------------------------------------------------- Tags

$tags = Req -Name 'Listar Tags · GET /tags' -Method GET -Path '/tags' -Desc 'Filtros opcionais `name` e `autofill`. Salva o primeiro `id` em `tag_id`.' -Query @(
    ,@('name', 'Quente', $true, 'Filtrar por nome')
    ,@('autofill', 'true', $true, 'Só tags de preenchimento automático')
) -Test (@"
$(T-Status 200)
$T_Json
pm.test("Retorna data[]", () => pm.expect(r.data).to.be.an("array"));
(r.data || []).forEach(t => console.log(t.id + "  " + t.attributes.name));
if (r.data && r.data.length) pm.environment.set("tag_id", r.data[0].id);
"@)

$tagCreate = Req -Name 'Criar Tag · POST /tags' -Method POST -Path '/tags' -Desc 'Se já existir tag igual, devolve a existente (201) com a chave `errors`. Salva `tag_id`.' -Body @'
{
  "tag": { "name": "Teste Suporte", "autofill": false, "instructions": "Criada pelo Postman do Suporte" }
}
'@ -Test (@"
$(T-Status 200,201)
$T_Json
if (r.errors) console.log("Tag já existia: " + JSON.stringify(r.errors));
if (r.tag && r.tag.id) pm.environment.set("tag_id", r.tag.id);
"@)

# ---------------------------------------------------------------- Regras e Filas de Distribuição

$rules = Req -Name 'Listar Regras de Distribuição · GET /distribution_rules' -Method GET -Path '/distribution_rules' -Desc 'Regras de distribuição (`cod_1..3`, `priority`, `type_rule`, `seller_id`).' -Test (@"
$(T-Status 200)
$T_Json
pm.test("Retorna uma lista", () => pm.expect(r).to.be.an("array"));
"@)

$ruleCreate = Req -Name 'Criar Regra de Distribuição · POST /distribution_rules' -Method POST -Path '/distribution_rules' -Desc '`type_rule`: `distribution` ou `rotation`. `cod_1..3` opcionais — significado na tela **[Validar]**.' -Body @'
{
  "cod_1": "TESTE-SUPORTE",
  "priority": 1,
  "type_rule": "distribution",
  "seller_id": "{{seller_id}}",
  "company_id": "{{company_id}}"
}
'@ -Test (T-Basic 200,201)

$queues = Req -Name 'Listar Filas de Distribuição · GET /distribution_queues/list_queues' -Method GET -Path '/distribution_queues/list_queues' -Desc 'Lista filas com `rules` e `next_seller`. **IDs de fila são numéricos.** Salva o primeiro em `queue_id`.' -Query @(
    ,@('page', '1', $true, 'Página')
    ,@('per_page', '20', $true, 'Itens por página')
) -Test (@"
$(T-Status 200)
$T_Json
pm.test("Retorna distribution_queues[]", () => pm.expect(r.distribution_queues).to.be.an("array"));
(r.distribution_queues || []).forEach(q => console.log(q.id + "  " + q.name + "  próximo: " + (q.next_seller ? q.next_seller.seller_name : "-")));
if (r.distribution_queues && r.distribution_queues.length) pm.environment.set("queue_id", r.distribution_queues[0].id);
"@)

$T_NeedQueue = @'
if (!pm.environment.get("queue_id")) throw new Error("Preencha 'queue_id' (rode GET list_queues).");
'@

$queueSellers = Req -Name 'Listar Vendedores da Fila · GET /distribution_queues/:id/sellers' -Method GET -Path '/distribution_queues/{{queue_id}}/sellers' -Desc 'Quem está na fila e a prioridade. Salva o `id` (numérico) do primeiro em `queue_seller_id`.' -Pre $T_NeedQueue -Test (@"
$(T-Status 200)
$T_Json
pm.test("Retorna distribution_queue_sellers[]", () => pm.expect(r.distribution_queue_sellers).to.be.an("array"));
(r.distribution_queue_sellers || []).forEach(s => console.log(s.id + "  prio " + s.priority + "  " + s.seller_name + "  " + s.status));
if (r.distribution_queue_sellers && r.distribution_queue_sellers.length) pm.environment.set("queue_seller_id", r.distribution_queue_sellers[0].id);
"@)

$queuePrio = Req -Name 'Atualizar Prioridades dos Vendedores · POST /distribution_queues/:id/sellers_priorities' -Method POST -Path '/distribution_queues/{{queue_id}}/sellers_priorities' -Desc @'
Formato testado em 25/09/2026 (a doc oficial não informa). `id` = vínculo vendedor-fila (Listar Vendedores da Fila).
**Sempre envie `"status": 1`: sem ele a API desativa o vendedor na fila.**
'@ -Pre $T_NeedQueue -Body @'
{
  "distribution_queue_sellers": [
    { "id": {{queue_seller_id}}, "priority": 1, "status": 1 }
  ]
}
'@ -Test (@"
$(T-Status 200)
$T_Json
pm.test("Nenhum vendedor ficou desativado", () => {
    (r.distribution_queue_sellers || []).forEach(s => pm.expect(s.status, s.seller_name).to.eql("enabled"));
});
"@)

$queueRedistribute = Req -Name 'Redistribuir Lead · POST /distribution_queues/:id/redistribute_lead' -Method POST -Path '/distribution_queues/{{queue_id}}/redistribute_lead' -Desc 'Redistribui `{{lead_id}}` pela fila. A resposta traz `new_seller`.' -Pre $T_NeedQueue -Body @'
{ "id": "{{lead_id}}" }
'@ -Test (@"
$(T-Status 200)
$T_Json
$T_Success
if (r.new_seller) console.log("Novo vendedor: " + r.new_seller.name);
"@)

$queueNext = Req -Name 'Definir Próximo Vendedor · POST /distribution_queues/:id/next_seller' -Method POST -Path '/distribution_queues/{{queue_id}}/next_seller' -Desc 'Força quem recebe o próximo lead. `next_queue_seller_id` = `id` numérico de GET .../sellers.' -Pre $T_NeedQueue -Body @'
{ "next_queue_seller_id": {{queue_seller_id}} }
'@ -Test (T-Basic 200)

# ---------------------------------------------------------------- Stand de Vendas

$standNote = 'Só funciona com o módulo Stand de Vendas ativo. Caminho conforme openapi.json; o llms-full.txt mostra `/integration/integration/...` — se der 404, teste com `{{base_url}}/integration/sales_stand/...` **[Validar]**.'

$stands = Req -Name 'Listar Estandes · GET /sales_stand/stands' -Method GET -Path '/sales_stand/stands' -Desc "Lista estandes e o ``custom_lead_form_id`` de cada um. $standNote" -Query @(
    ,@('company_ids[]', '{{company_id}}', $true, 'Filtrar por empresa')
) -Test (@"
$(T-Status 200)
$T_Json
(r.data || []).forEach(s => console.log(s.id + "  " + s.name + "  form=" + s.custom_lead_form_id));
"@)

$standLeads = Req -Name 'Listar Leads do Estande · GET /sales_stand/leads' -Method GET -Path '/sales_stand/leads' -Desc "Datas AAAA-MM-DD (padrão: último mês). $standNote" -Query @(
    ,@('start_date', '2026-09-01', $false, 'Início (AAAA-MM-DD)')
    ,@('end_date', '2026-09-23', $false, 'Fim (AAAA-MM-DD)')
    ,@('custom_lead_form_ids[]', '', $true, 'ID do formulário (de /stands)')
    ,@('company_ids[]', '{{company_id}}', $true, 'Filtrar por empresa')
    ,@('page', '1', $true, 'Página')
) -Test (T-Basic 200)

$standSummary = Req -Name 'Resumo de Presenças · GET /sales_stand/attendance_summaries' -Method GET -Path '/sales_stand/attendance_summaries' -Desc "``start_date`` e ``end_date`` **obrigatórios**. $standNote" -Query @(
    ,@('start_date', '2026-09-01', $false, 'Obrigatório')
    ,@('end_date', '2026-09-23', $false, 'Obrigatório')
    ,@('company_ids[]', '{{company_id}}', $true, 'Filtrar por empresa')
    ,@('page', '1', $true, 'Página')
) -Test (T-Basic 200)

# ---------------------------------------------------------------- Blocklist

$blockNote = 'Caminho conforme openapi.json; o llms-full.txt mostra `/integration/integration/...` **[Validar]**.'

$blockList = Req -Name 'Listar Blocklist · GET /hierarchy_blocklists' -Method GET -Path '/hierarchy_blocklists' -Desc "Telefones/e-mails bloqueados. $blockNote" -Test (@"
$(T-Status 200)
$T_Json
pm.test("Retorna blocklists[]", () => pm.expect(r.blocklists).to.be.an("array"));
"@)

$blockAdd = Req -Name 'Adicionar à Blocklist · POST /hierarchy_blocklists' -Method POST -Path '/hierarchy_blocklists' -Desc "Bloqueia ``phone`` e/ou ``email``. **``remove_leads: true`` apaga os leads existentes do contato.** Já bloqueado → 409. $blockNote" -Body @'
{
  "hierarchy_blocklist": { "phone": "{{test_phone}}", "remove_leads": false }
}
'@ -Test (@"
$(T-Status 200,201,409)
$T_Json
if (pm.response.code === 409) console.log("Contato já estava na blocklist.");
"@)

# ---------------------------------------------------------------- Webhooks

$hookDesc = @'
**1 endpoint por token.** Cadastrar outra URL apaga a anterior — mas os 3 gatilhos podem usar a mesma URL (uma assinatura por gatilho).
Com o token do cliente, assinar um webhook substitui a URL que ele usa.
Gatilhos: `on_create_lead` (criação), `on_update_lead` (novo log de alteração), `on_close_lead` (arquivado ou negócio fechado).
'@

$T_NeedHook = @'
const u = pm.environment.get("hook_url") || "";
if (!/^https?:\/\//.test(u)) throw new Error("Preencha 'hook_url' (ex.: sua URL do webhook.site).");
'@

$T_Hook = @"
$(T-Status 200)
$T_Json
$T_Success
"@

$hooks = foreach ($action in 'on_create_lead', 'on_update_lead', 'on_close_lead') {
    Req -Name "Assinar Webhook · $action" -Method POST -Path '/api/subscribe' -Desc $hookDesc -Pre $T_NeedHook -Body @"
{
  "hook_action": "$action",
  "hook_url": "{{hook_url}}"
}
"@ -Test $T_Hook
}
$hooks += foreach ($action in 'on_create_lead', 'on_update_lead', 'on_close_lead') {
    Req -Name "Cancelar Webhook · $action" -Method POST -Path '/api/unsubscribe' -Desc 'Cancela a assinatura do gatilho. Rode ao terminar o teste.' -Body @"
{ "hook_action": "$action" }
"@ -Test $T_Hook
}

# ---------------------------------------------------------------- collection

$collectionPre = @'
// Trava de segurança: requests de escrita só rodam com allow_writes = "true" no environment.
const method = pm.request.method;
if (method !== "GET" && pm.environment.get("allow_writes") !== "true") {
    throw new Error("Escrita bloqueada (" + method + "). Confirme que está numa conta de TESTE e defina allow_writes = true no environment.");
}
'@

$collectionTest = @'
pm.test("Autenticado (não é 403)", () => {
    if (pm.response.code === 403) console.warn("403: se a resposta for access_denied, o token é inválido (teste com Informações da Empresa). Se vier 'message', é parâmetro inválido.");
    pm.expect(pm.response.code).to.not.eql(403);
});
pm.test("Tempo de resposta < 10s", () => pm.expect(pm.response.responseTime).to.be.below(10000));
'@

$collection = [ordered]@{
    info = [ordered]@{
        name        = 'API C2S'
        description = @'
Collection do time de Suporte C2S para testar a API de integração (https://docs-api-leads.c2sapp.com/).

**Como usar**
1. Importe também o environment `C2S` e preencha `token` (tipo secret).
2. Rode **00 Setup → GET /me**. Se aparecer a empresa certa, o token está ok.
3. Requests de escrita (POST/PUT/PATCH) ficam **bloqueados** até você definir `allow_writes = true`. Use só em conta de teste ou com autorização do cliente.
4. As requests salvam IDs sozinhas (`lead_id`, `tag_id`, `queue_id`...). Veja o **Console** para as listas de IDs.

Itens marcados **[Validar]** ainda precisam de confirmação com Produto/Dev.
Gerada por `tools/build-postman.ps1` — edite o script e gere de novo em vez de editar o JSON à mão.
'@
        schema      = 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
    }
    auth = [ordered]@{
        type   = 'bearer'
        bearer = @([ordered]@{ key = 'token'; value = '{{token}}'; type = 'string' })
    }
    event = @(
        [ordered]@{ listen = 'prerequest'; script = [ordered]@{ type = 'text/javascript'; exec = (Lines $collectionPre.Trim()) } }
        [ordered]@{ listen = 'test';       script = [ordered]@{ type = 'text/javascript'; exec = (Lines $collectionTest.Trim()) } }
    )
    item = @(
        # pastas e ordem iguais às seções da documentação oficial (docs-api-leads.c2sapp.com)
        (Folder 'Informações Gerais' 'Teste do token e da empresa dona dele.' @($me))
        (Folder 'Leads' 'Rode Listar Leads ou Criar Lead primeiro para preencher `lead_id`.' @($leadList, $leadGet, $leadCreate, $leadPut, $leadForward, $leadTags, $leadAddTag, $leadRemoveTag, $leadRead, $leadMsg, $leadActivity, $leadStatus, $leadDeal))
        (Folder 'Usuários' 'Descobrir e gerenciar vendedores.' @($sellers, $sellerCreate, $sellerUpdate, $sellerBatch))
        (Folder 'Empresas' 'Matriz e filiais do grupo.' @($companies))
        (Folder 'Tags' 'Descobrir e criar tags.' @($tags, $tagCreate))
        (Folder 'Regras de Distribuição' 'Regras por código (cod_1..3) e vendedor.' @($rules, $ruleCreate))
        (Folder 'Filas de Distribuição' 'IDs de fila são numéricos.' @($queues, $queueSellers, $queuePrio, $queueRedistribute, $queueNext))
        (Folder 'Webhooks' $hookDesc @($hooks))
        (Folder 'Stand de Vendas' 'Requer módulo Stand de Vendas ativo.' @($stands, $standLeads, $standSummary))
        (Folder 'Blocklist' 'Bloqueio de telefone/e-mail.' @($blockList, $blockAdd))
    )
}

$environment = [ordered]@{
    name   = 'C2S - Conta de teste'
    values = @(
        [ordered]@{ key = 'base_url';        value = 'https://api.contact2sale.com/integration'; type = 'default'; enabled = $true }
        [ordered]@{ key = 'token';           value = '';            type = 'secret';  enabled = $true }
        [ordered]@{ key = 'allow_writes';    value = 'false';       type = 'default'; enabled = $true }
        [ordered]@{ key = 'test_phone';      value = '11900000000'; type = 'default'; enabled = $true }
        [ordered]@{ key = 'hook_url';        value = '';            type = 'default'; enabled = $true }
        [ordered]@{ key = 'company_id';      value = '';            type = 'default'; enabled = $true }
        [ordered]@{ key = 'lead_id';         value = '';            type = 'default'; enabled = $true }
        [ordered]@{ key = 'seller_id';       value = '';            type = 'default'; enabled = $true }
        [ordered]@{ key = 'seller_from_id';  value = '';            type = 'default'; enabled = $true }
        [ordered]@{ key = 'new_seller_id';   value = '';            type = 'default'; enabled = $true }
        [ordered]@{ key = 'tag_id';          value = '';            type = 'default'; enabled = $true }
        [ordered]@{ key = 'queue_id';        value = '';            type = 'default'; enabled = $true }
        [ordered]@{ key = 'queue_seller_id'; value = '';            type = 'default'; enabled = $true }
    )
    _postman_variable_scope = 'environment'
}

$utf8 = New-Object System.Text.UTF8Encoding $false
[IO.File]::WriteAllText((Join-Path $outDir 'API-C2S.postman_collection.json'), ($collection | ConvertTo-Json -Depth 30), $utf8)
[IO.File]::WriteAllText((Join-Path $outDir 'C2S.postman_environment.json'), ($environment | ConvertTo-Json -Depth 10), $utf8)
Write-Host "OK: postman/API-C2S.postman_collection.json e postman/C2S.postman_environment.json"
