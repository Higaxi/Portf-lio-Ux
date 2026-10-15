/**
 * Gera as capas ilustradas (SVG, nítidas em qualquer resolução) e as imagens
 * de compartilhamento (PNG 1200×630) dos estudos de caso.
 *
 *   node scripts/gerar-capas.mjs
 *
 * As capas são ILUSTRAÇÕES recriadas em código, não capturas das telas
 * originais. Nomes de jogadores e valores são fictícios.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import sharp from "sharp";
import { horaDoLar, podeRegularizar } from "./capas-extra.mjs";

const FONT = "Arial, Helvetica, sans-serif";

/* ---------- Premium League ---------- */

function shirt(x, y, color, stroke = "none") {
  // Camisa simples (36×32) centrada em x,y.
  return `<path transform="translate(${x - 18} ${y - 16})" d="M10 0 L0 6 L4 14 L8 12 L8 32 L28 32 L28 12 L32 14 L36 6 L26 0 Q18 6 10 0 Z" fill="${color}" stroke="${stroke}" stroke-width="1.5"/>`;
}

function player(x, y, color, name, stroke) {
  return `
  <g>
    <rect x="${x - 26}" y="${y - 40}" width="52" height="16" rx="8" fill="#14161c"/>
    <text x="${x}" y="${y - 28.5}" font-size="10" font-weight="700" fill="#fff" text-anchor="middle">$10,00</text>
    ${shirt(x, y, color, stroke)}
    <circle cx="${x - 16}" cy="${y + 14}" r="6" fill="#22c55e" stroke="#fff" stroke-width="1.5"/>
    <rect x="${x - 30}" y="${y + 20}" width="60" height="15" rx="4" fill="#fff"/>
    <text x="${x}" y="${y + 31}" font-size="9" fill="#14161c" text-anchor="middle">${name}</text>
  </g>`;
}

