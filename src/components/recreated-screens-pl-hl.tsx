import type { CSSProperties, ReactNode } from "react";
import { Root, StatusBar, u } from "./recreated-screens";

/*
 * Telas redesenhadas em código do Premium League e do Hora do Lar, no mesmo
 * padrão de recreated-screens.tsx (base de 300px, unidades de container,
 * texto real e SVG). Nomes de jogadores e times são fictícios; os dados são
 * de demonstração do layout.
 */

export type PlHlScreenId =
  | "pl-splash"
  | "pl-antes"
  | "pl-escalacao"
  | "pl-escalacao-vazia"
  | "pl-escalacao-parcial"
  | "pl-escalacao-auto"
  | "pl-escalacao-salva"
  | "hl-resumo"
  | "hl-ponto-0"
  | "hl-ponto-1"
  | "hl-ponto-2"
  | "hl-ponto-3"
  | "hl-ponto-4"
  | "hl-menu"
  | "hl-emp-aprovar"
  | "hl-emp-aprovado"
  | "hl-emp-resumo"
  | "hl-emp-documentos"
  | "hl-emp-notificacao";

const ids: PlHlScreenId[] = [
  "pl-splash",
  "pl-antes",
  "pl-escalacao",
  "pl-escalacao-vazia",
  "pl-escalacao-parcial",
  "pl-escalacao-auto",
  "pl-escalacao-salva",
  "hl-resumo",
  "hl-ponto-0",
  "hl-ponto-1",
  "hl-ponto-2",
  "hl-ponto-3",
  "hl-ponto-4",
  "hl-menu",
  "hl-emp-aprovar",
  "hl-emp-aprovado",
  "hl-emp-resumo",
  "hl-emp-documentos",
  "hl-emp-notificacao",
];

export const isPlHlScreen = (id: string): id is PlHlScreenId => (ids as string[]).includes(id);

/* ======================== Premium League ======================== */

const plBlue = "#1e49ff";
const ink = "#141928";
const grey = "#8f96a1";

const svgIcon = (d: string, c: string, s: number, sw = 1.8, fill = "none") => (
  <svg viewBox="0 0 24 24" style={{ width: u(s), flexShrink: 0 }} fill={fill} stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);

/** Águia estilizada (asas abertas) para o logo do Premium League. */
export function PlEagle({ size, color = "#fff" }: { size: number; color?: string }) {
  return (
    <svg viewBox="0 0 64 40" style={{ width: u(size) }} aria-hidden="true">
      <path
        d="M32 38c-3-4-4-8-4-12-6 0-12-2-17-6 4 0 8-1 11-2-6-1-12-5-16-10 6 2 12 2 17 0-4-2-7-5-9-8 7 3 13 6 18 10 5-4 11-7 18-10-2 3-5 6-9 8 5 2 11 2 17 0-4 5-10 9-16 10 3 1 7 2 11 2-5 4-11 6-17 6 0 4-1 8-4 12z"
        fill={color}
      />
      <circle cx="32" cy="20" r="1.6" fill={plBlue} />
    </svg>
  );
}

function PlSplash() {
  return (
    <Root bg={`radial-gradient(120% 80% at 50% 45%, #3a5cff 0%, ${plBlue} 45%, #1233d6 100%)`} color="#fff">
      <StatusBar time="9:41" light />
      <div className="flex flex-1 flex-col items-center justify-center" style={{ gap: u(8), paddingBottom: u(40) }}>
        <PlEagle size={96} />
        <span style={{ fontSize: u(30), fontWeight: 800, letterSpacing: "-0.01em", lineHeight: 1 }}>PREMIUM</span>
        <span style={{ fontSize: u(11), fontWeight: 600, letterSpacing: "0.55em", marginLeft: "0.55em" }}>LEAGUE</span>
      </div>
    </Root>
  );
}

/* --- campo e cards --- */

type Kit = { body: string; sleeve: string; stripe?: string };
const kits: Kit[] = [
  { body: "#1f1f24", sleeve: "#f4f4f4", stripe: "#f4f4f4" },
  { body: "#d6262f", sleeve: "#1f1f24" },
  { body: "#2f8f4e", sleeve: "#f4f4f4" },
  { body: "#f4f4f4", sleeve: "#1f1f24" },
  { body: "#2147c9", sleeve: "#d6262f" },
];

function Shirt({ kit, size }: { kit: Kit; size: number }) {
  return (
    <svg viewBox="0 0 40 36" style={{ width: u(size), display: "block" }} aria-hidden="true">
      <path d="M13 1 3 7l4 9 5-2v21h16V14l5 2 4-9-10-6c-1 3-4 5-7 5s-6-2-7-5z" fill={kit.body} stroke="rgba(0,0,0,0.25)" strokeWidth="0.8" />
      <path d="M3 7l4 9 5-2V8zM37 7l-4 9-5-2V8z" fill={kit.sleeve} />
      {kit.stripe ? <path d="M17 6h2v29h-2zM21 6h2v29h-2z" fill={kit.stripe} fillOpacity="0.85" /> : null}
      <circle cx="26" cy="12" r="2.2" fill="#ffffff" fillOpacity="0.85" />
    </svg>
  );
}

