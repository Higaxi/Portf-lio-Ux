/* "Da fazenda": carrossel com rolagem e snap, setas, pontos e avanço lento; pop-up em tela cheia (<dialog>).
   Sem JavaScript, a faixa continua rolável e as fotos aparecem com legenda. */
(function () {
  const faixa = document.getElementById("faixa");
  if (!faixa) return;
  const carrossel = document.getElementById("carrossel");
  const slides = [...faixa.querySelectorAll(".slide")];
  const reduz = matchMedia("(prefers-reduced-motion: reduce)");
  const pontos = document.getElementById("pontos");
  const btAnt = document.getElementById("ant"), btProx = document.getElementById("prox"), btPausa = document.getElementById("pausa");
  const margem = () => parseFloat(getComputedStyle(faixa).paddingLeft) || 0;
  let atual = 0;

  // faixa focável por teclado (setas rolam); pontos
  faixa.tabIndex = 0;
  faixa.setAttribute("aria-label", "Fotos da fazenda: use as setas para rolar");
  slides.forEach((s, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", `Ir para a foto ${i + 1} de ${slides.length}`);
    b.addEventListener("click", () => vaPara(i));
    pontos.appendChild(b);
  });
  const marca = () => {
    slides.forEach((_, i) => { if (i === atual) pontos.children[i].setAttribute("aria-current", "true"); else pontos.children[i].removeAttribute("aria-current"); });
  };
  function vaPara(i, suave = true) {
    i = Math.max(0, Math.min(slides.length - 1, i));
    faixa.scrollTo({ left: slides[i].offsetLeft - margem(), behavior: suave && !reduz.matches ? "smooth" : "auto" });
  }
  let rolando = false;
  faixa.addEventListener("scroll", () => {
    if (rolando) return;
    rolando = true;
    requestAnimationFrame(() => {
      rolando = false;
      const x = faixa.scrollLeft + margem();
      let melhor = 0, dist = Infinity;
      slides.forEach((s, i) => { const d = Math.abs(s.offsetLeft - x); if (d < dist) { dist = d; melhor = i; } });
      atual = melhor; marca();
    });
  }, { passive: true });
  btAnt.addEventListener("click", () => vaPara(atual - 1));
  btProx.addEventListener("click", () => vaPara(atual + 1));
  faixa.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); vaPara(atual + 1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); vaPara(atual - 1); }
  });

  // avanço automático lento: pausa com mouse, foco, toque, aba escondida, pop-up aberto e movimento reduzido
  let timer = null, pausadoPorUsuario = false, suspenso = false;
  const rodando = () => !reduz.matches && !pausadoPorUsuario && !suspenso && !document.hidden && !lb.open;
  function agenda() {
    clearInterval(timer);
    if (reduz.matches) return;
    timer = setInterval(() => { if (rodando()) vaPara(atual >= slides.length - 1 ? 0 : atual + 1); }, 4800);
  }
  ["mouseenter", "focusin", "pointerdown", "touchstart"].forEach((ev) => carrossel.addEventListener(ev, () => { suspenso = true; }, { passive: true }));
  ["mouseleave", "focusout"].forEach((ev) => carrossel.addEventListener(ev, () => { setTimeout(() => { suspenso = carrossel.matches(":hover") || carrossel.contains(document.activeElement); }, 50); }));
  btPausa.addEventListener("click", () => {
    pausadoPorUsuario = !pausadoPorUsuario;
    btPausa.setAttribute("aria-pressed", String(pausadoPorUsuario));
    btPausa.setAttribute("aria-label", pausadoPorUsuario ? "Retomar o avanço automático" : "Pausar o avanço automático");
  });
  const trataReduz = () => { btPausa.hidden = reduz.matches; agenda(); };
  reduz.addEventListener && reduz.addEventListener("change", trataReduz);

  // ----- pop-up -----
  const lb = document.getElementById("lightbox");
  const imgLb = document.getElementById("lb-img"), contaLb = document.getElementById("lb-conta");
  let idx = 0, abridor = null;
  const fotos = slides.map((s) => { const im = s.querySelector("img"); return { src: im.currentSrc || im.src, alt: im.alt }; });
  function mostra(i) {
    idx = (i + fotos.length) % fotos.length;
    const f = fotos[idx];
    imgLb.src = f.src; imgLb.alt = f.alt;
    contaLb.textContent = `${idx + 1} de ${fotos.length}`;
  }
  function abre(i, origem) {
    abridor = origem;
    mostra(i);
    if (typeof lb.showModal === "function") lb.showModal(); else lb.setAttribute("open", "");
    document.getElementById("lb-fechar").focus();
  }
  function fecha() { if (lb.open) lb.close(); }
  lb.addEventListener("close", () => { vaPara(idx, false); if (abridor && document.contains(abridor)) abridor.focus(); });
  slides.forEach((s, i) => s.querySelector(".slide__abrir").addEventListener("click", (e) => abre(i, e.currentTarget)));
  document.getElementById("lb-fechar").addEventListener("click", fecha);
  document.getElementById("lb-ant").addEventListener("click", () => mostra(idx - 1));
  document.getElementById("lb-prox").addEventListener("click", () => mostra(idx + 1));
  lb.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); mostra(idx - 1); }
    else if (e.key === "ArrowRight") { e.preventDefault(); mostra(idx + 1); }
  });
  lb.addEventListener("click", (e) => { if (!e.target.closest("img, button, figcaption")) fecha(); });
  // deslizar no celular
  let x0 = null;
  lb.addEventListener("pointerdown", (e) => { if (e.target === imgLb) x0 = e.clientX; });
  lb.addEventListener("pointerup", (e) => {
    if (x0 === null) return;
    const dx = e.clientX - x0; x0 = null;
    if (Math.abs(dx) > 50) mostra(idx + (dx < 0 ? 1 : -1));
  });
  lb.addEventListener("pointercancel", () => { x0 = null; });

  marca(); trataReduz();
})();