function premiumLeague() {
  const sx = 1142; // tela do celular da frente
  const sy = 82;
  const sw = 356;
  const pitch = { x: sx + 18, y: sy + 196, w: sw - 36, h: 300 };
  const cx = pitch.x + pitch.w / 2;
  const colors = ["#d62828", "#ffffff", "#1f2937"];
  const strokeFor = (c) => (c === "#ffffff" ? "#cbd5e1" : "none");
  const rows = [
    { y: pitch.y + 52, n: 3, names: ["A. Lima", "B. Rocha", "C. Neves"] },
    { y: pitch.y + 128, n: 3, names: ["D. Prado", "E. Sousa", "F. Melo"] },
    { y: pitch.y + 204, n: 4, names: ["G. Dias", "H. Reis", "I. Faria", "J. Lopes"] },
    { y: pitch.y + 272, n: 1, names: ["K. Braga"] },
  ];
  let players = "";
  let k = 0;
  for (const r of rows) {
    for (let i = 0; i < r.n; i++) {
      const x = pitch.x + (pitch.w / (r.n + 1)) * (i + 1);
      const c = colors[k++ % 3];
      players += player(x, r.y, c, r.names[i], strokeFor(c));
    }
  }
  let stripes = "";
  for (let i = 0; i < 6; i++) {
    stripes += `<rect x="${pitch.x}" y="${pitch.y + i * (pitch.h / 6)}" width="${pitch.w}" height="${pitch.h / 12}" fill="#2bb04f"/>`;
  }
  let bench = "";
  for (let i = 0; i < 5; i++) {
    const x = sx + 44 + i * 67;
    const c = colors[(i + 1) % 3];
    bench += `<rect x="${x - 24}" y="${sy + 548}" width="48" height="14" rx="7" fill="#14161c"/><text x="${x}" y="${sy + 558.5}" font-size="9" font-weight="700" fill="#fff" text-anchor="middle">$10,00</text>${shirt(x, sy + 584, c, strokeFor(c))}`;
  }
  const nav = ["Campeonatos", "Notificações", "Minha conta"]
    .map((t, i) => {
      const x = sx + sw / 6 + (i * sw) / 3;
      return `<circle cx="${x}" cy="${sy + 694}" r="9" fill="none" stroke="${i === 0 ? "#1e3bff" : "#6b7280"}" stroke-width="2"/><text x="${x}" y="${sy + 720}" font-size="10" fill="${i === 0 ? "#1e3bff" : "#6b7280"}" text-anchor="middle">${t}</text>`;
    })
    .join("");
  const actions = [0, 1, 2, 3]
    .map((i) => `<rect x="${sx + 18 + i * 46}" y="${sy + 622}" width="36" height="36" rx="9" fill="#fff" stroke="#d1d5db"/>`)
    .join("");

  // Celular de trás: a versão antiga, menor e desfocada.
  let oldDots = "";
  for (const [dx, dy] of [[0, -110], [-60, -70], [60, -70], [-30, -10], [30, -10], [0, 30], [-80, 50], [80, 50], [-40, 100], [40, 100], [0, 150]]) {
    oldDots += `<circle cx="${1000 + dx}" cy="${470 + dy}" r="11" fill="#facc15"/>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900" font-family="${FONT}">
  <defs>
    <filter id="blur" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="4"/></filter>
    <clipPath id="screen"><rect x="${sx}" y="${sy}" width="${sw}" height="756" rx="40"/></clipPath>
  </defs>
  <rect width="1600" height="900" fill="#1e3bff"/>
  <circle cx="1320" cy="450" r="520" fill="#2a47ff"/>
  <circle cx="1320" cy="450" r="360" fill="#3352ff"/>

  <text x="110" y="300" font-size="26" font-weight="700" letter-spacing="6" fill="#c7d2fe">PREMIUM LEAGUE</text>
  <text x="104" y="410" font-size="112" font-weight="700" letter-spacing="-4" fill="#ffffff">Escalação</text>
  <text x="104" y="520" font-size="112" font-weight="700" letter-spacing="-4" fill="#ffffff">redesenhada</text>
  <text x="110" y="590" font-size="30" fill="#e0e7ff">Fantasy game de futebol · app e desktop</text>

  <g transform="rotate(-9 1000 470)" filter="url(#blur)" opacity="0.7">
    <rect x="850" y="150" width="300" height="640" rx="44" fill="#0b0b0f"/>
    <rect x="862" y="162" width="276" height="616" rx="34" fill="#3b0b5c"/>
    <rect x="880" y="300" width="240" height="360" fill="#3f9d4a"/>
    ${oldDots}
  </g>

  <rect x="${sx - 12}" y="${sy - 12}" width="${sw + 24}" height="780" rx="52" fill="#0b0b0f"/>
  <g clip-path="url(#screen)">
    <rect x="${sx}" y="${sy}" width="${sw}" height="756" fill="#ffffff"/>
    <rect x="${sx}" y="${sy}" width="${sw}" height="92" fill="#1e3bff"/>
    <text x="${sx + 26}" y="${sy + 28}" font-size="13" font-weight="700" fill="#fff">9:41</text>
    <text x="${sx + sw / 2}" y="${sy + 70}" font-size="18" font-weight="700" fill="#fff" text-anchor="middle">Escalação</text>
    <path d="M${sx + 30} ${sy + 58} l-8 6 l8 6" stroke="#fff" stroke-width="2.5" fill="none"/>
    <g font-size="8.5" fill="#6b7280" text-anchor="middle">
      <text x="${sx + sw / 6}" y="${sy + 114}">PREÇO DO TIME</text>
      <text x="${sx + sw / 2}" y="${sy + 114}">MERCADO FECHA EM</text>
      <text x="${sx + (5 * sw) / 6}" y="${sy + 114}">PATRIMÔNIO</text>
    </g>
    <g font-size="13" font-weight="700" fill="#111827" text-anchor="middle">
      <text x="${sx + sw / 6}" y="${sy + 132}">$0,00</text>
      <text x="${sx + sw / 2}" y="${sy + 132}">01:00:00h</text>
      <text x="${sx + (5 * sw) / 6}" y="${sy + 132}">$120,00</text>
    </g>
    <rect x="${sx + 18}" y="${sy + 150}" width="78" height="30" rx="8" fill="#fff" stroke="#d1d5db"/>
    <text x="${sx + 34}" y="${sy + 170}" font-size="12" font-weight="700" fill="#111827">4-3-3 ▾</text>
    <rect x="${sx + sw - 82}" y="${sy + 150}" width="30" height="30" rx="8" fill="#1e3bff"/>
    <rect x="${sx + sw - 48}" y="${sy + 150}" width="30" height="30" rx="8" fill="#fff" stroke="#d1d5db"/>

    <rect x="${pitch.x}" y="${pitch.y}" width="${pitch.w}" height="${pitch.h}" rx="10" fill="#22a447"/>
    ${stripes}
    <g stroke="#ffffff" stroke-opacity="0.85" stroke-width="2" fill="none">
      <rect x="${pitch.x + 8}" y="${pitch.y + 8}" width="${pitch.w - 16}" height="${pitch.h - 16}" rx="4"/>
      <line x1="${pitch.x + 8}" y1="${pitch.y + pitch.h / 2}" x2="${pitch.x + pitch.w - 8}" y2="${pitch.y + pitch.h / 2}"/>
      <circle cx="${cx}" cy="${pitch.y + pitch.h / 2}" r="34"/>
      <rect x="${cx - 70}" y="${pitch.y + 8}" width="140" height="44"/>
      <rect x="${cx - 70}" y="${pitch.y + pitch.h - 52}" width="140" height="44"/>
    </g>
    ${players}
    <rect x="${pitch.x + pitch.w - 52}" y="${pitch.y + pitch.h - 34}" width="44" height="24" rx="6" fill="#111827"/>
    <text x="${pitch.x + pitch.w - 30}" y="${pitch.y + pitch.h - 17}" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">4-3-3</text>

    <text x="${sx + sw / 2}" y="${sy + 532}" font-size="12" fill="#4b5563" text-anchor="middle">Banco de reservas</text>
    ${bench}
    ${actions}
    <text x="${sx + sw - 18}" y="${sy + 636}" font-size="10" fill="#6b7280" text-anchor="end">Capitão escolhido:</text>
    <text x="${sx + sw - 18}" y="${sy + 654}" font-size="13" font-weight="700" fill="#111827" text-anchor="end">0 de 1</text>
    <rect x="${sx}" y="${sy + 672}" width="${sw}" height="84" fill="#f9fafb"/>
    ${nav}
    <rect x="${sx + sw / 2 - 60}" y="${sy + 742}" width="120" height="5" rx="2.5" fill="#111827"/>
  </g>
</svg>`;
}

/* ---------- Pormade ---------- */

function pormade() {
  const tx = 720; // tela do tablet
  const ty = 150;
  const tw = 790;
  const th = 600;
  const steps = ["Cliente", "Porta", "Medidas", "Acabamento", "Resumo"]
    .map((s, i) => {
      const y = ty + 120 + i * 62;
      const done = i < 4;
      return `<circle cx="${tx + 44}" cy="${y}" r="13" fill="${done ? "#111111" : "#fff"}" stroke="#111111" stroke-width="2"/>
      ${done ? `<path d="M${tx + 38} ${y} l4 4 l8 -8" stroke="#fff" stroke-width="2.5" fill="none"/>` : `<circle cx="${tx + 44}" cy="${y}" r="5" fill="#111111"/>`}
      <text x="${tx + 68}" y="${y + 5}" font-size="15" fill="#111111" font-weight="${i === 4 ? 700 : 400}">${s}</text>`;
    })
    .join("");
  const swatches = ["#c8a27a", "#8a5a33", "#e9e4dc", "#3a3a3a"]
    .map((c, i) => `<circle cx="${tx + 340 + i * 40}" cy="${ty + 492}" r="16" fill="${c}" stroke="${i === 1 ? "#111111" : "#d4d4d4"}" stroke-width="${i === 1 ? 3 : 1.5}"/>`)
    .join("");
  const lines = [
    ["Porta lisa · Freijó", "1 un."],
    ["Batente e guarnição", "1 jogo"],
    ["Fechadura e dobradiças", "1 kit"],
    ["Instalação", "incluída"],
  ]
    .map(([a, b], i) => {
      const y = ty + 150 + i * 46;
      return `<text x="${tx + 490}" y="${y}" font-size="14" fill="#111111">${a}</text><text x="${tx + tw - 36}" y="${y}" font-size="14" fill="#6b6b6b" text-anchor="end">${b}</text><line x1="${tx + 490}" y1="${y + 16}" x2="${tx + tw - 36}" y2="${y + 16}" stroke="#e5e5e5"/>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900" font-family="${FONT}">
  <rect width="1600" height="900" fill="#141210"/>
  <rect x="0" y="640" width="1600" height="260" fill="#1d1916"/>

  <text x="100" y="250" font-size="26" font-weight="700" letter-spacing="6" fill="#d9b48f">PORMADE</text>
  <text x="96" y="330" font-size="56" font-weight="700" letter-spacing="-2" fill="#f5f0ea">Gerador de</text>
  <text x="96" y="392" font-size="56" font-weight="700" letter-spacing="-2" fill="#f5f0ea">propostas</text>
  <text x="96" y="530" font-size="70" font-weight="700" letter-spacing="-2" fill="#ffffff">dias → minutos</text>
  <text x="100" y="578" font-size="26" fill="#cfc6bc">para fechar uma venda em campo</text>

  <rect x="${tx - 22}" y="${ty - 22}" width="${tw + 44}" height="${th + 44}" rx="40" fill="#050505"/>
  <rect x="${tx}" y="${ty}" width="${tw}" height="${th}" rx="20" fill="#ffffff"/>
  <rect x="${tx}" y="${ty}" width="${tw}" height="64" rx="20" fill="#f4f1ed"/>
  <rect x="${tx}" y="${ty + 44}" width="${tw}" height="20" fill="#f4f1ed"/>
  <text x="${tx + 32}" y="${ty + 40}" font-size="18" font-weight="700" fill="#111111">Nova proposta</text>
  <text x="${tx + tw - 32}" y="${ty + 40}" font-size="14" fill="#6b6b6b" text-anchor="end">Cliente: Construtora Exemplo</text>

  <rect x="${tx}" y="${ty + 64}" width="200" height="${th - 64}" fill="#faf8f6"/>
  ${steps}

  <rect x="${tx + 236}" y="${ty + 96}" width="150" height="300" rx="6" fill="#b98a5f"/>
  <rect x="${tx + 254}" y="${ty + 116}" width="114" height="120" rx="3" fill="none" stroke="#8a5a33" stroke-width="3"/>
  <rect x="${tx + 254}" y="${ty + 252}" width="114" height="124" rx="3" fill="none" stroke="#8a5a33" stroke-width="3"/>
  <rect x="${tx + 360}" y="${ty + 236}" width="8" height="36" rx="4" fill="#2b2b2b"/>
  <text x="${tx + 236}" y="${ty + 428}" font-size="13" fill="#6b6b6b">Largura</text>
  <text x="${tx + 236}" y="${ty + 450}" font-size="18" font-weight="700" fill="#111111">80 cm</text>
  <text x="${tx + 336}" y="${ty + 428}" font-size="13" fill="#6b6b6b">Altura</text>
  <text x="${tx + 336}" y="${ty + 450}" font-size="18" font-weight="700" fill="#111111">210 cm</text>
  <text x="${tx + 236}" y="${ty + 496}" font-size="13" fill="#6b6b6b">Acabamento</text>
  ${swatches}

  <text x="${tx + 490}" y="${ty + 110}" font-size="16" font-weight="700" fill="#111111">Resumo da proposta</text>
  ${lines}
  <text x="${tx + 490}" y="${ty + 380}" font-size="14" fill="#6b6b6b">Total</text>
  <text x="${tx + tw - 36}" y="${ty + 384}" font-size="28" font-weight="700" fill="#111111" text-anchor="end">R$ 4.380,00</text>
  <rect x="${tx + 490}" y="${ty + 470}" width="${tw - 526}" height="56" rx="28" fill="#c8743a"/>
  <text x="${tx + 490 + (tw - 526) / 2}" y="${ty + 504}" font-size="17" font-weight="700" fill="#ffffff" text-anchor="middle">Enviar proposta</text>
  <text x="${tx + 490 + (tw - 526) / 2}" y="${ty + 556}" font-size="12" fill="#8a8a8a" text-anchor="middle">Valores ilustrativos</text>
</svg>`;
}

const out = [
  ["premium-league", premiumLeague()],
  ["pormade", pormade()],
  ["pode-regularizar", podeRegularizar()],
  ["hora-do-lar", horaDoLar()],
];

for (const [slug, svg] of out) {
  const dir = `public/projetos/${slug}`;
  mkdirSync(dir, { recursive: true });
  writeFileSync(`${dir}/capa.svg`, svg);
  await sharp(Buffer.from(svg), { density: 144 }).resize(1200, 630, { fit: "cover" }).png().toFile(`${dir}/og.png`);
  console.log("ok", slug);
}
