import type { Impact, Learning } from "@/content/projects";
import { isTodo, showTodos } from "@/lib/todo";

/**
 * Resultado em destaque: bloco em largura total com fundo invertido, a frase
 * ou o número principal em tamanho de cartaz e chips de impacto.
 * Usado em todos os estudos de caso completos.
 */
export function ResultBlock({ impact }: { impact: Impact }) {
  const note = impact.note && (!isTodo(impact.note) || showTodos) ? impact.note : null;
  return (
    <section id="resultado" aria-labelledby="resultado-titulo" className="my-14 md:my-20">
      <div className="overflow-hidden rounded-2xl bg-ink px-6 py-10 text-bg md:px-12 md:py-16">
        <h2 id="resultado-titulo" data-reveal="title" className="font-mono text-[0.875rem] uppercase tracking-[0.08em] opacity-75">
          Resultado
        </h2>
        <p data-reveal className="mt-6 font-display text-[clamp(3rem,1.6rem+7vw,9rem)] font-medium leading-[0.88] tracking-[-0.045em]">
          {impact.claim}
        </p>
        <p data-reveal className="mt-5 max-w-[34ch] text-lead">
          {impact.caption}
        </p>
        <ul aria-label="Impacto" className="mt-10 flex flex-wrap gap-2">
          {impact.chips.map((c, i) => (
            <li
              key={c}
              data-reveal="card"
              style={{ "--i": i % 3 } as React.CSSProperties}
              className="inline-flex min-h-11 items-center rounded-full border border-current/25 px-4 text-[0.9375rem]"
            >
              {c}
            </li>
          ))}
        </ul>
        {impact.paragraphs?.length ? (
          <div className="mt-10 flex max-w-[60ch] flex-col gap-3">
            {impact.paragraphs.map((p) => (
              <p key={p} className="text-body opacity-90">
                {p}
              </p>
            ))}
          </div>
        ) : null}
        {note ? <p className="mt-8 font-mono text-[0.8125rem] opacity-70">{note}</p> : null}
      </div>
    </section>
  );
}

/** Aprendizados em cards numerados (01, 02, 03): título curto + uma frase. */
export function LearningCards({ items }: { items: Learning[] }) {
  return (
    <section id="aprendizados" aria-labelledby="aprendizados-titulo" className="border-t border-line py-14 md:py-20">
      <h2 id="aprendizados-titulo" data-reveal="title" className="text-lead">
        Aprendizados
      </h2>
      <ol className="mt-8 grid gap-4 md:grid-cols-3">
        {items.map((l, i) => (
          <li key={l.title} data-reveal="card" style={{ "--i": i } as React.CSSProperties} className="flex flex-col rounded-2xl bg-surface p-6 md:p-8">
            <span aria-hidden="true" className="font-display text-[clamp(2.5rem,2rem+2vw,3.75rem)] font-medium leading-none tracking-tight text-muted">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-8 font-display text-[clamp(1.25rem,1.1rem+0.6vw,1.625rem)] font-medium leading-tight tracking-tight">
              {l.title}
            </h3>
            <p className="mt-3 text-body text-muted">{l.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
