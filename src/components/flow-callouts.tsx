import Image from "next/image";
import type { FlowScreen } from "@/content/projects";

/**
 * Jornada principal em telas grandes, em sequência, com as decisões de design
 * numeradas sobre cada tela. Os números sobre a imagem são decorativos; a
 * lista abaixo de cada tela carrega o texto.
 */
export function FlowCallouts({ screens }: { screens: FlowScreen[] }) {
  const starts = screens.map((_, i) => screens.slice(0, i).reduce((sum, x) => sum + x.callouts.length, 0));
  return (
    <ol className="-mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-4 md:mx-0 md:px-0">
      {screens.map((s, si) => {
        const start = starts[si];
        return (
          <li key={s.src} className="w-[min(78vw,17rem)] shrink-0 snap-start">
            <p className="label mb-3">
              {si + 1}. {s.title}
            </p>
            <div className="relative overflow-hidden rounded-[2rem] border-[8px] border-[#0b0b10] bg-white">
              <div className="relative">
                <Image src={s.src} alt={s.alt} width={s.width} height={s.height} sizes="272px" loading="eager" className="h-auto w-full" />
                {s.callouts.map((c, ci) => (
                  <span
                    key={ci}
                    aria-hidden="true"
                    className="absolute flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ink font-mono text-[0.8125rem] text-bg ring-4 ring-white/80"
                    style={{ left: `${c.x}%`, top: `${c.y}%` }}
                  >
                    {start + ci + 1}
                  </span>
                ))}
              </div>
            </div>
            <ol start={start + 1} className="mt-4 flex flex-col gap-2">
              {s.callouts.map((c, ci) => (
                <li key={ci} className="grid grid-cols-[1.75rem_1fr] text-[0.9375rem] leading-snug">
                  <span className="tabular font-mono text-muted">{start + ci + 1}</span>
                  {c.text}
                </li>
              ))}
            </ol>
          </li>
        );
      })}
    </ol>
  );
}
