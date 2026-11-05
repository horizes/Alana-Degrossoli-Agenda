(function () {
  "use strict";
  const a = (e) => document.getElementById(e),
    C = new URLSearchParams(location.search).get("agenda"),
    x = {
      call: (e, i = {}) =>
        window.AlanaAgendaAPI.call(e, {
          ...i,
          ...(C !== null ? { calendarId: C } : {}),
        }),
    },
    s = a("agenda-form"),
    O = "alana-agenda-attempt-v1" + (C !== null ? ":" + C : "");
  let c = null,
    f = "online",
    h = "",
    l = "",
    m = 0,
    o = null,
    d = null,
    A = !1,
    y = null,
    w = !1;
  const R = (e) =>
    new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "full",
      timeZone: "America/Sao_Paulo",
    }).format(new Date(e + "T12:00:00-03:00"));
  function p(e) {
    ((a("agenda-notice").textContent = e), (a("agenda-notice").hidden = !e));
  }
  function E(e) {
    d = e;
    try {
      e
        ? sessionStorage.setItem(O, JSON.stringify(e))
        : sessionStorage.removeItem(O);
    } catch {}
  }
  function F() {
    try {
      const e = JSON.parse(sessionStorage.getItem(O) || "null");
      return e && typeof e.attempt == "string" && typeof e.proof == "string"
        ? e
        : null;
    } catch {
      return null;
    }
  }
  function v(e) {
    ((A = e),
      (a("agenda-inputs").disabled = e || !!d?.payload),
      (a("agenda-confirm").disabled = e || !!d?.payload || !l),
      (a("agenda-retry").disabled = e));
  }
  function M() {
    return (c?.slots || []).filter((e) => e.modes.includes(f));
  }
  function D() {
    return [...new Set(M().map((e) => e.date))];
  }
  function I(e) {
    ((h = e), (l = ""), N());
  }
  function N() {
    const e = M(),
      i = D();
    for (const t of s.querySelectorAll("input[name=mode]"))
      ((t.disabled = !c.slots.some((r) => r.modes.includes(t.value))),
        (t.checked = t.value === f));
    ((s.elements.address.required = f === "presencial"),
      (a("agenda-address-optional").textContent =
        f === "presencial"
          ? "(para a consulta presencial)"
          : "(opcional para consulta online)"),
      i.includes(h) || ((h = i[0] || ""), (l = ""), (m = 0)),
      e.some((t) => t.id === l && t.date === h) || (l = ""),
      (m = Math.max(0, Math.min(m, Math.max(0, Math.ceil(i.length / 3) - 1)))),
      a("agenda-dates").replaceChildren());
    for (const t of i.slice(m * 3, m * 3 + 3)) {
      const r = new Date(t + "T12:00:00-03:00"),
        u = document.createElement("button");
      ((u.type = "button"),
        (u.className = "agenda-date-chip"),
        u.setAttribute("aria-pressed", String(t === h)),
        u.setAttribute("aria-label", R(t)));
      for (const [b, S] of [
        ["strong", t.slice(8)],
        [
          "span",
          new Intl.DateTimeFormat("pt-BR", {
            month: "short",
            timeZone: "America/Sao_Paulo",
          })
            .format(r)
            .replace(".", ""),
        ],
        [
          "small",
          new Intl.DateTimeFormat("pt-BR", {
            weekday: "short",
            timeZone: "America/Sao_Paulo",
          }).format(r),
        ],
      ]) {
        const B = document.createElement(b);
        ((B.textContent = S), u.append(B));
      }
      (u.addEventListener("click", () => I(t)), a("agenda-dates").append(u));
    }
    ((a("agenda-dates-prev").disabled = m === 0),
      (a("agenda-dates-next").disabled = (m + 1) * 3 >= i.length),
      a("agenda-hours").replaceChildren());
    for (const t of e.filter((r) => r.date === h)) {
      const r = document.createElement("button");
      ((r.type = "button"),
        (r.className = "agenda-hour-chip"),
        (r.textContent = t.time),
        r.setAttribute("aria-label", `${t.time}, ${t.duration} minutos`),
        r.setAttribute("aria-pressed", String(t.id === l)),
        r.addEventListener("click", () => {
          ((l = t.id),
            N(),
            a("agenda-hours").querySelector("[aria-pressed=true]")?.focus());
        }),
        a("agenda-hours").append(r));
    }
    if (!e.length) {
      const t = document.createElement("p");
      ((t.className = "agenda-hint"),
        (t.textContent =
          "Não há horários livres para este formato. Escolha outro formato ou fale com a equipe."),
        a("agenda-hours").append(t));
    }
    const n = e.find((t) => t.id === l);
    ((a("agenda-selection").textContent = n
      ? `${f === "online" ? "Consulta online" : "Consulta presencial"} · ${n.duration} minutos · ${n.time} (Brasília)${f === "presencial" ? " · " + (n.time < "12:00" ? "Manhã reservada" : "Tarde reservada") : ""}`
      : "Selecione uma data e um horário."),
      v(A));
  }
  async function L() {
    ((c = await x.call("agendaInfo")),
      (a("agenda-host-name").textContent = c.hostName),
      (a("agenda-profile-public").textContent =
        "Seu atendimento com " + c.hostName));
    const e = s.elements.subject.value;
    a("agenda-subject").replaceChildren();
    for (const [i, n] of Object.entries(c.subjects)) {
      const t = document.createElement("option");
      ((t.value = i), (t.textContent = n), a("agenda-subject").append(t));
    }
    if (
      (Object.hasOwn(c.subjects, e) && (s.elements.subject.value = e),
      !c.enabled || !c.slots.length)
    ) {
      ((s.hidden = !0),
        p(
          c.enabled
            ? "Os próximos horários serão disponibilizados em breve. Fale com a equipe para combinar sua consulta."
            : "Nossa agenda está fechada no momento. Fale com a equipe para combinar sua consulta.",
        ));
      return;
    }
    (c.slots.some((i) => i.modes.includes(f)) || (f = c.slots[0].modes[0]),
      (s.hidden = !1),
      p(""),
      N());
  }
  function g(e, i) {
    const n = document.createElement("div"),
      t = document.createElement("dt"),
      r = document.createElement("dd");
    ((t.textContent = e),
      (r.textContent = i),
      n.append(t, r),
      a("agenda-confirmation-details").append(n));
  }
  function T(e) {
    const i = a("agenda-confirmation").hidden;
    (clearTimeout(y),
      (o = e),
      (s.hidden = !0),
      p(""),
      (a("agenda-confirmation").hidden = !1),
      (a("agenda-protocol").textContent = "Protocolo: " + e.protocol));
    const n = e.status === "canceled",
      t = e.status === "completed";
    ((a("agenda-confirmation-eyebrow").textContent = n
      ? "AGENDAMENTO CANCELADO"
      : t
        ? "CONSULTA CONCLUÍDA"
        : "AGENDAMENTO CONFIRMADO"),
      (a("agenda-confirmation-title").textContent = n
        ? "Este agendamento foi cancelado"
        : t
          ? "Obrigada pela confiança!"
          : "Nos vemos em breve!"),
      a("agenda-confirmation-details").replaceChildren(),
      g("Data", R(e.date)),
      g("Horário", `${e.time} · horário de Brasília`),
      g("Formato", e.mode === "online" ? "Online" : "Presencial"),
      g("Duração", `${e.duration} minutos`),
      g("Objetivo", e.subject),
      g("Com quem", e.hostName),
      e.mode === "presencial" &&
        (g("Local", e.location),
        n || g("Período reservado", e.time < "12:00" ? "Manhã" : "Tarde")),
      (a("agenda-access-note").textContent = n
        ? "Você pode escolher outro horário para uma nova consulta."
        : t
          ? "A equipe registrou a conclusão da sua consulta."
          : e.mode === "online"
            ? e.onlineLink
              ? "O acesso à sua consulta está disponível no botão abaixo."
              : e.meetingStatus === "pending"
                ? "Seu horário está confirmado. O Google está preparando o link do Meet."
                : ["failed", "authorization_required"].includes(e.meetingStatus)
                  ? "Seu horário está confirmado. A equipe precisa conferir a criação do Meet; use o protocolo para falar com ela."
                  : "A equipe combinará o acesso à consulta pelo contato informado."
            : "Sua consulta será realizada no endereço indicado acima."));
    const r = a("agenda-email-note");
    r.hidden = n || t || !e.emailStatus || e.emailStatus === "not_requested";
    const u = {
      pending:
        "A confirmação será enviada para o e-mail informado. Confira também a pasta de spam.",
      sending: "A confirmação por e-mail está sendo processada.",
      accepted:
        "A confirmação por e-mail foi encaminhada. Confira sua caixa de entrada e a pasta de spam.",
      not_configured:
        "Seu horário está confirmado nesta página. Fale com a equipe para receber a confirmação por e-mail.",
      failed:
        "Seu horário está confirmado. O envio do e-mail precisa ser conferido pela equipe.",
      review:
        "Seu horário está confirmado. A equipe precisa conferir o envio do e-mail.",
    };
    ((r.textContent = u[e.emailStatus] || ""),
      e.emailStatus === "accepted" &&
        e.emailMeetStatus === "waiting_link" &&
        (r.textContent +=
          " O link do Meet chegará em outro e-mail assim que estiver disponível."),
      e.emailMeetStatus === "accepted" &&
        (r.textContent +=
          " O link do Meet também foi encaminhado por e-mail."));
    const b = a("agenda-map-link");
    ((b.hidden = !0),
      b.removeAttribute("href"),
      !n &&
        !t &&
        e.mode === "presencial" &&
        e.location?.trim() &&
        ((b.href =
          "https://www.google.com/maps/dir/?api=1&destination=" +
          encodeURIComponent(e.location)),
        (b.hidden = !1)));
    const S = a("agenda-meeting-link");
    ((S.hidden = !0),
      S.removeAttribute("href"),
      !n &&
        !t &&
        e.mode === "online" &&
        /^https:\/\//i.test(e.onlineLink || "") &&
        ((S.href = e.onlineLink), (S.hidden = !1)),
      (a("agenda-calendar").hidden = n || t),
      (a("agenda-google-calendar").hidden = n || t),
      E({ attempt: d.attempt, proof: d.proof }),
      (a("agenda-meet-refresh").hidden =
        n ||
        t ||
        e.mode !== "online" ||
        !["pending", "failed", "authorization_required"].includes(
          e.meetingStatus,
        )),
      i && a("agenda-confirmation").focus(),
      (e.meetingStatus === "pending" ||
        ["pending", "sending"].includes(e.emailStatus) ||
        ["pending", "sending"].includes(e.emailMeetStatus)) &&
        !n &&
        !t &&
        (y = setTimeout(P, 2e4)));
  }
  async function P() {
    if (w || !d || !o) return;
    const e = d.attempt,
      i = o.id;
    ((w = !0), (a("agenda-meet-refresh").disabled = !0));
    try {
      const n = await x.call("agendaRecover", { attempt: e, proof: d.proof });
      n.exists && d?.attempt === e && o?.id === i && T(n.booking);
    } catch {
      o?.id === i &&
        ((a("agenda-access-note").textContent =
          "Seu horário está confirmado. Não foi possível verificar o Meet agora; tente novamente."),
        clearTimeout(y));
    } finally {
      ((w = !1), (a("agenda-meet-refresh").disabled = !1));
    }
  }
  a("agenda-meet-refresh").addEventListener("click", P);
  function U(e) {
    ((a("agenda-error").textContent =
      e.message + " Use o botão abaixo para verificar a mesma tentativa."),
      (a("agenda-retry").hidden = !1),
      v(!1));
  }
  async function q() {
    if (!(A || !d?.payload)) {
      (v(!0), (a("agenda-error").textContent = ""));
      try {
        T(await x.call("agendaBook", d.payload));
      } catch (e) {
        if (
          ["VALIDATION", "CONFLICT", "RATE_LIMIT", "UNAUTHORIZED"].includes(
            e.code,
          )
        ) {
          (E(null),
            (a("agenda-retry").hidden = !0),
            (a("agenda-error").textContent = e.message),
            (l = ""));
          try {
            await L();
          } catch {
            (p(
              "Não foi possível atualizar os horários. Recarregue a página antes de continuar.",
            ),
              (s.hidden = !0));
          }
        } else U(e);
      } finally {
        v(!1);
      }
    }
  }
  async function j() {
    if (!(A || !d)) {
      (v(!0),
        (a("agenda-error").textContent = ""),
        p("Verificando seu agendamento…"));
      try {
        const e = await x.call("agendaRecover", {
          attempt: d.attempt,
          proof: d.proof,
        });
        if (e.exists) {
          T(e.booking);
          return;
        }
        (p(""), d.payload ? (v(!1), await q()) : (E(null), await L()));
      } catch (e) {
        (p(""),
          d.payload
            ? ((s.hidden = !1), U(e))
            : (p(
                "Não foi possível consultar seu agendamento. Tente novamente para verificar o protocolo.",
              ),
              (a("agenda-retry").hidden = !1),
              (s.hidden = !1),
              (a("agenda-inputs").disabled = !0),
              (a("agenda-confirm").disabled = !0)));
      } finally {
        (v(!1),
          !c &&
            !o &&
            ((a("agenda-inputs").disabled = !0),
            (a("agenda-confirm").disabled = !0)));
      }
    }
  }
  s.addEventListener("submit", (e) => {
    if ((e.preventDefault(), A || d?.payload)) return;
    if (!l) {
      a("agenda-error").textContent = "Escolha um horário disponível.";
      return;
    }
    if (!s.reportValidity()) return;
    const i = Object.fromEntries(new FormData(s));
    (delete i.mode, delete i.consent);
    const n = crypto.randomUUID(),
      t = crypto.randomUUID();
    (E({
      attempt: n,
      proof: t,
      payload: {
        ...i,
        mode: f,
        slotId: l,
        revision: c.revision,
        consent: !0,
        attempt: n,
        proof: t,
      },
    }),
      q());
  });
  for (const e of s.querySelectorAll("input[name=mode]"))
    e.addEventListener("change", () => {
      ((f = e.value), (h = ""), (l = ""), (m = 0), N());
    });
  (a("agenda-dates-prev").addEventListener("click", () => {
    (m--, I(D()[m * 3]));
  }),
    a("agenda-dates-next").addEventListener("click", () => {
      (m++, I(D()[m * 3]));
    }),
    a("agenda-retry").addEventListener("click", j),
    a("agenda-another").addEventListener("click", async () => {
      (clearTimeout(y),
        E(null),
        (o = null),
        (l = ""),
        (a("agenda-confirmation").hidden = !0),
        s.reset(),
        (a("agenda-error").textContent = ""),
        (a("agenda-retry").hidden = !0),
        p("Buscando os próximos horários…"));
      try {
        await L();
      } catch (e) {
        p(e.message);
      }
    }));
  function k(e) {
    return String(e || "")
      .replace(/\\/g, "\\\\")
      .replace(/\r\n|\r|\n/g, "\\n")
      .replace(/;/g, "\\;")
      .replace(/,/g, "\\,");
  }
  function V(e) {
    let i = "",
      n = "",
      t = 0;
    for (const r of e) {
      const u = new TextEncoder().encode(r).length;
      (t + u > 74 &&
        ((i +=
          n +
          `\r
`),
        (n = " "),
        (t = 1)),
        (n += r),
        (t += u));
    }
    return i + n;
  }
  if (
    (a("agenda-calendar").addEventListener("click", () => {
      if (o)
        try {
          const e = (r) =>
              new Date(r)
                .toISOString()
                .replace(/[-:]/g, "")
                .replace(/\.\d{3}/, ""),
            i = [
              "BEGIN:VCALENDAR",
              "VERSION:2.0",
              "PRODID:-//Alana//Agenda//PT-BR",
              "CALSCALE:GREGORIAN",
              "BEGIN:VEVENT",
              "UID:" + o.id + "@alana-agenda",
              "DTSTAMP:" + e(Date.now()),
              "DTSTART:" + e(o.startAt),
              "DTEND:" + e(o.endAt),
              "SUMMARY:" + k("Consulta com " + o.hostName),
              "DESCRIPTION:" +
                k(
                  o.subject +
                    `
Protocolo: ` +
                    o.protocol +
                    (o.onlineLink
                      ? `
Acesso: ` + o.onlineLink
                      : ""),
                ),
              "LOCATION:" +
                k(o.mode === "online" ? o.onlineLink || "Online" : o.location),
              "STATUS:CONFIRMED",
              "END:VEVENT",
              "END:VCALENDAR",
            ],
            n = URL.createObjectURL(
              new Blob(
                [
                  i.map(V).join(`\r
`) +
                    `\r
`,
                ],
                { type: "text/calendar;charset=utf-8" },
              ),
            ),
            t = document.createElement("a");
          ((t.href = n),
            (t.download = "Alana-" + o.protocol + ".ics"),
            t.click(),
            setTimeout(() => URL.revokeObjectURL(n), 3e4));
        } catch {
          a("agenda-calendar-error").textContent =
            "Não foi possível gerar o arquivo de calendário. Os detalhes da consulta estão acima.";
        }
    }),
    a("agenda-google-calendar").addEventListener("click", () => {
      if (!o) return;
      const e = (n) =>
          new Date(n)
            .toISOString()
            .replace(/[-:]/g, "")
            .replace(/\.\d{3}/, ""),
        i = new URL("https://calendar.google.com/calendar/render");
      ((i.search = new URLSearchParams({
        action: "TEMPLATE",
        text: "Alana · " + o.contact.name + " · " + o.contact.company,
        dates: e(o.startAt) + "/" + e(o.endAt),
        details:
          "Paciente: " +
          o.contact.name +
          `
Tipo de consulta: ` +
          o.contact.company +
          `
Responsável: ` +
          o.hostName +
          `
` +
          o.subject +
          `
Protocolo: ` +
          o.protocol +
          (o.onlineLink
            ? `
Acesso: ` + o.onlineLink
            : ""),
        location: o.mode === "online" ? o.onlineLink || "Online" : o.location,
        ctz: "America/Sao_Paulo",
      }).toString()),
        window.open(i.href, "_blank", "noopener,noreferrer"));
    }),
    window.addEventListener("pagehide", () => clearTimeout(y)),
    (d = F()),
    d)
  ) {
    if (d.payload)
      for (const [e, i] of Object.entries(d.payload)) {
        const n = s.elements[e];
        n && typeof i == "string" && (n.value = i);
      }
    j();
  } else L().catch((e) => p(e.message));
})();
