"use client";

import Image from "next/image";
import { ViewTransition, useState } from "react";
import { manualPages, type BrandCase, type GalleryImage } from "@/content/brand-cases";
import { isTodo, showTodos } from "@/lib/todo";
import { Lightbox } from "./lightbox";

/**
 * Case de design gráfico (manual de marca), modelo único:
 * capa + resumo → seções (imagem real grande + texto curto) → manual completo.
 * Qualquer página clicada abre o lightbox na posição certa do manual.
 */
function PageButton({ p, big = false, onOpen }: { p: GalleryImage | undefined; big?: boolean; onOpen: () => void }) {
  if (!p) return null;
  return (
    <button type="button" onClick={onOpen} aria-haspopup="dialog" className="zoom-on-hover block w-full overflow-hidden rounded-xl bg-surface">
      <Image
        src={big ? p.src : p.thumb}
        alt={p.alt}
        width={p.width}
        height={p.height}
        loading="eager"
        sizes={big ? "(min-width: 768px) 60vw, 100vw" : "(min-width: 768px) 20vw, 45vw"}
        className="h-auto w-full"
      />
      <span className="sr-only">: ampliar</span>
    </button>
  );
}

export function BrandCaseView({ b }: { b: BrandCase }) {
  const pages = manualPages(b);
  const [open, setOpen] = useState<number | null>(null);
  const indexOf = (n: string) => pages.findIndex((p) => p.src.endsWith(`/${n}.webp`));
  const cover = pages[0];

  const facts: [string, string][] = [
    ["Cliente", b.client],
    ["Entregável", b.deliverable],
    ["Papel", b.role],
    ["Ano", b.year],
  ];

  return (
    <article className="mt-6">
      <header>
        <p className="label">Design gráfico · Construção de marca</p>
        <ViewTransition name={`titulo-${b.slug}`} share="morph" default="none">
          <h1 className="mt-3 max-w-[18ch] font-display text-[clamp(2.5rem,1.5rem+5vw,6.5rem)] font-medium uppercase leading-[0.9] tracking-[-0.04em]">
            {b.name}
          </h1>
        </ViewTransition>
        <p className="mt-6 max-w-[48ch] text-lead">{b.summary}</p>
      </header>

      {cover ? (
        <ViewTransition name={`capa-${b.slug}`} share="morph" default="none">
          <div className="relative mt-10 aspect-video overflow-hidden rounded-xl bg-surface">
            <Image src={cover.src} alt={cover.alt} fill preload sizes="(min-width: 1440px) 1360px, 100vw" className="object-cover" />
          </div>
        </ViewTransition>
      ) : null}

      <dl className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
        {facts
          .filter(([, v]) => showTodos || !isTodo(v))
          .map(([k, v]) => (
            <div key={k}>
              <dt className="label">{k}</dt>
              <dd className="mt-1 text-body">{v}</dd>
            </div>
          ))}
      </dl>

      <nav aria-label="Neste case" className="mt-12">
        <ol className="flex flex-wrap gap-2">
          {[...b.sections.map((s) => [s.id, s.title]), ["manual", "Manual completo"]].map(([id, t]) => (
            <li key={id}>
              <a href={`#${id}`} className="btn-quiet !min-h-10 text-[0.9375rem]">
                {t}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-12">
        {b.sections.map((s) => (
          <section key={s.id} id={s.id} aria-labelledby={`${s.id}-titulo`} className="grid gap-6 border-t border-line py-14 md:grid-cols-12 md:gap-x-6 md:py-20">
            <div className="md:col-span-4">
              <h2 id={`${s.id}-titulo`} data-reveal="title" className="text-lead">
                {s.title}
              </h2>
              <p className="mt-4 max-w-[46ch] text-body">{s.text}</p>
              {s.swatches ? (
                <ul aria-label="Cores" className="mt-6 grid grid-cols-2 gap-2">
                  {s.swatches.map((c) => (
                    <li key={c.hex} className="overflow-hidden rounded-lg border border-line">
                      <span aria-hidden="true" className="block h-10" style={{ background: c.hex }} />
                      <span className="block px-2 py-1.5">
                        <span className="tabular block font-mono text-[0.75rem]">{c.hex}</span>
                        <span className="block text-[0.75rem] leading-snug text-muted">{c.label}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}
              {s.fonts ? (
                <ul aria-label="Fontes" className="mt-6 flex flex-wrap gap-2">
                  {s.fonts.map((f) => (
                    <li key={f} className="chip">
                      {f}
                    </li>
                  ))}
                </ul>
              ) : null}
              {s.id === "desafio" && b.context ? (
                <figure className="mt-6">
                  <Image src={b.context.src} alt={b.context.alt} width={b.context.width} height={b.context.height} sizes="(min-width: 768px) 30vw, 100vw" loading="eager" className="h-auto w-full rounded-xl" />
                  <figcaption className="label mt-2">{b.context.caption}</figcaption>
                </figure>
              ) : null}
            </div>
            <div className="flex flex-col gap-4 md:col-span-8">
              <PageButton p={pages[indexOf(s.pages[0])]} big onOpen={() => setOpen(indexOf(s.pages[0]))} />
              {s.pages.length > 1 ? (
                <div className={`grid gap-3 ${s.pages.length - 1 >= 3 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2"}`}>
                  {s.pages.slice(1).map((n) => (
                    <PageButton key={n} p={pages[indexOf(n)]} onOpen={() => setOpen(indexOf(n))} />
                  ))}
                </div>
              ) : null}
            </div>
          </section>
        ))}

        <section id="manual" aria-labelledby="manual-titulo" className="border-t border-line py-14 md:py-20">
          <h2 id="manual-titulo" data-reveal="title" className="text-lead">
            Manual completo
          </h2>
          <p className="mt-2 text-body text-muted">{pages.length} páginas. Clique para ver em tela cheia e navegar pelas setas.</p>
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {pages.map((p, i) => (
              <li key={p.src}>
                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  aria-haspopup="dialog"
                  className="zoom-on-hover block w-full overflow-hidden rounded-lg bg-surface"
                >
                  <Image src={p.thumb} alt={p.alt} width={p.width} height={p.height} loading="eager" sizes="(min-width: 1024px) 22vw, 45vw" className="h-auto w-full" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {open !== null ? <Lightbox images={pages} start={open} onClose={() => setOpen(null)} label={`Manual de marca: ${b.name}`} /> : null}
    </article>
  );
}
