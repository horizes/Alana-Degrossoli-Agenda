(function () {
  "use strict";
  const r = new Set([
    "agendaInfo",
    "agendaBook",
    "agendaRecover",
    "googleCallback",
  ]);
  async function i(t, c = {}) {
    if (typeof navigator < "u" && navigator.onLine === !1) {
      const e = new Error(
        "Você está sem conexão. Reconecte-se à internet para continuar.",
      );
      throw ((e.code = "OFFLINE"), e);
    }
    const n = window.__ALANA_AGENDA_CONFIG__;
    if (
      !n ||
      typeof n.publishableKey !== "string" ||
      !n.publishableKey.startsWith("sb_publishable_") ||
      !/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(n.supabaseUrl)
    )
      throw new Error(
        "O agendamento online está em preparação. Consulte os horários pelo WhatsApp.",
      );
    if (n.agendaFunction && !/^[a-z][a-z0-9-]{0,63}$/.test(n.agendaFunction))
      throw new Error("Configuração da agenda inválida.");
    const s = { "Content-Type": "application/json", apikey: n.publishableKey };
    if (!r.has(t)) {
      const e = await window.AlanaAgendaAuth?.session();
      if (!e) throw new Error("Entre na agenda para continuar.");
      s.Authorization = "Bearer " + e.access_token;
    }
    let a;
    try {
      a = await fetch(
        n.supabaseUrl +
          "/functions/v1/" +
          (n.agendaFunction || "solvex-agenda"),
        {
          method: "POST",
          headers: s,
          body: JSON.stringify({ action: t, payload: c }),
          credentials: "omit",
          cache: "no-store",
          signal: AbortSignal.timeout(35e3),
        },
      );
    } catch {
      throw new Error(
        "A agenda não respondeu. Verifique a mesma tentativa antes de reenviar.",
      );
    }
    const o = await a.json().catch(() => null);
    if (!a.ok || o?.error) {
      a.status === 401 &&
        !r.has(t) &&
        (window.AlanaAgendaAuth?.clear(),
        window.dispatchEvent(new Event("alana-agenda-session-ended")));
      const e = new Error(
        o?.error?.message ||
          "Não foi possível consultar a agenda. Tente novamente.",
      );
      throw ((e.code = o?.error?.code || "UNAVAILABLE"), e);
    }
    return o.data;
  }
  window.AlanaAgendaAPI = { call: i };
})();
