(function () {
  var cfg = window.FREZER_CONFIG || {};

  function waLink(message) {
    var text = encodeURIComponent(message || cfg.whatsappMessage || "");
    return "https://wa.me/" + cfg.whatsappDigits + "?text=" + text;
  }

  // Fill in contact placeholders wherever data-cfg="key" is used
  document.querySelectorAll("[data-cfg]").forEach(function (el) {
    var key = el.getAttribute("data-cfg");
    if (cfg[key] !== undefined) el.textContent = cfg[key];
  });
  document.querySelectorAll("[data-cfg-href]").forEach(function (el) {
    var key = el.getAttribute("data-cfg-href");
    if (key === "whatsapp") el.setAttribute("href", waLink());
    else if (cfg[key] !== undefined) el.setAttribute("href", cfg[key]);
  });

  // Mobile nav toggle
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { nav.classList.remove("is-open"); });
    });
  }

  // Contact form -> WhatsApp deep link
  var form = document.querySelector("#lead-form");
  if (form) {
    // keep the no-JS fallback action in sync if the phone number in config.js changes
    form.setAttribute("action", "https://wa.me/" + cfg.whatsappDigits);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.querySelector("#f-name").value.trim();
      var phone = form.querySelector("#f-phone").value.trim();
      var date = form.querySelector("#f-date").value.trim();
      var comment = form.querySelector("#f-comment").value.trim();

      var lines = ["Здравствуйте! Хочу арендовать «Фрезер»."];
      if (name) lines.push("Имя: " + name);
      if (phone) lines.push("Телефон: " + phone);
      if (date) lines.push("Дата мероприятия: " + date);
      if (comment) lines.push("Комментарий: " + comment);

      var status = form.querySelector(".form__status");
      if (status) {
        status.textContent = "Открываем WhatsApp…";
        status.setAttribute("data-state", "ok");
      }
      window.open(waLink(lines.join("\n")), "_blank");
    });
  }
})();