/** Card de jogador: preço, camisa, confirmação e nome. */
export function PlPlayerCard({ name, kit, empty }: { name: string; kit: number; empty?: boolean }) {
  if (empty) {
    return (
      <div className="flex flex-col items-center" style={{ width: u(46) }}>
        <span className="flex items-center justify-center" style={{ width: u(26), height: u(26), borderRadius: "50%", background: "rgba(255,255,255,0.9)", color: plBlue, fontSize: u(18), fontWeight: 700, lineHeight: 1, marginTop: u(12) }}>
          +
        </span>
      </div>
    );
  }
  return (
    <div className="relative flex flex-col items-center" style={{ width: u(46) }}>
      <span style={{ background: "#2c2e35", color: "#fff", fontSize: u(6.5), fontWeight: 700, borderRadius: u(3), padding: `${u(1)} ${u(3)}`, lineHeight: 1.2 }}>$10,00</span>
      <div className="relative" style={{ marginTop: u(1) }}>
        <Shirt kit={kits[kit % kits.length]} size={26} />
        <span className="absolute flex items-center justify-center" style={{ left: u(-4), bottom: u(-1), width: u(9), height: u(9), borderRadius: "50%", background: "#28b156", border: `${u(1)} solid #fff` }}>
          <svg viewBox="0 0 10 10" style={{ width: u(5) }} aria-hidden="true">
            <path d="M2 5l2 2 4-4" fill="none" stroke="#fff" strokeWidth="1.6" />
          </svg>
        </span>
      </div>
      <span style={{ marginTop: u(1), background: "#fff", color: ink, fontSize: u(6), fontWeight: 600, borderRadius: u(2), padding: `${u(1)} ${u(3)}`, whiteSpace: "nowrap", boxShadow: "0 1px 1px rgba(0,0,0,0.15)" }}>{name}</span>
    </div>
  );
}

const lineup: { name: string; kit: number }[][] = [
  [
    { name: "L. Moraes", kit: 0 },
    { name: "Pedro S.", kit: 1 },
    { name: "E. Costa", kit: 2 },
  ],
  [
    { name: "R. Veiga", kit: 2 },
    { name: "G. Souza", kit: 1 },
    { name: "R. Lima", kit: 3 },
  ],
  [
    { name: "P. Reis", kit: 2 },
    { name: "G. Dias", kit: 2 },
    { name: "L. Ortiz", kit: 1 },
    { name: "W. Silva", kit: 1 },
  ],
  [
    { name: "A. Jorge", kit: 0 },
    { name: "A. Rossi", kit: 1 },
  ],
];

const bench = [
  { name: "H. Souza", kit: 3 },
  { name: "F. Bruno", kit: 1 },
  { name: "Y. Pires", kit: 4 },
  { name: "T. Almada", kit: 0 },
  { name: "I. Jesus", kit: 0 },
];

const rowStart = lineup.map((_, i) => lineup.slice(0, i).reduce((a, r) => a + r.length, 0));

function Pitch({ filled }: { filled: number }) {
  return (
    <div className="relative" style={{ margin: `${u(6)} ${u(18)} 0`, height: u(218) }}>
      <div
        className="absolute inset-0"
        style={{
          clipPath: "polygon(6% 0, 94% 0, 100% 100%, 0 100%)",
          background: "repeating-linear-gradient(180deg, #2cb556 0 12.5%, #25a64d 12.5% 25%)",
          boxShadow: "0 8px 14px -8px rgba(0,0,0,0.4)",
        }}
      />
      <svg viewBox="0 0 264 218" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <g fill="none" stroke="#ffffff" strokeOpacity="0.75" strokeWidth="1.2">
          <path d="M20 6h224l12 206H8z" />
          <path d="M14 109h236" />
          <ellipse cx="132" cy="109" rx="30" ry="22" />
          <path d="M92 6v26h80V6M86 212v-28h92v28" />
        </g>
      </svg>
      <div className="absolute inset-0 flex flex-col justify-around" style={{ padding: `${u(6)} ${u(10)} ${u(4)}` }}>
        {lineup.map((row, ri) => (
          <div key={ri} className="flex" style={{ justifyContent: ri === 3 ? "flex-start" : "space-around", gap: ri === 3 ? u(42) : 0, paddingLeft: ri === 3 ? u(6) : 0 }}>
            {row.map((p, pi) => {
              const show = rowStart[ri] + pi < filled;
              return <PlPlayerCard key={p.name} name={p.name} kit={p.kit} empty={!show} />;
            })}
          </div>
        ))}
      </div>
      <span className="absolute" style={{ right: u(10), bottom: u(10), background: ink, color: "#fff", fontSize: u(8), fontWeight: 700, borderRadius: u(4), padding: `${u(4)} ${u(6)}` }}>
        4-3-3
      </span>
    </div>
  );
}

