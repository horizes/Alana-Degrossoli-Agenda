(function () {
  "use strict";
  const f = "alana-agenda-session-ended";
  let o = null,
    i = null,
    l = !1,
    c = 0;
  function p() {
    const e = window.__ALANA_AGENDA_CONFIG__;
    if (
      !e ||
      !/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(e.supabaseUrl) ||
      typeof e.publishableKey != "string" ||
      !e.publishableKey.startsWith("sb_publishable_")
    )
      throw new Error("A equipe precisa configurar o acesso à agenda.");
    return e;
  }
  const r = () =>
      "alana-agenda-session-v1:" +
      (window.__ALANA_AGENDA_CONFIG__?.supabaseUrl || "unconfigured"),
    w = (e) =>
      e &&
      typeof e.access_token == "string" &&
      typeof e.refresh_token == "string" &&
      Number.isFinite(e.expires_at) &&
      typeof e.user?.id == "string";
  function h() {
    (c++, (o = null), (l = !1));
    try {
      (sessionStorage.removeItem(r()), localStorage.removeItem(r()));
    } catch {}
  }
  function m(e) {
    if (!w(e))
      throw new Error("O serviço de acesso retornou uma sessão inválida.");
    o = {
      access_token: e.access_token,
      refresh_token: e.refresh_token,
      expires_at: e.expires_at,
      user: { id: e.user.id, email: e.user.email },
    };
    try {
      const n = l ? localStorage : sessionStorage;
      ((l ? sessionStorage : localStorage).removeItem(r()),
        n.setItem(r(), JSON.stringify(o)));
    } catch {}
    return o;
  }
  function g() {
    if (o) return o;
    for (const e of [localStorage, sessionStorage])
      try {
        const n = JSON.parse(e.getItem(r()) || "null");
        if (w(n)) return ((l = e === localStorage), (o = n));
      } catch {}
    return null;
  }
  async function d(e, n, a) {
    const t = p();
    let s;
    try {
      s = await fetch(t.supabaseUrl + "/auth/v1/" + e, {
        method: "POST",
        headers: {
          apikey: t.publishableKey,
          "Content-Type": "application/json",
          ...(a ? { Authorization: "Bearer " + a } : {}),
        },
        body: JSON.stringify(n || {}),
        credentials: "omit",
        signal: AbortSignal.timeout(18e3),
      });
    } catch {
      throw new Error(
        "O acesso está temporariamente indisponível. Tente novamente.",
      );
    }
    if (!s.ok) {
      const _ = new Error(
        s.status === 429
          ? "Muitas tentativas. Aguarde alguns minutos."
          : s.status >= 500
            ? "O serviço de acesso está indisponível. Tente novamente."
            : "Confira o e-mail e a senha ou fale com a equipe.",
      );
      throw ((_.status = s.status), _);
    }
    const u = await s.json().catch(() => ({}));
    return (
      !u.expires_at &&
        u.expires_in &&
        (u.expires_at = Math.floor(Date.now() / 1e3) + u.expires_in),
      u
    );
  }
  async function v() {
    const e = g();
    if (!e) return null;
    if (e.expires_at > Math.floor(Date.now() / 1e3) + 30) return e;
    if (i) return i;
    const n = c,
      a = async () => {
        try {
          o = null;
          const t = g();
          if (t?.expires_at > Math.floor(Date.now() / 1e3) + 30) return t;
          const s = await d("token?grant_type=refresh_token", {
            refresh_token: t?.refresh_token || e.refresh_token,
          });
          return n === c ? m(s) : null;
        } catch (t) {
          if ([400, 401, 403].includes(t.status))
            return (h(), window.dispatchEvent(new Event(f)), null);
          throw t;
        } finally {
          i = null;
        }
      };
    return ((i = navigator.locks ? navigator.locks.request(r(), a) : a()), i);
  }
  async function y(e, n, a) {
    const t = ++c;
    l = a;
    const s = await d("token?grant_type=password", {
      email: e.trim().toLowerCase(),
      password: n,
    });
    if (t !== c) throw Error("O acesso foi interrompido. Tente novamente.");
    return m(s);
  }
  async function k() {
    const e = g()?.access_token;
    if ((h(), window.dispatchEvent(new Event(f)), e))
      try {
        await d("logout?scope=local", {}, e);
      } catch {}
  }
  (window.addEventListener("storage", (e) => {
    e.key === r() &&
      (c++, (o = null), (i = null), window.dispatchEvent(new Event(f)));
  }),
    (window.AlanaAgendaAuth = {
      config: p,
      session: v,
      login: y,
      logout: k,
      clear: h,
      event: f,
    }));
})();
