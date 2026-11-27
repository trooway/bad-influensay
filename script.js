document.documentElement.classList.add('js');

/* ===== НАСТРОЙКИ ===== */
// Чат в Telegram, куда попадают девушки по кнопке «Забрать сертификат».
// Нужна ссылка на личный чат/аккаунт (t.me/username): в ней сообщение подставляется заранее.
const TG_CHAT = 'https://t.me/badinfluencei';

document.querySelectorAll('[data-cert]').forEach(function (a) {
  const partner = a.getAttribute('data-cert');
  const text = 'Здравствуйте! Я с кино-йоги, хочу забрать свой сертификат' + (partner ? ' (' + partner + ')' : '') + '.';
  a.href = (a.getAttribute('data-tg') || TG_CHAT) + '?text=' + encodeURIComponent(text);
  a.target = '_blank';
  a.rel = 'noopener';
});

/* плавное появление блоков при прокрутке */
(function () {
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const items = document.querySelectorAll('section.wrap, .p-grid article, .p-row');
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  items.forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
})();
