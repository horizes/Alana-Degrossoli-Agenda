(function () {
  "use strict";
  const a = new URLSearchParams(location.search),
    t = a.get("state"),
    r = a.get("code");
  history.replaceState(null, "", location.pathname);
  const l = document.getElementById("google-status"),
    o = window.AlanaGoogleFlow,
    s = o?.read(t);
  let i = s?.returnPath || null;
  function c() {
    const n = i || sessionStorage.getItem("alana-agenda-google-return");
    if ((sessionStorage.removeItem("alana-agenda-google-return"), o)) {
      location.href = new URL(o.returnPath(n), location.href).href;
      return;
    }
    let e;
    try {
      e = new URL(n || "index.html?secao=agenda", location.href);
    } catch {}
    ((!e ||
      e.origin !== location.origin ||
      !/^\/[a-zA-Z0-9_./-]+$/.test(e.pathname)) &&
      (e = new URL("index.html?secao=agenda", location.href)),
      (location.href = e.href));
  }
  (document.getElementById("google-close").addEventListener("click", () => {
    window.opener ? window.close() : c();
  }),
    (async () => {
      let n = "failed";
      try {
        const e =
          s?.browserSecret ||
          (o ? null : sessionStorage.getItem("alana-agenda-google-browser"));
        if (a.has("error") || !t || !r || !e)
          throw new Error(
            "A autorização não foi concluída. Inicie a conexão novamente pelo painel da Alana.",
          );
        (await window.AlanaAgendaAPI.call("googleCallback", {
          state: t,
          code: r,
          browserSecret: e,
        }),
          o
            ? o.clear(t)
            : sessionStorage.removeItem("alana-agenda-google-browser"),
          (l.textContent =
            "Google Agenda conectado. As novas consultas online terão um Meet exclusivo."),
          (n = "connected"));
      } catch (e) {
        (a.has("error") && o && o.clear(t),
          (l.textContent =
            e.message + " Confira também o resultado no painel da agenda."));
      }
      window.opener &&
        window.opener.postMessage(
          { type: "alana-agenda-google-result", result: n },
          location.origin,
        );
    })());
})();
