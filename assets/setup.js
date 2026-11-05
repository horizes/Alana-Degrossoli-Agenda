(function () {
  "use strict";
  const config = window.__ALANA_AGENDA_CONFIG__;
  const ready =
    config &&
    /^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(config.supabaseUrl) &&
    typeof config.publishableKey === "string" &&
    config.publishableKey.startsWith("sb_publishable_");
  if (ready) return;
  if (
    document.body.classList.contains("agenda-portal") &&
    document.getElementById("agenda-login-form")
  ) {
    const form = document.getElementById("agenda-login-form");
    form.querySelectorAll("input,button").forEach((el) => {
      el.disabled = true;
    });
    const message = document.getElementById("agenda-login-error");
    message.className = "agenda-setup-note";
    message.textContent =
      "O acesso da equipe será liberado após a configuração da nova agenda.";
  }
  const publicNotice = document.getElementById("agenda-notice");
  if (publicNotice) {
    const contact = document.createElement("section");
    contact.className = "agenda-contact-card";
    const title = document.createElement("h2");
    title.textContent = "Vamos encontrar seu horário?";
    const text = document.createElement("p");
    text.textContent =
      "Enquanto preparamos a agenda online, fale com a equipe para agendar sua consulta presencial ou online.";
    const link = document.createElement("a");
    link.className = "button primary";
    link.href =
      "https://wa.me/5519998117117?text=" +
      encodeURIComponent(
        "Olá! Gostaria de agendar uma consulta com a Alana Degrossoli.",
      );
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Agendar pelo WhatsApp";
    contact.append(title, text, link);
    publicNotice.after(contact);
  }
})();
