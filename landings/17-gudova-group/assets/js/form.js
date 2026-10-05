/**
 * GUDOVA GROUP — contact form.
 * There is no backend on GitHub Pages, so submission never pretends
 * to "send" anything server-side: it assembles the answers into a
 * plain-text message and opens WhatsApp with that text pre-filled.
 * Phone / email stay as explicit fallbacks alongside the form.
 */
(function () {
  'use strict';

  var form = document.getElementById('contact-form');
  if (!form) return;

  // .form-success is a sibling of <form> inside .form-card, not a
  // descendant of it — scope lookups to the shared parent so it's
  // actually found (form.querySelector alone misses it).
  var formCard = form.closest('.form-card') || form.parentElement || form;

  var content = window.GUDOVA_CONTENT || { contacts: { whatsapp: '' } };
  var track = window.gudovaTrack || function () {};

  var success = formCard.querySelector('.form-success');
  var answers = {};
  var startedTracking = false;

  function markStarted() {
    if (startedTracking) return;
    startedTracking = true;
    track('form_start', {});
  }

  function fieldGroups() {
    return Array.prototype.slice.call(form.querySelectorAll('.field-group[data-field]'));
  }

  function validateGroup(group) {
    var key = group.getAttribute('data-field');
    var input = group.querySelector('input, textarea, select');
    var valid = true;

    if (input) {
      valid = input.hasAttribute('data-optional') || input.value.trim().length > 0;
      if (input.type === 'tel' && input.value.trim() && !/^[+0-9()\-\s]{7,20}$/.test(input.value.trim())) valid = false;
      answers[key] = input.value.trim();
    }
    group.classList.toggle('has-error', !valid);
    return valid;
  }

  function validateForm() {
    var groups = fieldGroups();
    var allValid = true;
    var firstInvalid = null;
    groups.forEach(function (g) {
      var ok = validateGroup(g);
      if (!ok && !firstInvalid) firstInvalid = g;
      allValid = allValid && ok;
    });
    if (firstInvalid) {
      var focusable = firstInvalid.querySelector('input, textarea, select');
      if (focusable) focusable.focus();
    }
    return allValid;
  }

  form.querySelectorAll('input, textarea, select').forEach(function (el) {
    el.addEventListener('focus', markStarted, { once: true });
  });

  var consentInput = form.querySelector('#f-consent');
  if (consentInput) {
    consentInput.addEventListener('change', function () {
      if (consentInput.checked) consentInput.closest('.form-consent').classList.remove('has-error');
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validateForm()) return;

    var consent = form.querySelector('#f-consent');
    if (consent && !consent.checked) {
      consent.closest('.form-consent').classList.add('has-error');
      consent.focus();
      return;
    }
    if (consent) consent.closest('.form-consent').classList.remove('has-error');

    var lines = [
      'Заявка с сайта GUDOVA GROUP',
      answers.name ? 'Имя: ' + answers.name : null,
      answers.phone ? 'Телефон: ' + answers.phone : null,
      answers.objectType ? 'Объект/компания: ' + answers.objectType : null,
      answers.comment ? 'Комментарий: ' + answers.comment : null
    ].filter(Boolean);

    var text = encodeURIComponent(lines.join('\n'));
    var waUrl = 'https://wa.me/' + content.contacts.whatsapp + '?text=' + text;

    track('form_submit', {});

    form.style.display = 'none';
    if (success) success.classList.add('is-active');

    window.open(waUrl, '_blank', 'noopener');
  });
})();
