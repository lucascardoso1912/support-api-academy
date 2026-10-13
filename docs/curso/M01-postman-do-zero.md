# Módulo 1 — Introdução ao Postman

Ao final deste módulo o seu Postman está configurado uma única vez e todas as aulas seguintes só criam requests dentro dele.

## Aula 1.1 — Instalando e conhecendo o Postman

**Leitura:** 7 min

**Objetivo:** instalar o Postman e saber onde fica cada área da tela.

### Conceito

O Postman é um programa para montar e enviar requisições de API sem escrever código. É o “navegador” do curso.

### Passo a passo

1. Acesse [postman.com/downloads](https://www.postman.com/downloads/), baixe a versão para o seu sistema e instale.
2. Abra o app e crie uma conta gratuita (ou entre com o Google do trabalho, se o time usar).
3. No canto superior esquerdo, abra **Workspaces** → **Create Workspace** → nome `Suporte C2S`. Todo o curso fica dentro dele.
4. Faça o tour pela tela:

| Área | Onde fica | Para que serve |
| --- | --- | --- |
| Barra lateral | Esquerda | *Collections*, *Environments*, *History* |
| Abas de request | Topo central | Cada request aberta vira uma aba |
| Construtor | Centro | Método, URL e abas *Params*, *Authorization*, *Headers*, *Body*, *Scripts* |
| Resposta | Metade de baixo | Body, headers, status, tempo e tamanho |
| Seletor de Environment | Canto superior direito | Escolhe qual conjunto de variáveis está ativo |
| Console | Rodapé, à esquerda | Mostra tudo que foi enviado e recebido |
| History | Barra lateral | Toda chamada já enviada, mesmo sem salvar |

### Dica

Use sempre o app desktop. A versão web do Postman pode exigir o *Postman Agent* para enviar chamadas.

### Exercício

Abra uma aba nova, faça um GET em `https://postman-echo.com/get?curso=c2s` e ache na resposta o valor `c2s`. Esse serviço público do Postman só devolve o que recebe.

## Aula 1.2 — Gerando o token no C2S

**Leitura:** 4 min

**Objetivo:** gerar um token de teste e guardá-lo com segurança.

### Conceito

O token identifica a **empresa**, não a pessoa. Qualquer um com o token age como a empresa inteira na API. Por isso só usuários **Master** conseguem gerá-lo.

### Passo a passo

1. Entre no C2S pelo computador, na **conta de teste** do Suporte.
2. Menu lateral → **Integrações**.
3. Expanda **Informações de integração por e-mail e API**.
4. Clique em **Gerar Token**, dê o nome `Postman Suporte - <seu nome>` e confirme.
5. Copie o token **na hora**: ele aparece uma única vez.
6. Cole temporariamente num lugar seguro (gerenciador de senhas). Na próxima aula ele vai para o Postman.

### Cuidados com o token

- Ao testar com o token de um cliente, prefira chamadas de leitura (GET). Chamadas de escrita alteram a conta dele: uma inscrição de webhook, por exemplo, substitui a URL que ele usa (Módulo 6).
- Perdeu o token? Gere outro. Não há como vê-lo de novo.

### No suporte

“Não acho onde gera o token” quase sempre é usuário sem perfil Master. Confirme o perfil antes de qualquer outra coisa.

## Aula 1.3 — Environment e Collection com autenticação herdada

**Leitura:** 8 min

**Objetivo:** configurar a URL base e o token uma única vez e criar a collection do curso.

### Environment: a URL base e o token

O Environment guarda valores que todas as requests usam. No curso ele tem só dois: a URL base da API e o token. Nas requests você escreve `{{base_url}}` e `{{token}}`, e o Postman troca pelo valor.

1. Barra lateral → **Environments** → **+** (ou *Create Environment*).
2. Nome: `C2S - Conta de teste`.
3. Crie as duas variáveis:

| Variable | Type | Value |
| --- | --- | --- |
| `base_url` | default | `https://api.contact2sale.com/integration` |
| `token` | secret | o token da Aula 1.2 |

4. Clique em **Save** (`Ctrl+S`).
5. No canto superior direito, troque *No Environment* por `C2S - Conta de teste`.

Cuidados:

- `base_url` **sem barra no final**. As requests começam com barra: `{{base_url}}/leads`.
- Marque o token como **secret**: ele fica mascarado na tela e em compartilhamentos de tela.
- Variável em vermelho numa URL = o Environment certo não está selecionado.
- Para testar com o token de um cliente, duplique o Environment (botão **...** → *Duplicate*), renomeie para `C2S - Cliente X` e troque só o `token`.

### Collection

Collection é uma pasta de requests salvas. Configurando a autenticação **na collection**, todas as requests dentro dela herdam o token. Você nunca mais digita `Authorization`.

### Passo a passo

1. Barra lateral → **Collections** → **+** → *Blank collection* → nome `API C2S`.
2. Com a collection selecionada, abra a aba **Authorization**.
3. *Auth Type* → **Bearer Token** → campo *Token*: `{{token}}`.
4. `Ctrl+S` para salvar a collection.
5. Crie as pastas (botão **...** da collection → *Add folder*), uma por seção da documentação oficial:

```
API C2S
├── Informações Gerais
├── Leads
├── Usuários
├── Empresas
├── Tags
├── Regras de Distribuição
├── Filas de Distribuição
├── Webhooks
├── Stand de Vendas
└── Blocklist
```

6. Em cada request nova, confira na aba **Authorization** que está marcado **Inherit auth from parent**.

### Como funciona a herança

O Postman transforma `Bearer Token = {{token}}` no header `Authorization: Bearer <valor do token>`. Para ver, abra a aba **Headers** de uma request e clique em *hidden* (headers ocultos).

### Padrão de nomes das requests

Use `MÉTODO caminho — nome do endpoint na documentação oficial`, ex.: `POST /leads — Criar Lead`. Assim a collection fica com os mesmos nomes da doc oficial e da trilha.

## Aula 1.4 — Primeira chamada: `GET /me` (Informações da Empresa)

**Leitura:** 6 min

**Objetivo:** fazer a primeira chamada real e provar que token e empresa estão certos.

### Conceito

`GET /me` responde “quem sou eu para a API”: a empresa dona do token e suas filiais. É o **teste zero** de qualquer caso: se ele falhar, nada mais vai funcionar.

### Passo a passo

1. Na pasta `Informações Gerais`, **...** → *Add request* → nome `GET /me — Informações da Empresa`.
2. Método **GET**, URL `{{base_url}}/me`.
3. Confira: Environment `C2S - Conta de teste` selecionado e Authorization *Inherit*.
4. **Send** (`Ctrl+Enter`).
5. Leia a resposta:

```json
{
  "company_name": "Empresa Exemplo",
  "company_id": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
  "sub_companies": [
    { "company_id": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6", "company_name": "Empresa Exemplo" }
  ]
}
```

6. Anote o `company_id`: algumas aulas pedem esse ID no body (ex.: Criar Vendedor).
7. `Ctrl+S` para salvar a request.

### Testando o erro de autenticação

1. Na aba Authorization da request, troque para **No Auth** → Send → veja o **403** `{"error":"access_denied"}`.
2. Volte para *Inherit auth from parent*.
3. Troque o Environment para *No Environment* → Send → a URL fica com `{{base_url}}` literal e a chamada falha. Veja a variável em vermelho.
4. Volte o Environment certo.

### No suporte

Cliente diz que “do nada parou tudo”? Peça que ele rode o equivalente a `GET /me` (ou rode você, com autorização). 403 = token revogado ou trocado.

