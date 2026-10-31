/* tools/escritorio/cena.js - O salão do bar do Seu Zé (o panorama e as pessoas do fundo do menu, src/ui/menubg.js) virando escritório:
   cada agente/skill é uma pessoa sentada com um notebook. Trabalhando: notebook aberto e aceso, digitando, balão com a ação atual.
   À toa: notebook fechado, bebendo e puxando conversa de bar. O Claude é o Seu Zé atrás do balcão. O garçom passa servindo. */
const Cena = (() => {
  const BW = 1768, Y0 = 150, Y1 = 645, BH = Y1 - Y0;            // panorama e a faixa visível (sem o teto)
  const ART = '/escritorio-arte/img/menu/';
  const LAMPS = [[20, 205], [155, 215], [665, 232], [705, 236], [893, 232], [1090, 236], [1250, 222], [1302, 250], [1478, 250], [1537, 250], [1645, 232], [1700, 212]], JUKE = [1015, 400];
  const COUNTER = 388;
  // lugares: k = s (sentado, de frente) | b (no balcão, de costas); i = quadro do sprite; lap = notebook [x, y, de costas?]
  const LUGARES = [
    { k: 's', i: 0, x: 125, y: 582, s: 2.2, lap: [80, 487] },
    { k: 's', i: 2, x: 398, y: 582, s: 2.2, lap: [436, 487] },
    { k: 's', i: 9, x: 515, y: 582, s: 2.2, lap: [476, 487], flip: 1 },
    { k: 's', i: 4, x: 790, y: 592, s: 2.2, lap: [832, 505] },
    { k: 's', i: 6, x: 915, y: 592, s: 2.2, lap: [874, 505], flip: 1 },
    { k: 's', i: 5, x: 1182, y: 582, s: 2.2, lap: [1226, 490] },
    { k: 's', i: 8, x: 1302, y: 582, s: 2.2, lap: [1268, 490], flip: 1 },
    { k: 's', i: 11, x: 1640, y: 582, s: 2.2, lap: [1684, 487] },
    { k: 's', i: 1, x: 334, y: 470, s: 1.6, lap: [366, 404] },
    { k: 's', i: 3, x: 475, y: 470, s: 1.6, lap: [441, 404], flip: 1 },
    { k: 's', i: 7, x: 1478, y: 452, s: 1.5, lap: [1515, 376] },
    { k: 's', i: 10, x: 1560, y: 452, s: 1.5, lap: [1527, 376], flip: 1 },
    { k: 'b', i: 0, x: 655, y: 506, s: 2.2, lap: [655, 392, 1] },
    { k: 'b', i: 1, x: 700, y: 506, s: 2.2, lap: [700, 392, 1] },
    { k: 'b', i: 2, x: 880, y: 506, s: 2.2, lap: [880, 392, 1] },
    { k: 'b', i: 3, x: 935, y: 506, s: 2.2, lap: [935, 392, 1] },
    { k: 's', i: 12, x: 1600, y: 452, s: 1.5, lap: [1600, 380, 1] },
    { k: 's', i: 14, x: 60, y: 600, s: 2.2, lap: [40, 487] },
  ];
  const PISTA = [[1080, 540], [1010, 548], [1150, 532], [1350, 555], [1220, 560], [960, 560]];      // ajudantes temporários: em pé no salão
  const FALAS = ['Garçom, mais uma!', 'Essa música é boa demais!', 'Quem paga essa rodada?', 'Ô, desce mais uma gelada!', 'Cadê o tira-gosto?', 'Só mais uma e eu vou.', 'O Seu Zé capricha, viu?', 'Tá calor, hein!', 'Hoje ninguém me chamou...', 'Tô de folga, patrão!', 'Me chama se precisar!', 'Esperando serviço...', 'Bora um truco?', 'Essa picanha tá no ponto!'];
  const F_GARCOM = ['Olha a gelada passando!', 'Já levo aí, patrão!', 'Mesa 4, saindo!', 'Com licença, gente!'];
  const pick = a => a[Math.floor(Math.random() * a.length)];

  let cv, g, PANO, SIT, BAL, DAN, WALK, ZE, pronto = false, t = 0, last = 0, k = 1, dpr = 1;
  let pessoas = [], zeP = null, sobre = null, aoClicar = null;
  const balões = [];
  const garcom = { x: -60, dir: 1, para: 0 };

  const carregar = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = src; });
  const tingir = (img, sx = 0, sy = 0, w = img.width, h = img.height) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); x.filter = 'saturate(.72) sepia(.18) brightness(.88) contrast(1.05)'; x.drawImage(img, sx, sy, w, h, 0, 0, w, h); return c };
  const quadros = (img, fw) => img ? Array.from({ length: Math.round(img.width / fw) }, (_, i) => tingir(img, i * fw, 0, fw, img.height)) : [];

  async function iniciar(canvas, clique) {
    cv = canvas; g = cv.getContext('2d'); aoClicar = clique;
    const [pano, sent, bal, dan, gar, ze] = await Promise.all(['pano.webp', 'sentados.png', 'balcao.png', 'dancando.png', 'garcom.png', 'seuze.png'].map(f => carregar(ART + f)));
    PANO = pano; SIT = quadros(sent, 64); BAL = quadros(bal, 64); DAN = quadros(dan, 64); WALK = quadros(gar, 64); ZE = ze ? tingir(ze) : null;
    zeP = { x: 800, alvo: 800, espera: 2, flip: false };
    pronto = true;
    cv.addEventListener('mousemove', e => { sobre = achar(e); cv.style.cursor = sobre ? 'pointer' : 'default' });
    cv.addEventListener('mouseleave', () => sobre = null);
    cv.addEventListener('click', e => { const p = achar(e); if (p && aoClicar) aoClicar(p.id) });
    new ResizeObserver(tamanho).observe(cv.parentElement); tamanho();
    requestAnimationFrame(quadro);
  }
  function tamanho() {
    const w = cv.parentElement.clientWidth;
    const cssW = Math.max(w, 620);                      // no celular o salão rola para o lado em vez de ficar minúsculo
    k = cssW / BW; dpr = window.devicePixelRatio || 1;
    cv.style.width = cssW + 'px'; cv.style.height = Math.round(BH * k) + 'px';
    cv.width = Math.round(cssW * dpr); cv.height = Math.round(BH * k * dpr);
  }
  function achar(e) {
    const r = cv.getBoundingClientRect(), x = (e.clientX - r.left) / k, y = (e.clientY - r.top) / k + Y0;
    let melhor = null;
    for (const p of [...pessoas, zeP && zeP.info ? { ...zeP.info, x: zeP.x, y: 428, s: 2.3 } : null].filter(Boolean)) {
      const h = 64 * p.s, w = 34 * p.s;
      if (x > p.x - w / 2 && x < p.x + w / 2 && y > p.y - h && y < p.y) melhor = p;
    }
    return melhor;
  }

  // dados do escritório -> pessoas no salão. lista = [{id, nome, papel, trab, atual, temp}]; chefe = {id, nome, trab, atual}
  function atualizar(lista, chefe) {
    const fixos = lista.filter(p => !p.temp), temps = lista.filter(p => p.temp);
    const novas = [];
    fixos.forEach((p, n) => { const l = LUGARES[n % LUGARES.length]; const ant = pessoas.find(q => q.id === p.id); novas.push({ ...l, ...p, ph: ant ? ant.ph : Math.random() * 6.28, desde: ant && ant.trab === p.trab ? ant.desde : t }) });
    temps.forEach((p, n) => { const [x, y] = PISTA[n % PISTA.length]; const ant = pessoas.find(q => q.id === p.id); novas.push({ k: 'd', i: (n * 5 + 3) % 16, x, y, s: 2.35, ...p, ph: ant ? ant.ph : Math.random() * 6.28, desde: ant && ant.trab === p.trab ? ant.desde : t }) });
    pessoas = novas;
    if (zeP) zeP.info = chefe;
  }

  // ---------- desenho ----------
  function put(img, x, y, s, flip, dy = 0, sxs = 1, sys = 1) {
    if (!img) return; const w = img.width * s * sxs, h = img.height * s * sys;
    g.save(); g.translate(Math.round(x), Math.round(y + dy)); if (flip) g.scale(-1, 1); g.drawImage(img, Math.round(-w / 2), Math.round(-h), Math.round(w), Math.round(h)); g.restore();
  }
  function brilho(x, y, r, cor, a) { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, cor.replace('A', a)); gr.addColorStop(1, cor.replace('A', 0)); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2) }
  function sombra(x, y, rx, ry) { g.fillStyle = 'rgba(10,4,2,.42)'; g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, 6.283); g.fill() }

  // notebook em pixel (objeto, desenhado aqui): aberto e aceso quando trabalha, fechado quando está à toa
  function notebook(x, y, s, aberto, costas, fase) {
    const u = s * 1.1; g.save(); g.translate(Math.round(x), Math.round(y));
    if (!aberto) {        // fechado: uma lâmina cinza deitada na mesa
      g.fillStyle = '#111'; g.fillRect(-13 * u, -3 * u, 26 * u, 4 * u);
      g.fillStyle = '#4a4a55'; g.fillRect(-12 * u, -3 * u, 24 * u, 2.5 * u);
      g.restore(); return;
    }
    g.fillStyle = '#111'; g.fillRect(-14 * u, -1 * u, 28 * u, 3 * u);                       // base
    g.fillStyle = '#55555f'; g.fillRect(-13 * u, -0.5 * u, 26 * u, 1.6 * u);
    g.fillStyle = '#111'; g.fillRect(-11 * u, -17 * u, 22 * u, 16.5 * u);                  // tampa
    if (costas) {
      g.fillStyle = '#3a3a44'; g.fillRect(-10 * u, -16 * u, 20 * u, 14.5 * u);
      g.fillStyle = '#ffd23f'; g.fillRect(-1.5 * u, -10.5 * u, 3 * u, 3 * u);             // a ficha do Canastrium na tampa
      g.globalCompositeOperation = 'lighter'; brilho(0, -9 * u, 22 * u, 'rgba(120,210,255,A)', .35); g.globalCompositeOperation = 'source-over';
    } else {
      g.fillStyle = '#0d2a3a'; g.fillRect(-10 * u, -16 * u, 20 * u, 14.5 * u);
      g.fillStyle = '#7fd8ff';
      for (let l = 0; l < 4; l++) { const w = ((Math.sin(fase * 3 + l * 1.7) + 1) / 2) * 14 + 3; g.fillRect(-8.5 * u, (-14 + l * 3) * u, Math.min(w, 17) * u, 1.2 * u) }
      g.globalCompositeOperation = 'lighter'; brilho(0, -9 * u, 26 * u, 'rgba(120,210,255,A)', .45); g.globalCompositeOperation = 'source-over';
    }
    g.restore();
  }
  function balao(x, y, txt, cor) {
    g.font = "17px 'm6x11plus',monospace";
    const w = Math.min(g.measureText(txt).width, 300) + 16, h = 24, bx = Math.round(Math.min(Math.max(x - w / 2, 4), BW - w - 4)), by = Math.round(y - h);
    g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(bx + 3, by + 3, w, h);
    g.fillStyle = cor === 'trab' ? '#e9ffe9' : '#fff7e6'; g.fillRect(bx, by, w, h);
    g.strokeStyle = '#1b0f08'; g.lineWidth = 2; g.strokeRect(bx, by, w, h);
    g.fillStyle = cor === 'trab' ? '#e9ffe9' : '#fff7e6'; g.beginPath(); g.moveTo(x - 6, by + h - 1); g.lineTo(x + 2, by + h + 9); g.lineTo(x + 6, by + h - 1); g.fill();
    g.fillStyle = '#1b0f08'; g.save(); g.beginPath(); g.rect(bx + 6, by, w - 12, h); g.clip(); g.fillText(txt, bx + 8, by + 17); g.restore();
  }
  function etiqueta(p) {        // nome em cima de quem está com o mouse
    g.font = "18px 'm6x11plus',monospace";
    const txt = p.nome + (p.trab ? ' · trabalhando' : ' · à toa'), w = g.measureText(txt).width + 14, x = Math.round(p.x - w / 2), y = Math.round(p.y - 64 * p.s - 34);
    g.fillStyle = p.trab ? '#2f6a35' : '#3a2a22'; g.fillRect(x, y, w, 24); g.strokeStyle = '#000'; g.lineWidth = 2; g.strokeRect(x, y, w, 24);
    g.fillStyle = '#fff'; g.fillText(txt, x + 7, y + 17);
  }
  function marca(p) {           // bolinha verde (trabalhando) ou "z" (à toa) em cima da cabeça
    const x = p.x, y = p.y - 64 * p.s - 6 + Math.sin(t * 3 + p.ph) * 2;
    if (p.trab) { g.globalCompositeOperation = 'lighter'; brilho(x, y, 14, 'rgba(125,255,138,A)', .8); g.globalCompositeOperation = 'source-over'; g.fillStyle = '#7dff8a'; g.fillRect(x - 3, y - 3, 6, 6) }
    else { g.font = "16px 'm6x11plus',monospace"; g.fillStyle = 'rgba(230,215,190,' + (.4 + .4 * Math.sin(t * 2 + p.ph)) + ')'; g.fillText('z', x - 4, y); g.fillText('z', x + 3, y - 8) }
  }

  function falar(dt) {
    for (let n = balões.length - 1; n >= 0; n--) if (t - balões[n].t0 > balões[n].dur) balões.splice(n, 1);
    if (balões.length >= 3 || Math.random() > dt * 1.4) return;
    const todos = [...pessoas, zeP && zeP.info ? { id: '__ze', ...zeP.info, ze: 1 } : null].filter(Boolean);
    const quem = pick(todos); if (!quem || balões.some(b => b.id === quem.id)) return;
    const txt = quem.trab ? (quem.atual || 'trabalhando…') : quem.ze ? pick(['Saindo mais uma!', 'Movimento fraco hoje...', 'Fecha a conta aí?']) : pick(FALAS);
    balões.push({ id: quem.id, txt: txt.length > 42 ? txt.slice(0, 41) + '…' : txt, t0: t, dur: 2.6 + txt.length * .04, trab: quem.trab });
  }

  function quadro(now) {
    requestAnimationFrame(quadro);
    if (!pronto || !PANO) return;
    const dt = Math.max(0, Math.min(.05, (now - last) / 1000)); last = now; t += dt;
    g.setTransform(k * dpr, 0, 0, k * dpr, 0, -Y0 * k * dpr); g.imageSmoothingEnabled = false;
    g.fillStyle = '#140b07'; g.fillRect(0, Y0, BW, BH);
    g.drawImage(PANO, 0, 0);
    g.globalCompositeOperation = 'lighter';
    LAMPS.forEach(([x, y], n) => brilho(x, y + 30, 95, 'rgba(255,210,120,A)', .16 + .05 * Math.sin(t * 2 + n * 2)));
    brilho(JUKE[0], JUKE[1], 80, `hsla(${(t * 60) % 360},100%,60%,A)`, .28);
    g.globalCompositeOperation = 'source-over';
    for (let n = 0; n < 3; n++) { const p = (t * .35 + n / 3) % 1; g.globalAlpha = Math.sin(p * 3.14); g.fillStyle = ['#ff8ad8', '#8ad8ff', '#ffe08a'][n]; g.font = "22px 'm6x11plus',monospace"; g.fillText(n % 2 ? '♫' : '♪', JUKE[0] + 14 + n * 6 + Math.sin(p * 6 + n) * 4, JUKE[1] - 55 - p * 45) } g.globalAlpha = 1;

    // Seu Zé (o Claude) atrás do balcão: anda entre os pontos; trabalhando fica no notebook dele
    if (zeP && ZE) {
      const info = zeP.info || {};
      if (info.trab) zeP.alvo = 800;
      if (Math.abs(zeP.alvo - zeP.x) < 1) { zeP.espera -= dt; if (zeP.espera <= 0 && !info.trab) { zeP.alvo = pick([752, 792, 832, 760, 840]); zeP.espera = 2 + Math.random() * 3 } }
      else { const d = Math.sign(zeP.alvo - zeP.x); zeP.x += d * Math.min(Math.abs(zeP.alvo - zeP.x), 54 * dt); zeP.flip = d < 0 }
      const bob = info.trab ? (Math.sin(t * 14) > 0 ? -1 : 0) : (Math.sin(t * 2) > .7 ? -1 : 0);
      g.save(); g.beginPath(); g.rect(0, 0, BW, COUNTER); g.clip(); put(ZE, zeP.x, 428, 2.3, zeP.flip, bob); g.restore();
      notebook(800, COUNTER + 3, 2.3, !!info.trab, false, t * 4);
    }
    // pessoas (de trás para a frente)
    for (const p of pessoas.slice().sort((a, b) => a.y - b.y)) {
      const typing = p.trab ? (Math.sin(t * 16 + p.ph) > 0 ? -1.5 : 0) : 0;
      const gole = !p.trab && ((t + p.ph) % (4 + p.ph % 3)) < .5;
      const resp = !p.trab && Math.sin(t * .5 + p.ph) > .6 ? -1 : 0;
      if (p.k === 'd') {        // ajudante temporário: em pé; trabalhando segura o notebook, à toa dança
        sombra(p.x, p.y - 3, 28, 8);
        if (p.trab) { put(DAN[p.i], p.x, p.y, p.s, p.flip, typing); notebook(p.x + 6, p.y - 64 * p.s * .45, 1.6, true, true, t * 4 + p.ph) }
        else { const b = t * 2 + p.ph, up = Math.sin(b * 3.14) > 0; put(DAN[p.i], p.x, p.y, p.s, (Math.floor(b / 2) % 2) === 1, up ? -3 : 0, up ? .97 : 1.03, up ? 1.03 : .97) }
      } else {
        if (p.k === 'b') put(BAL[p.i], p.x, p.y, p.s, false, typing + resp);
        else put(SIT[p.i], p.x, p.y, p.s, p.flip, typing + resp - (gole ? 1.5 : 0), 1, gole ? 1.02 : 1);
        notebook(p.lap[0], p.lap[1], p.s, p.trab, !!p.lap[2], t * 4 + p.ph);
      }
      marca(p);
    }
    // garçom passando (só ambiente)
    if (WALK.length) {
      if (garcom.para > 0) garcom.para -= dt; else { garcom.x += garcom.dir * 70 * dt; if (garcom.x > BW + 60 || garcom.x < -60) { garcom.dir *= -1; garcom.para = 3 + Math.random() * 4 } if (Math.random() < dt * .08) garcom.para = 1.5 }
      sombra(garcom.x, 608, 38, 10); put(garcom.para > 0 ? WALK[0] : WALK[1 + Math.floor(t * 10) % 8], garcom.x, 612, 2.9, garcom.dir < 0);
      if (garcom.para > 0 && garcom.x > 0 && garcom.x < BW && !balões.some(b => b.id === '__garcom') && Math.random() < dt) balões.push({ id: '__garcom', txt: pick(F_GARCOM), t0: t, dur: 2.5 });
    }
    // balões e etiqueta
    falar(dt);
    for (const b of balões) {
      let x, y;
      if (b.id === '__ze') { x = zeP.x; y = 428 - 64 * 2.3 - 14 }
      else if (b.id === '__garcom') { x = garcom.x; y = 612 - 64 * 2.9 - 8 }
      else { const p = pessoas.find(q => q.id === b.id); if (!p) continue; x = p.x; y = p.y - 64 * p.s - 18 }
      balao(x, y, b.txt, b.trab ? 'trab' : '');
    }
    if (sobre) { const p = sobre.id === (zeP.info || {}).id ? { ...zeP.info, x: zeP.x, y: 428, s: 2.3 } : pessoas.find(q => q.id === sobre.id); if (p) etiqueta(p) }
  }
  return { iniciar, atualizar };
})();
