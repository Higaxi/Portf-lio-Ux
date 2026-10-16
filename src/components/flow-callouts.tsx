import Image from "next/image";
import type { FlowScreen } from "@/content/projects";
import { ScreenBox } from "./recreated-screens";

/**
 * Jornada principal em telas grandes, em sequência, com as decisões de design
 * numeradas sobre cada tela. Os números sobre a tela são decorativos; a lista
 * abaixo de cada tela carrega o texto. Telas redesenhadas em código ficam
 * nítidas em qualquer tamanho; imagens nunca passam da resolução nativa.
 */
export function FlowCallouts({ screens, accent = "#111111" }: { screens: FlowScreen[]; accent?: string }) {
  const starts = screens.map((_, i) => screens.slice(0, i).reduce((sum, x) => sum + x.callouts.length, 0));
  return (
    // No celular rola de lado; em telas grandes todas as telas cabem na linha.
    <ol
      className="-mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-4 md:mx-0 md:px-0 lg:grid lg:[grid-template-columns:repeat(var(--screens),minmax(0,1fr))] lg:overflow-visible"
      style={{ "--screens": screens.length } as React.CSSProperties}
    >
      {screens.map((s, si) => {
        const start = starts[si];
        return (
          <li key={s.screen ?? s.src} className="w-[min(78vw,19rem)] shrink-0 snap-start lg:mx-auto lg:w-full lg:max-w-[21rem]">
            <p className="label mb-3">
              {si + 1}. {s.title}
            </p>
            <div className="relative">
              <div className="overflow-hidden rounded-[2rem] border-[7px] border-[#0b0b10] bg-white shadow-[0_24px_50px_-28px_rgba(0,0,0,0.55)]">
                {s.screen ? (
                  <div role="img" aria-label={s.alt}>
                    <ScreenBox id={s.screen} />
                  </div>
                ) : s.src && s.width && s.height ? (
                  <Image src={s.src} alt={s.alt} width={s.width} height={s.height} sizes={`${s.width}px`} loading="eager" className="mx-auto h-auto w-full" style={{ maxWidth: s.width }} />
                ) : null}
              </div>
              {s.callouts.map((c, ci) => (
                <span
                  key={ci}
                  aria-hidden="true"
                  className="absolute flex size-[26px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white font-mono text-[0.75rem] font-semibold text-white shadow-[0_2px_6px_rgba(0,0,0,0.3)]"
                  style={{ left: `${c.x}%`, top: `${c.y}%`, background: accent }}
                >
                  {start + ci + 1}
                </span>
              ))}
            </div>
            <ol start={start + 1} className="mt-4 flex flex-col gap-2">
              {s.callouts.map((c, ci) => (
                <li key={ci} className="grid grid-cols-[1.75rem_1fr] text-[0.9375rem] leading-snug">
                  <span className="tabular font-mono font-semibold">
                    {start + ci + 1}
                  </span>
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
