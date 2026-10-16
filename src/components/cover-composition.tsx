/* eslint-disable @next/next/no-img-element -- composição só para exportar capas (rota de desenvolvimento) */
import type { CSSProperties, ReactNode } from "react";
import { RecreatedScreen, type ScreenId } from "./recreated-screens";

export const coverSlugs = ["akamai", "angel-investor", "premium-league", "hora-do-lar", "telas"];

type PhoneSpec = { id: ScreenId; style: CSSProperties; w?: number; label?: string; labelStyle?: CSSProperties };

type Cover = {
  bg: string;
  deco?: ReactNode;
  eyebrow: string;
  eyebrowColor: string;
  title: string[];
  sub: string;
  chips?: string[];
  claim?: { value: string; text: string };
  phones: PhoneSpec[];
  laptop?: { src: string; style: CSSProperties };
};

const pitchLines = (
  <div style={{ position: "absolute", left: 780, top: 50, width: 790, height: 800, border: "2px solid rgba(255,255,255,.1)", borderRadius: 18 }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: "50%", borderTop: "2px solid rgba(255,255,255,.1)" }} />
    <div style={{ position: "absolute", left: "50%", top: "50%", width: 220, height: 220, margin: -110, border: "2px solid rgba(255,255,255,.1)", borderRadius: "50%" }} />
  </div>
);

const covers: Record<string, Cover> = {
  akamai: {
    bg: "radial-gradient(1000px 700px at 75% 45%, #1f5fb8 0%, #0b3a75 50%, #061f42 100%)",
    eyebrow: "AKAMAI · EXBIZ",
    eyebrowColor: "#bcd6ff",
    title: ["Segurança", "no bolso"],
    sub: "Painel de firewall de aplicação web levado para o celular, com um mini design system próprio.",
    chips: ["Ataques e tráfego", "Filtro por contrato", "Design system"],
    phones: [
      { id: "akamai-login", style: { left: 860, top: 200, transform: "rotate(-7deg) scale(.88)" } },
      { id: "akamai-waf", style: { left: 1080, top: 110, zIndex: 2 } },
      { id: "akamai-trafego", style: { left: 1300, top: 210, transform: "rotate(7deg) scale(.88)" } },
    ],
  },
  "angel-investor": {
    bg: "radial-gradient(1000px 700px at 75% 50%, #8a5cff 0%, #6d3cf5 45%, #3d1a9e 100%)",
    eyebrow: "ANGEL INVESTOR CLUB",
    eyebrowColor: "#ddd3ff",
    title: ["Comunidade", "de investidores"],
    sub: "App mobile para investidores-anjo conversarem, acompanharem novidades e entrarem sem atrito.",
    chips: ["Cadastro pelo telefone", "Feed", "Chat"],
    phones: [
      { id: "angel-cadastro", style: { left: 860, top: 200, transform: "rotate(-7deg) scale(.88)" } },
      { id: "angel-abertura", style: { left: 1080, top: 110, zIndex: 2 } },
      { id: "angel-feed", style: { left: 1300, top: 210, transform: "rotate(7deg) scale(.88)" } },
    ],
  },
  "premium-league": {
    bg: "radial-gradient(1100px 700px at 78% 45%, #3b56ff 0%, #1e3bff 45%, #1229c9 100%)",
    deco: pitchLines,
    eyebrow: "PREMIUM LEAGUE",
    eyebrowColor: "#c7d2fe",
    title: ["Redesign +", "Design System"],
    sub: "Fantasy game de futebol com o novo design system, no app e no desktop.",
    claim: { value: "5 de 8", text: "oportunidades da pesquisa viraram plano PRO" },
    phones: [
      { id: "pl-antes", style: { left: 830, top: 215, transform: "rotate(-8deg) scale(.84)", filter: "brightness(.95)" }, label: "Antes", labelStyle: { left: 880, top: 812 } },
      { id: "pl-escalacao", style: { left: 1070, top: 100, zIndex: 2 }, w: 290, label: "Depois", labelStyle: { left: 1180, top: 755, zIndex: 3 } },
      { id: "pl-splash", style: { left: 1320, top: 205, transform: "rotate(8deg) scale(.84)" } },
    ],
  },
  "hora-do-lar": {
    bg: "linear-gradient(135deg, #ff7a1a 0%, #f2610f 38%, #a43fc9 78%, #7b2cbf 100%)",
    eyebrow: "HORA DO LAR",
    eyebrowColor: "#ffe2cc",
    title: ["Site novo", "+ 2 apps"],
    sub: "Gestão de empregados domésticos sem juridiquês, para quem emprega e para quem trabalha.",
    chips: ["Homepage", "App do funcionário", "App do empregador"],
    laptop: { src: "/projetos/hora-do-lar/home/hero.webp", style: { left: 640, top: 150, width: 820 } },
    phones: [
      { id: "hl-menu", style: { left: 1050, top: 360, transform: "rotate(-7deg) scale(.82)" }, w: 200 },
      { id: "hl-ponto-1", style: { left: 1210, top: 300, zIndex: 3 }, w: 210 },
      { id: "hl-resumo", style: { left: 1375, top: 370, transform: "rotate(7deg) scale(.82)" }, w: 200 },
    ],
  },
};

