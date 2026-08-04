# Support Academy

Plataforma interna de treinamento, documentação técnica, troubleshooting e base de conhecimento do Suporte C2S. Versão 6.0.

Site estático (HTML/CSS/JS puro, sem build step), então dá pra publicar em minutos sem precisar instalar nada.

## O que mudou na v6.0

Até a v5.0 este projeto era só uma "API Academy": documentação da API do C2S organizada por procedimentos. A partir da v6.0 ele virou uma plataforma de conhecimento completa, com 8 trilhas (Fundamentos, API, Integrações, Troubleshooting, Playbooks, Casos Reais, Boas Práticas, Ferramentas) e 71 conteúdos, pensada para crescer por anos sem precisar reescrever código.

**Nada da API foi perdido**: os 35 procedimentos e os 18 grupos de vídeo continuam intactos, só migraram pra dentro da trilha "API".

## Estrutura

```
support-api-academy/
├── index.html    → shell da página + sidebar
├── style.css     → todos os estilos (tokens de cor/tipografia no topo do arquivo)
├── data.js       → TRILHAS, CONTEUDOS, VIDEO_GROUPS, TOOLS e CHANGELOG (toda a base de conhecimento)
├── app.js        → roteamento e renderização (genérico, não tem nada específico de uma trilha)
├── favicon.svg   → ícone da aba do navegador
├── video-cover.svg → capa ilustrativa usada quando um vídeo ainda não foi adicionado
└── README.md
```

## Arquitetura: tudo é "conteúdo"

A ideia central da v6.0: **não existe código específico de trilha**. Todo conteúdo, seja um procedimento de API, um erro de troubleshooting, um conceito de fundamentos, um playbook ou um caso real, é um item no array `CONTEUDOS` em `data.js`, com um campo `tipo` que diz como ele deve ser exibido. O `app.js` lê esses dados e monta a página automaticamente, sem saber de antemão quais trilhas existem.

### TRILHAS

```js
const TRILHAS = [
  { slug: "fundamentos", titulo: "Fundamentos", descricao: "...", icon: "book", ordem: 1 },
  // ...
];
```

Pra criar uma trilha nova, é só adicionar um objeto aqui. Ela aparece sozinha na sidebar, na home e na navegação, sem mexer em `app.js`.

### CONTEUDOS

Cada item tem campos universais (existem em qualquer tipo) e campos específicos do `tipo`:

**Campos universais:**

| Campo | Uso |
|---|---|
| `slug` | identificador único, usado na URL |
| `trilha` | a qual trilha esse conteúdo pertence (bate com um slug de `TRILHAS`) |
| `categoria` | subgrupo dentro da trilha, usado pra organizar a sidebar |
| `tipo` | `procedimento` \| `conceito` \| `erro` \| `playbook` \| `caso` \| `ferramenta` |
| `titulo`, `resumo` | aparecem no topo da página e nos cards |
| `keywords` | alimenta a busca (a busca cobre toda a plataforma, não só a API) |
| `ordem` | define a posição no "conteúdo anterior / próximo" dentro da categoria |
| `favoritavel` | se `true`, mostra a estrela de favoritar |
| `quandoUsar` | opcional, aparece como seção "Quando utilizar" |
| `dicas`, `problemasComuns` | opcionais, arrays de string, aparecem como seções extras em qualquer tipo |
| `videoGroup` | opcional, referencia um grupo em `VIDEO_GROUPS` |
| `status` | opcional, ativa o selo "Status deste procedimento" |
| `docOficial` | opcional (`true`/`false`), mostra o link pra doc oficial da API |

**Campos por tipo:**

| Tipo | Campos extras |
|---|---|
| `procedimento` | `method`, `path`, `ferramentas[]`, `testar`, `curl` |
| `conceito` | `conteudo[]` (parágrafos), `exemplo?` |
| `erro` | `causaComum`, `comoInvestigar[]`, `comoResolver` |
| `playbook` | `passos[]` |
| `caso` | `problema`, `causa`, `investigacao[]`, `solucao`, `aprendizados`, `palavrasChave[]`, `statusCaso` |
| `ferramenta` | `linkUrl`, `linkLabel`, `collectionUrl`, `passos[]` |

### Exemplo: adicionando um conteúdo novo

