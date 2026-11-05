(function () {
  "use strict";
  let j = null;
  const le = `<div class="alana-agenda agenda-admin-native"><header class="agenda-native-header"><h1>Agenda</h1><p class="mod-sub">Organize os horários de atendimento e acompanhe as consultas online e presenciais.</p></header><section id="agenda-section"><div id="agenda-profile-bar" class="agenda-profile-bar" hidden><label>Agenda do perfil<select id="agenda-profile-select" aria-describedby="agenda-profile-note"></select></label><p id="agenda-profile-note" class="agenda-hint" role="status"></p></div><div class="agenda-toolbar"><div class="agenda-toolbar-state"><span id="agenda-open-dot" class="agenda-open-dot"></span><strong id="agenda-open-label">Carregando agenda…</strong><button id="agenda-toggle-open" class="text-button" type="button" disabled>Pausar</button></div><div class="agenda-toolbar-actions"><a id="agenda-open-public" class="button secondary" href="agenda.html" target="_blank" rel="noopener">Abrir agenda pública</a><button id="agenda-copy-link" class="button secondary" type="button">Copiar link público</button></div></div><input id="agenda-public-url" type="url" readonly hidden aria-label="Link público da agenda"><p id="agenda-admin-status" class="agenda-feedback" role="status"></p><p id="agenda-admin-error" class="error" role="alert"></p><div data-categorias-nav></div><section data-categoria-painel="calendario"><div class="agenda-workspace">
  <section class="admin-section agenda-calendar-card"><div class="agenda-month-heading"><div><p class="page-eyebrow">SEU CALENDÁRIO</p><h2 id="agenda-month-title">Agenda</h2></div><div class="agenda-date-nav"><button id="agenda-month-prev" class="agenda-nav-button" type="button" aria-label="Mês anterior"><span data-alana-icon="chevron-left"></span></button><button id="agenda-today" class="text-button" type="button">Hoje</button><button id="agenda-month-next" class="agenda-nav-button" type="button" aria-label="Próximo mês"><span data-alana-icon="chevron-right"></span></button></div></div><p class="agenda-calendar-hint">Clique em um dia para organizar os horários e ver as consultas.</p><div class="agenda-month-weekdays" aria-hidden="true"><span>DOM</span><span>SEG</span><span>TER</span><span>QUA</span><span>QUI</span><span>SEX</span><span>SÁB</span></div><div id="agenda-month-grid" class="agenda-month-grid" role="group" aria-label="Dias do mês"></div><div class="agenda-calendar-legend"><span><i class="agenda-legend-free"></i>Horários livres</span><span><i class="agenda-legend-booked"></i>Consultas</span><span><i class="agenda-legend-blocked"></i>Dia fechado</span></div></section>
  <section class="admin-section agenda-day-card"><div class="agenda-day-heading"><div><p class="page-eyebrow">DIA SELECIONADO</p><h2 id="agenda-selected-day">—</h2></div><button id="agenda-refresh" class="text-button" type="button" aria-label="Atualizar agenda">Atualizar</button></div><div class="agenda-day-counts"><span><strong id="agenda-day-free">0</strong> livres</span><span><strong id="agenda-day-reserved">0</strong> consultas</span><span><strong id="agenda-day-holds">0</strong> reservas internas</span></div><div id="agenda-admin-slots" class="agenda-day-slots"></div><div id="agenda-internal-holds" class="agenda-internal-holds"></div><div class="agenda-day-actions"><button id="agenda-reserve-day-time" class="button secondary" type="button">Reservar um intervalo</button><button id="agenda-add-day" class="button secondary" type="button">Abrir horários extras neste dia</button><button id="agenda-block-day" class="text-button" type="button">Reservar o dia inteiro</button></div><p id="agenda-day-note" class="agenda-hint"></p></section>
 </div>
 <section class="admin-section agenda-day-meetings"><div class="admin-title"><div><p class="page-eyebrow">CONSULTAS DO DIA</p><h2 id="agenda-bookings-title">Agendamentos</h2></div><span id="agenda-page" class="scope-chip">Página 1</span></div><div id="agenda-bookings" class="agenda-bookings"></div><div class="pager"><button id="agenda-prev" class="button secondary" type="button" disabled>Anterior</button><button id="agenda-next" class="button secondary" type="button" disabled>Próxima</button></div></section>
</section><section data-categoria-painel="disponibilidade" hidden><section class="admin-section agenda-weekly-summary"><div><p class="page-eyebrow">ROTINA SEMANAL · SEM DATA FINAL</p><h2>Seus horários de sempre</h2><p id="agenda-weekly-duration-note" class="agenda-hint"></p><p id="agenda-weekly-summary-note">Defina seus dias e horários uma vez.</p></div><div id="agenda-weekly-summary-days" class="agenda-weekly-summary-days"></div></section><div class="agenda-toolbar-actions"><button id="agenda-open-publish" class="button primary" type="button">Definir rotina semanal</button></div></section><section data-categoria-painel="configuracoes" hidden><section class="admin-section"><h2>Configurações de atendimento</h2><p class="agenda-hint">Ajuste quem atende, a duração, a antecedência, o local e a conexão com o Google Agenda.</p><button id="agenda-open-settings" class="button secondary" type="button">Configurações</button></section></section>
 
 

 <dialog id="agenda-publish-dialog" class="agenda-dialog agenda-weekly-dialog"><div class="agenda-dialog-heading"><div><p class="page-eyebrow">TODA SEMANA · SEM DATA FINAL</p><h2>Sua rotina de atendimento</h2></div><button class="agenda-dialog-close" type="button" data-close-dialog="agenda-publish-dialog" aria-label="Fechar rotina semanal"><span data-alana-icon="close"></span></button></div>
 <form id="agenda-slots-form" class="agenda-config-form"><p class="agenda-hint">Ative os dias em que você atende e defina as faixas de horário. Essa rotina continua valendo até você alterá-la.</p><div class="agenda-fields"><label>Intervalo entre consultas<select id="agenda-gap"><option value="0">Sem intervalo</option><option value="5">5 minutos</option><option value="10">10 minutos</option><option value="15">15 minutos</option><option value="30">30 minutos</option></select></label><label>Duração de cada consulta<select id="agenda-publish-duration" required><option value="15">15 minutos</option><option value="30">30 minutos</option><option value="45">45 minutos</option><option value="60">1 hora</option><option value="90">1 hora e 30 minutos</option></select></label></div><p class="agenda-hint">A duração vale para a rotina semanal. Consultas já confirmadas e horários extras existentes mantêm a duração original.</p><fieldset class="agenda-plain-fieldset"><legend>Formatos oferecidos na semana</legend><div class="agenda-format-checks"><label><input type="checkbox" name="mode" value="online" checked>Online</label><label><input type="checkbox" name="mode" value="presencial" checked>Presencial</label></div></fieldset>
 <button id="agenda-copy-weekdays" class="text-button" type="button">Copiar as faixas de segunda para terça a sexta</button><div id="agenda-weekly-days" class="agenda-weekly-days"></div><div class="agenda-window-preview"><strong id="agenda-window-count">Configure a rotina semanal</strong><p>Reservas internas, dias fechados, horários extras e consultas já confirmadas serão respeitados. Todos os horários são de Brasília.</p></div><p id="agenda-publish-error" class="error" role="alert"></p><button class="button primary" type="submit">Salvar rotina semanal</button><button id="agenda-weekly-reload" class="text-button" type="button">Descartar alterações da rotina</button><p id="agenda-slots-status" class="agenda-hint" role="status"></p></form>
</dialog>
<dialog id="agenda-extra-dialog" class="agenda-dialog"><div class="agenda-dialog-heading"><div><p class="page-eyebrow">SÓ NESTA DATA</p><h2>Abrir horários extras</h2></div><button class="agenda-dialog-close" type="button" data-close-dialog="agenda-extra-dialog" aria-label="Fechar horários extras"><span data-alana-icon="close"></span></button></div><form id="agenda-extra-form" class="agenda-config-form"><label>Data<input id="agenda-extra-date" type="date" required></label><div class="agenda-fields"><label>Das<input id="agenda-extra-from" type="time" value="14:00" required></label><label>Até<input id="agenda-extra-until" type="time" value="16:00" required></label></div><label>Intervalo entre consultas<select id="agenda-extra-gap"><option value="0">Sem intervalo</option><option value="5">5 minutos</option><option value="10">10 minutos</option><option value="15">15 minutos</option><option value="30">30 minutos</option></select></label><fieldset class="agenda-plain-fieldset"><legend>Formato</legend><div class="agenda-format-checks"><label><input type="checkbox" name="mode" value="online" checked>Online</label><label><input type="checkbox" name="mode" value="presencial" checked>Presencial</label></div></fieldset><p class="agenda-hint">Esses horários valem somente para esta data. Uma faixa extra pode substituir horários livres da rotina, preservando as consultas confirmadas.</p><p id="agenda-extra-error" class="error" role="alert"></p><button class="button primary" type="submit">Abrir horários nesta data</button></form></dialog>
<dialog id="agenda-hold-dialog" class="agenda-dialog"><div class="agenda-dialog-heading"><div><p class="page-eyebrow">RESERVA DA EQUIPE</p><h2>Reservar um intervalo</h2></div><button class="agenda-dialog-close" type="button" data-close-dialog="agenda-hold-dialog" aria-label="Fechar reserva interna"><span data-alana-icon="close"></span></button></div><form id="agenda-hold-form" class="agenda-config-form"><label>Data<input id="agenda-hold-date" type="date" required></label><div class="agenda-fields"><label>Das<input id="agenda-hold-from" type="time" value="09:00" required></label><label>Até<input id="agenda-hold-until" type="time" value="10:00" required></label></div><label>Motivo <span class="field-optional">(opcional, visível apenas no painel)</span><input id="agenda-hold-reason" maxlength="200" placeholder="Ex.: compromisso da equipe"></label><p class="agenda-hint">O intervalo ficará indisponível para novas consultas online e presenciais. Essa reserva interna não gera uma consulta Meet.</p><p id="agenda-hold-error" class="error" role="alert"></p><button class="button primary" type="submit">Reservar intervalo</button></form></dialog>
 <dialog id="agenda-settings-dialog" class="agenda-dialog"><div class="agenda-dialog-heading"><div><p class="page-eyebrow">CONFIGURAÇÕES</p><h2>Do seu jeito</h2></div><button class="agenda-dialog-close" type="button" data-close-dialog="agenda-settings-dialog" aria-label="Fechar configurações"><span data-alana-icon="close"></span></button></div>
 <form id="agenda-settings-form" class="agenda-config-form"><label class="agenda-toggle"><input id="agenda-enabled" type="checkbox"><span>Receber novos agendamentos</span></label><label>Quem atende<input id="agenda-host" maxlength="100" required></label><div class="agenda-fields"><label>Duração dos novos horários<select id="agenda-duration"><option value="15">15 minutos</option><option value="30">30 minutos</option><option value="45">45 minutos</option><option value="60">1 hora</option><option value="90">1 hora e 30 minutos</option></select></label><label>Antecedência mínima<select id="agenda-notice"><option value="0">Sem antecedência</option><option value="30">30 minutos</option><option value="60">1 hora</option><option value="120">2 horas</option><option value="240">4 horas</option><option value="1440">1 dia</option></select></label></div><label class="agenda-toggle"><input id="agenda-auto-meet" type="checkbox"><span>Criar Google Meet automaticamente para cada reserva online</span></label><label id="agenda-manual-link-label">Link online manual <span class="field-optional">(quando o Meet automático estiver desativado)</span><input id="agenda-online-link" type="url" maxlength="1000" placeholder="https://…"></label><label>Local das consultas presenciais <span class="field-optional">(opcional)</span><input id="agenda-location" maxlength="300" placeholder="Rua, número, bairro e cidade"></label><p class="agenda-hint">Sem local fixo, usamos o endereço informado pelo participante. As reservas existentes preservam seus detalhes.</p><button class="button primary" type="submit">Salvar configurações</button><button id="agenda-settings-reload" class="text-button" type="button">Descartar alterações</button><p id="agenda-settings-status" class="agenda-hint" role="status"></p><p id="agenda-settings-error" class="error" role="alert"></p></form>
 <div class="agenda-google-card"><div><p class="page-eyebrow">GOOGLE MEET</p><h3>Uma sala para cada conversa</h3><p id="agenda-google-status">Confira a conexão com o Google.</p></div><div class="agenda-google-actions"><button id="agenda-google-connect" class="button secondary" type="button">Conectar conta Google</button><button id="agenda-google-disconnect" class="text-button" type="button" hidden>Desconectar</button></div><p class="agenda-hint">A configuração técnica da integração é administrada pela equipe responsável pela plataforma.</p><p id="agenda-google-error" class="error" role="alert"></p></div>
 </dialog>
</section></div>`;
  function re(D) {
    const z = [],
      r = (a, o, d, t = !1) => {
        (a.addEventListener(o, d, t), z.push([a, o, d, t]));
      },
      e = (a) => D.querySelector("#" + a),
      x = (a, o = {}) =>
        window.AlanaAgendaAPI.call(a, {
          ...o,
          ...(T ? { calendarId: T } : {}),
        }),
      B = e("agenda-settings-form"),
      J = e("agenda-slots-form");
    let T = null,
      i = null,
      A = "",
      u = "",
      H = "",
      N = null,
      G = null,
      k = [],
      b = !1,
      p = !1,
      h = !1,
      C = 0,
      U = null;
    const V = (a) =>
        new Intl.DateTimeFormat("pt-BR", {
          day: "numeric",
          month: "long",
          timeZone: "America/Sao_Paulo",
        }).format(new Date(a + "T12:00:00-03:00")),
      ge = (a) =>
        a.map((o) => (o === "online" ? "Online" : "Presencial")).join(" ou "),
      ue = {
        confirmed: "Confirmado",
        canceled: "Cancelado",
        completed: "Concluído",
      },
      pe = {
        ready: "Meet criado",
        pending: "Preparando Meet",
        authorization_required: "Reconecte o Google",
        failed: "Confira a criação do Meet",
        cancel_pending: "Cancelamento no Google pendente",
        canceled: "Evento Google cancelado",
      };
    function M(a) {
      e("agenda-admin-error").textContent = a;
    }
    function q(a) {
      ((p = a), (e("agenda-profile-select").disabled = a || b));
      for (const o of [B, J, e("agenda-extra-form"), e("agenda-hold-form")])
        for (const d of o.elements) d.disabled = a;
      for (const o of [
        "agenda-refresh",
        "agenda-toggle-open",
        "agenda-google-connect",
        "agenda-google-disconnect",
        "agenda-block-day",
        "agenda-open-publish",
        "agenda-add-day",
        "agenda-reserve-day-time",
      ])
        e(o).disabled = a || !i;
      (i && (e("agenda-auto-meet").disabled = a || !i.google.connected),
        a || S.dayStates(),
        (e("agenda-prev").disabled = a || !k.length),
        (e("agenda-next").disabled = a || !G));
    }
    const S = new window.AlanaWeeklyEditor({
      root: D,
      listen: r,
      call: x,
      mutate: _,
      reload: () => w(!0),
      focusDate(a) {
        ((u = a), (A = a.slice(0, 7)), (N = null), (k = []));
      },
    });
    function me() {
      const a = i.settings;
      ((H = a.revision), (h = !1));
      for (const [o, d] of [
        ["agenda-host", "hostName"],
        ["agenda-duration", "duration"],
        ["agenda-notice", "noticeMinutes"],
        ["agenda-online-link", "onlineLink"],
        ["agenda-location", "presentialLocation"],
      ])
        e(o).value = a[d];
      ((e("agenda-enabled").checked = a.enabled),
        (e("agenda-auto-meet").checked = a.autoMeet),
        (e("agenda-auto-meet").disabled = !i.google.connected),
        (e("agenda-settings-status").textContent = "Configurações salvas."),
        K());
    }
    function K() {
      e("agenda-manual-link-label").hidden = e("agenda-auto-meet").checked;
    }
    function be() {
      const a = i.calendars || [],
        o = e("agenda-profile-select");
      ((e("agenda-profile-bar").hidden = !a.length), o.replaceChildren());
      for (const t of a) {
        const g = document.createElement("option");
        ((g.value = t.id),
          (g.textContent =
            t.name +
            (t.isOwn ? " · Minha agenda" : "") +
            (t.active ? "" : " · Inativo")),
          o.append(g));
      }
      ((o.value = i.calendarId || ""), (o.disabled = p || b));
      const d = a.find((t) => t.id === i.calendarId);
      ((e("agenda-profile-note").textContent = d?.isOwn
        ? "Seus horários, consultas e link público."
        : d
          ? "Você está gerenciando a agenda de " +
            d.name +
            ". A conta Google é conectada pelo próprio perfil."
          : ""),
        (e("agenda-open-public").href = i.publicUrl));
    }
    function W() {
      const a = i.google,
        o = i.canConfigureGoogle ?? !1,
        d = i.canConfigureClient ?? !1;
      ((D.querySelector(".agenda-google-card").hidden = !1),
        (e("agenda-google-status").textContent = a.connected
          ? "Conectado: " +
            a.email +
            ". Cada nova reserva online recebe um Meet exclusivo."
          : a.email
            ? "Reconecte " + a.email + " para continuar criando as consultas."
            : a.configured
              ? "Credencial pronta. Conecte a conta Google deste perfil."
              : "A credencial Google precisa ser configurada por um administrador."),
        !o &&
          i.calendarId &&
          (e("agenda-google-status").textContent +=
            " Somente o dono do perfil pode conectar ou desconectar esta conta."),
        (e("agenda-google-connect").hidden = !o),
        (e("agenda-google-connect").textContent = a.email
          ? "Reconectar minha conta Google"
          : "Conectar minha conta Google"),
        (e("agenda-google-connect").disabled = p || !a.configured),
        (e("agenda-google-disconnect").hidden = !o || !a.email));
    }
    function P(a, o, d = "secondary") {
      const t = document.createElement("button");
      return (
        (t.type = "button"),
        (t.className = "button " + d),
        (t.textContent = a),
        r(t, "click", () => _(o)),
        t
      );
    }
    async function _(a, o = null) {
      if (p || b) return;
      const d = C;
      (q(!0),
        M(""),
        (e("agenda-admin-status").textContent = ""),
        o && (e(o).textContent = ""));
      try {
        if ((await a(), d !== C)) return;
        await w(!0);
      } catch (t) {
        d === C && (M(t.message), o && (e(o).textContent = t.message));
      } finally {
        d === C && (q(!1), i && W());
      }
    }
    function fe() {
      const a = new Date(A + "-01T12:00:00Z"),
        o = new Intl.DateTimeFormat("pt-BR", {
          month: "long",
          year: "numeric",
          timeZone: "UTC",
        }).format(a);
      e("agenda-month-title").textContent =
        o.charAt(0).toUpperCase() + o.slice(1);
      const d = a.getUTCDay(),
        t = new Date(
          Date.UTC(a.getUTCFullYear(), a.getUTCMonth() + 1, 0),
        ).getUTCDate(),
        g = e("agenda-month-grid");
      g.replaceChildren();
      for (let y = 0; y < d; y++) {
        const n = document.createElement("span");
        ((n.className = "agenda-day-empty"), g.append(n));
      }
      for (let y = 1; y <= t; y++) {
        const n = A + "-" + String(y).padStart(2, "0"),
          s = i.calendar.days[n] || { free: 0, bookings: 0, blocked: !1 },
          l = document.createElement("button");
        ((l.type = "button"),
          (l.className = "agenda-calendar-day"),
          (l.dataset.date = n),
          l.classList.toggle("is-today", n === i.today),
          l.classList.toggle("is-blocked", s.blocked),
          l.setAttribute("aria-pressed", String(n === u)),
          l.setAttribute(
            "aria-label",
            `${V(n)}, ${s.free} horários livres, ${s.bookings} consultas, ${s.holds || 0} reservas internas, ${s.google || 0} compromissos Google${s.blocked ? ", dia fechado" : ""}`,
          ));
        const m = document.createElement("strong");
        ((m.textContent = String(y)), l.append(m));
        const f = document.createElement("span");
        if (((f.className = "agenda-day-badges"), s.free)) {
          const c = document.createElement("small");
          ((c.className = "agenda-free-badge"),
            (c.textContent = s.free + " livres"),
            f.append(c));
        }
        if (s.bookings) {
          const c = document.createElement("small");
          ((c.className = "agenda-booked-badge"),
            (c.textContent =
              s.bookings + (s.bookings === 1 ? " consulta" : " consultas")),
            f.append(c));
        }
        if (s.holds) {
          const c = document.createElement("small");
          ((c.className = "agenda-booked-badge"),
            (c.textContent = s.holds + " reserva(s)"),
            f.append(c));
        }
        if (s.google) {
          const c = document.createElement("small");
          ((c.className = "agenda-google-badge"),
            (c.textContent = s.google + " Google"),
            f.append(c));
        }
        if (s.blocked) {
          const c = document.createElement("small");
          ((c.className = "agenda-blocked-badge"),
            (c.textContent = "Fechado"),
            f.append(c));
        }
        (l.append(f), r(l, "click", () => ee(n)), g.append(l));
      }
    }
    function ve() {
      const a = i.calendar.days[u] || { free: 0, bookings: 0, blocked: !1 };
      ((e("agenda-selected-day").textContent = V(u)),
        (e("agenda-day-free").textContent = a.free),
        (e("agenda-day-reserved").textContent = a.bookings),
        (e("agenda-day-holds").textContent = a.holds || 0),
        (e("agenda-bookings-title").textContent = "Conversas de " + V(u)),
        e("agenda-admin-slots").replaceChildren());
      const o = i.slots.filter((t) => t.date === u);
      for (const t of o) {
        const g = document.createElement("div");
        g.className = "agenda-slot-row";
        const y = document.createElement("div"),
          n = document.createElement("strong"),
          s = document.createElement("small");
        ((n.textContent = t.time),
          (s.textContent =
            t.duration +
            " min · " +
            ge(t.availableModes?.length ? t.availableModes : t.modes) +
            (t.source === "weekly" ? " · Semanal" : " · Extra")),
          y.append(n, s),
          g.append(y));
        const l = document.createElement("span");
        if (
          ((l.className = "agenda-booking-status"),
          (l.textContent = t.bookingId
            ? "Reservado"
            : a.blocked
              ? "Dia reservado"
              : t.held
                ? "Reserva interna"
                : t.periodReserved
                  ? "Período reservado"
                  : t.available === !1
                    ? "Indisponível"
                    : "Livre"),
          g.append(l),
          !t.bookingId && !t.periodReserved && !t.held && !a.blocked)
        )
          if (t.source === "weekly") {
            const m = document.createElement("button");
            ((m.type = "button"),
              (m.className = "agenda-slot-reserve"),
              (m.textContent = "Reservar"),
              m.setAttribute("aria-label", "Reservar horário " + t.time),
              m.addEventListener("click", () => {
                !p && !b && S.openHold(u, t);
              }),
              g.append(m));
          } else {
            const m = P("", () =>
              x("removeAgendaSlot", { id: t.id, revision: t.revision }),
            );
            ((m.className = "agenda-slot-remove"),
              window.AlanaIcons.content(m, "", "trash"),
              m.setAttribute("aria-label", "Remover horário extra " + t.time),
              g.append(m));
          }
        e("agenda-admin-slots").append(g);
      }
      if (!o.length) {
        const t = document.createElement("p");
        ((t.className = "agenda-day-empty-state"),
          (t.textContent = "Você ainda não publicou horários para este dia."),
          e("agenda-admin-slots").append(t));
      }
      e("agenda-internal-holds").replaceChildren();
      for (const t of i.holds.filter(
        (g) => g.date === u && g.source !== "google",
      )) {
        const g = document.createElement("div");
        g.className = "agenda-internal-hold";
        const y = document.createElement("div"),
          n = document.createElement("strong"),
          s = document.createElement("small");
        ((n.textContent = t.from + "–" + t.until + " · Reserva interna"),
          (s.textContent = t.reason || "Uso da equipe"),
          y.append(n, s),
          g.append(
            y,
            P("Liberar", () =>
              x("releaseAgendaInterval", {
                id: t.id,
                date: t.date,
                holdRevision: t.revision,
              }),
            ),
          ),
          e("agenda-internal-holds").append(g));
      }
      const d = u >= i.today && u <= i.adminMaxDate;
      ((e("agenda-add-day").hidden = !d),
        (e("agenda-reserve-day-time").hidden = !d),
        (e("agenda-block-day").hidden = !d),
        (e("agenda-block-day").textContent = a.blocked
          ? "Liberar o dia inteiro"
          : "Reservar o dia inteiro"),
        (e("agenda-day-note").textContent = a.blocked
          ? "Este dia não recebe novas reservas. As consultas já confirmadas permanecem agendadas."
          : "A reserva ocupa o horário nos dois formatos. Todos os horários são de Brasília."));
    }
    const Z = {
        not_requested: "Anterior à confirmação automática",
        not_needed: "Incluído na confirmação",
        waiting_link: "Aguardando o Meet",
        pending: "Na fila de envio",
        sending: "Envio em processamento",
        accepted: "Envio aceito pelo servidor",
        not_configured: "Envio de e-mails desativado",
        failed: "Falha no envio",
        review: "Conferir envio",
        skipped: "Envio encerrado",
      },
      $ = new Map();
    async function he(a) {
      let o = $.get(a.id);
      (o || ((o = crypto.randomUUID()), $.set(a.id, o)),
        await x("resendAgendaConfirmation", { id: a.id, attempt: o }),
        $.delete(a.id),
        (e("agenda-admin-status").textContent =
          "Confirmação por e-mail colocada na fila."));
    }
    function ye() {
      const a = e("agenda-bookings");
      a.replaceChildren();
      const o = (i.googleEvents || []).filter(
        (n) =>
          new Date(n.start_at) < new Date(u + "T23:59:59-03:00") &&
          new Date(n.end_at) > new Date(u + "T00:00:00-03:00"),
      );
      function d(n, s, l, m) {
        const f = document.createElement("section");
        ((f.className = "agenda-origin-group"),
          (f.dataset.origin = s),
          f.setAttribute("aria-label", n));
        const c = document.createElement("div"),
          E = document.createElement("h3"),
          O = document.createElement("span"),
          R = document.createElement("p"),
          I = document.createElement("div");
        return (
          (c.className = "agenda-origin-heading"),
          (E.textContent = n),
          (O.className = "agenda-origin-count"),
          (O.textContent = String(l)),
          c.append(E, O),
          (R.className = "agenda-origin-note"),
          (R.textContent = m),
          (I.className = "agenda-origin-items"),
          f.append(c, R, I),
          a.append(f),
          I
        );
      }
      const t = d(
          "Agendamentos pelo site",
          "site",
          i.bookings.length,
          "Reservas recebidas pela agenda Alana. Gerencie contato, confirmação e cancelamento aqui.",
        ),
        g = d(
          "Compromissos do Google Agenda",
          "google",
          o.length,
          "Importados da conta Google conectada. Ocupam o horário; alterações são feitas no Google.",
        );
      function y(n, s) {
        const l = document.createElement("p");
        ((l.className = "agenda-origin-badge"),
          (l.textContent = s),
          n.append(l));
      }
      for (const n of o) {
        const s = document.createElement("article");
        ((s.className = "agenda-booking"), y(s, "Google Agenda"));
        const l = document.createElement("h4"),
          m = document.createElement("p"),
          f = document.createElement("p");
        l.textContent = n.summary || "Compromisso Google";
        const c = (E) =>
          new Date(E).toLocaleString("pt-BR", {
            timeZone: "America/Sao_Paulo",
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          });
        if (
          ((m.textContent = c(n.start_at) + " — " + c(n.end_at)),
          (f.textContent =
            "Google Agenda · Horário ocupado. Edite este compromisso no Google."),
          (f.className = "agenda-hint"),
          s.append(l, m, f),
          n.location)
        ) {
          const E = document.createElement("p");
          ((E.textContent = n.location), s.append(E));
        }
        g.append(s);
      }
      for (const n of i.bookings) {
        const s = document.createElement("article");
        ((s.className = "agenda-booking"), y(s, "Agenda Alana"));
        const l = document.createElement("div");
        l.className = "agenda-booking-heading";
        const m = document.createElement("div"),
          f = document.createElement("strong"),
          c = document.createElement("h4"),
          E = document.createElement("span");
        ((f.textContent =
          n.time +
          " · " +
          (n.mode === "online" ? "Online" : "Presencial") +
          " · " +
          n.duration +
          " min"),
          (c.textContent = n.contact.name),
          m.append(f, c),
          (E.className = "agenda-booking-status"),
          (E.dataset.status = n.status),
          (E.textContent = ue[n.status] || n.status),
          l.append(m, E),
          s.append(l));
        const O = document.createElement("p");
        if (
          ((O.className = "agenda-booking-subtitle"),
          (O.textContent = n.contact.company + " · " + n.subject),
          s.append(O),
          n.meetingStatus !== "manual")
        ) {
          const v = document.createElement("p");
          ((v.className = "agenda-meet-state"),
            (v.dataset.state = n.meetingStatus),
            (v.textContent = pe[n.meetingStatus] || "Google Meet"),
            s.append(v));
        }
        const R = document.createElement("p");
        ((R.className = "agenda-mail-state"),
          (R.textContent =
            "Confirmação por e-mail: " + (Z[n.emailStatus] || Z.not_requested)),
          n.emailMeetStatus &&
            !["not_requested", "not_needed"].includes(n.emailMeetStatus) &&
            (R.textContent +=
              " · Link do Meet: " +
              (Z[n.emailMeetStatus] || n.emailMeetStatus)),
          s.append(R));
        const I = document.createElement("details"),
          te = document.createElement("summary"),
          Q = document.createElement("dl");
        ((I.className = "agenda-contact-details"),
          (te.textContent = "Contato e detalhes"),
          (Q.className = "agenda-booking-contact"));
        for (const [v, oe] of [
          ["WhatsApp", n.contact.whatsapp],
          ["E-mail", n.contact.email],
          ["Endereço", n.contact.address],
          ["Local", n.mode === "presencial" ? n.location : ""],
          ["Observações", n.contact.notes],
          ["Protocolo", n.protocol],
        ]) {
          if (!oe) continue;
          const ie = document.createElement("div"),
            se = document.createElement("dt"),
            de = document.createElement("dd");
          ((se.textContent = v),
            (de.textContent = oe),
            ie.append(se, de),
            Q.append(ie));
        }
        if ((I.append(te, Q), n.mode === "presencial" && n.location?.trim())) {
          const v = document.createElement("a");
          ((v.textContent = "Abrir rota no mapa / GPS"),
            (v.href =
              "https://www.google.com/maps/dir/?api=1&destination=" +
              encodeURIComponent(n.location)),
            (v.target = "_blank"),
            (v.rel = "noopener noreferrer"),
            (v.className = "button secondary"),
            I.append(v));
        }
        s.append(I);
        const L = document.createElement("div");
        L.className = "agenda-booking-actions";
        const F = document.createElement("a");
        ((F.className = "button secondary"), (F.textContent = "WhatsApp"));
        const X = n.contact.whatsapp.replace(/\D/g, "");
        if (
          ((F.href = "https://wa.me/" + (X.length <= 11 ? "55" + X : X)),
          (F.target = "_blank"),
          (F.rel = "noopener noreferrer"),
          L.append(F),
          n.status === "confirmed" &&
            n.mode === "online" &&
            /^https:\/\//.test(n.onlineLink || ""))
        ) {
          const v = document.createElement("a");
          ((v.className = "button primary"),
            (v.textContent =
              n.meetingStatus === "ready"
                ? "Entrar no Meet"
                : "Entrar na consulta"),
            (v.href = n.onlineLink),
            (v.target = "_blank"),
            (v.rel = "noopener noreferrer"),
            L.append(v));
        }
        (n.meetingStatus !== "manual" &&
          n.meetingStatus !== "canceled" &&
          L.append(
            P(
              n.meetingStatus === "ready"
                ? "Atualizar no Google Agenda"
                : "Verificar Google Meet",
              () => x("adminGoogleRetry", { id: n.id }),
            ),
          ),
          n.status === "confirmed" &&
            (L.append(
              P("Cancelar consulta", async () => {
                confirm(
                  "Cancelar a consulta de " +
                    n.contact.name +
                    "? O horário será liberado se o dia estiver aberto.",
                ) &&
                  (await x("changeAgendaBooking", {
                    id: n.id,
                    status: "canceled",
                  }));
              }),
            ),
            new Date(n.startAt) <= new Date(i.now || Date.now()) &&
              L.append(
                P("Concluir", () =>
                  x("changeAgendaBooking", { id: n.id, status: "completed" }),
                ),
              )),
          n.status === "confirmed" &&
            new Date(n.startAt) > new Date(i.now) &&
            i.emailConfigured &&
            L.append(P("Reenviar confirmação por e-mail", () => he(n))),
          s.append(L),
          t.append(s));
      }
      for (const [n, s] of [
        [t, "Nenhum agendamento pelo site nesta data."],
        [g, "Nenhum compromisso Google nesta data."],
      ])
        if (!n.children.length) {
          const l = document.createElement("p");
          ((l.className = "agenda-day-empty-state"),
            (l.textContent = s),
            n.append(l));
        }
      ((G = i.cursor),
        (e("agenda-page").textContent =
          "Agendamentos do site · Página " + (k.length + 1)),
        (e("agenda-prev").disabled = !k.length),
        (e("agenda-next").disabled = !G),
        (e("agenda-prev").hidden = !k.length && !G),
        (e("agenda-next").hidden = !k.length && !G));
    }
    function xe() {
      be();
      const a = i.settings.enabled;
      ((e("agenda-public-url").value = i.publicUrl),
        (e("agenda-open-label").textContent = a
          ? "Agenda aberta"
          : "Agenda pausada"),
        e("agenda-open-dot").classList.toggle("is-open", a),
        (e("agenda-toggle-open").textContent = a ? "Pausar" : "Ativar"),
        (e("agenda-toggle-open").disabled = p),
        fe(),
        ve(),
        ye(),
        W(),
        S.preview(),
        window.AlanaIcons.decorate(D));
    }
    async function w(a = !1) {
      if (b || (!a && i)) return;
      ((b = !0), (e("agenda-profile-select").disabled = !0));
      const o = C;
      (M(""), (e("agenda-refresh").disabled = !0));
      try {
        const d = { dayOnly: !0 };
        (A && (d.month = A),
          u && ((d.startDate = u), (d.endDate = u)),
          N && (d.cursor = N));
        const t = await x("adminAgenda", d);
        if (o !== C) return;
        ((i = t),
          i.syncWarning && M(i.syncWarning),
          (T = t.calendarId || null),
          (u ||= i.startDate),
          (A ||= i.calendar.month),
          h || me(),
          S.load(i),
          xe());
      } catch (d) {
        o === C && M(d.message);
      } finally {
        o === C &&
          ((b = !1),
          (e("agenda-profile-select").disabled = p),
          (e("agenda-refresh").disabled = p));
      }
    }
    function ee(a) {
      b ||
        p ||
        ((e("agenda-admin-status").textContent = ""),
        (u = a),
        (N = null),
        (k = []),
        w(!0));
    }
    function ae(a) {
      if (b || p || !i) return;
      const o = new Date(A + "-01T12:00:00Z");
      (o.setUTCMonth(o.getUTCMonth() + a),
        (A = o.toISOString().slice(0, 7)),
        (u = A + "-01"),
        (N = null),
        (k = []),
        w(!0));
    }
    function ke() {
      if (!(!i || p || b)) {
        if (h) {
          M("Salve ou descarte as configurações antes de editar a rotina.");
          return;
        }
        S.open();
      }
    }
    (r(e("agenda-profile-select"), "change", async () => {
      const a = e("agenda-profile-select").value;
      if (a !== T) {
        if (p || b || h || S.dirty) {
          ((e("agenda-profile-select").value = T || ""),
            M("Salve ou descarte suas alterações antes de trocar de perfil."));
          return;
        }
        (C++,
          U && !U.closed && U.close(),
          (U = null),
          (T = a),
          (i = null),
          (H = ""),
          (N = null),
          (G = null),
          (k = []),
          $.clear(),
          S.clear());
        for (const o of ["agenda-publish-dialog", "agenda-settings-dialog"])
          e(o).open && e(o).close();
        for (const o of [
          "agenda-admin-slots",
          "agenda-bookings",
          "agenda-month-grid",
        ])
          e(o).replaceChildren();
        (B.reset(),
          (e("agenda-admin-status").textContent = ""),
          q(!0),
          (p = !1),
          await w(!0),
          q(!1),
          (e("agenda-refresh").disabled = !1),
          i && W());
      }
    }),
      r(B, "input", () => {
        ((h = !0),
          K(),
          (e("agenda-settings-status").textContent =
            "Alterações ainda não salvas."));
      }),
      r(B, "submit", (a) => {
        (a.preventDefault(),
          i &&
            _(async () => {
              (await x("saveAgendaSettings", {
                revision: H,
                enabled: e("agenda-enabled").checked,
                autoMeet: e("agenda-auto-meet").checked,
                duration: Number(e("agenda-duration").value),
                noticeMinutes: Number(e("agenda-notice").value),
                hostName: e("agenda-host").value,
                onlineLink: e("agenda-online-link").value,
                presentialLocation: e("agenda-location").value,
              }),
                (h = !1),
                e("agenda-settings-dialog").close());
            }, "agenda-settings-error"));
      }),
      r(e("agenda-settings-reload"), "click", () => {
        p || b || ((h = !1), w(!0));
      }),
      r(e("agenda-toggle-open"), "click", () => {
        if (i) {
          if (h) {
            M(
              "Salve ou descarte as configurações antes de alterar a abertura.",
            );
            return;
          }
          _(() =>
            x("saveAgendaSettings", {
              ...i.settings,
              enabled: !i.settings.enabled,
            }),
          );
        }
      }),
      r(e("agenda-block-day"), "click", () => {
        if (!i) return;
        const a = i.calendar.days[u]?.blocked || !1;
        _(() =>
          x("setAgendaDayState", {
            date: u,
            revision: i.settings.revision,
            blocked: !a,
          }),
        );
      }),
      r(e("agenda-open-settings"), "click", () => {
        i &&
          ((e("agenda-settings-error").textContent = ""),
          e("agenda-settings-dialog").showModal());
      }),
      r(e("agenda-open-publish"), "click", () => ke()),
      r(e("agenda-add-day"), "click", () => {
        i && !p && !b && S.openExtra(u);
      }),
      r(e("agenda-reserve-day-time"), "click", () => {
        i && !p && !b && S.openHold(u);
      }));
    for (const a of D.querySelectorAll("[data-close-dialog]"))
      r(a, "click", () => e(a.dataset.closeDialog).close());
    (r(e("agenda-month-prev"), "click", () => ae(-1)),
      r(e("agenda-month-next"), "click", () => ae(1)),
      r(e("agenda-today"), "click", () => {
        !i || p || b || ((A = i.today.slice(0, 7)), ee(i.today));
      }),
      r(e("agenda-refresh"), "click", () => w(!0)),
      r(e("agenda-next"), "click", () => {
        !G || b || p || (k.push(N), (N = G), w(!0));
      }),
      r(e("agenda-prev"), "click", () => {
        !k.length || b || p || ((N = k.pop()), w(!0));
      }),
      r(e("agenda-copy-link"), "click", async () => {
        if (i)
          try {
            (await navigator.clipboard.writeText(i.publicUrl),
              (e("agenda-admin-status").textContent = "Link público copiado."));
          } catch {
            ((e("agenda-public-url").hidden = !1),
              e("agenda-public-url").select(),
              (e("agenda-admin-status").textContent =
                "Selecione e copie o link público."));
          }
      }),
      r(e("agenda-google-connect"), "click", async () => {
        if (p || b || !i?.google.configured) return;
        if (h) {
          e("agenda-google-error").textContent =
            "Salve ou descarte as configurações antes de conectar o Google.";
          return;
        }
        const a = C;
        (q(!0), (e("agenda-google-error").textContent = ""));
        try {
          const o = await x("adminGoogleStart");
          if (a !== C) return;
          if (new URL(o.url).origin !== "https://accounts.google.com")
            throw new Error("Endereço de autorização inválido.");
          const t = window.AlanaGoogleFlow.save(
            o,
            location.pathname + location.search,
          );
          location.assign(t);
        } catch (o) {
          e("agenda-google-error").textContent = o.message;
        } finally {
          a === C && (q(!1), W());
        }
      }),
      r(e("agenda-google-disconnect"), "click", () => {
        if (h) {
          e("agenda-google-error").textContent =
            "Salve ou descarte as configurações antes de desconectar.";
          return;
        }
        confirm(
          "Desconectar o Google? Novas reservas usarão o link manual. Eventos já criados permanecem no Google Agenda e precisarão ser tratados por lá.",
        ) &&
          _(async () => {
            (await x("adminGoogleDisconnect"), (h = !1));
          }, "agenda-google-error");
      }),
      r(document, "visibilitychange", () => {
        document.visibilityState === "visible" && i && !h && !p && !b && w(!0);
      }),
      r(window, "pageshow", (a) => {
        a.persisted && i && !h && !p && !b && w(!0);
      }),
      r(window, "message", (a) => {
        a.origin !== location.origin ||
          a.source !== U ||
          a.data?.type !== "alana-agenda-google-result" ||
          (a.data.result === "connected"
            ? ((e("agenda-google-error").textContent = h
                ? "Google conectado. Seu rascunho foi preservado; recarregue as configurações antes de salvar."
                : ""),
              w(!0),
              (e("agenda-admin-status").textContent =
                "Google conectado. Sincronização ativada. Confira o Meet automático nas configurações."))
            : (e("agenda-google-error").textContent =
                "Não foi possível confirmar o resultado. Confira a janela do Google e atualize o painel."));
      }),
      r(window, "beforeunload", (a) => {
        (h || S.dirty) && (a.preventDefault(), (a.returnValue = ""));
      }));
    const ne = {
      load: w,
      clear() {
        (C++,
          $.clear(),
          S.clear(),
          (T = null),
          (i = null),
          (A = ""),
          (u = ""),
          (b = !1),
          (h = !1),
          (p = !1),
          (N = null),
          (G = null),
          (k = []),
          (H = ""),
          (U = null),
          B.reset(),
          J.reset());
        for (const a of ["agenda-publish-dialog", "agenda-settings-dialog"])
          e(a).open && e(a).close();
        for (const a of [
          "agenda-admin-slots",
          "agenda-bookings",
          "agenda-month-grid",
        ])
          e(a).replaceChildren();
        for (const a of ["agenda-public-url"]) e(a).value = "";
        for (const a of [
          "agenda-admin-status",
          "agenda-settings-status",
          "agenda-slots-status",
          "agenda-google-status",
          "agenda-google-error",
          "agenda-publish-error",
          "agenda-settings-error",
        ])
          e(a).textContent = "";
        (M(""), q(!1));
      },
    };
    return {
      load: ne.load,
      destroy() {
        const a = U;
        (ne.clear(),
          a && !a.closed && a.close(),
          z.forEach(([o, d, t, g]) => o.removeEventListener(d, t, g)));
      },
    };
  }
  async function ce(D) {
    (Y(), (D.innerHTML = le), window.AlanaIcons.decorate(D));
    const z = re(D),
      r = window.AlanaCategorias.montar(D, {
        id: "agenda-alana",
        rotulo: "Categorias da agenda",
        inicial: "calendario",
        itens: [
          { id: "calendario", nome: "Calendário" },
          { id: "disponibilidade", nome: "Disponibilidade" },
          { id: "configuracoes", nome: "Configurações" },
        ],
      });
    ((j = { manager: z, nav: r }), await z.load(!0));
  }
  function Y() {
    j && (j.manager.destroy(), j.nav.destruir(), (j = null));
  }
  window.AlanaAgenda = { mount: ce, unmount: Y };
})();
