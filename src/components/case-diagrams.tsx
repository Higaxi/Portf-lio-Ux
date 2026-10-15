import type { DeepCase } from "@/content/projects";

/** Jornada atual vs. futura: duas faixas de etapas, a de cima mais longa. */
export function JourneyDiagram({ journey }: { journey: DeepCase["journey"] }) {
  const rows = [
    { label: "Antes: em papel", steps: journey.before, tone: "bg-surface text-ink" },
    { label: "Depois: no app", steps: journey.after, tone: "bg-ink text-bg" },
  ];
  return (
    <div className="flex flex-col gap-8">
      {rows.map((r) => (
        <div key={r.label}>
          <p className="label">{r.label}</p>
          <ol className="mt-3 flex flex-wrap items-stretch gap-2">
            {r.steps.map((s, i) => (
              <li key={s} className="flex items-center gap-2">
                <span className={`flex min-h-12 items-center rounded-full px-4 text-[0.9375rem] ${r.tone}`}>{s}</span>
                {i < r.steps.length - 1 ? (
                  <span aria-hidden="true" className="font-mono text-muted">
                    →
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}

/** Fluxo do app em colunas: cada grupo é uma etapa, com as telas em ordem. */
export function FlowDiagram({ flow }: { flow: DeepCase["flow"] }) {
  return (
    <ol className="grid gap-4 md:grid-cols-3">
      {flow.map((g, gi) => (
        <li key={g.label} className="rounded-xl bg-surface p-5">
          <p className="label">
            {gi + 1}. {g.label}
          </p>
          <ol className="mt-4 flex flex-col gap-2">
            {g.steps.map((s) => (
              <li key={s} className="rounded-lg bg-bg px-4 py-3 text-[0.9375rem]">
                {s}
              </li>
            ))}
          </ol>
        </li>
      ))}
    </ol>
  );
}

const blockShape: Record<DeepCase["wireframes"][number]["blocks"][number], string> = {
  bar: "h-6 rounded bg-[#cfcfcf]",
  field: "h-8 rounded-full border-2 border-dashed border-[#bdbdbd]",
  list: "h-10 rounded bg-[#e2e2e2]",
  card: "h-16 rounded-lg bg-[#e2e2e2]",
  button: "h-9 rounded-full bg-[#9e9e9e]",
  total: "h-12 rounded bg-[#cfcfcf]",
};

/** Wireframes de baixa fidelidade desenhados em código (representação). */
export function Wireframes({ items }: { items: DeepCase["wireframes"] }) {
  return (
    <ul className="grid gap-6 sm:grid-cols-3">
      {items.map((w) => (
        <li key={w.title}>
          <div
            role="img"
            aria-label={`Wireframe da tela ${w.title}: ${w.note}`}
            className="mx-auto flex aspect-[9/17] max-w-[15rem] flex-col gap-2 rounded-[1.75rem] bg-[#f4f4f4] p-4 ring-8 ring-[#d9d9d9]"
          >
            {w.blocks.map((b, i) => (
              <div key={i} className={blockShape[b]} />
            ))}
          </div>
          <p className="mt-4 text-body">{w.title}</p>
          <p className="text-[0.9375rem] text-muted">{w.note}</p>
        </li>
      ))}
    </ul>
  );
}
