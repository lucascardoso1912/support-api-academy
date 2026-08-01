# Support API Academy

Trilha técnica de APIs e Integrações do Suporte C2S, versão 1.1.

Site estático (HTML/CSS/JS puro, sem build step), então dá pra publicar em minutos sem precisar instalar nada.

## Estrutura

```
support-api-academy/
├── index.html   → shell da página + sidebar
├── style.css    → todos os estilos (tokens de cor/tipografia no topo do arquivo)
├── data.js      → onde ficam os ENDPOINTS, CASOS e CHANGELOG
├── app.js       → roteamento e renderização das páginas
├── favicon.svg  → ícone da aba do navegador
└── README.md
```

## Como publicar (sem precisar de terminal)

### Opção A: Vercel (recomendado, mais rápido)
1. Crie uma conta em vercel.com (pode entrar com GitHub).
2. Clique em **Add New → Project → Upload** (ou arraste a pasta `support-api-academy` direto na tela de novo projeto).
3. Não precisa configurar nada, é HTML puro. Clique em **Deploy**.
4. Em ~30 segundos você tem um link tipo `support-api-academy.vercel.app`.

### Opção B: GitHub Pages
1. Crie um repositório novo no GitHub (pode ser privado).
2. Suba os arquivos desta pasta para o repositório.
3. Vá em **Settings → Pages**, selecione a branch `main` e a pasta raiz.
4. Em alguns minutos o site fica disponível em `seu-usuario.github.io/nome-do-repo`.

Qualquer uma das duas opções é gratuita e não exige saber programar além de subir arquivos.

## Design

- Favicon (`favicon.svg`) segue a mesma identidade: quadrado azul com o símbolo `</>`.
- Botão "Voltar" aparece automaticamente no topo de toda página que não seja a Home, útil especialmente para quem acessa pelo celular (iPhone/Android), onde nem sempre tem um gesto óbvio de voltar. Ele usa o histórico do navegador; se não houver histórico (ex: abriu um link direto), volta para a Home.
- Tema claro/escuro: o botão fica no topo da barra lateral, ao lado do nome do site. A escolha é salva no navegador da pessoa (`localStorage`), então persiste entre visitas. Se a pessoa nunca escolheu, o site usa a preferência do sistema operacional dela.
- Categorias de procedimento na barra lateral funcionam como pastas: clique no nome da categoria para abrir/fechar. A categoria do procedimento atual abre sozinha; buscar no campo de busca também abre as pastas com resultado.
- Paleta grafite + azul (cor de marca do C2S), sem laranja/âmbar.
- Zero emoji na interface: todos os ícones são SVG monocromático, definidos em `ICONS` no topo do `app.js`. Pra trocar um ícone de alguma página, é só apontar para uma chave diferente desse objeto (ou adicionar um novo `path` SVG lá).
- Tokens de cor, tipografia e espaçamento ficam centralizados no topo do `style.css` (`:root { ... }`), qualquer ajuste de paleta é feito só ali.
- O link para a documentação oficial da API fica numa constante só, `OFFICIAL_DOCS_URL` no topo do `app.js`. Se o endereço mudar, é só trocar ali; ele é usado tanto no botão da home quanto no link de cada procedimento.

## Como adicionar um vídeo (por recurso + método HTTP)

Feedback da liderança: gravar 1 vídeo por endpoint gera muito conteúdo repetitivo, já que vários endpoints do mesmo recurso seguem o mesmo padrão de teste. Por isso os vídeos agora cobrem **um recurso (categoria) + um método HTTP**, por exemplo "Leads: requisições GET" ou "Vendedores: requisições PUT". Todos os vídeos serão hospedados no Loom.

Os grupos vivem no objeto `VIDEO_GROUPS`, no topo do `data.js`, antes do array `ENDPOINTS`:

