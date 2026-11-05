(function () {
  "use strict";
  const e = document.getElementById("offline-status");
  (document
    .getElementById("offline-retry")
    .addEventListener("click", () => location.reload()),
    window.addEventListener("online", () => {
      e.textContent =
        "A conexão voltou. Toque em Tentar novamente para continuar de onde parou.";
    }));
})();
