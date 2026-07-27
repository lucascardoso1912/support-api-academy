// ============================================================
// SUPPORT API ACADEMY - app.js
// SPA simples com roteamento por hash. Sem build step.
// ============================================================

const app = document.getElementById("app");
const sidebarNav = document.getElementById("sidebar-nav");
const OFFICIAL_DOCS_URL = "https://docs-api-leads.c2sapp.com/";

// ---------- ícones (stroke, 1.5px, sem emoji) ----------
const ICONS = {
  home: `<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"/>`,
  book: `<path d="M4 5.5C4 4.7 4.7 4 5.5 4H12v16H5.5A1.5 1.5 0 0 1 4 18.5v-13Z"/><path d="M20 5.5c0-.8-.7-1.5-1.5-1.5H12v16h6.5a1.5 1.5 0 0 0 1.5-1.5v-13Z"/>`,
  api: `<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6v6H9z"/><path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2"/>`,
  mail: `<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>`,
  warning: `<path d="M12 3 2 20h20L12 3Z"/><path d="M12 10v4"/><path d="M12 17h.01"/>`,
  search: `<circle cx="10.5" cy="10.5" r="6.5"/><path d="m20 20-4.35-4.35"/>`,
  case: `<path d="M4 8h16v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8Z"/><path d="M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>`,
  check: `<rect x="3" y="3" width="18" height="18" rx="2"/><path d="m8 12 3 3 5-6"/>`,
  clock: `<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>`,
  copy: `<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>`,
  play: `<circle cx="12" cy="12" r="9"/><path d="m10 8.5 6 3.5-6 3.5v-7Z"/>`,
  chevron: `<path d="m9 6 6 6-6 6"/>`,
  circle: `<circle cx="12" cy="12" r="9"/>`,
  platform: `<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M8 20h8M12 16v4"/>`,
  logs: `<path d="M4 6h16M4 12h11M4 18h14"/>`,
  target: `<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.5"/>`,
  external: `<path d="M14 4h6v6"/><path d="M20 4 10 14"/><path d="M19 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>`
};

function icon(name, size = 16) {
  return `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ""}</svg>`;
}

const STATIC_PAGES = [
  { slug: "home", label: "Início", icon: "home" },
  { slug: "fundamentos", label: "Fundamentos", icon: "book" },
  { slug: "postman", label: "Postman", icon: "mail" },
  { slug: "troubleshooting", label: "Troubleshooting", icon: "warning" },
  { slug: "casos-reais", label: "Casos Reais", icon: "case" },
  { slug: "checklist", label: "Checklist", icon: "check" },
  { slug: "changelog", label: "Changelog", icon: "clock" }
];

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

// ---------- syntax highlight (bem simples, so pra JSON) ----------
function highlightJson(json) {
  const escaped = escapeHtml(json);
  return escaped
    .replace(/"([^"]+)":/g, '<span class="k">"$1"</span>:')
    .replace(/: "([^"]*)"/g, ': <span class="s">"$1"</span>')
    .replace(/: (\d+(\.\d+)?)/g, ': <span class="n">$1</span>')
    .replace(/: (true|false|null)/g, ': <span class="n">$1</span>');
}

// ---------- sidebar ----------
function renderSidebar() {
  const groupsHtml = [];

  groupsHtml.push(`<div class="nav-group">
    ${STATIC_PAGES.slice(0, 2).map(navLinkHtml).join("")}
  </div>`);

  CATEGORIES.forEach(cat => {
    const eps = ENDPOINTS.filter(e => e.category === cat);
    if (!eps.length) return;
    const links = eps.map(ep => `
      <div class="nav-link" data-route="endpoint/${ep.slug}">
        <span class="method-tag method-${ep.method}">${ep.method}</span>
        <span>${ep.title}</span>
      </div>`).join("");
    groupsHtml.push(`<div class="nav-group">
      <div class="nav-group-label">${cat}</div>
      ${links}
    </div>`);
  });

  groupsHtml.push(`<div class="nav-group">
    ${STATIC_PAGES.slice(2).map(navLinkHtml).join("")}
  </div>`);

  sidebarNav.innerHTML = groupsHtml.join("");

  sidebarNav.querySelectorAll("[data-route]").forEach(el => {
    el.addEventListener("click", () => {
      location.hash = "#/" + el.dataset.route;
      closeMobileSidebar();
    });
  });
}

