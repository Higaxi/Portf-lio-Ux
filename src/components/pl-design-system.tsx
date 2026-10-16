import type { ReactNode } from "react";
import { ScreenBox } from "./recreated-screens";
import { ComponentZoom, PlActions, PlBench, PlFormation, PlHeader, PlNav, PlPlayerCard } from "./recreated-screens-pl-hl";
import { recreatedLabel } from "./recreated-sections";

/** Cores extraídas (cores dominantes) da tela de escalação redesenhada. */
const palette = [
  { hex: "#1E49FF", role: "Azul da marca: cabeçalho e ações selecionadas" },
  { hex: "#28B156", role: "Verde do campo" },
  { hex: "#5FC37C", role: "Verde claro: faixas do campo e confirmação" },
  { hex: "#C7202F", role: "Vermelho: destaque das camisas" },
  { hex: "#2C2E35", role: "Grafite: etiqueta de preço e formação" },
  { hex: "#141928", role: "Azul-marinho: texto principal" },
  { hex: "#8F96A1", role: "Cinza: rótulos e navegação inativa" },
  { hex: "#D4D6DA", role: "Cinza claro: bordas" },
  { hex: "#F7F9FA", role: "Fundo" },
  { hex: "#FFFFFF", role: "Superfícies e cards" },
];

/**
 * Componentes da tela redesenhada, mostrados soltos e ampliados (são código:
 * ficam nítidos em qualquer tamanho). `base` é a largura máxima da caixa que
 * representa os 300px da tela original (quanto maior, mais ampliado).
 */
const components: { name: string; note: string; base: number; stretch?: number; node: ReactNode }[] = [
  { name: "Cabeçalho com métricas", note: "Preço do time, fechamento do mercado e patrimônio.", base: 520, node: <PlHeader /> },
  { name: "Seletor de formação e visualização", note: "Formação em lista suspensa; campo ou lista.", base: 520, node: <PlFormation /> },
  {
    name: "Card de jogador",
    note: "Preço, camisa com escudo, confirmação e nome.",
    base: 520,
    stretch: 1.7,
    node: (
      <div className="flex justify-center" style={{ gap: "2cqw" }}>
        <PlPlayerCard name="R. Lima" kit={1} />
        <PlPlayerCard name="A. Souza" kit={2} />
        <PlPlayerCard name="T. Melo" kit={0} />
      </div>
    ),
  },
  { name: "Banco de reservas", note: "Os mesmos cards, em linha.", base: 520, node: <PlBench /> },
  { name: "Ações da escalação", note: "Atalhos (como limpar e compartilhar) e o capitão escolhido.", base: 520, node: <PlActions /> },
  { name: "Navegação inferior", note: "Campeonatos, Notificações e Minha conta.", base: 520, node: <PlNav /> },
];

/**
 * Design system do Premium League a partir das telas do app: a tela de
 * escalação redesenhada em código, a paleta extraída dela e os componentes
 * visíveis, ampliados. Nada inventado.
 */
export function PlDesignSystem() {
  return (
    <figure className="flex flex-col gap-8">
      <p className="label">{recreatedLabel}</p>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[17rem_1fr]">
        <div className="mx-auto w-full max-w-[17rem] overflow-hidden rounded-[2rem] border-[7px] border-[#0b0b10] bg-white shadow-[0_24px_50px_-28px_rgba(0,0,0,0.55)]">
          <div role="img" aria-label="Tela de escalação redesenhada do Premium League: cabeçalho azul com métricas, seletor de formação, campo verde com cards de jogadores, banco de reservas, ações e navegação inferior.">
            <ScreenBox id="pl-escalacao" />
          </div>
        </div>
        <div>
          <h3 className="label">Paleta</h3>
          <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
            {palette.map((c) => (
              <li key={c.hex} className="overflow-hidden rounded-lg border border-line bg-bg">
                <span aria-hidden="true" className="block h-12" style={{ background: c.hex }} />
                <span className="block px-2 pb-2 pt-1.5">
                  <span className="tabular block font-mono text-[0.75rem]">{c.hex}</span>
                  <span className="block text-[0.75rem] leading-snug text-muted">{c.role}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <h3 className="label">Componentes</h3>
        <ol className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {components.map((c, i) => (
            <li key={c.name} className="flex flex-col gap-3 rounded-xl bg-surface p-4">
              <div aria-hidden="true" className="flex min-h-28 items-center justify-center overflow-hidden rounded-lg bg-[#f7f9fa] p-2">
                <ComponentZoom base={c.base} style={c.stretch ? { width: `${c.stretch * 100}%`, maxWidth: c.base * c.stretch, flexShrink: 0 } : undefined}>
                  {c.node}
                </ComponentZoom>
              </div>
              <span className="grid grid-cols-[2rem_1fr]">
                <span className="tabular font-mono text-[0.875rem] text-muted">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="block text-[0.9375rem] font-medium">{c.name}</span>
                  <span className="block text-[0.875rem] text-muted">{c.note}</span>
                </span>
              </span>
            </li>
          ))}
        </ol>
      </div>
      <figcaption className="label">Paleta extraída das telas do app; componentes redesenhados a partir delas.</figcaption>
    </figure>
  );
}
