/**
 * GUDOVA GROUP — 4-step contact form.
 * There is no backend on GitHub Pages, so submission never pretends
 * to "send" anything server-side: it assembles the answers into a
 * plain-text message and opens WhatsApp with that text pre-filled.
 * Phone / email stay as explicit fallbacks alongside the form.
 */
(function () {
  'use strict';

  var form = document.getElementById('contact-form');
  if (!form) return;

  var content = window.GUDOVA_CONTENT || { contacts: { whatsapp: '' } };
  var track = window.gudovaTrack || function () {};

  var steps = Array.prototype.slice.call(form.querySelectorAll('.form-step'));
  var progressDots = Array.prototype.slice.call(form.querySelectorAll('.form-progress span'));
  var success = form.querySelector('.form-success');
  var current = 0;
  var answers = {};
  var startedTracking = false;

  function markStarted() {
    if (startedTracking) return;
    startedTracking = true;
    track('form_start', {});
  }

  function updateProgress() {
    progressDots.forEach(function (dot, i) {
      dot.classList.toggle('is-done', i < current);
      dot.classList.toggle('is-active', i === current);
    });
  }

  function showStep(i) {
    steps.forEach(function (s, idx) { s.classList.toggle('is-active', idx === i); });
    updateProgress();
    var firstField = steps[i].querySelector('input, textarea, select, button.option-chip');
    if (firstField) firstField.focus({ preventScroll: true });
  }

  function fieldGroups(stepEl) {
    return Array.prototype.slice.call(stepEl.querySelectorAll('.field-group[data-field]'));
  }

  function validateGroup(group) {
    var key = group.getAttribute('data-field');
    var chips = group.querySelectorAll('.option-chip');
    var input = group.querySelector('input, textarea, select');
    var valid = true;

    if (chips.length) {
      var picked = group.querySelector('.option-chip[aria-pressed="true"]');
      valid = !!picked;
      if (picked) answers[key] = picked.textContent.trim();
    } else if (input) {
      valid = input.hasAttribute('data-optional') || input.value.trim().length > 0;
      if (input.type === 'email' && input.value.trim() && !/^\S+@\S+\.\S+$/.test(input.value.trim())) valid = false;
      answers[key] = input.value.trim();
    }
    group.classList.toggle('has-error', !valid);
    return valid;
  }

  function validateStep(stepEl) {
    var groups = fieldGroups(stepEl);
    var allValid = true;
    var firstInvalid = null;
    groups.forEach(function (g) {
      var ok = validateGroup(g);
      if (!ok && !firstInvalid) firstInvalid = g;
      allValid = allValid && ok;
    });
    if (firstInvalid) {
      var focusable = firstInvalid.querySelector('input, textarea, select, button.option-chip');
      if (focusable) focusable.focus();
    }
    return allValid;
  }

  /* chip groups */
  form.querySelectorAll('.option-grid').forEach(function (group) {
    group.addEventListener('click', function (e) {
      var btn = e.target.closest('.option-chip');
      if (!btn) return;
      markStarted();
      group.querySelectorAll('.option-chip').forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
      btn.setAttribute('aria-pressed', 'true');
      btn.closest('.field-group').classList.remove('has-error');
    });
  });

  form.querySelectorAll('input, textarea, select').forEach(function (el) {
    el.addEventListener('focus', markStarted, { once: true });
  });

  form.addEventListener('click', function (e) {
    var nextBtn = e.target.closest('[data-action="next"]');
    var prevBtn = e.target.closest('[data-action="prev"]');

    if (nextBtn) {
      if (!validateStep(steps[current])) return;
      track('form_step_complete', { step: current + 1 });
      current = Math.min(current + 1, steps.length - 1);
      showStep(current);
    }
    if (prevBtn) {
      current = Math.max(current - 1, 0);
      showStep(current);
    }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validateStep(steps[current])) return;

    var consent = form.querySelector('#f-consent');
    if (consent && !consent.checked) {
      consent.closest('.form-consent').classList.add('has-error');
      consent.focus();
      return;
    }

    var lines = [
      'Заявка с сайта GUDOVA GROUP',
      answers.role ? 'Роль: ' + answers.role : null,
      answers.objectType ? 'Объект: ' + answers.objectType : null,
      answers.stage ? 'Стадия проекта: ' + answers.stage : null,
      answers.task ? 'Задача: ' + answers.task : null,
      answers.budget ? 'Сумма контракта: ' + answers.budget : null,
      answers.comment ? 'Комментарий: ' + answers.comment : null,
      answers.name ? 'Имя: ' + answers.name : null,
      answers.phone ? 'Телефон: ' + answers.phone : null,
      answers.email ? 'Email: ' + answers.email : null
    ].filter(Boolean);

    var text = encodeURIComponent(lines.join('\n'));
    var waUrl = 'https://wa.me/' + content.contacts.whatsapp + '?text=' + text;

    track('form_submit', { role: answers.role || null });

    steps.forEach(function (s) { s.classList.remove('is-active'); });
    form.querySelector('.form-progress').style.display = 'none';
    if (success) success.classList.add('is-active');

    window.open(waUrl, '_blank', 'noopener');
  });

  showStep(0);
})();
