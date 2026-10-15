"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { homepageBlocks } from "@/content/hora-do-lar";

/**
 * Anatomia da homepage: índice fixo (sticky) dos blocos à esquerda e, à
 * direita, cada bloco na ordem real da página com o que é, por que está ali e
 * o princípio de usabilidade. O índice acompanha a rolagem. No celular vira
 * uma lista sequencial (sem índice).
 */
export function HomepageAnatomy() {
  const [active, setActive] = useState(homepageBlocks[0].id);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const items = Array.from(listRef.current?.querySelectorAll<HTMLElement>("[data-block]") ?? []);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive((visible[0].target as HTMLElement).dataset.block!);
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="grid gap-8 lg:grid-cols-[11rem_1fr]">
      <nav aria-label="Blocos da homepage" className="hidden lg:block">
        <ol className="sticky top-6 flex flex-col gap-1">
          {homepageBlocks.map((b, i) => (
            <li key={b.id}>
              <a
                href={`#anatomia-${b.id}`}
                aria-current={active === b.id ? "true" : undefined}
                className={`flex min-h-11 items-center gap-3 rounded-full px-3 text-[0.9375rem] transition-colors ${
                  active === b.id ? "bg-ink text-bg" : "text-muted hover:text-ink"
                }`}
              >
                <span className="tabular font-mono text-[0.8125rem]">{String(i + 1).padStart(2, "0")}</span>
                {b.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <ol ref={listRef} className="flex flex-col gap-14">
        {homepageBlocks.map((b, i) => (
          <li key={b.id} id={`anatomia-${b.id}`} data-block={b.id} className="scroll-mt-6">
            <article>
              <h3 className="flex items-baseline gap-3 font-display text-[clamp(1.25rem,1.1rem+0.6vw,1.625rem)] font-medium tracking-tight">
                <span className="tabular font-mono text-[0.875rem] text-muted">{String(i + 1).padStart(2, "0")}</span>
                {b.title}
              </h3>
              <div className="relative mt-4 overflow-hidden rounded-xl border border-line bg-surface" style={{ aspectRatio: `${b.image.width} / ${b.image.height}` }}>
                <Image src={b.image.src} alt={b.image.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" loading="eager" className="object-cover object-top" />
              </div>
              <dl className="mt-5 grid gap-4 sm:grid-cols-3">
                <div>
                  <dt className="label">O que é</dt>
                  <dd className="mt-1 text-[0.9375rem] leading-snug">{b.what}</dd>
                </div>
                <div>
                  <dt className="label">Por que está aqui</dt>
                  <dd className="mt-1 text-[0.9375rem] leading-snug">{b.why}</dd>
                </div>
                <div>
                  <dt className="label">Princípio</dt>
                  <dd className="mt-1 text-[0.9375rem] font-medium leading-snug">{b.principle}</dd>
                </div>
              </dl>
            </article>
          </li>
        ))}
      </ol>
    </div>
  );
}