function navLinkHtml(p) {
  return `<div class="nav-link" data-route="${p.slug}">${icon(p.icon, 15)}<span>${p.label}</span></div>`;
}

function setActiveNav(route) {
  document.querySelectorAll(".nav-link").forEach(el => {
    el.classList.toggle("active", el.dataset.route === route);
  });
}

// ---------- code panel component ----------
function codePanel({ tabs }) {
  const id = "cp-" + Math.random().toString(36).slice(2, 8);
  const tabButtons = tabs.map((t, i) =>
    `<button class="code-tab ${i === 0 ? "active" : ""}" data-panel="${id}" data-idx="${i}">${t.label}</button>`
  ).join("");
  const bodies = tabs.map((t, i) =>
    `<pre style="${i === 0 ? "" : "display:none"}" data-panel="${id}" data-idx="${i}">${t.html}</pre>`
  ).join("");

  return `
  <div class="code-panel" id="${id}">
    <div class="code-panel-head">
      <div class="code-panel-tabs">${tabButtons}</div>
      <button class="copy-btn" data-copy="${id}">${icon("copy", 12)}<span>Copiar</span></button>
    </div>
    ${bodies}
  </div>`;
}

function wireCodePanels(root) {
  root.querySelectorAll(".code-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      const panelId = btn.dataset.panel;
      const idx = btn.dataset.idx;
      root.querySelectorAll(`.code-tab[data-panel="${panelId}"]`).forEach(b =>
        b.classList.toggle("active", b.dataset.idx === idx));
      root.querySelectorAll(`pre[data-panel="${panelId}"]`).forEach(p =>
        p.style.display = p.dataset.idx === idx ? "block" : "none");
    });
  });
  root.querySelectorAll(".copy-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const panel = document.getElementById(btn.dataset.copy);
      const visible = panel.querySelector("pre:not([style*='display: none'])");
      navigator.clipboard.writeText(visible.innerText).then(() => {
        const label = btn.querySelector("span");
        label.textContent = "Copiado";
        setTimeout(() => (label.textContent = "Copiar"), 1200);
      });
    });
  });
}

// ---------- selo de status do procedimento ----------
function statusBlock(ep) {
  const items = [
    { done: !!ep.status.validado, label: "Validado pelo Suporte" },
    { done: !!ep.video, label: "Vídeo disponível" },
    { done: !!ep.status.testadoPostman, label: "Testado no Postman" }
  ];
  const itemsHtml = items.map(it => `
    <div class="status-item ${it.done ? "done" : "pending"}">
      ${icon(it.done ? "check" : "circle", 15)}
      <span>${it.label}</span>
    </div>`).join("");

  return `
  <div class="status-block">
    <div class="status-block-label">Status deste procedimento</div>
    <div class="status-items">
      ${itemsHtml}
      <div class="status-item revisao">
        ${icon("clock", 15)}
        <span>Última revisão: ${ep.status.revisao}</span>
      </div>
    </div>
  </div>`;
}

// ---------- bloco de ferramentas necessárias ----------
const TOOL_ICONS = { postman: "mail", api: "api", plataforma: "platform", logs: "logs" };

function toolsBlock(ep) {
  const items = ep.ferramentas.map(key => `
    <div class="tool-item">
      ${icon(TOOL_ICONS[key] || "check", 15)}
      <span>${TOOLS[key]?.label || key}</span>
    </div>`).join("");
  return `
  <div class="tools-block">
    <div class="status-block-label">Ferramentas necessárias</div>
    <div class="status-items">${items}</div>
  </div>`;
}

