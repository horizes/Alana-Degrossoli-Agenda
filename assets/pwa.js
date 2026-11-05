(function () {
  "use strict";
  if (location.pathname.includes("/qa/")) return;
  const u = () =>
    matchMedia("(display-mode: standalone)").matches ||
    navigator.standalone === !0;
  let i = null,
    r = null,
    m = !1;
  const n = document.createElement("div");
  ((n.className = "agenda-connection-status"),
    n.setAttribute("role", "status"),
    (n.tabIndex = -1),
    (n.hidden = !0));
  const p = document.createElement("span"),
    a = document.createElement("button");
  ((a.type = "button"),
    (a.className = "text-button"),
    (a.textContent = "Atualizar aplicativo"),
    (a.hidden = !0),
    n.append(p, a),
    document.body.prepend(n));
  function o() {
    const e = navigator.onLine === !1,
      s = !!r?.waiting;
    ((n.hidden = !e && !s),
      (a.hidden = e || !s),
      (p.textContent = e
        ? "Sem conexão. Reconecte-se para consultar ou alterar a agenda."
        : s
          ? "Uma nova versão da Alana está disponível."
          : ""));
  }
  (window.addEventListener("offline", o),
    window.addEventListener("online", o),
    o(),
    document.addEventListener(
      "submit",
      (e) => {
        navigator.onLine === !1 &&
          (e.preventDefault(), e.stopImmediatePropagation(), o(), n.focus());
      },
      !0,
    ));
  let installed = false;
  const canInstall = () =>
    document.body.classList.contains("agenda-signed-in") && !installed && !u();
  const t = document.createElement("button");
  ((t.type = "button"),
    (t.className = "agenda-install-button"),
    (t.textContent = "Instalar aplicativo"),
    (t.hidden = true));
  const v = document.querySelector("footer");
  v && v.append(t);
  const d = document.createElement("dialog");
  d.className = "agenda-dialog agenda-install-dialog";
  function updateInstallVisibility() {
    t.hidden = !canInstall();
    if (t.hidden && d.open) d.close();
  }
  const installObserver = new MutationObserver(updateInstallVisibility);
  installObserver.observe(document.body, {
    attributes: true,
    attributeFilter: ["class"],
  });
  updateInstallVisibility();
  const f = document.createElement("h2");
  f.textContent = "Alana na sua tela inicial";
  const g = document.createElement("p");
  g.textContent =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
      ? "No Safari, abra o menu de compartilhamento e escolha Adicionar à Tela de Início. Se aparecer Abrir como App da Web, mantenha essa opção ativada."
      : "No menu do navegador, escolha Instalar aplicativo ou Adicionar à tela inicial. O nome da opção pode variar conforme o navegador.";
  const l = document.createElement("p");
  ((l.className = "agenda-hint"),
    (l.textContent =
      "Use internet para consultar a disponibilidade e confirmar consultas."));
  const c = document.createElement("button");
  ((c.type = "button"),
    (c.className = "button primary"),
    (c.textContent = "Entendi"),
    c.addEventListener("click", () => d.close()),
    d.append(f, g, l, c),
    document.body.append(d),
    t.addEventListener("click", async () => {
      if (!canInstall()) return;
      if (i) {
        const e = i;
        ((i = null),
          await e.prompt(),
          (await e.userChoice).outcome === "accepted" && (t.hidden = !0));
      } else d.showModal();
    }),
    window.addEventListener("beforeinstallprompt", (e) => {
      (e.preventDefault(), (i = e), updateInstallVisibility());
    }),
    window.addEventListener("appinstalled", () => {
      ((i = null), (installed = true), updateInstallVisibility());
    }),
    a.addEventListener("click", () => {
      !r?.waiting ||
        !confirm(
          "Atualizar o aplicativo agora? Salve as alterações antes de continuar.",
        ) ||
        ((m = !0), r.waiting.postMessage({ type: "ALANA_UPDATE" }));
    }),
    "serviceWorker" in navigator &&
      location.protocol === "https:" &&
      ((document.documentElement.dataset.alanaOfflineReady = "pending"),
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        m && location.reload();
      }),
      navigator.serviceWorker
        .register(new URL("sw.js", document.baseURI), {
          scope: new URL("./", document.baseURI).pathname,
          updateViaCache: "none",
        })
        .then((e) => {
          ((r = e),
            o(),
            e.addEventListener("updatefound", () => {
              e.installing?.addEventListener("statechange", o);
            }),
            navigator.serviceWorker.ready.then(() => {
              document.documentElement.dataset.alanaOfflineReady = "true";
            }));
        })
        .catch(() => {
          document.documentElement.dataset.alanaOfflineReady = "unavailable";
        })));
})();
