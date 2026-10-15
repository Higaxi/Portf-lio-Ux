import Image from "next/image";
import type { CaseStudy } from "@/content/projects";

/**
 * Ilustração de um design system desenhada em código: tokens de cor, escala
 * tipográfica e componentes. Sem marca de cliente: é uma representação, não
 * uma captura do sistema real.
 */
export function DesignSystemArt() {
  const swatches = ["#000000", "#262626", "#525252", "#8f8f8f", "#d4d4d4", "#ffffff"];
  return (
    <div
      role="img"
      aria-label="Ilustração de um design system: seis amostras de cor, uma escala tipográfica e três botões em estados diferentes."
      className="absolute inset-0 grid grid-cols-6 grid-rows-[1fr_auto_auto] gap-2 bg-[#e4e4e4] p-[5%] text-black md:gap-3"
    >
      {swatches.map((c) => (
        <div key={c} className="rounded-md" style={{ background: c }} />
      ))}
      <div aria-hidden="true" className="col-span-6 flex items-end gap-[4%] font-display font-medium leading-none tracking-tight">
        <span className="text-[clamp(2.5rem,6vw,5.5rem)]">Aa</span>
        <span className="text-[clamp(1.75rem,3.5vw,3.25rem)]">Aa</span>
        <span className="text-[clamp(1.25rem,2vw,2rem)]">Aa</span>
        <span className="text-base">Aa</span>
      </div>
      <div aria-hidden="true" className="col-span-6 grid grid-cols-3 gap-2 font-sans text-[clamp(0.75rem,1vw,0.9375rem)] md:gap-3">
        <span className="flex h-[clamp(2rem,3.5vw,3rem)] items-center justify-center rounded-full bg-black text-white">Primário</span>
        <span className="flex h-[clamp(2rem,3.5vw,3rem)] items-center justify-center rounded-full bg-white">Secundário</span>
        <span className="flex h-[clamp(2rem,3.5vw,3rem)] items-center justify-center rounded-full bg-[#d4d4d4] text-[#525252]">Desabilitado</span>
      </div>
    </div>
  );
}

/** A métrica do projeto como objeto principal, quando não há imagem. */
export function MetricArt({ metric }: { metric: CaseStudy["metric"] }) {
  return (
    <div className="@container absolute inset-0 flex flex-col justify-end bg-[#111111] p-[6%] text-[#fafafa]">
      <p className="font-display text-[11cqw] font-medium leading-[0.9] tracking-[-0.04em]">
        {metric.value}
      </p>
      <p className="mt-3 max-w-[30ch] font-mono text-[max(0.8125rem,2.2cqw)] text-[#bdbdbd]">{metric.label}</p>
    </div>
  );
}

/** Capa de um estudo de caso: imagem real, ilustração ou a métrica. */
export function CaseCover({
  project,
  sizes,
  priority = false,
  className = "",
}: {
  project: CaseStudy;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  if (project.cover) {
    return (
      <Image
        src={project.cover.src}
        alt={project.cover.alt}
        fill
        sizes={sizes}
        preload={priority}
        loading={priority ? undefined : "eager"}
        className={`object-cover ${className}`}
      />
    );
  }
  if (project.slug === "design-system") return <DesignSystemArt />;
  return <MetricArt metric={project.metric} />;
}
