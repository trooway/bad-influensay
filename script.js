document.documentElement.classList.add('js');

/* ===== НАСТРОЙКИ ===== */
// Чат в Telegram, куда попадают девушки по кнопке «Забрать сертификат».
// Нужна ссылка на личный чат/аккаунт (t.me/username): в ней сообщение подставляется заранее.
const TG_CHAT = 'https://t.me/badinfluencei';

document.querySelectorAll('[data-cert]').forEach(function (a) {
  const partner = a.getAttribute('data-cert');
  const text = 'Здравствуйте! Я с кино-йоги, хочу забрать свой сертификат' + (partner ? ' (' + partner + ')' : '') + '.';
  a.href = TG_CHAT + '?text=' + encodeURIComponent(text);
  a.target = '_blank';
  a.rel = 'noopener';
});
