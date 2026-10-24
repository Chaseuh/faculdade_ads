// NEXU — navegação entre páginas e interações da interface.

(function () {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ---------- Navegação ---------- */
  // Rotas internas da página index.html (acessadas por #hash)
  const routes = {
    "": { section: "page-home", nav: "home" },
    "#inicio": { section: "page-home", nav: "home" },
    "#busca": { section: "page-search", nav: "search" },
    "#criar": { section: "page-placeholder", nav: "create", title: "Criar publicação" },
    "#config": { section: "page-placeholder", nav: "settings", title: "Configurações" },
  };

  // Para as demais páginas, o item ativo vem do nome do arquivo
  const fileNav = {
    "comunidades.html": "communities",
    "mensagens.html": "messages",
  };

  function setActiveNav(key) {
    $$(".nav-btn[data-nav]").forEach((a) => {
      const active = a.dataset.nav === key;
      a.classList.toggle("active", active);
      if (active) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  function renderRoute() {
    const file = location.pathname.split("/").pop() || "index.html";

    if (fileNav[file]) {
      setActiveNav(fileNav[file]);
      return;
    }

    const route = routes[location.hash] || routes[""];
    $$(".content .page").forEach((p) => p.classList.remove("active-page"));
    const section = document.getElementById(route.section);
    if (section) section.classList.add("active-page");

    const title = document.getElementById("placeholder-title");
    if (title && route.title) title.textContent = route.title;

    setActiveNav(route.nav);
    window.scrollTo({ top: 0 });

    if (route.section === "page-search") {
      const input = document.getElementById("searchInput");
      if (input) input.focus({ preventScroll: true });
    }
  }

  window.addEventListener("hashchange", renderRoute);
  renderRoute();

  /* ---------- Abas ---------- */
  function setupTabs(tabSelector) {
    $$(tabSelector).forEach((tab) => {
      tab.addEventListener("click", () => {
        $$(tabSelector, tab.parentElement).forEach((t) => {
          t.classList.remove("active");
          t.setAttribute("aria-selected", "false");
        });
        tab.classList.add("active");
        tab.setAttribute("aria-selected", "true");
      });
    });
  }
  setupTabs(".tab");
  setupTabs(".search-tab");

  /* ---------- Seguir / Participar ---------- */
  function setupToggle(selector, offText, onText) {
    $$(selector).forEach((btn) => {
      btn.addEventListener("click", () => {
        const on = btn.textContent.trim() === offText;
        btn.textContent = on ? onText : offText;
        btn.classList.toggle("secondary", !on);
        btn.classList.toggle("contrast", on);
      });
    });
  }
  setupToggle(".follow-btn", "Seguir", "Seguindo");
  setupToggle(".join-community", "Participar", "Participando");

  /* ---------- Curtir ---------- */
  $$(".like").forEach((btn) => {
    btn.addEventListener("click", () => {
      const counter = $("span", btn);
      const liked = btn.classList.toggle("liked");
      btn.setAttribute("aria-pressed", String(liked));
      btn.firstChild.textContent = liked ? "♥ " : "♡ ";
      if (counter) counter.textContent = Number(counter.textContent) + (liked ? 1 : -1);
    });
  });

  /* ---------- Voltar ao topo ---------- */
  $$(".back-top").forEach((btn) =>
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }))
  );

  /* ---------- Busca geral ---------- */
  const input = document.getElementById("searchInput");
  const term = document.getElementById("searchedTerm");

  function updateSearchTerm() {
    if (!input || !term) return;
    term.textContent = `“${input.value.trim() || "sua busca"}”`;
  }

  if (input) {
    document.getElementById("searchForm").addEventListener("submit", (e) => {
      e.preventDefault();
      updateSearchTerm();
    });

    document.getElementById("clearSearch").addEventListener("click", () => {
      input.value = "";
      input.focus();
      updateSearchTerm();
    });

    $$(".suggestions button").forEach((btn) =>
      btn.addEventListener("click", () => {
        input.value = btn.dataset.term;
        updateSearchTerm();
        input.focus();
      })
    );

    document.getElementById("adjustSearch").addEventListener("click", () => {
      input.focus();
      input.select();
    });
  }

  /* ---------- Busca de conversas ---------- */
  const messageSearch = document.getElementById("messageSearchInput");
  if (messageSearch) {
    messageSearch.addEventListener("input", () => {
      const q = messageSearch.value.trim().toLocaleLowerCase("pt-BR");
      let visible = 0;
      $$(".message-item").forEach((item) => {
        const show = item.textContent.toLocaleLowerCase("pt-BR").includes(q);
        item.hidden = !show;
        if (show) visible++;
      });
      const empty = document.getElementById("emptyMessages");
      if (empty) empty.hidden = visible !== 0;
    });
  }
})();
