// ============================================================
// SUPPORT ACADEMY - app.js
// SPA simples com roteamento por hash. Sem build step.
//
// Arquitetura: nenhuma função aqui é específica de uma trilha.
// Tudo lê de TRILHAS e CONTEUDOS (data.js). Pra adicionar uma
// trilha ou um conteúdo novo, mexe só no data.js.
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
  external: `<path d="M14 4h6v6"/><path d="M20 4 10 14"/><path d="M19 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>`,
  sun: `<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>`,
  moon: `<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z"/>`,
  arrowLeft: `<path d="M19 12H5"/><path d="m11 18-6-6 6-6"/>`,
  arrowRight: `<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>`,
  list: `<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="3.5" cy="6" r="1.2" fill="currentColor" stroke="none"/><circle cx="3.5" cy="12" r="1.2" fill="currentColor" stroke="none"/><circle cx="3.5" cy="18" r="1.2" fill="currentColor" stroke="none"/>`,
  plug: `<path d="M9 7V3M15 7V3M7 10h10a1 1 0 0 1 1 1v2a5 5 0 0 1-5 5h-4a5 5 0 0 1-5-5v-2a1 1 0 0 1 1-1Z"/><path d="M10 18v3M14 18v3"/>`,
  playbook: `<rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1"/><path d="M9 11h6M9 15h6M9 19h3"/>`,
  shield: `<path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>`,
  wrench: `<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.8 2.8-2-2 2.8-2.8Z"/>`,
  star: `<path d="M12 3l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1L6.6 19.3l1.3-6L3.3 9.2l6.1-.6L12 3Z"/>`,
  dashboard: `<rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="5" rx="1.5"/><rect x="13" y="10" width="8" height="11" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/>`
};

function icon(name, size = 16) {
  return `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ""}</svg>`;
}

const STATIC_PAGES_TOP = [
  { slug: "home", label: "Início", icon: "home" },
  { slug: "favoritos", label: "Favoritos", icon: "star" }
];
const STATIC_PAGES_BOTTOM = [
  { slug: "atualizacoes", label: "Atualizações", icon: "clock" }
];

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function highlightJson(json) {
  const escaped = escapeHtml(json);
  return escaped
    .replace(/"([^"]+)":/g, '<span class="k">"$1"</span>:')
    .replace(/: "([^"]*)"/g, ': <span class="s">"$1"</span>')
    .replace(/: (\d+(\.\d+)?)/g, ': <span class="n">$1</span>')
    .replace(/: (true|false|null)/g, ': <span class="n">$1</span>');
}

// ============================================================
// Camada de dados (helpers sobre TRILHAS / CONTEUDOS / VIDEO_GROUPS)
// ============================================================
function trilhaBySlug(slug) { return TRILHAS.find(t => t.slug === slug); }
function contentBySlug(slug) { return CONTEUDOS.find(c => c.slug === slug); }
function contentsByTrilha(trilhaSlug) { return CONTEUDOS.filter(c => c.trilha === trilhaSlug); }

function groupByCategoria(items) {
  const map = {};
  items.forEach(it => { (map[it.categoria] = map[it.categoria] || []).push(it); });
  return map;
}

function prevNext(item) {
  const siblings = CONTEUDOS
    .filter(c => c.trilha === item.trilha && c.categoria === item.categoria)
    .sort((a, b) => a.ordem - b.ordem);
  const idx = siblings.findIndex(c => c.slug === item.slug);
  return { prev: siblings[idx - 1] || null, next: siblings[idx + 1] || null };
}

// ============================================================
// Favoritos e progresso (localStorage, por navegador)
// ============================================================
const LS_FAV = "sa-favorites";
const LS_PROGRESS = "sa-progress";

function getFavorites() {
  try { return JSON.parse(localStorage.getItem(LS_FAV)) || []; } catch (e) { return []; }
}
function isFavorite(slug) { return getFavorites().includes(slug); }
function toggleFavorite(slug) {
  const favs = getFavorites();
  const idx = favs.indexOf(slug);
  if (idx === -1) favs.push(slug); else favs.splice(idx, 1);
  try { localStorage.setItem(LS_FAV, JSON.stringify(favs)); } catch (e) {}
  return favs.includes(slug);
}

