/**
 * Capas ilustradas dos cases Pode Regularizar e Hora do Lar (importadas por
 * gerar-capas.mjs). Ilustrações recriadas em código; dados fictícios.
 */
const FONT = "Arial, Helvetica, sans-serif";

function phone(x, y, w, h, inner, id) {
  return `
  <defs><clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="40"/></clipPath></defs>
  <rect x="${x - 12}" y="${y - 12}" width="${w + 24}" height="${h + 24}" rx="52" fill="#0b0b0f"/>
  <g clip-path="url(#${id})">
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#ffffff"/>
    ${inner}
  </g>`;
}

export function podeRegularizar() {
  const sx = 1130;
  const sy = 80;
  const sw = 360;
  const orange = "#f07e26";
  const blue = "#1b4fd8";
  const green = "#00a37a";
  let chart = "";
  const pts = [0, 18, 12, 30, 26, 44, 40, 58, 70, 82];
  pts.forEach((v, i) => {
    if (i === 0) return;
    const x1 = sx + 30 + (i - 1) * 32;
    const x2 = sx + 30 + i * 32;
    chart += `<line x1="${x1}" y1="${sy + 420 - pts[i - 1] * 1.2}" x2="${x2}" y2="${sy + 420 - v * 1.2}" stroke="${blue}" stroke-width="3" stroke-linecap="round"/>`;
  });
  const icons = [0, 1, 2, 3, 4]
    .map((i) => `<rect x="${sx + 26 + i * 64}" y="${sy + 640}" width="48" height="48" rx="12" fill="#fff4ec" stroke="${orange}" stroke-width="2"/>`)
    .join("");
  const inner = `
    <rect x="${sx}" y="${sy}" width="${sw}" height="60" fill="#ffffff"/>
    <text x="${sx + 26}" y="${sy + 34}" font-size="13" font-weight="700" fill="#111">9:41</text>
    <rect x="${sx + 24}" y="${sy + 60}" width="26" height="4" rx="2" fill="${orange}"/>
    <rect x="${sx + 24}" y="${sy + 68}" width="26" height="4" rx="2" fill="${orange}"/>
    <rect x="${sx + 24}" y="${sy + 76}" width="26" height="4" rx="2" fill="${orange}"/>
    <text x="${sx + 26}" y="${sy + 116}" font-size="12" fill="#4b5563">Cumprimento da meta</text>
    <text x="${sx + sw - 26}" y="${sy + 116}" font-size="12" font-weight="700" fill="${green}" text-anchor="end">75%</text>
    <rect x="${sx + 26}" y="${sy + 128}" width="${sw - 52}" height="12" rx="6" fill="#e5e7eb"/>
    <rect x="${sx + 26}" y="${sy + 128}" width="${(sw - 52) * 0.75}" height="12" rx="6" fill="${green}"/>
    <text x="${sx + 26}" y="${sy + 172}" font-size="11" fill="#6b7280">Meta esperada do mês</text>
    <text x="${sx + 26}" y="${sy + 196}" font-size="18" font-weight="700" fill="#111">R$ 120.000,00</text>
    <rect x="${sx + sw - 82}" y="${sy + 178}" width="56" height="24" rx="6" fill="${blue}"/>
    <text x="${sx + sw - 54}" y="${sy + 195}" font-size="12" font-weight="700" fill="#fff" text-anchor="middle">+2,5%</text>
    <text x="${sx + 26}" y="${sy + 230}" font-size="11" fill="#6b7280">Falta R$ 20.000,00 para alcançar a meta</text>
    <text x="${sx + 26}" y="${sy + 278}" font-size="12" fill="#4b5563">Receita este mês</text>
    <text x="${sx + 26}" y="${sy + 306}" font-size="22" font-weight="700" fill="#111">R$ 100.000,00</text>
    ${chart}
    <rect x="${sx + 20}" y="${sy + 460}" width="${sw - 40}" height="150" rx="14" fill="#f6f6f8"/>
    <text x="${sx + 36}" y="${sy + 490}" font-size="12" fill="#4b5563">Compromissos do dia</text>
    <text x="${sx + sw - 36}" y="${sy + 490}" font-size="12" fill="${blue}" text-anchor="end">Ver tudo</text>
    <text x="${sx + 36}" y="${sy + 526}" font-size="14" font-weight="700" fill="${blue}">Visita agendada às 12:30</text>
    <text x="${sx + 36}" y="${sy + 548}" font-size="12" font-weight="700" fill="#111">CLIENTE EXEMPLO</text>
    <text x="${sx + 36}" y="${sy + 568}" font-size="11" fill="#6b7280">Av. Exemplo, 123</text>
    <rect x="${sx + sw - 72}" y="${sy + 512}" width="36" height="36" rx="8" fill="${blue}"/>
    <path d="M${sx + sw - 58} ${sy + 522} l8 8 l-8 8" stroke="#fff" stroke-width="3" fill="none"/>
    <text x="${sx + 26}" y="${sy + 630}" font-size="11" fill="#6b7280">Atalhos do dia</text>
    ${icons}
    <rect x="${sx + sw / 2 - 60}" y="${sy + 742}" width="120" height="5" rx="2.5" fill="#111"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900" font-family="${FONT}">
  <rect width="1600" height="900" fill="#1446d9"/>
  <path d="M0 900 L0 640 L420 900 Z" fill="${orange}"/>
  <circle cx="1310" cy="460" r="520" fill="#1b52e6"/>
  <text x="110" y="290" font-size="26" font-weight="700" letter-spacing="6" fill="#c9d6ff">PODE REGULARIZAR</text>
  <text x="104" y="390" font-size="92" font-weight="700" letter-spacing="-3" fill="#ffffff">Regularização</text>
  <text x="104" y="486" font-size="92" font-weight="700" letter-spacing="-3" fill="#ffffff">sem papel</text>
  <text x="110" y="560" font-size="30" fill="#e3e9ff">O app do vendedor porta a porta</text>
  ${phone(sx, sy, sw, 756, inner, "pr-screen")}
</svg>`;
}

