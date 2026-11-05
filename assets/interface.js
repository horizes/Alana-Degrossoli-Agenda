(function () {
  "use strict";
  const form = document.getElementById("agenda-form");
  const selection = document.getElementById("agenda-selection");
  const confirmation = document.getElementById("agenda-confirmation");
  const preview = document.getElementById("agenda-appointment-preview");
  if (!form || !selection || !confirmation || !preview) return;
  const steps = [...document.querySelectorAll(".agenda-public-steps li")];
  function update() {
    const hour = document.querySelector('#agenda-hours [aria-pressed="true"]');
    const date = document.querySelector('#agenda-dates [aria-pressed="true"]');
    const current = !confirmation.hidden ? 2 : hour ? 1 : 0;
    steps.forEach((step, index) => {
      if (index === current) step.setAttribute("aria-current", "step");
      else step.removeAttribute("aria-current");
      step.classList.toggle("is-complete", index < current);
    });
    preview.textContent = hour
      ? [date?.getAttribute("aria-label"), selection.textContent]
          .filter(Boolean)
          .join("\n")
      : "Escolha uma data e um horário para continuar.";
    preview.classList.toggle("has-selection", Boolean(hour));
  }
  const observer = new MutationObserver(update);
  observer.observe(selection, {
    childList: true,
    characterData: true,
    subtree: true,
  });
  observer.observe(confirmation, {
    attributes: true,
    attributeFilter: ["hidden"],
  });
  form.addEventListener("change", update);
  window.addEventListener("pagehide", () => observer.disconnect(), {
    once: true,
  });
  update();
})();