// ---------- pages ----------
function renderHome() {
  app.innerHTML = `
    <span class="version-badge">Versão <b>1.0</b> · atualizado em 26 Jul 2026</span>
    <div class="hero">
      <div class="hero-copy">
        <span class="eyebrow">Suporte C2S · Trilha Técnica</span>
        <h1>Support API Academy</h1>
        <p>Documentação viva de APIs e integrações do C2S, feita para que o suporte investigue e resolva casos técnicos sem precisar escalar toda dúvida básica. Endpoints, exemplos prontos, troubleshooting e casos reais, tudo num lugar só.</p>
        <div class="stat-row">
          <div class="stat"><div class="stat-num">${ENDPOINTS.length}</div><div class="stat-label">procedimentos guiados</div></div>
          <div class="stat"><div class="stat-num">${CATEGORIES.length}</div><div class="stat-label">categorias</div></div>
          <div class="stat"><div class="stat-num">${CASOS.length}</div><div class="stat-label">casos reais</div></div>
        </div>
      </div>
      <div class="hero-terminal">
        <div class="terminal">
          <div class="terminal-head">
            <span class="terminal-dot"></span>
            <span class="terminal-label">GET /integration</span>
          </div>
          <div class="terminal-body" id="hero-terminal-body"></div>
        </div>
      </div>
    </div>

    <div class="docs-relation">
      <div class="docs-relation-copy">
        <div class="status-block-label">Documentação Oficial da API</div>
        <p>A documentação oficial reúne todas as informações técnicas da API: endpoints, parâmetros, autenticação, exemplos de requisição e de resposta. É a fonte de referência.</p>
        <p>A Support API Academy complementa essa documentação, mostrando como usar esses recursos em cenários reais de suporte: quando investigar, com o que testar, e o teste sendo feito em vídeo.</p>
      </div>
      <a class="docs-relation-btn" href="${OFFICIAL_DOCS_URL}" target="_blank" rel="noopener">
        ${icon("book", 18)}
        <span>Acessar Documentação Oficial da API</span>
        ${icon("external", 15)}
      </a>
    </div>

    <div class="section">
      <span class="eyebrow">Navegue pela trilha</span>
      <h2>Por onde começar</h2>
      <div class="card-grid" id="home-cards"></div>
    </div>
  `;

  const cards = [
    { icon: "book", title: "Fundamentos", desc: "HTTP, REST, JSON, autenticação: a base antes de investigar qualquer caso.", route: "fundamentos" },
    { icon: "api", title: "Procedimentos", desc: "Investigações e testes guiados por endpoint, com status de validação e vídeo.", route: "endpoint/" + (ENDPOINTS[0]?.slug || "") },
    { icon: "mail", title: "Postman", desc: "Como importar a collection, configurar environment e testar sem escalar.", route: "postman" },
    { icon: "warning", title: "Troubleshooting", desc: "Tabela de erros comuns: causa provável, como validar, quando escalar.", route: "troubleshooting" },
    { icon: "case", title: "Casos Reais", desc: "Investigações reais documentadas, passo a passo, prontas para consultar.", route: "casos-reais" },
    { icon: "check", title: "Checklist", desc: "Confirme os pontos essenciais antes de escalar qualquer chamado técnico.", route: "checklist" }
  ];
  document.getElementById("home-cards").innerHTML = cards.map(c => `
    <div class="card" data-route="${c.route}">
      <span class="card-icon">${icon(c.icon, 20)}</span>
      <div class="card-title">${c.title}</div>
      <div class="card-desc">${c.desc}</div>
    </div>`).join("");
  document.querySelectorAll("#home-cards .card").forEach(el => {
    el.addEventListener("click", () => location.hash = "#/" + el.dataset.route);
  });

  typeTerminal();
}

function typeTerminal() {
  const el = document.getElementById("hero-terminal-body");
  if (!el) return;
  const request = `$ curl -X GET https://api.contact2sale.com/integration \\
  -H "Authorization: Bearer ****"\n\n`;
  const response = `{\n  "company_name": "Empresa Exemplo",\n  "company_id": "a1b2c3d4...",\n  "sub_companies": [ ... ]\n}`;
  const full = request + response;
  let i = 0;
  el.textContent = "";
  const speed = 8;
  function step() {
    if (i <= full.length) {
      el.textContent = full.slice(0, i);
      i += 2;
      requestAnimationFrame(() => setTimeout(step, speed));
    } else {
      el.innerHTML = escapeHtml(full) + '<span class="terminal-cursor"></span>';
    }
  }
  step();
}