```js
const VIDEO_GROUPS = {
  "leads-get": {
    titulo: "Leads: requisições GET",
    resumo: "...",
    exemploPrincipal: "Investigar Listagem de Leads",
    outrosExemplos: ["Investigar Lead Específico", "Investigar Tags de um Lead"],
    ensina: ["...", "..."],
    video: "https://www.loom.com/share/xxxxxxxx"   // cole o link aqui quando gravar
  },
  // ... outros 17 grupos
}
```

Para publicar um vídeo, grave no Loom, copie o link de compartilhamento e cole no campo `video` do grupo correspondente. Ele passa a valer automaticamente para **todos os procedimentos daquele grupo**, sem precisar editar cada um.

Hoje existem 18 grupos, um para cada combinação de categoria + método que a API realmente usa (ex: `leads-get`, `leads-post`, `leads-put`, `leads-delete`, `vendedores-get`, `webhooks-post` etc). Cada procedimento aponta para o grupo dele através do campo `videoGroup`:

```js
videoGroup: "leads-get"
```

Se um novo endpoint seguir um padrão já coberto (mesma categoria e mesmo método), é só apontar pro grupo existente, sem gravar vídeo novo.

**Sobre o conteúdo do vídeo:** cada grupo tem um `exemploPrincipal` (o endpoint que deve aparecer sendo testado na tela, do início ao fim) e uma lista de `outrosExemplos` (os endpoints parecidos que vale citar rapidamente durante a gravação, sem precisar repetir o teste completo). Isso já está definido em cada grupo, é só seguir o roteiro ao gravar.

Se o campo `video` de um grupo estiver vazio (`""`), toda página que usa aquele grupo mostra um aviso discreto de que o vídeo ainda não foi gravado.

## Sobre o selo de status (importante)

Cada procedimento tem um bloco `status` assim:

```js
status: { validado: false, testadoPostman: false, revisao: "Jul/2026" }
```

`validado` e `testadoPostman` começam como `false` de propósito. Só mude para `true` depois de você mesmo ter executado aquele teste de verdade, no Postman ou na API. É isso que dá credibilidade ao selo "Status deste procedimento" que aparece no topo da página: ele só vale alguma coisa se refletir o que foi realmente testado, não o que foi só escrito. Atualize também o campo `revisao` sempre que revisar um procedimento.

## Como adicionar um novo procedimento

Abra `data.js` e copie um dos objetos dentro do array `ENDPOINTS`, ajustando os campos:

```js
{
  slug: "criar-lead",                 // usado na URL, sem espaços/acentos
  method: "POST",
  path: "/integration/leads",
  title: "Testar Criação de Lead",    // orientado à ação: Investigar (leitura) ou Testar (escrita)
  category: "Leads",                  // precisa bater com um item de CATEGORIES
  summary: "Descrição curta de uma linha, aparece embaixo do título.",
  quandoUsar: "Utilize quando... (o gatilho real que leva o analista a abrir esta página).",
  ferramentas: ["postman", "api", "plataforma"], // opções: postman, api, plataforma, logs
  testar: "Dica prática de como testar esse procedimento.",
  curl: `curl ...`,
  status: { validado: false, testadoPostman: false, revisao: "Jul/2026" },
  videoGroup: "leads-post"  // aponta pra um grupo existente em VIDEO_GROUPS (ou crie um novo grupo lá se for uma combinação categoria+método nova)
}
```

Salve o arquivo e o procedimento aparece automaticamente no menu lateral (dentro da pasta da categoria certa), na busca e ganha sua própria página. Não precisa mexer em `app.js`.

O mesmo vale para novos **casos reais** (array `CASOS`) e para o **changelog** (array `CHANGELOG`).

## Próximas versões (sugestão)

- Mais endpoints (webhooks, criar/atualizar lead, vendedores, filas)
- Busca global melhorada (hoje filtra só pelo texto visível no menu)
- Exercícios/quiz para onboarding de novos colaboradores
- Assistente de IA respondendo com base nesta documentação