/** Cabeçalho azul + linha de métricas. */
export function PlHeader() {
  return (
    <div>
      <div style={{ background: plBlue, color: "#fff" }}>
        <StatusBar time="9:41" light />
        <div className="relative flex items-center justify-center" style={{ height: u(34) }}>
          <span className="absolute" style={{ left: u(14) }}>
            {svgIcon("M15 5l-7 7 7 7", "#fff", 16, 2.4)}
          </span>
          <span style={{ fontSize: u(14), fontWeight: 700 }}>Escalação</span>
        </div>
      </div>
      <div className="grid grid-cols-3 text-center" style={{ padding: `${u(8)} ${u(8)}`, background: "#fff", borderBottom: "1px solid #eef0f3" }}>
        {[
          ["PREÇO DO TIME", "$0,00"],
          ["MERCADO FECHA EM", "01:00:00h"],
          ["PATRIMÔNIO", "$120,00"],
        ].map(([k, v]) => (
          <span key={k}>
            <span className="block" style={{ fontSize: u(6), color: grey, letterSpacing: "0.02em" }}>
              {k}
            </span>
            <span className="block" style={{ fontSize: u(10), fontWeight: 700, color: ink }}>
              {v}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

/** Seletor de formação e alternância campo/lista. */
export function PlFormation() {
  return (
    <div className="flex items-center justify-between" style={{ padding: `${u(10)} ${u(14)} 0` }}>
      <span className="flex items-center" style={{ gap: u(6), border: "1px solid #e1e4ea", borderRadius: u(6), padding: `${u(5)} ${u(9)}`, fontSize: u(10), fontWeight: 700, background: "#fff" }}>
        4-3-3 {svgIcon("M6 9l6 6 6-6", ink, 10, 2.6)}
      </span>
      <span className="flex" style={{ gap: u(6) }}>
        <span className="flex items-center justify-center" style={{ width: u(26), height: u(26), borderRadius: u(6), background: plBlue }}>
          {svgIcon("M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM5 20c1-4 4-6 7-6s6 2 7 6", "#fff", 14)}
        </span>
        <span className="flex items-center justify-center" style={{ width: u(26), height: u(26), borderRadius: u(6), background: "#fff", border: "1px solid #e1e4ea" }}>
          {svgIcon("M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01", ink, 14, 2.2)}
        </span>
      </span>
    </div>
  );
}

/** Banco de reservas. */
export function PlBench({ filled = true }: { filled?: boolean }) {
  return (
    <div style={{ padding: `${u(8)} ${u(10)} 0` }}>
      <div className="flex items-center" style={{ gap: u(8) }}>
        <span className="flex-1" style={{ height: 1, background: "#e5e8ee" }} />
        <span style={{ fontSize: u(8.5), color: "#4b5563" }}>Banco de reservas</span>
        <span className="flex-1" style={{ height: 1, background: "#e5e8ee" }} />
      </div>
      <div className="flex justify-around" style={{ marginTop: u(6) }}>
        {bench.map((b) => (
          <PlPlayerCard key={b.name} name={b.name} kit={b.kit} empty={!filled} />
        ))}
      </div>
    </div>
  );
}

/** Ações da escalação e capitão. */
export function PlActions({ autoActive }: { autoActive?: boolean }) {
  const box = (d: string, on?: boolean) => (
    <span className="flex items-center justify-center" style={{ width: u(28), height: u(28), borderRadius: u(6), border: `1px solid ${on ? plBlue : "#e1e4ea"}`, background: on ? plBlue : "#fff" }}>
      {svgIcon(d, on ? "#fff" : ink, 13)}
    </span>
  );
  return (
    <div className="flex items-center justify-between" style={{ padding: `${u(10)} ${u(14)}` }}>
      <span className="flex" style={{ gap: u(6) }}>
        {box("M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3")}
        {box("M8 12l8-4M8 12l8 4M18 6a2 2 0 1 0 0 .01M18 18a2 2 0 1 0 0 .01M6 12a2 2 0 1 0 0 .01")}
        {box("M13 2 4 14h7l-1 8 9-12h-7z", autoActive)}
        {box("M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z")}
      </span>
      <span className="text-right">
        <span className="block" style={{ fontSize: u(7.5), color: grey }}>
          Capitão escolhido:
        </span>
        <span className="block" style={{ fontSize: u(11), fontWeight: 700, color: ink }}>
          {autoActive ? "1 de 1" : "0 de 1"}
        </span>
      </span>
    </div>
  );
}

/** Navegação inferior (como no app: três destinos). */
export function PlNav() {
  const item = (d: string, label: string) => (
    <span className="flex flex-col items-center" style={{ gap: u(2) }}>
      {svgIcon(d, grey, 16)}
      <span style={{ fontSize: u(7), color: grey }}>{label}</span>
    </span>
  );
  return (
    <div className="mt-auto" style={{ borderTop: "1px solid #eef0f3", background: "#fff" }}>
      <div className="flex justify-around" style={{ padding: `${u(7)} 0 ${u(3)}` }}>
        {item("M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4", "Campeonatos")}
        {item("M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0", "Notificações")}
        {item("M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM5 21c1-4 4-6 7-6s6 2 7 6", "Minha conta")}
      </div>
      <div className="mx-auto" style={{ width: u(100), height: u(4), borderRadius: u(2), background: ink, margin: `${u(4)} auto ${u(6)}` }} />
    </div>
  );
}

function PlEscalacao({ filled = 12, auto, toast }: { filled?: number; auto?: boolean; toast?: boolean }) {
  return (
    <Root bg="#f7f9fa" color={ink}>
      <PlHeader />
      <PlFormation />
      <Pitch filled={filled} />
      <PlBench filled={filled >= 12} />
      <PlActions autoActive={auto} />
      <PlNav />
      {toast ? (
        <div className="absolute flex items-center" style={{ left: u(18), right: u(18), bottom: u(70), gap: u(8), padding: `${u(10)} ${u(12)}`, borderRadius: u(8), background: ink, color: "#fff", fontSize: u(10.5), fontWeight: 600, boxShadow: "0 8px 20px -8px rgba(0,0,0,0.5)" }}>
          <span className="flex items-center justify-center" style={{ width: u(16), height: u(16), borderRadius: "50%", background: "#28b156" }}>
            {svgIcon("M6 12l4 4 8-8", "#fff", 10, 3)}
          </span>
          Escalação salva
        </div>
      ) : null}
    </Root>
  );
}

/** Versão anterior (roxa), para o antes × depois. */
function PlAntes() {
  const purple = "#3b0a5c";
  const pink = "#e8508f";
  const markers: [number, number][] = [
    [50, 14], [22, 22], [78, 22], [33, 42], [67, 42], [50, 57], [15, 62], [85, 62], [36, 76], [64, 76], [50, 90],
  ];
  const tags: [string, string][] = [
    ["ATA", "#d6262f"],
    ["MEI", "#1f9a46"],
    ["LAT", "#e5c300"],
    ["ZAG", "#4f62e6"],
    ["GOL", "#f07b1e"],
  ];
  return (
    <Root bg={purple} color="#fff">
      <StatusBar time="9:41" light />
      <div className="flex items-start" style={{ gap: u(10), padding: `${u(8)} ${u(12)} 0` }}>
        <span style={{ marginTop: u(3) }}>{svgIcon("M19 12H5M11 6l-6 6 6 6", pink, 16, 2.4)}</span>
        <span className="flex-1">
          <span className="block" style={{ fontSize: u(11.5), fontWeight: 700 }}>
            Campeonato Inglês
          </span>
          <span className="block" style={{ fontSize: u(7.5), opacity: 0.8 }}>
            Fecha em 1 dia(s) e 1 hora(s)
          </span>
        </span>
        <span style={{ fontSize: u(9), fontWeight: 600, background: "#cfcfd6", color: "#f4f4f6", padding: `${u(5)} ${u(8)}`, borderRadius: u(3) }}>Salvar time</span>
      </div>
      <div className="flex items-center" style={{ gap: u(10), padding: `${u(12)} ${u(12)} ${u(10)}` }}>
        <span>
          <span className="block" style={{ fontSize: u(6.5), opacity: 0.75 }}>
            PREÇO TIME
          </span>
          <span className="block" style={{ fontSize: u(8.5), fontWeight: 700 }}>
            $PLS 0,00
          </span>
        </span>
        <span>
          <span className="block" style={{ fontSize: u(6.5), opacity: 0.75 }}>
            PATRIMÔNIO
          </span>
          <span className="block" style={{ fontSize: u(8.5), fontWeight: 700 }}>
            PL$ 120,00pts
          </span>
        </span>
        <span className="ml-auto" style={{ fontSize: u(6.5), border: "1px solid rgba(255,255,255,0.6)", borderRadius: u(3), padding: `${u(3)} ${u(5)}` }}>
          4-3-3
        </span>
        <svg viewBox="0 0 40 36" style={{ width: u(20) }} aria-hidden="true">
          <path d="M13 1 3 7l4 9 5-2v21h16V14l5 2 4-9-10-6c-1 3-4 5-7 5s-6-2-7-5z" fill={pink} />
        </svg>
        <span className="flex items-center justify-center" style={{ width: u(18), height: u(18), borderRadius: "50%", background: "#7c6f88" }}>
          {svgIcon("M4 7h16M6 7l1 13h10l1-13M9 7V4h6v3", "#3b0a5c", 10, 2.2)}
        </span>
      </div>
      <div className="relative" style={{ margin: `${u(4)} ${u(12)} 0`, height: u(232), background: "repeating-linear-gradient(180deg, #3f8a2e 0 8.33%, #357a26 8.33% 16.66%)" }}>
        <svg viewBox="0 0 276 232" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <g fill="none" stroke="#fff" strokeOpacity="0.85" strokeWidth="1.2">
            <rect x="12" y="10" width="252" height="212" />
            <path d="M12 116h252" />
            <circle cx="138" cy="116" r="26" />
            <rect x="74" y="10" width="128" height="46" />
            <rect x="110" y="10" width="56" height="16" />
            <rect x="74" y="176" width="128" height="46" />
            <rect x="110" y="206" width="56" height="16" />
          </g>
        </svg>
        {markers.map(([x, y], i) => (
          <span key={i} className="absolute flex items-center justify-center" style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)", width: u(20), height: u(20), borderRadius: "50%", background: "#f2d81d", color: "#5a4300", fontSize: u(15), fontWeight: 800, lineHeight: 1 }}>
            +
          </span>
        ))}
        <span className="absolute flex flex-col items-center" style={{ left: 0, bottom: 0, width: u(60), height: u(48), background: "rgba(40,40,40,0.35)", paddingTop: u(6) }}>
          <span className="flex items-center justify-center" style={{ width: u(20), height: u(20), borderRadius: "50%", background: "#f2d81d", color: "#5a4300", fontSize: u(15), fontWeight: 800, lineHeight: 1 }}>
            +
          </span>
          <span style={{ marginTop: u(3), fontSize: u(5.5), background: "#a35bd6", padding: `${u(1)} ${u(4)}`, borderRadius: u(2) }}>TEC</span>
        </span>
      </div>
      <div className="flex items-center" style={{ margin: `${u(12)} ${u(12)} 0`, padding: `${u(8)} ${u(10)}`, gap: u(10), background: "rgba(0,0,0,0.25)", borderRadius: u(4) }}>
        <span style={{ fontSize: u(10), opacity: 0.85 }}>RES</span>
        <span style={{ width: 1, height: u(18), background: "rgba(255,255,255,0.5)" }} />
        <span className="flex flex-1 justify-between">
          {tags.map(([t, c]) => (
            <span key={t} className="flex flex-col items-center" style={{ gap: u(3) }}>
              <span className="flex items-center justify-center" style={{ width: u(20), height: u(20), borderRadius: "50%", background: "#f2d81d", color: "#5a4300", fontSize: u(15), fontWeight: 800, lineHeight: 1 }}>
                +
              </span>
              <span style={{ fontSize: u(5.5), background: c, padding: `${u(1)} ${u(5)}`, borderRadius: u(2) }}>{t}</span>
            </span>
          ))}
        </span>
      </div>
    </Root>
  );
}

/* ======================== Hora do Lar ======================== */

const hlOrange = "#f26b1d";
const hlInk = "#1f1f24";
const hlGrey = "#8a8a93";

export function HlLogo({ size = 1 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center" style={{ gap: u(3) }}>
      <svg viewBox="0 0 26 24" style={{ width: u(20 * size) }} aria-hidden="true">
        <path d="M3 11 13 3l10 8" fill="none" stroke={hlOrange} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 5V2h3v6" fill="none" stroke={hlOrange} strokeWidth="2.2" />
        <circle cx="13" cy="15" r="7" fill="none" stroke={hlOrange} strokeWidth="2.4" />
        <path d="M13 11v4l3 2" fill="none" stroke={hlOrange} strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span style={{ fontSize: u(15 * size), fontWeight: 500, color: "#3a3a40", letterSpacing: "-0.01em" }}>hora do lar</span>
    </div>
  );
}

const clockD = "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2";
const calD = "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4";

function HlTabs({ active }: { active: "ponto" | "resumo" }) {
  const tab = (on: boolean, d: string, label: string) => (
    <span
      className="flex items-center justify-center"
      style={{ gap: u(5), height: u(32), padding: `0 ${u(10)}`, borderRadius: u(5), background: on ? hlOrange : "transparent", color: on ? "#fff" : hlOrange, fontSize: u(9.5), fontWeight: on ? 600 : 400 }}
    >
      {svgIcon(d, on ? "#fff" : hlOrange, 13, 2)}
      {label}
    </span>
  );
  return (
    <div className="flex items-center justify-between" style={{ padding: `${u(14)} ${u(14)} 0` }}>
      {tab(active === "ponto", clockD, "Marcar o ponto")}
      {tab(active === "resumo", calD, "Resumo do mês")}
    </div>
  );
}

function HlGreeting() {
  return (
    <div style={{ padding: `${u(14)} ${u(14)} 0` }}>
      <p style={{ fontSize: u(16), fontWeight: 600, color: hlInk }}>Oi Funcionário!</p>
      <p style={{ marginTop: u(4), fontSize: u(8.5), color: hlGrey }}>Sexta-feira, 31 de janeiro de 2025</p>
    </div>
  );
}

export function HlNav({ active }: { active: "ponto" | "menu" | "inicio" | "aprovacoes" }) {
  const items: [string, string, string][] = [
    ["ponto", clockD, "Ponto"],
    ["notificacoes", "M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0", "Notificações"],
    ["aprovacoes", "M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 20v-2h12v2M8 15h8l1 3H7z", "Aprovações"],
    ["menu", "M4 7h16M4 12h16M4 17h16", "Menu"],
  ];
  return (
    <div className="mt-auto flex justify-around" style={{ padding: `${u(8)} 0 ${u(10)}`, background: "#fdf6f2", borderTop: "1px solid #f3e7e0" }}>
      {items.map(([k, d, l]) => {
        const on = k === active;
        return (
          <span key={k} className="flex flex-col items-center" style={{ gap: u(2) }}>
            {svgIcon(d, on ? hlOrange : "#55555d", 15, 2)}
            <span style={{ fontSize: u(7.5), color: on ? hlOrange : "#55555d" }}>{l}</span>
          </span>
        );
      })}
    </div>
  );
}

function Ring({ pct, size }: { pct: number; size: number }) {
  return (
    <svg viewBox="0 0 36 36" style={{ width: u(size), flexShrink: 0 }} className="-rotate-90" aria-hidden="true">
      <circle cx="18" cy="18" r="15" fill="none" stroke="#e3e3e6" strokeWidth="4" />
      <circle cx="18" cy="18" r="15" fill="none" stroke={hlOrange} strokeWidth="4" strokeLinecap="round" strokeDasharray={`${(pct * 94.2) / 100} 94.2`} />
    </svg>
  );
}

/** Card de horas trabalhadas com anel de progresso. */
export function HlHoursCard({ worked = "0.00", pct = 0 }: { worked?: string; pct?: number }) {
  return (
    <div className="flex items-center" style={{ margin: `${u(14)} ${u(14)} 0`, padding: `${u(12)} ${u(14)}`, gap: u(14), background: "#f1f1f3", borderRadius: u(6) }}>
      <Ring pct={pct} size={34} />
      <span>
        <span className="block" style={{ fontSize: u(11), fontWeight: 600, color: hlInk }}>
          Horas trabalhadas
        </span>
        <span className="tabular block" style={{ fontSize: u(11), color: "#4a4a52" }}>
          {worked}/168.00 horas
        </span>
      </span>
    </div>
  );
}

function HlResumo() {
  return (
    <Root bg="#fdfdfd" color={hlInk}>
      <StatusBar time="9:41" />
      <HlLogo />
      <HlGreeting />
      <HlTabs active="resumo" />
      <HlHoursCard />
      <div className="flex items-center justify-between" style={{ padding: `${u(14)} ${u(14)} ${u(8)}`, borderBottom: "1px solid #eee" }}>
        <span style={{ fontSize: u(11), fontWeight: 500 }}>Resumo</span>
        <span className="flex items-center" style={{ gap: u(5), padding: `${u(5)} ${u(10)}`, borderRadius: u(5), background: hlOrange, color: "#fff", fontSize: u(9), fontWeight: 600 }}>
          {svgIcon(calD, "#fff", 12, 2)} Buscar mês
        </span>
      </div>
      <div className="flex flex-col" style={{ padding: `${u(12)} ${u(14)}`, gap: u(9), fontSize: u(9.5) }}>
        <span className="flex items-center" style={{ gap: u(8), paddingLeft: u(8) }}>
          <span className="flex items-center justify-center" style={{ width: u(13), height: u(13), borderRadius: "50%", background: "#1fa64a" }}>
            {svgIcon("M6 12l4 4 8-8", "#fff", 8, 3)}
          </span>
          Extrato de horas extras
        </span>
        <span>
          <b style={{ fontWeight: 600 }}>Saldo:</b> <span className="tabular">00:00:00 horas</span>
        </span>
        <span className="flex items-center" style={{ gap: u(8), paddingLeft: u(8) }}>
          <span className="flex items-center justify-center" style={{ width: u(13), height: u(13), borderRadius: "50%", background: "#d1202b", color: "#fff", fontSize: u(9), fontWeight: 800 }}>
            !
          </span>
          Resumo de descontos
        </span>
        <span>
          <b style={{ fontWeight: 600 }}>Atrasos:</b> <span className="tabular">176:02:00 horas</span>
        </span>
        <span style={{ marginTop: u(-5) }}>
          <b style={{ fontWeight: 600 }}>Faltas:</b> 22 dias
        </span>
      </div>
      <HlNav active="ponto" />
    </Root>
  );
}

const marks: [string, string][] = [
  ["Entrada", "08:00"],
  ["Intervalo", "12:00"],
  ["Retorno intervalo", "13:00"],
  ["Saída", "17:00"],
];

/** Lista de marcações; `done` = quantas já foram registradas. */
export function HlMarks({ done }: { done: number }) {
  const next = marks[Math.min(done, 3)][0];
  return (
    <div className="flex flex-col" style={{ padding: `${u(16)} ${u(30)} 0`, gap: u(8) }}>
      {marks.map(([label, time], i) => (
        <div key={label}>
          <div className="flex items-center" style={{ gap: u(9), height: u(30), padding: `0 ${u(10)}`, borderRadius: u(8), background: "#f3f3f5", fontSize: u(9), color: i < done ? hlInk : "#9a9aa2" }}>
            {svgIcon("M10 4H5v16h5M14 8l-4 4 4 4M10 12h10", i < done ? hlOrange : "#9a9aa2", 13, 1.8)}
            <span className="flex-1" style={{ fontWeight: i < done ? 600 : 400 }}>
              {label}
            </span>
            <span className="tabular" style={{ color: i < done ? hlOrange : "#b0b0b7", fontWeight: i < done ? 600 : 400 }}>
              {i < done ? time : "--:--"}
            </span>
          </div>
          {i === done && done < 4 ? (
            <div className="flex items-center justify-center" style={{ marginTop: u(8), height: u(28), borderRadius: u(14), background: hlOrange, color: "#fff", fontSize: u(9.5), fontWeight: 600 }}>
              Registrar {next}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function HlPonto({ done }: { done: number }) {
  return (
    <Root bg="#fdfdfd" color={hlInk}>
      <StatusBar time="9:41" />
      <HlLogo />
      <HlGreeting />
      <HlTabs active="ponto" />
      <HlMarks done={done} />
      <HlNav active="ponto" />
    </Root>
  );
}

function HlMenu() {
  const items: [string, string][] = [
    [clockD, "Ajuste de ponto"],
    ["M7 3h7l5 5v13H7zM14 3v5h5", "Documentos mensais"],
    ["M7 3h7l5 5v13H7zM14 3v5h5", "Documentos periódicos"],
    ["M14 4h5v16h-5M10 8l4 4-4 4M14 12H4", "Desligamento"],
    ["M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 12l2-1-1-3-2 .5-1.5-1.5.5-2-3-1-1 2h-2l-1-2-3 1 .5 2L6.5 7.5 4.5 7l-1 3 2 1v2l-2 1 1 3 2-.5 1.5 1.5-.5 2 3 1 1-2h2l1 2 3-1-.5-2 1.5-1.5 2 .5 1-3-2-1z", "Configuração"],
  ];
  return (
    <Root bg="#fdfdfd" color={hlInk}>
      <StatusBar time="9:41" />
      <div style={{ marginTop: u(28) }}>
        <HlLogo size={1.1} />
      </div>
      <div className="flex flex-col" style={{ padding: `${u(24)} ${u(18)} 0`, gap: u(10) }}>
        {items.map(([d, l]) => (
          <div key={l} className="flex items-center" style={{ gap: u(12), height: u(38), padding: `0 ${u(14)}`, borderRadius: u(6), background: "#f1f1f3", fontSize: u(10.5) }}>
            {svgIcon(d, hlInk, 15, 1.8)}
            <span className="flex-1">{l}</span>
            {svgIcon("M9 5l7 7-7 7", hlInk, 13, 2.4)}
          </div>
        ))}
      </div>
      <HlNav active="menu" />
    </Root>
  );
}

/* --- App do empregador (protótipo ilustrativo) --- */

function EmpHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div style={{ padding: `${u(4)} ${u(16)} ${u(8)}` }}>
      <HlLogo size={0.85} />
      <p style={{ marginTop: u(14), fontSize: u(15), fontWeight: 600 }}>{title}</p>
      {sub ? <p style={{ marginTop: u(3), fontSize: u(8.5), color: hlGrey }}>{sub}</p> : null}
    </div>
  );
}

function EmpAprovar({ approved }: { approved?: boolean }) {
  return (
    <Root bg="#fdfdfd" color={hlInk}>
      <StatusBar time="9:41" />
      <EmpHeader title="Aprovações" sub={approved ? "Nenhum pedido pendente" : "1 pedido aguardando você"} />
      <div style={{ margin: `${u(6)} ${u(16)} 0`, padding: u(12), borderRadius: u(8), border: "1px solid #ececf0", background: "#fff" }}>
        <p style={{ fontSize: u(10.5), fontWeight: 600 }}>Ajuste de ponto</p>
        <p style={{ marginTop: u(4), fontSize: u(8.5), color: hlGrey }}>Quinta-feira, 30 de janeiro</p>
        <div className="grid grid-cols-2" style={{ marginTop: u(8), gap: u(6), fontSize: u(8.5) }}>
          <span style={{ padding: u(6), borderRadius: u(5), background: "#f3f3f5" }}>
            Registrado
            <b className="tabular block" style={{ fontSize: u(11) }}>
              Saída 17:00
            </b>
          </span>
          <span style={{ padding: u(6), borderRadius: u(5), background: "#fff1e8" }}>
            Pedido
            <b className="tabular block" style={{ fontSize: u(11), color: hlOrange }}>
              Saída 18:00
            </b>
          </span>
        </div>
        {approved ? (
          <div className="flex items-center" style={{ marginTop: u(10), gap: u(6), padding: `${u(7)} ${u(9)}`, borderRadius: u(6), background: "#e9f8ee", color: "#13753a", fontSize: u(9), fontWeight: 600 }}>
            {svgIcon("M6 12l4 4 8-8", "#13753a", 11, 3)} Ajuste aprovado. As horas foram atualizadas.
          </div>
        ) : (
          <div className="grid grid-cols-2" style={{ marginTop: u(10), gap: u(6), fontSize: u(9.5), fontWeight: 600 }}>
            <span className="flex items-center justify-center" style={{ height: u(28), borderRadius: u(14), border: "1px solid #d4d4d8" }}>
              Recusar
            </span>
            <span className="flex items-center justify-center" style={{ height: u(28), borderRadius: u(14), background: hlOrange, color: "#fff" }}>
              Aprovar
            </span>
          </div>
        )}
      </div>
      <HlNav active="aprovacoes" />
    </Root>
  );
}

function EmpResumo() {
  const stats: [string, string][] = [
    ["Horas trabalhadas", "129h"],
    ["Horas extras", "3h"],
    ["Atrasos", "0h"],
    ["Faltas", "0"],
  ];
  return (
    <Root bg="#fdfdfd" color={hlInk}>
      <StatusBar time="9:41" />
      <EmpHeader title="Resumo do mês" sub="Funcionária exemplo · janeiro" />
      <HlHoursCard worked="129.00" pct={77} />
      <div className="grid grid-cols-2" style={{ margin: `${u(12)} ${u(14)} 0`, gap: u(8) }}>
        {stats.map(([k, v]) => (
          <span key={k} style={{ padding: u(10), borderRadius: u(6), background: "#f3f3f5" }}>
            <span className="block" style={{ fontSize: u(8), color: hlGrey }}>
              {k}
            </span>
            <span className="tabular block" style={{ fontSize: u(15), fontWeight: 700 }}>
              {v}
            </span>
          </span>
        ))}
      </div>
      <HlNav active="ponto" />
    </Root>
  );
}

function EmpDocumentos({ notified }: { notified?: boolean }) {
  const docs = ["Recibo de pagamento", "Folha de ponto", "Guia DAE"];
  return (
    <Root bg="#fdfdfd" color={hlInk}>
      <StatusBar time="9:41" />
      <EmpHeader title="Documentos" sub="Janeiro de 2025" />
      <div className="flex flex-col" style={{ padding: `${u(4)} ${u(16)} 0`, gap: u(8) }}>
        {docs.map((d, i) => (
          <div key={d} className="flex items-center" style={{ gap: u(10), height: u(40), padding: `0 ${u(12)}`, borderRadius: u(6), background: "#f1f1f3", fontSize: u(10) }}>
            {svgIcon("M7 3h7l5 5v13H7zM14 3v5h5", hlInk, 14)}
            <span className="flex-1">{d}</span>
            {i === 0 ? (
              <span style={{ padding: `${u(4)} ${u(9)}`, borderRadius: u(10), background: notified ? "#e9f8ee" : hlOrange, color: notified ? "#13753a" : "#fff", fontSize: u(8.5), fontWeight: 600 }}>
                {notified ? "Emitido" : "Emitir"}
              </span>
            ) : (
              <span style={{ fontSize: u(8), color: hlGrey }}>Disponível</span>
            )}
          </div>
        ))}
      </div>
      {notified ? (
        <div className="absolute" style={{ left: u(12), right: u(12), top: u(34), padding: `${u(10)} ${u(12)}`, borderRadius: u(12), background: "#fff", boxShadow: "0 12px 30px -10px rgba(0,0,0,0.35)" }}>
          <div className="flex items-center" style={{ gap: u(6) }}>
            <HlLogo size={0.65} />
            <span className="ml-auto" style={{ fontSize: u(7.5), color: hlGrey }}>
              agora
            </span>
          </div>
          <p style={{ marginTop: u(5), fontSize: u(9.5) }}>O recibo de janeiro está pronto para baixar e enviar.</p>
        </div>
      ) : null}
      <HlNav active="menu" />
    </Root>
  );
}

/* ======================== Seleção ======================== */

export function PlHlScreen({ id }: { id: PlHlScreenId }): ReactNode {
  switch (id) {
    case "pl-splash":
      return <PlSplash />;
    case "pl-antes":
      return <PlAntes />;
    case "pl-escalacao":
      return <PlEscalacao />;
    case "pl-escalacao-vazia":
      return <PlEscalacao filled={0} />;
    case "pl-escalacao-parcial":
      return <PlEscalacao filled={5} />;
    case "pl-escalacao-auto":
      return <PlEscalacao auto />;
    case "pl-escalacao-salva":
      return <PlEscalacao auto toast />;
    case "hl-resumo":
      return <HlResumo />;
    case "hl-ponto-0":
      return <HlPonto done={0} />;
    case "hl-ponto-1":
      return <HlPonto done={1} />;
    case "hl-ponto-2":
      return <HlPonto done={2} />;
    case "hl-ponto-3":
      return <HlPonto done={3} />;
    case "hl-ponto-4":
      return <HlPonto done={4} />;
    case "hl-menu":
      return <HlMenu />;
    case "hl-emp-aprovar":
      return <EmpAprovar />;
    case "hl-emp-aprovado":
      return <EmpAprovar approved />;
    case "hl-emp-resumo":
      return <EmpResumo />;
    case "hl-emp-documentos":
      return <EmpDocumentos />;
    case "hl-emp-notificacao":
      return <EmpDocumentos notified />;
  }
}

/** Caixa que dá container a um componente solto, para mostrá-lo ampliado e nítido. */
export function ComponentZoom({ base, children, style }: { base: number; children: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{ width: "100%", maxWidth: base, containerType: "inline-size", ...style }}>
      <div style={{ fontFamily: "Inter, 'Segoe UI', Roboto, Arial, sans-serif", color: ink }}>{children}</div>
    </div>
  );
}
