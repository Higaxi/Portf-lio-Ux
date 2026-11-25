/* Só animação e o menu do celular (que a loja já tem). Nenhuma função nova. */
(function () {
  document.documentElement.classList.add('umh-js');

  // entrada suave das seções ao rolar
  var itens = document.querySelectorAll('.umh-anima');
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-visivel'); obs.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    itens.forEach(function (el) { obs.observe(el); });
  } else {
    itens.forEach(function (el) { el.classList.add('is-visivel'); });
  }

  // cabeçalho compacta ao rolar
  var header = document.querySelector('.umh-header');
  function rolou() { header.classList.toggle('is-rolado', window.scrollY > 40); }
  window.addEventListener('scroll', rolou, { passive: true });
  rolou();

  // menu do celular
  var btn = document.querySelector('.umh-menu-btn');
  btn.addEventListener('click', function () {
    var aberto = header.classList.toggle('is-aberto');
    btn.setAttribute('aria-expanded', aberto);
    btn.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
  });
  document.querySelectorAll('.umh-gaveta a').forEach(function (a) {
    a.addEventListener('click', function () { header.classList.remove('is-aberto'); btn.setAttribute('aria-expanded', 'false'); });
  });
})();