function renderFundamentos() {
  app.innerHTML = `
    <span class="eyebrow">Base teórica</span>
    <h1 class="page-title">Fundamentos</h1>
    <p class="page-lede">Esta trilha ajuda a entender o básico de qualquer integração com a API do C2S, desde como uma requisição é enviada até como interpretar a resposta. O objetivo não é decorar detalhes, e sim construir uma base sólida para investigar casos com segurança.</p>

    <div class="section">
      <h2>O que é HTTP</h2>
      <p>HTTP é o protocolo usado para o seu sistema, ou o sistema do cliente, conversar com o C2S pela internet. Cada chamada de API é uma requisição HTTP: você envia um pedido para um endpoint e recebe uma resposta com dados e um código de status.</p>
      <p>Na prática, isso significa que, ao investigar um caso, você normalmente começa pelo fluxo simples: pedir informação, verificar a resposta e comparar com o que o cliente esperava.</p>
    </div>

    <div class="section">
      <h2>O que é REST / API</h2>
      <p>A API do C2S segue o padrão REST. Em vez de uma única função, cada recurso tem um endereço próprio, chamado endpoint, e cada método HTTP descreve a ação que você quer realizar.</p>
      <table>
        <thead><tr><th>Método</th><th>Uso</th></tr></thead>
        <tbody>
          <tr><td><span class="method-tag method-GET">GET</span></td><td>Buscar/listar dados (ex.: listar leads)</td></tr>
          <tr><td><span class="method-tag method-POST">POST</span></td><td>Criar um novo registro (ex.: criar lead)</td></tr>
          <tr><td><span class="method-tag method-PUT">PUT</span></td><td>Atualizar um registro existente</td></tr>
          <tr><td><span class="method-tag method-DELETE">DELETE</span></td><td>Remover um registro</td></tr>
        </tbody>
      </table>
      <p>Em suporte, pensar em “recurso + método + resposta” ajuda a localizar rapidamente onde o problema pode estar.</p>
    </div>

    <div class="section">
      <h2>JSON</h2>
      <p>JSON é o formato usado para a API enviar e receber dados: pares de chave e valor, parecidos com um dicionário. Muitas respostas da API do C2S chegam em JSON, então saber ler esse formato é essencial para interpretar o retorno.</p>
      ${codePanel({ tabs: [{ label: "exemplo.json", html: highlightJson(`{\n  "nome": "João Silva",\n  "status": "em_negociacao",\n  "ativo": true\n}`) }] })}
    </div>

    <div class="section">
      <h2>Autenticação (Bearer Token)</h2>
      <p>Toda chamada precisa de um token válido, enviado no header <code>Authorization</code>. Sem esse token, a API normalmente responde com <code>403</code> e um erro como <code>not_authorized</code>.</p>
      <p>Em ambientes de suporte, validar o token antes de qualquer outra hipótese costuma economizar tempo porque elimina falhas de acesso e credenciais.</p>
    </div>

    <div class="section">
      <h2>Status Code: o essencial</h2>
      <p>Os códigos de status mostram rapidamente se a chamada funcionou, se houve erro de entrada ou se o problema está do lado do servidor.</p>
      <table>
        <thead><tr><th>Faixa</th><th>Significado</th></tr></thead>
        <tbody>
          <tr><td><span class="status-chip status-2">2xx</span></td><td>Sucesso, a requisição funcionou</td></tr>
          <tr><td><span class="status-chip status-4">4xx</span></td><td>Erro do lado de quem chamou (token, dado inválido, etc.)</td></tr>
          <tr><td><span class="status-chip status-5">5xx</span></td><td>Erro do lado do servidor, aqui normalmente se escala</td></tr>
        </tbody>
      </table>
      <p>Exemplos úteis: <code>200</code> para sucesso em leitura, <code>201</code> para criação, <code>403</code> para falta de autorização, <code>423</code> para regra de negócio ou dado inválido e <code>500</code> para falha interna.</p>
    </div>
  `;
  wireCodePanels(app);
}

function renderPostman() {
  app.innerHTML = `
    <span class="eyebrow">Ferramenta</span>
    <h1 class="page-title">Postman</h1>
    <p class="page-lede">Postman é onde você testa a API sem precisar escrever código, ótimo pra validar um caso antes de decidir se escala ou não.</p>

    <div class="section">
      <h2>Configurando o Environment</h2>
      <p>Crie um Environment com duas variáveis:</p>
      <table>
        <thead><tr><th>Variável</th><th>Valor</th></tr></thead>
        <tbody>
          <tr><td><code>base_url</code></td><td>https://api.contact2sale.com/integration</td></tr>
          <tr><td><code>token</code></td><td>o token do cliente que está sendo investigado</td></tr>
        </tbody>
      </table>
    </div>

    <div class="section">
      <h2>Configurando a Authorization</h2>
      <p>Na aba <b>Authorization</b> da requisição, selecione <b>Bearer Token</b> e cole <code>{{token}}</code>. Isso evita ficar reescrevendo o header em cada chamada.</p>
    </div>

    <div class="section">
      <h2>Passo a passo rápido</h2>
      <ul class="checklist" style="list-style:none">
        <li>1. Criar uma Collection nova chamada "C2S API"</li>
        <li>2. Criar o Environment com <code>base_url</code> e <code>token</code></li>
        <li>3. Criar a primeira requisição: GET {{base_url}} para validar o token</li>
        <li>4. Se vier 200 com os dados da empresa, o token está OK</li>
        <li>5. Duplicar a requisição para testar os outros endpoints</li>
      </ul>
    </div>
  `;
}

