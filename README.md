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

## Como adicionar vídeo em um endpoint

No objeto do endpoint em `data.js`, preencha o campo `video` com o link (Loom, YouTube não-listado, Google Drive, Streamable etc):

```js
video: "https://www.loom.com/share/xxxxxxxx"
```

A seção "Demonstração em vídeo" só aparece na página quando esse campo não está vazio.

## Como adicionar um novo endpoint

Abra `data.js` e copie um dos objetos dentro do array `ENDPOINTS`, ajustando os campos:

```js
{
  slug: "criar-lead",           // usado na URL, sem espaços/acentos
  method: "POST",
  path: "/integration/leads",
  title: "Criar lead",
  category: "Leads",
  summary: "Descrição curta de uma linha.",
  description: "Explicação de quando/por que usar esse endpoint.",
  headers: [ /* mesma estrutura dos exemplos existentes */ ],
  params: [ /* se houver query params ou body params */ ],
  response: `{ ... }`,          // JSON de exemplo, como string
  errors: [ /* erros conhecidos desse endpoint */ ],
  curl: `curl ...`,
  python: `import requests ...`
}
```

Salve o arquivo e o endpoint aparece automaticamente no menu lateral, na busca e ganha sua própria página. Não precisa mexer em `app.js`.

O mesmo vale para novos **casos reais** (array `CASOS`) e para o **changelog** (array `CHANGELOG`).

## Próximas versões (sugestão)

- Mais endpoints (webhooks, criar/atualizar lead, vendedores, filas)
- Busca global melhorada (hoje filtra só pelo texto visível no menu)
- Exercícios/quiz para onboarding de novos colaboradores
- Assistente de IA respondendo com base nesta documentação