```js
{
  slug: "erro-429",
  trilha: "troubleshooting",
  categoria: "Códigos de Status",
  tipo: "erro",
  titulo: "Erro 429",
  resumo: "Too Many Requests: limite de chamadas excedido.",
  keywords: ["429", "rate limit"],
  ordem: 7,
  favoritavel: true,
  quandoUsar: "Use quando o cliente relatar bloqueio temporário por excesso de chamadas.",
  causaComum: "Volume de requisições acima do limite da API em um curto intervalo.",
  comoInvestigar: ["Confirmar o volume de chamadas no período", "Verificar se há retry automático sem backoff"],
  comoResolver: "Oriente o cliente a implementar espera exponencial entre tentativas."
}
```

Salvo isso, o item aparece sozinho na trilha Troubleshooting, na categoria certa, na busca, nos favoritos (se marcado) e na navegação anterior/próximo. Nenhuma linha de `app.js` precisa mudar.

## Vídeos (VIDEO_GROUPS)

Continuam por recurso + método HTTP, como na v5.0 (ex: `leads-get`, `tags-post`). Um item de `CONTEUDOS` aponta pra um grupo pelo campo `videoGroup`. Veja os comentários no topo do `data.js` pra detalhes de cada campo do grupo (`titulo`, `resumo`, `exemploPrincipal`, `outrosExemplos`, `preRequisitos`, `duracao`, `video`).

Vídeo local (arquivo `.mp4` dentro do projeto) não é mais suportado, todo vídeo é um link (Loom, YouTube não-listado, Drive etc), pra manter o projeto leve.

## Favoritos e progresso

Guardados no `localStorage` do navegador de cada pessoa (chaves `sa-favorites` e `sa-progress`). Isso quer dizer:

- **Não sincroniza** entre analistas nem entre dispositivos da mesma pessoa.
- Limpar o cache do navegador apaga essas escolhas.
- Não existe conta de usuário nem login nessa versão, então não há como fazer isso sincronizar sem adicionar um backend de verdade (fora do escopo de um site estático).

## Busca

O campo de busca da sidebar filtra por texto em todos os conteúdos de todas as trilhas ao mesmo tempo (não só API), abrindo automaticamente as pastas que tiverem resultado.

## Selo de status (procedimentos)

Mesmo princípio de sempre: `validado` e `testadoPostman` começam `false`. Só marque como `true` depois de você mesmo ter testado de verdade.

## Como publicar (sem precisar de terminal)

### Opção A: Vercel (recomendado, mais rápido)
1. Crie uma conta em vercel.com (pode entrar com GitHub).
2. Clique em **Add New → Project → Upload** (ou arraste a pasta `support-api-academy` direto na tela de novo projeto).
3. Não precisa configurar nada, é HTML puro. Clique em **Deploy**.
4. Em ~30 segundos você tem um link tipo `support-academy.vercel.app`.

### Opção B: GitHub Pages
1. Crie um repositório novo no GitHub (pode ser privado).
2. Suba os arquivos desta pasta para o repositório.
3. Vá em **Settings → Pages**, selecione a branch `main` e a pasta raiz.
4. Em alguns minutos o site fica disponível em `seu-usuario.github.io/nome-do-repo`.

Pra manter o mesmo link ao longo do tempo (recomendado, já que esse projeto deve crescer por anos): conecte o repositório do GitHub ao Vercel via **Import Git Repository**. Toda vez que você atualizar os arquivos no GitHub, o Vercel republica sozinho no mesmo link.

## Design

- Categorias de procedimento na barra lateral funcionam como pastas: clique no nome da trilha para abrir/fechar. Dentro de cada pasta, os conteúdos aparecem agrupados por categoria (e, na trilha API, também por método HTTP). A trilha do conteúdo atual abre sozinha; buscar no campo de busca também abre as pastas com resultado.
- Paleta grafite + azul (cor de marca do C2S), sem laranja/âmbar.
- Zero emoji na interface: todos os ícones são SVG monocromático, definidos em `ICONS` no topo do `app.js`.
- Tokens de cor, tipografia, sombra e espaçamento ficam centralizados no topo do `style.css` (`:root { ... }`).
- O link para a documentação oficial da API fica numa constante só, `OFFICIAL_DOCS_URL` no topo do `app.js`.

## Próximos passos sugeridos

- Preencher os `collectionUrl` (Ferramentas > Postman) e os `video` dos grupos restantes conforme forem gravados.
- Adicionar mais conteúdos em Integrações (hoje só tem a visão geral) e Boas Práticas.
- Se o time crescer e a necessidade de sincronizar favoritos/progresso entre pessoas ficar real, isso exigiria migrar de site estático pra uma aplicação com backend (login + banco de dados).