function getProgressMap() {
  try { return JSON.parse(localStorage.getItem(LS_PROGRESS)) || {}; } catch (e) { return {}; }
}
function getProgress(slug) { return getProgressMap()[slug] || "nao-iniciado"; }
function setProgress(slug, status) {
  const map = getProgressMap();
  map[slug] = status;
  try { localStorage.setItem(LS_PROGRESS, JSON.stringify(map)); } catch (e) {}
}
const PROGRESS_LABELS = {
  "nao-iniciado": "Não iniciado",
  "em-andamento": "Em andamento",
  "concluido": "Concluído"
};

// ============================================================
// Sidebar
// ============================================================
const METHOD_ORDER = ["GET", "POST", "PUT", "DELETE"];

function renderSidebar() {
  const groupsHtml = [];

  groupsHtml.push(`<div class="nav-group">
    ${STATIC_PAGES_TOP.map(navLinkHtml).join("")}
  </div>`);

  const trilhasOrdenadas = [...TRILHAS].sort((a, b) => a.ordem - b.ordem);
  trilhasOrdenadas.forEach(trilha => {
    const items = contentsByTrilha(trilha.slug);
    const porCategoria = groupByCategoria(items);
    const categorias = Object.keys(porCategoria);
    if (!categorias.length) return;

    const categoriaBlocks = categorias.map(cat => {
      const catItems = porCategoria[cat];
      if (trilha.slug === "api") {
        const methodsPresent = METHOD_ORDER.filter(m => catItems.some(c => c.method === m));
        const methodBlocks = methodsPresent.map(method => {
          const links = catItems.filter(c => c.method === method).map(contentLinkHtml).join("");
          return `
            <div class="nav-method-group">
              <div class="nav-method-label"><span class="method-tag method-${method}">${method}</span></div>
              ${links}
            </div>`;
        }).join("");
        return `<div class="nav-categoria-group">
          <div class="nav-categoria-label">${cat}</div>
          ${methodBlocks}
        </div>`;
      }
      const links = catItems.map(contentLinkHtml).join("");
      return `<div class="nav-categoria-group">
        <div class="nav-categoria-label">${cat}</div>
        ${links}
      </div>`;
    }).join("");

    groupsHtml.push(`
    <div class="nav-folder">
      <button class="nav-folder-toggle" data-folder="${trilha.slug}">
        ${icon("chevron", 13)}
        ${icon(trilha.icon, 14)}
        <span class="nav-group-label">${trilha.titulo}</span>
        <span class="nav-folder-count">${items.length}</span>
      </button>
      <div class="nav-folder-items">
        ${categoriaBlocks}
      </div>
    </div>`);
  });

  groupsHtml.push(`<div class="nav-group">
    ${STATIC_PAGES_BOTTOM.map(navLinkHtml).join("")}
  </div>`);

  sidebarNav.innerHTML = groupsHtml.join("");

  sidebarNav.querySelectorAll("[data-route]").forEach(el => {
    el.addEventListener("click", () => {
      location.hash = "#/" + el.dataset.route;
      closeMobileSidebar();
    });
  });

  sidebarNav.querySelectorAll(".nav-folder-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      btn.parentElement.classList.toggle("open");
    });
  });
}

function contentLinkHtml(item) {
  return `
    <div class="nav-link" data-route="conteudo/${item.slug}">
      <span>${item.titulo}</span>
    </div>`;
}

function navLinkHtml(p) {
  return `<div class="nav-link" data-route="${p.slug}">${icon(p.icon, 15)}<span>${p.label}</span></div>`;
}

function setActiveNav(route) {
  document.querySelectorAll(".nav-link").forEach(el => {
    el.classList.toggle("active", el.dataset.route === route);
  });
  const activeLink = document.querySelector(".nav-link.active");
  activeLink?.closest(".nav-folder")?.classList.add("open");
}

// ============================================================
// Componentes reutilizáveis
// ============================================================
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