function renderTroubleshooting() {
  const rows = [
    { code: "400", classe: "4", causa: "Payload inválido / mal formatado", validar: "Conferir se o body está em JSON válido" },
    { code: "401", classe: "4", causa: "Token ausente ou header errado", validar: "Testar em GET /integration isoladamente" },
    { code: "403", classe: "4", causa: "Token inválido, expirado ou sem permissão", validar: "Verificar se o token foi regenerado no painel" },
    { code: "404", classe: "4", causa: "Endpoint ou recurso não existe", validar: "Conferir a URL e o ID usado" },
    { code: "409", classe: "4", causa: "Conflito, registro duplicado", validar: "Verificar se o recurso já existe" },
    { code: "422", classe: "4", causa: "Campo obrigatório ausente ou inválido", validar: "Conferir os campos exigidos pelo endpoint" },
    { code: "500", classe: "5", causa: "Erro interno do servidor", validar: "Reproduzir o caso e escalar com prints" }
  ];
  app.innerHTML = `
    <span class="eyebrow">Investigação</span>
    <h1 class="page-title">Troubleshooting</h1>
    <p class="page-lede">A página que você mais vai abrir. Antes de escalar, confirme aqui a causa mais provável e como validar sozinho.</p>

    <div class="section">
      <table>
        <thead><tr><th>Status</th><th>Causa provável</th><th>Como validar</th><th>Escalar?</th></tr></thead>
        <tbody>
          ${rows.map(r => `
            <tr>
              <td><span class="status-chip status-${r.classe}">${r.code}</span></td>
              <td>${r.causa}</td>
              <td>${r.validar}</td>
              <td>${r.classe === "5" ? "Sim, com prints do request/response" : "Só se validado e persistir"}</td>
            </tr>`).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderCasosReais() {
  app.innerHTML = `
    <span class="eyebrow">Base de conhecimento</span>
    <h1 class="page-title">Casos Reais</h1>
    <p class="page-lede">Investigações documentadas passo a passo. Cresce a cada caso novo resolvido pelo time.</p>
    <div class="section">
      ${CASOS.map(c => `
        <div class="caso-card">
          <span class="caso-id">${c.id}</span>
          <h3>${c.titulo}</h3>
          <p style="margin:0 0 8px">${c.problema}</p>
          <div class="label">Como investigar</div>
          <ol>${c.passos.map(p => `<li>${p}</li>`).join("")}</ol>
          <div class="label">Causa raiz mais comum</div>
          <p style="margin:0">${c.causaRaiz}</p>
          <div class="label">Quando escalar</div>
          <p style="margin:0">${c.escalar}</p>
        </div>
      `).join("")}
    </div>
  `;
}

function renderChecklist() {
  const items = [
    "Testei o token em GET /integration isoladamente?",
    "Confirmei o header correto (Authorization vs Authentication)?",
    "Reproduzi o erro no Postman, fora do sistema do cliente?",
    "Conferi o status code e a página de Troubleshooting?",
    "Verifiquei se é 4xx (provável erro de quem chama) ou 5xx (servidor)?",
    "Busquei um caso parecido em Casos Reais?",
    "Se vou escalar: tenho prints do request e do response completos?"
  ];
  app.innerHTML = `
    <span class="eyebrow">Antes de escalar</span>
    <h1 class="page-title">Checklist</h1>
    <p class="page-lede">Passe por esses pontos antes de abrir um chamado técnico. Resolve a maior parte dos casos sem precisar escalar.</p>
    <ul class="checklist" id="checklist-list">
      ${items.map((t, i) => `
        <li data-i="${i}">
          <input type="checkbox" id="chk-${i}" />
          <label for="chk-${i}" style="cursor:pointer"><span>${t}</span></label>
        </li>`).join("")}
    </ul>
  `;
  app.querySelectorAll('#checklist-list input[type="checkbox"]').forEach(cb => {
    cb.addEventListener("change", () => {
      cb.closest("li").classList.toggle("checked", cb.checked);
    });
  });
}

function renderChangelog() {
  app.innerHTML = `
    <span class="eyebrow">Histórico</span>
    <h1 class="page-title">Changelog</h1>
    <p class="page-lede">Como a trilha evolui mês a mês.</p>
    <div class="section">
      ${CHANGELOG.map(c => `
        <div class="caso-card">
          <span class="caso-id">v${c.versao} · ${c.data}</span>
          <ul style="margin:10px 0 0; padding-left:18px; color:var(--text-dim)">
            ${c.itens.map(i => `<li style="margin-bottom:5px">${i}</li>`).join("")}
          </ul>
        </div>
      `).join("")}
    </div>
  `;
}

function renderEndpointDetail(slug) {
  const ep = ENDPOINTS.find(e => e.slug === slug);
  if (!ep) { app.innerHTML = `<p>Procedimento não encontrado.</p>`; return; }

  const videoSection = ep.video ? `
    <a class="video-card" href="${escapeHtml(ep.video)}" target="_blank" rel="noopener">
      ${icon("play", 22)}
      <div>
        <div class="video-card-title">Assistir demonstração: ${ep.title}</div>
        <div class="video-card-sub">Abre em uma nova aba</div>
      </div>
    </a>` : `
    <a class="video-card video-card-empty">
      ${icon("play", 22)}
      <div>
        <div class="video-card-title">Vídeo ainda não adicionado</div>
        <div class="video-card-sub">Assim que gravar, é só preencher o campo "video" deste procedimento no data.js</div>
      </div>
    </a>`;

  app.innerHTML = `
    <span class="eyebrow">${ep.category}</span>
    <div class="endpoint-head">
      <span class="method-tag method-${ep.method}" style="font-size:12px;padding:4px 8px">${ep.method}</span>
      <span class="endpoint-path">${ep.path}</span>
    </div>
    <h1 class="page-title">${ep.title}</h1>
    <p class="page-lede">${ep.summary}</p>

    ${statusBlock(ep)}

    <div class="section">
      <h2>Quando utilizar</h2>
      <p>${ep.quandoUsar}</p>
    </div>

    ${toolsBlock(ep)}

    <div class="section">
      <h2>Como testar</h2>
      <p>${ep.testar}</p>
      ${codePanel({ tabs: [{ label: "cURL", html: escapeHtml(ep.curl) }] })}
    </div>

    <div class="section">
      <h2>Demonstração em vídeo</h2>
      ${videoSection}
    </div>

    <a class="official-docs-link" href="${OFFICIAL_DOCS_URL}" target="_blank" rel="noopener">
      ${icon("external", 13)}
      <span>Ver especificação completa de ${ep.path} na documentação oficial</span>
    </a>
  `;
  wireCodePanels(app);
}

// ---------- router ----------
function router() {
  const hash = location.hash.replace("#/", "") || "home";
  const [section, sub] = hash.split("/");

  setActiveNav(sub ? `${section}/${sub}` : section);
  window.scrollTo(0, 0);

  switch (section) {
    case "home": renderHome(); break;
    case "fundamentos": renderFundamentos(); break;
    case "postman": renderPostman(); break;
    case "troubleshooting": renderTroubleshooting(); break;
    case "casos-reais": renderCasosReais(); break;
    case "checklist": renderChecklist(); break;
    case "changelog": renderChangelog(); break;
    case "endpoint": renderEndpointDetail(sub); break;
    default: renderHome();
  }
}

window.addEventListener("hashchange", router);
window.addEventListener("DOMContentLoaded", () => {
  renderSidebar();
  router();
  wireMobileMenu();
  wireSearch();
});

// ---------- mobile menu ----------
function wireMobileMenu() {
  const btn = document.getElementById("hamburger");
  const sidebar = document.getElementById("sidebar");
  if (!btn) return;
  btn.addEventListener("click", () => sidebar.classList.toggle("open"));
}
function closeMobileSidebar() {
  document.getElementById("sidebar")?.classList.remove("open");
}

// ---------- search ----------
function wireSearch() {
  const input = document.getElementById("nav-search");
  if (!input) return;
  input.addEventListener("input", () => {
    const q = input.value.toLowerCase().trim();
    document.querySelectorAll("#sidebar-nav .nav-link").forEach(el => {
      const text = el.textContent.toLowerCase();
      el.style.display = !q || text.includes(q) ? "flex" : "none";
    });
  });
}
