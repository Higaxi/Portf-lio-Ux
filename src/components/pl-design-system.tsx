import Image from "next/image";

const dir = "/projetos/premium-league/ds";

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

const components = [
  { src: "cabecalho.webp", w: 639, h: 215, name: "Cabeçalho com métricas", note: "Preço do time, fechamento do mercado e patrimônio." },
  { src: "formacao.webp", w: 610, h: 75, name: "Seletor de formação e visualização", note: "Formação em lista suspensa; campo ou lista." },
  { src: "card-jogador.webp", w: 110, h: 145, name: "Card de jogador", note: "Preço, camisa com escudo, confirmação e nome." },
  { src: "banco.webp", w: 639, h: 200, name: "Banco de reservas", note: "Os mesmos cards, em linha." },
  { src: "acoes.webp", w: 615, h: 90, name: "Ações da escalação", note: "Atalhos da escalação (como limpar e compartilhar) e o capitão escolhido." },
  { src: "navegacao.webp", w: 639, h: 100, name: "Navegação inferior", note: "Campeonatos, Notificações e Minha conta." },
];

/**
 * Design system do Premium League mostrado a partir das telas reais:
 * a tela de escalação redesenhada, a paleta extraída dela e os componentes
 * recortados da própria tela. Nada inventado.
 */
export function PlDesignSystem() {
  return (
    <figure className="flex flex-col gap-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,15rem)_1fr]">
        <div className="mx-auto w-full max-w-[15rem] overflow-hidden rounded-[2rem] border-[8px] border-[#0b0b10] bg-white">
          <Image
            src={`${dir}/tela-depois.webp`}
            alt="Tela de escalação redesenhada do Premium League: cabeçalho azul com métricas, seletor de formação, campo verde com cards de jogadores, banco de reservas, ações e navegação inferior."
            width={639}
            height={1464}
            loading="eager"
            sizes="240px"
            className="h-auto w-full"
          />
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
        <ul className="mt-3 grid gap-4 sm:grid-cols-2">
          {components.map((c) => (
            <li key={c.src} className="flex flex-col gap-3 rounded-xl bg-surface p-4">
              <div className="flex min-h-24 items-center justify-center rounded-lg bg-white p-3">
                <Image
                  src={`${dir}/${c.src}`}
                  alt={`${c.name}, recortado da tela do app.`}
                  width={c.w}
                  height={c.h}
                  loading="eager"
                  sizes="(min-width: 640px) 30vw, 90vw"
                  className="h-auto max-h-36 w-auto max-w-full"
                />
              </div>
              <span>
                <span className="block text-[0.9375rem] font-medium">{c.name}</span>
                <span className="block text-[0.875rem] text-muted">{c.note}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <figcaption className="label">Paleta e componentes extraídos das telas do app (tela de escalação redesenhada).</figcaption>
    </figure>
  );
}