function statusBlock(item) {
  const hasVideo = !!VIDEO_GROUPS[item.videoGroup]?.video;
  const items = [
    { done: !!item.status.validado, label: "Validado pelo Suporte" },
    { done: hasVideo, label: "Vídeo disponível" },
    { done: !!item.status.testadoPostman, label: "Testado no Postman" }
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
        <span>Última revisão: ${item.status.revisao}</span>
      </div>
    </div>
  </div>`;
}

const TOOL_ICONS = { postman: "mail", api: "api", plataforma: "platform", logs: "logs" };

function toolsBlock(item) {
  if (!item.ferramentas || !item.ferramentas.length) return "";
  const items = item.ferramentas.map(key => `
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

function videoInfoBlock(group) {
  const endpointsAbordados = [group.exemploPrincipal, ...group.outrosExemplos];
  return `
  <div class="video-info-block">
    <div class="video-info-item">
      ${icon("target", 16)}
      <div><div class="video-info-label">Objetivo</div><div class="video-info-value">${group.resumo}</div></div>
    </div>
    <div class="video-info-item">
      ${icon("list", 16)}
      <div><div class="video-info-label">Endpoints abordados</div><div class="video-info-value">${endpointsAbordados.join(", ")}</div></div>
    </div>
    <div class="video-info-item">
      ${icon("check", 16)}
      <div><div class="video-info-label">Pré-requisitos</div><div class="video-info-value">${group.preRequisitos.join(", ")}</div></div>
    </div>
    <div class="video-info-item">
      ${icon("clock", 16)}
      <div><div class="video-info-label">Tempo estimado</div><div class="video-info-value">${group.duracao}</div></div>
    </div>
  </div>`;
}

function extractLoomId(url) {
  const m = url.match(/loom\.com\/share\/([a-zA-Z0-9]+)/);
  return m ? m[1] : null;
}

function bigLoomPlayer(group) {
  if (!group.video) {
    return `
    <div class="loom-player loom-player-empty">
      <img class="loom-player-thumb loom-player-cover" src="video-cover.svg" alt="Capa ilustrativa: vídeo ainda não adicionado" loading="lazy">
      <div class="loom-player-overlay loom-player-overlay-empty">
        ${icon("play", 30)}
        <span class="loom-player-empty-label">${group.titulo}<br>vídeo ainda não adicionado</span>
      </div>
    </div>`;
  }
  const loomId = extractLoomId(group.video);
  const thumb = loomId ? `https://cdn.loom.com/sessions/thumbnails/${loomId}-with-play.gif` : "";
  const fallbackAttr = `onerror="this.onerror=null;this.src='video-cover.svg';this.classList.add('loom-player-cover');this.alt='Capa ilustrativa do vídeo';"`;
  return `
  <a class="loom-player" href="${escapeHtml(group.video)}" target="_blank" rel="noopener" aria-label="Assistir: ${group.titulo}">
    ${thumb ? `<img class="loom-player-thumb" src="${thumb}" alt="Miniatura do vídeo: ${group.titulo}" loading="lazy" ${fallbackAttr}>` : `<img class="loom-player-thumb loom-player-cover" src="video-cover.svg" alt="Capa ilustrativa do vídeo" loading="lazy">`}
    <div class="loom-player-overlay">${icon("play", 30)}</div>
  </a>
  <a class="loom-watch-btn" href="${escapeHtml(group.video)}" target="_blank" rel="noopener">
    ${icon("external", 14)}
    <span>Assistir no Loom</span>
  </a>`;
}

function breadcrumb(item) {
  const trilha = trilhaBySlug(item.trilha);
  const parts = [
    `<a href="#/home">Início</a>`,
    `<a href="#/trilha/${item.trilha}">${trilha ? trilha.titulo : item.trilha}</a>`,
    `<span>${item.categoria}</span>`,
    `<span class="breadcrumb-current">${item.titulo}</span>`
  ];
  return `<nav class="breadcrumb">${parts.join('<span class="breadcrumb-sep">/</span>')}</nav>`;
}

function favoriteButton(item) {
  if (!item.favoritavel) return "";
  const active = isFavorite(item.slug);
  return `
    <button class="favorite-btn ${active ? "active" : ""}" data-favorite="${item.slug}" aria-label="Favoritar">
      ${icon("star", 17)}
    </button>`;
}

function progressControl(item) {
  const current = getProgress(item.slug);
  const options = ["nao-iniciado", "em-andamento", "concluido"];
  const buttons = options.map(opt => `
    <button class="progress-btn ${current === opt ? "active" : ""} progress-${opt}" data-progress="${item.slug}" data-status="${opt}">
      ${PROGRESS_LABELS[opt]}
    </button>`).join("");
  return `<div class="progress-control">${buttons}</div>`;
}

function prevNextNav(item) {
  const { prev, next } = prevNext(item);
  if (!prev && !next) return "";
  return `
  <div class="prev-next-nav">
    ${prev ? `<a class="prev-next-link prev" href="#/conteudo/${prev.slug}">${icon("arrowLeft", 15)}<div><span class="prev-next-label">Conteúdo anterior</span><span class="prev-next-title">${prev.titulo}</span></div></a>` : `<span></span>`}
    ${next ? `<a class="prev-next-link next" href="#/conteudo/${next.slug}"><div><span class="prev-next-label">Próximo conteúdo</span><span class="prev-next-title">${next.titulo}</span></div>${icon("arrowRight", 15)}</a>` : `<span></span>`}
  </div>`;
}

function dicasBlock(item) {
  if (!item.dicas || !item.dicas.length) return "";
  return `
  <div class="section">
    <h2>Dicas</h2>
    <ul class="tip-list">${item.dicas.map(d => `<li>${d}</li>`).join("")}</ul>
  </div>`;
}

function problemasComunsBlock(item) {
  if (!item.problemasComuns || !item.problemasComuns.length) return "";
  return `
  <div class="section">
    <h2>Problemas comuns</h2>
    <ul class="tip-list">${item.problemasComuns.map(d => `<li>${d}</li>`).join("")}</ul>
  </div>`;
}

// ============================================================
// Corpo específico por tipo de conteúdo
// ============================================================
function corpoProcedimento(item) {
  return `
    <div class="endpoint-head">
      <span class="method-tag method-${item.method}" style="font-size:12px;padding:4px 8px">${item.method}</span>
      <span class="endpoint-path">${item.path}</span>
    </div>
    ${toolsBlock(item)}
    <div class="section">
      <h2>Como testar</h2>
      <p>${item.testar}</p>
      ${codePanel({ tabs: [{ label: "cURL", html: escapeHtml(item.curl) }] })}
    </div>`;
}

function corpoConceito(item) {
  const paragrafos = item.conteudo.map(p => `<p>${p}</p>`).join("");
  const exemplo = item.exemplo ? `
    <div class="section"><h2>Exemplo</h2>${codePanel({ tabs: [{ label: "Exemplo", html: highlightJson(item.exemplo) }] })}</div>` : "";
  return `<div class="section">${paragrafos}</div>${exemplo}`;
}

function corpoErro(item) {
  return `
    ${toolsBlock(item)}
    <div class="section">
      <h2>Causa mais comum</h2>
      <p>${item.causaComum}</p>
    </div>
    <div class="section">
      <h2>Como investigar</h2>
      <ol class="step-list">${item.comoInvestigar.map(s => `<li>${s}</li>`).join("")}</ol>
    </div>
    <div class="section">
      <h2>Como resolver</h2>
      <p>${item.comoResolver}</p>
    </div>`;
}

function corpoPlaybook(item) {
  return `
    <div class="section">
      <h2>Passo a passo</h2>
      <ul class="checklist" style="list-style:none">${item.passos.map(p => `<li><span>${p}</span></li>`).join("")}</ul>
    </div>`;
}

function corpoCaso(item) {
  const statusClass = item.statusCaso === "Resolvido" ? "status-2" : "status-4";
  return `
    <div class="section">
      <span class="status-chip ${statusClass}">${item.statusCaso}</span>
    </div>
    <div class="section"><h2>Problema</h2><p>${item.problema}</p></div>
    <div class="section"><h2>Causa</h2><p>${item.causa}</p></div>
    <div class="section">
      <h2>Investigação</h2>
      <ol class="step-list">${item.investigacao.map(s => `<li>${s}</li>`).join("")}</ol>
    </div>
    <div class="section"><h2>Solução</h2><p>${item.solucao}</p></div>
    <div class="section"><h2>Aprendizados</h2><p>${item.aprendizados}</p></div>
    <div class="section">
      <h2>Palavras-chave</h2>
      <div class="keyword-chips">${item.palavrasChave.map(k => `<span class="keyword-chip">${k}</span>`).join("")}</div>
    </div>`;
}

function corpoFerramenta(item) {
  const collection = item.collectionUrl ? `
    <a class="docs-relation-btn" href="${item.collectionUrl}" target="_blank" rel="noopener">
      ${icon("api", 18)}<span>Abrir Collection Oficial</span>${icon("external", 15)}
    </a>` : `
    <div class="collection-placeholder">
      ${icon("api", 16)}
      <span>Link da Collection oficial ainda não adicionado. Quando existir, cole no campo collectionUrl deste item, no data.js.</span>
    </div>`;
  return `
    <div class="docs-relation">
      <div class="docs-relation-copy">
        <div class="status-block-label">Acesso rápido</div>
        <p>${item.resumo}</p>
      </div>
      <a class="docs-relation-btn" href="${item.linkUrl}" target="_blank" rel="noopener">
        ${icon("mail", 18)}<span>${item.linkLabel}</span>${icon("external", 15)}
      </a>
    </div>
    <div class="section"><h2>Collection oficial</h2>${collection}</div>
    <div class="section">
      <h2>Passo a passo</h2>
      <ul class="checklist" style="list-style:none">${item.passos.map(p => `<li><span>${p}</span></li>`).join("")}</ul>
    </div>`;
}

const CORPO_RENDERERS = {
  procedimento: corpoProcedimento,
  conceito: corpoConceito,
  erro: corpoErro,
  playbook: corpoPlaybook,
  caso: corpoCaso,
  ferramenta: corpoFerramenta
};

// ============================================================
// Página genérica de conteúdo
// ============================================================
function renderContentDetail(slug) {
  const item = contentBySlug(slug);
  if (!item) { app.innerHTML = `<p>Conteúdo não encontrado.</p>`; return; }

  const statusSection = item.status ? statusBlock(item) : "";
  const quandoUsarSection = item.quandoUsar ? `
    <div class="section"><h2>Quando utilizar</h2><p>${item.quandoUsar}</p></div>` : "";

  const group = item.videoGroup ? VIDEO_GROUPS[item.videoGroup] : null;
  const videoSection = group ? `
    <div class="section">
      <h2>Vídeo relacionado</h2>
      <p class="video-shared-note">Esse vídeo cobre o recurso ${item.categoria} + ${item.method}, não é exclusivo deste conteúdo.</p>
      ${videoInfoBlock(group)}
      ${bigLoomPlayer(group)}
    </div>` : "";

  const docOficialLink = item.docOficial ? `
    <a class="official-docs-link" href="${OFFICIAL_DOCS_URL}" target="_blank" rel="noopener">
      ${icon("external", 13)}<span>Ver especificação completa de ${item.path} na documentação oficial</span>
    </a>` : "";

  const corpoFn = CORPO_RENDERERS[item.tipo];

  app.innerHTML = `
    ${breadcrumb(item)}
    <span class="eyebrow">${item.categoria}</span>
    <div class="content-title-row">
      <h1 class="page-title">${item.titulo}</h1>
      ${favoriteButton(item)}
    </div>
    <p class="page-lede">${item.resumo}</p>

    ${progressControl(item)}
    ${statusSection}
    ${quandoUsarSection}
    ${corpoFn ? corpoFn(item) : ""}
    ${videoSection}
    ${dicasBlock(item)}
    ${problemasComunsBlock(item)}
    ${docOficialLink}
    ${prevNextNav(item)}
  `;
  wireCodePanels(app);
}

// ============================================================
// Home
// ============================================================
function renderHome() {
  const totalProcedimentos = CONTEUDOS.filter(c => c.tipo === "procedimento").length;
  const totalVideosPublicados = Object.values(VIDEO_GROUPS).filter(g => g.video).length;
  const totalTrilhas = TRILHAS.length;
  const totalCasos = CONTEUDOS.filter(c => c.tipo === "caso").length;

  app.innerHTML = `
    <span class="version-badge">Versão <b>${CHANGELOG[0].versao}</b> · atualizado em ${CHANGELOG[0].data}</span>
    <div class="hero">
      <div class="hero-copy">
        <span class="eyebrow">Suporte C2S</span>
        <h1>Support Academy</h1>
        <p>Central de conhecimento do time de Suporte. Aprenda a investigar problemas, testar integrações, entender a API, consultar playbooks, estudar casos reais e evoluir continuamente.</p>
        <div class="hero-actions">
          <a class="docs-relation-btn" href="#/trilha/api">
            <span>Começar</span>${icon("arrowRight", 15)}
          </a>
          <a class="hero-secondary-btn" href="#/favoritos">
            <span>Explorar conteúdos</span>
          </a>
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

    <div class="dashboard-grid">
      <div class="dash-card"><div class="dash-num">${totalProcedimentos}</div><div class="dash-label">Procedimentos</div></div>
      <div class="dash-card"><div class="dash-num">${totalVideosPublicados}</div><div class="dash-label">Vídeos publicados</div></div>
      <div class="dash-card"><div class="dash-num">${totalTrilhas}</div><div class="dash-label">Trilhas</div></div>
      <div class="dash-card"><div class="dash-num">${totalCasos}</div><div class="dash-label">Casos Reais</div></div>
    </div>

    <div class="docs-relation">
      <div class="docs-relation-copy">
        <div class="status-block-label">Documentação Oficial da API</div>
        <p>A documentação oficial reúne todas as informações técnicas da API: endpoints, parâmetros, autenticação, exemplos de requisição e de resposta. É a fonte de referência.</p>
        <p>A Support Academy complementa essa documentação, mostrando como usar esses recursos em cenários reais de suporte.</p>
      </div>
      <a class="docs-relation-btn" href="${OFFICIAL_DOCS_URL}" target="_blank" rel="noopener">
        ${icon("book", 18)}<span>Acessar Documentação Oficial da API</span>${icon("external", 15)}
      </a>
    </div>

    <div class="section">
      <span class="eyebrow">Navegue pela plataforma</span>
      <h2>Trilhas</h2>
      <div class="card-grid" id="home-trilhas"></div>
    </div>
  `;

  const trilhasOrdenadas = [...TRILHAS].sort((a, b) => a.ordem - b.ordem);
  document.getElementById("home-trilhas").innerHTML = trilhasOrdenadas.map(t => `
    <div class="card" data-route="trilha/${t.slug}">
      <span class="card-icon">${icon(t.icon, 20)}</span>
      <div class="card-title">${t.titulo}</div>
      <div class="card-desc">${t.descricao}</div>
    </div>`).join("");
  document.querySelectorAll("#home-trilhas .card").forEach(el => {
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

// ============================================================
// Página de índice de trilha
// ============================================================
function renderTrilhaIndex(trilhaSlug) {
  const trilha = trilhaBySlug(trilhaSlug);
  if (!trilha) { app.innerHTML = `<p>Trilha não encontrada.</p>`; return; }

  const items = contentsByTrilha(trilhaSlug);
  const porCategoria = groupByCategoria(items);
  const categorias = Object.keys(porCategoria);

  app.innerHTML = `
    <nav class="breadcrumb"><a href="#/home">Início</a><span class="breadcrumb-sep">/</span><span class="breadcrumb-current">${trilha.titulo}</span></nav>
    <span class="eyebrow">Trilha</span>
    <h1 class="page-title">${trilha.titulo}</h1>
    <p class="page-lede">${trilha.descricao}</p>

    ${categorias.length ? categorias.map(cat => `
      <div class="section">
        <h2>${cat}</h2>
        <div class="card-grid">
          ${porCategoria[cat].map(it => `
            <div class="card" data-route="conteudo/${it.slug}">
              ${it.method ? `<span class="method-tag method-${it.method}" style="margin-bottom:8px;display:inline-block">${it.method}</span>` : ""}
              <div class="card-title">${it.titulo}</div>
              <div class="card-desc">${it.resumo}</div>
            </div>`).join("")}
        </div>
      </div>`).join("") : `
      <div class="section"><p>Nenhum conteúdo publicado ainda nessa trilha.</p></div>`}
  `;

  app.querySelectorAll(".card[data-route]").forEach(el => {
    el.addEventListener("click", () => location.hash = "#/" + el.dataset.route);
  });
}

// ============================================================
// Favoritos
// ============================================================
function renderFavoritos() {
  const favs = getFavorites();
  const items = favs.map(contentBySlug).filter(Boolean);

  app.innerHTML = `
    <span class="eyebrow">Sua seleção</span>
    <h1 class="page-title">Favoritos</h1>
    <p class="page-lede">Salvo só neste navegador. Clique na estrela em qualquer conteúdo para adicionar ou remover daqui.</p>
    <div class="section">
      ${items.length ? `<div class="card-grid">
        ${items.map(it => `
          <div class="card" data-route="conteudo/${it.slug}">
            <span class="card-icon">${icon(trilhaBySlug(it.trilha)?.icon || "book", 18)}</span>
            <div class="card-title">${it.titulo}</div>
            <div class="card-desc">${it.resumo}</div>
          </div>`).join("")}
      </div>` : `<p>Você ainda não favoritou nada. Abra qualquer conteúdo e clique na estrela ao lado do título.</p>`}
    </div>
  `;
  app.querySelectorAll(".card[data-route]").forEach(el => {
    el.addEventListener("click", () => location.hash = "#/" + el.dataset.route);
  });
}

// ============================================================
// Atualizações (changelog)
// ============================================================
function renderAtualizacoes() {
  app.innerHTML = `
    <span class="eyebrow">Histórico</span>
    <h1 class="page-title">Atualizações</h1>
    <p class="page-lede">Como a plataforma evolui, versão a versão.</p>
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

// ============================================================
// router
// ============================================================
function router() {
  const hash = location.hash.replace("#/", "") || "home";
  const [section, sub] = hash.split(/\/(.+)/); // sub pode conter mais barras (slug com /)

  setActiveNav(sub ? `${section}/${sub}` : section);
  window.scrollTo(0, 0);

  switch (section) {
    case "home": renderHome(); break;
    case "trilha": renderTrilhaIndex(sub); break;
    case "conteudo": renderContentDetail(sub); break;
    case "favoritos": renderFavoritos(); break;
    case "atualizacoes": renderAtualizacoes(); break;
    default: renderHome();
  }

  if (section !== "home") {
    app.insertAdjacentHTML("afterbegin", `
      <button class="back-btn" data-back>
        ${icon("arrowLeft", 15)}
        <span>Voltar</span>
      </button>`);
  }

  app.classList.remove("page-enter");
  void app.offsetWidth;
  app.classList.add("page-enter");
}

document.addEventListener("click", (e) => {
  const backBtn = e.target.closest("[data-back]");
  if (backBtn) {
    if (window.history.length > 1) window.history.back();
    else location.hash = "#/home";
    return;
  }
  const favBtn = e.target.closest("[data-favorite]");
  if (favBtn) {
    const active = toggleFavorite(favBtn.dataset.favorite);
    favBtn.classList.toggle("active", active);
    return;
  }
  const progressBtn = e.target.closest("[data-progress]");
  if (progressBtn) {
    setProgress(progressBtn.dataset.progress, progressBtn.dataset.status);
    progressBtn.parentElement.querySelectorAll(".progress-btn").forEach(b =>
      b.classList.toggle("active", b === progressBtn));
    return;
  }
});

window.addEventListener("hashchange", router);
window.addEventListener("DOMContentLoaded", () => {
  renderSidebar();
  router();
  wireMobileMenu();
  wireSearch();
  wireThemeToggle();
  const versionEl = document.getElementById("brand-version");
  if (versionEl) versionEl.textContent = `Suporte C2S · v${CHANGELOG[0].versao}`;
});

// ---------- tema claro/escuro ----------
function applyThemeIcon(theme) {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;
  btn.innerHTML = icon(theme === "light" ? "moon" : "sun", 16);
  btn.setAttribute("title", theme === "light" ? "Mudar para tema escuro" : "Mudar para tema claro");
}
function wireThemeToggle() {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;
  const current = document.documentElement.getAttribute("data-theme") || "dark";
  applyThemeIcon(current);
  btn.addEventListener("click", () => {
    const now = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", now);
    try { localStorage.setItem("sa-theme", now); } catch (e) {}
    applyThemeIcon(now);
  });
}

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

// ---------- busca global (cobre todas as trilhas, não só API) ----------
function wireSearch() {
  const input = document.getElementById("nav-search");
  if (!input) return;
  input.addEventListener("input", () => {
    const q = input.value.toLowerCase().trim();
    document.querySelectorAll("#sidebar-nav .nav-link").forEach(el => {
      const text = el.textContent.toLowerCase();
      el.style.display = !q || text.includes(q) ? "flex" : "none";
    });
    if (q) {
      document.querySelectorAll(".nav-folder").forEach(folder => {
        const hasMatch = !!folder.querySelector('.nav-link[style*="flex"]');
        folder.classList.toggle("open", hasMatch);
      });
    } else {
      document.querySelectorAll(".nav-folder").forEach(folder => folder.classList.remove("open"));
      document.querySelector(".nav-link.active")?.closest(".nav-folder")?.classList.add("open");
    }
  });
}
