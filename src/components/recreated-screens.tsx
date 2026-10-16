import type { CSSProperties, ReactNode } from "react";
import { PlHlScreen, isPlHlScreen, type PlHlScreenId } from "./recreated-screens-pl-hl";

/*
 * Telas redesenhadas em código (HTML/CSS + SVG) a partir do protótipo
 * original do Akamai: texto real e vetores, nítidos em
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
  | "akamai-trafego";

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

export function BrazilFlag({ w }: { w: number }) {
  return (
    <svg viewBox="0 0 20 14" style={{ width: u(w), flexShrink: 0 }} aria-hidden="true">
      <rect width="20" height="14" rx="1.5" fill="#1f9a46" />
      <path d="M10 2 18 7 10 12 2 7z" fill="#fedf00" />
      <circle cx="10" cy="7" r="3" fill="#1d3f8f" />
    </svg>
  );
}

export const Icon = {
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

export const navy = "#0f3a6b";
const navyDark = "#0a2c54";

export function NetworkBg() {
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

export function AkamaiWordmark({ size = 34 }: { size?: number }) {
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

export function AkHeader({ title }: { title: string }) {
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

export function AkFilters() {
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

export function AkCard({ children, style }: { children: ReactNode; style?: CSSProperties }) {
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

export function Bar({ label, total, value, color, pct, sub }: { label: string; total: string; value: string; color: string; pct: number; sub?: string }) {
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

export function Pie({ size, slices }: { size: number; slices: [number, string][] }) {
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

export const wafSlices: [number, string][] = [
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
  }
}
