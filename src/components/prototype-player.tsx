"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";

const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribeMotion(cb: () => void) {
  const mq = window.matchMedia(motionQuery);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

export type ProtoStep = { label: string; ms: number };

/**
 * Moldura de protótipo animado: um celular que percorre passos em loop.
 *
 * - Pausa sozinho fora da tela (IntersectionObserver).
 * - Botão Pausar/Reproduzir e pontos para ir a qualquer passo.
 * - Com prefers-reduced-motion começa parado no último passo (estado final).
 * - Rotulado como "Protótipo ilustrativo recriado": não são as telas originais.
 */
export function PrototypePlayer({
  title,
  steps,
  render,
  accent = "#111111",
}: {
  title: string;
  steps: ProtoStep[];
  render: (step: number) => ReactNode;
  accent?: string;
}) {
  const reduce = useSyncExternalStore(subscribeMotion, () => window.matchMedia(motionQuery).matches, () => false);
  // null = ainda sem escolha do usuário: toca sozinho, exceto com movimento reduzido.
  const [userPlaying, setUserPlaying] = useState<boolean | null>(null);
  const [chosenStep, setChosenStep] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const rootRef = useRef<HTMLElement>(null);

  const playing = userPlaying ?? !reduce;
  // Movimento reduzido: começa no estado final, parado.
  const step = chosenStep ?? (reduce ? steps.length - 1 : 0);
  const setStep = (fn: number | ((s: number) => number)) =>
    setChosenStep((prev) => (typeof fn === "function" ? fn(prev ?? step) : fn));
  const setPlaying = (fn: (p: boolean) => boolean) => setUserPlaying(fn(playing));

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || !visible) return;
    const t = window.setTimeout(() => setChosenStep((prev) => ((prev ?? step) + 1) % steps.length), steps[step].ms);
    return () => window.clearTimeout(t);
  }, [playing, visible, step, steps]);

  return (
    <figure ref={rootRef} className="flex flex-col items-center gap-5 rounded-2xl bg-surface px-4 py-8 md:py-10">
      <div className="relative w-[min(78vw,300px)]">
        <div className="relative aspect-[9/19] overflow-hidden rounded-[2.4rem] border-[10px] border-[#0b0b0f] bg-white text-[#111827] shadow-[0_24px_60px_-28px_rgba(0,0,0,0.55)]">
          <div className="absolute inset-0 font-sans text-[12px] leading-tight">{render(step)}</div>
          <div aria-hidden="true" className="absolute left-1/2 top-2 h-4 w-20 -translate-x-1/2 rounded-full bg-[#0b0b0f]" />
        </div>
      </div>

      <figcaption className="flex w-full max-w-[34rem] flex-col items-center gap-3 text-center">
        <p className="text-body">
          <span className="sr-only">{title}. </span>
          Passo {step + 1} de {steps.length}: {steps[step].label}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button type="button" onClick={() => setPlaying((p) => !p)} aria-pressed={!playing} className="btn-quiet !bg-bg">
            {playing ? "Pausar" : "Reproduzir"}
            <span className="sr-only"> o protótipo</span>
          </button>
          <ol className="flex items-center gap-1" aria-label="Passos do protótipo">
            {steps.map((s, i) => (
              <li key={s.label}>
                <button
                  type="button"
                  onClick={() => {
                    setStep(i);
                    setPlaying(() => false);
                  }}
                  aria-current={i === step ? "step" : undefined}
                  aria-label={`Ir para o passo ${i + 1}: ${s.label}`}
                  className="flex size-11 items-center justify-center"
                >
                  <span
                    className="block h-2 w-[22px] rounded-full transition-[transform,opacity] duration-300"
                    style={{ transform: `scaleX(${i === step ? 1 : 0.36})`, background: i === step ? accent : "var(--muted)", opacity: i === step ? 1 : 0.7 }}
                  />
                </button>
              </li>
            ))}
          </ol>
        </div>
        <p className="label">Protótipo ilustrativo recriado. Não são as telas originais; nomes e valores são fictícios.</p>
      </figcaption>
    </figure>
  );
}
