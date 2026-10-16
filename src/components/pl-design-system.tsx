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

/** Componentes visíveis na tela, numerados de cima para baixo. */
const components = [
  { name: "Cabeçalho com métricas", note: "Preço do time, fechamento do mercado e patrimônio." },
  { name: "Seletor de formação e visualização", note: "Formação em lista suspensa; campo ou lista." },
  { name: "Card de jogador", note: "Preço, camisa com escudo, confirmação e nome." },
  { name: "Banco de reservas", note: "Os mesmos cards, em linha." },
  { name: "Ações da escalação", note: "Atalhos (como limpar e compartilhar) e o capitão escolhido." },
  { name: "Navegação inferior", note: "Campeonatos, Notificações e Minha conta." },
];

/**
 * Design system do Premium League mostrado a partir das telas reais:
 * a tela de escalação redesenhada (em tamanho real), a paleta extraída dela e
 * a lista dos componentes visíveis. Nada inventado.
 */
export function PlDesignSystem() {
  return (
    <figure className="flex flex-col gap-8">
      <div className="grid gap-8 lg:grid-cols-[229px_1fr]">
        {/* Captura original em tamanho real (213px): não é ampliada. */}
        <div className="mx-auto w-[229px] overflow-hidden rounded-[1.6rem] border-[8px] border-[#0b0b10] bg-white">
          <Image
            src={`${dir}/tela-depois.webp`}
            alt="Tela de escalação redesenhada do Premium League: cabeçalho azul com métricas, seletor de formação, campo verde com cards de jogadores, banco de reservas, ações e navegação inferior."
            width={213}
            height={488}
            loading="eager"
            unoptimized
            className="block h-[488px] w-[213px]"
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
        <ol className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {components.map((c, i) => (
            <li key={c.name} className="grid grid-cols-[2rem_1fr] rounded-xl bg-surface p-4">
              <span className="tabular font-mono text-[0.875rem] text-muted">{String(i + 1).padStart(2, "0")}</span>
              <span>
                <span className="block text-[0.9375rem] font-medium">{c.name}</span>
                <span className="block text-[0.875rem] text-muted">{c.note}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
      <figcaption className="label">Paleta e componentes extraídos das telas do app. A tela aparece em tamanho real, como foi entregue na apresentação.</figcaption>
    </figure>
  );
}
