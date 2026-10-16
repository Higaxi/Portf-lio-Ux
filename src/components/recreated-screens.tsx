import type { CSSProperties, ReactNode } from "react";
import { PlHlScreen, isPlHlScreen, type PlHlScreenId } from "./recreated-screens-pl-hl";

/*
 * Telas redesenhadas em código (HTML/CSS + SVG) a partir dos protótipos
 * originais de Akamai e Angel Investor: texto real e vetores, nítidos em
 * qualquer tamanho. Desenhadas numa base de 300px de largura e escaladas com
 * unidades de container (cqw), então a proporção fica igual em qualquer frame.
 * Dados de exemplo iguais aos do protótipo original (demonstração do layout).
 */

/** px na base de 300px → unidade proporcional à largura da tela. */
export const u = (n: number) => `calc(${n} * 100cqw / 300)`;

export type ScreenId =
  | PlHlScreenId
  | "akamai-login"
  | "akamai-waf"
  | "akamai-trafego"
  | "angel-abertura"
  | "angel-cadastro"
  | "angel-feed"
  | "angel-conversas"
  | "angel-chat";

/* ---------- Peças comuns ---------- */

export function Root({ children, bg, color = "#111827" }: { children: ReactNode; bg: string; color?: string }) {
  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden"
      style={{ containerType: "inline-size", background: bg, color, fontFamily: "Inter, 'Segoe UI', Roboto, Arial, sans-serif" }}
    >
      {children}
    </div>
  );
}

/** Wrapper que fixa a proporção da tela (9:19.5) e cria o container. */
export function ScreenBox({ id }: { id: ScreenId }) {
  return (
    <div className="relative w-full" style={{ aspectRatio: "9 / 19.5", containerType: "inline-size" }}>
      <div className="absolute inset-0">
        <RecreatedScreen id={id} />
      </div>
    </div>
  );
}

export function StatusBar({ time, light }: { time: string; light?: boolean }) {
  const c = light ? "#ffffff" : "#111827";
  return (
    <div className="flex shrink-0 items-center justify-between" style={{ height: u(30), padding: `0 ${u(18)}`, fontSize: u(11), fontWeight: 600, color: c }}>
      <span>{time}</span>
      <svg viewBox="0 0 44 12" style={{ width: u(40) }} aria-hidden="true">
        <g fill={c}>
          <rect x="0" y="8" width="2.5" height="4" rx="0.6" />
          <rect x="4" y="6" width="2.5" height="6" rx="0.6" />
          <rect x="8" y="3.5" width="2.5" height="8.5" rx="0.6" />
          <rect x="12" y="1" width="2.5" height="11" rx="0.6" />
          <path d="M22 4.5a7 7 0 0 1 9.5 0l-1.2 1.3a5.2 5.2 0 0 0-7.1 0zM24.4 7.1a3.6 3.6 0 0 1 4.7 0l-1.2 1.3a1.9 1.9 0 0 0-2.3 0zM26.75 10.3l1.15-1.2 1.15 1.2-1.15 1.2z" />
          <rect x="34" y="2" width="9" height="8" rx="2" fillOpacity="0.4" />
          <rect x="35" y="3" width="6.5" height="6" rx="1.2" />
        </g>
      </svg>
    </div>
  );
}

function BrazilFlag({ w }: { w: number }) {
  return (
    <svg viewBox="0 0 20 14" style={{ width: u(w), flexShrink: 0 }} aria-hidden="true">
      <rect width="20" height="14" rx="1.5" fill="#1f9a46" />
      <path d="M10 2 18 7 10 12 2 7z" fill="#fedf00" />
      <circle cx="10" cy="7" r="3" fill="#1d3f8f" />
    </svg>
  );
}