function Phone({ id, style, w = 270 }: { id: ScreenId; style: CSSProperties; w?: number }) {
  const h = Math.round((w * 19.5) / 9);
  const big = w > 230;
  return (
    <div style={{ position: "absolute", padding: big ? 9 : 7, borderRadius: big ? 46 : 36, background: "#0b0b10", boxShadow: "0 50px 90px -30px rgba(10,5,50,.8)", ...style }}>
      <div style={{ width: w, height: h, borderRadius: big ? 37 : 29, overflow: "hidden", background: "#fff", containerType: "inline-size" }}>
        <RecreatedScreen id={id} />
      </div>
    </div>
  );
}

const noise =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

/** Composição 1600×900 (exportada em 2x). */
export function CoverComposition({ slug }: { slug: string }) {
  if (slug === "telas") return <ScreenSheet />;
  const c = covers[slug];
  return (
    <div id="capa" style={{ position: "relative", width: 1600, height: 900, overflow: "hidden", background: c.bg, zoom: 2 }}>
      {c.deco}
      <div style={{ position: "absolute", inset: 0, opacity: 0.1, mixBlendMode: "overlay", backgroundImage: noise }} />
      <div style={{ position: "absolute", left: 100, top: 200, width: 640, color: "#fff", zIndex: 1 }}>
        <div className="font-display" style={{ fontSize: 18, fontWeight: 700, letterSpacing: ".32em", color: c.eyebrowColor }}>
          {c.eyebrow}
        </div>
        <h1 className="font-display" style={{ marginTop: 24, fontSize: 92, fontWeight: 700, lineHeight: 0.94, letterSpacing: "-0.045em" }}>
          {c.title.map((t) => (
            <span key={t} style={{ display: "block" }}>
              {t}
            </span>
          ))}
        </h1>
        <p style={{ marginTop: 26, fontSize: 25, lineHeight: 1.35, maxWidth: 520, opacity: 0.92 }}>{c.sub}</p>
        {c.chips ? (
          <div style={{ marginTop: 34, display: "flex", gap: 10, flexWrap: "wrap" }}>
            {c.chips.map((t) => (
              <span key={t} style={{ padding: "12px 18px", borderRadius: 999, background: "rgba(255,255,255,.15)", border: "1px solid rgba(255,255,255,.3)", fontSize: 18 }}>
                {t}
              </span>
            ))}
          </div>
        ) : null}
        {c.claim ? (
          <div style={{ marginTop: 38, display: "inline-flex", alignItems: "center", gap: 16, padding: "14px 24px 14px 14px", borderRadius: 999, background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.22)" }}>
            <b className="font-display" style={{ display: "inline-flex", alignItems: "center", height: 52, padding: "0 18px", borderRadius: 999, background: "#facc15", color: "#111", fontSize: 26 }}>
              {c.claim.value}
            </b>
            <span style={{ fontSize: 21, lineHeight: 1.25, maxWidth: 300 }}>{c.claim.text}</span>
          </div>
        ) : null}
      </div>
      {c.laptop ? (
        <div style={{ position: "absolute", transform: "perspective(2000px) rotateY(-12deg) rotateX(4deg)", transformOrigin: "left center", ...c.laptop.style }}>
          <div style={{ padding: "14px 14px 18px", borderRadius: "22px 22px 8px 8px", background: "#16161b", boxShadow: "0 60px 100px -40px rgba(40,10,60,.7)" }}>
            <img src={c.laptop.src} alt="" style={{ display: "block", width: "100%", borderRadius: 6 }} />
          </div>
          <div style={{ height: 20, margin: "0 -50px", borderRadius: "0 0 26px 26px", background: "linear-gradient(#d9d9de, #9d9da6)" }} />
        </div>
      ) : null}
      {c.phones.map((p) => (
        <Phone key={p.id} id={p.id} style={p.style} w={p.w} />
      ))}
      {c.phones
        .filter((p) => p.label)
        .map((p) => (
          <span key={p.label} style={{ position: "absolute", padding: "8px 14px", borderRadius: 999, background: "rgba(10,15,60,.55)", border: "1px solid rgba(255,255,255,.25)", color: "#fff", fontSize: 15, ...p.labelStyle }}>
            {p.label}
          </span>
        ))}
    </div>
  );
}

/** Folha de conferência com todas as telas redesenhadas (só desenvolvimento). */
function ScreenSheet() {
  const all: ScreenId[] = [
    "pl-splash", "pl-antes", "pl-escalacao", "pl-escalacao-vazia", "pl-escalacao-parcial", "pl-escalacao-salva",
    "hl-resumo", "hl-ponto-0", "hl-ponto-2", "hl-menu", "hl-emp-aprovar", "hl-emp-aprovado", "hl-emp-resumo", "hl-emp-notificacao",
  ];
  return (
    <div id="capa" style={{ display: "flex", flexWrap: "wrap", gap: 16, padding: 16, width: 2200, background: "#ddd" }}>
      {all.map((id) => (
        <div key={id} style={{ width: 290 }}>
          <p style={{ fontSize: 12 }}>{id}</p>
          <div style={{ width: 290, height: 628, overflow: "hidden", borderRadius: 24, background: "#fff", containerType: "inline-size" }}>
            <RecreatedScreen id={id} />
          </div>
        </div>
      ))}
    </div>
  );
}
