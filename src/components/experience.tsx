"use client";

import { useId, useState } from "react";
import { profile } from "@/content/profile";

/**
 * Experiência em acordeão: cada linha mostra cargo, empresa e período; ao
 * abrir, a descrição, o resultado e as competências. Botões nativos com
 * aria-expanded; Tab/Enter/Espaço funcionam sem código extra.
 */
export function Experience() {
  const baseId = useId();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="experiencia"
      aria-labelledby="experiencia-titulo"
      className="mx-auto max-w-[90rem] px-4 pt-28 md:px-10 md:pt-40"
    >
      <h2 id="experiencia-titulo" data-reveal="title" className="border-b border-line pb-6 font-display text-head font-medium uppercase tracking-tight">
        Experiência
      </h2>
      <ul>
        {profile.experience.map((e, i) => {
          const isOpen = open === i;
          const panelId = `${baseId}-painel-${i}`;
          const buttonId = `${baseId}-botao-${i}`;
          return (
            <li key={`${e.company}-${e.period}`} data-reveal className="border-b border-line">
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="grid w-full grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 py-6 text-left md:grid-cols-[5fr_4fr_3fr_auto] md:py-7"
                >
                  <span className="text-lead">{e.role}</span>
                  <span aria-hidden="true" className="col-start-2 row-start-1 font-mono text-lead text-muted md:col-start-4">
                    {isOpen ? "−" : "+"}
                  </span>
                  <span className="text-body md:col-start-2 md:row-start-1">{e.company}</span>
                  <span className="label tabular md:col-start-3 md:row-start-1">{e.period}</span>
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className={`accordion-panel ${isOpen ? "is-open" : ""}`}
                inert={!isOpen}
              >
                <div className="min-h-0 overflow-hidden">
                <div className="grid gap-6 pb-8 md:grid-cols-[5fr_7fr] md:gap-x-6">
                <p className="label md:pt-1">{e.place}</p>
                <div>
                  <p className="max-w-[62ch] text-body">{e.description}</p>
                  {e.result ? <p className="mt-4 max-w-[52ch] text-lead">{e.result}</p> : null}
                  {e.links ? (
                    <ul className="mt-4 flex flex-col">
                      {e.links.map((l) => {
                        const ext = l.href.startsWith("http");
                        return (
                          <li key={l.href}>
                            <a
                              href={l.href}
                              {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                              className="text-link inline-flex min-h-11 items-center"
                            >
                              {l.label}
                              {ext ? <span className="sr-only"> (abre em nova aba)</span> : null}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                  <ul aria-label="Competências" className="mt-5 flex flex-wrap gap-2">
                    {e.tags.map((t) => (
                      <li key={t} className="chip">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
                </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <h2 data-reveal="title" className="mt-24 border-b border-line pb-6 font-display text-head font-medium uppercase tracking-tight">
        Formação
      </h2>
      <ul>
        {profile.education.map((c) => (
          <li
            key={`${c.school}-${c.course}`}
            data-reveal
            className="grid gap-x-6 gap-y-1 border-b border-line py-5 md:grid-cols-[2fr_5fr_4fr_1fr]"
          >
            <span className="label">{c.kind}</span>
            <span className="text-body">{c.course}</span>
            <span className="text-body text-muted">{c.school}</span>
            <span className="label tabular md:text-right">{c.period ?? ""}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
