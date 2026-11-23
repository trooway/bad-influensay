document.documentElement.classList.add('js');

/* ===== НАСТРОЙКИ ===== */
const CONFIG = {
  // Куда отправлять контакты. Пусто = демо-режим (данные никуда не уходят, только в консоль).
  // Варианты: Formspree / Google Apps Script / webhook Telegram-бота / Тильда-форма / Яндекс Форма-прокси.
  FORM_ENDPOINT: '',
  // Куда ведёт кнопка «Записаться» после получения сертификата (ссылка на онлайн-запись или Instagram салона).
  BOOKING_URL: 'https://www.instagram.com/mironycheva.beauty',
  // Через сколько мс после загрузки показывать сертификат
  AUTO_OPEN_DELAY: 1200
};

(function () {
  const dlg = document.getElementById('cert-dialog');
  if (!dlg) return;
  const form = document.getElementById('cert-form');
  const stepForm = document.getElementById('step-form');
  const stepDone = document.getElementById('step-done');
  const err = dlg.querySelector('.form-error');
  const book = document.getElementById('book-link');
  book.href = CONFIG.BOOKING_URL;

  const canModal = typeof dlg.showModal === 'function';

  function openCert() {
    if (!canModal) { window.open(CONFIG.BOOKING_URL, '_blank', 'noopener'); return; }
    if (!dlg.open) dlg.showModal();
  }
  function closeCert() { if (dlg.open) dlg.close(); }

  document.querySelectorAll('[data-open-cert]').forEach(function (el) {
    el.addEventListener('click', function (e) { e.preventDefault(); openCert(); });
  });
  dlg.querySelectorAll('[data-close]').forEach(function (el) { el.addEventListener('click', closeCert); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) closeCert(); });

  // авто-показ один раз за сессию
  let seen = false;
  try { seen = sessionStorage.getItem('certSeen') === '1'; } catch (e) {}
  if (!seen && canModal) {
    setTimeout(function () {
      openCert();
      try { sessionStorage.setItem('certSeen', '1'); } catch (e) {}
    }, CONFIG.AUTO_OPEN_DELAY);
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    err.textContent = '';
    const name = form.elements.name.value.trim();
    const contact = form.elements.contact.value.trim();
    const consent = form.elements.consent.checked;
    if (name.length < 2) { err.textContent = 'Напиши, как тебя зовут.'; return; }
    if (contact.length < 5) { err.textContent = 'Оставь телефон или @ник в Telegram.'; return; }
    if (!consent) { err.textContent = 'Нужно согласие на обработку контактов.'; return; }

    const payload = { name: name, contact: contact, partner: 'mironycheva.beauty', source: 'bad-influencei-site', ts: new Date().toISOString() };
    const btn = form.querySelector('button[type=submit]');
    btn.disabled = true;
    try {
      if (CONFIG.FORM_ENDPOINT) {
        const res = await fetch(CONFIG.FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('bad status ' + res.status);
      } else {
        console.info('[DEMO] контакты не отправлены, подключи FORM_ENDPOINT:', payload);
      }
      stepForm.hidden = true;
      stepDone.hidden = false;
    } catch (ex) {
      err.textContent = 'Не получилось отправить. Попробуй ещё раз.';
    } finally {
      btn.disabled = false;
    }
  });
})();