const Icon = {
  back: (c: string, s = 16) => (
    <svg viewBox="0 0 24 24" style={{ width: u(s) }} fill="none" stroke={c} strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
      <path d="M15 5l-7 7 7 7" />
    </svg>
  ),
  menu: (c: string, s = 16) => (
    <svg viewBox="0 0 24 24" style={{ width: u(s) }} fill="none" stroke={c} strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  chevron: (c: string, s = 12) => (
    <svg viewBox="0 0 24 24" style={{ width: u(s) }} fill="none" stroke={c} strokeWidth="2.6" strokeLinecap="round" aria-hidden="true">
      <path d="M9 5l7 7-7 7" />
    </svg>
  ),
  down: (c: string, s = 10) => (
    <svg viewBox="0 0 24 24" style={{ width: u(s) }} fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" aria-hidden="true">
      <path d="M6 9l6 6 6-6" />
    </svg>
  ),
  calendar: (c: string, s = 12) => (
    <svg viewBox="0 0 24 24" style={{ width: u(s) }} fill="none" stroke={c} strokeWidth="2.2" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  ),
  eye: (c: string, s = 14) => (
    <svg viewBox="0 0 24 24" style={{ width: u(s) }} fill="none" stroke={c} strokeWidth="2" aria-hidden="true">
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  search: (c: string, s = 14) => (
    <svg viewBox="0 0 24 24" style={{ width: u(s) }} fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-4-4" />
    </svg>
  ),
};

/* ---------- Akamai ---------- */

const navy = "#0f3a6b";
const navyDark = "#0a2c54";

function NetworkBg() {
  const pts = [
    [20, 80], [90, 40], [160, 110], [250, 60], [280, 180], [200, 230], [60, 210], [120, 300],
    [240, 340], [30, 420], [150, 470], [270, 500], [80, 560], [200, 610], [290, 630],
  ];
  const lines = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 2], [5, 6], [6, 0], [6, 7], [7, 8], [8, 4], [7, 9], [9, 10], [10, 11], [11, 8], [10, 12], [12, 13], [13, 14], [13, 11]];
  return (
    <svg viewBox="0 0 300 650" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
      {lines.map(([a, b], i) => (
        <line key={i} x1={pts[a][0]} y1={pts[a][1]} x2={pts[b][0]} y2={pts[b][1]} stroke="#ffffff" strokeOpacity="0.09" strokeWidth="0.8" />
      ))}
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2" fill="#ffffff" fillOpacity="0.22" />
      ))}
    </svg>
  );
}

function AkamaiWordmark({ size = 34 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center" style={{ gap: u(4) }}>
      <svg viewBox="0 0 40 40" style={{ width: u(size * 0.95) }} aria-hidden="true">
        <path d="M30 6A17 17 0 1 0 34 30" fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
        <path d="M24 13A9 9 0 1 0 27 27" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.8" />
      </svg>
      <span style={{ fontSize: u(size), fontWeight: 800, fontStyle: "italic", letterSpacing: "-0.03em", color: "#fff", lineHeight: 1 }}>Akamai</span>
    </div>
  );
}

function AkHeader({ title }: { title: string }) {
  return (
    <div style={{ background: navy }}>
      <StatusBar time="19:02" light />
      <div className="flex items-center justify-between" style={{ padding: `${u(8)} ${u(14)} ${u(12)}`, color: "#fff" }}>
        {Icon.back("#fff")}
        <span style={{ fontSize: u(13.5), fontWeight: 600 }}>{title}</span>
        {Icon.menu("#fff")}
      </div>
    </div>
  );
}

function AkFilters() {
  const field: CSSProperties = { background: "#fff", border: "1px solid #c9d2df", borderRadius: u(3), fontSize: u(10), padding: `${u(5)} ${u(7)}` };
  return (
    <div style={{ padding: `${u(10)} ${u(12)} ${u(4)}` }}>
      <p style={{ fontSize: u(10.5), fontWeight: 600, color: "#1f2937" }}>Contract number</p>
      <div className="flex items-stretch" style={{ marginTop: u(4) }}>
        <span className="flex-1" style={{ ...field, fontWeight: 600, borderRight: 0, borderRadius: `${u(3)} 0 0 ${u(3)}` }}>
          0522-000271
        </span>
        <span className="flex items-center justify-center" style={{ background: navy, width: u(22), borderRadius: `0 ${u(3)} ${u(3)} 0` }}>
          {Icon.down("#fff")}
        </span>
      </div>
      <div className="flex items-center" style={{ marginTop: u(8), gap: u(6) }}>
        <span style={{ fontSize: u(9.5), fontWeight: 600, color: "#1f2937", whiteSpace: "nowrap" }}>Buscar Período:</span>
        <span className="flex-1" style={{ ...field, color: "#6b7280", fontSize: u(9) }}>
          01/07/2022 a 30/07/2022
        </span>
        <span className="flex items-center justify-center" style={{ background: navy, width: u(22), height: u(22), borderRadius: u(3) }}>
          {Icon.calendar("#fff")}
        </span>
      </div>
    </div>
  );
}

function AkCard({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{ background: "#fff", borderRadius: u(4), boxShadow: "0 1px 2px rgba(15,58,107,0.12)", margin: `${u(6)} ${u(12)}`, padding: u(9), ...style }}>
      {children}
    </div>
  );
}

