/*
 * <mapa-lotes regiao="minas" inicial="pink-bourbon">
 * Elemento personalizado: mapa esquemático dos lotes de uma região + ficha.
 * Lê window.FAZENDA_LOTES (js/lotes.js) e window.FAZENDA_LOJA (js/loja.js), ou os atributos dados="{json}" / src="url". Imagens dos pacotes: atributo base-imagens.
 * (texto e lista dos lotes) continua visível: é a versão em texto.
 *
 * Interação: o mouse sobre o lote, o toque, ou o foco por teclado abrem a ficha.
 * Setas movem entre lotes. A ficha fica numa região aria-live.
 */
(function () {
  const NS = "http://www.w3.org/2000/svg";
  const W = 160, H = 100;

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function centroide(p) {
    let a = 0, cx = 0, cy = 0;
    for (let i = 0; i < p.length; i++) {
      const [x0, y0] = p[i], [x1, y1] = p[(i + 1) % p.length];
      const k = x0 * y1 - x1 * y0;
      a += k; cx += (x0 + x1) * k; cy += (y0 + y1) * k;
    }
    a *= 0.5;
    return [cx / (6 * a), cy / (6 * a)];
  }


  // ---- Mapa com cara de mapa (23/11): bordas irregulares, mata, água, estrada ----
  // Campo de deslocamento suave: o mesmo ponto sempre se desloca igual, então a divisa entre dois lotes continua batendo.
  const campo = (x, y, a) => [
    a * (0.6 * Math.sin(x * 0.23 + y * 0.11) + 0.4 * Math.sin(x * 0.07 - y * 0.31 + 2.1) + 0.25 * Math.sin(x * 0.61 + y * 0.43)),
    a * (0.6 * Math.cos(x * 0.17 - y * 0.21 + 0.7) + 0.4 * Math.sin(x * 0.29 + y * 0.05 + 1.3) + 0.25 * Math.cos(x * 0.53 - y * 0.47)),
  ];
  function irregular(pts, a = 2.2, passo = 2.4, fechado = true) {
    const out = [];
    const m = fechado ? pts.length : pts.length - 1;
    for (let i = 0; i < m; i++) {
      const p = pts[i], q = pts[(i + 1) % pts.length];
      const n = Math.max(1, Math.ceil(Math.hypot(q[0] - p[0], q[1] - p[1]) / passo));
      for (let k = 0; k < n; k++) {
        const x = p[0] + (q[0] - p[0]) * k / n, y = p[1] + (q[1] - p[1]) * k / n;
        const [dx, dy] = campo(x, y, a);
        out.push([x + dx, y + dy]);
      }
    }
    if (!fechado) { const q = pts[pts.length - 1]; const [dx, dy] = campo(q[0], q[1], a); out.push([q[0] + dx, q[1] + dy]); }
    return out;
  }
  // Catmull-Rom -> Bézier
  function suave(pts, fechado = true) {
    const n = pts.length, P = (i) => pts[fechado ? (i + n) % n : Math.max(0, Math.min(n - 1, i))];
    let d = `M${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
    const fim = fechado ? n : n - 1;
    for (let i = 0; i < fim; i++) {
      const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += `C${c1[0].toFixed(2)} ${c1[1].toFixed(2)} ${c2[0].toFixed(2)} ${c2[1].toFixed(2)} ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
    }
    return fechado ? d + "Z" : d;
  }
  const forma = (pts, a, passo) => suave(irregular(pts, a, passo));
  const linha = (pts, a = 1.2) => suave(irregular(pts, a, 3, false), false);
  function dentro(pt, poly) {
    let c = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [xi, yi] = poly[i], [xj, yj] = poly[j];
      if ((yi > pt[1]) !== (yj > pt[1]) && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) c = !c;
    }
    return c;
  }
  function casca(pontos) { // fecho convexo
    const p = pontos.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = [], hi = [];
    for (const q of p) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
    for (const q of p.reverse()) { while (hi.length >= 2 && cr(hi[hi.length - 2], hi[hi.length - 1], q) <= 0) hi.pop(); hi.push(q); }
    return lo.slice(0, -1).concat(hi.slice(0, -1));
  }
  function fundoMapa(reg) {
    const todos = reg.lotes.flatMap((l) => l.pontos);
    const cx = todos.reduce((s, p) => s + p[0], 0) / todos.length, cy = todos.reduce((s, p) => s + p[1], 0) / todos.length;
    const divisa = casca(todos).map(([x, y]) => [cx + (x - cx) * 1.07, cy + (y - cy) * 1.09]);
    const agua = reg.agua || [];
    // mata: copas soltas onde não há lote nem água
    let mata = "";
    for (let y = -4; y < H + 4; y += 3.1) for (let x = -2; x < W + 2; x += 3.3) {
      const jx = x + 1.2 * Math.sin(y * 1.7 + x), jy = y + 1.1 * Math.cos(x * 1.3 - y);
      if (reg.lotes.some((l) => dentro([jx, jy], l.pontos))) continue;
      if (agua.some((a) => dentro([jx, jy], a))) continue;
      const ruido = Math.sin(jx * 0.13 + 1.1) + Math.cos(jy * 0.19 - 0.4) + 0.6 * Math.sin((jx + jy) * 0.31);
      if (ruido < 0.15) continue;
      const r = 0.95 + 0.45 * ((Math.sin(jx * 3.1 + jy * 2.7) + 1) / 2);
      mata += `<circle cx="${jx.toFixed(1)}" cy="${jy.toFixed(1)}" r="${r.toFixed(2)}"/>`;
    }
    const rios = (reg.rios || []).map((r) => `<path class="rio" d="${linha(r, 1.1)}"/>`).join("");
    const estradas = (reg.estradas || []).map((r) => `<path class="estrada" d="${linha(r, 0.9)}"/>`).join("");
    const aguas = agua.map((a) => `<path class="agua" d="${forma(a, 1.6, 2)}"/>`).join("");
    const marcos = (reg.marcos || []).map((m) => m.tipo === "pico"
      ? `<g class="marco" transform="translate(${m.x} ${m.y})"><path d="M-2.6 1.6L0 -2.6L2.6 1.6Z"/><text y="5.4">${esc(m.nome)}</text></g>`
      : `<g class="marco" transform="translate(${m.x} ${m.y})"><path d="M-1.8 1.4V-0.4L0 -1.9L1.8 -0.4V1.4Z"/><text y="5">${esc(m.nome)}</text></g>`).join("");
    const rotAgua = (reg.rotulosAgua || []).map((r) => `<text class="rot-agua" x="${r.x}" y="${r.y}">${esc(r.nome)}</text>`).join("");
    return `
      <defs>
        <pattern id="linhas-cafe" width="2.2" height="2.2" patternUnits="userSpaceOnUse" patternTransform="rotate(38)"><line x1="0" y1="0" x2="0" y2="2.2" class="fileira"/></pattern>
        <pattern id="linhas-cafe-on" width="2.2" height="2.2" patternUnits="userSpaceOnUse" patternTransform="rotate(38)"><line x1="0" y1="0" x2="0" y2="2.2" class="fileira fileira--on"/></pattern>
      </defs>
      <rect class="terreno" x="-4" y="-6" width="${W + 8}" height="${H + 10}"/>
      <g class="mata">${mata}</g>
      ${aguas}${rotAgua}${rios}${estradas}
      <path class="divisa" d="${forma(divisa, 1.8, 3)}"/>
      ${marcos}
      <g class="rosa" transform="translate(${W - 4} 2)"><circle r="3.4"/><path d="M0 -3L1.1 0.6L0 0L-1.1 0.6Z"/><text y="-4.4">N</text></g>`;
  }
  // Curvas de nível: campo de altura (morros suaves) + marching squares.
  function curvas(relevo) {
    const step = 2, nx = W / step + 1, ny = H / step + 1;
    const f = (x, y) => {
      let v = 0.04 * Math.sin(x / 9) * Math.cos(y / 7);
      for (const m of relevo) v += m.h * Math.exp(-((x - m.x) ** 2 + (y - m.y) ** 2) / (2 * m.r * m.r));
      return v;
    };
    const g = [];
    for (let j = 0; j < ny; j++) { g[j] = []; for (let i = 0; i < nx; i++) g[j][i] = f(i * step, j * step); }
    const max = Math.max(...g.flat());
    const niveis = [];
    for (let t = 0.1; t < max; t += 0.1) niveis.push(t);
    let d = "";
    const lerp = (p, q, vp, vq, t) => { const k = (t - vp) / (vq - vp); return [p[0] + (q[0] - p[0]) * k, p[1] + (q[1] - p[1]) * k]; };
    for (const t of niveis) {
      for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
        const a = g[j][i], b = g[j][i + 1], c = g[j + 1][i + 1], dd = g[j + 1][i];
        const idx = (a > t ? 8 : 0) | (b > t ? 4 : 0) | (c > t ? 2 : 0) | (dd > t ? 1 : 0);
        if (idx === 0 || idx === 15) continue;
        const A = [i * step, j * step], B = [(i + 1) * step, j * step], C = [(i + 1) * step, (j + 1) * step], D = [i * step, (j + 1) * step];
        const top = () => lerp(A, B, a, b, t), right = () => lerp(B, C, b, c, t), bottom = () => lerp(D, C, dd, c, t), left = () => lerp(A, D, a, dd, t);
        const seg = (p, q) => { d += `M${p[0].toFixed(1)} ${p[1].toFixed(1)}L${q[0].toFixed(1)} ${q[1].toFixed(1)}`; };
        switch (idx) {
          case 1: case 14: seg(left(), bottom()); break;
          case 2: case 13: seg(bottom(), right()); break;
          case 3: case 12: seg(left(), right()); break;
          case 4: case 11: seg(top(), right()); break;
          case 5: seg(top(), left()); seg(bottom(), right()); break;
          case 6: case 9: seg(top(), bottom()); break;
          case 7: case 8: seg(top(), left()); break;
          case 10: seg(top(), right()); seg(left(), bottom()); break;
        }
      }
    }
    return d;
  }
  const CSS = `
    :host { display: block; }
    * { box-sizing: border-box; }
    .mapa { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); column-gap: var(--gutter, 24px); align-items: start; }
    ::slotted([slot="texto"]) { grid-column: 1 / -1; max-width: 72ch; margin-bottom: 32px; }
    .esq { min-width: 0; }
    .dir { min-width: 0; }
    .palco { position: relative; }
    svg { display: block; width: 100%; height: auto; aspect-ratio: 168 / 110; background: #F4F1E6; overflow: hidden; border: 1px solid #E2E6E4; box-shadow: 0 18px 50px rgba(30,40,38,0.08); }
    .lote { cursor: pointer; outline: none; }
    .lote .topo path:first-child { fill: #CFE2DA; stroke: #F4F1E6; stroke-width: 1.3; stroke-linejoin: round; transition: fill 160ms ease; }
    .lote text, .elevado text { fill: var(--ink, #2A1A1E); font-family: var(--font-display, sans-serif); font-weight: 700; font-size: var(--fs, 3.4px); text-anchor: middle; pointer-events: none; letter-spacing: 0.01em; }
    .lote.destaque .topo path:first-child { fill: #EBC9D3; }
    .lote.destaque text { fill: var(--ameixa, #580438); }
    .lote.on .topo path:first-child { fill: #A9CFC4; }
    .lote.on.destaque .topo path:first-child { fill: #DDA9B9; }
    .lote.on text { opacity: 0; }
    .lote:focus-visible .topo path:first-child { stroke: var(--ink, #2A1A1E); stroke-width: 1.4; }
    @media (hover: hover) and (pointer: fine) { .lote:not(.on):hover .topo path:first-child { fill: #B9D8CE; } .lote.destaque:not(.on):hover .topo path:first-child { fill: #E3B7C5; } }
    .elevado { pointer-events: none; }
    .elevado .lado { fill: #B86214; stroke: #B86214; stroke-width: 1.6; stroke-linejoin: round; }
    .elevado .tampa-fileiras { fill: url(#linhas-cafe-on); stroke: none; transform: translate(-1.2px, -2.6px); } .elevado .tampa { fill: #F2B27A; stroke: #F4F1E6; stroke-width: 1.2; stroke-linejoin: round; transform: translate(-1.2px, -2.6px); filter: drop-shadow(0.4px 1.8px 1.4px rgba(42, 26, 30, 0.42)); } /* taste-skill-ignore: o lote levantado flutua */
    .elevado text { transform: translate(-1.2px, -2.6px); }
    .terreno { fill: #F4F1E6; }
    .mata circle { fill: #9DBB9A; fill-opacity: 0.55; }
    .agua { fill: #BFE3E6; stroke: #7FC0C8; stroke-width: 0.35; }
    .rio { fill: none; stroke: #8CCAD2; stroke-width: 1.1; stroke-linecap: round; }
    .estrada { fill: none; stroke: #C9A57E; stroke-width: 0.7; stroke-dasharray: 2 1.2; stroke-linecap: round; }
    .divisa { fill: none; stroke: var(--ink, #2A1A1E); stroke-opacity: 0.45; stroke-width: 0.35; stroke-dasharray: 1.4 0.9; }
    .fileiras { fill: url(#linhas-cafe); stroke: none !important; pointer-events: none; }
    .fileira { stroke: #2E6563; stroke-opacity: 0.3; stroke-width: 0.45; }
    .fileira--on { stroke: #9A4F0B; stroke-opacity: 0.45; }
    .marco path { fill: var(--ink, #2A1A1E); fill-opacity: 0.7; }
    .marco text, .rot-agua, .rosa text { font-family: var(--font-text, sans-serif); font-size: calc(var(--fs, 3.4px) * 0.72); fill: var(--ink, #2A1A1E); fill-opacity: 0.75; text-anchor: middle; letter-spacing: 0.08em; }
    .rot-agua { fill: #2E6563; font-style: italic; }
    .rosa circle { fill: #F4F1E6; stroke: var(--ink, #2A1A1E); stroke-opacity: 0.5; stroke-width: 0.3; } .rosa path { fill: var(--ink, #2A1A1E); fill-opacity: 0.75; } .rosa text { font-weight: 700; }
    .curvas { fill: none; stroke: #2E6563; stroke-opacity: 0.2; stroke-width: 0.26; stroke-linecap: round; pointer-events: none; }
    .nota { margin: 12px 0 0; font-size: var(--step-small, 16px); line-height: 1.45; color: var(--ink, #2A1A1E); }
    .nota b { font-weight: 500; }
    .chips { display: flex; flex-wrap: wrap; gap: 8px; margin: 16px 0 0; padding: 0; list-style: none; }
    .chip { min-height: 44px; padding: 0 16px; border: 0; border-radius: 0; font: 500 var(--step-body, 17px)/1 var(--font-text, sans-serif); color: var(--ink, #2A1A1E); background: #FFFFFF; box-shadow: inset 0 0 0 1px #D5DCD9; cursor: pointer; transition: background-color 160ms ease, transform 140ms var(--ease-out, ease); }
    .chip.on { background: #F2B27A; box-shadow: inset 0 0 0 1px #B86214; }
    .chip:active { transform: scale(0.97); }
    .chip:focus-visible, .troca button:focus-visible, .verloja:focus-visible { outline: 3px solid var(--ink, #2A1A1E); outline-offset: 2px; }
    @media (hover: hover) and (pointer: fine) { .chip:not(.on):hover { background: #E4F1EC; } }
    .ficha { background: var(--ficha, #FFFFFF); color: var(--ink, #2A1A1E); padding: 24px; }
    .ficha[data-vazio] { display: none; }
    .prod { display: grid; grid-template-columns: minmax(0, 40%) minmax(0, 1fr); gap: 22px; align-items: start; }
    .prod__pacote { width: 100%; height: auto; max-height: 340px; object-fit: contain; }
    .prod__tipo { margin: 0 0 4px; font: 500 var(--step-small, 16px)/1.2 var(--font-text, sans-serif); color: var(--teal-escuro, #2E6563); }
    .ficha h3 { margin: 0; font: 700 var(--step-lead, 1.75rem)/1 var(--font-display, sans-serif); letter-spacing: -0.02em; text-wrap: balance; }
    .ficha h4 { margin: 24px 0 8px; font: 700 var(--step-lead, 1.75rem)/1 var(--font-display, sans-serif); letter-spacing: -0.02em; }
    .ficha p { margin: 0; }
    .prod__info > p { margin-top: 8px; font-size: var(--step-small, 16px); line-height: 1.45; }
    .troca { display: flex; gap: 8px; margin: 10px 0 0; }
    .troca button { min-height: 44px; padding: 0 14px; border: 0; border-radius: 0; font: 500 var(--step-small, 16px)/1 var(--font-text, sans-serif); background: var(--aqua, #E4F1F1); color: var(--ink, #2A1A1E); cursor: pointer; }
    .troca button[aria-pressed="true"] { background: var(--lote, #5B9596); }
    .verloja { display: inline-flex; align-items: center; justify-content: center; min-height: 48px; margin-top: 14px; padding: 0 22px; background: var(--accent, #DC7519); color: var(--ink, #2A1A1E); font: 500 var(--step-body, 17px)/1 var(--font-text, sans-serif); text-decoration: none; transition: background-color 180ms ease, transform 140ms var(--ease-out, ease); }
    .verloja:active { transform: scale(0.97); }
    @media (hover: hover) and (pointer: fine) { .verloja:hover { background: var(--accent-hover, #E58A38); } }
    .semloja { margin-top: 12px !important; font-size: var(--step-body, 17px) !important; }
    .linhas { margin: 0; padding: 0; }
    .linha { display: flex; align-items: baseline; gap: 8px; padding: 5px 0; font-size: var(--step-body, 17px); line-height: 1.35; font-variant-numeric: tabular-nums; }
    .linha--ex { display: var(--exemplo-linha, flex); }
    .linha dt { margin: 0; flex: none; }
    .linha .pontos { flex: 1 1 12px; min-width: 12px; height: 0; border-bottom: 4px dotted var(--ink, #2A1A1E); opacity: 0.4; transform: translateY(-3px); }
    .linha dd { margin: 0; flex: none; max-width: 62%; text-align: right; font-weight: 500; }
    .selo { display: inline-block; margin-left: 8px; padding: 2px 8px; background: var(--marker, #D4AC84); color: var(--ink, #2A1A1E); font: 500 var(--step-small, 16px)/1.2 var(--font-text, sans-serif); font-style: normal; white-space: nowrap; vertical-align: 1px; }
    .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
    .rodape { margin: 12px 0 0 !important; font-size: var(--step-small, 16px); line-height: 1.45; }
    .rodape strong { font-weight: 500; }
    .aviso { margin-top: 10px !important; font-size: var(--step-small, 16px); line-height: 1.45; }
    @media (prefers-reduced-motion: no-preference) {
      .ficha.anima { animation: ficha-in 320ms var(--ease-out, ease) both; }
      .prod__pacote { animation: pacote-in 480ms var(--ease-out, ease) both; }
      .elevado .tampa, .elevado .tampa-fileiras, .elevado text { animation: sobe-lote 260ms var(--ease-out, ease) both; }
      @keyframes ficha-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
      @keyframes pacote-in { from { opacity: 0; transform: translateY(18px) scale(0.96); } to { opacity: 1; transform: none; } }
      @keyframes sobe-lote { from { transform: translate(0, 0); } to { transform: translate(-1.2px, -2.6px); } }
    }
    @media (max-width: 999px) {
      .mapa { grid-template-columns: 1fr; }
      .esq, .dir { display: contents; }
      .palco { order: 1; margin-bottom: 20px; } .ficha { order: 2; } .chips { order: 3; margin-top: 20px; } .nota { order: 4; }
      ::slotted([slot="texto"]) { order: 5; margin: 24px 0 0; }
    }
    @media (max-width: 560px) { .ficha { padding: 20px 16px; } .prod { grid-template-columns: 30% 1fr; gap: 14px; } .linha { flex-wrap: wrap; } .linha dd { max-width: 100%; text-align: left; } }
  `;

  
  class MapaLotes extends HTMLElement {
    connectedCallback() {
      if (this._pronto || this._carregando) return;
      const attr = this.getAttribute("dados");
      const src = this.getAttribute("src");
      if (attr) { try { return this._monta(JSON.parse(attr)); } catch (e) { console.error("mapa-lotes: atributo dados inválido", e); return; } }
      if (src) {
        this._carregando = true;
        fetch(src).then((r) => r.json()).then((d) => { this._carregando = false; this._monta(d); }).catch((e) => { this._carregando = false; console.error("mapa-lotes: não carreguei", src, e); });
        return;
      }
      if (window.FAZENDA_LOTES) this._monta(Object.assign({}, window.FAZENDA_LOTES, { loja: window.FAZENDA_LOTES.loja || window.FAZENDA_LOJA }));
    }

    _monta(dados) {
      if (this._pronto) return;
      const reg = dados.regioes.find((r) => r.id === this.getAttribute("regiao"));
      if (!reg) return;
      this._pronto = true;
      this._reg = reg;
      this._dados = dados;
      this._loja = dados.loja || { produtos: {}, imgBase: "" };
      this._base = this.getAttribute("base-imagens") || this._loja.imgBase || "";
      this._idxProd = 0;
      const root = this.attachShadow({ mode: "open" });
      root.innerHTML = `<style>${CSS}</style>
        <div class="mapa">
          <slot name="texto"></slot>
          <div class="esq">
            <div class="palco">
              <svg viewBox="-4 -6 ${W + 8} ${H + 10}" role="group" aria-label="Mapa esquemático dos lotes: ${esc(reg.nome)}"></svg>
              
            </div>
            <ul class="chips" aria-label="Lotes: ${esc(reg.nome)}"></ul>
            <p class="nota"><b>Mapa ilustrativo, fora de escala.</b> A divisão dos lotes, a mata, a água, a estrada e as curvas de nível são ilustrativas.</p>
          </div>
          <div class="dir">
            <article class="ficha" data-vazio aria-live="polite" aria-atomic="true"></article>
          </div>
        </div>`;
      this._svg = root.querySelector("svg");
      this._palco = root.querySelector(".palco");
      this._ficha = root.querySelector(".ficha");
      const chips = root.querySelector(".chips");
      this._svg.insertAdjacentHTML("beforeend", fundoMapa(reg));
      const grupo = document.createElementNS(NS, "g");
      this._svg.appendChild(grupo);
      this._lotes = [];
      this._chips = [];

      reg.lotes.forEach((l) => {
        const g = document.createElementNS(NS, "g");
        g.setAttribute("class", l.destaque ? "lote destaque" : "lote");
        g.setAttribute("tabindex", "0");
        g.setAttribute("role", "button");
        g.setAttribute("aria-pressed", "false");
        g.setAttribute("aria-label", `${l.nome}, ${reg.nome}`);
        g.dataset.id = l.id;
        const topo = document.createElementNS(NS, "g");
        topo.setAttribute("class", "topo");
        const poly = document.createElementNS(NS, "path");
        l._d = forma(l.pontos);
        poly.setAttribute("d", l._d);
        topo.appendChild(poly);
        const fil = document.createElementNS(NS, "path");
        fil.setAttribute("class", "fileiras"); fil.setAttribute("d", l._d);
        topo.appendChild(fil);
        const [cx, cy] = centroide(l.pontos);
        const t = document.createElementNS(NS, "text");
        l.rotulo.forEach((linha, k) => {
          const ts = document.createElementNS(NS, "tspan");
          ts.setAttribute("x", cx.toFixed(1));
          ts.setAttribute("dy", k === 0 ? (l.rotulo.length > 1 ? "-0.1em" : "0.35em") : "1.05em");
          ts.textContent = linha;
          t.appendChild(ts);
        });
        t.setAttribute("y", cy.toFixed(1));
        topo.appendChild(t);
        g.appendChild(topo);
        l._c = [cx, cy];
        grupo.appendChild(g);
        this._lotes.push(g);

        const li = document.createElement("li");
        const b = document.createElement("button");
        b.type = "button"; b.className = "chip"; b.dataset.id = l.id; b.textContent = l.nome;
        b.setAttribute("aria-pressed", "false");
        li.appendChild(b); chips.appendChild(li);
        this._chips.push(b);
      });

      const curv = document.createElementNS(NS, "path");
      curv.setAttribute("class", "curvas");
      curv.setAttribute("d", curvas(reg.relevo));
      this._svg.appendChild(curv);
      // o lote levantado é uma cópia desenhada por cima; o lote de verdade não muda de lugar (o foco do teclado fica nele)
      this._elev = document.createElementNS(NS, "g");
      this._elev.setAttribute("class", "elevado");
      this._elev.setAttribute("aria-hidden", "true");
      this._svg.appendChild(this._elev);

      const ativa = (id) => this.abrir(id);
      this._lotes.forEach((g) => {
        g.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") ativa(g.dataset.id); });
        g.addEventListener("focus", () => ativa(g.dataset.id));
        g.addEventListener("click", () => ativa(g.dataset.id));
        g.addEventListener("keydown", (e) => this._tecla(e, g, this._lotes));
      });
      this._chips.forEach((b) => {
        b.addEventListener("focus", () => ativa(b.dataset.id));
        b.addEventListener("click", () => ativa(b.dataset.id));
        b.addEventListener("keydown", (e) => this._tecla(e, b, this._chips));
      });

      const ajusta = () => {
        const w = this._svg.getBoundingClientRect().width || W;
        this._svg.style.setProperty("--fs", (14 * (W + 8) / w).toFixed(2) + "px");
      };
      ajusta();
      if ("ResizeObserver" in window) new ResizeObserver(ajusta).observe(this._svg);

      const ini = this.getAttribute("inicial") || reg.lotes[0].id;
      this.abrir(ini, "inicio");
    }

    _tecla(e, el, lista) {
      const i = lista.indexOf(el);
      let n = -1;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") n = (i + 1) % lista.length;
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = (i - 1 + lista.length) % lista.length;
      else if (e.key === "Home") n = 0;
      else if (e.key === "End") n = lista.length - 1;
      else if ((e.key === "Enter" || e.key === " ") && el.tagName.toLowerCase() === "g") { e.preventDefault(); this.abrir(el.dataset.id); return; }
      if (n >= 0) { e.preventDefault(); lista[n].focus(); }
    }

    _produtos(l) { return (l.produtos || []).map((h) => this._loja.produtos[h]).filter(Boolean); }

    // abrir(id, via, produto): produto é o handle do café a mostrar (Gesha ou Wush Wush)
    abrir(id, via, produto) {
      const reg = this._reg;
      const l = reg.lotes.find((x) => x.id === id);
      if (!l) return;
      const prods = this._produtos(l);
      if (produto) { const k = prods.findIndex((p) => p.handle === produto); if (k >= 0) this._idxProd = k; }
      else if (this._atual !== id) this._idxProd = 0;
      const mudou = this._atual !== id;
      if (!mudou && !produto && via !== "inicio") return;
      this._atual = id;
      this._lotes.forEach((g) => { const on = g.dataset.id === id; g.classList.toggle("on", on); g.setAttribute("aria-pressed", on); });
      this._chips.forEach((b) => { const on = b.dataset.id === id; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); });
      this._levanta(l, mudou);
      this._renderFicha(reg, l, via !== "inicio" && mudou);
    }

    _levanta(l, anima) {
      const pts = l.pontos.map((p) => p.join(",")).join(" ");
      const [cx, cy] = l._c;
      const g = this._lotes.find((x) => x.dataset.id === l.id);
      const rot = [...g.querySelectorAll("tspan")].map((ts) => ts.outerHTML).join("");
      this._elev.innerHTML = `<path class="lado" d="${l._d}"></path><path class="tampa" d="${l._d}"></path><path class="tampa-fileiras" d="${l._d}"></path><text y="${cy.toFixed(1)}">${rot}</text>`;
      if (!anima) this._elev.classList.add("fixo");
    }

    _linhasLote(l, temProduto) {
      const rot = this._dados.rotulosCampos;
      const ordem = temProduto ? ["altitude", "area", "pes", "ano", "sombra"] : ["altitude", "area", "pes", "ano", "sombra", "processo"];
      const fontes = new Set();
      const html = ordem.map((k) => {
        const c = l.campos[k];
        if (!c) return "";
        if ((c.f === "fonte" || c.f === "regiao") && c.fonte) fontes.add(c.fonte);
        const ex = c.f === "exemplo";
        const valor = ex && c.v === "a confirmar" ? "–" : c.v;
        const selo = ex ? `<span class="selo" data-placeholder="true">a confirmar<span class="sr">: dado de exemplo</span></span>` : "";
        return `<div class="linha${ex ? " linha--ex" : ""}"><dt>${esc(rot[k])}</dt><span class="pontos" aria-hidden="true"></span><dd>${esc(valor)}${selo}</dd></div>`;
      }).join("");
      return { html, fontes };
    }

    _blocoLoja(l) {
      const L = this._loja;
      const nomes = (hs) => hs.map((h) => L.produtos[h]).filter(Boolean).map((p) => esc(p.nome));
      const blends = nomes(l.blends || []);
      const outros = nomes(l.outros || []);
      if (blends.length) return `<p class="semloja">Esta variedade ainda não tem um café só dela. Ela entra no blend ${blends.join(", ")}, da Um Coffee Co.</p>`;
      if (outros.length) return `<p class="semloja">Sem café único para este lote. Outros cafés da Fazenda Um (MG): ${outros.join(", ")}.</p>`;
      return `<p class="semloja">Esta variedade ainda não tem um café só dela.</p>`;
    }

    _renderFicha(reg, l, anima, focoProd) {
      const prods = this._produtos(l);
      const p = prods[this._idxProd];
      const L = this._loja;
      const f = this._ficha;
      f.removeAttribute("data-vazio");
      const lote = this._linhasLote(l, !!p);
      let topo;
      if (p) {
        const meta = [p.variedade, p.regiaoConflito ? "" : p.regiao].filter(Boolean).join(" · ");
        const selo = l.regiaoEx ? `<span class="selo" data-placeholder="true">região a confirmar<span class="sr">: dado de exemplo</span></span>` : "";
        const troca = prods.length > 1 ? `<div class="troca" role="group" aria-label="Escolher o café">${prods.map((q, i) => `<button type="button" data-i="${i}" aria-pressed="${i === this._idxProd}">${esc(q.nome)}</button>`).join("")}</div>` : "";
        topo = `<div class="prod">
          <img class="prod__pacote" src="${esc(this._base + p.img)}" alt="Pacote do café ${esc(p.nome)}, Um Coffee Co.">
          <div class="prod__info">
            <p class="prod__tipo">${esc(p.tipo)}</p>
            <h3>${esc(p.nome)}</h3>${troca}
            <p>${esc(meta || "Região não informada")}${selo}</p>
            ${p.regiaoConflito ? `<p>${esc(p.regiaoConflito)}</p>` : ""}
            ${p.notas && p.notas.length ? `<p>Notas: ${esc(p.notas.join(", "))}.</p>` : ""}
            ${p.sca ? `<p>${esc(p.sca)} pontos SCA</p>` : ""}
            ${p.processo ? `<p>Processo: ${esc(p.processo)}</p>` : ""}
            ${p.sobre ? `<p>${esc(p.sobre)}</p>` : ""}
            <a class="verloja" href="contato.html">Falar com a fazenda</a>
          </div>
        </div>
        <p class="aviso">Fonte: descrição do produto, Um Coffee Co.</p>
        <h4>${esc(l.nome)}</h4>`;
      } else {
        topo = `<h3>${esc(l.nome)}</h3>
          <p class="aviso">${esc(l.variedade)} · ${esc(reg.nome)}</p>
          ${this._blocoLoja(l)}`;
      }
      f.innerHTML = `${topo}
        <dl class="linhas">${lote.html}</dl>
        <p class="rodape"><strong>${esc(l.nota)}</strong>${lote.fontes.size ? " Fontes do lote: " + [...lote.fontes].map(esc).join(", ") + "." : ""}</p>`;
      f.querySelectorAll(".troca button").forEach((b) => b.addEventListener("click", () => {
        this._idxProd = Number(b.dataset.i);
        this._renderFicha(reg, l, false, this._idxProd);
      }));
      if (focoProd !== undefined) { const nb = f.querySelector(`.troca button[data-i="${focoProd}"]`); if (nb) nb.focus(); }
      if (anima) { f.classList.remove("anima"); void f.offsetWidth; f.classList.add("anima"); }
    }
  }

  if (!customElements.get("mapa-lotes")) customElements.define("mapa-lotes", MapaLotes);
})();
