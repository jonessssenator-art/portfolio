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

  // Floating WhatsApp / Telegram buttons
  var floatWrap = document.createElement("div");
  floatWrap.className = "float-contacts";
  floatWrap.innerHTML =
    '<a class="float-contacts__btn float-contacts__btn--wa" target="_blank" rel="noopener" aria-label="Написать в WhatsApp" title="WhatsApp">' +
    '<svg viewBox="0 0 24 24" fill="#fff"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.7.8-.8.9-.2.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5.1-.1.2-.3.4-.4.1-.2.2-.3.2-.5.1-.2 0-.4 0-.5 0-.1-.6-1.5-.8-2-.2-.5-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.2s1 2.5 1.1 2.7c.1.2 2 3 4.8 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z"/></svg>' +
    "</a>" +
    '<a class="float-contacts__btn float-contacts__btn--tg" target="_blank" rel="noopener" aria-label="Написать в Telegram" title="Telegram">' +
    '<svg viewBox="0 0 24 24" fill="#fff"><path d="M21.5 3.5 2.3 11.2c-.9.4-.9 1.5.1 1.8l4.9 1.5 1.9 6c.2.7 1.1.9 1.6.4l2.7-2.6 5 3.7c.7.5 1.7.2 1.9-.6l3.4-16.4c.2-.9-.7-1.6-1.5-1.5zM8.9 14l9.5-6.5c.3-.2.6.2.3.4l-7.9 7.6c-.3.3-.5.7-.5 1.1l-.3 2.6-1.1-5.2z"/></svg>' +
    "</a>";
  floatWrap.querySelector(".float-contacts__btn--wa").href = waLink();
  floatWrap.querySelector(".float-contacts__btn--tg").href = cfg.telegram || "#";
  document.body.appendChild(floatWrap);

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
      var commentEl = form.querySelector("#f-comment");
      var comment = commentEl ? commentEl.value.trim() : "";
      var formatEl = form.querySelector("#f-format");
      var format = formatEl ? formatEl.value.trim() : "";
      var guestsEl = form.querySelector("#f-guests");
      var guests = guestsEl ? guestsEl.value.trim() : "";

      var lines = ["Здравствуйте! Хочу арендовать «Фрезер»."];
      if (name) lines.push("Имя: " + name);
      if (phone) lines.push("Телефон: " + phone);
      if (format) lines.push("Формат мероприятия: " + format);
      if (guests) lines.push("Число гостей: " + guests);
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
