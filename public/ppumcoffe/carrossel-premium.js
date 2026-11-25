/* Carrossel do topo — mesma lógica do um-carrossel (autoplay, setas, toque, pausa no foco),
   com barra de progresso no lugar dos pontos. */
(function () {
  var raiz = document.getElementById('umx-home');
  if (!raiz) return;
  var textos = [].slice.call(raiz.querySelectorAll('.umx-texto'));
  var fotos = [].slice.call(raiz.querySelectorAll('.umx-foto'));
  var barras = [].slice.call(raiz.querySelectorAll('.umx-barra'));
  var cont = raiz.querySelector('.umx-cont b');
  var total = textos.length;
  if (total < 2) return;
  var tempo = (+raiz.getAttribute('data-tempo') || 9) * 1000;
  raiz.style.setProperty('--tempo', tempo / 1000 + 's');
  raiz.style.setProperty('--n', total);
  var calmo = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var atual = 0, inicio = 0, decorrido = 0, pausado = false, quadro = null;

  function marcar() {
    barras.forEach(function (b, i) {
      b.classList.toggle('is-visto', i < atual);
      if (i !== atual) b.style.removeProperty('--p');
      b.toggleAttribute('aria-current', i === atual);
      if (i === atual) b.setAttribute('aria-current', 'true');
    });
    if (cont) cont.textContent = String(atual + 1).padStart(2, '0');
  }
  function ir(n) {
    n = (n + total) % total;
    if (n === atual) return;
    [textos, fotos].forEach(function (lista) {
      lista[atual].classList.remove('is-ativo');
      lista[n].classList.add('is-ativo');
    });
    atual = n; decorrido = 0; inicio = performance.now();
    marcar();
  }
  function passo(agora) {
    if (!pausado && !document.hidden) {
      var p = Math.min(1, (decorrido + agora - inicio) / tempo);
      barras[atual].style.setProperty('--p', p);
      if (p >= 1) ir(atual + 1);
    }
    quadro = requestAnimationFrame(passo);
  }
  function pausar() { if (!pausado) { decorrido += performance.now() - inicio; pausado = true; } }
  function seguir() { if (pausado) { inicio = performance.now(); pausado = false; } }

  raiz.querySelector('.umx-seta--ant').addEventListener('click', function () { ir(atual - 1); });
  raiz.querySelector('.umx-seta--prox').addEventListener('click', function () { ir(atual + 1); });
  barras.forEach(function (b, i) { b.addEventListener('click', function () { ir(i); }); });
  raiz.addEventListener('mouseenter', pausar);
  raiz.addEventListener('mouseleave', seguir);
  raiz.addEventListener('focusin', pausar);
  raiz.addEventListener('focusout', seguir);
  document.addEventListener('visibilitychange', function () { if (document.hidden) pausar(); else seguir(); });

  var x0 = null, palco = raiz.querySelector('.umx-palco');
  palco.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; pausar(); }, { passive: true });
  palco.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var d = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(d) > 48) ir(atual + (d < 0 ? 1 : -1));
    seguir();
  }, { passive: true });

  marcar();
  if (calmo) return;
  inicio = performance.now();
  quadro = requestAnimationFrame(passo);
})();
