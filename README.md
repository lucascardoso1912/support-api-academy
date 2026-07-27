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

- Paleta grafite + azul (cor de marca do C2S), sem laranja/âmbar.
- Zero emoji na interface: todos os ícones são SVG monocromático, definidos em `ICONS` no topo do `app.js`. Pra trocar um ícone de alguma página, é só apontar para uma chave diferente desse objeto (ou adicionar um novo `path` SVG lá).
- Tokens de cor, tipografia e espaçamento ficam centralizados no topo do `style.css` (`:root { ... }`), qualquer ajuste de paleta é feito só ali.
- O link para a documentação oficial da API fica numa constante só, `OFFICIAL_DOCS_URL` no topo do `app.js`. Se o endereço mudar, é só trocar ali; ele é usado tanto no botão da home quanto no link de cada procedimento.

## Como adicionar vídeo em um procedimento

No objeto do procedimento em `data.js`, preencha o campo `video` com o link (Loom, YouTube não-listado, Google Drive, Streamable etc):

```js
video: "https://www.loom.com/share/xxxxxxxx"
```

A seção "Demonstração em vídeo" só aparece com o link real quando esse campo não está vazio; enquanto estiver vazio, a página mostra um aviso discreto de que o vídeo ainda não foi gravado.

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
  video: ""
}
```

Salve o arquivo e o procedimento aparece automaticamente no menu lateral (agrupado pela categoria), na busca e ganha sua própria página. Não precisa mexer em `app.js`.

O mesmo vale para novos **casos reais** (array `CASOS`) e para o **changelog** (array `CHANGELOG`).

## Próximas versões (sugestão)

- Mais endpoints (webhooks, criar/atualizar lead, vendedores, filas)
- Busca global melhorada (hoje filtra só pelo texto visível no menu)
- Exercícios/quiz para onboarding de novos colaboradores
- Assistente de IA respondendo com base nesta documentação
