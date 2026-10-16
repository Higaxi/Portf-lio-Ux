import { RecreatedScreen, type ScreenId } from "./recreated-screens";

export const coverSlugs = ["akamai", "angel-investor"];

type Cover = {
  bg: string;
  eyebrow: string;
  eyebrowColor: string;
  title: [string, string];
  sub: string;
  chips: string[];
  screens: [ScreenId, ScreenId, ScreenId];
};

const covers: Record<string, Cover> = {
  akamai: {
    bg: "radial-gradient(1000px 700px at 75% 45%, #1f5fb8 0%, #0b3a75 50%, #061f42 100%)",
    eyebrow: "AKAMAI · EXBIZ",
    eyebrowColor: "#bcd6ff",
    title: ["Segurança", "no bolso"],
    sub: "Painel de firewall de aplicação web levado para o celular, com um mini design system próprio.",
    chips: ["Ataques e tráfego", "Filtro por contrato", "Design system"],
    screens: ["akamai-login", "akamai-waf", "akamai-trafego"],
  },
  "angel-investor": {
    bg: "radial-gradient(1000px 700px at 75% 50%, #8a5cff 0%, #6d3cf5 45%, #3d1a9e 100%)",
    eyebrow: "ANGEL INVESTOR CLUB",
    eyebrowColor: "#ddd3ff",
    title: ["Comunidade", "de investidores"],
    sub: "App mobile para investidores-anjo conversarem, acompanharem novidades e entrarem sem atrito.",
    chips: ["Cadastro pelo telefone", "Feed", "Chat"],
    screens: ["angel-cadastro", "angel-abertura", "angel-feed"],
  },
};

function Phone({ id, style }: { id: ScreenId; style: React.CSSProperties }) {
  return (
    <div style={{ position: "absolute", padding: 9, borderRadius: 46, background: "#0b0b10", boxShadow: "0 50px 90px -30px rgba(10,5,50,.8)", ...style }}>
      <div style={{ width: 270, height: 585, borderRadius: 37, overflow: "hidden", background: "#fff" }}>
        <RecreatedScreen id={id} />
      </div>
    </div>
  );
}

/** Composição 1600×900 (exportada em 2x). */
export function CoverComposition({ slug }: { slug: string }) {
  const c = covers[slug];
  return (
    <div id="capa" style={{ position: "relative", width: 1600, height: 900, overflow: "hidden", background: c.bg, zoom: 2 }}>
      <div style={{ position: "absolute", left: 100, top: 200, width: 720, color: "#fff" }}>
        <div className="font-display" style={{ fontSize: 18, fontWeight: 700, letterSpacing: ".32em", color: c.eyebrowColor }}>
          {c.eyebrow}
        </div>
        <h1 className="font-display" style={{ marginTop: 24, fontSize: 88, fontWeight: 700, lineHeight: 0.96, letterSpacing: "-0.045em" }}>
          {c.title[0]}
          <br />
          {c.title[1]}
        </h1>
        <p style={{ marginTop: 26, fontSize: 25, lineHeight: 1.35, maxWidth: 520, opacity: 0.92 }}>{c.sub}</p>
        <div style={{ marginTop: 34, display: "flex", gap: 10, flexWrap: "wrap" }}>
          {c.chips.map((t) => (
            <span key={t} style={{ padding: "12px 18px", borderRadius: 999, background: "rgba(255,255,255,.15)", border: "1px solid rgba(255,255,255,.3)", fontSize: 18 }}>
              {t}
            </span>
          ))}
        </div>
      </div>
      <Phone id={c.screens[0]} style={{ left: 860, top: 200, transform: "rotate(-7deg) scale(.88)" }} />
      <Phone id={c.screens[1]} style={{ left: 1080, top: 110, zIndex: 2 }} />
      <Phone id={c.screens[2]} style={{ left: 1300, top: 210, transform: "rotate(7deg) scale(.88)" }} />
    </div>
  );
}