function AkamaiLogin() {
  const input: CSSProperties = {
    background: "rgba(5,25,55,0.55)",
    border: "1px solid rgba(255,255,255,0.35)",
    borderRadius: u(3),
    height: u(30),
    padding: `0 ${u(9)}`,
    fontSize: u(11),
    color: "rgba(255,255,255,0.7)",
  };
  return (
    <Root bg={`linear-gradient(170deg, #1b5394 0%, ${navy} 55%, ${navyDark} 100%)`} color="#fff">
      <NetworkBg />
      <div className="relative">
        <StatusBar time="19:02" light />
        <div className="flex justify-end" style={{ padding: `${u(10)} ${u(16)}` }}>
          <span className="flex items-center" style={{ gap: u(5), border: "1px solid rgba(255,255,255,0.45)", borderRadius: u(4), padding: `${u(4)} ${u(7)}`, fontSize: u(10.5), fontWeight: 600 }}>
            <BrazilFlag w={18} /> PT-BR {Icon.down("#fff")}
          </span>
        </div>
      </div>
      <div className="relative" style={{ margin: `${u(40)} ${u(20)} 0`, padding: `${u(26)} ${u(18)} ${u(22)}`, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: u(6) }}>
        <AkamaiWordmark />
        <p className="text-center" style={{ marginTop: u(8), fontSize: u(12.5), color: "rgba(255,255,255,0.9)" }}>
          Mobile Control Center
        </p>
        <div className="flex items-center" style={{ ...input, marginTop: u(34) }}>
          E-mail
        </div>
        <div className="flex items-center justify-between" style={{ ...input, marginTop: u(12) }}>
          Senha {Icon.eye("rgba(255,255,255,0.85)")}
        </div>
        <div className="flex items-center justify-center" style={{ marginTop: u(26), height: u(32), borderRadius: u(3), background: "#8fbbe4", color: navyDark, fontSize: u(12), fontWeight: 600 }}>
          Fazer Login
        </div>
        <p className="text-center" style={{ marginTop: u(26), fontSize: u(10.5), textDecoration: "underline" }}>
          Esqueci minha senha
        </p>
      </div>
    </Root>
  );
}

