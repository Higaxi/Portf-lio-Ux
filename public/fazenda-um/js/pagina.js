/* Comportamento da página: zoom lento da foto do hero, revelações, "ver no mapa", dados de exemplo, formulário. */
(function () {
  const reduz = matchMedia("(prefers-reduced-motion: reduce)");

  // 2. Revelação por seção, uma vez, escalonada por --i.
  const alvos = document.querySelectorAll("[data-reveal]");
  if (!("IntersectionObserver" in window)) alvos.forEach((el) => el.classList.add("is-in"));
  else {
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    alvos.forEach((el) => io.observe(el));
    addEventListener("load", () => setTimeout(() => alvos.forEach((el) => { const r = el.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) el.classList.add("is-in"); }), 2000));
  }

  // 4. Menu móvel fecha ao escolher um link; no desktop fica aberto.
  document.querySelectorAll(".nav__menu a").forEach((a) => a.addEventListener("click", () => { const d = a.closest("details"); if (d && innerWidth < 900) d.open = false; }));
  const menu = document.querySelector(".nav__menu");
  const ajustaMenu = () => { if (menu && innerWidth >= 900) menu.open = true; };
  ajustaMenu(); addEventListener("resize", ajustaMenu);

  // 5. Mostrar ou ocultar os dados de exemplo (sem JS eles ficam sempre visíveis).
  const alterna = document.getElementById("alterna-exemplos");
  if (alterna) {
    alterna.hidden = false;
    alterna.addEventListener("click", () => {
      const oculto = document.documentElement.dataset.exemplos === "off";
      if (oculto) delete document.documentElement.dataset.exemplos; else document.documentElement.dataset.exemplos = "off";
      alterna.setAttribute("aria-pressed", String(!oculto));
      alterna.textContent = oculto ? "Ocultar marcações" : "Mostrar marcações";
    });
  }

  // 6. Formulário: sem backend, abre o e-mail já escrito (mailto) com os dados.
  const form = document.getElementById("form-contato");
  if (form) form.addEventListener("submit", (e) => {
    e.preventDefault();
    const d = new FormData(form);
    const corpo = `Nome: ${d.get("nome")}\nE-mail: ${d.get("email")}\nTorrefação ou empresa: ${d.get("empresa") || "-"}\n\n${d.get("mensagem")}`;
    location.href = `mailto:adm@umcoffeco.com.br?subject=${encodeURIComponent("Contato pelo site, " + d.get("nome"))}&body=${encodeURIComponent(corpo)}`;
    document.getElementById("aviso-form").textContent = "Abrimos o seu programa de e-mail com a mensagem pronta. É só enviar.";
  });
})();

// Rodada 23/11: topo transparente sobre o vídeo, pausa do vídeo e setas da faixa de cafés.
(function () {
  const topo = document.querySelector("[data-topo]");
  if (topo) {
    const hero = document.querySelector(".hv, .ph");
    const ajusta = () => topo.classList.toggle("is-solido", !hero || scrollY > hero.offsetHeight - topo.offsetHeight - 10 || topo.querySelector("details[open]") && innerWidth < 900);
    ajusta(); addEventListener("scroll", ajusta, { passive: true }); addEventListener("resize", ajusta);
    topo.querySelector("details")?.addEventListener("toggle", ajusta);
  }
  const video = document.querySelector(".hv__video");
  const pausa = document.querySelector("[data-video-pausa]");
  if (video && pausa) {
    const txt = pausa.querySelector(".hv__pausa-txt");
    const marca = () => { const p = video.paused; pausa.setAttribute("aria-pressed", String(p)); txt.textContent = p ? "Tocar vídeo" : "Pausar vídeo"; };
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { video.removeAttribute("autoplay"); video.pause(); }
    pausa.addEventListener("click", () => { video.paused ? video.play() : video.pause(); });
    video.addEventListener("play", marca); video.addEventListener("pause", marca); marca();
  }
  const faixa = document.querySelector("[data-faixa-alvo]");
  document.querySelectorAll("[data-faixa]").forEach((b) => b.addEventListener("click", () => {
    if (!faixa) return;
    const passo = (faixa.querySelector("li")?.offsetWidth || 260) + 24;
    faixa.scrollBy({ left: passo * Number(b.dataset.faixa), behavior: "smooth" });
  }));
})();
