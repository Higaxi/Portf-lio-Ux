import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { AkamaiWordmark, AkFilters, AkHeader, Bar, BrazilFlag, Icon, NetworkBg, Pie, navy, u, wafSlices } from "./recreated-screens";

/*
 * Mini design system do Akamai recriado em código a partir do quadro original
 * do projeto (pitch, p12). Reutiliza as peças das telas redesenhadas.
 * Medidas tipográficas na base de 300px da tela (a mesma das telas recriadas).
 */

const font = "Inter, 'Segoe UI', Roboto, Arial, sans-serif";

/** Container que escala as peças desenhadas em base 300px (unidades cqw). */
function Zoom({ base = 340, children, bg = "#ffffff", style }: { base?: number; children: ReactNode; bg?: string; style?: CSSProperties }) {
  return (
    <div className="mx-auto w-full overflow-hidden rounded-lg" style={{ maxWidth: base, containerType: "inline-size", background: bg, fontFamily: font, color: "#1f2937", ...style }}>
      {children}
    </div>
  );
}

function Spec({ title, note, children, wide }: { title: string; note?: string; children: ReactNode; wide?: boolean }) {
  return (
    <li className={`flex flex-col gap-3 rounded-xl bg-surface p-4 ${wide ? "sm:col-span-2" : ""}`}>
      <h3 className="font-display text-[1rem] font-medium uppercase tracking-tight">{title}</h3>
      <div aria-hidden="true" className="flex flex-1 items-center justify-center rounded-lg bg-[#eef1f5] p-3">
        {children}
      </div>
      {note ? <p className="text-[0.875rem] leading-snug text-muted">{note}</p> : null}
    </li>
  );
}

const colors: [string, string][] = [
  ["#0F3A6B", "Azul-marinho: barra superior e login"],
  ["#0074E2", "Azul: ações e destaques"],
  ["#02A0CF", "Ciano: fundos e ícones"],
  ["#293CA5", "Índigo: gráficos"],
  ["#EBEAF8", "Lavanda: fundos claros"],
  ["#0F0E10", "Preto: texto principal"],
  ["#464646", "Grafite: texto secundário"],
  ["#787878", "Cinza: rótulos"],
  ["#F97316", "Laranja: série de dados"],
  ["#7AC943", "Verde: série de dados"],
  ["#A855F7", "Roxo: série de dados"],
  ["#7DD3C8", "Verde-água: offload"],
];

const type: [string, number, number, string][] = [
  ["Marca", 34, 800, "Akamai"],
  ["Título da tela", 13.5, 600, "Web Application Firewall"],
  ["Título de seção", 10.5, 700, "Waf Attack Traffic Summary"],
  ["Rótulo", 10.5, 600, "Contract number"],
  ["Texto", 10, 400, "0522-000271"],
  ["Legenda", 8.5, 400, "56.84% Maximum"],
];

function Calendar() {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const offset = 5; // julho de 2022 começa na sexta
  return (
    <div style={{ padding: u(10), fontSize: u(9) }}>
      <div className="flex items-center justify-between" style={{ fontWeight: 700, color: navy, fontSize: u(10.5) }}>
        <span>Julho 2022</span>
        <span className="flex" style={{ gap: u(10) }}>
          {Icon.back(navy, 11)}
          {Icon.chevron(navy, 11)}
        </span>
      </div>
      <div className="grid grid-cols-7 text-center" style={{ marginTop: u(8), gap: u(3), color: "#787878", fontSize: u(8) }}>
        {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => (
          <span key={i}>{d}</span>
        ))}
        {Array.from({ length: offset }, (_, i) => (
          <span key={`e${i}`} />
        ))}
        {days.map((d) => {
          const inRange = d >= 1 && d <= 30;
          const edge = d === 1 || d === 30;
          return (
            <span
              key={d}
              className="flex items-center justify-center"
              style={{ height: u(16), borderRadius: edge ? "50%" : u(3), background: edge ? "#0074e2" : inRange ? "#dbe9fb" : "transparent", color: edge ? "#fff" : "#1f2937", fontWeight: edge ? 700 : 400 }}
            >
              {d}
            </span>
          );
        })}
      </div>
      <div className="flex items-center justify-center" style={{ marginTop: u(10), height: u(24), borderRadius: u(3), background: navy, color: "#fff", fontSize: u(10), fontWeight: 600 }}>
        Aplicar período
      </div>
    </div>
  );
}

function Metric({ value, label, detail }: { value: string; label: string; detail?: string }) {
  return (
    <div style={{ padding: u(9), borderRadius: u(4), background: "#fff", boxShadow: "0 1px 2px rgba(15,58,107,0.15)" }}>
      <span className="block" style={{ fontSize: u(20), fontWeight: 700, lineHeight: 1 }}>
        {value}
      </span>
      <span className="block" style={{ marginTop: u(4), fontSize: u(9), fontWeight: 600 }}>
        {label}
      </span>
      {detail ? (
        <span className="block" style={{ fontSize: u(8), color: "#6b7280" }}>
          {detail}
        </span>
      ) : null}
    </div>
  );
}