function Bar({ label, total, value, color, pct, sub }: { label: string; total: string; value: string; color: string; pct: number; sub?: string }) {
  return (
    <div style={{ marginTop: u(7) }}>
      <div className="flex justify-between" style={{ fontSize: u(9), fontWeight: 600, color: "#1f2937" }}>
        <span>{label}</span>
        <span style={{ color: "#6b7280", fontWeight: 500 }}>{total}</span>
      </div>
      <div style={{ marginTop: u(4), height: u(14), width: `${pct}%`, borderRadius: u(2), background: color, boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.12)" }} />
      <p style={{ marginTop: u(3), fontSize: u(8.5), color: "#6b7280" }}>{sub ?? value}</p>
    </div>
  );
}

function Pie({ size, slices }: { size: number; slices: [number, string][] }) {
  const offsets = slices.map((_, i) => slices.slice(0, i).reduce((a, [q]) => a + q, 0));
  return (
    <svg viewBox="0 0 42 42" style={{ width: u(size), flexShrink: 0 }} className="-rotate-90" aria-hidden="true">
      {slices.map(([p, c], i) => (
        <circle key={c} cx="21" cy="21" r="10.5" fill="none" stroke={c} strokeWidth="21" strokeDasharray={`${(p * 66) / 100} 66`} strokeDashoffset={-((offsets[i] * 66) / 100)} />
      ))}
      <circle cx="21" cy="21" r="2" fill="#fff" />
    </svg>
  );
}

const wafSlices: [number, string][] = [
  [56, "#1e6fff"],
  [26, "#f97316"],
  [8, "#a855f7"],
  [6, "#5eead4"],
  [4, "#ef4444"],
];

function AkamaiWaf() {
  return (
    <Root bg="#eef1f5">
      <AkHeader title="Web Application Firewall" />
      <AkFilters />
      <p style={{ padding: `${u(6)} ${u(12)} 0`, fontSize: u(10.5), fontWeight: 700 }}>Waf Attack Traffic Summary</p>
      <AkCard>
        <Bar label="Edge Hits" total="57.8 M Total" value="95.5 K" color="#1e6fff" pct={15} />
        <Bar label="Edge Page Requests" total="53.9 M Total" value="95.5 K" color="#f97316" pct={15} />
        <Bar label="Edge Bandwidth" total="772 GB Total" value="34.6 MB" color="#a855f7" pct={78} />
      </AkCard>
      <p style={{ padding: `${u(6)} ${u(12)} 0`, fontSize: u(10.5), fontWeight: 700 }}>Waf Attack Groups Detected</p>
      <AkCard style={{ display: "flex", alignItems: "center", gap: u(10) }}>
        <Pie size={92} slices={wafSlices} />
        <ul className="flex flex-col" style={{ gap: u(4), fontSize: u(8.5) }}>
          {[
            ["Web Policy Violation", "#1e6fff", "(53,635) 56%"],
            ["Penalty", "#f97316", "(26,253M) 2.83%"],
            ["Command Injection", "#a855f7", "(6,036M) 2.83%"],
            ["Custom Rules", "#5eead4", "(6,023M) 2.83%"],
            ["Local File Inclusion", "#ef4444", "(26,253M) 3%"],
          ].map(([n, c, v]) => (
            <li key={n} className="flex items-start" style={{ gap: u(4) }}>
              <span style={{ width: u(7), height: u(7), borderRadius: "50%", background: c, marginTop: u(2), flexShrink: 0 }} />
              <span>
                {n}
                <span className="block" style={{ color: "#6b7280", fontSize: u(7.5) }}>
                  {v}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </AkCard>
    </Root>
  );
}

function AkamaiTrafego() {
  return (
    <Root bg="#eef1f5">
      <AkHeader title="Tráfego Geral" />
      <AkFilters />
      <AkCard>
        <Bar label="Edge vs. Origin (Offload)" total="18.92% Total" value="" sub="56.84% Maximum" color="#7dd3c8" pct={22} />
        <Bar label="Edge" total="1.49 TB Total" value="" sub="9.19 Mb/s Max" color="#f97316" pct={96} />
        <Bar label="Midgress" total="1.32 TB Total" value="" sub="8.16 Mb/s Max" color="#7ac943" pct={84} />
        <Bar label="Edge Bandwidth" total="1.21 TB Total" value="" sub="7.35 Mb/s Max" color="#2f74d0" pct={76} />
      </AkCard>
      <div style={{ margin: `${u(6)} ${u(12)}`, background: "#fff", borderRadius: u(4) }}>
        {["WAF Attack Geral", "Hostname", "Top URL's"].map((t, i) => (
          <div key={t} className="flex items-center justify-between" style={{ padding: `${u(10)} ${u(10)}`, borderTop: i ? "1px solid #e5e9f0" : 0, fontSize: u(10.5), fontWeight: 600 }}>
            {t} {Icon.chevron("#1f2937")}
          </div>
        ))}
      </div>
    </Root>
  );
}

/* ---------- Angel Investor ---------- */

const purple = "#6c4cf1";
const indigo = "#1c1773";

/** Avatar ilustrado (flat): fundo colorido, cabeça e ombros. */
export function Avatar({ seed, size, ring }: { seed: number; size: number; ring?: string }) {
  const bgs = [purple, indigo, "#a594f9", "#2b2a8c", "#8b6cf6", "#4f46e5"];
  const skins = ["#f2c7a5", "#c68a5e", "#8d5a3b", "#e9b48f", "#a86f49", "#f6d3b8"];
  const hairs = ["#1f1a17", "#3b2416", "#111111", "#6b3f1d", "#2a1a10", "#c8a46b"];
  const shirts = ["#ffffff", "#e5e7eb", "#fde68a", "#c7d2fe", "#fecaca", "#d1fae5"];
  const i = seed % bgs.length;
  return (
    <svg viewBox="0 0 40 40" style={{ width: u(size), flexShrink: 0, borderRadius: "50%", boxShadow: ring ? `0 0 0 ${u(2)} ${ring}` : undefined }} aria-hidden="true">
      <circle cx="20" cy="20" r="20" fill={bgs[i]} />
      <clipPath id={`av${seed}`}>
        <circle cx="20" cy="20" r="20" />
      </clipPath>
      <g clipPath={`url(#av${seed})`}>
        <path d="M5 42c1-9 7-14 15-14s14 5 15 14z" fill={shirts[(i + seed) % shirts.length]} />
        <rect x="17" y="22" width="6" height="7" rx="2" fill={skins[(i * 2 + seed) % skins.length]} />
        <ellipse cx="20" cy="17" rx="7" ry="8" fill={skins[(i * 2 + seed) % skins.length]} />
        <path d={seed % 2 ? "M12.5 16c0-6 3.5-9 7.5-9s7.5 3 7.5 9c-1.5-3-4-4.5-7.5-4.5S14 13 12.5 16z" : "M12 18c-1-8 3-12 8-12s9 4 8 12c-1-2-1.5-5-3-6-2 1-6 1-9 0-1.5 1-3 4-4 6z"} fill={hairs[(i + seed * 3) % hairs.length]} />
      </g>
    </svg>
  );
}

/** Pessoa ilustrada grande dentro de forma roxa (mosaico e cadastro). */
function Portrait({ seed, shape, size }: { seed: number; shape: "circle" | "drop"; size: number }) {
  const bg = seed % 2 ? indigo : purple;
  const skin = ["#c68a5e", "#f2c7a5", "#8d5a3b", "#e9b48f"][seed % 4];
  const hair = ["#1f1a17", "#c8a46b", "#111111", "#3b2416"][seed % 4];
  return (
    <svg viewBox="0 0 100 100" style={{ width: u(size) }} aria-hidden="true">
      {shape === "circle" ? <circle cx="50" cy="56" r="44" fill={bg} /> : <path d="M6 100V56a44 44 0 0 1 88 0v44z" fill={bg} />}
      <path d="M20 100c2-20 14-30 30-30s28 10 30 30z" fill="#e5e7eb" />
      <rect x="43" y="56" width="14" height="16" rx="5" fill={skin} />
      <ellipse cx="50" cy="44" rx="15" ry="17" fill={skin} />
      <path d="M34 46c-3-16 6-26 16-26s19 10 16 26c-2-6-4-10-7-12-5 2-13 2-18 0-3 2-5 6-7 12z" fill={hair} />
      <rect x="60" y="66" width="11" height="18" rx="2.5" fill="#1f2937" transform="rotate(-12 65 75)" />
      <ellipse cx="62" cy="80" rx="6" ry="5" fill={skin} />
    </svg>
  );
}

function AngelLogo({ size = 1 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center" style={{ gap: u(2) }}>
      <span className="text-right" style={{ fontSize: u(13 * size), fontWeight: 700, lineHeight: 0.95, color: "#2c4fd6" }}>
        Angel
        <br />
        Investor
        <span className="block" style={{ fontSize: u(7 * size), fontWeight: 600, textAlign: "center" }}>
          Club
        </span>
      </span>
      <svg viewBox="0 0 24 40" style={{ width: u(15 * size) }} aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={i} d={`M2 ${36 - i * 2}C${8 + i * 2} ${30 - i * 6} ${12 + i} ${14 - i * 2} ${20 - i} ${4 + i * 3}`} fill="none" stroke="#f08a3e" strokeWidth="1.6" strokeLinecap="round" />
        ))}
      </svg>
    </div>
  );
}

function IvyMark() {
  return <span style={{ fontWeight: 900, fontStyle: "italic", letterSpacing: "-0.06em", fontSize: u(15) }}>ivy</span>;
}

function PurpleButton({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-center" style={{ height: u(38), borderRadius: u(19), background: purple, color: "#fff", fontSize: u(12), fontWeight: 500 }}>
      {children}
    </div>
  );
}

function AngelNav({ active }: { active: "chat" | "home" }) {
  const c = (on: boolean) => (on ? purple : "#6b7280");
  return (
    <div className="mt-auto flex items-center justify-around" style={{ height: u(46), borderTop: "1px solid #eee", background: "#fff" }}>
      <svg viewBox="0 0 24 24" style={{ width: u(18) }} fill="none" stroke={c(false)} strokeWidth="1.8" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
      </svg>
      <svg viewBox="0 0 24 24" style={{ width: u(18) }} fill={active === "chat" ? purple : "none"} stroke={c(active === "chat")} strokeWidth="1.8" aria-hidden="true">
        <path d="M4 12a8 7 0 1 1 3.5 5.8L4 19.5l1-3.4A6.8 6.8 0 0 1 4 12z" />
      </svg>
      <svg viewBox="0 0 24 24" style={{ width: u(18) }} fill={active === "home" ? purple : "none"} stroke={c(active === "home")} strokeWidth="1.8" aria-hidden="true">
        <path d="M4 11l8-7 8 7v9h-5v-6H9v6H4z" />
      </svg>
      <svg viewBox="0 0 24 24" style={{ width: u(18) }} fill="none" stroke={c(false)} strokeWidth="1.8" aria-hidden="true">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1" />
      </svg>
    </div>
  );
}

function Fab({ bottom }: { bottom: number }) {
  return (
    <span className="absolute flex items-center justify-center" style={{ left: "50%", transform: "translateX(-50%)", bottom: u(bottom), width: u(42), height: u(42), borderRadius: "50%", background: purple, color: "#fff", fontSize: u(26), lineHeight: 1, boxShadow: "0 6px 14px -4px rgba(108,76,241,0.6)" }}>
      +
    </span>
  );
}

function AngelAbertura() {
  return (
    <Root bg="#fbfbfd">
      <StatusBar time="14:10" />
      <div style={{ marginTop: u(14) }}>
        <AngelLogo />
      </div>
      <div className="grid grid-cols-2" style={{ padding: `${u(14)} ${u(34)} 0`, gap: u(8) }}>
        <Portrait seed={0} shape="drop" size={110} />
        <Portrait seed={1} shape="circle" size={110} />
        <Portrait seed={3} shape="circle" size={110} />
        <Portrait seed={2} shape="drop" size={110} />
      </div>
      <p className="text-center" style={{ marginTop: u(18), padding: `0 ${u(24)}`, fontSize: u(13), fontWeight: 600, lineHeight: 1.25 }}>
        Investimos em pessoas, transformamos vidas, realizamos sonhos!
      </p>
      <p className="text-center" style={{ marginTop: u(6), padding: `0 ${u(30)}`, fontSize: u(9.5), color: "#4b5563", lineHeight: 1.3 }}>
        Investimos em pessoas, transformamos vidas, realizamos sonhos!
      </p>
      <div className="flex-1" />
      <div style={{ margin: `0 ${u(26)}` }}>
        <PurpleButton>Iniciar</PurpleButton>
      </div>
      <p className="flex items-center justify-center" style={{ margin: `${u(16)} 0 ${u(26)}`, gap: u(5), fontSize: u(11) }}>
        Produzido por <IvyMark />
      </p>
    </Root>
  );
}

function AngelCadastro() {
  return (
    <Root bg="#fbfbfd">
      <StatusBar time="14:10" />
      <div style={{ marginTop: u(16) }}>
        <AngelLogo size={1.2} />
      </div>
      <div className="flex justify-center" style={{ marginTop: u(24) }}>
        <Portrait seed={0} shape="circle" size={230} />
      </div>
      <div className="flex-1" />
      <div className="flex items-center" style={{ margin: `0 ${u(26)}`, height: u(38), border: "1px solid #d1d5db", borderRadius: u(6), background: "#fff", overflow: "hidden" }}>
        <span className="flex h-full items-center justify-center" style={{ width: u(46), background: "#f3f4f6", borderRight: "1px solid #d1d5db" }}>
          <BrazilFlag w={22} />
        </span>
        <span style={{ paddingLeft: u(10), fontSize: u(11.5), color: "#6b7280" }}>+55 (__) _____-____</span>
      </div>
      <div style={{ margin: `${u(14)} ${u(26)} 0` }}>
        <PurpleButton>Cadastre o seu número</PurpleButton>
      </div>
      <p className="flex items-center justify-center" style={{ margin: `${u(16)} 0 ${u(26)}`, gap: u(5), fontSize: u(11) }}>
        Produzido por <IvyMark />
      </p>
    </Root>
  );
}

function PostImage() {
  return (
    <div className="relative overflow-hidden" style={{ height: u(130), borderRadius: u(6), background: "linear-gradient(135deg, #4c3bd6, #8f7bff)" }}>
      <svg viewBox="0 0 240 130" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => {
          const x = 22 + i * 33;
          const y = 70 + (i % 2) * 8;
          return (
            <g key={i} fill={i % 2 ? "#ffffff" : "#d9d3ff"} fillOpacity="0.9">
              <circle cx={x} cy={y} r="10" />
              <path d={`M${x - 16} 130c0-24 7-36 16-36s16 12 16 36z`} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

const storyNames = ["Seu Story", "Cameron", "Courtney", "Savannah", "Kristin", "Jenny"];

function AngelFeed() {
  return (
    <Root bg="#f6f6f9">
      <StatusBar time="14:10" />
      <div className="flex" style={{ gap: u(9), padding: `${u(6)} ${u(10)} ${u(10)}`, overflow: "hidden", background: "#fff" }}>
        {storyNames.map((n, i) => (
          <div key={n} className="flex shrink-0 flex-col items-center" style={{ width: u(42), gap: u(3) }}>
            <Avatar seed={i + 2} size={38} ring={i === 0 ? undefined : purple} />
            <span style={{ fontSize: u(7.5), color: "#374151" }}>{n}</span>
          </div>
        ))}
      </div>
      <div style={{ margin: `${u(8)} ${u(10)}`, padding: u(9), background: "#fff", borderRadius: u(8) }}>
        <div className="flex items-center" style={{ gap: u(6) }}>
          <Avatar seed={6} size={22} />
          <span style={{ fontSize: u(10.5), fontWeight: 700 }}>Angel Investor Club</span>
          <span className="ml-auto" style={{ fontSize: u(12), color: "#9ca3af" }}>
            ···
          </span>
        </div>
        <p style={{ marginTop: u(6), fontSize: u(8.5), color: "#4b5563", lineHeight: 1.35 }}>Uma comunidade forte com pessoas engajadas. Em pouco mais de um ano, iniciamos a construção do Angel…</p>
        <div style={{ marginTop: u(7) }}>
          <PostImage />
        </div>
        <div className="flex justify-between" style={{ marginTop: u(6), fontSize: u(8), color: "#6b7280" }}>
          <span>♡ 478 Curtidas</span>
          <span>256 Comentários</span>
        </div>
      </div>
      <div style={{ margin: `0 ${u(10)}`, padding: u(9), background: "#fff", borderRadius: u(8) }}>
        <div className="flex items-center" style={{ gap: u(6) }}>
          <Avatar seed={1} size={22} />
          <span style={{ fontSize: u(10.5), fontWeight: 700 }}>Miller Augusto</span>
        </div>
        <p style={{ marginTop: u(6), fontSize: u(8.5), color: "#4b5563", lineHeight: 1.35 }}>Desde o momento em que conheci o projeto, fiquei impressionado com sua dedicação e a energia dos membros do Angel Investor Club.</p>
      </div>
      <Fab bottom={58} />
      <AngelNav active="home" />
    </Root>
  );
}

const chats: [string, string, string, number][] = [
  ["Miller Augusto", "Perfect! Will check it", "09:34 PM", 0],
  ["Miller Augusto", "Thanks, Jimmy! Talk later", "09:24 PM", 2],
  ["Sara Mustach", "Sound good for me too!", "09:11 PM", 3],
  ["Theresa Webb", "Quis dignissim dictum", "09:34 PM", 0],
  ["Devon Lane", "Quem leo lacus", "09:24 PM", 0],
  ["Jerome Bell", "Felis ligula scelerisque", "09:11 PM", 0],
  ["Brooklyn Simmons", "Mattis nascetur ridiculus", "09:34 PM", 0],
];

function AngelConversas() {
  return (
    <Root bg="#fbfbfd">
      <StatusBar time="14:10" />
      <div className="flex items-center" style={{ gap: u(8), padding: `${u(6)} ${u(12)} ${u(8)}` }}>
        <span className="flex flex-1 items-center" style={{ gap: u(6), height: u(32), padding: `0 ${u(10)}`, borderRadius: u(8), background: "#f1f1f5", fontSize: u(10), color: "#9ca3af" }}>
          {Icon.search("#9ca3af")} Pesquise por mensagem…
        </span>
        <span className="flex items-center justify-center" style={{ width: u(32), height: u(32), borderRadius: u(8), border: "1px solid #e5e7eb" }}>
          <svg viewBox="0 0 24 24" style={{ width: u(14) }} fill="none" stroke="#6b7280" strokeWidth="2" aria-hidden="true">
            <path d="M4 20h4L19 9l-4-4L4 16zM14 6l4 4" />
          </svg>
        </span>
      </div>
      <ul>
        {chats.map(([n, m, t, b], i) => (
          <li key={i} className="flex items-center" style={{ gap: u(9), padding: `${u(7)} ${u(12)}`, borderBottom: "1px solid #f0f0f4" }}>
            <Avatar seed={i + 1} size={32} />
            <span className="min-w-0 flex-1">
              <span className="block" style={{ fontSize: u(10.5), fontWeight: 600 }}>
                {n}
              </span>
              <span className="block truncate" style={{ fontSize: u(9), color: "#6b7280" }}>
                {m}
              </span>
            </span>
            <span className="flex flex-col items-end" style={{ gap: u(3) }}>
              <span style={{ fontSize: u(7.5), color: "#9ca3af" }}>{t}</span>
              {b ? (
                <span className="flex items-center justify-center" style={{ width: u(15), height: u(15), borderRadius: "50%", background: purple, color: "#fff", fontSize: u(8), fontWeight: 700 }}>
                  {b}
                </span>
              ) : (
                <span style={{ height: u(15) }} />
              )}
            </span>
          </li>
        ))}
      </ul>
      <Fab bottom={58} />
      <AngelNav active="chat" />
    </Root>
  );
}

function Bubble({ me, children }: { me?: boolean; children: ReactNode }) {
  return (
    <div
      style={{
        alignSelf: me ? "flex-end" : "flex-start",
        maxWidth: "78%",
        padding: `${u(8)} ${u(11)}`,
        borderRadius: me ? `${u(14)} ${u(14)} ${u(4)} ${u(14)}` : `${u(14)} ${u(14)} ${u(14)} ${u(4)}`,
        background: me ? purple : "#f1f1f5",
        color: me ? "#fff" : "#111827",
        fontSize: u(10),
        lineHeight: 1.35,
      }}
    >
      {children}
    </div>
  );
}

function AngelChat() {
  return (
    <Root bg="#ffffff">
      <StatusBar time="14:10" />
      <div className="flex items-center" style={{ gap: u(8), padding: `${u(4)} ${u(12)} ${u(10)}`, borderBottom: "1px solid #f0f0f4" }}>
        {Icon.back("#111827")}
        <Avatar seed={1} size={30} />
        <span className="flex-1">
          <span className="block" style={{ fontSize: u(11), fontWeight: 700 }}>
            Miller Augusto
          </span>
          <span className="block" style={{ fontSize: u(8.5), color: "#16a34a" }}>
            Online
          </span>
        </span>
        <svg viewBox="0 0 24 24" style={{ width: u(18) }} fill="none" stroke="#374151" strokeWidth="1.8" aria-hidden="true">
          <rect x="3" y="6" width="13" height="12" rx="2" />
          <path d="M16 10l5-3v10l-5-3" />
        </svg>
        <svg viewBox="0 0 24 24" style={{ width: u(16) }} fill="none" stroke="#374151" strokeWidth="1.8" aria-hidden="true">
          <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
        </svg>
      </div>
      <div className="flex flex-1 flex-col" style={{ gap: u(9), padding: `${u(12)} ${u(12)}` }}>
        <Bubble>Hi, Jimmy! Any update today?</Bubble>
        <Bubble me>All good! we have some update</Bubble>
        <div style={{ alignSelf: "flex-end", width: "78%", padding: u(6), borderRadius: u(12), background: purple, color: "#fff" }}>
          <div className="flex flex-col justify-end" style={{ height: u(70), borderRadius: u(8), padding: u(8), background: "linear-gradient(135deg, #f4b56a, #c2410c 60%, #7c2d12)" }}>
            <span style={{ fontSize: u(13), fontWeight: 700, lineHeight: 1.05 }}>Inspiração Pesquisa &amp;</span>
          </div>
          <p style={{ marginTop: u(5), fontSize: u(9) }}>Here&apos;s the new landing page design!</p>
          <p style={{ fontSize: u(9), textDecoration: "underline" }}>www.bypstudio.com.br</p>
        </div>
        <Bubble>Cool! I have some feedbacks on the &ldquo;How it work&rdquo; section. but overall looks good now!</Bubble>
        <Bubble me>Perfect! Will check it</Bubble>
      </div>
      <div className="flex items-center" style={{ gap: u(8), margin: `0 ${u(12)} ${u(14)}`, height: u(36), padding: `0 ${u(12)}`, borderRadius: u(18), background: "#f1f1f5", fontSize: u(10), color: "#9ca3af" }}>
        <span className="flex-1">Type here…</span>
        <svg viewBox="0 0 24 24" style={{ width: u(16) }} fill="none" stroke="#6b7280" strokeWidth="1.8" aria-hidden="true">
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <circle cx="12" cy="13.5" r="3.5" />
          <path d="M8 7l1.5-3h5L16 7" />
        </svg>
      </div>
    </Root>
  );
}

/** Seleciona a tela pelo id. Preenche o container (use com ScreenBox). */
export function RecreatedScreen({ id }: { id: ScreenId }) {
  if (isPlHlScreen(id)) return <PlHlScreen id={id} />;
  switch (id) {
    case "akamai-login":
      return <AkamaiLogin />;
    case "akamai-waf":
      return <AkamaiWaf />;
    case "akamai-trafego":
      return <AkamaiTrafego />;
    case "angel-abertura":
      return <AngelAbertura />;
    case "angel-cadastro":
      return <AngelCadastro />;
    case "angel-feed":
      return <AngelFeed />;
    case "angel-conversas":
      return <AngelConversas />;
    case "angel-chat":
      return <AngelChat />;
  }
}
