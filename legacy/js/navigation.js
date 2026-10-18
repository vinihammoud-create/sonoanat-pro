/**
 * Controlador de Navegação e Renderização SPA
 */
const App = {
  currentCategory: null,
  searchQuery: "",

  init() {
    this.bindEvents();
    this.renderHome();
  },

  bindEvents() {
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        if (this.searchQuery.length > 0) {
          this.renderSearchResults(this.searchQuery);
        } else {
          if (this.currentCategory) {
            this.renderCategoryView(this.currentCategory);
          } else {
            this.renderHome();
          }
        }
      });
    }

    const brandBtn = document.getElementById("brand-btn");
    if (brandBtn) {
      brandBtn.addEventListener("click", () => {
        this.currentCategory = null;
        this.searchQuery = "";
        if (searchInput) searchInput.value = "";
        this.renderHome();
      });
    }
  },

  renderHome() {
    this.currentCategory = null;
    const container = document.getElementById("content-container");
    if (!container) return;

    let html = `
      <div class="section-heading">
        <h2 class="section-title">Regiões Anatômicas & Sonoanatomia</h2>
      </div>
      <div class="category-grid">
    `;

    CLINICAL_DATA.categories.forEach((cat) => {
      html += `
        <div class="category-card" onclick="App.selectCategory('${cat.id}')">
          <div class="category-icon-wrapper">
            <img class="category-icon" src="${cat.icon}" alt="${cat.title}" onerror="this.src='assets/img/assets_logo.png'">
          </div>
          <div class="category-title">${cat.title}</div>
          <div class="category-desc">${cat.subtitle}</div>
          <div style="margin-top: 10px; font-size: 0.78rem; color: var(--secondary-accent); font-weight: 600;">
            ${cat.blocks.length} técnicas e procedimentos &rarr;
          </div>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
  },

  selectCategory(categoryId) {
    this.currentCategory = categoryId;
    this.renderCategoryView(categoryId);
  },

  renderCategoryView(categoryId) {
    const category = CLINICAL_DATA.categories.find((c) => c.id === categoryId);
    if (!category) return;

    const container = document.getElementById("content-container");
    if (!container) return;

    let html = `
      <button class="btn-back" onclick="App.renderHome()">
        <span>&larr;</span> Voltar para Regiões
      </button>

      <img class="category-banner" src="${category.banner}" alt="${category.title}" onerror="this.style.display='none'">

      <div class="section-heading">
        <div>
          <h2 class="section-title">${category.title}</h2>
          <p style="color: var(--text-muted); font-size: 0.9rem;">${category.subtitle}</p>
        </div>
      </div>

      <div class="block-list-container">
    `;

    category.blocks.forEach((block) => {
      html += this.buildBlockCard(block);
    });

    html += `</div>`;
    container.innerHTML = html;
  },

  renderSearchResults(query) {
    const container = document.getElementById("content-container");
    if (!container) return;

    const matchedBlocks = [];
    CLINICAL_DATA.categories.forEach((cat) => {
      cat.blocks.forEach((block) => {
        const textToSearch = [
          block.name,
          block.target,
          block.indications,
          block.sonography,
          block.needleApproach,
          block.localAnesthetic
        ]
          .join(" ")
          .toLowerCase();

        if (textToSearch.includes(query)) {
          matchedBlocks.push({ block, categoryTitle: cat.title });
        }
      });
    });

    let html = `
      <button class="btn-back" onclick="App.renderHome()">
        <span>&larr;</span> Voltar para o Início
      </button>
      <div class="section-heading">
        <h2 class="section-title">Resultados da Busca ("${query}")</h2>
        <span style="color: var(--text-muted); font-size: 0.88rem;">${matchedBlocks.length} resultado(s)</span>
      </div>
    `;

    if (matchedBlocks.length === 0) {
      html += `
        <div style="background: var(--surface-card); padding: 40px; text-align: center; border-radius: 12px;">
          <p style="color: var(--text-muted);">Nenhum bloqueio ou estrutura encontrada para o termo pesquisado.</p>
        </div>
      `;
    } else {
      html += `<div class="block-list-container">`;
      matchedBlocks.forEach(({ block, categoryTitle }) => {
        html += this.buildBlockCard(block, categoryTitle);
      });
      html += `</div>`;
    }

    container.innerHTML = html;
  },

  buildBlockCard(block, categoryLabel = null) {
    return `
      <div class="block-card" id="block-${block.id}">
        <div class="block-header">
          <div>
            <div class="block-name">${block.name}</div>
            ${categoryLabel ? `<span style="font-size: 0.78rem; color: var(--text-dim);">${categoryLabel}</span>` : ""}
          </div>
          <span class="block-badge">${block.transducer.split(" ")[0]}</span>
        </div>

        <div class="clinical-field">
          <div class="field-label">Alvo Anatômico</div>
          <div class="field-content">${block.target}</div>
        </div>

        <div class="clinical-field">
          <div class="field-label">Indicações Clínicas</div>
          <div class="field-content">${block.indications}</div>
        </div>

        <div class="clinical-field">
          <div class="field-label">Transdutor & Posicionamento</div>
          <div class="field-content"><strong>Transdutor:</strong> ${block.transducer}<br><strong>Posicionamento:</strong> ${block.position}</div>
        </div>

        <div class="clinical-field">
          <div class="field-label">Sonoanatomia & Marcos de Referência</div>
          <div class="field-content">${block.sonography}</div>
        </div>

        <div class="clinical-field">
          <div class="field-label">Abordagem da Agulha (Needle In-Plane/Out-of-Plane)</div>
          <div class="field-content">${block.needleApproach}</div>
        </div>

        <div class="clinical-field">
          <div class="field-label">Anestésico Local & Volume Recomendado</div>
          <div class="field-content" style="color: #38bdf8; font-weight: 600;">${block.localAnesthetic}</div>
        </div>

        <div class="warning-box">
          <div class="warning-title">
            <svg style="width: 16px; height: 16px; fill: currentColor;" viewBox="0 0 24 24">
              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
            </svg>
            Pontos Críticos & Armadilhas (Pitfalls)
          </div>
          <ul class="warning-list">
            ${block.pitfalls.map((p) => `<li>${p}</li>`).join("")}
          </ul>
        </div>

        <div class="references-box">
          <div class="references-title">Evidências Científicas & Diretrizes (ASRA / BJA / RAPM)</div>
          ${block.references.map((r) => `<div class="reference-item">${r}</div>`).join("")}
        </div>
      </div>
    `;
  }
};

window.addEventListener("DOMContentLoaded", () => {
  App.init();
});