/** Design system recriado + o quadro original em tamanho real. */
export function AkamaiDesignSystem({ original }: { original: { src: string; width: number; height: number; alt: string } }) {
  return (
    <div className="flex flex-col gap-8">
      <p className="label">Design system recriado a partir do quadro original do projeto.</p>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Spec title="Tipografia" note="Uma família sem serifa; tamanhos na base de 300 px das telas." wide>
          <Zoom base={620}>
            <ul style={{ padding: u(10) }}>
              {type.map(([name, size, weight, sample]) => (
                <li key={name} className="flex items-baseline" style={{ gap: u(10), padding: `${u(4)} 0`, borderBottom: "1px solid #eef1f5" }}>
                  <span style={{ width: u(70), flexShrink: 0, fontSize: u(6.5), color: "#787878" }}>
                    {name}
                    <span className="block tabular">
                      {String(size).replace(".", ",")} px · {weight}
                    </span>
                  </span>
                  <span style={{ fontSize: u(name === "Marca" ? 16 : size * 0.75), fontWeight: weight, fontStyle: name === "Marca" ? "italic" : undefined, color: name === "Marca" ? navy : "#0f0e10" }}>{sample}</span>
                </li>
              ))}
            </ul>
          </Zoom>
        </Spec>

        <Spec title="Cores" note="Paleta do quadro original e as cores das séries dos gráficos.">
          <ul className="grid w-full grid-cols-3 gap-2">
            {colors.map(([hex, role]) => (
              <li key={hex} className="overflow-hidden rounded-md bg-white">
                <span className="block h-8" style={{ background: hex }} />
                <span className="block px-1.5 py-1">
                  <span className="tabular block font-mono text-[0.6875rem] text-[#1f2937]">{hex}</span>
                  <span className="block text-[0.625rem] leading-tight text-[#646464]">{role}</span>
                </span>
              </li>
            ))}
          </ul>
        </Spec>

        <Spec title="Ícones e logotipos" note="Marca em texto e ícones de traço único na barra azul.">
          <Zoom base={340} bg="#02a0cf">
            <div className="flex items-center justify-between" style={{ padding: `${u(14)} ${u(14)}` }}>
              <AkamaiWordmark size={22} />
              <span className="flex items-center" style={{ gap: u(10) }}>
                {Icon.back("#fff", 16)}
                {Icon.menu("#fff", 16)}
                {Icon.calendar("#fff", 15)}
                {Icon.search("#fff", 15)}
                {Icon.eye("#fff", 15)}
                <BrazilFlag w={18} />
              </span>
            </div>
          </Zoom>
        </Spec>

        <Spec title="Botões" note="Primário, secundário e desabilitado.">
          <Zoom base={300} bg="transparent">
            <div className="flex flex-col" style={{ gap: u(10), padding: u(8) }}>
              {[
                ["Primário", { background: "#0074e2", color: "#fff" }],
                ["Secundário", { background: "#fff", color: "#0074e2", border: "1px solid #0074e2" }],
                ["Desabilitado", { background: "#c7cfdb", color: "#f4f6f9" }],
              ].map(([label, st]) => (
                <span key={label as string} className="flex items-center justify-center" style={{ height: u(32), borderRadius: u(3), fontSize: u(11), fontWeight: 600, ...(st as CSSProperties) }}>
                  {label as string}
                </span>
              ))}
            </div>
          </Zoom>
        </Spec>

        <Spec title="Top bar" note="Status, voltar, título e menu.">
          <Zoom base={340}>
            <AkHeader title="Web Application Firewall" />
          </Zoom>
        </Spec>

        <Spec title="Formulários" note="Select com chevron, campo de data com botão de calendário e campos do login.">
          <Zoom base={340} bg="#eef1f5">
            <AkFilters />
            <div style={{ margin: `${u(8)} ${u(12)} ${u(12)}`, padding: u(10), borderRadius: u(4), background: navy }}>
              <div className="flex items-center" style={{ height: u(26), padding: `0 ${u(8)}`, borderRadius: u(3), border: "1px solid rgba(255,255,255,0.35)", background: "rgba(5,25,55,0.55)", color: "rgba(255,255,255,0.75)", fontSize: u(10) }}>
                E-mail
              </div>
              <div className="flex items-center justify-between" style={{ marginTop: u(8), height: u(26), padding: `0 ${u(8)}`, borderRadius: u(3), border: "1px solid rgba(255,255,255,0.35)", background: "rgba(5,25,55,0.55)", color: "rgba(255,255,255,0.75)", fontSize: u(10) }}>
                Senha {Icon.eye("rgba(255,255,255,0.85)", 13)}
              </div>
            </div>
          </Zoom>
        </Spec>

        <Spec title="Barra de navegação" note="Atalhos em lista no fim das telas.">
          <Zoom base={340}>
            {["WAF Attack Geral", "Hostname", "Top URL's"].map((t, i) => (
              <div key={t} className="flex items-center justify-between" style={{ padding: `${u(10)} ${u(12)}`, borderTop: i ? "1px solid #e5e9f0" : 0, fontSize: u(10.5), fontWeight: 600 }}>
                {t} {Icon.chevron("#1f2937")}
              </div>
            ))}
          </Zoom>
        </Spec>

        <Spec title="Barra de pesquisa" note="Busca por hostname, com botão.">
          <Zoom base={340} bg="#eef1f5">
            <div className="flex items-stretch" style={{ margin: u(12) }}>
              <span className="flex flex-1 items-center" style={{ height: u(26), padding: `0 ${u(8)}`, background: "#fff", border: "1px solid #c9d2df", borderRight: 0, borderRadius: `${u(3)} 0 0 ${u(3)}`, fontSize: u(10), color: "#6b7280" }}>
                Buscar…
              </span>
              <span className="flex items-center justify-center" style={{ width: u(26), background: navy, borderRadius: `0 ${u(3)} ${u(3)} 0` }}>
                {Icon.search("#fff", 12)}
              </span>
            </div>
          </Zoom>
        </Spec>

        <Spec title="Avatares" note="Foto da conta ou iniciais, em dois tamanhos.">
          <div className="flex items-end gap-4">
            <span className="flex size-14 items-center justify-center rounded-full bg-[#0f3a6b] font-semibold text-white">GI</span>
            <span className="flex size-8 items-center justify-center rounded-full bg-[#0074e2] text-[0.75rem] font-semibold text-white">GI</span>
          </div>
        </Spec>

        <Spec title="Gráficos" note="Barras com total e máximo; pizza com legenda e valores." wide>
          <div className="grid w-full gap-3 sm:grid-cols-2">
            <Zoom base={340} bg="#fff">
              <div style={{ padding: u(10) }}>
                <Bar label="Edge" total="1.49 TB Total" value="" sub="9.19 Mb/s Max" color="#f97316" pct={96} />
                <Bar label="Midgress" total="1.32 TB Total" value="" sub="8.16 Mb/s Max" color="#7ac943" pct={84} />
                <Bar label="Edge Bandwidth" total="1.21 TB Total" value="" sub="7.35 Mb/s Max" color="#2f74d0" pct={76} />
              </div>
            </Zoom>
            <Zoom base={340} bg="#fff">
              <div className="flex items-center" style={{ padding: u(10), gap: u(10) }}>
                <Pie size={92} slices={wafSlices} />
                <ul className="flex flex-col" style={{ gap: u(4), fontSize: u(9) }}>
                  {[
                    ["Web Policy Violation", "#1e6fff"],
                    ["Penalty", "#f97316"],
                    ["Command Injection", "#a855f7"],
                    ["Custom Rules", "#5eead4"],
                    ["Local File Inclusion", "#ef4444"],
                  ].map(([n, c]) => (
                    <li key={n} className="flex items-center" style={{ gap: u(4) }}>
                      <span style={{ width: u(7), height: u(7), borderRadius: "50%", background: c }} />
                      {n}
                    </li>
                  ))}
                </ul>
              </div>
            </Zoom>
          </div>
        </Spec>

        <Spec title="Calendários" note="Seleção de período com início e fim marcados.">
          <Zoom base={300}>
            <Calendar />
          </Zoom>
        </Spec>

        <Spec title="Campos de exibição" note="Percentuais grandes para leitura rápida." wide>
          <Zoom base={620} bg="transparent">
            <div className="grid grid-cols-4" style={{ gap: u(6), padding: u(4) }}>
              <Metric value="65%" label="Deny" detail="(22,695)" />
              <Metric value="35%" label="Alert" detail="(12,479)" />
              <Metric value="56%" label="Web Policy" detail="Violation" />
              <Metric value="3%" label="Local File" detail="Inclusion" />
            </div>
          </Zoom>
        </Spec>

        <Spec title="Imagens e detalhes" note="Fundo azul com rede de pontos; divisor curto em azul.">
          <div className="flex w-full items-center gap-4">
            <div className="relative h-28 w-20 overflow-hidden rounded-md" style={{ background: `linear-gradient(170deg, #1b5394, ${navy})` }}>
              <NetworkBg />
            </div>
            <div className="flex flex-col gap-2">
              <span className="block h-1 w-12 rounded-full bg-[#0074e2]" />
              <span className="text-[0.75rem] text-[#646464]">Raio 3–4 px · sombra leve nos cards</span>
            </div>
          </div>
        </Spec>
      </ul>

      <figure>
        <figcaption className="label mb-3">Quadro original, em tamanho real.</figcaption>
        <div className="inline-block max-w-full overflow-hidden rounded-xl bg-[#e9edf3] p-3">
          <Image src={original.src} alt={original.alt} width={original.width} height={original.height} sizes={`${original.width}px`} loading="eager" className="h-auto w-full rounded-lg" style={{ maxWidth: original.width }} />
        </div>
      </figure>
    </div>
  );
}