export function horaDoLar() {
  const orange = "#ef6c1a";
  const purple = "#7a1f5c";
  // Notebook com o topo da homepage.
  const lx = 520;
  const ly = 170;
  const lw = 760;
  const lh = 470;
  const laptop = `
  <rect x="${lx - 18}" y="${ly - 18}" width="${lw + 36}" height="${lh + 36}" rx="22" fill="#1d1d22"/>
  <rect x="${lx}" y="${ly}" width="${lw}" height="${lh}" rx="6" fill="#ffffff"/>
  <rect x="${lx}" y="${ly}" width="${lw}" height="40" fill="${orange}"/>
  <text x="${lx + 24}" y="${ly + 26}" font-size="15" font-weight="700" fill="#fff">hora do lar</text>
  <rect x="${lx + lw - 150}" y="${ly + 10}" width="70" height="22" rx="11" fill="#fff" fill-opacity="0.85"/>
  <rect x="${lx + lw - 72}" y="${ly + 10}" width="54" height="22" rx="11" fill="none" stroke="#fff"/>
  <text x="${lx + 30}" y="${ly + 110}" font-size="30" font-weight="700" fill="#222">Cuida da sua jornada</text>
  <text x="${lx + 30}" y="${ly + 148}" font-size="30" font-weight="700" fill="#222">com empregados</text>
  <text x="${lx + 30}" y="${ly + 186}" font-size="30" font-weight="700" fill="${orange}">domésticos</text>
  <rect x="${lx + 30}" y="${ly + 208}" width="300" height="10" rx="5" fill="#e5e7eb"/>
  <rect x="${lx + 30}" y="${ly + 226}" width="250" height="10" rx="5" fill="#e5e7eb"/>
  <rect x="${lx + 30}" y="${ly + 262}" width="220" height="44" rx="10" fill="${orange}"/>
  <text x="${lx + 140}" y="${ly + 290}" font-size="15" font-weight="700" fill="#fff" text-anchor="middle">Comece agora</text>
  <rect x="${lx + 420}" y="${ly + 60}" width="${lw - 450}" height="${lh - 90}" rx="12" fill="${purple}"/>
  <rect x="${lx + 450}" y="${ly + 110}" width="${lw - 510}" height="${lh - 190}" rx="10" fill="#f4d7c3"/>
  <circle cx="${lx + 590}" cy="${ly + 200}" r="38" fill="#c98b62"/>
  <rect x="${lx + 540}" y="${ly + 246}" width="100" height="120" rx="40" fill="#f2f2f2"/>
  <rect x="${lx - 70}" y="${ly + lh + 18}" width="${lw + 140}" height="22" rx="11" fill="#2a2a30"/>`;

  // Celular com Marcar o ponto.
  const sx = 1170;
  const sy = 150;
  const sw = 300;
  const rows = ["Entrada", "Intervalo", "Retorno intervalo", "Saída"]
    .map((r, i) => {
      const y = sy + 250 + i * 64;
      return `<rect x="${sx + 20}" y="${y}" width="${sw - 40}" height="48" rx="10" fill="#f3f3f5"/>
      <rect x="${sx + 34}" y="${y + 14}" width="20" height="20" rx="4" fill="none" stroke="#9ca3af" stroke-width="2"/>
      <text x="${sx + 66}" y="${y + 30}" font-size="13" fill="${i === 0 ? "#111" : "#9ca3af"}">${r}</text>
      ${i === 0 ? `<text x="${sx + sw - 34}" y="${y + 30}" font-size="13" font-weight="700" fill="${orange}" text-anchor="end">08:00</text>` : ""}`;
    })
    .join("");
  const inner = `
    <text x="${sx + sw / 2}" y="${sy + 56}" font-size="16" font-weight="700" fill="${orange}" text-anchor="middle">hora do lar</text>
    <text x="${sx + 22}" y="${sy + 104}" font-size="22" font-weight="700" fill="#111">Oi Funcionário!</text>
    <text x="${sx + 22}" y="${sy + 126}" font-size="12" fill="#6b7280">Sexta-feira, 31 de janeiro</text>
    <rect x="${sx + 20}" y="${sy + 150}" width="128" height="52" rx="12" fill="${orange}"/>
    <text x="${sx + 84}" y="${sy + 182}" font-size="13" font-weight="700" fill="#fff" text-anchor="middle">Marcar o ponto</text>
    <rect x="${sx + 158}" y="${sy + 150}" width="122" height="52" rx="12" fill="#fff" stroke="${orange}" stroke-width="2"/>
    <text x="${sx + 219}" y="${sy + 182}" font-size="13" fill="${orange}" text-anchor="middle">Resumo do mês</text>
    ${rows}
    <rect x="${sx + 40}" y="${sy + 512}" width="${sw - 80}" height="40" rx="20" fill="${orange}"/>
    <text x="${sx + sw / 2}" y="${sy + 537}" font-size="13" font-weight="700" fill="#fff" text-anchor="middle">Registrar intervalo</text>
    <rect x="${sx}" y="${sy + 576}" width="${sw}" height="64" fill="#faf7f5"/>
    ${["Ponto", "Notificações", "Aprovações", "Menu"]
      .map((t, i) => `<circle cx="${sx + 38 + i * 75}" cy="${sy + 596}" r="7" fill="none" stroke="${i === 0 ? orange : "#9ca3af"}" stroke-width="2"/><text x="${sx + 38 + i * 75}" y="${sy + 620}" font-size="10" fill="${i === 0 ? orange : "#6b7280"}" text-anchor="middle">${t}</text>`)
      .join("")}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900" font-family="${FONT}">
  <rect width="1600" height="900" fill="#fbefe6"/>
  <rect x="0" y="720" width="1600" height="180" fill="#f6dccb"/>
  <text x="96" y="230" font-size="24" font-weight="700" letter-spacing="6" fill="${orange}">HORA DO LAR</text>
  <text x="90" y="310" font-size="60" font-weight="700" letter-spacing="-2" fill="#2a1830">Site novo</text>
  <text x="90" y="378" font-size="60" font-weight="700" letter-spacing="-2" fill="#2a1830">e dois apps</text>
  <text x="96" y="430" font-size="22" fill="#5b4a55">Gestão de empregados</text>
  <text x="96" y="460" font-size="22" fill="#5b4a55">domésticos sem juridiquês</text>
  ${laptop}
  ${phone(sx, sy, sw, 640, inner, "hl-screen")}
</svg>`;
}
