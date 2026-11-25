(function () {
  var raiz = document.getElementById('umc-home');
  if (!raiz) return;
  var slides = [].slice.call(raiz.querySelectorAll('.umc-slide'));
  var pontos = [].slice.call(raiz.querySelectorAll('.umc-ponto'));
  if (slides.length < 2) return;
  var atual = 0, relogio = null, parado = false;
  var tempo = (+raiz.getAttribute('data-tempo') || 9) * 1000;
  var calmo = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function ir(n, sentido) {
    n = (n + slides.length) % slides.length;
    if (n === atual) return;
    var sai = slides[atual], entra = slides[n];
    entra.style.transition = 'none';
    entra.style.translate = (sentido > 0 ? '100%' : '-100%') + ' 0';
    void entra.offsetWidth;
    entra.style.transition = '';
    entra.classList.add('is-ativo');
    sai.classList.remove('is-ativo');
    entra.style.translate = '0 0';
    sai.style.translate = (sentido > 0 ? '-100%' : '100%') + ' 0';
    if (pontos[atual]) pontos[atual].removeAttribute('aria-current');
    if (pontos[n]) pontos[n].setAttribute('aria-current', 'true');
    atual = n;
  }
  function parar() { clearInterval(relogio); relogio = null; }
  function tocar() {
    parar();
    if (calmo || parado || document.hidden) return;
    relogio = setInterval(function () { ir(atual + 1, 1); }, tempo);
  }
  raiz.querySelector('.umc-seta--ant').addEventListener('click', function () { ir(atual - 1, -1); tocar(); });
  raiz.querySelector('.umc-seta--prox').addEventListener('click', function () { ir(atual + 1, 1); tocar(); });
  pontos.forEach(function (p, i) {
    p.addEventListener('click', function () { ir(i, i > atual ? 1 : -1); tocar(); });
  });
  raiz.addEventListener('focusin', function (e) { if (e.target.matches(':focus-visible')) { parado = true; parar(); } });
  raiz.addEventListener('focusout', function () { if (parado) { parado = false; tocar(); } });
  document.addEventListener('visibilitychange', tocar);

  var inicioX = null;
  var janela = raiz.querySelector('.umc-janela');
  janela.addEventListener('touchstart', function (e) { inicioX = e.touches[0].clientX; parar(); }, { passive: true });
  janela.addEventListener('touchend', function (e) {
    if (inicioX === null) return;
    var d = e.changedTouches[0].clientX - inicioX;
    inicioX = null;
    if (Math.abs(d) > 48) ir(atual + (d < 0 ? 1 : -1), d < 0 ? 1 : -1);
    tocar();
  }, { passive: true });

  if (window.Shopify && Shopify.designMode) {
    document.addEventListener('shopify:block:select', function (e) {
      var i = slides.indexOf(e.target);
      if (i > -1) { parado = true; parar(); ir(i, i > atual ? 1 : -1); }
    });
  }
  tocar();
})();
